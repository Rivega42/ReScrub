import type { Request, Response } from 'express';
import {
  isValidProvider,
  getOAuthConfig,
  generateOAuthState,
  validateOAuthState,
  extractUserInfo,
  OAUTH_PROVIDERS,
  type OAuthState,
  type SupportedProvider
} from './oauthProviders';
import * as client from 'openid-client';
import { storage } from './storage';
import crypto from 'crypto';

// Extended session interface for OAuth state
interface SessionWithOAuth {
  oauthStates?: { [key: string]: OAuthState };
  userId?: string;
  email?: string;
}

// Helper function to hash tokens for secure storage
async function hashToken(token: string): Promise<string> {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// OAuth Start Handler
export async function handleOAuthStart(req: Request, res: Response) {
  try {
    const provider = req.params.provider;
    
    // Validate provider
    if (!isValidProvider(provider)) {
      return res.status(400).json({
        success: false,
        message: `Неподдерживаемый OAuth провайдер: ${provider}`
      });
    }
    
    // Check if provider is configured
    const config = OAUTH_PROVIDERS[provider];
    if (!config.clientId || !config.clientSecret) {
      return res.status(503).json({
        success: false,
        message: `OAuth провайдер ${provider} временно недоступен`
      });
    }
    
    // Get OAuth configuration
    const oauthConfig = await getOAuthConfig(provider);
    
    // Generate security state
    const redirectTo = req.query.redirect_to as string;
    const oauthState = await generateOAuthState(provider, { 
      redirectTo: redirectTo && redirectTo.startsWith('/') ? redirectTo : undefined,
      usePKCE: config.pkceRequired 
    });
    
    // Store state in session
    const session = req.session as SessionWithOAuth;
    if (!session.oauthStates) {
      session.oauthStates = {};
    }
    session.oauthStates[oauthState.state] = oauthState;
    
    // Build authorization URL
    const authParams: Record<string, string> = {
      scope: config.scope,
      state: oauthState.state,
      ...(config.additionalParams || {})
    };
    
    // Add OIDC parameters if supported
    if (provider !== 'yandex') {
      authParams.nonce = oauthState.nonce;
    }
    
    // Add PKCE parameters if required
    if (oauthState.codeChallenge) {
      authParams.code_challenge = oauthState.codeChallenge;
      authParams.code_challenge_method = 'S256';
    }
    
    let authorizationUrl: string;
    
    if (provider === 'yandex') {
      // Yandex OAuth 2.0 authorization
      const baseUrl = 'https://oauth.yandex.ru/authorize';
      const searchParams = new URLSearchParams({
        response_type: 'code',
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        ...authParams
      });
      authorizationUrl = `${baseUrl}?${searchParams.toString()}`;
    } else {
      // Standard OIDC authorization  
      const authUrl = client.buildAuthorizationUrl(oauthConfig, authParams);
      authorizationUrl = authUrl.href;
    }
    
    // Log OAuth start (without sensitive data)
    console.log(`OAuth start: ${provider} for session ${req.sessionID?.slice(0, 8)}...`);
    
    // Redirect to provider
    res.redirect(authorizationUrl);
    
  } catch (error: any) {
    console.error(`OAuth start error for ${req.params.provider}:`, error);
    res.status(500).json({
      success: false,
      message: 'Ошибка инициализации OAuth авторизации'
    });
  }
}

// OAuth Callback Handler
export async function handleOAuthCallback(req: Request, res: Response) {
  try {
    const provider = req.params.provider;
    const code = req.query.code as string;
    const state = req.query.state as string;
    const error = req.query.error as string;
    
    // Handle OAuth error response
    if (error) {
      console.error(`OAuth error from ${provider}:`, error, req.query.error_description);
      return res.redirect(`/login?error=oauth_${error}`);
    }
    
    // Validate required parameters
    if (!code || !state) {
      return res.redirect('/login?error=oauth_invalid_response');
    }
    
    // Validate provider
    if (!isValidProvider(provider)) {
      return res.redirect('/login?error=oauth_unsupported_provider');
    }
    
    // Retrieve and validate state
    const session = req.session as SessionWithOAuth;
    const storedState = session.oauthStates?.[state];
    if (!storedState || !validateOAuthState(storedState, state)) {
      return res.redirect('/login?error=oauth_invalid_state');
    }
    
    // Clean up used state
    if (session.oauthStates) {
      delete session.oauthStates[state];
    }
    
    // Get OAuth configuration
    const oauthConfig = await getOAuthConfig(provider);
    const config = OAUTH_PROVIDERS[provider];
    
    // Exchange code for tokens
    let tokenSet: any;
    let userInfo: any;
    
    if (provider === 'yandex') {
      // Yandex OAuth 2.0 token exchange
      const tokenResponse = await fetch('https://oauth.yandex.ru/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: config.redirectUri
        })
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Token exchange failed');
      }
      
      const tokenData = await tokenResponse.json();
      
      // Get user info
      const userInfoResponse = await fetch('https://login.yandex.ru/info', {
        headers: {
          'Authorization': `OAuth ${tokenData.access_token}`
        }
      });
      
      if (!userInfoResponse.ok) {
        throw new Error('User info fetch failed');
      }
      
      userInfo = await userInfoResponse.json();
      
      // Hash token for storage
      tokenSet = {
        access_token: await hashToken(tokenData.access_token),
        refresh_token: tokenData.refresh_token ? await hashToken(tokenData.refresh_token) : undefined,
        expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : undefined
      };
    } else {
      // Standard OIDC token exchange using v6.x API
      const currentUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
      
      const grantOptions: any = {};
      
      // Add PKCE verifier if used
      if (storedState.codeVerifier) {
        grantOptions.pkceCodeVerifier = storedState.codeVerifier;
      }
      
      // Add expected state
      if (storedState.state) {
        grantOptions.expectedState = storedState.state;
      }
      
      tokenSet = await client.authorizationCodeGrant(oauthConfig, currentUrl, grantOptions);
      
      // Get user info  
      userInfo = await client.fetchUserInfo(oauthConfig, tokenSet.access_token!, 'unknown');
      
      // Hash tokens for storage
      tokenSet.access_token = await hashToken(tokenSet.access_token!);
      if (tokenSet.refresh_token) {
        tokenSet.refresh_token = await hashToken(tokenSet.refresh_token);
      }
    }
    
    // Extract user information
    const { providerUserId, email, profile } = extractUserInfo(provider, userInfo);
    
    // Check if OAuth account already exists
    let oauthAccount = await storage.getOAuthAccountByProviderAndId(provider, providerUserId);
    
    if (oauthAccount) {
      // Existing OAuth account - update tokens and sign in
      await storage.updateOAuthTokens(oauthAccount.id, {
        accessTokenHash: tokenSet.access_token,
        refreshTokenHash: tokenSet.refresh_token,
        expiresAt: tokenSet.expires_at
      });
      
      // Sign in user
      session.userId = oauthAccount.userId;
      
      const userAccount = await storage.getUserAccountById(oauthAccount.userId);
      if (userAccount) {
        session.email = userAccount.email;
        await storage.updateUserAccount(userAccount.id, { lastLoginAt: new Date() });
      }
      
      console.log(`OAuth sign-in: ${provider} user ${providerUserId} (${oauthAccount.userId})`);
    } else {
      // New OAuth account
      if (session.userId) {
        // User is logged in - link OAuth account
        oauthAccount = await storage.linkOAuthAccount(session.userId, {
          userId: session.userId,
          provider,
          providerUserId,
          email,
          profile,
          scope: config.scope,
          accessTokenHash: tokenSet.access_token,
          refreshTokenHash: tokenSet.refresh_token,
          expiresAt: tokenSet.expires_at,
          emailVerified: !!email
        });
        
        console.log(`OAuth linked: ${provider} account ${providerUserId} to user ${session.userId}`);
      } else {
        // No existing session - create new account or link to existing email
        let userAccount: any;
        
        if (email) {
          // Try to find existing user by email
          userAccount = await storage.getUserAccountByEmail(email);
        }
        
        if (!userAccount && email) {
          // Create new user account
          userAccount = await storage.createUserAccount({
            email,
            password: crypto.randomBytes(32).toString('hex') // Random password, user can reset if needed
          });
          
          // Mark email as verified if provider verified it
          if (profile.originalResponse?.email_verified !== false) {
            await storage.updateUserAccount(userAccount.id, { emailVerified: true });
          }
          
          // Create basic profile
          await storage.createUserProfile({
            userId: userAccount.id,
            firstName: profile.firstName || null,
            lastName: profile.lastName || null
          });
          
          console.log(`OAuth signup: ${provider} created new user ${userAccount.id} (${email})`);
        } else if (!userAccount) {
          return res.redirect('/login?error=oauth_no_email');
        }
        
        // Link OAuth account
        oauthAccount = await storage.linkOAuthAccount(userAccount.id, {
          userId: userAccount.id,
          provider,
          providerUserId,
          email,
          profile,
          scope: config.scope,
          accessTokenHash: tokenSet.access_token,
          refreshTokenHash: tokenSet.refresh_token,
          expiresAt: tokenSet.expires_at,
          emailVerified: !!email
        });
        
        // Sign in user
        session.userId = userAccount.id;
        session.email = userAccount.email;
        await storage.updateUserAccount(userAccount.id, { lastLoginAt: new Date() });
        
        console.log(`OAuth sign-in: ${provider} new user ${userAccount.id} (${email})`);
      }
    }
    
    // Redirect to requested page or dashboard
    const redirectTo = storedState.redirectTo || '/';
    res.redirect(redirectTo);
    
  } catch (error: any) {
    console.error(`OAuth callback error for ${req.params.provider}:`, error);
    res.redirect('/login?error=oauth_callback_failed');
  }
}
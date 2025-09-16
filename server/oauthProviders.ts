import * as client from 'openid-client';

// OAuth Provider Configuration Interface
export interface OAuthProviderConfig {
  name: string;
  displayName: string;
  issuerUrl: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  redirectUri: string;
  additionalParams?: Record<string, string>;
  pkceRequired?: boolean;
  userInfoMapping: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

// Supported OAuth Providers
export const SUPPORTED_PROVIDERS = ['vk', 'yandex', 'sberbank', 'tbank', 'esia'] as const;
export type SupportedProvider = typeof SUPPORTED_PROVIDERS[number];

// OAuth Provider Configurations
export const OAUTH_PROVIDERS: Record<SupportedProvider, OAuthProviderConfig> = {
  vk: {
    name: 'vk',
    displayName: 'VK ID',
    issuerUrl: 'https://id.vk.com',
    clientId: process.env.VK_CLIENT_ID || '',
    clientSecret: process.env.VK_CLIENT_SECRET || '',
    scope: 'openid email profile',
    redirectUri: `${process.env.APP_URL || 'http://localhost:5000'}/api/oauth/vk/callback`,
    pkceRequired: true,
    userInfoMapping: {
      id: 'sub',
      email: 'email',
      firstName: 'given_name',
      lastName: 'family_name',
      phone: 'phone_number'
    }
  },
  
  yandex: {
    name: 'yandex',
    displayName: 'Yandex ID',
    issuerUrl: 'https://oauth.yandex.ru',
    clientId: process.env.YANDEX_CLIENT_ID || '',
    clientSecret: process.env.YANDEX_CLIENT_SECRET || '',
    scope: 'login:email login:info',
    redirectUri: `${process.env.APP_URL || 'http://localhost:5000'}/api/oauth/yandex/callback`,
    pkceRequired: false,
    userInfoMapping: {
      id: 'id',
      email: 'default_email',
      firstName: 'first_name',
      lastName: 'last_name',
      phone: 'default_phone'
    }
  },
  
  // Future providers - placeholder configurations
  sberbank: {
    name: 'sberbank',
    displayName: 'Сбербанк ID',
    issuerUrl: 'https://oidc.sberbank.ru',
    clientId: process.env.SBERBANK_CLIENT_ID || '',
    clientSecret: process.env.SBERBANK_CLIENT_SECRET || '',
    scope: 'openid profile email phone',
    redirectUri: `${process.env.APP_URL || 'http://localhost:5000'}/api/oauth/sberbank/callback`,
    pkceRequired: true,
    userInfoMapping: {
      id: 'sub',
      email: 'email',
      firstName: 'given_name',
      lastName: 'family_name',
      phone: 'phone_number'
    }
  },
  
  tbank: {
    name: 'tbank',
    displayName: 'T-Банк ID',
    issuerUrl: 'https://id.tinkoff.ru',
    clientId: process.env.TBANK_CLIENT_ID || '',
    clientSecret: process.env.TBANK_CLIENT_SECRET || '',
    scope: 'openid profile email',
    redirectUri: `${process.env.APP_URL || 'http://localhost:5000'}/api/oauth/tbank/callback`,
    pkceRequired: true,
    userInfoMapping: {
      id: 'sub',
      email: 'email',
      firstName: 'given_name',
      lastName: 'family_name'
    }
  },
  
  esia: {
    name: 'esia',
    displayName: 'Госуслуги (ESIA)',
    issuerUrl: 'https://esia.gosuslugi.ru',
    clientId: process.env.ESIA_CLIENT_ID || '',
    clientSecret: process.env.ESIA_CLIENT_SECRET || '',
    scope: 'openid fullname email mobile',
    redirectUri: `${process.env.APP_URL || 'http://localhost:5000'}/api/oauth/esia/callback`,
    pkceRequired: true,
    userInfoMapping: {
      id: 'urn:esia:sbj_id',
      email: 'email',
      firstName: 'urn:esia:sbj:first_name',
      lastName: 'urn:esia:sbj:last_name',
      phone: 'mobile'
    }
  }
};

// OAuth Configuration Cache
const configCache = new Map<string, any>();

// Get OAuth Configuration for Provider
export async function getOAuthConfig(provider: SupportedProvider): Promise<any> {
  const config = OAUTH_PROVIDERS[provider];
  
  if (!config.clientId || !config.clientSecret) {
    throw new Error(`OAuth credentials not configured for provider: ${provider}`);
  }
  
  // Check cache first
  if (configCache.has(provider)) {
    return configCache.get(provider)!;
  }
  
  try {
    let oauthConfig: any;
    
    // Special handling for different provider types
    if (provider === 'yandex') {
      // Yandex uses OAuth 2.0, not full OIDC - manual configuration
      oauthConfig = {
        issuer: config.issuerUrl,
        authorization_endpoint: 'https://oauth.yandex.ru/authorize',
        token_endpoint: 'https://oauth.yandex.ru/token',
        userinfo_endpoint: 'https://login.yandex.ru/info',
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: config.redirectUri
      };
    } else {
      // Full OIDC discovery for other providers
      const server = new URL(config.issuerUrl);
      oauthConfig = await client.discovery(server, config.clientId, config.clientSecret);
      oauthConfig.redirectUri = config.redirectUri;
    }
    
    // Cache the configuration
    configCache.set(provider, oauthConfig);
    return oauthConfig;
  } catch (error) {
    console.error(`Failed to setup OAuth configuration for ${provider}:`, error);
    throw new Error(`OAuth provider ${provider} is not available`);
  }
}

// Generate OAuth State with Security Parameters
export interface OAuthState {
  provider: SupportedProvider;
  state: string;
  nonce: string;
  codeVerifier?: string;
  codeChallenge?: string;
  redirectTo?: string;
  timestamp: number;
}

export async function generateOAuthState(
  provider: SupportedProvider, 
  options: { redirectTo?: string; usePKCE?: boolean } = {}
): Promise<OAuthState> {
  const state = client.randomState();
  const nonce = client.randomNonce();
  const timestamp = Date.now();
  
  const oauthState: OAuthState = {
    provider,
    state,
    nonce,
    redirectTo: options.redirectTo,
    timestamp
  };
  
  // Add PKCE if required or requested
  if (options.usePKCE || OAUTH_PROVIDERS[provider].pkceRequired) {
    const codeVerifier = client.randomPKCECodeVerifier();
    oauthState.codeVerifier = codeVerifier;
    oauthState.codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
  }
  
  return oauthState;
}

// Validate OAuth State
export function validateOAuthState(
  storedState: OAuthState, 
  receivedState: string,
  maxAge = 10 * 60 * 1000 // 10 minutes
): boolean {
  // Check state parameter
  if (storedState.state !== receivedState) {
    return false;
  }
  
  // Check timestamp (prevent replay attacks)
  const now = Date.now();
  if (now - storedState.timestamp > maxAge) {
    return false;
  }
  
  return true;
}

// Extract User Info from OAuth Response
export function extractUserInfo(provider: SupportedProvider, userInfo: any): {
  providerUserId: string;
  email?: string;
  profile: Record<string, any>;
} {
  const mapping = OAUTH_PROVIDERS[provider].userInfoMapping;
  
  const providerUserId = userInfo[mapping.id];
  if (!providerUserId) {
    throw new Error(`No user ID found in ${provider} response`);
  }
  
  const profile: Record<string, any> = {};
  
  // Map standard fields
  if (mapping.email && userInfo[mapping.email]) {
    profile.email = userInfo[mapping.email];
  }
  
  if (mapping.firstName && userInfo[mapping.firstName]) {
    profile.firstName = userInfo[mapping.firstName];
  }
  
  if (mapping.lastName && userInfo[mapping.lastName]) {
    profile.lastName = userInfo[mapping.lastName];
  }
  
  if (mapping.phone && userInfo[mapping.phone]) {
    profile.phone = userInfo[mapping.phone];
  }
  
  // Store original response for future reference
  profile.originalResponse = userInfo;
  
  return {
    providerUserId: String(providerUserId),
    email: profile.email,
    profile
  };
}

// Validate Provider Parameter
export function isValidProvider(provider: string): provider is SupportedProvider {
  return SUPPORTED_PROVIDERS.includes(provider as SupportedProvider);
}
import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { referralCodes } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertSupportTicketSchema, 
  insertUserAccountSchema, 
  insertUserProfileSchema,
  insertDataBrokerSchema,
  insertDeletionRequestSchema,
  insertDocumentSchema,
  insertSubscriptionSchema,
  insertPaymentSchema,
  type UserAccount,
  type DataBroker,
  type DeletionRequest,
  type Document,
  type SubscriptionPlan,
  type Subscription,
  type Payment
} from "@shared/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { handleOAuthStart, handleOAuthCallback } from "./oauthHandler";
import { verifyWebhookSignature, processWebhookEvents, type WebhookEvent, sendEmail, createEmailVerificationTemplate } from "./email";
import { robokassaClient } from "./robokassa";
import { SchedulerInstance } from "./scheduler-instance";
import fs from 'fs';
import path from 'path';

// Extend Express session types
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    email?: string;
    oauthStates?: { [key: string]: any };
  }
}

// Email auth session middleware
function isEmailAuthenticated(req: any, res: any, next: any) {
  if (req.session?.userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Admin authentication middleware
async function isAdmin(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  
  try {
    const userAccount = await storage.getUserAccountById(req.session.userId);
    if (!userAccount || !userAccount.isAdmin) {
      return res.status(403).json({ success: false, message: "Доступ запрещен. Требуются права администратора." });
    }
    
    req.adminUser = userAccount;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup
  await setupAuth(app);

  // Seed demo account for all environments
  try {
    await storage.seedDemoAccount();
    await storage.seedAchievements();
    
    // Ensure TEST123 referral code exists for demo/testing
    try {
      const demoAccount = await storage.getUserAccountByEmail('demo@rescrub.ru');
      if (demoAccount) {
        const existingCode = await storage.getReferralCodeByCode('TEST123');
        if (!existingCode) {
          // Create test referral code with fixed TEST123 code
          const referralCode = {
            id: `ref_code_${Date.now()}`,
            userId: demoAccount.id,
            code: 'TEST123',
            isActive: true,
            maxUses: 100,
            currentUses: 0,
            createdAt: new Date()
          };
          
          // Save to storage - add via internal method that handles both implementations
          if ((storage as any).referralCodesData) {
            (storage as any).referralCodesData.push(referralCode);
          } else {
            // Database mode: create referral code in PostgreSQL
            console.log('Database mode: creating TEST123 code in PostgreSQL');
            // Create referral code directly in database since we need specific TEST123 code
            await db.insert(referralCodes).values({
              userId: demoAccount.id,
              code: 'TEST123',
              isActive: true,
              maxUses: 100,
              currentUses: 0
            });
          }
          console.log('✅ Created demo referral code TEST123 for testing');
        }
      }
    } catch (refError: any) {
      console.log('Note: Could not create test referral code:', refError.message);
    }
  } catch (error) {
    console.error('Failed to seed demo account:', error);
  }

  // Server-side rendering for invite pages with proper SEO
  app.get('/invite/:code', async (req, res) => {
    try {
      const { code } = req.params;
      
      // Get referral info
      const referralCode = await storage.getReferralCodeByCode(code);
      let referrerName = "Защитник данных";
      
      if (referralCode && referralCode.isActive) {
        const referrerProfile = await storage.getUserProfile(referralCode.userId);
        if (referrerProfile?.firstName) {
          referrerName = `${referrerProfile.firstName} ${referrerProfile.lastName || ''}`.trim();
        }
      }
      
      // Escape function for safe HTML attribute injection  
      const escapeHtml = (str: string) => str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      // Prepare SEO data with escaped values
      const safeReferrerName = escapeHtml(referrerName);
      const title = `${safeReferrerName} приглашает вас защитить данные со скидкой 30% | ReScruB`;
      const description = `${safeReferrerName} уже защитил свои данные и получил приватность! Присоединяйтесь и получите 30% скидку на защиту ваших персональных данных. Автоматическое удаление с 200+ сайтов брокеров данных.`;
      const ogImage = `${req.protocol}://${req.get('host')}/api/og/invite/${encodeURIComponent(code)}`;
      const url = `${req.protocol}://${req.get('host')}/invite/${encodeURIComponent(code)}`;
      
      // In development mode, always redirect to client-side app
      if (process.env.NODE_ENV === 'development') {
        return res.redirect(`/?invite=${code}`);
      }
      
      // Read the main HTML file and inject meta tags (production only)
      let html = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf8');
      
      // Inject meta tags
      const metaTags = `
        <title>${title}</title>
        <meta name="description" content="${description}">
        <meta name="keywords" content="защита данных, приватность, персональные данные, брокеры данных, скидка, реферальная программа">
        
        <!-- Open Graph tags -->
        <meta property="og:title" content="${safeReferrerName} приглашает защитить данные! Скидка 30% + бонус 50%">
        <meta property="og:description" content="Я уже защитил свои данные и получил приватность! Присоединяйся - получи 30% скидку, а я получу 50% бонус за приглашение. Автоматическое удаление с 200+ сайтов брокеров данных.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="${url}">
        <meta property="og:image" content="${ogImage}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="Защити свои данные со скидкой 30% + бонус 50% - ReScruB">
        <meta property="og:site_name" content="ReScruB - Защита персональных данных">
        <meta property="og:locale" content="ru_RU">
        
        <!-- Twitter Card tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${safeReferrerName} приглашает защитить данные! Скидка 30% + бонус 50%">
        <meta name="twitter:description" content="Я уже защитил свои данные! Присоединяйся - получи 30% скидку, а я получу 50% бонус за приглашение.">
        <meta name="twitter:image" content="${ogImage}">
        <meta name="twitter:image:alt" content="Защити свои данные со скидкой 30% + бонус 50%">
        
        <!-- Additional meta tags -->
        <meta name="theme-color" content="#2563eb">
        <meta name="apple-mobile-web-app-title" content="ReScruB">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="format-detection" content="telephone=no">
      `;
      
      // Insert meta tags before closing </head>
      html = html.replace('</head>', `${metaTags}\n</head>`);
      
      res.send(html);
    } catch (error) {
      console.error('Error serving invite page:', error);
      // Fallback to regular client-side routing
      res.redirect(`/?invite=${req.params.code}`);
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Protected route example
  app.get("/api/protected", isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    res.json({ message: "This is a protected route", userId });
  });

  // ========================================
  // EMAIL-BASED AUTHENTICATION ROUTES
  // ========================================
  
  // Register new user account
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = insertUserAccountSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserAccountByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: "Пользователь с таким email уже существует" 
        });
      }
      
      // Create user account
      const userAccount = await storage.createUserAccount(validatedData);
      
      // Generate secure email verification token
      const plainToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = await bcrypt.hash(plainToken, 12);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await storage.updateUserAccount(userAccount.id, {
        emailVerificationToken: hashedToken,
        emailVerificationExpires: expiresAt
      });
      
      // Create basic user profile
      await storage.createUserProfile({
        userId: userAccount.id,
        firstName: null,
        lastName: null,
      });
      
      // Send verification email using Mailganer SMTP
      const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email?token=${plainToken}&email=${encodeURIComponent(userAccount.email)}`;
      
      try {
        const emailTemplate = createEmailVerificationTemplate();
        await sendEmail({
          to: userAccount.email,
          template: emailTemplate,
          data: {
            senderName: 'ResCrub',
            senderEmail: `noreply@mailone.rescrub.ru`,
            recipientName: userAccount.email.split('@')[0], // Use email username as name
            verificationUrl: verificationUrl
          },
          userId: userAccount.id,
          category: 'email_verification'
        });
        
        console.log(`✅ Verification email sent to: ${userAccount.email}`);
      } catch (emailError: any) {
        console.error('❌ Failed to send verification email:', emailError.message);
        // Don't fail registration if email fails - user can request resend later
      }
      
      const response: any = { 
        success: true, 
        message: "Аккаунт создан. Проверьте email для подтверждения.",
        userId: userAccount.id
      };
      
      // SECURITY: Only include verification URL in development environment
      if (process.env.NODE_ENV !== 'production') {
        response.verificationUrl = verificationUrl;
      }
      
      res.status(201).json(response);
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error?.name === 'ZodError') {
        return res.status(400).json({ 
          success: false, 
          message: "Некорректные данные", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: "Ошибка создания аккаунта" 
      });
    }
  });
  
  // Login validation schema
  const loginSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(1, 'Пароль обязателен')
  });
  
  // Login user
  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Verify credentials
      const userAccount = await storage.verifyPassword(validatedData.email, validatedData.password);
      if (!userAccount) {
        return res.status(401).json({ 
          success: false, 
          message: "Неверный email или пароль" 
        });
      }
      
      // Check if email is verified
      if (!userAccount.emailVerified) {
        return res.status(403).json({ 
          success: false, 
          message: "Подтвердите email для входа",
          needsVerification: true
        });
      }
      
      // Create session
      req.session.userId = userAccount.id;
      req.session.email = userAccount.email;
      
      // Force session save to ensure data is persisted
      req.session.save((err) => {
        if (err) {
          console.error('❌ Session save error:', err);
          return res.status(500).json({ 
            success: false, 
            message: "Ошибка сохранения сессии" 
          });
        }
        
        console.log('✅ Login successful - Session created and saved:', {
          sessionId: req.session.id,
          userId: req.session.userId,
          email: req.session.email,
          isAdmin: userAccount.isAdmin,
          adminRole: userAccount.adminRole
        });
        
        res.json({ 
          success: true, 
          message: "Вход выполнен успешно",
          user: {
            id: userAccount.id,
            email: userAccount.email,
            emailVerified: userAccount.emailVerified,
            isAdmin: userAccount.isAdmin
          }
        });
      });
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error?.name === 'ZodError') {
        return res.status(400).json({ 
          success: false, 
          message: "Некорректные данные", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: "Ошибка входа" 
      });
    }
  });
  
  // Email verification validation schema
  const verifyEmailSchema = z.object({
    token: z.string().min(1, 'Токен подтверждения обязателен'),
    email: z.string().email('Некорректный email')
  });
  
  // Verify email with token
  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const validatedData = verifyEmailSchema.parse(req.body);
      
      // Find user by email
      const userAccount = await storage.getUserAccountByEmail(validatedData.email);
      
      if (!userAccount || !userAccount.emailVerificationToken) {
        return res.status(400).json({ 
          success: false, 
          message: "Неверный токен подтверждения" 
        });
      }
      
      // Check if token is expired
      if (userAccount.emailVerificationExpires && userAccount.emailVerificationExpires < new Date()) {
        return res.status(400).json({ 
          success: false, 
          message: "Токен подтверждения истек. Запросите новый токен" 
        });
      }
      
      // Verify hashed token
      const isValidToken = await bcrypt.compare(validatedData.token, userAccount.emailVerificationToken);
      if (!isValidToken) {
        return res.status(400).json({ 
          success: false, 
          message: "Неверный токен подтверждения" 
        });
      }
      
      // Mark email as verified and clear token
      await storage.updateUserAccount(userAccount.id, {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      });
      
      res.json({ 
        success: true, 
        message: "Email подтвержден успешно" 
      });
    } catch (error: any) {
      console.error("Email verification error:", error);
      
      if (error?.name === 'ZodError') {
        return res.status(400).json({ 
          success: false, 
          message: "Некорректные данные", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: "Ошибка подтверждения email" 
      });
    }
  });
  
  // Get current user (email auth)
  app.get('/api/auth/me', async (req: any, res) => {
    try {
      // Debug session data
      console.log('🔍 /api/auth/me - Session debug:', {
        hasSession: !!req.session,
        sessionId: req.session?.id,
        userId: req.session?.userId,
        email: req.session?.email,
        cookie: req.session?.cookie
      });
      
      // Check if user has an active session
      if (!req.session || !req.session.userId) {
        console.log('❌ /api/auth/me - No session or userId');
        return res.status(401).json({ 
          success: false, 
          message: "Unauthorized" 
        });
      }

      const userAccount = await storage.getUserAccountById(req.session.userId);
      const userProfile = await storage.getUserProfile(req.session.userId);
      
      if (!userAccount) {
        return res.status(401).json({ 
          success: false, 
          message: "Unauthorized" 
        });
      }
      
      res.json({ 
        success: true,
        user: {
          id: userAccount.id,
          email: userAccount.email,
          emailVerified: userAccount.emailVerified,
          isAdmin: userAccount.isAdmin,
          adminRole: userAccount.adminRole,
          profile: userProfile
        }
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error" 
      });
    }
  });
  
  // Logout
  app.post('/api/auth/logout', isEmailAuthenticated, async (req: any, res) => {
    try {
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ 
            success: false, 
            message: "Ошибка выхода" 
          });
        }
        
        res.clearCookie('rescrub.sid'); // Custom session cookie name from replitAuth
        res.json({ 
          success: true, 
          message: "Выход выполнен успешно" 
        });
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Ошибка выхода" 
      });
    }
  });
  
  // Update user profile
  app.put('/api/profile', isEmailAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId!;
      
      // Create schema for profile updates (make all fields optional for partial updates)
      const updateProfileSchema = insertUserProfileSchema.omit({ userId: true }).partial();
      const validatedData = updateProfileSchema.parse(req.body);
      
      // Update profile in database  
      const updatedProfile = await storage.updateUserProfile(userId, validatedData);
      
      if (!updatedProfile) {
        return res.status(404).json({ 
          success: false, 
          message: "Профиль не найден" 
        });
      }
      
      res.json({ 
        success: true, 
        message: "Профиль успешно обновлен",
        profile: updatedProfile
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      
      if (error?.name === 'ZodError') {
        return res.status(400).json({ 
          success: false, 
          message: "Некорректные данные профиля", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: "Ошибка обновления профиля" 
      });
    }
  });

  // Get notification preferences
  app.get('/api/profile/notification-preferences', isEmailAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId!;
      const userProfile = await storage.getUserProfile(userId);
      
      if (!userProfile) {
        return res.status(404).json({ 
          success: false, 
          message: "Профиль не найден" 
        });
      }
      
      // Return notification preferences with defaults if not set
      const preferences = userProfile.notificationPreferences || {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        inAppEnabled: true,
        categories: {
          scan_completed: true,
          deletion_request: true,
          verification: true,
          system: true,
        }
      };
      
      res.json({ 
        success: true,
        preferences 
      });
    } catch (error: any) {
      console.error("Get notification preferences error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Ошибка получения настроек уведомлений" 
      });
    }
  });

  // Update notification preferences
  app.put('/api/profile/notification-preferences', isEmailAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId!;
      
      // Validate notification preferences structure
      const preferencesSchema = z.object({
        emailEnabled: z.boolean().optional(),
        smsEnabled: z.boolean().optional(),
        pushEnabled: z.boolean().optional(),
        inAppEnabled: z.boolean().optional(),
        categories: z.object({
          scan_completed: z.boolean().optional(),
          deletion_request: z.boolean().optional(),
          verification: z.boolean().optional(),
          system: z.boolean().optional(),
        }).optional(),
      });
      
      const validatedPreferences = preferencesSchema.parse(req.body);
      
      // Update notification preferences in user profile
      const updatedProfile = await storage.updateUserProfile(userId, {
        notificationPreferences: validatedPreferences
      });
      
      if (!updatedProfile) {
        return res.status(404).json({ 
          success: false, 
          message: "Профиль не найден" 
        });
      }
      
      res.json({ 
        success: true, 
        message: "Настройки уведомлений успешно обновлены",
        preferences: updatedProfile.notificationPreferences
      });
    } catch (error: any) {
      console.error("Update notification preferences error:", error);
      
      if (error?.name === 'ZodError') {
        return res.status(400).json({ 
          success: false, 
          message: "Некорректные данные настроек", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: "Ошибка обновления настроек уведомлений" 
      });
    }
  });
  
  // ========================================
  // OAUTH AUTHENTICATION ROUTES
  // ========================================
  
  // OAuth Start Endpoint
  app.get('/api/oauth/:provider/start', handleOAuthStart);
  
  // OAuth Callback Endpoint
  app.get('/api/oauth/:provider/callback', handleOAuthCallback);
  
  // ========================================
  // EXISTING ROUTES
  // ========================================
  
  // Support ticket submission
  app.post("/api/support", async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validatedData = insertSupportTicketSchema.parse(req.body);
      
      // Create support ticket in database
      const ticket = await storage.createSupportTicket(validatedData);
      
      res.status(201).json({ 
        success: true, 
        ticketId: ticket.id,
        message: "Обращение успешно отправлено. Мы ответим в ближайшее время." 
      });
    } catch (error: any) {
      console.error("Error creating support ticket:", error);
      
      // Handle validation errors
      if (error?.name === 'ZodError') {
        return res.status(400).json({ 
          success: false, 
          message: "Некорректные данные формы", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: "Не удалось отправить обращение. Попробуйте еще раз или напишите на support@rescrub.ru" 
      });
    }
  });

  // ========================================
  // TECHNICAL SEO ROUTES
  // ========================================

  // Robots.txt endpoint for search engine crawling instructions
  app.get('/robots.txt', (req, res) => {
    try {
      const baseUrl = req.protocol + '://' + req.get('host');
      
      const robotsContent = `# ResCrub - Russian Data Protection Platform
# Robots.txt for SEO compliance and crawling guidance

User-agent: *

# Allow public pages
Allow: /
Allow: /about
Allow: /blog
Allow: /contacts
Allow: /support
Allow: /data-brokers
Allow: /whitepaper
Allow: /system-status
Allow: /faq
Allow: /privacy
Allow: /terms
Allow: /status

# Allow static assets
Allow: /assets/
Allow: /images/
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.webp$
Allow: /*.svg$
Allow: /*.ico$

# Disallow protected application routes
Disallow: /app/
Disallow: /login
Disallow: /register
Disallow: /verify-email

# Disallow API endpoints and sensitive paths
Disallow: /api/
Disallow: /_vite/
Disallow: /node_modules/
Disallow: /.git/

# Russian search engines support
# Yandex-specific directives
User-agent: YandexBot
Crawl-delay: 1

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Host directive for primary domain (helps with canonicalization)
Host: ${baseUrl.replace(/^https?:\/\//, '')}`;

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      res.send(robotsContent);
    } catch (error) {
      console.error('Error generating robots.txt:', error);
      res.status(500).send('# Error generating robots.txt');
    }
  });

  // Dynamic sitemap.xml generation for search engines
  app.get('/sitemap.xml', (req, res) => {
    try {
      const baseUrl = req.protocol + '://' + req.get('host');
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Define public pages with SEO metadata
      const publicPages = [
        { 
          url: '/', 
          priority: '1.0', 
          changefreq: 'daily',
          lastmod: currentDate 
        },
        { 
          url: '/about', 
          priority: '0.8', 
          changefreq: 'monthly',
          lastmod: currentDate 
        },
        { 
          url: '/blog', 
          priority: '0.9', 
          changefreq: 'weekly',
          lastmod: currentDate 
        },
        { 
          url: '/data-brokers', 
          priority: '0.8', 
          changefreq: 'weekly',
          lastmod: currentDate 
        },
        { 
          url: '/contacts', 
          priority: '0.7', 
          changefreq: 'monthly',
          lastmod: currentDate 
        },
        { 
          url: '/support', 
          priority: '0.7', 
          changefreq: 'monthly',
          lastmod: currentDate 
        },
        { 
          url: '/whitepaper', 
          priority: '0.8', 
          changefreq: 'monthly',
          lastmod: currentDate 
        },
        { 
          url: '/faq', 
          priority: '0.7', 
          changefreq: 'monthly',
          lastmod: currentDate 
        },
        { 
          url: '/privacy', 
          priority: '0.6', 
          changefreq: 'monthly',
          lastmod: currentDate 
        },
        { 
          url: '/terms', 
          priority: '0.6', 
          changefreq: 'monthly',
          lastmod: currentDate 
        },
        { 
          url: '/status', 
          priority: '0.5', 
          changefreq: 'daily',
          lastmod: currentDate 
        }
      ];

      // Define all 23 blog articles for sitemap generation
      const blogArticles = [
        { slug: 'russian-social-media-privacy-ranking-2025', publishedAt: '2025-01-20T10:00:00.000Z' },
        { slug: '152-fz-compliance-rating-russian-companies', publishedAt: '2025-01-18T14:30:00.000Z' },
        { slug: 'data-breaches-russia-2024-2025-damage-analysis', publishedAt: '2025-01-16T11:45:00.000Z' },
        { slug: 'complete-152-fz-guide-citizen-rights-company-obligations', publishedAt: '2025-01-14T08:15:00.000Z' },
        { slug: 'roskomnadzor-complaint-152-fz-step-by-step-guide', publishedAt: '2025-01-12T16:20:00.000Z' },
        { slug: 'gdpr-vs-152-fz-complete-data-protection-comparison', publishedAt: '2025-01-10T13:45:00.000Z' },
        { slug: 'vk-privacy-protection-security-settings-2025', publishedAt: '2025-01-19T09:30:00.000Z' },
        { slug: 'telegram-privacy-complete-settings-guide-2025', publishedAt: '2025-01-17T15:20:00.000Z' },
        { slug: 'gdpr-vs-152-fz-comparison', publishedAt: '2025-01-08T14:30:00.000Z' },
        { slug: 'automatic-data-deletion-features', publishedAt: '2024-12-28T10:15:00.000Z' },
        { slug: 'setup-152-fz-compliance-monitoring', publishedAt: '2024-12-20T16:45:00.000Z' },
        { slug: 'fines-152-fz-violations-2025-stats', publishedAt: '2024-12-15T11:20:00.000Z' },
        { slug: 'crm-integration-customer-data-protection', publishedAt: '2024-12-05T13:10:00.000Z' },
        { slug: 'right-to-be-forgotten-digital-age', publishedAt: '2024-11-28T09:30:00.000Z' },
        { slug: 'api-security-personal-data-protection', publishedAt: '2024-11-22T15:25:00.000Z' },
        { slug: 'how-to-delete-personal-data-avito-step-by-step', publishedAt: '2025-01-15T09:00:00.000Z' },
        { slug: 'delete-vk-profile-complete-data-protection-guide', publishedAt: '2025-01-12T14:20:00.000Z' },
        { slug: 'remove-info-from-yandex-directory-2gis', publishedAt: '2025-01-10T11:45:00.000Z' },
        { slug: 'gosuslugi-data-deletion-citizen-rights-procedures', publishedAt: '2025-01-08T16:10:00.000Z' },
        { slug: 'sberbank-fraud-recognition-protection-2025', publishedAt: '2025-01-14T08:30:00.000Z' },
        { slug: 'phone-scammers-bank-cards-new-schemes-2025', publishedAt: '2025-01-11T15:40:00.000Z' },
        { slug: 'phishing-russian-internet-avoid-victim-2025', publishedAt: '2025-01-09T12:15:00.000Z' },
        { slug: 'data-protection-cis-kazakhstan-belarus-uzbekistan-laws', publishedAt: '2025-01-13T10:20:00.000Z' },
        { slug: 'gdpr-uae-mena-countries-expat-guide-2025', publishedAt: '2025-01-07T14:55:00.000Z' },
        { slug: 'digital-rights-central-asia-2025-overview', publishedAt: '2025-01-05T09:30:00.000Z' },
        { slug: 'telegram-privacy-complete-security-settings-guide-2025', publishedAt: '2025-01-16T11:25:00.000Z' },
        { slug: 'odnoklassniki-privacy-settings-step-by-step-guide', publishedAt: '2025-01-04T16:20:00.000Z' },
        { slug: 'tiktok-data-protection-russian-users', publishedAt: '2025-01-02T13:45:00.000Z' },
        { slug: 'russian-internet-banking-security-rating-2025', publishedAt: '2025-01-17T08:15:00.000Z' },
        { slug: 'ai-implementation-russian-companies-personal-data-risks', publishedAt: '2025-01-03T12:00:00.000Z' }
      ];

      // Generate blog article URLs for sitemap
      const blogPages = blogArticles.map(article => ({
        url: `/blog/${article.slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: new Date(article.publishedAt).toISOString().split('T')[0]
      }));

      // Combine all pages
      const allPages = [...publicPages, ...blogPages];

      // Generate XML sitemap content
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <!-- Russian language targeting for international SEO -->
    <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}${page.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.url}" />
  </url>`).join('\n')}
</urlset>`;

      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(sitemapXml);
    } catch (error) {
      console.error('Error generating sitemap.xml:', error);
      res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap</error>');
    }
  });

  // ========================================
  // MAILGANER.RU WEBHOOK ROUTES
  // ========================================
  
  // Raw body parser middleware for webhook signature verification
  function rawBodyParser(req: any, res: any, buf: Buffer) {
    req.rawBody = buf.toString('utf8');
  }
  
  // Mailganer webhook handler for email delivery status
  app.post('/api/webhooks/mailganer', 
    express.raw({ type: 'application/json', verify: rawBodyParser }),
    async (req: any, res) => {
    try {
      // Use raw body for signature verification (critical for HMAC)
      const payload = req.rawBody || req.body.toString();
      const signature = req.headers['x-signature'] as string;
      const timestamp = req.headers['x-timestamp'] as string;
      
      // Verify webhook signature using raw payload
      if (!verifyWebhookSignature(payload, signature, timestamp)) {
        console.error('Invalid webhook signature from Mailganer');
        return res.status(401).json({ error: 'Invalid signature' });
      }
      
      // Parse JSON for processing (raw middleware gives us Buffer)
      const jsonData = JSON.parse(payload);
      const events: WebhookEvent[] = Array.isArray(jsonData) ? jsonData : [jsonData];
      
      // Process webhook events
      await processWebhookEvents(events);
      
      console.log(`Successfully processed ${events.length} Mailganer webhook event(s)`);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error processing Mailganer webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ========================================
  // DELETION REQUESTS API (Protected)
  // ========================================

  // Get user's deletion requests
  app.get('/api/deletion-requests', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!; // Safe because isEmailAuthenticated middleware checks this
      const requests = await storage.getUserDeletionRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error('Error fetching deletion requests:', error);
      res.status(500).json({ message: 'Failed to fetch deletion requests' });
    }
  });

  // Get specific deletion request by ID
  app.get('/api/deletion-requests/:id', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!; // Safe because isEmailAuthenticated middleware checks this
      const request = await storage.getUserDeletionRequests(userId);
      const foundRequest = request.find(r => r.id === req.params.id);
      
      if (!foundRequest) {
        return res.status(404).json({ message: 'Deletion request not found' });
      }
      
      res.json(foundRequest);
    } catch (error) {
      console.error('Error fetching deletion request:', error);
      res.status(500).json({ message: 'Failed to fetch deletion request' });
    }
  });

  // Create new deletion request
  app.post('/api/deletion-requests', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!; // Safe because isEmailAuthenticated middleware checks this
      const validatedData = insertDeletionRequestSchema.parse({
        ...req.body,
        userId,
      });
      
      const request = await storage.createDeletionRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      console.error('Error creating deletion request:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create deletion request' });
    }
  });

  // Update deletion request status (with field validation)
  app.put('/api/deletion-requests/:id', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!; // Safe because isEmailAuthenticated middleware checks this
      const requestId = req.params.id;
      
      // Verify request belongs to user
      const userRequests = await storage.getUserDeletionRequests(userId);
      const existingRequest = userRequests.find(r => r.id === requestId);
      
      if (!existingRequest) {
        return res.status(404).json({ message: 'Deletion request not found' });
      }
      
      // Validate allowed update fields
      const updateSchema = z.object({
        status: z.enum(['pending', 'sent', 'processing', 'completed', 'rejected', 'failed']).optional(),
        requestMethod: z.string().optional(),
        requestDetails: z.any().optional(),
        responseReceived: z.boolean().optional(),
        responseDetails: z.any().optional(),
        followUpRequired: z.boolean().optional(),
        followUpDate: z.date().optional(),
        completedAt: z.date().optional(),
      });
      
      const validatedUpdates = updateSchema.parse(req.body);
      const updatedRequest = await storage.updateDeletionRequest(requestId, validatedUpdates);
      
      if (!updatedRequest) {
        return res.status(404).json({ message: 'Failed to update deletion request' });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      console.error('Error updating deletion request:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid update data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update deletion request' });
    }
  });

  // ========================================
  // DOCUMENTS API (Protected)
  // ========================================

  // Get user's documents
  app.get('/api/documents', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!; // Safe because isEmailAuthenticated middleware checks this
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ message: 'Не удалось загрузить документы' });
    }
  });

  // Create new document (file upload)
  app.post('/api/documents', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!; // Safe because isEmailAuthenticated middleware checks this
      const validatedData = insertDocumentSchema.parse({
        ...req.body,
        userId,
      });
      
      const document = await storage.createDocument(validatedData);
      res.status(201).json({
        success: true,
        message: 'Документ успешно загружен',
        document
      });
    } catch (error) {
      console.error('Error creating document:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: 'Некорректные данные документа', 
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        success: false,
        message: 'Не удалось загрузить документ' 
      });
    }
  });

  // Update document status
  app.put('/api/documents/:id', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!; // Safe because isEmailAuthenticated middleware checks this
      const documentId = req.params.id;
      
      // Verify document belongs to user
      const userDocuments = await storage.getUserDocuments(userId);
      const existingDocument = userDocuments.find(d => d.id === documentId);
      
      if (!existingDocument) {
        return res.status(404).json({ 
          success: false,
          message: 'Документ не найден' 
        });
      }
      
      // Validate allowed update fields
      const updateSchema = z.object({
        status: z.enum(['uploaded', 'processing', 'verified', 'rejected']).optional(),
        processingNotes: z.string().optional(),
      });
      
      const validatedUpdates = updateSchema.parse(req.body);
      const updatedDocument = await storage.updateDocumentStatus(
        documentId, 
        validatedUpdates.status || existingDocument.status, 
        validatedUpdates.processingNotes
      );
      
      if (!updatedDocument) {
        return res.status(404).json({ 
          success: false,
          message: 'Не удалось обновить статус документа' 
        });
      }
      
      res.json({
        success: true,
        message: 'Статус документа обновлен',
        document: updatedDocument
      });
    } catch (error) {
      console.error('Error updating document:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: 'Некорректные данные обновления', 
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        success: false,
        message: 'Не удалось обновить документ' 
      });
    }
  });

  // ========================================
  // DATA BROKERS DIRECTORY API
  // ========================================

  // Data brokers directory API
  app.get('/api/data-brokers', async (req, res) => {
    try {
      const { search, category, difficulty } = req.query as {
        search?: string;
        category?: string;
        difficulty?: string;
      };

      const brokers = await storage.getAllDataBrokers({ search, category, difficulty });
      res.json(brokers);
    } catch (error) {
      console.error('Error fetching data brokers:', error);
      res.status(500).json({ message: 'Failed to fetch data brokers' });
    }
  });

  app.get('/api/data-brokers/:id', async (req, res) => {
    try {
      const broker = await storage.getDataBrokerById(req.params.id);
      if (!broker) {
        return res.status(404).json({ message: 'Data broker not found' });
      }
      res.json(broker);
    } catch (error) {
      console.error('Error fetching data broker:', error);
      res.status(500).json({ message: 'Failed to fetch data broker' });
    }
  });

  // ========================================
  // NOTIFICATIONS API (Protected)
  // ========================================

  // Get user's notifications
  app.get('/api/notifications', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!; // Safe because isEmailAuthenticated middleware checks this
      const unreadOnly = req.query.unread === 'true';
      const notifications = await storage.getUserNotifications(userId, unreadOnly);
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  });

  // Mark notification as read
  app.put('/api/notifications/:id/read', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!; // Safe because isEmailAuthenticated middleware checks this
      const notificationId = req.params.id;
      
      // Verify notification belongs to user
      const userNotifications = await storage.getUserNotifications(userId);
      const notification = userNotifications.find(n => n.id === notificationId);
      
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      
      const updatedNotification = await storage.markNotificationAsRead(notificationId);
      res.json(updatedNotification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Failed to mark notification as read' });
    }
  });

  // Delete notification
  app.delete('/api/notifications/:id', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!; // Safe because isEmailAuthenticated middleware checks this
      const notificationId = req.params.id;
      
      // Verify notification belongs to user
      const userNotifications = await storage.getUserNotifications(userId);
      const notification = userNotifications.find(n => n.id === notificationId);
      
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      
      const deleted = await storage.deleteNotification(notificationId);
      if (!deleted) {
        return res.status(500).json({ message: 'Failed to delete notification' });
      }
      
      res.json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ message: 'Failed to delete notification' });
    }
  });

  // ========================================
  // PUBLIC PROFILE AND ACHIEVEMENT ROUTES
  // ========================================
  
  // Set username for public profile
  app.post('/api/profile/username', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { username } = req.body;
      
      if (!username || typeof username !== 'string' || username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long' });
      }
      
      // Check if username is already taken
      const existingProfile = await storage.getPublicProfileByUsername(username);
      if (existingProfile) {
        return res.status(409).json({ message: 'Username already taken' });
      }
      
      const profile = await storage.setUsername(userId, username);
      res.json({ success: true, profile });
    } catch (error) {
      console.error('Error setting username:', error);
      res.status(500).json({ message: 'Failed to set username' });
    }
  });
  
  // Get public profile by username
  app.get('/api/public/u/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const profile = await storage.getPublicProfileByUsername(username);
      
      if (!profile || !profile.isPublic) {
        return res.status(404).json({ message: 'Public profile not found' });
      }
      
      // Get user achievements with definitions
      const userAchievements = await storage.getUserAchievements(profile.userId);
      const achievementDefinitions = await storage.getAllAchievements();
      
      // Merge user achievements with definitions
      const achievements = userAchievements
        .filter(ua => ua.earnedAt)
        .map(ua => {
          const definition = achievementDefinitions.find(ad => ad.key === ua.achievementKey);
          return definition ? {
            id: ua.id,
            title: definition.title,
            description: definition.description,
            icon: definition.icon,
            earnedAt: ua.earnedAt
          } : null;
        })
        .filter(Boolean);
      
      res.json({
        username: profile.username,
        privacyScore: profile.privacyScore,
        stats: profile.stats,
        achievements
      });
    } catch (error) {
      console.error('Error getting public profile:', error);
      res.status(500).json({ message: 'Failed to get public profile' });
    }
  });
  
  // Get user achievements
  app.get('/api/achievements', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error('Error getting achievements:', error);
      res.status(500).json({ message: 'Failed to get achievements' });
    }
  });
  
  // Get all achievement definitions
  app.get('/api/achievements/all', async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error('Error getting all achievements:', error);
      res.status(500).json({ message: 'Failed to get achievements' });
    }
  });

  // ========================================
  // REFERRAL API ENDPOINTS
  // ========================================
  
  // Generate referral code for user
  app.post('/api/referrals/generate', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const referralCode = await storage.createReferralCode(userId);
      res.json({ success: true, code: referralCode.code });
    } catch (error) {
      console.error('Error generating referral code:', error);
      res.status(500).json({ message: 'Failed to generate referral code' });
    }
  });
  
  // Track referral click
  app.post('/api/referrals/track-click', async (req, res) => {
    try {
      const { code, userAgent } = req.body;
      
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
      
      // Get real IP from request (ignore client-supplied IP for security)
      const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.toString().split(',')[0] || 'unknown';
      const safeUserAgent = (userAgent || req.headers['user-agent'] || '').substring(0, 500); // Limit length
      
      // Simple rate limiting: check for recent clicks from same IP+code combination
      // This is a basic implementation - for production consider using Redis
      const recentClicks = await storage.getRecentReferralClicks(clientIp, code, 60000); // 1 minute window
      if (recentClicks.length > 5) {
        return res.status(429).json({ message: 'Too many requests' });
      }
      
      const referral = await storage.createReferral({
        code,
        referrerId: '', // Will be filled by storage based on code
        referredUserId: null,
        status: 'clicked',
        clickedAt: new Date(),
        ipAddress: clientIp,
        userAgent: safeUserAgent
      });
      
      res.json({ success: true, referralId: referral.id });
    } catch (error) {
      console.error('Error tracking referral click:', error);
      res.status(500).json({ message: 'Failed to track referral click' });
    }
  });

  // Get user's referral stats - MOVED UP to avoid route conflict with :code
  app.get('/api/referrals/stats', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const stats = await storage.getReferralStats(userId);
      res.json(stats);
    } catch (error) {
      console.error('Error getting referral stats:', error);
      res.status(500).json({ message: 'Failed to get referral stats' });
    }
  });
  
  // Get referral info by code (public)
  app.get('/api/referrals/:code', async (req, res) => {
    try {
      const { code } = req.params;
      console.log(`🚀 API Request: GET /api/referrals/${code}`);
      const referralCode = await storage.getReferralCodeByCode(code);
      console.log(`🔍 API Result:`, referralCode);
      
      if (!referralCode || !referralCode.isActive) {
        console.log(`❌ API: Code not found or inactive`);
        return res.status(404).json({ message: 'Referral code not found or inactive' });
      }
      
      // Get referrer profile for display
      const referrerProfile = await storage.getUserProfile(referralCode.userId);
      
      res.json({
        code: referralCode.code,
        referrerName: referrerProfile?.firstName ? `${referrerProfile.firstName} ${referrerProfile.lastName || ''}`.trim() : 'Защитник данных',
        isValid: true,
        discount: 30 // 30% discount for referred users
      });
    } catch (error) {
      console.error('Error getting referral info:', error);
      res.status(500).json({ message: 'Failed to get referral info' });
    }
  });
  
  // REMOVED duplicate stats route - moved above to fix route conflict

  // Generate OG image for referral invite
  app.get('/api/og/invite/:code', async (req, res) => {
    try {
      const { code } = req.params;
      
      // Get referral info
      const referralCode = await storage.getReferralCodeByCode(code);
      let referrerName = "Защитник данных";
      
      if (referralCode && referralCode.isActive) {
        const referrerProfile = await storage.getUserProfile(referralCode.userId);
        if (referrerProfile?.firstName) {
          referrerName = `${referrerProfile.firstName} ${referrerProfile.lastName || ''}`.trim();
        }
      }
      
      // Escape function for safe SVG text injection
      const escapeSvg = (str: string) => str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      const safeReferrerName = escapeSvg(referrerName);
      
      // Simple SVG-based OG image
      const svg = `
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Background -->
          <rect width="1200" height="630" fill="url(#bg)"/>
          
          <!-- Shield icon background -->
          <circle cx="600" cy="200" r="60" fill="rgba(255,255,255,0.1)"/>
          
          <!-- Shield icon -->
          <path d="M600 150 L640 170 L635 210 L600 240 L565 210 L560 170 Z" fill="white" stroke="white" stroke-width="2"/>
          <path d="M600 170 L620 180 L618 205 L600 220 L582 205 L580 180 Z" fill="#2563eb"/>
          
          <!-- Main title -->
          <text x="600" y="320" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">
            Я уже защитил свои данные!
          </text>
          
          <!-- Subtitle -->
          <text x="600" y="370" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="36" fill="rgba(255,255,255,0.9)" text-anchor="middle">
            Присоединяйся - получи 30% скидку!
          </text>
          
          <!-- Bonus info -->
          <text x="600" y="410" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="22" fill="rgba(255,255,255,0.8)" text-anchor="middle">
            А я получу 50% скидку за тебя!
          </text>
          
          <!-- Referrer name -->
          <text x="600" y="450" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="24" fill="rgba(255,255,255,0.8)" text-anchor="middle">
            От: ${safeReferrerName}
          </text>
          
          <!-- Features -->
          <text x="300" y="520" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="20" fill="rgba(255,255,255,0.9)" text-anchor="middle">
            ✓ Автоматическая защита
          </text>
          <text x="600" y="520" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="20" fill="rgba(255,255,255,0.9)" text-anchor="middle">
            ✓ Мониторинг 24/7
          </text>
          <text x="900" y="520" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="20" fill="rgba(255,255,255,0.9)" text-anchor="middle">
            ✓ 200+ сайтов брокеров
          </text>
          
          <!-- Brand -->
          <text x="600" y="580" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="18" font-weight="bold" fill="rgba(255,255,255,0.7)" text-anchor="middle">
            ReScruB - Защита персональных данных
          </text>
        </svg>
      `;
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(svg);
    } catch (error) {
      console.error('Error generating OG image:', error);
      // Return a simple fallback image
      const fallbackSvg = `
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <rect width="1200" height="630" fill="#2563eb"/>
          <text x="600" y="320" font-family="Arial,sans-serif" font-size="48" fill="white" text-anchor="middle">
            Защитите свои данные со скидкой 30%
          </text>
          <text x="600" y="380" font-family="Arial,sans-serif" font-size="24" fill="white" text-anchor="middle">
            ReScruB
          </text>
        </svg>
      `;
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(fallbackSvg);
    }
  });

  // ========================================
  // SUBSCRIPTION API ENDPOINTS
  // ========================================

  // Get all subscription plans (public endpoint)
  app.get('/api/subscription-plans', async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      res.status(500).json({ message: 'Failed to fetch subscription plans' });
    }
  });

  // Get user's current subscription
  app.get('/api/subscription', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const subscription = await storage.getUserSubscription(userId);
      
      if (!subscription) {
        return res.json(null);
      }

      // Get plan details
      const plan = await storage.getSubscriptionPlanById(subscription.planId);
      const subscriptionWithPlan = {
        ...subscription,
        plan: plan
      };
      
      res.json(subscriptionWithPlan);
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      res.status(500).json({ message: 'Failed to fetch subscription' });
    }
  });

  // Create new subscription (start payment process)
  app.post('/api/subscription', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { planId } = req.body;

      // Validate plan exists
      const plan = await storage.getSubscriptionPlanById(planId);
      if (!plan) {
        return res.status(404).json({ message: 'Subscription plan not found' });
      }

      // Check if user already has active subscription
      const existingSubscription = await storage.getUserSubscription(userId);
      if (existingSubscription) {
        return res.status(400).json({ message: 'User already has an active subscription' });
      }

      // Get user profile and points balance FIRST before creating any records
      const userProfile = await storage.getUserProfile(userId);
      const userAccount = await storage.getUserAccountById(userId);
      const userPoints = await storage.getUserPoints(userId);
      
      const planPriceRubles = plan.price; // Plan price in rubles (1 point = 1 ruble)
      
      // Calculate points usage: ALL or NOTHING approach
      // Either user has enough points to pay FULL subscription, or pay FULL amount via gateway
      const canPayWithPoints = userPoints >= planPriceRubles;
      const pointsToUse = canPayWithPoints ? planPriceRubles : 0;
      const remainingAmountToPay = canPayWithPoints ? 0 : planPriceRubles;

      console.log(`💰 Payment calculation: Plan=${planPriceRubles}₽, User Points=${userPoints}, Using=${pointsToUse}, Remaining=${remainingAmountToPay}`);

      // ATOMIC: Deduct points FIRST before creating any records
      if (pointsToUse > 0) {
        const deductResult = await storage.deductUserPoints(userId, pointsToUse);
        if (!deductResult.success) {
          console.error('Failed to deduct points:', deductResult);
          return res.status(400).json({ 
            message: 'Недостаточно баллов для оплаты',
            availablePoints: userPoints,
            requiredPoints: pointsToUse,
            insufficientBy: deductResult.remainingPoints 
          });
        }
        console.log(`✅ Deducted ${pointsToUse} points, new balance: ${deductResult.newBalance}`);
      }

      // Generate unique invoice ID after successful points deduction
      const invoiceId = `sub_${userId}_${Date.now()}`;
      
      // Create subscription record with only remaining amount to pay
      const subscription = await storage.createSubscription({
        userId,
        planId,
        status: 'pending',
        robokassaInvoiceId: invoiceId,
      });

      // Create payment record with remaining amount and points metadata
      const payment = await storage.createPayment({
        subscriptionId: subscription.id,
        userId,
        amount: remainingAmountToPay, // Only remaining amount to pay via gateway
        currency: plan.currency,
        robokassaInvoiceId: invoiceId,
        isRecurring: false, // First payment is not recurring
        metadata: {
          pointsUsed: pointsToUse,
          originalAmount: planPriceRubles,
          remainingAmount: remainingAmountToPay
        }
      });

      let paymentUrl = null;
      let subscriptionResult = subscription;
      let paymentResult = payment;

      if (remainingAmountToPay > 0) {
        // Need to pay remaining amount via Robokassa
        paymentUrl = robokassaClient.createPaymentUrl({
          invoiceId,
          amount: remainingAmountToPay, // Full amount since points weren't used
          description: `Подписка ${plan.displayName}`,
          userEmail: userAccount?.email,
          isRecurring: false,
        });
        
        console.log(`💳 Created Robokassa payment URL for full amount ${remainingAmountToPay}₽ (insufficient points)`);
      } else {
        // Fully paid with points - activate subscription immediately
        const now = new Date();
        const currentPeriodEnd = new Date(now);
        
        if (plan.interval === 'month') {
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + (plan.intervalCount || 1));
        } else if (plan.interval === 'year') {
          currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + (plan.intervalCount || 1));
        }

        // Update subscription to active
        const updatedSub = await storage.updateSubscription(subscription.id, {
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: currentPeriodEnd,
        });
        subscriptionResult = updatedSub || subscription;

        // Mark payment as paid
        const updatedPay = await storage.updatePayment(payment.id, {
          status: 'paid',
          paidAt: now,
          paymentMethod: 'points',
          amount: 0, // No gateway payment needed
          metadata: {
            pointsUsed: pointsToUse,
            originalAmount: planPriceRubles,
            remainingAmount: 0,
            paidWithPointsOnly: true
          }
        });
        paymentResult = updatedPay || payment;

        // Award subscription points (already implemented in webhook)
        try {
          await storage.addUserPoints(userId, 100, 'Успешная подписка');
          console.log(`🎁 Awarded 100 bonus points for subscription`);
        } catch (error) {
          console.error('Error awarding bonus points:', error);
        }

        console.log(`🎉 Subscription fully paid with ${pointsToUse} points and activated immediately`);
      }

      res.json({
        subscription: subscriptionResult,
        payment: paymentResult,
        paymentUrl,
        pointsUsed: pointsToUse,
        remainingAmount: remainingAmountToPay,
        fullyPaidWithPoints: remainingAmountToPay === 0
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      res.status(500).json({ message: 'Failed to create subscription' });
    }
  });

  // Cancel subscription
  app.post('/api/subscription/cancel', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const subscription = await storage.getUserSubscription(userId);
      
      if (!subscription) {
        return res.status(404).json({ message: 'No active subscription found' });
      }

      const cancelledSubscription = await storage.cancelSubscription(subscription.id);
      res.json(cancelledSubscription);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      res.status(500).json({ message: 'Failed to cancel subscription' });
    }
  });

  // Get user's payment history
  app.get('/api/payments', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const payments = await storage.getUserPayments(userId);
      res.json(payments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      res.status(500).json({ message: 'Failed to fetch payment history' });
    }
  });

  // Get user's points balance
  app.get('/api/points', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const points = await storage.getUserPoints(userId);
      res.json({ 
        balance: points,
        currency: 'RUB', // 1 point = 1 ruble
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching points balance:', error);
      res.status(500).json({ message: 'Failed to fetch points balance' });
    }
  });

  // Get user's points history (placeholder for future implementation)
  app.get('/api/points/history', isEmailAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      // TODO: Implement proper points transaction history table
      // For now, return placeholder data
      const placeholderHistory = [
        {
          id: 'placeholder',
          type: 'earned',
          amount: 100,
          reason: 'Успешная подписка',
          timestamp: new Date().toISOString(),
          balance: await storage.getUserPoints(userId)
        }
      ];
      
      res.json({
        transactions: placeholderHistory,
        total: placeholderHistory.length
      });
    } catch (error) {
      console.error('Error fetching points history:', error);
      res.status(500).json({ message: 'Failed to fetch points history' });
    }
  });

  // ========================================
  // ROBOKASSA WEBHOOK ENDPOINTS
  // ========================================

  // Robokassa result webhook (payment successful)
  app.post('/api/webhooks/robokassa/result', express.raw({ type: 'application/x-www-form-urlencoded' }), async (req, res) => {
    try {
      const data = new URLSearchParams(req.body.toString());
      const webhookData = Object.fromEntries(data.entries());
      
      console.log('Robokassa result webhook received:', webhookData);

      const parsedData = robokassaClient.parseWebhookData(webhookData);
      if (!parsedData || !parsedData.isValid) {
        console.error('Invalid Robokassa webhook signature');
        return res.status(400).send('Invalid signature');
      }

      const { invoiceId, amount, paymentMethod } = parsedData;

      // Find payment record
      const payment = await storage.getPaymentByInvoiceId(invoiceId);
      if (!payment) {
        console.error('Payment not found for invoice:', invoiceId);
        return res.status(404).send('Payment not found');
      }

      // Update payment status
      await storage.updatePayment(payment.id, {
        status: 'paid',
        paidAt: new Date(),
        paymentMethod: paymentMethod || payment.paymentMethod,
      });

      // Update subscription status
      if (payment.subscriptionId) {
        const subscription = await storage.getSubscriptionById(payment.subscriptionId);
        if (subscription) {
          const now = new Date();
          const plan = await storage.getSubscriptionPlanById(subscription.planId);
          
          let currentPeriodEnd = new Date(now);
          if (plan?.interval === 'month') {
            currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + (plan.intervalCount || 1));
          } else if (plan?.interval === 'year') {
            currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + (plan.intervalCount || 1));
          }

          await storage.updateSubscription(subscription.id, {
            status: 'active',
            currentPeriodStart: now,
            currentPeriodEnd: currentPeriodEnd,
          });

          // Award 100 points for successful subscription
          try {
            await storage.addUserPoints(subscription.userId, 100, 'Успешная подписка');
            console.log(`💰 Awarded 100 points to user ${subscription.userId} for successful subscription`);
          } catch (error) {
            console.error('Error awarding points for subscription:', error);
            // Don't fail the webhook if points fail - payment is still successful
          }
        }
      }

      res.send('OK');
    } catch (error) {
      console.error('Error processing Robokassa result webhook:', error);
      res.status(500).send('Internal server error');
    }
  });

  // Robokassa success webhook (user returned to success page)
  app.post('/api/webhooks/robokassa/success', async (req, res) => {
    try {
      console.log('Robokassa success webhook received:', req.body);
      res.send('OK');
    } catch (error) {
      console.error('Error processing Robokassa success webhook:', error);
      res.status(500).send('Internal server error');
    }
  });

  // Robokassa fail webhook (payment failed)
  app.post('/api/webhooks/robokassa/fail', async (req, res) => {
    try {
      const { InvId: invoiceId, FailureDescription } = req.body;
      console.log('Robokassa fail webhook received:', req.body);

      if (invoiceId) {
        const payment = await storage.getPaymentByInvoiceId(invoiceId);
        if (payment) {
          await storage.updatePayment(payment.id, {
            status: 'failed',
            failedAt: new Date(),
            failureReason: FailureDescription || 'Payment failed',
          });
        }
      }

      res.send('OK');
    } catch (error) {
      console.error('Error processing Robokassa fail webhook:', error);
      res.status(500).send('Internal server error');
    }
  });

  // Blog Articles API Endpoints
  
  // Get all published blog articles
  app.get("/api/blog/articles", async (req, res) => {
    try {
      const { category, featured, limit = 50, offset = 0 } = req.query;
      
      const filters: any = {};
      if (category && typeof category === 'string') filters.category = category;
      if (featured !== undefined) filters.featured = featured === 'true';
      if (limit) filters.limit = Math.min(parseInt(limit as string), 100); // Max 100 
      if (offset) filters.offset = parseInt(offset as string);
      
      const articles = await storage.getPublishedBlogArticles(filters);
      
      // Transform to frontend format
      const transformedArticles = articles.map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.excerpt || '', // Map excerpt to description
        content: article.content,
        category: article.category,
        tags: article.tags,
        publishedAt: article.publishedAt ? article.publishedAt.toISOString() : new Date().toISOString(),
        author: 'Команда ResCrub', // Default author
        readingTime: Math.ceil(article.content.length / 1000), // Estimate reading time
        featured: article.featured || false,
        views: 0 // Not stored in DB yet
      }));
      
      res.json({
        success: true,
        articles: transformedArticles
      });
    } catch (error) {
      console.error('Error fetching blog articles:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка получения статей блога' 
      });
    }
  });

  // Get single blog article by slug
  app.get("/api/blog/articles/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      const article = await storage.getBlogArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ 
          success: false, 
          message: 'Статья не найдена' 
        });
      }
      
      // Only show published articles
      if (article.status !== 'published') {
        return res.status(404).json({ 
          success: false, 
          message: 'Статья не опубликована' 
        });
      }
      
      // Transform to frontend format
      const transformedArticle = {
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.excerpt || '',
        content: article.content,
        category: article.category,
        tags: article.tags,
        publishedAt: article.publishedAt ? article.publishedAt.toISOString() : new Date().toISOString(),
        author: 'Команда ResCrub',
        readingTime: Math.ceil(article.content.length / 1000),
        featured: article.featured || false,
        views: 0 // Increment view count in future
      };
      
      res.json({
        success: true,
        article: transformedArticle
      });
    } catch (error) {
      console.error('Error fetching blog article:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка получения статьи' 
      });
    }
  });

  // Blog Scheduler Management Endpoints
  
  // Get scheduler status and statistics
  app.get("/api/blog/scheduler/status", isEmailAuthenticated, async (req, res) => {
    try {
      const scheduler = SchedulerInstance.get();
      if (!scheduler) {
        return res.status(503).json({ 
          success: false, 
          message: "Планировщик блога не инициализирован" 
        });
      }

      const status = scheduler.getStatus();
      const stats = scheduler.getSchedulerStats();
      const settings = await scheduler.getGenerationSettings();

      res.json({
        success: true,
        scheduler: {
          status,
          stats,
          settings
        }
      });
    } catch (error) {
      console.error('Error getting scheduler status:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка получения статуса планировщика' 
      });
    }
  });

  // Force blog generation
  app.post("/api/blog/scheduler/force", isEmailAuthenticated, async (req, res) => {
    try {
      const scheduler = SchedulerInstance.get();
      if (!scheduler) {
        return res.status(503).json({ 
          success: false, 
          message: "Планировщик блога не инициализирован" 
        });
      }

      const result = await scheduler.forceGeneration();
      
      res.json({
        success: true,
        result: {
          articlesGenerated: result.articlesGenerated,
          nextGenerationAt: result.nextGenerationAt,
          message: result.message
        }
      });
    } catch (error) {
      console.error('Error forcing blog generation:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка принудительной генерации статей' 
      });
    }
  });

  // Get detailed generation settings  
  app.get("/api/blog/scheduler/settings", isEmailAuthenticated, async (req, res) => {
    try {
      const scheduler = SchedulerInstance.get();
      if (!scheduler) {
        return res.status(503).json({ 
          success: false, 
          message: "Планировщик блога не инициализирован" 
        });
      }

      const settings = await scheduler.getGenerationSettings();
      
      res.json({
        success: true,
        settings
      });
    } catch (error) {
      console.error('Error getting generation settings:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка получения настроек генерации' 
      });
    }
  });

  // Update generation settings
  app.post("/api/blog/scheduler/settings", isEmailAuthenticated, async (req, res) => {
    try {
      const scheduler = SchedulerInstance.get();
      if (!scheduler) {
        return res.status(503).json({ 
          success: false, 
          message: "Планировщик блога не инициализирован" 
        });
      }

      // Validate request body
      const updateSchema = z.object({
        enabled: z.boolean().optional(),
        frequency: z.enum(['hourly', 'daily', 'weekly']).optional(),
        maxArticlesPerDay: z.number().int().min(1).max(50).optional()
      });

      const validatedData = updateSchema.parse(req.body);
      
      await scheduler.updateGenerationSettings({
        enabled: validatedData.enabled,
        frequency: validatedData.frequency,
        maxArticlesPerDay: validatedData.maxArticlesPerDay
      });
      
      // Return updated settings
      const settings = await scheduler.getGenerationSettings();
      
      res.json({
        success: true,
        message: 'Настройки генерации обновлены',
        settings
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: 'Некорректные данные',
          errors: error.errors
        });
      }
      
      console.error('Error updating generation settings:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка обновления настроек генерации' 
      });
    }
  });

  // Get comprehensive scheduler statistics
  app.get("/api/blog/scheduler/stats", isEmailAuthenticated, async (req, res) => {
    try {
      const scheduler = SchedulerInstance.get();
      if (!scheduler) {
        return res.status(503).json({ 
          success: false, 
          message: "Планировщик блога не инициализирован" 
        });
      }

      const stats = scheduler.getSchedulerStats();
      
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Error getting scheduler stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка получения статистики планировщика' 
      });
    }
  });

  // ========================================
  // ADMIN PANEL API ENDPOINTS
  // ========================================

  // Simple in-memory cache for admin dashboard stats (30 second TTL)
  let dashboardStatsCache: { data: any; timestamp: number } | null = null;
  const DASHBOARD_CACHE_TTL = 30000; // 30 seconds

  // Get admin dashboard statistics with caching and parallel queries
  app.get("/api/admin/dashboard", isAdmin, async (req, res) => {
    try {
      // Check cache first
      const now = Date.now();
      if (dashboardStatsCache && (now - dashboardStatsCache.timestamp) < DASHBOARD_CACHE_TTL) {
        return res.json({ success: true, stats: dashboardStatsCache.data, cached: true });
      }

      // PERFORMANCE: Execute all DB queries in parallel using Promise.all
      const [
        totalUsers,
        verifiedUsers,
        admins,
        recentUsers,
        totalArticles,
        publishedArticles,
        lastGeneratedDate
      ] = await Promise.all([
        storage.getUsersCount().catch(() => 0),
        storage.getVerifiedUsersCount().catch(() => 0),
        storage.getAdminsCount().catch(() => 0),
        storage.getRecentUsersCount(7).catch(() => 0),
        storage.getBlogArticlesCount().catch(() => 0),
        storage.getPublishedBlogArticlesCount().catch(() => 0),
        storage.getLastGeneratedArticleDate().catch(() => null)
      ]);

      // Get scheduler info (synchronous, no DB calls)
      const blogScheduler = SchedulerInstance.get();

      const stats = {
        users: {
          total: totalUsers || 0,
          verified: verifiedUsers || 0,
          admins: admins || 0,
          recentRegistrations: recentUsers || 0
        },
        blog: {
          totalArticles: totalArticles || 0,
          publishedArticles: publishedArticles || 0,
          schedulerStatus: blogScheduler?.isRunning() || false,
          lastGenerated: lastGeneratedDate ? lastGeneratedDate.toISOString() : null,
          nextGeneration: blogScheduler?.getNextScheduledTime()?.toISOString() || null
        },
        system: {
          uptime: Math.floor(process.uptime()),
          memory: process.memoryUsage(),
          serverTime: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development'
        }
      };

      // Update cache
      dashboardStatsCache = {
        data: stats,
        timestamp: now
      };

      res.json({ success: true, stats });
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка получения статистики админской панели' 
      });
    }
  });

  // Make demo user admin for development - STRICTLY DEV ONLY
  app.post("/api/admin/setup-demo-admin", async (req, res) => {
    try {
      // SECURITY: Only allow in development mode
      if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({
          success: false,
          message: 'Endpoint not found'
        });
      }

      // Additional dev safety check
      if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') {
        return res.status(403).json({
          success: false,
          message: 'Доступно только в режиме разработки'
        });
      }

      const demoUser = await storage.getUserAccountByEmail('demo@rescrub.ru');
      if (demoUser) {
        const updatedUser = await storage.updateUserAccount(demoUser.id, {
          isAdmin: true,
          adminRole: 'superadmin'
        });

        // SECURITY: Return only safe fields to prevent data leakage
        res.json({
          success: true,
          message: 'Demo пользователь назначен администратором',
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            adminRole: updatedUser.adminRole
          }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Demo пользователь не найден'
        });
      }
    } catch (error) {
      console.error('Error setting up demo admin:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка настройки админа' 
      });
    }
  });

  // Public health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}

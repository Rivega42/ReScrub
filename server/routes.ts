import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertSupportTicketSchema, 
  insertUserAccountSchema, 
  insertUserProfileSchema,
  insertDataBrokerSchema,
  insertDeletionRequestSchema,
  insertDocumentSchema,
  type UserAccount,
  type DataBroker,
  type DeletionRequest,
  type Document
} from "@shared/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { handleOAuthStart, handleOAuthCallback } from "./oauthHandler";
import { verifyWebhookSignature, processWebhookEvents, type WebhookEvent } from "./email";

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup
  await setupAuth(app);

  // Seed demo account in development
  if (process.env.NODE_ENV === 'development') {
    try {
      await storage.seedDemoAccount();
    } catch (error) {
      console.error('Failed to seed demo account:', error);
    }
  }

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
      
      // TODO: Send verification email with SendGrid using plainToken
      // For development, we'll return the token in response (remove in production)
      const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email?token=${plainToken}&email=${encodeURIComponent(userAccount.email)}`;
      
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
      
      res.json({ 
        success: true, 
        message: "Вход выполнен успешно",
        user: {
          id: userAccount.id,
          email: userAccount.email,
          emailVerified: userAccount.emailVerified
        }
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
      // Check if user has an active session
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ 
          success: false, 
          message: "Unauthorized" 
        });
      }

      const userAccount = await storage.getUserAccountById(req.session.userId);
      const userProfile = await storage.getUserProfileByUserId(req.session.userId);
      
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
        
        res.clearCookie('connect.sid'); // Default session cookie name
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
      const userId = req.session.userId;
      
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
      const userId = req.session.userId;
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
      const userId = req.session.userId;
      
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

  // Public health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}

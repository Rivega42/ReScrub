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
  type UserAccount,
  type DataBroker,
  type DeletionRequest
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
  app.get('/api/auth/me', isEmailAuthenticated, async (req: any, res) => {
    try {
      const userAccount = await storage.getUserAccountById(req.session.userId);
      const userProfile = await storage.getUserProfile(req.session.userId);
      
      if (!userAccount) {
        return res.status(404).json({ 
          success: false, 
          message: "Пользователь не найден" 
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
        message: "Ошибка получения данных пользователя" 
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

  // Public health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}

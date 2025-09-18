import express, { type Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { getSession } from "./replitAuth";
import { seoMetaInjection } from "./middleware/seo";
import { subscriptionManager } from "./subscription-manager";
import { storage } from "./storage";

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Required for Tailwind
      scriptSrc: process.env.NODE_ENV === 'development' 
        ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://replit.com"] // Dev: allow Vite HMR and Replit banner
        : ["'self'", "https://replit.com"], // Prod: restrictive
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: process.env.NODE_ENV === 'development'
        ? ["'self'", "ws:", "wss:"] // Dev: allow WebSocket for HMR
        : ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for Vite HMR in dev
}));

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Слишком много попыток входа. Попробуйте через 15 минут.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/verify-email', authLimiter);

// Apply rate limiting to OAuth routes
app.use('/api/oauth/:provider/start', authLimiter);
app.use('/api/oauth/:provider/callback', authLimiter);

// General rate limiting for all API endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Слишком много запросов. Попробуйте позже.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Trust proxy for Replit environment
app.set('trust proxy', 1);

// Session middleware - CRITICAL: must be before routes!
app.use(getSession());

// SEO Meta Injection Middleware - must be before route handlers
// Detects social media bots and injects dynamic meta tags for rich previews
app.use(seoMetaInjection());

// Function to redact sensitive fields from logging
function redactSensitiveData(path: string, data: Record<string, any>): Record<string, any> {
  // Redact sensitive auth data from logs
  if (path.startsWith('/api/auth/')) {
    const redacted = { ...data };
    // Remove potentially sensitive fields
    if (redacted.verificationUrl) {
      redacted.verificationUrl = '[REDACTED]';
    }
    if (redacted.user?.id) {
      redacted.user.id = '[REDACTED]';
    }
    if (redacted.userId) {
      redacted.userId = '[REDACTED]';
    }
    if (redacted.user?.email) {
      redacted.user.email = '[REDACTED]';
    }
    // Keep success status and message for debugging
    return redacted;
  }
  return data;
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const redactedResponse = redactSensitiveData(path, capturedJsonResponse);
        logLine += ` :: ${JSON.stringify(redactedResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`serving on port ${port}`);
    
    // Seed subscription plans
    await storage.seedSubscriptionPlans();
    
    // Start subscription manager for recurring payments
    console.log('🚀 Initializing subscription manager...');
    subscriptionManager.start();
  });
})();

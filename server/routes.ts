import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertSupportTicketSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup
  await setupAuth(app);

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

  // Public health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}

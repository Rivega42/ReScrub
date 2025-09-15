import {
  users,
  supportTickets,
  userAccounts,
  userProfiles,
  phoneVerifications,
  documents,
  dataBrokerScans,
  deletionRequests,
  notifications,
  type User,
  type UpsertUser,
  type InsertSupportTicket,
  type SupportTicket,
  type UserAccount,
  type InsertUserAccount,
  type UserProfile,
  type InsertUserProfile,
  type PhoneVerification,
  type Document,
  type InsertDocument,
  type DataBrokerScan,
  type DeletionRequest,
  type InsertDeletionRequest,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Interface for storage operations
export interface IStorage {
  // Legacy Replit Auth operations (keeping for compatibility)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Support ticket operations
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  getSupportTickets?(): Promise<SupportTicket[]>;
  
  // New email-based authentication
  createUserAccount(accountData: InsertUserAccount): Promise<UserAccount>;
  getUserAccountByEmail(email: string): Promise<UserAccount | undefined>;
  getUserAccountById(id: string): Promise<UserAccount | undefined>;
  updateUserAccount(id: string, updates: Partial<UserAccount>): Promise<UserAccount | undefined>;
  verifyPassword(email: string, password: string): Promise<UserAccount | undefined>;
  
  // User profile operations
  createUserProfile(profileData: InsertUserProfile): Promise<UserProfile>;
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined>;
  
  // Phone verification
  createPhoneVerification(userId: string, phone: string, code: string): Promise<PhoneVerification>;
  getPhoneVerification(userId: string, code: string): Promise<PhoneVerification | undefined>;
  verifyPhone(userId: string, code: string): Promise<boolean>;
  
  // Document operations
  createDocument(documentData: InsertDocument): Promise<Document>;
  getUserDocuments(userId: string): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  updateDocumentStatus(id: string, status: string, notes?: string): Promise<Document | undefined>;
  
  // Data broker scanning
  createDataBrokerScan(scanData: Partial<DataBrokerScan>): Promise<DataBrokerScan>;
  getUserDataBrokerScans(userId: string): Promise<DataBrokerScan[]>;
  updateScanStatus(id: string, status: string, results?: any): Promise<DataBrokerScan | undefined>;
  
  // Deletion requests
  createDeletionRequest(requestData: InsertDeletionRequest): Promise<DeletionRequest>;
  getUserDeletionRequests(userId: string): Promise<DeletionRequest[]>;
  updateDeletionRequest(id: string, updates: Partial<DeletionRequest>): Promise<DeletionRequest | undefined>;
  
  // Notifications
  createNotification(notificationData: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string, unreadOnly?: boolean): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Legacy Replit Auth operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Support ticket operations
  async createSupportTicket(ticketData: InsertSupportTicket): Promise<SupportTicket> {
    const [ticket] = await db
      .insert(supportTickets)
      .values(ticketData)
      .returning();
    return ticket;
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    return await db.select().from(supportTickets);
  }

  // New email-based authentication
  async createUserAccount(accountData: InsertUserAccount): Promise<UserAccount> {
    const passwordHash = await bcrypt.hash(accountData.password, 12);
    const [account] = await db
      .insert(userAccounts)
      .values({ email: accountData.email, passwordHash })
      .returning();
    return account;
  }

  async getUserAccountByEmail(email: string): Promise<UserAccount | undefined> {
    const [account] = await db
      .select()
      .from(userAccounts)
      .where(eq(userAccounts.email, email));
    return account;
  }

  async getUserAccountById(id: string): Promise<UserAccount | undefined> {
    const [account] = await db
      .select()
      .from(userAccounts)
      .where(eq(userAccounts.id, id));
    return account;
  }

  async updateUserAccount(id: string, updates: Partial<UserAccount>): Promise<UserAccount | undefined> {
    const [account] = await db
      .update(userAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userAccounts.id, id))
      .returning();
    return account;
  }

  async verifyPassword(email: string, password: string): Promise<UserAccount | undefined> {
    const account = await this.getUserAccountByEmail(email);
    if (!account) return undefined;
    
    const isValid = await bcrypt.compare(password, account.passwordHash);
    if (!isValid) return undefined;
    
    // Update last login
    await this.updateUserAccount(account.id, { lastLoginAt: new Date() });
    return account;
  }

  // User profile operations
  async createUserProfile(profileData: InsertUserProfile): Promise<UserProfile> {
    const [profile] = await db
      .insert(userProfiles)
      .values(profileData)
      .returning();
    return profile;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    return profile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const [profile] = await db
      .update(userProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return profile;
  }

  // Phone verification
  async createPhoneVerification(userId: string, phone: string, code: string): Promise<PhoneVerification> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const [verification] = await db
      .insert(phoneVerifications)
      .values({ userId, phone, verificationCode: code, expiresAt })
      .returning();
    return verification;
  }

  async getPhoneVerification(userId: string, code: string): Promise<PhoneVerification | undefined> {
    const [verification] = await db
      .select()
      .from(phoneVerifications)
      .where(
        and(
          eq(phoneVerifications.userId, userId),
          eq(phoneVerifications.verificationCode, code),
          sql`${phoneVerifications.expiresAt} > NOW()`
        )
      );
    return verification;
  }

  async verifyPhone(userId: string, code: string): Promise<boolean> {
    const verification = await this.getPhoneVerification(userId, code);
    if (!verification) return false;

    // Mark verification as verified
    await db
      .update(phoneVerifications)
      .set({ verified: true })
      .where(eq(phoneVerifications.id, verification.id));

    // Update profile phone verification status
    await db
      .update(userProfiles)
      .set({ phone: verification.phone, phoneVerified: true })
      .where(eq(userProfiles.userId, userId));

    return true;
  }

  // Document operations
  async createDocument(documentData: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values(documentData)
      .returning();
    return document;
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.createdAt));
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    return document;
  }

  async updateDocumentStatus(id: string, status: string, notes?: string): Promise<Document | undefined> {
    const [document] = await db
      .update(documents)
      .set({ 
        status, 
        processingNotes: notes, 
        updatedAt: new Date() 
      })
      .where(eq(documents.id, id))
      .returning();
    return document;
  }

  // Data broker scanning
  async createDataBrokerScan(scanData: Partial<DataBrokerScan>): Promise<DataBrokerScan> {
    const [scan] = await db
      .insert(dataBrokerScans)
      .values(scanData as any)
      .returning();
    return scan;
  }

  async getUserDataBrokerScans(userId: string): Promise<DataBrokerScan[]> {
    return await db
      .select()
      .from(dataBrokerScans)
      .where(eq(dataBrokerScans.userId, userId))
      .orderBy(desc(dataBrokerScans.createdAt));
  }

  async updateScanStatus(id: string, status: string, results?: any): Promise<DataBrokerScan | undefined> {
    const [scan] = await db
      .update(dataBrokerScans)
      .set({ 
        scanStatus: status, 
        scanResults: results, 
        lastScanAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(dataBrokerScans.id, id))
      .returning();
    return scan;
  }

  // Deletion requests
  async createDeletionRequest(requestData: InsertDeletionRequest): Promise<DeletionRequest> {
    const [request] = await db
      .insert(deletionRequests)
      .values(requestData)
      .returning();
    return request;
  }

  async getUserDeletionRequests(userId: string): Promise<DeletionRequest[]> {
    return await db
      .select()
      .from(deletionRequests)
      .where(eq(deletionRequests.userId, userId))
      .orderBy(desc(deletionRequests.createdAt));
  }

  async updateDeletionRequest(id: string, updates: Partial<DeletionRequest>): Promise<DeletionRequest | undefined> {
    const [request] = await db
      .update(deletionRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(deletionRequests.id, id))
      .returning();
    return request;
  }

  // Notifications
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async getUserNotifications(userId: string, unreadOnly = false): Promise<Notification[]> {
    const conditions = [eq(notifications.userId, userId)];
    if (unreadOnly) {
      conditions.push(eq(notifications.read, false));
    }
    
    return await db
      .select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const [notification] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }
}

export class MemStorage implements IStorage {
  private supportTicketsData: SupportTicket[] = [];
  private userAccountsData: UserAccount[] = [];
  private userProfilesData: UserProfile[] = [];
  private phoneVerificationsData: PhoneVerification[] = [];
  private documentsData: Document[] = [];
  private dataBrokerScansData: DataBrokerScan[] = [];
  private deletionRequestsData: DeletionRequest[] = [];
  private notificationsData: Notification[] = [];
  private ticketIdCounter = 1;
  private idCounter = 1;

  // Legacy Replit Auth (forwarded to database)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Support ticket operations (in-memory)
  async createSupportTicket(ticketData: InsertSupportTicket): Promise<SupportTicket> {
    const now = new Date();
    const ticket: SupportTicket = {
      id: `ticket_${this.ticketIdCounter++}_${Date.now()}`,
      ...ticketData,
      status: "open",
      createdAt: now,
      updatedAt: now,
    };
    
    this.supportTicketsData.push(ticket);
    return ticket;
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    return [...this.supportTicketsData];
  }

  // Email-based authentication (in-memory for development)
  async createUserAccount(accountData: InsertUserAccount): Promise<UserAccount> {
    const passwordHash = await bcrypt.hash(accountData.password, 12);
    const now = new Date();
    const account: UserAccount = {
      id: `user_${this.idCounter++}_${Date.now()}`,
      email: accountData.email,
      passwordHash,
      emailVerified: false,
      emailVerificationToken: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    };
    
    this.userAccountsData.push(account);
    return account;
  }

  async getUserAccountByEmail(email: string): Promise<UserAccount | undefined> {
    return this.userAccountsData.find(acc => acc.email === email);
  }

  async getUserAccountById(id: string): Promise<UserAccount | undefined> {
    return this.userAccountsData.find(acc => acc.id === id);
  }

  async updateUserAccount(id: string, updates: Partial<UserAccount>): Promise<UserAccount | undefined> {
    const index = this.userAccountsData.findIndex(acc => acc.id === id);
    if (index === -1) return undefined;
    
    this.userAccountsData[index] = {
      ...this.userAccountsData[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.userAccountsData[index];
  }

  async verifyPassword(email: string, password: string): Promise<UserAccount | undefined> {
    const account = await this.getUserAccountByEmail(email);
    if (!account) return undefined;
    
    const isValid = await bcrypt.compare(password, account.passwordHash);
    if (!isValid) return undefined;
    
    await this.updateUserAccount(account.id, { lastLoginAt: new Date() });
    return account;
  }

  // User profile operations (in-memory)
  async createUserProfile(profileData: InsertUserProfile): Promise<UserProfile> {
    const now = new Date();
    const profile: UserProfile = {
      id: `profile_${this.idCounter++}_${Date.now()}`,
      ...profileData,
      firstName: profileData.firstName || null,
      lastName: profileData.lastName || null,
      middleName: profileData.middleName || null,
      phone: profileData.phone || null,
      dateOfBirth: profileData.dateOfBirth || null,
      address: profileData.address || null,
      city: profileData.city || null,
      region: profileData.region || null,
      postalCode: profileData.postalCode || null,
      country: profileData.country || "RU",
      notificationPreferences: profileData.notificationPreferences || {},
      privacySettings: profileData.privacySettings || {},
      phoneVerified: false,
      createdAt: now,
      updatedAt: now,
    };
    
    this.userProfilesData.push(profile);
    return profile;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return this.userProfilesData.find(profile => profile.userId === userId);
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const index = this.userProfilesData.findIndex(profile => profile.userId === userId);
    if (index === -1) return undefined;
    
    this.userProfilesData[index] = {
      ...this.userProfilesData[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.userProfilesData[index];
  }

  // Phone verification (in-memory)
  async createPhoneVerification(userId: string, phone: string, code: string): Promise<PhoneVerification> {
    const now = new Date();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const verification: PhoneVerification = {
      id: `phone_${this.idCounter++}_${Date.now()}`,
      userId,
      phone,
      verificationCode: code,
      expiresAt,
      verified: false,
      attempts: 0,
      createdAt: now,
    };
    
    this.phoneVerificationsData.push(verification);
    return verification;
  }

  async getPhoneVerification(userId: string, code: string): Promise<PhoneVerification | undefined> {
    return this.phoneVerificationsData.find(
      v => v.userId === userId && v.verificationCode === code && v.expiresAt > new Date()
    );
  }

  async verifyPhone(userId: string, code: string): Promise<boolean> {
    const verification = await this.getPhoneVerification(userId, code);
    if (!verification) return false;
    
    verification.verified = true;
    await this.updateUserProfile(userId, { 
      phone: verification.phone, 
      phoneVerified: true 
    });
    
    return true;
  }

  // Document operations (in-memory stubs)
  async createDocument(documentData: InsertDocument): Promise<Document> {
    const now = new Date();
    const document: Document = {
      id: `doc_${this.idCounter++}_${Date.now()}`,
      ...documentData,
      description: documentData.description || null,
      status: "uploaded",
      processingNotes: null,
      createdAt: now,
      updatedAt: now,
    };
    
    this.documentsData.push(document);
    return document;
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    return this.documentsData
      .filter(doc => doc.userId === userId)
      .sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt ? b.createdAt.getTime() : 0;
        return timeB - timeA;
      });
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documentsData.find(doc => doc.id === id);
  }

  async updateDocumentStatus(id: string, status: string, notes?: string): Promise<Document | undefined> {
    const index = this.documentsData.findIndex(doc => doc.id === id);
    if (index === -1) return undefined;
    
    this.documentsData[index] = {
      ...this.documentsData[index],
      status,
      processingNotes: notes || null,
      updatedAt: new Date(),
    };
    return this.documentsData[index];
  }

  // Data broker scanning (in-memory stubs)
  async createDataBrokerScan(scanData: Partial<DataBrokerScan>): Promise<DataBrokerScan> {
    const now = new Date();
    const scan: DataBrokerScan = {
      id: `scan_${this.idCounter++}_${Date.now()}`,
      userId: scanData.userId!,
      brokerName: scanData.brokerName || '',
      brokerUrl: scanData.brokerUrl || null,
      dataFound: false,
      recordsFound: 0,
      dataTypes: [],
      scanStatus: "pending",
      lastScanAt: null,
      nextScanAt: null,
      scanResults: {},
      createdAt: now,
      updatedAt: now,
      ...scanData,
    };
    
    this.dataBrokerScansData.push(scan);
    return scan;
  }

  async getUserDataBrokerScans(userId: string): Promise<DataBrokerScan[]> {
    return this.dataBrokerScansData
      .filter(scan => scan.userId === userId)
      .sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt ? b.createdAt.getTime() : 0;
        return timeB - timeA;
      });
  }

  async updateScanStatus(id: string, status: string, results?: any): Promise<DataBrokerScan | undefined> {
    const index = this.dataBrokerScansData.findIndex(scan => scan.id === id);
    if (index === -1) return undefined;
    
    this.dataBrokerScansData[index] = {
      ...this.dataBrokerScansData[index],
      scanStatus: status,
      scanResults: results || {},
      lastScanAt: new Date(),
      updatedAt: new Date(),
    };
    return this.dataBrokerScansData[index];
  }

  // Deletion requests (in-memory stubs)
  async createDeletionRequest(requestData: InsertDeletionRequest): Promise<DeletionRequest> {
    const now = new Date();
    const request: DeletionRequest = {
      id: `del_${this.idCounter++}_${Date.now()}`,
      ...requestData,
      scanId: requestData.scanId || null,
      status: "pending",
      requestMethod: null,
      requestDetails: {},
      sentAt: null,
      responseReceived: false,
      responseDetails: {},
      completedAt: null,
      followUpRequired: false,
      followUpDate: null,
      createdAt: now,
      updatedAt: now,
    };
    
    this.deletionRequestsData.push(request);
    return request;
  }

  async getUserDeletionRequests(userId: string): Promise<DeletionRequest[]> {
    return this.deletionRequestsData
      .filter(req => req.userId === userId)
      .sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt ? b.createdAt.getTime() : 0;
        return timeB - timeA;
      });
  }

  async updateDeletionRequest(id: string, updates: Partial<DeletionRequest>): Promise<DeletionRequest | undefined> {
    const index = this.deletionRequestsData.findIndex(req => req.id === id);
    if (index === -1) return undefined;
    
    this.deletionRequestsData[index] = {
      ...this.deletionRequestsData[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.deletionRequestsData[index];
  }

  // Notifications (in-memory)
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const now = new Date();
    const notification: Notification = {
      id: `notif_${this.idCounter++}_${Date.now()}`,
      ...notificationData,
      data: notificationData.data || {},
      read: false,
      sent: false,
      sentAt: null,
      createdAt: now,
    };
    
    this.notificationsData.push(notification);
    return notification;
  }

  async getUserNotifications(userId: string, unreadOnly = false): Promise<Notification[]> {
    return this.notificationsData
      .filter(notif => {
        if (notif.userId !== userId) return false;
        if (unreadOnly && notif.read) return false;
        return true;
      })
      .sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt ? b.createdAt.getTime() : 0;
        return timeB - timeA;
      });
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const index = this.notificationsData.findIndex(notif => notif.id === id);
    if (index === -1) return undefined;
    
    this.notificationsData[index].read = true;
    return this.notificationsData[index];
  }
}

// Choose storage implementation
// Use MemStorage for development, DatabaseStorage for production
const USE_MEMORY_STORAGE = process.env.NODE_ENV === 'development';
export const storage = USE_MEMORY_STORAGE ? new MemStorage() : new DatabaseStorage();

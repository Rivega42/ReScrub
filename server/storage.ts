import {
  users,
  supportTickets,
  userAccounts,
  userProfiles,
  phoneVerifications,
  documents,
  dataBrokers,
  dataBrokerScans,
  deletionRequests,
  notifications,
  oauthAccounts,
  subscriptionPlans,
  subscriptions,
  payments,
  achievementDefinitions,
  userAchievements,
  referralCodes,
  referrals,
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
  type DataBroker,
  type InsertDataBroker,
  type DataBrokerScan,
  type DeletionRequest,
  type InsertDeletionRequest,
  type Notification,
  type InsertNotification,
  type OAuthAccount,
  type InsertOAuthAccount,
  type SubscriptionPlan,
  type InsertSubscriptionPlan,
  type Subscription,
  type InsertSubscription,
  type Payment,
  type InsertPayment,
  type AchievementDefinition,
  type InsertAchievementDefinition,
  type UserAchievement,
  type InsertUserAchievement,
  type ReferralCode,
  type InsertReferralCode,
  type Referral,
  type InsertReferral,
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
  updateNotification(id: string, updates: Partial<Notification>): Promise<Notification | undefined>;
  deleteNotification(id: string): Promise<boolean>;
  
  // OAuth operations
  getOAuthAccountByProviderAndId(provider: string, providerUserId: string): Promise<OAuthAccount | undefined>;
  linkOAuthAccount(userId: string, oauthData: InsertOAuthAccount): Promise<OAuthAccount>;
  listUserOAuthAccounts(userId: string): Promise<OAuthAccount[]>;
  unlinkOAuthAccount(oauthAccountId: string): Promise<boolean>;
  updateOAuthTokens(oauthAccountId: string, tokens: { accessTokenHash?: string; refreshTokenHash?: string; expiresAt?: Date }): Promise<OAuthAccount | undefined>;

  // Data brokers directory operations
  getAllDataBrokers(filters?: {
    search?: string;
    category?: string;
    difficulty?: string;
  }): Promise<DataBroker[]>;
  getDataBrokerById(id: string): Promise<DataBroker | null>;
  insertDataBroker(broker: InsertDataBroker): Promise<DataBroker>;
  updateDataBroker(id: string, updates: Partial<InsertDataBroker>): Promise<DataBroker>;
  deleteDataBroker(id: string): Promise<void>;

  // Subscription operations
  createSubscriptionPlan(planData: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlanById(id: string): Promise<SubscriptionPlan | null>;
  updateSubscriptionPlan(id: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null>;
  
  createSubscription(subscriptionData: InsertSubscription): Promise<Subscription>;
  getUserSubscription(userId: string): Promise<Subscription | null>;
  getSubscriptionById(id: string): Promise<Subscription | null>;
  updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | null>;
  cancelSubscription(id: string): Promise<Subscription | null>;
  
  // Payment operations
  createPayment(paymentData: InsertPayment): Promise<Payment>;
  getPaymentByInvoiceId(invoiceId: string): Promise<Payment | null>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | null>;
  getUserPayments(userId: string): Promise<Payment[]>;
  getPaymentsBySubscription(subscriptionId: string): Promise<Payment[]>;

  // Public profile operations
  getPublicProfileByUsername(username: string): Promise<UserProfile | undefined>;
  setUsername(userId: string, username: string): Promise<UserProfile | undefined>;
  updateUserStats(userId: string, stats: { totalScans?: number; totalDeletions?: number }): Promise<UserProfile | undefined>;
  
  // Achievement operations
  getAllAchievements(): Promise<AchievementDefinition[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  awardAchievement(userId: string, achievementKey: string, progress?: number): Promise<UserAchievement | undefined>;
  checkAndAwardAchievements(userId: string, context: { scans?: number; deletions?: number; isPremium?: boolean }): Promise<UserAchievement[]>;
  
  // Referral operations
  createReferralCode(userId: string): Promise<ReferralCode>;
  getReferralCodeByUser(userId: string): Promise<ReferralCode | undefined>;
  getReferralCodeByCode(code: string): Promise<ReferralCode | undefined>;
  createReferral(referralData: InsertReferral): Promise<Referral>;
  getReferralsByUser(userId: string): Promise<Referral[]>;
  updateReferralStatus(id: string, status: string, rewardType?: string): Promise<Referral | undefined>;
  getRecentReferralClicks(ipAddress: string, code: string, timeWindowMs: number): Promise<Referral[]>;
  getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    successfulReferrals: number;
    totalRewards: number;
    activeCode?: string;
  }>;
  
  // Seeding operations
  seedSubscriptionPlans(): Promise<void>;
  seedDemoAccount(): Promise<void>;
  seedAchievements(): Promise<void>;
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

  async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification | undefined> {
    const [notification] = await db
      .update(notifications)
      .set(updates)
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const result = await db
      .delete(notifications)
      .where(eq(notifications.id, id));
    return (result.rowCount || 0) > 0;
  }

  // OAuth operations
  async getOAuthAccountByProviderAndId(provider: string, providerUserId: string): Promise<OAuthAccount | undefined> {
    const [account] = await db
      .select()
      .from(oauthAccounts)
      .where(
        and(
          eq(oauthAccounts.provider, provider),
          eq(oauthAccounts.providerUserId, providerUserId)
        )
      );
    return account;
  }

  async linkOAuthAccount(userId: string, oauthData: InsertOAuthAccount): Promise<OAuthAccount> {
    const [account] = await db
      .insert(oauthAccounts)
      .values({ ...oauthData, userId })
      .returning();
    return account;
  }

  async listUserOAuthAccounts(userId: string): Promise<OAuthAccount[]> {
    return await db
      .select()
      .from(oauthAccounts)
      .where(eq(oauthAccounts.userId, userId))
      .orderBy(desc(oauthAccounts.createdAt));
  }

  async unlinkOAuthAccount(oauthAccountId: string): Promise<boolean> {
    const result = await db
      .delete(oauthAccounts)
      .where(eq(oauthAccounts.id, oauthAccountId))
      .returning();
    return result.length > 0;
  }

  async updateOAuthTokens(
    oauthAccountId: string, 
    tokens: { accessTokenHash?: string; refreshTokenHash?: string; expiresAt?: Date }
  ): Promise<OAuthAccount | undefined> {
    const [account] = await db
      .update(oauthAccounts)
      .set({ ...tokens, updatedAt: new Date() })
      .where(eq(oauthAccounts.id, oauthAccountId))
      .returning();
    return account;
  }

  // Data brokers directory operations
  async getAllDataBrokers(filters?: {
    search?: string;
    category?: string;
    difficulty?: string;
  }): Promise<DataBroker[]> {
    let query = db.select().from(dataBrokers).where(eq(dataBrokers.isActive, true));

    // Apply filters
    const conditions = [eq(dataBrokers.isActive, true)];
    
    if (filters?.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        sql`(
          LOWER(${dataBrokers.name}) LIKE ${searchTerm} OR
          LOWER(${dataBrokers.description}) LIKE ${searchTerm} OR
          ${dataBrokers.tags} && ARRAY[${filters.search.toLowerCase()}]
        )`
      );
    }
    
    if (filters?.category && filters.category !== 'all') {
      conditions.push(eq(dataBrokers.category, filters.category));
    }
    
    if (filters?.difficulty && filters.difficulty !== 'all') {
      conditions.push(eq(dataBrokers.difficultyLevel, filters.difficulty));
    }

    if (conditions.length > 1) {
      query = db.select().from(dataBrokers).where(and(...conditions));
    }

    return query.orderBy(dataBrokers.name);
  }

  async getDataBrokerById(id: string): Promise<DataBroker | null> {
    const [broker] = await db.select().from(dataBrokers).where(eq(dataBrokers.id, id));
    return broker || null;
  }

  async insertDataBroker(brokerData: InsertDataBroker): Promise<DataBroker> {
    const [broker] = await db
      .insert(dataBrokers)
      .values(brokerData)
      .returning();
    return broker;
  }

  async updateDataBroker(id: string, updates: Partial<InsertDataBroker>): Promise<DataBroker> {
    const [broker] = await db
      .update(dataBrokers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(dataBrokers.id, id))
      .returning();
    return broker;
  }

  async deleteDataBroker(id: string): Promise<void> {
    await db.delete(dataBrokers).where(eq(dataBrokers.id, id));
  }

  // ========================================
  // SUBSCRIPTION OPERATIONS
  // ========================================

  // Subscription plan operations
  async createSubscriptionPlan(planData: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [plan] = await db
      .insert(subscriptionPlans)
      .values(planData)
      .returning();
    return plan;
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.isActive, true))
      .orderBy(subscriptionPlans.sortOrder, subscriptionPlans.price);
  }

  async getSubscriptionPlanById(id: string): Promise<SubscriptionPlan | null> {
    const [plan] = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, id));
    return plan || null;
  }

  async updateSubscriptionPlan(id: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
    const [plan] = await db
      .update(subscriptionPlans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptionPlans.id, id))
      .returning();
    return plan || null;
  }

  // Subscription operations
  async createSubscription(subscriptionData: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(subscriptionData)
      .returning();
    return subscription;
  }

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, 'active')
        )
      )
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);
    return subscription || null;
  }

  async getSubscriptionById(id: string): Promise<Subscription | null> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id));
    return subscription || null;
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | null> {
    const [subscription] = await db
      .update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return subscription || null;
  }

  async cancelSubscription(id: string): Promise<Subscription | null> {
    const [subscription] = await db
      .update(subscriptions)
      .set({ 
        status: 'cancelled',
        cancelledAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(subscriptions.id, id))
      .returning();
    return subscription || null;
  }

  // Payment operations
  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(paymentData)
      .returning();
    return payment;
  }

  async getPaymentByInvoiceId(invoiceId: string): Promise<Payment | null> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.robokassaInvoiceId, invoiceId));
    return payment || null;
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | null> {
    const [payment] = await db
      .update(payments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return payment || null;
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  async getPaymentsBySubscription(subscriptionId: string): Promise<Payment[]> {
    return db
      .select()
      .from(payments)
      .where(eq(payments.subscriptionId, subscriptionId))
      .orderBy(desc(payments.createdAt));
  }

  // Subscription plan seeding
  async seedSubscriptionPlans(): Promise<void> {
    // Check if subscription plans already exist
    const existingPlans = await this.getSubscriptionPlans();
    if (existingPlans.length > 0) {
      console.log('✅ Subscription plans already exist, skipping seeding');
      return;
    }

    const plans = [
      {
        name: 'basic',
        displayName: 'Базовый',
        description: 'Основная защита персональных данных',
        price: 499,
        currency: 'RUB',
        interval: 'month',
        intervalCount: 1,
        features: ['До 5 запросов на удаление в месяц', 'Базовое сканирование данных', 'Email поддержка'],
        maxScans: 5,
        maxDeletionRequests: 10,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'premium',
        displayName: 'Премиум',
        description: 'Расширенная защита с приоритетной поддержкой',
        price: 999,
        currency: 'RUB',
        interval: 'month',
        intervalCount: 1,
        features: ['До 25 запросов на удаление в месяц', 'Расширенное сканирование', 'Приоритетная поддержка', 'Автоматические уведомления'],
        maxScans: 25,
        maxDeletionRequests: 50,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'enterprise',
        displayName: 'Корпоративный',
        description: 'Максимальная защита для бизнеса',
        price: 2499,
        currency: 'RUB',
        interval: 'month',
        intervalCount: 1,
        features: ['Неограниченные запросы на удаление', 'Полное сканирование всех брокеров', '24/7 поддержка', 'API доступ', 'Корпоративная отчетность'],
        maxScans: -1, // unlimited
        maxDeletionRequests: -1, // unlimited
        isActive: true,
        sortOrder: 3
      }
    ];

    for (const planData of plans) {
      await this.createSubscriptionPlan(planData);
    }

    console.log('✅ Subscription plans seeded successfully');
  }

  // Demo account seeding for development
  async seedDemoAccount(): Promise<void> {
    console.log('🌱 Seeding demo account...');
    
    const demoEmail = 'demo@rescrub.ru';
    const demoPassword = 'demo123';
    
    // Check if demo user already exists
    let userAccount = await this.getUserAccountByEmail(demoEmail);
    
    if (!userAccount) {
      // Create demo user account
      userAccount = await this.createUserAccount({
        email: demoEmail,
        password: demoPassword,
      });
      
      // Verify email immediately
      await this.updateUserAccount(userAccount.id, {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      });
      console.log(`✅ Created verified demo user: ${demoEmail}`);
    } else {
      console.log(`✅ Demo user already exists: ${demoEmail}`);
    }

    // Create or update demo user profile
    let userProfile = await this.getUserProfile(userAccount.id);
    if (!userProfile) {
      userProfile = await this.createUserProfile({
        userId: userAccount.id,
        firstName: 'Демо',
        lastName: 'Пользователь',
        phone: '+7 900 000-00-00',
      });
      console.log('✅ Created demo user profile');
    }

    // Seed demo data
    await this.seedDemoData(userAccount.id);
    console.log('🎉 Demo account seeding completed!');
    console.log(`📧 Login: ${demoEmail}`);
    console.log(`🔑 Password: ${demoPassword}`);
  }

  private async seedDemoData(userId: string): Promise<void> {
    // Clear existing demo data for idempotency
    const existingRequests = await this.getUserDeletionRequests(userId);
    if (existingRequests.length > 0) {
      console.log('✅ Demo data already exists, skipping seeding');
      return;
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Create deletion requests in various statuses
    const sberRequest = await this.createDeletionRequest({
      userId,
      brokerName: 'Сбербанк',
      requestType: 'deletion',
      requestMethod: 'email',
      requestDetails: { 
        contactEmail: 'personaldata@sberbank.ru', 
        personalInfo: { firstName: 'Демо', lastName: 'Пользователь', email: 'demo@rescrub.ru' } 
      },
    });
    await this.updateDeletionRequest(sberRequest.id, {
      status: 'sent',
      sentAt: weekAgo,
    });

    const mtsRequest = await this.createDeletionRequest({
      userId,
      brokerName: 'МТС',  
      requestType: 'deletion',
      requestMethod: 'phone',
      requestDetails: {
        contactPhone: '8-800-250-0890',
        personalInfo: { firstName: 'Демо', lastName: 'Пользователь', phone: '+7 900 000-00-00' }
      },
    });
    await this.updateDeletionRequest(mtsRequest.id, {
      status: 'processing',
      followUpRequired: true,
      followUpDate: weekLater,
    });

    const yandexRequest = await this.createDeletionRequest({
      userId,
      brokerName: 'Яндекс',
      requestType: 'deletion',
      requestMethod: 'email',
      requestDetails: {
        contactEmail: 'dataprotection@yandex.ru',
        personalInfo: { firstName: 'Демо', lastName: 'Пользователь', email: 'demo@rescrub.ru' }
      },
    });
    await this.updateDeletionRequest(yandexRequest.id, {
      status: 'completed',
      completedAt: now,
    });

    // Create demo documents
    const passportDoc = await this.createDocument({
      userId,
      category: 'passport',
      filename: 'passport_scan.pdf',
      originalName: 'Паспорт_РФ_сканкопия.pdf',
      mimeType: 'application/pdf',
      fileSize: 2048576,
      filePath: '/uploads/passport_scan.pdf',
      description: 'Сканкопия паспорта РФ',
    });
    await this.updateDocumentStatus(passportDoc.id, 'verified', 'Документ успешно верифицирован');

    const powerDoc = await this.createDocument({
      userId,
      category: 'power_of_attorney',
      filename: 'power_of_attorney.pdf',
      originalName: 'Доверенность_нотариальная.pdf',
      mimeType: 'application/pdf',
      fileSize: 1024768,
      filePath: '/uploads/power_of_attorney.pdf',
      description: 'Нотариальная доверенность',
    });
    await this.updateDocumentStatus(powerDoc.id, 'processing', 'Документ на проверке');

    // Create demo data broker scan
    const scan = await this.createDataBrokerScan({
      userId,
      brokerName: 'Комплексное сканирование',
      dataFound: true,
      recordsFound: 5,
      dataTypes: ['email', 'phone', 'address'],
    });
    await this.updateScanStatus(scan.id, 'completed', {
      brokers: ['Сбербанк', 'МТС', 'Яндекс'],
      summary: 'Найдены персональные данные в 3 источниках'
    });

    // Create demo notifications
    await this.createNotification({
      userId,
      type: 'in_app',
      category: 'scan_completed',
      title: 'Сканирование завершено',
      message: 'Найдены персональные данные в 3 источниках. Рекомендуем отправить запросы на удаление.',
    });

    await this.createNotification({
      userId,
      type: 'in_app',
      category: 'deletion_request',
      title: 'Запрос отправлен в Сбербанк',
      message: 'Ваш запрос на удаление персональных данных успешно отправлен.',
    });

    console.log('✅ Demo data seeded successfully');
  }

  // Public profile operations
  async getPublicProfileByUsername(username: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(and(eq(userProfiles.username, username), eq(userProfiles.isPublic, true)));
    return profile;
  }

  async setUsername(userId: string, username: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .update(userProfiles)
      .set({ username, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return profile;
  }

  async updateUserStats(userId: string, stats: { totalScans?: number; totalDeletions?: number }): Promise<UserProfile | undefined> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return undefined;

    const currentStats = profile.stats as any || { totalScans: 0, totalDeletions: 0 };
    const newStats = { ...currentStats, ...stats };
    
    // Calculate privacy score based on activity
    const privacyScore = Math.min(100, Math.floor(
      (newStats.totalScans * 10) + (newStats.totalDeletions * 5)
    ));

    const [updatedProfile] = await db
      .update(userProfiles)
      .set({ 
        stats: newStats,
        privacyScore,
        updatedAt: new Date() 
      })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  // Achievement operations
  async getAllAchievements(): Promise<AchievementDefinition[]> {
    return await db
      .select()
      .from(achievementDefinitions)
      .where(eq(achievementDefinitions.isActive, true))
      .orderBy(achievementDefinitions.sortOrder);
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(userAchievements.earnedAt);
  }

  async awardAchievement(userId: string, achievementKey: string, progress = 1): Promise<UserAchievement | undefined> {
    // Check if achievement already exists
    const [existing] = await db
      .select()
      .from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementKey, achievementKey)
      ));

    if (existing) {
      // Update progress if not completed
      if (!existing.earnedAt && (existing.progress || 0) < (existing.maxProgress || 1)) {
        const newProgress = Math.min(existing.maxProgress || 1, (existing.progress || 0) + progress);
        const earnedAt = newProgress >= (existing.maxProgress || 1) ? new Date() : null;
        
        const [updated] = await db
          .update(userAchievements)
          .set({ progress: newProgress, earnedAt })
          .where(eq(userAchievements.id, existing.id))
          .returning();
        return updated;
      }
      return existing;
    }

    // Create new achievement
    const [achievement] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementKey,
        progress,
        maxProgress: 1,
        earnedAt: progress >= 1 ? new Date() : null
      })
      .returning();
    return achievement;
  }

  async checkAndAwardAchievements(userId: string, context: { scans?: number; deletions?: number; isPremium?: boolean }): Promise<UserAchievement[]> {
    const awarded: UserAchievement[] = [];

    // First scan achievement
    if (context.scans === 1) {
      const achievement = await this.awardAchievement(userId, 'first_scan');
      if (achievement) awarded.push(achievement);
    }

    // Ten deletions achievement
    if (context.deletions && context.deletions >= 10) {
      const achievement = await this.awardAchievement(userId, 'ten_deletions');
      if (achievement) awarded.push(achievement);
    }

    // Premium member achievement
    if (context.isPremium) {
      const achievement = await this.awardAchievement(userId, 'premium_member');
      if (achievement) awarded.push(achievement);
    }

    return awarded;
  }

  // Referral operations
  async createReferralCode(userId: string): Promise<ReferralCode> {
    // Generate unique 6-character code
    const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();
    let code = generateCode();
    
    // Ensure uniqueness
    while (await this.getReferralCodeByCode(code)) {
      code = generateCode();
    }

    const [referralCode] = await db
      .insert(referralCodes)
      .values({ userId, code })
      .returning();
    return referralCode;
  }

  async getReferralCodeByUser(userId: string): Promise<ReferralCode | undefined> {
    const [code] = await db
      .select()
      .from(referralCodes)
      .where(and(eq(referralCodes.userId, userId), eq(referralCodes.isActive, true)));
    return code;
  }

  async getReferralCodeByCode(code: string): Promise<ReferralCode | undefined> {
    const [referralCode] = await db
      .select()
      .from(referralCodes)
      .where(and(eq(referralCodes.code, code), eq(referralCodes.isActive, true)));
    return referralCode;
  }

  async createReferral(referralData: InsertReferral): Promise<Referral> {
    // Get referrer ID from the code
    const referralCode = await this.getReferralCodeByCode(referralData.code);
    if (!referralCode) {
      throw new Error('Invalid referral code');
    }

    const [referral] = await db
      .insert(referrals)
      .values({
        ...referralData,
        referrerId: referralCode.userId
      })
      .returning();
    
    // Increment code usage
    await db
      .update(referralCodes)
      .set({ 
        currentUses: sql`${referralCodes.currentUses} + 1` 
      })
      .where(eq(referralCodes.code, referralData.code));
    
    return referral;
  }

  async getReferralsByUser(userId: string): Promise<Referral[]> {
    return await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt));
  }

  async updateReferralStatus(id: string, status: string, rewardType?: string): Promise<Referral | undefined> {
    const updates: any = { status };
    if (status === 'subscribed' && rewardType) {
      updates.subscribedAt = new Date();
      updates.rewardType = rewardType;
      updates.rewardGranted = true;
    } else if (status === 'signed_up') {
      updates.signedUpAt = new Date();
    }

    const [referral] = await db
      .update(referrals)
      .set(updates)
      .where(eq(referrals.id, id))
      .returning();
    return referral;
  }

  async getRecentReferralClicks(ipAddress: string, code: string, timeWindowMs: number): Promise<Referral[]> {
    const cutoffTime = new Date(Date.now() - timeWindowMs);
    return await db
      .select()
      .from(referrals)
      .where(
        and(
          eq(referrals.ipAddress, ipAddress),
          eq(referrals.code, code),
          sql`${referrals.clickedAt} > ${cutoffTime}`
        )
      );
  }

  async getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    successfulReferrals: number;
    totalRewards: number;
    activeCode?: string;
  }> {
    // Get total referrals count
    const totalReferrals = await db
      .select({ count: sql`COUNT(*)` })
      .from(referrals)
      .where(eq(referrals.referrerId, userId));

    // Get successful referrals (subscribed)
    const successfulReferrals = await db
      .select({ count: sql`COUNT(*)` })
      .from(referrals)
      .where(
        and(
          eq(referrals.referrerId, userId),
          eq(referrals.status, 'subscribed')
        )
      );

    // Get active referral code
    const activeCode = await this.getReferralCodeByUser(userId);

    return {
      totalReferrals: Number(totalReferrals[0]?.count || 0),
      successfulReferrals: Number(successfulReferrals[0]?.count || 0),
      totalRewards: Number(successfulReferrals[0]?.count || 0) * 50, // 50% reward per successful referral
      activeCode: activeCode?.code
    };
  }

  // Seed achievements
  async seedAchievements(): Promise<void> {
    const achievements = [
      {
        key: 'first_scan',
        title: 'Первый шаг',
        description: 'Выполнил первое сканирование данных',
        icon: 'search',
        category: 'privacy',
        points: 10
      },
      {
        key: 'ten_deletions',
        title: 'Защитник приватности',
        description: 'Отправил 10 запросов на удаление данных',
        icon: 'shield',
        category: 'privacy',
        points: 50
      },
      {
        key: 'premium_member',
        title: 'Премиум пользователь',
        description: 'Оформил премиум подписку',
        icon: 'crown',
        category: 'premium',
        points: 25
      },
      {
        key: 'invite_1',
        title: 'Первый друг',
        description: 'Пригласил первого друга',
        icon: 'user-plus',
        category: 'social',
        points: 15
      },
      {
        key: 'invite_5',
        title: 'Амбассадор',
        description: 'Пригласил 5 друзей',
        icon: 'users',
        category: 'social',
        points: 100
      }
    ];

    for (const achievement of achievements) {
      try {
        await db
          .insert(achievementDefinitions)
          .values(achievement)
          .onConflictDoNothing();
      } catch (error) {
        // Ignore conflicts for existing achievements
      }
    }

    console.log('✅ Achievements seeded successfully');
  }
}

export class MemStorage implements IStorage {
  private supportTicketsData: SupportTicket[] = [];
  private userAccountsData: UserAccount[] = [];
  private userProfilesData: UserProfile[] = [];
  private phoneVerificationsData: PhoneVerification[] = [];
  private documentsData: Document[] = [];
  private dataBrokersData: DataBroker[] = [];
  private dataBrokerScansData: DataBrokerScan[] = [];
  private deletionRequestsData: DeletionRequest[] = [];
  private notificationsData: Notification[] = [];
  private oauthAccountsData: OAuthAccount[] = [];
  private subscriptionPlansData: SubscriptionPlan[] = [];
  private subscriptionsData: Subscription[] = [];
  private paymentsData: Payment[] = [];
  private achievementDefinitionsData: AchievementDefinition[] = [];
  private userAchievementsData: UserAchievement[] = [];
  private referralCodesData: ReferralCode[] = [];
  private referralsData: Referral[] = [];
  private ticketIdCounter = 1;
  private idCounter = 1;

  constructor() {
    // Seed data brokers for development
    this.seedDataBrokers();
    // Seed achievements for development
    this.seedAchievements();
  }

  private seedDataBrokers() {
    const now = new Date();
    this.dataBrokersData = [
      {
        id: 'broker_1',
        name: 'Сбербанк',
        legalName: 'ПАО "Сбербанк России"',
        category: 'банк',
        description: 'Крупнейший банк России. Обрабатывает персональные данные клиентов для предоставления банковских услуг.',
        website: 'https://sberbank.ru',
        email: 'personaldata@sberbank.ru',
        phone: '8-800-555-5550',
        address: 'г. Москва, ул. Вавилова, д. 19',
        privacyPolicyUrl: 'https://sberbank.ru/privacy',
        removalInstructions: 'Подача заявления через отделение банка или письменное обращение с копией паспорта.',
        isActive: true,
        difficultyLevel: 'medium',
        responseTime: '1-2 недели',
        tags: ['банк', 'кредитная история', 'финансовые данные'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'broker_2',
        name: 'МТС',
        legalName: 'ПАО "Мобильные ТелеСистемы"',
        category: 'телеком',
        description: 'Крупнейший оператор сотовой связи. Хранит данные абонентов, историю звонков, SMS.',
        website: 'https://mts.ru',
        email: 'privacy@mts.ru',
        phone: '8-800-250-0890',
        address: 'г. Москва, ул. Марксистская, д. 4',
        privacyPolicyUrl: 'https://mts.ru/personal-data',
        removalInstructions: 'Обращение в офис МТС с паспортом или через личный кабинет.',
        isActive: true,
        difficultyLevel: 'easy',
        responseTime: '3-5 дней',
        tags: ['телеком', 'мобильная связь', 'геолокация'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'broker_3',
        name: 'Яндекс',
        legalName: 'ООО "Яндекс"',
        category: 'технологии',
        description: 'Интернет-компания. Собирает поисковые запросы, данные браузера, поведенческие данные.',
        website: 'https://yandex.ru',
        email: 'dataprotection@yandex.ru',
        phone: '8-800-234-24-80',
        address: 'г. Москва, ул. Льва Толстого, д. 16',
        privacyPolicyUrl: 'https://yandex.ru/legal/confidential',
        removalInstructions: 'Удаление аккаунта через настройки Яндекс ID.',
        isActive: true,
        difficultyLevel: 'medium',
        responseTime: '1-2 недели',
        tags: ['поисковик', 'реклама', 'поведенческие данные'],
        createdAt: now,
        updatedAt: now,
      }
    ];
  }

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
      emailVerificationExpires: null,
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
      userId: profileData.userId,
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
      // New viral sharing fields
      username: null,
      isPublic: false,
      privacyScore: 0,
      stats: { totalScans: 0, totalDeletions: 0 },
      shareImageVersion: 1,
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

  async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification | undefined> {
    const index = this.notificationsData.findIndex(notif => notif.id === id);
    if (index === -1) return undefined;
    
    this.notificationsData[index] = { ...this.notificationsData[index], ...updates };
    return this.notificationsData[index];
  }

  async deleteNotification(id: string): Promise<boolean> {
    const index = this.notificationsData.findIndex(notif => notif.id === id);
    if (index === -1) return false;
    
    this.notificationsData.splice(index, 1);
    return true;
  }

  // OAuth operations (in-memory)
  async getOAuthAccountByProviderAndId(provider: string, providerUserId: string): Promise<OAuthAccount | undefined> {
    return this.oauthAccountsData.find(acc => 
      acc.provider === provider && acc.providerUserId === providerUserId
    );
  }

  async linkOAuthAccount(userId: string, oauthData: InsertOAuthAccount): Promise<OAuthAccount> {
    const now = new Date();
    const account: OAuthAccount = {
      id: `oauth_${this.idCounter++}_${Date.now()}`,
      userId,
      provider: oauthData.provider,
      providerUserId: oauthData.providerUserId,
      email: oauthData.email || null,
      profile: oauthData.profile || {},
      scope: oauthData.scope || null,
      accessTokenHash: oauthData.accessTokenHash || null,
      refreshTokenHash: oauthData.refreshTokenHash || null,
      expiresAt: oauthData.expiresAt || null,
      emailVerified: oauthData.emailVerified || false,
      createdAt: now,
      updatedAt: now,
    };
    
    this.oauthAccountsData.push(account);
    return account;
  }

  async listUserOAuthAccounts(userId: string): Promise<OAuthAccount[]> {
    return this.oauthAccountsData
      .filter(acc => acc.userId === userId)
      .sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt ? b.createdAt.getTime() : 0;
        return timeB - timeA;
      });
  }

  async unlinkOAuthAccount(oauthAccountId: string): Promise<boolean> {
    const index = this.oauthAccountsData.findIndex(acc => acc.id === oauthAccountId);
    if (index === -1) return false;
    
    this.oauthAccountsData.splice(index, 1);
    return true;
  }

  async updateOAuthTokens(
    oauthAccountId: string, 
    tokens: { accessTokenHash?: string; refreshTokenHash?: string; expiresAt?: Date }
  ): Promise<OAuthAccount | undefined> {
    const index = this.oauthAccountsData.findIndex(acc => acc.id === oauthAccountId);
    if (index === -1) return undefined;
    
    this.oauthAccountsData[index] = {
      ...this.oauthAccountsData[index],
      ...tokens,
      updatedAt: new Date(),
    };
    return this.oauthAccountsData[index];
  }

  // Data brokers directory operations (in-memory)
  async getAllDataBrokers(filters?: {
    search?: string;
    category?: string;
    difficulty?: string;
  }): Promise<DataBroker[]> {
    let result = this.dataBrokersData.filter(broker => broker.isActive);
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(broker => 
        broker.name.toLowerCase().includes(searchTerm) ||
        broker.description?.toLowerCase().includes(searchTerm) ||
        broker.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    if (filters?.category && filters.category !== 'all') {
      result = result.filter(broker => broker.category === filters.category);
    }
    
    if (filters?.difficulty && filters.difficulty !== 'all') {
      result = result.filter(broker => broker.difficultyLevel === filters.difficulty);
    }
    
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getDataBrokerById(id: string): Promise<DataBroker | null> {
    return this.dataBrokersData.find(broker => broker.id === id) || null;
  }

  async insertDataBroker(brokerData: InsertDataBroker): Promise<DataBroker> {
    const now = new Date();
    const broker: DataBroker = {
      id: `broker_${this.idCounter++}_${Date.now()}`,
      name: brokerData.name,
      category: brokerData.category,
      difficultyLevel: brokerData.difficultyLevel ?? 'medium',
      legalName: brokerData.legalName ?? null,
      description: brokerData.description ?? null,
      website: brokerData.website ?? null,
      email: brokerData.email ?? null,
      phone: brokerData.phone ?? null,
      address: brokerData.address ?? null,
      privacyPolicyUrl: brokerData.privacyPolicyUrl ?? null,
      removalInstructions: brokerData.removalInstructions ?? null,
      responseTime: brokerData.responseTime ?? null,
      tags: brokerData.tags ?? null,
      isActive: brokerData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    
    this.dataBrokersData.push(broker);
    return broker;
  }

  async updateDataBroker(id: string, updates: Partial<InsertDataBroker>): Promise<DataBroker> {
    const index = this.dataBrokersData.findIndex(broker => broker.id === id);
    if (index === -1) {
      throw new Error(`Data broker with id ${id} not found`);
    }
    
    this.dataBrokersData[index] = {
      ...this.dataBrokersData[index],
      ...updates,
      name: updates.name ?? this.dataBrokersData[index].name,
      category: updates.category ?? this.dataBrokersData[index].category,
      difficultyLevel: updates.difficultyLevel ?? this.dataBrokersData[index].difficultyLevel,
      legalName: updates.legalName ?? this.dataBrokersData[index].legalName,
      description: updates.description ?? this.dataBrokersData[index].description,
      website: updates.website ?? this.dataBrokersData[index].website,
      email: updates.email ?? this.dataBrokersData[index].email,
      phone: updates.phone ?? this.dataBrokersData[index].phone,
      address: updates.address ?? this.dataBrokersData[index].address,
      privacyPolicyUrl: updates.privacyPolicyUrl ?? this.dataBrokersData[index].privacyPolicyUrl,
      removalInstructions: updates.removalInstructions ?? this.dataBrokersData[index].removalInstructions,
      responseTime: updates.responseTime ?? this.dataBrokersData[index].responseTime,
      tags: updates.tags ?? this.dataBrokersData[index].tags,
      updatedAt: new Date(),
    };
    return this.dataBrokersData[index];
  }

  async deleteDataBroker(id: string): Promise<void> {
    const index = this.dataBrokersData.findIndex(broker => broker.id === id);
    if (index !== -1) {
      this.dataBrokersData.splice(index, 1);
    }
  }

  // Demo account seeding for development (MemStorage)
  async seedDemoAccount(): Promise<void> {
    console.log('🌱 Seeding demo account (MemStorage)...');
    
    const demoEmail = 'demo@rescrub.ru';
    const demoPassword = 'demo123';
    
    // Check if demo user already exists
    let userAccount = this.userAccountsData.find(acc => acc.email === demoEmail);
    
    if (!userAccount) {
      userAccount = await this.createUserAccount({
        email: demoEmail,
        password: demoPassword,
      });
      
      // Verify email immediately
      const verifiedAccount = await this.updateUserAccount(userAccount.id, {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      });
      console.log(`✅ Created verified demo user: ${demoEmail}`);
    } else {
      console.log(`✅ Demo user already exists: ${demoEmail}`);
    }

    // Create or update demo user profile
    let userProfile = this.userProfilesData.find(profile => profile.userId === userAccount.id);
    if (!userProfile) {
      userProfile = await this.createUserProfile({
        userId: userAccount.id,
        firstName: 'Демо',
        lastName: 'Пользователь',
        phone: '+7 900 000-00-00',
      });
      console.log('✅ Created demo user profile');
    }

    // Seed demo data
    await this.seedDemoData(userAccount.id);
    console.log('🎉 Demo account seeding completed!');
    console.log(`📧 Login: ${demoEmail}`);
    console.log(`🔑 Password: ${demoPassword}`);
  }

  async seedSubscriptionPlans(): Promise<void> {
    if (this.subscriptionPlansData.length > 0) {
      return; // Планы уже созданы
    }

    const plans = [
      {
        name: 'basic',
        displayName: 'Базовый',
        description: 'Основная защита персональных данных',
        price: 499,
        currency: 'RUB',
        interval: 'month',
        intervalCount: 1,
        features: ['До 5 запросов на удаление в месяц', 'Базовое сканирование данных', 'Email поддержка'],
        maxScans: 5,
        maxDeletionRequests: 10,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'premium',
        displayName: 'Премиум',
        description: 'Расширенная защита с приоритетной поддержкой',
        price: 999,
        currency: 'RUB',
        interval: 'month',
        intervalCount: 1,
        features: ['До 25 запросов на удаление в месяц', 'Расширенное сканирование', 'Приоритетная поддержка', 'Автоматические уведомления'],
        maxScans: 25,
        maxDeletionRequests: 50,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'enterprise',
        displayName: 'Корпоративный',
        description: 'Максимальная защита для бизнеса',
        price: 2499,
        currency: 'RUB',
        interval: 'month',
        intervalCount: 1,
        features: ['Неограниченные запросы на удаление', 'Полное сканирование всех брокеров', '24/7 поддержка', 'API доступ', 'Корпоративная отчетность'],
        maxScans: -1, // unlimited
        maxDeletionRequests: -1, // unlimited
        isActive: true,
        sortOrder: 3
      }
    ];

    for (const planData of plans) {
      await this.createSubscriptionPlan(planData);
    }

    console.log('✅ Subscription plans seeded successfully');
  }

  private async seedDemoData(userId: string): Promise<void> {
    // Clear existing demo data for idempotency  
    const existingRequests = this.deletionRequestsData.filter(req => req.userId === userId);
    if (existingRequests.length > 0) {
      console.log('✅ Demo data already exists, skipping seeding');
      return;
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Create deletion requests in various statuses
    const sberRequest = await this.createDeletionRequest({
      userId,
      brokerName: 'Сбербанк',
      requestType: 'deletion',
      requestMethod: 'email',
      requestDetails: {
        contactEmail: 'personaldata@sberbank.ru',
        personalInfo: { firstName: 'Демо', lastName: 'Пользователь', email: 'demo@rescrub.ru' }
      },
    });
    await this.updateDeletionRequest(sberRequest.id, {
      status: 'sent',
      sentAt: weekAgo,
    });

    const mtsRequest = await this.createDeletionRequest({
      userId,
      brokerName: 'МТС',  
      requestType: 'deletion',
      requestMethod: 'phone',
      requestDetails: {
        contactPhone: '8-800-250-0890',
        personalInfo: { firstName: 'Демо', lastName: 'Пользователь', phone: '+7 900 000-00-00' }
      },
    });
    await this.updateDeletionRequest(mtsRequest.id, {
      status: 'processing',
      followUpRequired: true,
      followUpDate: weekLater,
    });

    const yandexRequest = await this.createDeletionRequest({
      userId,
      brokerName: 'Яндекс',
      requestType: 'deletion',
      requestMethod: 'email',
      requestDetails: {
        contactEmail: 'dataprotection@yandex.ru',
        personalInfo: { firstName: 'Демо', lastName: 'Пользователь', email: 'demo@rescrub.ru' }
      },
    });
    await this.updateDeletionRequest(yandexRequest.id, {
      status: 'completed',
      completedAt: now,
    });

    // Create demo documents
    const passportDoc = await this.createDocument({
      userId,
      category: 'passport',
      filename: 'passport_scan.pdf',
      originalName: 'Паспорт_РФ_сканкопия.pdf',
      mimeType: 'application/pdf',
      fileSize: 2048576,
      filePath: '/uploads/passport_scan.pdf',
      description: 'Сканкопия паспорта РФ',
    });
    await this.updateDocumentStatus(passportDoc.id, 'verified', 'Документ успешно верифицирован');

    const powerDoc = await this.createDocument({
      userId,
      category: 'power_of_attorney',
      filename: 'power_of_attorney.pdf',
      originalName: 'Доверенность_нотариальная.pdf',
      mimeType: 'application/pdf',
      fileSize: 1024768,
      filePath: '/uploads/power_of_attorney.pdf',
      description: 'Нотариальная доверенность',
    });
    await this.updateDocumentStatus(powerDoc.id, 'processing', 'Документ на проверке');

    // Create demo data broker scan
    const scan = await this.createDataBrokerScan({
      userId,
      brokerName: 'Комплексное сканирование',
      dataFound: true,
      recordsFound: 5,
      dataTypes: ['email', 'phone', 'address'],
    });
    await this.updateScanStatus(scan.id, 'completed', {
      brokers: ['Сбербанк', 'МТС', 'Яндекс'],
      summary: 'Найдены персональные данные в 3 источниках'
    });

    // Create demo notifications
    await this.createNotification({
      userId,
      type: 'in_app',
      category: 'scan_completed',
      title: 'Сканирование завершено',
      message: 'Найдены персональные данные в 3 источниках. Рекомендуем отправить запросы на удаление.',
    });

    await this.createNotification({
      userId,
      type: 'in_app',
      category: 'deletion_request',
      title: 'Запрос отправлен в Сбербанк',
      message: 'Ваш запрос на удаление персональных данных успешно отправлен.',
    });

    console.log('✅ Demo data seeded successfully');
  }

  // ========================================
  // SUBSCRIPTION OPERATIONS (MemStorage)
  // ========================================

  // Subscription plan operations
  async createSubscriptionPlan(planData: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const now = new Date();
    const plan: SubscriptionPlan = {
      id: `plan_${this.idCounter++}_${Date.now()}`,
      ...planData,
      description: planData.description || null,
      currency: planData.currency || 'RUB',
      intervalCount: planData.intervalCount || 1,
      features: planData.features || [],
      maxScans: planData.maxScans || 10,
      maxDeletionRequests: planData.maxDeletionRequests || 50,
      isActive: planData.isActive ?? true,
      sortOrder: planData.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    this.subscriptionPlansData.push(plan);
    return plan;
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlansData
      .filter(plan => plan.isActive)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.price - b.price);
  }

  async getSubscriptionPlanById(id: string): Promise<SubscriptionPlan | null> {
    return this.subscriptionPlansData.find(plan => plan.id === id) || null;
  }

  async updateSubscriptionPlan(id: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
    const index = this.subscriptionPlansData.findIndex(plan => plan.id === id);
    if (index === -1) return null;
    
    this.subscriptionPlansData[index] = {
      ...this.subscriptionPlansData[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.subscriptionPlansData[index];
  }

  // Subscription operations
  async createSubscription(subscriptionData: InsertSubscription): Promise<Subscription> {
    const now = new Date();
    const subscription: Subscription = {
      id: `sub_${this.idCounter++}_${Date.now()}`,
      ...subscriptionData,
      status: subscriptionData.status || 'pending',
      cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd ?? false,
      currentPeriodStart: subscriptionData.currentPeriodStart || null,
      currentPeriodEnd: subscriptionData.currentPeriodEnd || null,
      cancelledAt: subscriptionData.cancelledAt || null,
      robokassaInvoiceId: subscriptionData.robokassaInvoiceId || null,
      trialEnd: subscriptionData.trialEnd || null,
      metadata: subscriptionData.metadata || {},
      createdAt: now,
      updatedAt: now,
    };
    this.subscriptionsData.push(subscription);
    return subscription;
  }

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    const userSubscriptions = this.subscriptionsData
      .filter(sub => sub.userId === userId)
      .sort((a, b) => {
        const aTime = a.createdAt?.getTime() || 0;
        const bTime = b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });
    return userSubscriptions[0] || null;
  }

  async getSubscriptionById(id: string): Promise<Subscription | null> {
    return this.subscriptionsData.find(sub => sub.id === id) || null;
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | null> {
    const index = this.subscriptionsData.findIndex(sub => sub.id === id);
    if (index === -1) return null;
    
    this.subscriptionsData[index] = {
      ...this.subscriptionsData[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.subscriptionsData[index];
  }

  async cancelSubscription(id: string): Promise<Subscription | null> {
    const index = this.subscriptionsData.findIndex(sub => sub.id === id);
    if (index === -1) return null;
    
    this.subscriptionsData[index] = {
      ...this.subscriptionsData[index],
      status: 'cancelled',
      cancelledAt: new Date(),
      updatedAt: new Date(),
    };
    return this.subscriptionsData[index];
  }

  // Payment operations
  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const now = new Date();
    const payment: Payment = {
      id: `pay_${this.idCounter++}_${Date.now()}`,
      ...paymentData,
      currency: paymentData.currency || 'RUB',
      status: paymentData.status || 'pending',
      paymentMethod: paymentData.paymentMethod || null,
      robokassaTransactionId: paymentData.robokassaTransactionId || null,
      parentInvoiceId: paymentData.parentInvoiceId || null,
      isRecurring: paymentData.isRecurring ?? false,
      paidAt: paymentData.paidAt || null,
      failedAt: paymentData.failedAt || null,
      failureReason: paymentData.failureReason || null,
      metadata: paymentData.metadata || {},
      createdAt: now,
      updatedAt: now,
    };
    this.paymentsData.push(payment);
    return payment;
  }

  async getPaymentByInvoiceId(invoiceId: string): Promise<Payment | null> {
    return this.paymentsData.find(payment => payment.robokassaInvoiceId === invoiceId) || null;
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | null> {
    const index = this.paymentsData.findIndex(payment => payment.id === id);
    if (index === -1) return null;
    
    this.paymentsData[index] = {
      ...this.paymentsData[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.paymentsData[index];
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return this.paymentsData
      .filter(payment => payment.userId === userId)
      .sort((a, b) => {
        const aTime = a.createdAt?.getTime() || 0;
        const bTime = b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });
  }

  async getPaymentsBySubscription(subscriptionId: string): Promise<Payment[]> {
    return this.paymentsData
      .filter(payment => payment.subscriptionId === subscriptionId)
      .sort((a, b) => {
        const aTime = a.createdAt?.getTime() || 0;
        const bTime = b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });
  }

  // Public profile operations
  async getPublicProfileByUsername(username: string): Promise<UserProfile | undefined> {
    return this.userProfilesData.find(profile => 
      profile.username === username && profile.isPublic === true
    );
  }

  async setUsername(userId: string, username: string): Promise<UserProfile | undefined> {
    const profile = this.userProfilesData.find(p => p.userId === userId);
    if (!profile) return undefined;
    
    profile.username = username;
    profile.updatedAt = new Date();
    return profile;
  }

  async updateUserStats(userId: string, stats: { totalScans?: number; totalDeletions?: number }): Promise<UserProfile | undefined> {
    const profile = this.userProfilesData.find(p => p.userId === userId);
    if (!profile) return undefined;

    const currentStats = profile.stats as any || { totalScans: 0, totalDeletions: 0 };
    const newStats = { ...currentStats, ...stats };
    
    // Calculate privacy score based on activity
    const privacyScore = Math.min(100, Math.floor(
      (newStats.totalScans * 10) + (newStats.totalDeletions * 5)
    ));

    profile.stats = newStats;
    profile.privacyScore = privacyScore;
    profile.updatedAt = new Date();
    
    return profile;
  }

  // Achievement operations
  async getAllAchievements(): Promise<AchievementDefinition[]> {
    return this.achievementDefinitionsData
      .filter(achievement => achievement.isActive)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return this.userAchievementsData
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => {
        const aTime = a.earnedAt?.getTime() || 0;
        const bTime = b.earnedAt?.getTime() || 0;
        return bTime - aTime;
      });
  }

  async awardAchievement(userId: string, achievementKey: string, progress = 1): Promise<UserAchievement | undefined> {
    // Check if achievement already exists
    const existing = this.userAchievementsData.find(
      achievement => achievement.userId === userId && achievement.achievementKey === achievementKey
    );

    if (existing) {
      // Update progress if not completed
      if (!existing.earnedAt && (existing.progress || 0) < (existing.maxProgress || 1)) {
        const newProgress = Math.min(existing.maxProgress || 1, (existing.progress || 0) + progress);
        existing.progress = newProgress;
        if (newProgress >= (existing.maxProgress || 1)) {
          existing.earnedAt = new Date();
        }
      }
      return existing;
    }

    // Create new achievement
    const achievement: UserAchievement = {
      id: `achievement_${this.idCounter++}`,
      userId,
      achievementKey,
      progress,
      maxProgress: 1,
      earnedAt: progress >= 1 ? new Date() : null,
      createdAt: new Date()
    };
    
    this.userAchievementsData.push(achievement);
    return achievement;
  }

  async checkAndAwardAchievements(userId: string, context: { scans?: number; deletions?: number; isPremium?: boolean }): Promise<UserAchievement[]> {
    const awarded: UserAchievement[] = [];

    // First scan achievement
    if (context.scans === 1) {
      const achievement = await this.awardAchievement(userId, 'first_scan');
      if (achievement) awarded.push(achievement);
    }

    // Ten deletions achievement
    if (context.deletions && context.deletions >= 10) {
      const achievement = await this.awardAchievement(userId, 'ten_deletions');
      if (achievement) awarded.push(achievement);
    }

    // Premium member achievement
    if (context.isPremium) {
      const achievement = await this.awardAchievement(userId, 'premium_member');
      if (achievement) awarded.push(achievement);
    }

    return awarded;
  }

  // Referral operations
  async createReferralCode(userId: string): Promise<ReferralCode> {
    // Generate unique 6-character code
    const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();
    let code = generateCode();
    
    // Ensure uniqueness
    while (this.referralCodesData.some(c => c.code === code)) {
      code = generateCode();
    }

    const referralCode: ReferralCode = {
      id: `ref_code_${this.idCounter++}`,
      userId,
      code,
      isActive: true,
      maxUses: 100,
      currentUses: 0,
      createdAt: new Date()
    };
    
    this.referralCodesData.push(referralCode);
    return referralCode;
  }

  async getReferralCodeByUser(userId: string): Promise<ReferralCode | undefined> {
    return this.referralCodesData.find(code => 
      code.userId === userId && code.isActive
    );
  }

  async getReferralCodeByCode(code: string): Promise<ReferralCode | undefined> {
    return this.referralCodesData.find(c => 
      c.code === code && c.isActive
    );
  }

  async createReferral(referralData: InsertReferral): Promise<Referral> {
    // Get referrer ID from the code
    const referralCode = await this.getReferralCodeByCode(referralData.code);
    if (!referralCode) {
      throw new Error('Invalid referral code');
    }

    const referral: Referral = {
      id: `referral_${this.idCounter++}`,
      referrerId: referralCode.userId,
      referredUserId: referralData.referredUserId || null,
      code: referralData.code,
      status: referralData.status || 'clicked',
      rewardGranted: referralData.rewardGranted || false,
      rewardType: referralData.rewardType || null,
      clickedAt: referralData.clickedAt || new Date(),
      signedUpAt: referralData.signedUpAt || null,
      subscribedAt: referralData.subscribedAt || null,
      ipAddress: referralData.ipAddress || null,
      userAgent: referralData.userAgent || null,
      createdAt: new Date()
    };
    
    this.referralsData.push(referral);
    
    // Increment code usage
    const code = this.referralCodesData.find(c => c.code === referralData.code);
    if (code) {
      code.currentUses = (code.currentUses || 0) + 1;
    }
    
    return referral;
  }

  async getReferralsByUser(userId: string): Promise<Referral[]> {
    return this.referralsData
      .filter(referral => referral.referrerId === userId)
      .sort((a, b) => {
        const aTime = a.createdAt?.getTime() || 0;
        const bTime = b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });
  }

  async updateReferralStatus(id: string, status: string, rewardType?: string): Promise<Referral | undefined> {
    const referral = this.referralsData.find(r => r.id === id);
    if (!referral) return undefined;

    referral.status = status;
    if (status === 'subscribed' && rewardType) {
      referral.subscribedAt = new Date();
      referral.rewardType = rewardType;
      referral.rewardGranted = true;
    } else if (status === 'signed_up') {
      referral.signedUpAt = new Date();
    }

    return referral;
  }

  async getRecentReferralClicks(ipAddress: string, code: string, timeWindowMs: number): Promise<Referral[]> {
    const cutoffTime = new Date(Date.now() - timeWindowMs);
    return this.referralsData.filter(referral => 
      referral.ipAddress === ipAddress &&
      referral.code === code &&
      referral.clickedAt &&
      referral.clickedAt > cutoffTime
    );
  }

  async getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    successfulReferrals: number;
    totalRewards: number;
    activeCode?: string;
  }> {
    const userReferrals = this.referralsData.filter(r => r.referrerId === userId);
    const successfulReferrals = userReferrals.filter(r => r.status === 'subscribed');
    const activeCode = await this.getReferralCodeByUser(userId);

    return {
      totalReferrals: userReferrals.length,
      successfulReferrals: successfulReferrals.length,
      totalRewards: successfulReferrals.length * 50, // 50% reward per successful referral
      activeCode: activeCode?.code
    };
  }

  // Seed achievements
  async seedAchievements(): Promise<void> {
    const achievements = [
      {
        id: `achievement_def_${this.idCounter++}`,
        key: 'first_scan',
        title: 'Первый шаг',
        description: 'Выполнил первое сканирование данных',
        icon: 'search',
        category: 'privacy',
        points: 10,
        isSecret: false,
        sortOrder: 1,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: `achievement_def_${this.idCounter++}`,
        key: 'ten_deletions',
        title: 'Защитник приватности',
        description: 'Отправил 10 запросов на удаление данных',
        icon: 'shield',
        category: 'privacy',
        points: 50,
        isSecret: false,
        sortOrder: 2,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: `achievement_def_${this.idCounter++}`,
        key: 'premium_member',
        title: 'Премиум пользователь',
        description: 'Оформил премиум подписку',
        icon: 'crown',
        category: 'premium',
        points: 25,
        isSecret: false,
        sortOrder: 3,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: `achievement_def_${this.idCounter++}`,
        key: 'invite_1',
        title: 'Первый друг',
        description: 'Пригласил первого друга',
        icon: 'user-plus',
        category: 'social',
        points: 15,
        isSecret: false,
        sortOrder: 4,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: `achievement_def_${this.idCounter++}`,
        key: 'invite_5',
        title: 'Амбассадор',
        description: 'Пригласил 5 друзей',
        icon: 'users',
        category: 'social',
        points: 100,
        isSecret: false,
        sortOrder: 5,
        isActive: true,
        createdAt: new Date()
      }
    ];

    this.achievementDefinitionsData = achievements;
    console.log('✅ Achievements seeded successfully');
  }
}

// Choose storage implementation
// Use MemStorage for development, DatabaseStorage for production
// TEMP: Force PostgreSQL to access production data for monitoring
const USE_MEMORY_STORAGE = false; // process.env.NODE_ENV === 'development';
export const storage = USE_MEMORY_STORAGE ? new MemStorage() : new DatabaseStorage();

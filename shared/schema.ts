import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Support tickets table
export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  category: varchar("category").notNull(),
  priority: varchar("priority").notNull(),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  status: varchar("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;

// ====================
// NEW USER ACCOUNT SYSTEM
// ====================

// User accounts table for email-based authentication
export const userAccounts = pgTable("user_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  lastLoginAt: timestamp("last_login_at"),
  points: integer("points").default(0).notNull(), // Points system: 1 point = 1 ruble
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User profiles table for extended user information
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => userAccounts.id, { onDelete: "cascade" }),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  middleName: varchar("middle_name"),
  phone: varchar("phone").unique(),
  phoneVerified: boolean("phone_verified").default(false),
  dateOfBirth: timestamp("date_of_birth"),
  address: text("address"),
  city: varchar("city"),
  region: varchar("region"),
  postalCode: varchar("postal_code"),
  country: varchar("country").default("RU"),
  notificationPreferences: jsonb("notification_preferences").default(sql`'{}'::jsonb`),
  privacySettings: jsonb("privacy_settings").default(sql`'{}'::jsonb`),
  // Public profile fields for viral sharing
  username: varchar("username").unique(),
  isPublic: boolean("is_public").default(false),
  privacyScore: integer("privacy_score").default(0), // 0-100 score based on data protection actions
  stats: jsonb("stats").default(sql`'{"totalScans": 0, "totalDeletions": 0}'::jsonb`),
  shareImageVersion: integer("share_image_version").default(1), // for cache busting OG images
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Phone verification table
export const phoneVerifications = pgTable("phone_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  phone: varchar("phone").notNull(),
  verificationCode: varchar("verification_code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  attempts: integer("attempts").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Documents table for file uploads
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name").notNull(),
  mimeType: varchar("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  category: varchar("category").notNull(), // 'passport', 'power_of_attorney', 'other'
  status: varchar("status").notNull().default("uploaded"), // 'uploaded', 'processing', 'verified', 'rejected'
  description: text("description"),
  filePath: varchar("file_path").notNull(),
  processingNotes: text("processing_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Data brokers directory (Russian operators reference)
export const dataBrokers = pgTable("data_brokers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  legalName: varchar("legal_name"),
  category: varchar("category").notNull(), // "банк", "телеком", "ритейл", "недвижимость", "государственный", "другое"
  description: text("description"),
  website: varchar("website"),
  email: varchar("email"),
  phone: varchar("phone"),
  address: text("address"),
  privacyPolicyUrl: varchar("privacy_policy_url"),
  removalInstructions: text("removal_instructions"),
  isActive: boolean("is_active").default(true),
  difficultyLevel: varchar("difficulty_level").notNull().default("medium"), // "easy", "medium", "hard"
  responseTime: varchar("response_time"), // "1-3 дня", "неделя", "месяц", "не отвечают"
  tags: text("tags").array(), // ["банк", "кредитная история", "персональные данные"]
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Data broker scan results
export const dataBrokerScans = pgTable("data_broker_scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  brokerName: varchar("broker_name").notNull(),
  brokerUrl: varchar("broker_url"),
  dataFound: boolean("data_found").default(false),
  recordsFound: integer("records_found").default(0),
  dataTypes: jsonb("data_types").default(sql`'[]'::jsonb`), // Array of found data types
  scanStatus: varchar("scan_status").notNull().default("pending"), // 'pending', 'scanning', 'completed', 'failed'
  lastScanAt: timestamp("last_scan_at"),
  nextScanAt: timestamp("next_scan_at"),
  scanResults: jsonb("scan_results").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Deletion requests to data brokers
export const deletionRequests = pgTable("deletion_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  scanId: varchar("scan_id").references(() => dataBrokerScans.id, { onDelete: "cascade" }),
  brokerName: varchar("broker_name").notNull(),
  requestType: varchar("request_type").notNull(), // 'deletion', 'correction', 'access'
  status: varchar("status").notNull().default("pending"), // 'pending', 'sent', 'processing', 'completed', 'rejected', 'failed'
  requestMethod: varchar("request_method"), // 'email', 'form', 'api', 'postal'
  requestDetails: jsonb("request_details").default(sql`'{}'::jsonb`),
  sentAt: timestamp("sent_at"),
  responseReceived: boolean("response_received").default(false),
  responseDetails: jsonb("response_details").default(sql`'{}'::jsonb`),
  completedAt: timestamp("completed_at"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(), // 'email', 'sms', 'push', 'in_app'
  category: varchar("category").notNull(), // 'scan_completed', 'deletion_request', 'verification', 'system'
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data").default(sql`'{}'::jsonb`),
  read: boolean("read").default(false),
  sent: boolean("sent").default(false),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscription plans table
export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // "basic", "premium", "pro"
  displayName: varchar("display_name").notNull(), // "Базовый", "Премиум", "Профессиональный"
  description: text("description"),
  price: integer("price").notNull(), // в копейках
  currency: varchar("currency").notNull().default("RUB"),
  interval: varchar("interval").notNull(), // "month", "year"
  intervalCount: integer("interval_count").notNull().default(1), // каждые N интервалов
  features: jsonb("features").default(sql`'[]'::jsonb`), // массив строк с возможностями
  maxScans: integer("max_scans").notNull().default(10), // лимит сканирований
  maxDeletionRequests: integer("max_deletion_requests").notNull().default(50),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  planId: varchar("plan_id").notNull().references(() => subscriptionPlans.id, { onDelete: "cascade" }),
  status: varchar("status").notNull().default("pending"), // "pending", "active", "cancelled", "expired", "suspended"
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  cancelledAt: timestamp("cancelled_at"),
  robokassaInvoiceId: varchar("robokassa_invoice_id").unique(), // ID первого (материнского) платежа
  trialEnd: timestamp("trial_end"), // конец пробного периода
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_user_subscription").on(table.userId),
  index("IDX_subscription_status").on(table.status),
]);

// Payment transactions table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriptionId: varchar("subscription_id").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // в копейках
  currency: varchar("currency").notNull().default("RUB"),
  status: varchar("status").notNull().default("pending"), // "pending", "paid", "failed", "refunded", "cancelled"
  paymentMethod: varchar("payment_method"), // "card", "wallet", "sberbank", etc
  robokassaInvoiceId: varchar("robokassa_invoice_id").unique().notNull(),
  robokassaTransactionId: varchar("robokassa_transaction_id"),
  parentInvoiceId: varchar("parent_invoice_id"), // для периодических платежей
  isRecurring: boolean("is_recurring").default(false), // true для периодических платежей
  paidAt: timestamp("paid_at"),
  failedAt: timestamp("failed_at"),
  failureReason: text("failure_reason"),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_payment_subscription").on(table.subscriptionId),
  index("IDX_payment_user").on(table.userId),
  index("IDX_payment_status").on(table.status),
  index("IDX_payment_robokassa_invoice").on(table.robokassaInvoiceId),
]);

// OAuth accounts table for third-party authentication
export const oauthAccounts = pgTable("oauth_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  provider: varchar("provider").notNull(), // 'vk', 'yandex', 'sberbank', 'tbank', 'esia'
  providerUserId: varchar("provider_user_id").notNull(), // sub/id from OAuth provider
  email: varchar("email"), // email from provider (may differ from userAccounts.email)
  profile: jsonb("profile").default(sql`'{}'::jsonb`), // additional data: name, phone, etc
  scope: varchar("scope"), // granted scopes
  accessTokenHash: varchar("access_token_hash"), // hashed access token for security
  refreshTokenHash: varchar("refresh_token_hash"), // hashed refresh token for security
  expiresAt: timestamp("expires_at"), // when access token expires
  emailVerified: boolean("email_verified").default(false), // was email verified by provider
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_oauth_user_id").on(table.userId),
  index("IDX_oauth_provider_email").on(table.provider, table.email),
  // Unique constraint: one provider user = one OAuth account
  sql`UNIQUE (provider, provider_user_id)`,
]);

// ====================
// SCHEMAS AND TYPES
// ====================

// User account schemas
export const insertUserAccountSchema = createInsertSchema(userAccounts).omit({
  id: true,
  emailVerified: true,
  emailVerificationToken: true,
  passwordResetToken: true,
  passwordResetExpires: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(8), // Accept plaintext password, not passwordHash
}).omit({ passwordHash: true });

export const insertPhoneVerificationSchema = createInsertSchema(phoneVerifications).omit({
  id: true,
  verified: true,
  attempts: true,
  createdAt: true,
});

export const insertDataBrokerScanSchema = createInsertSchema(dataBrokerScans).omit({
  id: true,
  dataFound: true,
  recordsFound: true,
  dataTypes: true,
  scanStatus: true,
  lastScanAt: true,
  nextScanAt: true,
  scanResults: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  phoneVerified: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  status: true,
  processingNotes: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeletionRequestSchema = createInsertSchema(deletionRequests).omit({
  id: true,
  status: true,
  sentAt: true,
  responseReceived: true,
  responseDetails: true,
  completedAt: true,
  followUpRequired: true,
  followUpDate: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  read: true,
  createdAt: true,
});

export const insertOAuthAccountSchema = createInsertSchema(oauthAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDataBrokerSchema = createInsertSchema(dataBrokers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Subscription schemas
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UserAccount = typeof userAccounts.$inferSelect;
export type InsertUserAccount = z.infer<typeof insertUserAccountSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type PhoneVerification = typeof phoneVerifications.$inferSelect;
export type InsertPhoneVerification = z.infer<typeof insertPhoneVerificationSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type DataBrokerScan = typeof dataBrokerScans.$inferSelect;
export type InsertDataBrokerScan = z.infer<typeof insertDataBrokerScanSchema>;
export type DeletionRequest = typeof deletionRequests.$inferSelect;
export type InsertDeletionRequest = z.infer<typeof insertDeletionRequestSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type OAuthAccount = typeof oauthAccounts.$inferSelect;
export type InsertOAuthAccount = z.infer<typeof insertOAuthAccountSchema>;
export type DataBroker = typeof dataBrokers.$inferSelect;
export type InsertDataBroker = z.infer<typeof insertDataBrokerSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

// ====================
// ACHIEVEMENTS SYSTEM
// ====================

// Achievement definitions - catalog of all available achievements
export const achievementDefinitions = pgTable("achievement_definitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull().unique(), // 'first_scan', 'ten_deletions', 'premium_member', etc
  title: varchar("title").notNull(), // "Первое сканирование"
  description: text("description").notNull(), // "Выполнил первое сканирование данных"
  icon: varchar("icon").notNull().default("shield"), // lucide-react icon name
  category: varchar("category").notNull().default("general"), // 'privacy', 'social', 'premium'
  points: integer("points").default(10), // points awarded for this achievement
  isSecret: boolean("is_secret").default(false), // hidden until earned
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements - which achievements each user has earned
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  achievementKey: varchar("achievement_key").notNull().references(() => achievementDefinitions.key, { onDelete: "cascade" }),
  progress: integer("progress").default(0), // for progressive achievements
  maxProgress: integer("max_progress").default(1), // target for completion
  earnedAt: timestamp("earned_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_user_achievements_user").on(table.userId),
  // Prevent duplicate achievements
  sql`UNIQUE (user_id, achievement_key)`,
]);

// ====================
// REFERRAL SYSTEM
// ====================

// Referral codes generated by users
export const referralCodes = pgTable("referral_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  code: varchar("code").notNull().unique(), // 6-8 char unique code
  isActive: boolean("is_active").default(true),
  maxUses: integer("max_uses").default(100), // limit on referral uses
  currentUses: integer("current_uses").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_referral_codes_user").on(table.userId),
  index("IDX_referral_codes_code").on(table.code),
]);

// Individual referrals (who clicked/signed up)
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  referredUserId: varchar("referred_user_id").references(() => userAccounts.id, { onDelete: "set null" }), // null if just clicked
  code: varchar("code").notNull().references(() => referralCodes.code, { onDelete: "cascade" }),
  status: varchar("status").notNull().default("clicked"), // 'clicked', 'signed_up', 'subscribed'
  rewardGranted: boolean("reward_granted").default(false),
  rewardType: varchar("reward_type"), // 'discount_30', 'free_month', etc
  clickedAt: timestamp("clicked_at").defaultNow(),
  signedUpAt: timestamp("signed_up_at"),
  subscribedAt: timestamp("subscribed_at"),
  ipAddress: varchar("ip_address"), // basic fraud prevention
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_referrals_referrer").on(table.referrerId),
  index("IDX_referrals_referred").on(table.referredUserId),
  index("IDX_referrals_code").on(table.code),
]);

// ====================
// ACHIEVEMENT SCHEMAS AND TYPES
// ====================

export const insertAchievementDefinitionSchema = createInsertSchema(achievementDefinitions).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  createdAt: true,
});

export const insertReferralCodeSchema = createInsertSchema(referralCodes).omit({
  id: true,
  currentUses: true,
  createdAt: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export type AchievementDefinition = typeof achievementDefinitions.$inferSelect;

// ====================
// BLOG SYSTEM FOR AUTO-GENERATED ARTICLES
// ====================

// Auto-generated blog articles table
export const blogArticles = pgTable("blog_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull().unique(), // URL-friendly version for routing
  content: text("content").notNull(), // Main article content (markdown/html)
  excerpt: text("excerpt"), // Short description for article lists
  category: varchar("category").notNull().default("data-protection"), // "data-protection", "privacy-laws", "security-tips", "news"
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`), // Array of tags for organization
  seoTitle: varchar("seo_title"), // SEO-optimized title
  seoDescription: text("seo_description"), // SEO meta description
  status: varchar("status").notNull().default("draft"), // "draft", "published", "archived"
  publishedAt: timestamp("published_at"),
  generatedBy: varchar("generated_by").default("openai-gpt-4"), // AI model used for generation
  authorName: varchar("author_name").default("ResCrub AI"), // Display author name
  readingTime: integer("reading_time").default(5), // Estimated reading time in minutes
  isAutoGenerated: boolean("is_auto_generated").default(true), // Flag for auto-generated content
  relatedTopics: text("related_topics").array().notNull().default(sql`ARRAY[]::text[]`), // Related topics for cross-linking
  viewCount: integer("view_count").default(0), // Article view counter
  featured: boolean("featured").default(false), // Featured article flag
  generationPrompt: text("generation_prompt"), // Original prompt used for generation (for debugging)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_blog_articles_status_published").on(table.status, table.publishedAt),
  index("IDX_blog_articles_category_status_published").on(table.category, table.status, table.publishedAt),
  index("IDX_blog_articles_featured").on(table.featured),
]);

// Blog article generation settings table
export const blogGenerationSettings = pgTable("blog_generation_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  isEnabled: boolean("is_enabled").default(true), // Enable/disable auto-generation
  frequency: varchar("frequency").notNull().default("daily"), // "hourly", "daily", "weekly"
  maxArticlesPerDay: integer("max_articles_per_day").default(3), // Limit on daily article generation
  topics: text("topics").array().default(sql`ARRAY['защита персональных данных', 'права пользователей', 'кибербезопасность', '152-ФЗ', 'GDPR в России']::text[]`), // Topic pool for generation
  contentLength: varchar("content_length").default("medium"), // "short", "medium", "long"
  targetAudience: varchar("target_audience").default("general"), // "general", "business", "technical"
  seoOptimized: boolean("seo_optimized").default(true), // Generate SEO-optimized content
  includeStats: boolean("include_stats").default(true), // Include Russian data protection statistics
  lastGeneratedAt: timestamp("last_generated_at"),
  nextGenerationAt: timestamp("next_generation_at"),
  generationHistory: jsonb("generation_history").default(sql`'[]'::jsonb`), // Log of recent generations
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_blog_generation_next_at").on(table.nextGenerationAt),
]);

// ====================
// BLOG SCHEMAS AND TYPES
// ====================

export const insertBlogArticleSchema = createInsertSchema(blogArticles).omit({
  id: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogGenerationSettingsSchema = createInsertSchema(blogGenerationSettings).omit({
  id: true,
  lastGeneratedAt: true,
  nextGenerationAt: true,
  generationHistory: true,
  createdAt: true,
  updatedAt: true,
});

export type BlogArticle = typeof blogArticles.$inferSelect;
export type InsertBlogArticle = z.infer<typeof insertBlogArticleSchema>;
export type BlogGenerationSettings = typeof blogGenerationSettings.$inferSelect;
export type InsertBlogGenerationSettings = z.infer<typeof insertBlogGenerationSettingsSchema>;
export type InsertAchievementDefinition = z.infer<typeof insertAchievementDefinitionSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type ReferralCode = typeof referralCodes.$inferSelect;
export type InsertReferralCode = z.infer<typeof insertReferralCodeSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;

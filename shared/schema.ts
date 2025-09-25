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
import { BlogCategoryEnum } from "./categories";

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
  isAdmin: boolean("is_admin").default(false), // Admin role for admin panel access
  adminRole: varchar("admin_role").default("user"), // user | admin | superadmin
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
  status: varchar("status").notNull().default("pending"), // 'pending', 'sent', 'processing', 'completed', 'rejected', 'failed', 'initiated', 'sent_initial', 'delivered_initial', 'operator_confirmed', 'reply_deleted', 'followup_sent', 'delivered_followup', 'no_response', 'escalated', 'closed'
  requestMethod: varchar("request_method"), // 'email', 'form', 'api', 'postal'
  requestDetails: jsonb("request_details").default(sql`'{}'::jsonb`),
  sentAt: timestamp("sent_at"),
  responseReceived: boolean("response_received").default(false),
  responseDetails: jsonb("response_details").default(sql`'{}'::jsonb`),
  completedAt: timestamp("completed_at"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  // Новые поля для двухэтапной отправки писем операторам ПД
  trackingId: varchar("tracking_id"), // уникальный ID для отслеживания в email headers
  operatorEmail: varchar("operator_email"), // email оператора ПД
  firstSentAt: timestamp("first_sent_at"), // время отправки первого письма
  followUpSentAt: timestamp("follow_up_sent_at"), // время отправки повторного письма
  responseDeadlineAt: timestamp("response_deadline_at"), // крайний срок ответа
  followUpDueAt: timestamp("follow_up_due_at"), // когда отправить повторное письмо
  escalateDueAt: timestamp("escalate_due_at"), // когда эскалировать в Росреестр
  buttonConfirmedAt: timestamp("button_confirmed_at"), // когда оператор нажал кнопку "удалили"
  lastInboundAt: timestamp("last_inbound_at"), // последний входящий ответ
  escalationSentAt: timestamp("escalation_sent_at"), // время отправки в Росреестр
  initialMessageId: varchar("initial_message_id"), // ID первого письма
  followUpMessageId: varchar("follow_up_message_id"), // ID повторного письма
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inbound emails table для обработки входящих писем от операторов ПД
export const inboundEmails = pgTable("inbound_emails", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deletionRequestId: varchar("deletion_request_id").notNull().references(() => deletionRequests.id, { onDelete: "cascade" }),
  operatorEmail: varchar("operator_email").notNull(),
  subject: varchar("subject"),
  bodyText: text("body_text"),
  bodyHtml: text("body_html"),
  parsedStatus: varchar("parsed_status").notNull(), // 'deleted', 'rejected', 'need_info', 'other'
  headers: jsonb("headers").default(sql`'{}'::jsonb`),
  inReplyTo: varchar("in_reply_to"),
  references: varchar("references"),
  xTrackId: varchar("x_track_id"),
  receivedAt: timestamp("received_at").notNull().defaultNow(),
}, (table) => [
  index("IDX_inbound_emails_deletion_request").on(table.deletionRequestId),
  index("IDX_inbound_emails_operator").on(table.operatorEmail),
  index("IDX_inbound_emails_track_id").on(table.xTrackId),
  index("IDX_inbound_emails_received").on(table.receivedAt),
]);

// Operator action tokens для подтверждения действий операторов ПД
export const operatorActionTokens = pgTable("operator_action_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deletionRequestId: varchar("deletion_request_id").notNull().references(() => deletionRequests.id, { onDelete: "cascade" }),
  token: varchar("token").notNull().unique(), // HMAC токен
  type: varchar("type").notNull(), // 'confirm_deletion'
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  usedByIp: varchar("used_by_ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_operator_tokens_deletion_request").on(table.deletionRequestId),
  index("IDX_operator_tokens_token").on(table.token),
  index("IDX_operator_tokens_expires").on(table.expiresAt),
]);

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
  // Исключаем новые автогенерируемые поля
  firstSentAt: true,
  followUpSentAt: true,
  responseDeadlineAt: true,
  followUpDueAt: true,
  escalateDueAt: true,
  buttonConfirmedAt: true,
  lastInboundAt: true,
  escalationSentAt: true,
  initialMessageId: true,
  followUpMessageId: true,
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

// Insert schemas for new tables
export const insertInboundEmailSchema = createInsertSchema(inboundEmails).omit({
  id: true,
  receivedAt: true, // defaultNow()
});

// Webhook payload validation schema for SendGrid Inbound Parse
export const sendGridInboundWebhookSchema = z.object({
  from: z.string().min(1).max(500).email("Invalid from email address"),
  to: z.string().min(1).max(500),
  subject: z.string().min(1).max(1000),
  text: z.string().max(100000).optional(), // 100KB max for text
  html: z.string().max(200000).optional(), // 200KB max for HTML
  headers: z.string().max(10000).optional(), // JSON string of headers
  envelope: z.string().max(1000).optional(),
  attachments: z.number().int().min(0).max(0).optional(), // We reject attachments for security
});

export const insertOperatorActionTokenSchema = createInsertSchema(operatorActionTokens).omit({
  id: true,
  usedAt: true, // заполняется при использовании
  createdAt: true, // defaultNow()
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
export type InboundEmail = typeof inboundEmails.$inferSelect;
export type InsertInboundEmail = z.infer<typeof insertInboundEmailSchema>;
export type OperatorActionToken = typeof operatorActionTokens.$inferSelect;
export type InsertOperatorActionToken = z.infer<typeof insertOperatorActionTokenSchema>;

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
// ADMIN PANEL TABLES
// ====================

// Platform secrets management - stores encrypted API keys
export const platformSecrets = pgTable("platform_secrets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull().unique(), // 'mailganer_api_key', 'robokassa_merchant_login', etc
  encryptedValue: text("encrypted_value").notNull(), // Encrypted secret value
  description: text("description"), // Description of what this secret is for
  service: varchar("service").notNull(), // 'mailganer', 'robokassa', 'openai', 'sendgrid'
  environment: varchar("environment").notNull().default("production"), // 'development', 'staging', 'production'
  lastRotatedAt: timestamp("last_rotated_at"), // When the secret was last changed
  expiresAt: timestamp("expires_at"), // When the secret expires (optional)
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").references(() => userAccounts.id, { onDelete: "set null" }),
  updatedBy: varchar("updated_by").references(() => userAccounts.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_platform_secrets_key").on(table.key),
  index("IDX_platform_secrets_service").on(table.service),
  index("IDX_platform_secrets_environment").on(table.environment),
]);

// Audit log for platform secrets changes
export const secretsAuditLog = pgTable("secrets_audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  secretId: varchar("secret_id").references(() => platformSecrets.id, { onDelete: "cascade" }),
  adminId: varchar("admin_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  action: varchar("action").notNull(), // 'created', 'updated', 'deleted', 'rotated', 'accessed'
  secretKey: varchar("secret_key").notNull(), // Store key for audit even if secret is deleted
  service: varchar("service").notNull(),
  environment: varchar("environment").notNull(),
  previousValueHash: varchar("previous_value_hash"), // Hash of previous value for verification
  newValueHash: varchar("new_value_hash"), // Hash of new value for verification
  ipAddress: varchar("ip_address"), // IP address of the admin
  userAgent: text("user_agent"), // Browser/client info
  reason: text("reason"), // Reason for the change
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`), // Additional audit data
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_secrets_audit_admin").on(table.adminId),
  index("IDX_secrets_audit_secret").on(table.secretId),
  index("IDX_secrets_audit_action").on(table.action),
  index("IDX_secrets_audit_created").on(table.createdAt),
]);

// Admin permissions for granular role-based access control
export const adminPermissions = pgTable("admin_permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  permission: varchar("permission").notNull(), // 'users.view', 'users.edit', 'secrets.manage', 'templates.edit', etc
  resource: varchar("resource").notNull(), // 'users', 'secrets', 'templates', 'system', 'blog'
  action: varchar("action").notNull(), // 'view', 'create', 'edit', 'delete', 'manage'
  scope: jsonb("scope").default(sql`'{}'::jsonb`), // Additional scope constraints
  grantedBy: varchar("granted_by").references(() => userAccounts.id, { onDelete: "set null" }),
  grantedAt: timestamp("granted_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // Optional expiry for temporary permissions
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_admin_permissions_admin").on(table.adminId),
  index("IDX_admin_permissions_permission").on(table.permission),
  index("IDX_admin_permissions_resource_action").on(table.resource, table.action),
  // Unique constraint: one admin cannot have duplicate permission
  sql`UNIQUE (admin_id, permission)`,
]);

// Admin actions audit log for tracking all administrative actions
export const adminActions = pgTable("admin_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().references(() => userAccounts.id, { onDelete: "cascade" }),
  actionType: varchar("action_type").notNull(), // 'user.updated', 'subscription.cancelled', 'template.created', etc
  targetType: varchar("target_type").notNull(), // 'user', 'subscription', 'template', 'system'
  targetId: varchar("target_id"), // ID of the affected entity
  targetData: jsonb("target_data").default(sql`'{}'::jsonb`), // Snapshot of target data
  changes: jsonb("changes").default(sql`'{}'::jsonb`), // What was changed (before/after values)
  description: text("description"), // Human-readable description
  ipAddress: varchar("ip_address"), // Admin's IP address
  userAgent: text("user_agent"), // Browser/client info
  sessionId: varchar("session_id"), // Session identifier for grouping actions
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`), // Additional context
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_admin_actions_admin").on(table.adminId),
  index("IDX_admin_actions_type").on(table.actionType),
  index("IDX_admin_actions_target").on(table.targetType, table.targetId),
  index("IDX_admin_actions_created").on(table.createdAt),
  index("IDX_admin_actions_session").on(table.sessionId),
]);

// System health checks for monitoring service status
export const systemHealthChecks = pgTable("system_health_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceName: varchar("service_name").notNull(), // 'database', 'email', 'payment', 'storage', 'api'
  serviceCategory: varchar("service_category").notNull(), // 'core', 'external', 'integration'
  status: varchar("status").notNull().default("unknown"), // 'healthy', 'degraded', 'down', 'unknown'
  lastCheckAt: timestamp("last_check_at").defaultNow(),
  nextCheckAt: timestamp("next_check_at"),
  responseTimeMs: integer("response_time_ms"), // Response time in milliseconds
  uptime: integer("uptime"), // Uptime percentage (0-100)
  consecutiveFailures: integer("consecutive_failures").default(0),
  errorMessage: text("error_message"), // Last error if any
  errorDetails: jsonb("error_details").default(sql`'{}'::jsonb`), // Detailed error information
  checkDetails: jsonb("check_details").default(sql`'{}'::jsonb`), // Additional check results
  isEnabled: boolean("is_enabled").default(true),
  checkInterval: integer("check_interval").default(60), // Check interval in seconds
  alertThreshold: integer("alert_threshold").default(3), // Failures before alert
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_system_health_service").on(table.serviceName),
  index("IDX_system_health_status").on(table.status),
  index("IDX_system_health_category").on(table.serviceCategory),
  index("IDX_system_health_last_check").on(table.lastCheckAt),
]);

// Email service status for Mailganer/SendGrid delivery tracking
export const emailServiceStatus = pgTable("email_service_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: varchar("provider").notNull(), // 'mailganer', 'sendgrid'
  messageId: varchar("message_id").unique(), // External message ID from provider
  recipient: varchar("recipient").notNull(), // Email address
  sender: varchar("sender").notNull(), // From address
  subject: text("subject"),
  templateId: varchar("template_id").references(() => emailTemplates.id, { onDelete: "set null" }),
  status: varchar("status").notNull().default("pending"), // 'pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'spam'
  deliveryStatus: jsonb("delivery_status").default(sql`'{}'::jsonb`), // Provider-specific status details
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  bouncedAt: timestamp("bounced_at"),
  failedAt: timestamp("failed_at"),
  bounceType: varchar("bounce_type"), // 'hard', 'soft', 'blocked'
  bounceReason: text("bounce_reason"),
  clickCount: integer("click_count").default(0),
  openCount: integer("open_count").default(0),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`), // Additional tracking data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_email_service_provider").on(table.provider),
  index("IDX_email_service_message").on(table.messageId),
  index("IDX_email_service_recipient").on(table.recipient),
  index("IDX_email_service_status").on(table.status),
  index("IDX_email_service_sent").on(table.sentAt),
  index("IDX_email_service_template").on(table.templateId),
]);

// Email templates management
export const emailTemplates = pgTable("email_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(), // 'welcome_email', 'password_reset', 'deletion_request'
  category: varchar("category").notNull(), // 'authentication', 'notifications', 'marketing', 'transactional'
  subject: text("subject").notNull(), // Email subject line with variables like {{firstName}}
  htmlBody: text("html_body").notNull(), // HTML version of email
  textBody: text("text_body"), // Plain text version
  variables: jsonb("variables").default(sql`'[]'::jsonb`), // Array of variable definitions [{name: 'firstName', required: true, defaultValue: ''}]
  fromName: varchar("from_name"), // Sender name override
  fromEmail: varchar("from_email"), // Sender email override
  replyTo: varchar("reply_to"), // Reply-to email
  isActive: boolean("is_active").default(true),
  isDeleted: boolean("is_deleted").default(false), // Soft delete flag
  deletedAt: timestamp("deleted_at"),
  deletedBy: varchar("deleted_by").references(() => userAccounts.id, { onDelete: "set null" }),
  testData: jsonb("test_data").default(sql`'{}'::jsonb`), // Test data for preview
  usageCount: integer("usage_count").default(0),
  lastUsedAt: timestamp("last_used_at"),
  createdBy: varchar("created_by").references(() => userAccounts.id, { onDelete: "set null" }),
  updatedBy: varchar("updated_by").references(() => userAccounts.id, { onDelete: "set null" }),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_email_templates_name").on(table.name),
  index("IDX_email_templates_category").on(table.category),
  index("IDX_email_templates_active").on(table.isActive),
  index("IDX_email_templates_deleted").on(table.isDeleted),
]);

// Email template version control
export const emailTemplateVersions = pgTable("email_template_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull().references(() => emailTemplates.id, { onDelete: "cascade" }),
  version: integer("version").notNull(), // Version number (1, 2, 3, etc)
  subject: text("subject").notNull(),
  htmlBody: text("html_body").notNull(),
  textBody: text("text_body"),
  variables: jsonb("variables").default(sql`'[]'::jsonb`),
  fromName: varchar("from_name"),
  fromEmail: varchar("from_email"),
  replyTo: varchar("reply_to"),
  changeDescription: text("change_description"), // What changed in this version
  isPublished: boolean("is_published").default(false), // Is this the active version
  publishedAt: timestamp("published_at"),
  publishedBy: varchar("published_by").references(() => userAccounts.id, { onDelete: "set null" }),
  createdBy: varchar("created_by").references(() => userAccounts.id, { onDelete: "set null" }),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_email_template_versions_template").on(table.templateId),
  index("IDX_email_template_versions_version").on(table.templateId, table.version),
  index("IDX_email_template_versions_published").on(table.isPublished),
  // Unique constraint: one template cannot have duplicate version numbers
  sql`UNIQUE (template_id, version)`,
]);

// ====================
// ADMIN PANEL SCHEMAS AND TYPES
// ====================

// Platform secrets schemas
export const insertPlatformSecretSchema = createInsertSchema(platformSecrets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSecretsAuditLogSchema = createInsertSchema(secretsAuditLog).omit({
  id: true,
  createdAt: true,
});

// Admin permissions schemas
export const insertAdminPermissionSchema = createInsertSchema(adminPermissions).omit({
  id: true,
  grantedAt: true,
  createdAt: true,
});

export const insertAdminActionSchema = createInsertSchema(adminActions).omit({
  id: true,
  createdAt: true,
});

// System health schemas
export const insertSystemHealthCheckSchema = createInsertSchema(systemHealthChecks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailServiceStatusSchema = createInsertSchema(emailServiceStatus).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Email template schemas
export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
  id: true,
  isDeleted: true,
  deletedAt: true,
  deletedBy: true,
  usageCount: true,
  lastUsedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailTemplateVersionSchema = createInsertSchema(emailTemplateVersions).omit({
  id: true,
  createdAt: true,
});

// Admin panel types
export type PlatformSecret = typeof platformSecrets.$inferSelect;
export type InsertPlatformSecret = z.infer<typeof insertPlatformSecretSchema>;
export type SecretsAuditLog = typeof secretsAuditLog.$inferSelect;
export type InsertSecretsAuditLog = z.infer<typeof insertSecretsAuditLogSchema>;
export type AdminPermission = typeof adminPermissions.$inferSelect;
export type InsertAdminPermission = z.infer<typeof insertAdminPermissionSchema>;
export type AdminAction = typeof adminActions.$inferSelect;
export type InsertAdminAction = z.infer<typeof insertAdminActionSchema>;
export type SystemHealthCheck = typeof systemHealthChecks.$inferSelect;
export type InsertSystemHealthCheck = z.infer<typeof insertSystemHealthCheckSchema>;
export type EmailServiceStatus = typeof emailServiceStatus.$inferSelect;
export type InsertEmailServiceStatus = z.infer<typeof insertEmailServiceStatusSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailTemplateVersion = typeof emailTemplateVersions.$inferSelect;
export type InsertEmailTemplateVersion = z.infer<typeof insertEmailTemplateVersionSchema>;

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
  // НОВОЕ: Тип статьи по образцу Incogni.com
  articleType: varchar("article_type").notNull().default("research"), // "research", "opt-out-guide", "privacy-guide", "spam-protection", "law-guide"
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
  index("IDX_blog_articles_type").on(table.articleType),
]);

// Blog article generation settings table (ОБНОВЛЕНО для поддержки типов как у Incogni.com)
export const blogGenerationSettings = pgTable("blog_generation_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  isEnabled: boolean("is_enabled").default(true), // Enable/disable auto-generation
  frequency: varchar("frequency").notNull().default("daily"), // "hourly", "daily", "weekly"
  maxArticlesPerDay: integer("max_articles_per_day").default(3), // Limit on daily article generation
  
  // НОВОЕ: Типы статей по образцу Incogni.com
  articleTypes: text("article_types").array().default(sql`ARRAY['research', 'opt-out-guide', 'privacy-guide', 'spam-protection', 'law-guide']::text[]`), // Типы контента
  
  // Расширенные настройки контента
  topics: text("topics").array().default(sql`ARRAY['защита персональных данных', 'права пользователей', 'кибербезопасность', '152-ФЗ', 'GDPR в России']::text[]`), // Topic pool for generation
  contentLength: varchar("content_length").default("medium"), // "brief", "short", "medium", "detailed", "comprehensive"
  targetAudience: varchar("target_audience").default("citizens"), // "citizens", "lawyers", "it-professionals", "business", "students"
  
  // НОВОЕ: Стиль написания
  writingStyle: varchar("writing_style").default("informational"), // "informational", "tutorial", "academic", "conversational", "legal"
  
  // SEO и контент настройки
  seoOptimized: boolean("seo_optimized").default(true), // Generate SEO-optimized content
  includeStats: boolean("include_stats").default(true), // Include Russian data protection statistics
  includeStepByStep: boolean("include_step_by_step").default(true), // Включать пошаговые инструкции
  includeRussianLaw: boolean("include_russian_law").default(true), // Включать ссылки на российское законодательство
  includeBrokerLists: boolean("include_broker_lists").default(true), // Включать списки брокеров данных
  
  // Системные поля
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
}).extend({
  // Enforce category validation using our centralized enum
  category: BlogCategoryEnum
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

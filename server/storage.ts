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
  inboundEmails,
  operatorActionTokens,
  notifications,
  oauthAccounts,
  subscriptionPlans,
  subscriptions,
  payments,
  achievementDefinitions,
  userAchievements,
  referralCodes,
  referrals,
  blogArticles,
  blogGenerationSettings,
  platformSecrets,
  secretsAuditLog,
  adminPermissions,
  adminActions,
  systemHealthChecks,
  emailServiceStatus,
  emailTemplates,
  emailTemplateVersions,
  evidenceCollection,
  legalArticles,
  // САЗПД modules tables - temporarily disabled
  // campaigns,
  // decisionRules,
  // evidenceEvents,
  // evidenceDailySeals,
  // legalNorms,
  // operatorProfiles,
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
  type InboundEmail,
  type InsertInboundEmail,
  type OperatorActionToken,
  type InsertOperatorActionToken,
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
  type BlogArticle,
  type InsertBlogArticle,
  type BlogGenerationSettings,
  type InsertBlogGenerationSettings,
  type PlatformSecret,
  type InsertPlatformSecret,
  type SecretsAuditLog,
  type InsertSecretsAuditLog,
  type AdminPermission,
  type InsertAdminPermission,
  type AdminAction,
  type InsertAdminAction,
  type SystemHealthCheck,
  type InsertSystemHealthCheck,
  type EmailServiceStatus,
  type InsertEmailServiceStatus,
  type EmailTemplate,
  type InsertEmailTemplate,
  type EmailTemplateVersion,
  type InsertEmailTemplateVersion,
  type EvidenceCollection,
  type InsertEvidenceCollection,
  type LegalArticle,
  type InsertLegalArticle,
  // САЗПД modules types - temporarily disabled (using DeletionRequest as Campaign entity)
  // type Campaign,
  // type InsertCampaign,
  // type DecisionRule,
  // type InsertDecisionRule,
  // type EvidenceEvent,
  // type InsertEvidenceEvent,
  // type EvidenceDailySeal,
  // type InsertEvidenceDailySeal,
  // type LegalNorm,
  // type InsertLegalNorm,
  // type OperatorProfile,
  // type InsertOperatorProfile,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, like, isNull, ne } from "drizzle-orm";
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
  getDeletionRequests(filters?: {
    status?: string;
    olderThanDays?: number;
    withoutInboundEmails?: boolean;
    operatorNotConfirmed?: boolean;
  }): Promise<DeletionRequest[]>;
  updateDeletionRequest(id: string, updates: Partial<DeletionRequest>): Promise<DeletionRequest | undefined>;
  getDeletionRequestByTrackingId(trackingId: string): Promise<DeletionRequest | undefined>;
  getDeletionRequestByMessageId(messageId: string): Promise<DeletionRequest | undefined>;
  getDeletionRequestById(id: string): Promise<DeletionRequest | undefined>;

  // Evidence Collection operations
  createEvidenceCollection(evidenceData: InsertEvidenceCollection): Promise<EvidenceCollection>;
  getEvidenceCollectionById(id: string): Promise<EvidenceCollection | undefined>;
  getEvidenceCollectionByRequestId(deletionRequestId: string): Promise<EvidenceCollection[]>;
  updateEvidenceCollection(id: string, updates: Partial<EvidenceCollection>): Promise<EvidenceCollection | undefined>;
  verifyEvidenceChainIntegrity(deletionRequestId: string): Promise<boolean>;
  getEvidenceChainLength(deletionRequestId: string): Promise<number>;
  
  // Transactional evidence collection for preventing race conditions
  getLastEvidenceInChainWithLock(deletionRequestId: string): Promise<EvidenceCollection | null>;
  createEvidenceCollectionAtomic(evidenceData: InsertEvidenceCollection, deletionRequestId: string): Promise<EvidenceCollection>;

  // Legal Knowledge Base operations
  createLegalArticle(articleData: InsertLegalArticle): Promise<LegalArticle>;
  getLegalArticleById(id: string): Promise<LegalArticle | undefined>;
  getLegalArticlesByViolationType(violationType: string): Promise<LegalArticle[]>;
  getLegalArticlesByCategory(category: string): Promise<LegalArticle[]>;
  getAllLegalArticles(): Promise<LegalArticle[]>;
  updateLegalArticle(id: string, updates: Partial<LegalArticle>): Promise<LegalArticle | undefined>;
  deleteLegalArticle(id: string): Promise<boolean>;
  getLegalArticlesByLawReference(lawReference: string): Promise<LegalArticle[]>;
  searchLegalArticles(searchTerm: string): Promise<LegalArticle[]>;

  // Inbound emails
  createInboundEmail(emailData: InsertInboundEmail): Promise<InboundEmail>;
  getInboundEmailById(id: string): Promise<InboundEmail | undefined>;
  updateInboundEmailAnalysis(id: string, analysisData: {
    responseType?: string;
    extractedData?: any;
    violations?: string[];
    legitimacyScore?: number;
    recommendations?: any;
    analysisMetadata?: any;
  }): Promise<InboundEmail | undefined>;

  // Operator action tokens operations
  createOperatorActionToken(tokenData: InsertOperatorActionToken): Promise<OperatorActionToken>;
  getOperatorActionTokenByToken(token: string): Promise<OperatorActionToken | undefined>;
  markOperatorActionTokenAsUsed(token: string, usedByIp: string, userAgent: string): Promise<OperatorActionToken | undefined>;
  
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
  getAllActiveSubscriptions(): Promise<Subscription[]>;
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
  
  // Points system operations
  getUserPoints(userId: string): Promise<number>;
  addUserPoints(userId: string, points: number, reason?: string): Promise<UserAccount | undefined>;
  deductUserPoints(userId: string, points: number): Promise<{success: boolean, remainingPoints: number, newBalance: number}>;

  // Blog article operations
  createBlogArticle(articleData: InsertBlogArticle): Promise<BlogArticle>;
  getBlogArticleById(id: string): Promise<BlogArticle | undefined>;
  getBlogArticleBySlug(slug: string): Promise<BlogArticle | undefined>;
  getPublishedBlogArticles(filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<BlogArticle[]>;
  getAllBlogArticles(filters?: {
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<BlogArticle[]>;
  updateBlogArticle(id: string, updates: Partial<BlogArticle>): Promise<BlogArticle | undefined>;
  incrementViewCount(id: string): Promise<BlogArticle | undefined>;
  deleteBlogArticle(id: string): Promise<boolean>;

  // Blog generation settings operations
  getBlogGenerationSettings(): Promise<BlogGenerationSettings | undefined>;
  updateBlogGenerationSettings(updates: Partial<BlogGenerationSettings>): Promise<BlogGenerationSettings | undefined>;
  createBlogGenerationSettings(settingsData: InsertBlogGenerationSettings): Promise<BlogGenerationSettings>;

  // Admin panel statistics methods
  getUsersCount(search?: string, role?: string): Promise<number>;
  getVerifiedUsersCount(): Promise<number>;
  getAdminsCount(): Promise<number>;
  getRecentUsersCount(days: number): Promise<number>;
  getBlogArticlesCount(status?: string, search?: string): Promise<number>;
  getPublishedBlogArticlesCount(): Promise<number>;
  getLastGeneratedArticleDate(): Promise<Date | null>;
  
  // Email statistics methods
  getEmailsSentCount(days: number): Promise<number>;
  getEmailDeliveryRate(): Promise<number>;
  getEmailBounceRate(): Promise<number>;
  
  // Admin user management
  getUsers(options: { 
    limit: number; 
    offset: number; 
    search?: string; 
    role?: string 
  }): Promise<UserAccount[]>;
  searchUsers(options: {
    text?: string;
    dateFrom?: Date;
    dateTo?: Date;
    subscriptionStatus?: string;
    verificationStatus?: string;
    adminRole?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit: number;
    offset: number;
  }): Promise<{ users: (UserAccount & { profile?: UserProfile; subscription?: Subscription | null })[], total: number }>;
  getUserWithDetails(userId: string): Promise<{
    account: UserAccount;
    profile?: UserProfile;
    subscription?: Subscription | null;
    payments?: Payment[];
    activities?: any[];
    notes?: any[];
  } | undefined>;
  banUser(userId: string, reason: string, bannedBy: string): Promise<UserAccount | undefined>;
  unbanUser(userId: string, unbannedBy: string): Promise<UserAccount | undefined>;
  addUserNote(userId: string, note: string, addedBy: string): Promise<any>;
  getUserActivityHistory(userId: string, limit?: number): Promise<any[]>;
  getSystemLogs(options: { type: string; limit: number }): Promise<any[]>;
  
  // Platform secrets management
  createPlatformSecret(secretData: InsertPlatformSecret): Promise<PlatformSecret>;
  getPlatformSecrets(filters?: { service?: string; environment?: string }): Promise<PlatformSecret[]>;
  getPlatformSecretByKey(key: string): Promise<PlatformSecret | undefined>;
  updatePlatformSecret(key: string, value: string, adminId: string): Promise<PlatformSecret | undefined>;
  deletePlatformSecret(key: string, adminId: string, reason: string): Promise<boolean>;
  logSecretAudit(auditData: InsertSecretsAuditLog): Promise<SecretsAuditLog>;
  getSecretsAuditLog(filters?: { secretId?: string; adminId?: string; limit?: number }): Promise<SecretsAuditLog[]>;
  
  // Admin permissions management
  createAdminPermission(permissionData: InsertAdminPermission): Promise<AdminPermission>;
  getAdminPermissions(adminId: string): Promise<AdminPermission[]>;
  checkAdminPermission(adminId: string, resource: string, action: string): Promise<boolean>;
  revokeAdminPermission(id: string): Promise<boolean>;
  updateAdminPermission(id: string, updates: Partial<AdminPermission>): Promise<AdminPermission | undefined>;
  
  // Admin actions logging
  logAdminAction(actionData: InsertAdminAction): Promise<AdminAction>;
  getAdminActions(filters?: { adminId?: string; targetType?: string; limit?: number; offset?: number }): Promise<AdminAction[]>;
  getAdminActionsBySession(sessionId: string): Promise<AdminAction[]>;
  
  // Audit logs operations (enhanced)
  getAuditLogs(filters?: {
    adminId?: string;
    action?: string;
    targetType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: AdminAction[]; total: number; page: number; totalPages: number }>;
  getAuditLogById(id: string): Promise<AdminAction | null>;
  exportAuditLogs(dateRange?: { from: Date; to: Date }): Promise<string>; // Returns CSV string
  
  // Admin permissions operations (enhanced)
  grantPermission(permission: InsertAdminPermission): Promise<AdminPermission>;
  revokePermission(permissionId: string): Promise<boolean>;
  getPermissionHistory(adminId: string): Promise<AdminPermission[]>;
  
  // Security statistics
  getSecurityStats(): Promise<{
    recentSuspiciousActivities: AdminAction[];
    failedLoginAttempts: number;
    permissionChanges: AdminAction[];
    mostActiveAdmins: { adminId: string; email: string; actionCount: number }[];
    securityScore: number;
    totalActions: number;
    criticalActions: number;
  }>;
  
  // System health monitoring
  createSystemHealthCheck(checkData: InsertSystemHealthCheck): Promise<SystemHealthCheck>;
  getSystemHealthChecks(filters?: { serviceName?: string; status?: string }): Promise<SystemHealthCheck[]>;
  updateSystemHealthCheck(id: string, updates: Partial<SystemHealthCheck>): Promise<SystemHealthCheck | undefined>;
  getLatestHealthCheckByService(serviceName: string): Promise<SystemHealthCheck | undefined>;
  
  // Email service monitoring
  createEmailServiceStatus(statusData: InsertEmailServiceStatus): Promise<EmailServiceStatus>;
  getEmailServiceStatuses(filters?: { provider?: string; status?: string; recipient?: string; limit?: number }): Promise<EmailServiceStatus[]>;
  updateEmailServiceStatus(id: string, updates: Partial<EmailServiceStatus>): Promise<EmailServiceStatus | undefined>;
  getEmailServiceStatusByMessageId(messageId: string): Promise<EmailServiceStatus | undefined>;
  getEmailDeliveryStats(startDate: Date, endDate: Date): Promise<{
    total: number;
    delivered: number;
    bounced: number;
    failed: number;
    openRate: number;
    clickRate: number;
  }>;
  
  // Email templates management
  createEmailTemplate(templateData: InsertEmailTemplate): Promise<EmailTemplate>;
  getEmailTemplates(filters?: { category?: string; isActive?: boolean; search?: string }): Promise<EmailTemplate[]>;
  getEmailTemplateById(id: string): Promise<EmailTemplate | undefined>;
  getEmailTemplateByName(name: string): Promise<EmailTemplate | undefined>;
  updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | undefined>;
  deleteEmailTemplate(id: string): Promise<boolean>;
  softDeleteEmailTemplate(id: string, deletedBy: string): Promise<EmailTemplate | undefined>;
  cloneEmailTemplate(id: string, newName: string, createdBy: string): Promise<EmailTemplate>;
  
  // Email template versioning
  createEmailTemplateVersion(versionData: InsertEmailTemplateVersion): Promise<EmailTemplateVersion>;
  getEmailTemplateVersions(templateId: string): Promise<EmailTemplateVersion[]>;
  getEmailTemplateVersion(id: string): Promise<EmailTemplateVersion | undefined>;
  getActiveEmailTemplateVersion(templateId: string): Promise<EmailTemplateVersion | undefined>;
  publishEmailTemplateVersion(id: string, publishedBy: string): Promise<EmailTemplateVersion | undefined>;
  
  // Email template operations
  testEmailTemplate(templateId: string, testEmail: string, testData?: any): Promise<{ success: boolean; message: string }>;
  exportEmailTemplate(id: string): Promise<any>;
  importEmailTemplate(templateData: any, createdBy: string): Promise<EmailTemplate>;

  // ========================================
  // TWO-STAGE EMAIL SYSTEM METHODS
  // ========================================

  // Enhanced Operator Action Tokens operations
  cleanupExpiredTokens(): Promise<number>; // Returns count of deleted tokens

  // Enhanced Inbound Emails operations  
  getInboundEmailsByDeletionRequest(deletionRequestId: string): Promise<InboundEmail[]>;
  updateInboundEmailClassification(id: string, parsedStatus: string): Promise<InboundEmail | undefined>;

  // Deletion Request Status Transitions
  updateDeletionRequestStatus(id: string, status: string, metadata?: any): Promise<DeletionRequest | undefined>;
  updateFollowUpSent(id: string, messageId: string, sentAt: Date): Promise<DeletionRequest | undefined>;
  updateEscalationSent(id: string, messageId: string, sentAt: Date): Promise<DeletionRequest | undefined>;
  markOperatorConfirmed(id: string, confirmedAt: Date, confirmationToken?: string): Promise<DeletionRequest | undefined>;

  // Enhanced Query Methods for automation
  getDeletionRequestsRequiringFollowUp(): Promise<DeletionRequest[]>;
  getDeletionRequestsRequiringEscalation(): Promise<DeletionRequest[]>;
  getDeletionRequestsWithAnalytics(filters?: { 
    dateFrom?: Date; 
    dateTo?: Date; 
    operatorId?: string; 
    decisionType?: string; 
  }): Promise<DeletionRequest[]>;

  // ========================================
  // CAMPAIGN MANAGEMENT MODULE METHODS
  // ========================================
  
  // Campaign operations (using deletion_requests as the base entity)
  createCampaign(campaignData: InsertDeletionRequest): Promise<DeletionRequest>;
  getCampaignById(id: string): Promise<DeletionRequest | undefined>;
  getUserCampaigns(userId: string): Promise<DeletionRequest[]>;
  getAllCampaigns(filters?: { 
    campaignStatus?: string; 
    escalationLevel?: number; 
    isAutomated?: boolean;
    automationPaused?: boolean;
    completionRateMin?: number;
    lastActionBefore?: Date;
    nextActionDue?: boolean;
  }): Promise<DeletionRequest[]>;
  updateCampaign(id: string, updates: Partial<DeletionRequest>): Promise<DeletionRequest | undefined>;
  updateCampaignStatus(id: string, status: string, milestone?: any): Promise<DeletionRequest | undefined>;
  updateCampaignMetrics(id: string, metrics: Record<string, any>): Promise<DeletionRequest | undefined>;
  updateCampaignProgress(id: string, completionRate: number, nextAction?: string, nextActionAt?: Date): Promise<DeletionRequest | undefined>;
  pauseCampaignAutomation(id: string, reason: string): Promise<DeletionRequest | undefined>;
  resumeCampaignAutomation(id: string): Promise<DeletionRequest | undefined>;
  
  // Campaign analytics and monitoring
  getCampaignStatistics(timeframe?: 'day' | 'week' | 'month'): Promise<{
    totalCampaigns: number;
    activeCampaigns: number;
    completedCampaigns: number;
    escalatedCampaigns: number;
    averageCompletionTime: number;
    successRate: number;
    escalationRate: number;
  }>;
  
  getCampaignsByOperator(operatorEmail: string): Promise<DeletionRequest[]>;
  getOperatorComplianceMetrics(operatorEmail: string): Promise<{
    totalCampaigns: number;
    successfulCampaigns: number;
    averageResponseTime: number;
    complianceScore: number;
  }>;
  
  // Campaign automation queries
  getCampaignsReadyForAction(): Promise<DeletionRequest[]>;
  getCampaignsRequiringEscalation(): Promise<DeletionRequest[]>;
  getStalledCampaigns(daysSinceLastAction: number): Promise<DeletionRequest[]>;

  // Decision rules operations
  createDecisionRule(ruleData: InsertDecisionRule): Promise<DecisionRule>;
  getDecisionRuleById(id: string): Promise<DecisionRule | undefined>;
  getDecisionRulesByState(state: string): Promise<DecisionRule[]>;
  getActiveDecisionRules(): Promise<DecisionRule[]>;
  updateDecisionRule(id: string, updates: Partial<DecisionRule>): Promise<DecisionRule | undefined>;
  deactivateDecisionRule(id: string): Promise<DecisionRule | undefined>;

  // Evidence events operations
  createEvidenceEvent(eventData: InsertEvidenceEvent): Promise<EvidenceEvent>;
  getEvidenceEventById(id: string): Promise<EvidenceEvent | undefined>;
  getEvidenceEventsByCampaign(campaignId: string): Promise<EvidenceEvent[]>;
  getEvidenceEventsByRequest(requestId: string): Promise<EvidenceEvent[]>;
  getEvidenceEventsByType(type: string, campaignId?: string): Promise<EvidenceEvent[]>;
  getEvidenceEventsForSeal(date: Date): Promise<EvidenceEvent[]>;

  // Evidence daily seals operations
  createEvidenceDailySeal(sealData: InsertEvidenceDailySeal): Promise<EvidenceDailySeal>;
  getEvidenceDailySealById(id: string): Promise<EvidenceDailySeal | undefined>;
  getEvidenceDailySealByDate(date: Date): Promise<EvidenceDailySeal | undefined>;
  getEvidenceDailySeals(filters?: { fromDate?: Date; toDate?: Date }): Promise<EvidenceDailySeal[]>;

  // Legal norms operations
  createLegalNorm(normData: InsertLegalNorm): Promise<LegalNorm>;
  getLegalNormById(id: string): Promise<LegalNorm | undefined>;
  getLegalNormByCode(code: string): Promise<LegalNorm | undefined>;
  getActiveLegalNorms(): Promise<LegalNorm[]>;
  updateLegalNorm(id: string, updates: Partial<LegalNorm>): Promise<LegalNorm | undefined>;
  deactivateLegalNorm(id: string): Promise<LegalNorm | undefined>;

  // Operator profiles operations
  createOperatorProfile(profileData: InsertOperatorProfile): Promise<OperatorProfile>;
  getOperatorProfileById(id: string): Promise<OperatorProfile | undefined>;
  getOperatorProfileByName(operatorName: string): Promise<OperatorProfile | undefined>;
  getAllOperatorProfiles(): Promise<OperatorProfile[]>;
  updateOperatorProfile(id: string, updates: Partial<OperatorProfile>): Promise<OperatorProfile | undefined>;
  deleteOperatorProfile(id: string): Promise<boolean>;

  // ========================================
  // DECISION ENGINE MODULE METHODS
  // ========================================

  // Decision Engine operations
  getDeletionRequestsForDecisionMaking(filters?: {
    status?: string[];
    withoutDecisions?: boolean;
    withAnalyzedResponses?: boolean;
    olderThanDays?: number;
  }): Promise<DeletionRequest[]>;
  
  getDecisionAuditLog(filters?: {
    userId?: string;
    decisionType?: string;
    dateRange?: { start: Date; end: Date };
    autoProcessedOnly?: boolean;
  }): Promise<DeletionRequest[]>;
  
  getDecisionStatistics(timeframe?: 'day' | 'week' | 'month'): Promise<{
    totalDecisions: number;
    autoExecuted: number;
    manualReview: number;
    decisionsByType: Record<string, number>;
    averageConfidence: number;
    escalationRate: number;
  }>;

  // ========================================
  // САЗПД SYSTEM METHODS
  // ========================================

  // SAZPD Logs operations
  getSAZPDLogs(filters?: {
    module?: string;
    level?: string;
    status?: string;
    search?: string;
    date?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    logs: any[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  // SAZPD Metrics operations  
  getSAZPDMetrics(): Promise<{
    totalRequests: number;
    processedRequests: number;
    automatedDecisions: number;
    manualEscalations: number;
    evidenceCollections: number;
    cryptoValidations: number;
    complianceScore: number;
    operatorResponseTime: number;
    violationsDetected: number;
  }>;

  // SAZPD Settings operations
  getSAZPDSettings(): Promise<any>;
  updateSAZPDSettings(settings: any): Promise<any>;

  // SAZPD Operator Statistics
  getSAZPDOperatorStats(): Promise<{
    operatorId: string;
    name: string;
    totalResponses: number;
    successRate: number;
    avgResponseTime: number;
    violationsCount: number;
    lastActivity: string;
    complianceScore: number;
  }[]>;

  // SAZPD Admin Action Logging (specialized for САЗПД)
  logSAZPDAction(actionData: {
    adminId: string;
    module: 'response-analyzer' | 'decision-engine' | 'evidence-collector' | 'campaign-manager' | 'email-automation' | 'crypto-validator';
    actionType: string;
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    requestId?: string;
    status: 'success' | 'failed' | 'processing';
    details?: Record<string, any>;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void>;
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

  async getDeletionRequests(filters?: {
    status?: string;
    olderThanDays?: number;
    withoutInboundEmails?: boolean;
    operatorNotConfirmed?: boolean;
  }): Promise<DeletionRequest[]> {
    let query = db.select().from(deletionRequests);
    const conditions = [];

    if (filters?.status) {
      conditions.push(eq(deletionRequests.status, filters.status));
    }

    if (filters?.olderThanDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - filters.olderThanDays);
      conditions.push(sql`${deletionRequests.firstSentAt} < ${cutoffDate} OR ${deletionRequests.createdAt} < ${cutoffDate}`);
    }

    if (filters?.operatorNotConfirmed) {
      conditions.push(sql`${deletionRequests.buttonConfirmedAt} IS NULL`);
    }

    if (filters?.withoutInboundEmails) {
      // Улучшенная логика: ищем запросы БЕЗ значимых ответов операторов
      // Игнорируем auto-replies, bounces и неклассифицированные сообщения
      query = db
        .select()
        .from(deletionRequests)
        .leftJoin(
          inboundEmails, 
          and(
            eq(deletionRequests.id, inboundEmails.deletionRequestId),
            // Считаем только значимые ответы: 'deleted', 'rejected', 'need_info'
            // Игнорируем 'other' (auto-replies, bounces, неклассифицированные)
            sql`${inboundEmails.parsedStatus} IN ('deleted', 'rejected', 'need_info')`
          )
        );
      
      // Ищем запросы БЕЗ значимых inbound emails
      conditions.push(sql`${inboundEmails.id} IS NULL`);
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(deletionRequests.createdAt));
  }

  async updateDeletionRequest(id: string, updates: Partial<DeletionRequest>): Promise<DeletionRequest | undefined> {
    const [request] = await db
      .update(deletionRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(deletionRequests.id, id))
      .returning();
    return request;
  }

  async getDeletionRequestByTrackingId(trackingId: string): Promise<DeletionRequest | undefined> {
    const [request] = await db
      .select()
      .from(deletionRequests)
      .where(eq(deletionRequests.trackingId, trackingId));
    return request;
  }

  async getDeletionRequestByMessageId(messageId: string): Promise<DeletionRequest | undefined> {
    const requests = await db
      .select()
      .from(deletionRequests)
      .where(
        sql`${deletionRequests.initialMessageId} = ${messageId} OR ${deletionRequests.followUpMessageId} = ${messageId}`
      );
    return requests[0];
  }

  async getDeletionRequestById(id: string): Promise<DeletionRequest | undefined> {
    const [request] = await db
      .select()
      .from(deletionRequests)
      .where(eq(deletionRequests.id, id));
    return request;
  }

  // Evidence Collection operations
  async createEvidenceCollection(evidenceData: InsertEvidenceCollection): Promise<EvidenceCollection> {
    const [evidence] = await db
      .insert(evidenceCollection)
      .values(evidenceData)
      .returning();
    return evidence;
  }

  async getEvidenceCollectionById(id: string): Promise<EvidenceCollection | undefined> {
    const [evidence] = await db
      .select()
      .from(evidenceCollection)
      .where(eq(evidenceCollection.id, id));
    return evidence;
  }

  async getEvidenceCollectionByRequestId(deletionRequestId: string): Promise<EvidenceCollection[]> {
    const evidence = await db
      .select()
      .from(evidenceCollection)
      .where(eq(evidenceCollection.deletionRequestId, deletionRequestId))
      .orderBy(desc(evidenceCollection.timestamp));
    return evidence;
  }

  async updateEvidenceCollection(id: string, updates: Partial<EvidenceCollection>): Promise<EvidenceCollection | undefined> {
    const [evidence] = await db
      .update(evidenceCollection)
      .set({ 
        ...updates, 
        updatedAt: new Date() 
      })
      .where(eq(evidenceCollection.id, id))
      .returning();
    return evidence;
  }

  async verifyEvidenceChainIntegrity(deletionRequestId: string): Promise<boolean> {
    try {
      const evidenceList = await this.getEvidenceCollectionByRequestId(deletionRequestId);
      if (evidenceList.length === 0) return true; // Empty chain is valid
      
      // Sort by timestamp for proper chain verification
      const sortedEvidence = evidenceList.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      // Verify each link in the chain
      for (let i = 0; i < sortedEvidence.length; i++) {
        const current = sortedEvidence[i];
        const previous = i > 0 ? sortedEvidence[i - 1] : null;
        
        // Check if previous hash reference is correct
        if (i === 0) {
          // Genesis evidence should have no previous hash or null
          if (current.previousHash !== null && current.previousHash !== '') {
            return false;
          }
        } else {
          // Non-genesis evidence should reference previous content hash
          if (current.previousHash !== previous?.contentHash) {
            return false;
          }
        }
        
        // Additional integrity checks can be added here:
        // - Verify content hash matches actual content
        // - Verify timestamp hash
        // - Verify digital fingerprint
        // These would require re-implementing the hashing logic from EvidenceCollector
      }

      return true;
    } catch (error) {
      console.error('Error verifying evidence chain integrity:', error);
      return false;
    }
  }

  async getEvidenceChainLength(deletionRequestId: string): Promise<number> {
    try {
      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(evidenceCollection)
        .where(eq(evidenceCollection.deletionRequestId, deletionRequestId));
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting evidence chain length:', error);
      return 0;
    }
  }

  // Transactional evidence collection methods for preventing race conditions
  async getLastEvidenceInChainWithLock(deletionRequestId: string): Promise<EvidenceCollection | null> {
    try {
      return await db.transaction(async (tx) => {
        // Use SELECT FOR UPDATE to lock the row and prevent race conditions
        const evidence = await tx
          .select()
          .from(evidenceCollection)
          .where(eq(evidenceCollection.deletionRequestId, deletionRequestId))
          .orderBy(desc(evidenceCollection.timestamp), desc(evidenceCollection.createdAt))
          .limit(1)
          .for('update'); // SELECT FOR UPDATE
          
        return evidence[0] || null;
      });
    } catch (error) {
      console.error('Error getting last evidence with lock:', error);
      return null;
    }
  }

  async createEvidenceCollectionAtomic(
    evidenceData: InsertEvidenceCollection, 
    deletionRequestId: string
  ): Promise<EvidenceCollection> {
    return await db.transaction(async (tx) => {
      // First, get the latest evidence with lock to prevent race conditions
      const lastEvidence = await tx
        .select()
        .from(evidenceCollection)
        .where(eq(evidenceCollection.deletionRequestId, deletionRequestId))
        .orderBy(desc(evidenceCollection.timestamp), desc(evidenceCollection.createdAt))
        .limit(1)
        .for('update'); // SELECT FOR UPDATE to prevent concurrent insertions
      
      // Calculate chain position atomically
      const chainPosition = lastEvidence.length > 0 
        ? ((lastEvidence[0].legalMetadata as any)?.chain_position || 0) + 1 
        : 1;
      
      // Update legal metadata with correct chain position
      const updatedEvidenceData = {
        ...evidenceData,
        legalMetadata: {
          ...(evidenceData.legalMetadata as any),
          chain_position: chainPosition,
          atomicity_ensured: true,
          transaction_timestamp: new Date().toISOString()
        }
      };
      
      // Insert the new evidence record
      const [newEvidence] = await tx
        .insert(evidenceCollection)
        .values(updatedEvidenceData)
        .returning();
      
      return newEvidence;
    });
  }

  // Legal Knowledge Base operations
  async createLegalArticle(articleData: InsertLegalArticle): Promise<LegalArticle> {
    const [article] = await db
      .insert(legalArticles)
      .values(articleData)
      .returning();
    return article;
  }

  async getLegalArticleById(id: string): Promise<LegalArticle | undefined> {
    const [article] = await db
      .select()
      .from(legalArticles)
      .where(eq(legalArticles.id, id));
    return article;
  }

  async getLegalArticlesByViolationType(violationType: string): Promise<LegalArticle[]> {
    const articles = await db
      .select()
      .from(legalArticles)
      .where(and(
        sql`${legalArticles.violationType} @> ARRAY[${violationType}]::text[]`,
        eq(legalArticles.isActive, true)
      ))
      .orderBy(legalArticles.articleNumber);
    return articles;
  }

  async getLegalArticlesByCategory(category: string): Promise<LegalArticle[]> {
    const articles = await db
      .select()
      .from(legalArticles)
      .where(and(
        eq(legalArticles.category, category),
        eq(legalArticles.isActive, true)
      ))
      .orderBy(legalArticles.articleNumber);
    return articles;
  }

  async getAllLegalArticles(): Promise<LegalArticle[]> {
    const articles = await db
      .select()
      .from(legalArticles)
      .where(eq(legalArticles.isActive, true))
      .orderBy(legalArticles.lawReference, legalArticles.articleNumber);
    return articles;
  }

  async updateLegalArticle(id: string, updates: Partial<LegalArticle>): Promise<LegalArticle | undefined> {
    const [article] = await db
      .update(legalArticles)
      .set({ 
        ...updates, 
        updatedAt: new Date() 
      })
      .where(eq(legalArticles.id, id))
      .returning();
    return article;
  }

  async deleteLegalArticle(id: string): Promise<boolean> {
    try {
      const [result] = await db
        .update(legalArticles)
        .set({ 
          isActive: false,
          updatedAt: new Date()
        })
        .where(eq(legalArticles.id, id))
        .returning();
      return !!result;
    } catch (error) {
      console.error('Error deleting legal article:', error);
      return false;
    }
  }

  async getLegalArticlesByLawReference(lawReference: string): Promise<LegalArticle[]> {
    const articles = await db
      .select()
      .from(legalArticles)
      .where(and(
        eq(legalArticles.lawReference, lawReference),
        eq(legalArticles.isActive, true)
      ))
      .orderBy(legalArticles.articleNumber);
    return articles;
  }

  async searchLegalArticles(searchTerm: string): Promise<LegalArticle[]> {
    const articles = await db
      .select()
      .from(legalArticles)
      .where(and(
        sql`(
          ${legalArticles.title} ILIKE ${`%${searchTerm}%`} OR 
          ${legalArticles.fullText} ILIKE ${`%${searchTerm}%`} OR
          ${legalArticles.articleNumber} ILIKE ${`%${searchTerm}%`} OR
          ${legalArticles.legalBasis} ILIKE ${`%${searchTerm}%`}
        )`,
        eq(legalArticles.isActive, true)
      ))
      .orderBy(legalArticles.lawReference, legalArticles.articleNumber);
    return articles;
  }

  // Inbound emails
  async createInboundEmail(emailData: InsertInboundEmail): Promise<InboundEmail> {
    const [email] = await db
      .insert(inboundEmails)
      .values(emailData)
      .returning();
    return email;
  }

  async getInboundEmailById(id: string): Promise<InboundEmail | undefined> {
    const [email] = await db
      .select()
      .from(inboundEmails)
      .where(eq(inboundEmails.id, id));
    return email;
  }

  async updateInboundEmailAnalysis(id: string, analysisData: {
    responseType?: string;
    extractedData?: any;
    violations?: string[];
    legitimacyScore?: number;
    recommendations?: any;
    analysisMetadata?: any;
  }): Promise<InboundEmail | undefined> {
    const [email] = await db
      .update(inboundEmails)
      .set({
        responseType: analysisData.responseType,
        extractedData: analysisData.extractedData,
        violations: analysisData.violations,
        legitimacyScore: analysisData.legitimacyScore,
        recommendations: analysisData.recommendations,
        analysisMetadata: analysisData.analysisMetadata,
      })
      .where(eq(inboundEmails.id, id))
      .returning();
    return email;
  }

  // Operator action tokens operations
  async createOperatorActionToken(tokenData: InsertOperatorActionToken): Promise<OperatorActionToken> {
    const [token] = await db
      .insert(operatorActionTokens)
      .values(tokenData)
      .returning();
    return token;
  }

  async getOperatorActionTokenByToken(token: string): Promise<OperatorActionToken | undefined> {
    const [tokenRecord] = await db
      .select()
      .from(operatorActionTokens)
      .where(eq(operatorActionTokens.token, token));
    return tokenRecord;
  }

  async markOperatorActionTokenAsUsed(token: string, usedByIp: string, userAgent: string): Promise<OperatorActionToken | undefined> {
    const [tokenRecord] = await db
      .update(operatorActionTokens)
      .set({ 
        usedAt: new Date(),
        usedByIp,
        userAgent
      })
      .where(eq(operatorActionTokens.token, token))
      .returning();
    return tokenRecord;
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

  async getAllActiveSubscriptions(): Promise<Subscription[]> {
    const activeSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'))
      .orderBy(desc(subscriptions.createdAt));
    return activeSubscriptions;
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
    // SECURITY GUARD: Prevent demo account creation in production
    if (process.env.NODE_ENV !== 'development') {
      console.log('🔒 SECURITY: Demo account seeding blocked in production environment');
      return;
    }
    
    console.log('🌱 Seeding demo account (development only)...');
    
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

    // Seed data brokers globally (independent of user demo data)
    await this.seedDataBrokers();
    
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

  // Seed data brokers globally (independent of user demo data)
  private async seedDataBrokers(): Promise<void> {
    // Check if data brokers already exist to avoid duplicates
    const existingBrokers = await this.getAllDataBrokers();
    if (existingBrokers.length === 0) {
      console.log('🏢 Seeding data brokers...');
      
      // Insert Сбербанк
      await this.insertDataBroker({
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
        tags: ['банк', 'кредитная история', 'финансовые данные']
      });

      // Insert МТС
      await this.insertDataBroker({
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
        tags: ['телеком', 'мобильная связь', 'геолокация']
      });

      // Insert Яндекс
      await this.insertDataBroker({
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
        tags: ['поисковик', 'реклама', 'поведенческие данные']
      });

      console.log('✅ Data brokers seeded successfully');
    } else {
      console.log('✅ Data brokers already exist, skipping seeding');
    }
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
    console.log(`🔍 DatabaseStorage: Looking for referral code: ${code}`);
    const [referralCode] = await db
      .select()
      .from(referralCodes)
      .where(and(eq(referralCodes.code, code), eq(referralCodes.isActive, true)));
    console.log(`🔍 DatabaseStorage: Found referral code:`, referralCode);
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

  // Points system operations
  async getUserPoints(userId: string): Promise<number> {
    const [account] = await db
      .select({ points: userAccounts.points })
      .from(userAccounts)
      .where(eq(userAccounts.id, userId));
    
    return account?.points || 0;
  }

  async addUserPoints(userId: string, points: number, reason?: string): Promise<UserAccount | undefined> {
    const [updatedAccount] = await db
      .update(userAccounts)
      .set({ 
        points: sql`${userAccounts.points} + ${points}`,
        updatedAt: new Date()
      })
      .where(eq(userAccounts.id, userId))
      .returning();
    
    return updatedAccount;
  }

  async deductUserPoints(userId: string, points: number): Promise<{success: boolean, remainingPoints: number, newBalance: number}> {
    // First get current points to check if user has enough
    const currentPoints = await this.getUserPoints(userId);
    
    if (currentPoints < points) {
      return {
        success: false,
        remainingPoints: points - currentPoints,
        newBalance: currentPoints
      };
    }
    
    // Deduct points
    const [updatedAccount] = await db
      .update(userAccounts)
      .set({ 
        points: sql`${userAccounts.points} - ${points}`,
        updatedAt: new Date()
      })
      .where(eq(userAccounts.id, userId))
      .returning();
    
    return {
      success: true,
      remainingPoints: 0,
      newBalance: updatedAccount?.points || 0
    };
  }

  // Blog article operations
  async createBlogArticle(articleData: InsertBlogArticle): Promise<BlogArticle> {
    const [article] = await db
      .insert(blogArticles)
      .values(articleData)
      .returning();
    return article;
  }

  async getBlogArticleById(id: string): Promise<BlogArticle | undefined> {
    const [article] = await db
      .select()
      .from(blogArticles)
      .where(eq(blogArticles.id, id));
    return article;
  }

  async getBlogArticleBySlug(slug: string): Promise<BlogArticle | undefined> {
    const [article] = await db
      .select()
      .from(blogArticles)
      .where(eq(blogArticles.slug, slug));
    return article;
  }

  async getPublishedBlogArticles(filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<BlogArticle[]> {
    const conditions = [eq(blogArticles.status, 'published')];

    if (filters?.category) {
      conditions.push(eq(blogArticles.category, filters.category));
    }

    if (filters?.featured !== undefined) {
      conditions.push(eq(blogArticles.featured, filters.featured));
    }

    const baseQuery = db
      .select()
      .from(blogArticles)
      .where(and(...conditions))
      .orderBy(desc(blogArticles.publishedAt));

    if (filters?.limit != null && filters?.offset != null) {
      return await baseQuery.limit(filters.limit).offset(filters.offset);
    }
    if (filters?.limit != null) {
      return await baseQuery.limit(filters.limit);
    }
    if (filters?.offset != null) {
      return await baseQuery.offset(filters.offset);
    }
    
    return await baseQuery;
  }

  async getAllBlogArticles(filters?: {
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<BlogArticle[]> {
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(blogArticles.status, filters.status));
    }
    if (filters?.category) {
      conditions.push(eq(blogArticles.category, filters.category));
    }

    const whereQuery = conditions.length > 0 
      ? db.select().from(blogArticles).where(and(...conditions))
      : db.select().from(blogArticles);

    const orderedQuery = whereQuery.orderBy(desc(blogArticles.createdAt));

    if (filters?.limit != null && filters?.offset != null) {
      return await orderedQuery.limit(filters.limit).offset(filters.offset);
    }
    if (filters?.limit != null) {
      return await orderedQuery.limit(filters.limit);
    }
    if (filters?.offset != null) {
      return await orderedQuery.offset(filters.offset);
    }
    
    return await orderedQuery;
  }

  async updateBlogArticle(id: string, updates: Partial<BlogArticle>): Promise<BlogArticle | undefined> {
    const [updatedArticle] = await db
      .update(blogArticles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogArticles.id, id))
      .returning();
    return updatedArticle;
  }

  async incrementViewCount(id: string): Promise<BlogArticle | undefined> {
    const [updatedArticle] = await db
      .update(blogArticles)
      .set({ 
        viewCount: sql`${blogArticles.viewCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(blogArticles.id, id))
      .returning();
    return updatedArticle;
  }

  async deleteBlogArticle(id: string): Promise<boolean> {
    const result = await db
      .delete(blogArticles)
      .where(eq(blogArticles.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Blog generation settings operations
  async getBlogGenerationSettings(): Promise<BlogGenerationSettings | undefined> {
    const [settings] = await db
      .select()
      .from(blogGenerationSettings)
      .limit(1);
    return settings;
  }

  async updateBlogGenerationSettings(updates: Partial<BlogGenerationSettings>): Promise<BlogGenerationSettings | undefined> {
    // First, try to update existing settings
    const [updatedSettings] = await db
      .update(blogGenerationSettings)
      .set({ ...updates, updatedAt: new Date() })
      .returning();
    
    return updatedSettings;
  }

  async createBlogGenerationSettings(settingsData: InsertBlogGenerationSettings): Promise<BlogGenerationSettings> {
    const [settings] = await db
      .insert(blogGenerationSettings)
      .values(settingsData)
      .returning();
    return settings;
  }

  // ========================================
  // ADMIN PANEL STATISTICS METHODS (DatabaseStorage)
  // ========================================

  async getUsersCount(search?: string, role?: string): Promise<number> {
    try {
      let query = db
        .select({ count: sql<number>`count(*)`.as('count') })
        .from(userAccounts);
      
      const conditions = [];
      if (search) {
        conditions.push(sql`${userAccounts.email} ILIKE ${`%${search}%`}`);
      }
      if (role && role !== 'all') {
        conditions.push(eq(userAccounts.adminRole, role));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const [result] = await query;
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting users count:', error);
      return 0;
    }
  }

  async getVerifiedUsersCount(): Promise<number> {
    try {
      const [result] = await db
        .select({ count: sql<number>`count(*)`.as('count') })
        .from(userAccounts)
        .where(eq(userAccounts.emailVerified, true));
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting verified users count:', error);
      return 0;
    }
  }

  async getAdminsCount(): Promise<number> {
    try {
      const [result] = await db
        .select({ count: sql<number>`count(*)`.as('count') })
        .from(userAccounts)
        .where(eq(userAccounts.isAdmin, true));
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting admins count:', error);
      return 0;
    }
  }

  async getRecentUsersCount(days: number): Promise<number> {
    try {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - days);
      
      const [result] = await db
        .select({ count: sql<number>`count(*)`.as('count') })
        .from(userAccounts)
        .where(sql`${userAccounts.createdAt} >= ${dateFrom}`);
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting recent users count:', error);
      return 0;
    }
  }

  async getBlogArticlesCount(status?: string, search?: string): Promise<number> {
    try {
      let query = db
        .select({ count: sql<number>`count(*)`.as('count') })
        .from(blogArticles);
      
      const conditions = [];
      if (status && status !== 'all') {
        conditions.push(eq(blogArticles.status, status));
      }
      if (search) {
        conditions.push(sql`(${blogArticles.title} ILIKE ${`%${search}%`} OR ${blogArticles.content} ILIKE ${`%${search}%`})`);
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const [result] = await query;
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting blog articles count:', error);
      return 0;
    }
  }

  async getPublishedBlogArticlesCount(): Promise<number> {
    try {
      const [result] = await db
        .select({ count: sql<number>`count(*)`.as('count') })
        .from(blogArticles)
        .where(eq(blogArticles.status, 'published'));
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting published blog articles count:', error);
      return 0;
    }
  }

  async getLastGeneratedArticleDate(): Promise<Date | null> {
    try {
      const [settings] = await db
        .select()
        .from(blogGenerationSettings)
        .limit(1);
      return settings?.lastGeneratedAt || null;
    } catch (error) {
      console.error('Error getting last generated article date:', error);
      return null;
    }
  }

  async getEmailsSentCount(days: number): Promise<number> {
    // TODO: Implement when email tracking table is available
    return 0;
  }

  async getEmailDeliveryRate(): Promise<number> {
    // TODO: Implement when email tracking table is available
    return 98.5;
  }

  async getEmailBounceRate(): Promise<number> {
    // TODO: Implement when email tracking table is available
    return 1.2;
  }

  async getUsers(options: { 
    limit: number; 
    offset: number; 
    search?: string; 
    role?: string 
  }): Promise<UserAccount[]> {
    try {
      let query = db
        .select()
        .from(userAccounts);
      
      const conditions = [];
      if (options.search) {
        conditions.push(sql`${userAccounts.email} ILIKE ${`%${options.search}%`}`);
      }
      if (options.role && options.role !== 'all') {
        conditions.push(eq(userAccounts.adminRole, options.role));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const users = await query
        .orderBy(desc(userAccounts.createdAt))
        .limit(options.limit)
        .offset(options.offset);
      
      // Hide password hashes for security
      return users.map(user => ({ ...user, passwordHash: '[HIDDEN]' }));
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async getSystemLogs(options: { type: string; limit: number }): Promise<any[]> {
    return []; // TODO: Implement system logs table
  }

  // ========================================
  // PLATFORM SECRETS MANAGEMENT (DatabaseStorage)
  // ========================================

  async createPlatformSecret(secretData: InsertPlatformSecret): Promise<PlatformSecret> {
    const { encryptSecret } = await import('./crypto');
    
    // Encrypt the secret value
    const encryptedData = encryptSecret(secretData.encryptedValue);
    
    const [secret] = await db
      .insert(platformSecrets)
      .values({
        ...secretData,
        encryptedValue: encryptedData.encrypted,
      })
      .returning();
    
    // Return with masked value  
    const { maskSecret } = await import('./crypto');
    return {
      ...secret,
      encryptedValue: maskSecret(secretData.encryptedValue),
    };
  }

  async getPlatformSecrets(filters?: { service?: string; environment?: string }): Promise<PlatformSecret[]> {
    let query = db.select().from(platformSecrets);
    
    if (filters?.service) {
      query = query.where(eq(platformSecrets.service, filters.service));
    }
    if (filters?.environment) {
      query = query.where(eq(platformSecrets.environment, filters.environment));
    }
    
    const secrets = await query.orderBy(desc(platformSecrets.createdAt));
    
    // Mask all secret values
    const { maskSecret } = await import('./crypto');
    return secrets.map(secret => ({
      ...secret,
      encryptedValue: maskSecret(secret.encryptedValue),
    }));
  }

  async getPlatformSecretByKey(key: string): Promise<PlatformSecret | undefined> {
    const [secret] = await db
      .select()
      .from(platformSecrets)
      .where(eq(platformSecrets.key, key));
    
    if (!secret) return undefined;
    
    // Decrypt the secret value
    const { decryptSecret } = await import('./crypto');
    try {
      const decrypted = decryptSecret({
        encrypted: secret.encryptedValue,
        iv: '', // Encryption metadata not stored in schema
        tag: '',
        salt: '',
      });
      
      return {
        ...secret,
        encryptedValue: decrypted,
      };
    } catch (error) {
      console.error('Failed to decrypt secret:', error);
      throw new Error('Failed to decrypt platform secret');
    }
  }

  async updatePlatformSecret(key: string, value: string, adminId: string): Promise<PlatformSecret | undefined> {
    const { encryptSecret, maskSecret } = await import('./crypto');
    
    // Get existing secret to log old value
    const existing = await this.getPlatformSecretByKey(key);
    if (!existing) return undefined;
    
    // Encrypt new value
    const encryptedData = encryptSecret(value);
    
    // Update secret
    const [updated] = await db
      .update(platformSecrets)
      .set({
        encryptedValue: encryptedData.encrypted,
        updatedBy: adminId,
        updatedAt: new Date(),
      })
      .where(eq(platformSecrets.key, key))
      .returning();
    
    // Log audit
    await this.logSecretAudit({
      secretId: updated.id,
      adminId,
      action: 'update',
      secretKey: key,
      service: updated.service,
      environment: updated.environment,
      previousValueHash: maskSecret(existing.encryptedValue),
      newValueHash: maskSecret(value),
      ipAddress: null, // Will be set in route handler
      userAgent: null, // Will be set in route handler
    });
    
    return {
      ...updated,
      encryptedValue: maskSecret(value),
    };
  }

  async deletePlatformSecret(key: string, adminId: string, reason: string): Promise<boolean> {
    const existing = await this.getPlatformSecretByKey(key);
    if (!existing) return false;
    
    // Log audit before deletion
    const { maskSecret } = await import('./crypto');
    await this.logSecretAudit({
      secretId: existing.id,
      adminId,
      action: 'delete',
      secretKey: key,
      service: existing.service,
      environment: existing.environment,
      previousValueHash: maskSecret(existing.encryptedValue),
      newValueHash: null,
      reason,
      metadata: { reason },
      ipAddress: null, // Will be set in route handler
      userAgent: null, // Will be set in route handler
    });
    
    // Hard delete since no soft delete fields in schema
    const [deleted] = await db
      .delete(platformSecrets)
      .where(eq(platformSecrets.key, key))
      .returning();
    
    return !!deleted;
  }

  async validateSecret(key: string, service: string): Promise<boolean> {
    try {
      const secret = await this.getPlatformSecretByKey(key);
      if (!secret || secret.service !== service) return false;
      
      // Add service-specific validation logic here
      switch (service) {
        case 'sendgrid':
          // Validate SendGrid API key format
          return secret.encryptedValue.startsWith('SG.');
        case 'openai':
          // Validate OpenAI API key format
          return secret.encryptedValue.startsWith('sk-');
        case 'robokassa':
          // Basic check for Robokassa credentials
          return secret.encryptedValue.length > 0;
        default:
          // Generic validation - just check it exists
          return secret.encryptedValue.length > 0;
      }
    } catch (error) {
      console.error('Secret validation error:', error);
      return false;
    }
  }

  async logSecretAudit(auditData: InsertSecretsAuditLog): Promise<SecretsAuditLog> {
    const [audit] = await db
      .insert(secretsAuditLog)
      .values(auditData)
      .returning();
    return audit;
  }

  async getSecretsAuditLog(filters?: { secretId?: string; adminId?: string; limit?: number }): Promise<SecretsAuditLog[]> {
    let query = db.select().from(secretsAuditLog);
    
    if (filters?.secretId) {
      query = query.where(eq(secretsAuditLog.secretId, filters.secretId));
    }
    if (filters?.adminId) {
      query = query.where(eq(secretsAuditLog.adminId, filters.adminId));
    }
    
    const limit = filters?.limit || 100;
    return await query
      .orderBy(desc(secretsAuditLog.createdAt))
      .limit(limit);
  }

  // Admin permissions management placeholder methods
  async createAdminPermission(permissionData: InsertAdminPermission): Promise<AdminPermission> {
    const [permission] = await db
      .insert(adminPermissions)
      .values(permissionData)
      .returning();
    return permission;
  }

  async getAdminPermissions(adminId: string): Promise<AdminPermission[]> {
    return await db
      .select()
      .from(adminPermissions)
      .where(eq(adminPermissions.adminId, adminId))
      .orderBy(desc(adminPermissions.createdAt));
  }

  async checkAdminPermission(adminId: string, resource: string, action: string): Promise<boolean> {
    const [permission] = await db
      .select()
      .from(adminPermissions)
      .where(and(
        eq(adminPermissions.adminId, adminId),
        eq(adminPermissions.resource, resource),
        eq(adminPermissions.action, action),
        eq(adminPermissions.isActive, true)
      ));
    return !!permission;
  }

  async revokeAdminPermission(id: string): Promise<boolean> {
    const [revoked] = await db
      .update(adminPermissions)
      .set({ isActive: false })
      .where(eq(adminPermissions.id, id))
      .returning();
    return !!revoked;
  }

  async updateAdminPermission(id: string, updates: Partial<AdminPermission>): Promise<AdminPermission | undefined> {
    const [updated] = await db
      .update(adminPermissions)
      .set({ ...updates })
      .where(eq(adminPermissions.id, id))
      .returning();
    return updated;
  }

  async revokePermission(permissionId: string): Promise<boolean> {
    const [revoked] = await db
      .update(adminPermissions)
      .set({ isActive: false })
      .where(eq(adminPermissions.id, permissionId))
      .returning();
    return !!revoked;
  }

  // Admin actions logging placeholder methods
  async logAdminAction(actionData: InsertAdminAction): Promise<AdminAction> {
    const [action] = await db
      .insert(adminActions)
      .values(actionData)
      .returning();
    return action;
  }

  async getAdminActions(filters?: { adminId?: string; targetType?: string; limit?: number; offset?: number }): Promise<AdminAction[]> {
    let query = db.select().from(adminActions);
    
    if (filters?.adminId) {
      query = query.where(eq(adminActions.adminId, filters.adminId));
    }
    if (filters?.targetType) {
      query = query.where(eq(adminActions.targetType, filters.targetType));
    }
    
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;
    
    return await query
      .orderBy(desc(adminActions.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getAdminActionsBySession(sessionId: string): Promise<AdminAction[]> {
    return await db
      .select()
      .from(adminActions)
      .where(eq(adminActions.sessionId, sessionId))
      .orderBy(desc(adminActions.createdAt));
  }

  // Enhanced audit logs methods
  async getAuditLogs(filters?: {
    adminId?: string;
    action?: string;
    targetType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: AdminAction[]; total: number; page: number; totalPages: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;
    
    let conditions = [];
    
    if (filters?.adminId) {
      conditions.push(eq(adminActions.adminId, filters.adminId));
    }
    if (filters?.action) {
      conditions.push(eq(adminActions.actionType, filters.action));
    }
    if (filters?.targetType) {
      conditions.push(eq(adminActions.targetType, filters.targetType));
    }
    if (filters?.dateFrom) {
      conditions.push(sql`${adminActions.createdAt} >= ${filters.dateFrom}`);
    }
    if (filters?.dateTo) {
      conditions.push(sql`${adminActions.createdAt} <= ${filters.dateTo}`);
    }
    if (filters?.search && filters.search.trim()) {
      const searchTerm = `%${filters.search.trim()}%`;
      conditions.push(
        sql`(
          ${adminActions.actionType} ILIKE ${searchTerm} OR
          ${adminActions.targetType} ILIKE ${searchTerm} OR
          ${adminActions.targetId} ILIKE ${searchTerm} OR
          ${adminActions.metadata}::text ILIKE ${searchTerm}
        )`
      );
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const [logs, totalResult] = await Promise.all([
      db
        .select()
        .from(adminActions)
        .where(whereClause)
        .orderBy(desc(adminActions.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(adminActions)
        .where(whereClause)
    ]);
    
    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);
    
    return {
      logs,
      total,
      page,
      totalPages
    };
  }

  async getAuditLogById(id: string): Promise<AdminAction | null> {
    const result = await db
      .select()
      .from(adminActions)
      .where(eq(adminActions.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  async exportAuditLogs(dateRange?: { from: Date; to: Date }): Promise<string> {
    let conditions = [];
    
    if (dateRange) {
      conditions.push(
        and(
          sql`${adminActions.createdAt} >= ${dateRange.from}`,
          sql`${adminActions.createdAt} <= ${dateRange.to}`
        )
      );
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const logs = await db
      .select()
      .from(adminActions)
      .where(whereClause)
      .orderBy(desc(adminActions.createdAt));
    
    // Convert to CSV format
    const headers = ['ID', 'Admin ID', 'Action', 'Target Type', 'Target ID', 'IP Address', 'User Agent', 'Session ID', 'Created At', 'Metadata'];
    const csvRows = [headers.join(',')];
    
    for (const log of logs) {
      const row = [
        log.id,
        log.adminId,
        log.actionType,
        log.targetType || '',
        log.targetId || '',
        log.ipAddress,
        (log.userAgent || '').replace(/,/g, ';'), // Replace commas in user agent
        log.sessionId || '',
        (log.createdAt || new Date()).toISOString(),
        JSON.stringify(log.metadata || {}).replace(/,/g, ';') // Replace commas in JSON
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    }
    
    return csvRows.join('\n');
  }

  async grantPermission(permission: InsertAdminPermission): Promise<AdminPermission> {
    const [newPermission] = await db
      .insert(adminPermissions)
      .values(permission)
      .returning();
    
    // Log the permission grant
    await this.logAdminAction({
      adminId: permission.grantedBy || 'system',
      action: 'grant_permission',
      targetType: 'admin_permission',
      targetId: permission.adminId,
      metadata: {
        permission: permission.permission,
        expiresAt: permission.expiresAt,
        grantedTo: permission.adminId
      },
      sessionId: '',
      ipAddress: 'system',
      userAgent: 'system'
    });
    
    return newPermission;
  }

  async getPermissionHistory(adminId: string): Promise<AdminPermission[]> {
    return db
      .select()
      .from(adminPermissions)
      .where(eq(adminPermissions.adminId, adminId))
      .orderBy(desc(adminPermissions.createdAt));
  }

  async getSecurityStats(): Promise<{
    recentSuspiciousActivities: AdminAction[];
    failedLoginAttempts: number;
    permissionChanges: AdminAction[];
    mostActiveAdmins: { adminId: string; email: string; actionCount: number }[];
    securityScore: number;
    totalActions: number;
    criticalActions: number;
  }> {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Get recent suspicious activities
    const suspiciousActions = await db
      .select()
      .from(adminActions)
      .where(
        and(
          sql`${adminActions.createdAt} > ${twentyFourHoursAgo}`,
          sql`${adminActions.actionType} IN ('unauthorized_access_attempt', 'failed_login', 'permission_denied', 'suspicious_activity')`
        )
      )
      .orderBy(desc(adminActions.createdAt))
      .limit(10);
    
    // Count failed login attempts in last 24 hours
    const [failedLoginResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(adminActions)
      .where(
        and(
          eq(adminActions.actionType, 'failed_login'),
          sql`${adminActions.createdAt} > ${twentyFourHoursAgo}`
        )
      );
    
    // Get recent permission changes
    const permissionChanges = await db
      .select()
      .from(adminActions)
      .where(
        and(
          sql`${adminActions.createdAt} > ${sevenDaysAgo}`,
          sql`${adminActions.actionType} IN ('grant_permission', 'revoke_permission', 'update_admin_role')`
        )
      )
      .orderBy(desc(adminActions.createdAt))
      .limit(20);
    
    // Get most active admins in last 7 days
    const activeAdminsResult = await db
      .select({
        adminId: adminActions.adminId,
        actionCount: sql<number>`count(*)::int`
      })
      .from(adminActions)
      .where(sql`${adminActions.createdAt} > ${sevenDaysAgo}`)
      .groupBy(adminActions.adminId)
      .orderBy(desc(sql`count(*)`))
      .limit(5);
    
    // Get admin emails for most active admins
    const mostActiveAdmins = await Promise.all(
      activeAdminsResult.map(async (admin) => {
        const user = await this.getUserAccountById(admin.adminId);
        return {
          adminId: admin.adminId,
          email: user?.email || 'Unknown',
          actionCount: admin.actionCount
        };
      })
    );
    
    // Get total actions count
    const [totalActionsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(adminActions);
    
    // Get critical actions count
    const [criticalActionsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(adminActions)
      .where(
        sql`${adminActions.actionType} IN ('delete_user', 'grant_permission', 'revoke_permission', 'update_admin_role', 'delete_data', 'export_data')`
      );
    
    // Calculate security score (0-100)
    // Higher score is better
    let securityScore = 100;
    
    // Deduct for failed login attempts
    if (failedLoginResult.count > 0) {
      securityScore -= Math.min(20, failedLoginResult.count * 2);
    }
    
    // Deduct for suspicious activities
    if (suspiciousActions.length > 0) {
      securityScore -= Math.min(30, suspiciousActions.length * 3);
    }
    
    // Bonus for regular monitoring (if there are recent view actions)
    const [monitoringResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(adminActions)
      .where(
        and(
          sql`${adminActions.createdAt} > ${twentyFourHoursAgo}`,
          sql`${adminActions.actionType} IN ('view_audit_logs', 'view_security_dashboard')`
        )
      );
    
    if (monitoringResult.count > 0) {
      securityScore = Math.min(100, securityScore + 10);
    }
    
    securityScore = Math.max(0, securityScore);
    
    return {
      recentSuspiciousActivities: suspiciousActions,
      failedLoginAttempts: failedLoginResult.count || 0,
      permissionChanges,
      mostActiveAdmins,
      securityScore,
      totalActions: totalActionsResult.count || 0,
      criticalActions: criticalActionsResult.count || 0
    };
  }

  // System health check placeholder methods
  async createSystemHealthCheck(healthData: InsertSystemHealthCheck): Promise<SystemHealthCheck> {
    const [health] = await db
      .insert(systemHealthChecks)
      .values(healthData)
      .returning();
    return health;
  }

  async getSystemHealthChecks(filters?: { serviceName?: string; status?: string }): Promise<SystemHealthCheck[]> {
    let query = db.select().from(systemHealthChecks);
    
    if (filters?.serviceName) {
      query = query.where(eq(systemHealthChecks.serviceName, filters.serviceName));
    }
    if (filters?.status) {
      query = query.where(eq(systemHealthChecks.status, filters.status));
    }
    
    return await query.orderBy(desc(systemHealthChecks.createdAt));
  }
  
  async updateSystemHealthCheck(id: string, updates: Partial<SystemHealthCheck>): Promise<SystemHealthCheck | undefined> {
    const [updated] = await db
      .update(systemHealthChecks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(systemHealthChecks.id, id))
      .returning();
    return updated;
  }
  
  async getLatestHealthCheckByService(serviceName: string): Promise<SystemHealthCheck | undefined> {
    const [health] = await db
      .select()
      .from(systemHealthChecks)
      .where(eq(systemHealthChecks.serviceName, serviceName))
      .orderBy(desc(systemHealthChecks.createdAt))
      .limit(1);
    return health;
  }
  
  async getLatestHealthCheck(serviceName: string): Promise<SystemHealthCheck | undefined> {
    const [health] = await db
      .select()
      .from(systemHealthChecks)
      .where(eq(systemHealthChecks.serviceName, serviceName))
      .orderBy(desc(systemHealthChecks.lastCheckAt))
      .limit(1);
    return health;
  }

  async getHealthCheckHistory(serviceName: string, limit: number = 100): Promise<SystemHealthCheck[]> {
    return await db
      .select()
      .from(systemHealthChecks)
      .where(eq(systemHealthChecks.serviceName, serviceName))
      .orderBy(desc(systemHealthChecks.lastCheckAt))
      .limit(limit);
  }

  // Email service status methods
  async createEmailServiceStatus(statusData: InsertEmailServiceStatus): Promise<EmailServiceStatus> {
    const [status] = await db
      .insert(emailServiceStatus)
      .values(statusData)
      .returning();
    return status;
  }
  
  async getEmailServiceStatuses(filters?: { provider?: string; status?: string; recipient?: string; limit?: number }): Promise<EmailServiceStatus[]> {
    let query = db.select().from(emailServiceStatus);
    
    if (filters?.provider) {
      query = query.where(eq(emailServiceStatus.provider, filters.provider));
    }
    if (filters?.status) {
      query = query.where(eq(emailServiceStatus.status, filters.status));
    }
    if (filters?.recipient) {
      query = query.where(eq(emailServiceStatus.recipient, filters.recipient));
    }
    
    const limit = filters?.limit || 100;
    return await query.orderBy(desc(emailServiceStatus.createdAt)).limit(limit);
  }
  
  async updateEmailServiceStatus(id: string, updates: Partial<EmailServiceStatus>): Promise<EmailServiceStatus | undefined> {
    const [updated] = await db
      .update(emailServiceStatus)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emailServiceStatus.id, id))
      .returning();
    return updated;
  }
  
  async getEmailServiceStatusByMessageId(messageId: string): Promise<EmailServiceStatus | undefined> {
    const [status] = await db
      .select()
      .from(emailServiceStatus)
      .where(eq(emailServiceStatus.messageId, messageId));
    return status;
  }

  async getEmailServiceStatus(serviceName: string): Promise<EmailServiceStatus | undefined> {
    const [status] = await db
      .select()
      .from(emailServiceStatus)
      .where(eq(emailServiceStatus.provider, serviceName));
    return status;
  }

  async getAllEmailServiceStatuses(): Promise<EmailServiceStatus[]> {
    return await db
      .select()
      .from(emailServiceStatus)
      .orderBy(desc(emailServiceStatus.deliveredAt));
  }
  
  async getEmailDeliveryStats(startDate: Date, endDate: Date): Promise<{
    total: number;
    delivered: number;
    bounced: number;
    failed: number;
    openRate: number;
    clickRate: number;
  }> {
    // Stub implementation - in production, this would query actual email statistics
    return {
      total: 1000,
      delivered: 950,
      bounced: 30,
      failed: 20,
      openRate: 35.5,
      clickRate: 12.3
    };
  }

  // Email template management placeholder methods
  async createEmailTemplate(templateData: InsertEmailTemplate): Promise<EmailTemplate> {
    const [template] = await db
      .insert(emailTemplates)
      .values(templateData)
      .returning();
    return template;
  }

  async getEmailTemplateByName(name: string): Promise<EmailTemplate | undefined> {
    const [template] = await db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.name, name));
    return template;
  }

  async getAllEmailTemplates(): Promise<EmailTemplate[]> {
    return await db
      .select()
      .from(emailTemplates)
      .orderBy(desc(emailTemplates.createdAt));
  }

  async updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | undefined> {
    const [updated] = await db
      .update(emailTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emailTemplates.id, id))
      .returning();
    return updated;
  }

  async createEmailTemplateVersion(versionData: InsertEmailTemplateVersion): Promise<EmailTemplateVersion> {
    const [version] = await db
      .insert(emailTemplateVersions)
      .values(versionData)
      .returning();
    return version;
  }

  async getEmailTemplateVersions(templateId: string): Promise<EmailTemplateVersion[]> {
    return await db
      .select()
      .from(emailTemplateVersions)
      .where(eq(emailTemplateVersions.templateId, templateId))
      .orderBy(desc(emailTemplateVersions.createdAt));
  }

  async getActiveEmailTemplateVersion(templateId: string): Promise<EmailTemplateVersion | undefined> {
    const [version] = await db
      .select()
      .from(emailTemplateVersions)
      .where(and(
        eq(emailTemplateVersions.templateId, templateId),
        eq(emailTemplateVersions.isPublished, true)
      ));
    return version;
  }

  async publishEmailTemplateVersion(id: string, publishedBy: string): Promise<EmailTemplateVersion | undefined> {
    // Deactivate all other versions
    await db
      .update(emailTemplateVersions)
      .set({ isPublished: false })
      .where(eq(emailTemplateVersions.templateId, 
        sql`(SELECT template_id FROM ${emailTemplateVersions} WHERE id = ${id})`
      ));
    
    // Activate this version
    const [published] = await db
      .update(emailTemplateVersions)
      .set({ 
        isPublished: true,
        publishedAt: new Date(),
        publishedBy
      })
      .where(eq(emailTemplateVersions.id, id))
      .returning();
    
    return published;
  }

  async getEmailTemplates(filters?: { category?: string; isActive?: boolean; search?: string }): Promise<EmailTemplate[]> {
    const conditions = [];
    
    if (filters?.category) {
      conditions.push(eq(emailTemplates.category, filters.category));
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(emailTemplates.isActive, filters.isActive));
    }
    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(sql`(
        LOWER(${emailTemplates.name}) LIKE LOWER(${searchTerm}) OR
        LOWER(${emailTemplates.subject}) LIKE LOWER(${searchTerm})
      )`);
    }
    
    conditions.push(eq(emailTemplates.isDeleted, false));
    
    return await db
      .select()
      .from(emailTemplates)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(emailTemplates.category, emailTemplates.name);
  }

  async getEmailTemplateById(id: string): Promise<EmailTemplate | undefined> {
    const [template] = await db
      .select()
      .from(emailTemplates)
      .where(and(
        eq(emailTemplates.id, id),
        eq(emailTemplates.isDeleted, false)
      ));
    return template;
  }

  async deleteEmailTemplate(id: string): Promise<boolean> {
    const result = await db
      .delete(emailTemplates)
      .where(eq(emailTemplates.id, id));
    return (result.rowCount || 0) > 0;
  }

  async softDeleteEmailTemplate(id: string, deletedBy: string): Promise<EmailTemplate | undefined> {
    const [deleted] = await db
      .update(emailTemplates)
      .set({
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy,
        updatedAt: new Date()
      })
      .where(eq(emailTemplates.id, id))
      .returning();
    return deleted;
  }

  async cloneEmailTemplate(id: string, newName: string, createdBy: string): Promise<EmailTemplate> {
    const original = await this.getEmailTemplateById(id);
    if (!original) throw new Error('Template not found');
    
    const [cloned] = await db
      .insert(emailTemplates)
      .values({
        name: newName,
        category: original.category,
        subject: original.subject,
        htmlBody: original.htmlBody,
        textBody: original.textBody,
        variables: original.variables,
        fromName: original.fromName,
        fromEmail: original.fromEmail,
        replyTo: original.replyTo,
        isActive: false,
        testData: original.testData,
        createdBy,
        metadata: { ...original.metadata, clonedFrom: id }
      })
      .returning();
    return cloned;
  }

  async getEmailTemplateVersion(id: string): Promise<EmailTemplateVersion | undefined> {
    const [version] = await db
      .select()
      .from(emailTemplateVersions)
      .where(eq(emailTemplateVersions.id, id));
    return version;
  }

  async testEmailTemplate(templateId: string, testEmail: string, testData?: any): Promise<{ success: boolean; message: string }> {
    // Implementation for sending test emails
    try {
      const template = await this.getEmailTemplateById(templateId);
      if (!template) {
        return { success: false, message: 'Template not found' };
      }
      // Here you would integrate with your email service
      return { success: true, message: 'Test email sent successfully' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async exportEmailTemplate(id: string): Promise<any> {
    const template = await this.getEmailTemplateById(id);
    if (!template) throw new Error('Template not found');
    
    const versions = await this.getEmailTemplateVersions(id);
    
    return {
      template,
      versions,
      exportedAt: new Date().toISOString()
    };
  }

  async importEmailTemplate(templateData: any, createdBy: string): Promise<EmailTemplate> {
    const { template, versions } = templateData;
    
    // Create new template with a unique name
    const [imported] = await db
      .insert(emailTemplates)
      .values({
        ...template,
        id: undefined,
        name: `${template.name}_imported_${Date.now()}`,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    // Import versions if any
    if (versions && versions.length > 0) {
      for (const version of versions) {
        await this.createEmailTemplateVersion({
          ...version,
          templateId: imported.id,
          createdBy
        });
      }
    }
    
    return imported;
  }

  async searchUsers(options: {
    text?: string;
    dateFrom?: Date;
    dateTo?: Date;
    subscriptionStatus?: string;
    verificationStatus?: string;
    adminRole?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit: number;
    offset: number;
  }): Promise<{ users: (UserAccount & { profile?: UserProfile; subscription?: Subscription | null })[], total: number }> {
    try {
      let whereConditions = [];
      
      // Text search (email, name, phone)
      if (options.text) {
        const searchText = `%${options.text}%`;
        whereConditions.push(
          sql`${userAccounts.email} ILIKE ${searchText} OR 
              ${userProfiles.firstName} ILIKE ${searchText} OR 
              ${userProfiles.lastName} ILIKE ${searchText} OR 
              ${userProfiles.phone} ILIKE ${searchText}`
        );
      }
      
      // Date range filter
      if (options.dateFrom) {
        whereConditions.push(sql`${userAccounts.createdAt} >= ${options.dateFrom}`);
      }
      if (options.dateTo) {
        whereConditions.push(sql`${userAccounts.createdAt} <= ${options.dateTo}`);
      }
      
      // Verification status filter
      if (options.verificationStatus === 'verified') {
        whereConditions.push(eq(userAccounts.emailVerified, true));
      } else if (options.verificationStatus === 'unverified') {
        whereConditions.push(eq(userAccounts.emailVerified, false));
      }
      
      // Admin role filter
      if (options.adminRole && options.adminRole !== 'all') {
        whereConditions.push(eq(userAccounts.adminRole, options.adminRole));
      }
      
      // Build the query
      const baseQuery = db
        .select({
          account: userAccounts,
          profile: userProfiles,
          subscription: subscriptions,
        })
        .from(userAccounts)
        .leftJoin(userProfiles, eq(userAccounts.id, userProfiles.userId))
        .leftJoin(subscriptions, and(
          eq(userAccounts.id, subscriptions.userId),
          eq(subscriptions.status, 'active')
        ));
      
      // Apply where conditions
      const filteredQuery = whereConditions.length > 0
        ? baseQuery.where(and(...whereConditions))
        : baseQuery;
      
      // Count total results
      const countQuery = db
        .select({ count: sql<number>`count(*)`.as('count') })
        .from(userAccounts)
        .leftJoin(userProfiles, eq(userAccounts.id, userProfiles.userId));
      
      const countResult = whereConditions.length > 0
        ? await countQuery.where(and(...whereConditions))
        : await countQuery;
      
      const total = countResult[0]?.count || 0;
      
      // Apply sorting
      const sortBy = options.sortBy || 'createdAt';
      const sortDirection = options.sortOrder || 'desc';
      
      let sortedQuery;
      const finalQuery = filteredQuery;
      
      switch (sortBy) {
        case 'email':
          sortedQuery = sortDirection === 'asc'
            ? finalQuery.orderBy(userAccounts.email)
            : finalQuery.orderBy(desc(userAccounts.email));
          break;
        case 'name':
          sortedQuery = sortDirection === 'asc'
            ? finalQuery.orderBy(userProfiles.firstName)
            : finalQuery.orderBy(desc(userProfiles.firstName));
          break;
        case 'createdAt':
        default:
          sortedQuery = sortDirection === 'asc'
            ? finalQuery.orderBy(userAccounts.createdAt)
            : finalQuery.orderBy(desc(userAccounts.createdAt));
          break;
      }
      
      // Apply pagination
      const results = await sortedQuery
        .limit(options.limit)
        .offset(options.offset);
      
      // Format results
      const users = results.map(row => ({
        ...row.account,
        passwordHash: '[HIDDEN]',
        profile: row.profile || undefined,
        subscription: row.subscription || null,
      }));
      
      return { users, total };
    } catch (error) {
      console.error('Error searching users:', error);
      return { users: [], total: 0 };
    }
  }
  
  async getUserWithDetails(userId: string): Promise<{
    account: UserAccount;
    profile?: UserProfile;
    subscription?: Subscription | null;
    payments?: Payment[];
    activities?: any[];
    notes?: any[];
  } | undefined> {
    try {
      const account = await this.getUserAccountById(userId);
      if (!account) return undefined;
      
      const profile = await this.getUserProfile(userId);
      const subscription = await this.getUserSubscription(userId);
      const payments = await this.getUserPayments(userId);
      
      // Hide password hash
      account.passwordHash = '[HIDDEN]';
      
      return {
        account,
        profile,
        subscription,
        payments,
        activities: [], // TODO: Implement activity history
        notes: [], // TODO: Implement user notes
      };
    } catch (error) {
      console.error('Error getting user details:', error);
      return undefined;
    }
  }
  
  async banUser(userId: string, reason: string, bannedBy: string): Promise<UserAccount | undefined> {
    try {
      // Add banned status to user account (we'll use adminRole field to indicate banned status)
      const [updated] = await db
        .update(userAccounts)
        .set({
          adminRole: 'banned',
        })
        .where(eq(userAccounts.id, userId))
        .returning();
      
      // Log the ban action
      await this.logAdminAction({
        adminId: bannedBy,
        actionType: 'ban_user',
        targetType: 'user',
        targetId: userId,
        metadata: { reason },
        ipAddress: null,
        userAgent: null,
        sessionId: null,
      });
      
      if (updated) {
        updated.passwordHash = '[HIDDEN]';
      }
      return updated;
    } catch (error) {
      console.error('Error banning user:', error);
      return undefined;
    }
  }
  
  async unbanUser(userId: string, unbannedBy: string): Promise<UserAccount | undefined> {
    try {
      const [updated] = await db
        .update(userAccounts)
        .set({
          adminRole: 'user',
        })
        .where(eq(userAccounts.id, userId))
        .returning();
      
      // Log the unban action
      await this.logAdminAction({
        adminId: unbannedBy,
        actionType: 'unban_user',
        targetType: 'user',
        targetId: userId,
        ipAddress: null,
        userAgent: null,
        sessionId: null,
      });
      
      if (updated) {
        updated.passwordHash = '[HIDDEN]';
      }
      return updated;
    } catch (error) {
      console.error('Error unbanning user:', error);
      return undefined;
    }
  }
  
  async addUserNote(userId: string, note: string, addedBy: string): Promise<any> {
    // TODO: Implement user notes table
    const noteData = {
      id: `note_${Date.now()}`,
      userId,
      note,
      addedBy,
      createdAt: new Date(),
    };
    
    // Log the action
    await this.logAdminAction({
      adminId: addedBy,
      actionType: 'add_user_note',
      targetType: 'user',
      targetId: userId,
      metadata: { note },
      ipAddress: null,
      userAgent: null,
      sessionId: null,
    });
    
    return noteData;
  }
  
  async getUserActivityHistory(userId: string, limit: number = 100): Promise<any[]> {
    try {
      // Get various activities
      const activities = [];
      
      // Get login history (from lastLoginAt)
      const account = await this.getUserAccountById(userId);
      if (account?.lastLoginAt) {
        activities.push({
          type: 'login',
          timestamp: account.lastLoginAt,
          details: 'Вход в систему',
        });
      }
      
      // Get deletion requests
      const deletions = await this.getUserDeletionRequests(userId);
      for (const deletion of deletions) {
        activities.push({
          type: 'deletion_request',
          timestamp: deletion.createdAt,
          details: `Запрос на удаление данных - ${deletion.status}`,
        });
      }
      
      // Sort by timestamp and limit
      return activities
        .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting user activity history:', error);
      return [];
    }
  }

  // ========================================
  // TWO-STAGE EMAIL SYSTEM METHODS IMPLEMENTATION
  // ========================================

  // Enhanced Operator Action Tokens operations
  async cleanupExpiredTokens(): Promise<number> {
    const result = await db
      .delete(operatorActionTokens)
      .where(sql`${operatorActionTokens.expiresAt} < NOW()`)
      .returning();
    
    console.log(`Cleaned up ${result.length} expired operator action tokens`);
    return result.length;
  }

  // Enhanced Inbound Emails operations  
  async getInboundEmailsByDeletionRequest(deletionRequestId: string): Promise<InboundEmail[]> {
    return await db
      .select()
      .from(inboundEmails)
      .where(eq(inboundEmails.deletionRequestId, deletionRequestId))
      .orderBy(desc(inboundEmails.receivedAt));
  }

  async updateInboundEmailClassification(id: string, parsedStatus: string): Promise<InboundEmail | undefined> {
    const [email] = await db
      .update(inboundEmails)
      .set({ parsedStatus })
      .where(eq(inboundEmails.id, id))
      .returning();
    return email;
  }

  // Deletion Request Status Transitions
  async updateDeletionRequestStatus(id: string, status: string, metadata?: any): Promise<DeletionRequest | undefined> {
    const updates: Partial<DeletionRequest> = {
      status,
      updatedAt: new Date(),
    };

    // Add metadata if provided
    if (metadata) {
      updates.responseDetails = metadata;
    }

    // Set completion timestamp for final statuses
    if (['completed', 'rejected', 'closed'].includes(status)) {
      updates.completedAt = new Date();
    }

    const [request] = await db
      .update(deletionRequests)
      .set(updates)
      .where(eq(deletionRequests.id, id))
      .returning();
    return request;
  }

  async updateFollowUpSent(id: string, messageId: string, sentAt: Date): Promise<DeletionRequest | undefined> {
    const [request] = await db
      .update(deletionRequests)
      .set({
        followUpMessageId: messageId,
        followUpSentAt: sentAt,
        status: 'followup_sent',
        updatedAt: new Date(),
      })
      .where(eq(deletionRequests.id, id))
      .returning();
    return request;
  }

  async updateEscalationSent(id: string, messageId: string, sentAt: Date): Promise<DeletionRequest | undefined> {
    const [request] = await db
      .update(deletionRequests)
      .set({
        escalationMessageId: messageId,
        escalationSentAt: sentAt,
        status: 'escalated',
        updatedAt: new Date(),
      })
      .where(eq(deletionRequests.id, id))
      .returning();
    return request;
  }

  async markOperatorConfirmed(id: string, confirmedAt: Date, confirmationToken?: string): Promise<DeletionRequest | undefined> {
    const updates: Partial<DeletionRequest> = {
      buttonConfirmedAt: confirmedAt,
      status: 'operator_confirmed',
      updatedAt: new Date(),
    };

    // If a confirmation token was used, store it in metadata
    if (confirmationToken) {
      const currentRequest = await db
        .select()
        .from(deletionRequests)
        .where(eq(deletionRequests.id, id))
        .limit(1);
      
      if (currentRequest[0]) {
        const currentDetails = currentRequest[0].responseDetails || {};
        updates.responseDetails = {
          ...currentDetails,
          confirmationToken,
          confirmedVia: 'button_click',
        };
      }
    }

    const [request] = await db
      .update(deletionRequests)
      .set(updates)
      .where(eq(deletionRequests.id, id))
      .returning();
    return request;
  }

  // Enhanced Query Methods for automation
  async getDeletionRequestsRequiringFollowUp(): Promise<DeletionRequest[]> {
    const now = new Date();
    
    return await db
      .select()
      .from(deletionRequests)
      .where(
        and(
          // Must be in sent_initial or delivered_initial status
          sql`${deletionRequests.status} IN ('sent_initial', 'delivered_initial')`,
          // Follow-up is due (followUpDueAt has passed)
          sql`${deletionRequests.followUpDueAt} IS NOT NULL AND ${deletionRequests.followUpDueAt} <= ${now}`,
          // Haven't sent follow-up yet
          sql`${deletionRequests.followUpSentAt} IS NULL`,
          // No operator confirmation yet
          sql`${deletionRequests.buttonConfirmedAt} IS NULL`,
          // No recent meaningful inbound emails (to avoid sending follow-up if operator already replied)
          sql`${deletionRequests.lastInboundAt} IS NULL OR ${deletionRequests.lastInboundAt} < ${deletionRequests.firstSentAt}`
        )
      )
      .orderBy(deletionRequests.followUpDueAt);
  }

  async getDeletionRequestsRequiringEscalation(): Promise<DeletionRequest[]> {
    const now = new Date();
    
    return await db
      .select()
      .from(deletionRequests)
      .where(
        and(
          // Must be in follow-up statuses or no response after initial
          sql`${deletionRequests.status} IN ('followup_sent', 'delivered_followup', 'no_response', 'sent_initial', 'delivered_initial')`,
          // Escalation is due (escalateDueAt has passed)
          sql`${deletionRequests.escalateDueAt} IS NOT NULL AND ${deletionRequests.escalateDueAt} <= ${now}`,
          // Haven't escalated yet
          sql`${deletionRequests.escalationSentAt} IS NULL`,
          // No operator confirmation yet
          sql`${deletionRequests.buttonConfirmedAt} IS NULL`,
          // No recent meaningful inbound emails
          sql`${deletionRequests.lastInboundAt} IS NULL OR ${deletionRequests.lastInboundAt} < ${deletionRequests.firstSentAt}`
        )
      )
      .orderBy(deletionRequests.escalateDueAt);
  }

  async getDeletionRequestsWithAnalytics(filters?: { 
    dateFrom?: Date; 
    dateTo?: Date; 
    operatorId?: string; 
    decisionType?: string; 
  }): Promise<DeletionRequest[]> {
    let query = db.select().from(deletionRequests);
    const conditions = [];
    
    if (filters?.dateFrom && filters.dateTo) {
      conditions.push(
        and(
          sql`${deletionRequests.createdAt} >= ${filters.dateFrom}`,
          sql`${deletionRequests.createdAt} <= ${filters.dateTo}`
        )
      );
    }
    
    if (filters?.operatorId) {
      // Filter by operator ID if it exists in the request data
      conditions.push(
        sql`${deletionRequests.requestDetails}->>'operatorId' = ${filters.operatorId}`
      );
    }
    
    if (filters?.decisionType) {
      conditions.push(eq(deletionRequests.decisionType, filters.decisionType));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query
      .orderBy(desc(deletionRequests.createdAt))
      .limit(1000); // Limit to 1000 requests for performance
  }

  // ========================================
  // САЗПД MODULES IMPLEMENTATIONS - TEMPORARILY DISABLED
  // ========================================
  /* TEMPORARILY DISABLED - САЗПД implementations causing compilation issues
  
  // Campaign operations
  async createCampaign(campaignData: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db
      .insert(campaigns)
      .values(campaignData)
      .returning();
    return campaign;
  }

  async getCampaignById(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id));
    return campaign;
  }

  async getUserCampaigns(userId: string): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.userId, userId))
      .orderBy(desc(campaigns.createdAt));
  }

  async getAllCampaigns(filters?: { status?: string; targetType?: string; priority?: string }): Promise<Campaign[]> {
    let query = db.select().from(campaigns);
    
    if (filters?.status) {
      query = query.where(eq(campaigns.status, filters.status));
    }
    if (filters?.targetType) {
      query = query.where(eq(campaigns.targetType, filters.targetType));
    }
    if (filters?.priority) {
      query = query.where(eq(campaigns.priority, filters.priority));
    }
    
    return await query.orderBy(desc(campaigns.createdAt));
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const [campaign] = await db
      .update(campaigns)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return campaign;
  }

  async deleteCampaign(id: string): Promise<boolean> {
    const result = await db
      .delete(campaigns)
      .where(eq(campaigns.id, id));
    return result.rowCount > 0;
  }

  async updateCampaignMetrics(id: string, metrics: { requested?: number; succeeded?: number; failed?: number }): Promise<Campaign | undefined> {
    const [campaign] = await db
      .update(campaigns)
      .set({ 
        metrics: sql`jsonb_set(jsonb_set(jsonb_set(${campaigns.metrics}, '{requested}', '${metrics.requested || 0}'), '{succeeded}', '${metrics.succeeded || 0}'), '{failed}', '${metrics.failed || 0}')`,
        updatedAt: new Date() 
      })
      .where(eq(campaigns.id, id))
      .returning();
    return campaign;
  }

  // Decision rules operations
  async createDecisionRule(ruleData: InsertDecisionRule): Promise<DecisionRule> {
    const [rule] = await db
      .insert(decisionRules)
      .values(ruleData)
      .returning();
    return rule;
  }

  async getDecisionRuleById(id: string): Promise<DecisionRule | undefined> {
    const [rule] = await db
      .select()
      .from(decisionRules)
      .where(eq(decisionRules.id, id));
    return rule;
  }

  async getDecisionRulesByState(state: string): Promise<DecisionRule[]> {
    return await db
      .select()
      .from(decisionRules)
      .where(and(eq(decisionRules.state, state), eq(decisionRules.isActive, true)))
      .orderBy(decisionRules.createdAt);
  }

  async getActiveDecisionRules(): Promise<DecisionRule[]> {
    return await db
      .select()
      .from(decisionRules)
      .where(eq(decisionRules.isActive, true))
      .orderBy(decisionRules.state, decisionRules.createdAt);
  }

  async updateDecisionRule(id: string, updates: Partial<DecisionRule>): Promise<DecisionRule | undefined> {
    const [rule] = await db
      .update(decisionRules)
      .set(updates)
      .where(eq(decisionRules.id, id))
      .returning();
    return rule;
  }

  async deactivateDecisionRule(id: string): Promise<DecisionRule | undefined> {
    const [rule] = await db
      .update(decisionRules)
      .set({ isActive: false })
      .where(eq(decisionRules.id, id))
      .returning();
    return rule;
  }

  // Evidence events operations
  async createEvidenceEvent(eventData: InsertEvidenceEvent): Promise<EvidenceEvent> {
    const [event] = await db
      .insert(evidenceEvents)
      .values(eventData)
      .returning();
    return event;
  }

  async getEvidenceEventById(id: string): Promise<EvidenceEvent | undefined> {
    const [event] = await db
      .select()
      .from(evidenceEvents)
      .where(eq(evidenceEvents.id, id));
    return event;
  }

  async getEvidenceEventsByCampaign(campaignId: string): Promise<EvidenceEvent[]> {
    return await db
      .select()
      .from(evidenceEvents)
      .where(eq(evidenceEvents.campaignId, campaignId))
      .orderBy(evidenceEvents.createdAt);
  }

  async getEvidenceEventsByRequest(requestId: string): Promise<EvidenceEvent[]> {
    return await db
      .select()
      .from(evidenceEvents)
      .where(eq(evidenceEvents.requestId, requestId))
      .orderBy(evidenceEvents.createdAt);
  }

  async getEvidenceEventsByType(type: string, campaignId?: string): Promise<EvidenceEvent[]> {
    let query = db.select().from(evidenceEvents).where(eq(evidenceEvents.type, type));
    
    if (campaignId) {
      query = query.where(eq(evidenceEvents.campaignId, campaignId));
    }
    
    return await query.orderBy(evidenceEvents.createdAt);
  }

  async getEvidenceEventsForSeal(date: Date): Promise<EvidenceEvent[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await db
      .select()
      .from(evidenceEvents)
      .where(
        and(
          sql`${evidenceEvents.createdAt} >= ${startOfDay}`,
          sql`${evidenceEvents.createdAt} <= ${endOfDay}`
        )
      )
      .orderBy(evidenceEvents.createdAt);
  }

  // Evidence daily seals operations
  async createEvidenceDailySeal(sealData: InsertEvidenceDailySeal): Promise<EvidenceDailySeal> {
    const [seal] = await db
      .insert(evidenceDailySeals)
      .values(sealData)
      .returning();
    return seal;
  }

  async getEvidenceDailySealById(id: string): Promise<EvidenceDailySeal | undefined> {
    const [seal] = await db
      .select()
      .from(evidenceDailySeals)
      .where(eq(evidenceDailySeals.id, id));
    return seal;
  }

  async getEvidenceDailySealByDate(date: Date): Promise<EvidenceDailySeal | undefined> {
    const [seal] = await db
      .select()
      .from(evidenceDailySeals)
      .where(eq(evidenceDailySeals.date, date));
    return seal;
  }

  async getEvidenceDailySeals(filters?: { fromDate?: Date; toDate?: Date }): Promise<EvidenceDailySeal[]> {
    let query = db.select().from(evidenceDailySeals);
    
    if (filters?.fromDate) {
      query = query.where(sql`${evidenceDailySeals.date} >= ${filters.fromDate}`);
    }
    if (filters?.toDate) {
      query = query.where(sql`${evidenceDailySeals.date} <= ${filters.toDate}`);
    }
    
    return await query.orderBy(desc(evidenceDailySeals.date));
  }

  // Legal norms operations
  async createLegalNorm(normData: InsertLegalNorm): Promise<LegalNorm> {
    const [norm] = await db
      .insert(legalNorms)
      .values(normData)
      .returning();
    return norm;
  }

  async getLegalNormById(id: string): Promise<LegalNorm | undefined> {
    const [norm] = await db
      .select()
      .from(legalNorms)
      .where(eq(legalNorms.id, id));
    return norm;
  }

  async getLegalNormByCode(code: string): Promise<LegalNorm | undefined> {
    const [norm] = await db
      .select()
      .from(legalNorms)
      .where(eq(legalNorms.code, code));
    return norm;
  }

  async getActiveLegalNorms(): Promise<LegalNorm[]> {
    return await db
      .select()
      .from(legalNorms)
      .where(eq(legalNorms.isActive, true))
      .orderBy(legalNorms.code);
  }

  async updateLegalNorm(id: string, updates: Partial<LegalNorm>): Promise<LegalNorm | undefined> {
    const [norm] = await db
      .update(legalNorms)
      .set(updates)
      .where(eq(legalNorms.id, id))
      .returning();
    return norm;
  }

  async deactivateLegalNorm(id: string): Promise<LegalNorm | undefined> {
    const [norm] = await db
      .update(legalNorms)
      .set({ isActive: false })
      .where(eq(legalNorms.id, id))
      .returning();
    return norm;
  }

  // Operator profiles operations
  async createOperatorProfile(profileData: InsertOperatorProfile): Promise<OperatorProfile> {
    const [profile] = await db
      .insert(operatorProfiles)
      .values(profileData)
      .returning();
    return profile;
  }

  async getOperatorProfileById(id: string): Promise<OperatorProfile | undefined> {
    const [profile] = await db
      .select()
      .from(operatorProfiles)
      .where(eq(operatorProfiles.id, id));
    return profile;
  }

  async getOperatorProfileByName(operatorName: string): Promise<OperatorProfile | undefined> {
    const [profile] = await db
      .select()
      .from(operatorProfiles)
      .where(eq(operatorProfiles.operatorName, operatorName));
    return profile;
  }

  async getAllOperatorProfiles(): Promise<OperatorProfile[]> {
    return await db
      .select()
      .from(operatorProfiles)
      .orderBy(operatorProfiles.operatorName);
  }

  async updateOperatorProfile(id: string, updates: Partial<OperatorProfile>): Promise<OperatorProfile | undefined> {
    const [profile] = await db
      .update(operatorProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(operatorProfiles.id, id))
      .returning();
    return profile;
  }

  async deleteOperatorProfile(id: string): Promise<boolean> {
    const result = await db
      .delete(operatorProfiles)
      .where(eq(operatorProfiles.id, id));
    return result.rowCount > 0;
  }
  */
  // End of САЗПД modules implementations comment block

  // ========================================
  // CAMPAIGN MANAGEMENT MODULE IMPLEMENTATIONS
  // ========================================

  // Campaign operations (using deletion_requests as base entity)
  async createCampaign(campaignData: InsertCampaign): Promise<DeletionRequest> {
    const [campaign] = await db
      .insert(deletionRequests)
      .values(campaignData)
      .returning();
    return campaign;
  }

  async getCampaignById(id: string): Promise<DeletionRequest | undefined> {
    const [campaign] = await db
      .select()
      .from(deletionRequests)
      .where(eq(deletionRequests.id, id));
    return campaign;
  }

  async getUserCampaigns(userId: string): Promise<DeletionRequest[]> {
    return await db
      .select()
      .from(deletionRequests)
      .where(eq(deletionRequests.userId, userId))
      .orderBy(desc(deletionRequests.campaignStartedAt));
  }

  async getAllCampaigns(filters?: { 
    campaignStatus?: string; 
    escalationLevel?: number; 
    isAutomated?: boolean;
    automationPaused?: boolean;
    completionRateMin?: number;
    lastActionBefore?: Date;
    nextActionDue?: boolean;
  }): Promise<DeletionRequest[]> {
    let query = db.select().from(deletionRequests);
    const conditions = [];

    if (filters?.campaignStatus) {
      conditions.push(eq(deletionRequests.campaignStatus, filters.campaignStatus));
    }
    
    if (filters?.escalationLevel !== undefined) {
      conditions.push(eq(deletionRequests.escalationLevel, filters.escalationLevel));
    }
    
    if (filters?.isAutomated !== undefined) {
      conditions.push(eq(deletionRequests.isAutomated, filters.isAutomated));
    }
    
    if (filters?.automationPaused !== undefined) {
      conditions.push(eq(deletionRequests.automationPaused, filters.automationPaused));
    }
    
    if (filters?.completionRateMin !== undefined) {
      conditions.push(sql`${deletionRequests.completionRate} >= ${filters.completionRateMin}`);
    }
    
    if (filters?.lastActionBefore) {
      conditions.push(sql`${deletionRequests.lastActionAt} < ${filters.lastActionBefore}`);
    }
    
    if (filters?.nextActionDue) {
      conditions.push(sql`${deletionRequests.nextScheduledActionAt} <= NOW()`);
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query.orderBy(desc(deletionRequests.campaignStartedAt));
  }

  async updateCampaign(id: string, updates: Partial<DeletionRequest>): Promise<DeletionRequest | undefined> {
    const [campaign] = await db
      .update(deletionRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(deletionRequests.id, id))
      .returning();
    return campaign;
  }

  async updateCampaignStatus(id: string, status: string, milestone?: any): Promise<DeletionRequest | undefined> {
    const updateData: any = {
      campaignStatus: status,
      lastActionAt: new Date(),
      updatedAt: new Date()
    };

    if (milestone) {
      // Get current milestones and add new one
      const current = await this.getCampaignById(id);
      if (current) {
        const currentMilestones = Array.isArray(current.milestones) ? current.milestones : [];
        updateData.milestones = [...currentMilestones, milestone];
      }
    }

    const [campaign] = await db
      .update(deletionRequests)
      .set(updateData)
      .where(eq(deletionRequests.id, id))
      .returning();
    return campaign;
  }

  async updateCampaignMetrics(id: string, metrics: Record<string, any>): Promise<DeletionRequest | undefined> {
    const current = await this.getCampaignById(id);
    if (!current) return undefined;

    const currentMetrics = current.campaignMetrics as any || {};
    const updatedMetrics = { ...currentMetrics, ...metrics };

    const [campaign] = await db
      .update(deletionRequests)
      .set({ 
        campaignMetrics: updatedMetrics,
        lastActionAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(deletionRequests.id, id))
      .returning();
    return campaign;
  }

  async updateCampaignProgress(
    id: string, 
    completionRate: number, 
    nextAction?: string, 
    nextActionAt?: Date
  ): Promise<DeletionRequest | undefined> {
    const updateData: any = {
      completionRate,
      lastActionAt: new Date(),
      updatedAt: new Date()
    };

    if (nextAction) {
      updateData.nextScheduledAction = nextAction;
    }
    
    if (nextActionAt) {
      updateData.nextScheduledActionAt = nextActionAt;
    }

    const [campaign] = await db
      .update(deletionRequests)
      .set(updateData)
      .where(eq(deletionRequests.id, id))
      .returning();
    return campaign;
  }

  async pauseCampaignAutomation(id: string, reason: string): Promise<DeletionRequest | undefined> {
    const [campaign] = await db
      .update(deletionRequests)
      .set({
        automationPaused: true,
        automationPausedReason: reason,
        lastActionAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(deletionRequests.id, id))
      .returning();
    return campaign;
  }

  async resumeCampaignAutomation(id: string): Promise<DeletionRequest | undefined> {
    const [campaign] = await db
      .update(deletionRequests)
      .set({
        automationPaused: false,
        automationPausedReason: null,
        lastActionAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(deletionRequests.id, id))
      .returning();
    return campaign;
  }

  // Campaign analytics and monitoring
  async getCampaignStatistics(timeframe?: 'day' | 'week' | 'month'): Promise<{
    totalCampaigns: number;
    activeCampaigns: number;
    completedCampaigns: number;
    escalatedCampaigns: number;
    averageCompletionTime: number;
    successRate: number;
    escalationRate: number;
  }> {
    // Calculate date range based on timeframe
    const now = new Date();
    let startDate: Date;
    
    switch (timeframe) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // All time
    }

    // Get campaigns in timeframe
    const campaigns = await db
      .select()
      .from(deletionRequests)
      .where(sql`${deletionRequests.campaignStartedAt} >= ${startDate}`);

    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => 
      ['started', 'documents_sent', 'awaiting_response', 'analyzing_response', 'taking_action'].includes(c.campaignStatus || '')
    ).length;
    const completedCampaigns = campaigns.filter(c => c.campaignStatus === 'completed').length;
    const escalatedCampaigns = campaigns.filter(c => c.campaignStatus === 'escalated').length;

    // Calculate average completion time
    const completedWithTime = campaigns.filter(c => 
      c.campaignStatus === 'completed' && c.campaignStartedAt && c.completedAt
    );
    const averageCompletionTime = completedWithTime.length > 0 
      ? completedWithTime.reduce((sum, c) => {
          const start = new Date(c.campaignStartedAt!).getTime();
          const end = new Date(c.completedAt!).getTime();
          return sum + (end - start) / (1000 * 60 * 60 * 24); // days
        }, 0) / completedWithTime.length
      : 0;

    const successRate = totalCampaigns > 0 ? (completedCampaigns / totalCampaigns) * 100 : 0;
    const escalationRate = totalCampaigns > 0 ? (escalatedCampaigns / totalCampaigns) * 100 : 0;

    return {
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      escalatedCampaigns,
      averageCompletionTime,
      successRate,
      escalationRate
    };
  }

  async getCampaignsByOperator(operatorEmail: string): Promise<DeletionRequest[]> {
    return await db
      .select()
      .from(deletionRequests)
      .where(eq(deletionRequests.operatorEmail, operatorEmail))
      .orderBy(desc(deletionRequests.campaignStartedAt));
  }

  async getOperatorComplianceMetrics(operatorEmail: string): Promise<{
    totalCampaigns: number;
    successfulCampaigns: number;
    averageResponseTime: number;
    complianceScore: number;
  }> {
    const campaigns = await this.getCampaignsByOperator(operatorEmail);
    
    const totalCampaigns = campaigns.length;
    const successfulCampaigns = campaigns.filter(c => c.campaignStatus === 'completed').length;
    
    // Calculate average response time
    const campaignsWithResponse = campaigns.filter(c => c.campaignStartedAt && c.lastInboundAt);
    const averageResponseTime = campaignsWithResponse.length > 0
      ? campaignsWithResponse.reduce((sum, c) => {
          const start = new Date(c.campaignStartedAt!).getTime();
          const response = new Date(c.lastInboundAt!).getTime();
          return sum + (response - start) / (1000 * 60 * 60 * 24); // days
        }, 0) / campaignsWithResponse.length
      : 0;

    const complianceScore = totalCampaigns > 0 ? (successfulCampaigns / totalCampaigns) * 100 : 0;

    return {
      totalCampaigns,
      successfulCampaigns,
      averageResponseTime,
      complianceScore
    };
  }

  // Campaign automation queries
  async getCampaignsReadyForAction(): Promise<DeletionRequest[]> {
    return await db
      .select()
      .from(deletionRequests)
      .where(and(
        eq(deletionRequests.isAutomated, true),
        eq(deletionRequests.automationPaused, false),
        sql`${deletionRequests.nextScheduledActionAt} <= NOW()`,
        sql`${deletionRequests.campaignStatus} IN ('started', 'documents_sent', 'awaiting_response', 'analyzing_response', 'taking_action')`
      ))
      .orderBy(deletionRequests.nextScheduledActionAt);
  }

  async getCampaignsRequiringEscalation(): Promise<DeletionRequest[]> {
    const escalationThreshold = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 days ago
    
    return await db
      .select()
      .from(deletionRequests)
      .where(and(
        sql`${deletionRequests.campaignStartedAt} <= ${escalationThreshold}`,
        sql`${deletionRequests.campaignStatus} IN ('awaiting_response', 'taking_action')`,
        sql`${deletionRequests.escalationLevel} < 2`
      ))
      .orderBy(deletionRequests.campaignStartedAt);
  }

  async getStalledCampaigns(daysSinceLastAction: number): Promise<DeletionRequest[]> {
    const stalledThreshold = new Date(Date.now() - daysSinceLastAction * 24 * 60 * 60 * 1000);
    
    return await db
      .select()
      .from(deletionRequests)
      .where(and(
        sql`${deletionRequests.lastActionAt} <= ${stalledThreshold}`,
        sql`${deletionRequests.campaignStatus} IN ('started', 'documents_sent', 'awaiting_response', 'analyzing_response', 'taking_action')`
      ))
      .orderBy(deletionRequests.lastActionAt);
  }

  // ========================================
  // САЗПД SYSTEM METHODS IMPLEMENTATION
  // ========================================

  async getSAZPDLogs(filters?: {
    module?: string;
    level?: string;
    status?: string;
    search?: string;
    date?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    logs: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    console.log('🔍 getSAZPDLogs called with filters:', filters);
    
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const conditions = [];
    const params: any[] = [];
    
    console.log('📊 Initial params array:', params);

    // САЗПД specific modules filter
    if (filters?.module && filters.module !== 'all') {
      conditions.push(`target_data->>'module' = $${params.length + 1}`);
      params.push(filters.module);
    }

    // Map admin action levels to САЗПД levels
    if (filters?.level && filters.level !== 'all') {
      conditions.push(`target_data->>'level' = $${params.length + 1}`);
      params.push(filters.level);
    }

    // Map admin action status to САЗПД status
    if (filters?.status && filters.status !== 'all') {
      conditions.push(`target_data->>'status' = $${params.length + 1}`);
      params.push(filters.status);
    }

    // Search in message or target data
    if (filters?.search) {
      const searchParam1 = params.length + 1;
      const searchParam2 = params.length + 2;
      const searchParam3 = params.length + 3;
      conditions.push(`(action_type ILIKE $${searchParam1} OR description ILIKE $${searchParam2} OR target_data::text ILIKE $${searchParam3})`);
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    // Date filter
    if (filters?.date) {
      const date = new Date(filters.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const dateParam1 = params.length + 1;
      const dateParam2 = params.length + 2;
      conditions.push(`created_at >= $${dateParam1} AND created_at < $${dateParam2}`);
      params.push(date, nextDay);
    }

    // Only САЗПД related actions (hardcoded, no parameter needed)
    conditions.push(`(target_type = 'sazpd_test_system' OR target_type = 'sazpd_module' OR action_type LIKE '%sazpd%' OR action_type LIKE '%SAZPD%')`);

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : 'WHERE 1=1';
    
    console.log('📝 Final conditions:', conditions);
    console.log('📝 Final params before count:', params);
    console.log('📝 WHERE clause:', whereClause);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM admin_actions 
      ${whereClause}
    `;
    
    console.log('📊 Count query:', countQuery);
    console.log('📊 Count params:', params);

    const countResult = await db.execute(sql.raw(countQuery, params));
    const total = parseInt(countResult.rows[0]?.total || '0');

    // Get paginated logs with simplified parameter approach
    // Build final SQL with consistent parameter numbering
    let finalSql = `
      SELECT 
        id,
        admin_id,
        action_type,
        target_type,
        target_id,
        target_data,
        changes,
        description,
        session_id,
        ip_address,
        user_agent,
        created_at
      FROM admin_actions 
      ${whereClause}
      ORDER BY created_at DESC 
    `;
    
    // Add LIMIT and OFFSET as literals to avoid parameter confusion
    finalSql += ` LIMIT ${limit} OFFSET ${offset}`;
    
    console.log('📝 Final SQL (literals):', finalSql);
    console.log('📝 WHERE params:', params);
    console.log('📝 Literal values - Limit:', limit, '| Offset:', offset);

    const logsResult = await db.execute(sql.raw(finalSql, params));

    // Transform to САЗПД log format
    const logs = logsResult.rows.map((row: any) => {
      const targetData = typeof row.target_data === 'string' ? JSON.parse(row.target_data) : row.target_data;
      const changes = typeof row.changes === 'string' ? JSON.parse(row.changes) : row.changes;
      
      return {
        id: row.id,
        timestamp: row.created_at,
        module: targetData?.module || 'sazpd',
        level: targetData?.level || 'info',
        message: row.description || row.action_type,
        requestId: targetData?.requestId || row.target_id,
        status: targetData?.status || 'success',
        details: { 
          actionType: row.action_type,
          targetType: row.target_type,
          targetData: targetData || {},
          changes: changes || {}
        }
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      logs,
      total,
      page,
      totalPages
    };
  }

  async getSAZPDMetrics(): Promise<{
    totalRequests: number;
    processedRequests: number;
    automatedDecisions: number;
    manualEscalations: number;
    evidenceCollections: number;
    cryptoValidations: number;
    complianceScore: number;
    operatorResponseTime: number;
    violationsDetected: number;
  }> {
    // Get metrics from deletion_requests and related tables
    const [
      totalRequestsResult,
      processedRequestsResult,
      escalatedRequestsResult,
      evidenceCollectionsResult,
      inboundEmailsResult,
      violationsResult
    ] = await Promise.all([
      // Total deletion requests
      db.execute(sql`SELECT COUNT(*) as count FROM deletion_requests`),
      
      // Processed requests (completed or with responses)
      db.execute(sql`
        SELECT COUNT(*) as count 
        FROM deletion_requests 
        WHERE status IN ('completed', 'operator_confirmed', 'rejected')
      `),
      
      // Escalated requests
      db.execute(sql`
        SELECT COUNT(*) as count 
        FROM deletion_requests 
        WHERE status = 'escalated' OR escalation_level > 0
      `),
      
      // Evidence collections
      db.execute(sql`SELECT COUNT(*) as count FROM evidence_collection`),
      
      // Inbound emails with analysis
      db.execute(sql`
        SELECT 
          COUNT(*) as total,
          AVG(EXTRACT(EPOCH FROM (received_at - created_at))) / 3600 as avg_response_hours
        FROM inbound_emails ie
        JOIN deletion_requests dr ON ie.deletion_request_id = dr.id
      `),
      
      // Violations detected from inbound emails
      db.execute(sql`
        SELECT COUNT(*) as count 
        FROM inbound_emails 
        WHERE violations IS NOT NULL AND array_length(violations, 1) > 0
      `)
    ]);

    const totalRequests = parseInt(totalRequestsResult.rows[0]?.count || '0');
    const processedRequests = parseInt(processedRequestsResult.rows[0]?.count || '0');
    const escalatedRequests = parseInt(escalatedRequestsResult.rows[0]?.count || '0');
    const evidenceCollections = parseInt(evidenceCollectionsResult.rows[0]?.count || '0');
    const violationsDetected = parseInt(violationsResult.rows[0]?.count || '0');
    
    const emailStats = inboundEmailsResult.rows[0];
    const avgResponseHours = parseFloat(emailStats?.avg_response_hours || '0');

    // Calculate automated decisions (requests processed without manual escalation)
    const automatedDecisions = Math.max(0, processedRequests - escalatedRequests);
    
    // Calculate compliance score based on response times and violation rates
    const responseTimeScore = avgResponseHours > 0 ? Math.max(0, 100 - (avgResponseHours * 2)) : 100;
    const violationScore = totalRequests > 0 ? Math.max(0, 100 - ((violationsDetected / totalRequests) * 100)) : 100;
    const complianceScore = Math.round((responseTimeScore + violationScore) / 2);

    // Crypto validations (all evidence collections have crypto validation)
    const cryptoValidations = evidenceCollections;

    return {
      totalRequests,
      processedRequests,
      automatedDecisions,
      manualEscalations: escalatedRequests,
      evidenceCollections,
      cryptoValidations,
      complianceScore,
      operatorResponseTime: avgResponseHours,
      violationsDetected
    };
  }

  async getSAZPDSettings(): Promise<any> {
    // САЗПД settings are stored in platform_secrets or environment variables
    // Return default settings structure
    return {
      modules: {
        responseAnalyzer: { enabled: true, interval: 3600000 }, // 1 hour
        decisionEngine: { enabled: true, autoDecisionThreshold: 80 },
        evidenceCollector: { enabled: true, retentionDays: 365 },
        campaignManager: { enabled: true, maxCampaigns: 1000 },
        emailAutomation: { enabled: true, followUpHours: 72 },
        cryptoValidator: { enabled: true, strictMode: true }
      },
      compliance: {
        fz152Mode: true,
        dataRetentionDays: 365,
        autoEscalationHours: 72,
        operatorResponseTimeout: 30 * 24 // 30 days in hours
      }
    };
  }

  async updateSAZPDSettings(settings: any): Promise<any> {
    // In production, this would update platform_secrets or configuration
    // For now, just return the updated settings
    return settings;
  }

  async getSAZPDOperatorStats(): Promise<{
    operatorId: string;
    name: string;
    totalResponses: number;
    successRate: number;
    avgResponseTime: number;
    violationsCount: number;
    lastActivity: string;
    complianceScore: number;
  }[]> {
    // Get operator statistics from inbound_emails and deletion_requests
    const result = await db.execute(sql`
      SELECT 
        ie.operator_email as operator_id,
        ie.operator_email as name,
        COUNT(*) as total_responses,
        COUNT(CASE WHEN ie.response_type = 'POSITIVE_CONFIRMATION' THEN 1 END) as successful_responses,
        AVG(EXTRACT(EPOCH FROM (ie.received_at - dr.first_sent_at))) / 3600 as avg_response_hours,
        SUM(array_length(ie.violations, 1)) as violations_count,
        MAX(ie.received_at) as last_activity
      FROM inbound_emails ie
      JOIN deletion_requests dr ON ie.deletion_request_id = dr.id
      GROUP BY ie.operator_email
      ORDER BY total_responses DESC
    `);

    return result.rows.map((row: any) => {
      const totalResponses = parseInt(row.total_responses || '0');
      const successfulResponses = parseInt(row.successful_responses || '0');
      const violationsCount = parseInt(row.violations_count || '0');
      const avgResponseHours = parseFloat(row.avg_response_hours || '0');
      
      const successRate = totalResponses > 0 ? (successfulResponses / totalResponses) * 100 : 0;
      const complianceScore = Math.max(0, 100 - (violationsCount * 10) - Math.min(50, avgResponseHours));
      
      return {
        operatorId: row.operator_id,
        name: row.name,
        totalResponses,
        successRate: Math.round(successRate),
        avgResponseTime: Math.round(avgResponseHours),
        violationsCount,
        lastActivity: row.last_activity,
        complianceScore: Math.round(complianceScore)
      };
    });
  }

  async logSAZPDAction(actionData: {
    adminId: string;
    module: 'response-analyzer' | 'decision-engine' | 'evidence-collector' | 'campaign-manager' | 'email-automation' | 'crypto-validator';
    actionType: string;
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    requestId?: string;
    status: 'success' | 'failed' | 'processing';
    details?: Record<string, any>;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await this.logAdminAction({
      adminId: actionData.adminId,
      actionType: actionData.actionType,
      targetType: 'sazpd',
      targetId: actionData.requestId,
      details: actionData.details || {},
      metadata: {
        module: actionData.module,
        level: actionData.level,
        message: actionData.message,
        status: actionData.status
      },
      sessionId: actionData.sessionId,
      ipAddress: actionData.ipAddress,
      userAgent: actionData.userAgent
    });
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
  private blogArticlesData: BlogArticle[] = [];
  private blogGenerationSettingsData: BlogGenerationSettings[] = [];
  private emailServiceStatusData: EmailServiceStatus[] = [];
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
      points: 0, // Points system: 1 point = 1 ruble
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

  async getDeletionRequests(filters?: {
    status?: string;
    olderThanDays?: number;
    withoutInboundEmails?: boolean;
    operatorNotConfirmed?: boolean;
  }): Promise<DeletionRequest[]> {
    let results = [...this.deletionRequestsData];

    if (filters?.status) {
      results = results.filter(req => req.status === filters.status);
    }

    if (filters?.olderThanDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - filters.olderThanDays);
      results = results.filter(req => {
        const firstSentAt = (req as any).firstSentAt;
        const createdAt = req.createdAt;
        return (firstSentAt && firstSentAt < cutoffDate) || (createdAt && createdAt < cutoffDate);
      });
    }

    if (filters?.operatorNotConfirmed) {
      results = results.filter(req => !(req as any).buttonConfirmedAt);
    }

    if (filters?.withoutInboundEmails) {
      // Улучшенная логика для in-memory storage:
      // Проверяем не только responseReceived, но и отсутствие значимых inbound emails
      // Используем responseReceived как прокси для «значимых» ответов
      // Оставляем только запросы без подтвержденных ответов операторов
      results = results.filter(req => !req.responseReceived && !(req as any).buttonConfirmedAt);
    }

    return results.sort((a, b) => {
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

  async getAllActiveSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionsData.filter(sub => sub.status === 'active');
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

  // Points system operations (in-memory stub)
  async getUserPoints(userId: string): Promise<number> {
    const account = this.userAccountsData.find(acc => acc.id === userId);
    return account?.points || 0;
  }

  async addUserPoints(userId: string, points: number, reason?: string): Promise<UserAccount | undefined> {
    const accountIndex = this.userAccountsData.findIndex(acc => acc.id === userId);
    if (accountIndex === -1) return undefined;
    
    this.userAccountsData[accountIndex] = {
      ...this.userAccountsData[accountIndex],
      points: (this.userAccountsData[accountIndex].points || 0) + points,
      updatedAt: new Date()
    };
    
    return this.userAccountsData[accountIndex];
  }

  async deductUserPoints(userId: string, points: number): Promise<{success: boolean, remainingPoints: number, newBalance: number}> {
    const account = this.userAccountsData.find(acc => acc.id === userId);
    if (!account) {
      return { success: false, remainingPoints: points, newBalance: 0 };
    }
    
    const currentPoints = account.points || 0;
    if (currentPoints < points) {
      return {
        success: false,
        remainingPoints: points - currentPoints,
        newBalance: currentPoints
      };
    }
    
    // Update points
    const accountIndex = this.userAccountsData.findIndex(acc => acc.id === userId);
    this.userAccountsData[accountIndex] = {
      ...account,
      points: currentPoints - points,
      updatedAt: new Date()
    };
    
    return {
      success: true,
      remainingPoints: 0,
      newBalance: currentPoints - points
    };
  }

  // Blog article operations (in-memory stub)
  async createBlogArticle(articleData: InsertBlogArticle): Promise<BlogArticle> {
    const article: BlogArticle = {
      id: `blog_${this.idCounter++}`,
      title: articleData.title,
      slug: articleData.slug,
      content: articleData.content,
      excerpt: articleData.excerpt || null,
      category: articleData.category || 'data-protection',
      tags: articleData.tags || [],
      seoTitle: articleData.seoTitle || null,
      seoDescription: articleData.seoDescription || null,
      status: articleData.status || 'draft',
      publishedAt: articleData.publishedAt || null,
      generatedBy: articleData.generatedBy || 'openai-gpt-4',
      authorName: articleData.authorName || 'ResCrub AI',
      readingTime: articleData.readingTime || 5,
      isAutoGenerated: articleData.isAutoGenerated || true,
      relatedTopics: articleData.relatedTopics || [],
      viewCount: 0,
      featured: articleData.featured || false,
      generationPrompt: articleData.generationPrompt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogArticlesData.push(article);
    return article;
  }

  async getBlogArticleById(id: string): Promise<BlogArticle | undefined> {
    return this.blogArticlesData.find(article => article.id === id);
  }

  async getBlogArticleBySlug(slug: string): Promise<BlogArticle | undefined> {
    return this.blogArticlesData.find(article => article.slug === slug);
  }

  async getPublishedBlogArticles(filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<BlogArticle[]> {
    let articles = this.blogArticlesData.filter(article => article.status === 'published');

    if (filters?.category) {
      articles = articles.filter(article => article.category === filters.category);
    }

    if (filters?.featured !== undefined) {
      articles = articles.filter(article => article.featured === filters.featured);
    }

    // Sort by publishedAt desc
    articles.sort((a, b) => {
      const aDate = a.publishedAt || a.createdAt || new Date();
      const bDate = b.publishedAt || b.createdAt || new Date();
      return bDate.getTime() - aDate.getTime();
    });

    const offset = filters?.offset || 0;
    const limit = filters?.limit;

    if (limit) {
      return articles.slice(offset, offset + limit);
    }

    return articles.slice(offset);
  }

  async getAllBlogArticles(filters?: {
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<BlogArticle[]> {
    let articles = [...this.blogArticlesData];

    if (filters?.status) {
      articles = articles.filter(article => article.status === filters.status);
    }

    if (filters?.category) {
      articles = articles.filter(article => article.category === filters.category);
    }

    // Sort by createdAt desc
    articles.sort((a, b) => {
      const aDate = a.createdAt || new Date();
      const bDate = b.createdAt || new Date();
      return bDate.getTime() - aDate.getTime();
    });

    const offset = filters?.offset || 0;
    const limit = filters?.limit;

    if (limit) {
      return articles.slice(offset, offset + limit);
    }

    return articles.slice(offset);
  }

  async updateBlogArticle(id: string, updates: Partial<BlogArticle>): Promise<BlogArticle | undefined> {
    const index = this.blogArticlesData.findIndex(article => article.id === id);
    if (index === -1) return undefined;

    this.blogArticlesData[index] = {
      ...this.blogArticlesData[index],
      ...updates,
      updatedAt: new Date()
    };

    return this.blogArticlesData[index];
  }

  async incrementViewCount(id: string): Promise<BlogArticle | undefined> {
    const index = this.blogArticlesData.findIndex(article => article.id === id);
    if (index === -1) return undefined;

    this.blogArticlesData[index] = {
      ...this.blogArticlesData[index],
      viewCount: (this.blogArticlesData[index].viewCount || 0) + 1,
      updatedAt: new Date()
    };

    return this.blogArticlesData[index];
  }

  async deleteBlogArticle(id: string): Promise<boolean> {
    const index = this.blogArticlesData.findIndex(article => article.id === id);
    if (index === -1) return false;

    this.blogArticlesData.splice(index, 1);
    return true;
  }

  // Blog generation settings operations (in-memory stub)
  async getBlogGenerationSettings(): Promise<BlogGenerationSettings | undefined> {
    return this.blogGenerationSettingsData[0];
  }

  async updateBlogGenerationSettings(updates: Partial<BlogGenerationSettings>): Promise<BlogGenerationSettings | undefined> {
    if (this.blogGenerationSettingsData.length === 0) {
      return undefined;
    }

    this.blogGenerationSettingsData[0] = {
      ...this.blogGenerationSettingsData[0],
      ...updates,
      updatedAt: new Date()
    };

    return this.blogGenerationSettingsData[0];
  }

  async createBlogGenerationSettings(settingsData: InsertBlogGenerationSettings): Promise<BlogGenerationSettings> {
    const settings: BlogGenerationSettings = {
      id: `settings_${this.idCounter++}`,
      isEnabled: settingsData.isEnabled ?? true,
      frequency: settingsData.frequency || 'daily',
      maxArticlesPerDay: settingsData.maxArticlesPerDay ?? 3,
      topics: settingsData.topics || ['защита персональных данных', 'права пользователей', 'кибербезопасность', '152-ФЗ', 'GDPR в России'],
      contentLength: settingsData.contentLength || 'medium',
      targetAudience: settingsData.targetAudience || 'general',
      seoOptimized: settingsData.seoOptimized ?? true,
      includeStats: settingsData.includeStats ?? true,
      lastGeneratedAt: null,
      nextGenerationAt: null,
      generationHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogGenerationSettingsData.push(settings);
    return settings;
  }


  async getVerifiedUsersCount(): Promise<number> {
    try {
      const [result] = await db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(userAccounts)
        .where(eq(userAccounts.emailVerified, true));
      
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting verified users count:', error);
      return 0;
    }
  }

  async getAdminsCount(): Promise<number> {
    try {
      const [result] = await db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(userAccounts)
        .where(eq(userAccounts.isAdmin, true));
      
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting admins count:', error);
      return 0;
    }
  }

  async getRecentUsersCount(days: number): Promise<number> {
    try {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - days);
      
      const [result] = await db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(userAccounts)
        .where(sql`${userAccounts.createdAt} >= ${dateFrom}`);
      
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting recent users count:', error);
      return 0;
    }
  }

  async getBlogArticlesCount(status?: string, search?: string): Promise<number> {
    try {
      const conditions = [];
      
      if (status && status !== 'all') {
        conditions.push(eq(blogArticles.status, status as any));
      }
      if (search) {
        conditions.push(sql`${blogArticles.title} ILIKE ${`%${search}%`} OR ${blogArticles.content} ILIKE ${`%${search}%`}`);
      }
      
      const query = conditions.length > 0 
        ? db.select({ count: sql<number>`cast(count(*) as integer)` }).from(blogArticles).where(and(...conditions))
        : db.select({ count: sql<number>`cast(count(*) as integer)` }).from(blogArticles);
      
      const [result] = await query;
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting blog articles count:', error);
      return 0;
    }
  }

  async getPublishedBlogArticlesCount(): Promise<number> {
    try {
      const [result] = await db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(blogArticles)
        .where(eq(blogArticles.status, 'published'));
      
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting published blog articles count:', error);
      return 0;
    }
  }

  async getLastGeneratedArticleDate(): Promise<Date | null> {
    try {
      const [article] = await db
        .select({ publishedAt: blogArticles.publishedAt })
        .from(blogArticles)
        .where(eq(blogArticles.status, 'published'))
        .orderBy(desc(blogArticles.publishedAt))
        .limit(1);
      
      return article?.publishedAt || null;
    } catch (error) {
      console.error('Error getting last generated article date:', error);
      return null;
    }
  }

  // Email statistics (placeholders)
  async getEmailsSentCount(days: number): Promise<number> {
    return 0; // TODO: Implement when we have email logs table
  }

  async getEmailDeliveryRate(): Promise<number> {
    return 95.0; // Default delivery rate
  }

  async getEmailBounceRate(): Promise<number> {
    return 2.0; // Default bounce rate
  }

  // Admin user management
  async getUsers(options: { 
    limit: number; 
    offset: number; 
    search?: string; 
    role?: string 
  }): Promise<UserAccount[]> {
    try {
      let query = db.select().from(userAccounts);
      
      if (options.search) {
        query = query.where(sql`${userAccounts.email} ILIKE ${`%${options.search}%`}`);
      }
      if (options.role && options.role !== 'all') {
        query = query.where(eq(userAccounts.adminRole, options.role));
      }
      
      const users = await query
        .orderBy(desc(userAccounts.createdAt))
        .limit(options.limit)
        .offset(options.offset);
      
      // Hide password hashes for security
      return users.map(user => ({ ...user, passwordHash: '[HIDDEN]' }));
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }
  
  async searchUsers(options: {
    text?: string;
    dateFrom?: Date;
    dateTo?: Date;
    subscriptionStatus?: string;
    verificationStatus?: string;
    adminRole?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit: number;
    offset: number;
  }): Promise<{ users: (UserAccount & { profile?: UserProfile; subscription?: Subscription | null })[], total: number }> {
    try {
      let whereConditions = [];
      
      // Text search (email, name, phone)
      if (options.text) {
        const searchText = `%${options.text}%`;
        whereConditions.push(
          sql`${userAccounts.email} ILIKE ${searchText} OR 
              ${userProfiles.firstName} ILIKE ${searchText} OR 
              ${userProfiles.lastName} ILIKE ${searchText} OR 
              ${userProfiles.phone} ILIKE ${searchText}`
        );
      }
      
      // Date range filter
      if (options.dateFrom) {
        whereConditions.push(sql`${userAccounts.createdAt} >= ${options.dateFrom}`);
      }
      if (options.dateTo) {
        whereConditions.push(sql`${userAccounts.createdAt} <= ${options.dateTo}`);
      }
      
      // Verification status filter
      if (options.verificationStatus === 'verified') {
        whereConditions.push(eq(userAccounts.emailVerified, true));
      } else if (options.verificationStatus === 'unverified') {
        whereConditions.push(eq(userAccounts.emailVerified, false));
      }
      
      // Admin role filter
      if (options.adminRole && options.adminRole !== 'all') {
        whereConditions.push(eq(userAccounts.adminRole, options.adminRole));
      }
      
      // Build the query
      const baseQuery = db
        .select({
          account: userAccounts,
          profile: userProfiles,
          subscription: subscriptions,
        })
        .from(userAccounts)
        .leftJoin(userProfiles, eq(userAccounts.id, userProfiles.userId))
        .leftJoin(subscriptions, and(
          eq(userAccounts.id, subscriptions.userId),
          eq(subscriptions.status, 'active')
        ));
      
      // Apply where conditions
      const filteredQuery = whereConditions.length > 0
        ? baseQuery.where(and(...whereConditions))
        : baseQuery;
      
      // Apply subscription status filter (after join)
      let finalQuery = filteredQuery;
      if (options.subscriptionStatus) {
        if (options.subscriptionStatus === 'none') {
          finalQuery = filteredQuery.where(isNull(subscriptions.id));
        } else if (options.subscriptionStatus !== 'all') {
          finalQuery = filteredQuery.where(eq(subscriptions.status, options.subscriptionStatus as any));
        }
      }
      
      // Count total results
      const countQuery = whereConditions.length > 0
        ? db
            .select({ count: sql<number>`cast(count(DISTINCT ${userAccounts.id}) as integer)` })
            .from(userAccounts)
            .leftJoin(userProfiles, eq(userAccounts.id, userProfiles.userId))
            .leftJoin(subscriptions, eq(userAccounts.id, subscriptions.userId))
            .where(and(...whereConditions))
        : db
            .select({ count: sql<number>`cast(count(DISTINCT ${userAccounts.id}) as integer)` })
            .from(userAccounts);
      
      const [{ count: total }] = await countQuery;
      
      // Apply sorting
      const sortColumn = options.sortBy || 'createdAt';
      const sortDirection = options.sortOrder || 'desc';
      
      let sortedQuery = finalQuery;
      switch (sortColumn) {
        case 'email':
          sortedQuery = sortDirection === 'asc'
            ? finalQuery.orderBy(userAccounts.email)
            : finalQuery.orderBy(desc(userAccounts.email));
          break;
        case 'name':
          sortedQuery = sortDirection === 'asc'
            ? finalQuery.orderBy(userProfiles.firstName)
            : finalQuery.orderBy(desc(userProfiles.firstName));
          break;
        case 'createdAt':
        default:
          sortedQuery = sortDirection === 'asc'
            ? finalQuery.orderBy(userAccounts.createdAt)
            : finalQuery.orderBy(desc(userAccounts.createdAt));
          break;
      }
      
      // Apply pagination
      const results = await sortedQuery
        .limit(options.limit)
        .offset(options.offset);
      
      // Format results
      const users = results.map(row => ({
        ...row.account,
        passwordHash: '[HIDDEN]',
        profile: row.profile || undefined,
        subscription: row.subscription || null,
      }));
      
      return { users, total };
    } catch (error) {
      console.error('Error searching users:', error);
      return { users: [], total: 0 };
    }
  }
  
  async getUserWithDetails(userId: string): Promise<{
    account: UserAccount;
    profile?: UserProfile;
    subscription?: Subscription | null;
    payments?: Payment[];
    activities?: any[];
    notes?: any[];
  } | undefined> {
    try {
      const account = await this.getUserAccountById(userId);
      if (!account) return undefined;
      
      const profile = await this.getUserProfile(userId);
      const subscription = await this.getUserSubscription(userId);
      const payments = await this.getUserPayments(userId);
      
      // Hide password hash
      account.passwordHash = '[HIDDEN]';
      
      return {
        account,
        profile,
        subscription,
        payments,
        activities: [], // TODO: Implement activity history
        notes: [], // TODO: Implement user notes
      };
    } catch (error) {
      console.error('Error getting user details:', error);
      return undefined;
    }
  }
  
  async banUser(userId: string, reason: string, bannedBy: string): Promise<UserAccount | undefined> {
    try {
      // Add banned status to user account (we'll use adminRole field to indicate banned status)
      const [updated] = await db
        .update(userAccounts)
        .set({
          adminRole: 'banned',
          updatedAt: new Date(),
        })
        .where(eq(userAccounts.id, userId))
        .returning();
      
      // Log the ban action
      await this.logAdminAction({
        adminId: bannedBy,
        action: 'ban_user',
        targetType: 'user',
        targetId: userId,
        metadata: { reason },
        ipAddress: null,
        userAgent: null,
        sessionId: null,
      });
      
      if (updated) {
        updated.passwordHash = '[HIDDEN]';
      }
      return updated;
    } catch (error) {
      console.error('Error banning user:', error);
      return undefined;
    }
  }
  
  async unbanUser(userId: string, unbannedBy: string): Promise<UserAccount | undefined> {
    try {
      const [updated] = await db
        .update(userAccounts)
        .set({
          adminRole: 'user',
          updatedAt: new Date(),
        })
        .where(eq(userAccounts.id, userId))
        .returning();
      
      // Log the unban action
      await this.logAdminAction({
        adminId: unbannedBy,
        action: 'unban_user',
        targetType: 'user',
        targetId: userId,
        ipAddress: null,
        userAgent: null,
        sessionId: null,
      });
      
      if (updated) {
        updated.passwordHash = '[HIDDEN]';
      }
      return updated;
    } catch (error) {
      console.error('Error unbanning user:', error);
      return undefined;
    }
  }
  
  async addUserNote(userId: string, note: string, addedBy: string): Promise<any> {
    // TODO: Implement user notes table
    const noteData = {
      id: `note_${Date.now()}`,
      userId,
      note,
      addedBy,
      createdAt: new Date(),
    };
    
    // Log the action
    await this.logAdminAction({
      adminId: addedBy,
      action: 'add_user_note',
      targetType: 'user',
      targetId: userId,
      metadata: { note },
      ipAddress: null,
      userAgent: null,
      sessionId: null,
    });
    
    return noteData;
  }
  
  async getUserActivityHistory(userId: string, limit: number = 100): Promise<any[]> {
    try {
      // Get various activities
      const activities = [];
      
      // Get login history (from lastLoginAt)
      const account = await this.getUserAccountById(userId);
      if (account?.lastLoginAt) {
        activities.push({
          type: 'login',
          timestamp: account.lastLoginAt,
          details: 'Вход в систему',
        });
      }
      
      // Get deletion requests
      const deletionRequests = await this.getUserDeletionRequests(userId);
      deletionRequests.forEach(req => {
        activities.push({
          type: 'deletion_request',
          timestamp: req.createdAt,
          details: `Запрос на удаление: ${req.brokerName}`,
          status: req.status,
        });
      });
      
      // Get scans
      const scans = await this.getUserDataBrokerScans(userId);
      scans.forEach(scan => {
        activities.push({
          type: 'scan',
          timestamp: scan.createdAt,
          details: `Сканирование: ${scan.brokerName}`,
          status: scan.scanStatus,
        });
      });
      
      // Sort by timestamp descending
      activities.sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      });
      
      return activities.slice(0, limit);
    } catch (error) {
      console.error('Error getting user activity history:', error);
      return [];
    }
  }

  async getSystemLogs(options: { type: string; limit: number }): Promise<any[]> {
    return []; // TODO: Implement system logs table
  }

  // ========================================
  // PLATFORM SECRETS MANAGEMENT (MemStorage Stubs)
  // ========================================
  
  private platformSecretsData: PlatformSecret[] = [];
  private secretsAuditLogData: SecretsAuditLog[] = [];
  private adminPermissionsData: AdminPermission[] = [];
  private adminActionsData: AdminAction[] = [];
  private systemHealthChecksData: SystemHealthCheck[] = [];
  private emailServiceStatusData: EmailServiceStatus[] = [];
  private emailTemplatesData: EmailTemplate[] = [];
  private emailTemplateVersionsData: EmailTemplateVersion[] = [];

  async createPlatformSecret(secretData: InsertPlatformSecret): Promise<PlatformSecret> {
    const { encryptSecret } = await import('./crypto');
    
    // Encrypt the secret value
    const encryptedData = encryptSecret(secretData.value);
    
    const secret: PlatformSecret = {
      id: `secret_${this.idCounter++}`,
      key: secretData.key,
      encryptedValue: encryptedData.encrypted,
      service: secretData.service || null,
      environment: secretData.environment || 'production',
      description: secretData.description || null,
      metadata: secretData.metadata || {},
      createdBy: secretData.createdBy || null,
      lastUpdatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.platformSecretsData.push(secret);
    
    // Return with masked value
    const { maskSecret } = await import('./crypto');
    return {
      ...secret,
      encryptedValue: maskSecret(secretData.value),
    };
  }

  async getPlatformSecrets(filters?: { service?: string; environment?: string }): Promise<PlatformSecret[]> {
    let secrets = this.platformSecretsData;
    
    if (filters?.service) {
      secrets = secrets.filter(s => s.service === filters.service);
    }
    if (filters?.environment) {
      secrets = secrets.filter(s => s.environment === filters.environment);
    }
    
    // Mask all secret values
    const { maskSecret } = await import('./crypto');
    return secrets.map(secret => ({
      ...secret,
      encryptedValue: maskSecret(secret.encryptedValue),
    }));
  }

  async getPlatformSecretByKey(key: string): Promise<PlatformSecret | undefined> {
    const secret = this.platformSecretsData.find(s => s.key === key);
    if (!secret) return undefined;
    
    // Decrypt the secret value
    const { decryptSecret } = await import('./crypto');
    try {
      const decrypted = decryptSecret({
        encrypted: secret.encryptedValue,
        iv: '',
        tag: '',
        salt: '',
      });
      
      return {
        ...secret,
        encryptedValue: decrypted,
      };
    } catch (error) {
      console.error('Failed to decrypt secret:', error);
      throw new Error('Failed to decrypt platform secret');
    }
  }

  async updatePlatformSecret(key: string, value: string, adminId: string): Promise<PlatformSecret | undefined> {
    const { encryptSecret, maskSecret } = await import('./crypto');
    
    // Get existing secret
    const secretIndex = this.platformSecretsData.findIndex(s => s.key === key);
    if (secretIndex === -1) return undefined;
    
    const existing = this.platformSecretsData[secretIndex];
    
    // Encrypt new value
    const encryptedData = encryptSecret(value);
    
    // Update secret
    this.platformSecretsData[secretIndex] = {
      ...existing,
      encryptedValue: encryptedData.encrypted,
      lastUpdatedBy: adminId,
      updatedAt: new Date(),
    };
    
    // Log audit
    await this.logSecretAudit({
      secretId: existing.id,
      adminId,
      action: 'update',
      ipAddress: null,
      userAgent: null,
    });
    
    return {
      ...this.platformSecretsData[secretIndex],
      encryptedValue: maskSecret(value),
    };
  }

  async deletePlatformSecret(key: string, adminId: string, reason: string): Promise<boolean> {
    const secretIndex = this.platformSecretsData.findIndex(s => s.key === key);
    if (secretIndex === -1) return false;
    
    const existing = this.platformSecretsData[secretIndex];
    
    // Remove secret
    this.platformSecretsData.splice(secretIndex, 1);
    
    // Log audit
    const { maskSecret } = await import('./crypto');
    await this.logSecretAudit({
      secretId: existing.id,
      adminId,
      action: 'delete',
      metadata: { reason },
      ipAddress: null,
      userAgent: null,
    });
    
    return true;
  }

  async validateSecret(key: string, service: string): Promise<boolean> {
    try {
      const secret = await this.getPlatformSecretByKey(key);
      if (!secret || secret.service !== service) return false;
      
      // Add service-specific validation logic here
      switch (service) {
        case 'sendgrid':
          return secret.encryptedValue.startsWith('SG.');
        case 'openai':
          return secret.encryptedValue.startsWith('sk-');
        case 'robokassa':
          return secret.encryptedValue.length > 0;
        default:
          return secret.encryptedValue.length > 0;
      }
    } catch (error) {
      console.error('Secret validation error:', error);
      return false;
    }
  }

  async logSecretAudit(auditData: InsertSecretsAuditLog): Promise<SecretsAuditLog> {
    const audit: SecretsAuditLog = {
      id: `audit_${this.idCounter++}`,
      secretId: auditData.secretId,
      adminId: auditData.adminId,
      action: auditData.action,
      metadata: auditData.metadata || {},
      ipAddress: auditData.ipAddress || null,
      userAgent: auditData.userAgent || null,
      createdAt: new Date(),
    };
    
    this.secretsAuditLogData.push(audit);
    return audit;
  }

  async getSecretsAuditLog(filters?: { secretId?: string; adminId?: string; limit?: number }): Promise<SecretsAuditLog[]> {
    let logs = this.secretsAuditLogData;
    
    if (filters?.secretId) {
      logs = logs.filter(l => l.secretId === filters.secretId);
    }
    if (filters?.adminId) {
      logs = logs.filter(l => l.adminId === filters.adminId);
    }
    
    // Sort by date descending
    logs.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    const limit = filters?.limit || 100;
    return logs.slice(0, limit);
  }

  // Admin permissions management stubs
  async createAdminPermission(permissionData: InsertAdminPermission): Promise<AdminPermission> {
    const permission: AdminPermission = {
      id: `perm_${this.idCounter++}`,
      adminId: permissionData.adminId,
      resource: permissionData.resource,
      action: permissionData.action,
      isActive: permissionData.isActive ?? true,
      grantedBy: permissionData.grantedBy || null,
      expiresAt: permissionData.expiresAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.adminPermissionsData.push(permission);
    return permission;
  }

  async getAdminPermissions(adminId: string): Promise<AdminPermission[]> {
    return this.adminPermissionsData.filter(p => p.adminId === adminId);
  }

  async checkAdminPermission(adminId: string, resource: string, action: string): Promise<boolean> {
    return this.adminPermissionsData.some(p => 
      p.adminId === adminId &&
      p.resource === resource &&
      p.action === action &&
      p.isActive
    );
  }

  async revokeAdminPermission(id: string): Promise<boolean> {
    const index = this.adminPermissionsData.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.adminPermissionsData[index].isActive = false;
    this.adminPermissionsData[index].updatedAt = new Date();
    return true;
  }

  async updateAdminPermission(id: string, updates: Partial<AdminPermission>): Promise<AdminPermission | undefined> {
    const index = this.adminPermissionsData.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.adminPermissionsData[index] = {
      ...this.adminPermissionsData[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    return this.adminPermissionsData[index];
  }

  // Admin actions logging stubs
  async logAdminAction(actionData: InsertAdminAction): Promise<AdminAction> {
    const action: AdminAction = {
      id: `action_${this.idCounter++}`,
      adminId: actionData.adminId,
      action: actionData.action,
      targetType: actionData.targetType || null,
      targetId: actionData.targetId || null,
      changes: actionData.changes || {},
      metadata: actionData.metadata || {},
      sessionId: actionData.sessionId || null,
      ipAddress: actionData.ipAddress || null,
      userAgent: actionData.userAgent || null,
      createdAt: new Date(),
    };
    
    this.adminActionsData.push(action);
    return action;
  }

  async getAdminActions(filters?: { adminId?: string; targetType?: string; limit?: number; offset?: number }): Promise<AdminAction[]> {
    let actions = this.adminActionsData;
    
    if (filters?.adminId) {
      actions = actions.filter(a => a.adminId === filters.adminId);
    }
    if (filters?.targetType) {
      actions = actions.filter(a => a.targetType === filters.targetType);
    }
    
    // Sort by date descending
    actions.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;
    return actions.slice(offset, offset + limit);
  }

  async getAdminActionsBySession(sessionId: string): Promise<AdminAction[]> {
    return this.adminActionsData
      .filter(a => a.sessionId === sessionId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // System health check stubs
  async createSystemHealthCheck(healthData: InsertSystemHealthCheck): Promise<SystemHealthCheck> {
    const health: SystemHealthCheck = {
      id: `health_${this.idCounter++}`,
      serviceName: healthData.serviceName,
      status: healthData.status,
      responseTime: healthData.responseTime || null,
      errorMessage: healthData.errorMessage || null,
      metadata: healthData.metadata || {},
      checkedAt: new Date(),
    };
    
    this.systemHealthChecksData.push(health);
    return health;
  }

  async getLatestHealthCheck(serviceName: string): Promise<SystemHealthCheck | undefined> {
    const checks = this.systemHealthChecksData
      .filter(h => h.serviceName === serviceName)
      .sort((a, b) => (b.checkedAt?.getTime() || 0) - (a.checkedAt?.getTime() || 0));
    
    return checks[0];
  }

  async getHealthCheckHistory(serviceName: string, limit: number = 100): Promise<SystemHealthCheck[]> {
    return this.systemHealthChecksData
      .filter(h => h.serviceName === serviceName)
      .sort((a, b) => (b.checkedAt?.getTime() || 0) - (a.checkedAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getSystemHealthChecks(filters?: { serviceName?: string; status?: string }): Promise<SystemHealthCheck[]> {
    let checks = this.systemHealthChecksData;
    
    if (filters?.serviceName) {
      checks = checks.filter(h => h.serviceName === filters.serviceName);
    }
    if (filters?.status) {
      checks = checks.filter(h => h.status === filters.status);
    }
    
    // Sort by creation date descending
    return checks.sort((a, b) => (b.checkedAt?.getTime() || 0) - (a.checkedAt?.getTime() || 0));
  }

  async updateSystemHealthCheck(id: string, updates: Partial<SystemHealthCheck>): Promise<SystemHealthCheck | undefined> {
    const index = this.systemHealthChecksData.findIndex(h => h.id === id);
    if (index === -1) return undefined;
    
    this.systemHealthChecksData[index] = {
      ...this.systemHealthChecksData[index],
      ...updates,
    };
    
    return this.systemHealthChecksData[index];
  }

  async getLatestHealthCheckByService(serviceName: string): Promise<SystemHealthCheck | undefined> {
    const checks = this.systemHealthChecksData
      .filter(h => h.serviceName === serviceName)
      .sort((a, b) => (b.checkedAt?.getTime() || 0) - (a.checkedAt?.getTime() || 0));
    
    return checks[0];
  }

  // Email service status stubs
  async updateEmailServiceStatus(serviceName: string, status: Partial<EmailServiceStatus>): Promise<EmailServiceStatus | undefined> {
    const index = this.emailServiceStatusData.findIndex(s => s.serviceName === serviceName);
    
    if (index === -1) {
      // Create new
      const newStatus: EmailServiceStatus = {
        id: `email_status_${this.idCounter++}`,
        serviceName,
        isActive: status.isActive ?? true,
        lastSuccessAt: status.lastSuccessAt || null,
        lastFailureAt: status.lastFailureAt || null,
        failureCount: status.failureCount || 0,
        successCount: status.successCount || 0,
        averageResponseTime: status.averageResponseTime || null,
        lastError: status.lastError || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.emailServiceStatusData.push(newStatus);
      return newStatus;
    }
    
    this.emailServiceStatusData[index] = {
      ...this.emailServiceStatusData[index],
      ...status,
      updatedAt: new Date(),
    };
    
    return this.emailServiceStatusData[index];
  }

  async getEmailServiceStatus(serviceName: string): Promise<EmailServiceStatus | undefined> {
    return this.emailServiceStatusData.find(s => s.serviceName === serviceName);
  }

  async getAllEmailServiceStatuses(): Promise<EmailServiceStatus[]> {
    return this.emailServiceStatusData
      .sort((a, b) => (b.lastSuccessAt?.getTime() || 0) - (a.lastSuccessAt?.getTime() || 0));
  }

  // Email template management stubs
  async createEmailTemplate(templateData: InsertEmailTemplate): Promise<EmailTemplate> {
    const template: EmailTemplate = {
      id: `template_${this.idCounter++}`,
      name: templateData.name,
      description: templateData.description || null,
      category: templateData.category || null,
      isActive: templateData.isActive ?? true,
      createdBy: templateData.createdBy || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.emailTemplatesData.push(template);
    return template;
  }

  async getEmailTemplateByName(name: string): Promise<EmailTemplate | undefined> {
    return this.emailTemplatesData.find(t => t.name === name);
  }

  async getAllEmailTemplates(): Promise<EmailTemplate[]> {
    return this.emailTemplatesData
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | undefined> {
    const index = this.emailTemplatesData.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    
    this.emailTemplatesData[index] = {
      ...this.emailTemplatesData[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    return this.emailTemplatesData[index];
  }

  async createEmailTemplateVersion(versionData: InsertEmailTemplateVersion): Promise<EmailTemplateVersion> {
    const version: EmailTemplateVersion = {
      id: `version_${this.idCounter++}`,
      templateId: versionData.templateId,
      version: versionData.version,
      subject: versionData.subject,
      htmlContent: versionData.htmlContent,
      textContent: versionData.textContent || null,
      variables: versionData.variables || [],
      isActive: versionData.isActive ?? false,
      publishedAt: versionData.publishedAt || null,
      publishedBy: versionData.publishedBy || null,
      notes: versionData.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.emailTemplateVersionsData.push(version);
    return version;
  }

  async getEmailTemplateVersions(templateId: string): Promise<EmailTemplateVersion[]> {
    return this.emailTemplateVersionsData
      .filter(v => v.templateId === templateId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getActiveEmailTemplateVersion(templateId: string): Promise<EmailTemplateVersion | undefined> {
    return this.emailTemplateVersionsData.find(v => 
      v.templateId === templateId && v.isActive
    );
  }

  async publishEmailTemplateVersion(id: string, publishedBy: string): Promise<EmailTemplateVersion | undefined> {
    const versionIndex = this.emailTemplateVersionsData.findIndex(v => v.id === id);
    if (versionIndex === -1) return undefined;
    
    const templateId = this.emailTemplateVersionsData[versionIndex].templateId;
    
    // Deactivate all other versions
    this.emailTemplateVersionsData.forEach((v, i) => {
      if (v.templateId === templateId) {
        this.emailTemplateVersionsData[i].isActive = false;
      }
    });
    
    // Activate this version
    this.emailTemplateVersionsData[versionIndex] = {
      ...this.emailTemplateVersionsData[versionIndex],
      isActive: true,
      publishedAt: new Date(),
      publishedBy,
      updatedAt: new Date(),
    };
    
    return this.emailTemplateVersionsData[versionIndex];
  }

  async getEmailTemplates(filters?: { category?: string; isActive?: boolean; search?: string }): Promise<EmailTemplate[]> {
    let templates = [...this.emailTemplatesData];
    
    if (filters?.category) {
      templates = templates.filter(t => t.category === filters.category);
    }
    if (filters?.isActive !== undefined) {
      templates = templates.filter(t => t.isActive === filters.isActive);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      templates = templates.filter(t => 
        t.name.toLowerCase().includes(searchLower) ||
        (t.subject && t.subject.toLowerCase().includes(searchLower))
      );
    }
    
    return templates.filter(t => !t.isDeleted);
  }

  async getEmailTemplateById(id: string): Promise<EmailTemplate | undefined> {
    return this.emailTemplatesData.find(t => t.id === id && !t.isDeleted);
  }

  async deleteEmailTemplate(id: string): Promise<boolean> {
    const index = this.emailTemplatesData.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.emailTemplatesData.splice(index, 1);
    return true;
  }

  async softDeleteEmailTemplate(id: string, deletedBy: string): Promise<EmailTemplate | undefined> {
    const template = this.emailTemplatesData.find(t => t.id === id);
    if (!template) return undefined;
    
    template.isDeleted = true;
    template.deletedAt = new Date();
    template.deletedBy = deletedBy;
    template.updatedAt = new Date();
    
    return template;
  }

  async cloneEmailTemplate(id: string, newName: string, createdBy: string): Promise<EmailTemplate> {
    const original = this.emailTemplatesData.find(t => t.id === id);
    if (!original) throw new Error('Template not found');
    
    const cloned: EmailTemplate = {
      ...original,
      id: `template_${this.idCounter++}`,
      name: newName,
      isActive: false,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: { ...original.metadata, clonedFrom: id }
    };
    
    this.emailTemplatesData.push(cloned);
    return cloned;
  }

  async getEmailTemplateVersion(id: string): Promise<EmailTemplateVersion | undefined> {
    return this.emailTemplateVersionsData.find(v => v.id === id);
  }

  async testEmailTemplate(templateId: string, testEmail: string, testData?: any): Promise<{ success: boolean; message: string }> {
    const template = this.emailTemplatesData.find(t => t.id === templateId);
    if (!template) {
      return { success: false, message: 'Template not found' };
    }
    // Mock success for MemStorage
    return { success: true, message: 'Test email sent successfully' };
  }

  async exportEmailTemplate(id: string): Promise<any> {
    const template = this.emailTemplatesData.find(t => t.id === id);
    if (!template) throw new Error('Template not found');
    
    const versions = await this.getEmailTemplateVersions(id);
    
    return {
      template,
      versions,
      exportedAt: new Date().toISOString()
    };
  }

  async importEmailTemplate(templateData: any, createdBy: string): Promise<EmailTemplate> {
    const { template } = templateData;
    
    const imported: EmailTemplate = {
      ...template,
      id: `template_${this.idCounter++}`,
      name: `${template.name}_imported_${Date.now()}`,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.emailTemplatesData.push(imported);
    
    // Import versions if any
    if (templateData.versions && templateData.versions.length > 0) {
      for (const version of templateData.versions) {
        await this.createEmailTemplateVersion({
          ...version,
          templateId: imported.id,
          createdBy
        });
      }
    }
    
    return imported;
  }

  // ========================================
  // ADMIN PANEL STATISTICS METHODS (MemStorage)
  // ========================================

  async getUsersCount(search?: string, role?: string): Promise<number> {
    let users = this.userAccountsData;
    
    if (search) {
      users = users.filter(user => 
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (role && role !== 'all') {
      users = users.filter(user => user.adminRole === role);
    }
    
    return users.length;
  }

  async getVerifiedUsersCount(): Promise<number> {
    return this.userAccountsData.filter(user => user.emailVerified).length;
  }

  async getAdminsCount(): Promise<number> {
    return this.userAccountsData.filter(user => user.isAdmin).length;
  }

  async getRecentUsersCount(days: number): Promise<number> {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);
    
    return this.userAccountsData.filter(user => 
      user.createdAt >= dateFrom
    ).length;
  }

  async getBlogArticlesCount(status?: string, search?: string): Promise<number> {
    let articles = this.blogArticlesData;
    
    if (status && status !== 'all') {
      articles = articles.filter(article => article.status === status);
    }
    
    if (search) {
      articles = articles.filter(article => 
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return articles.length;
  }

  async getPublishedBlogArticlesCount(): Promise<number> {
    return this.blogArticlesData.filter(article => article.status === 'published').length;
  }

  async getLastGeneratedArticleDate(): Promise<Date | null> {
    const settings = this.blogGenerationSettingsData[0];
    return settings?.lastGeneratedAt || null;
  }

  async getEmailsSentCount(days: number): Promise<number> {
    return 0; // Mock data for in-memory storage
  }

  async getEmailDeliveryRate(): Promise<number> {
    return 98.5; // Mock data for in-memory storage
  }

  async getEmailBounceRate(): Promise<number> {
    return 1.2; // Mock data for in-memory storage
  }

  async getUsers(options: { 
    limit: number; 
    offset: number; 
    search?: string; 
    role?: string 
  }): Promise<UserAccount[]> {
    let users = [...this.userAccountsData];
    
    if (options.search) {
      users = users.filter(user => 
        user.email.toLowerCase().includes(options.search!.toLowerCase())
      );
    }
    
    if (options.role && options.role !== 'all') {
      users = users.filter(user => user.adminRole === options.role);
    }
    
    return users.slice(options.offset, options.offset + options.limit);
  }

  // Email service status methods
  async createEmailServiceStatus(statusData: InsertEmailServiceStatus): Promise<EmailServiceStatus> {
    const now = new Date();
    const status: EmailServiceStatus = {
      id: `email_status_${this.idCounter++}_${Date.now()}`,
      provider: statusData.provider,
      messageId: statusData.messageId || null,
      recipient: statusData.recipient,
      sender: statusData.sender,
      subject: statusData.subject || null,
      templateId: statusData.templateId || null,
      status: statusData.status || 'pending',
      deliveryStatus: statusData.deliveryStatus || {},
      sentAt: statusData.sentAt || null,
      deliveredAt: statusData.deliveredAt || null,
      openedAt: statusData.openedAt || null,
      clickedAt: statusData.clickedAt || null,
      bouncedAt: statusData.bouncedAt || null,
      failedAt: statusData.failedAt || null,
      bounceType: statusData.bounceType || null,
      bounceReason: statusData.bounceReason || null,
      clickCount: statusData.clickCount || 0,
      openCount: statusData.openCount || 0,
      metadata: statusData.metadata || {},
      createdAt: now,
      updatedAt: now,
    };
    this.emailServiceStatusData.push(status);
    return status;
  }

  async getEmailServiceStatuses(filters?: { provider?: string; status?: string; recipient?: string; limit?: number }): Promise<EmailServiceStatus[]> {
    let statuses = [...this.emailServiceStatusData];
    
    if (filters?.provider) {
      statuses = statuses.filter(s => s.provider === filters.provider);
    }
    if (filters?.status) {
      statuses = statuses.filter(s => s.status === filters.status);
    }
    if (filters?.recipient) {
      statuses = statuses.filter(s => s.recipient === filters.recipient);
    }
    
    // Sort by createdAt descending
    statuses.sort((a, b) => {
      const aTime = a.createdAt?.getTime() || 0;
      const bTime = b.createdAt?.getTime() || 0;
      return bTime - aTime;
    });
    
    const limit = filters?.limit || 100;
    return statuses.slice(0, limit);
  }

  async getEmailServiceStatusByMessageId(messageId: string): Promise<EmailServiceStatus | undefined> {
    return this.emailServiceStatusData.find(status => status.messageId === messageId);
  }

  async getEmailDeliveryStats(startDate: Date, endDate: Date): Promise<{
    total: number;
    delivered: number;
    bounced: number;
    failed: number;
    openRate: number;
    clickRate: number;
  }> {
    // Filter email statuses within date range
    const relevantStatuses = this.emailServiceStatusData.filter(status => {
      const statusDate = status.createdAt || new Date(0);
      return statusDate >= startDate && statusDate <= endDate;
    });
    
    const total = relevantStatuses.length;
    const delivered = relevantStatuses.filter(s => s.status === 'delivered').length;
    const bounced = relevantStatuses.filter(s => s.status === 'bounced').length;
    const failed = relevantStatuses.filter(s => s.status === 'failed').length;
    const opened = relevantStatuses.filter(s => s.openedAt !== null).length;
    const clicked = relevantStatuses.filter(s => s.clickedAt !== null).length;
    
    const openRate = total > 0 ? (opened / total) * 100 : 0;
    const clickRate = total > 0 ? (clicked / total) * 100 : 0;
    
    return {
      total,
      delivered,
      bounced,
      failed,
      openRate: Math.round(openRate * 10) / 10,
      clickRate: Math.round(clickRate * 10) / 10,
    };
  }

  async updateEmailServiceStatus(id: string, updates: Partial<EmailServiceStatus>): Promise<EmailServiceStatus | undefined> {
    const index = this.emailServiceStatusData.findIndex(status => status.id === id);
    if (index === -1) return undefined;
    
    this.emailServiceStatusData[index] = {
      ...this.emailServiceStatusData[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.emailServiceStatusData[index];
  }

  // Missing methods from IStorage interface

  async getAuditLogs(filters?: {
    adminId?: string;
    action?: string;
    targetType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AdminAction[]> {
    let actions = [...this.adminActionsData];
    
    if (filters?.adminId) {
      actions = actions.filter(a => a.adminId === filters.adminId);
    }
    if (filters?.action) {
      actions = actions.filter(a => a.action === filters.action);
    }
    if (filters?.targetType) {
      actions = actions.filter(a => a.targetType === filters.targetType);
    }
    if (filters?.dateFrom) {
      actions = actions.filter(a => a.createdAt && a.createdAt >= filters.dateFrom!);
    }
    if (filters?.dateTo) {
      actions = actions.filter(a => a.createdAt && a.createdAt <= filters.dateTo!);
    }
    
    // Sort by date descending
    actions.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;
    return actions.slice(offset, offset + limit);
  }

  async getAuditLogById(id: string): Promise<AdminAction | null> {
    const action = this.adminActionsData.find(a => a.id === id);
    return action || null;
  }

  async exportAuditLogs(dateRange?: { from: Date; to: Date }): Promise<string> {
    let actions = [...this.adminActionsData];
    
    if (dateRange) {
      actions = actions.filter(a => 
        a.createdAt && 
        a.createdAt >= dateRange.from && 
        a.createdAt <= dateRange.to
      );
    }
    
    // Convert to CSV format
    const headers = ['ID', 'Admin ID', 'Action', 'Target Type', 'Target ID', 'Created At'];
    const rows = actions.map(action => [
      action.id,
      action.adminId,
      action.action,
      action.targetType || '',
      action.targetId || '',
      action.createdAt?.toISOString() || ''
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  }

  async grantPermission(permission: InsertAdminPermission): Promise<AdminPermission> {
    return this.createAdminPermission(permission);
  }

  async revokePermission(permissionId: string): Promise<boolean> {
    return this.revokeAdminPermission(permissionId);
  }

  async getPermissionHistory(adminId: string): Promise<AdminPermission[]> {
    return this.adminPermissionsData
      .filter(p => p.adminId === adminId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getSecurityStats(): Promise<{
    totalAuditLogs: number;
    recentFailedLogins: number;
    activePermissions: number;
    secretsCount: number;
    healthChecksPassing: number;
    totalHealthChecks: number;
  }> {
    const totalAuditLogs = this.adminActionsData.length;
    const recentFailedLogins = 0; // Stub - not tracking failed logins in memory
    const activePermissions = this.adminPermissionsData.filter(p => p.isActive).length;
    const secretsCount = this.platformSecretsData.length;
    const totalHealthChecks = this.systemHealthChecksData.length;
    const healthChecksPassing = this.systemHealthChecksData.filter(h => h.status === 'healthy').length;

    return {
      totalAuditLogs,
      recentFailedLogins,
      activePermissions,
      secretsCount,
      healthChecksPassing,
      totalHealthChecks,
    };
  }

  async searchUsers(options: {
    text?: string;
    dateFrom?: Date;
    dateTo?: Date;
    subscriptionStatus?: string;
    verificationStatus?: string;
    adminRole?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit: number;
    offset: number;
  }): Promise<{ users: (UserAccount & { profile?: UserProfile; subscription?: Subscription | null })[], total: number }> {
    let users = [...this.userAccountsData];
    
    // Apply filters
    if (options.text) {
      const searchText = options.text.toLowerCase();
      users = users.filter(user => 
        user.email.toLowerCase().includes(searchText)
      );
    }
    
    if (options.dateFrom) {
      users = users.filter(user => user.createdAt && user.createdAt >= options.dateFrom!);
    }
    
    if (options.dateTo) {
      users = users.filter(user => user.createdAt && user.createdAt <= options.dateTo!);
    }
    
    if (options.verificationStatus === 'verified') {
      users = users.filter(user => user.emailVerified === true);
    } else if (options.verificationStatus === 'unverified') {
      users = users.filter(user => user.emailVerified === false);
    }
    
    // Add profile and subscription data
    const usersWithDetails = users.map(user => ({
      ...user,
      profile: this.userProfilesData.find(p => p.userId === user.id),
      subscription: this.subscriptionsData.find(s => s.userId === user.id && s.status === 'active') || null,
    }));
    
    // Sort
    const sortOrder = options.sortOrder || 'desc';
    usersWithDetails.sort((a, b) => {
      const aTime = a.createdAt?.getTime() || 0;
      const bTime = b.createdAt?.getTime() || 0;
      return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
    });
    
    const total = usersWithDetails.length;
    const paginatedUsers = usersWithDetails.slice(options.offset, options.offset + options.limit);
    
    return { users: paginatedUsers, total };
  }

  async getUserWithDetails(userId: string): Promise<{
    account: UserAccount;
    profile?: UserProfile;
    subscription?: Subscription | null;
    payments?: Payment[];
    activities?: any[];
    notes?: any[];
  } | undefined> {
    const account = this.userAccountsData.find(user => user.id === userId);
    if (!account) return undefined;
    
    const profile = this.userProfilesData.find(p => p.userId === userId);
    const subscription = this.subscriptionsData.find(s => s.userId === userId && s.status === 'active') || null;
    const payments = this.paymentsData.filter(p => p.userId === userId);
    const activities = await this.getUserActivityHistory(userId, 50);
    const notes: any[] = []; // Stub - no user notes table in memory
    
    return {
      account,
      profile,
      subscription,
      payments,
      activities,
      notes,
    };
  }

  async banUser(userId: string, reason: string, bannedBy: string): Promise<UserAccount | undefined> {
    const account = await this.updateUserAccount(userId, { 
      isBanned: true,
      bannedAt: new Date(),
      banReason: reason
    });
    
    if (account) {
      await this.logAdminAction({
        adminId: bannedBy,
        action: 'ban_user',
        targetType: 'user',
        targetId: userId,
        metadata: { reason },
        ipAddress: null,
        userAgent: null,
        sessionId: null,
      });
    }
    
    return account;
  }

  async unbanUser(userId: string, unbannedBy: string): Promise<UserAccount | undefined> {
    const account = await this.updateUserAccount(userId, { 
      isBanned: false,
      bannedAt: null,
      banReason: null
    });
    
    if (account) {
      await this.logAdminAction({
        adminId: unbannedBy,
        action: 'unban_user',
        targetType: 'user',
        targetId: userId,
        ipAddress: null,
        userAgent: null,
        sessionId: null,
      });
    }
    
    return account;
  }

  // Operator action token operations (stub implementations for MemStorage)
  async createOperatorActionToken(tokenData: InsertOperatorActionToken): Promise<OperatorActionToken> {
    throw new Error('Operator action tokens are not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getOperatorActionTokenByToken(token: string): Promise<OperatorActionToken | undefined> {
    throw new Error('Operator action tokens are not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async markOperatorActionTokenAsUsed(token: string, usedByIp: string, userAgent: string): Promise<OperatorActionToken | undefined> {
    throw new Error('Operator action tokens are not supported in MemStorage. Use DatabaseStorage for production.');
  }

  // Deletion request by tracking/message ID operations (stub implementations for MemStorage)
  async getDeletionRequestByTrackingId(trackingId: string): Promise<DeletionRequest | undefined> {
    throw new Error('DB storage required - getDeletionRequestByTrackingId not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getDeletionRequestByMessageId(messageId: string): Promise<DeletionRequest | undefined> {
    throw new Error('DB storage required - getDeletionRequestByMessageId not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getDeletionRequestById(id: string): Promise<DeletionRequest | undefined> {
    throw new Error('DB storage required - getDeletionRequestById not supported in MemStorage. Use DatabaseStorage for production.');
  }

  // Evidence Collection operations (stub implementations for MemStorage)
  async createEvidenceCollection(evidenceData: InsertEvidenceCollection): Promise<EvidenceCollection> {
    throw new Error('DB storage required - createEvidenceCollection not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getEvidenceCollectionById(id: string): Promise<EvidenceCollection | undefined> {
    throw new Error('DB storage required - getEvidenceCollectionById not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getEvidenceCollectionByRequestId(deletionRequestId: string): Promise<EvidenceCollection[]> {
    throw new Error('DB storage required - getEvidenceCollectionByRequestId not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async updateEvidenceCollection(id: string, updates: Partial<EvidenceCollection>): Promise<EvidenceCollection | undefined> {
    throw new Error('DB storage required - updateEvidenceCollection not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async verifyEvidenceChainIntegrity(deletionRequestId: string): Promise<boolean> {
    throw new Error('DB storage required - verifyEvidenceChainIntegrity not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getEvidenceChainLength(deletionRequestId: string): Promise<number> {
    throw new Error('DB storage required - getEvidenceChainLength not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getLastEvidenceInChainWithLock(deletionRequestId: string): Promise<EvidenceCollection | null> {
    throw new Error('DB storage required - getLastEvidenceInChainWithLock not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async createEvidenceCollectionAtomic(evidenceData: InsertEvidenceCollection, deletionRequestId: string): Promise<EvidenceCollection> {
    throw new Error('DB storage required - createEvidenceCollectionAtomic not supported in MemStorage. Use DatabaseStorage for production.');
  }

  // Legal Knowledge Base operations (stub implementations for MemStorage)
  async createLegalArticle(articleData: InsertLegalArticle): Promise<LegalArticle> {
    throw new Error('DB storage required - createLegalArticle not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getLegalArticleById(id: string): Promise<LegalArticle | undefined> {
    throw new Error('DB storage required - getLegalArticleById not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getLegalArticlesByViolationType(violationType: string): Promise<LegalArticle[]> {
    throw new Error('DB storage required - getLegalArticlesByViolationType not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getLegalArticlesByCategory(category: string): Promise<LegalArticle[]> {
    throw new Error('DB storage required - getLegalArticlesByCategory not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getAllLegalArticles(): Promise<LegalArticle[]> {
    throw new Error('DB storage required - getAllLegalArticles not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async updateLegalArticle(id: string, updates: Partial<LegalArticle>): Promise<LegalArticle | undefined> {
    throw new Error('DB storage required - updateLegalArticle not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async deleteLegalArticle(id: string): Promise<boolean> {
    throw new Error('DB storage required - deleteLegalArticle not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getLegalArticlesByLawReference(lawReference: string): Promise<LegalArticle[]> {
    throw new Error('DB storage required - getLegalArticlesByLawReference not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async searchLegalArticles(searchTerm: string): Promise<LegalArticle[]> {
    throw new Error('DB storage required - searchLegalArticles not supported in MemStorage. Use DatabaseStorage for production.');
  }

  // Inbound email operations (stub implementations for MemStorage)
  async createInboundEmail(emailData: InsertInboundEmail): Promise<InboundEmail> {
    throw new Error('DB storage required - createInboundEmail not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getInboundEmailById(id: string): Promise<InboundEmail | undefined> {
    throw new Error('DB storage required - getInboundEmailById not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async updateInboundEmailAnalysis(id: string, analysisData: any): Promise<InboundEmail | undefined> {
    throw new Error('DB storage required - updateInboundEmailAnalysis not supported in MemStorage. Use DatabaseStorage for production.');
  }

  // ========================================
  // TWO-STAGE EMAIL SYSTEM STUBS
  // ========================================

  // Enhanced Operator Action Tokens stubs
  async cleanupExpiredTokens(): Promise<number> {
    throw new Error('Two-stage email system - cleanupExpiredTokens not supported in MemStorage. Use DatabaseStorage for production.');
  }

  // Enhanced Inbound Emails stubs
  async getInboundEmailsByDeletionRequest(deletionRequestId: string): Promise<InboundEmail[]> {
    throw new Error('Two-stage email system - getInboundEmailsByDeletionRequest not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async updateInboundEmailClassification(id: string, parsedStatus: string): Promise<InboundEmail | undefined> {
    throw new Error('Two-stage email system - updateInboundEmailClassification not supported in MemStorage. Use DatabaseStorage for production.');
  }

  // Deletion Request Status Transitions stubs
  async updateDeletionRequestStatus(id: string, status: string, metadata?: any): Promise<DeletionRequest | undefined> {
    throw new Error('Two-stage email system - updateDeletionRequestStatus not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async updateFollowUpSent(id: string, messageId: string, sentAt: Date): Promise<DeletionRequest | undefined> {
    throw new Error('Two-stage email system - updateFollowUpSent not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async updateEscalationSent(id: string, messageId: string, sentAt: Date): Promise<DeletionRequest | undefined> {
    throw new Error('Two-stage email system - updateEscalationSent not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async markOperatorConfirmed(id: string, confirmedAt: Date, confirmationToken?: string): Promise<DeletionRequest | undefined> {
    throw new Error('Two-stage email system - markOperatorConfirmed not supported in MemStorage. Use DatabaseStorage for production.');
  }

  // Enhanced Query Methods stubs
  async getDeletionRequestsRequiringFollowUp(): Promise<DeletionRequest[]> {
    throw new Error('Two-stage email system - getDeletionRequestsRequiringFollowUp not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getDeletionRequestsRequiringEscalation(): Promise<DeletionRequest[]> {
    throw new Error('Two-stage email system - getDeletionRequestsRequiringEscalation not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getDeletionRequestsWithAnalytics(filters?: { 
    dateFrom?: Date; 
    dateTo?: Date; 
    operatorId?: string; 
    decisionType?: string; 
  }): Promise<DeletionRequest[]> {
    throw new Error('Response analytics - getDeletionRequestsWithAnalytics not supported in MemStorage. Use DatabaseStorage for production.');
  }

  // ========================================
  // CAMPAIGN OPERATIONS STUBS (Missing methods)
  // ========================================

  async createCampaign(campaignData: InsertDeletionRequest): Promise<DeletionRequest> {
    throw new Error('Campaign operations - createCampaign not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getCampaignById(id: string): Promise<DeletionRequest | undefined> {
    throw new Error('Campaign operations - getCampaignById not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getUserCampaigns(userId: string): Promise<DeletionRequest[]> {
    throw new Error('Campaign operations - getUserCampaigns not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getAllCampaigns(filters?: { 
    campaignStatus?: string; 
    escalationLevel?: number; 
    priority?: string; 
    organizationName?: string; 
    nextAction?: string 
  }): Promise<DeletionRequest[]> {
    throw new Error('Campaign operations - getAllCampaigns not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async updateCampaign(id: string, updates: Partial<DeletionRequest>): Promise<DeletionRequest | undefined> {
    throw new Error('Campaign operations - updateCampaign not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async updateCampaignStatus(id: string, status: string, milestone?: any): Promise<DeletionRequest | undefined> {
    throw new Error('Campaign operations - updateCampaignStatus not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async updateCampaignMetrics(id: string, metrics: Record<string, any>): Promise<DeletionRequest | undefined> {
    throw new Error('Campaign operations - updateCampaignMetrics not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async updateCampaignProgress(
    id: string, 
    completionRate: number, 
    nextAction?: string, 
    nextActionAt?: Date
  ): Promise<DeletionRequest | undefined> {
    throw new Error('Campaign operations - updateCampaignProgress not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async pauseCampaignAutomation(id: string, reason: string): Promise<DeletionRequest | undefined> {
    throw new Error('Campaign operations - pauseCampaignAutomation not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async resumeCampaignAutomation(id: string): Promise<DeletionRequest | undefined> {
    throw new Error('Campaign operations - resumeCampaignAutomation not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getCampaignStatistics(timeframe?: 'day' | 'week' | 'month'): Promise<{
    totalCampaigns: number;
    activeCampaigns: number;
    completedCampaigns: number;
    escalatedCampaigns: number;
    averageCompletionTime: number;
    successRate: number;
    escalationRate: number;
    weeklyTrends: any[];
  }> {
    throw new Error('Campaign operations - getCampaignStatistics not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getCampaignsByOperator(operatorEmail: string): Promise<DeletionRequest[]> {
    throw new Error('Campaign operations - getCampaignsByOperator not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getOperatorComplianceMetrics(operatorEmail: string): Promise<{
    totalCampaigns: number;
    successfulCampaigns: number;
    averageResponseTime: number;
    complianceScore: number;
  }> {
    throw new Error('Campaign operations - getOperatorComplianceMetrics not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getCampaignsReadyForAction(): Promise<DeletionRequest[]> {
    throw new Error('Campaign operations - getCampaignsReadyForAction not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getCampaignsRequiringEscalation(): Promise<DeletionRequest[]> {
    throw new Error('Campaign operations - getCampaignsRequiringEscalation not supported in MemStorage. Use DatabaseStorage for production.');
  }

  async getStalledCampaigns(daysSinceLastAction: number): Promise<DeletionRequest[]> {
    throw new Error('Campaign operations - getStalledCampaigns not supported in MemStorage. Use DatabaseStorage for production.');
  }
}

// Choose storage implementation
// Use MemStorage for development, DatabaseStorage for production
// TEMP: Force PostgreSQL to access production data for monitoring
const USE_MEMORY_STORAGE = false; // process.env.NODE_ENV === 'development';
export const storage = USE_MEMORY_STORAGE ? new MemStorage() : new DatabaseStorage();

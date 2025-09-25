import { storage } from './storage';
import { sendEmail, renderTemplate, type EmailData } from './email';
import { followUpDeletionTemplate } from './templates/follow-up';
import { regulatorEscalationTemplate } from './templates/regulator-escalation';
import type { DeletionRequest } from '@shared/schema';

/**
 * Email Automation Scheduler для автоматической отправки повторных писем
 * и эскалации согласно ФЗ-152 "О персональных данных"
 */
export class EmailAutomationScheduler {
  private static instance: EmailAutomationScheduler;
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;

  private constructor() {}

  static getInstance(): EmailAutomationScheduler {
    if (!EmailAutomationScheduler.instance) {
      EmailAutomationScheduler.instance = new EmailAutomationScheduler();
    }
    return EmailAutomationScheduler.instance;
  }

  /**
   * Запуск мониторинга email automation (каждые 6 часов)
   */
  start() {
    if (this.isRunning) {
      console.log('📧 Email automation scheduler is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting email automation scheduler...');

    // Проверяем сразу при запуске
    this.processEmailAutomation().catch(console.error);

    // Запускаем периодическую проверку каждые 6 часов
    this.intervalId = setInterval(async () => {
      try {
        await this.processEmailAutomation();
      } catch (error) {
        console.error('❌ Error in scheduled email automation processing:', error);
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    console.log('✅ Email automation scheduler started (checking every 6 hours)');
  }

  /**
   * Остановка мониторинга email automation
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.isRunning = false;
    console.log('🛑 Email automation scheduler stopped');
  }

  /**
   * Основная функция обработки email automation
   */
  async processEmailAutomation(): Promise<void> {
    try {
      console.log('🔍 Processing email automation for deletion requests...');

      // Обрабатываем повторные отправки (30 дней)
      const followUpResults = await this.processFollowUpEmails();
      
      // Обрабатываем эскалации в Роскомнадзор (60 дней)
      const escalationResults = await this.processEscalations();

      const totalProcessed = followUpResults.processed + escalationResults.processed;
      const totalSent = followUpResults.sent + escalationResults.sent;

      if (totalProcessed > 0) {
        console.log(`📊 Email automation completed: ${totalSent}/${totalProcessed} emails sent`);
        console.log(`  └─ Follow-ups: ${followUpResults.sent}/${followUpResults.processed}`);
        console.log(`  └─ Escalations: ${escalationResults.sent}/${escalationResults.processed}`);
      } else {
        console.log('ℹ️ No deletion requests requiring email automation at this time');
      }
    } catch (error) {
      console.error('❌ Error in processEmailAutomation:', error);
      throw error;
    }
  }

  /**
   * Обработка повторных писем (через 30 дней без ответа)
   */
  private async processFollowUpEmails(): Promise<{ processed: number; sent: number }> {
    try {
      console.log('📧 Processing follow-up emails...');

      // Найти deletion_requests с статусом 'sent_initial' и firstSentAt старше 30 дней
      // и проверить что не получен ответ (inbound_emails не связаны)
      const candidateRequests = await storage.getDeletionRequests({
        status: 'sent_initial',
        olderThanDays: 30,
        withoutInboundEmails: true
      });

      if (candidateRequests.length === 0) {
        console.log('ℹ️ No deletion requests requiring follow-up emails');
        return { processed: 0, sent: 0 };
      }

      console.log(`📋 Found ${candidateRequests.length} deletion requests requiring follow-up emails`);

      let sentCount = 0;
      for (const request of candidateRequests) {
        try {
          // Усиленная idempotency проверка: не отправлять дубликаты
          if (request.status !== 'sent_initial') {
            console.log(`⏭️ Skipping request ${request.id}: status is ${request.status}, not 'sent_initial'`);
            continue;
          }
          
          if ((request as any).followUpSentAt) {
            console.log(`⏭️ Skipping request ${request.id}: follow-up already sent at ${(request as any).followUpSentAt}`);
            continue;
          }

          const sent = await this.sendFollowUpEmail(request);
          if (sent) {
            sentCount++;
            console.log(`✅ Follow-up email sent for deletion request ${request.id}`);
          }
        } catch (error) {
          console.error(`❌ Error sending follow-up email for request ${request.id}:`, error);
        }
      }

      console.log(`📤 Follow-up emails: ${sentCount}/${candidateRequests.length} sent successfully`);
      return { processed: candidateRequests.length, sent: sentCount };
    } catch (error) {
      console.error('❌ Error in processFollowUpEmails:', error);
      return { processed: 0, sent: 0 };
    }
  }

  /**
   * Обработка эскалаций в Роскомнадзор (через 60 дней общего срока)
   */
  private async processEscalations(): Promise<{ processed: number; sent: number }> {
    try {
      console.log('🚨 Processing escalations to Roskomnadzor...');

      // Найти deletion_requests с любым статусом и created_at старше 60 дней
      // и проверить что оператор НЕ подтвердил удаление
      const candidateRequests = await storage.getDeletionRequests({
        olderThanDays: 60,
        operatorNotConfirmed: true
      });

      if (candidateRequests.length === 0) {
        console.log('ℹ️ No deletion requests requiring escalation to Roskomnadzor');
        return { processed: 0, sent: 0 };
      }

      console.log(`📋 Found ${candidateRequests.length} deletion requests requiring escalation`);

      let sentCount = 0;
      for (const request of candidateRequests) {
        try {
          // Усиленная idempotency проверка: не эскалировать уже эскалированные
          if (request.status === 'escalated') {
            console.log(`⏭️ Skipping request ${request.id}: already escalated with status 'escalated'`);
            continue;
          }
          
          if ((request as any).escalationSentAt) {
            console.log(`⏭️ Skipping request ${request.id}: escalation already sent at ${(request as any).escalationSentAt}`);
            continue;
          }

          const sent = await this.sendEscalationEmail(request);
          if (sent) {
            sentCount++;
            console.log(`✅ Escalation email sent for deletion request ${request.id}`);
          }
        } catch (error) {
          console.error(`❌ Error sending escalation email for request ${request.id}:`, error);
        }
      }

      console.log(`📤 Escalations: ${sentCount}/${candidateRequests.length} sent successfully`);
      return { processed: candidateRequests.length, sent: sentCount };
    } catch (error) {
      console.error('❌ Error in processEscalations:', error);
      return { processed: 0, sent: 0 };
    }
  }

  /**
   * Отправка повторного письма
   */
  private async sendFollowUpEmail(request: DeletionRequest): Promise<boolean> {
    try {
      // Получаем данные пользователя для email
      const userProfile = await storage.getUserProfile(request.userId);
      const userAccount = await storage.getUserAccountById(request.userId);
      
      if (!userAccount) {
        console.error(`❌ User account not found for deletion request ${request.id}`);
        return false;
      }

      // Подготавливаем данные для шаблона
      const emailData: EmailData = {
        senderName: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || userAccount.email.split('@')[0],
        senderEmail: userAccount.email,
        senderPhone: userProfile?.phone || undefined,
        brokerName: request.brokerName,
        brokerUrl: (request.requestDetails as any)?.brokerUrl || '',
        personalData: (request.requestDetails as any)?.personalData || [],
        requestDate: request.createdAt?.toLocaleDateString('ru-RU') || new Date().toLocaleDateString('ru-RU'),
        legalBasis: 'ст. 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"'
      };

      // Рендерим шаблон
      const renderedTemplate = renderTemplate(followUpDeletionTemplate, emailData);

      // Отправляем email
      const emailResult = await sendEmail({
        to: request.operatorEmail || 'data.protection@unknown-operator.ru',
        template: renderedTemplate,
        data: emailData,
        userId: request.userId,
        deletionRequestId: request.id,
        category: 'deletion_follow_up'
      });

      if (emailResult.success) {
        // Атомарное обновление статуса и всех связанных полей
        try {
          await storage.updateDeletionRequest(request.id, {
            status: 'followup_sent',
            followUpSentAt: new Date(),
            followUpMessageId: emailResult.messageId
          });
          console.log(`📧 Follow-up email sent successfully for request ${request.id}`);
          return true;
        } catch (dbError) {
          console.error(`❌ Database update failed after sending follow-up email for request ${request.id}:`, dbError);
          // Email был отправлен, но статус не обновился - это критическая ошибка
          throw new Error(`Critical: Follow-up email sent but database update failed for request ${request.id}`);
        }
      } else {
        console.error(`❌ Failed to send follow-up email for request ${request.id}:`, emailResult.error);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error in sendFollowUpEmail for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Отправка эскалации в Роскомнадзор
   */
  private async sendEscalationEmail(request: DeletionRequest): Promise<boolean> {
    try {
      // Получаем данные пользователя для email
      const userProfile = await storage.getUserProfile(request.userId);
      const userAccount = await storage.getUserAccountById(request.userId);
      
      if (!userAccount) {
        console.error(`❌ User account not found for deletion request ${request.id}`);
        return false;
      }

      // Подготавливаем данные для шаблона эскалации
      const emailData: EmailData = {
        senderName: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || userAccount.email.split('@')[0],
        senderEmail: userAccount.email,
        senderPhone: userProfile?.phone || undefined,
        brokerName: request.brokerName,
        brokerUrl: (request.requestDetails as any)?.brokerUrl || '',
        personalData: (request.requestDetails as any)?.personalData || [],
        requestDate: request.createdAt?.toLocaleDateString('ru-RU') || new Date().toLocaleDateString('ru-RU'),
        legalBasis: 'ст. 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"'
      };

      // Рендерим шаблон эскалации
      const renderedTemplate = renderTemplate(regulatorEscalationTemplate, emailData);

      // Отправляем в Роскомнадзор (используем официальный email или test email)
      const roskomnadzorEmail = process.env.ROSKOMNADZOR_EMAIL || 'complaints@rkn.gov.ru';
      
      const emailResult = await sendEmail({
        to: roskomnadzorEmail,
        template: renderedTemplate,
        data: emailData,
        userId: request.userId,
        deletionRequestId: request.id,
        category: 'regulator_escalation'
      });

      if (emailResult.success) {
        // Атомарное обновление статуса и всех связанных полей
        try {
          await storage.updateDeletionRequest(request.id, {
            status: 'escalated',
            escalationSentAt: new Date(),
            escalationMessageId: emailResult.messageId
          });
          console.log(`🚨 Escalation email sent to Roskomnadzor for request ${request.id}`);
          return true;
        } catch (dbError) {
          console.error(`❌ Database update failed after sending escalation email for request ${request.id}:`, dbError);
          // Email был отправлен, но статус не обновился - это критическая ошибка
          throw new Error(`Critical: Escalation email sent but database update failed for request ${request.id}`);
        }
      } else {
        console.error(`❌ Failed to send escalation email for request ${request.id}:`, emailResult.error);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error in sendEscalationEmail for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Получение статистики работы планировщика
   */
  async getAutomationStats(): Promise<{
    isRunning: boolean;
    pendingFollowUps: number;
    pendingEscalations: number;
    totalProcessedToday: number;
  }> {
    try {
      // Подсчитываем ожидающие follow-up emails
      const pendingFollowUps = await storage.getDeletionRequests({
        status: 'sent_initial',
        olderThanDays: 30,
        withoutInboundEmails: true
      });

      // Подсчитываем ожидающие эскалации
      const pendingEscalations = await storage.getDeletionRequests({
        olderThanDays: 60,
        operatorNotConfirmed: true
      });

      // Фильтруем уже эскалированные
      const realPendingEscalations = pendingEscalations.filter(req => 
        req.status !== 'escalated' && !(req as any).escalationSentAt
      );

      // TODO: Добавить подсчет сегодняшних отправок из логов или отдельной таблицы
      const totalProcessedToday = 0;

      return {
        isRunning: this.isRunning,
        pendingFollowUps: pendingFollowUps.length,
        pendingEscalations: realPendingEscalations.length,
        totalProcessedToday
      };
    } catch (error) {
      console.error('❌ Error getting automation stats:', error);
      return {
        isRunning: this.isRunning,
        pendingFollowUps: 0,
        pendingEscalations: 0,
        totalProcessedToday: 0
      };
    }
  }

  /**
   * Ручной запуск обработки email automation (для тестирования)
   */
  async manualAutomationCheck(): Promise<void> {
    console.log('🔧 Manual email automation check initiated...');
    await this.processEmailAutomation();
  }
}

// Экспортируем singleton instance
export const emailAutomationScheduler = EmailAutomationScheduler.getInstance();
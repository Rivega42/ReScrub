import { storage } from './storage';
import { robokassaClient } from './robokassa';
import type { Subscription } from '@shared/schema';

/**
 * Subscription Manager для автоматических периодических списаний
 */
export class SubscriptionManager {
  private static instance: SubscriptionManager;
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;

  private constructor() {}

  static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  /**
   * Запуск мониторинга подписок (каждые 6 часов)
   */
  start() {
    if (this.isRunning) {
      console.log('Subscription manager is already running');
      return;
    }

    this.isRunning = true;
    console.log('🔄 Starting subscription manager...');

    // Проверяем подписки сразу при запуске
    this.processRecurringPayments().catch(console.error);

    // Запускаем периодическую проверку каждые 6 часов
    this.intervalId = setInterval(async () => {
      try {
        await this.processRecurringPayments();
      } catch (error) {
        console.error('Error in scheduled recurring payments processing:', error);
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    console.log('✅ Subscription manager started (checking every 6 hours)');
  }

  /**
   * Остановка мониторинга подписок
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.isRunning = false;
    console.log('🛑 Subscription manager stopped');
  }

  /**
   * Основная функция обработки периодических платежей
   */
  async processRecurringPayments(): Promise<void> {
    try {
      console.log('🔍 Processing recurring payments...');

      // В реальной реализации здесь был бы SQL запрос для поиска подписок,
      // требующих продления. Для in-memory storage используем упрощенную логику
      const subscriptions = await this.getActiveSubscriptionsNeedingRenewal();

      if (subscriptions.length === 0) {
        console.log('ℹ️ No subscriptions need renewal at this time');
        return;
      }

      console.log(`📊 Found ${subscriptions.length} subscriptions needing renewal`);

      for (const subscription of subscriptions) {
        try {
          await this.processSubscriptionRenewal(subscription);
        } catch (error) {
          console.error(`Error processing subscription ${subscription.id}:`, error);
        }
      }

      console.log('✅ Recurring payments processing completed');
    } catch (error) {
      console.error('Error in processRecurringPayments:', error);
      throw error;
    }
  }

  /**
   * Получение активных подписок, которым нужно продление
   */
  private async getActiveSubscriptionsNeedingRenewal(): Promise<Subscription[]> {
    // Для in-memory storage используем простую логику
    // В реальной БД здесь был бы SQL запрос:
    // SELECT * FROM subscriptions 
    // WHERE status = 'active' 
    // AND current_period_end <= NOW() + INTERVAL '1 DAY'
    // AND cancel_at_period_end = false

    const allSubscriptions = await this.getAllActiveSubscriptions();
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return allSubscriptions.filter(subscription => 
      subscription.status === 'active' &&
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd <= oneDayFromNow &&
      !subscription.cancelAtPeriodEnd
    );
  }

  /**
   * Получение всех активных подписок (заглушка для in-memory storage)
   */
  private async getAllActiveSubscriptions(): Promise<Subscription[]> {
    // Поскольку у нас in-memory storage и нет прямого метода для получения всех подписок,
    // создадим заглушку. В реальной реализации с БД здесь был бы простой SELECT
    return []; // Для демо возвращаем пустой массив
  }

  /**
   * Обработка продления конкретной подписки
   */
  private async processSubscriptionRenewal(subscription: Subscription): Promise<void> {
    try {
      console.log(`🔄 Processing renewal for subscription ${subscription.id}`);

      const plan = await storage.getSubscriptionPlanById(subscription.planId);
      if (!plan) {
        console.error(`Plan not found for subscription ${subscription.id}`);
        return;
      }

      // Генерируем новый invoice ID для периодического платежа
      const newInvoiceId = `rec_${subscription.id}_${Date.now()}`;

      // Создаем запись о платеже
      const payment = await storage.createPayment({
        subscriptionId: subscription.id,
        userId: subscription.userId,
        amount: plan.price,
        currency: plan.currency,
        robokassaInvoiceId: newInvoiceId,
        isRecurring: true,
        parentInvoiceId: subscription.robokassaInvoiceId, // Ссылка на материнский платеж
      });

      // Выполняем периодическое списание через Robokassa
      const recurringResult = await robokassaClient.createRecurringPayment({
        invoiceId: newInvoiceId,
        previousInvoiceId: subscription.robokassaInvoiceId!, // Материнский платеж
        amount: plan.price / 100, // Конвертируем копейки в рубли
        description: `Продление подписки ${plan.displayName}`,
      });

      if (recurringResult.success) {
        console.log(`✅ Recurring payment created for subscription ${subscription.id}`);
        
        // Обновляем статус платежа
        await storage.updatePayment(payment.id, {
          status: 'pending',
          metadata: { robokassaResponse: recurringResult }
        });

        // Продлеваем период подписки
        const now = new Date();
        let newPeriodEnd = new Date(subscription.currentPeriodEnd || now);
        
        if (plan.interval === 'month') {
          newPeriodEnd.setMonth(newPeriodEnd.getMonth() + (plan.intervalCount || 1));
        } else if (plan.interval === 'year') {
          newPeriodEnd.setFullYear(newPeriodEnd.getFullYear() + (plan.intervalCount || 1));
        }

        await storage.updateSubscription(subscription.id, {
          currentPeriodStart: subscription.currentPeriodEnd,
          currentPeriodEnd: newPeriodEnd,
        });

        console.log(`📅 Subscription ${subscription.id} period extended until ${newPeriodEnd.toISOString()}`);
      } else {
        console.error(`❌ Failed to create recurring payment for subscription ${subscription.id}:`, recurringResult.error);
        
        // Помечаем платеж как неудачный
        await storage.updatePayment(payment.id, {
          status: 'failed',
          failedAt: new Date(),
          failureReason: recurringResult.error || 'Recurring payment failed',
        });

        // Если платеж не прошел, приостанавливаем подписку
        await storage.updateSubscription(subscription.id, {
          status: 'suspended',
        });

        console.log(`⏸️ Subscription ${subscription.id} suspended due to payment failure`);
      }
    } catch (error) {
      console.error(`Error processing subscription renewal ${subscription.id}:`, error);
      throw error;
    }
  }

  /**
   * Получение статистики по подпискам
   */
  async getSubscriptionStats(): Promise<{
    total: number;
    active: number;
    pending: number;
    cancelled: number;
    suspended: number;
  }> {
    const allSubscriptions = await this.getAllActiveSubscriptions();
    
    const stats = {
      total: allSubscriptions.length,
      active: allSubscriptions.filter((s: Subscription) => s.status === 'active').length,
      pending: allSubscriptions.filter((s: Subscription) => s.status === 'pending').length,
      cancelled: allSubscriptions.filter((s: Subscription) => s.status === 'cancelled').length,
      suspended: allSubscriptions.filter((s: Subscription) => s.status === 'suspended').length,
    };

    return stats;
  }

  /**
   * Ручной запуск обработки периодических платежей (для тестирования)
   */
  async manualRenewalCheck(): Promise<void> {
    console.log('🔧 Manual renewal check initiated...');
    await this.processRecurringPayments();
  }
}

// Экспортируем singleton instance
export const subscriptionManager = SubscriptionManager.getInstance();
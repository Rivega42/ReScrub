import { storage } from './storage';
import { generateConfirmationToken } from './auth/tokens';
import crypto from 'crypto';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';

// Initialize Mailganer.ru (SamOtpravil) SMTP
if (!process.env.MAILGANER_SMTP_HOST || !process.env.MAILGANER_SMTP_LOGIN || !process.env.MAILGANER_SMTP_PASSWORD) {
  throw new Error("MAILGANER_SMTP_* environment variables must be set");
}

const MAILGANER_SMTP_HOST = process.env.MAILGANER_SMTP_HOST;
const MAILGANER_SMTP_PORT = parseInt(process.env.MAILGANER_SMTP_PORT || '1126');
const MAILGANER_SMTP_LOGIN = process.env.MAILGANER_SMTP_LOGIN;
const MAILGANER_SMTP_PASSWORD = process.env.MAILGANER_SMTP_PASSWORD;

// Домен для отправки (должен быть добавлен в Mailganer)
const SENDER_DOMAIN = 'mailone.rescrub.ru';
const DEFAULT_SENDER = `ResCrub <noreply@${SENDER_DOMAIN}>`;

// Email templates configuration
export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

export interface EmailData {
  recipientName?: string;
  recipientCompany?: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  personalData?: string[];
  brokerName?: string;
  brokerUrl?: string;
  requestDate?: string;
  legalBasis?: string;
  // Subscription-specific fields
  subscriptionId?: string;
  planName?: string;
  planPrice?: string;
  expiryDate?: string;
  renewalUrl?: string;
  daysRemaining?: number;
  // Email verification fields
  verificationUrl?: string;
  // Token for email templates
  token?: string;
}

export interface SendEmailParams {
  to: string;
  template: EmailTemplate;
  data: EmailData;
  userId?: string;
  deletionRequestId?: string;
  category?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  notificationId?: string;
}

/**
 * Render email template with provided data using Handlebars
 */
export function renderTemplate(template: EmailTemplate, data: EmailData): EmailTemplate {
  // Prepare template data with defaults
  const templateData = {
    recipientName: data.recipientName || 'Уважаемые коллеги',
    recipientCompany: data.recipientCompany || '',
    senderName: data.senderName,
    senderEmail: data.senderEmail,
    senderPhone: data.senderPhone || '',
    personalDataList: data.personalData?.join(', ') || '',
    brokerName: data.brokerName || '',
    brokerUrl: data.brokerUrl || '',
    requestDate: data.requestDate || new Date().toLocaleDateString('ru-RU'),
    legalBasis: data.legalBasis || 'ст. 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"',
    // Subscription template data
    planName: data.planName || '',
    planPrice: data.planPrice || '',
    expiryDate: data.expiryDate || '',
    renewalUrl: data.renewalUrl || '',
    daysRemaining: data.daysRemaining || 0,
    // Email verification template data
    verificationUrl: data.verificationUrl || '',
    // Token template data
    token: data.token || ''
  };

  try {
    // Compile and render templates with Handlebars
    const subjectTemplate = Handlebars.compile(template.subject);
    const textTemplate = Handlebars.compile(template.text);
    const htmlTemplate = Handlebars.compile(template.html);

    return {
      subject: subjectTemplate(templateData),
      text: textTemplate(templateData),
      html: htmlTemplate(templateData)
    };
  } catch (error: any) {
    console.error('Template rendering error:', error);
    throw new Error(`Ошибка рендеринга шаблона: ${error.message}`);
  }
}

/**
 * Mailganer.ru SMTP Транспорт
 */
const createMailganerTransport = () => {
  return nodemailer.createTransport({
    host: MAILGANER_SMTP_HOST,
    port: MAILGANER_SMTP_PORT,
    secure: false, // Не использовать SSL, используем STARTTLS
    requireTLS: true, // Требовать TLS
    auth: {
      user: MAILGANER_SMTP_LOGIN,
      pass: MAILGANER_SMTP_PASSWORD
    },
    // Настройки для лучшей совместимости с российскими SMTP
    connectionTimeout: 30000, // 30 секунд
    greetingTimeout: 30000,
    socketTimeout: 30000
  });
};

/**
 * Mailganer.ru SMTP Client
 */
class MailganerSMTPClient {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = createMailganerTransport();
  }

  async sendEmail(params: {
    emailTo: string;
    subject: string;
    messageText: string;
    messageHtml?: string;
    emailFrom?: string;
    nameFrom?: string;
    replyTo?: string;
    xTrackId?: string;
    customHeaders?: Record<string, string>;
  }): Promise<{ messageId: string; accepted: string[]; rejected: string[] }> {
    // Always use DEFAULT_SENDER for From to fix SPF/DMARC issues
    const fromEmail = DEFAULT_SENDER;

    const mailOptions: nodemailer.SendMailOptions = {
      from: fromEmail,
      to: params.emailTo,
      replyTo: params.replyTo, // Set Reply-To to preserve contact information
      subject: params.subject,
      text: params.messageText,
      html: params.messageHtml || params.messageText,
      headers: {
        'X-Track-ID': params.xTrackId || `rescrub-${Date.now()}`,
        'X-Mailer': 'ResCrub-v1.0',
        ...params.customHeaders
      }
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        messageId: result.messageId,
        accepted: result.accepted as string[],
        rejected: result.rejected as string[]
      };
    } catch (error: any) {
      // Обработка специфичных ошибок Mailganer
      if (error.message.includes('550 bounced check filter')) {
        throw new Error(`Email ${params.emailTo} находится в стоп-листе Mailganer`);
      } else if (error.message.includes('501 from domain not trusted')) {
        throw new Error(`Домен ${SENDER_DOMAIN} не добавлен в список разрешенных доменов Mailganer`);
      } else if (error.message.includes('450 ratelimit exceeded')) {
        throw new Error('Превышен лимит отправки писем в Mailganer. Попробуйте позже.');
      } else if (error.message.includes('421 SMTP command timeout')) {
        throw new Error('Тайм-аут SMTP соединения с Mailganer');
      }
      
      // Перебрасываем остальные ошибки как есть
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection verification failed:', error);
      return false;
    }
  }
}

export const mailganerClient = new MailganerSMTPClient();

// Проверка SMTP соединения при старте
(async () => {
  console.log('🔧 Проверка SMTP соединения с Mailganer...');
  try {
    const isConnected = await mailganerClient.verifyConnection();
    if (isConnected) {
      console.log('✅ SMTP соединение с Mailganer успешно установлено');
      console.log(`📧 Домен отправки: ${SENDER_DOMAIN}`);
      console.log(`🏢 SMTP сервер: ${MAILGANER_SMTP_HOST}:${MAILGANER_SMTP_PORT}`);
    } else {
      console.log('❌ Не удалось установить SMTP соединение с Mailganer');
    }
  } catch (error: any) {
    console.error('❌ Ошибка SMTP соединения с Mailganer:', error.message);
  }
})();

/**
 * Send email via Mailganer.ru with notification tracking
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const { to, template, data, userId, deletionRequestId, category = 'deletion_request' } = params;
  
  // Declare notificationId in function scope so it's accessible in catch block
  let notificationId: string | undefined;

  try {
    // Render template with data
    const renderedTemplate = renderTemplate(template, data);

    // Create notification record before sending
    if (userId) {
      // Определяем сообщение в зависимости от категории
      const isSubscriptionNotification = category.startsWith('subscription_');
      const notificationMessage = isSubscriptionNotification ?
        `Отправка уведомления о подписке: ${to}` :
        `Отправка требования об удалении ПД: ${to}`;

      const notification = await storage.createNotification({
        userId,
        type: 'email',
        category,
        title: renderedTemplate.subject,
        message: notificationMessage,
        data: {
          to,
          deletionRequestId: isSubscriptionNotification ? undefined : deletionRequestId,
          subscriptionId: isSubscriptionNotification ? data.subscriptionId : undefined,
          templateType: category,
          brokerName: isSubscriptionNotification ? undefined : data.brokerName,
          planName: data.planName,
          sendAttempt: 1
        },
        sent: false
      });
      notificationId = notification.id;
    }

    // Generate cryptographically secure tracking ID for end-to-end correlation
    const trackingId = crypto.randomUUID();

    // Определяем правильный email для Reply-To
    const replyToEmail = data.senderEmail.includes('@') ? data.senderEmail : `${data.senderEmail}@${SENDER_DOMAIN}`;

    // Send email via Mailganer.ru SMTP
    const response = await mailganerClient.sendEmail({
      emailTo: to,
      replyTo: replyToEmail, // Set Reply-To for sender contact
      subject: renderedTemplate.subject,
      messageText: renderedTemplate.text, // Plain text version
      messageHtml: renderedTemplate.html, // HTML version
      xTrackId: trackingId,
      customHeaders: {
        'X-User-ID': userId || '',
        'X-Deletion-Request-ID': deletionRequestId || '',
        'X-Notification-ID': notificationId || '',
        'X-Category': category,
        'X-Broker-Name': data.brokerName || '',
        'X-Sender-Email': replyToEmail // Track original sender
      }
    });

    const messageId = response.messageId;

    // Update notification with success
    if (notificationId) {
      await storage.updateNotification(notificationId, {
        sent: true,
        sentAt: new Date(),
        data: {
          userId: userId || '',
          deletionRequestId: deletionRequestId || '',
          notificationId: notificationId || '',
          category,
          messageId,
          status: 'sent',
          sendAttempt: 1,
          to,
          brokerName: data.brokerName
        }
      });
    }

    // Update deletion request status if provided
    if (deletionRequestId) {
      // Get current deletion request to check if this is initial or follow-up
      const currentRequest = await storage.getDeletionRequestById(deletionRequestId);
      let updateData: any = {
        status: 'sent',
        sentAt: new Date(),
        requestMethod: 'email',
        requestDetails: {
          emailTo: to,
          messageId,
          subject: renderedTemplate.subject,
          trackingId: trackingId
        }
      };

      // Save Message-ID to appropriate field based on current status
      if (!currentRequest?.initialMessageId) {
        // This is the initial send
        updateData.initialMessageId = messageId;
        updateData.firstSentAt = new Date();
        console.log(`✅ Saved initial Message-ID: ${messageId} for deletion request: ${deletionRequestId}`);
      } else if (!currentRequest?.followUpMessageId) {
        // This is a follow-up send
        updateData.followUpMessageId = messageId;
        updateData.followUpSentAt = new Date();
        console.log(`✅ Saved follow-up Message-ID: ${messageId} for deletion request: ${deletionRequestId}`);
      } else {
        // Multiple follow-ups - just update the details
        console.log(`⚠️ Additional email sent for deletion request: ${deletionRequestId}, Message-ID: ${messageId}`);
      }

      await storage.updateDeletionRequest(deletionRequestId, updateData);
    }

    console.log(`Email sent successfully to ${to}, messageId: ${messageId}`);

    return {
      success: true,
      messageId,
      notificationId
    };

  } catch (error: any) {
    console.error('Mailganer email error:', {
      error: error.message,
      to,
      userId,
      deletionRequestId
    });

    // Update notification with error
    if (userId && notificationId) {
      try {
        // Update existing notification with error details
        await storage.updateNotification(notificationId, {
          sent: false,
          data: {
            to,
            deletionRequestId,
            error: error.message,
            status: 'failed',
            sendAttempt: 1,
            brokerName: data.brokerName
          }
        });
      } catch (notificationError) {
        console.error('Failed to update error notification:', notificationError);
      }
    } else if (userId) {
      try {
        // Create error notification if we couldn't create one before
        await storage.createNotification({
          userId,
          type: 'email',
          category,
          title: `Ошибка отправки: ${template.subject}`,
          message: `Не удалось отправить требование об удалении ПД: ${to}`,
          data: {
            to,
            deletionRequestId,
            error: error.message,
            sendAttempt: 1,
            brokerName: data.brokerName
          },
          sent: false
        });
      } catch (notificationError) {
        console.error('Failed to create error notification:', notificationError);
      }
    }

    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send bulk deletion requests to multiple brokers
 */
export async function sendBulkDeletionRequests(
  userId: string,
  brokerEmails: Array<{
    email: string;
    brokerName: string;
    brokerUrl?: string;
    deletionRequestId?: string;
  }>,
  userData: {
    senderName: string;
    senderEmail: string;
    senderPhone?: string;
    personalData?: string[];
  },
  template: EmailTemplate
): Promise<Array<SendEmailResult & { brokerName: string; email: string }>> {
  const results = [];

  for (const broker of brokerEmails) {
    // Generate HMAC token for operator confirmation if deletionRequestId exists
    let token: string | undefined;
    if (broker.deletionRequestId) {
      try {
        // Token expires in 30 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        
        // Generate HMAC token
        token = generateConfirmationToken(
          broker.deletionRequestId,
          'confirm_deletion',
          expiresAt
        );
        
        // Save token to database
        await storage.createOperatorActionToken({
          deletionRequestId: broker.deletionRequestId,
          token,
          type: 'confirm_deletion',
          expiresAt
        });
        
        console.log(`✅ Generated confirmation token for deletion request ${broker.deletionRequestId}`);
      } catch (tokenError) {
        console.error('Failed to generate confirmation token:', tokenError);
        // Continue without token - email will be sent without confirmation button
      }
    }

    const emailData: EmailData = {
      ...userData,
      brokerName: broker.brokerName,
      brokerUrl: broker.brokerUrl,
      recipientCompany: broker.brokerName,
      token // Add token to email data
    };

    const result = await sendEmail({
      to: broker.email,
      template,
      data: emailData,
      userId,
      deletionRequestId: broker.deletionRequestId,
      category: 'deletion_request'
    });

    results.push({
      ...result,
      brokerName: broker.brokerName,
      email: broker.email
    });

    // Small delay between emails to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Verify Mailganer webhook signature for security
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  timestamp: string
): boolean {
  if (!process.env.MAILGANER_WEBHOOK_VERIFY_KEY) {
    console.warn('MAILGANER_WEBHOOK_VERIFY_KEY not set, skipping webhook signature verification');
    return true; // Allow in development
  }

  try {
    const key = process.env.MAILGANER_WEBHOOK_VERIFY_KEY;
    const expectedSignature = crypto
      .createHmac('sha256', key)
      .update(timestamp + payload)
      .digest('base64');

    return signature === expectedSignature;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

/**
 * Process Mailganer webhook events
 */
export interface WebhookEvent {
  email: string;
  timestamp: number;
  event: 'delivered' | 'bounce' | 'dropped' | 'open' | 'click' | 'processed' | 'deferred' | 'spam_report';
  message_id: string;
  x_track_id?: string;
  userId?: string;
  deletionRequestId?: string;
  notificationId?: string;
  category?: string;
  reason?: string;
  status?: string;
  response?: string;
}

export async function processWebhookEvents(events: WebhookEvent[]): Promise<void> {
  for (const event of events) {
    try {
      const { 
        email, 
        event: eventType, 
        message_id: messageId,
        x_track_id: trackingId,
        userId, 
        deletionRequestId, 
        notificationId,
        timestamp,
        reason
      } = event;

      // Extract metadata from tracking ID if available
      let extractedDeletionRequestId = deletionRequestId;
      if (trackingId && !userId && !deletionRequestId) {
        const trackingParts = trackingId.split('-');
        if (trackingParts.length >= 3) {
          // trackingId format: rescrub-timestamp-deletionRequestId
          const extracted = trackingParts.slice(2).join('-');
          if (extracted !== 'standalone') {
            extractedDeletionRequestId = extracted;
          }
        }
      }

      console.log(`Processing webhook event: ${eventType} for ${email}, messageId: ${messageId}`);

      // Update notification status if available
      if (notificationId) {
        await storage.updateNotification(notificationId, {
          data: {
            messageId,
            status: eventType,
            lastEvent: eventType,
            lastEventAt: new Date(timestamp * 1000),
            reason
          }
        });
      }

      // Update deletion request status based on event
      if (extractedDeletionRequestId) {
        let status = 'sent';
        let responseReceived = false;
        
        switch (eventType) {
          case 'delivered':
            status = 'processing';
            break;
          case 'bounce':
          case 'dropped':
            status = 'failed';
            break;
          case 'open':
            status = 'processing';
            responseReceived = true;
            break;
        }

        await storage.updateDeletionRequest(extractedDeletionRequestId, {
          status,
          responseReceived,
          responseDetails: {
            lastEvent: eventType,
            lastEventAt: new Date(timestamp * 1000),
            messageId,
            reason
          }
        });
      }

    } catch (error) {
      console.error('Error processing webhook event:', error, { event });
    }
  }
}

/**
 * Создание шаблона уведомления за 3 дня до окончания подписки
 */
export function createSubscriptionExpiryTemplate3Days(): EmailTemplate {
  return {
    subject: 'ResCrub: Ваша подписка заканчивается через 3 дня',
    text: `Здравствуйте, {{recipientName}}!

Напоминаем, что ваша подписка "{{planName}}" заканчивается через {{daysRemaining}} дня.

📅 Дата окончания: {{expiryDate}}
💰 Стоимость продления: {{planPrice}}

Чтобы не прерывать защиту ваших персональных данных, продлите подписку прямо сейчас:
{{renewalUrl}}

С уважением,
Команда ResCrub`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #fff; padding: 30px 20px; border: 1px solid #e5e7eb; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .cta-button { display: inline-block; background: #3b82f6; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .footer { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px; color: #6b7280; }
    .plan-info { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">⏰ Подписка скоро закончится</h1>
    </div>
    
    <div class="content">
      <p>Здравствуйте, <strong>{{recipientName}}</strong>!</p>
      
      <div class="warning">
        <strong>⚠️ Внимание:</strong> Ваша подписка <strong>"{{planName}}"</strong> заканчивается через <strong>{{daysRemaining}} дня</strong>.
      </div>
      
      <div class="plan-info">
        📅 <strong>Дата окончания:</strong> {{expiryDate}}<br>
        💰 <strong>Стоимость продления:</strong> {{planPrice}}
      </div>
      
      <p>Чтобы не прерывать защиту ваших персональных данных и продолжить пользоваться всеми возможностями ResCrub, продлите подписку прямо сейчас:</p>
      
      <div style="text-align: center;">
        <a href="{{renewalUrl}}" class="cta-button">🔄 Продлить подписку</a>
      </div>
      
      <p><small>💡 <strong>Почему важно продлить:</strong><br>
      • Непрерывная защита ваших данных<br>
      • Сохранение всех настроек и истории<br>
      • Автоматическое продление на следующий период</small></p>
    </div>
    
    <div class="footer">
      С уважением,<br>
      <strong>Команда ResCrub</strong><br>
      <small>Защита персональных данных по 152-ФЗ</small>
    </div>
  </div>
</body>
</html>`
  };
}

/**
 * Создание шаблона уведомления за 1 день до окончания подписки
 */
export function createSubscriptionExpiryTemplate1Day(): EmailTemplate {
  return {
    subject: 'ResCrub: СРОЧНО - Подписка заканчивается завтра!',
    text: `Здравствуйте, {{recipientName}}!

🚨 СРОЧНО: Ваша подписка "{{planName}}" заканчивается ЗАВТРА!

📅 Дата окончания: {{expiryDate}}
💰 Стоимость продления: {{planPrice}}

Не теряйте защиту ваших данных! Продлите подписку прямо сейчас:
{{renewalUrl}}

⚠️ После окончания подписки ваши данные останутся незащищенными.

С уважением,
Команда ResCrub`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #fff; padding: 30px 20px; border: 1px solid #e5e7eb; }
    .urgent { background: #fef2f2; border: 2px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
    .cta-button { display: inline-block; background: #dc2626; color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3); }
    .footer { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px; color: #6b7280; }
    .plan-info { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .blink { animation: blink 1s infinite; }
    @keyframes blink { 50% { opacity: 0.5; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;" class="blink">🚨 СРОЧНО!</h1>
      <h2 style="margin: 10px 0 0 0;">Подписка заканчивается завтра</h2>
    </div>
    
    <div class="content">
      <p>Здравствуйте, <strong>{{recipientName}}</strong>!</p>
      
      <div class="urgent">
        <h3 style="margin-top: 0; color: #dc2626;">⏰ Осталось менее 24 часов!</h3>
        <p>Ваша подписка <strong>"{{planName}}"</strong> заканчивается <strong>ЗАВТРА</strong>!</p>
      </div>
      
      <div class="plan-info">
        📅 <strong>Дата окончания:</strong> {{expiryDate}}<br>
        💰 <strong>Стоимость продления:</strong> {{planPrice}}
      </div>
      
      <p><strong>Не теряйте защиту ваших данных!</strong> Продлите подписку прямо сейчас, чтобы избежать прерывания сервиса:</p>
      
      <div style="text-align: center;">
        <a href="{{renewalUrl}}" class="cta-button">🔄 ПРОДЛИТЬ СЕЙЧАС</a>
      </div>
      
      <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 15px; margin: 20px 0;">
        <strong>⚠️ Что произойдет после окончания подписки:</strong><br>
        • Прекращение мониторинга ваших данных<br>
        • Отсутствие новых запросов на удаление<br>
        • Потеря доступа к расширенным функциям<br>
        • Ваши данные останутся незащищенными
      </div>
    </div>
    
    <div class="footer">
      С уважением,<br>
      <strong>Команда ResCrub</strong><br>
      <small>Защита персональных данных по 152-ФЗ</small>
    </div>
  </div>
</body>
</html>`
  };
}

/**
 * Создание шаблона уведомления об истекшей подписке
 */
export function createSubscriptionExpiredTemplate(): EmailTemplate {
  return {
    subject: 'ResCrub: Ваша подписка истекла - восстановите защиту данных',
    text: `Здравствуйте, {{recipientName}}!

Ваша подписка "{{planName}}" истекла {{expiryDate}}.

❌ Защита ваших персональных данных приостановлена
💰 Стоимость восстановления: {{planPrice}}

Восстановите подписку, чтобы продолжить защиту:
{{renewalUrl}}

Ваши данные могут быть скомпрометированы без активной защиты.

С уважением,
Команда ResCrub`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6b7280, #374151); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #fff; padding: 30px 20px; border: 1px solid #e5e7eb; }
    .expired { background: #fef2f2; border: 2px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
    .cta-button { display: inline-block; background: #3b82f6; color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; }
    .footer { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px; color: #6b7280; }
    .plan-info { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">❌ Подписка истекла</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Восстановите защиту данных</p>
    </div>
    
    <div class="content">
      <p>Здравствуйте, <strong>{{recipientName}}</strong>!</p>
      
      <div class="expired">
        <h3 style="margin-top: 0; color: #dc2626;">🔴 Подписка истекла</h3>
        <p>Ваша подписка <strong>"{{planName}}"</strong> истекла <strong>{{expiryDate}}</strong></p>
      </div>
      
      <div class="plan-info">
        📅 <strong>Дата истечения:</strong> {{expiryDate}}<br>
        💰 <strong>Стоимость восстановления:</strong> {{planPrice}}
      </div>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
        <strong>⚠️ Текущий статус:</strong><br>
        • Мониторинг персональных данных остановлен<br>
        • Новые запросы на удаление не отправляются<br>
        • Ваши данные остаются незащищенными
      </div>
      
      <p>Восстановите подписку прямо сейчас, чтобы продолжить защиту ваших персональных данных:</p>
      
      <div style="text-align: center;">
        <a href="{{renewalUrl}}" class="cta-button">🔄 Восстановить подписку</a>
      </div>
      
      <p><small>💡 <strong>При восстановлении вы получите:</strong><br>
      • Немедленное возобновление защиты<br>
      • Сохранение всех ваших настроек<br>
      • Полную историю ваших запросов<br>
      • Автоматическое продление в будущем</small></p>
    </div>
    
    <div class="footer">
      Нужна помощь? Напишите нам на support@rescrub.ru<br><br>
      С уважением,<br>
      <strong>Команда ResCrub</strong><br>
      <small>Защита персональных данных по 152-ФЗ</small>
    </div>
  </div>
</body>
</html>`
  };
}

/**
 * Отправка уведомления о скором окончании подписки
 */
export async function sendSubscriptionExpiryNotification(params: {
  userEmail: string;
  userName: string;
  planName: string;
  planPrice: string;
  expiryDate: string;
  daysRemaining: number;
  userId: string;
  subscriptionId: string;
}): Promise<SendEmailResult> {
  const { userEmail, userName, planName, planPrice, expiryDate, daysRemaining, userId, subscriptionId } = params;
  
  let template: EmailTemplate;
  let category: string;
  
  if (daysRemaining <= 0) {
    template = createSubscriptionExpiredTemplate();
    category = 'subscription_expired';
  } else if (daysRemaining === 1) {
    template = createSubscriptionExpiryTemplate1Day();
    category = 'subscription_expiry_1day';
  } else {
    template = createSubscriptionExpiryTemplate3Days();
    category = 'subscription_expiry_3days';
  }
  
  const renewalUrl = `https://rescrub.ru/app/subscription?renew=${subscriptionId}`;
  
  return await sendEmail({
    to: userEmail,
    template,
    data: {
      recipientName: userName,
      senderName: 'ResCrub',
      senderEmail: 'noreply@rescrub.ru',
      planName,
      planPrice,
      expiryDate,
      renewalUrl,
      daysRemaining
    },
    userId,
    category
  });
}

export default {
  sendEmail,
  sendBulkDeletionRequests,
  renderTemplate,
  verifyWebhookSignature,
  processWebhookEvents,
  sendSubscriptionExpiryNotification,
  createSubscriptionExpiryTemplate3Days,
  createSubscriptionExpiryTemplate1Day,
  createSubscriptionExpiredTemplate,
  createEmailVerificationTemplate
};

/**
 * Создание шаблона для верификации email при регистрации
 */
export function createEmailVerificationTemplate(): EmailTemplate {
  return {
    subject: 'ResCrub: Подтвердите ваш email',
    text: `Здравствуйте!

Добро пожаловать в ResCrub - сервис защиты персональных данных по 152-ФЗ!

Для завершения регистрации подтвердите ваш email адрес, перейдя по ссылке:
{{verificationUrl}}

Ссылка действительна в течение 24 часов.

Что вас ждет после подтверждения:
• Анализ присутствия ваших данных в интернете
• Автоматические запросы на удаление персональных данных
• Мониторинг новых утечек и брокеров данных
• Полное соответствие российскому законодательству

Если вы не регистрировались на ResCrub, просто проигнорируйте это письмо.

Дополнительная информация:
• Наш сайт: https://rescrub.ru
• Техподдержка: support@rescrub.ru
• Документация: https://rescrub.ru/docs
• Блог: https://rescrub.ru/blog

С уважением,
Команда ResCrub
Защита персональных данных по 152-ФЗ`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #fff; padding: 30px 20px; border: 1px solid #e5e7eb; }
    .welcome { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .cta-button { display: inline-block; background: #3b82f6; color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; }
    .footer { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px; color: #6b7280; }
    .security-info { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🛡️ Добро пожаловать в ResCrub!</h1>
    </div>
    
    <div class="content">
      <p>Здравствуйте!</p>
      
      <div class="welcome">
        <p><strong>Добро пожаловать в ResCrub</strong> - российский сервис защиты персональных данных в соответствии с 152-ФЗ!</p>
      </div>
      
      <p>Для завершения регистрации и начала защиты ваших данных подтвердите ваш email адрес:</p>
      
      <div style="text-align: center;">
        <a href="{{verificationUrl}}" class="cta-button">✅ Подтвердить Email</a>
      </div>
      
      <div class="security-info">
        <p><strong>🔒 Безопасность:</strong></p>
        <p>• Ссылка действительна в течение 24 часов<br>
        • Если вы не регистрировались на ResCrub, просто проигнорируйте это письмо<br>
        • Мы никогда не запрашиваем пароли по email</p>
      </div>
      
      <p><strong>Что вас ждет после подтверждения:</strong></p>
      <ul>
        <li>🔍 Анализ присутствия ваших данных в интернете</li>
        <li>📧 Автоматические запросы на удаление персональных данных</li>
        <li>📊 Мониторинг новых утечек и брокеров данных</li>
        <li>⚖️ Полное соответствие российскому законодательству</li>
      </ul>
    </div>
    
    <div class="footer">
      <p style="margin-bottom: 15px;">
        <strong>🔗 Полезные ссылки:</strong><br>
        <a href="https://rescrub.ru" style="color: #3b82f6; text-decoration: none;">🌐 Главная страница</a> | 
        <a href="https://rescrub.ru/blog" style="color: #3b82f6; text-decoration: none;">📖 Блог</a> | 
        <a href="https://rescrub.ru/docs" style="color: #3b82f6; text-decoration: none;">📚 Документация</a><br>
        <a href="https://rescrub.ru/whitepaper" style="color: #3b82f6; text-decoration: none;">📄 Белая книга</a> | 
        <a href="https://rescrub.ru/status" style="color: #3b82f6; text-decoration: none;">📊 Статус системы</a>
      </p>
      
      <p style="margin-bottom: 10px;">
        📞 <strong>Техподдержка:</strong> <a href="mailto:support@rescrub.ru" style="color: #3b82f6;">support@rescrub.ru</a>
      </p>
      
      С уважением,<br>
      <strong>Команда ResCrub</strong><br>
      <small>Защита персональных данных по 152-ФЗ</small><br><br>
      
      <small style="color: #9ca3af;">
        Если ссылка не работает, скопируйте её в адресную строку браузера<br>
        <a href="https://rescrub.ru/terms" style="color: #9ca3af;">Условия использования</a> | 
        <a href="https://rescrub.ru/privacy" style="color: #9ca3af;">Политика конфиденциальности</a>
      </small>
    </div>
  </div>
</body>
</html>`
  };
}
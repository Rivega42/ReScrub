import sgMail from '@sendgrid/mail';
import { storage } from './storage';
import crypto from 'crypto';

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
 * Render email template with provided data
 */
export function renderTemplate(template: EmailTemplate, data: EmailData): EmailTemplate {
  const placeholders = {
    '{{recipientName}}': data.recipientName || 'Уважаемые коллеги',
    '{{recipientCompany}}': data.recipientCompany || '',
    '{{senderName}}': data.senderName,
    '{{senderEmail}}': data.senderEmail,
    '{{senderPhone}}': data.senderPhone || '',
    '{{personalDataList}}': data.personalData?.join(', ') || '',
    '{{brokerName}}': data.brokerName || '',
    '{{brokerUrl}}': data.brokerUrl || '',
    '{{requestDate}}': data.requestDate || new Date().toLocaleDateString('ru-RU'),
    '{{legalBasis}}': data.legalBasis || 'ст. 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"'
  };

  const rendered: EmailTemplate = {
    subject: template.subject,
    text: template.text,
    html: template.html
  };

  // Replace placeholders in all template fields
  Object.entries(placeholders).forEach(([placeholder, value]) => {
    rendered.subject = rendered.subject.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    rendered.text = rendered.text.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    rendered.html = rendered.html.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  });

  return rendered;
}

/**
 * Send email via SendGrid with notification tracking
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const { to, template, data, userId, deletionRequestId, category = 'deletion_request' } = params;

  try {
    // Render template with data
    const renderedTemplate = renderTemplate(template, data);

    // Create notification record before sending
    let notificationId: string | undefined;
    if (userId) {
      const notification = await storage.createNotification({
        userId,
        type: 'email',
        category,
        title: renderedTemplate.subject,
        message: `Отправка требования об удалении ПД: ${to}`,
        data: {
          to,
          deletionRequestId,
          templateType: category,
          brokerName: data.brokerName,
          sendAttempt: 1
        },
        sent: false
      });
      notificationId = notification.id;
    }

    // Send email via SendGrid
    const msg = {
      to,
      from: {
        email: data.senderEmail,
        name: data.senderName
      },
      subject: renderedTemplate.subject,
      text: renderedTemplate.text,
      html: renderedTemplate.html,
      // Custom args for webhook tracking
      customArgs: {
        userId: userId || '',
        deletionRequestId: deletionRequestId || '',
        notificationId: notificationId || '',
        category
      },
      // Enable tracking
      trackingSettings: {
        clickTracking: {
          enable: true
        },
        openTracking: {
          enable: true
        }
      }
    };

    const [response] = await sgMail.send(msg);
    const messageId = response.headers['x-message-id'] as string;

    // Update notification with success
    if (notificationId) {
      await storage.updateNotification(notificationId, {
        sent: true,
        sentAt: new Date(),
        data: {
          ...msg.customArgs,
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
      await storage.updateDeletionRequest(deletionRequestId, {
        status: 'sent',
        sentAt: new Date(),
        requestMethod: 'email',
        requestDetails: {
          emailTo: to,
          messageId,
          subject: renderedTemplate.subject
        }
      });
    }

    console.log(`Email sent successfully to ${to}, messageId: ${messageId}`);

    return {
      success: true,
      messageId,
      notificationId
    };

  } catch (error: any) {
    console.error('SendGrid email error:', {
      error: error.message,
      to,
      userId,
      deletionRequestId
    });

    // Update notification with error
    if (params.userId) {
      try {
        let notification;
        if (!params.userId) {
          // Create error notification if we couldn't create one before
          notification = await storage.createNotification({
            userId: params.userId,
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
        } else {
          // Update existing notification with error
          await storage.updateNotification(params.userId, {
            data: {
              to,
              deletionRequestId,
              error: error.message,
              status: 'failed',
              sendAttempt: 1,
              brokerName: data.brokerName
            }
          });
        }
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
    const emailData: EmailData = {
      ...userData,
      brokerName: broker.brokerName,
      brokerUrl: broker.brokerUrl,
      recipientCompany: broker.brokerName
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
 * Verify SendGrid webhook signature for security
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  timestamp: string
): boolean {
  if (!process.env.SENDGRID_WEBHOOK_VERIFY_KEY) {
    console.warn('SENDGRID_WEBHOOK_VERIFY_KEY not set, skipping webhook signature verification');
    return true; // Allow in development
  }

  try {
    const key = process.env.SENDGRID_WEBHOOK_VERIFY_KEY;
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
 * Process SendGrid webhook events
 */
export interface WebhookEvent {
  email: string;
  timestamp: number;
  event: 'delivered' | 'bounce' | 'dropped' | 'open' | 'click' | 'processed' | 'deferred' | 'spam_report';
  'sg_message_id': string;
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
        'sg_message_id': messageId, 
        userId, 
        deletionRequestId, 
        notificationId,
        timestamp,
        reason
      } = event;

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
      if (deletionRequestId) {
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

        await storage.updateDeletionRequest(deletionRequestId, {
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

export default {
  sendEmail,
  sendBulkDeletionRequests,
  renderTemplate,
  verifyWebhookSignature,
  processWebhookEvents
};
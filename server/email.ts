import { storage } from './storage';
import crypto from 'crypto';
import Handlebars from 'handlebars';

// Initialize Mailganer.ru (SamOtpravil) API
if (!process.env.MAILGANER_API_KEY) {
  throw new Error("MAILGANER_API_KEY environment variable must be set");
}

const MAILGANER_API_KEY = process.env.MAILGANER_API_KEY;
const MAILGANER_HOST = process.env.MAILGANER_HOST || 'https://api.samotpravil.com';

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
    legalBasis: data.legalBasis || 'ст. 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"'
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
 * Mailganer.ru API Client
 */
class MailganerClient {
  private apiKey: string;
  private host: string;

  constructor(apiKey: string, host: string = 'https://api.samotpravil.com') {
    this.apiKey = apiKey;
    this.host = host;
  }

  private async makeRequest(method: 'GET' | 'POST', endpoint: string, data?: any): Promise<any> {
    let url = `${this.host}/${endpoint}`;
    let options: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.apiKey  // SamOtpravil v2 API uses just the API key
      }
    };

    // For GET requests, append data as query parameters
    if (method === 'GET' && data && Object.keys(data).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      url = `${url}?${queryParams.toString()}`;
    } else if (method === 'POST' && data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Mailganer API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.status !== 'OK' && result.status !== 'ok') {
      throw new Error(result.message || 'Mailganer API request failed');
    }

    return result;
  }

  async sendEmail(params: {
    emailTo: string;
    subject: string;
    messageText: string;
    emailFrom: string;
    nameFrom?: string;
    xTrackId?: string;
    trackOpen?: boolean;
    trackClick?: boolean;
    params?: Record<string, any>;
  }): Promise<any> {
    const data: any = {
      email_to: params.emailTo,
      subject: params.subject,
      message_text: params.messageText,
      email_from: params.nameFrom ? `${params.nameFrom} <${params.emailFrom}>` : params.emailFrom
    };

    // Add optional parameters
    if (params.xTrackId) data.x_track_id = params.xTrackId;
    if (params.trackOpen !== undefined) data.track_open = params.trackOpen;
    if (params.trackClick !== undefined) data.track_click = params.trackClick;
    if (params.params) data.params = params.params;

    return this.makeRequest('POST', 'api/v2/mail/send', data);
  }

  async getStatus(params: { email?: string; issueId?: string; xTrackId?: string }): Promise<any> {
    const data: any = {};
    if (params.email) data.email = params.email;
    if (params.issueId) data.issue_id = params.issueId;
    if (params.xTrackId) data.x_track_id = params.xTrackId;

    return this.makeRequest('GET', 'api/v2/issue/status', data);
  }
}

const mailganerClient = new MailganerClient(MAILGANER_API_KEY, MAILGANER_HOST);

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

    // Generate unique tracking ID for Mailganer
    const timestamp = Math.floor(Date.now() / 1000);
    const trackingId = `rescrub-${timestamp}-${deletionRequestId || 'standalone'}`;

    // Send email via Mailganer.ru
    const response = await mailganerClient.sendEmail({
      emailTo: to,
      emailFrom: data.senderEmail,
      nameFrom: data.senderName,
      subject: renderedTemplate.subject,
      messageText: renderedTemplate.html, // Mailganer accepts HTML in message_text
      xTrackId: trackingId,
      trackOpen: true,
      trackClick: true,
      params: {
        userId: userId || '',
        deletionRequestId: deletionRequestId || '',
        notificationId: notificationId || '',
        category,
        brokerName: data.brokerName
      }
    });

    const messageId = response.issue_id || trackingId;

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

export default {
  sendEmail,
  sendBulkDeletionRequests,
  renderTemplate,
  verifyWebhookSignature,
  processWebhookEvents
};
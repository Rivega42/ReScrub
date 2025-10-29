# 📧 ПОЛНАЯ ИНСТРУКЦИЯ: ИНТЕГРАЦИЯ EMAIL-РАССЫЛКИ ЧЕРЕЗ MAILGANER.RU

## 📋 Оглавление
1. [Критические проблемы и ошибки](#критические-проблемы-и-ошибки)
2. [Пошаговая настройка](#пошаговая-настройка)
3. [Техническая реализация](#техническая-реализация)
4. [Email шаблоны](#email-шаблоны)
5. [Webhook для отслеживания доставки](#webhook-для-отслеживания-доставки)
6. [Тестирование](#тестирование)
7. [Production деплой](#production-деплой)
8. [Troubleshooting](#troubleshooting)

---

## 🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ И ОШИБКИ

### ❌ Проблема #1: SPF/DMARC - САМАЯ КРИТИЧНАЯ ПРОБЛЕМА!

**Почему критично:**
- Если использовать произвольный `From:` email, письма будут отклонены SPF/DMARC проверками
- Mailganer проверяет, что домен в `From:` совпадает с зарегистрированным доменом
- Письма будут уходить в SPAM или вообще не доставляться

**Что делали неправильно:**
```typescript
// ❌ НЕПРАВИЛЬНО - использовать email пользователя в From
const mailOptions = {
  from: `${data.senderName} <${data.senderEmail}>`, // ❌ НЕТ!
  to: recipient,
  subject: subject
};
```

**Правильно:**
```typescript
// ✅ ПРАВИЛЬНО - использовать DEFAULT_SENDER в From, а email пользователя в Reply-To
const DEFAULT_SENDER = 'ResCrub <noreply@mailone.rescrub.ru>';

const mailOptions = {
  from: DEFAULT_SENDER,                    // ✅ Всегда фиксированный домен!
  replyTo: data.senderEmail,               // ✅ Пользователь получит ответ
  to: recipient,
  subject: subject
};
```

**Как это работает:**
1. **From:** — технический отправитель (проверяется SPF/DMARC) → `noreply@mailone.rescrub.ru`
2. **Reply-To:** — куда придет ответ (email пользователя) → `user@example.com`
3. Получатель видит `ResCrub`, но ответ придет пользователю

---

### ❌ Проблема #2: Настройки SMTP соединения

**Mailganer требует специфичные настройки:**

```typescript
// ❌ НЕПРАВИЛЬНО
const transporter = nodemailer.createTransport({
  host: MAILGANER_SMTP_HOST,
  port: 1126,
  secure: true,  // ❌ НЕТ! Mailganer не использует прямой SSL
  auth: { user: login, pass: password }
});

// ✅ ПРАВИЛЬНО
const transporter = nodemailer.createTransport({
  host: MAILGANER_SMTP_HOST,
  port: 1126,
  secure: false,           // ✅ Не использовать SSL напрямую
  requireTLS: true,        // ✅ Требовать STARTTLS
  auth: {
    user: MAILGANER_SMTP_LOGIN,
    pass: MAILGANER_SMTP_PASSWORD
  },
  // Увеличенные таймауты для стабильности
  connectionTimeout: 30000,  // 30 секунд
  greetingTimeout: 30000,
  socketTimeout: 30000
});
```

**Почему это важно:**
- **secure: true** → Попытка прямого SSL/TLS (порт 465) → Mailganer не поддерживает
- **secure: false + requireTLS: true** → STARTTLS (порт 1126) → Правильный метод
- **Таймауты 30 секунд** → Российские SMTP медленнее, нужны большие таймауты

---

### ❌ Проблема #3: Специфичные ошибки Mailganer

**Mailganer возвращает специфичные коды ошибок, которые нужно обрабатывать:**

| Ошибка | Что означает | Решение |
|--------|-------------|---------|
| `550 bounced check filter` | Email в стоп-листе | Удалить из стоп-листа в ЛК Mailganer |
| `501 from domain not trusted` | Домен не добавлен | Добавить домен в настройках Mailganer |
| `450 ratelimit exceeded` | Превышен лимит отправки | Подождать или увеличить лимит |
| `421 SMTP command timeout` | SMTP тайм-аут | Увеличить connectionTimeout |

**Обработка ошибок:**
```typescript
try {
  await transporter.sendMail(mailOptions);
} catch (error: any) {
  // Обработка специфичных ошибок Mailganer
  if (error.message.includes('550 bounced check filter')) {
    throw new Error(`Email ${to} находится в стоп-листе Mailganer`);
  } else if (error.message.includes('501 from domain not trusted')) {
    throw new Error(`Домен не добавлен в список разрешенных доменов Mailganer`);
  } else if (error.message.includes('450 ratelimit exceeded')) {
    throw new Error('Превышен лимит отправки писем. Попробуйте позже.');
  } else if (error.message.includes('421 SMTP command timeout')) {
    throw new Error('Тайм-аут SMTP соединения с Mailganer');
  }
  throw error;
}
```

---

### ❌ Проблема #4: Домен отправки должен быть настроен в Mailganer

**Критично:** Домен в `From:` должен быть **добавлен и верифицирован** в личном кабинете Mailganer!

**Процесс:**
1. Зарегистрировать домен (например: `mailone.rescrub.ru`)
2. Добавить DNS записи (SPF, DKIM, DMARC)
3. Дождаться верификации
4. Использовать ТОЛЬКО этот домен в `From:`

**Проверка DNS записей:**
```bash
# SPF запись
dig TXT mailone.rescrub.ru +short
# Должно быть: "v=spf1 include:_spf.samotpravil.com ~all"

# DKIM запись
dig TXT mail._domainkey.mailone.rescrub.ru +short
# Должна вернуть публичный ключ от Mailganer

# DMARC запись
dig TXT _dmarc.mailone.rescrub.ru +short
# Должно быть: "v=DMARC1; p=none; rua=mailto:dmarc@mailone.rescrub.ru"
```

---

### ❌ Проблема #5: Кодировка и русский текст

**Mailganer корректно работает с UTF-8, но нужно явно указывать:**

```typescript
// ✅ ПРАВИЛЬНО
const mailOptions = {
  from: DEFAULT_SENDER,
  to: recipient,
  subject: 'Тема письма на русском', // Nodemailer автоматически кодирует
  text: 'Текст письма на русском',
  html: '<p>HTML письмо на русском</p>',
  headers: {
    'Content-Type': 'text/html; charset=UTF-8' // Явно указываем UTF-8
  }
};
```

**Важно:**
- Nodemailer автоматически кодирует заголовки в MIME
- Убедитесь, что файлы с шаблонами сохранены в UTF-8
- Handlebars шаблоны поддерживают русский текст из коробки

---

### ❌ Проблема #6: Лимиты отправки

**Mailganer имеет лимиты на количество писем:**

| Тариф | Лимит в день | Лимит в час |
|-------|-------------|-------------|
| Бесплатный | 100 писем | 10 писем |
| Базовый | 1,000 писем | 100 писем |
| Профессиональный | 10,000 писем | 500 писем |
| Корпоративный | 100,000 писем | 2,000 писем |

**Обработка лимитов:**
```typescript
// Отслеживание количества отправленных писем
let emailsSentToday = 0;
const DAILY_LIMIT = 1000; // Ваш лимит

async function sendEmailWithRateLimit(params) {
  if (emailsSentToday >= DAILY_LIMIT) {
    throw new Error('Достигнут дневной лимит отправки писем');
  }
  
  await sendEmail(params);
  emailsSentToday++;
}

// Сброс счетчика в полночь
setInterval(() => {
  emailsSentToday = 0;
}, 24 * 60 * 60 * 1000);
```

---

## 📝 ПОШАГОВАЯ НАСТРОЙКА

### Шаг 1: Регистрация в Mailganer.ru

1. **Регистрация:** https://mailganer.ru или https://samotpravil.com
2. **Заполнить данные:**
   - Название проекта: `ResCrub`
   - Email: ваш email
   - Телефон: ваш телефон

3. **Подтвердить email и телефон**

---

### Шаг 2: Настройка домена отправки

**Важно:** Делать это **ДО** начала отправки писем!

1. **Добавить домен в ЛК Mailganer:**
   - Настройки → Домены → Добавить домен
   - Ввести: `mailone.rescrub.ru` (или ваш поддомен)

2. **Настроить DNS записи:**

Mailganer предоставит DNS записи, которые нужно добавить:

```
# SPF запись (TXT)
Тип: TXT
Имя: mailone.rescrub.ru
Значение: v=spf1 include:_spf.samotpravil.com ~all
TTL: 3600

# DKIM запись (TXT)
Тип: TXT
Имя: mail._domainkey.mailone.rescrub.ru
Значение: <публичный ключ от Mailganer>
TTL: 3600

# DMARC запись (TXT)
Тип: TXT
Имя: _dmarc.mailone.rescrub.ru
Значение: v=DMARC1; p=none; rua=mailto:dmarc@mailone.rescrub.ru
TTL: 3600
```

3. **Дождаться верификации** (обычно 1-24 часа)

4. **Проверить статус:**
   - В ЛК Mailganer статус домена должен стать "Подтвержден"

---

### Шаг 3: Получение SMTP доступов

1. **Войти в ЛК Mailganer**
2. **Настройки → SMTP**
3. **Создать SMTP доступы:**
   - Нажать "Создать доступ"
   - Скопировать:
     - **SMTP Host:** `api.samotpravil.ru`
     - **SMTP Port:** `1126`
     - **SMTP Login:** ваш логин
     - **SMTP Password:** сгенерированный пароль

---

### Шаг 4: Настройка environment variables

**В Replit Secrets добавить:**

```bash
# Mailganer SMTP настройки
MAILGANER_SMTP_HOST=api.samotpravil.ru      # ⚠️ ОБЯЗАТЕЛЬНО
MAILGANER_SMTP_PORT=1126                    # ⚠️ ОБЯЗАТЕЛЬНО
MAILGANER_SMTP_LOGIN=your-login             # ⚠️ ОБЯЗАТЕЛЬНО
MAILGANER_SMTP_PASSWORD=your-password       # ⚠️ ОБЯЗАТЕЛЬНО

# Webhook (опционально)
MAILGANER_WEBHOOK_VERIFY_KEY=random-key     # Для проверки подписи webhook
```

**Проверка конфигурации:**
```bash
# При запуске сервера должно появиться:
🔧 Проверка SMTP соединения с Mailganer...
✅ SMTP соединение с Mailganer успешно установлено
📧 Домен отправки: mailone.rescrub.ru
🏢 SMTP сервер: api.samotpravil.ru:1126
```

---

### Шаг 5: Проверка интеграции

**Проверка #1: SMTP соединение**
```typescript
// В server/email.ts автоматически выполняется при старте:
const isConnected = await mailganerClient.verifyConnection();
if (isConnected) {
  console.log('✅ SMTP соединение успешно');
}
```

**Проверка #2: Отправка тестового письма**
```typescript
// Создать тестовый endpoint
app.post('/api/test/email', async (req, res) => {
  const result = await sendEmail({
    to: 'test@example.com',
    template: createEmailVerificationTemplate(),
    data: {
      senderName: 'Test',
      senderEmail: 'test@example.com',
      verificationUrl: 'https://rescrub.ru/verify'
    }
  });
  
  res.json(result);
});
```

**Проверка #3: Логи доставки**
```bash
# В ЛК Mailganer → Статистика → Логи отправки
# Должны появиться отправленные письма со статусом "Доставлено"
```

---

## 💻 ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ

### Структура файлов

```
server/
├── email.ts              # MailganerSMTPClient класс + шаблоны
├── routes.ts             # Webhook endpoints
└── storage.ts            # База данных (notifications)

.env
├── MAILGANER_SMTP_HOST
├── MAILGANER_SMTP_PORT
├── MAILGANER_SMTP_LOGIN
├── MAILGANER_SMTP_PASSWORD
└── MAILGANER_WEBHOOK_VERIFY_KEY
```

---

### MailganerSMTPClient класс

**1. Инициализация:**
```typescript
import nodemailer from 'nodemailer';

const MAILGANER_SMTP_HOST = process.env.MAILGANER_SMTP_HOST;
const MAILGANER_SMTP_PORT = parseInt(process.env.MAILGANER_SMTP_PORT || '1126');
const MAILGANER_SMTP_LOGIN = process.env.MAILGANER_SMTP_LOGIN;
const MAILGANER_SMTP_PASSWORD = process.env.MAILGANER_SMTP_PASSWORD;

const DEFAULT_SENDER = 'ResCrub <noreply@mailone.rescrub.ru>';

const createMailganerTransport = () => {
  return nodemailer.createTransport({
    host: MAILGANER_SMTP_HOST,
    port: MAILGANER_SMTP_PORT,
    secure: false,           // Не использовать SSL
    requireTLS: true,        // Требовать STARTTLS
    auth: {
      user: MAILGANER_SMTP_LOGIN,
      pass: MAILGANER_SMTP_PASSWORD
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
  });
};
```

**2. Отправка письма:**
```typescript
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
    replyTo?: string;
    xTrackId?: string;
  }): Promise<{ messageId: string; accepted: string[] }> {
    const mailOptions = {
      from: DEFAULT_SENDER,              // ✅ Всегда фиксированный
      to: params.emailTo,
      replyTo: params.replyTo,           // ✅ Email пользователя
      subject: params.subject,
      text: params.messageText,
      html: params.messageHtml || params.messageText,
      headers: {
        'X-Track-ID': params.xTrackId || `rescrub-${Date.now()}`,
        'X-Mailer': 'ResCrub-v1.0'
      }
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        messageId: result.messageId,
        accepted: result.accepted as string[]
      };
    } catch (error: any) {
      // Обработка специфичных ошибок Mailganer
      if (error.message.includes('550 bounced check filter')) {
        throw new Error(`Email ${params.emailTo} в стоп-листе`);
      }
      // ... остальные ошибки
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection failed:', error);
      return false;
    }
  }
}

export const mailganerClient = new MailganerSMTPClient();
```

---

### Отправка письма с трекингом

**Полный процесс:**
```typescript
export async function sendEmail(params: {
  to: string;
  template: EmailTemplate;
  data: EmailData;
  userId?: string;
  category?: string;
}): Promise<{ success: boolean; messageId?: string }> {
  // 1. Рендеринг шаблона с данными
  const renderedTemplate = renderTemplate(params.template, params.data);

  // 2. Создание уведомления в БД (для трекинга)
  let notificationId: string | undefined;
  if (params.userId) {
    const notification = await storage.createNotification({
      userId: params.userId,
      type: 'email',
      category: params.category || 'general',
      title: renderedTemplate.subject,
      message: `Отправка письма: ${params.to}`,
      sent: false
    });
    notificationId = notification.id;
  }

  // 3. Генерация tracking ID
  const trackingId = crypto.randomUUID();

  // 4. Отправка через Mailganer
  try {
    const response = await mailganerClient.sendEmail({
      emailTo: params.to,
      replyTo: params.data.senderEmail,
      subject: renderedTemplate.subject,
      messageText: renderedTemplate.text,
      messageHtml: renderedTemplate.html,
      xTrackId: trackingId
    });

    // 5. Обновление уведомления (успех)
    if (notificationId) {
      await storage.updateNotification(notificationId, {
        sent: true,
        sentAt: new Date(),
        data: {
          messageId: response.messageId,
          status: 'sent',
          trackingId
        }
      });
    }

    return {
      success: true,
      messageId: response.messageId
    };

  } catch (error: any) {
    // 6. Обновление уведомления (ошибка)
    if (notificationId) {
      await storage.updateNotification(notificationId, {
        sent: false,
        data: {
          error: error.message,
          status: 'failed'
        }
      });
    }

    return {
      success: false,
      error: error.message
    };
  }
}
```

---

## 📨 EMAIL ШАБЛОНЫ

### Использование Handlebars

**Структура шаблона:**
```typescript
export interface EmailTemplate {
  subject: string;  // Тема письма (поддерживает {{переменные}})
  text: string;     // Plain text версия (для клиентов без HTML)
  html: string;     // HTML версия (с полным оформлением)
}

export interface EmailData {
  recipientName?: string;
  senderName: string;
  senderEmail: string;
  verificationUrl?: string;
  planName?: string;
  planPrice?: string;
  // ... другие поля
}
```

**Рендеринг шаблона:**
```typescript
import Handlebars from 'handlebars';

export function renderTemplate(
  template: EmailTemplate, 
  data: EmailData
): EmailTemplate {
  // Подготовка данных с дефолтами
  const templateData = {
    recipientName: data.recipientName || 'Уважаемые коллеги',
    senderName: data.senderName,
    senderEmail: data.senderEmail,
    // ... остальные поля
  };

  // Компиляция и рендеринг
  const subjectTemplate = Handlebars.compile(template.subject);
  const textTemplate = Handlebars.compile(template.text);
  const htmlTemplate = Handlebars.compile(template.html);

  return {
    subject: subjectTemplate(templateData),
    text: textTemplate(templateData),
    html: htmlTemplate(templateData)
  };
}
```

---

### Пример шаблона: Email верификация

```typescript
export function createEmailVerificationTemplate(): EmailTemplate {
  return {
    subject: 'ResCrub: Подтвердите ваш email',
    
    text: `Здравствуйте!

Добро пожаловать в ResCrub - сервис защиты персональных данных по 152-ФЗ!

Для завершения регистрации подтвердите ваш email адрес:
{{verificationUrl}}

Ссылка действительна в течение 24 часов.

С уважением,
Команда ResCrub`,

    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { 
      background: linear-gradient(135deg, #3b82f6, #1e40af); 
      color: white; 
      padding: 30px 20px; 
      border-radius: 8px 8px 0 0; 
      text-align: center; 
    }
    .content { background: #fff; padding: 30px 20px; border: 1px solid #e5e7eb; }
    .cta-button { 
      display: inline-block; 
      background: #3b82f6; 
      color: white !important; 
      padding: 15px 30px; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: bold; 
      margin: 20px 0; 
    }
    .footer { 
      background: #f9fafb; 
      padding: 20px; 
      text-align: center; 
      font-size: 14px; 
      color: #6b7280; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">✉️ Подтверждение email</h1>
    </div>
    
    <div class="content">
      <p>Здравствуйте!</p>
      
      <p>Добро пожаловать в <strong>ResCrub</strong> - сервис защиты персональных данных по 152-ФЗ!</p>
      
      <p>Для завершения регистрации подтвердите ваш email адрес:</p>
      
      <div style="text-align: center;">
        <a href="{{verificationUrl}}" class="cta-button">
          ✅ Подтвердить email
        </a>
      </div>
      
      <p><small>Ссылка действительна в течение 24 часов.</small></p>
      
      <p>Если вы не регистрировались на ResCrub, просто проигнорируйте это письмо.</p>
    </div>
    
    <div class="footer">
      <strong>ResCrub</strong><br>
      Защита персональных данных по 152-ФЗ<br><br>
      
      <small style="color: #9ca3af;">
        Если ссылка не работает, скопируйте её в адресную строку браузера
      </small>
    </div>
  </div>
</body>
</html>`
  };
}
```

**Использование:**
```typescript
const template = createEmailVerificationTemplate();
const result = await sendEmail({
  to: 'user@example.com',
  template,
  data: {
    senderName: 'ResCrub',
    senderEmail: 'support@rescrub.ru',
    verificationUrl: 'https://rescrub.ru/verify?token=abc123'
  },
  userId: 'user-id-123',
  category: 'email_verification'
});
```

---

## 🔔 WEBHOOK ДЛЯ ОТСЛЕЖИВАНИЯ ДОСТАВКИ

### Настройка webhook в Mailganer

**В ЛК Mailganer:**
1. Настройки → Webhook
2. URL: `https://your-app.replit.app/api/webhooks/mailganer`
3. События: `delivered`, `bounced`, `opened`, `clicked`
4. Секретный ключ: сгенерировать и сохранить в `MAILGANER_WEBHOOK_VERIFY_KEY`

---

### Webhook endpoint

```typescript
app.post('/api/webhooks/mailganer', async (req, res) => {
  try {
    // 1. Проверить подпись webhook
    const signature = req.headers['x-mailganer-signature'];
    const isValid = verifyWebhookSignature(req.body, signature);
    
    if (!isValid) {
      console.error('Invalid webhook signature from Mailganer');
      return res.status(401).send('Invalid signature');
    }

    // 2. Обработать события
    const events = req.body.events || [];
    await processWebhookEvents(events);

    // 3. Вернуть OK
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing Mailganer webhook:', error);
    res.status(500).send('Error');
  }
});
```

---

### Обработка событий

```typescript
export interface WebhookEvent {
  event: 'delivered' | 'bounced' | 'opened' | 'clicked';
  messageId: string;
  email: string;
  timestamp: string;
  trackingId?: string;
}

export async function processWebhookEvents(events: WebhookEvent[]): Promise<void> {
  for (const event of events) {
    console.log(`Mailganer event: ${event.event} for ${event.email}`);

    // Найти notification по messageId
    const notification = await storage.getNotificationByMessageId(event.messageId);
    
    if (notification) {
      // Обновить статус
      await storage.updateNotification(notification.id, {
        data: {
          ...notification.data,
          status: event.event,
          lastEvent: event.event,
          lastEventAt: new Date(event.timestamp)
        }
      });

      // Если bounced - создать уведомление об ошибке
      if (event.event === 'bounced') {
        await storage.createNotification({
          userId: notification.userId,
          type: 'system',
          category: 'email_error',
          title: 'Ошибка доставки email',
          message: `Письмо на ${event.email} не доставлено`,
          sent: true
        });
      }
    }
  }
}
```

---

## 🧪 ТЕСТИРОВАНИЕ

### Проверка SMTP соединения

```bash
# При запуске сервера автоматически:
🔧 Проверка SMTP соединения с Mailganer...
✅ SMTP соединение с Mailganer успешно установлено
📧 Домен отправки: mailone.rescrub.ru
🏢 SMTP сервер: api.samotpravil.ru:1126
```

**Если ошибка:**
```bash
❌ Не удалось установить SMTP соединение с Mailganer
# Проверить:
1. MAILGANER_SMTP_* переменные установлены
2. Логин и пароль правильные
3. Firewall не блокирует порт 1126
```

---

### Тестовая отправка

**Создать тестовый endpoint:**
```typescript
app.post('/api/test/send-email', async (req, res) => {
  const { to } = req.body;
  
  const template = createEmailVerificationTemplate();
  const result = await sendEmail({
    to,
    template,
    data: {
      senderName: 'Test User',
      senderEmail: 'test@example.com',
      verificationUrl: 'https://rescrub.ru/verify?token=test123'
    }
  });

  res.json(result);
});
```

**Тест через curl:**
```bash
curl -X POST https://your-app.replit.app/api/test/send-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com"}'
```

**Проверка:**
1. Письмо пришло на `your-email@example.com`
2. От кого: `ResCrub <noreply@mailone.rescrub.ru>`
3. Reply-To: `test@example.com`
4. В спам не попало
5. HTML оформление корректное

---

### Проверка webhook

**Эмуляция webhook события:**
```bash
curl -X POST http://localhost:5000/api/webhooks/mailganer \
  -H "Content-Type: application/json" \
  -H "X-Mailganer-Signature: test-signature" \
  -d '{
    "events": [
      {
        "event": "delivered",
        "messageId": "test-message-id",
        "email": "test@example.com",
        "timestamp": "2025-10-29T12:00:00Z"
      }
    ]
  }'
```

---

## 🚀 PRODUCTION ДЕПЛОЙ

### Чеклист перед запуском

- [ ] Домен настроен и верифицирован в Mailganer
- [ ] DNS записи (SPF, DKIM, DMARC) добавлены
- [ ] SMTP доступы получены и сохранены в Secrets
- [ ] Webhook URL настроен в ЛК Mailganer
- [ ] Тестовое письмо отправлено успешно
- [ ] Логи проверены на наличие ошибок
- [ ] Лимиты отправки известны и настроены

---

### Проверка после деплоя

**1. SMTP соединение:**
```bash
# В логах должно быть:
✅ SMTP соединение с Mailganer успешно установлено
```

**2. Отправка писем:**
```bash
# Создать реальное письмо через приложение
# Проверить в ЛК Mailganer → Логи отправки
# Статус должен быть: "Доставлено"
```

**3. Webhook:**
```bash
# В логах приложения:
Successfully processed 1 Mailganer webhook event(s)
```

**4. Мониторинг:**
```bash
# Следить за логами:
[express] POST /api/webhooks/mailganer 200
✅ Email sent successfully to user@example.com
```

---

## 🔧 TROUBLESHOOTING

### Проблема: Письма уходят в SPAM

**Причина 1: SPF/DKIM/DMARC не настроены**
```bash
# Проверить DNS записи:
dig TXT mailone.rescrub.ru +short
dig TXT mail._domainkey.mailone.rescrub.ru +short
dig TXT _dmarc.mailone.rescrub.ru +short

# Должны вернуть записи от Mailganer
```

**Причина 2: Использован неверифицированный домен в From**
```typescript
// Проверить, что используется DEFAULT_SENDER
from: DEFAULT_SENDER // ✅
from: userEmail      // ❌
```

**Причина 3: Плохая репутация домена**
```bash
# Проверить репутацию через:
- https://www.mail-tester.com
- https://mxtoolbox.com/blacklists.aspx

# Если в черных списках - обратиться в Mailganer support
```

---

### Проблема: SMTP connection failed

**Причина 1: Неправильные настройки secure/TLS**
```typescript
// Должно быть:
secure: false,       // ✅
requireTLS: true,    // ✅

// НЕ должно быть:
secure: true         // ❌
```

**Причина 2: Firewall блокирует порт 1126**
```bash
# Проверить доступность:
telnet api.samotpravil.ru 1126

# Должно подключиться
```

**Причина 3: Неправильный логин/пароль**
```bash
# Проверить в .env:
MAILGANER_SMTP_LOGIN=correct-login
MAILGANER_SMTP_PASSWORD=correct-password
```

---

### Проблема: 550 bounced check filter

**Решение:**
1. Войти в ЛК Mailganer
2. Настройки → Стоп-лист
3. Найти email и удалить из стоп-листа
4. Попробовать отправить снова

---

### Проблема: 501 from domain not trusted

**Решение:**
1. Проверить, что домен добавлен в ЛК Mailganer
2. Проверить статус верификации домена
3. Убедиться, что DNS записи добавлены
4. Дождаться верификации (может занять до 24 часов)

---

### Проблема: 450 ratelimit exceeded

**Решение:**
1. Проверить лимиты тарифа в ЛК Mailganer
2. Внедрить rate limiting на стороне приложения:

```typescript
// Простой rate limiter
let emailsSentInLastHour = 0;
const HOURLY_LIMIT = 100;

setInterval(() => {
  emailsSentInLastHour = 0;
}, 60 * 60 * 1000);

async function sendEmailWithLimit(params) {
  if (emailsSentInLastHour >= HOURLY_LIMIT) {
    throw new Error('Hourly limit reached');
  }
  await sendEmail(params);
  emailsSentInLastHour++;
}
```

3. Обновить тариф, если нужно больше писем

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

- **Документация Mailganer:** https://docs.mailganer.ru
- **Личный кабинет:** https://mailganer.ru/cabinet
- **Техподдержка:** support@mailganer.ru
- **Telegram:** @mailganer_support
- **Телефон:** 8-800-123-45-67

---

## ✅ ИТОГОВЫЙ CHECKLIST

### Настройка
- [ ] Зарегистрирован аккаунт в Mailganer
- [ ] Домен добавлен и верифицирован
- [ ] DNS записи (SPF, DKIM, DMARC) настроены
- [ ] SMTP доступы получены
- [ ] Environment variables настроены

### Код
- [ ] MailganerSMTPClient реализован
- [ ] DEFAULT_SENDER используется в From
- [ ] Reply-To настроен для контактов
- [ ] Обработка специфичных ошибок реализована
- [ ] Email шаблоны созданы

### Webhook
- [ ] Webhook URL настроен в ЛК Mailganer
- [ ] Webhook endpoint создан
- [ ] Проверка подписи реализована
- [ ] Обработка событий работает

### Тестирование
- [ ] SMTP соединение проверено
- [ ] Тестовое письмо отправлено
- [ ] HTML оформление корректное
- [ ] Письма не в SPAM
- [ ] Webhook события получены

### Production
- [ ] Домен верифицирован
- [ ] DNS записи активны
- [ ] Лимиты отправки настроены
- [ ] Мониторинг работает

---

**🎉 Готово! Email-рассылка через Mailganer.ru полностью интегрирована!**

---

## 📝 История изменений

- **2025-10-29**: Создана полная инструкция с учетом всех проблем при интеграции
- Исправлены критические ошибки с SPF/DMARC (From vs Reply-To)
- Добавлены специфичные обработчики ошибок Mailganer
- Описаны все подводные камни SMTP настроек (secure: false, requireTLS: true)
- Добавлены примеры Handlebars шаблонов и webhook обработки

# Инструкция по интеграции Robokassa в ResCrub

## Содержание
1. [Обзор интеграции](#обзор-интеграции)
2. [Настройка переменных окружения](#настройка-переменных-окружения)
3. [Структура файлов](#структура-файлов)
4. [Архитектура системы](#архитектура-системы)
5. [Настройка личного кабинета Robokassa](#настройка-личного-кабинета-robokassa)
6. [Процесс оплаты](#процесс-оплаты)
7. [Периодические платежи](#периодические-платежи)
8. [Обработка webhook уведомлений](#обработка-webhook-уведомлений)
9. [Тестирование](#тестирование)
10. [Безопасность](#безопасность)

---

## Обзор интеграции

В проекте ResCrub реализована полная интеграция с платежной системой Robokassa для обработки:
- ✅ Одноразовых платежей за подписки
- ✅ Автоматических периодических списаний (recurring payments)
- ✅ Оплаты баллами (внутренняя валюта)
- ✅ Комбинированной оплаты (баллы + Robokassa)
- ✅ Webhook уведомлений о статусе платежей

### Основные компоненты:
- **RobokassaClient** (`server/robokassa.ts`) - класс для работы с API
- **Webhook handlers** (`server/routes.ts`) - обработка уведомлений
- **SubscriptionManager** (`server/subscription-manager.ts`) - автоматические продления
- **Database schema** (`shared/schema.ts`) - таблицы payments и subscriptions

---

## Настройка переменных окружения

### Обязательные переменные

Добавьте в `.env` файл следующие переменные:

```bash
# Robokassa Production (Боевой режим)
ROBOKASSA_MERCHANT_LOGIN=your_merchant_login
ROBOKASSA_PASSWORD_1=your_password_1
ROBOKASSA_PASSWORD_2=your_password_2

# Robokassa Test (Тестовый режим)
ROBOKASSA_TEST_MODE=true
ROBOKASSA_TEST_PASSWORD_1=your_test_password_1
ROBOKASSA_TEST_PASSWORD_2=your_test_password_2
```

### Где получить значения:

1. **ROBOKASSA_MERCHANT_LOGIN** - идентификатор магазина (Merchant Login)
   - Доступен в личном кабинете Robokassa → Настройки → Технические настройки

2. **ROBOKASSA_PASSWORD_1** - пароль №1 для формирования подписи платежа
   - Генерируется в ЛК Robokassa → Технические настройки → Пароль #1

3. **ROBOKASSA_PASSWORD_2** - пароль №2 для проверки подписи результата
   - Генерируется в ЛК Robokassa → Технические настройки → Пароль #2

4. **TEST-режим пароли** - отдельные пароли для тестирования
   - Настраиваются в разделе "Тестовый режим"

### Проверка конфигурации

После настройки переменных, при запуске сервера вы увидите:

```bash
# Успешная инициализация:
✅ Robokassa client initialized

# Ошибка конфигурации:
⚠️ Robokassa credentials not found. Payment processing will be disabled.
```

---

## Структура файлов

```
server/
├── robokassa.ts              # RobokassaClient - основной класс
├── routes.ts                 # Webhook endpoints + API оплаты
├── subscription-manager.ts   # Автоматические продления подписок
└── storage.ts                # Database методы для платежей

shared/
└── schema.ts                 # Drizzle схемы: payments, subscriptions

client/src/pages/
└── Subscription.tsx          # UI страница оформления подписки
```

---

## Архитектура системы

### Database Schema

#### Таблица `subscriptions`
```typescript
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  planId: varchar("plan_id").notNull(),
  status: varchar("status"), // 'pending' | 'active' | 'cancelled' | 'expired'
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  robokassaInvoiceId: varchar("robokassa_invoice_id").unique(), // ID материнского платежа
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### Таблица `payments`
```typescript
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey(),
  subscriptionId: varchar("subscription_id").notNull(),
  userId: varchar("user_id").notNull(),
  amount: integer("amount").notNull(), // в рублях
  currency: varchar("currency").default("RUB"),
  status: varchar("status"), // 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: varchar("payment_method"), // 'card' | 'wallet' | 'sberbank'
  robokassaInvoiceId: varchar("robokassa_invoice_id").unique(),
  parentInvoiceId: varchar("parent_invoice_id"), // для recurring платежей
  isRecurring: boolean("is_recurring").default(false),
  paidAt: timestamp("paid_at"),
  failedAt: timestamp("failed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### RobokassaClient API

#### Создание платежа
```typescript
import { robokassaClient } from './robokassa';

const paymentUrl = robokassaClient.createPaymentUrl({
  invoiceId: 'sub_user123_1234567890',
  amount: 990, // в рублях
  description: 'Подписка Premium на 1 месяц',
  userEmail: 'user@example.com',
  isRecurring: false, // true для подписок с автопродлением
});

// Перенаправляем пользователя на paymentUrl
```

#### Создание периодического платежа (recurring)
```typescript
const recurringResult = await robokassaClient.createRecurringPayment({
  invoiceId: 'sub_user123_1234567891', // новый уникальный ID
  previousInvoiceId: 'sub_user123_1234567890', // ID материнского платежа
  amount: 990,
  description: 'Продление подписки Premium',
});

if (recurringResult.success) {
  console.log('Recurring payment created:', recurringResult.invoiceId);
} else {
  console.error('Recurring payment failed:', recurringResult.error);
}
```

#### Проверка webhook подписи
```typescript
app.post('/api/webhooks/robokassa/result', async (req, res) => {
  const parsedData = robokassaClient.parseWebhookData(req.body);
  
  if (!parsedData || !parsedData.isValid) {
    return res.status(400).send('Invalid signature');
  }
  
  const { invoiceId, amount, paymentMethod } = parsedData;
  // Обрабатываем успешный платеж
});
```

---

## Настройка личного кабинета Robokassa

### 1. Создание магазина

1. Зарегистрируйтесь на [robokassa.ru](https://robokassa.ru)
2. Перейдите в раздел **"Управление"** → **"Мои магазины"**
3. Нажмите **"Создать магазин"**
4. Заполните информацию о магазине

### 2. Технические настройки

В разделе **"Технические настройки"** укажите:

#### Result URL (обязательно!)
```
https://yourdomain.com/api/webhooks/robokassa/result
```
**Важно:** Robokassa отправляет уведомления только на порты 80 (HTTP) и 443 (HTTPS)

#### Success URL
```
https://yourdomain.com/api/webhooks/robokassa/success
```

#### Fail URL
```
https://yourdomain.com/api/webhooks/robokassa/fail
```

#### Дополнительные настройки:
- **Метод отправки данных:** POST
- **Кодировка:** UTF-8
- **Алгоритм подписи:** MD5
- **Язык интерфейса:** Русский (ru)

### 3. Генерация паролей

1. **Пароль #1** - для формирования подписи при инициализации платежа
   - Нажмите "Сгенерировать" в разделе "Пароль #1"
   - Скопируйте значение в `ROBOKASSA_PASSWORD_1`

2. **Пароль #2** - для проверки подписи в уведомлениях
   - Нажмите "Сгенерировать" в разделе "Пароль #2"
   - Скопируйте значение в `ROBOKASSA_PASSWORD_2`

### 4. Включение периодических платежей (Recurring)

1. Перейдите в **"Дополнительные возможности"** → **"Recurring платежи"**
2. Активируйте функцию периодических списаний
3. Подтвердите условия использования

**Важно:** Без активации Recurring периодические платежи работать не будут!

### 5. Тестовый режим

Для разработки используйте **Тестовый режим**:
1. Включите тестовый режим в настройках магазина
2. Сгенерируйте тестовые пароли #1 и #2
3. Используйте их в переменных `ROBOKASSA_TEST_PASSWORD_1` и `ROBOKASSA_TEST_PASSWORD_2`
4. Установите `ROBOKASSA_TEST_MODE=true`

---

## Процесс оплаты

### Пошаговый flow оплаты подписки

#### 1. Пользователь выбирает план подписки

Frontend отправляет POST запрос:
```typescript
// client/src/pages/Subscription.tsx
const response = await apiRequest('/api/subscription', {
  method: 'POST',
  body: JSON.stringify({ planId: selectedPlan.id }),
});
```

#### 2. Backend создает подписку и платеж

```typescript
// server/routes.ts - POST /api/subscription
app.post('/api/subscription', isEmailAuthenticated, async (req, res) => {
  const { planId } = req.body;
  const userId = req.session.userId!;
  
  // 1. Получаем баланс баллов пользователя
  const userPoints = await storage.getUserPoints(userId);
  const plan = await storage.getSubscriptionPlanById(planId);
  const planPriceRubles = plan.price;
  
  // 2. Проверяем, хватит ли баллов для полной оплаты
  const canPayWithPoints = userPoints >= planPriceRubles;
  const pointsToUse = canPayWithPoints ? planPriceRubles : 0;
  const remainingAmountToPay = canPayWithPoints ? 0 : planPriceRubles;
  
  // 3. Списываем баллы (если используются)
  if (pointsToUse > 0) {
    await storage.deductUserPoints(userId, pointsToUse);
  }
  
  // 4. Создаем invoice ID
  const invoiceId = `sub_${userId}_${Date.now()}`;
  
  // 5. Создаем subscription
  const subscription = await storage.createSubscription({
    userId,
    planId,
    status: 'pending',
    robokassaInvoiceId: invoiceId,
  });
  
  // 6. Создаем payment
  const payment = await storage.createPayment({
    subscriptionId: subscription.id,
    userId,
    amount: remainingAmountToPay,
    currency: plan.currency,
    robokassaInvoiceId: invoiceId,
    isRecurring: false,
  });
  
  // 7. Генерируем URL оплаты или активируем подписку
  if (remainingAmountToPay > 0) {
    // Нужна оплата через Robokassa
    const paymentUrl = robokassaClient.createPaymentUrl({
      invoiceId,
      amount: remainingAmountToPay,
      description: `Подписка ${plan.displayName}`,
      userEmail: userAccount?.email,
      isRecurring: false,
    });
    
    res.json({
      subscription,
      payment,
      paymentUrl, // Frontend перенаправляет на этот URL
      pointsUsed: pointsToUse,
      remainingAmount: remainingAmountToPay,
    });
  } else {
    // Полностью оплачено баллами - активируем сразу
    await storage.updateSubscription(subscription.id, { status: 'active' });
    await storage.updatePayment(payment.id, { status: 'paid', paymentMethod: 'points' });
    
    res.json({
      subscription,
      payment,
      paymentUrl: null,
      fullyPaidWithPoints: true,
    });
  }
});
```

#### 3. Пользователь оплачивает на сайте Robokassa

Frontend перенаправляет пользователя на `paymentUrl`:
```typescript
if (response.paymentUrl) {
  window.location.href = response.paymentUrl;
}
```

#### 4. Robokassa обрабатывает платеж

Пользователь вводит данные карты → Robokassa списывает деньги → отправляет webhook

#### 5. Backend получает Result URL webhook

```typescript
// server/routes.ts - POST /api/webhooks/robokassa/result
app.post('/api/webhooks/robokassa/result', async (req, res) => {
  // 1. Парсим и проверяем подпись
  const parsedData = robokassaClient.parseWebhookData(req.body);
  if (!parsedData || !parsedData.isValid) {
    return res.status(400).send('Invalid signature');
  }
  
  const { invoiceId, amount, paymentMethod } = parsedData;
  
  // 2. Находим платеж
  const payment = await storage.getPaymentByInvoiceId(invoiceId);
  
  // 3. Обновляем статус платежа
  await storage.updatePayment(payment.id, {
    status: 'paid',
    paidAt: new Date(),
    paymentMethod,
  });
  
  // 4. Активируем подписку
  const subscription = await storage.getSubscriptionById(payment.subscriptionId);
  const plan = await storage.getSubscriptionPlanById(subscription.planId);
  
  const now = new Date();
  const currentPeriodEnd = new Date(now);
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + plan.intervalCount);
  
  await storage.updateSubscription(subscription.id, {
    status: 'active',
    currentPeriodStart: now,
    currentPeriodEnd,
  });
  
  // 5. Начисляем бонусные баллы
  await storage.addUserPoints(subscription.userId, 100, 'Успешная подписка');
  
  // 6. Отвечаем "OK" чтобы Robokassa знала, что webhook обработан
  res.send('OK');
});
```

#### 6. Пользователь возвращается на Success URL

Robokassa перенаправляет пользователя обратно на ваш сайт после успешной оплаты.

---

## Периодические платежи

### Как работает автоматическое продление

ResCrub использует **SubscriptionManager** для автоматического продления подписок:

#### 1. Инициализация планировщика

```typescript
// server/index.ts
import { SubscriptionManager } from './subscription-manager';

const subscriptionManager = SubscriptionManager.getInstance();
subscriptionManager.start(); // Запускается каждые 6 часов
```

#### 2. Проверка истекающих подписок

```typescript
// server/subscription-manager.ts
class SubscriptionManager {
  async processRecurringPayments() {
    // Находим подписки, срок которых истекает через 3 дня
    const renewalThreshold = new Date();
    renewalThreshold.setDate(renewalThreshold.getDate() + 3);
    
    const expiringSubscriptions = await storage.getExpiringSubscriptions(renewalThreshold);
    
    for (const subscription of expiringSubscriptions) {
      await this.renewSubscription(subscription);
    }
  }
  
  async renewSubscription(subscription: Subscription) {
    const plan = await storage.getSubscriptionPlanById(subscription.planId);
    const newInvoiceId = `sub_${subscription.userId}_${Date.now()}`;
    
    // 1. Создаем новый payment record
    const payment = await storage.createPayment({
      subscriptionId: subscription.id,
      userId: subscription.userId,
      amount: plan.price,
      currency: plan.currency,
      robokassaInvoiceId: newInvoiceId,
      isRecurring: true, // Флаг периодического платежа
      parentInvoiceId: subscription.robokassaInvoiceId, // Ссылка на материнский платеж
    });
    
    // 2. Создаем recurring платеж в Robokassa
    const recurringResult = await robokassaClient.createRecurringPayment({
      invoiceId: newInvoiceId,
      previousInvoiceId: subscription.robokassaInvoiceId!, // ID первого платежа
      amount: plan.price,
      description: `Продление подписки ${plan.displayName}`,
    });
    
    if (recurringResult.success) {
      // 3. Robokassa автоматически спишет деньги и отправит Result URL webhook
      console.log(`✅ Recurring payment created for subscription ${subscription.id}`);
    } else {
      // 4. Если не получилось - отправляем уведомление пользователю
      await sendSubscriptionExpiryNotification(subscription.userId, subscription);
    }
  }
}
```

#### Важные моменты:

1. **Материнский платеж** - первый платеж пользователя сохраняется в `subscription.robokassaInvoiceId`
2. **Дочерние платежи** - все последующие продления ссылаются на материнский через `parentInvoiceId`
3. **Автоматическое списание** - Robokassa сама спишет деньги с карты пользователя
4. **Webhook уведомление** - после успешного списания Robokassa отправит webhook на Result URL

### Условия для recurring платежей

- ✅ Первый платеж должен быть выполнен с параметром `isRecurring: true`
- ✅ В личном кабинете Robokassa включена функция Recurring
- ✅ Карта пользователя поддерживает recurring (большинство российских карт)
- ✅ Срок действия карты не истек

---

## Обработка webhook уведомлений

### Result URL - успешная оплата

**Endpoint:** `POST /api/webhooks/robokassa/result`

**Параметры запроса:**
```
OutSum=990.00
InvId=sub_user123_1234567890
SignatureValue=abc123def456...
PaymentMethod=BankCard
```

**Обработка:**
```typescript
app.post('/api/webhooks/robokassa/result', 
  express.raw({ type: 'application/x-www-form-urlencoded' }), 
  async (req, res) => {
    // 1. Парсим данные
    const data = new URLSearchParams(req.body.toString());
    const webhookData = Object.fromEntries(data.entries());
    
    // 2. Проверяем подпись (КРИТИЧНО!)
    const parsedData = robokassaClient.parseWebhookData(webhookData);
    if (!parsedData || !parsedData.isValid) {
      return res.status(400).send('Invalid signature');
    }
    
    // 3. Находим платеж
    const payment = await storage.getPaymentByInvoiceId(parsedData.invoiceId);
    if (!payment) {
      return res.status(404).send('Payment not found');
    }
    
    // 4. Обновляем статус
    await storage.updatePayment(payment.id, {
      status: 'paid',
      paidAt: new Date(),
      paymentMethod: parsedData.paymentMethod,
    });
    
    // 5. Активируем подписку
    await storage.updateSubscription(payment.subscriptionId, {
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: calculatePeriodEnd(plan),
    });
    
    // 6. Начисляем бонусы
    await storage.addUserPoints(payment.userId, 100, 'Успешная подписка');
    
    // 7. ОБЯЗАТЕЛЬНО отвечаем "OK"
    res.send('OK');
  }
);
```

**⚠️ ВАЖНО:**
- Webhook вызывается **асинхронно**, не зависит от пользователя
- Должен отвечать `200 OK` или `OK` в теле
- Robokassa повторит webhook до 10 раз, если не получит OK
- Проверка подписи **обязательна** для безопасности

### Success URL - редирект пользователя

**Endpoint:** `POST /api/webhooks/robokassa/success`

```typescript
app.post('/api/webhooks/robokassa/success', async (req, res) => {
  // Просто логируем - основная обработка в Result URL
  console.log('User returned after successful payment');
  res.send('OK');
});
```

### Fail URL - неудачная оплата

**Endpoint:** `POST /api/webhooks/robokassa/fail`

```typescript
app.post('/api/webhooks/robokassa/fail', async (req, res) => {
  const { InvId: invoiceId, FailureDescription } = req.body;
  
  // Обновляем статус платежа
  const payment = await storage.getPaymentByInvoiceId(invoiceId);
  if (payment) {
    await storage.updatePayment(payment.id, {
      status: 'failed',
      failedAt: new Date(),
      failureReason: FailureDescription || 'Payment failed',
    });
  }
  
  res.send('OK');
});
```

---

## Тестирование

### 1. Тестовый режим

Активируйте тестовый режим:
```bash
ROBOKASSA_TEST_MODE=true
ROBOKASSA_TEST_PASSWORD_1=test_password_1
ROBOKASSA_TEST_PASSWORD_2=test_password_2
```

### 2. Тестовые карты

Robokassa предоставляет тестовые карты:

| Карта | Результат |
|-------|-----------|
| `4111111111111111` | Успешная оплата |
| `4242424242424242` | Успешная оплата |
| `5555555555554444` | Успешная оплата |
| `0000000000000000` | Отклонение платежа |

**Срок:** любой будущий месяц/год  
**CVV:** любые 3 цифры

### 3. Локальное тестирование webhooks

Используйте **ngrok** или **localtunnel** для туннелирования localhost:

```bash
# Установка ngrok
npm install -g ngrok

# Запуск туннеля
ngrok http 5000

# Скопируйте HTTPS URL (например: https://abc123.ngrok.io)
```

Затем в настройках Robokassa укажите:
```
Result URL: https://abc123.ngrok.io/api/webhooks/robokassa/result
Success URL: https://abc123.ngrok.io/api/webhooks/robokassa/success
Fail URL: https://abc123.ngrok.io/api/webhooks/robokassa/fail
```

### 4. Проверка логов

```bash
# Проверяйте логи сервера при получении webhooks
npm run dev

# Логи успешной оплаты:
✅ Robokassa result webhook received: { OutSum: '990.00', InvId: 'sub_...' }
✅ Payment updated: paid
✅ Subscription activated
💰 Awarded 100 points to user
```

---

## Безопасность

### 1. Проверка подписи

**ВСЕГДА** проверяйте подпись webhook:
```typescript
const parsedData = robokassaClient.parseWebhookData(webhookData);
if (!parsedData || !parsedData.isValid) {
  return res.status(400).send('Invalid signature');
}
```

### 2. Хранение паролей

- ❌ **НЕ КОММИТЬТЕ** пароли в Git
- ✅ Используйте `.env` файл (добавлен в `.gitignore`)
- ✅ Используйте Replit Secrets для production

### 3. HTTPS обязателен

Robokassa отправляет webhooks **только на HTTPS** (порт 443):
- ✅ Production должен быть на HTTPS
- ✅ Для локальной разработки используйте ngrok

### 4. Идемпотентность webhooks

Robokassa может отправить один webhook **несколько раз**:
```typescript
// Проверяем, не обработан ли платеж уже
if (payment.status === 'paid') {
  console.log('Payment already processed');
  return res.send('OK'); // Все равно отвечаем OK
}
```

### 5. Timeout защита

Webhook должен ответить в течение **30 секунд**:
```typescript
// Обрабатываем быстро, тяжелые операции - в фоне
res.send('OK'); // Сначала отвечаем

// Затем выполняем дополнительные действия
await sendEmailNotification(user);
```

---

## Частые проблемы и решения

### Проблема: Webhook не приходят

**Решения:**
1. Проверьте URL в настройках Robokassa (должен быть HTTPS)
2. Убедитесь, что порт 443 открыт
3. Проверьте логи сервера на ошибки
4. Используйте ngrok для локальной разработки

### Проблема: Invalid signature

**Решения:**
1. Проверьте, что используете правильный `ROBOKASSA_PASSWORD_2`
2. Убедитесь, что в Robokassa установлен алгоритм **MD5**
3. Проверьте, что тестовый режим соответствует `ROBOKASSA_TEST_MODE`

### Проблема: Recurring платежи не создаются

**Решения:**
1. Убедитесь, что в ЛК Robokassa включена функция Recurring
2. Проверьте, что первый платеж был с `isRecurring: true`
3. Проверьте, что `subscription.robokassaInvoiceId` сохранен

### Проблема: Платеж создан, но подписка не активировалась

**Решения:**
1. Проверьте, что webhook `/api/webhooks/robokassa/result` отработал
2. Посмотрите логи на ошибки обновления subscription
3. Проверьте, что payment.subscriptionId корректный

---

## Поддержка

### Документация Robokassa
- Официальная документация: https://docs.robokassa.ru/
- API Reference: https://docs.robokassa.ru/partner-api/
- Тестовый режим: https://docs.robokassa.ru/test-mode/

### Техническая поддержка
- Email: support@robokassa.ru
- Телефон: 8 (800) 700-11-58
- Telegram: @robokassa_support

### Код проекта ResCrub
- `server/robokassa.ts` - основная логика
- `server/routes.ts` - webhook handlers
- `server/subscription-manager.ts` - автопродление
- `shared/schema.ts` - database schema

---

## Чеклист запуска в production

- [ ] Получены боевые пароли #1 и #2
- [ ] Переменные окружения настроены (без TEST_MODE)
- [ ] Result URL настроен на HTTPS домен
- [ ] Success/Fail URL настроены
- [ ] Алгоритм подписи: MD5
- [ ] Метод отправки: POST
- [ ] Кодировка: UTF-8
- [ ] Включен Recurring (если нужны подписки)
- [ ] Протестирована успешная оплата
- [ ] Протестирован отказ в оплате
- [ ] Протестировано автопродление (если используется)
- [ ] Логирование webhooks работает
- [ ] Проверка подписи активна
- [ ] HTTPS сертификат валиден
- [ ] Мониторинг ошибок настроен

---

**Готово!** Теперь интеграция Robokassa полностью настроена и готова к работе. 🚀

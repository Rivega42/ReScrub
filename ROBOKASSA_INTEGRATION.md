# 🔴 ПОЛНАЯ ИНСТРУКЦИЯ: ИНТЕГРАЦИЯ ROBOKASSA В RESCRUB

## 📋 Оглавление
1. [Критические проблемы и ошибки](#критические-проблемы-и-ошибки)
2. [Пошаговая настройка](#пошаговая-настройка)
3. [Техническая реализация](#техническая-реализация)
4. [Тестирование](#тестирование)
5. [Production деплой](#production-деплой)
6. [Troubleshooting](#troubleshooting)

---

## 🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ И ОШИБКИ

### ❌ Проблема #1: НЕПРАВИЛЬНЫЕ WEBHOOK URLs (САМАЯ ЧАСТАЯ ОШИБКА!)

**Что делали неправильно:**
```
❌ Result URL:  /api/robokassa/result
❌ Success URL: /api/robokassa/success  
❌ Fail URL:    /api/robokassa/fail
```

**Правильно:**
```
✅ Result URL:  /api/webhooks/robokassa/result
✅ Success URL: /api/webhooks/robokassa/success
✅ Fail URL:    /api/webhooks/robokassa/fail
```

**Почему критично:**
- Robokassa НЕ УВЕДОМИТ вас об оплате, если URL неправильный
- Платеж пройдет, но ваша система НЕ УЗНАЕТ об этом
- Пользователь заплатит, но не получит доступ
- **Финансовые потери и недовольные клиенты!**

**Как проверить:**
```bash
# Должен вернуть 200 OK (даже без валидных данных)
curl -X POST https://your-app.replit.app/api/webhooks/robokassa/result \
  -d "OutSum=100.00&InvId=12345&SignatureValue=test"
```

---

### ❌ Проблема #2: Путаница с паролями Password #1 и Password #2

**Robokassa использует ДВА разных пароля:**

| Пароль | Когда используется | Для чего |
|--------|-------------------|----------|
| **Password #1** | При создании платежной ссылки | Подпись инициализации платежа |
| **Password #2** | При получении webhook от Robokassa | Проверка результата платежа |

**Критичная ошибка:** Использовать один и тот же пароль везде!

```typescript
// ❌ НЕПРАВИЛЬНО
const signature = crypto.createHash('md5')
  .update(`${merchantLogin}:${outSum}:${invoiceId}:${PASSWORD_1}`) // Инициализация
  .digest('hex');

const verified = crypto.createHash('md5')
  .update(`${outSum}:${invoiceId}:${PASSWORD_1}`) // ❌ Должен быть PASSWORD_2!
  .digest('hex') === receivedSignature;

// ✅ ПРАВИЛЬНО
// Инициализация платежа (Password #1)
const initSignature = crypto.createHash('md5')
  .update(`${merchantLogin}:${outSum}:${invoiceId}:${PASSWORD_1}`)
  .digest('hex');

// Проверка webhook (Password #2)
const resultSignature = crypto.createHash('md5')
  .update(`${outSum}:${invoiceId}:${PASSWORD_2}`) // ✅ PASSWORD_2!
  .digest('hex');
```

---

### ❌ Проблема #3: Формат суммы платежа

**Robokassa требует:**
- Сумму в рублях (не копейках!)
- Ровно 2 знака после запятой
- Десятичный разделитель - точка (не запятая!)

```typescript
// ❌ НЕПРАВИЛЬНО
const outSum = 99900; // копейки
const outSum = "999"; // без десятичных
const outSum = 999.9; // 1 знак после запятой
const outSum = "999,00"; // запятая вместо точки

// ✅ ПРАВИЛЬНО
const outSum = (999).toFixed(2); // "999.00"
const outSum = (1790.50).toFixed(2); // "1790.50"
```

---

### ❌ Проблема #4: Порядок параметров в MD5 подписи

**СТРОГО ОПРЕДЕЛЕННЫЙ порядок!** Любое отклонение = неверная подпись.

**Для инициализации платежа (Password #1):**
```
MerchantLogin:OutSum:InvoiceID:Password#1[:дополнительные_параметры]
```

**Для проверки результата (Password #2):**
```
OutSum:InvoiceID:Password#2
```

**Обратите внимание:**
- В инициализации: **MerchantLogin** идет первым
- В проверке: **MerchantLogin отсутствует**!
- Регистр MD5 хеша: **lowercase** (`toLowerCase()`)

```typescript
// ✅ ПРАВИЛЬНАЯ реализация
function createInitSignature(merchantLogin: string, outSum: string, invoiceId: string) {
  const str = `${merchantLogin}:${outSum}:${invoiceId}:${PASSWORD_1}`;
  return crypto.createHash('md5').update(str).digest('hex').toLowerCase();
}

function verifyResultSignature(outSum: string, invoiceId: string, signature: string) {
  const str = `${outSum}:${invoiceId}:${PASSWORD_2}`;
  const expected = crypto.createHash('md5').update(str).digest('hex').toLowerCase();
  return expected === signature.toLowerCase();
}
```

---

### ❌ Проблема #5: Recurring платежи (подписки)

**Особенность:** `PreviousInvoiceID` НЕ участвует в подписи инициализации!

```typescript
// ❌ НЕПРАВИЛЬНО - включить PreviousInvoiceID в подпись
const signature = createSignature(
  merchantLogin, 
  outSum, 
  invoiceId, 
  { PreviousInvoiceID: '12345' } // ❌ НЕТ!
);

// ✅ ПРАВИЛЬНО - PreviousInvoiceID только в POST параметрах
const signature = createSignature(merchantLogin, outSum, invoiceId); // Без PreviousInvoiceID

const formData = new URLSearchParams({
  MerchantLogin: merchantLogin,
  OutSum: outSum,
  InvoiceID: invoiceId,
  PreviousInvoiceID: previousInvoiceId, // ✅ Только здесь!
  SignatureValue: signature
});
```

---

### ❌ Проблема #6: APP_URL для callback URLs

**Критично:** `APP_URL` должен быть HTTPS и совпадать с production доменом!

```bash
# ❌ НЕПРАВИЛЬНО
APP_URL=http://localhost:5000
APP_URL=https://your-app--dev.replit.app  # development URL
APP_URL=https://your-app.replit.app/      # лишний слэш в конце

# ✅ ПРАВИЛЬНО
APP_URL=https://your-app.replit.app
```

**Как используется:**
```typescript
// Robokassa вызывает эти URL после платежа
const resultURL = `${APP_URL}/api/webhooks/robokassa/result`;
const successURL = `${APP_URL}/api/webhooks/robokassa/success`;
const failURL = `${APP_URL}/api/webhooks/robokassa/fail`;
```

---

## 📝 ПОШАГОВАЯ НАСТРОЙКА

### Шаг 1: Регистрация магазина в Robokassa

1. **Регистрация:** https://auth.robokassa.ru/Merchant/Registration
2. **Заполнить данные:**
   - Название магазина: `ResCrub`
   - Тип: `Услуги`
   - URL сайта: `https://rescrub.ru`
   - Email: ваш email

3. **Дождаться подтверждения** (1-3 рабочих дня)

---

### Шаг 2: Настройка технических параметров

**Важно:** Делать это **ПОСЛЕ** деплоя приложения, когда знаете production URL!

1. **Войти в кабинет:** https://merchant.robokassa.ru
2. **Настройки → Технические настройки**
3. **Заполнить параметры:**

```
Result URL (обработка результата):
https://your-app.replit.app/api/webhooks/robokassa/result
Метод: POST ✅
Алгоритм: MD5 ✅

Success URL (успешная оплата):
https://your-app.replit.app/api/webhooks/robokassa/success
Метод: POST ✅

Fail URL (неудачная оплата):
https://your-app.replit.app/api/webhooks/robokassa/fail
Метод: POST ✅
```

4. **Сохранить настройки**
5. **Скопировать пароли:**
   - Password #1 (для подписи платежных форм)
   - Password #2 (для обработки результатов)

---

### Шаг 3: Настройка environment variables

**В Replit Secrets добавить:**

```bash
# Production Robokassa
ROBOKASSA_MERCHANT_LOGIN=demo               # Ваш MerchantLogin
ROBOKASSA_PASSWORD_1=Vja58vAjEk3S           # Password #1 из кабинета
ROBOKASSA_PASSWORD_2=9k42InbDj93x           # Password #2 из кабинета

# Тестовый режим (для разработки)
ROBOKASSA_TEST_MODE=true                    # true для тестов
ROBOKASSA_TEST_PASSWORD_1=test123           # Тестовые пароли
ROBOKASSA_TEST_PASSWORD_2=test456

# APP URL (критично!)
APP_URL=https://your-app.replit.app         # БЕЗ слэша в конце!
```

**Переключение режимов:**
```bash
# Development (тестовые платежи)
ROBOKASSA_TEST_MODE=true

# Production (реальные деньги)
ROBOKASSA_TEST_MODE=false
```

---

### Шаг 4: Проверка интеграции

**Проверка #1: Webhook endpoints доступны**
```bash
# Должно вернуть 200 OK или 400 (но НЕ 404!)
curl -X POST https://your-app.replit.app/api/webhooks/robokassa/result

# Проверить все 3 endpoint'а
curl -X POST https://your-app.replit.app/api/webhooks/robokassa/success
curl -X POST https://your-app.replit.app/api/webhooks/robokassa/fail
```

**Проверка #2: Создание платежной ссылки**
```bash
# В вашем приложении создать тестовый платеж
# Должна вернуться ссылка вида:
# https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=demo&OutSum=999.00...
```

**Проверка #3: Тестовый платеж**
```bash
# В тестовом режиме используйте данные:
Карта: 5555 5555 5555 4444
Срок: 12/28
CVV: 123
```

---

## 💻 ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ

### Структура файлов

```
server/
├── robokassa.ts          # RobokassaClient класс
├── routes.ts             # Webhook endpoints
├── subscription-manager.ts  # Обработка подписок
└── storage.ts            # База данных

.env
├── ROBOKASSA_MERCHANT_LOGIN
├── ROBOKASSA_PASSWORD_1
├── ROBOKASSA_PASSWORD_2
└── APP_URL
```

---

### Основные методы RobokassaClient

**1. Создание платежной ссылки**
```typescript
const paymentUrl = robokassaClient.createPaymentUrl({
  invoiceId: 'ORDER-12345',  // Уникальный ID заказа
  amount: 1790.00,           // Сумма в рублях
  description: 'Подписка Базовый план',
  userEmail: 'user@example.com',
  isRecurring: true          // Для подписок
});

// Возвращает: https://auth.robokassa.ru/Merchant/Index.aspx?...
```

**2. Проверка webhook**
```typescript
const webhookData = {
  OutSum: '1790.00',
  InvId: 'ORDER-12345',
  SignatureValue: 'abc123...'
};

const isValid = robokassaClient.validateWebhook(webhookData);
if (isValid) {
  // Подпись валидна, можно обрабатывать платеж
}
```

**3. Создание recurring платежа**
```typescript
const result = await robokassaClient.createRecurringPayment({
  invoiceId: 'ORDER-67890',
  previousInvoiceId: 'ORDER-12345', // ID материнского платежа
  amount: 1790.00,
  description: 'Продление подписки'
});

if (result.success) {
  console.log('Recurring платеж создан:', result.invoiceId);
}
```

---

### Webhook endpoints

**Структура:**
```typescript
// Result URL - ГЛАВНЫЙ endpoint для обработки
app.post('/api/webhooks/robokassa/result', async (req, res) => {
  const { OutSum, InvId, SignatureValue } = req.body;
  
  // 1. Проверить подпись
  const isValid = robokassaClient.verifyResultSignature(OutSum, InvId, SignatureValue);
  if (!isValid) {
    return res.status(400).send('Invalid signature');
  }
  
  // 2. Обновить статус платежа в БД
  await storage.updatePayment(InvId, { status: 'completed' });
  
  // 3. Активировать подписку
  await storage.updateSubscription(subscriptionId, { status: 'active' });
  
  // 4. ОБЯЗАТЕЛЬНО вернуть OK
  res.send(`OK${InvId}`);
});

// Success URL - редирект после успешной оплаты
app.post('/api/webhooks/robokassa/success', (req, res) => {
  res.redirect('/dashboard?payment=success');
});

// Fail URL - редирект после ошибки
app.post('/api/webhooks/robokassa/fail', (req, res) => {
  res.redirect('/subscription?payment=failed');
});
```

---

## 🧪 ТЕСТИРОВАНИЕ

### Тестовый режим

**1. Включить тестовый режим:**
```bash
ROBOKASSA_TEST_MODE=true
ROBOKASSA_TEST_PASSWORD_1=test123
ROBOKASSA_TEST_PASSWORD_2=test456
```

**2. Тестовые карты Robokassa:**
```
Успешный платеж:
Карта: 5555 5555 5555 4444
Срок: 12/28
CVV: 123

Отклоненный платеж:
Карта: 5555 5555 5555 5557
```

**3. Проверка webhooks вручную:**
```bash
# Эмуляция успешного платежа
curl -X POST http://localhost:5000/api/webhooks/robokassa/result \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "OutSum=999.00&InvId=TEST-123&SignatureValue=$(echo -n '999.00:TEST-123:test456' | md5sum | cut -d' ' -f1)"
```

---

### Логирование

**Включить debug логи:**
```typescript
console.log('🔵 Robokassa: Creating payment URL', { invoiceId, amount });
console.log('✅ Robokassa: Webhook received', { OutSum, InvId });
console.log('❌ Robokassa: Invalid signature', { expected, received });
```

**Проверить логи в Replit:**
```bash
# В Replit Console смотреть на:
[express] POST /api/webhooks/robokassa/result 200
✅ Payment completed: ORDER-12345
```

---

## 🚀 PRODUCTION ДЕПЛОЙ

### Чеклист перед запуском

- [ ] `ROBOKASSA_TEST_MODE=false` установлено
- [ ] Production пароли настроены
- [ ] `APP_URL` указывает на production домен
- [ ] Webhook URLs настроены в кабинете Robokassa
- [ ] Тестовый платеж проведен успешно
- [ ] Логи проверены на наличие ошибок

### Проверка после деплоя

**1. Проверить доступность webhooks:**
```bash
curl -I https://your-app.replit.app/api/webhooks/robokassa/result
# Должно вернуть: HTTP/1.1 200 OK или 400 Bad Request (но НЕ 404!)
```

**2. Создать реальный платеж:**
```bash
# В приложении создать подписку
# Проверить, что:
- Платежная ссылка открывается
- После оплаты redirect работает
- Webhook получен (проверить логи)
- Подписка активирована в БД
```

**3. Мониторинг:**
```bash
# Следить за логами:
[express] POST /api/webhooks/robokassa/result 200
✅ Payment completed: ORDER-12345
✅ Subscription activated: SUB-456
```

---

## 🔧 TROUBLESHOOTING

### Проблема: Webhook не приходит

**Причина 1: Неправильный URL**
```bash
# Проверить
curl -X POST https://your-app.replit.app/api/webhooks/robokassa/result

# Если 404 - URL неправильный, должен быть /api/webhooks/robokassa/*
```

**Причина 2: APP_URL не совпадает**
```bash
# В .env проверить:
APP_URL=https://your-app.replit.app  # БЕЗ слэша в конце!
```

**Причина 3: Robokassa ждет GET, а endpoint принимает POST**
```typescript
// Должно быть POST
app.post('/api/webhooks/robokassa/result', ...);
```

---

### Проблема: Invalid signature

**Причина 1: Неправильный пароль**
```typescript
// Проверить, что используется PASSWORD_2 для проверки результата
const signature = crypto.createHash('md5')
  .update(`${OutSum}:${InvId}:${PASSWORD_2}`) // ✅ PASSWORD_2
  .digest('hex');
```

**Причина 2: Формат суммы**
```typescript
// Должно быть с 2 знаками после запятой
OutSum = "999.00"  // ✅
OutSum = "999"     // ❌
```

**Причина 3: Регистр MD5**
```typescript
// Должно быть lowercase
.digest('hex').toLowerCase() // ✅
```

---

### Проблема: Recurring платеж не создается

**Причина: PreviousInvoiceID в подписи**
```typescript
// ❌ НЕПРАВИЛЬНО
const signature = createSignature(login, sum, invoiceId, { PreviousInvoiceID: '123' });

// ✅ ПРАВИЛЬНО
const signature = createSignature(login, sum, invoiceId); // Без PreviousInvoiceID!
```

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

- **Документация Robokassa:** https://docs.robokassa.ru
- **Тестовый кабинет:** https://merchant.robokassa.ru
- **Техподдержка:** support@robokassa.ru
- **Телефон:** 8-800-500-44-55

---

## ✅ ИТОГОВЫЙ CHECKLIST

### Настройка
- [ ] Зарегистрирован магазин в Robokassa
- [ ] Получены Password #1 и Password #2
- [ ] Настроены webhook URLs в кабинете
- [ ] Environment variables настроены

### Код
- [ ] RobokassaClient реализован
- [ ] Webhook endpoints созданы
- [ ] Подпись MD5 корректная
- [ ] Recurring payments поддерживаются

### Тестирование
- [ ] Тестовый платеж проведен
- [ ] Webhooks получены
- [ ] Логи проверены
- [ ] Подписка активирована

### Production
- [ ] `ROBOKASSA_TEST_MODE=false`
- [ ] Production пароли установлены
- [ ] `APP_URL` корректный
- [ ] Мониторинг настроен

---

**🎉 Готово! Robokassa полностью интегрирована!**

---

## 📝 История изменений

- **2025-10-29**: Создана полная инструкция с учетом всех проблем при интеграции
- Исправлены критические ошибки с webhook URLs
- Добавлены детальные объяснения работы с Password #1 и Password #2
- Описаны все подводные камни при работе с recurring платежами

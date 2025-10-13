# 🚀 Инструкция по развертыванию ResCrub

> **Платформа защиты персональных данных по ФЗ-152**

---

## 📋 Содержание

1. [Требования к окружению](#требования-к-окружению)
2. [Environment Variables](#environment-variables)
3. [Настройка внешних сервисов](#настройка-внешних-сервисов)
4. [Деплой на Replit](#деплой-на-replit)
5. [Проверка работоспособности](#проверка-работоспособности)
6. [Production Checklist](#production-checklist)

---

## 🔧 Требования к окружению

### Минимальные требования:
- **Node.js**: v20+ (ESM поддержка)
- **PostgreSQL**: 14+ (Neon Serverless)
- **RAM**: 512 MB минимум, 1 GB рекомендуется
- **SSL**: HTTPS обязателен для webhooks

### Технологический стек:
- Express.js + TypeScript
- React 18 + Vite
- Drizzle ORM
- PostgreSQL (Neon)

---

## 🔐 Environment Variables

### ⚙️ Базовые настройки

```bash
# Окружение
NODE_ENV=production                          # production | development
PORT=5000                                    # Порт приложения (default: 5000)

# URL приложения (для webhooks и OAuth)
APP_URL=https://your-app.replit.app         # ⚠️ ОБЯЗАТЕЛЬНО для production
REPLIT_DOMAINS=your-app.replit.app          # Домен Replit (авто)
REPL_ID=your-repl-id                         # ID Replit (авто)
```

---

### 🗄️ База данных

```bash
# PostgreSQL (Neon Serverless)
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
```

**Настройка:**
1. Используйте встроенную БД Replit или Neon.tech
2. Убедитесь, что `sslmode=require` включен
3. После настройки выполните: `npm run db:push`

---

### 🔒 Безопасность и криптография

```bash
# Session management
SESSION_SECRET=random-64-char-string        # Генерируйте: openssl rand -base64 48

# Криптография для доказательств
EVIDENCE_SERVER_SECRET=your-secret-key      # ⚠️ КРИТИЧНО для блокчейн-подписей
EVIDENCE_TIMESTAMP_SALT=random-salt         # Соль для timestamp'ов
HMAC_SECRET=random-hmac-key                 # HMAC ключ для подписей
ENCRYPTION_KEY=32-byte-encryption-key       # AES-256 шифрование
```

**Генерация ключей безопасности:**
```bash
# SESSION_SECRET (64 символа)
openssl rand -base64 48

# EVIDENCE_SERVER_SECRET (32+ символа)
openssl rand -hex 32

# ENCRYPTION_KEY (32 байта для AES-256)
openssl rand -hex 32
```

---

### 📧 Email система (Mailganer.ru - Российский провайдер)

```bash
# Mailganer API
MAILGANER_API_KEY=your-api-key              # ⚠️ ОБЯЗАТЕЛЬНО

# SMTP настройки (опционально, если используете SMTP)
MAILGANER_SMTP_HOST=api.samotpravil.ru
MAILGANER_SMTP_PORT=1126
MAILGANER_SMTP_LOGIN=your-login
MAILGANER_SMTP_PASSWORD=your-password

# Webhook верификация
MAILGANER_WEBHOOK_VERIFY_KEY=optional-key   # Для проверки подписи webhook
```

**Получение ключей:**
1. Регистрация: https://mailganer.ru или https://samotpravil.com
2. API ключ: Личный кабинет → API → Создать ключ
3. SMTP: Настройки → SMTP → Получить доступы

---

### 💳 Платежная система (Robokassa)

```bash
# Production настройки
ROBOKASSA_MERCHANT_LOGIN=your-merchant-id   # ⚠️ ОБЯЗАТЕЛЬНО
ROBOKASSA_PASSWORD_1=password-1             # ⚠️ ОБЯЗАТЕЛЬНО (Result URL)
ROBOKASSA_PASSWORD_2=password-2             # ⚠️ ОБЯЗАТЕЛЬНО (Success/Fail URL)

# Тестовый режим (для разработки)
ROBOKASSA_TEST_MODE=true                    # true | false
ROBOKASSA_TEST_PASSWORD_1=test-pass-1       # Тестовые пароли
ROBOKASSA_TEST_PASSWORD_2=test-pass-2
```

**Настройка Robokassa:**
1. Регистрация магазина: https://auth.robokassa.ru/Merchant/Registration
2. Настройки → Технические настройки:
   - **Result URL**: `https://your-app.replit.app/api/webhooks/robokassa/result`
   - **Success URL**: `https://your-app.replit.app/api/webhooks/robokassa/success`
   - **Fail URL**: `https://your-app.replit.app/api/webhooks/robokassa/fail`
3. Метод POST, Алгоритм MD5
4. Получить Password #1 и Password #2

---

### 🤖 AI интеграции

```bash
# OpenAI API (для блога)
OPENAI_API_KEY=sk-proj-...                  # ⚠️ ОБЯЗАТЕЛЬНО
OPENAI_MODEL=gpt-4o                         # Модель (default: gpt-4o)
OPENAI_MAX_TOKENS=7000                      # Лимит токенов (default: 7000)

# Отключение OpenAI анализа (для ФЗ-152)
DISABLE_OPENAI_ANALYSIS=true                # Отключает анализ ответов операторов
```

**⚠️ Важно для ФЗ-152:**
- `DISABLE_OPENAI_ANALYSIS=true` — обязательно для соблюдения российских норм
- OpenAI используется ТОЛЬКО для генерации блога
- Персональные данные НЕ отправляются в OpenAI

---

### 👤 OAuth интеграции

```bash
# Replit OAuth (встроенная аутентификация)
ISSUER_URL=https://replit.com/              # OAuth провайдер

# ESIA (Госуслуги) - опционально
ESIA_CLIENT_ID=your-client-id               # Будущая интеграция
ESIA_CLIENT_SECRET=your-client-secret

# Sberbank ID - опционально
SBERBANK_CLIENT_ID=your-client-id           # Будущая интеграция
SBERBANK_CLIENT_SECRET=your-client-secret
```

---

### 📮 Роскомнадзор (для жалоб)

```bash
# Email для эскалации в РКН
ROSKOMNADZOR_EMAIL=pd@rkn.gov.ru            # Email Роскомнадзора
```

---

## 🛠️ Настройка внешних сервисов

### 1. Mailganer.ru (Email провайдер)

**Шаги:**
1. Регистрация на https://mailganer.ru
2. Создать API ключ: Личный кабинет → API
3. Настроить домен для отправки писем
4. Добавить `MAILGANER_API_KEY` в Secrets

**Проверка:**
```bash
curl -X POST https://api.samotpravil.com/api/v1/email/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","text":"Test"}'
```

---

### 2. Robokassa (Платежи)

**Шаги:**
1. Регистрация магазина: https://auth.robokassa.ru
2. Технические настройки → Webhook URLs:
   ```
   Result URL:  https://your-app.replit.app/api/webhooks/robokassa/result
   Success URL: https://your-app.replit.app/api/webhooks/robokassa/success
   Fail URL:    https://your-app.replit.app/api/webhooks/robokassa/fail
   ```
3. Метод: **POST**, Алгоритм: **MD5**
4. Получить Password #1 и Password #2
5. Добавить в Secrets:
   - `ROBOKASSA_MERCHANT_LOGIN`
   - `ROBOKASSA_PASSWORD_1`
   - `ROBOKASSA_PASSWORD_2`

**Тестовый режим:**
```bash
ROBOKASSA_TEST_MODE=true
ROBOKASSA_TEST_PASSWORD_1=test123
ROBOKASSA_TEST_PASSWORD_2=test456
```

---

### 3. OpenAI API (Генерация контента)

**Шаги:**
1. Регистрация: https://platform.openai.com
2. Создать API ключ: API Keys → Create new secret key
3. Пополнить баланс (минимум $5)
4. Добавить `OPENAI_API_KEY` в Secrets

**Проверка:**
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_KEY"
```

---

## 🚀 Деплой на Replit

### Шаг 1: Настройка Secrets

Добавьте все переменные через **Secrets** (Tools → Secrets):

```bash
# Минимально необходимые для запуска:
DATABASE_URL=postgresql://...
SESSION_SECRET=...
EVIDENCE_SERVER_SECRET=...
MAILGANER_API_KEY=...
ROBOKASSA_MERCHANT_LOGIN=...
ROBOKASSA_PASSWORD_1=...
ROBOKASSA_PASSWORD_2=...
OPENAI_API_KEY=...
APP_URL=https://your-app.replit.app
```

---

### Шаг 2: Подготовка базы данных

```bash
# Применить миграции
npm run db:push

# Проверка подключения
npm run db:studio  # Откроет Drizzle Studio
```

---

### Шаг 3: Проверка production сборки

```bash
# Установка зависимостей
npm install

# Production сборка
NODE_ENV=production npm run build

# Запуск
npm start
```

---

### Шаг 4: Deploy на Replit

1. **Publish** → Configure deployment
2. Выберите тип: **Web Service**
3. Build command: `npm run build`
4. Start command: `npm start`
5. Port: `5000`
6. **Deploy!**

---

## ✅ Проверка работоспособности

### Health Check Endpoints

```bash
# Проверка всех сервисов
curl https://your-app.replit.app/api/health

# Ожидаемый ответ:
{
  "status": "healthy",
  "timestamp": "2025-10-13T16:00:00.000Z",
  "checks": {
    "database": { "status": "healthy", "responseTime": 50 },
    "email": { "status": "healthy", "responseTime": 150 },
    "storage": { "status": "healthy", "responseTime": 30 },
    "webserver": { "status": "healthy", "responseTime": 0 },
    "compliance": { "status": "healthy", "responseTime": 0 }
  }
}
```

---

### Тестирование ключевых функций

**1. Аутентификация:**
```bash
# Регистрация
curl -X POST https://your-app.replit.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","fullName":"Test User"}'

# Логин
curl -X POST https://your-app.replit.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**2. Email отправка:**
```bash
# Проверка SMTP
curl https://your-app.replit.app/api/email/test
```

**3. Платежи:**
```bash
# Создание платежа
curl -X POST https://your-app.replit.app/api/payments/create \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=YOUR_SESSION" \
  -d '{"planId":"basic","amount":990}'
```

---

## 📝 Production Checklist

### Безопасность ✅
- [ ] SSL сертификат активен (HTTPS)
- [ ] `SESSION_SECRET` сгенерирован случайно (64+ символа)
- [ ] `EVIDENCE_SERVER_SECRET` надежный (32+ символа)
- [ ] Rate limiting включен (20 req/15min для auth)
- [ ] Helmet security headers активны
- [ ] CORS настроен правильно

### Environment Variables ✅
- [ ] `DATABASE_URL` настроен
- [ ] `APP_URL` указывает на production домен
- [ ] `MAILGANER_API_KEY` добавлен
- [ ] `ROBOKASSA_*` ключи добавлены
- [ ] `OPENAI_API_KEY` добавлен
- [ ] `DISABLE_OPENAI_ANALYSIS=true` для ФЗ-152

### Webhooks ✅
- [ ] Robokassa Result URL работает
- [ ] Robokassa Success/Fail URL работает
- [ ] Mailganer webhook обрабатывается
- [ ] Все webhook endpoints на HTTPS

### Автоматизация ✅
- [ ] Subscription manager работает (6 часов)
- [ ] Email automation запущен (6 часов)
- [ ] Blog scheduler работает (30 минут)
- [ ] Health check сервис работает (60 секунд)

### База данных ✅
- [ ] Миграции применены (`npm run db:push`)
- [ ] Demo данные удалены (production)
- [ ] Бэкапы настроены
- [ ] Connection pooling настроен

### Тестирование ✅
- [ ] Health check возвращает 200 OK
- [ ] Регистрация работает
- [ ] Email отправка работает
- [ ] Платежи обрабатываются
- [ ] Webhooks принимаются

### Мониторинг ✅
- [ ] Логи пишутся корректно
- [ ] Error tracking настроен
- [ ] Performance monitoring активен
- [ ] Alerts настроены для критичных ошибок

### Юридическое ✅
- [ ] Политика конфиденциальности опубликована
- [ ] Пользовательское соглашение опубликовано
- [ ] Данные не выходят за пределы России (ФЗ-152)
- [ ] OpenAI используется только для блога
- [ ] ESIA интеграция готова (опционально)

---

## 🆘 Troubleshooting

### Проблема: Webhooks не работают

**Решение:**
1. Убедитесь, что `APP_URL` указывает на HTTPS домен
2. Проверьте логи: `/api/webhooks/robokassa/result` получает запросы
3. Проверьте MD5 подпись в Robokassa

### Проблема: Email не отправляются

**Решение:**
1. Проверьте `MAILGANER_API_KEY` в Secrets
2. Проверьте баланс на Mailganer.ru
3. Проверьте логи: `[express] POST /api/email/send`

### Проблема: База данных недоступна

**Решение:**
1. Проверьте `DATABASE_URL` корректный
2. Убедитесь, что `sslmode=require` есть в URL
3. Выполните: `npm run db:push --force`

### Проблема: OpenAI ошибки

**Решение:**
1. Проверьте баланс OpenAI
2. Убедитесь, что `OPENAI_API_KEY` валидный
3. Проверьте лимит токенов: `OPENAI_MAX_TOKENS=7000`

---

## 📞 Поддержка

- **Документация**: См. PROJECT_STATUS_REPORT.md
- **User Journey**: См. USER_JOURNEY.md
- **Robokassa**: См. ROBOKASSA_INTEGRATION.md
- **Логи**: `/tmp/logs/` на сервере

---

## 🎉 Готово к запуску!

После выполнения всех шагов:
1. Откройте приложение: `https://your-app.replit.app`
2. Проверьте health: `https://your-app.replit.app/api/health`
3. Зарегистрируйтесь и протестируйте все функции

**Платформа готова защищать персональные данные россиян! 🇷🇺**

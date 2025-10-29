# 🔐 ПОЛНАЯ ИНСТРУКЦИЯ: ЗАЩИЩЕННАЯ СИСТЕМА РЕГИСТРАЦИИ И АУТЕНТИФИКАЦИИ

## 📋 Оглавление
1. [Критические уязвимости и ошибки](#критические-уязвимости-и-ошибки)
2. [Архитектура безопасности](#архитектура-безопасности)
3. [Хеширование паролей](#хеширование-паролей)
4. [Email верификация](#email-верификация)
5. [Session management](#session-management)
6. [Rate limiting](#rate-limiting)
7. [OAuth интеграция](#oauth-интеграция)
8. [HMAC токены](#hmac-токены)
9. [Защита от атак](#защита-от-атак)
10. [Тестирование безопасности](#тестирование-безопасности)

---

## 🚨 КРИТИЧЕСКИЕ УЯЗВИМОСТИ И ОШИБКИ

### ❌ Уязвимость #1: Хранение паролей в открытом виде

**НИКОГДА НЕ ДЕЛАЙТЕ ТАК:**
```typescript
// ❌ КАТАСТРОФА - пароль в открытом виде!
await storage.createUser({
  email: email,
  password: password  // ❌ НЕТ!!!
});
```

**Почему критично:**
- База данных взломана = все пароли скомпрометированы
- Админы видят пароли пользователей
- Пользователи используют один пароль везде = взлом всех аккаунтов

**Правильно:**
```typescript
// ✅ ПРАВИЛЬНО - bcrypt хеширование
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds
await storage.createUser({
  email: email,
  passwordHash: hashedPassword  // ✅ Хеш, а не пароль!
});
```

---

### ❌ Уязвимость #2: Слабое хеширование (менее 10 rounds)

**Что делали неправильно:**
```typescript
// ❌ ОПАСНО - слишком мало rounds
const hash = await bcrypt.hash(password, 4);  // ❌ Легко взломать!
const hash = await bcrypt.hash(password, 8);  // ❌ Всё ещё слабо!
```

**Правильно:**
```typescript
// ✅ БЕЗОПАСНО - минимум 12 rounds
const hash = await bcrypt.hash(password, 12);  // ✅ Золотой стандарт

// ✅ Для особо важных данных - 14 rounds
const hash = await bcrypt.hash(adminPassword, 14);
```

**Таблица времени взлома:**

| Rounds | Время хеширования | Время брутфорса (8 символов) |
|--------|-------------------|------------------------------|
| 4 | ~1ms | ~1 день |
| 8 | ~10ms | ~1 год |
| 10 | ~50ms | ~10 лет |
| **12** | **~200ms** | **~100 лет** ✅ |
| 14 | ~1s | ~1000 лет |

---

### ❌ Уязвимость #3: Timing Attack на проверку токенов

**Что делали неправильно:**
```typescript
// ❌ УЯЗВИМО к timing attack!
if (receivedToken === expectedToken) {
  return true;
}

// ❌ УЯЗВИМО к timing attack!
if (receivedSignature === expectedSignature) {
  return true;
}
```

**Почему опасно:**
- Оператор `===` сравнивает байт за байтом
- Останавливается на первом несовпадении
- Атакующий измеряет время ответа → узнает правильные байты

**Правильно:**
```typescript
// ✅ ЗАЩИЩЕНО от timing attack
import crypto from 'crypto';

const receivedBuffer = Buffer.from(receivedToken, 'hex');
const expectedBuffer = Buffer.from(expectedToken, 'hex');

// Constant-time сравнение
if (receivedBuffer.length !== expectedBuffer.length) {
  return false;
}

if (!crypto.timingSafeEqual(receivedBuffer, expectedBuffer)) {
  return false;
}

return true;
```

---

### ❌ Уязвимость #4: Токены верификации БЕЗ хеширования

**Что делали неправильно:**
```typescript
// ❌ ОПАСНО - токен в открытом виде в БД
const token = crypto.randomBytes(32).toString('hex');
await storage.updateUser(userId, {
  emailVerificationToken: token  // ❌ Если БД взломана - токены скомпрометированы!
});
```

**Правильно:**
```typescript
// ✅ БЕЗОПАСНО - токен хешируется перед сохранением
const plainToken = crypto.randomBytes(32).toString('hex');
const hashedToken = await bcrypt.hash(plainToken, 12);

await storage.updateUser(userId, {
  emailVerificationToken: hashedToken  // ✅ Хеш в БД
});

// Отправить plainToken пользователю по email
sendEmail(userEmail, verificationUrl + plainToken);
```

**Как это работает:**
1. Генерируем случайный токен (plain)
2. Хешируем bcrypt
3. **Хеш сохраняем в БД**
4. **Plain токен отправляем пользователю**
5. При проверке: `bcrypt.compare(receivedToken, hashedToken)`

---

### ❌ Уязвимость #5: Session без secure настроек

**Что делали неправильно:**
```typescript
// ❌ ОПАСНО - куки без защиты
app.use(session({
  secret: 'my-secret',
  cookie: {
    httpOnly: false,  // ❌ JavaScript может украсть!
    secure: false,    // ❌ Передается по HTTP!
    sameSite: 'none'  // ❌ CSRF атаки!
  }
}));
```

**Правильно:**
```typescript
// ✅ ЗАЩИЩЕНО - правильные настройки cookie
app.use(session({
  secret: process.env.SESSION_SECRET,  // ✅ Из переменных окружения
  cookie: {
    httpOnly: true,      // ✅ JavaScript НЕ может украсть
    secure: false,       // ✅ false для dev, true для production
    sameSite: 'lax',     // ✅ Защита от CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000  // ✅ 1 неделя
  },
  resave: false,
  saveUninitialized: true,
  name: 'connect.sid'
}));
```

**В production:**
```typescript
cookie: {
  httpOnly: true,
  secure: true,        // ✅ Только HTTPS в production!
  sameSite: 'strict',  // ✅ Максимальная защита
  maxAge: 7 * 24 * 60 * 60 * 1000
}
```

---

### ❌ Уязвимость #6: Отсутствие Rate Limiting

**Проблема:**
```typescript
// ❌ ОПАСНО - нет защиты от брутфорса
app.post('/api/auth/login', async (req, res) => {
  // Атакующий может пробовать миллионы паролей в секунду!
  const user = await verifyPassword(email, password);
  // ...
});
```

**Правильно:**
```typescript
// ✅ ЗАЩИЩЕНО - rate limiting
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 минут
  max: 5,                     // Максимум 5 попыток
  message: {
    error: 'Слишком много попыток входа. Попробуйте через 15 минут.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Блокировка по IP + email комбинации
  keyGenerator: (req) => {
    return `${req.ip}-${req.body.email || 'unknown'}`;
  }
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  // Максимум 5 попыток за 15 минут
  const user = await verifyPassword(email, password);
  // ...
});
```

---

### ❌ Уязвимость #7: Уязвимые сообщения об ошибках

**Что делали неправильно:**
```typescript
// ❌ ОПАСНО - раскрывает информацию
if (!user) {
  return res.status(404).json({ 
    error: "Пользователь с таким email не найден"  // ❌ Атакующий узнаёт, что email НЕ зарегистрирован!
  });
}

if (!bcrypt.compare(password, user.passwordHash)) {
  return res.status(401).json({
    error: "Неверный пароль"  // ❌ Атакующий узнаёт, что email СУЩЕСТВУЕТ!
  });
}
```

**Правильно:**
```typescript
// ✅ БЕЗОПАСНО - одинаковое сообщение для всех ошибок
const user = await storage.verifyPassword(email, password);

if (!user) {
  return res.status(401).json({
    success: false,
    message: "Неверный email или пароль"  // ✅ Неопределенность!
  });
}
```

---

### ❌ Уязвимость #8: Отсутствие валидации входных данных

**Что делали неправильно:**
```typescript
// ❌ ОПАСНО - нет валидации
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  // Что если email = "'; DROP TABLE users; --"?
  // Что если password = ""?
  await createUser(email, password);  // ❌ SQL Injection!
});
```

**Правильно:**
```typescript
// ✅ ЗАЩИЩЕНО - Zod валидация
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string()
    .email('Некорректный email')
    .max(255, 'Email слишком длинный'),
  password: z.string()
    .min(8, 'Пароль должен быть минимум 8 символов')
    .max(128, 'Пароль слишком длинный')
    .regex(/[A-Z]/, 'Пароль должен содержать заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать цифру'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword']
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);  // ✅ Валидация!
    // Данные безопасны
    await createUser(validatedData.email, validatedData.password);
  } catch (error) {
    return res.status(400).json({ errors: error.errors });
  }
});
```

---

## 🏗️ АРХИТЕКТУРА БЕЗОПАСНОСТИ

### Многоуровневая защита

```
┌─────────────────────────────────────────────┐
│   1. FRONTEND VALIDATION (клиент)          │
│   - Быстрая обратная связь пользователю    │
│   - НЕ ЯВЛЯЕТСЯ безопасностью!             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   2. RATE LIMITING (middleware)             │
│   - Защита от брутфорса                    │
│   - express-rate-limit                     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   3. INPUT VALIDATION (backend)             │
│   - Zod схемы                              │
│   - Проверка типов, длины, формата        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   4. BUSINESS LOGIC (обработка)             │
│   - Проверка существования пользователя    │
│   - Email уникальность                     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   5. PASSWORD HASHING (bcrypt)              │
│   - 12 rounds для обычных пользователей    │
│   - 14 rounds для админов                  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   6. DATABASE (PostgreSQL)                  │
│   - Хешированные пароли                    │
│   - Хешированные токены                    │
│   - Prepared statements (защита от SQL Inj)│
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   7. SESSION MANAGEMENT (PostgreSQL)        │
│   - Secure cookies                         │
│   - Session store в БД                     │
│   - Автоматическая чистка старых сессий   │
└─────────────────────────────────────────────┘
```

---

## 🔒 ХЕШИРОВАНИЕ ПАРОЛЕЙ

### Правильная реализация bcrypt

**1. Регистрация:**
```typescript
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Валидация пароля
const passwordSchema = z.string()
  .min(8, 'Минимум 8 символов')
  .max(128, 'Максимум 128 символов')
  .regex(/[A-Z]/, 'Должна быть заглавная буква')
  .regex(/[a-z]/, 'Должна быть строчная буква')
  .regex(/[0-9]/, 'Должна быть цифра')
  .regex(/[^A-Za-z0-9]/, 'Должен быть спецсимвол');

app.post('/api/auth/register', async (req, res) => {
  try {
    // 1. Валидация
    const validatedData = registerSchema.parse(req.body);
    
    // 2. Проверка уникальности email
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Пользователь с таким email уже существует"
      });
    }
    
    // 3. Хеширование пароля (12 rounds)
    const passwordHash = await bcrypt.hash(validatedData.password, 12);
    
    // 4. Создание пользователя
    const user = await storage.createUser({
      email: validatedData.email,
      passwordHash: passwordHash  // ✅ Сохраняем ХЕШ, а не пароль
    });
    
    // 5. Генерация токена верификации
    const plainToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(plainToken, 12);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа
    
    await storage.updateUser(user.id, {
      emailVerificationToken: hashedToken,
      emailVerificationExpires: expiresAt
    });
    
    // 6. Отправка email
    const verificationUrl = `${APP_URL}/verify-email?token=${plainToken}&email=${email}`;
    await sendVerificationEmail(user.email, verificationUrl);
    
    res.status(201).json({
      success: true,
      message: "Регистрация успешна. Проверьте email для подтверждения."
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: "Ошибка регистрации"
    });
  }
});
```

**2. Вход (Login):**
```typescript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Слишком много попыток входа' }
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    // 1. Валидация
    const validatedData = loginSchema.parse(req.body);
    
    // 2. Поиск пользователя по email
    const user = await storage.getUserByEmail(validatedData.email);
    if (!user || !user.passwordHash) {
      // ✅ Не раскрываем, существует ли пользователь
      return res.status(401).json({
        success: false,
        message: "Неверный email или пароль"
      });
    }
    
    // 3. Проверка пароля (constant-time)
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.passwordHash
    );
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Неверный email или пароль"
      });
    }
    
    // 4. Проверка верификации email
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Подтвердите email для входа",
        needsVerification: true
      });
    }
    
    // 5. Создание сессии
    req.session.userId = user.id;
    req.session.email = user.email;
    
    // 6. Явное сохранение сессии
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({
          success: false,
          message: "Ошибка создания сессии"
        });
      }
      
      res.json({
        success: true,
        message: "Вход выполнен успешно",
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified
        }
      });
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: "Ошибка входа"
    });
  }
});
```

---

## 📧 EMAIL ВЕРИФИКАЦИЯ

### Безопасная система верификации

**1. Генерация токена:**
```typescript
// ✅ Правильная генерация и хранение токена
const plainToken = crypto.randomBytes(32).toString('hex');  // 64 hex символа
const hashedToken = await bcrypt.hash(plainToken, 12);       // Хеш для БД
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа

await storage.updateUser(userId, {
  emailVerificationToken: hashedToken,  // ✅ Хеш в БД
  emailVerificationExpires: expiresAt
});

// Отправить plainToken пользователю
const verificationUrl = `${APP_URL}/verify-email?token=${plainToken}&email=${email}`;
await sendEmail(email, verificationUrl);
```

**2. Проверка токена:**
```typescript
app.post('/api/auth/verify-email', async (req, res) => {
  try {
    // 1. Валидация входных данных
    const validatedData = verifyEmailSchema.parse(req.body);
    
    // 2. Поиск пользователя
    const user = await storage.getUserByEmail(validatedData.email);
    
    if (!user || !user.emailVerificationToken) {
      return res.status(400).json({
        success: false,
        message: "Неверный токен подтверждения"
      });
    }
    
    // 3. Проверка срока действия
    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Токен подтверждения истек. Запросите новый токен"
      });
    }
    
    // 4. Проверка токена (constant-time через bcrypt)
    const isValidToken = await bcrypt.compare(
      validatedData.token,
      user.emailVerificationToken
    );
    
    if (!isValidToken) {
      return res.status(400).json({
        success: false,
        message: "Неверный токен подтверждения"
      });
    }
    
    // 5. Подтверждение email и очистка токена
    await storage.updateUser(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    });
    
    res.json({
      success: true,
      message: "Email подтвержден успешно"
    });
    
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: "Ошибка подтверждения email"
    });
  }
});
```

**3. Повторная отправка токена:**
```typescript
const resendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 час
  max: 3,                     // Максимум 3 повторные отправки
  message: { error: 'Слишком много запросов на повторную отправку' }
});

app.post('/api/auth/resend-verification', resendLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await storage.getUserByEmail(email);
    
    if (!user) {
      // ✅ Не раскрываем, существует ли пользователь
      return res.json({
        success: true,
        message: "Если email зарегистрирован, письмо будет отправлено"
      });
    }
    
    if (user.emailVerified) {
      return res.json({
        success: true,
        message: "Email уже подтвержден"
      });
    }
    
    // Генерация нового токена
    const plainToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(plainToken, 12);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    await storage.updateUser(user.id, {
      emailVerificationToken: hashedToken,
      emailVerificationExpires: expiresAt
    });
    
    const verificationUrl = `${APP_URL}/verify-email?token=${plainToken}&email=${email}`;
    await sendEmail(email, verificationUrl);
    
    res.json({
      success: true,
      message: "Письмо с подтверждением отправлено"
    });
    
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: "Ошибка отправки письма"
    });
  }
});
```

---

## 🍪 SESSION MANAGEMENT

### PostgreSQL-based Session Store

**1. Настройка сессий:**
```typescript
import session from 'express-session';
import connectPg from 'connect-pg-simple';

const PgStore = connectPg(session);

const sessionStore = new PgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: false,  // Таблица уже создана через Drizzle
  ttl: 7 * 24 * 60 * 60 * 1000, // 1 неделя
  tableName: 'sessions'
});

app.use(session({
  secret: process.env.SESSION_SECRET,  // ⚠️ ОБЯЗАТЕЛЬНО из env!
  store: sessionStore,
  resave: false,
  saveUninitialized: true,  // ✅ Сохранять пустые сессии для cookies
  name: 'connect.sid',      // Стандартное имя
  cookie: {
    httpOnly: true,         // ✅ JavaScript не может украсть
    secure: false,          // false для dev, true для production
    sameSite: 'lax',        // ✅ Защита от CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000  // 1 неделя
  }
}));
```

**2. Production настройки:**
```typescript
// В production обязательно:
app.set('trust proxy', 1);  // Trust first proxy (Replit, Nginx, etc.)

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
  name: 'connect.sid',
  cookie: {
    httpOnly: true,
    secure: true,           // ✅ Только HTTPS в production!
    sameSite: 'strict',     // ✅ Максимальная защита от CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000
  },
  proxy: true  // ✅ Доверять X-Forwarded-* headers
}));
```

**3. Схема БД для сессий:**
```typescript
// shared/schema.ts
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire", { mode: "date" }).notNull()
});

// Индекс для автоматической очистки
export const sessionsExpireIdx = index("IDX_session_expire").on(sessions.expire);
```

**4. Middleware для защиты роутов:**
```typescript
// Проверка аутентификации
function isAuthenticated(req: any, res: any, next: any) {
  if (req.session?.userId) {
    return next();
  }
  res.status(401).json({ 
    success: false,
    message: "Требуется авторизация" 
  });
}

// Проверка роли администратора
async function isAdmin(req: any, res: any, next: any) {
  const userId = req.session?.userId;
  
  if (!userId) {
    return res.status(401).json({ 
      success: false,
      message: "Требуется авторизация" 
    });
  }
  
  const user = await storage.getUserById(userId);
  
  if (!user || !user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Доступ запрещен. Требуются права администратора."
    });
  }
  
  req.adminUser = user;
  next();
}

// Использование
app.get('/api/dashboard', isAuthenticated, async (req, res) => {
  // Защищенный роут
});

app.get('/api/admin/users', isAdmin, async (req, res) => {
  // Только для админов
});
```

**5. Logout:**
```typescript
app.post('/api/auth/logout', isAuthenticated, async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({
        success: false,
        message: "Ошибка выхода"
      });
    }
    
    res.clearCookie('connect.sid');
    res.json({
      success: true,
      message: "Выход выполнен успешно"
    });
  });
});
```

---

## 🚫 RATE LIMITING

### Многоуровневая защита от брутфорса

**1. Глобальный rate limiter:**
```typescript
import rateLimit from 'express-rate-limit';

// Общий лимит для всех API endpoints
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 минут
  max: 100,                   // 100 запросов
  message: {
    error: 'Слишком много запросов. Попробуйте позже.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', globalLimiter);
```

**2. Login rate limiter (строже):**
```typescript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // Только 5 попыток за 15 минут
  message: {
    error: 'Слишком много попыток входа. Попробуйте через 15 минут.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Комбинация IP + email для точной блокировки
  keyGenerator: (req) => {
    return `login-${req.ip}-${req.body.email || 'unknown'}`;
  },
  // Пропускать успешные запросы
  skipSuccessfulRequests: true
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  // ...
});
```

**3. Registration rate limiter:**
```typescript
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 час
  max: 3,                     // Максимум 3 регистрации
  message: {
    error: 'Слишком много регистраций. Попробуйте позже.'
  },
  keyGenerator: (req) => {
    return `register-${req.ip}`;
  }
});

app.post('/api/auth/register', registerLimiter, async (req, res) => {
  // ...
});
```

**4. Password reset rate limiter:**
```typescript
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 час
  max: 3,                     // Максимум 3 запроса на сброс
  message: {
    error: 'Слишком много запросов на сброс пароля.'
  }
});

app.post('/api/auth/reset-password', passwordResetLimiter, async (req, res) => {
  // ...
});
```

---

## 🔐 HMAC ТОКЕНЫ

### Безопасные токены для критичных действий

**1. Генерация HMAC токена:**
```typescript
import crypto from 'crypto';

export function generateHMACToken(
  actionId: string,
  actionType: string,
  expiresAt: Date
): string {
  const hmacSecret = process.env.HMAC_SECRET;
  if (!hmacSecret) {
    throw new Error('HMAC_SECRET не установлен');
  }

  // Payload
  const payload = {
    actionId,
    actionType,
    expiresAt: Math.floor(expiresAt.getTime() / 1000)
  };

  const payloadString = JSON.stringify(payload);
  
  // HMAC подпись
  const hmac = crypto.createHmac('sha256', hmacSecret);
  hmac.update(payloadString);
  const signature = hmac.digest('hex');

  // Комбинация payload + signature
  const tokenData = {
    payload: payloadString,
    signature
  };

  // Base64 кодирование
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
}
```

**2. Проверка HMAC токена:**
```typescript
export function verifyHMACToken(token: string): any | null {
  try {
    const hmacSecret = process.env.HMAC_SECRET;
    if (!hmacSecret) {
      return null;
    }

    // Декодирование
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const tokenData = JSON.parse(decoded);

    if (!tokenData.payload || !tokenData.signature) {
      return null;
    }

    // Проверка подписи
    const hmac = crypto.createHmac('sha256', hmacSecret);
    hmac.update(tokenData.payload);
    const expectedSignature = hmac.digest('hex');

    // ✅ Constant-time сравнение
    const signatureBuffer = Buffer.from(tokenData.signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    
    if (signatureBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return null;
    }

    // Парсинг и проверка срока действия
    const payload = JSON.parse(tokenData.payload);
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.expiresAt < now) {
      console.error('Токен истек');
      return null;
    }

    return payload;

  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
```

**3. Использование:**
```typescript
// Генерация токена для подтверждения критичного действия
app.post('/api/admin/delete-user/:userId', isAdmin, async (req, res) => {
  const { userId } = req.params;
  
  // Генерация токена на 30 дней
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const token = generateHMACToken(userId, 'delete_user', expiresAt);
  
  // Отправка email с токеном подтверждения
  const confirmationUrl = `${APP_URL}/admin/confirm-delete?token=${token}`;
  await sendEmail(adminEmail, confirmationUrl);
  
  res.json({
    success: true,
    message: "Письмо с подтверждением отправлено"
  });
});

// Подтверждение действия
app.post('/api/admin/confirm-delete', isAdmin, async (req, res) => {
  const { token } = req.body;
  
  const payload = verifyHMACToken(token);
  
  if (!payload) {
    return res.status(400).json({
      success: false,
      message: "Неверный или истекший токен"
    });
  }
  
  if (payload.actionType !== 'delete_user') {
    return res.status(400).json({
      success: false,
      message: "Неверный тип действия"
    });
  }
  
  // Выполнение действия
  await storage.deleteUser(payload.actionId);
  
  res.json({
    success: true,
    message: "Пользователь удален"
  });
});
```

---

## 🛡️ ЗАЩИТА ОТ АТАК

### 1. SQL Injection

**Защита через ORM:**
```typescript
// ✅ ЗАЩИЩЕНО - Drizzle ORM использует prepared statements
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, email))  // ✅ Автоматическое экранирование
  .limit(1);

// ❌ ОПАСНО - raw SQL без параметров
const user = await db.execute(
  `SELECT * FROM users WHERE email = '${email}'`  // ❌ SQL Injection!
);

// ✅ ЗАЩИЩЕНО - raw SQL с параметрами
const user = await db.execute(
  sql`SELECT * FROM users WHERE email = ${email}`  // ✅ Параметризованный запрос
);
```

### 2. XSS (Cross-Site Scripting)

**Защита через DOMPurify:**
```typescript
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

app.post('/api/profile/update', isAuthenticated, async (req, res) => {
  const { bio } = req.body;
  
  // ✅ Очистка HTML от опасных тегов
  const cleanBio = purify.sanitize(bio, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
  
  await storage.updateProfile(req.session.userId, {
    bio: cleanBio
  });
  
  res.json({ success: true });
});
```

### 3. CSRF (Cross-Site Request Forgery)

**Защита через SameSite cookies:**
```typescript
// ✅ SameSite='lax' или 'strict' блокирует CSRF
cookie: {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',  // ✅ Защита от CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000
}
```

### 4. Clickjacking

**Защита через Helmet:**
```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]  // ✅ Блокирует iframe
    }
  },
  xFrameOptions: { action: 'deny' }  // ✅ X-Frame-Options: DENY
}));
```

### 5. Brute Force

**Защита через прогрессивные задержки:**
```typescript
const loginAttempts = new Map<string, number>();

app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  const attempts = loginAttempts.get(email) || 0;
  
  // Прогрессивная задержка
  const delay = Math.min(attempts * 1000, 10000);  // До 10 секунд
  
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  const user = await verifyPassword(email, password);
  
  if (!user) {
    // Увеличить счетчик попыток
    loginAttempts.set(email, attempts + 1);
    return res.status(401).json({
      success: false,
      message: "Неверный email или пароль"
    });
  }
  
  // Сбросить счетчик при успехе
  loginAttempts.delete(email);
  
  // ...
});

// Очистка старых записей каждые 15 минут
setInterval(() => {
  loginAttempts.clear();
}, 15 * 60 * 1000);
```

---

## 🧪 ТЕСТИРОВАНИЕ БЕЗОПАСНОСТИ

### Чеклист безопасности

#### Пароли
- [ ] Пароли хешируются с bcrypt (минимум 12 rounds)
- [ ] Пароли НЕ хранятся в открытом виде
- [ ] Пароли НЕ логируются
- [ ] Пароли НЕ возвращаются в API ответах
- [ ] Минимум 8 символов + сложность
- [ ] Нет ограничения на максимальную длину (до 128 символов)

#### Токены
- [ ] Токены генерируются криптографически безопасно (crypto.randomBytes)
- [ ] Токены хешируются перед сохранением в БД
- [ ] Токены имеют срок действия
- [ ] Старые токены автоматически удаляются
- [ ] Сравнение токенов через timingSafeEqual
- [ ] HMAC токены для критичных действий

#### Сессии
- [ ] httpOnly=true (защита от XSS)
- [ ] secure=true в production (только HTTPS)
- [ ] sameSite='lax' или 'strict' (защита от CSRF)
- [ ] Сессии хранятся в БД (не в памяти)
- [ ] Автоматическая очистка старых сессий
- [ ] Logout корректно удаляет сессию

#### Rate Limiting
- [ ] Глобальный rate limiter на /api/*
- [ ] Строгий rate limiter на /login (5 попыток)
- [ ] Rate limiter на /register
- [ ] Rate limiter на /password-reset
- [ ] Rate limiter на /resend-verification

#### Валидация
- [ ] Zod валидация всех входных данных
- [ ] Email проверяется на формат
- [ ] Пароль проверяется на сложность
- [ ] Длина строк ограничена
- [ ] SQL Injection невозможен (ORM)
- [ ] XSS невозможен (DOMPurify)

#### Сообщения об ошибках
- [ ] Не раскрывают существование пользователя
- [ ] Одинаковые для всех типов ошибок входа
- [ ] Не содержат технических деталей
- [ ] Не содержат stack traces в production

#### Headers
- [ ] Helmet настроен
- [ ] CSP настроен
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Strict-Transport-Security в production

---

## 📝 ИТОГОВЫЙ CHECKLIST

### Environment Variables
```bash
# Обязательные переменные
SESSION_SECRET=random-64-char-string     # openssl rand -base64 48
HMAC_SECRET=random-32-byte-hex           # openssl rand -hex 32
DATABASE_URL=postgresql://...            # PostgreSQL connection
APP_URL=https://your-app.replit.app      # Production URL

# Email (Mailganer)
MAILGANER_SMTP_HOST=api.samotpravil.ru
MAILGANER_SMTP_PORT=1126
MAILGANER_SMTP_LOGIN=your-login
MAILGANER_SMTP_PASSWORD=your-password
```

### Безопасность
- [ ] Все пароли хешируются (bcrypt, 12 rounds)
- [ ] Все токены хешируются
- [ ] timingSafeEqual для сравнения токенов
- [ ] Rate limiting на всех критичных endpoints
- [ ] Session в PostgreSQL с secure cookies
- [ ] Helmet настроен
- [ ] Zod валидация всех данных
- [ ] Логи НЕ содержат пароли/токены

### База данных
- [ ] Таблица users с passwordHash
- [ ] Таблица sessions
- [ ] Индексы на email (unique)
- [ ] Индексы на sessions.expire
- [ ] Prepared statements (через ORM)

### Email
- [ ] Верификация email работает
- [ ] Токены истекают через 24 часа
- [ ] Повторная отправка с rate limiting
- [ ] HTML шаблоны корректны

### Production
- [ ] secure=true для cookies
- [ ] sameSite='strict'
- [ ] trust proxy настроен
- [ ] HTTPS включен
- [ ] Логирование настроено
- [ ] Мониторинг работает

---

**🎉 Готово! Защищенная система регистрации реализована!**

---

## 📝 История изменений

- **2025-10-29**: Создана подробная инструкция по защищенной аутентификации
- Описаны все критические уязвимости и способы защиты
- Добавлены примеры кода для всех компонентов безопасности
- Включены чеклисты тестирования безопасности

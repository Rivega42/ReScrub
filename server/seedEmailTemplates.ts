import { storage } from './storage';

const defaultEmailTemplates = [
  {
    name: 'welcome_email',
    subject: 'Добро пожаловать в ReScrub!',
    category: 'authentication',
    description: 'Приветственное письмо для новых пользователей',
    isActive: true,
    fromName: 'ReScrub',
    fromEmail: 'noreply@rescrub.ru',
    htmlBody: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Добро пожаловать в ReScrub!</h1>
    </div>
    <div class="content">
      <h2>Здравствуйте, {{firstName}}!</h2>
      <p>Спасибо за регистрацию в ReScrub - вашем надежном защитнике персональных данных.</p>
      <p>Теперь вы можете:</p>
      <ul>
        <li>Сканировать интернет на наличие ваших персональных данных</li>
        <li>Отправлять запросы на удаление данных</li>
        <li>Отслеживать статус всех ваших запросов</li>
        <li>Получать уведомления об утечках данных</li>
      </ul>
      <p>Для начала работы подтвердите ваш email адрес:</p>
      <div style="text-align: center;">
        <a href="{{verificationUrl}}" class="button">Подтвердить Email</a>
      </div>
      <p>Если у вас есть вопросы, напишите нам на support@rescrub.ru</p>
      <div class="footer">
        <p>С уважением,<br>Команда ReScrub</p>
        <p>© 2024 ReScrub. Все права защищены.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
    textBody: `Здравствуйте, {{firstName}}!

Спасибо за регистрацию в ReScrub - вашем надежном защитнике персональных данных.

Теперь вы можете:
- Сканировать интернет на наличие ваших персональных данных
- Отправлять запросы на удаление данных
- Отслеживать статус всех ваших запросов
- Получать уведомления об утечках данных

Для начала работы подтвердите ваш email адрес:
{{verificationUrl}}

Если у вас есть вопросы, напишите нам на support@rescrub.ru

С уважением,
Команда ReScrub

© 2024 ReScrub. Все права защищены.`,
    variables: ['firstName', 'email', 'verificationUrl']
  },
  {
    name: 'email_verification',
    subject: 'Подтвердите ваш email адрес',
    category: 'authentication',
    description: 'Письмо для подтверждения email адреса',
    isActive: true,
    fromName: 'ReScrub',
    fromEmail: 'noreply@rescrub.ru',
    htmlBody: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
    .code-box { background: #f3f4f6; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Подтверждение Email</h1>
    </div>
    <div class="content">
      <p>Здравствуйте, {{firstName}}!</p>
      <p>Для завершения регистрации, пожалуйста, подтвердите ваш email адрес.</p>
      <div class="code-box">{{verificationCode}}</div>
      <p>Или нажмите на кнопку ниже:</p>
      <div style="text-align: center;">
        <a href="{{verificationUrl}}" class="button">Подтвердить Email</a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Ссылка действительна в течение 24 часов. Если вы не регистрировались в ReScrub, проигнорируйте это письмо.</p>
    </div>
  </div>
</body>
</html>`,
    textBody: `Здравствуйте, {{firstName}}!

Для завершения регистрации, пожалуйста, подтвердите ваш email адрес.

Код подтверждения: {{verificationCode}}

Или перейдите по ссылке:
{{verificationUrl}}

Ссылка действительна в течение 24 часов. Если вы не регистрировались в ReScrub, проигнорируйте это письмо.

С уважением,
Команда ReScrub`,
    variables: ['firstName', 'email', 'verificationCode', 'verificationUrl']
  },
  {
    name: 'password_reset',
    subject: 'Восстановление пароля',
    category: 'authentication',
    description: 'Письмо для сброса пароля',
    isActive: true,
    fromName: 'ReScrub Security',
    fromEmail: 'security@rescrub.ru',
    htmlBody: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .button { display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Восстановление пароля</h1>
    </div>
    <div class="content">
      <p>Здравствуйте, {{firstName}}!</p>
      <p>Мы получили запрос на восстановление пароля для вашей учетной записи.</p>
      <div class="warning">
        <strong>Внимание!</strong> Если вы не запрашивали сброс пароля, немедленно свяжитесь с нашей службой поддержки.
      </div>
      <p>Для создания нового пароля нажмите на кнопку ниже:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{resetPasswordUrl}}" class="button">Сбросить пароль</a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Эта ссылка действительна в течение 1 часа.</p>
      <p>По соображениям безопасности, после сброса пароля все активные сессии будут завершены.</p>
    </div>
  </div>
</body>
</html>`,
    textBody: `Здравствуйте, {{firstName}}!

Мы получили запрос на восстановление пароля для вашей учетной записи.

ВНИМАНИЕ! Если вы не запрашивали сброс пароля, немедленно свяжитесь с нашей службой поддержки.

Для создания нового пароля перейдите по ссылке:
{{resetPasswordUrl}}

Эта ссылка действительна в течение 1 часа.

По соображениям безопасности, после сброса пароля все активные сессии будут завершены.

С уважением,
Команда ReScrub`,
    variables: ['firstName', 'email', 'resetPasswordUrl']
  },
  {
    name: 'deletion_request_confirmation',
    subject: 'Запрос на удаление данных отправлен',
    category: 'notifications',
    description: 'Подтверждение отправки запроса на удаление персональных данных',
    isActive: true,
    fromName: 'ReScrub',
    fromEmail: 'notifications@rescrub.ru',
    htmlBody: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .info-box { background: #f0fdf4; border: 1px solid #86efac; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .timeline { margin: 20px 0; padding-left: 20px; border-left: 2px solid #e5e7eb; }
    .timeline-item { margin: 15px 0; position: relative; }
    .timeline-item:before { content: ''; position: absolute; left: -26px; top: 5px; width: 10px; height: 10px; background: #10b981; border-radius: 50%; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Запрос отправлен успешно!</h1>
    </div>
    <div class="content">
      <p>Здравствуйте, {{firstName}}!</p>
      <div class="info-box">
        <strong>✅ Ваш запрос на удаление персональных данных успешно отправлен!</strong><br>
        Организация: <strong>{{brokerName}}</strong><br>
        Дата отправки: <strong>{{requestDate}}</strong>
      </div>
      
      <h3>Что дальше?</h3>
      <div class="timeline">
        <div class="timeline-item">
          <strong>Сейчас</strong><br>
          Запрос отправлен и зарегистрирован
        </div>
        <div class="timeline-item">
          <strong>1-3 дня</strong><br>
          Ожидание подтверждения получения
        </div>
        <div class="timeline-item">
          <strong>До 30 дней</strong><br>
          Обработка и удаление данных
        </div>
        <div class="timeline-item">
          <strong>По завершении</strong><br>
          Уведомление об удалении
        </div>
      </div>
      
      <p>Правовая основа: {{legalBasis}}</p>
      
      <p>Мы будем отслеживать статус вашего запроса и уведомим вас о любых изменениях.</p>
      
      <p style="margin-top: 30px;">Вы можете отслеживать все ваши запросы в личном кабинете.</p>
    </div>
  </div>
</body>
</html>`,
    textBody: `Здравствуйте, {{firstName}}!

✅ Ваш запрос на удаление персональных данных успешно отправлен!

Организация: {{brokerName}}
Дата отправки: {{requestDate}}

Что дальше?
- Сейчас: Запрос отправлен и зарегистрирован
- 1-3 дня: Ожидание подтверждения получения
- До 30 дней: Обработка и удаление данных
- По завершении: Уведомление об удалении

Правовая основа: {{legalBasis}}

Мы будем отслеживать статус вашего запроса и уведомим вас о любых изменениях.

Вы можете отслеживать все ваши запросы в личном кабинете.

С уважением,
Команда ReScrub`,
    variables: ['firstName', 'brokerName', 'requestDate', 'legalBasis']
  },
  {
    name: 'deletion_complete',
    subject: 'Ваши данные успешно удалены',
    category: 'notifications',
    description: 'Уведомление об успешном удалении персональных данных',
    isActive: true,
    fromName: 'ReScrub',
    fromEmail: 'notifications@rescrub.ru',
    htmlBody: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .success-box { background: #f0fdf4; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .stats { display: flex; justify-content: space-around; margin: 30px 0; }
    .stat { text-align: center; }
    .stat-number { font-size: 32px; font-weight: bold; color: #667eea; }
    .stat-label { color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Отличные новости!</h1>
    </div>
    <div class="content">
      <p>Здравствуйте, {{firstName}}!</p>
      
      <div class="success-box">
        <h2 style="color: #10b981; margin: 0;">✅ Данные успешно удалены!</h2>
        <p style="margin: 10px 0 0 0;">{{brokerName}} подтвердил удаление ваших персональных данных</p>
      </div>
      
      <div class="stats">
        <div class="stat">
          <div class="stat-number">{{deletionCount}}</div>
          <div class="stat-label">Всего удалений</div>
        </div>
        <div class="stat">
          <div class="stat-number">100%</div>
          <div class="stat-label">Защищено</div>
        </div>
      </div>
      
      <p>Дата удаления: <strong>{{currentDate}}</strong></p>
      <p>Организация: <strong>{{brokerName}}</strong></p>
      
      <p style="margin-top: 30px;">Благодарим вас за использование ReScrub для защиты ваших персональных данных. Продолжайте регулярно сканировать интернет для обнаружения новых утечек.</p>
      
      <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 30px;">
        <p style="margin: 0;"><strong>Совет:</strong> Рекомендуем проводить сканирование каждые 3 месяца для максимальной защиты.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
    textBody: `Здравствуйте, {{firstName}}!

🎉 Отличные новости!

✅ ДАННЫЕ УСПЕШНО УДАЛЕНЫ!
{{brokerName}} подтвердил удаление ваших персональных данных

Статистика:
- Всего удалений: {{deletionCount}}
- Защищено: 100%

Дата удаления: {{currentDate}}
Организация: {{brokerName}}

Благодарим вас за использование ReScrub для защиты ваших персональных данных. Продолжайте регулярно сканировать интернет для обнаружения новых утечек.

Совет: Рекомендуем проводить сканирование каждые 3 месяца для максимальной защиты.

С уважением,
Команда ReScrub`,
    variables: ['firstName', 'brokerName', 'deletionCount', 'currentDate']
  },
  {
    name: 'subscription_renewal_reminder',
    subject: 'Напоминание о продлении подписки',
    category: 'transactional',
    description: 'Напоминание о скором окончании подписки',
    isActive: true,
    fromName: 'ReScrub',
    fromEmail: 'billing@rescrub.ru',
    htmlBody: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .warning-box { background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .plan-box { border: 2px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Подписка скоро закончится</h1>
    </div>
    <div class="content">
      <p>Здравствуйте, {{firstName}}!</p>
      
      <div class="warning-box">
        <strong>Внимание!</strong> Ваша подписка заканчивается через <strong>{{daysRemaining}} дней</strong>
      </div>
      
      <div class="plan-box">
        <h3 style="margin-top: 0;">Ваш текущий план</h3>
        <p>Тариф: <strong>{{planName}}</strong></p>
        <p>Стоимость: <strong>{{planPrice}}</strong></p>
        <p>Дата окончания: <strong>{{expiryDate}}</strong></p>
      </div>
      
      <p>Продлите подписку сейчас, чтобы не потерять:</p>
      <ul>
        <li>Автоматическое сканирование данных</li>
        <li>Приоритетную обработку запросов</li>
        <li>Расширенные отчеты и аналитику</li>
        <li>Круглосуточную поддержку</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{renewalUrl}}" class="button">Продлить подписку</a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">Если у вас есть вопросы о тарифах или способах оплаты, свяжитесь с нами по адресу billing@rescrub.ru</p>
    </div>
  </div>
</body>
</html>`,
    textBody: `Здравствуйте, {{firstName}}!

⏰ ПОДПИСКА СКОРО ЗАКОНЧИТСЯ

Внимание! Ваша подписка заканчивается через {{daysRemaining}} дней

Ваш текущий план:
- Тариф: {{planName}}
- Стоимость: {{planPrice}}
- Дата окончания: {{expiryDate}}

Продлите подписку сейчас, чтобы не потерять:
- Автоматическое сканирование данных
- Приоритетную обработку запросов
- Расширенные отчеты и аналитику
- Круглосуточную поддержку

Продлить подписку: {{renewalUrl}}

Если у вас есть вопросы о тарифах или способах оплаты, свяжитесь с нами по адресу billing@rescrub.ru

С уважением,
Команда ReScrub`,
    variables: ['firstName', 'planName', 'planPrice', 'expiryDate', 'daysRemaining', 'renewalUrl']
  },
  {
    name: 'payment_receipt',
    subject: 'Квитанция об оплате #{{invoiceNumber}}',
    category: 'transactional',
    description: 'Квитанция об успешной оплате',
    isActive: true,
    fromName: 'ReScrub Billing',
    fromEmail: 'billing@rescrub.ru',
    htmlBody: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .invoice-box { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .invoice-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .invoice-row:last-child { border-bottom: none; font-weight: bold; font-size: 18px; }
    .success-badge { display: inline-block; background: #10b981; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Оплата прошла успешно!</h1>
    </div>
    <div class="content">
      <p>Здравствуйте, {{firstName}}!</p>
      <p>Благодарим вас за оплату. Ваша подписка успешно продлена.</p>
      
      <div class="invoice-box">
        <h3 style="margin-top: 0;">Квитанция #{{invoiceNumber}}</h3>
        <div class="invoice-row">
          <span>Дата оплаты:</span>
          <span>{{paymentDate}}</span>
        </div>
        <div class="invoice-row">
          <span>Тариф:</span>
          <span>{{planName}}</span>
        </div>
        <div class="invoice-row">
          <span>Период:</span>
          <span>{{billingPeriod}}</span>
        </div>
        <div class="invoice-row">
          <span>Способ оплаты:</span>
          <span>{{paymentMethod}}</span>
        </div>
        <div class="invoice-row">
          <span>Сумма:</span>
          <span>{{amount}} ₽</span>
        </div>
      </div>
      
      <p>Статус платежа: <span class="success-badge">ОПЛАЧЕНО</span></p>
      
      <p>Следующий платеж: <strong>{{nextPaymentDate}}</strong></p>
      
      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        Это письмо является официальным подтверждением оплаты. Сохраните его для бухгалтерского учета.
        <br><br>
        Если вам нужны закрывающие документы, обратитесь по адресу documents@rescrub.ru
      </p>
    </div>
  </div>
</body>
</html>`,
    textBody: `Здравствуйте, {{firstName}}!

Благодарим вас за оплату. Ваша подписка успешно продлена.

КВИТАНЦИЯ #{{invoiceNumber}}
========================
Дата оплаты: {{paymentDate}}
Тариф: {{planName}}
Период: {{billingPeriod}}
Способ оплаты: {{paymentMethod}}
Сумма: {{amount}} ₽

Статус платежа: ОПЛАЧЕНО

Следующий платеж: {{nextPaymentDate}}

Это письмо является официальным подтверждением оплаты. Сохраните его для бухгалтерского учета.

Если вам нужны закрывающие документы, обратитесь по адресу documents@rescrub.ru

С уважением,
Команда ReScrub`,
    variables: ['firstName', 'invoiceNumber', 'paymentDate', 'planName', 'billingPeriod', 'paymentMethod', 'amount', 'nextPaymentDate']
  },
  {
    name: 'monthly_report',
    subject: 'Ваш ежемесячный отчет о защите данных',
    category: 'marketing',
    description: 'Ежемесячный отчет об активности и защите данных',
    isActive: true,
    fromName: 'ReScrub Analytics',
    fromEmail: 'reports@rescrub.ru',
    htmlBody: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
    .stat-card { background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 32px; font-weight: bold; color: #667eea; }
    .stat-label { color: #6b7280; font-size: 14px; margin-top: 5px; }
    .progress-bar { background: #e5e7eb; height: 10px; border-radius: 5px; overflow: hidden; margin: 20px 0; }
    .progress-fill { background: #10b981; height: 100%; }
    .achievement { background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Отчет за {{monthYear}}</h1>
      <p style="margin: 0; opacity: 0.9;">Ваша цифровая безопасность под контролем</p>
    </div>
    <div class="content">
      <p>Здравствуйте, {{firstName}}!</p>
      <p>Вот ваша статистика защиты персональных данных за прошедший месяц:</p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{scansPerformed}}</div>
          <div class="stat-label">Сканирований выполнено</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{dataLeaksFound}}</div>
          <div class="stat-label">Утечек обнаружено</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{requestsSent}}</div>
          <div class="stat-label">Запросов отправлено</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{dataRemoved}}</div>
          <div class="stat-label">Данных удалено</div>
        </div>
      </div>
      
      <h3>Уровень защиты</h3>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {{protectionLevel}}%;"></div>
      </div>
      <p style="text-align: center; color: #6b7280;">{{protectionLevel}}% ваших данных защищено</p>
      
      {{#if newAchievement}}
      <div class="achievement">
        <strong>🏆 Новое достижение!</strong><br>
        {{achievementName}} - {{achievementDescription}}
      </div>
      {{/if}}
      
      <h3>Рекомендации на следующий месяц</h3>
      <ul>
        <li>Проведите глубокое сканирование социальных сетей</li>
        <li>Обновите настройки приватности в Google</li>
        <li>Проверьте новые утечки данных на Have I Been Pwned</li>
      </ul>
      
      <p style="margin-top: 30px;">Продолжайте отличную работу по защите ваших персональных данных!</p>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://rescrub.ru/app/dashboard" style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">Перейти в личный кабинет</a>
      </div>
    </div>
  </div>
</body>
</html>`,
    textBody: `Здравствуйте, {{firstName}}!

📊 ОТЧЕТ ЗА {{monthYear}}

Вот ваша статистика защиты персональных данных за прошедший месяц:

СТАТИСТИКА:
- Сканирований выполнено: {{scansPerformed}}
- Утечек обнаружено: {{dataLeaksFound}}
- Запросов отправлено: {{requestsSent}}
- Данных удалено: {{dataRemoved}}

Уровень защиты: {{protectionLevel}}%

Рекомендации на следующий месяц:
- Проведите глубокое сканирование социальных сетей
- Обновите настройки приватности в Google
- Проверьте новые утечки данных на Have I Been Pwned

Продолжайте отличную работу по защите ваших персональных данных!

Перейти в личный кабинет: https://rescrub.ru/app/dashboard

С уважением,
Команда ReScrub`,
    variables: ['firstName', 'monthYear', 'scansPerformed', 'dataLeaksFound', 'requestsSent', 'dataRemoved', 'protectionLevel']
  }
];

export async function seedEmailTemplates() {
  console.log('Seeding email templates...');
  
  for (const template of defaultEmailTemplates) {
    try {
      // Check if template already exists
      const existing = await storage.getEmailTemplateByName(template.name);
      
      if (!existing) {
        await storage.createEmailTemplate({
          ...template,
          createdBy: 'system',
          status: 'published'
        });
        console.log(`✅ Created template: ${template.name}`);
      } else {
        console.log(`⏭️  Template already exists: ${template.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating template ${template.name}:`, error);
    }
  }
  
  console.log('Email templates seeding completed!');
}

// Run seeding if called directly
if (require.main === module) {
  seedEmailTemplates()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
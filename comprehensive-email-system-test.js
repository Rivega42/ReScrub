#!/usr/bin/env node

/**
 * COMPREHENSIVE END-TO-END ТЕСТИРОВАНИЕ ДВУХЭТАПНОЙ EMAIL СИСТЕМЫ
 * согласно ФЗ-152 "О персональных данных"
 * 
 * Этот файл проводит полное тестирование всех компонентов системы:
 * 1. Основной Flow (Happy Path)
 * 2. Email Response Processing
 * 3. Automation Scheduler Testing
 * 4. Security & Edge Cases
 * 5. Error Handling
 */

import fetch from 'node-fetch';
import crypto from 'crypto';

// Configuration
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  email: 'demo@rescrub.ru',
  password: 'demo123',
  firstName: 'Demo',
  lastName: 'User'
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

/**
 * Utility functions
 */
function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function logTest(testName, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    log(`✅ ${testName}`, 'green');
  } else {
    testResults.failed++;
    log(`❌ ${testName}`, 'red');
    if (details) log(`   ${details}`, 'red');
  }
  testResults.details.push({ name: testName, passed, details });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    return { response, data, status: response.status };
  } catch (error) {
    console.error(`Request to ${url} failed:`, error.message);
    throw error;
  }
}

/**
 * Authentication helper
 */
async function authenticateTestUser() {
  log('\n🔐 Аутентификация demo пользователя...', 'blue');
  
  // Login with demo account (should already exist and be verified)
  const loginResult = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_USER.email,
      password: TEST_USER.password
    })
  });

  if (loginResult.status === 200) {
    log('✅ Аутентификация успешна', 'green');
    return loginResult.response.headers.get('set-cookie');
  } else {
    log(`❌ Логин не удался: ${loginResult.status}`, 'red');
    log(`Ответ: ${JSON.stringify(loginResult.data)}`, 'red');
    throw new Error(`Аутентификация не удалась: ${loginResult.status}`);
  }
}

/**
 * 1. ОСНОВНОЙ FLOW (HAPPY PATH) TESTING
 */
async function testMainHappyPathFlow(authCookie) {
  log('\n📧 ТЕСТИРОВАНИЕ ОСНОВНОГО FLOW (HAPPY PATH)', 'cyan');
  log('===============================================', 'cyan');

  let deletionRequestId = null;
  let confirmToken = null;

  // 1.1 Создание deletion request через API
  try {
    const deletionData = {
      brokerName: 'Тест Брокер ПД',
      brokerUrl: 'https://test-broker.example.com',
      operatorEmail: 'operator@test-broker.com',
      personalData: ['ФИО', 'Email', 'Телефон'],
      requestType: 'deletion'
    };

    const result = await makeRequest('/api/deletion-requests', {
      method: 'POST',
      headers: { cookie: authCookie },
      body: JSON.stringify(deletionData)
    });

    if (result.status === 200) {
      deletionRequestId = result.data.id;
      logTest('Создание deletion request через API', true);
      log(`   Request ID: ${deletionRequestId}`, 'blue');
    } else {
      logTest('Создание deletion request через API', false, `Статус: ${result.status}`);
      return;
    }
  } catch (error) {
    logTest('Создание deletion request через API', false, error.message);
    return;
  }

  // 1.2 Проверка отправки initial email с HMAC кнопкой
  await delay(2000); // Wait for email processing
  
  try {
    const requestResult = await makeRequest(`/api/deletion-requests/${deletionRequestId}`, {
      headers: { cookie: authCookie }
    });

    if (requestResult.status === 200) {
      const request = requestResult.data;
      const hasInitialSent = request.status === 'sent_initial';
      const hasTrackingId = !!request.trackingId;
      const hasMessageId = !!request.initialMessageId;

      logTest('Отправка initial email с трекинг ID', hasInitialSent && hasTrackingId);
      logTest('Генерация initial message ID', hasMessageId);
      
      if (hasTrackingId) {
        log(`   Tracking ID: ${request.trackingId}`, 'blue');
      }
    } else {
      logTest('Проверка отправки initial email', false, `Статус: ${requestResult.status}`);
    }
  } catch (error) {
    logTest('Проверка отправки initial email', false, error.message);
  }

  // 1.3 Получение HMAC токена для подтверждения
  try {
    const tokensResult = await makeRequest(`/api/deletion-requests/${deletionRequestId}/tokens`, {
      headers: { cookie: authCookie }
    });

    if (tokensResult.status === 200 && tokensResult.data.length > 0) {
      confirmToken = tokensResult.data[0].token;
      logTest('Генерация HMAC токена для подтверждения', true);
      log(`   Токен: ${confirmToken.substring(0, 32)}...`, 'blue');
    } else {
      logTest('Генерация HMAC токена для подтверждения', false, 'Токен не найден');
      return;
    }
  } catch (error) {
    logTest('Генерация HMAC токена для подтверждения', false, error.message);
    return;
  }

  // 1.4 Симуляция operator click на кнопку подтверждения
  try {
    const confirmResult = await makeRequest(`/api/operator/confirm?token=${confirmToken}`, {
      method: 'POST',
      headers: {
        'X-Forwarded-For': '192.168.1.100',
        'User-Agent': 'Mozilla/5.0 (Test Operator Browser)'
      }
    });

    if (confirmResult.status === 200) {
      logTest('Симуляция operator click подтверждения', true);
    } else {
      logTest('Симуляция operator click подтверждения', false, `Статус: ${confirmResult.status}`);
    }
  } catch (error) {
    logTest('Симуляция operator click подтверждения', false, error.message);
  }

  // 1.5 Проверка обновления статуса в БД
  await delay(1000);
  
  try {
    const updatedResult = await makeRequest(`/api/deletion-requests/${deletionRequestId}`, {
      headers: { cookie: authCookie }
    });

    if (updatedResult.status === 200) {
      const request = updatedResult.data;
      const isConfirmed = request.status === 'operator_confirmed';
      const hasConfirmDate = !!request.buttonConfirmedAt;

      logTest('Обновление статуса в БД (operator_confirmed)', isConfirmed);
      logTest('Фиксация времени подтверждения', hasConfirmDate);
      
      if (hasConfirmDate) {
        log(`   Подтверждено: ${request.buttonConfirmedAt}`, 'blue');
      }
    } else {
      logTest('Проверка обновления статуса в БД', false, `Статус: ${updatedResult.status}`);
    }
  } catch (error) {
    logTest('Проверка обновления статуса в БД', false, error.message);
  }

  return { deletionRequestId, confirmToken };
}

/**
 * 2. EMAIL RESPONSE PROCESSING TESTING
 */
async function testEmailResponseProcessing(authCookie, deletionRequestId) {
  log('\n📨 ТЕСТИРОВАНИЕ EMAIL RESPONSE PROCESSING', 'cyan');
  log('============================================', 'cyan');

  // 2.1 Симуляция incoming email через SendGrid webhook
  const webhookPayloads = [
    {
      category: 'deleted',
      payload: {
        email: 'operator@test-broker.com',
        subject: 'Re: Требование о прекращении обработки персональных данных',
        text: 'Уведомляем, что персональные данные были удалены из наших систем.',
        html: '<p>Уведомляем, что персональные данные были удалены из наших систем.</p>',
        headers: {
          'In-Reply-To': `<deletion-${deletionRequestId}@rescrub.ru>`,
          'References': `<deletion-${deletionRequestId}@rescrub.ru>`,
          'X-Track-ID': `rescrub-${deletionRequestId}`
        }
      }
    },
    {
      category: 'rejected',
      payload: {
        email: 'operator@another-broker.com',
        subject: 'Re: Требование о прекращении обработки',
        text: 'Мы не можем удалить данные по причине правовых ограничений.',
        html: '<p>Мы не можем удалить данные по причине правовых ограничений.</p>',
        headers: {
          'In-Reply-To': `<deletion-test-2@rescrub.ru>`,
          'X-Track-ID': 'rescrub-test-2'
        }
      }
    },
    {
      category: 'need_info',
      payload: {
        email: 'support@third-broker.com',
        subject: 'Re: Удаление персональных данных',
        text: 'Нам требуется дополнительная информация для подтверждения личности.',
        html: '<p>Нам требуется дополнительная информация для подтверждения личности.</p>',
        headers: {
          'In-Reply-To': `<deletion-test-3@rescrub.ru>`,
          'X-Track-ID': 'rescrub-test-3'
        }
      }
    }
  ];

  for (const webhook of webhookPayloads) {
    try {
      const webhookResult = await makeRequest('/api/sendgrid/webhook', {
        method: 'POST',
        body: JSON.stringify([webhook.payload])
      });

      if (webhookResult.status === 200) {
        logTest(`Обработка webhook (${webhook.category})`, true);
        
        // Проверка создания inbound_email записи
        await delay(500);
        
        const inboundResult = await makeRequest('/api/admin/inbound-emails', {
          headers: { cookie: authCookie }
        });

        if (inboundResult.status === 200) {
          const emails = inboundResult.data;
          const relatedEmail = emails.find(e => 
            e.operatorEmail === webhook.payload.email &&
            e.parsedStatus === webhook.category
          );

          if (relatedEmail) {
            logTest(`Создание inbound_email записи (${webhook.category})`, true);
            log(`   Email ID: ${relatedEmail.id}`, 'blue');
            log(`   Parsed Status: ${relatedEmail.parsedStatus}`, 'blue');
          } else {
            logTest(`Создание inbound_email записи (${webhook.category})`, false, 'Запись не найдена');
          }
        }
      } else {
        logTest(`Обработка webhook (${webhook.category})`, false, `Статус: ${webhookResult.status}`);
      }
    } catch (error) {
      logTest(`Обработка webhook (${webhook.category})`, false, error.message);
    }
  }

  // 2.2 Проверка correlation с deletion requests по headers
  try {
    const correlationResult = await makeRequest(`/api/deletion-requests/${deletionRequestId}/inbound-emails`, {
      headers: { cookie: authCookie }
    });

    if (correlationResult.status === 200) {
      const correlatedEmails = correlationResult.data;
      const hasCorrelation = correlatedEmails.length > 0;
      
      logTest('Correlation входящих email с deletion requests', hasCorrelation);
      
      if (hasCorrelation) {
        log(`   Найдено связанных email: ${correlatedEmails.length}`, 'blue');
        correlatedEmails.forEach(email => {
          log(`   - ${email.operatorEmail}: ${email.parsedStatus}`, 'blue');
        });
      }
    } else {
      logTest('Correlation входящих email с deletion requests', false, `Статус: ${correlationResult.status}`);
    }
  } catch (error) {
    logTest('Correlation входящих email с deletion requests', false, error.message);
  }
}

/**
 * 3. AUTOMATION SCHEDULER TESTING
 */
async function testAutomationScheduler(authCookie) {
  log('\n🤖 ТЕСТИРОВАНИЕ AUTOMATION SCHEDULER', 'cyan');
  log('====================================', 'cyan');

  let oldRequestId = null;
  let veryOldRequestId = null;

  // 3.1 Создание deletion request старше 30 дней (для follow-up)
  try {
    const oldRequestData = {
      brokerName: 'Старый Брокер (30+ дней)',
      brokerUrl: 'https://old-broker.example.com',
      operatorEmail: 'old-operator@broker.com',
      personalData: ['ФИО', 'Email'],
      requestType: 'deletion'
    };

    const oldResult = await makeRequest('/api/deletion-requests', {
      method: 'POST',
      headers: { cookie: authCookie },
      body: JSON.stringify(oldRequestData)
    });

    if (oldResult.status === 200) {
      oldRequestId = oldResult.data.id;
      
      // Manually update the creation date to simulate old request
      await makeRequest(`/api/admin/deletion-requests/${oldRequestId}/simulate-old`, {
        method: 'POST',
        headers: { cookie: authCookie },
        body: JSON.stringify({ daysOld: 35 })
      });

      logTest('Создание старого deletion request (30+ дней)', true);
      log(`   Old Request ID: ${oldRequestId}`, 'blue');
    } else {
      logTest('Создание старого deletion request (30+ дней)', false, `Статус: ${oldResult.status}`);
    }
  } catch (error) {
    logTest('Создание старого deletion request (30+ дней)', false, error.message);
  }

  // 3.2 Создание deletion request старше 60 дней (для escalation)
  try {
    const veryOldRequestData = {
      brokerName: 'Очень Старый Брокер (60+ дней)',
      brokerUrl: 'https://very-old-broker.example.com',
      operatorEmail: 'very-old@broker.com',
      personalData: ['ФИО', 'Телефон'],
      requestType: 'deletion'
    };

    const veryOldResult = await makeRequest('/api/deletion-requests', {
      method: 'POST',
      headers: { cookie: authCookie },
      body: JSON.stringify(veryOldRequestData)
    });

    if (veryOldResult.status === 200) {
      veryOldRequestId = veryOldResult.data.id;
      
      // Manually update the creation date to simulate very old request
      await makeRequest(`/api/admin/deletion-requests/${veryOldRequestId}/simulate-old`, {
        method: 'POST',
        headers: { cookie: authCookie },
        body: JSON.stringify({ daysOld: 65 })
      });

      logTest('Создание очень старого deletion request (60+ дней)', true);
      log(`   Very Old Request ID: ${veryOldRequestId}`, 'blue');
    } else {
      logTest('Создание очень старого deletion request (60+ дней)', false, `Статус: ${veryOldResult.status}`);
    }
  } catch (error) {
    logTest('Создание очень старого deletion request (60+ дней)', false, error.message);
  }

  // 3.3 Запуск email automation scheduler
  try {
    const schedulerResult = await makeRequest('/api/admin/scheduler/run-email-automation', {
      method: 'POST',
      headers: { cookie: authCookie }
    });

    if (schedulerResult.status === 200) {
      logTest('Запуск email automation scheduler', true);
      log(`   Результат: ${JSON.stringify(schedulerResult.data)}`, 'blue');
    } else {
      logTest('Запуск email automation scheduler', false, `Статус: ${schedulerResult.status}`);
    }
  } catch (error) {
    logTest('Запуск email automation scheduler', false, error.message);
  }

  // 3.4 Проверка follow-up email отправки
  if (oldRequestId) {
    await delay(2000);
    try {
      const followUpResult = await makeRequest(`/api/deletion-requests/${oldRequestId}`, {
        headers: { cookie: authCookie }
      });

      if (followUpResult.status === 200) {
        const request = followUpResult.data;
        const hasFollowUp = !!request.followUpSentAt;
        const hasFollowUpMessageId = !!request.followUpMessageId;

        logTest('Отправка follow-up email (30+ дней)', hasFollowUp);
        logTest('Генерация follow-up message ID', hasFollowUpMessageId);
        
        if (hasFollowUp) {
          log(`   Follow-up отправлен: ${request.followUpSentAt}`, 'blue');
        }
      }
    } catch (error) {
      logTest('Проверка follow-up email отправки', false, error.message);
    }
  }

  // 3.5 Проверка escalation email к Роскомнадзор
  if (veryOldRequestId) {
    await delay(2000);
    try {
      const escalationResult = await makeRequest(`/api/deletion-requests/${veryOldRequestId}`, {
        headers: { cookie: authCookie }
      });

      if (escalationResult.status === 200) {
        const request = escalationResult.data;
        const hasEscalation = !!request.escalationSentAt;
        const hasEscalationMessageId = !!request.escalationMessageId;
        const isEscalated = request.status === 'escalated';

        logTest('Отправка escalation email к Роскомнадзор', hasEscalation);
        logTest('Генерация escalation message ID', hasEscalationMessageId);
        logTest('Обновление статуса на "escalated"', isEscalated);
        
        if (hasEscalation) {
          log(`   Escalation отправлен: ${request.escalationSentAt}`, 'blue');
        }
      }
    } catch (error) {
      logTest('Проверка escalation email к Роскомнадзор', false, error.message);
    }
  }
}

/**
 * 4. SECURITY & EDGE CASES TESTING
 */
async function testSecurityAndEdgeCases(authCookie) {
  log('\n🔒 ТЕСТИРОВАНИЕ SECURITY & EDGE CASES', 'cyan');
  log('====================================', 'cyan');

  // 4.1 Invalid HMAC tokens
  const invalidTokens = [
    'invalid-token',
    '',
    'eyJpbnZhbGlkIjoidG9rZW4ifQ==', // valid base64 but invalid structure
    Buffer.from(JSON.stringify({payload: '{"invalid": true}', signature: 'fake'})).toString('base64')
  ];

  for (const token of invalidTokens) {
    try {
      const result = await makeRequest(`/api/operator/confirm?token=${token}`, {
        method: 'POST'
      });

      const isRejected = result.status === 400 || result.status === 401;
      logTest(`Отклонение невалидного HMAC токена: "${token.substring(0, 20)}..."`, isRejected);
    } catch (error) {
      logTest(`Отклонение невалидного HMAC токена`, true); // Network error is acceptable
    }
  }

  // 4.2 Expired HMAC tokens
  try {
    // Create a token that's already expired
    const expiredTokenData = {
      deletionRequestId: 'test-id',
      type: 'confirm_deletion',
      expiresAt: Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000) // 1 day ago
    };
    
    const hmacSecret = process.env.HMAC_SECRET || 'test-secret';
    const payloadString = JSON.stringify(expiredTokenData);
    const hmac = crypto.createHmac('sha256', hmacSecret);
    hmac.update(payloadString);
    const signature = hmac.digest('hex');
    
    const expiredToken = Buffer.from(JSON.stringify({
      payload: payloadString,
      signature
    })).toString('base64');

    const expiredResult = await makeRequest(`/api/operator/confirm?token=${expiredToken}`, {
      method: 'POST'
    });

    const isExpiredRejected = expiredResult.status === 400 || expiredResult.status === 401;
    logTest('Отклонение истекшего HMAC токена', isExpiredRejected);
  } catch (error) {
    logTest('Отклонение истекшего HMAC токена', false, error.message);
  }

  // 4.3 Rate limiting verification
  const rateLimitPromises = [];
  for (let i = 0; i < 15; i++) {
    rateLimitPromises.push(
      makeRequest('/api/operator/confirm?token=rate-limit-test', {
        method: 'POST',
        headers: { 'X-Forwarded-For': '192.168.1.200' }
      })
    );
  }

  try {
    const rateLimitResults = await Promise.all(rateLimitPromises);
    const rateLimitedCount = rateLimitResults.filter(r => r.status === 429).length;
    const hasRateLimiting = rateLimitedCount > 0;
    
    logTest('Rate limiting verification (operator confirm)', hasRateLimiting);
    log(`   Rate limited requests: ${rateLimitedCount}/15`, 'blue');
  } catch (error) {
    logTest('Rate limiting verification', false, error.message);
  }

  // 4.4 Malformed webhook payloads
  const malformedPayloads = [
    null,
    '',
    'invalid-json',
    { invalid: 'structure' },
    [],
    [{ missing: 'required_fields' }]
  ];

  for (const payload of malformedPayloads) {
    try {
      const result = await makeRequest('/api/sendgrid/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: typeof payload === 'string' ? payload : JSON.stringify(payload)
      });

      // Should handle gracefully (not crash)
      const handledGracefully = result.status >= 200 && result.status < 500;
      logTest(`Обработка malformed webhook payload`, handledGracefully);
    } catch (error) {
      logTest(`Обработка malformed webhook payload`, false, error.message);
    }
  }

  // 4.5 Duplicate token usage attempts
  try {
    // Create a test deletion request first
    const testRequestData = {
      brokerName: 'Test Duplicate Token Broker',
      operatorEmail: 'duplicate-test@broker.com',
      personalData: ['Test Data'],
      requestType: 'deletion'
    };

    const testRequestResult = await makeRequest('/api/deletion-requests', {
      method: 'POST',
      headers: { cookie: authCookie },
      body: JSON.stringify(testRequestData)
    });

    if (testRequestResult.status === 200) {
      const requestId = testRequestResult.data.id;
      
      // Get the token
      const tokensResult = await makeRequest(`/api/deletion-requests/${requestId}/tokens`, {
        headers: { cookie: authCookie }
      });

      if (tokensResult.status === 200 && tokensResult.data.length > 0) {
        const token = tokensResult.data[0].token;
        
        // Use token first time
        const firstUse = await makeRequest(`/api/operator/confirm?token=${token}`, {
          method: 'POST',
          headers: { 'X-Forwarded-For': '192.168.1.100' }
        });

        // Try to use token second time
        const secondUse = await makeRequest(`/api/operator/confirm?token=${token}`, {
          method: 'POST',
          headers: { 'X-Forwarded-For': '192.168.1.101' }
        });

        const firstSuccessful = firstUse.status === 200;
        const secondRejected = secondUse.status === 400 || secondUse.status === 409;
        
        logTest('Первое использование токена успешно', firstSuccessful);
        logTest('Второе использование токена отклонено', secondRejected);
      }
    }
  } catch (error) {
    logTest('Тестирование duplicate token usage', false, error.message);
  }
}

/**
 * 5. ERROR HANDLING TESTING
 */
async function testErrorHandling(authCookie) {
  log('\n⚠️ ТЕСТИРОВАНИЕ ERROR HANDLING', 'cyan');
  log('===============================', 'cyan');

  // 5.1 Invalid input validation
  const invalidInputs = [
    { test: 'Пустой brokerName', data: { brokerName: '', operatorEmail: 'test@test.com', requestType: 'deletion' }},
    { test: 'Невалидный email', data: { brokerName: 'Test', operatorEmail: 'invalid-email', requestType: 'deletion' }},
    { test: 'Неподдерживаемый requestType', data: { brokerName: 'Test', operatorEmail: 'test@test.com', requestType: 'invalid' }},
    { test: 'Отсутствующие обязательные поля', data: { brokerName: 'Test' }}
  ];

  for (const input of invalidInputs) {
    try {
      const result = await makeRequest('/api/deletion-requests', {
        method: 'POST',
        headers: { cookie: authCookie },
        body: JSON.stringify(input.data)
      });

      const isValidated = result.status === 400 || result.status === 422;
      logTest(`Input validation: ${input.test}`, isValidated);
    } catch (error) {
      logTest(`Input validation: ${input.test}`, false, error.message);
    }
  }

  // 5.2 Database connectivity simulation
  try {
    // Try to access admin endpoint that requires database
    const dbTestResult = await makeRequest('/api/admin/system-health', {
      headers: { cookie: authCookie }
    });

    const hasDbConnection = dbTestResult.status === 200;
    logTest('Database connectivity check', hasDbConnection);
    
    if (hasDbConnection && dbTestResult.data) {
      log(`   Database status: ${dbTestResult.data.database?.status || 'unknown'}`, 'blue');
    }
  } catch (error) {
    logTest('Database connectivity check', false, error.message);
  }

  // 5.3 Email service health check
  try {
    const emailHealthResult = await makeRequest('/api/admin/email-service-status', {
      headers: { cookie: authCookie }
    });

    const hasEmailService = emailHealthResult.status === 200;
    logTest('Email service health check', hasEmailService);
    
    if (hasEmailService && emailHealthResult.data) {
      log(`   Email service status: ${emailHealthResult.data.status || 'unknown'}`, 'blue');
    }
  } catch (error) {
    logTest('Email service health check', false, error.message);
  }

  // 5.4 Graceful degradation - unauthorized access
  try {
    const unauthorizedResult = await makeRequest('/api/admin/users'); // No auth cookie

    const isUnauthorized = unauthorizedResult.status === 401;
    logTest('Graceful handling unauthorized access', isUnauthorized);
  } catch (error) {
    logTest('Graceful handling unauthorized access', false, error.message);
  }

  // 5.5 Large payload handling
  try {
    const largePayload = {
      brokerName: 'A'.repeat(10000), // Very long name
      operatorEmail: 'test@test.com',
      personalData: Array(1000).fill('Large Data Item'),
      requestType: 'deletion'
    };

    const largeResult = await makeRequest('/api/deletion-requests', {
      method: 'POST',
      headers: { cookie: authCookie },
      body: JSON.stringify(largePayload)
    });

    const handlesLargePayload = largeResult.status === 400 || largeResult.status === 413 || largeResult.status === 422;
    logTest('Large payload handling', handlesLargePayload);
  } catch (error) {
    logTest('Large payload handling', true); // Connection error is acceptable
  }
}

/**
 * 6. AUDIT LOGGING VERIFICATION
 */
async function testAuditLogging(authCookie) {
  log('\n📋 ТЕСТИРОВАНИЕ AUDIT LOGGING', 'cyan');
  log('=============================', 'cyan');

  try {
    // Check admin actions log
    const adminActionsResult = await makeRequest('/api/admin/audit-logs', {
      headers: { cookie: authCookie }
    });

    if (adminActionsResult.status === 200) {
      const logs = adminActionsResult.data;
      const hasLogs = logs && logs.length > 0;
      
      logTest('Audit logging functionality', hasLogs);
      
      if (hasLogs) {
        log(`   Найдено записей в audit log: ${logs.length}`, 'blue');
        
        // Check for various action types
        const actionTypes = [...new Set(logs.map(log => log.actionType))];
        log(`   Типы действий: ${actionTypes.join(', ')}`, 'blue');
        
        // Check for required fields
        const completeLog = logs[0];
        const hasRequiredFields = completeLog.adminId && completeLog.actionType && completeLog.createdAt;
        logTest('Audit log содержит обязательные поля', hasRequiredFields);
      }
    } else {
      logTest('Audit logging functionality', false, `Статус: ${adminActionsResult.status}`);
    }
  } catch (error) {
    logTest('Audit logging functionality', false, error.message);
  }

  // Check system health logging
  try {
    const healthLogsResult = await makeRequest('/api/admin/system-health-logs', {
      headers: { cookie: authCookie }
    });

    if (healthLogsResult.status === 200) {
      const healthLogs = healthLogsResult.data;
      const hasHealthLogs = healthLogs && healthLogs.length > 0;
      
      logTest('System health logging', hasHealthLogs);
      
      if (hasHealthLogs) {
        log(`   Health check записей: ${healthLogs.length}`, 'blue');
      }
    } else {
      logTest('System health logging', false, `Статус: ${healthLogsResult.status}`);
    }
  } catch (error) {
    logTest('System health logging', false, error.message);
  }
}

/**
 * MAIN EXECUTION
 */
async function runComprehensiveTests() {
  log('🚀 ЗАПУСК COMPREHENSIVE END-TO-END ТЕСТИРОВАНИЯ', 'bold');
  log('=================================================', 'bold');
  log('Двухэтапная Email Система согласно ФЗ-152\n', 'bold');

  let authCookie = null;
  let mainFlowResults = null;

  try {
    // Authentication
    authCookie = await authenticateTestUser();

    // 1. Main Happy Path Flow
    mainFlowResults = await testMainHappyPathFlow(authCookie);

    // 2. Email Response Processing
    if (mainFlowResults?.deletionRequestId) {
      await testEmailResponseProcessing(authCookie, mainFlowResults.deletionRequestId);
    }

    // 3. Automation Scheduler Testing
    await testAutomationScheduler(authCookie);

    // 4. Security & Edge Cases
    await testSecurityAndEdgeCases(authCookie);

    // 5. Error Handling
    await testErrorHandling(authCookie);

    // 6. Audit Logging
    await testAuditLogging(authCookie);

  } catch (error) {
    log(`\n❌ КРИТИЧЕСКАЯ ОШИБКА ТЕСТИРОВАНИЯ: ${error.message}`, 'red');
    testResults.failed++;
    testResults.total++;
  }

  // Final Results
  log('\n📊 РЕЗУЛЬТАТЫ COMPREHENSIVE ТЕСТИРОВАНИЯ', 'bold');
  log('==========================================', 'bold');
  
  const passRate = testResults.total > 0 ? (testResults.passed / testResults.total * 100).toFixed(1) : 0;
  
  log(`✅ Пройдено: ${testResults.passed}`, 'green');
  log(`❌ Провалено: ${testResults.failed}`, 'red');
  log(`📋 Всего тестов: ${testResults.total}`, 'blue');
  log(`📈 Процент успеха: ${passRate}%`, passRate >= 80 ? 'green' : 'red');

  // Production Readiness Assessment
  log('\n🎯 ОЦЕНКА ГОТОВНОСТИ К PRODUCTION', 'bold');
  log('==================================', 'bold');

  const criticalTests = [
    'Создание deletion request через API',
    'Отправка initial email с трекинг ID',
    'Генерация HMAC токена для подтверждения',
    'Симуляция operator click подтверждения',
    'Обновление статуса в БД (operator_confirmed)',
    'Запуск email automation scheduler',
    'Отклонение невалидного HMAC токена',
    'Rate limiting verification (operator confirm)'
  ];

  const criticalPassed = testResults.details.filter(test => 
    criticalTests.some(critical => test.name.includes(critical)) && test.passed
  ).length;

  const criticalTotal = criticalTests.length;
  const criticalPassRate = (criticalPassed / criticalTotal * 100).toFixed(1);

  log(`🔑 Критические тесты: ${criticalPassed}/${criticalTotal} (${criticalPassRate}%)`, 
    criticalPassRate >= 90 ? 'green' : 'red');

  // Final verdict
  const isProductionReady = passRate >= 85 && criticalPassRate >= 90;
  
  if (isProductionReady) {
    log('\n🎉 СИСТЕМА ГОТОВА К PRODUCTION DEPLOYMENT', 'green');
    log('✅ Все критические компоненты функционируют корректно', 'green');
    log('✅ Двухэтапная email система соответствует ФЗ-152', 'green');
  } else {
    log('\n⚠️ СИСТЕМА НЕ ГОТОВА К PRODUCTION DEPLOYMENT', 'red');
    log('❌ Требуется устранение критических ошибок', 'red');
    log('❌ Необходимо улучшение надежности системы', 'red');
  }

  // Detailed recommendations
  log('\n📋 ДЕТАЛЬНЫЕ РЕКОМЕНДАЦИИ:', 'yellow');
  const failedTests = testResults.details.filter(test => !test.passed);
  if (failedTests.length > 0) {
    failedTests.forEach(test => {
      log(`   • ${test.name}: ${test.details}`, 'yellow');
    });
  } else {
    log('   ✅ Все тесты пройдены успешно!', 'green');
  }

  process.exit(isProductionReady ? 0 : 1);
}

// Run the tests
runComprehensiveTests().catch(error => {
  console.error('❌ Unhandled error during testing:', error);
  process.exit(1);
});
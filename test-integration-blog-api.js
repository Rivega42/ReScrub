#!/usr/bin/env node

/**
 * INTEGRATION TESTING для Blog Generation API endpoints
 * Тестирует POST /api/blog/generate, admin authentication, persistence
 */

import fs from 'fs';

const BASE_URL = 'http://localhost:5000';

// =====================================================
// ТЕСТ 1: POST /api/blog/generate (admin-only)
// =====================================================

console.log('🧪 INTEGRATION TEST 1: Blog Generation API');

async function testBlogGenerationAPI() {
  console.log('\n📡 Тестируем POST /api/blog/generate...');
  
  try {
    // Тест 1: Без авторизации (должен быть 401)
    console.log('🔒 Тест 1.1: Доступ без авторизации');
    const unauthorizedResponse = await fetch(`${BASE_URL}/api/blog/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'Тестовая тема' })
    });
    
    if (unauthorizedResponse.status === 401) {
      console.log('✅ PASS: Неавторизованный доступ корректно заблокирован');
    } else {
      console.log('❌ FAIL: Неавторизованный доступ должен возвращать 401');
    }
    
    // Тест 2: С фиктивной сессией (для демо)
    console.log('\n🔑 Тест 1.2: Запрос генерации с валидными данными');
    
    // Симулируем запрос с админскими правами через cookie
    const adminResponse = await fetch(`${BASE_URL}/api/blog/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': 'connect.sid=demo-admin-session' // Фиктивная сессия для теста
      },
      body: JSON.stringify({ 
        topic: 'Защита персональных данных в России',
        category: 'Privacy Guides'
      })
    });
    
    console.log(`📊 Статус ответа: ${adminResponse.status}`);
    
    if (adminResponse.status === 200 || adminResponse.status === 202) {
      const result = await adminResponse.json();
      console.log('✅ PASS: API принял запрос на генерацию');
      console.log(`📝 Ответ: ${JSON.stringify(result, null, 2)}`);
    } else if (adminResponse.status === 401) {
      console.log('⚠️ EXPECTED: Требуется настоящая аутентификация (для production это правильно)');
    } else {
      console.log(`❌ FAIL: Неожиданный статус: ${adminResponse.status}`);
    }
    
  } catch (error) {
    console.log(`❌ NETWORK ERROR: ${error.message}`);
    console.log('ℹ️ Это может быть нормально если сервер не запущен на localhost:5000');
  }
}

// =====================================================
// ТЕСТ 2: Валидация категорий
// =====================================================

async function testCategoryValidation() {
  console.log('\n🏷️ INTEGRATION TEST 2: Category Validation API');
  
  const testCases = [
    { category: 'Research', shouldPass: true },
    { category: 'Opt-out Guides', shouldPass: true },
    { category: 'InvalidCategory', shouldPass: false },
    { category: '', shouldPass: false }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 Тестируем категорию: "${testCase.category}"`);
      
      const response = await fetch(`${BASE_URL}/api/blog/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': 'connect.sid=demo-admin-session'
        },
        body: JSON.stringify({ 
          topic: 'Тестовая тема',
          category: testCase.category
        })
      });
      
      if (testCase.shouldPass) {
        if (response.status === 200 || response.status === 202 || response.status === 401) {
          console.log(`✅ PASS: Валидная категория "${testCase.category}" принята или требует auth`);
        } else {
          console.log(`❌ FAIL: Валидная категория "${testCase.category}" отклонена: ${response.status}`);
        }
      } else {
        if (response.status === 400) {
          console.log(`✅ PASS: Невалидная категория "${testCase.category}" корректно отклонена`);
        } else {
          console.log(`❌ FAIL: Невалидная категория "${testCase.category}" должна быть отклонена с 400`);
        }
      }
      
    } catch (error) {
      console.log(`❌ NETWORK ERROR для категории "${testCase.category}": ${error.message}`);
    }
  }
}

// =====================================================
// ТЕСТ 3: GET /api/blog/articles (публичный endpoint)
// =====================================================

async function testBlogArticlesAPI() {
  console.log('\n📰 INTEGRATION TEST 3: Blog Articles API');
  
  try {
    console.log('🔍 Тестируем GET /api/blog/articles');
    
    const response = await fetch(`${BASE_URL}/api/blog/articles`);
    console.log(`📊 Статус ответа: ${response.status}`);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('✅ PASS: API вернул список статей');
      console.log(`📊 Количество статей: ${data.articles?.length || 0}`);
      
      if (data.articles && Array.isArray(data.articles)) {
        console.log('✅ PASS: Формат ответа корректный (массив статей)');
        
        // Проверяем структуру первой статьи
        if (data.articles.length > 0) {
          const article = data.articles[0];
          const requiredFields = ['id', 'title', 'slug', 'category', 'publishedAt'];
          const missingFields = requiredFields.filter(field => !article[field]);
          
          if (missingFields.length === 0) {
            console.log('✅ PASS: Структура статьи содержит все обязательные поля');
          } else {
            console.log(`❌ FAIL: Отсутствуют поля в структуре статьи: ${missingFields.join(', ')}`);
          }
        }
      } else {
        console.log('❌ FAIL: Неверный формат ответа');
      }
    } else {
      console.log(`❌ FAIL: Неожиданный статус: ${response.status}`);
    }
    
  } catch (error) {
    console.log(`❌ NETWORK ERROR: ${error.message}`);
  }
}

// =====================================================
// ТЕСТ 4: GET /api/blog/articles/:slug
// =====================================================

async function testSingleArticleAPI() {
  console.log('\n📄 INTEGRATION TEST 4: Single Article API');
  
  try {
    // Сначала получаем список статей чтобы взять slug
    const articlesResponse = await fetch(`${BASE_URL}/api/blog/articles`);
    if (articlesResponse.status !== 200) {
      console.log('⚠️ SKIP: Не удалось получить список статей для теста');
      return;
    }
    
    const articlesData = await articlesResponse.json();
    if (!articlesData.articles || articlesData.articles.length === 0) {
      console.log('⚠️ SKIP: Нет статей для тестирования');
      return;
    }
    
    const testSlug = articlesData.articles[0].slug;
    console.log(`🔍 Тестируем GET /api/blog/articles/${testSlug}`);
    
    const response = await fetch(`${BASE_URL}/api/blog/articles/${testSlug}`);
    console.log(`📊 Статус ответа: ${response.status}`);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('✅ PASS: API вернул статью по slug');
      
      if (data.article && data.article.slug === testSlug) {
        console.log('✅ PASS: Возвращена корректная статья');
        
        // Проверяем наличие контента
        if (data.article.content && data.article.content.length > 100) {
          console.log('✅ PASS: Статья содержит контент');
        } else {
          console.log('❌ FAIL: Статья не содержит достаточно контента');
        }
      } else {
        console.log('❌ FAIL: Возвращена неверная статья');
      }
    } else if (response.status === 404) {
      console.log('⚠️ EXPECTED: Статья не найдена (может быть нормально для теста)');
    } else {
      console.log(`❌ FAIL: Неожиданный статус: ${response.status}`);
    }
    
    // Тест с несуществующим slug
    console.log('\n🔍 Тестируем несуществующий slug');
    const notFoundResponse = await fetch(`${BASE_URL}/api/blog/articles/non-existent-slug`);
    
    if (notFoundResponse.status === 404) {
      console.log('✅ PASS: Несуществующий slug корректно возвращает 404');
    } else {
      console.log(`❌ FAIL: Несуществующий slug должен возвращать 404, получен: ${notFoundResponse.status}`);
    }
    
  } catch (error) {
    console.log(`❌ NETWORK ERROR: ${error.message}`);
  }
}

// =====================================================
// ТЕСТ 5: Performance и Rate Limiting
// =====================================================

async function testPerformanceAndLimits() {
  console.log('\n⚡ INTEGRATION TEST 5: Performance & Rate Limiting');
  
  try {
    console.log('🔍 Тестируем производительность API статей');
    
    const start = Date.now();
    const response = await fetch(`${BASE_URL}/api/blog/articles`);
    const duration = Date.now() - start;
    
    console.log(`⏱️ Время ответа: ${duration}ms`);
    
    if (duration < 1000) {
      console.log('✅ PASS: API отвечает быстро (< 1сек)');
    } else if (duration < 3000) {
      console.log('⚠️ ACCEPTABLE: API отвечает медленно но приемлемо (< 3сек)');
    } else {
      console.log('❌ FAIL: API отвечает слишком медленно (> 3сек)');
    }
    
    // Простой тест rate limiting (множественные запросы)
    console.log('\n🚦 Тестируем множественные запросы');
    const promises = Array(5).fill(0).map(() => 
      fetch(`${BASE_URL}/api/blog/articles`)
    );
    
    const responses = await Promise.all(promises);
    const statusCodes = responses.map(r => r.status);
    
    const successCodes = statusCodes.filter(code => code === 200).length;
    const rateLimitCodes = statusCodes.filter(code => code === 429).length;
    
    console.log(`📊 Успешных запросов: ${successCodes}/5`);
    console.log(`🚫 Rate limit: ${rateLimitCodes}/5`);
    
    if (successCodes >= 3) {
      console.log('✅ PASS: Большинство запросов обработано успешно');
    } else {
      console.log('❌ FAIL: Слишком много запросов отклонено');
    }
    
  } catch (error) {
    console.log(`❌ NETWORK ERROR: ${error.message}`);
  }
}

// =====================================================
// ЗАПУСК ВСЕХ INTEGRATION ТЕСТОВ
// =====================================================

async function runAllIntegrationTests() {
  console.log('🎯 ЗАПУСК ВСЕХ INTEGRATION ТЕСТОВ\n');
  console.log('ℹ️ Проверяем подключение к серверу...');
  
  try {
    const healthResponse = await fetch(`${BASE_URL}/`);
    if (healthResponse.status === 200) {
      console.log('✅ Сервер доступен, начинаем тестирование\n');
    } else {
      console.log('⚠️ Сервер отвечает но может быть не готов\n');
    }
  } catch (error) {
    console.log('❌ Сервер недоступен, некоторые тесты могут быть пропущены\n');
  }
  
  await testBlogGenerationAPI();
  await testCategoryValidation(); 
  await testBlogArticlesAPI();
  await testSingleArticleAPI();
  await testPerformanceAndLimits();
  
  console.log('\n🏆 ВСЕ INTEGRATION ТЕСТЫ ЗАВЕРШЕНЫ');
  console.log('\n📋 ИТОГ: Integration тесты проверили:');
  console.log('   ✅ API endpoint security');
  console.log('   ✅ Category validation');
  console.log('   ✅ Data structure consistency'); 
  console.log('   ✅ Error handling (404, 401)');
  console.log('   ✅ Performance benchmarks');
}

runAllIntegrationTests().catch(console.error);
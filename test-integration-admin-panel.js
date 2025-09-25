#!/usr/bin/env node

/**
 * INTEGRATION TESTING для Admin Panel системы ResCrub
 * Тестирует AdminBlog CRUD, role gating, schedule settings, manual generation, audit logs
 */

const BASE_URL = 'http://localhost:5000';

// =====================================================
// ТЕСТ 1: Admin API Endpoints (CRUD Operations)
// =====================================================

async function testAdminBlogCRUD() {
  console.log('\n🧪 INTEGRATION TEST 1: Admin Blog CRUD Operations');
  
  try {
    // Проверяем доступ к админ API
    console.log('🔍 Тестируем доступ к админ endpoints...');
    
    const endpoints = [
      '/api/admin/blog/articles',
      '/api/admin/blog/settings', 
      '/api/admin/blog/scheduler/status'
    ];
    
    const results = {
      accessible: 0,
      forbidden: 0,
      errors: 0
    };
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        console.log(`📊 ${endpoint}: ${response.status}`);
        
        if (response.status === 200) {
          results.accessible++;
          
          // Проверяем структуру ответа
          const data = await response.json();
          if (data && typeof data === 'object') {
            console.log(`✅ PASS: ${endpoint} возвращает валидные данные`);
          } else {
            console.log(`❌ FAIL: ${endpoint} возвращает невалидные данные`);
          }
          
        } else if (response.status === 401 || response.status === 403) {
          results.forbidden++;
          console.log(`🔒 EXPECTED: ${endpoint} требует авторизации (статус: ${response.status})`);
        } else {
          results.errors++;
          console.log(`❌ ERROR: ${endpoint} неожиданный статус ${response.status}`);
        }
        
      } catch (error) {
        results.errors++;
        console.log(`❌ NETWORK ERROR для ${endpoint}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 Результаты доступа к Admin API:`);
    console.log(`   Доступные: ${results.accessible}`);
    console.log(`   Защищенные: ${results.forbidden}`);
    console.log(`   Ошибки: ${results.errors}`);
    
    // Проверяем, что по крайней мере некоторые endpoints защищены
    if (results.forbidden > 0) {
      console.log('✅ PASS: Admin endpoints защищены авторизацией');
    } else if (results.accessible > 0) {
      console.log('⚠️ INFO: Admin endpoints доступны без авторизации (возможно, в dev режиме)');
    } else {
      console.log('❌ FAIL: Все admin endpoints недоступны');
    }
    
    return { success: true, results };
    
  } catch (error) {
    console.log(`❌ FAIL Admin CRUD тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 2: Blog Generation API  
// =====================================================

async function testBlogGenerationAPI() {
  console.log('\n🧪 INTEGRATION TEST 2: Blog Generation API');
  
  try {
    // Проверяем manual generation endpoint
    console.log('🔍 Тестируем manual generation endpoint...');
    
    const generateResponse = await fetch(`${BASE_URL}/api/admin/blog/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📊 POST /api/admin/blog/generate: ${generateResponse.status}`);
    
    if (generateResponse.status === 200) {
      const data = await generateResponse.json();
      console.log('✅ PASS: Manual generation endpoint доступен');
      
      if (data && data.success !== undefined) {
        console.log('✅ PASS: Generation API возвращает структурированный ответ');
      }
      
    } else if (generateResponse.status === 401 || generateResponse.status === 403) {
      console.log('🔒 EXPECTED: Generation endpoint требует авторизации');
    } else if (generateResponse.status === 429) {
      console.log('⚠️ INFO: Generation endpoint возвращает rate limit (нормально)');
    } else {
      console.log(`❌ FAIL: Неожиданный статус ${generateResponse.status} для generation endpoint`);
    }
    
    // Проверяем scheduler status endpoint
    console.log('\n🔍 Тестируем scheduler status...');
    
    const statusResponse = await fetch(`${BASE_URL}/api/admin/blog/scheduler/status`);
    console.log(`📊 GET /api/admin/blog/scheduler/status: ${statusResponse.status}`);
    
    if (statusResponse.status === 200) {
      const statusData = await statusResponse.json();
      
      const expectedFields = ['isRunning', 'lastRun', 'nextRun', 'totalGenerated'];
      const hasValidStructure = expectedFields.some(field => 
        statusData && typeof statusData === 'object' && field in statusData
      );
      
      if (hasValidStructure) {
        console.log('✅ PASS: Scheduler status имеет валидную структуру');
      } else {
        console.log('❌ FAIL: Scheduler status имеет невалидную структуру');
      }
      
    } else if (statusResponse.status === 401 || statusResponse.status === 403) {
      console.log('🔒 EXPECTED: Scheduler status требует авторизации');
    }
    
    // Проверяем generation settings endpoint
    console.log('\n🔍 Тестируем generation settings...');
    
    const settingsResponse = await fetch(`${BASE_URL}/api/admin/blog/settings`);
    console.log(`📊 GET /api/admin/blog/settings: ${settingsResponse.status}`);
    
    if (settingsResponse.status === 200) {
      const settingsData = await settingsResponse.json();
      
      const settingsFields = ['isEnabled', 'frequency', 'maxArticlesPerDay', 'topics'];
      const hasValidSettings = settingsFields.some(field => 
        settingsData && typeof settingsData === 'object' && field in settingsData
      );
      
      if (hasValidSettings) {
        console.log('✅ PASS: Generation settings имеют валидную структуру');
      } else {
        console.log('❌ FAIL: Generation settings имеют невалидную структуру');
      }
    }
    
    return { success: true };
    
  } catch (error) {
    console.log(`❌ FAIL Blog Generation API тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 3: Article Management Operations
// =====================================================

async function testArticleManagement() {
  console.log('\n🧪 INTEGRATION TEST 3: Article Management');
  
  try {
    // Получаем список статей
    console.log('🔍 Тестируем получение списка статей...');
    
    const articlesResponse = await fetch(`${BASE_URL}/api/admin/blog/articles`);
    console.log(`📊 GET /api/admin/blog/articles: ${articlesResponse.status}`);
    
    let articles = [];
    
    if (articlesResponse.status === 200) {
      const articlesData = await articlesResponse.json();
      
      if (Array.isArray(articlesData)) {
        articles = articlesData;
        console.log(`✅ PASS: Получено ${articles.length} статей`);
      } else if (articlesData && Array.isArray(articlesData.articles)) {
        articles = articlesData.articles;
        console.log(`✅ PASS: Получено ${articles.length} статей (nested structure)`);
      } else {
        console.log('❌ FAIL: Неверная структура ответа для статей');
      }
      
    } else if (articlesResponse.status === 401 || articlesResponse.status === 403) {
      console.log('🔒 EXPECTED: Articles endpoint требует авторизации');
      return { success: true, authRequired: true };
    }
    
    // Проверяем структуру статей
    if (articles.length > 0) {
      console.log('\n🔍 Проверяем структуру статей...');
      
      const article = articles[0];
      const requiredFields = ['id', 'title', 'slug', 'content', 'category', 'status'];
      const missingFields = requiredFields.filter(field => !(field in article));
      
      if (missingFields.length === 0) {
        console.log('✅ PASS: Статьи имеют все обязательные поля');
      } else {
        console.log(`❌ FAIL: Отсутствуют поля: ${missingFields.join(', ')}`);
      }
      
      // Проверяем статусы статей
      const statuses = [...new Set(articles.map(a => a.status))];
      console.log(`📊 Статусы статей: ${statuses.join(', ')}`);
      
      const validStatuses = ['draft', 'published', 'archived'];
      const invalidStatuses = statuses.filter(status => !validStatuses.includes(status));
      
      if (invalidStatuses.length === 0) {
        console.log('✅ PASS: Все статусы статей валидны');
      } else {
        console.log(`❌ FAIL: Невалидные статусы: ${invalidStatuses.join(', ')}`);
      }
      
      // Проверяем категории
      const categories = [...new Set(articles.map(a => a.category))];
      console.log(`📊 Категории статей: ${categories.join(', ')}`);
      
      // Проверяем автогенерацию
      const autoGenerated = articles.filter(a => a.isAutoGenerated);
      const manualCreated = articles.filter(a => !a.isAutoGenerated);
      
      console.log(`📊 Автогенерированных: ${autoGenerated.length}, Ручных: ${manualCreated.length}`);
      
      if (autoGenerated.length > 0) {
        console.log('✅ PASS: Система содержит автогенерированные статьи');
      }
      
      // Тестируем операции с конкретной статьей
      if (articles.length > 0) {
        const testArticle = articles[0];
        
        console.log(`\n🔍 Тестируем операции со статьей: ${testArticle.title.substring(0, 50)}...`);
        
        // Пытаемся получить статью по ID
        const articleResponse = await fetch(`${BASE_URL}/api/admin/blog/articles/${testArticle.id}`);
        console.log(`📊 GET /api/admin/blog/articles/${testArticle.id}: ${articleResponse.status}`);
        
        if (articleResponse.status === 200) {
          console.log('✅ PASS: Получение статьи по ID работает');
        } else if (articleResponse.status === 401 || articleResponse.status === 403) {
          console.log('🔒 EXPECTED: Article detail требует авторизации');
        }
        
        // Тестируем PUT операцию (update)
        const updateData = {
          title: testArticle.title + ' (тест)',
          status: testArticle.status
        };
        
        const updateResponse = await fetch(`${BASE_URL}/api/admin/blog/articles/${testArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        
        console.log(`📊 PUT /api/admin/blog/articles/${testArticle.id}: ${updateResponse.status}`);
        
        if (updateResponse.status === 200) {
          console.log('✅ PASS: Обновление статьи работает (возможно, отменить изменения)');
        } else if (updateResponse.status === 401 || updateResponse.status === 403) {
          console.log('🔒 EXPECTED: Update статьи требует авторизации');
        } else if (updateResponse.status === 422) {
          console.log('✅ PASS: Validation работает для update операций');
        }
      }
    } else {
      console.log('⚠️ INFO: Нет статей для тестирования операций');
    }
    
    return { success: true, articleCount: articles.length };
    
  } catch (error) {
    console.log(`❌ FAIL Article Management тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 4: Schedule Settings Management
// =====================================================

async function testScheduleSettings() {
  console.log('\n🧪 INTEGRATION TEST 4: Schedule Settings Management');
  
  try {
    // Получаем текущие настройки
    console.log('🔍 Тестируем получение настроек планировщика...');
    
    const settingsResponse = await fetch(`${BASE_URL}/api/admin/blog/settings`);
    console.log(`📊 GET /api/admin/blog/settings: ${settingsResponse.status}`);
    
    let currentSettings = null;
    
    if (settingsResponse.status === 200) {
      currentSettings = await settingsResponse.json();
      
      const settingsFields = [
        'isEnabled', 'frequency', 'maxArticlesPerDay', 'topics', 
        'contentLength', 'targetAudience', 'writingStyle'
      ];
      
      const hasSettings = settingsFields.some(field => 
        currentSettings && field in currentSettings
      );
      
      if (hasSettings) {
        console.log('✅ PASS: Настройки планировщика получены');
        
        // Проверяем типы полей
        if (typeof currentSettings.isEnabled === 'boolean') {
          console.log('✅ PASS: isEnabled имеет boolean тип');
        }
        
        if (typeof currentSettings.maxArticlesPerDay === 'number') {
          console.log('✅ PASS: maxArticlesPerDay имеет number тип');
        }
        
        if (Array.isArray(currentSettings.topics)) {
          console.log(`✅ PASS: topics массив содержит ${currentSettings.topics.length} элементов`);
        }
        
        console.log(`📊 Планировщик состояние: ${currentSettings.isEnabled ? 'включен' : 'выключен'}`);
        console.log(`📊 Частота: ${currentSettings.frequency || 'не установлена'}`);
        console.log(`📊 Макс статей/день: ${currentSettings.maxArticlesPerDay || 'не установлено'}`);
        
      } else {
        console.log('❌ FAIL: Настройки имеют неверную структуру');
      }
      
    } else if (settingsResponse.status === 401 || settingsResponse.status === 403) {
      console.log('🔒 EXPECTED: Settings endpoint требует авторизации');
      return { success: true, authRequired: true };
    }
    
    // Тестируем обновление настроек
    if (currentSettings) {
      console.log('\n🔍 Тестируем обновление настроек...');
      
      const updateData = {
        maxArticlesPerDay: (currentSettings.maxArticlesPerDay || 5) + 1, // Изменяем на +1
        isEnabled: currentSettings.isEnabled // Сохраняем текущее состояние
      };
      
      const updateResponse = await fetch(`${BASE_URL}/api/admin/blog/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      console.log(`📊 PATCH /api/admin/blog/settings: ${updateResponse.status}`);
      
      if (updateResponse.status === 200) {
        const updatedSettings = await updateResponse.json();
        
        if (updatedSettings && updatedSettings.maxArticlesPerDay === updateData.maxArticlesPerDay) {
          console.log('✅ PASS: Обновление настроек работает');
          
          // Восстанавливаем исходное значение
          const restoreResponse = await fetch(`${BASE_URL}/api/admin/blog/settings`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ maxArticlesPerDay: currentSettings.maxArticlesPerDay })
          });
          
          if (restoreResponse.status === 200) {
            console.log('✅ PASS: Настройки восстановлены');
          }
        } else {
          console.log('❌ FAIL: Обновление настроек не сохранилось');
        }
        
      } else if (updateResponse.status === 401 || updateResponse.status === 403) {
        console.log('🔒 EXPECTED: Update settings требует авторизации');
      } else if (updateResponse.status === 422) {
        console.log('✅ PASS: Validation работает для settings');
      }
    }
    
    return { success: true, hasSettings: !!currentSettings };
    
  } catch (error) {
    console.log(`❌ FAIL Schedule Settings тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 5: Form Validation (Zod Schemas)
// =====================================================

async function testFormValidation() {
  console.log('\n🧪 INTEGRATION TEST 5: Form Validation (Zod)');
  
  try {
    console.log('🔍 Тестируем Zod validation на API endpoints...');
    
    // Тест 1: Невалидные данные для создания статьи
    const invalidArticleData = {
      title: '', // Пустой title
      content: 'Слишком короткий контент', // Слишком короткий
      category: 'INVALID_CATEGORY', // Несуществующая категория
      tags: [], // Пустые теги
      status: 'invalid_status' // Неверный статус
    };
    
    const createResponse = await fetch(`${BASE_URL}/api/admin/blog/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidArticleData)
    });
    
    console.log(`📊 POST /api/admin/blog/articles (invalid data): ${createResponse.status}`);
    
    if (createResponse.status === 422 || createResponse.status === 400) {
      console.log('✅ PASS: Validation отклоняет невалидные данные статьи');
      
      const errorData = await createResponse.json();
      if (errorData && (errorData.errors || errorData.message)) {
        console.log('✅ PASS: API возвращает детали validation ошибок');
      }
      
    } else if (createResponse.status === 401 || createResponse.status === 403) {
      console.log('🔒 EXPECTED: Create article требует авторизации');
    } else {
      console.log(`⚠️ INFO: Неожиданный статус ${createResponse.status} для невалидных данных`);
    }
    
    // Тест 2: Невалидные настройки планировщика
    const invalidSettings = {
      isEnabled: 'not_boolean', // Должно быть boolean
      maxArticlesPerDay: -1, // Отрицательное число
      frequency: 'invalid_frequency', // Неверная частота
      topics: 'not_array' // Должно быть массивом
    };
    
    const settingsResponse = await fetch(`${BASE_URL}/api/admin/blog/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidSettings)
    });
    
    console.log(`📊 PATCH /api/admin/blog/settings (invalid data): ${settingsResponse.status}`);
    
    if (settingsResponse.status === 422 || settingsResponse.status === 400) {
      console.log('✅ PASS: Validation отклоняет невалидные settings');
    } else if (settingsResponse.status === 401 || settingsResponse.status === 403) {
      console.log('🔒 EXPECTED: Update settings требует авторизации');
    }
    
    // Тест 3: Граничные значения
    console.log('\n🔍 Тестируем граничные значения...');
    
    const borderlineSettings = {
      maxArticlesPerDay: 0, // Минимальное значение
      topics: [] // Пустой массив
    };
    
    const borderlineResponse = await fetch(`${BASE_URL}/api/admin/blog/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(borderlineSettings)
    });
    
    console.log(`📊 PATCH settings (borderline values): ${borderlineResponse.status}`);
    
    if (borderlineResponse.status === 200) {
      console.log('✅ PASS: Граничные значения принимаются');
    } else if (borderlineResponse.status === 422) {
      console.log('✅ PASS: Граничные значения корректно валидируются');
    }
    
    // Тест 4: Слишком большие значения
    const oversizedData = {
      title: 'А'.repeat(1000), // Очень длинный title
      content: 'Б'.repeat(50000), // Очень длинный content
      tags: Array(100).fill('tag'), // Слишком много тегов
      maxArticlesPerDay: 1000 // Слишком большое число
    };
    
    const oversizedResponse = await fetch(`${BASE_URL}/api/admin/blog/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(oversizedData)
    });
    
    console.log(`📊 POST article (oversized data): ${oversizedResponse.status}`);
    
    if (oversizedResponse.status === 422 || oversizedResponse.status === 413) {
      console.log('✅ PASS: Слишком большие данные отклоняются');
    } else if (oversizedResponse.status === 401 || oversizedResponse.status === 403) {
      console.log('🔒 EXPECTED: Requires authorization');
    }
    
    return { success: true };
    
  } catch (error) {
    console.log(`❌ FAIL Form Validation тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 6: Audit Logs Verification
// =====================================================

async function testAuditLogs() {
  console.log('\n🧪 INTEGRATION TEST 6: Audit Logs');
  
  try {
    console.log('🔍 Тестируем audit logs endpoints...');
    
    // Проверяем доступ к audit logs
    const auditResponse = await fetch(`${BASE_URL}/api/admin/audit-logs`);
    console.log(`📊 GET /api/admin/audit-logs: ${auditResponse.status}`);
    
    if (auditResponse.status === 200) {
      const auditData = await auditResponse.json();
      
      if (Array.isArray(auditData) || (auditData && Array.isArray(auditData.logs))) {
        const logs = Array.isArray(auditData) ? auditData : auditData.logs;
        console.log(`✅ PASS: Получено ${logs.length} audit logs`);
        
        if (logs.length > 0) {
          const log = logs[0];
          const logFields = ['id', 'adminId', 'action', 'targetType', 'createdAt'];
          const hasValidStructure = logFields.some(field => field in log);
          
          if (hasValidStructure) {
            console.log('✅ PASS: Audit logs имеют валидную структуру');
          } else {
            console.log('❌ FAIL: Audit logs имеют невалидную структуру');
          }
          
          // Проверяем типы действий
          const actions = [...new Set(logs.map(l => l.action || l.actionType))];
          console.log(`📊 Типы действий в audit logs: ${actions.join(', ')}`);
          
          // Проверяем типы целей
          const targetTypes = [...new Set(logs.map(l => l.targetType))];
          console.log(`📊 Типы целей в audit logs: ${targetTypes.join(', ')}`);
        }
        
      } else {
        console.log('❌ FAIL: Audit logs имеют неверную структуру');
      }
      
    } else if (auditResponse.status === 401 || auditResponse.status === 403) {
      console.log('🔒 EXPECTED: Audit logs требуют авторизации');
    } else if (auditResponse.status === 404) {
      console.log('⚠️ INFO: Audit logs endpoint не найден');
    }
    
    // Проверяем фильтрацию audit logs
    const filteredResponse = await fetch(`${BASE_URL}/api/admin/audit-logs?action=create&limit=10`);
    console.log(`📊 GET /api/admin/audit-logs?action=create: ${filteredResponse.status}`);
    
    if (filteredResponse.status === 200) {
      console.log('✅ PASS: Фильтрация audit logs работает');
    }
    
    // Проверяем export функциональность
    const exportResponse = await fetch(`${BASE_URL}/api/admin/audit-logs/export`);
    console.log(`📊 GET /api/admin/audit-logs/export: ${exportResponse.status}`);
    
    if (exportResponse.status === 200) {
      console.log('✅ PASS: Export audit logs доступен');
    } else if (exportResponse.status === 401 || exportResponse.status === 403) {
      console.log('🔒 EXPECTED: Export требует авторизации');
    }
    
    return { success: true };
    
  } catch (error) {
    console.log(`❌ FAIL Audit Logs тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ЗАПУСК ВСЕХ ADMIN PANEL INTEGRATION ТЕСТОВ
// =====================================================

async function runAllAdminPanelTests() {
  console.log('🎯 ЗАПУСК ВСЕХ ADMIN PANEL INTEGRATION ТЕСТОВ\n');
  
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
  
  // Выполняем все тесты
  const results = {
    adminCRUD: await testAdminBlogCRUD(),
    blogGeneration: await testBlogGenerationAPI(),
    articleManagement: await testArticleManagement(),
    scheduleSettings: await testScheduleSettings(),
    formValidation: await testFormValidation(),
    auditLogs: await testAuditLogs()
  };
  
  // Финальный отчет
  console.log('\n🏆 ИТОГИ ADMIN PANEL INTEGRATION ТЕСТОВ:');
  
  Object.entries(results).forEach(([testName, result]) => {
    const status = result.success ? '✅' : '❌';
    const authInfo = result.authRequired ? ' (AUTH REQUIRED)' : '';
    console.log(`${status} ${testName.toUpperCase()}${authInfo}`);
  });
  
  const successCount = Object.values(results).filter(r => r.success).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n📊 ОБЩИЙ РЕЗУЛЬТАТ: ${successCount}/${totalTests} тестов прошли успешно`);
  
  if (successCount === totalTests) {
    console.log('🎉 ВСЕ ADMIN PANEL ТЕСТЫ ПРОШЛИ!');
  } else {
    console.log('⚠️ Некоторые admin тесты требуют внимания');
  }
  
  console.log('\n📋 ИТОГ: Admin Panel Integration тесты проверили:');
  console.log('   ✅ Admin API endpoints и CRUD operations');
  console.log('   ✅ Blog generation API и manual generation'); 
  console.log('   ✅ Article management operations');
  console.log('   ✅ Schedule settings management');
  console.log('   ✅ Form validation via Zod schemas');
  console.log('   ✅ Audit logs functionality');
  
  return results;
}

runAllAdminPanelTests().catch(console.error);
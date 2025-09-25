#!/usr/bin/env node

/**
 * INTEGRATION TESTING для Categories & SEO endpoints
 * Тестирует /blog/category/:slug, фильтрацию, 404 ошибки, breadcrumbs
 */

const BASE_URL = 'http://localhost:5000';

// Категории из системы
const VALID_CATEGORY_SLUGS = [
  'research',
  'opt-out-guides', 
  'privacy-guides',
  'how-to-stop-spam',
  '152-fz-guides'
];

const EXPECTED_CATEGORIES = {
  'research': { displayName: 'Исследования', icon: 'BarChart3' },
  'opt-out-guides': { displayName: 'Пошаговые инструкции', icon: 'FileText' },
  'privacy-guides': { displayName: 'Руководства по приватности', icon: 'Shield' },
  'how-to-stop-spam': { displayName: 'Борьба со спамом', icon: 'PhoneOff' },
  '152-fz-guides': { displayName: 'Российское законодательство', icon: 'Scale' }
};

// =====================================================
// ТЕСТ 1: Category Filtering API
// =====================================================

async function testCategoryFilteringAPI() {
  console.log('\n🧪 INTEGRATION TEST 1: Category Filtering API');
  
  for (const slug of VALID_CATEGORY_SLUGS) {
    try {
      console.log(`\n🔍 Тестируем категорию: ${slug}`);
      
      const response = await fetch(`${BASE_URL}/api/blog/articles?category=${slug}`);
      console.log(`📊 Статус ответа: ${response.status}`);
      
      if (response.status === 200) {
        const data = await response.json();
        
        if (data.success && Array.isArray(data.articles)) {
          console.log(`✅ PASS: API вернул ${data.articles.length} статей для категории ${slug}`);
          
          // Проверяем, что все статьи действительно принадлежат этой категории
          const categoryName = data.articles.length > 0 ? data.articles[0].category : null;
          const allSameCategory = data.articles.every(article => 
            article.category === categoryName || 
            slug === 'research' && article.category === 'Research' ||
            slug === 'opt-out-guides' && article.category === 'Opt-out Guides' ||
            slug === 'privacy-guides' && article.category === 'Privacy Guides' ||
            slug === 'how-to-stop-spam' && article.category === 'How to stop spam' ||
            slug === '152-fz-guides' && article.category === '152-ФЗ Guides'
          );
          
          if (data.articles.length === 0) {
            console.log(`⚠️ INFO: Нет статей в категории ${slug} (может быть нормально)`);
          } else if (allSameCategory) {
            console.log(`✅ PASS: Все статьи принадлежат корректной категории`);
          } else {
            console.log(`❌ FAIL: Найдены статьи других категорий в фильтре ${slug}`);
          }
          
          // Проверяем структуру статей
          if (data.articles.length > 0) {
            const article = data.articles[0];
            const requiredFields = ['id', 'title', 'slug', 'category', 'tags'];
            const missingFields = requiredFields.filter(field => !article[field]);
            
            if (missingFields.length === 0) {
              console.log(`✅ PASS: Структура статей корректна`);
            } else {
              console.log(`❌ FAIL: Отсутствуют поля: ${missingFields.join(', ')}`);
            }
          }
        } else {
          console.log(`❌ FAIL: Неверный формат ответа для ${slug}`);
        }
      } else {
        console.log(`❌ FAIL: Неожиданный статус ${response.status} для ${slug}`);
      }
      
    } catch (error) {
      console.log(`❌ NETWORK ERROR для ${slug}: ${error.message}`);
    }
  }
}

// =====================================================
// ТЕСТ 2: Invalid Category Slug (404)
// =====================================================

async function testInvalidCategorySlugs() {
  console.log('\n🧪 INTEGRATION TEST 2: Invalid Category Slugs');
  
  const invalidSlugs = [
    'invalid-category',
    'nonexistent',
    'Research', // Правильная категория, но неправильный slug
    '152-fz', // Неполный slug
    'research-invalid' // Похожий на валидный
  ];
  
  for (const invalidSlug of invalidSlugs) {
    try {
      console.log(`\n🔍 Тестируем невалидный slug: ${invalidSlug}`);
      
      // Тест 1: API endpoint
      const apiResponse = await fetch(`${BASE_URL}/api/blog/articles?category=${invalidSlug}`);
      console.log(`📊 API статус для ${invalidSlug}: ${apiResponse.status}`);
      
      if (apiResponse.status === 400 || apiResponse.status === 404) {
        console.log(`✅ PASS: API корректно отклонил невалидную категорию ${invalidSlug}`);
      } else if (apiResponse.status === 200) {
        const data = await apiResponse.json();
        if (data.articles && data.articles.length === 0) {
          console.log(`✅ PASS: API вернул пустой список для ${invalidSlug}`);
        } else {
          console.log(`❌ FAIL: API вернул статьи для невалидной категории ${invalidSlug}`);
        }
      } else {
        console.log(`⚠️ INFO: Неожиданный статус ${apiResponse.status} для ${invalidSlug}`);
      }
      
      // Тест 2: Frontend route (должен быть 404)
      const pageResponse = await fetch(`${BASE_URL}/blog/category/${invalidSlug}`);
      console.log(`📊 Page статус для ${invalidSlug}: ${pageResponse.status}`);
      
      if (pageResponse.status === 404) {
        console.log(`✅ PASS: Frontend корректно возвращает 404 для ${invalidSlug}`);
      } else {
        console.log(`❌ FAIL: Frontend не возвращает 404 для ${invalidSlug}`);
      }
      
    } catch (error) {
      console.log(`❌ NETWORK ERROR для ${invalidSlug}: ${error.message}`);
    }
  }
}

// =====================================================
// ТЕСТ 3: Category Page Structure
// =====================================================

async function testCategoryPageStructure() {
  console.log('\n🧪 INTEGRATION TEST 3: Category Page Structure');
  
  // Тестируем первую валидную категорию
  const testSlug = VALID_CATEGORY_SLUGS[0]; // 'research'
  
  try {
    console.log(`\n🔍 Тестируем структуру страницы категории: ${testSlug}`);
    
    const response = await fetch(`${BASE_URL}/blog/category/${testSlug}`);
    console.log(`📊 Статус страницы: ${response.status}`);
    
    if (response.status === 200) {
      const html = await response.text();
      
      // Проверяем основные элементы HTML
      const checks = {
        hasTitle: html.includes('<title>') && html.includes('</title>'),
        hasMetaDescription: html.includes('name="description"'),
        hasCanonical: html.includes('rel="canonical"'),
        hasOgTags: html.includes('property="og:title"'),
        hasBreadcrumbs: html.includes('breadcrumb') || html.includes('Блог'),
        hasJsonLd: html.includes('application/ld+json')
      };
      
      Object.entries(checks).forEach(([check, passed]) => {
        if (passed) {
          console.log(`✅ PASS: ${check}`);
        } else {
          console.log(`❌ FAIL: ${check}`);
        }
      });
      
      // Проверяем title содержит название категории
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      if (titleMatch && titleMatch[1].includes('Исследования')) {
        console.log(`✅ PASS: Title содержит название категории`);
      } else {
        console.log(`❌ FAIL: Title не содержит название категории`);
      }
      
      // Проверяем canonical URL
      const canonicalMatch = html.match(/rel="canonical" href="([^"]+)"/);
      if (canonicalMatch && canonicalMatch[1].includes(`/blog/category/${testSlug}`)) {
        console.log(`✅ PASS: Canonical URL корректен`);
      } else {
        console.log(`❌ FAIL: Canonical URL некорректен`);
      }
      
    } else {
      console.log(`❌ FAIL: Страница категории недоступна (статус: ${response.status})`);
    }
    
  } catch (error) {
    console.log(`❌ NETWORK ERROR: ${error.message}`);
  }
}

// =====================================================
// ТЕСТ 4: All Categories Accessibility
// =====================================================

async function testAllCategoriesAccessibility() {
  console.log('\n🧪 INTEGRATION TEST 4: All Categories Accessibility');
  
  console.log('🔍 Тестируем доступность всех 5 категорий...');
  
  const results = {
    accessible: 0,
    total: VALID_CATEGORY_SLUGS.length,
    errors: []
  };
  
  for (const slug of VALID_CATEGORY_SLUGS) {
    try {
      console.log(`\n📍 Проверяем категорию: ${slug}`);
      
      // Тест API endpoint
      const apiResponse = await fetch(`${BASE_URL}/api/blog/articles?category=${slug}`);
      
      // Тест frontend route  
      const pageResponse = await fetch(`${BASE_URL}/blog/category/${slug}`);
      
      console.log(`📊 API: ${apiResponse.status}, Page: ${pageResponse.status}`);
      
      if (apiResponse.status === 200 && pageResponse.status === 200) {
        console.log(`✅ PASS: Категория ${slug} полностью доступна`);
        results.accessible++;
        
        // Дополнительная проверка: есть ли данные
        const apiData = await apiResponse.json();
        if (apiData.success) {
          console.log(`✅ PASS: API возвращает валидные данные для ${slug}`);
        }
        
      } else {
        console.log(`❌ FAIL: Проблемы с доступностью ${slug}`);
        results.errors.push(`${slug}: API=${apiResponse.status}, Page=${pageResponse.status}`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR для ${slug}: ${error.message}`);
      results.errors.push(`${slug}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 ИТОГ: ${results.accessible}/${results.total} категорий доступны`);
  
  if (results.accessible === results.total) {
    console.log('✅ PASS: Все категории полностью доступны');
  } else {
    console.log('❌ FAIL: Некоторые категории недоступны');
    results.errors.forEach(error => console.log(`   ${error}`));
  }
  
  return results;
}

// =====================================================
// ТЕСТ 5: Performance Category Loading
// =====================================================

async function testCategoryPerformance() {
  console.log('\n🧪 INTEGRATION TEST 5: Category Performance');
  
  const testSlug = 'research'; // Тестируем на первой категории
  
  try {
    console.log(`🔍 Тестируем производительность загрузки категории: ${testSlug}`);
    
    // Тест API performance
    const apiStart = Date.now();
    const apiResponse = await fetch(`${BASE_URL}/api/blog/articles?category=${testSlug}`);
    const apiDuration = Date.now() - apiStart;
    
    console.log(`⏱️ API время ответа: ${apiDuration}ms`);
    
    if (apiDuration < 1000) {
      console.log('✅ PASS: API отвечает быстро (< 1сек)');
    } else if (apiDuration < 3000) {
      console.log('⚠️ ACCEPTABLE: API отвечает медленно но приемлемо (< 3сек)');
    } else {
      console.log('❌ FAIL: API отвечает слишком медленно (> 3сек)');
    }
    
    // Тест page loading performance  
    const pageStart = Date.now();
    const pageResponse = await fetch(`${BASE_URL}/blog/category/${testSlug}`);
    const pageDuration = Date.now() - pageStart;
    
    console.log(`⏱️ Page время загрузки: ${pageDuration}ms`);
    
    if (pageDuration < 2000) {
      console.log('✅ PASS: Страница загружается быстро (< 2сек)');
    } else if (pageDuration < 5000) {
      console.log('⚠️ ACCEPTABLE: Страница загружается медленно но приемлемо (< 5сек)');
    } else {
      console.log('❌ FAIL: Страница загружается слишком медленно (> 5сек)');
    }
    
    // Тест concurrent requests
    console.log('\n🚦 Тестируем concurrent запросы...');
    const concurrentStart = Date.now();
    
    const promises = VALID_CATEGORY_SLUGS.slice(0, 3).map(slug => 
      fetch(`${BASE_URL}/api/blog/articles?category=${slug}`)
    );
    
    const responses = await Promise.all(promises);
    const concurrentDuration = Date.now() - concurrentStart;
    
    const successfulResponses = responses.filter(r => r.status === 200).length;
    
    console.log(`⏱️ Concurrent запросы (${promises.length}): ${concurrentDuration}ms`);
    console.log(`📊 Успешных ответов: ${successfulResponses}/${promises.length}`);
    
    if (successfulResponses === promises.length && concurrentDuration < 3000) {
      console.log('✅ PASS: Concurrent запросы обрабатываются эффективно');
    } else {
      console.log('❌ FAIL: Проблемы с concurrent обработкой');
    }
    
  } catch (error) {
    console.log(`❌ PERFORMANCE ERROR: ${error.message}`);
  }
}

// =====================================================
// ЗАПУСК ВСЕХ INTEGRATION ТЕСТОВ
// =====================================================

async function runAllCategoryIntegrationTests() {
  console.log('🎯 ЗАПУСК ВСЕХ CATEGORY INTEGRATION ТЕСТОВ\n');
  
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
  
  await testCategoryFilteringAPI();
  await testInvalidCategorySlugs();
  await testCategoryPageStructure();
  const accessibilityResults = await testAllCategoriesAccessibility();
  await testCategoryPerformance();
  
  console.log('\n🏆 ВСЕ CATEGORY INTEGRATION ТЕСТЫ ЗАВЕРШЕНЫ');
  
  console.log('\n📋 ИТОГ: Category Integration тесты проверили:');
  console.log('   ✅ Category filtering API endpoints');
  console.log('   ✅ Invalid slug handling (404)');
  console.log('   ✅ Page structure и SEO metadata');
  console.log(`   ✅ All categories accessibility (${accessibilityResults.accessible}/5)`);
  console.log('   ✅ Performance benchmarks');
  
  return accessibilityResults;
}

runAllCategoryIntegrationTests().catch(console.error);
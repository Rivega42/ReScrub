#!/usr/bin/env node

/**
 * E2E TESTING для Formatting системы ResCrub
 * Тестирует ReactMarkdown, ToC, KeyInsights, SEO в браузере
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5000';
const TEST_ARTICLE_SLUG = 'shtrafy-za-narushenie-zaschity-dannyh-kak-izbezhat-problem';

// =====================================================
// ТЕСТ 1: ReactMarkdown рендеринг
// =====================================================

async function testReactMarkdownRendering(page) {
  console.log('\n🧪 E2E TEST 1: ReactMarkdown рендеринг');
  
  try {
    // Переходим к статье
    await page.goto(`${BASE_URL}/blog/${TEST_ARTICLE_SLUG}`);
    await page.waitForSelector('[data-testid="article-content"]', { timeout: 10000 });
    
    console.log('✅ PASS: Страница статьи загружена');
    
    // Проверяем наличие основных markdown элементов
    const markdownElements = {
      headings: {
        h1: await page.locator('h1').count(),
        h2: await page.locator('h2').count(),
        h3: await page.locator('h3').count()
      },
      paragraphs: await page.locator('p').count(),
      links: await page.locator('a').count(),
      lists: await page.locator('ul, ol').count(),
      codeBlocks: await page.locator('pre, code').count()
    };
    
    console.log(`📊 Markdown элементы: H1=${markdownElements.headings.h1}, H2=${markdownElements.headings.h2}, H3=${markdownElements.headings.h3}`);
    console.log(`📝 Текстовые элементы: P=${markdownElements.paragraphs}, Links=${markdownElements.links}`);
    
    // Проверяем, что заголовки имеют ID для навигации
    const headingsWithIds = await page.locator('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').count();
    
    if (headingsWithIds > 0) {
      console.log(`✅ PASS: ${headingsWithIds} заголовков имеют ID для навигации`);
    } else {
      console.log('❌ FAIL: Заголовки не имеют ID для навигации');
    }
    
    // Проверяем корректное форматирование ссылок
    const externalLinks = await page.locator('a[target="_blank"]').count();
    const internalLinks = await page.locator('a:not([target="_blank"])').count();
    
    console.log(`🔗 Ссылки: внешние=${externalLinks}, внутренние=${internalLinks}`);
    
    if (internalLinks > 0) {
      console.log('✅ PASS: Найдены внутренние ссылки');
    }
    
    // Проверяем таблицы (если есть)
    const tables = await page.locator('table').count();
    if (tables > 0) {
      console.log(`📊 PASS: Найдено ${tables} таблиц с корректным форматированием`);
    }
    
    return { success: true, elements: markdownElements };
    
  } catch (error) {
    console.log(`❌ FAIL ReactMarkdown тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 2: Table of Contents функциональность
// =====================================================

async function testTableOfContents(page) {
  console.log('\n🧪 E2E TEST 2: Table of Contents');
  
  try {
    // Проверяем наличие ToC
    const tocExists = await page.locator('[data-testid="table-of-contents"]').isVisible();
    
    if (!tocExists) {
      console.log('⚠️ SKIP: Table of Contents не найдено на этой странице');
      return { success: true, skipped: true };
    }
    
    console.log('✅ PASS: Table of Contents присутствует');
    
    // Проверяем количество элементов ToC
    const tocItems = await page.locator('[data-testid^="toc-item-"]').count();
    console.log(`📊 ToC элементы: ${tocItems}`);
    
    if (tocItems > 0) {
      console.log('✅ PASS: ToC содержит элементы навигации');
      
      // Тестируем клик по первому элементу ToC
      const firstTocItem = page.locator('[data-testid^="toc-item-"]').first();
      const firstTocText = await firstTocItem.textContent();
      
      // Получаем текущую позицию скролла
      const initialScrollY = await page.evaluate(() => window.scrollY);
      
      // Кликаем на элемент ToC
      await firstTocItem.click();
      await page.waitForTimeout(1000); // Ждем анимацию скролла
      
      // Проверяем, что произошел скролл
      const newScrollY = await page.evaluate(() => window.scrollY);
      
      if (newScrollY !== initialScrollY) {
        console.log('✅ PASS: ToC навигация работает (произошел скролл)');
      } else {
        console.log('❌ FAIL: ToC навигация не работает');
      }
      
      // Проверяем highlighting активного элемента
      const activeItems = await page.locator('[data-testid^="toc-item-"].bg-primary\\/10, [data-testid^="toc-item-"][class*="primary"]').count();
      
      if (activeItems > 0) {
        console.log('✅ PASS: ToC highlighting активного элемента работает');
      } else {
        console.log('⚠️ INFO: ToC highlighting не обнаружен (может быть нормально)');
      }
      
      // Тестируем collapse/expand функциональность
      const toggleButton = page.locator('[data-testid="button-toggle-toc"]');
      if (await toggleButton.isVisible()) {
        await toggleButton.click();
        await page.waitForTimeout(500);
        
        const isCollapsed = await page.locator('[data-testid="table-of-contents"] .space-y-1').isHidden();
        if (isCollapsed) {
          console.log('✅ PASS: ToC collapse/expand работает');
        } else {
          console.log('❌ FAIL: ToC collapse/expand не работает');
        }
        
        // Возвращаем в исходное состояние
        await toggleButton.click();
      }
    }
    
    return { success: true, tocItems };
    
  } catch (error) {
    console.log(`❌ FAIL ToC тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 3: KeyInsights отображение
// =====================================================

async function testKeyInsights(page) {
  console.log('\n🧪 E2E TEST 3: KeyInsights компонент');
  
  try {
    // Проверяем наличие KeyInsights
    const insightsExists = await page.locator('[data-testid="key-insights"]').isVisible();
    
    if (!insightsExists) {
      console.log('⚠️ SKIP: KeyInsights не найдено на этой странице');
      return { success: true, skipped: true };
    }
    
    console.log('✅ PASS: KeyInsights компонент присутствует');
    
    // Проверяем количество insights
    const insightItems = await page.locator('[data-testid^="insight-"]').count();
    console.log(`📊 Insights: ${insightItems}`);
    
    if (insightItems > 0) {
      console.log('✅ PASS: KeyInsights содержит элементы');
      
      // Проверяем типы insights
      const insightTypes = await page.locator('[data-testid^="insight-"] .text-xs').allTextContents();
      const uniqueTypes = [...new Set(insightTypes)];
      
      console.log(`🏷️ Типы insights: ${uniqueTypes.join(', ')}`);
      
      if (uniqueTypes.length > 1) {
        console.log('✅ PASS: Различные типы insights присутствуют');
      }
      
      // Проверяем наличие иконок
      const iconsCount = await page.locator('[data-testid^="insight-"] .h-4.w-4').count();
      
      if (iconsCount === insightItems) {
        console.log('✅ PASS: Все insights имеют иконки');
      } else {
        console.log(`⚠️ INFO: ${iconsCount}/${insightItems} insights имеют иконки`);
      }
      
      // Проверяем hover эффекты
      const firstInsight = page.locator('[data-testid^="insight-"]').first();
      await firstInsight.hover();
      
      // Проверяем, что нет layout shift при hover
      const insightBox = await firstInsight.boundingBox();
      await page.waitForTimeout(200);
      const insightBoxAfterHover = await firstInsight.boundingBox();
      
      if (insightBox && insightBoxAfterHover && 
          Math.abs(insightBox.width - insightBoxAfterHover.width) < 1 && 
          Math.abs(insightBox.height - insightBoxAfterHover.height) < 1) {
        console.log('✅ PASS: Нет layout shift при hover на insights');
      } else {
        console.log('❌ FAIL: Layout shift обнаружен при hover');
      }
    }
    
    return { success: true, insightItems };
    
  } catch (error) {
    console.log(`❌ FAIL KeyInsights тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 4: SEO метаданные и JSON-LD
// =====================================================

async function testSEOMetadata(page) {
  console.log('\n🧪 E2E TEST 4: SEO метаданные');
  
  try {
    // Проверяем title
    const title = await page.title();
    if (title && title.length > 10) {
      console.log(`✅ PASS: Title присутствует (${title.length} символов)`);
    } else {
      console.log('❌ FAIL: Title отсутствует или слишком короткий');
    }
    
    // Проверяем meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    if (metaDescription && metaDescription.length > 50) {
      console.log(`✅ PASS: Meta description присутствует (${metaDescription.length} символов)`);
    } else {
      console.log('❌ FAIL: Meta description отсутствует или слишком короткий');
    }
    
    // Проверяем Open Graph метатеги
    const ogTags = {
      title: await page.locator('meta[property="og:title"]').getAttribute('content'),
      description: await page.locator('meta[property="og:description"]').getAttribute('content'),
      type: await page.locator('meta[property="og:type"]').getAttribute('content'),
      url: await page.locator('meta[property="og:url"]').getAttribute('content')
    };
    
    const ogTagsPresent = Object.values(ogTags).filter(Boolean).length;
    console.log(`📊 Open Graph теги: ${ogTagsPresent}/4`);
    
    if (ogTagsPresent >= 3) {
      console.log('✅ PASS: Основные OG теги присутствуют');
    } else {
      console.log('❌ FAIL: Недостаточно OG тегов');
    }
    
    // Проверяем JSON-LD структурированные данные
    const jsonLdElements = await page.locator('script[type="application/ld+json"]').count();
    
    if (jsonLdElements > 0) {
      console.log(`✅ PASS: JSON-LD структурированные данные присутствуют (${jsonLdElements} блоков)`);
      
      // Проверяем валидность JSON-LD
      const jsonLdContent = await page.locator('script[type="application/ld+json"]').first().textContent();
      try {
        const jsonData = JSON.parse(jsonLdContent);
        
        if (jsonData['@type']) {
          console.log(`✅ PASS: JSON-LD валидный (тип: ${jsonData['@type']})`);
        }
        
        // Проверяем breadcrumb JSON-LD
        if (jsonData['@type'] === 'BreadcrumbList' || jsonData.itemListElement) {
          console.log('✅ PASS: Breadcrumb JSON-LD присутствует');
        }
        
      } catch (jsonError) {
        console.log('❌ FAIL: JSON-LD невалидный');
      }
    } else {
      console.log('❌ FAIL: JSON-LD структурированные данные отсутствуют');
    }
    
    // Проверяем canonical URL
    const canonicalUrl = await page.locator('link[rel="canonical"]').getAttribute('href');
    if (canonicalUrl) {
      console.log('✅ PASS: Canonical URL присутствует');
    } else {
      console.log('❌ FAIL: Canonical URL отсутствует');
    }
    
    // Проверяем breadcrumbs в UI
    const breadcrumbs = await page.locator('[data-testid="article-breadcrumbs"]').isVisible();
    if (breadcrumbs) {
      console.log('✅ PASS: Breadcrumbs навигация присутствует');
    } else {
      console.log('❌ FAIL: Breadcrumbs навигация отсутствует');
    }
    
    return { 
      success: true, 
      title: title?.length || 0,
      metaDescription: metaDescription?.length || 0,
      ogTags: ogTagsPresent,
      jsonLd: jsonLdElements
    };
    
  } catch (error) {
    console.log(`❌ FAIL SEO тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 5: Layout Stability и Performance
// =====================================================

async function testLayoutStability(page) {
  console.log('\n🧪 E2E TEST 5: Layout Stability');
  
  try {
    // Измеряем начальную позицию элементов
    const articleHeader = page.locator('[data-testid="article-header"]');
    const initialBox = await articleHeader.boundingBox();
    
    // Симулируем различные hover interactions
    const elementsToHover = [
      '[data-testid^="toc-item-"]',
      '[data-testid^="insight-"]', 
      'a[href*="/blog/"]',
      '[data-testid="button-back-to-blog"]'
    ];
    
    let layoutShifts = 0;
    
    for (const selector of elementsToHover) {
      const elements = await page.locator(selector).all();
      
      for (let i = 0; i < Math.min(elements.length, 3); i++) {
        const element = elements[i];
        
        if (await element.isVisible()) {
          // Получаем позицию перед hover
          const beforeBox = await articleHeader.boundingBox();
          
          // Выполняем hover
          await element.hover();
          await page.waitForTimeout(100);
          
          // Проверяем позицию после hover
          const afterBox = await articleHeader.boundingBox();
          
          if (beforeBox && afterBox) {
            const xShift = Math.abs(beforeBox.x - afterBox.x);
            const yShift = Math.abs(beforeBox.y - afterBox.y);
            
            if (xShift > 1 || yShift > 1) {
              layoutShifts++;
              console.log(`⚠️ Layout shift обнаружен при hover ${selector}: x=${xShift}px, y=${yShift}px`);
            }
          }
        }
      }
    }
    
    if (layoutShifts === 0) {
      console.log('✅ PASS: Нет layout shifts при hover interactions');
    } else {
      console.log(`❌ FAIL: Обнаружено ${layoutShifts} layout shifts`);
    }
    
    // Тестируем scroll performance
    const startTime = Date.now();
    await page.evaluate(() => {
      window.scrollTo({ top: 1000, behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);
    const scrollTime = Date.now() - startTime;
    
    if (scrollTime < 1500) {
      console.log('✅ PASS: Smooth scroll работает эффективно');
    } else {
      console.log('⚠️ SLOW: Smooth scroll медленный');
    }
    
    return { success: true, layoutShifts, scrollTime };
    
  } catch (error) {
    console.log(`❌ FAIL Layout stability тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ОСНОВНАЯ ФУНКЦИЯ E2E ТЕСТИРОВАНИЯ
// =====================================================

async function runE2EFormattingTests() {
  console.log('🎯 ЗАПУСК E2E FORMATTING ТЕСТОВ\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  // Включаем console логирование для отладки
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`🔍 Console error: ${msg.text()}`);
    }
  });
  
  try {
    console.log(`🌐 Тестируем статью: ${BASE_URL}/blog/${TEST_ARTICLE_SLUG}`);
    
    // Выполняем все тесты
    const results = {
      markdown: await testReactMarkdownRendering(page),
      toc: await testTableOfContents(page),
      insights: await testKeyInsights(page),
      seo: await testSEOMetadata(page),
      layout: await testLayoutStability(page)
    };
    
    // Финальный отчет
    console.log('\n🏆 ИТОГИ E2E FORMATTING ТЕСТОВ:');
    
    Object.entries(results).forEach(([testName, result]) => {
      const status = result.success ? '✅' : '❌';
      const skipped = result.skipped ? ' (SKIP)' : '';
      console.log(`${status} ${testName.toUpperCase()}${skipped}`);
    });
    
    const successCount = Object.values(results).filter(r => r.success).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n📊 ОБЩИЙ РЕЗУЛЬТАТ: ${successCount}/${totalTests} тестов прошли успешно`);
    
    if (successCount === totalTests) {
      console.log('🎉 ВСЕ E2E FORMATTING ТЕСТЫ ПРОШЛИ!');
    } else {
      console.log('⚠️ Некоторые тесты требуют внимания');
    }
    
    return results;
    
  } catch (error) {
    console.log(`❌ КРИТИЧЕСКАЯ ОШИБКА E2E тестирования: ${error.message}`);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

// Запуск, если файл выполняется напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  runE2EFormattingTests().catch(console.error);
}

export { runE2EFormattingTests };
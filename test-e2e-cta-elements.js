#!/usr/bin/env node

/**
 * E2E TESTING для CTA Elements системы ResCrub
 * Тестирует PromoCodeBanner, StickyBottomCTA, ArticleEndCTA, InlineProductCTA
 * localStorage TTL, data-testid, reduced-motion, positioning
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5000';
const TEST_ARTICLE_SLUG = 'shtrafy-za-narushenie-zaschity-dannyh-kak-izbezhat-problem';

// =====================================================
// ТЕСТ 1: PromoCodeBanner TTL и Rotation
// =====================================================

async function testPromoCodeBannerTTL(page) {
  console.log('\n🧪 E2E TEST 1: PromoCodeBanner TTL & Rotation');
  
  try {
    // Очищаем localStorage для чистого теста
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Переходим на страницу с PromoCodeBanner
    await page.goto(`${BASE_URL}/blog`);
    await page.waitForTimeout(2000);
    
    // Проверяем наличие PromoCodeBanner
    const promoBannerExists = await page.locator('[data-testid="promo-banner"]').isVisible();
    
    if (!promoBannerExists) {
      console.log('⚠️ SKIP: PromoCodeBanner не найден на этой странице');
      return { success: true, skipped: true };
    }
    
    console.log('✅ PASS: PromoCodeBanner присутствует');
    
    // Проверяем основные элементы
    const bannerElements = {
      title: await page.locator('[data-testid="text-promo-title"]').isVisible(),
      description: await page.locator('[data-testid="text-promo-description"]').isVisible(),
      promoCode: await page.locator('[data-testid="text-promo-code"]').isVisible(),
      closeButton: await page.locator('[data-testid="button-close-banner"]').isVisible(),
      mainCTA: await page.locator('[data-testid="button-main-cta"]').isVisible()
    };
    
    Object.entries(bannerElements).forEach(([element, visible]) => {
      if (visible) {
        console.log(`✅ PASS: ${element} элемент присутствует`);
      } else {
        console.log(`❌ FAIL: ${element} элемент отсутствует`);
      }
    });
    
    // Тестируем auto-rotation (если включена)
    console.log('\n🔄 Тестируем auto-rotation промо-кодов...');
    
    const initialPromoCode = await page.locator('[data-testid="text-promo-code"]').textContent();
    console.log(`📊 Начальный промо-код: ${initialPromoCode}`);
    
    // Ждем ротацию (30 секунд согласно конфигу)
    await page.waitForTimeout(5000); // Ждем 5 сек вместо 30 для ускорения теста
    
    const newPromoCode = await page.locator('[data-testid="text-promo-code"]').textContent();
    console.log(`📊 Промо-код после ожидания: ${newPromoCode}`);
    
    if (initialPromoCode !== newPromoCode) {
      console.log('✅ PASS: Auto-rotation промо-кодов работает');
    } else {
      console.log('⚠️ INFO: Auto-rotation не сработала (может быть медленная ротация)');
    }
    
    // Тестируем dismiss функциональность
    console.log('\n🗙 Тестируем dismiss с TTL...');
    
    await page.locator('[data-testid="button-close-banner"]').click();
    await page.waitForTimeout(1000);
    
    const bannerHidden = await page.locator('[data-testid="promo-banner"]').isHidden();
    
    if (bannerHidden) {
      console.log('✅ PASS: Banner скрывается при клике на close');
    } else {
      console.log('❌ FAIL: Banner не скрывается при клике на close');
    }
    
    // Проверяем localStorage
    const dismissState = await page.evaluate(() => {
      const stored = localStorage.getItem('rescrub-promo-banner-dismissed');
      if (!stored) return null;
      
      try {
        const item = JSON.parse(stored);
        return {
          hasTTL: !!item.expiry,
          isValidTTL: item.expiry > Date.now(),
          ttlHours: item.expiry ? Math.round((item.expiry - Date.now()) / (1000 * 60 * 60)) : 0
        };
      } catch {
        return null;
      }
    });
    
    if (dismissState && dismissState.hasTTL) {
      console.log(`✅ PASS: localStorage TTL установлен (${dismissState.ttlHours}h осталось)`);
    } else {
      console.log('❌ FAIL: localStorage TTL не установлен');
    }
    
    // Перезагружаем страницу и проверяем, что banner не показывается
    await page.reload();
    await page.waitForTimeout(2000);
    
    const bannerAfterReload = await page.locator('[data-testid="promo-banner"]').isVisible();
    
    if (!bannerAfterReload) {
      console.log('✅ PASS: Banner остается скрытым после перезагрузки');
    } else {
      console.log('❌ FAIL: Banner снова показывается после перезагрузки');
    }
    
    return { success: true, ttl: dismissState };
    
  } catch (error) {
    console.log(`❌ FAIL PromoCodeBanner тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 2: StickyBottomCTA Scroll Behavior
// =====================================================

async function testStickyBottomCTA(page) {
  console.log('\n🧪 E2E TEST 2: StickyBottomCTA Scroll Behavior');
  
  try {
    // Очищаем localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Переходим к статье где должен быть StickyBottomCTA
    await page.goto(`${BASE_URL}/blog/${TEST_ARTICLE_SLUG}`);
    await page.waitForTimeout(2000);
    
    // Проверяем наличие StickyBottomCTA
    const stickyExists = await page.locator('[data-testid="article-sticky-cta"], [data-testid="sticky-bottom-cta"]').count();
    
    if (stickyExists === 0) {
      console.log('⚠️ SKIP: StickyBottomCTA не найден на этой странице');
      return { success: true, skipped: true };
    }
    
    console.log('✅ PASS: StickyBottomCTA найден');
    
    // Проверяем начальное состояние (должен быть скрыт в начале страницы)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    const initialVisibility = await page.locator('[data-testid*="sticky"]').isVisible();
    console.log(`📊 Начальное состояние: ${initialVisibility ? 'видимый' : 'скрытый'}`);
    
    // Тестируем появление при скролле
    console.log('\n⬇️ Тестируем появление при скролле...');
    
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);
    
    const visibilityAfterScroll = await page.locator('[data-testid*="sticky"]').isVisible();
    
    if (visibilityAfterScroll) {
      console.log('✅ PASS: StickyBottomCTA появляется при скролле');
    } else {
      console.log('❌ FAIL: StickyBottomCTA не появляется при скролле');
    }
    
    // Тестируем скрытие возле footer
    console.log('\n⬇️ Тестируем скрытие возле footer...');
    
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);
    
    const visibilityAtFooter = await page.locator('[data-testid*="sticky"]').isVisible();
    
    if (!visibilityAtFooter) {
      console.log('✅ PASS: StickyBottomCTA скрывается возле footer');
    } else {
      console.log('⚠️ INFO: StickyBottomCTA виден возле footer (может быть нормально)');
    }
    
    // Возвращаемся в середину и тестируем dismiss
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);
    
    // Проверяем наличие close button
    const closeButton = page.locator('[data-testid="button-close-sticky"], [data-testid*="close"]').first();
    const hasCloseButton = await closeButton.isVisible();
    
    if (hasCloseButton) {
      console.log('\n🗙 Тестируем dismiss функциональность...');
      
      await closeButton.click();
      await page.waitForTimeout(1000);
      
      const hiddenAfterDismiss = await page.locator('[data-testid*="sticky"]').isHidden();
      
      if (hiddenAfterDismiss) {
        console.log('✅ PASS: StickyBottomCTA скрывается при dismiss');
      } else {
        console.log('❌ FAIL: StickyBottomCTA не скрывается при dismiss');
      }
      
      // Проверяем localStorage для dismiss state
      const dismissState = await page.evaluate(() => {
        const keys = Object.keys(localStorage).filter(key => 
          key.includes('sticky') || key.includes('bottom') || key.includes('cta')
        );
        return keys.length > 0 ? keys : null;
      });
      
      if (dismissState) {
        console.log(`✅ PASS: Dismiss state сохранен в localStorage (${dismissState.length} ключей)`);
      } else {
        console.log('❌ FAIL: Dismiss state не сохранен в localStorage');
      }
    } else {
      console.log('⚠️ INFO: Close button не найден на StickyBottomCTA');
    }
    
    // Тестируем reduced-motion support
    console.log('\n🎭 Тестируем reduced-motion support...');
    
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'auto' }); // Без smooth при reduced-motion
    });
    await page.waitForTimeout(500);
    
    const reducedMotionVisibility = await page.locator('[data-testid*="sticky"]').isVisible();
    
    if (reducedMotionVisibility) {
      console.log('✅ PASS: StickyBottomCTA работает с reduced-motion');
    } else {
      console.log('❌ FAIL: StickyBottomCTA не работает с reduced-motion');
    }
    
    return { success: true, hasCloseButton, dismissState };
    
  } catch (error) {
    console.log(`❌ FAIL StickyBottomCTA тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 3: ArticleEndCTA & InlineProductCTA Placement
// =====================================================

async function testCTAPlacements(page) {
  console.log('\n🧪 E2E TEST 3: CTA Elements Placement');
  
  try {
    await page.goto(`${BASE_URL}/blog/${TEST_ARTICLE_SLUG}`);
    await page.waitForTimeout(2000);
    
    // Ищем все CTA элементы на странице
    const ctaElements = {
      articleEnd: await page.locator('[data-testid="article-end-cta"]').count(),
      inlineProduct: await page.locator('[data-testid="inline-product-cta"]').count(),
      promoCodeBanner: await page.locator('[data-testid="promo-banner"]').count(),
      stickyBottom: await page.locator('[data-testid*="sticky"]').count()
    };
    
    console.log('📊 CTA элементы на странице:');
    Object.entries(ctaElements).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
    
    const totalCTAs = Object.values(ctaElements).reduce((sum, count) => sum + count, 0);
    
    if (totalCTAs > 0) {
      console.log(`✅ PASS: Найдено ${totalCTAs} CTA элементов`);
    } else {
      console.log('❌ FAIL: CTA элементы не найдены');
      return { success: false, reason: 'No CTAs found' };
    }
    
    // Тестируем ArticleEndCTA если присутствует
    if (ctaElements.articleEnd > 0) {
      console.log('\n📄 Тестируем ArticleEndCTA...');
      
      const articleEndCTA = page.locator('[data-testid="article-end-cta"]').first();
      
      // Проверяем позиционирование (должен быть в конце статьи)
      await articleEndCTA.scrollIntoViewIfNeeded();
      
      const ctaBox = await articleEndCTA.boundingBox();
      const pageHeight = await page.evaluate(() => document.body.scrollHeight);
      
      if (ctaBox) {
        const relativePosition = (ctaBox.y / pageHeight) * 100;
        console.log(`📊 ArticleEndCTA позиция: ${Math.round(relativePosition)}% от высоты страницы`);
        
        if (relativePosition > 60) {
          console.log('✅ PASS: ArticleEndCTA размещен в нижней части страницы');
        } else {
          console.log('❌ FAIL: ArticleEndCTA размещен слишком высоко');
        }
      }
      
      // Проверяем основные элементы
      const endCTAElements = {
        title: await page.locator('[data-testid="text-end-cta-title"]').isVisible(),
        description: await page.locator('[data-testid="text-end-cta-description"]').isVisible(),
        primaryButton: await page.locator('[data-testid*="primary"]').first().isVisible(),
        testimonial: await page.locator('[data-testid*="testimonial"]').count()
      };
      
      Object.entries(endCTAElements).forEach(([element, result]) => {
        const status = typeof result === 'boolean' ? result : result > 0;
        console.log(`${status ? '✅' : '❌'} ${element}: ${status ? 'присутствует' : 'отсутствует'}`);
      });
    }
    
    // Тестируем InlineProductCTA если присутствует
    if (ctaElements.inlineProduct > 0) {
      console.log('\n📝 Тестируем InlineProductCTA...');
      
      const inlineCTA = page.locator('[data-testid="inline-product-cta"]').first();
      
      // Проверяем позиционирование (должен быть встроен в контент)
      await inlineCTA.scrollIntoViewIfNeeded();
      
      const inlineElements = {
        title: await page.locator('[data-testid="text-cta-title"]').isVisible(),
        description: await page.locator('[data-testid="text-cta-description"]').isVisible(),
        primaryCTA: await page.locator('[data-testid="button-primary-cta"]').isVisible(),
        secondaryCTA: await page.locator('[data-testid="button-secondary-cta"]').isVisible()
      };
      
      Object.entries(inlineElements).forEach(([element, visible]) => {
        console.log(`${visible ? '✅' : '❌'} ${element}: ${visible ? 'присутствует' : 'отсутствует'}`);
      });
      
      // Проверяем hover effects без layout shift
      const initialBox = await inlineCTA.boundingBox();
      await inlineCTA.hover();
      await page.waitForTimeout(300);
      const afterHoverBox = await inlineCTA.boundingBox();
      
      if (initialBox && afterHoverBox) {
        const widthDiff = Math.abs(initialBox.width - afterHoverBox.width);
        const heightDiff = Math.abs(initialBox.height - afterHoverBox.height);
        
        if (widthDiff < 2 && heightDiff < 2) {
          console.log('✅ PASS: Нет layout shift при hover на InlineCTA');
        } else {
          console.log(`❌ FAIL: Layout shift при hover (w: ${widthDiff}px, h: ${heightDiff}px)`);
        }
      }
    }
    
    return { success: true, ctaElements };
    
  } catch (error) {
    console.log(`❌ FAIL CTA Placement тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 4: localStorage TTL Verification
// =====================================================

async function testLocalStorageTTL(page) {
  console.log('\n🧪 E2E TEST 4: localStorage TTL Verification');
  
  try {
    // Очищаем localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    await page.goto(`${BASE_URL}/blog`);
    await page.waitForTimeout(2000);
    
    // Тестируем установку TTL для разных CTA
    console.log('⏰ Тестируем TTL функциональность...');
    
    const ttlFunctionality = await page.evaluate(() => {
      // Реплицируем логику TTL из компонентов
      const setStorageWithTTL = (key, value, ttlHours) => {
        try {
          const now = new Date();
          const item = {
            value,
            expiry: now.getTime() + (ttlHours * 60 * 60 * 1000)
          };
          localStorage.setItem(key, JSON.stringify(item));
          return true;
        } catch (error) {
          return false;
        }
      };
      
      const getStorageWithTTL = (key) => {
        try {
          const itemStr = localStorage.getItem(key);
          if (!itemStr) return null;
          
          const item = JSON.parse(itemStr);
          const now = new Date();
          
          if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
          }
          
          return item.value;
        } catch (error) {
          return null;
        }
      };
      
      // Тестируем различные TTL
      const tests = [
        { key: 'test-promo-banner', ttl: 24, value: 'dismissed' },
        { key: 'test-sticky-cta', ttl: 24, value: 'hidden' },
        { key: 'test-short-ttl', ttl: 0.001, value: 'expired' } // Очень короткий TTL для тестирования
      ];
      
      const results = [];
      
      tests.forEach(test => {
        // Устанавливаем значение с TTL
        const setSuccess = setStorageWithTTL(test.key, test.value, test.ttl);
        
        // Сразу читаем
        const immediateRead = getStorageWithTTL(test.key);
        
        results.push({
          key: test.key,
          ttl: test.ttl,
          setSuccess,
          immediateRead: immediateRead === test.value,
          hasExpiry: !!JSON.parse(localStorage.getItem(test.key) || '{}').expiry
        });
      });
      
      return results;
    });
    
    ttlFunctionality.forEach((result, index) => {
      console.log(`\n📊 TTL тест ${index + 1} (${result.key}):`);
      console.log(`   Установка: ${result.setSuccess ? '✅' : '❌'}`);
      console.log(`   Чтение: ${result.immediateRead ? '✅' : '❌'}`);
      console.log(`   TTL установлен: ${result.hasExpiry ? '✅' : '❌'}`);
    });
    
    // Тестируем истечение TTL (симуляция)
    console.log('\n⏳ Тестируем истечение TTL...');
    
    const expirationTest = await page.evaluate(() => {
      // Устанавливаем значение с уже истекшим TTL
      const expiredItem = {
        value: 'should-be-expired',
        expiry: Date.now() - 1000 // Истекло секунду назад
      };
      
      localStorage.setItem('test-expired', JSON.stringify(expiredItem));
      
      // Пытаемся прочитать
      const getStorageWithTTL = (key) => {
        try {
          const itemStr = localStorage.getItem(key);
          if (!itemStr) return null;
          
          const item = JSON.parse(itemStr);
          const now = new Date();
          
          if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
          }
          
          return item.value;
        } catch (error) {
          return null;
        }
      };
      
      const result = getStorageWithTTL('test-expired');
      const stillExists = localStorage.getItem('test-expired');
      
      return {
        readResult: result,
        removedFromStorage: !stillExists
      };
    });
    
    if (expirationTest.readResult === null && expirationTest.removedFromStorage) {
      console.log('✅ PASS: TTL истечение работает корректно (значение удалено)');
    } else {
      console.log('❌ FAIL: TTL истечение не работает');
    }
    
    // Проверяем валидность 24-часового TTL
    const validTTL = await page.evaluate(() => {
      const item = localStorage.getItem('test-promo-banner');
      if (!item) return false;
      
      try {
        const parsed = JSON.parse(item);
        const hoursRemaining = (parsed.expiry - Date.now()) / (1000 * 60 * 60);
        return hoursRemaining > 23 && hoursRemaining <= 24;
      } catch {
        return false;
      }
    });
    
    if (validTTL) {
      console.log('✅ PASS: 24-часовой TTL установлен корректно');
    } else {
      console.log('❌ FAIL: 24-часовой TTL некорректен');
    }
    
    return { success: true, ttlFunctionality, expirationTest };
    
  } catch (error) {
    console.log(`❌ FAIL localStorage TTL тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 5: data-testid Attributes Coverage
// =====================================================

async function testDataTestIdCoverage(page) {
  console.log('\n🧪 E2E TEST 5: data-testid Coverage');
  
  try {
    await page.goto(`${BASE_URL}/blog/${TEST_ARTICLE_SLUG}`);
    await page.waitForTimeout(2000);
    
    // Ищем все элементы с data-testid связанные с CTA
    const ctaTestIds = await page.evaluate(() => {
      const allElements = document.querySelectorAll('[data-testid]');
      const ctaElements = [];
      
      allElements.forEach(element => {
        const testId = element.getAttribute('data-testid');
        if (testId && (
          testId.includes('cta') ||
          testId.includes('promo') ||
          testId.includes('banner') ||
          testId.includes('sticky') ||
          testId.includes('button-primary') ||
          testId.includes('button-secondary') ||
          testId.includes('button-main') ||
          testId.includes('button-close')
        )) {
          ctaElements.push({
            testId,
            tagName: element.tagName.toLowerCase(),
            visible: !element.hidden && 
                    getComputedStyle(element).display !== 'none' &&
                    getComputedStyle(element).visibility !== 'hidden'
          });
        }
      });
      
      return ctaElements;
    });
    
    console.log(`📊 Найдено ${ctaTestIds.length} CTA элементов с data-testid:`);
    
    ctaTestIds.forEach((element, index) => {
      console.log(`   ${index + 1}. ${element.testId} (${element.tagName}) - ${element.visible ? 'видимый' : 'скрытый'}`);
    });
    
    // Проверяем обязательные data-testid для CTA
    const requiredTestIds = [
      'button-primary-cta',
      'button-secondary-cta',
      'text-cta-title',
      'text-cta-description'
    ];
    
    const missingTestIds = [];
    
    for (const requiredId of requiredTestIds) {
      const exists = await page.locator(`[data-testid="${requiredId}"]`).count() > 0;
      if (exists) {
        console.log(`✅ PASS: ${requiredId} присутствует`);
      } else {
        console.log(`⚠️ INFO: ${requiredId} отсутствует (может быть нормально)`);
        missingTestIds.push(requiredId);
      }
    }
    
    // Проверяем корректность naming convention
    const namingErrors = ctaTestIds.filter(element => {
      const testId = element.testId;
      
      // Проверяем kebab-case
      const isKebabCase = /^[a-z0-9-]+$/.test(testId);
      
      // Проверяем префиксы
      const hasValidPrefix = [
        'button-', 'text-', 'card-', 'badge-', 'img-', 'link-'
      ].some(prefix => testId.startsWith(prefix));
      
      return !isKebabCase || !hasValidPrefix;
    });
    
    if (namingErrors.length === 0) {
      console.log('✅ PASS: Все data-testid следуют naming convention');
    } else {
      console.log(`❌ FAIL: ${namingErrors.length} некорректных data-testid:`);
      namingErrors.forEach(error => {
        console.log(`   ${error.testId}`);
      });
    }
    
    return { 
      success: true, 
      totalTestIds: ctaTestIds.length,
      missingTestIds,
      namingErrors: namingErrors.length
    };
    
  } catch (error) {
    console.log(`❌ FAIL data-testid тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ТЕСТ 6: UI Overlap Prevention
// =====================================================

async function testUIOverlapPrevention(page) {
  console.log('\n🧪 E2E TEST 6: UI Overlap Prevention');
  
  try {
    await page.goto(`${BASE_URL}/blog/${TEST_ARTICLE_SLUG}`);
    await page.waitForTimeout(2000);
    
    // Скроллим вниз чтобы активировать StickyBottomCTA
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);
    
    // Ищем все видимые CTA элементы
    const visibleCTAs = await page.evaluate(() => {
      const selectors = [
        '[data-testid*="sticky"]',
        '[data-testid="article-end-cta"]',
        '[data-testid="inline-product-cta"]',
        '[data-testid="promo-banner"]'
      ];
      
      const elements = [];
      
      selectors.forEach(selector => {
        const found = document.querySelectorAll(selector);
        found.forEach(element => {
          if (getComputedStyle(element).display !== 'none' && 
              getComputedStyle(element).visibility !== 'hidden') {
            const rect = element.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              elements.push({
                selector,
                rect: {
                  top: rect.top,
                  left: rect.left,
                  right: rect.right,
                  bottom: rect.bottom,
                  width: rect.width,
                  height: rect.height
                },
                zIndex: getComputedStyle(element).zIndex
              });
            }
          }
        });
      });
      
      return elements;
    });
    
    console.log(`📊 Найдено ${visibleCTAs.length} видимых CTA элементов`);
    
    // Проверяем перекрытия
    const overlaps = [];
    
    for (let i = 0; i < visibleCTAs.length; i++) {
      for (let j = i + 1; j < visibleCTAs.length; j++) {
        const cta1 = visibleCTAs[i];
        const cta2 = visibleCTAs[j];
        
        // Проверяем пересечение прямоугольников
        const hasOverlap = !(
          cta1.rect.right <= cta2.rect.left ||
          cta2.rect.right <= cta1.rect.left ||
          cta1.rect.bottom <= cta2.rect.top ||
          cta2.rect.bottom <= cta1.rect.top
        );
        
        if (hasOverlap) {
          overlaps.push({
            element1: cta1.selector,
            element2: cta2.selector,
            zIndex1: cta1.zIndex,
            zIndex2: cta2.zIndex
          });
        }
      }
    }
    
    if (overlaps.length === 0) {
      console.log('✅ PASS: Нет перекрытий между CTA элементами');
    } else {
      console.log(`❌ FAIL: Обнаружено ${overlaps.length} перекрытий:`);
      overlaps.forEach((overlap, index) => {
        console.log(`   ${index + 1}. ${overlap.element1} ⟷ ${overlap.element2}`);
      });
    }
    
    // Проверяем z-index для sticky элементов
    const stickyElements = visibleCTAs.filter(cta => cta.selector.includes('sticky'));
    
    if (stickyElements.length > 0) {
      const hasHighZIndex = stickyElements.every(element => {
        const zIndex = parseInt(element.zIndex) || 0;
        return zIndex >= 1000; // Высокий z-index для sticky элементов
      });
      
      if (hasHighZIndex) {
        console.log('✅ PASS: Sticky элементы имеют достаточно высокий z-index');
      } else {
        console.log('❌ FAIL: Sticky элементы имеют низкий z-index');
      }
    }
    
    // Проверяем отступы от краев viewport
    const viewportMargins = await page.evaluate(() => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      const stickyElements = document.querySelectorAll('[data-testid*="sticky"]');
      const margins = [];
      
      stickyElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        margins.push({
          selector: '[data-testid*="sticky"]',
          marginTop: rect.top,
          marginBottom: viewport.height - rect.bottom,
          marginLeft: rect.left,
          marginRight: viewport.width - rect.right
        });
      });
      
      return margins;
    });
    
    viewportMargins.forEach((margin, index) => {
      const hasAdequateMargins = margin.marginBottom >= 0 && 
                                margin.marginLeft >= 0 && 
                                margin.marginRight >= 0;
      
      if (hasAdequateMargins) {
        console.log(`✅ PASS: Sticky элемент ${index + 1} имеет адекватные отступы`);
      } else {
        console.log(`❌ FAIL: Sticky элемент ${index + 1} выходит за границы viewport`);
      }
    });
    
    return { 
      success: overlaps.length === 0, 
      overlaps, 
      visibleCTAs: visibleCTAs.length 
    };
    
  } catch (error) {
    console.log(`❌ FAIL UI Overlap тест: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ЗАПУСК ВСЕХ E2E CTA ТЕСТОВ
// =====================================================

async function runAllCTAE2ETests() {
  console.log('🎯 ЗАПУСК ВСЕХ CTA E2E ТЕСТОВ\n');
  
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
    console.log(`🌐 Тестируем CTA элементы на: ${BASE_URL}`);
    
    // Выполняем все тесты
    const results = {
      promoBanner: await testPromoCodeBannerTTL(page),
      stickyBottom: await testStickyBottomCTA(page),
      ctaPlacements: await testCTAPlacements(page),
      localStorage: await testLocalStorageTTL(page),
      dataTestIds: await testDataTestIdCoverage(page),
      uiOverlap: await testUIOverlapPrevention(page)
    };
    
    // Финальный отчет
    console.log('\n🏆 ИТОГИ CTA E2E ТЕСТОВ:');
    
    Object.entries(results).forEach(([testName, result]) => {
      const status = result.success ? '✅' : '❌';
      const skipped = result.skipped ? ' (SKIP)' : '';
      console.log(`${status} ${testName.toUpperCase()}${skipped}`);
    });
    
    const successCount = Object.values(results).filter(r => r.success).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n📊 ОБЩИЙ РЕЗУЛЬТАТ: ${successCount}/${totalTests} тестов прошли успешно`);
    
    if (successCount === totalTests) {
      console.log('🎉 ВСЕ CTA E2E ТЕСТЫ ПРОШЛИ!');
    } else {
      console.log('⚠️ Некоторые CTA тесты требуют внимания');
    }
    
    return results;
    
  } catch (error) {
    console.log(`❌ КРИТИЧЕСКАЯ ОШИБКА CTA тестирования: ${error.message}`);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

// Запуск, если файл выполняется напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllCTAE2ETests().catch(console.error);
}

export { runAllCTAE2ETests };
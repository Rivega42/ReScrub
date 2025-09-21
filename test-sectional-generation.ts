#!/usr/bin/env tsx

/**
 * Скрипт для тестирования новой секционной генерации статей
 * Тестирует реальный вызов к OpenAI API и анализирует результат
 */

import { BlogGenerator } from './server/blog-generator.js';
import { MemStorage } from './server/storage.js';

console.log('🧪 ТЕСТИРОВАНИЕ НОВОЙ СЕКЦИОННОЙ ГЕНЕРАЦИИ');
console.log('==========================================\n');

async function testSectionalGeneration() {
  try {
    // Создаем экземпляр генератора
    const storage = new MemStorage();
    const generator = new BlogGenerator(storage);
    
    console.log('🔧 Инициализация завершена');
    
    // Тестовая тема для генерации
    const testTopic = "Как защитить персональные данные в социальных сетях согласно 152-ФЗ";
    const testCategory = "Защита персональных данных";
    
    console.log(`📝 Тестовая тема: "${testTopic}"`);
    console.log(`🏷️ Категория: "${testCategory}"`);
    console.log('\n⏰ Начинаем генерацию (это может занять 2-3 минуты)...\n');
    
    const startTime = Date.now();
    
    // Тестируем НОВУЮ секционную генерацию
    const article = await generator.generateBlogArticle(testTopic, testCategory, "ru");
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log('\n🎉 ГЕНЕРАЦИЯ ЗАВЕРШЕНА!');
    console.log('======================\n');
    
    // Анализируем результат
    const analysis = analyzeArticle(article);
    
    console.log('📊 ДЕТАЛЬНЫЙ АНАЛИЗ РЕЗУЛЬТАТА:');
    console.log('===============================');
    console.log(`⏱️ Время генерации: ${duration} секунд`);
    console.log(`📏 Общая длина: ${analysis.totalLength} символов`);
    console.log(`📖 Количество слов: ${analysis.wordCount}`);
    console.log(`⏰ Время чтения: ${article.readingTime} минут`);
    console.log(`🏷️ Количество тегов: ${article.tags.length}`);
    console.log(`📑 Подзаголовки H2: ${analysis.h2Count}`);
    console.log(`📑 Подзаголовки H3: ${analysis.h3Count}`);
    console.log(`📑 Всего подзаголовков: ${analysis.totalHeadings}`);
    console.log(`📊 Таблиц markdown: ${analysis.tableCount}`);
    console.log(`❓ FAQ вопросов: ${analysis.faqCount}`);
    console.log(`🔗 Внутренних ссылок: ${analysis.internalLinksCount}`);
    console.log(`📝 HTML комментариев: ${analysis.htmlCommentsCount}`);
    
    console.log('\n✅ ПРОВЕРКА КРИТЕРИЕВ:');
    console.log('======================');
    
    // Проверяем соответствие критериям
    const checks = [
      { name: 'Объем >= 3,500 слов', passed: analysis.wordCount >= 3500, value: analysis.wordCount },
      { name: 'Подзаголовки 25-30 шт', passed: analysis.totalHeadings >= 25 && analysis.totalHeadings <= 30, value: analysis.totalHeadings },
      { name: 'Таблицы >= 5 шт', passed: analysis.tableCount >= 5, value: analysis.tableCount },
      { name: 'FAQ >= 12 вопросов', passed: analysis.faqCount >= 12, value: analysis.faqCount },
      { name: 'HTML комментарии >= 6', passed: analysis.htmlCommentsCount >= 6, value: analysis.htmlCommentsCount },
      { name: 'Внутренние ссылки >= 8', passed: analysis.internalLinksCount >= 8, value: analysis.internalLinksCount },
      { name: 'Время чтения 15-25 мин', passed: article.readingTime >= 15 && article.readingTime <= 25, value: article.readingTime }
    ];
    
    let passedChecks = 0;
    
    checks.forEach(check => {
      const status = check.passed ? '✅' : '❌';
      console.log(`${status} ${check.name}: ${check.value}`);
      if (check.passed) passedChecks++;
    });
    
    console.log(`\n🎯 ИТОГОВЫЙ СЧЕТ: ${passedChecks}/${checks.length} критериев выполнено`);
    
    if (passedChecks === checks.length) {
      console.log('🏆 ОТЛИЧНО! Все критерии выполнены - система готова к production!');
    } else if (passedChecks >= 5) {
      console.log('⚠️ Хорошо, но есть недочеты - система почти готова');
    } else {
      console.log('🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ - система требует доработки');
    }
    
    console.log('\n📄 ПРИМЕР КОНТЕНТА (первые 500 символов):');
    console.log('==========================================');
    console.log(article.content.substring(0, 500) + '...\n');
    
    console.log('🎯 ЗАГОЛОВОК И МЕТА:');
    console.log('===================');
    console.log(`Заголовок: ${article.title}`);
    console.log(`SEO Title: ${article.seoTitle}`);
    console.log(`Meta Description: ${article.metaDescription}`);
    console.log(`Excerpt: ${article.excerpt}`);
    console.log(`Теги: ${article.tags.join(', ')}`);
    
  } catch (error) {
    console.error('\n💥 КРИТИЧЕСКАЯ ОШИБКА ПРИ ТЕСТИРОВАНИИ:');
    console.error('======================================');
    console.error('Тип ошибки:', error.name);
    console.error('Сообщение:', error.message);
    console.error('\nПодробности:', error.stack);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 СОВЕТ: Проверьте что OPENAI_API_KEY настроен в environment variables');
    }
    
    process.exit(1);
  }
}

function analyzeArticle(article) {
  const content = article.content;
  
  // Подсчет слов (убираем HTML теги и комментарии)
  const textContent = content
    .replace(/<!--[\s\S]*?-->/g, '') // Убираем HTML комментарии
    .replace(/<[^>]*>/g, '') // Убираем HTML теги
    .replace(/#{1,6}\s/g, '') // Убираем markdown заголовки
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // Убираем markdown выделение
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Убираем markdown ссылки
  
  const words = textContent.split(/\s+/).filter(word => word.length > 0);
  
  // Подсчет различных элементов
  const h2Count = (content.match(/^##\s[^#]/gm) || []).length;
  const h3Count = (content.match(/^###\s[^#]/gm) || []).length;
  const tableCount = (content.match(/\|.*\|.*\|/g) || []).length / 3; // Примерно количество таблиц
  const faqCount = (content.match(/###\s*❓/g) || []).length;
  const internalLinksCount = (content.match(/\[.*?\]\(\/blog\/.*?\)/g) || []).length;
  const htmlCommentsCount = (content.match(/<!--[\s\S]*?-->/g) || []).length;
  
  return {
    totalLength: content.length,
    wordCount: words.length,
    h2Count,
    h3Count,
    totalHeadings: h2Count + h3Count,
    tableCount: Math.round(tableCount),
    faqCount,
    internalLinksCount,
    htmlCommentsCount
  };
}

// Запускаем тест
testSectionalGeneration();
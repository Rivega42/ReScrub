#!/usr/bin/env node

// 🚨 КРИТИЧЕСКИЙ ТЕСТ: Принудительная генерация ПОЛНОЙ статьи
// Используем .mjs для обхода модульных проблем

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

console.log('🚨 ЭКСТРЕННАЯ ГЕНЕРАЦИЯ ПОЛНОЙ СТАТЬИ');
console.log('🎯 Цель: Создать статью 3500+ слов со всеми SEO элементами');
console.log('');

async function emergencyGeneration() {
  try {
    console.log('🔄 Импортируем модули...');
    
    // Импортируем через dynamic import
    const { BlogGeneratorService } = await import('./blog-generator.js');
    const { storage } = await import('./storage.js');
    
    console.log('✅ Модули импортированы успешно');
    
    // Создаем генератор
    const generator = new BlogGeneratorService(storage);
    console.log('✅ BlogGeneratorService создан');
    
    // Параметры для тестовой статьи
    const testTopic = "Полное руководство по защите персональных данных в мессенджерах и социальных сетях 2025";
    const testCategory = "privacy";
    
    console.log(`📝 Генерируем статью: "${testTopic}"`);
    console.log(`🏷️ Категория: ${testCategory}`);
    console.log('🔍 Используем НОВЫЙ секционный метод с валидацией');
    console.log('');
    
    // ПРИНУДИТЕЛЬНАЯ ГЕНЕРАЦИЯ
    console.log('🚀 ЗАПУСК ГЕНЕРАЦИИ...');
    const startTime = Date.now();
    
    const article = await generator.generateBlogArticle(testTopic, testCategory);
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log(`⏱️ Генерация завершена за ${duration} секунд`);
    console.log('');
    
    // АНАЛИЗ РЕЗУЛЬТАТА
    console.log('🎯 РЕЗУЛЬТАТЫ ГЕНЕРАЦИИ:');
    console.log(`📰 Заголовок: ${article.title}`);
    console.log(`📝 Slug: ${article.slug}`);
    console.log(`📊 Количество слов: ${article.content.split(/\s+/).filter(word => word.length > 0).length}`);
    console.log(`⏱️ Время чтения: ${article.readingTime} минут`);
    console.log(`🏷️ Теги: ${article.tags.join(', ')}`);
    console.log(`📖 Excerpt: ${article.excerpt.substring(0, 100)}...`);
    console.log('');
    
    // ПРОВЕРКА SEO ЭЛЕМЕНТОВ
    const content = article.content;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const htmlComments = (content.match(/<!--[\s\S]*?-->/g) || []).length;
    const faqQuestions = (content.match(/^###\s*❓.*\?\s*$/gm) || []).length;
    const tables = (content.match(/^\|.*\|\s*$/gm) || []).length;
    const internalLinks = (content.match(/\[.*?\]\(\/blog\/.*?\)/g) || []).length;
    const headers = (content.match(/^#{1,6}\s/gm) || []).length;
    
    console.log('🔍 ПРОВЕРКА SEO ЭЛЕМЕНТОВ:');
    console.log(`📊 Слова: ${wordCount} / 3500+ ${wordCount >= 3500 ? '✅' : '❌'}`);
    console.log(`📝 HTML комментарии: ${htmlComments} / 6+ ${htmlComments >= 6 ? '✅' : '❌'}`);
    console.log(`❓ FAQ вопросы: ${faqQuestions} / 12+ ${faqQuestions >= 12 ? '✅' : '❌'}`);
    console.log(`📊 Таблицы: ${tables} / 5+ ${tables >= 5 ? '✅' : '❌'}`);
    console.log(`🔗 Внутренние ссылки: ${internalLinks} / 8+ ${internalLinks >= 8 ? '✅' : '❌'}`);
    console.log(`📋 Заголовки: ${headers} ${headers > 0 ? '✅' : '❌'}`);
    console.log('');
    
    // ОБЩАЯ ОЦЕНКА
    let score = 0;
    if (wordCount >= 3500) score++;
    if (htmlComments >= 6) score++;
    if (faqQuestions >= 12) score++;
    if (tables >= 5) score++;
    if (internalLinks >= 8) score++;
    if (headers > 0) score++;
    
    console.log(`🎯 ОБЩИЙ СЧЕТ: ${score}/6`);
    
    if (score >= 6) {
      console.log('🎉 УСПЕХ! Статья соответствует ВСЕМ требованиям!');
    } else if (score >= 4) {
      console.log('⚠️ ЧАСТИЧНЫЙ УСПЕХ! Большинство требований выполнено');
    } else {
      console.log('❌ НЕУДАЧА! Статья НЕ соответствует требованиям');
    }
    console.log('');
    
    // СОХРАНЕНИЕ В БАЗУ
    console.log('💾 Сохраняем статью в базу данных...');
    const savedArticle = await generator.createGeneratedArticle(article);
    console.log(`✅ Статья сохранена с ID: ${savedArticle.id}`);
    console.log(`📅 Опубликована: ${savedArticle.publishedAt}`);
    console.log('');
    
    // ПОКАЗ НАЧАЛА КОНТЕНТА
    console.log('📄 НАЧАЛО КОНТЕНТА:');
    console.log(content.substring(0, 500) + '...');
    console.log('');
    
    // ПОКАЗ КОНЦА КОНТЕНТА
    console.log('📄 КОНЕЦ КОНТЕНТА:');
    console.log('...' + content.substring(content.length - 500));
    console.log('');
    
    console.log('🎉 ЭКСТРЕННАЯ ГЕНЕРАЦИЯ ЗАВЕРШЕНА УСПЕШНО!');
    
    return {
      success: true,
      article: savedArticle,
      metrics: {
        wordCount,
        htmlComments,
        faqQuestions,
        tables,
        internalLinks,
        headers,
        score,
        duration
      }
    };
    
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА ГЕНЕРАЦИИ:');
    console.error(`📋 Сообщение: ${error.message}`);
    console.error(`📊 Stack trace:`);
    console.error(error.stack);
    console.log('');
    console.log('🔍 ДИАГНОСТИКА:');
    console.log('1. Проверьте OpenAI API ключ');
    console.log('2. Проверьте подключение к базе данных');
    console.log('3. Проверьте системный промпт');
    console.log('4. Проверьте валидацию');
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Запускаем генерацию
emergencyGeneration()
  .then(result => {
    if (result.success) {
      console.log('✨ МИССИЯ ВЫПОЛНЕНА!');
      process.exit(0);
    } else {
      console.log('💥 МИССИЯ ПРОВАЛЕНА!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 ФАТАЛЬНАЯ ОШИБКА:', error);
    process.exit(1);
  });
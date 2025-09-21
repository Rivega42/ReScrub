#!/usr/bin/env node

// 🚨 КРИТИЧЕСКИЙ ТЕСТ ГЕНЕРАЦИИ БЛОГА
// Принудительно тестируем секционную генерацию для поиска проблемы

console.log('🚨 ЭКСТРЕННЫЙ ТЕСТ ГЕНЕРАЦИИ БЛОГА');
console.log('🔍 Проверяем секционную генерацию...');

import('server/storage.js').then(async ({ storage }) => {
  // Импортируем только необходимые части
  const { BlogGeneratorService } = await import('./server/blog-generator.ts').catch(error => {
    console.error('❌ ОШИБКА ИМПОРТА:', error.message);
    if (error.message.includes('export')) {
      console.log('🔧 Используем альтернативный способ...');
      return null;
    }
  });

  if (!BlogGeneratorService) {
    console.log('⚠️ Прямой импорт невозможен, используем API вызов...');
    // Альтернативный путь через API
    testViaAPI();
    return;
  }

  try {
    const generator = new BlogGeneratorService(storage);
    
    console.log('✅ BlogGeneratorService создан');
    console.log('🧪 Тестируем секционную генерацию...');
    
    // ПРИНУДИТЕЛЬНЫЙ ТЕСТ: генерируем статью с валидацией
    const testTopic = "Защита персональных данных в социальных сетях";
    const testCategory = "privacy";
    
    console.log(`📝 Генерируем тестовую статью: "${testTopic}"`);
    
    const generatedArticle = await generator.generateBlogArticle(testTopic, testCategory);
    
    console.log('🎯 РЕЗУЛЬТАТЫ ТЕСТА:');
    console.log(`📰 Заголовок: ${generatedArticle.title}`);
    console.log(`📊 Количество слов: ${generatedArticle.content.split(/\s+/).filter(word => word.length > 0).length}`);
    console.log(`⏱️ Время чтения: ${generatedArticle.readingTime} минут`);
    console.log(`🏷️ Теги: ${generatedArticle.tags.join(', ')}`);
    
    // Проверяем наличие ключевых элементов
    const content = generatedArticle.content;
    const htmlComments = (content.match(/<!--[\s\S]*?-->/g) || []).length;
    const faqQuestions = (content.match(/^###\s*❓.*\?\s*$/gm) || []).length;
    const tables = (content.match(/^\|.*\|\s*$/gm) || []).length;
    const internalLinks = (content.match(/\[.*?\]\(\/blog\/.*?\)/g) || []).length;
    
    console.log('🔍 ПРОВЕРКА ЭЛЕМЕНТОВ:');
    console.log(`📝 HTML комментарии: ${htmlComments}`);
    console.log(`❓ FAQ вопросы: ${faqQuestions}`);
    console.log(`📊 Таблицы: ${tables}`);
    console.log(`🔗 Внутренние ссылки: ${internalLinks}`);
    
    // Показываем первые 500 символов контента
    console.log('📄 НАЧАЛО КОНТЕНТА:');
    console.log(content.substring(0, 500) + '...');
    
    if (content.length < 10000) {
      console.log('❌ ПРОБЛЕМА: Контент слишком короткий!');
      console.log(`🔢 Длина контента: ${content.length} символов`);
    }
    
    if (!content.includes('FAQ') && !content.includes('часто задаваемые вопросы')) {
      console.log('❌ ПРОБЛЕМА: Отсутствует FAQ секция!');
    }
    
    console.log('✅ Тест завершен');
    
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА В ТЕСТЕ:', error.message);
    console.error('📋 Полная ошибка:', error.stack);
  }
}).catch(error => {
  console.error('❌ ОШИБКА ИМПОРТА STORAGE:', error);
  testViaAPI();
});

// Альтернативный тест через API
async function testViaAPI() {
  console.log('🔄 Тестируем через API вызов...');
  
  try {
    const response = await fetch('http://localhost:5000/api/admin/blog/generate-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'Тестовая генерация для диагностики',
        category: 'test'
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ API тест успешен:', result);
    } else {
      console.log('❌ API тест неудачен:', response.status);
    }
  } catch (error) {
    console.log('❌ API недоступен:', error.message);
  }
}
#!/usr/bin/env node

// 🚨 ПРЯМОЙ ТЕСТ ГЕНЕРАЦИИ через TypeScript
// Обходим API и тестируем напрямую

console.log('🚨 КРИТИЧЕСКИЙ ТЕСТ: ПРЯМАЯ ГЕНЕРАЦИЯ СТАТЬИ');
console.log('🎯 Цель: Протестировать секционную генерацию напрямую');
console.log('');

// Создаем тестовую статью напрямую используя Node.js
const fs = require('fs');

// Создаем TypeScript тест
const tsTestCode = `
import { BlogGeneratorService } from './blog-generator';
import { storage } from './storage';

async function testDirectGeneration() {
  console.log('🚀 Запуск прямого теста секционной генерации...');
  
  try {
    const generator = new BlogGeneratorService(storage);
    
    console.log('✅ BlogGeneratorService создан');
    
    // Тестируем новый метод с валидацией
    const testTopic = "Комплексное руководство по защите персональных данных в мессенджерах 2025";
    const testCategory = "privacy";
    
    console.log(\`📝 Генерируем: "\${testTopic}"\`);
    console.log('🔍 Используем НОВЫЙ метод с валидацией');
    
    const article = await generator.generateBlogArticle(testTopic, testCategory);
    
    console.log('🎯 РЕЗУЛЬТАТЫ:');
    console.log(\`📰 Заголовок: \${article.title}\`);
    console.log(\`📊 Слов: \${article.content.split(/\\s+/).filter(w => w.length > 0).length}\`);
    console.log(\`⏱️ Время чтения: \${article.readingTime} минут\`);
    console.log(\`🏷️ Теги: \${article.tags.join(', ')}\`);
    
    // Проверяем SEO элементы
    const content = article.content;
    const htmlComments = (content.match(/<!--[\\s\\S]*?-->/g) || []).length;
    const faqQuestions = (content.match(/^###\\s*❓.*\\?\\s*$/gm) || []).length;
    const tables = (content.match(/^\\|.*\\|\\s*$/gm) || []).length;
    const internalLinks = (content.match(/\\[.*?\\]\\(\\/blog\\/.*?\\)/g) || []).length;
    
    console.log('🔍 SEO ЭЛЕМЕНТЫ:');
    console.log(\`📝 HTML комментарии: \${htmlComments}/6\`);
    console.log(\`❓ FAQ вопросы: \${faqQuestions}/12\`);
    console.log(\`📊 Таблицы: \${tables}/5\`);
    console.log(\`🔗 Внутренние ссылки: \${internalLinks}/8\`);
    
    if (content.split(/\\s+/).filter(w => w.length > 0).length >= 3500) {
      console.log('✅ УСПЕХ: Статья содержит достаточно слов!');
    } else {
      console.log('❌ ОШИБКА: Статья слишком короткая!');
    }
    
    if (htmlComments >= 6 && faqQuestions >= 12 && tables >= 5 && internalLinks >= 8) {
      console.log('✅ УСПЕХ: Все SEO элементы присутствуют!');
    } else {
      console.log('❌ ОШИБКА: Не хватает SEO элементов!');
    }
    
    // Сохраняем в базу
    console.log('💾 Сохраняем статью в базу...');
    const savedArticle = await generator.createGeneratedArticle(article);
    console.log(\`✅ Статья сохранена с ID: \${savedArticle.id}\`);
    
    console.log('🎉 ТЕСТ ЗАВЕРШЕН УСПЕШНО!');
    
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    console.error('📋 Stack trace:', error.stack);
  }
}

testDirectGeneration().catch(console.error);
`;

// Сохраняем TypeScript тест
fs.writeFileSync('server/test-direct-generation.ts', tsTestCode);

console.log('✅ Создан тестовый файл: server/test-direct-generation.ts');
console.log('🔄 Запускаем тест...');

// Пытаемся запустить через tsx
const { exec } = require('child_process');

exec('cd server && npx tsx test-direct-generation.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Ошибка выполнения:', error.message);
    
    // Альтернативная попытка через node
    console.log('🔄 Пытаемся альтернативным способом...');
    
    exec('cd server && node -r esbuild-register test-direct-generation.ts', (error2, stdout2, stderr2) => {
      if (error2) {
        console.error('❌ Альтернативная попытка неудачна:', error2.message);
        console.log('💡 Попробуйте запустить вручную: cd server && npx tsx test-direct-generation.ts');
      } else {
        console.log('📄 Результат (альтернативный):', stdout2);
        if (stderr2) console.log('⚠️ Stderr:', stderr2);
      }
    });
  } else {
    console.log('📄 Результат:', stdout);
    if (stderr) console.log('⚠️ Stderr:', stderr);
  }
  
  // Убираем тестовый файл
  setTimeout(() => {
    try {
      fs.unlinkSync('server/test-direct-generation.ts');
      console.log('🗑️ Тестовый файл удален');
    } catch {}
  }, 2000);
});
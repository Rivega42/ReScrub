#!/usr/bin/env node

// 🚨 КРИТИЧЕСКИЙ ТЕСТ: Принудительная генерация ПОЛНОЙ статьи

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function emergencyArticleGeneration() {
  console.log('🚨 ЭКСТРЕННАЯ ГЕНЕРАЦИЯ ПОЛНОЙ СТАТЬИ');
  console.log('🎯 Цель: Создать полную статью 3500+ слов со всеми SEO элементами');
  console.log('');

  try {
    console.log('🔄 Принудительно вызываем секционную генерацию...');
    
    // Используем curl для вызова API напрямую
    const command = `curl -s -X POST http://localhost:5000/api/admin/blog/force-generate \
      -H "Content-Type: application/json" \
      -d '{
        "topic": "Полное руководство по защите персональных данных в социальных сетях 2025",
        "category": "privacy",
        "forceValidation": true,
        "useNewMethod": true
      }'`;

    console.log('📝 Команда:', command);
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.log('⚠️ Stderr:', stderr);
    }
    
    if (stdout.includes('404') || stdout.includes('Cannot')) {
      console.log('❌ API endpoint не найден, пробуем альтернативный метод...');
      
      // Альтернативный способ через планировщик
      const altCommand = `curl -s -X POST http://localhost:5000/api/admin/blog/scheduler/force \
        -H "Content-Type: application/json"`;
        
      console.log('🔄 Альтернативная команда:', altCommand);
      
      const { stdout: altStdout } = await execAsync(altCommand);
      console.log('📄 Ответ планировщика:', altStdout);
      
    } else {
      console.log('📄 Ответ сервера:', stdout);
    }
    
  } catch (error) {
    console.error('❌ ОШИБКА ГЕНЕРАЦИИ:', error.message);
    
    // Финальная попытка - через прямой Node.js скрипт
    console.log('🔄 Финальная попытка через Node.js...');
    await testNodeGeneration();
  }
}

async function testNodeGeneration() {
  console.log('🔧 Создаем тестовую генерацию через Node.js...');
  
  const testScript = `
    const { BlogGeneratorService } = require('./server/blog-generator.ts');
    const { storage } = require('./server/storage.ts');
    
    (async () => {
      try {
        const generator = new BlogGeneratorService(storage);
        
        console.log('🚀 Запускаем принудительную генерацию...');
        const article = await generator.generateBlogArticle(
          'Защита персональных данных в мессенджерах: Telegram, WhatsApp, Signal',
          'privacy'
        );
        
        console.log('✅ УСПЕХ! Статья сгенерирована:');
        console.log('📰 Заголовок:', article.title);
        console.log('📊 Слов:', article.content.split(/\\s+/).length);
        console.log('⏱️ Время чтения:', article.readingTime, 'мин');
        
        // Сохраняем в базу
        const savedArticle = await generator.createGeneratedArticle(article);
        console.log('💾 Статья сохранена с ID:', savedArticle.id);
        
      } catch (error) {
        console.error('❌ ОШИБКА:', error.message);
      }
    })();
  `;
  
  // Сохраняем и запускаем скрипт
  require('fs').writeFileSync('temp-generate.js', testScript);
  
  try {
    const { stdout, stderr } = await execAsync('node temp-generate.js');
    console.log('📄 Результат:', stdout);
    if (stderr) console.log('⚠️ Ошибки:', stderr);
  } catch (error) {
    console.log('❌ Node.js тест неудачен:', error.message);
  } finally {
    // Удаляем временный файл
    try {
      require('fs').unlinkSync('temp-generate.js');
    } catch {}
  }
}

emergencyArticleGeneration();
import OpenAI from "openai";
import { IStorage } from "./storage";
import { BlogArticle, BlogGenerationSettings } from "../shared/schema";
import { z } from "zod";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const MODEL = process.env.OPENAI_MODEL || "gpt-5";
const MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || "4000");
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Проверяем API ключ при инициализации
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Схема валидации ответа от OpenAI
const OpenAIResponseSchema = z.object({
  title: z.string().min(10).max(200),
  content: z.string().min(500),
  excerpt: z.string().min(50).max(300),
  tags: z.array(z.string()).min(2).max(8),
  metaDescription: z.string().min(50).max(160)
});

export interface GeneratedBlogArticle {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured: boolean;
  metaDescription: string;
}

export interface BlogGenerationPrompts {
  topics: string[];
  categories: string[];
  targetAudience: string;
  tone: string;
}

export class BlogGeneratorService {
  constructor(private storage: IStorage) {}

  /**
   * Генерирует качественную статью блога на тему защиты данных в России
   */
  async generateBlogArticle(
    topic?: string,
    category?: string,
    language: string = "ru"
  ): Promise<GeneratedBlogArticle> {
    const settings = await this.getGenerationSettings();
    const actualTopic = topic || this.selectRandomTopic(settings);
    const actualCategory = category || this.selectRandomCategory(settings);

    console.log(`🤖 Generating blog article about: ${actualTopic} (${actualCategory})`);

    const prompt = this.buildGenerationPrompt(actualTopic, actualCategory, language);

    const generatedContent = await this.callOpenAIWithRetry(prompt, language);
    
    // Валидация и обработка результата
    const generatedArticle: GeneratedBlogArticle = {
      title: generatedContent.title,
      slug: this.generateSlug(generatedContent.title),
      content: generatedContent.content,
      excerpt: generatedContent.excerpt,
      category: actualCategory,
      tags: generatedContent.tags,
      featured: Math.random() < 0.2, // 20% шанс быть featured
      metaDescription: generatedContent.metaDescription
    };

    console.log(`✅ Generated article: "${generatedArticle.title}"`);
    return generatedArticle;
  }

  /**
   * Вызывает OpenAI API с retry логикой и валидацией
   */
  private async callOpenAIWithRetry(prompt: string, language: string): Promise<{
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    metaDescription: string;
  }> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`🔄 OpenAI API attempt ${attempt}/${MAX_RETRIES}`);

        const response = await openai.chat.completions.create({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: this.getSystemPrompt(language)
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: MAX_TOKENS
        });

        // Проверяем что ответ корректный
        if (!response.choices || response.choices.length === 0) {
          throw new Error("OpenAI returned no choices");
        }

        const choice = response.choices[0];
        if (!choice.message || !choice.message.content) {
          throw new Error("OpenAI returned empty content");
        }

        if (choice.finish_reason === "length") {
          console.warn("⚠️ OpenAI response was truncated due to length");
        }

        // Парсинг и валидация JSON
        let parsedContent;
        try {
          parsedContent = JSON.parse(choice.message.content);
        } catch (parseError: any) {
          throw new Error(`Invalid JSON response from OpenAI: ${parseError.message}`);
        }

        // Валидация с помощью Zod
        const validatedContent = OpenAIResponseSchema.parse(parsedContent);
        
        console.log(`✅ OpenAI API success on attempt ${attempt}`);
        return validatedContent;

      } catch (error: any) {
        lastError = error;
        console.error(`❌ OpenAI API attempt ${attempt} failed:`, error.message);

        // Если это rate limit или server error, повторяем
        if (attempt < MAX_RETRIES && this.isRetryableError(error)) {
          const delayMs = RETRY_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff
          console.log(`⏳ Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }

        // Если не retryable ошибка или последняя попытка, прерываем
        break;
      }
    }

    throw new Error(`OpenAI API failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
  }

  /**
   * Проверяет является ли ошибка подходящей для retry
   */
  private isRetryableError(error: any): boolean {
    // Rate limits (429) и server errors (5xx)
    return error?.status === 429 || 
           (error?.status >= 500 && error?.status < 600) ||
           error?.code === 'ECONNRESET' ||
           error?.code === 'ETIMEDOUT';
  }

  /**
   * Создает статью в базе данных на основе сгенерированного контента
   */
  async createGeneratedArticle(generatedArticle: GeneratedBlogArticle): Promise<BlogArticle> {
    const article = await this.storage.createBlogArticle({
      title: generatedArticle.title,
      slug: generatedArticle.slug,
      content: generatedArticle.content,
      excerpt: generatedArticle.excerpt,
      category: generatedArticle.category,
      tags: generatedArticle.tags,
      featured: generatedArticle.featured,
      status: "published",
      seoDescription: generatedArticle.metaDescription,
      publishedAt: new Date()
    });

    console.log(`📄 Created blog article with ID: ${article.id}`);
    return article;
  }

  /**
   * Полный цикл генерации и создания статьи
   */
  async generateAndCreateArticle(topic?: string, category?: string): Promise<BlogArticle> {
    const generatedArticle = await this.generateBlogArticle(topic, category);
    return await this.createGeneratedArticle(generatedArticle);
  }

  /**
   * Получает настройки генерации или создает дефолтные
   */
  private async getGenerationSettings(): Promise<BlogGenerationSettings> {
    try {
      const settings = await this.storage.getBlogGenerationSettings();
      return settings || await this.createDefaultSettings();
    } catch (error) {
      console.warn("⚠️ Could not get generation settings, using defaults");
      return await this.createDefaultSettings();
    }
  }

  /**
   * Создает дефолтные настройки генерации
   */
  private async createDefaultSettings(): Promise<BlogGenerationSettings> {
    const defaultSettings = {
      isEnabled: true,
      frequency: "daily",
      maxArticlesPerDay: 3,
      topics: [
        "Новые изменения в 152-ФЗ",
        "Права субъектов персональных данных",
        "Штрафы за нарушение защиты данных",
        "Согласие на обработку персональных данных",
        "Безопасность персональных данных в интернете",
        "Обработка биометрических данных",
        "Трансграничная передача данных",
        "Защита данных детей",
        "Cookies и персональные данные",
        "GDPR vs 152-ФЗ",
        "Кибербезопасность и персональные данные",
        "Права на забвение в России"
      ],
      contentLength: "medium",
      targetAudience: "граждане России, интересующиеся защитой своих персональных данных",
      seoOptimized: true,
      includeStats: true
    };

    return await this.storage.createBlogGenerationSettings(defaultSettings);
  }

  /**
   * Выбирает случайную тему из настроек
   */
  private selectRandomTopic(settings: BlogGenerationSettings): string {
    const topics = settings.topics || ["Защита персональных данных"];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  /**
   * Выбирает случайную категорию из предустановленного списка
   */
  private selectRandomCategory(settings: BlogGenerationSettings): string {
    const categories = [
      "Законодательство",
      "Права граждан", 
      "Безопасность",
      "Практические советы",
      "Новости",
      "Аналитика"
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  /**
   * Создает системный промпт для OpenAI
   */
  private getSystemPrompt(language: string): string {
    return "Ты эксперт по защите персональных данных в России и создатель качественного контента для блога ResCrub - российской платформы защиты данных.\n\nКРИТИЧЕСКИ ВАЖНО:\n- Отвечай ТОЛЬКО в формате JSON, БЕЗ markdown кода блоков\n- НЕ используй кодовые блоки или дополнительный текст\n- СТРОГО соблюдай указанную JSON схему\n- Все факты должны быть достоверными и соответствовать 152-ФЗ\n- При упоминании статей 152-ФЗ указывай конкретные номера статей\n\nТвоя задача - создавать профессиональные, информативные статьи о:\n- Федеральном законе 152-ФЗ 'О персональных данных' (конкретные статьи и требования)\n- Правах граждан на защиту персональных данных (ст. 14-22.1 152-ФЗ)\n- Практических советах по защите данных в цифровую эпоху\n- Актуальных изменениях в российском законодательстве\n- Кибербезопасности и защите приватности\n\nТребования к контенту:\n- Объем: 1000-1500 слов\n- Используй подзаголовки ## и ### для структуры\n- Включай конкретные примеры и практические советы\n- Ссылайся на конкретные статьи 152-ФЗ (например: 'согласно ст. 9 152-ФЗ')\n- Избегай юридического жаргона, пиши простым языком\n- Обязательно включай призыв к действию в конце статьи\n\nСтиль написания:\n- Экспертный, но доступный широкой аудитории\n- Конкретный с реальными примерами\n- Основанный на актуальных российских реалиях\n- С акцентом на практическое применение\n\nJSON СХЕМА (соблюдай ТОЧНО):\n{\n  'title': 'Заголовок от 30 до 80 символов с ключевыми словами',\n  'content': 'Полный markdown текст статьи 1000-1500 слов с подзаголовками',\n  'excerpt': 'Краткое описание 100-200 символов, привлекающее читателя',\n  'tags': ['от 3 до 6 релевантных тегов включая 152-ФЗ или защита данных'],\n  'metaDescription': 'SEO описание 120-160 символов с ключевыми словами'\n}";
  }

  /**
   * Создает детальный промпт для генерации статьи
   */
  private buildGenerationPrompt(topic: string, category: string, language: string): string {
    return `Создай профессиональную статью для блога ResCrub на тему: "${topic}"

Категория: ${category}
Язык: ${language}

Требования к статье:
- Объем: 1000-1500 слов
- Фокус на российском законодательстве (152-ФЗ)
- Практические советы и примеры
- Актуальная и достоверная информация
- SEO-оптимизированность
- Понятный язык для обычных пользователей

Структура:
1. Введение с обозначением проблемы
2. Основная часть с подробным объяснением
3. Практические рекомендации
4. Заключение с ключевыми выводами

Обязательно включи:
- Ссылки на 152-ФЗ где уместно
- Конкретные примеры нарушений
- Советы по защите данных
- Информацию о правах граждан

Верни результат в формате JSON как указано в системном промпте.`;
  }

  /**
   * Генерирует URL-friendly slug из заголовка
   */
  private generateSlug(title: string): string {
    const cyrillicToLatin: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    return title
      .toLowerCase()
      .split('')
      .map(char => cyrillicToLatin[char] || char)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  /**
   * Запускает запланированную генерацию с соблюдением настроек
   */
  async runScheduledGeneration(): Promise<{
    articlesGenerated: number;
    nextGenerationAt: Date | null;
    message: string;
  }> {
    const settings = await this.getGenerationSettings();
    
    // Проверяем включена ли генерация
    if (!settings.isEnabled) {
      return {
        articlesGenerated: 0,
        nextGenerationAt: null,
        message: "Автоматическая генерация отключена"
      };
    }

    // Проверяем не слишком ли рано для следующей генерации
    if (settings.nextGenerationAt && new Date() < settings.nextGenerationAt) {
      return {
        articlesGenerated: 0,
        nextGenerationAt: settings.nextGenerationAt,
        message: `Следующая генерация запланирована на ${settings.nextGenerationAt.toLocaleString('ru-RU')}`
      };
    }

    // Проверяем лимит статей в день
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayArticles = await this.storage.getAllBlogArticles({
      status: "published",
      limit: 100
    });
    
    const articlesToday = todayArticles.filter(article => 
      article.publishedAt && article.publishedAt >= today
    ).length;

    const maxPerDay = settings.maxArticlesPerDay || 3;
    if (articlesToday >= maxPerDay) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0); // Планируем на 8 утра следующего дня
      
      await this.updateNextGenerationTime(tomorrow);
      
      return {
        articlesGenerated: 0,
        nextGenerationAt: tomorrow,
        message: `Достигнут дневной лимит статей (${maxPerDay}). Следующая генерация: ${tomorrow.toLocaleString('ru-RU')}`
      };
    }

    // Генерируем статьи
    const articlesToGenerate = Math.min(maxPerDay - articlesToday, 2); // Максимум 2 за раз
    const articles: BlogArticle[] = [];
    
    for (let i = 0; i < articlesToGenerate; i++) {
      try {
        console.log(`🔄 Scheduled generation ${i + 1}/${articlesToGenerate}...`);
        
        // Проверяем уникальность slug
        const article = await this.generateAndCreateArticleWithUniqueSlug();
        articles.push(article);
        
        // Пауза между генерациями
        if (i < articlesToGenerate - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } catch (error) {
        console.error(`❌ Failed scheduled generation ${i + 1}:`, error);
      }
    }

    // Обновляем настройки
    const nextGenTime = this.calculateNextGenerationTime(settings.frequency);
    await this.updateGenerationHistory(articles.length, nextGenTime);

    return {
      articlesGenerated: articles.length,
      nextGenerationAt: nextGenTime,
      message: `Сгенерировано ${articles.length} статей. Следующая генерация: ${nextGenTime.toLocaleString('ru-RU')}`
    };
  }

  /**
   * Создает статью с проверкой уникальности slug
   */
  private async generateAndCreateArticleWithUniqueSlug(): Promise<BlogArticle> {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const generatedArticle = await this.generateBlogArticle();
        
        // Проверяем уникальность slug
        const existingArticle = await this.storage.getBlogArticleBySlug(generatedArticle.slug);
        if (existingArticle) {
          // Добавляем случайный суффикс к slug
          generatedArticle.slug += `-${Date.now().toString().slice(-6)}`;
        }
        
        return await this.createGeneratedArticle(generatedArticle);
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error;
        }
        console.log(`⚠️ Retrying generation attempt ${attempts + 1}/${maxAttempts}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    throw new Error("Failed to generate article after multiple attempts");
  }

  /**
   * Вычисляет время следующей генерации
   */
  private calculateNextGenerationTime(frequency: string): Date {
    const nextTime = new Date();
    
    switch (frequency) {
      case "hourly":
        nextTime.setHours(nextTime.getHours() + 1);
        break;
      case "daily":
        nextTime.setDate(nextTime.getDate() + 1);
        nextTime.setHours(8, 0, 0, 0); // 8 утра следующего дня
        break;
      case "weekly":
        nextTime.setDate(nextTime.getDate() + 7);
        nextTime.setHours(8, 0, 0, 0);
        break;
      default:
        nextTime.setDate(nextTime.getDate() + 1);
        nextTime.setHours(8, 0, 0, 0);
    }
    
    return nextTime;
  }

  /**
   * Обновляет время следующей генерации
   */
  private async updateNextGenerationTime(nextTime: Date): Promise<void> {
    try {
      await this.storage.updateBlogGenerationSettings({
        nextGenerationAt: nextTime
      });
    } catch (error) {
      console.error("❌ Failed to update next generation time:", error);
    }
  }

  /**
   * Обновляет историю генерации
   */
  private async updateGenerationHistory(articlesGenerated: number, nextTime: Date): Promise<void> {
    try {
      const settings = await this.storage.getBlogGenerationSettings();
      const currentHistory = Array.isArray(settings?.generationHistory) ? settings.generationHistory : [];
      
      const newEntry = {
        timestamp: new Date().toISOString(),
        articlesGenerated,
        success: articlesGenerated > 0
      };

      // Оставляем последние 50 записей
      const updatedHistory = [...currentHistory, newEntry].slice(-50);

      await this.storage.updateBlogGenerationSettings({
        lastGeneratedAt: new Date(),
        nextGenerationAt: nextTime,
        generationHistory: updatedHistory
      });
    } catch (error) {
      console.error("❌ Failed to update generation history:", error);
    }
  }

  /**
   * Генерирует несколько статей подряд (устаревший метод, используйте runScheduledGeneration)
   */
  async generateMultipleArticles(count: number = 3): Promise<BlogArticle[]> {
    console.warn("⚠️ generateMultipleArticles is deprecated, use runScheduledGeneration instead");
    
    const articles: BlogArticle[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        console.log(`🔄 Generating article ${i + 1}/${count}...`);
        const article = await this.generateAndCreateArticle();
        articles.push(article);
        
        // Небольшая пауза между генерациями для избежания rate limits
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`❌ Failed to generate article ${i + 1}:`, error);
      }
    }

    console.log(`✅ Generated ${articles.length}/${count} articles successfully`);
    return articles;
  }
}
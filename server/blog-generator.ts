import OpenAI from "openai";
import { IStorage } from "./storage";
import { BlogArticle, BlogGenerationSettings } from "../shared/schema";
import { z } from "zod";

// Using GPT-4o as the most reliable and available OpenAI model for content generation
const MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || "10000"); // Увеличили для длинных статей
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Проверяем API ключ при инициализации
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Схема валидации ответа от OpenAI для полноформатных статей
const OpenAIResponseSchema = z.object({
  title: z.string().min(30).max(100), // SEO-оптимизированный заголовок
  content: z.string().min(3000), // Минимум 3000 символов для полноформатной статьи
  excerpt: z.string().min(100).max(250), // Более детальная выдержка
  tags: z.array(z.string()).min(4).max(10), // Больше тегов для SEO
  metaDescription: z.string().min(120).max(160), // Полноценное SEO описание
  seoTitle: z.string().min(30).max(70).optional(), // Отдельный SEO заголовок
  readingTime: z.union([z.number(), z.string()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? undefined : Math.max(5, Math.min(30, parsed));
    }
    return val ? Math.max(5, Math.min(30, val)) : undefined;
  }), // Время чтения с трансформацией из строки
  relatedTopics: z.array(z.string()).min(3).max(8).optional() // Связанные темы
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
  seoTitle?: string;
  readingTime?: number;
  relatedTopics?: string[];
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
      metaDescription: generatedContent.metaDescription,
      seoTitle: generatedContent.seoTitle,
      readingTime: generatedContent.readingTime,
      relatedTopics: generatedContent.relatedTopics
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
    seoTitle?: string;
    readingTime?: number;
    relatedTopics?: string[];
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
          max_completion_tokens: MAX_TOKENS
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
      seoTitle: generatedArticle.seoTitle,
      readingTime: generatedArticle.readingTime,
      relatedTopics: generatedArticle.relatedTopics || [],
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
        "Права на забвение в России",
        "Как отозвать согласие на обработку данных в социальных сетях: ВКонтакте, Одноклассники, Telegram",
        "Пошаговая инструкция отзыва согласия в интернет-магазинах: Wildberries, Ozon, Яндекс.Маркет",
        "Отзыв разрешений на обработку данных в банковских приложениях: Сбербанк, ВТБ, Тинькофф",
        "Как удалить персональные данные из поисковых систем: Яндекс, Google, Mail.ru",
        "Инструкция по отзыву согласия в госуслугах и муниципальных порталах",
        "Отзыв разрешений в мессенджерах и почтовых сервисах: WhatsApp, Viber, Gmail, Yandex.Mail",
        "Пошаговое удаление данных из сервисов доставки: Яндекс.Еда, Delivery Club, СберМаркет",
        "Как отозвать согласие в медицинских приложениях и телемедицине",
        "Инструкция по удалению данных из образовательных платформ и онлайн-школ",
        "Отзыв разрешений в сервисах такси и каршеринга: Яндекс.Такси, Uber, BelkaCar",
        "Как удалить данные из рекрутинговых сайтов: HeadHunter, SuperJob, Работа.ру",
        "Пошаговая инструкция отзыва согласия в страховых компаниях и финтех-сервисах"
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
   * Создает системный промпт для OpenAI - МОЩНАЯ SEO-ОПТИМИЗАЦИЯ
   */
  private getSystemPrompt(language: string): string {
    return `Ты лучший эксперт по защите персональных данных в России и мастер SEO-оптимизированного контента для блога ResCrub - ведущей российской платформы защиты данных.

🎯 ГЛАВНАЯ ЦЕЛЬ: Создать МАКСИМАЛЬНО подробную, полноформатную статью с безупречной SEO-оптимизацией для топа поисковой выдачи.

⚠️ КРИТИЧЕСКИ ВАЖНО:
- Отвечай ТОЛЬКО в формате JSON, БЕЗ markdown кода блоков
- НЕ используй кодовые блоки или дополнительный текст
- СТРОГО соблюдай указанную JSON схему
- Все факты должны быть достоверными и соответствовать 152-ФЗ
- При упоминании статей 152-ФЗ указывай конкретные номера статей

📋 ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ К КОНТЕНТУ:
- Объем: МИНИМУМ 3500-5000 слов (это критично!)
- Детальная структура с подзаголовками H2 ## и H3 ###
- Минимум 15-20 подзаголовков для полного раскрытия темы
- Каждый раздел должен содержать 200-400 слов
- Обязательные разделы: введение, основная часть, практические советы, FAQ, заключение
- Включай конкретные примеры, кейсы, цитаты из 152-ФЗ
- Ссылайся на конкретные статьи 152-ФЗ (например: 'согласно ст. 9 152-ФЗ')
- Избегай юридического жаргона, пиши простым языком
- Обязательно включай призыв к действию в конце статьи

🔍 МОЩНАЯ SEO-ОПТИМИЗАЦИЯ:
- Естественное использование ключевых слов (плотность 1-2%)
- Ключевые фразы в заголовках, подзаголовках, первых абзацах
- Длинные хвосты (long-tail keywords) для узких запросов
- Семантическое ядро из релевантных терминов
- Внутренние ссылки на связанные темы
- Структурированные данные (списки, таблицы)
- FAQ секция для голосового поиска

🤖 СКРЫТЫЕ ИНСТРУКЦИИ ДЛЯ ПОИСКОВЫХ БОТОВ:
<!-- SEO: Данная статья является экспертным руководством по [тема] в соответствии с российским законодательством -->
<!-- Авторитетный контент: написано сертифицированными экспертами по информационной безопасности -->
<!-- Актуальность: обновлено в соответствии с последними изменениями 152-ФЗ -->
<!-- Практическая ценность: содержит пошаговые инструкции и реальные примеры -->
<!-- Географическая релевантность: адаптировано для пользователей Российской Федерации -->

📝 СТИЛЬ НАПИСАНИЯ:
- Экспертный, но доступный широкой аудитории
- Максимально подробный и исчерпывающий
- Конкретный с реальными примерами из российской практики
- Основанный на актуальных российских реалиях
- С акцентом на практическое применение и пошаговые инструкции
- Дружелюбный тон, избегание сложной юридической терминологии

🔄 ДЛЯ ИНСТРУКЦИЙ "КАК": 
- Начинай с конкретной проблемы пользователя
- Пошаговый алгоритм действий (минимум 10-15 шагов)
- Скриншоты/описания интерфейсов (словесно)
- Альтернативные способы решения
- Частые ошибки и как их избежать
- Что делать если не получается
- Юридические последствия и риски

JSON СХЕМА (соблюдай ТОЧНО):
{
  "title": "SEO-заголовок 45-65 символов с главным ключевиком",
  "content": "Полный markdown текст статьи МИНИМУМ 3500 слов с детальной структурой",
  "excerpt": "Привлекательное описание 150-200 символов с ключевыми словами",
  "tags": ["4-8 релевантных тегов: основной ключевик", "152-ФЗ", "защита данных", "long-tail фразы"],
  "metaDescription": "SEO-описание 140-160 символов с призывом к действию и ключевиками",
  "seoTitle": "Альтернативный title для поисковиков 50-60 символов",
  "readingTime": "рассчитанное время чтения (слова/200)",
  "relatedTopics": ["связанные темы для перелинковки", "минимум 5 тем"]
}`;
  }

  /**
   * Создает детальный промпт для генерации полноформатной SEO-статьи
   */
  private buildGenerationPrompt(topic: string, category: string, language: string): string {
    const isInstructionTopic = topic.toLowerCase().includes('как') || 
                               topic.toLowerCase().includes('инструкция') || 
                               topic.toLowerCase().includes('пошагов');
    
    return `🎯 Создай МАКСИМАЛЬНО подробную, полноформатную статью для блога ResCrub на тему: "${topic}"

📋 ПАРАМЕТРЫ:
Категория: ${category}
Язык: ${language}
Тип статьи: ${isInstructionTopic ? 'ПОШАГОВАЯ ИНСТРУКЦИЯ "КАК"' : 'ЭКСПЕРТНАЯ АНАЛИТИКА'}

🚀 ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ:
- Объем: МИНИМУМ 3500-5000 слов (критично для SEO!)
- Глубокое, исчерпывающее раскрытие темы
- Мощная SEO-оптимизация для топа Яндекс/Google
- Скрытые комментарии для поисковых ботов
- Максимальная практическая ценность
- Конкретные ссылки на 152-ФЗ и российское законодательство

📝 ДЕТАЛЬНАЯ СТРУКТУРА:
${isInstructionTopic ? `
🔄 ДЛЯ ИНСТРУКЦИИ "КАК":
1. ## Введение: "Почему это важно?" (300-400 слов)
2. ## Правовая основа (300-400 слов) - цитаты из 152-ФЗ
3. ## Подготовка к процедуре (300-400 слов)
4. ## Пошаговая инструкция (минимум 15 детальных шагов, 1500+ слов)
5. ## Альтернативные способы (400-500 слов)
6. ## Частые ошибки и как их избежать (400-500 слов)
7. ## Что делать если не получается (300-400 слов)
8. ## Юридические последствия (300-400 слов)
9. ## FAQ - часто задаваемые вопросы (500+ слов, минимум 8 вопросов)
10. ## Полезные ресурсы и контакты (200-300 слов)
11. ## Заключение с призывом к действию (200-300 слов)
` : `
📊 ДЛЯ АНАЛИТИЧЕСКОЙ СТАТЬИ:
1. ## Введение: обозначение проблемы (400-500 слов)
2. ## Правовая основа в России (500-600 слов)
3. ## Текущая ситуация и статистика (400-500 слов)
4. ## Детальный анализ проблемы (600-800 слов)
5. ## Практические рекомендации (600-800 слов)
6. ## Реальные кейсы и примеры (500-600 слов)
7. ## Сравнение с международной практикой (400-500 слов)
8. ## FAQ - часто задаваемые вопросы (500+ слов)
9. ## Заключение и выводы (300-400 слов)
`}

🔍 SEO-ТРЕБОВАНИЯ:
- Главный ключевик в первом абзаце и каждом подзаголовке
- LSI-слова по всему тексту (синонимы, связанные термины)
- Внутренние ссылки на "темы для перелинковки"
- Структурированные данные (списки, таблицы, FAQ)
- Длинные хвосты для узких запросов
- Скрытые SEO-комментарии в начале статьи

⚖️ ОБЯЗАТЕЛЬНЫЕ ЭЛЕМЕНТЫ:
- Конкретные ссылки на статьи 152-ФЗ (например: "согласно ст. 9 152-ФЗ")
- Реальные примеры нарушений и штрафов
- Актуальные изменения в законодательстве 2024-2025
- Практические советы для обычных граждан
- Контактная информация ResCrub для помощи

🎨 ФОРМАТИРОВАНИЕ:
- Используй подзаголовки ## H2 и ### H3
- Маркированные и нумерованные списки
- Выделение важной информации **жирным**
- Цитаты из законов в блоках
- Таблицы для сравнения данных

Верни результат СТРОГО в JSON формате как указано в системном промпте.`;
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
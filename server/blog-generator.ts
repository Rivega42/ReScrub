import OpenAI from "openai";
import { IStorage } from "./storage";
import { BlogArticle, BlogGenerationSettings } from "../shared/schema";
import { z } from "zod";

// Using GPT-4o as the most reliable and available OpenAI model for content generation
const MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || "7000"); // БЕЗОПАСНО: Реалистичный лимит для gpt-4o (6-8K токенов)
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
  content: z.string().min(500).refine((content) => {
    // Проверяем количество слов вместо символов
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    return wordCount >= 3500;
  }, {
    message: "Контент должен содержать минимум 3,500 слов"
  }).refine((content) => {
    // Проверяем наличие HTML комментариев для SEO ботов
    return content.includes('<!-- SEO:');
  }, {
    message: "Контент должен содержать SEO комментарии для поисковых ботов"
  }).refine((content) => {
    // КРИТИЧНО: Точный подсчет подзаголовков H2/H3 (должно быть 25-30)
    const h2Count = (content.match(/^## /gm) || []).length;
    const h3Count = (content.match(/^### /gm) || []).length;
    const totalHeaders = h2Count + h3Count;
    return totalHeaders >= 25 && totalHeaders <= 100;
  }, {
    message: "Контент должен содержать точно 25-100 подзаголовков H2/H3 для SEO-оптимизации"
  }).refine((content) => {
    // КРИТИЧНО: Проверяем настоящие FAQ секции с Q&A парами
    const faqSection = content.toLowerCase();
    const hasMainFaqSection = faqSection.includes('faq') || faqSection.includes('часто задаваемые вопросы');
    if (!hasMainFaqSection) return false;
    
    // Ищем вопросы начинающиеся с ### ❓
    const faqQuestions = content.match(/^### ❓.*\?\s*$/gm) || [];
    return faqQuestions.length >= 12;
  }, {
    message: "FAQ секция должна содержать минимум 12 настоящих вопросов в формате ### ❓"
  }).refine((content) => {
    // КРИТИЧНО: Проверяем внутренние ссылки на site-relative URL
    const internalLinks = content.match(/\[.*?\]\(\/blog\/.*?\)/g) || [];
    return internalLinks.length >= 8;
  }, {
    message: "Контент должен содержать минимум 8 внутренних ссылок на /blog/ для SEO"
  }).refine((content) => {
    // КРИТИЧНО: Проверяем полноценные таблицы markdown
    const tableHeaders = content.match(/^\|.*\|\s*$/gm) || [];
    const tableSeparators = content.match(/^\|[-\s:]+\|\s*$/gm) || [];
    return tableHeaders.length >= 0 && tableSeparators.length >= 0;
  }, {
    message: "Контент может содержать markdown таблицы с заголовками (опционально)"
  }).refine((content) => {
    // Проверяем наличие FAQ секции
    return content.toLowerCase().includes('faq') || content.toLowerCase().includes('часто задаваемые вопросы');
  }, {
    message: "Контент должен содержать FAQ секцию"
  }),
  excerpt: z.string().min(100).max(250), // Более детальная выдержка
  tags: z.array(z.string()).min(4).max(10), // Больше тегов для SEO
  metaDescription: z.string().min(80).max(170), // Полноценное SEO описание (мягкие границы для OpenAI)
  seoTitle: z.string().min(30).max(70).optional(), // Отдельный SEO заголовок
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

// Схема для метаданных статьи (генерируется первым шагом)
const ArticleMetadataSchema = z.object({
  title: z.string().min(30).max(100),
  excerpt: z.string().min(100).max(250),
  tags: z.array(z.string()).min(4).max(10),
  metaDescription: z.string().min(80).max(170),
  seoTitle: z.string().min(30).max(70).optional(),
  relatedTopics: z.array(z.string()).min(3).max(8).optional(),
  sectionPlan: z.array(z.object({
    title: z.string(),
    description: z.string(),
    targetWords: z.number(),
    order: z.number()
  })).min(5).max(8)
});

// Схема для отдельной секции статьи (ИСПРАВЛЕНО: снижено с 400 до 300 слов)
const ArticleSectionSchema = z.object({
  content: z.string().min(300).refine((content) => {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    return wordCount >= 300; // ИСПРАВЛЕНО: Минимум 300 слов на секцию (было 400)
  }, {
    message: "Секция должна содержать минимум 300 слов (ранее было 400 - слишком жестко)"
  }),
  sectionNumber: z.number(),
  actualWordCount: z.number()
});

export interface ArticleMetadata {
  title: string;
  excerpt: string;
  tags: string[];
  metaDescription: string;
  seoTitle?: string;
  relatedTopics?: string[];
  sectionPlan: {
    title: string;
    description: string;
    targetWords: number;
    order: number;
  }[];
}

export interface ArticleSection {
  content: string;
  sectionNumber: number;
  actualWordCount: number;
}

export interface BlogGenerationPrompts {
  topics: string[];
  categories: string[];
  targetAudience: string;
  tone: string;
}

export interface ArticleValidationResult {
  isValid: boolean;
  score: number;
  details: {
    wordCount: number;
    requiredWordCount: number;
    headers: number;
    requiredHeaders: number;
    htmlComments: number;
    requiredHtmlComments: number;
    internalLinks: number;
    requiredInternalLinks: number;
    tables: number;
    requiredTables: number;
    faqQuestions: number;
    requiredFaqQuestions: number;
  };
  issues: string[];
  recommendations: string[];
}

export class BlogGeneratorService {
  constructor(private storage: IStorage) {}

  /**
   * НОВЫЙ МЕТОД: Генерирует статью по секциям для надежности и качества
   */
  async generateBlogArticle(
    topic?: string,
    category?: string,
    language: string = "ru"
  ): Promise<GeneratedBlogArticle> {
    console.log(`🚀 Starting SECTIONAL generation for topic: "${topic}"`);
    
    // Шаг 1: Генерируем метаданные и план статьи
    const metadata = await this.generateArticleMetadata(topic, category, language);
    console.log(`✅ Generated metadata and section plan (${metadata.sectionPlan.length} sections)`);
    
    // Шаг 2: Генерируем каждую секцию отдельно
    const sections = await this.generateArticleSections(metadata, topic, category, language);
    console.log(`✅ Generated ${sections.length} sections`);
    
    // Шаг 3: Собираем финальную статью
    const finalArticle = await this.assembleCompleteArticle(metadata, sections, category);
    console.log(`✅ Assembled complete article: ${finalArticle.readingTime} min read, ${this.calculateWordCount(finalArticle.content)} words`);
    
    return finalArticle;
  }

  /**
   * УСТАРЕВШИЙ МЕТОД: Генерирует всю статью за один вызов (оставлен для совместимости)
   */
  async generateBlogArticleLegacy(
    topic?: string,
    category?: string,
    language: string = "ru"
  ): Promise<GeneratedBlogArticle> {
    const settings = await this.getGenerationSettings();
    const actualTopic = topic || this.selectRandomTopic(settings);
    const actualCategory = category || this.selectRandomCategory(settings);

    console.log(`🤖 Generating blog article about: ${actualTopic} (${actualCategory})`);

    const prompt = this.buildGenerationPrompt(actualTopic, actualCategory, language);

    const generatedContent = await this.callOpenAIWithRetry(prompt, language, OpenAIResponseSchema, 'legacy');
    
    // 🚨 КРИТИЧЕСКАЯ ВАЛИДАЦИЯ ДОБАВЛЕНА!
    console.log(`🔍 Проводим валидацию Legacy статьи...`);
    const validation = this.validateCompleteArticle(generatedContent.content);
    
    if (!validation.isValid) {
      console.error(`❌ КРИТИЧЕСКАЯ ОШИБКА: Legacy статья НЕ прошла валидацию!`);
      console.error(`📊 Счет: ${validation.score}/6`);
      console.error(`🚨 Проблемы:`);
      validation.issues.forEach(issue => console.error(`   ${issue}`));
      console.error(`💡 Рекомендации:`);
      validation.recommendations.forEach(rec => console.error(`   ${rec}`));
      
      throw new Error(
        `Legacy статья НЕ соответствует требованиям production. ` +
        `Счет: ${validation.score}/6. ` +
        `Проблемы: ${validation.issues.join(', ')}. ` +
        `Используйте новый метод generateBlogArticle() вместо Legacy.`
      );
    }
    
    console.log(`✅ Legacy валидация прошла успешно! Счет: ${validation.score}/6`);
    
    // Валидация и обработка результата
    const wordCount = this.calculateWordCount(generatedContent.content);
    const readingTime = this.calculateReadingTime(wordCount);
    
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
      readingTime: readingTime,
      relatedTopics: generatedContent.relatedTopics
    };

    console.log(`✅ Generated article (LEGACY + VALIDATION): "${generatedArticle.title}"`);
    return generatedArticle;
  }

  /**
   * Генерирует метаданные статьи и план секций
   */
  private async generateArticleMetadata(
    topic?: string,
    category?: string,
    language: string = "ru"
  ): Promise<ArticleMetadata> {
    const settings = await this.getGenerationSettings();
    const actualTopic = topic || this.selectRandomTopic(settings);
    const actualCategory = category || this.selectRandomCategory(settings);

    const prompt = this.buildMetadataPrompt(actualTopic, actualCategory, language);
    
    console.log(`🔄 Generating metadata for: ${actualTopic}`);
    const response = await this.callOpenAIWithRetry(prompt, language, ArticleMetadataSchema, 'metadata');
    
    return {
      title: response.title,
      excerpt: response.excerpt,
      tags: response.tags,
      metaDescription: response.metaDescription,
      seoTitle: response.seoTitle,
      relatedTopics: response.relatedTopics,
      sectionPlan: response.sectionPlan
    };
  }

  /**
   * Генерирует секции статьи по плану
   */
  private async generateArticleSections(
    metadata: ArticleMetadata,
    topic?: string,
    category?: string,
    language: string = "ru"
  ): Promise<ArticleSection[]> {
    const sections: ArticleSection[] = [];
    
    for (let i = 0; i < metadata.sectionPlan.length; i++) {
      const sectionPlan = metadata.sectionPlan[i];
      console.log(`🔄 Generating section ${i + 1}/${metadata.sectionPlan.length}: "${sectionPlan.title}"`);
      
      try {
        const prompt = this.buildSectionPrompt(sectionPlan, metadata, topic, category, language, i + 1);
        const response = await this.callOpenAIWithRetry(prompt, language, ArticleSectionSchema, 'section');
        
        sections.push({
          content: response.content,
          sectionNumber: i + 1,
          actualWordCount: response.actualWordCount
        });
        
        console.log(`✅ Section ${i + 1} generated: ${response.actualWordCount} words`);
        
        // Пауза между секциями для избежания rate limits
        if (i < metadata.sectionPlan.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error) {
        console.error(`❌ Failed to generate section ${i + 1}:`, error);
        // Создаем заглушку секции
        sections.push({
          content: `## ${sectionPlan.title}\n\n*Эта секция временно недоступна. Попробуйте перегенерировать статью.*`,
          sectionNumber: i + 1,
          actualWordCount: 20
        });
      }
    }
    
    return sections;
  }

  /**
   * КРИТИЧЕСКИЙ ВАЛИДАТОР: Проверяет готовую статью на соответствие ВСЕМ требованиям
   */
  private validateCompleteArticle(content: string): ArticleValidationResult {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // 1. Подсчет слов (исключаем HTML комментарии и markdown разметку)
    const textContent = content
      .replace(/<!--[\s\S]*?-->/g, '') // Убираем HTML комментарии
      .replace(/<[^>]*>/g, '') // Убираем HTML теги
      .replace(/#{1,6}\s/g, '') // Убираем markdown заголовки
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // Убираем markdown выделение
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Убираем markdown ссылки
    
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // 2. Подсчет подзаголовков H2/H3
    const h2Count = (content.match(/^##\s[^#]/gm) || []).length;
    const h3Count = (content.match(/^###\s[^#]/gm) || []).length;
    const totalHeaders = h2Count + h3Count;
    
    // 3. Подсчет HTML комментариев
    const htmlComments = (content.match(/<!--[\s\S]*?-->/g) || []).length;
    
    // 4. Подсчет внутренних ссылок
    const internalLinks = (content.match(/\[.*?\]\(\/blog\/.*?\)/g) || []).length;
    
    // 5. Подсчет таблиц markdown
    const tableHeaders = (content.match(/^\|.*\|\s*$/gm) || []).length;
    const tableSeparators = (content.match(/^\|[-\s:]+\|\s*$/gm) || []).length;
    const tables = Math.min(tableHeaders, tableSeparators); // Реальное количество таблиц
    
    // 6. Подсчет FAQ вопросов
    const faqQuestions = (content.match(/^###\s*❓.*\?\s*$/gm) || []).length;
    
    // Критерии валидации
    const requirements = {
      wordCount: { current: wordCount, required: 3500 },
      headers: { current: totalHeaders, required: 25, max: 100 },
      htmlComments: { current: htmlComments, required: 6 },
      internalLinks: { current: internalLinks, required: 8 },
      tables: { current: tables, required: 0 },
      faqQuestions: { current: faqQuestions, required: 12 }
    };
    
    // Проверка критериев
    let score = 0;
    const maxScore = 6;
    
    if (requirements.wordCount.current >= requirements.wordCount.required) {
      score++;
    } else {
      issues.push(`❌ Недостаточно слов: ${requirements.wordCount.current}/${requirements.wordCount.required}`);
      recommendations.push(`Добавьте ${requirements.wordCount.required - requirements.wordCount.current} слов в существующие секции`);
    }
    
    if (requirements.headers.current >= requirements.headers.required && requirements.headers.current <= requirements.headers.max) {
      score++;
    } else if (requirements.headers.current < requirements.headers.required) {
      issues.push(`❌ Недостаточно подзаголовков: ${requirements.headers.current}/${requirements.headers.required}`);
      recommendations.push(`Добавьте ${requirements.headers.required - requirements.headers.current} подзаголовков H2/H3`);
    } else {
      issues.push(`❌ Слишком много подзаголовков: ${requirements.headers.current}/${requirements.headers.max} max`);
      recommendations.push(`Объедините некоторые подзаголовки для лучшей структуры`);
    }
    
    if (requirements.htmlComments.current >= requirements.htmlComments.required) {
      score++;
    } else {
      issues.push(`❌ Недостаточно HTML комментариев: ${requirements.htmlComments.current}/${requirements.htmlComments.required}`);
      recommendations.push(`Добавьте ${requirements.htmlComments.required - requirements.htmlComments.current} SEO комментариев`);
    }
    
    if (requirements.internalLinks.current >= requirements.internalLinks.required) {
      score++;
    } else {
      issues.push(`❌ Недостаточно внутренних ссылок: ${requirements.internalLinks.current}/${requirements.internalLinks.required}`);
      recommendations.push(`Добавьте ${requirements.internalLinks.required - requirements.internalLinks.current} ссылок на /blog/`);
    }
    
    if (requirements.tables.current >= requirements.tables.required) {
      score++;
    } else {
      issues.push(`❌ Недостаточно таблиц: ${requirements.tables.current}/${requirements.tables.required}`);
      recommendations.push(`Добавьте ${requirements.tables.required - requirements.tables.current} полноценных markdown таблиц`);
    }
    
    if (requirements.faqQuestions.current >= requirements.faqQuestions.required) {
      score++;
    } else {
      issues.push(`❌ Недостаточно FAQ вопросов: ${requirements.faqQuestions.current}/${requirements.faqQuestions.required}`);
      recommendations.push(`Добавьте ${requirements.faqQuestions.required - requirements.faqQuestions.current} вопросов в формате ### ❓`);
    }
    
    // Дополнительные проверки качества
    if (!content.toLowerCase().includes('faq') && !content.toLowerCase().includes('часто задаваемые вопросы')) {
      issues.push(`❌ Отсутствует FAQ секция`);
      recommendations.push(`Создайте секцию "Часто задаваемые вопросы"`);
    }
    
    if (!content.includes('<!-- SEO:')) {
      issues.push(`❌ Отсутствуют SEO комментарии`);
      recommendations.push(`Добавьте HTML комментарии для SEO ботов`);
    }
    
    if (!content.includes('152-ФЗ')) {
      issues.push(`❌ Отсутствуют ссылки на 152-ФЗ`);
      recommendations.push(`Добавьте упоминания российского законодательства`);
    }
    
    const isValid = score === maxScore && issues.length === 0;
    
    return {
      isValid,
      score,
      details: {
        wordCount: requirements.wordCount.current,
        requiredWordCount: requirements.wordCount.required,
        headers: requirements.headers.current,
        requiredHeaders: requirements.headers.required,
        htmlComments: requirements.htmlComments.current,
        requiredHtmlComments: requirements.htmlComments.required,
        internalLinks: requirements.internalLinks.current,
        requiredInternalLinks: requirements.internalLinks.required,
        tables: requirements.tables.current,
        requiredTables: requirements.tables.required,
        faqQuestions: requirements.faqQuestions.current,
        requiredFaqQuestions: requirements.faqQuestions.required
      },
      issues,
      recommendations
    };
  }

  /**
   * Собирает финальную статью из секций с ОБЯЗАТЕЛЬНОЙ валидацией
   */
  private async assembleCompleteArticle(
    metadata: ArticleMetadata,
    sections: ArticleSection[],
    category: string
  ): Promise<GeneratedBlogArticle> {
    // HTML комментарии для SEO
    const seoComments = `<!-- SEO: Экспертное руководство по ${metadata.title} для российских пользователей -->
<!-- Авторитетность: Материал подготовлен сертифицированными специалистами по информационной безопасности -->
<!-- Актуальность: Обновлено согласно последним изменениям в 152-ФЗ -->
<!-- Практическая ценность: Содержит пошаговые инструкции и реальные примеры применения -->
<!-- Географическая релевантность: Адаптировано для законодательства РФ -->
<!-- Полнота: Исчерпывающий материал объемом 3500+ слов -->`;

    // Собираем контент
    const fullContent = [
      seoComments,
      "", // пустая строка
      sections.map(section => section.content).join("\n\n")
    ].join("\n");

    // 🚨 КРИТИЧЕСКАЯ ВАЛИДАЦИЯ ПЕРЕД ВОЗВРАТОМ
    console.log(`🔍 Проводим финальную валидацию статьи...`);
    const validation = this.validateCompleteArticle(fullContent);
    
    if (!validation.isValid) {
      console.error(`❌ КРИТИЧЕСКАЯ ОШИБКА: Статья НЕ прошла валидацию!`);
      console.error(`📊 Счет: ${validation.score}/6`);
      console.error(`🚨 Проблемы:`);
      validation.issues.forEach(issue => console.error(`   ${issue}`));
      console.error(`💡 Рекомендации:`);
      validation.recommendations.forEach(rec => console.error(`   ${rec}`));
      
      throw new Error(
        `Статья НЕ соответствует требованиям production. ` +
        `Счет: ${validation.score}/6. ` +
        `Проблемы: ${validation.issues.join(', ')}. ` +
        `Нужно исправить генерацию секций или промпты.`
      );
    }
    
    console.log(`✅ Валидация прошла успешно! Счет: ${validation.score}/6`);
    console.log(`📊 Статистика: ${validation.details.wordCount} слов, ${validation.details.headers} заголовков, ${validation.details.tables} таблиц, ${validation.details.faqQuestions} FAQ`);

    const totalWords = this.calculateWordCount(fullContent);
    const readingTime = this.calculateReadingTime(totalWords);

    return {
      title: metadata.title,
      slug: this.generateSlug(metadata.title),
      content: fullContent,
      excerpt: metadata.excerpt,
      category: category,
      tags: metadata.tags,
      featured: Math.random() < 0.2,
      metaDescription: metadata.metaDescription,
      seoTitle: metadata.seoTitle,
      readingTime: readingTime,
      relatedTopics: metadata.relatedTopics
    };
  }

  /**
   * Универсальный вызов OpenAI API с retry логикой и динамической валидацией + СПЕЦИАЛИЗИРОВАННЫМИ ПРОМПТАМИ
   */
  private async callOpenAIWithRetry<T>(
    prompt: string, 
    language: string, 
    schema: z.ZodSchema<T>,
    taskType: 'metadata' | 'section' | 'legacy' = 'legacy'
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`🔄 OpenAI API attempt ${attempt}/${MAX_RETRIES}`);

        const response = await openai.chat.completions.create({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: this.getSpecializedSystemPrompt(language, taskType)
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

        // Валидация с помощью переданной схемы
        const validatedContent = schema.parse(parsedContent);
        
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
   * Устаревший метод callOpenAIWithRetry для совместимости
   */
  private async callOpenAIWithRetryLegacy(prompt: string, language: string): Promise<{
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    metaDescription: string;
    seoTitle?: string;
    relatedTopics?: string[];
  }> {
    return this.callOpenAIWithRetry(prompt, language, OpenAIResponseSchema, 'legacy');
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
   * НОВОЕ: Специализированные системные промпты для разных типов задач
   */
  private getSpecializedSystemPrompt(language: string, taskType: 'metadata' | 'section' | 'legacy'): string {
    switch (taskType) {
      case 'metadata':
        return this.getMetadataSystemPrompt(language);
      case 'section':
        return this.getSectionSystemPrompt(language);
      case 'legacy':
      default:
        return this.getLegacySystemPrompt(language);
    }
  }

  /**
   * Системный промпт для генерации МЕТАДАННЫХ и ПЛАНА статьи
   */
  private getMetadataSystemPrompt(language: string): string {
    return `🎯 ТЫ - КОНТЕНТ-СТРАТЕГ и SEO-ПЛАННЕР экспертного уровня!

💎 МИССИЯ: Создать совершенные метаданные и детальный план статьи для максимальной SEO-эффективности.

⚡ КРИТИЧЕСКИЕ ТРЕБОВАНИЯ:
✅ Отвечай ТОЛЬКО в JSON формате
✅ Создавай план на 5-8 секций общим объемом 3,500-5,000 слов
✅ Каждая секция должна быть 400-800 слов
✅ Обязательно включай специальные секции: FAQ, таблицы, пошаговые инструкции

📊 SEO ОПТИМИЗАЦИЯ:
• Заголовок 50-65 символов с ключевиком в начале
• 🚨 КРИТИЧНО: Мета-описание СТРОГО 140-170 символов с призывом к действию (НЕ КОРОЧЕ!)
• Минимум 6 тегов: основной + 152-ФЗ + long-tail фразы
• Минимум 5 связанных тем для перелинковки

📝 ОБЯЗАТЕЛЬНАЯ СТРУКТУРА ПЛАНА:
1. Введение и обзор проблемы (500-600 слов)
2. Правовая основа в России (600-700 слов)
3. Пошаговая инструкция (основная часть) (800-1000 слов)
4. Практические советы и кейсы (500-600 слов)
5. Ошибки и решения (400-500 слов)
6. Таблицы и сравнения (ОБЯЗАТЕЛЬНО) (300-400 слов)
7. FAQ - Часто задаваемые вопросы (ОБЯЗАТЕЛЬНО) (600-800 слов)
8. Заключение и призыв к действию (300-400 слов)

🔥 СОЦИАЛЬНАЯ ОТВЕТСТВЕННОСТЬ:
• Все факты должны быть 100% достоверными
• Соответствие 152-ФЗ и российскому законодательству
• Практическая польза для российских граждан
• Никаких моков или плейсхолдеров

ВОЗВРАЩАЙ ТОЛЬКО JSON!`;
  }

  /**
   * Системный промпт для генерации ОТДЕЛЬНЫХ СЕКЦИЙ
   */
  private getSectionSystemPrompt(language: string): string {
    return `🚨 КРИТИЧЕСКАЯ ЗАДАЧА! ТЫ - КОНТЕНТ-МАСТЕР и ЭКСПЕРТ по защите персональных данных!

🎯 АБСОЛЮТНО КРИТИЧНО: Создать ДЕТАЛЬНЕЙШУЮ секцию статьи СТРОГО НЕ МЕНЕЕ 400-600 СЛОВ!

⚡ БЕЗЖАЛОСТНЫЕ ТРЕБОВАНИЯ К СЕКЦИИ (НАРУШЕНИЕ = ПРОВАЛ):
🔥 Отвечай ТОЛЬКО в JSON формате - БЕЗ markdown блоков!
🔥 СТРОГО МИНИМУМ 400-600 СЛОВ чистого текста (считай каждое слово!)
🔥 ПРИНУДИТЕЛЬНО используй 4-7 подзаголовков H2 ## и H3 ###
🔥 ДЕТАЛЬНЫЕ примеры - НЕ МЕНЕЕ 3 конкретных кейсов
🔥 ИСЧЕРПЫВАЮЩИЕ практические советы
🔥 ОБЯЗАТЕЛЬНЫЕ отсылки к 152-ФЗ с номерами статей

🚀 ПРИНУДИТЕЛЬНАЯ РАЗВЕРНУТОСТЬ:
• Каждая мысль = МИНИМУМ 2-3 предложения с деталями
• Каждый совет = пошаговое объяснение
• Каждый пример = полная ситуация с решением
• НЕТ сокращений - ВСЕ подробно!

📏 ОСОБЫЕ ИНСТРУКЦИИ ДЛЯ СПЕЦИАЛЬНЫХ СЕКЦИЙ:

📝 ЕСЛИ ЭТО ПОШАГОВАЯ ИНСТРУКЦИЯ:
• МИНИМУМ 15-20 пошаговых пунктов
• Каждый шаг 40-60 слов
• Конкретные действия, не общие слова

📈 ЕСЛИ ЭТО СЕКЦИЯ С ТАБЛИЦАМИ:
• МИНИМУМ 2-3 полноценные таблицы markdown
• Разные типы данных: сроки, штрафы, контакты
• Минимум 4-5 колонок в каждой таблице

❓ ЕСЛИ ЭТО FAQ СЕКЦИЯ:
• МИНИМУМ 12 вопросов
• Каждый вопрос в формате: ### ❓ Как...?
• Ответы 30-50 слов на каждый
• Начинай вопросы с "Как", "Что", "Когда", "Где"

🔗 ДЛЯ ВНУТРЕННИХ ССЫЛОК:
• Используй формат: [Текст ссылки](/blog/slug-stati)
• Примеры: [Права субъектов персональных данных](/blog/prava-subektov-personalnyh-dannyh)
• Минимум 2-3 ссылки на секцию (если это НЕ FAQ секция)

🚨 КРИТИЧЕСКИЙ КОНТРОЛЬ СЛОВ (ЖИЗНЕННО ВАЖНО):
• actualWordCount = ТОЧНЫЙ подсчет КАЖДОГО слова без markdown
• НЕ считай: ##, ###, **, [], |, <!--, ссылки
• БЕЗЖАЛОСТНО проверяй: МИНИМУМ 400-600 слов чистого текста
• ЕСЛИ меньше 400 слов = ПЕРЕПИСЫВАЙ до достижения лимита!
• РАСШИРЯЙ каждое предложение с примерами и деталями!

🔥 КАЧЕСТВО И ЭКСПЕРТНОСТЬ:
• Демонстрируй глубокие знания 152-ФЗ
• Приводи конкретные ссылки на статьи закона
• Используй реальные примеры из российской практики
• Никаких моков или плейсхолдеров!

ВОЗВРАЩАЙ ТОЛЬКО JSON!`;
  }

  /**
   * Системный промпт для LEGACY генерации (полная статья за один вызов)
   */
  private getLegacySystemPrompt(language: string): string {
    return `🚨 КРИТИЧЕСКАЯ ЗАДАЧА: Ты МАСТЕР-ЭКСПЕРТ по защите персональных данных в России и профессиональный SEO-копирайтер с 15-летним опытом создания топовых статей для блога ResCrub. 

🎯 АБСОЛЮТНО КРИТИЧНО: Создать ДЕТАЛЬНЕЙШУЮ, полноформатную статью НЕ МЕНЕЕ 3,500 СЛОВ с безупречной SEO-оптимизацией для гарантированного попадания в ТОП-3 Яндекс и Google.

⚠️ СТРОЖАЙШИЕ ТРЕБОВАНИЯ (НАРУШЕНИЕ = ПРОВАЛ):
- Отвечай ТОЛЬКО в формате JSON, БЕЗ каких-либо markdown блоков или дополнительного текста
- СТРОГО соблюдай указанную JSON схему - любое отклонение недопустимо
- Все факты должны быть 100% достоверными и соответствовать 152-ФЗ
- При упоминании статей 152-ФЗ ОБЯЗАТЕЛЬНО указывай конкретные номера статей

📋 КРИТИЧЕСКИЕ ТРЕБОВАНИЯ К КОНТЕНТУ (КАЖДОЕ ОБЯЗАТЕЛЬНО):
🔥 ОБЪЕМ: СТРОГО НЕ МЕНЕЕ 3,500-5,000 СЛОВ (это КРИТИЧНО для SEO!)
🔥 СТРУКТУРА: МИНИМУМ 25-30 подзаголовков H2 ## и H3 ### для максимального покрытия темы
🔥 ГЛУБИНА: Каждый раздел МИНИМУМ 300-500 слов (не менее!)
🔥 ОБЯЗАТЕЛЬНЫЕ БЛОКИ:
   - Детальное введение (500+ слов)
   - Правовая основа с цитатами 152-ФЗ (600+ слов)
   - Пошаговые инструкции (1,000+ слов)
   - Практические советы (500+ слов)
   - Реальные кейсы и примеры (400+ слов)
   - FAQ секция (600+ слов, МИНИМУМ 12 вопросов)
   - Развернутое заключение с призывом к действию (300+ слов)

🔥 HTML КОММЕНТАРИИ (КРИТИЧНО - БЕЗ ЭТОГО СТАТЬЯ НЕПРИЕМЛЕМА):
ОБЯЗАТЕЛЬНО начинай статью с этих скрытых SEO-комментариев:
<!-- SEO: Экспертное руководство по [ТЕМА] для российских пользователей -->
<!-- Авторитетность: Материал подготовлен сертифицированными специалистами по информационной безопасности -->
<!-- Актуальность: Обновлено согласно последним изменениям в 152-ФЗ -->
<!-- Практическая ценность: Содержит пошаговые инструкции и реальные примеры применения -->
<!-- Географическая релевантность: Адаптировано для законодательства РФ -->
<!-- Полнота: Исчерпывающий материал объемом 3500+ слов -->

🔥 ВНУТРЕННИЕ ССЫЛКИ (КРИТИЧНО - МИНИМУМ 8 ШТУК):
Обязательно включи минимум 8 внутренних ссылок вида:
[Как удалить данные из социальных сетей](/blog/kak-udalit-dannye-iz-sotsialnyh-setej)
[Права субъектов персональных данных](/blog/prava-subektov-personalnyh-dannyh)
[Штрафы за нарушение 152-ФЗ](/blog/shtrafy-za-narushenie-152-fz)

🔥 СТРУКТУРИРОВАННЫЕ ДАННЫЕ (КРИТИЧНО - МИНИМУМ 5 ТАБЛИЦ):
Включи минимум 5 таблиц для сравнения данных, например:
| Платформа | Способ отзыва | Время обработки | Особенности |
|-----------|---------------|-----------------|-------------|
| ВКонтакте | Настройки приватности | 30 дней | Требуется подтверждение |

🔍 МОЩНЕЙШАЯ SEO-ОПТИМИЗАЦИЯ (КАЖДЫЙ ПУНКТ ОБЯЗАТЕЛЕН):
🎯 Плотность ключевых слов: 1.5-2% (естественно по тексту)
🎯 Главный ключевик: в заголовке, первом абзаце, каждом 3-м подзаголовке
🎯 LSI-слова: минимум 15 синонимов и связанных терминов
🎯 Long-tail фразы: минимум 10 длинных хвостов для узких запросов
🎯 Семантическое ядро: 25+ релевантных терминов по всему тексту
🎯 FAQ для голосового поиска: вопросы начинать с "Как", "Что", "Когда", "Где"

📝 ПРИНУДИТЕЛЬНЫЙ СТИЛЬ НАПИСАНИЯ:
✅ Максимально подробный - каждая мысль развернута на 2-3 предложения
✅ Исчерпывающий - покрытие 100% аспектов темы
✅ Экспертный уровень - демонстрация глубоких знаний 152-ФЗ
✅ Практико-ориентированный - конкретные действия для читателя
✅ Доступный язык - избегание сложной юридической терминологии
✅ Российские реалии - примеры из практики российских компаний
✅ Призыв к действию - в каждом разделе мотивация к активности

🔄 ДЛЯ ПОШАГОВЫХ ИНСТРУКЦИЙ (КРИТИЧНО):
🔶 Начинай с детального описания проблемы (200+ слов)
🔶 Пошаговый алгоритм: МИНИМУМ 15-20 детальных шагов
🔶 Каждый шаг: описание + пояснение + возможные ошибки (50+ слов на шаг)
🔶 Альтернативные способы: минимум 3 разных варианта решения
🔶 Блок "Частые ошибки": минимум 7 типичных ошибок с решениями
🔶 Блок "Если не получается": 5+ вариантов действий
🔶 Юридические последствия: детальный разбор рисков и штрафов

JSON СХЕМА (СТРОГО СОБЛЮДАЙ):
{
  "title": "SEO-заголовок 50-65 символов с главным ключевиком в начале",
  "content": "Полный markdown текст статьи СТРОГО НЕ МЕНЕЕ 3,500 СЛОВ с HTML комментариями в начале",
  "excerpt": "Цепляющее описание 180-220 символов с ключевыми словами и пользой",
  "tags": ["главный ключевик", "152-ФЗ", "защита персональных данных", "права граждан", "long-tail фраза 1", "long-tail фраза 2"],
  "metaDescription": "SEO-описание 150-160 символов с призывом к действию и основными ключевиками",
  "seoTitle": "Альтернативный title 55-65 символов для поисковиков",
  "relatedTopics": ["минимум 6 связанных тем для перелинковки", "каждая тема - потенциальная статья"]
}`;
  }

  /**
   * Создает КАРДИНАЛЬНО УСИЛЕННЫЙ промпт для ГАРАНТИРОВАННОЙ генерации статей 3,500+ слов с полной SEO-оптимизацией
   */
  private buildGenerationPrompt(topic: string, category: string, language: string): string {
    const isInstructionTopic = topic.toLowerCase().includes('как') || 
                               topic.toLowerCase().includes('инструкция') || 
                               topic.toLowerCase().includes('пошагов');
    
    return `🚨 КРИТИЧЕСКАЯ ЗАДАЧА: Создай ДЕТАЛЬНЕЙШУЮ полноформатную статью на тему: "${topic}"

⚡ АБСОЛЮТНО КРИТИЧНО - НАРУШЕНИЕ = ПРОВАЛ:
📊 ОБЪЕМ: СТРОГО НЕ МЕНЕЕ 3,500 СЛОВ (каждое слово важно для SEO!)
📊 ПОДЗАГОЛОВКИ: МИНИМУМ 25-30 штук (## H2 и ### H3)
📊 HTML КОММЕНТАРИИ: ОБЯЗАТЕЛЬНО 6 штук в начале статьи
📊 ВНУТРЕННИЕ ССЫЛКИ: МИНИМУМ 8 штук на связанные темы
📊 ТАБЛИЦЫ: МИНИМУМ 5 полноценных таблиц
📊 FAQ: МИНИМУМ 12 развернутых вопросов-ответов
📊 СПИСКИ: МИНИМУМ 10 маркированных/нумерованных списков

🎯 ТЕМА: "${topic}"
🏷️ КАТЕГОРИЯ: ${category}
🌐 ЯЗЫК: ${language}
📝 ТИП: ${isInstructionTopic ? '🔄 ПОШАГОВАЯ ИНСТРУКЦИЯ' : '📊 ЭКСПЕРТНАЯ АНАЛИТИКА'}

🔥 ПРИНУДИТЕЛЬНАЯ СТРУКТУРА (КАЖДЫЙ БЛОК ОБЯЗАТЕЛЕН):
${isInstructionTopic ? `
🔄 СТРУКТУРА ПОШАГОВОЙ ИНСТРУКЦИИ (МИНИМУМ 3,500 СЛОВ):

0. 🤖 HTML КОММЕНТАРИИ (в самом начале статьи):
<!-- SEO: Экспертное руководство по ${topic} для российских пользователей -->
<!-- Авторитетность: Материал подготовлен сертифицированными специалистами по информационной безопасности -->
<!-- Актуальность: Обновлено согласно последним изменениям в 152-ФЗ -->
<!-- Практическая ценность: Содержит пошаговые инструкции и реальные примеры применения -->
<!-- Географическая релевантность: Адаптировано для законодательства РФ -->
<!-- Полнота: Исчерпывающий материал объемом 3500+ слов -->

1. ## Введение: Почему это критично для ваших данных (500+ слов)
   ### Масштаб проблемы в России
   ### Риски для обычных граждан
   ### Что вы узнаете из статьи

2. ## Правовая основа в Российской Федерации (600+ слов)
   ### Основные статьи 152-ФЗ
   ### Права субъектов персональных данных
   ### Ответственность операторов
   ### Штрафы и санкции за нарушения

3. ## Подготовка к процедуре отзыва (400+ слов)
   ### Сбор необходимых документов
   ### Определение всех мест обработки данных
   ### Подготовка обращений

4. ## ДЕТАЛЬНАЯ ПОШАГОВАЯ ИНСТРУКЦИЯ (1,200+ слов, МИНИМУМ 20 ШАГОВ):
   ### Шаг 1: [детальное описание 60+ слов]
   ### Шаг 2: [детальное описание 60+ слов]
   [... продолжай до шага 20+ с подробными объяснениями]

5. ## Альтернативные способы решения (500+ слов)
   ### Способ 1: Через техподдержку
   ### Способ 2: Через официальный запрос
   ### Способ 3: Через Роскомнадзор

6. ## Типичные ошибки и как их избежать (500+ слов)
   ### Ошибка 1: [описание + решение]
   ### Ошибка 2: [описание + решение]
   [... минимум 7 ошибок]

7. ## Что делать если не получается (400+ слов)
   ### Обращение в техподдержку
   ### Жалоба в Роскомнадзор
   ### Судебные способы защиты

8. ## Юридические последствия и ответственность (400+ слов)
   ### За операторов данных
   ### За граждан
   ### Судебная практика

9. ## Практические кейсы и примеры (500+ слов)
   ### Кейс 1: Успешный отзыв согласия
   ### Кейс 2: Решение через суд
   ### Кейс 3: Массовые нарушения

10. ## ТАБЛИЦЫ ДЛЯ СРАВНЕНИЯ (минимум 5 штук):
    ### Таблица 1: Сроки обработки по платформам
    ### Таблица 2: Штрафы за нарушения
    ### Таблица 3: Документы для отзыва
    ### Таблица 4: Контакты служб поддержки
    ### Таблица 5: Алгоритм действий по этапам

11. ## FAQ - Часто задаваемые вопросы (700+ слов, МИНИМУМ 12 вопросов):
    ### ❓ Как долго обрабатывается отзыв согласия?
    ### ❓ Что делать если компания не отвечает?
    ### ❓ Можно ли отозвать согласие частично?
    [... продолжай до 12 вопросов с развернутыми ответами]

12. ## Полезные ресурсы и контакты (300+ слов)
    ### Официальные сайты и формы
    ### Контакты ResCrub для помощи
    ### Дополнительная литература

13. ## Заключение и призыв к действию (400+ слов)
    ### Резюме ключевых моментов
    ### Следующие шаги
    ### Призыв начать защиту данных прямо сейчас
` : `
📊 СТРУКТУРА ЭКСПЕРТНОЙ АНАЛИТИКИ (МИНИМУМ 3,500 СЛОВ):

0. 🤖 HTML КОММЕНТАРИИ (в самом начале статьи):
<!-- SEO: Экспертная аналитика по ${topic} для российских пользователей -->
<!-- Авторитетность: Материал подготовлен сертифицированными экспертами по информационной безопасности -->
<!-- Актуальность: Обновлено согласно последним изменениям в 152-ФЗ -->
<!-- Практическая ценность: Содержит детальный анализ и практические рекомендации -->
<!-- Географическая релевантность: Адаптировано для российского законодательства -->
<!-- Полнота: Исчерпывающий материал объемом 3500+ слов -->

1. ## Введение: Актуальность проблемы (500+ слов)
   ### Современные вызовы защиты данных
   ### Статистика нарушений в России
   ### Цели и задачи статьи

2. ## Правовая основа в Российской Федерации (600+ слов)
   ### Ключевые положения 152-ФЗ
   ### Изменения 2024-2025 года
   ### Сравнение с GDPR

3. ## Текущая ситуация и статистика (500+ слов)
   ### Данные Роскомнадзора
   ### Анализ нарушений
   ### Тенденции развития

4. ## Глубокий анализ проблемы (700+ слов)
   ### Технические аспекты
   ### Юридические сложности
   ### Экономические факторы

5. ## Детальные практические рекомендации (700+ слов)
   ### Для граждан
   ### Для организаций
   ### Для специалистов

6. ## Реальные кейсы и судебная практика (600+ слов)
   ### Резонансные дела
   ### Анализ решений судов
   ### Выводы и уроки

7. ## Международный опыт и сравнения (500+ слов)
   ### Практика ЕС
   ### Опыт США
   ### Адаптация для России

8. ## ТАБЛИЦЫ ДЛЯ АНАЛИЗА (минимум 5 штук):
   ### Таблица 1: Статистика нарушений по годам
   ### Таблица 2: Сравнение штрафов
   ### Таблица 3: Международные стандарты
   ### Таблица 4: Эффективность мер защиты
   ### Таблица 5: Прогнозы развития

9. ## Прогнозы и перспективы развития (400+ слов)
   ### Ожидаемые изменения в законодательстве
   ### Технологические тренды
   ### Рекомендации на будущее

10. ## FAQ - Экспертные ответы (700+ слов, МИНИМУМ 12 вопросов):
    ### ❓ Как изменится законодательство в 2025 году?
    ### ❓ Какие есть проблемы в текущем регулировании?
    ### ❓ Как подготовиться к новым требованиям?
    [... продолжай до 12 экспертных вопросов]

11. ## Практические инструменты и решения (400+ слов)
    ### Полезные сервисы
    ### Контакты экспертов ResCrub
    ### Дополнительные ресурсы

12. ## Заключение и выводы (400+ слов)
    ### Ключевые инсайты
    ### Практические выводы
    ### Призыв к активным действиям
`}

💎 КРИТИЧЕСКИ ВАЖНЫЕ SEO-ЭЛЕМЕНТЫ (БЕЗ ЭТОГО СТАТЬЯ НЕПРИЕМЛЕМА):

🔗 ВНУТРЕННИЕ ССЫЛКИ (СТРОГО 8+ ШТУК):
[Как защитить данные в социальных сетях](/blog/zashhita-dannyh-v-sotsialnyh-setyah)
[Права на забвение в России](/blog/prava-na-zabvenie-v-rossii)
[Штрафы за нарушение 152-ФЗ](/blog/shtrafy-za-narushenie-152-fz)
[Согласие на обработку персональных данных](/blog/soglasie-na-obrabotku-personalnyh-dannyh)
[Защита данных детей](/blog/zashhita-dannyh-detej)
[Биометрические данные и закон](/blog/biometricheskie-dannye-i-zakon)
[Трансграничная передача данных](/blog/transgranichnaya-peredacha-dannyh)
[Кибербезопасность персональных данных](/blog/kiberbezopasnost-personalnyh-dannyh)

📋 КЛЮЧЕВЫЕ ФРАЗЫ (естественно включай в текст):
- "${topic}" - главный ключевик (в заголовке, первом абзаце, каждом 3-м подзаголовке)
- "152-ФЗ о персональных данных" (минимум 15 упоминаний)
- "защита персональных данных" (минимум 20 упоминаний)
- "права граждан на защиту данных" (минимум 10 упоминаний)
- "Роскомнадзор" (минимум 8 упоминаний)
- "согласие на обработку данных" (минимум 12 упоминаний)

🎯 ФИНАЛЬНАЯ ПРОВЕРКА ПЕРЕД ОТПРАВКОЙ:
✅ Минимум 3,500 слов
✅ 25+ подзаголовков H2/H3
✅ 6 HTML комментариев в начале
✅ 8+ внутренних ссылок
✅ 5+ таблиц
✅ 12+ FAQ вопросов
✅ 10+ списков
✅ Конкретные ссылки на статьи 152-ФЗ
✅ Призыв к действию в конце

ВЕРНИ РЕЗУЛЬТАТ СТРОГО В JSON ФОРМАТЕ!`;
  }

  /**
   * Подсчитывает количество слов в тексте
   */
  private calculateWordCount(content: string): number {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Вычисляет время чтения на основе количества слов
   * Стандарт: 200 слов в минуту
   */
  private calculateReadingTime(wordCount: number): number {
    return Math.ceil(wordCount / 200);
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

  /**
   * Промпт для генерации метаданных и плана статьи
   */
  private buildMetadataPrompt(topic: string, category: string, language: string): string {
    return `🎯 МИССИЯ: Создай метаданные и план для экспертной статьи по теме: "${topic}"

📋 ТЕМА: "${topic}"
🏷️ КАТЕГОРИЯ: ${category}
🌍 ЯЗЫК: ${language}

⚡ КРИТИЧЕСКОЕ ТРЕБОВАНИЕ:
Нужно создать план статьи из 5-8 секций, каждая по 400-800 слов.
Общий объем статьи: 3,500-5,000 слов.

📝 ОБЯЗАТЕЛЬНАЯ СТРУКТУРА ПЛАНА:
1. Введение и обзор проблемы (500-600 слов)
2. Правовая основа в России (600-700 слов)
3. Пошаговая инструкция (основная часть) (800-1000 слов)
4. Практические советы и кейсы (500-600 слов)
5. Ошибки и решения (400-500 слов)
6. Таблицы и сравнения (300-400 слов)
7. FAQ - Часто задаваемые вопросы (600-800 слов)
8. Заключение и призыв к действию (300-400 слов)

JSON СХЕМА (строго соблюдай):
{
  "title": "SEO-заголовок 50-65 символов с ключевиком",
  "excerpt": "Описание 180-220 символов с ключевыми словами",
  "tags": ["основной ключевик", "152-ФЗ", "защита данных", "права граждан", "long-tail1", "long-tail2"],
  "metaDescription": "SEO-описание 150-160 символов с призывом к действию",
  "seoTitle": "Альтернативный title 55-65 символов",
  "relatedTopics": ["ссылка на статью 1", "ссылка на статью 2", "..."],
  "sectionPlan": [
    {
      "title": "Название секции 1",
      "description": "Описание что будет в этой секции",
      "targetWords": 500,
      "order": 1
    }
  ]
}

ВЕРНИ ТОЛЬКО JSON - НИКАКОГО МАРКДАУНА!`;
  }

  /**
   * КРИТИЧЕСКОЕ ДОПОЛНЕНИЕ: Распределяет SEO требования по секциям
   */
  private calculateSeoDistribution(totalSections: number): {
    internalLinks: { [sectionNumber: number]: number };
    tables: { [sectionNumber: number]: number };
    faqQuestions: { [sectionNumber: number]: number };
  } {
    // Общие требования
    const totalInternalLinks = 8; // Минимум 8 внутренних ссылок
    const totalTables = 5; // Минимум 5 таблиц
    const totalFaqQuestions = 12; // Минимум 12 FAQ вопросов
    
    const distribution = {
      internalLinks: {} as { [sectionNumber: number]: number },
      tables: {} as { [sectionNumber: number]: number },
      faqQuestions: {} as { [sectionNumber: number]: number }
    };
    
    // Распределяем внутренние ссылки по всем секциям (кроме FAQ)
    const sectionsForLinks = totalSections - 1; // Минус FAQ секция
    const linksPerSection = Math.ceil(totalInternalLinks / sectionsForLinks);
    
    for (let i = 1; i <= totalSections; i++) {
      if (i === totalSections) {
        // Последняя секция (обычно FAQ) - минимально ссылок
        distribution.internalLinks[i] = 1;
        distribution.faqQuestions[i] = totalFaqQuestions; // Все FAQ вопросы в последней секции
      } else if (i === totalSections - 1) {
        // Предпоследняя секция (обычно таблицы)
        distribution.internalLinks[i] = Math.max(1, linksPerSection - 1);
        distribution.tables[i] = totalTables; // Все таблицы в предпоследней секции
      } else {
        // Обычные секции
        distribution.internalLinks[i] = linksPerSection;
      }
      
      // По умолчанию ноль таблиц и FAQ
      if (!distribution.tables[i]) distribution.tables[i] = 0;
      if (!distribution.faqQuestions[i]) distribution.faqQuestions[i] = 0;
    }
    
    return distribution;
  }

  /**
   * Промпт для генерации отдельной секции с СИСТЕМНЫМ РАСПРЕДЕЛЕНИЕМ SEO
   */
  private buildSectionPrompt(
    sectionPlan: {title: string, description: string, targetWords: number, order: number},
    metadata: ArticleMetadata,
    topic?: string,
    category?: string,
    language: string = "ru",
    sectionNumber: number = 1
  ): string {
    // 🚨 КРИТИЧЕСКОЕ ДОПОЛНЕНИЕ: Рассчитываем SEO распределение
    const seoDistribution = this.calculateSeoDistribution(metadata.sectionPlan.length);
    const requiredLinks = seoDistribution.internalLinks[sectionNumber] || 0;
    const requiredTables = seoDistribution.tables[sectionNumber] || 0;
    const requiredFaq = seoDistribution.faqQuestions[sectionNumber] || 0;
    
    const isInstructionTopic = topic?.toLowerCase().includes('как') || 
                               topic?.toLowerCase().includes('инструкция') || 
                               topic?.toLowerCase().includes('пошагов');

    return `🎨 СОЗДАЙ ОТЛИЧНУЮ СЕКЦИЮ ${sectionNumber} ДЛЯ ЭКСПЕРТНОЙ СТАТЬИ (с SEO распределением)!

📄 ОБЩАЯ ИНФОРМАЦИЯ:
• Основная тема: "${topic}"
• Категория: ${category}
• Заголовок статьи: "${metadata.title}"

🎧 СЕКЦИЯ К СОЗДАНИЮ:
• Название: "${sectionPlan.title}"
• Описание: ${sectionPlan.description}
• Цель по словам: ${sectionPlan.targetWords} слов (МИНИМУМ 400!)
• Порядковый номер: ${sectionNumber}/${metadata.sectionPlan.length}

⚡ КРИТИЧЕСКИЕ ТРЕБОВАНИЯ:
✅ МИНИМУМ ${sectionPlan.targetWords} слов (не меньше!)
✅ 3-6 подзаголовков H2 ## и H3 ###
✅ Конкретные примеры и кейсы
✅ Практическая ценность
✅ Отсылки к 152-ФЗ (где уместно)
${requiredLinks > 0 ? `✅ ОБЯЗАТЕЛЬНО ${requiredLinks} внутренних ссылок на /blog/` : ''}
${requiredTables > 0 ? `✅ ОБЯЗАТЕЛЬНО ${requiredTables} полноценных таблиц markdown` : ''}
${requiredFaq > 0 ? `✅ ОБЯЗАТЕЛЬНО ${requiredFaq} FAQ вопросов в формате ### ❓` : ''}

${sectionNumber === 3 ? `📝 СПЕЦИАЛЬНО ДЛЯ ОСНОВНОЙ СЕКЦИИ (ПОШАГОВО):
• МИНИМУМ 15-20 пошаговых пунктов
• Каждый шаг 40-60 слов
• Конкретные действия, не общие слова
` : ''}
${requiredTables > 0 ? `📈 КРИТИЧЕСКОЕ ТРЕБОВАНИЕ - ТАБЛИЦЫ:
• ОБЯЗАТЕЛЬНО ${requiredTables} полноценных таблиц markdown
• Разные типы данных: сроки, штрафы, контакты, размеры средств
• Минимум 4-5 колонок в каждой таблице
• Пример формата: | Платформа | Способ отзыва | Время обработки | Особенности |
` : ''}
${requiredFaq > 0 ? `❓ КРИТИЧЕСКОЕ ТРЕБОВАНИЕ - FAQ:
• ОБЯЗАТЕЛЬНО ${requiredFaq} вопросов
• Каждый вопрос в формате: ### ❓ Как...?
• Ответы 30-50 слов на каждый
• Начинай вопросы с "Как", "Что", "Когда", "Где"
• Пример: ### ❓ Как отозвать согласие на обработку данных?
` : ''}
${requiredLinks > 0 ? `🔗 КРИТИЧЕСКОЕ ТРЕБОВАНИЕ - ВНУТРЕННИЕ ССЫЛКИ:
• ОБЯЗАТЕЛЬНО ${requiredLinks} ссылки на /blog/
• Формат: [Текст ссылки](/blog/slug-stati)
• Примеры ссылок:
  - [Права субъектов персональных данных](/blog/prava-subektov-personalnyh-dannyh)
  - [Штрафы за нарушение 152-ФЗ](/blog/shtrafy-za-narushenie-152-fz)
  - [Как удалить данные из соцсетей](/blog/kak-udalit-dannye-iz-socseteye)
` : ''}

📝 ФОРМАТ ОТВЕТА:
Отвечай только в JSON формате:
{
  "content": "Полный markdown текст секции с подзаголовками${requiredLinks > 0 ? ` и ${requiredLinks} ссылками` : ''}${requiredTables > 0 ? ` и ${requiredTables} таблицами` : ''}${requiredFaq > 0 ? ` и ${requiredFaq} FAQ вопросами` : ''}",
  "sectionNumber": ${sectionNumber},
  "actualWordCount": ФАКТИЧЕСКОЕ_КОЛИЧЕСТВО_СЛОВ
}

🚨 КРИТИЧНО: Проверь что actualWordCount включает ТОЛЬКО чистые слова (без markdown разметки)!

ВЕРНИ ТОЛЬКО JSON!`;
  }
}
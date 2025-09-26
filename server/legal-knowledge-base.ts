import type { IStorage } from './storage';
import type { 
  LegalArticle, 
  InsertLegalArticle,
  ViolationType,
  DocumentType,
  ViolationTypeEnum,
  DocumentTypeEnum
} from '@shared/schema';

/**
 * Результат поиска правовых статей
 */
export interface LegalArticleSearchResult {
  success: boolean;
  error?: string;
  articles?: LegalArticle[];
  totalCount?: number;
}

/**
 * Результат валидации правового обоснования
 */
export interface LegalBasisValidationResult {
  success: boolean;
  error?: string;
  isValid?: boolean;
  validationDetails?: {
    articlesFound: LegalArticle[];
    missingRequirements: string[];
    recommendedArticles: LegalArticle[];
    legalStrength: 'WEAK' | 'MODERATE' | 'STRONG' | 'EXCELLENT';
    complianceScore: number; // 0-100
  };
}

/**
 * Правовые сроки и процедуры
 */
export interface LegalDeadlinesResult {
  success: boolean;
  error?: string;
  deadlines?: {
    operatorResponseDays: number; // 30 дней для ответа оператора
    followUpDays: number; // 30 дней для повторного обращения
    rknEscalationDays: number; // 60 дней до эскалации в РКН
    procedureDeadlines: Record<DocumentType, number>;
    violationPenalties: Record<ViolationType, {
      individual: { min: number; max: number; currency: string };
      official: { min: number; max: number; currency: string };
      legal_entity: { min: number; max: number; currency: string };
      additional_sanctions: string[];
    }>;
  };
}

/**
 * Цитирование статьи для документов
 */
export interface LegalCitationResult {
  success: boolean;
  error?: string;
  citation?: {
    articleNumber: string;
    fullReference: string; // "статья 14 ФЗ-152"
    shortReference: string; // "ст. 14 ФЗ-152"
    legalBasis: string;
    applicableProcedures: string[];
    requiredDeadline: number;
    penalties: any;
  };
}

/**
 * Контекст для подбора правовых обоснований
 */
export interface LegalAnalysisContext {
  violationTypes: ViolationType[];
  documentType: DocumentType;
  operatorResponse?: string;
  requestAge?: number; // в днях
  previousEscalations?: number;
  complianceHistory?: 'GOOD' | 'POOR' | 'UNKNOWN';
}

/**
 * ФЗ-152 Legal Knowledge Base Module
 * 
 * Обеспечивает:
 * - База статей российского законодательства по защите персональных данных
 * - Автоматический подбор правовых обоснований для документов
 * - Валидация юридической корректности требований
 * - Интеграция с Response Analysis, Decision Engine и Document Generator
 */
export class LegalKnowledgeBase {
  constructor(private storage: IStorage) {}

  /**
   * Получить статьи ФЗ-152 по типу нарушения
   */
  async getArticlesByViolation(violationType: ViolationType): Promise<LegalArticleSearchResult> {
    try {
      const articles = await this.storage.getLegalArticlesByViolationType(violationType);
      
      if (!articles || articles.length === 0) {
        return {
          success: true,
          articles: [],
          totalCount: 0
        };
      }

      // Сортируем по релевантности - сначала основные статьи, потом дополнительные
      const sortedArticles = articles.sort((a, b) => {
        // Приоритет основных статей (9, 14, 18, 19, 21)
        const primaryArticles = ['9', '14', '18', '19', '21'];
        const aIsPrimary = primaryArticles.includes(a.articleNumber);
        const bIsPrimary = primaryArticles.includes(b.articleNumber);
        
        if (aIsPrimary && !bIsPrimary) return -1;
        if (!aIsPrimary && bIsPrimary) return 1;
        
        // Внутри группы сортируем по номеру статьи
        return parseInt(a.articleNumber) - parseInt(b.articleNumber);
      });

      return {
        success: true,
        articles: sortedArticles,
        totalCount: sortedArticles.length
      };

    } catch (error) {
      console.error('Error fetching articles by violation type:', error);
      return {
        success: false,
        error: `Failed to fetch articles for violation type ${violationType}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Получить правовые сроки и процедуры
   */
  async getLegalDeadlines(): Promise<LegalDeadlinesResult> {
    try {
      // Стандартные сроки по ФЗ-152
      const deadlines = {
        operatorResponseDays: 30, // Статья 14 ФЗ-152
        followUpDays: 30, // Повторное обращение
        rknEscalationDays: 60, // Обращение в Роскомнадзор
        procedureDeadlines: {
          'INITIAL_REQUEST': 30,
          'FOLLOW_UP_REQUEST': 30,
          'CESSATION_DEMAND': 30,
          'RKN_COMPLAINT': 30,
          'RKN_APPEAL': 30
        } as Record<DocumentType, number>,
        violationPenalties: {
          'INVALID_LEGAL_BASIS': {
            individual: { min: 1000, max: 3000, currency: 'RUB' },
            official: { min: 10000, max: 20000, currency: 'RUB' },
            legal_entity: { min: 30000, max: 100000, currency: 'RUB' },
            additional_sanctions: ['warning', 'administrative_suspension']
          },
          'EXCESSIVE_RETENTION': {
            individual: { min: 2000, max: 5000, currency: 'RUB' },
            official: { min: 20000, max: 40000, currency: 'RUB' },
            legal_entity: { min: 50000, max: 200000, currency: 'RUB' },
            additional_sanctions: ['data_deletion_order', 'processing_restriction']
          },
          'MISSING_INFORMATION': {
            individual: { min: 1000, max: 3000, currency: 'RUB' },
            official: { min: 5000, max: 15000, currency: 'RUB' },
            legal_entity: { min: 15000, max: 75000, currency: 'RUB' },
            additional_sanctions: ['disclosure_order']
          },
          'DELAY_VIOLATION': {
            individual: { min: 1500, max: 4000, currency: 'RUB' },
            official: { min: 15000, max: 30000, currency: 'RUB' },
            legal_entity: { min: 30000, max: 150000, currency: 'RUB' },
            additional_sanctions: ['priority_processing_order']
          },
          'PROCEDURAL_VIOLATION': {
            individual: { min: 1000, max: 3000, currency: 'RUB' },
            official: { min: 10000, max: 25000, currency: 'RUB' },
            legal_entity: { min: 25000, max: 100000, currency: 'RUB' },
            additional_sanctions: ['procedure_correction_order']
          },
          'PRIVACY_VIOLATION': {
            individual: { min: 2000, max: 6000, currency: 'RUB' },
            official: { min: 20000, max: 50000, currency: 'RUB' },
            legal_entity: { min: 75000, max: 300000, currency: 'RUB' },
            additional_sanctions: ['processing_ban', 'security_audit_requirement']
          },
          'CONSENT_VIOLATION': {
            individual: { min: 1500, max: 5000, currency: 'RUB' },
            official: { min: 15000, max: 35000, currency: 'RUB' },
            legal_entity: { min: 50000, max: 200000, currency: 'RUB' },
            additional_sanctions: ['consent_reprocessing_order']
          },
          'TRANSPARENCY_VIOLATION': {
            individual: { min: 1000, max: 3000, currency: 'RUB' },
            official: { min: 10000, max: 20000, currency: 'RUB' },
            legal_entity: { min: 30000, max: 100000, currency: 'RUB' },
            additional_sanctions: ['transparency_improvement_order']
          },
          'SECURITY_VIOLATION': {
            individual: { min: 3000, max: 8000, currency: 'RUB' },
            official: { min: 30000, max: 60000, currency: 'RUB' },
            legal_entity: { min: 100000, max: 500000, currency: 'RUB' },
            additional_sanctions: ['security_measures_implementation', 'external_security_audit']
          }
        } as Record<ViolationType, any>
      };

      return {
        success: true,
        deadlines
      };

    } catch (error) {
      console.error('Error fetching legal deadlines:', error);
      return {
        success: false,
        error: `Failed to fetch legal deadlines: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Валидировать правовое обоснование
   */
  async validateLegalBasis(
    violationTypes: ViolationType[],
    providedBasis: string,
    documentType: DocumentType
  ): Promise<LegalBasisValidationResult> {
    try {
      // Получаем все релевантные статьи для указанных нарушений
      const allArticles: LegalArticle[] = [];
      const missingRequirements: string[] = [];

      for (const violationType of violationTypes) {
        const result = await this.getArticlesByViolation(violationType);
        if (result.success && result.articles) {
          allArticles.push(...result.articles);
        }
      }

      // Удаляем дубликаты статей
      const uniqueArticles = allArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.id === article.id)
      );

      // Анализируем provided basis на наличие ссылок на статьи
      const foundArticles = uniqueArticles.filter(article => {
        const articleRef = `${article.articleNumber}`;
        const lawRef = article.lawReference;
        
        return providedBasis.includes(articleRef) || 
               providedBasis.includes(`статья ${articleRef}`) ||
               providedBasis.includes(`ст. ${articleRef}`) ||
               providedBasis.includes(lawRef);
      });

      // Определяем недостающие требования
      const requiredArticleNumbers = ['14']; // Статья 14 обязательна для большинства случаев
      
      for (const requiredNumber of requiredArticleNumbers) {
        const isPresent = foundArticles.some(article => article.articleNumber === requiredNumber);
        if (!isPresent) {
          missingRequirements.push(`Отсутствует ссылка на статью ${requiredNumber} ФЗ-152`);
        }
      }

      // Проверяем специфические требования для типов нарушений
      for (const violationType of violationTypes) {
        switch (violationType) {
          case 'INVALID_LEGAL_BASIS':
            if (!foundArticles.some(a => ['9', '14'].includes(a.articleNumber))) {
              missingRequirements.push('Требуется ссылка на статьи 9 или 14 ФЗ-152 для обоснования правомерности обработки');
            }
            break;
          case 'EXCESSIVE_RETENTION':
            if (!foundArticles.some(a => ['18', '21'].includes(a.articleNumber))) {
              missingRequirements.push('Требуется ссылка на статьи 18 или 21 ФЗ-152 для сроков хранения и уничтожения данных');
            }
            break;
          case 'CONSENT_VIOLATION':
            if (!foundArticles.some(a => a.articleNumber === '9')) {
              missingRequirements.push('Требуется ссылка на статью 9 ФЗ-152 для вопросов согласия');
            }
            break;
        }
      }

      // Рассчитываем силу правового обоснования
      let legalStrength: 'WEAK' | 'MODERATE' | 'STRONG' | 'EXCELLENT';
      let complianceScore: number;

      if (foundArticles.length === 0) {
        legalStrength = 'WEAK';
        complianceScore = 10;
      } else if (foundArticles.length < uniqueArticles.length / 2) {
        legalStrength = 'MODERATE';
        complianceScore = 40;
      } else if (missingRequirements.length === 0) {
        legalStrength = 'EXCELLENT';
        complianceScore = 95;
      } else {
        legalStrength = 'STRONG';
        complianceScore = 75;
      }

      // Рекомендуемые статьи для улучшения обоснования
      const recommendedArticles = uniqueArticles.filter(article => 
        !foundArticles.includes(article) && 
        ['9', '14', '18', '19', '21'].includes(article.articleNumber)
      );

      return {
        success: true,
        isValid: missingRequirements.length === 0 && foundArticles.length > 0,
        validationDetails: {
          articlesFound: foundArticles,
          missingRequirements,
          recommendedArticles,
          legalStrength,
          complianceScore
        }
      };

    } catch (error) {
      console.error('Error validating legal basis:', error);
      return {
        success: false,
        error: `Failed to validate legal basis: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Получить статьи по категории
   */
  async getArticlesByCategory(category: string): Promise<LegalArticleSearchResult> {
    try {
      const articles = await this.storage.getLegalArticlesByCategory(category);
      
      return {
        success: true,
        articles: articles || [],
        totalCount: articles?.length || 0
      };

    } catch (error) {
      console.error('Error fetching articles by category:', error);
      return {
        success: false,
        error: `Failed to fetch articles for category ${category}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Получить полный текст статьи
   */
  async getFullArticleText(articleId: string): Promise<{ success: boolean; error?: string; article?: LegalArticle }> {
    try {
      const article = await this.storage.getLegalArticleById(articleId);
      
      if (!article) {
        return {
          success: false,
          error: `Article with ID ${articleId} not found`
        };
      }

      return {
        success: true,
        article
      };

    } catch (error) {
      console.error('Error fetching full article text:', error);
      return {
        success: false,
        error: `Failed to fetch article ${articleId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Получить цитирование статьи для документов
   */
  async getCitationForDocument(
    articleId: string,
    documentType: DocumentType,
    context?: { operatorName?: string; requestDate?: string }
  ): Promise<LegalCitationResult> {
    try {
      const articleResult = await this.getFullArticleText(articleId);
      
      if (!articleResult.success || !articleResult.article) {
        return {
          success: false,
          error: `Could not find article for citation: ${articleResult.error}`
        };
      }

      const article = articleResult.article;
      
      // Формируем цитирование в зависимости от типа документа
      let fullReference: string;
      let shortReference: string;
      
      switch (documentType) {
        case 'INITIAL_REQUEST':
          fullReference = `статьи ${article.articleNumber} Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"`;
          shortReference = `ст. ${article.articleNumber} ФЗ-152`;
          break;
        case 'RKN_COMPLAINT':
          fullReference = `статьи ${article.articleNumber} ФЗ-152 "О персональных данных"`;
          shortReference = `ст. ${article.articleNumber} ФЗ-152`;
          break;
        default:
          fullReference = `статьи ${article.articleNumber} ФЗ-152`;
          shortReference = `ст. ${article.articleNumber} ФЗ-152`;
      }

      // Извлекаем процедуры из JSON
      let applicableProcedures: string[] = [];
      try {
        const procedures = article.procedures as any;
        if (procedures && typeof procedures === 'object') {
          applicableProcedures = procedures.operator_obligations || [];
        }
      } catch (e) {
        console.warn('Could not parse procedures for article', article.articleNumber);
      }

      return {
        success: true,
        citation: {
          articleNumber: article.articleNumber,
          fullReference,
          shortReference,
          legalBasis: article.legalBasis || article.fullText.substring(0, 200) + '...',
          applicableProcedures,
          requiredDeadline: article.deadline || 30,
          penalties: article.penalties
        }
      };

    } catch (error) {
      console.error('Error generating citation:', error);
      return {
        success: false,
        error: `Failed to generate citation: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Автоматически подобрать правовые обоснования для контекста
   */
  async getRecommendedLegalBasis(context: LegalAnalysisContext): Promise<{
    success: boolean;
    error?: string;
    recommendations?: {
      primaryArticles: LegalArticle[];
      supportingArticles: LegalArticle[];
      suggestedCitation: string;
      legalStrength: 'WEAK' | 'MODERATE' | 'STRONG' | 'EXCELLENT';
      estimatedSuccessRate: number;
    };
  }> {
    try {
      const primaryArticles: LegalArticle[] = [];
      const supportingArticles: LegalArticle[] = [];

      // Собираем все релевантные статьи
      for (const violationType of context.violationTypes) {
        const result = await this.getArticlesByViolation(violationType);
        if (result.success && result.articles) {
          // Первая статья - основная, остальные - поддерживающие
          if (result.articles.length > 0) {
            primaryArticles.push(result.articles[0]);
            if (result.articles.length > 1) {
              supportingArticles.push(...result.articles.slice(1));
            }
          }
        }
      }

      // Удаляем дубликаты
      const uniquePrimary = primaryArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.id === article.id)
      );
      const uniqueSupporting = supportingArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.id === article.id) && 
        !uniquePrimary.some(p => p.id === article.id)
      );

      // Формируем рекомендованное цитирование
      let suggestedCitation = '';
      if (uniquePrimary.length > 0) {
        const articleNumbers = uniquePrimary.map(a => a.articleNumber).sort((a, b) => parseInt(a) - parseInt(b));
        if (articleNumbers.length === 1) {
          suggestedCitation = `статьи ${articleNumbers[0]} ФЗ-152`;
        } else {
          suggestedCitation = `статей ${articleNumbers.join(', ')} ФЗ-152`;
        }
      }

      // Оцениваем правовую силу
      let legalStrength: 'WEAK' | 'MODERATE' | 'STRONG' | 'EXCELLENT';
      let estimatedSuccessRate: number;

      const totalArticles = uniquePrimary.length + uniqueSupporting.length;
      const hasEssentialArticles = uniquePrimary.some(a => ['9', '14', '18'].includes(a.articleNumber));

      if (totalArticles === 0) {
        legalStrength = 'WEAK';
        estimatedSuccessRate = 20;
      } else if (totalArticles < 3 && !hasEssentialArticles) {
        legalStrength = 'MODERATE';
        estimatedSuccessRate = 50;
      } else if (hasEssentialArticles && totalArticles >= 2) {
        legalStrength = 'EXCELLENT';
        estimatedSuccessRate = 90;
      } else {
        legalStrength = 'STRONG';
        estimatedSuccessRate = 75;
      }

      // Корректируем оценку на основе контекста
      if (context.requestAge && context.requestAge > 60) {
        estimatedSuccessRate += 10; // Длительные задержки усиливают позицию
      }
      if (context.complianceHistory === 'POOR') {
        estimatedSuccessRate += 15; // Плохая история соблюдения усиливает позицию
      }

      return {
        success: true,
        recommendations: {
          primaryArticles: uniquePrimary,
          supportingArticles: uniqueSupporting,
          suggestedCitation,
          legalStrength,
          estimatedSuccessRate: Math.min(95, estimatedSuccessRate) // Максимум 95%
        }
      };

    } catch (error) {
      console.error('Error getting recommended legal basis:', error);
      return {
        success: false,
        error: `Failed to get legal recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// Экспортируем единственный экземпляр для использования в других модулях
let legalKnowledgeBaseInstance: LegalKnowledgeBase | null = null;

export function createLegalKnowledgeBase(storage: IStorage): LegalKnowledgeBase {
  if (!legalKnowledgeBaseInstance) {
    legalKnowledgeBaseInstance = new LegalKnowledgeBase(storage);
  }
  return legalKnowledgeBaseInstance;
}

// Для удобства экспортируем готовый инстанс
export let legalKnowledgeBase: LegalKnowledgeBase;

// Инициализируем в runtime после того, как storage станет доступен
export function initializeLegalKnowledgeBase(storage: IStorage) {
  legalKnowledgeBase = createLegalKnowledgeBase(storage);
}
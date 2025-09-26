import { storage } from './storage';
import { renderTemplate, type EmailTemplate, type EmailData } from './email';
import type { DocumentType, UserProfile, DataBroker, DeletionRequest, ViolationType } from '@shared/schema';
import { createLegalKnowledgeBase, type LegalKnowledgeBase, type LegalAnalysisContext } from './legal-knowledge-base';
import { z } from 'zod';

/**
 * Контекст для генерации документа
 */
export interface DocumentContext {
  // Основные данные
  userId: string;
  userProfile?: UserProfile;
  brokerInfo?: Partial<DataBroker>;
  deletionRequest?: DeletionRequest;
  
  // Дополнительные параметры
  recipientName?: string;
  recipientCompany?: string;
  personalDataList?: string[];
  requestDate?: string;
  
  // Юридические параметры
  legalBasis?: string;
  violationTypes?: ViolationType[];  // Типы нарушений для автоматического подбора статей
  caseNumber?: string;
  previousRequestDates?: string[];
  
  // Автоматически обогащаемые правовые данные
  legalArticles?: Array<{
    articleNumber: string;
    fullReference: string;
    shortReference: string;
    legalBasis: string;
    deadline: number;
  }>;
  suggestedCitation?: string;
  legalStrength?: 'WEAK' | 'MODERATE' | 'STRONG' | 'EXCELLENT';
  estimatedSuccessRate?: number;
  
  // Метаданные
  format?: 'html' | 'text' | 'both';
  locale?: 'ru' | 'en';
  
  // Токены и ссылки
  confirmationToken?: string;
  trackingId?: string;
}

/**
 * Результат генерации документа
 */
export interface DocumentGenerationResult {
  success: boolean;
  document?: {
    subject: string;
    html: string;
    text: string;
    metadata: {
      documentType: DocumentType;
      generatedAt: Date;
      context: Partial<DocumentContext>;
      template: {
        name: string;
        version?: string;
      };
    };
  };
  error?: string;
  validationIssues?: string[];
}

/**
 * Валидационная схема для контекста документа
 */
const DocumentContextSchema = z.object({
  userId: z.string().uuid(),
  userProfile: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
  }).optional(),
  brokerInfo: z.object({
    name: z.string().optional(),
    website: z.string().url().optional(),
    email: z.string().email().optional(),
  }).optional(),
  recipientName: z.string().optional(),
  recipientCompany: z.string().optional(),
  personalDataList: z.array(z.string()).optional(),
  requestDate: z.string().optional(),
  format: z.enum(['html', 'text', 'both']).default('html'),
  locale: z.enum(['ru', 'en']).default('ru'),
});

/**
 * Document Generator Service для САЗПД
 * 
 * Предоставляет централизованный интерфейс для генерации различных типов
 * юридических документов в системе защиты персональных данных
 */
export class DocumentGenerator {
  private static instance: DocumentGenerator;
  
  private constructor() {}
  
  static getInstance(): DocumentGenerator {
    if (!DocumentGenerator.instance) {
      DocumentGenerator.instance = new DocumentGenerator();
    }
    return DocumentGenerator.instance;
  }

  /**
   * Генерация документа по типу и контексту
   */
  async generateDocument(
    documentType: DocumentType,
    context: DocumentContext,
    templateOverride?: EmailTemplate
  ): Promise<DocumentGenerationResult> {
    try {
      console.log(`🔧 Generating document type: ${documentType} for user: ${context.userId}`);
      
      // Валидация входных данных
      const validationResult = this.validateContext(context);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          validationIssues: validationResult.issues
        };
      }

      // Обогащение контекста
      const enrichedContext = await this.enrichContext(context);
      
      // Получение шаблона
      const template = templateOverride || await this.getTemplate(documentType);
      if (!template) {
        return {
          success: false,
          error: `Template not found for document type: ${documentType}`
        };
      }

      // Валидация юридической корректности
      const legalValidation = this.validateLegalRequirements(documentType, enrichedContext);
      if (!legalValidation.isValid) {
        return {
          success: false,
          error: 'Legal validation failed',
          validationIssues: legalValidation.issues
        };
      }

      // Подготовка данных для рендеринга
      const emailData = this.prepareEmailData(enrichedContext);
      
      // Рендеринг документа
      const renderedTemplate = renderTemplate(template, emailData);

      // Результат генерации
      const result: DocumentGenerationResult = {
        success: true,
        document: {
          subject: renderedTemplate.subject,
          html: renderedTemplate.html,
          text: renderedTemplate.text,
          metadata: {
            documentType,
            generatedAt: new Date(),
            context: {
              userId: context.userId,
              brokerInfo: context.brokerInfo,
              format: context.format || 'html',
              locale: context.locale || 'ru'
            },
            template: {
              name: `${documentType.toLowerCase()}_template`,
              version: '1.0'
            }
          }
        }
      };

      console.log(`✅ Document generated successfully: ${documentType}`);
      return result;

    } catch (error: any) {
      console.error(`❌ Error generating document ${documentType}:`, error);
      return {
        success: false,
        error: `Generation failed: ${error.message}`
      };
    }
  }

  /**
   * Обогащение контекста данными из базы данных
   */
  async enrichContext(context: DocumentContext): Promise<DocumentContext> {
    try {
      console.log(`🔍 Enriching context for user: ${context.userId}`);
      
      const enriched: DocumentContext = { ...context };

      // Получение профиля пользователя, если не передан
      if (!enriched.userProfile && context.userId) {
        try {
          enriched.userProfile = await storage.getUserProfile(context.userId);
        } catch (error) {
          console.warn(`⚠️ Could not fetch user profile for ${context.userId}:`, error);
        }
      }

      // Получение данных deletion request, если есть trackingId
      if (context.trackingId && !enriched.deletionRequest) {
        try {
          enriched.deletionRequest = await storage.getDeletionRequestByTrackingId(context.trackingId);
        } catch (error) {
          console.warn(`⚠️ Could not fetch deletion request for tracking ${context.trackingId}:`, error);
        }
      }

      // Обогащение данными профиля
      if (enriched.userProfile) {
        if (!enriched.recipientName && enriched.userProfile.firstName && enriched.userProfile.lastName) {
          enriched.recipientName = `${enriched.userProfile.firstName} ${enriched.userProfile.lastName}`;
          if (enriched.userProfile.middleName) {
            enriched.recipientName += ` ${enriched.userProfile.middleName}`;
          }
        }
      }

      // Установка даты запроса, если не указана
      if (!enriched.requestDate) {
        enriched.requestDate = new Date().toLocaleDateString('ru-RU');
      }

      // Правовое обогащение контекста с помощью Legal Knowledge Base
      if (enriched.violationTypes && enriched.violationTypes.length > 0) {
        console.log(`📜 Getting legal recommendations for violations: ${enriched.violationTypes.join(', ')}`);
        
        // Получаем рекомендации по правовым основаниям
        const legalAnalysisContext: LegalAnalysisContext = {
          violationTypes: enriched.violationTypes,
          documentType: context.documentType || 'INITIAL_REQUEST',
          requestAge: enriched.previousRequestDates?.length || 0,
          complianceHistory: 'UNKNOWN'
        };
        
        const recommendations = await this.legalKnowledgeBase.getRecommendedLegalBasis(legalAnalysisContext);
        
        if (recommendations.success && recommendations.recommendations) {
          const rec = recommendations.recommendations;
          
          // Обогащаем контекст правовыми данными
          enriched.legalArticles = [];
          
          // Основные статьи
          for (const article of rec.primaryArticles) {
            const citationResult = await this.legalKnowledgeBase.getCitationForDocument(
              article.id, 
              context.documentType || 'INITIAL_REQUEST',
              {
                operatorName: enriched.recipientCompany || enriched.brokerInfo?.name,
                requestDate: enriched.requestDate
              }
            );
            
            if (citationResult.success && citationResult.citation) {
              enriched.legalArticles.push({
                articleNumber: citationResult.citation.articleNumber,
                fullReference: citationResult.citation.fullReference,
                shortReference: citationResult.citation.shortReference,
                legalBasis: citationResult.citation.legalBasis,
                deadline: citationResult.citation.requiredDeadline
              });
            }
          }
          
          // Поддерживающие статьи (максимум 2)
          for (const article of rec.supportingArticles.slice(0, 2)) {
            const citationResult = await this.legalKnowledgeBase.getCitationForDocument(
              article.id, 
              context.documentType || 'INITIAL_REQUEST'
            );
            
            if (citationResult.success && citationResult.citation) {
              enriched.legalArticles.push({
                articleNumber: citationResult.citation.articleNumber,
                fullReference: citationResult.citation.fullReference,
                shortReference: citationResult.citation.shortReference,
                legalBasis: citationResult.citation.legalBasis,
                deadline: citationResult.citation.requiredDeadline
              });
            }
          }
          
          // Дополняем автоматически сгенерированным правовым обоснованием
          if (!enriched.legalBasis && rec.suggestedCitation) {
            enriched.legalBasis = rec.suggestedCitation;
          }
          
          // Метаданные о правовой силе
          enriched.suggestedCitation = rec.suggestedCitation;
          enriched.legalStrength = rec.legalStrength;
          enriched.estimatedSuccessRate = rec.estimatedSuccessRate;
          
          console.log(`⚖️ Legal enrichment completed: ${enriched.legalArticles.length} articles, strength: ${rec.legalStrength}`);
        }
      } else {
        // Если нет нарушений, получаем базовые статьи для типа документа
        console.log(`📜 Getting base legal articles for document type: ${context.documentType}`);
        const baseArticles = await this.legalKnowledgeBase.getArticlesByCategory('rights');
        
        if (baseArticles.success && baseArticles.articles) {
          enriched.legalArticles = [];
          // Основные статьи (максимум 3)
          for (const article of baseArticles.articles.slice(0, 3)) {
            const citationResult = await this.legalKnowledgeBase.getCitationForDocument(
              article.id, 
              context.documentType || 'INITIAL_REQUEST'
            );
            
            if (citationResult.success && citationResult.citation) {
              enriched.legalArticles.push({
                articleNumber: citationResult.citation.articleNumber,
                fullReference: citationResult.citation.fullReference,
                shortReference: citationResult.citation.shortReference,
                legalBasis: citationResult.citation.legalBasis,
                deadline: citationResult.citation.requiredDeadline
              });
            }
          }
          
          // Базовое правовое обоснование
          if (!enriched.legalBasis && enriched.legalArticles.length > 0) {
            const mainArticles = enriched.legalArticles.map(a => a.articleNumber).join(', ');
            enriched.legalBasis = `статей ${mainArticles} ФЗ-152`;
          }
        }
      }

      // Установка юридических оснований по умолчанию, если не удалось получить из Legal Knowledge Base
      if (!enriched.legalBasis) {
        enriched.legalBasis = 'ст. 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"';
      }

      console.log(`✅ Context enriched successfully with legal knowledge`);
      return enriched;

    } catch (error: any) {
      console.error(`❌ Error enriching context:`, error);
      // Возвращаем исходный контекст в случае ошибки
      return context;
    }
  }

  /**
   * Валидация контекста документа
   */
  private validateContext(context: DocumentContext): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    try {
      DocumentContextSchema.parse(context);
    } catch (error: any) {
      if (error.errors) {
        issues.push(...error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`));
      } else {
        issues.push('Invalid context format');
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Валидация юридических требований для документа
   */
  private validateLegalRequirements(
    documentType: DocumentType, 
    context: DocumentContext
  ): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Общие требования
    if (!context.userProfile?.firstName || !context.userProfile?.lastName) {
      issues.push('Требуются имя и фамилия субъекта персональных данных');
    }

    if (!context.brokerInfo?.name) {
      issues.push('Требуется наименование оператора персональных данных');
    }

    // Специфичные требования по типам документов
    switch (documentType) {
      case 'INITIAL_REQUEST':
        // Для первичного запроса нужны базовые данные
        if (!context.personalDataList?.length) {
          issues.push('Для первичного запроса требуется список обнаруженных персональных данных');
        }
        break;

      case 'FOLLOW_UP_REQUEST':
        // Для повторного запроса нужна дата первичного обращения
        if (!context.previousRequestDates?.length) {
          issues.push('Для повторного запроса требуется дата предыдущего обращения');
        }
        break;

      case 'RKN_COMPLAINT':
      case 'RKN_APPEAL':
        // Для жалоб в РКН нужны даты предыдущих обращений
        if (!context.previousRequestDates?.length || context.previousRequestDates.length < 2) {
          issues.push('Для жалобы в Роскомнадзор требуются даты предыдущих обращений к оператору');
        }
        break;

      case 'CESSATION_DEMAND':
        // Требование о прекращении может быть на любом этапе
        break;

      default:
        issues.push(`Неизвестный тип документа: ${documentType}`);
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Получение шаблона документа
   */
  private async getTemplate(documentType: DocumentType): Promise<EmailTemplate | null> {
    try {
      // Динамический импорт шаблонов на основе типа документа
      switch (documentType) {
        case 'INITIAL_REQUEST':
          const { deletionRequestTemplate } = await import('./templates/deletion-request');
          return deletionRequestTemplate;

        case 'FOLLOW_UP_REQUEST':
          const { followUpTemplate } = await import('./templates/follow-up');
          return followUpTemplate;

        case 'CESSATION_DEMAND':
          const { cessationDemandTemplate } = await import('./templates/cessation-demand');
          return cessationDemandTemplate;

        case 'RKN_COMPLAINT':
          const { rknComplaintTemplate } = await import('./templates/rkn-complaint');
          return rknComplaintTemplate;

        case 'RKN_APPEAL':
          const { rknAppealTemplate } = await import('./templates/rkn-appeal');
          return rknAppealTemplate;

        default:
          console.error(`❌ Unknown document type: ${documentType}`);
          return null;
      }
    } catch (error: any) {
      console.error(`❌ Error loading template for ${documentType}:`, error);
      return null;
    }
  }

  /**
   * Подготовка данных для рендеринга шаблона
   */
  private prepareEmailData(context: DocumentContext): EmailData {
    const userProfile = context.userProfile;
    const brokerInfo = context.brokerInfo;

    return {
      // Основные данные отправителя
      senderName: userProfile 
        ? [userProfile.firstName, userProfile.middleName, userProfile.lastName]
            .filter(Boolean).join(' ')
        : context.recipientName || 'Субъект персональных данных',
      senderEmail: context.userProfile?.userId 
        ? `user-${context.userProfile.userId}@rescrub.ru` // Замаскированный email
        : 'privacy@rescrub.ru',
      senderPhone: userProfile?.phone || undefined,

      // Данные получателя
      recipientName: context.recipientName || 'Уважаемые коллеги',
      recipientCompany: context.recipientCompany || brokerInfo?.name || '',

      // Данные брокера
      brokerName: brokerInfo?.name || 'Оператор персональных данных',
      brokerUrl: brokerInfo?.website || '',

      // Найденные персональные данные
      personalData: context.personalDataList || [],

      // Даты и юридические основания
      requestDate: context.requestDate || new Date().toLocaleDateString('ru-RU'),
      legalBasis: context.legalBasis,

      // Токены для подтверждения
      token: context.confirmationToken
    };
  }

  /**
   * Получение всех доступных типов документов
   */
  getAvailableDocumentTypes(): DocumentType[] {
    return [
      'INITIAL_REQUEST',
      'FOLLOW_UP_REQUEST', 
      'CESSATION_DEMAND',
      'RKN_COMPLAINT',
      'RKN_APPEAL'
    ];
  }

  /**
   * Получение описания типа документа
   */
  getDocumentTypeDescription(documentType: DocumentType): string {
    const descriptions: Record<DocumentType, string> = {
      'INITIAL_REQUEST': 'Первичное требование об удалении персональных данных',
      'FOLLOW_UP_REQUEST': 'Повторное требование при отсутствии ответа',
      'CESSATION_DEMAND': 'Требование о прекращении обработки персональных данных',
      'RKN_COMPLAINT': 'Жалоба в Роскомнадзор на нарушение ФЗ-152',
      'RKN_APPEAL': 'Повторное обращение в Роскомнадзор'
    };

    return descriptions[documentType] || 'Неизвестный тип документа';
  }
}

// Экспорт singleton instance
export const documentGenerator = DocumentGenerator.getInstance();
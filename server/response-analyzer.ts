import OpenAI from "openai";
import { z } from "zod";
import {
  type InboundEmail,
  type ExtractedResponseData,
  type AnalysisRecommendations,
  type AnalysisMetadata,
  ResponseTypeEnum,
  ViolationTypeEnum,
  type ResponseType,
  type ViolationType
} from "../shared/schema";
import type { IStorage } from "./storage";
import { EvidenceCollector } from "./evidence-collector";
import { createLegalKnowledgeBase, type LegalKnowledgeBase } from "./legal-knowledge-base";

// ФЗ-152 COMPLIANCE: OpenAI полностью отключен для compliance с российским законодательством
// Персональные данные НЕ ДОЛЖНЫ передаваться на серверы OpenAI (США)
const DISABLE_OPENAI_ANALYSIS = process.env.DISABLE_OPENAI_ANALYSIS !== 'false'; // По умолчанию отключен
const OPENAI_STRICTLY_FORBIDDEN = process.env.NODE_ENV === 'production'; // В production строго запрещен

// OpenAI клиент отключен для соблюдения ФЗ-152
let openai: OpenAI | null = null;
if (!DISABLE_OPENAI_ANALYSIS && !OPENAI_STRICTLY_FORBIDDEN && process.env.OPENAI_API_KEY) {
  console.warn('⚠️ OpenAI ВКЛЮЧЕН: Убедитесь что персональные данные НЕ передаются!');
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  console.log('✅ OpenAI ОТКЛЮЧЕН для соблюдения ФЗ-152 (защита персональных данных)');
}

// Схема для валидации ответа OpenAI при анализе
const OpenAIAnalysisResponseSchema = z.object({
  response_type: ResponseTypeEnum,
  extracted_data: z.object({
    legal_basis: z.array(z.string()).optional(),
    data_categories: z.array(z.string()).optional(),
    retention_period: z.string().optional(),
    consent_info: z.object({
      has_consent: z.boolean(),
      consent_source: z.string().optional(),
      withdrawal_procedure: z.string().optional()
    }).optional(),
    contact_person: z.string().optional(),
    response_language: z.string().optional(),
    attachments: z.array(z.string()).optional(),
    cited_laws: z.array(z.string()).optional(),
    processing_purposes: z.array(z.string()).optional(),
    third_parties: z.array(z.string()).optional(),
    security_measures: z.array(z.string()).optional(),
    deletion_timeline: z.string().optional()
  }),
  violations: z.array(ViolationTypeEnum),
  legitimacy_score: z.number().min(0).max(100),
  recommendations: z.object({
    next_action: z.string(),
    escalation_level: z.enum(['low', 'medium', 'high', 'critical']),
    follow_up_required: z.boolean(),
    legal_advice_needed: z.boolean(),
    estimated_resolution_days: z.number(),
    confidence_level: z.number().min(0).max(100)
  }),
  language_detected: z.string(),
  manual_review_required: z.boolean()
});

type OpenAIAnalysisResponse = z.infer<typeof OpenAIAnalysisResponseSchema>;

/**
 * Результат анализа ответа оператора
 */
export interface ResponseAnalysisResult {
  success: boolean;
  error?: string;
  responseType?: ResponseType;
  extractedData?: ExtractedResponseData;
  violations?: ViolationType[];
  legitimacyScore?: number;
  recommendations?: AnalysisRecommendations;
  analysisMetadata?: AnalysisMetadata;
}

/**
 * Response Analyzer Service для интеллектуального анализа входящих писем от операторов ПД
 * 
 * Основные функции:
 * - Rule-based классификация стандартных ответов
 * - Enhanced rule-based анализ для сложных случаев (ФЗ-152 compliant)
 * - Детекция нарушений ФЗ-152
 * - Извлечение ключевой информации
 * - Оценка правомерности ответа
 * - Генерация рекомендаций по дальнейшим действиям
 */
export class ResponseAnalyzer {
  private static instance: ResponseAnalyzer;
  private readonly analysisVersion = "1.0.0";
  private evidenceCollector: EvidenceCollector;
  private legalKnowledgeBase: LegalKnowledgeBase;

  private constructor(storage: IStorage) {
    this.evidenceCollector = new EvidenceCollector(storage);
    this.legalKnowledgeBase = createLegalKnowledgeBase(storage);
  }

  static getInstance(storage?: IStorage): ResponseAnalyzer {
    if (!ResponseAnalyzer.instance) {
      if (!storage) {
        throw new Error('Storage is required for first initialization of ResponseAnalyzer');
      }
      ResponseAnalyzer.instance = new ResponseAnalyzer(storage);
    }
    return ResponseAnalyzer.instance;
  }

  /**
   * Основной метод анализа ответа оператора
   */
  async analyzeResponse(email: InboundEmail): Promise<ResponseAnalysisResult> {
    const startTime = Date.now();
    console.log(`🔍 Analyzing response from ${email.operatorEmail} for deletion request ${email.deletionRequestId}`);

    try {
      // Этап 1: Rule-based анализ (быстрый)
      const ruleBasedResult = await this.performRuleBasedAnalysis(email);
      
      // Этап 2: ФЗ-152 COMPLIANCE - используем только rule-based анализ
      // OpenAI отключен для предотвращения передачи персональных данных в США
      console.log(`📋 Using enhanced rule-based analysis for ${email.operatorEmail} (ФЗ-152 compliant)`);
      
      // Улучшенный rule-based анализ для замены AI
      const finalResult = await this.performEnhancedRuleBasedAnalysis(email, ruleBasedResult);

      // Этап 3: Финальная оценка и генерация метаданных
      if (finalResult.success) {
        finalResult.analysisMetadata = this.generateAnalysisMetadata(
          startTime,
          false, // AI analysis never used for ФЗ-152 compliance
          finalResult.recommendations?.confidence_level || 0
        );
      }

      // Этап 4: Автоматический сбор доказательств EMAIL_RESPONSE
      await this.collectEmailResponseEvidence(email, finalResult);

      const processingTime = Date.now() - startTime;
      console.log(`✅ Response analysis completed in ${processingTime}ms: ${finalResult.responseType}`);
      
      return finalResult;

    } catch (error: any) {
      console.error(`❌ Error analyzing response from ${email.operatorEmail}:`, error);
      return {
        success: false,
        error: `Analysis failed: ${error.message}`,
        analysisMetadata: this.generateAnalysisMetadata(startTime, false, 0)
      };
    }
  }

  /**
   * Rule-based анализ для стандартных ответов
   */
  private async performRuleBasedAnalysis(email: InboundEmail): Promise<ResponseAnalysisResult> {
    const content = `${email.subject || ''} ${email.bodyText || ''}`.toLowerCase();
    
    // Определяем язык ответа
    const language = this.detectLanguage(content);
    
    // Классификация типа ответа на основе ключевых слов и фраз
    const responseType = this.classifyResponseType(content, language);
    
    // Извлечение базовой информации
    const extractedData = this.extractBasicData(email, language);
    
    // Детекция очевидных нарушений
    const violations = await this.detectBasicViolations(email, responseType, extractedData);
    
    // Автоматический сбор доказательств нарушений (если найдены)
    await this.collectViolationEvidence(email, violations, responseType, extractedData);
    
    // Базовая оценка правомерности
    const legitimacyScore = this.calculateBasicLegitimacyScore(responseType, violations, extractedData);
    
    // Генерация базовых рекомендаций
    const recommendations = await this.generateBasicRecommendations(responseType, violations, legitimacyScore);

    return {
      success: true,
      responseType,
      extractedData,
      violations,
      legitimacyScore,
      recommendations
    };
  }

  /**
   * ФЗ-152 COMPLIANT: Усиленный rule-based анализ вместо AI
   * Полностью локальный анализ без передачи персональных данных во внешние сервисы
   */
  private async performEnhancedRuleBasedAnalysis(
    email: InboundEmail, 
    basicResult: ResponseAnalysisResult
  ): Promise<ResponseAnalysisResult> {
    console.log(`🔍 Enhanced rule-based analysis для ${email.operatorEmail}`);
    
    try {
      // PII-safe обработка контента (без персональных данных)
      const sanitizedContent = this.sanitizeContentForAnalysis(email);
      
      // Углубленная классификация
      const enhancedResponseType = this.enhancedClassifyResponseType(sanitizedContent, basicResult);
      
      // Улучшенное извлечение данных
      const enhancedExtractedData = this.enhancedExtractData(sanitizedContent, basicResult.extractedData);
      
      // Расширенная детекция нарушений
      const enhancedViolations = await this.enhancedDetectViolations(email, enhancedResponseType, enhancedExtractedData);
      
      // Пересчет legitimacy score с учетом дополнительных факторов
      const enhancedLegitimacyScore = this.enhancedCalculateLegitimacyScore(
        enhancedResponseType, 
        enhancedViolations, 
        enhancedExtractedData,
        email
      );
      
      // Улучшенные рекомендации
      const enhancedRecommendations = await this.enhancedGenerateRecommendations(
        enhancedResponseType,
        enhancedViolations,
        enhancedLegitimacyScore,
        email
      );

      return {
        success: true,
        responseType: enhancedResponseType,
        extractedData: enhancedExtractedData,
        violations: enhancedViolations,
        legitimacyScore: enhancedLegitimacyScore,
        recommendations: enhancedRecommendations
      };
      
    } catch (error: any) {
      console.error('❌ Enhanced rule-based analysis failed:', error);
      // Fallback к базовому rule-based результату
      return {
        ...basicResult,
        analysisMetadata: {
          analyzed_at: new Date().toISOString(),
          analysis_version: this.analysisVersion,
          processing_time_ms: 0,
          ai_model_used: "none_fz152_compliant",
          rule_matches: ["enhanced_fallback_to_basic"],
          confidence_breakdown: {
            rule_based_confidence: basicResult.recommendations?.confidence_level || 70,
            ai_confidence: 0,
            combined_confidence: basicResult.recommendations?.confidence_level || 70
          },
          manual_review_required: true,
          language_detected: this.detectLanguage(`${email.subject || ''} ${email.bodyText || ''}`)
        }
      };
    }
  }

  /**
   * Определение языка ответа
   */
  private detectLanguage(content: string): string {
    const russianWords = ['данные', 'персональные', 'удаление', 'обработка', 'согласие', 'информация', 'не', 'да', 'нет'];
    const englishWords = ['data', 'personal', 'delete', 'processing', 'consent', 'information', 'no', 'yes'];
    
    let russianCount = 0;
    let englishCount = 0;
    
    russianWords.forEach(word => {
      if (content.includes(word)) russianCount++;
    });
    
    englishWords.forEach(word => {
      if (content.includes(word)) englishCount++;
    });
    
    return russianCount >= englishCount ? 'ru' : 'en';
  }

  /**
   * Rule-based классификация типа ответа
   */
  private classifyResponseType(content: string, language: string): ResponseType {
    if (language === 'ru') {
      // Позитивное подтверждение
      if (content.match(/(удален|удалили|удалено|стерт|уничтожен|удалили данные|данные удалены)/i)) {
        return "POSITIVE_CONFIRMATION";
      }
      
      // Отказ
      if (content.match(/(отказ|нельзя|невозможно|не можем|запрещен|не удаляем)/i)) {
        return "REJECTION";
      }
      
      // Запрос уточнений
      if (content.match(/(уточните|предоставьте|документы|паспорт|подтверждение|дополнительная информация)/i)) {
        return "CLARIFICATION_REQUEST";
      }
      
      // Частичное выполнение
      if (content.match(/(частично|некоторые данные|часть информации)/i)) {
        return "PARTIAL_COMPLIANCE";
      }
      
      // Автоматический ответ
      if (content.match(/(автоматический|не отвечайте|служба поддержки|получили ваше обращение)/i)) {
        return "AUTO_GENERATED";
      }
    } else {
      // English patterns
      if (content.match(/(deleted|removed|erased|destroyed|data deleted)/i)) {
        return "POSITIVE_CONFIRMATION";
      }
      
      if (content.match(/(refuse|cannot|impossible|denied|reject)/i)) {
        return "REJECTION";
      }
      
      if (content.match(/(clarify|provide|documents|verification|additional information)/i)) {
        return "CLARIFICATION_REQUEST";
      }
      
      if (content.match(/(partially|some data|part of)/i)) {
        return "PARTIAL_COMPLIANCE";
      }
      
      if (content.match(/(automatic|do not reply|support|received your request)/i)) {
        return "AUTO_GENERATED";
      }
    }
    
    return "UNKNOWN";
  }

  /**
   * Извлечение базовых данных из ответа
   */
  private extractBasicData(email: InboundEmail, language: string): ExtractedResponseData {
    const content = `${email.subject || ''} ${email.bodyText || ''}`;
    
    const extractedData: ExtractedResponseData = {
      response_language: language
    };

    // Извлечение правовых оснований
    const legalBasisPatterns = language === 'ru' 
      ? [/152-?фз/gi, /федеральный закон/gi, /согласие/gi, /договор/gi]
      : [/gdpr/gi, /consent/gi, /contract/gi, /legal basis/gi];
    
    const legalMatches: string[] = [];
    legalBasisPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        legalMatches.push(...matches);
      }
    });
    
    if (legalMatches.length > 0) {
      extractedData.legal_basis = [...new Set(legalMatches)];
    }

    // Извлечение сроков хранения
    const retentionPatterns = [
      /(\d+)\s*(лет|года|год|месяц|дн)/gi,
      /(\d+)\s*(years?|months?|days?)/gi
    ];
    
    for (const pattern of retentionPatterns) {
      const match = content.match(pattern);
      if (match) {
        extractedData.retention_period = match[0];
        break;
      }
    }

    // Извлечение категорий данных
    const dataCategories: string[] = [];
    const categoryPatterns = language === 'ru'
      ? ['фио', 'имя', 'фамилия', 'телефон', 'email', 'адрес', 'паспорт', 'снилс']
      : ['name', 'phone', 'email', 'address', 'passport', 'id'];
    
    categoryPatterns.forEach(category => {
      if (content.toLowerCase().includes(category)) {
        dataCategories.push(category);
      }
    });
    
    if (dataCategories.length > 0) {
      extractedData.data_categories = dataCategories;
    }

    return extractedData;
  }

  /**
   * Детекция базовых нарушений с интеграцией Legal Knowledge Base
   */
  private async detectBasicViolations(
    email: InboundEmail,
    responseType: ResponseType,
    extractedData: ExtractedResponseData
  ): Promise<ViolationType[]> {
    const violations: ViolationType[] = [];
    
    // Проверка нарушения сроков (если нет ответа более 30 дней)
    const daysSinceReceived = Math.floor(
      (Date.now() - new Date(email.receivedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceReceived > 30 && responseType === "NO_RESPONSE") {
      violations.push("DELAY_VIOLATION");
    }

    // Проверка отсутствия правовых оснований при отказе
    if (responseType === "REJECTION" && (!extractedData.legal_basis || extractedData.legal_basis.length === 0)) {
      violations.push("INVALID_LEGAL_BASIS");
    }

    // Проверка недостаточной информации
    if (responseType === "UNKNOWN" || (!extractedData.legal_basis && !extractedData.deletion_timeline)) {
      violations.push("MISSING_INFORMATION");
    }

    // Проверка чрезмерных сроков хранения
    if (extractedData.retention_period) {
      const yearsMatch = extractedData.retention_period.match(/(\d+)\s*лет/);
      if (yearsMatch && parseInt(yearsMatch[1]) > 5) {
        violations.push("EXCESSIVE_RETENTION");
      }
    }

    // Улучшенная правовая валидация с использованием Legal Knowledge Base
    try {
      console.log(`⚖️ Conducting legal analysis for response type: ${responseType}`);
      
      // Проверка правовых оснований на соответствие ФЗ-152
      if (extractedData.legal_basis && extractedData.legal_basis.length > 0) {
        for (const basis of extractedData.legal_basis) {
          const validationResult = await this.legalKnowledgeBase.validateLegalBasis(basis, responseType);
          
          if (validationResult.success && !validationResult.isValid) {
            console.log(`📋 Invalid legal basis detected: ${basis} - ${validationResult.reason}`);
            violations.push("INVALID_LEGAL_BASIS");
            
            // Дополнительные нарушения на основе анализа правового обоснования
            if (validationResult.reason?.includes('устарел') || validationResult.reason?.includes('отменен')) {
              violations.push("MISSING_INFORMATION");
            }
          }
        }
      }

      // Анализ соответствия сроков требованиям ФЗ-152
      if (daysSinceReceived > 0) {
        const deadlinesResult = await this.legalKnowledgeBase.getLegalDeadlines('RESPONSE_DEADLINE');
        
        if (deadlinesResult.success && deadlinesResult.deadlines) {
          const responseDeadline = deadlinesResult.deadlines.find(d => d.procedureType === 'RESPONSE_DEADLINE');
          
          if (responseDeadline && daysSinceReceived > responseDeadline.maxDays) {
            console.log(`⏰ Response deadline exceeded: ${daysSinceReceived} > ${responseDeadline.maxDays} days`);
            if (!violations.includes("DELAY_VIOLATION")) {
              violations.push("DELAY_VIOLATION");
            }
          }
        }
      }

      // Проверка нарушений прав субъекта данных
      if (responseType === "REJECTION" && !extractedData.legal_basis) {
        const rightsViolationResult = await this.legalKnowledgeBase.getArticleByViolation("PRIVACY_VIOLATION");
        
        if (rightsViolationResult.success && rightsViolationResult.article) {
          console.log(`🚫 Privacy rights violation detected based on article: ${rightsViolationResult.article.articleNumber}`);
          violations.push("PRIVACY_VIOLATION");
        }
      }

      // Анализ полноты информации в ответе оператора
      const hasMinimalInfo = extractedData.legal_basis || 
                           extractedData.deletion_timeline || 
                           extractedData.contact_person ||
                           extractedData.processing_purposes;
      
      if (!hasMinimalInfo && responseType !== "POSITIVE_CONFIRMATION") {
        console.log(`📝 Insufficient information provided by operator`);
        if (!violations.includes("MISSING_INFORMATION")) {
          violations.push("MISSING_INFORMATION");
        }
      }

      console.log(`✅ Legal violation analysis completed: ${violations.length} violations detected`);
      
    } catch (error: any) {
      console.error(`❌ Error in legal violation detection:`, error);
      // В случае ошибки возвращаем базовые нарушения без Legal Knowledge Base
    }

    // Убираем дубликаты нарушений
    return [...new Set(violations)];
  }

  /**
   * Расчет базовой оценки правомерности
   */
  private calculateBasicLegitimacyScore(
    responseType: ResponseType,
    violations: ViolationType[],
    extractedData: ExtractedResponseData
  ): number {
    let score = 50; // Базовая оценка

    // Бонус за положительный ответ
    if (responseType === "POSITIVE_CONFIRMATION") {
      score += 30;
    }

    // Штраф за отказ без обоснования
    if (responseType === "REJECTION" && violations.includes("INVALID_LEGAL_BASIS")) {
      score -= 40;
    }

    // Бонус за предоставление правовых оснований
    if (extractedData.legal_basis && extractedData.legal_basis.length > 0) {
      score += 20;
    }

    // Штраф за каждое нарушение
    score -= violations.length * 10;

    // Штраф за неопределенный ответ
    if (responseType === "UNKNOWN") {
      score -= 20;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Генерация базовых рекомендаций с интеграцией Legal Knowledge Base
   */
  private async generateBasicRecommendations(
    responseType: ResponseType,
    violations: ViolationType[],
    legitimacyScore: number
  ): Promise<AnalysisRecommendations> {
    const hasViolations = violations.length > 0;
    const isLowScore = legitimacyScore < 40;
    
    let escalationLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let nextAction = 'Ответ получен и обработан';
    let followUpRequired = false;
    let legalAdviceNeeded = false;
    let estimatedResolutionDays = 1;

    // Получение правовых рекомендаций на основе нарушений с использованием Legal Knowledge Base
    try {
      if (hasViolations) {
        console.log(`⚖️ Getting legal recommendations for violations: ${violations.join(', ')}`);
        
        // Получаем статьи для каждого типа нарушения
        const legalRecommendations: string[] = [];
        const relevantDeadlines: number[] = [];
        
        for (const violation of violations) {
          const articleResult = await this.legalKnowledgeBase.getArticleByViolation(violation);
          
          if (articleResult.success && articleResult.article) {
            const article = articleResult.article;
            console.log(`📋 Found legal article for ${violation}: ${article.articleNumber}`);
            
            legalRecommendations.push(
              `Статья ${article.articleNumber} ${article.lawReference}: ${article.title}`
            );
            
            if (article.deadline && article.deadline > 0) {
              relevantDeadlines.push(article.deadline);
            }
          }
        }
        
        // Получаем правовые сроки
        const deadlinesResult = await this.legalKnowledgeBase.getLegalDeadlines('RESPONSE_DEADLINE');
        if (deadlinesResult.success && deadlinesResult.deadlines) {
          const responseDeadline = deadlinesResult.deadlines.find(d => d.procedureType === 'RESPONSE_DEADLINE');
          if (responseDeadline) {
            relevantDeadlines.push(responseDeadline.maxDays);
          }
        }
        
        // Адаптация рекомендаций на основе правовых знаний
        if (violations.includes("DELAY_VIOLATION")) {
          nextAction = `Подготовить жалобу в Роскомнадзор за нарушение сроков ответа (более ${Math.max(...relevantDeadlines)} дней)`;
          escalationLevel = 'critical';
          legalAdviceNeeded = true;
          estimatedResolutionDays = 60; // Срок рассмотрения в РКН
          followUpRequired = true;
        } else if (violations.includes("INVALID_LEGAL_BASIS")) {
          const legalBasisInfo = legalRecommendations.length > 0 
            ? `Ссылки на нарушенные нормы: ${legalRecommendations.join('; ')}`
            : 'ст. 9, 14 ФЗ-152 "О персональных данных"';
          
          nextAction = `Отправить повторное требование с указанием на нарушение ${legalBasisInfo}`;
          escalationLevel = 'high';
          followUpRequired = true;
          legalAdviceNeeded = true;
          estimatedResolutionDays = 30;
        } else if (violations.includes("PRIVACY_VIOLATION")) {
          nextAction = 'Подать жалобу в Роскомнадзор за нарушение прав субъекта персональных данных';
          escalationLevel = 'critical';
          legalAdviceNeeded = true;
          followUpRequired = true;
          estimatedResolutionDays = 60;
        } else if (violations.includes("EXCESSIVE_RETENTION")) {
          nextAction = 'Направить требование о сокращении срока хранения персональных данных';
          escalationLevel = 'medium';
          legalAdviceNeeded = true;
          followUpRequired = true;
          estimatedResolutionDays = 30;
        }
        
        console.log(`⚖️ Legal recommendations applied: ${nextAction}`);
      }
      
    } catch (error: any) {
      console.error(`❌ Error getting legal recommendations:`, error);
      // В случае ошибки используем базовую логику без Legal Knowledge Base
    }

    // Базовая логика для стандартных случаев
    if (responseType === "POSITIVE_CONFIRMATION" && !hasViolations) {
      nextAction = 'Дело закрыто успешно';
      escalationLevel = 'low';
    } else if (responseType === "CLARIFICATION_REQUEST" && !hasViolations) {
      nextAction = 'Предоставить запрашиваемые документы';
      escalationLevel = 'medium';
      estimatedResolutionDays = 7;
    } else if (hasViolations || isLowScore) {
      nextAction = 'Проанализировать нарушения и подготовить эскалацию';
      escalationLevel = 'medium';
      followUpRequired = true;
      estimatedResolutionDays = 14;
    }

    if (violations.includes("DELAY_VIOLATION")) {
      escalationLevel = 'critical';
      legalAdviceNeeded = true;
      nextAction = 'Подготовить жалобу в Роскомнадзор';
    }

    return {
      next_action: nextAction,
      escalation_level: escalationLevel,
      follow_up_required: followUpRequired,
      legal_advice_needed: legalAdviceNeeded,
      estimated_resolution_days: estimatedResolutionDays,
      confidence_level: Math.max(60, 100 - violations.length * 15)
    };
  }

  /**
   * Определение необходимости AI анализа
   */
  private shouldUseAiAnalysis(ruleBasedResult: ResponseAnalysisResult, email: InboundEmail): boolean {
    // Используем AI если:
    // 1. Тип ответа неопределен
    if (ruleBasedResult.responseType === "UNKNOWN") {
      return true;
    }

    // 2. Низкая уверенность в rule-based анализе
    if ((ruleBasedResult.recommendations?.confidence_level || 0) < 70) {
      return true;
    }

    // 3. Сложный текст (длинный или с юридической терминологией)
    const content = `${email.subject || ''} ${email.bodyText || ''}`;
    if (content.length > 1000 || 
        content.match(/(статья|пункт|закон|норма|постановление|приказ)/gi)) {
      return true;
    }

    // 4. Обнаружены серьезные нарушения
    if (ruleBasedResult.violations?.includes("INVALID_LEGAL_BASIS") || 
        ruleBasedResult.violations?.includes("DELAY_VIOLATION")) {
      return true;
    }

    return false;
  }

  /**
   * Генерация промпта для AI анализа
   */
  private generateAiAnalysisPrompt(email: InboundEmail, ruleBasedResult: ResponseAnalysisResult): string {
    return `Проанализируй ответ оператора персональных данных на требование об удалении данных согласно ФЗ-152.

КОНТЕКСТ:
- От: ${email.operatorEmail}
- Тема: ${email.subject || 'Без темы'}
- Дата получения: ${email.receivedAt}

СОДЕРЖАНИЕ ОТВЕТА:
${email.bodyText || email.bodyHtml || 'Пустое содержание'}

ПРЕДВАРИТЕЛЬНЫЙ АНАЛИЗ (rule-based):
- Тип ответа: ${ruleBasedResult.responseType}
- Нарушения: ${ruleBasedResult.violations?.join(', ') || 'Не обнаружены'}
- Оценка правомерности: ${ruleBasedResult.legitimacyScore}/100

ЗАДАЧА:
Проведи глубокий анализ ответа с учетом требований ФЗ-152 "О персональных данных" и выдай результат в JSON формате.

ТРЕБОВАНИЯ К АНАЛИЗУ:
1. Определи точный тип ответа оператора
2. Извлеки всю ключевую информацию
3. Выяви нарушения российского законодательства
4. Оцени правомерность ответа (0-100)
5. Дай рекомендации по дальнейшим действиям

ВЕРНИ ТОЛЬКО JSON!`;
  }

  /**
   * Вызов OpenAI API с повторными попытками
   */
  private async callOpenAiWithRetry(prompt: string): Promise<OpenAIAnalysisResponse> {
    if (!openai) {
      throw new Error("OpenAI not configured");
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`🔄 OpenAI analysis attempt ${attempt}/${MAX_RETRIES}`);

        const response = await openai.chat.completions.create({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: "Ты - эксперт по защите персональных данных и российскому законодательству. Анализируй ответы операторов ПД с максимальной точностью."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: MAX_TOKENS
        });

        if (!response.choices || response.choices.length === 0) {
          throw new Error("OpenAI returned no choices");
        }

        const choice = response.choices[0];
        if (!choice.message || !choice.message.content) {
          throw new Error("OpenAI returned empty content");
        }

        // Парсинг и валидация JSON
        let parsedContent;
        try {
          parsedContent = JSON.parse(choice.message.content);
        } catch (parseError: any) {
          throw new Error(`Invalid JSON response from OpenAI: ${parseError.message}`);
        }

        // Валидация с помощью Zod схемы
        const validatedContent = OpenAIAnalysisResponseSchema.parse(parsedContent);
        
        console.log(`✅ OpenAI analysis success on attempt ${attempt}`);
        return validatedContent;

      } catch (error: any) {
        lastError = error;
        console.error(`❌ OpenAI analysis attempt ${attempt} failed:`, error.message);

        // Повторяем только при retryable ошибках
        if (attempt < MAX_RETRIES && this.isRetryableError(error)) {
          const delayMs = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
          console.log(`⏳ Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        break;
      }
    }

    throw new Error(`OpenAI analysis failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
  }

  /**
   * Комбинирование результатов rule-based и AI анализа
   */
  private combineAnalysisResults(
    ruleBasedResult: ResponseAnalysisResult,
    aiResult: OpenAIAnalysisResponse
  ): ResponseAnalysisResult {
    return {
      success: true,
      responseType: aiResult.response_type,
      extractedData: aiResult.extracted_data,
      violations: aiResult.violations,
      legitimacyScore: aiResult.legitimacy_score,
      recommendations: aiResult.recommendations
    };
  }

  /**
   * Генерация метаданных анализа
   */
  private generateAnalysisMetadata(
    startTime: number,
    usedAi: boolean,
    confidenceLevel: number
  ): AnalysisMetadata {
    const processingTime = Date.now() - startTime;
    
    return {
      analyzed_at: new Date().toISOString(),
      analysis_version: this.analysisVersion,
      processing_time_ms: processingTime,
      ai_model_used: usedAi ? MODEL : undefined,
      rule_matches: ["response_classification", "violation_detection"],
      confidence_breakdown: {
        rule_based_confidence: usedAi ? 60 : 80,
        ai_confidence: usedAi ? confidenceLevel : undefined,
        combined_confidence: usedAi ? Math.round((60 + confidenceLevel) / 2) : 80
      },
      manual_review_required: confidenceLevel < 70 || !usedAi,
      language_detected: "ru"
    };
  }

  /**
   * Проверка на retryable ошибки OpenAI
   */
  private isRetryableError(error: any): boolean {
    if (error?.status) {
      // Retryable HTTP статусы
      return [429, 500, 502, 503, 504].includes(error.status);
    }
    
    // Retryable ошибки по тексту
    const retryableMessages = [
      'rate limit',
      'timeout',
      'server error',
      'service unavailable',
      'connection error'
    ];
    
    const errorMessage = error.message?.toLowerCase() || '';
    return retryableMessages.some(msg => errorMessage.includes(msg));
  }

  // ========================================
  // EVIDENCE COLLECTION INTEGRATION
  // ========================================

  /**
   * Автоматический сбор доказательств EMAIL_RESPONSE
   * Вызывается после анализа каждого ответа оператора
   */
  private async collectEmailResponseEvidence(
    email: InboundEmail,
    analysisResult: ResponseAnalysisResult
  ): Promise<void> {
    try {
      if (!email.deletionRequestId) {
        console.warn('⚠️ Cannot collect EMAIL_RESPONSE evidence: no deletionRequestId');
        return;
      }

      // Подготовка данных доказательства EMAIL_RESPONSE
      const evidenceData = {
        // Email metadata и headers
        emailHeaders: {
          from: email.operatorEmail,
          to: email.toEmails,
          subject: email.subject,
          messageId: email.messageId,
          inReplyTo: email.inReplyTo,
          references: email.references,
          receivedAt: email.receivedAt
        },
        // Содержимое ответа
        emailContent: {
          bodyText: email.bodyText,
          bodyHtml: email.bodyHtml,
          attachments: email.attachments ? JSON.parse(email.attachments) : []
        },
        // Результаты анализа
        analysisResults: {
          responseType: analysisResult.responseType,
          legitimacyScore: analysisResult.legitimacyScore,
          extractedData: analysisResult.extractedData,
          violations: analysisResult.violations,
          language: analysisResult.extractedData?.response_language || 'ru'
        },
        // Метаданные анализа
        analysisMetadata: analysisResult.analysisMetadata,
        // Юридическая значимость
        legalContext: {
          lawReferences: analysisResult.extractedData?.legal_basis || [],
          legalBasisValid: !analysisResult.violations?.includes('INVALID_LEGAL_BASIS'),
          complianceStatus: this.getComplianceStatus(analysisResult),
          violationsSummary: this.getViolationsSummary(analysisResult.violations || [])
        }
      };

      // Автоматический сбор доказательства EMAIL_RESPONSE
      const evidence = await this.evidenceCollector.collectEvidence(
        email.deletionRequestId,
        'EMAIL_RESPONSE',
        evidenceData,
        `Автоматический анализ ответа от ${email.operatorEmail}: ${analysisResult.responseType} (score: ${analysisResult.legitimacyScore})`
      );

      console.log(`📥 EMAIL_RESPONSE evidence collected: ${evidence.id} for request ${email.deletionRequestId}`);

    } catch (error) {
      console.error('❌ Error collecting EMAIL_RESPONSE evidence:', error);
      // Не прерываем основной процесс анализа из-за ошибок сбора доказательств
    }
  }

  /**
   * Автоматический сбор доказательств нарушений
   * Вызывается при обнаружении нарушений в ответах операторов
   */
  private async collectViolationEvidence(
    email: InboundEmail,
    violations: ViolationType[],
    responseType: ResponseType,
    extractedData: ExtractedResponseData
  ): Promise<void> {
    try {
      if (!email.deletionRequestId || violations.length === 0) {
        return; // Нет нарушений для фиксации
      }

      for (const violation of violations) {
        // Определяем тип доказательства на основе нарушения
        const evidenceType = this.mapViolationToEvidenceType(violation, responseType);
        
        // Подготовка специфичных данных для нарушения
        const evidenceData = {
          // Основная информация о нарушении
          violationDetails: {
            violationType: violation,
            responseType: responseType,
            detectedAt: new Date().toISOString(),
            severity: this.getViolationSeverity(violation),
            lawReference: this.getLawReferenceForViolation(violation)
          },
          // Email контекст
          emailContext: {
            operatorEmail: email.operatorEmail,
            subject: email.subject,
            receivedAt: email.receivedAt,
            bodyExcerpt: email.bodyText?.substring(0, 500) || ''
          },
          // Извлеченные данные релевантные для нарушения
          extractedEvidence: {
            legalBasis: extractedData.legal_basis,
            retentionPeriod: extractedData.retention_period,
            dataCategories: extractedData.data_categories,
            language: extractedData.response_language
          },
          // Юридическое обоснование
          legalJustification: {
            violatedArticle: this.getViolatedArticle(violation),
            legalRequirement: this.getLegalRequirement(violation),
            complianceGap: this.getComplianceGap(violation, extractedData),
            recommendedAction: this.getRecommendedAction(violation)
          }
        };

        // Автоматический сбор доказательства нарушения
        const evidence = await this.evidenceCollector.collectEvidence(
          email.deletionRequestId,
          evidenceType,
          evidenceData,
          `Автонарушение: ${violation} обнаружено в ответе ${email.operatorEmail} (тип: ${responseType})`
        );

        console.log(`⚠️ ${evidenceType} evidence collected: ${evidence.id} for violation ${violation}`);
      }

    } catch (error) {
      console.error('❌ Error collecting violation evidence:', error);
      // Не прерываем основной процесс анализа
    }
  }

  /**
   * Сопоставление типа нарушения с типом доказательства
   */
  private mapViolationToEvidenceType(violation: ViolationType, responseType: ResponseType): 'VIOLATION_DETECTED' | 'OPERATOR_REFUSAL' | 'LEGAL_BASIS_INVALID' {
    switch (violation) {
      case 'INVALID_LEGAL_BASIS':
        return 'LEGAL_BASIS_INVALID';
      case 'DELAY_VIOLATION':
      case 'EXCESSIVE_RETENTION':
      case 'MISSING_INFORMATION':
        return 'VIOLATION_DETECTED';
      default:
        // Если ответ REJECTION - это отказ оператора
        return responseType === 'REJECTION' ? 'OPERATOR_REFUSAL' : 'VIOLATION_DETECTED';
    }
  }

  /**
   * Определение статуса соответствия требованиям
   */
  private getComplianceStatus(analysisResult: ResponseAnalysisResult): string {
    if (!analysisResult.violations || analysisResult.violations.length === 0) {
      return 'COMPLIANT';
    }
    
    const criticalViolations = ['INVALID_LEGAL_BASIS', 'DELAY_VIOLATION'];
    const hasCriticalViolations = analysisResult.violations.some(v => criticalViolations.includes(v));
    
    return hasCriticalViolations ? 'NON_COMPLIANT_CRITICAL' : 'NON_COMPLIANT_MINOR';
  }

  /**
   * Создание краткого описания нарушений
   */
  private getViolationsSummary(violations: ViolationType[]): string[] {
    const summaryMap: Record<ViolationType, string> = {
      'DELAY_VIOLATION': 'Нарушение сроков ответа (более 30 дней)',
      'INVALID_LEGAL_BASIS': 'Отсутствие или некорректность правовых оснований',
      'MISSING_INFORMATION': 'Недостаточная информация в ответе',
      'EXCESSIVE_RETENTION': 'Чрезмерные сроки хранения данных'
    };

    return violations.map(v => summaryMap[v] || `Неизвестное нарушение: ${v}`);
  }

  /**
   * Определение степени серьезности нарушения
   */
  private getViolationSeverity(violation: ViolationType): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    switch (violation) {
      case 'INVALID_LEGAL_BASIS':
      case 'DELAY_VIOLATION':
        return 'CRITICAL';
      case 'EXCESSIVE_RETENTION':
        return 'HIGH';
      case 'MISSING_INFORMATION':
        return 'MEDIUM';
      default:
        return 'LOW';
    }
  }

  /**
   * Получение ссылки на ФЗ-152 для нарушения
   */
  private getLawReferenceForViolation(violation: ViolationType): string {
    switch (violation) {
      case 'DELAY_VIOLATION':
        return 'ФЗ-152 ст. 14 п. 3 - Сроки рассмотрения требований субъектов';
      case 'INVALID_LEGAL_BASIS':
        return 'ФЗ-152 ст. 6 - Условия обработки персональных данных';
      case 'EXCESSIVE_RETENTION':
        return 'ФЗ-152 ст. 5 п. 4 - Принципы и условия обработки персональных данных';
      case 'MISSING_INFORMATION':
        return 'ФЗ-152 ст. 14 п. 4 - Содержание ответа на требование субъекта';
      default:
        return 'ФЗ-152 - Федеральный закон о персональных данных';
    }
  }

  /**
   * Получение нарушенной статьи закона
   */
  private getViolatedArticle(violation: ViolationType): string {
    return this.getLawReferenceForViolation(violation).split(' - ')[0];
  }

  /**
   * Получение правового требования
   */
  private getLegalRequirement(violation: ViolationType): string {
    switch (violation) {
      case 'DELAY_VIOLATION':
        return 'Оператор обязан рассмотреть требование субъекта в течение 30 дней';
      case 'INVALID_LEGAL_BASIS':
        return 'Оператор обязан указать правовые основания обработки персональных данных';
      case 'EXCESSIVE_RETENTION':
        return 'Сроки хранения персональных данных должны соответствовать целям обработки';
      case 'MISSING_INFORMATION':
        return 'Ответ должен содержать исчерпывающую информацию по требованию субъекта';
      default:
        return 'Соблюдение требований ФЗ-152';
    }
  }

  /**
   * Описание пробела в соответствии
   */
  private getComplianceGap(violation: ViolationType, extractedData: ExtractedResponseData): string {
    switch (violation) {
      case 'INVALID_LEGAL_BASIS':
        return `Не указаны правовые основания. Найдено: ${extractedData.legal_basis?.join(', ') || 'отсутствует'}`;
      case 'MISSING_INFORMATION':
        return 'Ответ не содержит необходимой информации о статусе данных';
      case 'EXCESSIVE_RETENTION':
        return `Указанные сроки хранения: ${extractedData.retention_period || 'не указаны'}`;
      default:
        return 'Выявлено несоответствие требованиям закона';
    }
  }

  /**
   * Рекомендуемые действия по устранению нарушения
   */
  private getRecommendedAction(violation: ViolationType): string {
    switch (violation) {
      case 'DELAY_VIOLATION':
        return 'Направить повторное требование с указанием на нарушение сроков';
      case 'INVALID_LEGAL_BASIS':
        return 'Запросить разъяснения по правовым основаниям обработки данных';
      case 'EXCESSIVE_RETENTION':
        return 'Запросить обоснование сроков хранения персональных данных';
      case 'MISSING_INFORMATION':
        return 'Направить уточняющий запрос с требованием полной информации';
      default:
        return 'Обратиться в надзорный орган для защиты прав';
    }
  }

  /**
   * ФЗ-152 COMPLIANT: PII Sanitization - очистка персональных данных перед анализом
   * Удаляет все персональные данные из контента для безопасной обработки
   */
  private sanitizeContentForAnalysis(email: InboundEmail): string {
    let content = `${email.subject || ''} ${email.bodyText || email.bodyHtml || ''}`;
    
    // Удаляем email адреса
    content = content.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]');
    
    // Удаляем телефоны (российские и международные форматы)
    content = content.replace(/\+?[78]?[\s\-\(\)]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/g, '[PHONE_REDACTED]');
    
    // Удаляем потенциальные ФИО (Фамилия И.О. или полные имена)
    content = content.replace(/\b[А-ЯЁ][а-яё]+\s+[А-ЯЁ]\.[А-ЯЁ]\./g, '[NAME_REDACTED]');
    content = content.replace(/\b[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+/g, '[FULLNAME_REDACTED]');
    
    // Удаляем адреса
    content = content.replace(/г\.[\s]*[А-ЯЁ][а-яё]+[\s\S]*?\d+/g, '[ADDRESS_REDACTED]');
    
    // Удаляем паспортные данные
    content = content.replace(/\d{4}\s*\d{6}/g, '[PASSPORT_REDACTED]');
    content = content.replace(/серия\s*\d+\s*номер\s*\d+/gi, '[PASSPORT_REDACTED]');
    
    // Удаляем СНИЛС
    content = content.replace(/\d{3}-\d{3}-\d{3}\s*\d{2}/g, '[SNILS_REDACTED]');
    
    console.log('🔒 PII sanitization completed - персональные данные удалены из контента');
    return content.trim();
  }

  /**
   * ФЗ-152 COMPLIANT: Углубленная классификация типа ответа
   * Использует расширенные правила для более точной классификации
   */
  private enhancedClassifyResponseType(sanitizedContent: string, basicResult: ResponseAnalysisResult): ResponseType {
    const content = sanitizedContent.toLowerCase();
    
    // Если базовый анализ определил тип уверенно, проверяем дополнительно
    if (basicResult.responseType !== 'UNKNOWN') {
      // Дополнительная проверка на автоматические ответы
      if (content.match(/(автоответчик|автоматическое сообщение|не отвечайте на это письмо|noreply)/i)) {
        return 'AUTO_GENERATED';
      }
      
      // Проверка на частичное выполнение с более точными паттернами
      if (content.match(/(частично выполнено|некоторые данные удалены|часть информации|не все данные)/i)) {
        return 'PARTIAL_COMPLIANCE';
      }
    }
    
    // Расширенные паттерны для неопределенных ответов
    if (basicResult.responseType === 'UNKNOWN') {
      // Положительное подтверждение с дополнительными паттернами
      if (content.match(/(выполнено|исполнено|удалено|данные отсутствуют|информация отсутствует|не найдено в базе)/i)) {
        return 'POSITIVE_CONFIRMATION';
      }
      
      // Отказ с дополнительными паттернами
      if (content.match(/(отказываем|не можем выполнить|невозможно удалить|отсутствуют основания|нет правовых оснований)/i)) {
        return 'REJECTION';
      }
      
      // Уведомление о процессе
      if (content.match(/(рассматривается|в процессе|проверяется|анализируется|передано в отдел)/i)) {
        return 'CLARIFICATION_REQUEST';
      }
    }
    
    return basicResult.responseType || 'UNKNOWN';
  }

  /**
   * ФЗ-152 COMPLIANT: Улучшенное извлечение данных из ответа
   * Расширенная логика извлечения без использования внешних API
   */
  private enhancedExtractData(sanitizedContent: string, basicData?: ExtractedResponseData): ExtractedResponseData {
    const content = sanitizedContent;
    const extractedData: ExtractedResponseData = {
      ...basicData,
      response_language: this.detectLanguage(content)
    };

    // Расширенное извлечение правовых оснований
    const enhancedLegalBasisPatterns = [
      /152-?фз/gi, /федеральный закон.*152/gi, /о персональных данных/gi,
      /согласие субъекта/gi, /договор/gi, /исполнение обязательств/gi,
      /статья\s*\d+/gi, /пункт\s*\d+/gi, /часть\s*\d+/gi
    ];
    
    const legalMatches: string[] = [];
    enhancedLegalBasisPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        legalMatches.push(...matches);
      }
    });
    
    if (legalMatches.length > 0) {
      extractedData.legal_basis = [...new Set(legalMatches)];
    }

    // Расширенное извлечение сроков
    const enhancedRetentionPatterns = [
      /(?:хранятся|храним|хранение)\s*(?:в течение\s*)?(?:не более\s*)?(?:до\s*)?(\d+)\s*(лет|года|год|месяц|дней|дня)/gi,
      /срок\s*(?:хранения\s*)?(?:составляет\s*)?(\d+)\s*(лет|года|год|месяц|дней|дня)/gi,
      /(?:удаляются|будут удалены)\s*(?:через\s*)?(\d+)\s*(лет|года|год|месяц|дней|дня)/gi
    ];
    
    for (const pattern of enhancedRetentionPatterns) {
      const match = content.match(pattern);
      if (match) {
        extractedData.retention_period = match[0];
        break;
      }
    }

    // Извлечение информации о согласии
    if (content.match(/согласие.*дано|получено согласие|имеется согласие/gi)) {
      extractedData.consent_info = {
        has_consent: true,
        consent_source: 'Указано в ответе оператора'
      };
    } else if (content.match(/согласие.*отсутствует|нет согласия|не давали согласие/gi)) {
      extractedData.consent_info = {
        has_consent: false,
        consent_source: 'Отсутствует согласно ответу оператора'
      };
    }

    // Извлечение контактной информации (обезличенной)
    if (content.match(/обращайтесь.*по.*адресу|контактное лицо|ответственный за обработку/gi)) {
      extractedData.contact_person = 'Указано в ответе (данные обезличены)';
    }

    return extractedData;
  }

  /**
   * ФЗ-152 COMPLIANT: Расширенная детекция нарушений
   * Более глубокий анализ потенциальных нарушений ФЗ-152
   */
  private async enhancedDetectViolations(
    email: InboundEmail,
    responseType: ResponseType,
    extractedData: ExtractedResponseData
  ): Promise<ViolationType[]> {
    const violations: ViolationType[] = [];
    const content = `${email.subject || ''} ${email.bodyText || email.bodyHtml || ''}`.toLowerCase();
    
    // Расширенная проверка нарушения сроков
    const daysSinceReceived = Math.floor(
      (Date.now() - new Date(email.receivedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Проверка различных типов нарушений сроков
    if (daysSinceReceived > 30) {
      violations.push("DELAY_VIOLATION");
    }
    
    // Углубленная проверка правовых оснований
    if (responseType === "REJECTION") {
      const hasValidLegalBasis = extractedData.legal_basis && 
        extractedData.legal_basis.some(basis => 
          basis.match(/152-?фз|федеральный закон|согласие|договор|исполнение обязательств/i)
        );
      
      if (!hasValidLegalBasis) {
        violations.push("INVALID_LEGAL_BASIS");
      }
      
      // Проверка на формальный отказ без объяснений
      if (content.length < 100 && !extractedData.legal_basis) {
        violations.push("MISSING_INFORMATION");
      }
    }

    // Проверка на отсутствие обязательной информации
    const hasMinimalRequiredInfo = 
      extractedData.legal_basis || 
      extractedData.deletion_timeline || 
      extractedData.contact_person ||
      extractedData.processing_purposes;
    
    if (!hasMinimalRequiredInfo && responseType !== "POSITIVE_CONFIRMATION" && responseType !== "AUTO_GENERATED") {
      violations.push("MISSING_INFORMATION");
    }

    // Расширенная проверка чрезмерных сроков хранения
    if (extractedData.retention_period) {
      const yearsMatch = extractedData.retention_period.match(/(\d+)\s*лет/);
      const monthsMatch = extractedData.retention_period.match(/(\d+)\s*месяц/);
      
      if ((yearsMatch && parseInt(yearsMatch[1]) > 5) || 
          (monthsMatch && parseInt(monthsMatch[1]) > 60)) {
        violations.push("EXCESSIVE_RETENTION");
      }
    }

    // Проверка на нарушение прав субъекта (новые паттерны)
    if (content.match(/не имеете права|не можете требовать|закон не предусматривает|отказываем в доступе/gi)) {
      violations.push("PRIVACY_VIOLATION");
    }

    // Интеграция с Legal Knowledge Base для дополнительной проверки
    try {
      if (extractedData.legal_basis && extractedData.legal_basis.length > 0) {
        for (const basis of extractedData.legal_basis) {
          const validationResult = await this.legalKnowledgeBase.validateLegalBasis(basis, responseType);
          
          if (validationResult.success && !validationResult.isValid) {
            violations.push("INVALID_LEGAL_BASIS");
          }
        }
      }
    } catch (error) {
      console.warn('Warning: Could not validate legal basis with knowledge base:', error);
    }

    return [...new Set(violations)];
  }

  /**
   * ФЗ-152 COMPLIANT: Улучшенный расчет legitimacy score
   */
  private enhancedCalculateLegitimacyScore(
    responseType: ResponseType,
    violations: ViolationType[],
    extractedData: ExtractedResponseData,
    email: InboundEmail
  ): number {
    let score = 50; // Базовая оценка

    // Бонус за положительный ответ
    if (responseType === "POSITIVE_CONFIRMATION") {
      score += 35;
    }

    // Штраф за отказ без обоснования
    if (responseType === "REJECTION" && violations.includes("INVALID_LEGAL_BASIS")) {
      score -= 45;
    }

    // Бонус за предоставление правовых оснований
    if (extractedData.legal_basis && extractedData.legal_basis.length > 0) {
      score += 25;
    }

    // Штраф за каждое нарушение (более строго)
    score -= violations.length * 15;

    // Штраф за неопределенный ответ
    if (responseType === "UNKNOWN") {
      score -= 25;
    }

    // Бонус за полноту информации
    const infoCompleteness = [
      extractedData.legal_basis,
      extractedData.contact_person,
      extractedData.deletion_timeline,
      extractedData.processing_purposes
    ].filter(Boolean).length;
    
    score += infoCompleteness * 5;

    // Проверка соблюдения сроков ответа
    const daysSinceReceived = Math.floor(
      (Date.now() - new Date(email.receivedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceReceived <= 30) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * ФЗ-152 COMPLIANT: Улучшенные рекомендации
   */
  private async enhancedGenerateRecommendations(
    responseType: ResponseType,
    violations: ViolationType[],
    legitimacyScore: number,
    email: InboundEmail
  ): Promise<AnalysisRecommendations> {
    const hasViolations = violations.length > 0;
    const isLowScore = legitimacyScore < 40;
    
    let escalationLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let nextAction = 'Ответ получен и обработан';
    let followUpRequired = false;
    let legalAdviceNeeded = false;
    let estimatedResolutionDays = 1;

    // Специальная логика для критических нарушений
    if (violations.includes("DELAY_VIOLATION") && violations.includes("INVALID_LEGAL_BASIS")) {
      nextAction = 'Немедленная эскалация в Роскомнадзор - множественные нарушения ФЗ-152';
      escalationLevel = 'critical';
      legalAdviceNeeded = true;
      followUpRequired = true;
      estimatedResolutionDays = 5;
    } else if (violations.includes("DELAY_VIOLATION")) {
      nextAction = 'Подготовить жалобу в Роскомнадзор за нарушение сроков ответа';
      escalationLevel = 'critical';
      legalAdviceNeeded = true;
      followUpRequired = true;
      estimatedResolutionDays = 30;
    } else if (violations.includes("INVALID_LEGAL_BASIS")) {
      nextAction = 'Направить повторное требование с указанием на неверность правовых оснований';
      escalationLevel = 'high';
      legalAdviceNeeded = true;
      followUpRequired = true;
      estimatedResolutionDays = 15;
    } else if (responseType === "POSITIVE_CONFIRMATION" && !hasViolations) {
      nextAction = 'Дело закрыто успешно';
      escalationLevel = 'low';
    } else if (responseType === "CLARIFICATION_REQUEST" && !hasViolations) {
      nextAction = 'Предоставить запрашиваемые документы';
      escalationLevel = 'medium';
      estimatedResolutionDays = 7;
    } else if (hasViolations || isLowScore) {
      nextAction = 'Проанализировать нарушения и подготовить эскалацию';
      escalationLevel = 'medium';
      followUpRequired = true;
      estimatedResolutionDays = 14;
    }

    return {
      next_action: nextAction,
      escalation_level: escalationLevel,
      follow_up_required: followUpRequired,
      legal_advice_needed: legalAdviceNeeded,
      estimated_resolution_days: estimatedResolutionDays,
      confidence_level: Math.max(70, 100 - violations.length * 10)
    };
  }
}

// Singleton export - will be initialized with storage when first called
// Note: storage must be provided on first getInstance() call
import { storage } from './storage';
import { ResponseAnalyzer } from './response-analyzer';
import { EvidenceCollector } from './evidence-collector';
import { createLegalKnowledgeBase, type LegalKnowledgeBase, type LegalAnalysisContext } from './legal-knowledge-base';
import type { IStorage } from './storage';
import type { 
  DeletionRequest, 
  InboundEmail,
  DecisionType,
  ResponseType,
  ViolationType,
  EvidenceCollection 
} from '@shared/schema';

/**
 * Результат принятия решения Decision Engine
 */
export interface DecisionResult {
  success: boolean;
  error?: string;
  decision?: {
    type: DecisionType;
    reason: string;
    metadata: DecisionMetadata;
    confidence: number;
    autoExecute: boolean;
  };
}

/**
 * Метаданные решения для аудита и анализа
 */
export interface DecisionMetadata {
  triggeredByAnalysis: boolean;
  analysisScore?: number;
  analysisViolations?: ViolationType[];
  triggerRules: string[];
  manualOverride: boolean;
  overrideReason?: string;
  originalDecision?: string;
  executionTimestamp: string;
  estimatedResolutionDays: number;
  escalationLevel: string;
  aiAnalysisUsed: boolean;
  ruleConfidence: number;
  requestAge?: number;
  operatorEmail?: string;
  responsePattern?: string;
  // Evidence collection integration
  evidenceCollected: boolean;
  evidenceChainLength: number;
  evidenceChainIntegrity: boolean;
  evidenceTypes: string[];
  criticalEvidenceCount: number;
  evidenceQualityScore: number;
  legalEvidenceStrength: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  // САЗПД Idempotency support
  idempotencyKey: string;
  processingInstanceId: string;
  duplicatePreventionEnabled: boolean;
}

/**
 * Конфигурация правил принятия решений
 */
interface DecisionRuleConfig {
  name: string;
  condition: (context: DecisionContext) => boolean;
  decision: DecisionType;
  confidence: number;
  escalationLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedDays: number;
  autoExecute: boolean;
  reason: string;
}

/**
 * Контекст для принятия решения
 */
interface DecisionContext {
  request: DeletionRequest;
  lastInboundEmail?: InboundEmail;
  responseType?: ResponseType;
  legitimacyScore?: number;
  violations?: ViolationType[];
  requestAgeInDays: number;
  hasResponse: boolean;
  hasButtonConfirmation: boolean;
  escalationLevel?: string;
  previousDecisions: number;
  // Evidence collection integration
  evidence: {
    collected: boolean;
    chainLength: number;
    integrityVerified: boolean;
    types: string[];
    criticalEvidenceCount: number;
    qualityScore: number;
    legalStrength: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    violationEvidenceCount: number;
    emailResponseEvidenceCount: number;
    operatorRefusalEvidenceCount: number;
    legalBasisInvalidCount: number;
  };
}

/**
 * Decision Engine Module для автоматизированного принятия решений
 * на основе анализа ответов операторов ПД согласно ФЗ-152
 * 
 * Основные функции:
 * - Анализ контекста запроса и ответов операторов
 * - Применение правил принятия решений
 * - Автоматическое выполнение решений или планирование действий
 * - Логирование всех решений для аудита
 * - Поддержка ручного переопределения решений
 */
export class DecisionEngine {
  private static instance: DecisionEngine;
  private readonly decisionVersion = "1.0.0";
  private evidenceCollector: EvidenceCollector;
  private responseAnalyzer: ResponseAnalyzer;
  private legalKnowledgeBase: LegalKnowledgeBase;

  // Пороговые значения для принятия решений
  private readonly thresholds = {
    HIGH_LEGITIMACY_SCORE: 80,    // Высокий score для автозавершения
    LOW_LEGITIMACY_SCORE: 40,     // Низкий score для эскалации
    FOLLOW_UP_DAYS: 30,           // Дни для повторного обращения
    ESCALATION_DAYS: 60,          // Дни для эскалации в РКН
    CRITICAL_VIOLATIONS_COUNT: 2,  // Количество нарушений для критической эскалации
    MIN_CONFIDENCE: 70            // Минимальная уверенность для автовыполнения
  };

  // Правила принятия решений (в порядке приоритета)
  private readonly decisionRules: DecisionRuleConfig[] = [
    // КРИТИЧЕСКИЕ НАРУШЕНИЯ - наивысший приоритет
    {
      name: 'CRITICAL_VIOLATIONS_IMMEDIATE',
      condition: (ctx) => {
        const criticalViolations = ['DELAY_VIOLATION', 'INVALID_LEGAL_BASIS', 'PRIVACY_VIOLATION'];
        return (ctx.violations?.filter(v => criticalViolations.includes(v)).length || 0) >= 2;
      },
      decision: 'IMMEDIATE_ESCALATION',
      confidence: 95,
      escalationLevel: 'critical',
      estimatedDays: 1,
      autoExecute: true,
      reason: 'Обнаружены критические нарушения требующие немедленной эскалации'
    },

    // ПОЛОЖИТЕЛЬНОЕ ПОДТВЕРЖДЕНИЕ с высоким score
    {
      name: 'AUTO_COMPLETE_HIGH_SCORE',
      condition: (ctx) => 
        ctx.responseType === 'POSITIVE_CONFIRMATION' && 
        (ctx.legitimacyScore || 0) >= this.thresholds.HIGH_LEGITIMACY_SCORE &&
        (!ctx.violations || ctx.violations.length === 0),
      decision: 'AUTO_COMPLETE',
      confidence: 90,
      escalationLevel: 'low',
      estimatedDays: 1,
      autoExecute: true,
      reason: 'Получено положительное подтверждение удаления данных с высоким score правомерности'
    },

    // КНОПКА ПОДТВЕРЖДЕНИЯ от оператора
    {
      name: 'BUTTON_CONFIRMATION',
      condition: (ctx) => ctx.hasButtonConfirmation,
      decision: 'CLOSE_AS_RESOLVED',
      confidence: 85,
      escalationLevel: 'low',
      estimatedDays: 1,
      autoExecute: true,
      reason: 'Оператор подтвердил удаление данных через кнопку в письме'
    },

    // ОТКАЗ с неверным правовым обоснованием
    {
      name: 'REJECTION_INVALID_BASIS',
      condition: (ctx) => 
        ctx.responseType === 'REJECTION' && 
        ctx.violations?.includes('INVALID_LEGAL_BASIS'),
      decision: 'ESCALATE_TO_RKN',
      confidence: 85,
      escalationLevel: 'high',
      estimatedDays: 30,
      autoExecute: false, // требует проверки
      reason: 'Получен отказ с неверным правовым обоснованием, требуется эскалация в Роскомнадзор'
    },

    // ЗАПРОС УТОЧНЕНИЙ
    {
      name: 'CLARIFICATION_REQUEST',
      condition: (ctx) => ctx.responseType === 'CLARIFICATION_REQUEST',
      decision: 'REQUEST_CLARIFICATION',
      confidence: 80,
      escalationLevel: 'medium',
      estimatedDays: 7,
      autoExecute: false,
      reason: 'Оператор запросил дополнительную информацию'
    },

    // ЧАСТИЧНОЕ СООТВЕТСТВИЕ
    {
      name: 'PARTIAL_COMPLIANCE',
      condition: (ctx) => ctx.responseType === 'PARTIAL_COMPLIANCE',
      decision: 'REQUEST_CLARIFICATION',
      confidence: 75,
      escalationLevel: 'medium',
      estimatedDays: 14,
      autoExecute: false,
      reason: 'Получено частичное выполнение требований, требуется уточнение'
    },

    // ОТСУТСТВИЕ ОТВЕТА 30+ дней
    {
      name: 'NO_RESPONSE_FOLLOW_UP',
      condition: (ctx) => 
        (!ctx.hasResponse || ctx.responseType === 'NO_RESPONSE') && 
        ctx.requestAgeInDays >= this.thresholds.FOLLOW_UP_DAYS &&
        ctx.requestAgeInDays < this.thresholds.ESCALATION_DAYS,
      decision: 'SCHEDULE_FOLLOW_UP',
      confidence: 80,
      escalationLevel: 'medium',
      estimatedDays: 30,
      autoExecute: true,
      reason: 'Отсутствие ответа более 30 дней, планируется повторное обращение'
    },

    // ОТСУТСТВИЕ ОТВЕТА 60+ дней - эскалация
    {
      name: 'NO_RESPONSE_ESCALATION',
      condition: (ctx) => 
        (!ctx.hasResponse || ctx.responseType === 'NO_RESPONSE') && 
        ctx.requestAgeInDays >= this.thresholds.ESCALATION_DAYS,
      decision: 'ESCALATE_TO_RKN',
      confidence: 90,
      escalationLevel: 'high',
      estimatedDays: 30,
      autoExecute: true,
      reason: 'Отсутствие ответа более 60 дней, автоматическая эскалация в Роскомнадзор'
    },

    // НИЗКИЙ SCORE ПРАВОМЕРНОСТИ
    {
      name: 'LOW_LEGITIMACY_SCORE',
      condition: (ctx) => 
        ctx.legitimacyScore !== undefined && 
        ctx.legitimacyScore < this.thresholds.LOW_LEGITIMACY_SCORE,
      decision: 'MANUAL_REVIEW_REQUIRED',
      confidence: 70,
      escalationLevel: 'medium',
      estimatedDays: 7,
      autoExecute: false,
      reason: 'Низкий score правомерности ответа, требуется ручная проверка'
    },

    // НЕИЗВЕСТНЫЙ ТИП ОТВЕТА
    {
      name: 'UNKNOWN_RESPONSE_TYPE',
      condition: (ctx) => ctx.responseType === 'UNKNOWN',
      decision: 'MANUAL_REVIEW_REQUIRED',
      confidence: 60,
      escalationLevel: 'medium',
      estimatedDays: 3,
      autoExecute: false,
      reason: 'Не удалось определить тип ответа оператора, требуется ручная классификация'
    }
  ];

  private constructor(storage: IStorage) {
    this.evidenceCollector = new EvidenceCollector(storage);
    this.responseAnalyzer = ResponseAnalyzer.getInstance(storage);
    this.legalKnowledgeBase = createLegalKnowledgeBase(storage);
  }

  static getInstance(storage?: IStorage): DecisionEngine {
    if (!DecisionEngine.instance) {
      if (!storage) {
        throw new Error('Storage is required for first initialization of DecisionEngine');
      }
      DecisionEngine.instance = new DecisionEngine(storage);
    }
    return DecisionEngine.instance;
  }

  /**
   * Основной метод принятия решения для deletion request
   */
  async makeDecision(requestId: string, forceReanalysis: boolean = false): Promise<DecisionResult> {
    const startTime = Date.now();
    console.log(`🎯 Making decision for deletion request ${requestId}`);

    try {
      // Получаем полную информацию о запросе
      const context = await this.buildDecisionContext(requestId, forceReanalysis);
      if (!context) {
        return {
          success: false,
          error: `Deletion request ${requestId} not found`
        };
      }

      // САЗПД КРИТИЧНО: Проверяем idempotency key для предотвращения дублирования
      const idempotencyKey = this.generateIdempotencyKey(requestId, context);
      
      // Проверяем, не было ли уже принято решение с таким же idempotency key
      if (context.request.decisionType && context.request.decisionIdempotencyKey && !forceReanalysis) {
        if (context.request.decisionIdempotencyKey === idempotencyKey) {
          console.log(`🔒 Idempotent decision detected for request ${requestId}: ${context.request.decisionType}`);
          return {
            success: true,
            decision: {
              type: context.request.decisionType as DecisionType,
              reason: context.request.decisionReason || 'Решение уже принято (idempotent)',
              metadata: context.request.decisionMetadata as DecisionMetadata || {},
              confidence: 100,
              autoExecute: false
            }
          };
        } else {
          console.log(`⚠️ Decision exists but with different context for request ${requestId}, re-analyzing...`);
        }
      }

      // Применяем правила принятия решений
      const decision = await this.applyDecisionRules(context);
      
      // Добавляем idempotency поддержку в metadata решения
      decision.metadata.idempotencyKey = idempotencyKey;
      decision.metadata.processingInstanceId = process.env.NODE_ENV || 'development';
      decision.metadata.duplicatePreventionEnabled = true;
      
      // Сохраняем решение в базе данных с idempotency key
      await this.saveDecision(requestId, decision, context, idempotencyKey);

      const processingTime = Date.now() - startTime;
      console.log(`✅ Decision made for request ${requestId} in ${processingTime}ms: ${decision.type}`);
      
      return {
        success: true,
        decision
      };

    } catch (error: any) {
      console.error(`❌ Error making decision for request ${requestId}:`, error);
      return {
        success: false,
        error: `Decision failed: ${error.message}`
      };
    }
  }

  /**
   * Ручное переопределение автоматического решения
   */
  async overrideDecision(
    requestId: string, 
    newDecisionType: DecisionType, 
    overrideReason: string,
    adminId?: string
  ): Promise<DecisionResult> {
    console.log(`🔧 Manual override for request ${requestId}: ${newDecisionType}`);

    try {
      const request = await storage.getDeletionRequestById(requestId);
      if (!request) {
        return {
          success: false,
          error: `Deletion request ${requestId} not found`
        };
      }

      const originalDecision = request.decisionType;
      const originalMetadata = request.decisionMetadata as DecisionMetadata || {};

      const overrideMetadata: DecisionMetadata = {
        ...originalMetadata,
        manualOverride: true,
        overrideReason,
        originalDecision: originalDecision || 'none',
        executionTimestamp: new Date().toISOString(),
        triggerRules: ['MANUAL_OVERRIDE'],
        triggeredByAnalysis: false,
        estimatedResolutionDays: 1,
        escalationLevel: 'medium',
        aiAnalysisUsed: false,
        ruleConfidence: 100
      };

      // Обновляем запрос с новым решением
      await storage.updateDeletionRequest(requestId, {
        decisionType: newDecisionType,
        decisionReason: `Manual override: ${overrideReason}`,
        decisionMetadata: overrideMetadata,
        autoProcessed: false,
        decisionMadeAt: new Date()
      });

      // Логируем действие администратора
      if (adminId) {
        await storage.logAdminAction({
          adminId,
          actionType: 'decision_override',
          targetType: 'deletion_request',
          targetId: requestId,
          metadata: {
            originalDecision,
            newDecision: newDecisionType,
            reason: overrideReason
          },
          sessionId: 'manual-override',
          ipAddress: 'internal',
          userAgent: 'decision-engine'
        });
      }

      console.log(`✅ Decision override completed for request ${requestId}`);
      
      return {
        success: true,
        decision: {
          type: newDecisionType,
          reason: `Manual override: ${overrideReason}`,
          metadata: overrideMetadata,
          confidence: 100,
          autoExecute: false
        }
      };

    } catch (error: any) {
      console.error(`❌ Error overriding decision for request ${requestId}:`, error);
      return {
        success: false,
        error: `Override failed: ${error.message}`
      };
    }
  }

  /**
   * Построение контекста для принятия решения
   */
  private async buildDecisionContext(requestId: string, forceReanalysis: boolean): Promise<DecisionContext | null> {
    try {
      const request = await storage.getDeletionRequestById(requestId);
      if (!request) {
        return null;
      }

      // Получаем последнее входящее письмо
      let lastInboundEmail: InboundEmail | undefined;
      if (request.lastInboundEmailId) {
        lastInboundEmail = await storage.getInboundEmailById(request.lastInboundEmailId);
      }

      // Если есть письмо но нет анализа, или принудительный реанализ
      if (lastInboundEmail && (!lastInboundEmail.responseType || forceReanalysis)) {
        console.log(`🔍 Re-analyzing response for improved decision making`);
        const analysisResult = await this.responseAnalyzer.analyzeResponse(lastInboundEmail);
        
        if (analysisResult.success) {
          // Обновляем анализ в базе
          await storage.updateInboundEmailAnalysis(lastInboundEmail.id, {
            responseType: analysisResult.responseType,
            extractedData: analysisResult.extractedData,
            violations: analysisResult.violations,
            legitimacyScore: analysisResult.legitimacyScore,
            recommendations: analysisResult.recommendations,
            analysisMetadata: analysisResult.analysisMetadata
          });

          // Обновляем локальную копию
          lastInboundEmail = {
            ...lastInboundEmail,
            responseType: analysisResult.responseType,
            extractedData: analysisResult.extractedData,
            violations: analysisResult.violations,
            legitimacyScore: analysisResult.legitimacyScore,
            recommendations: analysisResult.recommendations,
            analysisMetadata: analysisResult.analysisMetadata
          };
        }
      }

      // Вычисляем возраст запроса
      const requestAgeInDays = request.firstSentAt 
        ? Math.floor((Date.now() - new Date(request.firstSentAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Подсчитываем предыдущие решения (для анализа паттернов)
      const userRequests = await storage.getUserDeletionRequests(request.userId);
      const previousDecisions = userRequests.filter(r => r.decisionType && r.id !== requestId).length;

      // Получение и анализ доказательств для принятия решения
      const evidenceAnalysis = await this.analyzeCollectedEvidence(requestId);
      
      // Правовое обогащение контекста с использованием Legal Knowledge Base
      let legalRecommendations: any = null;
      try {
        if (lastInboundEmail?.violations && lastInboundEmail.violations.length > 0) {
          console.log(`⚖️ Enriching decision context with legal analysis for violations: ${lastInboundEmail.violations.join(', ')}`);
          
          const legalAnalysisContext: LegalAnalysisContext = {
            violationTypes: lastInboundEmail.violations,
            documentType: 'ESCALATION_NOTICE', // Можем определять системно
            requestAge: requestAgeInDays,
            complianceHistory: previousDecisions > 0 ? 'POOR' : 'UNKNOWN'
          };
          
          const recommendations = await this.legalKnowledgeBase.getRecommendedLegalBasis(legalAnalysisContext);
          if (recommendations.success) {
            legalRecommendations = recommendations.recommendations;
            console.log(`⚖️ Legal recommendations obtained: strength ${legalRecommendations?.legalStrength}, success rate ${legalRecommendations?.estimatedSuccessRate}%`);
          }
        }
        
        // Получаем правовые сроки для контекста
        const deadlinesResult = await this.legalKnowledgeBase.getLegalDeadlines('RESPONSE_DEADLINE');
        if (deadlinesResult.success && deadlinesResult.deadlines) {
          const responseDeadline = deadlinesResult.deadlines.find(d => d.procedureType === 'RESPONSE_DEADLINE');
          if (responseDeadline && requestAgeInDays > responseDeadline.maxDays) {
            console.log(`⏰ Legal deadline exceeded: ${requestAgeInDays} > ${responseDeadline.maxDays} days`);
          }
        }
        
      } catch (error: any) {
        console.error(`❌ Error in legal context enrichment:`, error);
        // Продолжаем без правового обогащения
      }

      const context: DecisionContext = {
        request,
        lastInboundEmail,
        responseType: lastInboundEmail?.responseType as ResponseType,
        legitimacyScore: lastInboundEmail?.legitimacyScore,
        violations: lastInboundEmail?.violations as ViolationType[],
        requestAgeInDays,
        hasResponse: !!lastInboundEmail,
        hasButtonConfirmation: !!request.buttonConfirmedAt,
        escalationLevel: lastInboundEmail?.recommendations?.escalation_level,
        previousDecisions,
        evidence: evidenceAnalysis
      };

      return context;

    } catch (error) {
      console.error(`Error building decision context for request ${requestId}:`, error);
      return null;
    }
  }

  /**
   * Применение правил принятия решений
   */
  private async applyDecisionRules(context: DecisionContext): Promise<{
    type: DecisionType;
    reason: string;
    metadata: DecisionMetadata;
    confidence: number;
    autoExecute: boolean;
  }> {
    console.log(`📋 Applying decision rules to request ${context.request.id}`);

    // Проходим по правилам в порядке приоритета
    for (const rule of this.decisionRules) {
      try {
        if (rule.condition(context)) {
          console.log(`✓ Rule triggered: ${rule.name} -> ${rule.decision}`);

          const metadata: DecisionMetadata = {
            triggeredByAnalysis: !!context.lastInboundEmail,
            analysisScore: context.legitimacyScore,
            analysisViolations: context.violations,
            triggerRules: [rule.name],
            manualOverride: false,
            executionTimestamp: new Date().toISOString(),
            estimatedResolutionDays: rule.estimatedDays,
            escalationLevel: rule.escalationLevel,
            aiAnalysisUsed: !!context.lastInboundEmail?.analysisMetadata?.ai_analysis_used,
            ruleConfidence: rule.confidence,
            requestAge: context.requestAgeInDays,
            operatorEmail: context.request.operatorEmail || undefined,
            responsePattern: context.responseType
          };

          return {
            type: rule.decision,
            reason: rule.reason,
            metadata,
            confidence: rule.confidence,
            autoExecute: rule.autoExecute && rule.confidence >= this.thresholds.MIN_CONFIDENCE
          };
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.name}:`, error);
        continue;
      }
    }

    // Fallback: если ни одно правило не сработало
    console.log(`⚠️ No specific rule matched, defaulting to manual review`);
    
    const fallbackMetadata: DecisionMetadata = {
      triggeredByAnalysis: !!context.lastInboundEmail,
      analysisScore: context.legitimacyScore,
      analysisViolations: context.violations,
      triggerRules: ['FALLBACK_MANUAL_REVIEW'],
      manualOverride: false,
      executionTimestamp: new Date().toISOString(),
      estimatedResolutionDays: 7,
      escalationLevel: 'medium',
      aiAnalysisUsed: !!context.lastInboundEmail?.analysisMetadata?.ai_analysis_used,
      ruleConfidence: 50,
      requestAge: context.requestAgeInDays,
      operatorEmail: context.request.operatorEmail || undefined,
      responsePattern: context.responseType
    };

    return {
      type: 'MANUAL_REVIEW_REQUIRED',
      reason: 'Ситуация требует ручной проверки - не подходит под стандартные правила',
      metadata: fallbackMetadata,
      confidence: 50,
      autoExecute: false
    };
  }

  /**
   * Сохранение решения в базе данных
   */
  private async saveDecision(
    requestId: string, 
    decision: {
      type: DecisionType;
      reason: string;
      metadata: DecisionMetadata;
      confidence: number;
      autoExecute: boolean;
    },
    context: DecisionContext,
    idempotencyKey: string
  ): Promise<void> {
    try {
      await storage.updateDeletionRequest(requestId, {
        decisionType: decision.type,
        decisionReason: decision.reason,
        decisionMetadata: decision.metadata,
        autoProcessed: decision.autoExecute,
        decisionMadeAt: new Date(),
        decisionIdempotencyKey: idempotencyKey, // САЗПД критично: сохраняем idempotency key
        lastInboundEmailId: context.lastInboundEmail?.id || null
      });

      console.log(`💾 Decision saved for request ${requestId}: ${decision.type} (auto: ${decision.autoExecute}) key: ${idempotencyKey.slice(0, 8)}...`);
    } catch (error) {
      console.error(`Error saving decision for request ${requestId}:`, error);
      throw error;
    }
  }

  /**
   * САЗПД: Генерация idempotency key для предотвращения дублирования решений
   */
  private generateIdempotencyKey(requestId: string, context: DecisionContext): string {
    const crypto = require('crypto');
    
    // Создаем детерминированный ключ на основе:
    // - ID запроса
    // - Состояния запроса (статус, последний email)
    // - Контекста анализа (violations, score, response type)
    // - Временного окна (день) для предотвращения бесконечного дублирования
    
    const keyComponents = {
      requestId,
      status: context.request.status,
      lastInboundEmailId: context.lastInboundEmail?.id || 'none',
      responseType: context.responseType || 'none',
      legitimacyScore: Math.round(context.legitimacyScore || 0),
      violations: (context.violations || []).sort().join(','), // сортируем для детерминированности
      requestAgeInDays: Math.floor(context.requestAgeInDays), // день, не часы/минуты
      evidenceChainLength: context.evidence.chainLength,
      evidenceTypes: context.evidence.types.sort().join(','),
      // Добавляем день для перерасчета решений если контекст остается неизменным долго
      dayBucket: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    
    // Используем SHA-256 для генерации детерминированного UUID-подобного ключа
    const keyString = JSON.stringify(keyComponents);
    const hash = crypto.createHash('sha256').update(keyString).digest('hex');
    
    // Форматируем как UUID для читаемости
    const idempotencyKey = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
    
    console.log(`🔑 Generated idempotency key for request ${requestId}: ${idempotencyKey.slice(0, 16)}... (components: ${Object.keys(keyComponents).join(', ')})`);
    
    return idempotencyKey;
  }

  /**
   * Получение статистики решений для мониторинга
   */
  async getDecisionStats(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<{
    totalDecisions: number;
    autoExecuted: number;
    manualReview: number;
    decisionsByType: Record<string, number>;
    averageConfidence: number;
    escalationRate: number;
  }> {
    try {
      // Получаем все запросы с решениями за период
      const requests = await storage.getDeletionRequests({});
      
      const now = new Date();
      const timeframeDays = timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : 30;
      const startDate = new Date(now.getTime() - timeframeDays * 24 * 60 * 60 * 1000);

      const recentDecisions = requests.filter(r => 
        r.decisionMadeAt && new Date(r.decisionMadeAt) >= startDate
      );

      const stats = {
        totalDecisions: recentDecisions.length,
        autoExecuted: recentDecisions.filter(r => r.autoProcessed).length,
        manualReview: recentDecisions.filter(r => r.decisionType === 'MANUAL_REVIEW_REQUIRED').length,
        decisionsByType: {} as Record<string, number>,
        averageConfidence: 0,
        escalationRate: 0
      };

      // Подсчет по типам решений
      recentDecisions.forEach(r => {
        if (r.decisionType) {
          stats.decisionsByType[r.decisionType] = (stats.decisionsByType[r.decisionType] || 0) + 1;
        }
      });

      // Средняя уверенность
      const confidences = recentDecisions
        .map(r => (r.decisionMetadata as DecisionMetadata)?.ruleConfidence)
        .filter(c => c !== undefined);
      
      stats.averageConfidence = confidences.length > 0 
        ? confidences.reduce((a, b) => a + b, 0) / confidences.length 
        : 0;

      // Частота эскалаций
      const escalations = recentDecisions.filter(r => 
        r.decisionType === 'ESCALATE_TO_RKN' || r.decisionType === 'IMMEDIATE_ESCALATION'
      ).length;
      
      stats.escalationRate = stats.totalDecisions > 0 ? (escalations / stats.totalDecisions) * 100 : 0;

      return stats;

    } catch (error) {
      console.error('Error getting decision stats:', error);
      throw error;
    }
  }

  /**
   * Получение метрик системы принятия решений
   */
  async getDecisionMetrics(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<{
    totalDecisions: number;
    automatedDecisions: number;
    manualOverrides: number;
    averageConfidence: number;
    decisionsByType: Record<DecisionType, number>;
    successRate: number;
    averageResolutionTime: number;
    escalationRate: number;
  }> {
    try {
      const endDate = new Date();
      let startDate = new Date();
      
      switch (timeframe) {
        case 'day':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
      }

      const requests = await this.storage.getDeletionRequests({});
      const decisionsInTimeframe = requests.filter(r => 
        r.decisionMadeAt && 
        r.decisionMadeAt >= startDate && 
        r.decisionMadeAt <= endDate
      );

      const totalDecisions = decisionsInTimeframe.length;
      const automatedDecisions = decisionsInTimeframe.filter(r => r.autoProcessed).length;
      const manualOverrides = decisionsInTimeframe.filter(r => 
        r.decisionMetadata && typeof r.decisionMetadata === 'object' && 
        (r.decisionMetadata as any).manualOverride
      ).length;

      const confidenceScores = decisionsInTimeframe
        .map(r => r.decisionMetadata && typeof r.decisionMetadata === 'object' ? (r.decisionMetadata as any).ruleConfidence : null)
        .filter(c => typeof c === 'number' && !isNaN(c));
      
      const averageConfidence = confidenceScores.length > 0 
        ? confidenceScores.reduce((sum, c) => sum + c, 0) / confidenceScores.length 
        : 0;

      const decisionsByType = decisionsInTimeframe.reduce((acc, r) => {
        if (r.decisionType) {
          acc[r.decisionType as DecisionType] = (acc[r.decisionType as DecisionType] || 0) + 1;
        }
        return acc;
      }, {} as Record<DecisionType, number>);

      const completedRequests = decisionsInTimeframe.filter(r => r.campaignStatus === 'completed').length;
      const successRate = totalDecisions > 0 ? (completedRequests / totalDecisions) * 100 : 0;

      const resolvedRequests = decisionsInTimeframe.filter(r => r.completedAt);
      const averageResolutionTime = resolvedRequests.length > 0
        ? resolvedRequests.reduce((sum, r) => {
            const start = r.campaignStartedAt || r.createdAt;
            const end = r.completedAt!;
            return sum + (end.getTime() - start!.getTime());
          }, 0) / resolvedRequests.length / (1000 * 60 * 60 * 24)
        : 0;

      const escalatedRequests = decisionsInTimeframe.filter(r => r.campaignStatus === 'escalated').length;
      const escalationRate = totalDecisions > 0 ? (escalatedRequests / totalDecisions) * 100 : 0;

      return {
        totalDecisions,
        automatedDecisions,
        manualOverrides,
        averageConfidence,
        decisionsByType,
        successRate,
        averageResolutionTime,
        escalationRate
      };
    } catch (error) {
      console.error('Error getting decision metrics:', error);
      return {
        totalDecisions: 0,
        automatedDecisions: 0,
        manualOverrides: 0,
        averageConfidence: 0,
        decisionsByType: {} as Record<DecisionType, number>,
        successRate: 0,
        averageResolutionTime: 0,
        escalationRate: 0
      };
    }
  }

  /**
   * Анализ уверенности в принятых решениях
   */
  async getConfidenceAnalysis(decisionType?: DecisionType): Promise<{
    overallConfidence: number;
    confidenceDistribution: {
      high: number;
      medium: number;
      low: number;
    };
    factorsAnalysis: {
      evidenceQuality: number;
      legalCertainty: number;
      operatorCompliance: number;
      timeConstraints: number;
    };
    recommendationsForImprovement: string[];
  }> {
    try {
      const requests = await this.storage.getDeletionRequests({});
      
      let filteredRequests = requests.filter(r => 
        r.decisionMadeAt && 
        r.decisionMetadata && 
        typeof r.decisionMetadata === 'object'
      );

      if (decisionType) {
        filteredRequests = filteredRequests.filter(r => r.decisionType === decisionType);
      }

      const confidenceScores = filteredRequests
        .map(r => (r.decisionMetadata as any)?.ruleConfidence)
        .filter(c => typeof c === 'number' && !isNaN(c));

      const overallConfidence = confidenceScores.length > 0 
        ? confidenceScores.reduce((sum, c) => sum + c, 0) / confidenceScores.length 
        : 0;

      const highConfidence = confidenceScores.filter(c => c >= 80).length;
      const mediumConfidence = confidenceScores.filter(c => c >= 50 && c < 80).length;
      const lowConfidence = confidenceScores.filter(c => c < 50).length;

      const total = confidenceScores.length || 1;
      const confidenceDistribution = {
        high: (highConfidence / total) * 100,
        medium: (mediumConfidence / total) * 100,
        low: (lowConfidence / total) * 100
      };

      const factorsAnalysis = {
        evidenceQuality: Math.min(95, overallConfidence + 10),
        legalCertainty: Math.min(90, overallConfidence + 5),
        operatorCompliance: Math.max(30, overallConfidence - 15),
        timeConstraints: Math.max(40, overallConfidence - 10)
      };

      const recommendationsForImprovement: string[] = [];
      
      if (overallConfidence < 70) {
        recommendationsForImprovement.push("Improve evidence collection quality and completeness");
      }
      if (factorsAnalysis.legalCertainty < 80) {
        recommendationsForImprovement.push("Enhance legal knowledge base with more specific cases");
      }
      if (factorsAnalysis.operatorCompliance < 60) {
        recommendationsForImprovement.push("Develop better operator behavior prediction models");
      }
      if (confidenceDistribution.low > 25) {
        recommendationsForImprovement.push("Review and strengthen decision rules for edge cases");
      }

      return {
        overallConfidence,
        confidenceDistribution,
        factorsAnalysis,
        recommendationsForImprovement
      };
    } catch (error) {
      console.error('Error getting confidence analysis:', error);
      return {
        overallConfidence: 0,
        confidenceDistribution: { high: 0, medium: 0, low: 0 },
        factorsAnalysis: { evidenceQuality: 0, legalCertainty: 0, operatorCompliance: 0, timeConstraints: 0 },
        recommendationsForImprovement: ["Unable to analyze confidence - check system health"]
      };
    }
  }
}

// Singleton export - will be initialized with storage when first called
// Note: storage must be provided on first getInstance() call
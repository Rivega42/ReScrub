import { storage } from './storage';
import { DocumentGenerator } from './document-generator';
import { ResponseAnalyzer } from './response-analyzer';
import { DecisionEngine } from './decision-engine';
import { EvidenceCollector } from './evidence-collector';
import { createLegalKnowledgeBase, type LegalKnowledgeBase } from './legal-knowledge-base';
import type { IStorage } from './storage';
import type { 
  DeletionRequest, 
  InsertDeletionRequest,
  CampaignStatus,
  CampaignStatusEnum,
  NextAction,
  NextActionEnum,
  MilestoneType,
  MilestoneTypeEnum,
  DocumentType,
  ResponseType,
  ViolationType,
  EvidenceType
} from '@shared/schema';

/**
 * Результат создания кампании
 */
export interface CampaignCreationResult {
  success: boolean;
  error?: string;
  campaign?: DeletionRequest;
  campaignId?: string;
  initialActions?: string[];
}

/**
 * Статус кампании с подробной информацией
 */
export interface CampaignStatusDetails {
  success: boolean;
  error?: string;
  campaign?: DeletionRequest;
  status?: {
    currentStatus: CampaignStatus;
    completionRate: number;
    escalationLevel: number;
    totalDocuments: number;
    nextAction?: NextAction;
    nextActionDue?: Date;
    lastActivity?: Date;
    milestones: any[];
    metrics: any;
    timeline: any[];
  };
}

/**
 * Результат обновления прогресса кампании
 */
export interface CampaignProgressResult {
  success: boolean;
  error?: string;
  campaign?: DeletionRequest;
  statusChanged?: boolean;
  newStatus?: CampaignStatus;
  actionsTriggered?: string[];
  nextScheduledAction?: {
    action: NextAction;
    scheduledAt: Date;
    reason: string;
  };
}

/**
 * Метрики эффективности кампаний
 */
export interface CampaignEfficiencyMetrics {
  success: boolean;
  error?: string;
  metrics?: {
    // Общие метрики
    totalCampaigns: number;
    activeCampaigns: number;
    completedCampaigns: number;
    
    // Эффективность
    successRate: number; // % успешно завершенных кампаний
    averageCompletionTime: number; // среднее время завершения в днях
    escalationRate: number; // % кампаний, требующих эскалации
    
    // Операторы
    operatorComplianceRates: Record<string, {
      totalRequests: number;
      successfulResponses: number;
      averageResponseTime: number;
      complianceScore: number;
    }>;
    
    // Тенденции
    weeklyTrends: {
      week: string;
      started: number;
      completed: number;
      escalated: number;
    }[];
    
    // Проблемные области
    problematicOperators: string[];
    commonIssues: string[];
    
    // Прогнозы
    predictedCompletionDates: Record<string, Date>;
    riskFactors: string[];
  };
}

/**
 * Контекст автоматизации кампании
 */
export interface CampaignAutomationContext {
  campaign: DeletionRequest;
  currentMilestones: any[];
  lastResponse?: any;
  operatorHistory?: any;
  legalContext?: any;
  timeConstraints?: {
    responseDeadline?: Date;
    escalationDeadline?: Date;
    legalDeadline?: Date;
  };
}

/**
 * Campaign Manager Service для полноценного управления кампаниями защиты данных
 * 
 * Основные функции:
 * - Автоматическое создание кампаний на основе deletion_requests
 * - Отслеживание жизненного цикла кампании через статусы
 * - Интеграция с Document Generation, Response Analysis, Decision Engine, Evidence Collection
 * - Автоматизация переходов между этапами
 * - Планирование и выполнение следующих действий
 * - Мониторинг эффективности кампаний
 * - Эскалация при застое или проблемах
 */
export class CampaignManager {
  private static instance: CampaignManager;
  private readonly campaignVersion = "1.0.0";
  
  // Интеграция с САЗПД модулями
  private documentGenerator: DocumentGenerator;
  private responseAnalyzer: ResponseAnalyzer;
  private decisionEngine: DecisionEngine;
  private evidenceCollector: EvidenceCollector;
  private legalKnowledgeBase: LegalKnowledgeBase;
  
  // Временные интервалы для автоматизации (в миллисекундах)
  private readonly AUTOMATION_CHECK_INTERVAL = 30 * 60 * 1000; // 30 минут
  private readonly DEFAULT_RESPONSE_DEADLINE_DAYS = 30; // 30 дней согласно ФЗ-152
  private readonly DEFAULT_FOLLOWUP_DAYS = 30; // 30 дней до повторного обращения
  private readonly DEFAULT_ESCALATION_DAYS = 60; // 60 дней до эскалации в РКН
  
  // Автоматизация
  private automationIntervalId?: NodeJS.Timeout;
  private isAutomationRunning = false;

  private constructor(storage: IStorage) {
    this.documentGenerator = DocumentGenerator.getInstance();
    this.responseAnalyzer = ResponseAnalyzer.getInstance(storage);
    this.decisionEngine = DecisionEngine.getInstance();
    this.evidenceCollector = new EvidenceCollector(storage);
    this.legalKnowledgeBase = createLegalKnowledgeBase(storage);
  }

  static getInstance(storage?: IStorage): CampaignManager {
    if (!CampaignManager.instance) {
      if (!storage) {
        throw new Error('Storage is required for CampaignManager initialization');
      }
      CampaignManager.instance = new CampaignManager(storage);
    }
    return CampaignManager.instance;
  }

  /**
   * Создание новой кампании на основе deletion_request
   */
  async createCampaign(
    deletionRequestData: Partial<InsertDeletionRequest>,
    autoStart = true
  ): Promise<CampaignCreationResult> {
    try {
      console.log(`🚀 Creating campaign for deletion request: ${deletionRequestData.brokerName}`);
      
      // Создаем deletion_request с полями кампании
      const now = new Date();
      const campaignData: Partial<InsertDeletionRequest> = {
        ...deletionRequestData,
        
        // Инициализация полей кампании
        campaignStatus: 'started',
        campaignStartedAt: now,
        lastActionAt: now,
        completionRate: 0,
        escalationLevel: 0,
        totalDocuments: 0,
        isAutomated: autoStart,
        automationPaused: false,
        campaignQualityScore: 100, // начинаем с максимального качества
        
        // Устанавливаем следующее действие
        nextScheduledAction: 'send_initial_document',
        nextScheduledActionAt: new Date(now.getTime() + 5 * 60 * 1000), // через 5 минут
        
        // Инициализируем первую веху
        milestones: [{
          type: 'campaign_started',
          timestamp: now.toISOString(),
          status: 'completed',
          metadata: {
            campaignVersion: this.campaignVersion,
            brokerName: deletionRequestData.brokerName,
            automated: autoStart
          }
        }]
      };

      // Создаем кампанию через storage
      const campaign = await storage.createDeletionRequest(campaignData as InsertDeletionRequest);
      
      if (!campaign) {
        return {
          success: false,
          error: 'Failed to create campaign in database'
        };
      }

      console.log(`✅ Campaign created successfully: ${campaign.id}`);

      // Собираем доказательства о создании кампании
      await this.evidenceCollector.collectEvidence(
        campaign.id,
        'DECISION_ENGINE_ACTION',
        {
          title: 'Campaign Creation',
          description: 'Новая кампания защиты данных создана',
          content: {
            campaignId: campaign.id,
            brokerName: campaign.brokerName,
            userId: campaign.userId,
            automation: autoStart
          },
          sourceType: 'system',
          originalTimestamp: now,
          collectionTimestamp: now
        }
      );

      const initialActions: string[] = [];

      // Автоматический запуск если требуется
      if (autoStart) {
        const startResult = await this.startCampaignAutomation(campaign.id);
        if (startResult.success) {
          initialActions.push('automation_started');
        }
      }

      return {
        success: true,
        campaign,
        campaignId: campaign.id,
        initialActions
      };
      
    } catch (error) {
      console.error('❌ Error creating campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Получение статуса кампании с подробной информацией
   */
  async getCampaignStatus(campaignId: string): Promise<CampaignStatusDetails> {
    try {
      const campaign = await storage.getDeletionRequestById(campaignId);
      
      if (!campaign) {
        return {
          success: false,
          error: 'Campaign not found'
        };
      }

      // Строим timeline кампании из вех
      const milestones = Array.isArray(campaign.milestones) ? campaign.milestones : [];
      const timeline = milestones.map((milestone: any) => ({
        type: milestone.type,
        timestamp: milestone.timestamp,
        status: milestone.status,
        description: this.getMilestoneDescription(milestone.type),
        metadata: milestone.metadata || {}
      })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      return {
        success: true,
        campaign,
        status: {
          currentStatus: campaign.campaignStatus as CampaignStatus || 'started',
          completionRate: campaign.completionRate || 0,
          escalationLevel: campaign.escalationLevel || 0,
          totalDocuments: campaign.totalDocuments || 0,
          nextAction: campaign.nextScheduledAction as NextAction,
          nextActionDue: campaign.nextScheduledActionAt || undefined,
          lastActivity: campaign.lastActionAt || undefined,
          milestones: milestones,
          metrics: campaign.campaignMetrics || {},
          timeline
        }
      };
      
    } catch (error) {
      console.error('❌ Error getting campaign status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Обновление прогресса кампании
   */
  async updateCampaignProgress(
    campaignId: string,
    newStatus?: CampaignStatus,
    milestone?: {
      type: MilestoneType;
      metadata?: any;
    },
    metrics?: Partial<any>
  ): Promise<CampaignProgressResult> {
    try {
      console.log(`📊 Updating campaign progress: ${campaignId}, status: ${newStatus}`);
      
      const campaign = await storage.getDeletionRequestById(campaignId);
      if (!campaign) {
        return {
          success: false,
          error: 'Campaign not found'
        };
      }

      const now = new Date();
      const updates: Partial<DeletionRequest> = {
        lastActionAt: now,
        updatedAt: now
      };

      let statusChanged = false;
      let actionsTriggered: string[] = [];

      // Обновление статуса
      if (newStatus && newStatus !== campaign.campaignStatus) {
        updates.campaignStatus = newStatus;
        statusChanged = true;
        actionsTriggered.push(`status_changed_to_${newStatus}`);
        
        // Обновляем процент завершенности на основе статуса
        updates.completionRate = this.calculateCompletionRate(newStatus);
      }

      // Добавление новой вехи
      if (milestone) {
        const currentMilestones = Array.isArray(campaign.milestones) ? campaign.milestones : [];
        const newMilestone = {
          type: milestone.type,
          timestamp: now.toISOString(),
          status: 'completed',
          metadata: milestone.metadata || {}
        };
        
        updates.milestones = [...currentMilestones, newMilestone];
        actionsTriggered.push(`milestone_added_${milestone.type}`);
      }

      // Обновление метрик
      if (metrics) {
        const currentMetrics = campaign.campaignMetrics as any || {};
        updates.campaignMetrics = {
          ...currentMetrics,
          ...metrics
        };
      }

      // Планирование следующего действия
      const nextAction = await this.planNextAction(campaign, newStatus);
      if (nextAction) {
        updates.nextScheduledAction = nextAction.action;
        updates.nextScheduledActionAt = nextAction.scheduledAt;
        actionsTriggered.push(`next_action_scheduled_${nextAction.action}`);
      }

      // Сохраняем обновления
      const updatedCampaign = await storage.updateDeletionRequest(campaignId, updates);
      
      if (!updatedCampaign) {
        return {
          success: false,
          error: 'Failed to update campaign'
        };
      }

      // Собираем доказательства об обновлении
      await this.evidenceCollector.collectEvidence(
        campaignId,
        'DECISION_ENGINE_ACTION',
        {
          title: 'Campaign Progress Update',
          description: 'Обновлен прогресс кампании',
          content: {
            oldStatus: campaign.campaignStatus,
            newStatus: newStatus,
            milestone: milestone,
            metrics: metrics,
            actionsTriggered
          },
          sourceType: 'system',
          originalTimestamp: now,
          collectionTimestamp: now
        }
      );

      console.log(`✅ Campaign progress updated: ${campaignId}, actions: ${actionsTriggered.join(', ')}`);

      return {
        success: true,
        campaign: updatedCampaign,
        statusChanged,
        newStatus: newStatus,
        actionsTriggered,
        nextScheduledAction: nextAction ? {
          action: nextAction.action,
          scheduledAt: nextAction.scheduledAt,
          reason: nextAction.reason
        } : undefined
      };
      
    } catch (error) {
      console.error('❌ Error updating campaign progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Получение метрик эффективности кампаний
   */
  async getCampaignEfficiencyMetrics(): Promise<CampaignEfficiencyMetrics> {
    try {
      console.log('📈 Calculating campaign efficiency metrics...');
      
      // Получаем все кампании
      const allCampaigns = await storage.getDeletionRequests();
      
      if (!allCampaigns || allCampaigns.length === 0) {
        return {
          success: true,
          metrics: {
            totalCampaigns: 0,
            activeCampaigns: 0,
            completedCampaigns: 0,
            successRate: 0,
            averageCompletionTime: 0,
            escalationRate: 0,
            operatorComplianceRates: {},
            weeklyTrends: [],
            problematicOperators: [],
            commonIssues: [],
            predictedCompletionDates: {},
            riskFactors: []
          }
        };
      }

      // Базовые метрики
      const totalCampaigns = allCampaigns.length;
      const activeCampaigns = allCampaigns.filter(c => 
        ['started', 'documents_sent', 'awaiting_response', 'analyzing_response', 'taking_action'].includes(c.campaignStatus || '')
      ).length;
      const completedCampaigns = allCampaigns.filter(c => c.campaignStatus === 'completed').length;
      const escalatedCampaigns = allCampaigns.filter(c => c.campaignStatus === 'escalated').length;

      // Эффективность
      const successRate = totalCampaigns > 0 ? (completedCampaigns / totalCampaigns) * 100 : 0;
      const escalationRate = totalCampaigns > 0 ? (escalatedCampaigns / totalCampaigns) * 100 : 0;

      // Среднее время завершения
      const completedWithTime = allCampaigns.filter(c => 
        c.campaignStatus === 'completed' && c.campaignStartedAt && c.completedAt
      );
      const averageCompletionTime = completedWithTime.length > 0 
        ? completedWithTime.reduce((sum, c) => {
            const start = new Date(c.campaignStartedAt!).getTime();
            const end = new Date(c.completedAt!).getTime();
            return sum + (end - start) / (1000 * 60 * 60 * 24); // дни
          }, 0) / completedWithTime.length
        : 0;

      // Анализ по операторам
      const operatorStats: Record<string, any> = {};
      allCampaigns.forEach(campaign => {
        const operatorName = campaign.brokerName;
        if (!operatorStats[operatorName]) {
          operatorStats[operatorName] = {
            totalRequests: 0,
            successfulResponses: 0,
            responseTimeSum: 0,
            responseCount: 0
          };
        }
        
        operatorStats[operatorName].totalRequests++;
        
        if (campaign.campaignStatus === 'completed') {
          operatorStats[operatorName].successfulResponses++;
        }
        
        // Расчет времени ответа если есть данные
        if (campaign.campaignStartedAt && campaign.lastInboundAt) {
          const responseTime = new Date(campaign.lastInboundAt).getTime() - new Date(campaign.campaignStartedAt).getTime();
          operatorStats[operatorName].responseTimeSum += responseTime / (1000 * 60 * 60 * 24); // дни
          operatorStats[operatorName].responseCount++;
        }
      });

      // Преобразуем статистику операторов
      const operatorComplianceRates: Record<string, any> = {};
      Object.entries(operatorStats).forEach(([operatorName, stats]: [string, any]) => {
        operatorComplianceRates[operatorName] = {
          totalRequests: stats.totalRequests,
          successfulResponses: stats.successfulResponses,
          averageResponseTime: stats.responseCount > 0 ? stats.responseTimeSum / stats.responseCount : 0,
          complianceScore: stats.totalRequests > 0 ? (stats.successfulResponses / stats.totalRequests) * 100 : 0
        };
      });

      // Выявление проблемных операторов
      const problematicOperators = Object.entries(operatorComplianceRates)
        .filter(([_, stats]: [string, any]) => stats.complianceScore < 50 && stats.totalRequests >= 3)
        .map(([operatorName]) => operatorName);

      // Недельные тенденции (последние 8 недель)
      const weeklyTrends = this.calculateWeeklyTrends(allCampaigns);

      // Общие проблемы
      const commonIssues = this.identifyCommonIssues(allCampaigns);

      // Прогнозы завершения для активных кампаний
      const predictedCompletionDates = this.predictCompletionDates(
        allCampaigns.filter(c => activeCampaigns > 0),
        averageCompletionTime
      );

      // Факторы риска
      const riskFactors = this.identifyRiskFactors(allCampaigns, operatorComplianceRates);

      return {
        success: true,
        metrics: {
          totalCampaigns,
          activeCampaigns,
          completedCampaigns,
          successRate,
          averageCompletionTime,
          escalationRate,
          operatorComplianceRates,
          weeklyTrends,
          problematicOperators,
          commonIssues,
          predictedCompletionDates,
          riskFactors
        }
      };
      
    } catch (error) {
      console.error('❌ Error calculating campaign efficiency metrics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Запуск автоматизации кампании
   */
  async startCampaignAutomation(campaignId: string): Promise<CampaignProgressResult> {
    try {
      console.log(`🤖 Starting campaign automation: ${campaignId}`);
      
      const campaign = await storage.getDeletionRequestById(campaignId);
      if (!campaign) {
        return {
          success: false,
          error: 'Campaign not found'
        };
      }

      // Проверяем, что автоматизация не приостановлена
      if (campaign.automationPaused) {
        return {
          success: false,
          error: 'Campaign automation is paused'
        };
      }

      // Выполняем начальное действие в зависимости от статуса
      return await this.executeNextAction(campaignId);
      
    } catch (error) {
      console.error('❌ Error starting campaign automation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Выполнение следующего запланированного действия
   */
  async executeNextAction(campaignId: string): Promise<CampaignProgressResult> {
    try {
      const campaign = await storage.getDeletionRequestById(campaignId);
      if (!campaign) {
        return {
          success: false,
          error: 'Campaign not found'
        };
      }

      const nextAction = campaign.nextScheduledAction as NextAction;
      if (!nextAction) {
        return {
          success: false,
          error: 'No scheduled action for campaign'
        };
      }

      console.log(`⚡ Executing action: ${nextAction} for campaign: ${campaignId}`);

      let result: CampaignProgressResult;

      switch (nextAction) {
        case 'send_followup':
          result = await this.executeSendFollowup(campaign);
          break;
        case 'escalate_to_rkn':
          result = await this.executeEscalateToRkn(campaign);
          break;
        case 'request_clarification':
          result = await this.executeRequestClarification(campaign);
          break;
        case 'close_campaign':
          result = await this.executeCloseCampaign(campaign);
          break;
        case 'await_response':
          result = await this.executeAwaitResponse(campaign);
          break;
        case 'analyze_response':
          result = await this.executeAnalyzeResponse(campaign);
          break;
        case 'collect_evidence':
          result = await this.executeCollectEvidence(campaign);
          break;
        default:
          return {
            success: false,
            error: `Unknown action: ${nextAction}`
          };
      }

      // Записываем выполнение действия как веху
      if (result.success) {
        await this.updateCampaignProgress(
          campaignId,
          undefined,
          {
            type: 'decision_made' as MilestoneType,
            metadata: {
              action: nextAction,
              result: result.actionsTriggered || []
            }
          }
        );
      }

      return result;
      
    } catch (error) {
      console.error('❌ Error executing next action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Запуск глобального мониторинга кампаний
   */
  startGlobalAutomation(): void {
    if (this.isAutomationRunning) {
      console.log('🤖 Campaign automation is already running');
      return;
    }

    console.log('🚀 Starting global campaign automation...');
    this.isAutomationRunning = true;

    // Сразу запускаем первую проверку
    this.processAllCampaigns().catch(console.error);

    // Настраиваем периодическую проверку
    this.automationIntervalId = setInterval(async () => {
      try {
        await this.processAllCampaigns();
      } catch (error) {
        console.error('❌ Error in global campaign automation:', error);
      }
    }, this.AUTOMATION_CHECK_INTERVAL);

    console.log(`✅ Global campaign automation started (checking every ${this.AUTOMATION_CHECK_INTERVAL / 60000} minutes)`);
  }

  /**
   * Остановка глобального мониторинга кампаний
   */
  stopGlobalAutomation(): void {
    if (this.automationIntervalId) {
      clearInterval(this.automationIntervalId);
      this.automationIntervalId = undefined;
    }
    this.isAutomationRunning = false;
    console.log('🛑 Global campaign automation stopped');
  }

  /**
   * Обработка всех активных кампаний
   */
  private async processAllCampaigns(): Promise<void> {
    try {
      console.log('🔄 Processing all active campaigns...');
      
      // Получаем все активные кампании
      const activeCampaigns = await storage.getDeletionRequests({
        status: undefined // получаем все, фильтруем локально
      });

      if (!activeCampaigns || activeCampaigns.length === 0) {
        console.log('📭 No campaigns to process');
        return;
      }

      // Фильтруем только активные кампании с автоматизацией
      const campaignsToProcess = activeCampaigns.filter(campaign => 
        campaign.isAutomated && 
        !campaign.automationPaused &&
        ['started', 'documents_sent', 'awaiting_response', 'analyzing_response', 'taking_action'].includes(campaign.campaignStatus || '') &&
        campaign.nextScheduledActionAt &&
        new Date(campaign.nextScheduledActionAt) <= new Date()
      );

      console.log(`📊 Found ${campaignsToProcess.length} campaigns ready for processing`);

      // Обрабатываем каждую кампанию
      for (const campaign of campaignsToProcess) {
        try {
          console.log(`🔄 Processing campaign: ${campaign.id}`);
          const result = await this.executeNextAction(campaign.id);
          
          if (!result.success) {
            console.log(`⚠️ Failed to process campaign ${campaign.id}: ${result.error}`);
          } else {
            console.log(`✅ Successfully processed campaign ${campaign.id}, actions: ${result.actionsTriggered?.join(', ')}`);
          }
        } catch (error) {
          console.error(`❌ Error processing campaign ${campaign.id}:`, error);
        }
      }

      console.log('✅ Finished processing all campaigns');
      
    } catch (error) {
      console.error('❌ Error in processAllCampaigns:', error);
    }
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  /**
   * Расчет процента завершенности на основе статуса
   */
  private calculateCompletionRate(status: CampaignStatus): number {
    const statusRates: Record<CampaignStatus, number> = {
      'started': 10,
      'documents_sent': 30,
      'awaiting_response': 50,
      'analyzing_response': 70,
      'taking_action': 80,
      'completed': 100,
      'escalated': 100,
      'failed': 0,
      'paused': 0,
      'cancelled': 0
    };
    
    return statusRates[status] || 0;
  }

  /**
   * Планирование следующего действия для кампании
   */
  private async planNextAction(
    campaign: DeletionRequest,
    newStatus?: CampaignStatus
  ): Promise<{ action: NextAction; scheduledAt: Date; reason: string } | null> {
    const currentStatus = newStatus || campaign.campaignStatus as CampaignStatus;
    const now = new Date();

    switch (currentStatus) {
      case 'started':
        return {
          action: 'send_followup', // начальный документ
          scheduledAt: new Date(now.getTime() + 5 * 60 * 1000), // через 5 минут
          reason: 'Send initial deletion request document'
        };

      case 'documents_sent':
        return {
          action: 'await_response',
          scheduledAt: new Date(now.getTime() + this.DEFAULT_RESPONSE_DEADLINE_DAYS * 24 * 60 * 60 * 1000),
          reason: 'Wait for operator response within legal deadline'
        };

      case 'awaiting_response':
        // Проверяем, не истек ли срок ответа
        const responseDeadline = campaign.responseDeadlineAt || new Date(now.getTime() + this.DEFAULT_RESPONSE_DEADLINE_DAYS * 24 * 60 * 60 * 1000);
        if (now > responseDeadline) {
          return {
            action: 'send_followup',
            scheduledAt: new Date(now.getTime() + 1 * 60 * 60 * 1000), // через час
            reason: 'Response deadline exceeded, send follow-up'
          };
        }
        break;

      case 'analyzing_response':
        return {
          action: 'analyze_response',
          scheduledAt: new Date(now.getTime() + 10 * 60 * 1000), // через 10 минут
          reason: 'Analyze received response for compliance'
        };

      case 'taking_action':
        return {
          action: 'collect_evidence',
          scheduledAt: new Date(now.getTime() + 30 * 60 * 1000), // через 30 минут
          reason: 'Collect evidence and determine next steps'
        };
    }

    return null;
  }

  /**
   * Получение описания вехи
   */
  private getMilestoneDescription(milestoneType: string): string {
    const descriptions: Record<string, string> = {
      'campaign_started': 'Кампания запущена',
      'initial_document_sent': 'Отправлен начальный документ',
      'response_received': 'Получен ответ от оператора',
      'followup_sent': 'Отправлено повторное обращение',
      'escalation_initiated': 'Инициирована эскалация',
      'evidence_collected': 'Собраны доказательства',
      'decision_made': 'Принято решение',
      'campaign_completed': 'Кампания завершена',
      'deadline_reached': 'Достигнут дедлайн',
      'automation_paused': 'Автоматизация приостановлена',
      'manual_intervention': 'Ручное вмешательство'
    };
    
    return descriptions[milestoneType] || milestoneType;
  }

  /**
   * Расчет недельных тенденций
   */
  private calculateWeeklyTrends(campaigns: DeletionRequest[]): any[] {
    const weeks: any[] = [];
    const now = new Date();
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const weekCampaigns = campaigns.filter(c => {
        const createdAt = c.campaignStartedAt ? new Date(c.campaignStartedAt) : new Date(c.createdAt);
        return createdAt >= weekStart && createdAt < weekEnd;
      });
      
      weeks.push({
        week: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
        started: weekCampaigns.length,
        completed: weekCampaigns.filter(c => c.campaignStatus === 'completed').length,
        escalated: weekCampaigns.filter(c => c.campaignStatus === 'escalated').length
      });
    }
    
    return weeks;
  }

  /**
   * Выявление общих проблем
   */
  private identifyCommonIssues(campaigns: DeletionRequest[]): string[] {
    const issues: string[] = [];
    
    const failedCampaigns = campaigns.filter(c => c.campaignStatus === 'failed').length;
    const escalatedCampaigns = campaigns.filter(c => c.campaignStatus === 'escalated').length;
    const stalledCampaigns = campaigns.filter(c => {
      const lastAction = c.lastActionAt ? new Date(c.lastActionAt) : new Date(c.createdAt);
      const daysSinceAction = (Date.now() - lastAction.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceAction > 45 && ['awaiting_response', 'taking_action'].includes(c.campaignStatus || '');
    }).length;

    if (failedCampaigns > campaigns.length * 0.1) {
      issues.push('High failure rate detected');
    }
    
    if (escalatedCampaigns > campaigns.length * 0.2) {
      issues.push('High escalation rate - operators not complying');
    }
    
    if (stalledCampaigns > 0) {
      issues.push('Some campaigns are stalled without progress');
    }

    return issues;
  }

  /**
   * Прогнозирование дат завершения
   */
  private predictCompletionDates(activeCampaigns: DeletionRequest[], averageCompletionTime: number): Record<string, Date> {
    const predictions: Record<string, Date> = {};
    
    activeCampaigns.forEach(campaign => {
      const startDate = campaign.campaignStartedAt ? new Date(campaign.campaignStartedAt) : new Date(campaign.createdAt);
      const predictedCompletion = new Date(startDate.getTime() + averageCompletionTime * 24 * 60 * 60 * 1000);
      predictions[campaign.id] = predictedCompletion;
    });
    
    return predictions;
  }

  /**
   * Выявление факторов риска
   */
  private identifyRiskFactors(campaigns: DeletionRequest[], operatorStats: Record<string, any>): string[] {
    const risks: string[] = [];
    
    // Проверяем операторов с низким уровнем соответствия
    const lowComplianceOperators = Object.entries(operatorStats)
      .filter(([_, stats]: [string, any]) => stats.complianceScore < 30)
      .length;
    
    if (lowComplianceOperators > 0) {
      risks.push(`${lowComplianceOperators} operators with very low compliance rates`);
    }

    // Проверяем количество активных кампаний
    const activeCampaigns = campaigns.filter(c => 
      ['started', 'documents_sent', 'awaiting_response', 'analyzing_response', 'taking_action'].includes(c.campaignStatus || '')
    ).length;
    
    if (activeCampaigns > 50) {
      risks.push('High number of active campaigns may require additional resources');
    }

    return risks;
  }

  // ========================================
  // ACTION EXECUTION METHODS
  // ========================================

  private async executeSendFollowup(campaign: DeletionRequest): Promise<CampaignProgressResult> {
    // Интеграция с Document Generator для отправки повторного письма
    // Это заглушка - в реальной реализации здесь будет вызов documentGenerator
    console.log(`📧 Sending follow-up for campaign: ${campaign.id}`);
    
    return await this.updateCampaignProgress(
      campaign.id,
      'documents_sent',
      {
        type: 'followup_sent',
        metadata: { documentType: 'FOLLOW_UP_REQUEST' }
      }
    );
  }

  private async executeEscalateToRkn(campaign: DeletionRequest): Promise<CampaignProgressResult> {
    console.log(`🚨 Escalating to RKN for campaign: ${campaign.id}`);
    
    return await this.updateCampaignProgress(
      campaign.id,
      'escalated',
      {
        type: 'escalation_initiated',
        metadata: { escalationType: 'RKN_COMPLAINT' }
      }
    );
  }

  private async executeRequestClarification(campaign: DeletionRequest): Promise<CampaignProgressResult> {
    console.log(`❓ Requesting clarification for campaign: ${campaign.id}`);
    
    return await this.updateCampaignProgress(
      campaign.id,
      'awaiting_response',
      {
        type: 'decision_made',
        metadata: { action: 'clarification_requested' }
      }
    );
  }

  private async executeCloseCampaign(campaign: DeletionRequest): Promise<CampaignProgressResult> {
    console.log(`🏁 Closing campaign: ${campaign.id}`);
    
    return await this.updateCampaignProgress(
      campaign.id,
      'completed',
      {
        type: 'campaign_completed',
        metadata: { reason: 'automatic_closure' }
      }
    );
  }

  private async executeAwaitResponse(campaign: DeletionRequest): Promise<CampaignProgressResult> {
    console.log(`⏳ Awaiting response for campaign: ${campaign.id}`);
    
    return await this.updateCampaignProgress(
      campaign.id,
      'awaiting_response'
    );
  }

  private async executeAnalyzeResponse(campaign: DeletionRequest): Promise<CampaignProgressResult> {
    console.log(`🔍 Analyzing response for campaign: ${campaign.id}`);
    
    // Интеграция с Response Analyzer
    // В реальной реализации здесь будет вызов responseAnalyzer
    
    return await this.updateCampaignProgress(
      campaign.id,
      'analyzing_response',
      {
        type: 'decision_made',
        metadata: { action: 'response_analyzed' }
      }
    );
  }

  private async executeCollectEvidence(campaign: DeletionRequest): Promise<CampaignProgressResult> {
    console.log(`📋 Collecting evidence for campaign: ${campaign.id}`);
    
    return await this.updateCampaignProgress(
      campaign.id,
      'taking_action',
      {
        type: 'evidence_collected',
        metadata: { action: 'evidence_collection' }
      }
    );
  }
}

// Экспорт singleton instance
export const campaignManager = CampaignManager.getInstance(storage);
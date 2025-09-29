import { storage } from './storage';
import { sendEmail, type EmailData } from './email';
import { followUpDeletionTemplate } from './templates/follow-up';
import { regulatorEscalationTemplate } from './templates/regulator-escalation';
import { documentGenerator, type DocumentContext } from './document-generator';
import type { DeletionRequest, DocumentType } from '@shared/schema';
import { responseAnalyzer } from './response-analyzer';
import { DecisionEngine } from './decision-engine';

/**
 * Email Automation Scheduler для автоматической отправки повторных писем
 * и эскалации согласно ФЗ-152 "О персональных данных"
 */
export class EmailAutomationScheduler {
  private static instance: EmailAutomationScheduler;
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;

  private constructor() {}

  static getInstance(): EmailAutomationScheduler {
    if (!EmailAutomationScheduler.instance) {
      EmailAutomationScheduler.instance = new EmailAutomationScheduler();
    }
    return EmailAutomationScheduler.instance;
  }

  /**
   * Запуск мониторинга email automation (каждые 6 часов)
   */
  start() {
    if (this.isRunning) {
      console.log('📧 Email automation scheduler is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting email automation scheduler...');

    // Проверяем сразу при запуске
    this.processEmailAutomation().catch(console.error);

    // Запускаем периодическую проверку каждые 6 часов
    this.intervalId = setInterval(async () => {
      try {
        await this.processEmailAutomation();
      } catch (error) {
        console.error('❌ Error in scheduled email automation processing:', error);
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    console.log('✅ Email automation scheduler started (checking every 6 hours)');
  }

  /**
   * Остановка мониторинга email automation
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.isRunning = false;
    console.log('🛑 Email automation scheduler stopped');
  }

  /**
   * Основная функция обработки email automation с интеграцией Decision Engine
   */
  async processEmailAutomation(): Promise<void> {
    try {
      console.log('🔍 Processing email automation with Decision Engine integration...');

      // DECISION ENGINE INTEGRATION
      // Обрабатываем запросы с помощью Decision Engine
      const decisionEngineResults = await this.processDecisionEngineActions();

      // Обрабатываем повторные отправки (30 дней) - только запросы без решений
      const followUpResults = await this.processFollowUpEmails();
      
      // Обрабатываем эскалации в Роскомнадзор (60 дней) - только запросы без решений
      const escalationResults = await this.processEscalations();

      const totalProcessed = decisionEngineResults.processed + followUpResults.processed + escalationResults.processed;
      const totalExecuted = decisionEngineResults.executed + followUpResults.sent + escalationResults.sent;

      if (totalProcessed > 0) {
        console.log(`📊 Email automation completed: ${totalExecuted}/${totalProcessed} actions executed`);
        console.log(`  └─ Decision Engine: ${decisionEngineResults.executed}/${decisionEngineResults.processed} decisions executed`);
        console.log(`  └─ Follow-ups: ${followUpResults.sent}/${followUpResults.processed}`);
        console.log(`  └─ Escalations: ${escalationResults.sent}/${escalationResults.processed}`);
      } else {
        console.log('ℹ️ No deletion requests requiring email automation at this time');
      }
    } catch (error) {
      console.error('❌ Error in processEmailAutomation:', error);
      throw error;
    }
  }

  /**
   * Новый: Обработка действий с использованием Decision Engine
   * Интеграция с Decision Engine для интеллектуального принятия решений
   */
  private async processDecisionEngineActions(): Promise<{ processed: number; executed: number }> {
    try {
      console.log('🎯 Processing Decision Engine actions...');

      // Получить запросы, требующие принятия решений
      const requestsForDecisions = await storage.getDeletionRequests({
        status: 'processing', // Обрабатываем только активные запросы
      });

      // САЗПД КРИТИЧНО: Фильтруем с учетом idempotency для предотвращения дублирования
      const pendingRequests = requestsForDecisions.filter(r => {
        // Нет решения вообще
        if (!r.decisionType) {
          return true;
        }
        
        // Если есть новый ответ после принятого решения - перепроверяем
        if (r.lastInboundEmailId && r.lastInboundAt && r.decisionMadeAt && 
            new Date(r.lastInboundAt) > new Date(r.decisionMadeAt)) {
          console.log(`📩 New response received for request ${r.id} after decision, will re-analyze`);
          return true;
        }
        
        // ИСКЛЮЧЕНИЕ: Если нет idempotency key у старого решения, можем переанализировать
        // (для совместимости со старыми записями)
        if (!r.decisionIdempotencyKey) {
          console.log(`🔄 Legacy decision found for request ${r.id} without idempotency key, will re-analyze`);
          return true;
        }
        
        // Решение есть и актуальное - пропускаем
        return false;
      });

      let processedCount = 0;
      let executedCount = 0;

      // САЗПД: Обрабатываем запросы последовательно для предотвращения race conditions
      for (const request of pendingRequests) {
        try {
          processedCount++;
          
          console.log(`🔄 Processing decision for request ${request.id} (status: ${request.status}, last decision: ${request.decisionType || 'none'})`);
          
          // Принимаем решение с помощью Decision Engine
          const decisionResult = await DecisionEngine.getInstance(storage).makeDecision(request.id);
          
          if (decisionResult.success && decisionResult.decision) {
            console.log(`🎯 Decision made for request ${request.id}: ${decisionResult.decision.type} (confidence: ${decisionResult.decision.confidence}%)`);

            // ДЕДУПЛИКАЦИЯ: Выполняем решение только если оно автоматическое И не было выполнено ранее
            if (decisionResult.decision.autoExecute && !request.autoProcessed) {
              console.log(`🚀 Auto-executing decision ${decisionResult.decision.type} for request ${request.id}`);
              const executed = await this.executeDecision(request, decisionResult.decision);
              if (executed) {
                executedCount++;
                console.log(`✅ Decision ${decisionResult.decision.type} executed successfully for request ${request.id}`);
              } else {
                console.warn(`⚠️ Failed to execute decision ${decisionResult.decision.type} for request ${request.id}`);
              }
            } else if (decisionResult.decision.autoExecute && request.autoProcessed) {
              console.log(`🔒 Decision ${decisionResult.decision.type} for request ${request.id} already auto-processed, skipping execution`);
            } else {
              console.log(`ℹ️ Decision ${decisionResult.decision.type} for request ${request.id} requires manual execution`);
            }
          } else {
            console.error(`❌ Failed to make decision for request ${request.id}: ${decisionResult.error}`);
          }
        } catch (error) {
          console.error(`❌ Error processing decision for request ${request.id}:`, error);
        }
        
        // Небольшая задержка между обработкой запросов для снижения нагрузки на БД
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (processedCount > 0) {
        console.log(`🎯 Decision Engine actions: ${executedCount}/${processedCount} decisions executed`);
      } else {
        console.log('ℹ️ No deletion requests requiring Decision Engine processing');
      }

      return { processed: processedCount, executed: executedCount };
    } catch (error) {
      console.error('❌ Error in processDecisionEngineActions:', error);
      return { processed: 0, executed: 0 };
    }
  }

  /**
   * Выполнение принятого решения Decision Engine
   */
  private async executeDecision(request: DeletionRequest, decision: any): Promise<boolean> {
    try {
      console.log(`🚀 Executing decision ${decision.type} for request ${request.id}`);

      switch (decision.type) {
        case 'AUTO_COMPLETE':
          return await this.executeAutoComplete(request, decision);

        case 'ESCALATE_TO_RKN':
          return await this.executeEscalateToRKN(request, decision);

        case 'REQUEST_CLARIFICATION':
          return await this.executeRequestClarification(request, decision);

        case 'SCHEDULE_FOLLOW_UP':
          return await this.executeScheduleFollowUp(request, decision);

        case 'IMMEDIATE_ESCALATION':
          return await this.executeImmediateEscalation(request, decision);

        case 'CLOSE_AS_RESOLVED':
          return await this.executeCloseAsResolved(request, decision);

        case 'EXTEND_DEADLINE':
          return await this.executeExtendDeadline(request, decision);

        case 'PREPARE_LEGAL_ACTION':
          return await this.executePrepLegalAction(request, decision);

        case 'MANUAL_REVIEW_REQUIRED':
          return await this.executeManualReviewRequired(request, decision);

        default:
          console.log(`⚠️ Unknown decision type: ${decision.type} for request ${request.id}`);
          return false;
      }
    } catch (error) {
      console.error(`❌ Error executing decision ${decision.type} for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Автоматическое завершение запроса
   */
  private async executeAutoComplete(request: DeletionRequest, decision: any): Promise<boolean> {
    try {
      await storage.updateDeletionRequest(request.id, {
        status: 'completed',
        completedAt: new Date(),
        responseDetails: {
          ...request.responseDetails,
          autoCompletedByDecisionEngine: true,
          decisionConfidence: decision.confidence,
          completionReason: decision.reason
        }
      });
      
      console.log(`✅ Auto-completed request ${request.id}: ${decision.reason}`);
      return true;
    } catch (error) {
      console.error(`❌ Error auto-completing request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Эскалация в Роскомнадзор
   */
  private async executeEscalateToRKN(request: DeletionRequest, decision: any): Promise<boolean> {
    try {
      // Создаем документ жалобы в РКН
      const userProfile = await storage.getUserProfile(request.userId);
      const userAccount = await storage.getUserAccountById(request.userId);
      
      if (!userAccount) return false;

      const context: DocumentContext = {
        userId: request.userId,
        userProfile,
        brokerInfo: {
          name: request.brokerName,
          website: (request.requestDetails as any)?.brokerUrl || '',
          email: request.operatorEmail
        },
        deletionRequest: request,
        personalDataList: (request.requestDetails as any)?.personalData || [],
        previousRequestDates: [request.createdAt?.toLocaleDateString('ru-RU') || ''],
        format: 'both'
      };

      const documentResult = await documentGenerator.generateDocument('RKN_COMPLAINT', context);
      
      if (documentResult.success && userAccount.email) {
        const emailData: EmailData = {
          to: userAccount.email,
          subject: `Подготовлена жалоба в Роскомнадзор по запросу ${request.brokerName}`,
          html: `
            <h2>Автоматическая эскалация в Роскомнадзор</h2>
            <p>Система приняла решение об эскалации вашего запроса в Роскомнадзор.</p>
            <p><strong>Основание:</strong> ${decision.reason}</p>
            <p><strong>Уверенность:</strong> ${decision.confidence}%</p>
            <hr>
            ${documentResult.html}
          `
        };

        await sendEmail(emailData);
        
        await storage.updateDeletionRequest(request.id, {
          status: 'escalated',
          escalationSentAt: new Date(),
          responseDetails: {
            ...request.responseDetails,
            escalatedByDecisionEngine: true,
            escalationReason: decision.reason,
            escalationConfidence: decision.confidence
          }
        });

        console.log(`📈 Escalated request ${request.id} to RKN: ${decision.reason}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Error escalating request ${request.id} to RKN:`, error);
      return false;
    }
  }

  /**
   * Запрос дополнительных уточнений
   */
  private async executeRequestClarification(request: DeletionRequest, decision: any): Promise<boolean> {
    try {
      const userProfile = await storage.getUserProfile(request.userId);
      const userAccount = await storage.getUserAccountById(request.userId);
      
      if (!userAccount) return false;

      const context: DocumentContext = {
        userId: request.userId,
        userProfile,
        brokerInfo: {
          name: request.brokerName,
          website: (request.requestDetails as any)?.brokerUrl || '',
          email: request.operatorEmail
        },
        deletionRequest: request,
        personalDataList: (request.requestDetails as any)?.personalData || [],
        previousRequestDates: [request.createdAt?.toLocaleDateString('ru-RU') || ''],
        format: 'both'
      };

      const documentResult = await documentGenerator.generateDocument('FOLLOW_UP_REQUEST', context);
      
      if (documentResult.success && userAccount.email) {
        const emailData: EmailData = {
          to: userAccount.email,
          subject: `Требуется дополнительная информация по запросу ${request.brokerName}`,
          html: `
            <h2>Запрос дополнительной информации</h2>
            <p>Система определила необходимость в получении дополнительной информации.</p>
            <p><strong>Основание:</strong> ${decision.reason}</p>
            <hr>
            ${documentResult.html}
          `
        };

        await sendEmail(emailData);

        await storage.updateDeletionRequest(request.id, {
          status: 'awaiting_clarification',
          responseDetails: {
            ...request.responseDetails,
            clarificationRequestedByDecisionEngine: true,
            clarificationReason: decision.reason
          }
        });

        console.log(`❓ Requested clarification for request ${request.id}: ${decision.reason}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Error requesting clarification for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Планирование повторного обращения
   */
  private async executeScheduleFollowUp(request: DeletionRequest, decision: any): Promise<boolean> {
    try {
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + decision.metadata.estimatedResolutionDays);

      await storage.updateDeletionRequest(request.id, {
        followUpRequired: true,
        followUpDate: followUpDate,
        responseDetails: {
          ...request.responseDetails,
          followUpScheduledByDecisionEngine: true,
          followUpReason: decision.reason,
          scheduledForDays: decision.metadata.estimatedResolutionDays
        }
      });

      console.log(`📅 Scheduled follow-up for request ${request.id} in ${decision.metadata.estimatedResolutionDays} days`);
      return true;
    } catch (error) {
      console.error(`❌ Error scheduling follow-up for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Немедленная критическая эскалация
   */
  private async executeImmediateEscalation(request: DeletionRequest, decision: any): Promise<boolean> {
    try {
      // Аналогично эскалации в РКН, но с пометкой "критическая"
      const result = await this.executeEscalateToRKN(request, decision);
      
      if (result) {
        await storage.updateDeletionRequest(request.id, {
          responseDetails: {
            ...request.responseDetails,
            immediateEscalation: true,
            criticalityLevel: 'HIGH'
          }
        });
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Error executing immediate escalation for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Закрытие как решенного
   */
  private async executeCloseAsResolved(request: DeletionRequest, decision: any): Promise<boolean> {
    return await this.executeAutoComplete(request, decision);
  }

  /**
   * Продление срока
   */
  private async executeExtendDeadline(request: DeletionRequest, decision: any): Promise<boolean> {
    try {
      const newDeadline = new Date();
      newDeadline.setDate(newDeadline.getDate() + 30); // Продление на 30 дней

      await storage.updateDeletionRequest(request.id, {
        responseDeadlineAt: newDeadline,
        responseDetails: {
          ...request.responseDetails,
          deadlineExtendedByDecisionEngine: true,
          extensionReason: decision.reason
        }
      });

      console.log(`⏰ Extended deadline for request ${request.id} by 30 days`);
      return true;
    } catch (error) {
      console.error(`❌ Error extending deadline for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Подготовка правовых действий
   */
  private async executePrepLegalAction(request: DeletionRequest, decision: any): Promise<boolean> {
    try {
      await storage.updateDeletionRequest(request.id, {
        status: 'legal_action_preparation',
        responseDetails: {
          ...request.responseDetails,
          legalActionPreparedByDecisionEngine: true,
          legalActionReason: decision.reason
        }
      });

      console.log(`⚖️ Prepared legal action for request ${request.id}: ${decision.reason}`);
      return true;
    } catch (error) {
      console.error(`❌ Error preparing legal action for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Требуется ручная проверка
   */
  private async executeManualReviewRequired(request: DeletionRequest, decision: any): Promise<boolean> {
    try {
      await storage.updateDeletionRequest(request.id, {
        status: 'manual_review_required',
        responseDetails: {
          ...request.responseDetails,
          manualReviewRequiredByDecisionEngine: true,
          manualReviewReason: decision.reason
        }
      });

      console.log(`👨‍💼 Marked request ${request.id} for manual review: ${decision.reason}`);
      return true;
    } catch (error) {
      console.error(`❌ Error marking request ${request.id} for manual review:`, error);
      return false;
    }
  }

  /**
   * LEGACY: Выполнение конкретного действия на основе анализа ответа (DEPRECATED)
   * Заменено на Decision Engine
   */
  private async executeAnalysisBasedAction(request: DeletionRequest, inboundEmail: any): Promise<boolean> {
    try {
      const recommendations = inboundEmail.recommendations;
      const responseType = inboundEmail.responseType;
      const legitimacyScore = inboundEmail.legitimacyScore || 0;

      console.log(`🎯 Executing analysis-based action for request ${request.id}: type=${responseType}, score=${legitimacyScore}`);

      // Логика принятия решений на основе анализа
      switch (responseType) {
        case 'POSITIVE_CONFIRMATION':
          // Оператор подтвердил удаление - закрываем запрос
          if (legitimacyScore >= 80) {
            await storage.updateDeletionRequest(request.id, {
              status: 'completed',
              completedAt: new Date(),
              responseDetails: {
                ...request.responseDetails,
                autoCompletedByAnalysis: true,
                analysisScore: legitimacyScore,
                completionReason: 'Legitimate positive confirmation from operator'
              }
            });
            console.log(`✅ Auto-completed request ${request.id} based on legitimate positive confirmation`);
            return true;
          }
          break;

        case 'REJECTION':
          // Оператор отказался - нужны дальнейшие действия
          if (recommendations?.escalation_level === 'HIGH' || legitimacyScore < 30) {
            // Низкий score или высокий уровень эскалации - готовим жалобу в РКН
            await storage.updateDeletionRequest(request.id, {
              status: 'escalation_needed',
              responseDetails: {
                ...request.responseDetails,
                autoEscalatedByAnalysis: true,
                analysisScore: legitimacyScore,
                escalationReason: 'Illegitimate rejection detected by analysis'
              }
            });
            console.log(`⚠️ Auto-escalated request ${request.id} due to illegitimate rejection`);
            return true;
          }
          break;

        case 'PARTIAL_COMPLIANCE':
          // Частичное соответствие - требуется дополнительное взаимодействие
          if (recommendations?.follow_up_required) {
            await this.sendClarificationRequest(request, inboundEmail);
            return true;
          }
          break;

        case 'NO_RESPONSE':
          // Отсутствие ответа или неинформативный ответ - отправляем повторный запрос
          if (recommendations?.next_action === 'follow_up') {
            await this.sendFollowUpEmail(request);
            return true;
          }
          break;

        default:
          // Неизвестный тип ответа - логируем для ручного анализа
          console.log(`❓ Unknown response type ${responseType} for request ${request.id}, requires manual review`);
      }

      // Проверяем нарушения
      if (inboundEmail.violations && inboundEmail.violations.length > 0) {
        await this.handleDetectedViolations(request, inboundEmail.violations);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`❌ Error executing analysis-based action for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Отправка запроса на уточнение при частичном соответствии
   */
  private async sendClarificationRequest(request: DeletionRequest, inboundEmail: any): Promise<boolean> {
    try {
      console.log(`📝 Sending clarification request for ${request.id}`);
      
      // Получаем данные пользователя
      const userProfile = await storage.getUserProfile(request.userId);
      const userAccount = await storage.getUserAccountById(request.userId);
      
      if (!userAccount) return false;

      // Генерируем письмо с просьбой о дополнительной информации
      const context: DocumentContext = {
        userId: request.userId,
        userProfile,
        brokerInfo: {
          name: request.brokerName,
          website: (request.requestDetails as any)?.brokerUrl || '',
          email: request.operatorEmail
        },
        deletionRequest: request,
        personalDataList: (request.requestDetails as any)?.personalData || [],
        previousRequestDates: [request.createdAt?.toLocaleDateString('ru-RU') || ''],
        format: 'both',
        // Дополнительный контекст для уточнения
        clarificationContext: {
          missingInformation: inboundEmail.extractedData?.missing_info || [],
          partialResponse: inboundEmail.extractedData || {},
          violations: inboundEmail.violations || []
        }
      };

      const documentResult = await documentGenerator.generateDocument('CLARIFICATION_REQUEST', context);
      
      if (documentResult.success && documentResult.document) {
        const emailResult = await sendEmail({
          to: request.operatorEmail || 'data.protection@unknown-operator.ru',
          template: {
            subject: documentResult.document.subject,
            text: documentResult.document.text,
            html: documentResult.document.html
          },
          data: {
            senderName: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || userAccount.email.split('@')[0],
            senderEmail: userAccount.email,
            brokerName: request.brokerName,
          },
          userId: request.userId,
          deletionRequestId: request.id,
          category: 'clarification_request'
        });

        if (emailResult.success) {
          await storage.updateDeletionRequest(request.id, {
            status: 'clarification_sent',
            responseDetails: {
              ...request.responseDetails,
              clarificationSentAt: new Date(),
              clarificationMessageId: emailResult.messageId,
              autoClarificationByAnalysis: true
            }
          });
          console.log(`✅ Clarification request sent for ${request.id}`);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error(`❌ Error sending clarification request for ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Обработка обнаруженных нарушений
   */
  private async handleDetectedViolations(request: DeletionRequest, violations: string[]): Promise<boolean> {
    try {
      console.log(`⚖️ Handling detected violations for request ${request.id}:`, violations);

      // Определяем серьезность нарушений
      const criticalViolations = violations.filter(v => 
        ['INVALID_LEGAL_BASIS', 'EXCESSIVE_RETENTION', 'NO_LEGAL_BASIS'].includes(v)
      );

      if (criticalViolations.length > 0) {
        // Критичные нарушения - готовим к эскалации
        await storage.updateDeletionRequest(request.id, {
          status: 'violations_detected',
          responseDetails: {
            ...request.responseDetails,
            violationsDetected: violations,
            violationsSeverity: 'critical',
            autoEscalationRequired: true,
            detectedAt: new Date()
          }
        });

        // Отправляем уведомление о нарушениях оператору
        await this.sendViolationNotification(request, violations);
        
        console.log(`🚨 Critical violations detected for request ${request.id}, marked for escalation`);
        return true;
      } else {
        // Некритичные нарушения - запрашиваем дополнительную информацию
        await storage.updateDeletionRequest(request.id, {
          status: 'minor_violations',
          responseDetails: {
            ...request.responseDetails,
            violationsDetected: violations,
            violationsSeverity: 'minor',
            clarificationRequired: true
          }
        });
        
        console.log(`⚠️ Minor violations detected for request ${request.id}, clarification required`);
        return true;
      }
    } catch (error) {
      console.error(`❌ Error handling violations for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Отправка уведомления о нарушениях оператору
   */
  private async sendViolationNotification(request: DeletionRequest, violations: string[]): Promise<boolean> {
    try {
      const userProfile = await storage.getUserProfile(request.userId);
      const userAccount = await storage.getUserAccountById(request.userId);
      
      if (!userAccount) return false;

      // Создаем письмо с указанием на нарушения ФЗ-152
      const violationDescriptions = violations.map(v => {
        switch (v) {
          case 'INVALID_LEGAL_BASIS': return 'Указанное правовое основание не соответствует требованиям ФЗ-152';
          case 'EXCESSIVE_RETENTION': return 'Срок хранения превышает необходимый для достижения целей обработки';
          case 'MISSING_INFORMATION': return 'Отсутствует обязательная информация согласно ст. 14 ФЗ-152';
          case 'NO_LEGAL_BASIS': return 'Не указано правовое основание обработки персональных данных';
          default: return `Обнаружено нарушение: ${v}`;
        }
      }).join('\n• ');

      const emailTemplate = {
        subject: `Уведомление о нарушениях ФЗ-152 в ответе по заявке ${request.trackingId}`,
        text: `Уважаемые коллеги,

В вашем ответе на запрос об удалении персональных данных выявлены следующие нарушения требований Федерального закона № 152-ФЗ "О персональных данных":

• ${violationDescriptions}

Просим в течение 10 рабочих дней предоставить корректную информацию либо устранить указанные нарушения.

В случае неустранения нарушений данная информация будет направлена в Роскомнадзор.

С уважением,
${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`,
        html: `<p>Уважаемые коллеги,</p>
        <p>В вашем ответе на запрос об удалении персональных данных выявлены следующие нарушения требований Федерального закона № 152-ФЗ "О персональных данных":</p>
        <ul><li>${violationDescriptions.replace(/\n• /g, '</li><li>')}</li></ul>
        <p>Просим в течение 10 рабочих дней предоставить корректную информацию либо устранить указанные нарушения.</p>
        <p><strong>В случае неустранения нарушений данная информация будет направлена в Роскомнадзор.</strong></p>
        <p>С уважением,<br>${userProfile?.firstName || ''} ${userProfile?.lastName || ''}</p>`
      };

      const emailResult = await sendEmail({
        to: request.operatorEmail || 'data.protection@unknown-operator.ru',
        template: emailTemplate,
        data: {
          senderName: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || userAccount.email.split('@')[0],
          senderEmail: userAccount.email,
          brokerName: request.brokerName,
        },
        userId: request.userId,
        deletionRequestId: request.id,
        category: 'violation_notification'
      });

      if (emailResult.success) {
        await storage.updateDeletionRequest(request.id, {
          responseDetails: {
            ...request.responseDetails,
            violationNotificationSent: true,
            violationNotificationAt: new Date(),
            violationNotificationMessageId: emailResult.messageId
          }
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`❌ Error sending violation notification for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Обработка повторных писем (через 30 дней без ответа)
   */
  private async processFollowUpEmails(): Promise<{ processed: number; sent: number }> {
    try {
      console.log('📧 Processing follow-up emails...');

      // Найти deletion_requests с статусом 'sent_initial' и firstSentAt старше 30 дней
      // и проверить что не получен ответ (inbound_emails не связаны)
      const candidateRequests = await storage.getDeletionRequests({
        status: 'sent_initial',
        olderThanDays: 30,
        withoutInboundEmails: true
      });

      if (candidateRequests.length === 0) {
        console.log('ℹ️ No deletion requests requiring follow-up emails');
        return { processed: 0, sent: 0 };
      }

      console.log(`📋 Found ${candidateRequests.length} deletion requests requiring follow-up emails`);

      let sentCount = 0;
      for (const request of candidateRequests) {
        try {
          // Усиленная idempotency проверка: не отправлять дубликаты
          if (request.status !== 'sent_initial') {
            console.log(`⏭️ Skipping request ${request.id}: status is ${request.status}, not 'sent_initial'`);
            continue;
          }
          
          if ((request as any).followUpSentAt) {
            console.log(`⏭️ Skipping request ${request.id}: follow-up already sent at ${(request as any).followUpSentAt}`);
            continue;
          }

          const sent = await this.sendFollowUpEmail(request);
          if (sent) {
            sentCount++;
            console.log(`✅ Follow-up email sent for deletion request ${request.id}`);
          }
        } catch (error) {
          console.error(`❌ Error sending follow-up email for request ${request.id}:`, error);
        }
      }

      console.log(`📤 Follow-up emails: ${sentCount}/${candidateRequests.length} sent successfully`);
      return { processed: candidateRequests.length, sent: sentCount };
    } catch (error) {
      console.error('❌ Error in processFollowUpEmails:', error);
      return { processed: 0, sent: 0 };
    }
  }

  /**
   * Обработка эскалаций в Роскомнадзор (через 60 дней общего срока)
   */
  private async processEscalations(): Promise<{ processed: number; sent: number }> {
    try {
      console.log('🚨 Processing escalations to Roskomnadzor...');

      // Найти deletion_requests с любым статусом и created_at старше 60 дней
      // и проверить что оператор НЕ подтвердил удаление
      const candidateRequests = await storage.getDeletionRequests({
        olderThanDays: 60,
        operatorNotConfirmed: true
      });

      if (candidateRequests.length === 0) {
        console.log('ℹ️ No deletion requests requiring escalation to Roskomnadzor');
        return { processed: 0, sent: 0 };
      }

      console.log(`📋 Found ${candidateRequests.length} deletion requests requiring escalation`);

      let sentCount = 0;
      for (const request of candidateRequests) {
        try {
          // Усиленная idempotency проверка: не эскалировать уже эскалированные
          if (request.status === 'escalated') {
            console.log(`⏭️ Skipping request ${request.id}: already escalated with status 'escalated'`);
            continue;
          }
          
          if ((request as any).escalationSentAt) {
            console.log(`⏭️ Skipping request ${request.id}: escalation already sent at ${(request as any).escalationSentAt}`);
            continue;
          }

          const sent = await this.sendEscalationEmail(request);
          if (sent) {
            sentCount++;
            console.log(`✅ Escalation email sent for deletion request ${request.id}`);
          }
        } catch (error) {
          console.error(`❌ Error sending escalation email for request ${request.id}:`, error);
        }
      }

      console.log(`📤 Escalations: ${sentCount}/${candidateRequests.length} sent successfully`);
      return { processed: candidateRequests.length, sent: sentCount };
    } catch (error) {
      console.error('❌ Error in processEscalations:', error);
      return { processed: 0, sent: 0 };
    }
  }

  /**
   * Отправка повторного письма (улучшенная версия с DocumentGenerator)
   */
  private async sendFollowUpEmail(request: DeletionRequest): Promise<boolean> {
    try {
      // Получаем данные пользователя для email
      const userProfile = await storage.getUserProfile(request.userId);
      const userAccount = await storage.getUserAccountById(request.userId);
      
      if (!userAccount) {
        console.error(`❌ User account not found for deletion request ${request.id}`);
        return false;
      }

      // Подготавливаем контекст для DocumentGenerator
      const context: DocumentContext = {
        userId: request.userId,
        userProfile,
        brokerInfo: {
          name: request.brokerName,
          website: (request.requestDetails as any)?.brokerUrl || '',
          email: request.operatorEmail
        },
        deletionRequest: request,
        personalDataList: (request.requestDetails as any)?.personalData || [],
        previousRequestDates: [request.createdAt?.toLocaleDateString('ru-RU') || new Date().toLocaleDateString('ru-RU')],
        format: 'both'
      };

      // Генерируем документ через DocumentGenerator
      const documentResult = await documentGenerator.generateDocument('FOLLOW_UP_REQUEST', context);

      if (!documentResult.success || !documentResult.document) {
        console.error(`❌ Failed to generate follow-up document for request ${request.id}:`, documentResult.error);
        // Fallback к старому методу
        return this.sendFollowUpEmailLegacy(request);
      }

      // Преобразуем результат для sendEmail
      const emailTemplate = {
        subject: documentResult.document.subject,
        text: documentResult.document.text,
        html: documentResult.document.html
      };

      // Подготавливаем данные для отправки
      const emailData: EmailData = {
        senderName: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || userAccount.email.split('@')[0],
        senderEmail: userAccount.email,
        senderPhone: userProfile?.phone || undefined,
        brokerName: request.brokerName,
        brokerUrl: (request.requestDetails as any)?.brokerUrl || '',
        personalData: (request.requestDetails as any)?.personalData || [],
        requestDate: request.createdAt?.toLocaleDateString('ru-RU') || new Date().toLocaleDateString('ru-RU'),
        legalBasis: 'ст. 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"'
      };

      // Отправляем email
      const emailResult = await sendEmail({
        to: request.operatorEmail || 'data.protection@unknown-operator.ru',
        template: emailTemplate,
        data: emailData,
        userId: request.userId,
        deletionRequestId: request.id,
        category: 'deletion_follow_up'
      });

      if (emailResult.success) {
        // Атомарное обновление статуса и всех связанных полей
        try {
          await storage.updateDeletionRequest(request.id, {
            status: 'followup_sent',
            followUpSentAt: new Date(),
            followUpMessageId: emailResult.messageId
          });
          console.log(`📧 Follow-up email sent successfully for request ${request.id}`);
          return true;
        } catch (dbError) {
          console.error(`❌ Database update failed after sending follow-up email for request ${request.id}:`, dbError);
          // Email был отправлен, но статус не обновился - это критическая ошибка
          throw new Error(`Critical: Follow-up email sent but database update failed for request ${request.id}`);
        }
      } else {
        console.error(`❌ Failed to send follow-up email for request ${request.id}:`, emailResult.error);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error in sendFollowUpEmail for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Отправка эскалации в Роскомнадзор (улучшенная версия с DocumentGenerator)
   */
  private async sendEscalationEmail(request: DeletionRequest): Promise<boolean> {
    try {
      // Получаем данные пользователя для email
      const userProfile = await storage.getUserProfile(request.userId);
      const userAccount = await storage.getUserAccountById(request.userId);
      
      if (!userAccount) {
        console.error(`❌ User account not found for deletion request ${request.id}`);
        return false;
      }

      // Подготавливаем контекст для DocumentGenerator
      const context: DocumentContext = {
        userId: request.userId,
        userProfile,
        brokerInfo: {
          name: request.brokerName,
          website: (request.requestDetails as any)?.brokerUrl || '',
          email: request.operatorEmail
        },
        deletionRequest: request,
        personalDataList: (request.requestDetails as any)?.personalData || [],
        previousRequestDates: [
          request.createdAt?.toLocaleDateString('ru-RU') || new Date().toLocaleDateString('ru-RU'),
          request.followUpSentAt?.toLocaleDateString('ru-RU') || ''
        ].filter(Boolean),
        format: 'both'
      };

      // Генерируем документ жалобы в РКН через DocumentGenerator
      const documentResult = await documentGenerator.generateDocument('RKN_COMPLAINT', context);

      if (!documentResult.success || !documentResult.document) {
        console.error(`❌ Failed to generate RKN complaint document for request ${request.id}:`, documentResult.error);
        // Fallback к старому методу
        return this.sendEscalationEmailLegacy(request);
      }

      // Преобразуем результат для sendEmail
      const emailTemplate = {
        subject: documentResult.document.subject,
        text: documentResult.document.text,
        html: documentResult.document.html
      };

      // Подготавливаем данные для отправки
      const emailData: EmailData = {
        senderName: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || userAccount.email.split('@')[0],
        senderEmail: userAccount.email,
        senderPhone: userProfile?.phone || undefined,
        brokerName: request.brokerName,
        brokerUrl: (request.requestDetails as any)?.brokerUrl || '',
        personalData: (request.requestDetails as any)?.personalData || [],
        requestDate: request.createdAt?.toLocaleDateString('ru-RU') || new Date().toLocaleDateString('ru-RU'),
        legalBasis: 'ст. 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"'
      };

      // Отправляем в Роскомнадзор (используем официальный email или test email)
      const roskomnadzorEmail = process.env.ROSKOMNADZOR_EMAIL || 'complaints@rkn.gov.ru';
      
      const emailResult = await sendEmail({
        to: roskomnadzorEmail,
        template: emailTemplate,
        data: emailData,
        userId: request.userId,
        deletionRequestId: request.id,
        category: 'regulator_escalation'
      });

      if (emailResult.success) {
        // Атомарное обновление статуса и всех связанных полей
        try {
          await storage.updateDeletionRequest(request.id, {
            status: 'escalated',
            escalationSentAt: new Date(),
            escalationMessageId: emailResult.messageId
          });
          console.log(`🚨 Escalation email sent to Roskomnadzor for request ${request.id}`);
          return true;
        } catch (dbError) {
          console.error(`❌ Database update failed after sending escalation email for request ${request.id}:`, dbError);
          // Email был отправлен, но статус не обновился - это критическая ошибка
          throw new Error(`Critical: Escalation email sent but database update failed for request ${request.id}`);
        }
      } else {
        console.error(`❌ Failed to send escalation email for request ${request.id}:`, emailResult.error);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error in sendEscalationEmail for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Получение статистики работы планировщика
   */
  async getAutomationStats(): Promise<{
    isRunning: boolean;
    pendingFollowUps: number;
    pendingEscalations: number;
    totalProcessedToday: number;
  }> {
    try {
      // Подсчитываем ожидающие follow-up emails
      const pendingFollowUps = await storage.getDeletionRequests({
        status: 'sent_initial',
        olderThanDays: 30,
        withoutInboundEmails: true
      });

      // Подсчитываем ожидающие эскалации
      const pendingEscalations = await storage.getDeletionRequests({
        olderThanDays: 60,
        operatorNotConfirmed: true
      });

      // Фильтруем уже эскалированные
      const realPendingEscalations = pendingEscalations.filter(req => 
        req.status !== 'escalated' && !(req as any).escalationSentAt
      );

      // TODO: Добавить подсчет сегодняшних отправок из логов или отдельной таблицы
      const totalProcessedToday = 0;

      return {
        isRunning: this.isRunning,
        pendingFollowUps: pendingFollowUps.length,
        pendingEscalations: realPendingEscalations.length,
        totalProcessedToday
      };
    } catch (error) {
      console.error('❌ Error getting automation stats:', error);
      return {
        isRunning: this.isRunning,
        pendingFollowUps: 0,
        pendingEscalations: 0,
        totalProcessedToday: 0
      };
    }
  }

  /**
   * Ручной запуск обработки email automation (для тестирования)
   */
  async manualAutomationCheck(): Promise<void> {
    console.log('🔧 Manual email automation check initiated...');
    await this.processEmailAutomation();
  }

  /**
   * Fallback метод для отправки повторного письма (старым способом)
   */
  private async sendFollowUpEmailLegacy(request: DeletionRequest): Promise<boolean> {
    try {
      const { renderTemplate } = await import('./email');
      
      // Получаем данные пользователя для email
      const userProfile = await storage.getUserProfile(request.userId);
      const userAccount = await storage.getUserAccountById(request.userId);
      
      if (!userAccount) {
        console.error(`❌ User account not found for deletion request ${request.id}`);
        return false;
      }

      // Подготавливаем данные для шаблона
      const emailData: EmailData = {
        senderName: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || userAccount.email.split('@')[0],
        senderEmail: userAccount.email,
        senderPhone: userProfile?.phone || undefined,
        brokerName: request.brokerName,
        brokerUrl: (request.requestDetails as any)?.brokerUrl || '',
        personalData: (request.requestDetails as any)?.personalData || [],
        requestDate: request.createdAt?.toLocaleDateString('ru-RU') || new Date().toLocaleDateString('ru-RU'),
        legalBasis: 'ст. 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"'
      };

      // Рендерим шаблон
      const renderedTemplate = renderTemplate(followUpDeletionTemplate, emailData);

      // Отправляем email
      const emailResult = await sendEmail({
        to: request.operatorEmail || 'data.protection@unknown-operator.ru',
        template: renderedTemplate,
        data: emailData,
        userId: request.userId,
        deletionRequestId: request.id,
        category: 'deletion_follow_up'
      });

      if (emailResult.success) {
        await storage.updateDeletionRequest(request.id, {
          status: 'followup_sent',
          followUpSentAt: new Date(),
          followUpMessageId: emailResult.messageId
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`❌ Error in legacy follow-up email for request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Fallback метод для отправки эскалации (старым способом)
   */
  private async sendEscalationEmailLegacy(request: DeletionRequest): Promise<boolean> {
    try {
      const { renderTemplate } = await import('./email');
      
      // Получаем данные пользователя для email
      const userProfile = await storage.getUserProfile(request.userId);
      const userAccount = await storage.getUserAccountById(request.userId);
      
      if (!userAccount) {
        console.error(`❌ User account not found for deletion request ${request.id}`);
        return false;
      }

      // Подготавливаем данные для шаблона эскалации
      const emailData: EmailData = {
        senderName: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || userAccount.email.split('@')[0],
        senderEmail: userAccount.email,
        senderPhone: userProfile?.phone || undefined,
        brokerName: request.brokerName,
        brokerUrl: (request.requestDetails as any)?.brokerUrl || '',
        personalData: (request.requestDetails as any)?.personalData || [],
        requestDate: request.createdAt?.toLocaleDateString('ru-RU') || new Date().toLocaleDateString('ru-RU'),
        legalBasis: 'ст. 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"'
      };

      // Рендерим шаблон эскалации
      const renderedTemplate = renderTemplate(regulatorEscalationTemplate, emailData);

      // Отправляем в Роскомнадзор
      const roskomnadzorEmail = process.env.ROSKOMNADZOR_EMAIL || 'complaints@rkn.gov.ru';
      
      const emailResult = await sendEmail({
        to: roskomnadzorEmail,
        template: renderedTemplate,
        data: emailData,
        userId: request.userId,
        deletionRequestId: request.id,
        category: 'regulator_escalation'
      });

      if (emailResult.success) {
        await storage.updateDeletionRequest(request.id, {
          status: 'escalated',
          escalationSentAt: new Date(),
          escalationMessageId: emailResult.messageId
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`❌ Error in legacy escalation email for request ${request.id}:`, error);
      return false;
    }
  }
}

// Экспортируем singleton instance
export const emailAutomationScheduler = EmailAutomationScheduler.getInstance();
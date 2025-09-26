import crypto from 'crypto';
import type { IStorage } from './storage';
import type { 
  EvidenceType, 
  EvidenceCollection, 
  InsertEvidenceCollection,
  DeletionRequest,
  InboundEmail,
  ViolationType 
} from '@shared/schema';

/**
 * Структура данных доказательства для Evidence Collection
 */
export interface EvidenceData {
  // Основные данные
  title: string;                    // Заголовок доказательства
  description: string;              // Описание доказательства
  content: any;                     // Основное содержимое (email, violation data, etc.)
  
  // Метаданные источника
  sourceType: 'email' | 'analysis' | 'manual' | 'system';
  sourceId?: string;                // ID источника (email ID, analysis ID, etc.)
  
  // Юридическая информация
  legalBasisViolated?: string[];    // Нарушенные статьи ФЗ-152
  violationType?: ViolationType[];  // Типы нарушений
  
  // Техническая информация
  ipAddress?: string;               // IP адрес источника
  userAgent?: string;               // User-Agent
  emailHeaders?: Record<string, any>; // Email headers для email evidence
  
  // Временные метки
  originalTimestamp: Date;          // Оригинальная временная метка события
  collectionTimestamp: Date;        // Время сбора доказательства
}

/**
 * Результат верификации целостности доказательств
 */
export interface IntegrityVerificationResult {
  isValid: boolean;
  errors: string[];
  chainLength: number;
  verifiedAt: Date;
  details: {
    contentHashValid: boolean;
    previousHashValid: boolean;
    chainHashValid: boolean;
    timestampHashValid: boolean;
    digitalFingerprintValid: boolean;
    verificationHashValid: boolean;
  };
}

/**
 * Результат сбора доказательств
 */
export interface EvidenceCollectionResult {
  success: boolean;
  error?: string;
  evidenceId?: string;
  contentHash?: string;
  chainPosition?: number;
  integrityVerified?: boolean;
}

/**
 * Evidence Collection Service для криптографического сбора доказательств нарушений
 * 
 * Основные функции:
 * - Криптографический сбор доказательств с SHA-256 хэшированием
 * - Hash chaining как альтернатива блокчейну
 * - Верификация целостности данных
 * - Digital fingerprinting для уникальной идентификации
 * - Timestamp verification для подтверждения времени создания
 * - Создание audit trail для всех взаимодействий
 */
export class EvidenceCollector {
  private readonly hashAlgorithm = 'sha256';
  private readonly timestampFormat = 'iso';
  private readonly serverSecret: string;
  private storage: IStorage;
  
  constructor(storage: IStorage) {
    this.storage = storage;
    
    // Критическая проверка безопасности для production
    const isProduction = process.env.NODE_ENV === 'production';
    const secret = process.env.EVIDENCE_SERVER_SECRET;
    
    if (!secret) {
      const errorMsg = 'CRITICAL SECURITY ERROR: EVIDENCE_SERVER_SECRET is required!';
      console.error('❌ ' + errorMsg);
      
      if (isProduction) {
        throw new Error(errorMsg + ' Cannot start in production without proper secret.');
      }
      
      // В development используем слабый секрет с предупреждением
      console.warn('⚠️ WARNING: Using weak development secret. NEVER use in production!');
      this.serverSecret = 'dev_weak_secret_only_for_testing';
    } else {
      // Проверка силы секрета
      if (secret.length < 32) {
        const errorMsg = 'SECURITY ERROR: EVIDENCE_SERVER_SECRET must be at least 32 characters long!';
        console.error('❌ ' + errorMsg);
        
        if (isProduction) {
          throw new Error(errorMsg + ' Current length: ' + secret.length);
        }
        
        console.warn('⚠️ WARNING: Secret is too short for secure operation!');
      }
      
      // Проверка на слабые пароли
      const weakPasswords = ['password', '123456', 'secret', 'test', 'fallback', 'change_me', 'default'];
      const secretLower = secret.toLowerCase();
      
      if (weakPasswords.some(weak => secretLower.includes(weak))) {
        const errorMsg = 'SECURITY ERROR: EVIDENCE_SERVER_SECRET contains weak patterns!';
        console.error('❌ ' + errorMsg);
        
        if (isProduction) {
          throw new Error(errorMsg + ' Use a strong, randomly generated secret.');
        }
        
        console.warn('⚠️ WARNING: Secret contains weak patterns!');
      }
      
      this.serverSecret = secret;
      console.log('✅ EVIDENCE_SERVER_SECRET validation passed');
    }
  }

  /**
   * Получение информации о безопасности секрета
   * Для мониторинга и аудита
   */
  public getSecurityInfo(): {
    hasSecret: boolean;
    secretLength: number;
    isStrongSecret: boolean;
    environment: string;
  } {
    return {
      hasSecret: !!process.env.EVIDENCE_SERVER_SECRET,
      secretLength: this.serverSecret?.length || 0,
      isStrongSecret: this.serverSecret && this.serverSecret.length >= 32 && 
                      !['password', '123456', 'secret', 'test', 'fallback', 'change_me', 'default']
                        .some(weak => this.serverSecret.toLowerCase().includes(weak)),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  /**
   * Основной метод сбора доказательств
   */
  async collectEvidence(
    deletionRequestId: string,
    evidenceType: EvidenceType,
    evidenceData: EvidenceData,
    collectedBy?: string
  ): Promise<EvidenceCollectionResult> {
    try {
      console.log(`🔍 Collecting evidence: ${evidenceType} for request ${deletionRequestId}`);
      
      // Валидация входных данных
      if (!deletionRequestId || !evidenceType || !evidenceData) {
        return {
          success: false,
          error: 'Missing required parameters for evidence collection'
        };
      }

      // Получить предыдущее доказательство в цепочке для данного запроса с блокировкой
      const previousEvidence = await this.storage.getLastEvidenceInChainWithLock(deletionRequestId);
      
      // Генерация криптографических хэшей
      const contentHash = this.generateContentHash(evidenceData);
      const timestampHash = this.generateTimestampHash(evidenceData.collectionTimestamp);
      const digitalFingerprint = this.generateDigitalFingerprint(evidenceData, contentHash);
      
      // Создание hash chain
      const previousHash = previousEvidence?.contentHash || null;
      const hashChain = this.generateHashChain(contentHash, previousHash, timestampHash);
      
      // Создание верификационного хэша
      const verificationHash = this.generateVerificationHash({
        contentHash,
        previousHash,
        hashChain,
        timestampHash,
        digitalFingerprint,
        evidenceType,
        deletionRequestId
      });

      // Создание verification signature для дополнительной защиты
      const verificationSignature = this.generateVerificationSignature({
        contentHash,
        hashChain,
        timestampHash,
        digitalFingerprint,
        evidenceType,
        collectionTimestamp: evidenceData.collectionTimestamp.toISOString()
      });

      // Подготовка legal metadata
      const chainPosition = previousEvidence ? (previousEvidence.legalMetadata?.chain_position || 0) + 1 : 1;
      const legalMetadata = {
        collection_timestamp: evidenceData.collectionTimestamp.toISOString(),
        legal_basis_violated: evidenceData.legalBasisViolated || [],
        evidence_classification: this.classifyEvidence(evidenceType, evidenceData),
        chain_position: chainPosition,
        hash_algorithm: this.hashAlgorithm,
        collection_method: evidenceData.sourceType,
        audit_trail_id: `audit_${deletionRequestId}_${Date.now()}`,
        crypto_verification: {
          content_hash_algorithm: this.hashAlgorithm,
          timestamp_hash_algorithm: this.hashAlgorithm,
          chain_hash_algorithm: this.hashAlgorithm,
          digital_fingerprint_algorithm: this.hashAlgorithm,
          verification_hash_algorithm: this.hashAlgorithm,
          collected_at: new Date().toISOString()
        }
      };

      // Создание записи доказательства
      const evidenceRecord: InsertEvidenceCollection = {
        deletionRequestId,
        evidenceType,
        evidenceData: evidenceData as any, // JSON data
        contentHash,
        previousHash,
        hashChain,
        verificationSignature,
        digitalFingerprint,
        timestampHash,
        collectionSource: evidenceData.sourceType,
        collectedBy: collectedBy || 'system',
        verificationHash,
        legalMetadata
      };

      // Атомарное сохранение в базу данных с предотвращением race conditions
      const savedEvidence = await this.storage.createEvidenceCollectionAtomic(evidenceRecord, deletionRequestId);
      
      if (!savedEvidence) {
        return {
          success: false,
          error: 'Failed to save evidence to database'
        };
      }

      // Верификация целостности сразу после сохранения
      const integrityCheck = await this.verifyEvidenceIntegrity(savedEvidence.id);
      
      console.log(`✅ Evidence collected successfully: ${savedEvidence.id} (integrity: ${integrityCheck.isValid})`);
      
      return {
        success: true,
        evidenceId: savedEvidence.id,
        contentHash,
        chainPosition,
        integrityVerified: integrityCheck.isValid
      };

    } catch (error: any) {
      console.error(`❌ Error collecting evidence for request ${deletionRequestId}:`, error);
      return {
        success: false,
        error: `Evidence collection failed: ${error.message}`
      };
    }
  }

  /**
   * Canonical JSON serialization для криптографической стойкости
   */
  private canonicalJsonStringify(obj: any): string {
    if (obj === null) return 'null';
    if (typeof obj !== 'object') return JSON.stringify(obj);
    if (Array.isArray(obj)) {
      return '[' + obj.map(item => this.canonicalJsonStringify(item)).join(',') + ']';
    }
    
    // Sort object keys for canonical representation
    const sortedKeys = Object.keys(obj).sort();
    const pairs = sortedKeys.map(key => 
      JSON.stringify(key) + ':' + this.canonicalJsonStringify(obj[key])
    );
    return '{' + pairs.join(',') + '}';
  }

  /**
   * Генерация HMAC-SHA256 хэша содержимого доказательства с server secret
   */
  private generateContentHash(evidenceData: EvidenceData): string {
    // Создаем нормализованные данные с email headers если есть
    const contentData = {
      title: evidenceData.title,
      description: evidenceData.description,
      content: evidenceData.content,
      sourceType: evidenceData.sourceType,
      sourceId: evidenceData.sourceId || null,
      legalBasisViolated: evidenceData.legalBasisViolated?.sort() || [],
      violationType: evidenceData.violationType?.sort() || [],
      originalTimestamp: evidenceData.originalTimestamp.toISOString(),
      emailHeaders: evidenceData.emailHeaders || null // включаем email headers в digest
    };
    
    // Используем canonical JSON serialization
    const normalizedContent = this.canonicalJsonStringify(contentData);
    
    // Используем HMAC с server secret вместо простого SHA-256
    return crypto.createHmac(this.hashAlgorithm, this.serverSecret)
                 .update(normalizedContent, 'utf8')
                 .digest('hex');
  }

  /**
   * Генерация HMAC хэша временной метки для защиты от подделки
   */
  private generateTimestampHash(timestamp: Date): string {
    const timestampString = timestamp.toISOString();
    const salt = process.env.EVIDENCE_TIMESTAMP_SALT || 'rescrub_evidence_salt_2024';
    const combinedString = `${timestampString}:${salt}`;
    
    return crypto.createHmac(this.hashAlgorithm, this.serverSecret)
                 .update(combinedString, 'utf8')
                 .digest('hex');
  }

  /**
   * Генерация HMAC цифровой подписи (digital fingerprint)
   */
  private generateDigitalFingerprint(evidenceData: EvidenceData, contentHash: string): string {
    const fingerprintData = {
      contentHash,
      sourceType: evidenceData.sourceType,
      collectionTimestamp: evidenceData.collectionTimestamp.toISOString(),
      originalTimestamp: evidenceData.originalTimestamp.toISOString(),
      systemFingerprint: process.env.SYSTEM_FINGERPRINT || 'rescrub_evidence_system',
      ipAddress: evidenceData.ipAddress || null,
      userAgent: evidenceData.userAgent || null
    };

    const fingerprintString = this.canonicalJsonStringify(fingerprintData);
    return crypto.createHmac(this.hashAlgorithm, this.serverSecret)
                 .update(fingerprintString, 'utf8')
                 .digest('hex');
  }

  /**
   * Создание HMAC hash chain - цепочки хэшей как альтернативы блокчейну
   */
  generateHashChain(contentHash: string, previousHash: string | null, timestampHash: string): string {
    let chainInput: string;
    
    if (previousHash) {
      // Создаем цепочку: previousHash + contentHash + timestampHash
      chainInput = `${previousHash}:${contentHash}:${timestampHash}`;
    } else {
      // Первый элемент в цепочке (genesis)
      chainInput = `genesis:${contentHash}:${timestampHash}`;
    }
    
    return crypto.createHmac(this.hashAlgorithm, this.serverSecret)
                 .update(chainInput, 'utf8')
                 .digest('hex');
  }

  /**
   * Создание комплексного HMAC верификационного хэша
   */
  private generateVerificationHash(data: {
    contentHash: string;
    previousHash: string | null;
    hashChain: string;
    timestampHash: string;
    digitalFingerprint: string;
    evidenceType: string;
    deletionRequestId: string;
  }): string {
    const verificationData = this.canonicalJsonStringify(data);
    return crypto.createHmac(this.hashAlgorithm, this.serverSecret)
                 .update(verificationData, 'utf8')
                 .digest('hex');
  }

  /**
   * Создание verification signature для дополнительной защиты целостности
   */
  private generateVerificationSignature(data: {
    contentHash: string;
    hashChain: string;
    timestampHash: string;
    digitalFingerprint: string;
    evidenceType: string;
    collectionTimestamp: string;
  }): string {
    const signatureData = this.canonicalJsonStringify({
      ...data,
      systemId: process.env.SYSTEM_FINGERPRINT || 'rescrub_evidence_system',
      algorithm: this.hashAlgorithm
    });
    
    // Используем двойную HMAC подпись для дополнительной защиты
    const firstHmac = crypto.createHmac(this.hashAlgorithm, this.serverSecret)
                           .update(signatureData, 'utf8')
                           .digest('hex');
                           
    return crypto.createHmac(this.hashAlgorithm, `${this.serverSecret}:verification`)
                 .update(firstHmac, 'utf8')
                 .digest('hex');
  }

  /**
   * Классификация типа доказательства для юридических целей
   */
  private classifyEvidence(evidenceType: EvidenceType, evidenceData: EvidenceData): string {
    const classifications = {
      'EMAIL_RESPONSE': 'Письменный ответ оператора персональных данных',
      'VIOLATION_DETECTED': 'Обнаруженное нарушение требований ФЗ-152',
      'OPERATOR_REFUSAL': 'Отказ в удалении персональных данных',
      'LEGAL_BASIS_INVALID': 'Недопустимые правовые основания обработки ПД',
      'DELAY_VIOLATION_PROOF': 'Доказательство нарушения установленных сроков',
      'EMAIL_HEADERS': 'Технические заголовки электронной корреспонденции',
      'TIMESTAMP_VERIFICATION': 'Подтверждение временных меток',
      'DECISION_ENGINE_ACTION': 'Автоматическое решение системы обработки',
      'MANUAL_COLLECTION': 'Доказательства, собранные вручную',
      'AUTO_ANALYSIS_RESULT': 'Результаты автоматического анализа'
    };

    return classifications[evidenceType] || 'Неклассифицированное доказательство';
  }

  /**
   * Получение последнего доказательства в цепочке для данного запроса
   */
  private async getLastEvidenceInChain(deletionRequestId: string): Promise<EvidenceCollection | null> {
    try {
      const evidenceList = await this.storage.getEvidenceCollectionByRequestId(deletionRequestId);
      if (!evidenceList || evidenceList.length === 0) {
        return null;
      }

      // Сортируем по времени создания и берем последнее
      return evidenceList.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
    } catch (error) {
      console.error('Error getting last evidence in chain:', error);
      return null;
    }
  }

  /**
   * Верификация целостности одного доказательства
   */
  async verifyEvidenceIntegrity(evidenceId: string): Promise<IntegrityVerificationResult> {
    try {
      const evidence = await this.storage.getEvidenceCollectionById(evidenceId);
      if (!evidence) {
        return {
          isValid: false,
          errors: ['Evidence not found'],
          chainLength: 0,
          verifiedAt: new Date(),
          details: {
            contentHashValid: false,
            previousHashValid: false,
            chainHashValid: false,
            timestampHashValid: false,
            digitalFingerprintValid: false,
            verificationHashValid: false
          }
        };
      }

      const errors: string[] = [];
      const details = {
        contentHashValid: false,
        previousHashValid: false,
        chainHashValid: false,
        timestampHashValid: false,
        digitalFingerprintValid: false,
        verificationHashValid: false
      };

      // 1. Проверка content hash
      try {
        const recalculatedContentHash = this.generateContentHash(evidence.evidenceData as EvidenceData);
        details.contentHashValid = recalculatedContentHash === evidence.contentHash;
        if (!details.contentHashValid) {
          errors.push('Content hash verification failed');
        }
      } catch (error) {
        errors.push(`Content hash verification error: ${error}`);
      }

      // 2. Проверка timestamp hash
      try {
        const timestamp = new Date(evidence.timestamp);
        const recalculatedTimestampHash = this.generateTimestampHash(timestamp);
        details.timestampHashValid = recalculatedTimestampHash === evidence.timestampHash;
        if (!details.timestampHashValid) {
          errors.push('Timestamp hash verification failed');
        }
      } catch (error) {
        errors.push(`Timestamp hash verification error: ${error}`);
      }

      // 3. Проверка digital fingerprint
      try {
        const recalculatedFingerprint = this.generateDigitalFingerprint(
          evidence.evidenceData as EvidenceData, 
          evidence.contentHash
        );
        details.digitalFingerprintValid = recalculatedFingerprint === evidence.digitalFingerprint;
        if (!details.digitalFingerprintValid) {
          errors.push('Digital fingerprint verification failed');
        }
      } catch (error) {
        errors.push(`Digital fingerprint verification error: ${error}`);
      }

      // 4. Проверка hash chain
      try {
        const recalculatedHashChain = this.generateHashChain(
          evidence.contentHash,
          evidence.previousHash,
          evidence.timestampHash
        );
        details.chainHashValid = recalculatedHashChain === evidence.hashChain;
        if (!details.chainHashValid) {
          errors.push('Hash chain verification failed');
        }
      } catch (error) {
        errors.push(`Hash chain verification error: ${error}`);
      }

      // 5. Проверка previous hash (если есть)
      if (evidence.previousHash) {
        try {
          const allEvidence = await this.storage.getEvidenceCollectionByRequestId(evidence.deletionRequestId);
          const previousEvidence = allEvidence?.find(e => e.contentHash === evidence.previousHash);
          details.previousHashValid = !!previousEvidence;
          if (!details.previousHashValid) {
            errors.push('Previous hash reference not found');
          }
        } catch (error) {
          errors.push(`Previous hash verification error: ${error}`);
        }
      } else {
        details.previousHashValid = true; // Genesis block
      }

      // 6. Проверка verification hash
      try {
        const recalculatedVerificationHash = this.generateVerificationHash({
          contentHash: evidence.contentHash,
          previousHash: evidence.previousHash,
          hashChain: evidence.hashChain,
          timestampHash: evidence.timestampHash,
          digitalFingerprint: evidence.digitalFingerprint,
          evidenceType: evidence.evidenceType,
          deletionRequestId: evidence.deletionRequestId
        });
        details.verificationHashValid = recalculatedVerificationHash === evidence.verificationHash;
        if (!details.verificationHashValid) {
          errors.push('Verification hash mismatch');
        }
      } catch (error) {
        errors.push(`Verification hash error: ${error}`);
      }

      // Получаем длину цепочки
      const chainLength = await this.getChainLength(evidence.deletionRequestId);

      const isValid = errors.length === 0;

      return {
        isValid,
        errors,
        chainLength,
        verifiedAt: new Date(),
        details
      };

    } catch (error: any) {
      return {
        isValid: false,
        errors: [`Integrity verification failed: ${error.message}`],
        chainLength: 0,
        verifiedAt: new Date(),
        details: {
          contentHashValid: false,
          previousHashValid: false,
          chainHashValid: false,
          timestampHashValid: false,
          digitalFingerprintValid: false,
          verificationHashValid: false
        }
      };
    }
  }

  /**
   * Верификация целостности всей цепочки доказательств для запроса
   */
  async verifyChainIntegrity(deletionRequestId: string): Promise<IntegrityVerificationResult[]> {
    try {
      const evidenceList = await this.storage.getEvidenceCollectionByRequestId(deletionRequestId);
      if (!evidenceList || evidenceList.length === 0) {
        return [];
      }

      // Сортируем по времени создания
      const sortedEvidence = evidenceList.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Проверяем каждое доказательство
      const verificationResults: IntegrityVerificationResult[] = [];
      
      for (const evidence of sortedEvidence) {
        const result = await this.verifyEvidenceIntegrity(evidence.id);
        verificationResults.push(result);
      }

      return verificationResults;

    } catch (error: any) {
      console.error(`Error verifying chain integrity for request ${deletionRequestId}:`, error);
      return [];
    }
  }

  /**
   * Получение длины цепочки доказательств
   */
  async getChainLength(deletionRequestId: string): Promise<number> {
    try {
      const evidenceList = await this.storage.getEvidenceCollectionByRequestId(deletionRequestId);
      return evidenceList?.length || 0;
    } catch (error) {
      console.error('Error getting chain length:', error);
      return 0;
    }
  }

  /**
   * Автоматический сбор доказательств из входящего email
   */
  async collectEmailEvidence(
    deletionRequestId: string,
    inboundEmail: InboundEmail
  ): Promise<EvidenceCollectionResult> {
    const evidenceData: EvidenceData = {
      title: `Email response from ${inboundEmail.operatorEmail}`,
      description: `Incoming email response regarding deletion request`,
      content: {
        subject: inboundEmail.subject,
        bodyText: inboundEmail.bodyText,
        bodyHtml: inboundEmail.bodyHtml,
        operatorEmail: inboundEmail.operatorEmail,
        responseType: inboundEmail.responseType,
        extractedData: inboundEmail.extractedData,
        violations: inboundEmail.violations,
        legitimacyScore: inboundEmail.legitimacyScore
      },
      sourceType: 'email',
      sourceId: inboundEmail.id,
      emailHeaders: inboundEmail.headers as Record<string, any>,
      violationType: inboundEmail.violations as ViolationType[],
      originalTimestamp: new Date(inboundEmail.receivedAt),
      collectionTimestamp: new Date()
    };

    return await this.collectEvidence(
      deletionRequestId,
      'EMAIL_RESPONSE',
      evidenceData,
      'system'
    );
  }

  /**
   * Автоматический сбор доказательств нарушений
   */
  async collectViolationEvidence(
    deletionRequestId: string,
    violations: ViolationType[],
    analysisData: any,
    sourceId?: string
  ): Promise<EvidenceCollectionResult> {
    const evidenceData: EvidenceData = {
      title: `Legal violations detected`,
      description: `Detected ${violations.length} violation(s) in operator response`,
      content: {
        violations,
        analysisData,
        detectionTimestamp: new Date().toISOString()
      },
      sourceType: 'analysis',
      sourceId: sourceId,
      violationType: violations,
      legalBasisViolated: this.mapViolationsToLegalBasis(violations),
      originalTimestamp: new Date(),
      collectionTimestamp: new Date()
    };

    return await this.collectEvidence(
      deletionRequestId,
      'VIOLATION_DETECTED',
      evidenceData,
      'system'
    );
  }

  /**
   * Сопоставление типов нарушений с правовыми основаниями ФЗ-152
   */
  private mapViolationsToLegalBasis(violations: ViolationType[]): string[] {
    const mapping: Record<ViolationType, string[]> = {
      'INVALID_LEGAL_BASIS': ['ст. 6 ФЗ-152', 'ст. 9 ФЗ-152'],
      'EXCESSIVE_RETENTION': ['ст. 5 ФЗ-152', 'ст. 21 ФЗ-152'],
      'MISSING_INFORMATION': ['ст. 14 ФЗ-152'],
      'DELAY_VIOLATION': ['ст. 14 ФЗ-152'],
      'PROCEDURAL_VIOLATION': ['ст. 14 ФЗ-152', 'ст. 21 ФЗ-152'],
      'PRIVACY_VIOLATION': ['ст. 5 ФЗ-152', 'ст. 6 ФЗ-152'],
      'CONSENT_VIOLATION': ['ст. 9 ФЗ-152'],
      'TRANSPARENCY_VIOLATION': ['ст. 14 ФЗ-152', 'ст. 18 ФЗ-152'],
      'SECURITY_VIOLATION': ['ст. 19 ФЗ-152']
    };

    const legalBasis = new Set<string>();
    violations.forEach(violation => {
      const basis = mapping[violation];
      if (basis) {
        basis.forEach(b => legalBasis.add(b));
      }
    });

    return Array.from(legalBasis);
  }
}

// Note: EvidenceCollector now requires storage parameter in constructor
// Use new EvidenceCollector(storage) instead of singleton pattern
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertTriangle, Settings, Play, FileText, Shield, Key, Users, TestTube, Code, Download, ChevronDown, ChevronRight } from "lucide-react";

export default function TestingMethodology() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const renderTestScenario = (scenario: any, index: number) => (
    <Card key={index} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{scenario.title}</CardTitle>
          <Badge variant={scenario.priority === 'critical' ? 'destructive' : 
                         scenario.priority === 'high' ? 'secondary' : 'outline'}>
            {scenario.priority}
          </Badge>
        </div>
        <CardDescription>{scenario.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Шаги выполнения:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              {scenario.steps.map((step: string, stepIndex: number) => (
                <li key={stepIndex}>{step}</li>
              ))}
            </ol>
          </div>
          <div>
            <h4 className="font-medium mb-2">Ожидаемый результат:</h4>
            <p className="text-sm text-muted-foreground">{scenario.expectedResult}</p>
          </div>
          {scenario.testData && (
            <div>
              <h4 className="font-medium mb-2">Тестовые данные:</h4>
              <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                {typeof scenario.testData === 'string' ? 
                  scenario.testData : 
                  JSON.stringify(scenario.testData, null, 2)
                }
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const responseAnalyzerTests = [
    {
      title: "Анализ положительного ответа оператора",
      description: "Тестирование определения положительного ответа на запрос удаления данных",
      priority: "critical",
      steps: [
        "Отправить запрос с текстом: 'Ваши данные успешно удалены из нашей системы'",
        "Проверить результат анализа ResponseAnalyzer",
        "Убедиться что confidence > 0.8 и тип POSITIVE"
      ],
      expectedResult: "ResponseAnalyzer должен корректно определить положительный ответ с высокой уверенностью",
      testData: {
        content: "Уважаемый клиент, сообщаем что ваши персональные данные удалены из базы данных",
        source: "email",
        timestamp: "2024-09-26T10:00:00Z"
      }
    },
    {
      title: "Анализ отрицательного ответа",
      description: "Проверка детекции отказа в удалении данных",
      priority: "critical",
      steps: [
        "Отправить запрос с отказом: 'Мы не можем удалить ваши данные'",
        "Проверить результат анализа",
        "Убедиться что тип NEGATIVE и есть флаг requiresEscalation"
      ],
      expectedResult: "Система должна определить отказ и инициировать эскалацию",
      testData: {
        content: "К сожалению, мы не можем удалить ваши данные по техническим причинам",
        source: "email"
      }
    },
    {
      title: "Анализ неопределенного ответа",
      description: "Тестирование обработки неясных или неполных ответов",
      priority: "high",
      steps: [
        "Отправить неясный ответ: 'Мы рассматриваем ваш запрос'",
        "Проверить что тип UNCERTAIN",
        "Убедиться что confidence < 0.6"
      ],
      expectedResult: "Ответ должен быть помечен как неопределенный для ручной проверки",
      testData: {
        content: "Ваш запрос находится в обработке, ожидайте дополнительной информации"
      }
    }
  ];

  const decisionEngineTests = [
    {
      title: "Автоматическое принятие решения (положительный ответ)",
      description: "Проверка автоматического закрытия кейса при положительном ответе",
      priority: "critical",
      steps: [
        "Создать DeletionRequest со статусом PENDING",
        "Подать положительный анализ от ResponseAnalyzer",
        "Вызвать DecisionEngine.makeDecision()",
        "Проверить что решение AUTO_CLOSE с высокой confidence"
      ],
      expectedResult: "Кейс должен быть автоматически закрыт без эскалации",
      testData: {
        analysisResult: {
          type: "POSITIVE",
          confidence: 0.95,
          evidenceFound: true
        }
      }
    },
    {
      title: "Эскалация при отрицательном ответе",
      description: "Проверка правильной эскалации при отказе оператора",
      priority: "critical",
      steps: [
        "Подать отрицательный анализ с requiresEscalation: true",
        "Проверить что решение ESCALATE_TO_REGULATOR",
        "Убедиться что создается EvidenceCollection"
      ],
      expectedResult: "Система должна инициировать эскалацию к регулятору",
      testData: {
        analysisResult: {
          type: "NEGATIVE",
          confidence: 0.9,
          requiresEscalation: true,
          violationType: "REFUSAL_TO_DELETE"
        }
      }
    },
    {
      title: "Обработка таймаута ответа",
      description: "Тестирование логики при отсутствии ответа в установленные сроки",
      priority: "high",
      steps: [
        "Создать запрос со статусом SENT более 30 дней назад",
        "Запустить DecisionEngine.checkTimeouts()",
        "Проверить что создается автоматическая эскалация"
      ],
      expectedResult: "При превышении сроков должна активироваться автоэскалация",
      testData: {
        requestAge: 31,
        lastContact: "2024-08-25T10:00:00Z"
      }
    }
  ];

  const evidenceCollectorTests = [
    {
      title: "Сбор доказательств email переписки",
      description: "Проверка сохранения всех email в качестве доказательств",
      priority: "critical",
      steps: [
        "Отправить email через систему",
        "Получить ответ от оператора",
        "Проверить что EvidenceCollector сохранил оба сообщения",
        "Убедиться в корректности метаданных (headers, timestamps)"
      ],
      expectedResult: "Все email должны быть сохранены с полными метаданными",
      testData: {
        emailChain: [
          "original_request.eml",
          "operator_response.eml",
          "follow_up.eml"
        ]
      }
    },
    {
      title: "Криптографическая подпись доказательств",
      description: "Проверка создания цифровых подписей для защиты доказательств",
      priority: "critical",
      steps: [
        "Собрать доказательство любого типа",
        "Проверить создание cryptoHash",
        "Верифицировать подпись через CryptoValidator",
        "Убедиться в невозможности модификации"
      ],
      expectedResult: "Все доказательства должны иметь валидные цифровые подписи",
      testData: {
        documentType: "EMAIL_EVIDENCE",
        expectedHashAlgorithm: "SHA-256"
      }
    },
    {
      title: "Автоматическое архивирование старых доказательств",
      description: "Проверка переноса старых доказательств в долгосрочное хранение",
      priority: "medium",
      steps: [
        "Создать доказательства старше retention period",
        "Запустить процесс архивирования",
        "Проверить перенос в архивное хранилище",
        "Убедиться в сохранности метаданных"
      ],
      expectedResult: "Старые доказательства должны быть заархивированы с сохранением доступности",
      testData: {
        retentionDays: 90,
        testEvidenceAge: 95
      }
    }
  ];

  const campaignManagerTests = [
    {
      title: "Создание новой кампании удаления данных",
      description: "Тестирование инициации процесса удаления персональных данных",
      priority: "critical",
      steps: [
        "Создать запрос через API с валидными данными пользователя",
        "Проверить создание DeletionRequest",
        "Убедиться в назначении уникального trackingId",
        "Проверить отправку первичного email"
      ],
      expectedResult: "Кампания должна быть создана и активирована автоматически",
      testData: {
        userEmail: "test@example.com",
        requestReason: "GDPR_COMPLIANCE",
        dataTypes: ["profile", "activity_logs", "preferences"]
      }
    },
    {
      title: "Управление состоянием кампании",
      description: "Проверка корректных переходов между статусами кампании",
      priority: "high",
      steps: [
        "Создать кампанию в статусе PENDING",
        "Перевести в SENT после отправки email",
        "Симулировать получение ответа и переход в COMPLETED",
        "Проверить корректность всех переходов"
      ],
      expectedResult: "Все переходы статусов должны быть логически корректными и записанными",
      testData: {
        statusFlow: ["PENDING", "SENT", "AWAITING_RESPONSE", "COMPLETED"]
      }
    }
  ];

  const emailAutomationTests = [
    {
      title: "Автоматическая отправка повторных запросов",
      description: "Проверка отправки follow-up emails согласно расписанию",
      priority: "high",
      steps: [
        "Создать запрос без ответа в течение 14 дней",
        "Запустить EmailAutomationScheduler",
        "Проверить отправку повторного письма",
        "Убедиться в корректном шаблоне и содержании"
      ],
      expectedResult: "Повторные письма должны отправляться автоматически по расписанию",
      testData: {
        followUpSchedule: [14, 21, 28],
        templateType: "FOLLOW_UP_REMINDER"
      }
    },
    {
      title: "Эскалация к регулятору",
      description: "Тестирование автоматической эскалации при нарушениях",
      priority: "critical",
      steps: [
        "Создать ситуацию требующую эскалации",
        "Проверить формирование письма регулятору",
        "Убедиться в приложении всех доказательств",
        "Проверить уведомление пользователя"
      ],
      expectedResult: "Эскалация должна включать полный пакет доказательств и соответствовать требованиям ФЗ-152",
      testData: {
        violationType: "REFUSAL_TO_DELETE",
        regulatorEmail: "regulator@rkn.gov.ru"
      }
    }
  ];

  const cryptoValidatorTests = [
    {
      title: "Валидация цифровых подписей ГОСТ",
      description: "Проверка работы с российскими криптографическими стандартами",
      priority: "critical",
      steps: [
        "Создать документ с подписью ГОСТ Р 34.10-2012",
        "Запустить CryptoValidator.validateSignature()",
        "Проверить корректность валидации",
        "Убедиться в соответствии российским стандартам"
      ],
      expectedResult: "Валидация должна корректно работать с ГОСТ сертификатами",
      testData: {
        signatureType: "GOST_R_34.10-2012",
        certPath: "/test/certificates/gost_test.cer"
      }
    },
    {
      title: "Проверка целостности доказательств",
      description: "Тестирование обнаружения модификации доказательств",
      priority: "critical",
      steps: [
        "Создать подписанное доказательство",
        "Модифицировать содержимое файла",
        "Запустить проверку целостности",
        "Убедиться в обнаружении модификации"
      ],
      expectedResult: "Любые изменения в доказательствах должны быть обнаружены",
      testData: {
        originalHash: "a1b2c3d4e5f6...",
        modifiedContent: "Modified evidence content"
      }
    }
  ];

  const fz152ComplianceTests = [
    {
      title: "Соблюдение сроков обработки запросов (30 дней)",
      description: "Проверка соответствия требованиям ФЗ-152 по срокам",
      priority: "critical",
      steps: [
        "Создать запрос и отследить время обработки",
        "Проверить автоматические напоминания на 14 и 21 день",
        "Убедиться в эскалации при превышении 30 дней",
        "Проверить уведомления заявителя на каждом этапе"
      ],
      expectedResult: "Все сроки должны соблюдаться согласно требованиям ФЗ-152",
      testData: {
        maxProcessingDays: 30,
        reminderDays: [14, 21],
        escalationDay: 31
      }
    },
    {
      title: "Защита персональных данных в процессе обработки",
      description: "Проверка что ПД не передаются внешним сервисам",
      priority: "critical",
      steps: [
        "Отправить запрос с персональными данными",
        "Проследить все API вызовы и логи",
        "Убедиться что ПД не отправляются в OpenAI или другие внешние сервисы",
        "Проверить локальную обработку данных"
      ],
      expectedResult: "Персональные данные должны обрабатываться только локально",
      testData: {
        personalData: {
          name: "Иван Иванов",
          email: "ivan@example.com",
          phone: "+7-900-123-45-67"
        }
      }
    },
    {
      title: "Ведение реестра операций с ПД",
      description: "Проверка полноты журналирования всех операций",
      priority: "high",
      steps: [
        "Выполнить различные операции с персональными данными",
        "Проверить записи в журнале операций",
        "Убедиться в наличии всех обязательных полей",
        "Проверить возможность аудита"
      ],
      expectedResult: "Все операции должны быть задокументированы согласно требованиям",
      testData: {
        requiredLogFields: ["timestamp", "operation", "user", "dataType", "purpose"]
      }
    }
  ];

  const operatorEmulationTests = [
    {
      title: "Эмуляция положительного ответа оператора",
      description: "Способы имитации различных типов ответов для тестирования",
      priority: "medium",
      steps: [
        "Использовать Mock Email Service для симуляции входящих писем",
        "Подготовить шаблоны различных типов ответов",
        "Настроить автоматические ответы с задержками",
        "Проверить реакцию системы на каждый тип"
      ],
      expectedResult: "Система должна корректно обрабатывать все типы эмулированных ответов",
      testData: {
        mockResponses: [
          "positive_deletion_confirmation.txt",
          "negative_refusal.txt",
          "partial_compliance.txt",
          "unclear_response.txt"
        ]
      }
    },
    {
      title: "Симуляция нарушений со стороны операторов",
      description: "Тестирование реакции системы на различные типы нарушений",
      priority: "high",
      steps: [
        "Симулировать отсутствие ответа в течение 30+ дней",
        "Эмулировать отказ без обоснования",
        "Имитировать частичное удаление данных",
        "Проверить правильность эскалации в каждом случае"
      ],
      expectedResult: "Все нарушения должны быть обнаружены и обработаны согласно процедурам",
      testData: {
        violationTypes: [
          "NO_RESPONSE_TIMEOUT",
          "UNJUSTIFIED_REFUSAL", 
          "PARTIAL_DELETION",
          "INVALID_JUSTIFICATION"
        ]
      }
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Методика испытаний САЗПД</h1>
          <p className="text-muted-foreground">
            Комплексная методика тестирования системы автоматизированной защиты персональных данных
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-blue-600">
            ФЗ-152 Testing
          </Badge>
          <Button variant="outline" size="sm" data-testid="button-download-methodology">
            <Download className="h-4 w-4 mr-2" />
            Скачать методику
          </Button>
        </div>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-blue-600" />
            Важные принципы тестирования САЗПД
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Соблюдение ФЗ-152:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Персональные данные не передаются внешним сервисам</li>
                <li>• Все операции логируются согласно требованиям</li>
                <li>• Соблюдаются сроки обработки запросов</li>
                <li>• Обеспечивается криптографическая защита</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Методология тестирования:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Тестирование проводится на изолированной среде</li>
                <li>• Используются синтетические тестовые данные</li>
                <li>• Проверяется каждый модуль в отдельности</li>
                <li>• Выполняется интеграционное тестирование</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules" data-testid="tab-modules">
            <TestTube className="h-4 w-4 mr-2" />
            Модули САЗПД
          </TabsTrigger>
          <TabsTrigger value="compliance" data-testid="tab-compliance">
            <Shield className="h-4 w-4 mr-2" />
            ФЗ-152 Compliance
          </TabsTrigger>
          <TabsTrigger value="crypto" data-testid="tab-crypto">
            <Key className="h-4 w-4 mr-2" />
            Криптография
          </TabsTrigger>
          <TabsTrigger value="emulation" data-testid="tab-emulation">
            <Users className="h-4 w-4 mr-2" />
            Эмуляция операторов
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          <div className="space-y-6">
            {/* Response Analyzer Tests */}
            <Collapsible open={openSections.responseAnalyzer} onOpenChange={() => toggleSection('responseAnalyzer')}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="hover:bg-muted/50 cursor-pointer">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        1. Анализатор ответов (Response Analyzer)
                      </div>
                      {openSections.responseAnalyzer ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CardTitle>
                    <CardDescription>
                      Тестирование модуля анализа ответов операторов на запросы удаления данных
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    {responseAnalyzerTests.map((test, index) => renderTestScenario(test, index))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Decision Engine Tests */}
            <Collapsible open={openSections.decisionEngine} onOpenChange={() => toggleSection('decisionEngine')}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="hover:bg-muted/50 cursor-pointer">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 mr-2" />
                        2. Движок решений (Decision Engine)
                      </div>
                      {openSections.decisionEngine ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CardTitle>
                    <CardDescription>
                      Тестирование автоматического принятия решений на основе анализа ответов
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    {decisionEngineTests.map((test, index) => renderTestScenario(test, index))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Evidence Collector Tests */}
            <Collapsible open={openSections.evidenceCollector} onOpenChange={() => toggleSection('evidenceCollector')}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="hover:bg-muted/50 cursor-pointer">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        3. Сборщик доказательств (Evidence Collector)
                      </div>
                      {openSections.evidenceCollector ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CardTitle>
                    <CardDescription>
                      Тестирование сбора и сохранения доказательств для соблюдения ФЗ-152
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    {evidenceCollectorTests.map((test, index) => renderTestScenario(test, index))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Campaign Manager Tests */}
            <Collapsible open={openSections.campaignManager} onOpenChange={() => toggleSection('campaignManager')}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="hover:bg-muted/50 cursor-pointer">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        4. Менеджер кампаний (Campaign Manager)
                      </div>
                      {openSections.campaignManager ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CardTitle>
                    <CardDescription>
                      Тестирование управления процессами удаления персональных данных
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    {campaignManagerTests.map((test, index) => renderTestScenario(test, index))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Email Automation Tests */}
            <Collapsible open={openSections.emailAutomation} onOpenChange={() => toggleSection('emailAutomation')}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="hover:bg-muted/50 cursor-pointer">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Play className="h-5 w-5 mr-2" />
                        5. Email автоматизация (Email Automation)
                      </div>
                      {openSections.emailAutomation ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CardTitle>
                    <CardDescription>
                      Тестирование автоматической отправки писем и эскалации
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    {emailAutomationTests.map((test, index) => renderTestScenario(test, index))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Crypto Validator Tests */}
            <Collapsible open={openSections.cryptoValidator} onOpenChange={() => toggleSection('cryptoValidator')}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="hover:bg-muted/50 cursor-pointer">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Key className="h-5 w-5 mr-2" />
                        6. Крипто-валидатор (Crypto Validator)
                      </div>
                      {openSections.cryptoValidator ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CardTitle>
                    <CardDescription>
                      Тестирование криптографических функций и валидации подписей
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    {cryptoValidatorTests.map((test, index) => renderTestScenario(test, index))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Тест-кейсы соответствия ФЗ-152</CardTitle>
              <CardDescription>
                Проверка соблюдения требований федерального закона о персональных данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fz152ComplianceTests.map((test, index) => renderTestScenario(test, index))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Тестирование криптографических функций</CardTitle>
              <CardDescription>
                Проверка работы с цифровыми подписями и сертификатами ГОСТ
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cryptoValidatorTests.map((test, index) => renderTestScenario(test, index))}
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Инструкции по настройке тестового окружения</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">Подготовка тестовых сертификатов:</h4>
                  <pre className="text-sm overflow-x-auto">
{`# Создание тестового сертификата ГОСТ
openssl genpkey -algorithm gost2012_256 -out test_private.key
openssl req -new -x509 -key test_private.key -out test_cert.crt -days 365

# Проверка сертификата
openssl x509 -in test_cert.crt -text -noout`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emulation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Эмуляция ответов операторов</CardTitle>
              <CardDescription>
                Методы имитации различных сценариев поведения операторов для тестирования
              </CardDescription>
            </CardHeader>
            <CardContent>
              {operatorEmulationTests.map((test, index) => renderTestScenario(test, index))}
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mock Email Service Configuration</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">Пример конфигурации для тестирования:</h4>
                  <pre className="text-sm overflow-x-auto">
{`{
  "mockEmailService": {
    "enabled": true,
    "autoResponseDelay": "1-24h",
    "responseTemplates": {
      "positive": "templates/positive_response.txt",
      "negative": "templates/negative_response.txt", 
      "unclear": "templates/unclear_response.txt"
    },
    "violationScenarios": {
      "timeout": { "enabled": true, "days": 31 },
      "refusal": { "enabled": true, "reason": "technical" },
      "partial": { "enabled": true, "percentage": 50 }
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
            Критерии успешного прохождения тестирования
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Обязательные требования:</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Все модули САЗПД работают без критических ошибок
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Соблюдение всех требований ФЗ-152
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Корректная работа криптографических функций
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Полное логирование всех операций
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Показатели качества:</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Точность анализа ответов {">"} 95%
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Время обработки запроса {"<"} 24 часов
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Доступность системы {">"} 99.9%
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Соответствие ГОСТ по криптографии 100%
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
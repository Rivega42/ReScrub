import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  CheckCircle,
  ArrowRight,
  Code,
  Database,
  Shield,
  Zap,
  Copy,
  ExternalLink,
  Book,
  Terminal,
  Key,
  Globe,
  Server,
  FileText
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessDocsSEO } from "@/components/BusinessSEO";

export default function BusinessAPI() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessDocsSEO 
        title="API документация — ResCrub Business Platform"
        description="Полная REST API документация ResCrub Business. OpenAPI 3.0 спецификация, SDK библиотеки, webhook интеграции для автоматизации 152фз compliance в ваших системах."
        author="ResCrub API Team"
        publishedTime="2024-12-01"
        modifiedTime={new Date().toISOString()}
        neuralSignals={{
          primaryKeywords: ['API документация 152фз', 'REST API защита персональных данных', 'SDK интеграция compliance'],
          searchIntent: 'informational',
          contentDepth: 'expert',
          expertiseLevel: 9
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['корпоративный API 152фз', 'REST API для бизнес систем', 'SDK интеграция для предприятий'],
            semantic: ['интеграция защиты данных в бизнес', 'корпоративный API персональных данных', 'enterprise REST API'],
            longTail: ['как интегрировать корпоративный API защиты персональных данных в бизнес системы']
          }
        }}
        botHints={{
          contentStructure: {
            hasTableOfContents: true,
            hasStepByStep: true,
            hasResources: true,
            hasFAQ: true,
            hasComparison: false
          }
        }}
      />
      
      <BusinessHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-2 mb-6">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    API документация
                  </Badge>
                  <Badge variant="secondary">
                    v2.1.0
                  </Badge>
                  <Badge variant="outline">
                    OpenAPI 3.0
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  ResCrub Business 
                  <span className="text-primary"> API</span>
                </h1>
                
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                  Полная REST API документация для интеграции ResCrub Business в ваши системы. 
                  OpenAPI 3.0 спецификация, официальные SDK, webhook endpoints и примеры кода 
                  для автоматизации соблюдения 152фз.
                </p>
                
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                  <Button size="lg" className="gap-2">
                    <Terminal className="h-4 w-4" />
                    Быстрый старт
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Book className="h-4 w-4" />
                    OpenAPI спецификация
                  </Button>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    REST API с JSON
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Официальные SDK
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Webhook интеграции
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Подписи сообщений
                  </div>
                </div>
              </div>
              
              <div className="mt-10 lg:col-span-4 lg:mt-0">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-lg">API endpoints</CardTitle>
                    <CardDescription>
                      Основные категории API методов
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Управление согласиями</span>
                      <Badge variant="outline">12 методов</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Атомаризация данных</span>
                      <Badge variant="outline">8 методов</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Мониторинг compliance</span>
                      <Badge variant="outline">15 методов</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Аналитика и отчеты</span>
                      <Badge variant="outline">6 методов</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Управление пользователями</span>
                      <Badge variant="outline">10 методов</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Webhook управление</span>
                      <Badge variant="outline">4 метода</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Быстрый старт
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Начните интеграцию с ResCrub API за 5 минут
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Key className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>1. Получите API ключ</CardTitle>
                      <Badge variant="secondary" className="mt-1">30 секунд</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Зарегистрируйтесь в ResCrub Business и создайте API ключ 
                    в разделе настроек интеграций.
                  </CardDescription>
                  <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                    <code>API_KEY=rscb_live_1234567890abcdef</code>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <Code className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>2. Установите SDK</CardTitle>
                      <Badge variant="secondary" className="mt-1">1 минута</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Используйте официальные SDK или напрямую работайте с REST API.
                  </CardDescription>
                  <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                    <code>npm install @rescrub/business-sdk</code>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>3. Первый запрос</CardTitle>
                      <Badge variant="secondary" className="mt-1">2 минуты</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Выполните первый API вызов для создания согласия пользователя.
                  </CardDescription>
                  <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                    <code>client.consent.create({'{...}'})</code>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* API Documentation */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Основные API методы
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Примеры самых используемых endpoint'ов
              </p>
            </div>
            
            <div className="mt-16">
              <Tabs defaultValue="consent" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="consent">Согласия</TabsTrigger>
                  <TabsTrigger value="atomization">Атомаризация</TabsTrigger>
                  <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
                  <TabsTrigger value="analytics">Аналитика</TabsTrigger>
                </TabsList>
                
                <TabsContent value="consent" className="mt-8">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="default" className="text-xs">POST</Badge>
                          /api/v2/consent
                        </CardTitle>
                        <CardDescription>
                          Создание нового согласия пользователя
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Пример запроса</h4>
                            <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              <code>
{`{
  "user_id": "usr_12345",
  "consents": {
    "analytics": true,
    "marketing": false,
    "personalization": true,
    "cookies_necessary": true
  },
  "consent_method": "explicit",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "timestamp": "2025-09-21T16:00:00Z"
}`}
                              </code>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Ответ</h4>
                            <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              <code>
{`{
  "consent_id": "consent_67890",
  "status": "active",
  "created_at": "2025-09-21T16:00:00Z",
  "expires_at": "2026-09-21T16:00:00Z",
  "compliance_status": "152FZ_compliant"
}`}
                              </code>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">GET</Badge>
                          /api/v2/consent/{'{user_id}'}
                        </CardTitle>
                        <CardDescription>
                          Получение статуса согласий пользователя
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Параметры</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-mono">user_id</span>
                                <span className="text-muted-foreground">Идентификатор пользователя</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-mono">include_history</span>
                                <span className="text-muted-foreground">Включить историю изменений</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Ответ</h4>
                            <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              <code>
{`{
  "user_id": "usr_12345",
  "current_consents": {
    "analytics": true,
    "marketing": false,
    "personalization": true
  },
  "last_updated": "2025-09-21T16:00:00Z",
  "consent_count": 3,
  "compliance_score": 100
}`}
                              </code>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="atomization" className="mt-8">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="default" className="text-xs">POST</Badge>
                          /api/v2/atomize
                        </CardTitle>
                        <CardDescription>
                          Атомаризация персональных данных
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Пример запроса</h4>
                            <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              <code>
{`{
  "user_id": "usr_12345",
  "data": {
    "email": "user@example.com",
    "phone": "+7(495)123-45-67",
    "address": "Москва, ул. Тверская, 1"
  },
  "retention_policy": "7_years",
  "distribution_zones": ["ru-central", "ru-west"],
  "encryption_level": "quantum_resistant"
}`}
                              </code>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Ответ</h4>
                            <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              <code>
{`{
  "atomization_id": "atom_67890",
  "fragments_count": 256,
  "storage_nodes": 5,
  "encryption_keys": "*** HIDDEN ***",
  "status": "atomized",
  "estimated_retrieval_time": "< 500ms"
}`}
                              </code>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">DELETE</Badge>
                          /api/v2/atomize/{'{atomization_id}'}
                        </CardTitle>
                        <CardDescription>
                          Необратимое удаление атомизированных данных
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Параметры</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-mono">confirmation</span>
                                <span className="text-muted-foreground">Подтверждение удаления</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-mono">reason</span>
                                <span className="text-muted-foreground">Причина удаления</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Ответ</h4>
                            <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              <code>
{`{
  "deletion_id": "del_54321",
  "status": "permanently_deleted",
  "deleted_at": "2025-09-21T16:00:00Z",
  "fragments_destroyed": 256,
  "keys_destroyed": 5,
  "compliance_status": "right_to_be_forgotten_fulfilled"
}`}
                              </code>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="monitoring" className="mt-8">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">GET</Badge>
                          /api/v2/monitoring/compliance
                        </CardTitle>
                        <CardDescription>
                          Получение статуса соблюдения 152фз
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Параметры запроса</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-mono">period</span>
                                <span className="text-muted-foreground">Период анализа (24h, 7d, 30d)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-mono">include_violations</span>
                                <span className="text-muted-foreground">Включить нарушения</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Ответ</h4>
                            <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              <code>
{`{
  "compliance_score": 98.7,
  "total_consents": 12547,
  "active_violations": 0,
  "resolved_violations": 3,
  "data_requests_processed": 127,
  "average_response_time": "4.2 hours",
  "last_audit": "2025-09-20T10:00:00Z"
}`}
                              </code>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="default" className="text-xs">POST</Badge>
                          /api/v2/monitoring/webhook
                        </CardTitle>
                        <CardDescription>
                          Настройка webhook для уведомлений о нарушениях
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Пример запроса</h4>
                            <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              <code>
{`{
  "url": "https://your-app.com/webhooks/rescrub",
  "events": [
    "compliance.violation.detected",
    "data.request.received",
    "consent.expired"
  ],
  "secret": "webhook_secret_key",
  "active": true
}`}
                              </code>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Ответ</h4>
                            <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              <code>
{`{
  "webhook_id": "wh_98765",
  "status": "active",
  "created_at": "2025-09-21T16:00:00Z",
  "last_delivery": null,
  "delivery_success_rate": 0
}`}
                              </code>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-8">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">GET</Badge>
                          /api/v2/analytics/dashboard
                        </CardTitle>
                        <CardDescription>
                          Получение данных для дашборда аналитики
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Ответ</h4>
                            <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              <code>
{`{
  "consent_metrics": {
    "total_consents": 125470,
    "consent_rate": 87.3,
    "opt_out_rate": 12.7,
    "avg_consent_duration": "11.2 months"
  },
  "compliance_metrics": {
    "score": 98.7,
    "violations_resolved": 15,
    "pending_requests": 3,
    "audit_readiness": "excellent"
  },
  "performance_metrics": {
    "api_response_time": 127,
    "uptime_percentage": 99.97,
    "data_processed_gb": 1247.8
  }
}`}
                              </code>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">GET</Badge>
                          /api/v2/analytics/reports
                        </CardTitle>
                        <CardDescription>
                          Генерация отчетов для регуляторов
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Параметры</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-mono">report_type</span>
                                <span className="text-muted-foreground">152fz_compliance, gdpr_compliance</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-mono">period_start</span>
                                <span className="text-muted-foreground">Начало периода отчета</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-mono">format</span>
                                <span className="text-muted-foreground">pdf, xlsx, json</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Ответ</h4>
                            <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              <code>
{`{
  "report_id": "rep_11223",
  "status": "generating",
  "estimated_completion": "2025-09-21T16:05:00Z",
  "download_url": null,
  "expires_at": "2025-09-28T16:00:00Z"
}`}
                              </code>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* SDK Libraries */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Официальные SDK
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Готовые библиотеки для популярных языков программирования
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-yellow-500/10 p-2">
                      <Code className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <CardTitle>JavaScript / TypeScript</CardTitle>
                      <Badge variant="secondary" className="mt-1">v2.1.0</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Официальный SDK для Node.js, React, Vue.js и других JavaScript фреймворков.
                  </CardDescription>
                  <div className="space-y-3">
                    <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                      <code>npm install @rescrub/business-sdk</code>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        NPM
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Code className="h-3 w-3" />
                        GitHub
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <Code className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Python</CardTitle>
                      <Badge variant="secondary" className="mt-1">v2.1.0</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    SDK для Django, Flask, FastAPI и других Python веб-фреймворков.
                  </CardDescription>
                  <div className="space-y-3">
                    <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                      <code>pip install rescrub-business</code>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        PyPI
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Code className="h-3 w-3" />
                        GitHub
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <Code className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Go</CardTitle>
                      <Badge variant="secondary" className="mt-1">v2.1.0</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Высокопроизводительный SDK для микросервисов и backend приложений на Go.
                  </CardDescription>
                  <div className="space-y-3">
                    <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                      <code>go get github.com/rescrub/business-go</code>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        pkg.go.dev
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Code className="h-3 w-3" />
                        GitHub
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500/10 p-2">
                      <Code className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>C# / .NET</CardTitle>
                      <Badge variant="secondary" className="mt-1">v2.1.0</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    SDK для ASP.NET Core, .NET Framework и других Microsoft технологий.
                  </CardDescription>
                  <div className="space-y-3">
                    <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                      <code>dotnet add package Rescrub.Business</code>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        NuGet
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Code className="h-3 w-3" />
                        GitHub
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-red-500/10 p-2">
                      <Code className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle>Java</CardTitle>
                      <Badge variant="secondary" className="mt-1">v2.1.0</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    SDK для Spring Boot, Spring Framework и других Java enterprise решений.
                  </CardDescription>
                  <div className="space-y-3">
                    <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                      <code>{'<dependency>rescrub-business</dependency>'}</code>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Maven
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Code className="h-3 w-3" />
                        GitHub
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate border-dashed">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-500/10 p-2">
                      <Code className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle>Другие языки</CardTitle>
                      <Badge variant="outline" className="mt-1">По запросу</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Нужна поддержка PHP, Ruby, Rust или другого языка? Свяжитесь с нами.
                  </CardDescription>
                  <div className="space-y-3">
                    <Link href="/business/contact">
                      <Button size="sm" variant="outline" className="w-full">
                        Запросить SDK
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-6">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Аутентификация
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Безопасная аутентификация через API ключи и JWT токены
                </p>
                
                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Key className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        API ключи
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Простая и безопасная аутентификация через API ключи 
                        с возможностью ограничения доступа по IP адресам.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-blue-500/10 p-2">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        JWT токены
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        OAuth 2.0 совместимые JWT токены для интеграции 
                        с корпоративными системами аутентификации.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-green-500/10 p-2">
                        <Globe className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Ограничения доступа
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Гибкая настройка ограничений: rate limiting, 
                        IP whitelist, webhook signatures для максимальной безопасности.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 lg:col-span-6 lg:mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Примеры аутентификации</CardTitle>
                    <CardDescription>
                      Способы передачи авторизационных данных
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="apikey" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="apikey">API Key</TabsTrigger>
                        <TabsTrigger value="jwt">JWT Token</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="apikey" className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">HTTP заголовок</h4>
                            <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                              <code>Authorization: Bearer rscb_live_1234567890abcdef</code>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">cURL пример</h4>
                            <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                              <code>
{`curl -X GET \\
  -H "Authorization: Bearer rscb_live_1234567890abcdef" \\
  -H "Content-Type: application/json" \\
  https://api.rescrub.ru/v2/consent/usr_12345`}
                              </code>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="jwt" className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Получение токена</h4>
                            <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                              <code>
{`POST /auth/token
{
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "grant_type": "client_credentials"
}`}
                              </code>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Использование токена</h4>
                            <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                              <code>Authorization: Bearer eyJhbGciOiJIUzI1NiIs...</code>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Начните интеграцию с ResCrub API
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Полная документация, готовые SDK и техническая поддержка для разработчиков
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
              <Link href="/business/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Получить API ключ
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2">
                <Book className="h-4 w-4" />
                OpenAPI спецификация
              </Button>
            </div>
            
            <div className="mt-8 flex justify-center gap-8 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Бесплатный тестовый доступ
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Техподдержка разработчиков
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Подробная документация
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
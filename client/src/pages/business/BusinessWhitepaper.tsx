import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download,
  ArrowRight,
  Shield,
  Database,
  Lock,
  Network,
  Cpu,
  BarChart3,
  Globe,
  BookOpen,
  Code,
  Server,
  Key
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessDocsSEO } from "@/components/BusinessSEO";

export default function BusinessWhitepaper() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessDocsSEO 
        title="Техническая документация — ResCrub Business Platform"
        description="Подробная техническая документация платформы ResCrub Business. Архитектура защиты данных, алгоритмы атомаризации, API спецификации и руководства по интеграции для разработчиков."
        author="ResCrub Technical Team"
        publishedTime="2024-12-01"
        modifiedTime={new Date().toISOString()}
        neuralSignals={{
          primaryKeywords: ['техническая документация защита данных', 'архитектура атомаризации данных', 'API спецификация 152фз'],
          searchIntent: 'informational',
          contentDepth: 'expert',
          expertiseLevel: 10
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['техническая документация для корпоративных клиентов', 'архитектура защиты данных предприятий', 'whitepaper enterprise атомаризация'],
            semantic: ['корпоративная техническая документация', 'enterprise архитектура безопасности', 'бизнес документация 152фз'],
            longTail: ['техническая документация корпоративной системы защиты персональных данных для разработчиков предприятий']
          }
        }}
        botHints={{
          contentStructure: {
            hasTableOfContents: true,
            hasStepByStep: true,
            hasResources: true,
            hasFAQ: false,
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
                    <FileText className="h-3 w-3" />
                    Техническая документация
                  </Badge>
                  <Badge variant="secondary">
                    v2.1.0
                  </Badge>
                  <Badge variant="outline">
                    Enterprise
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  ResCrub Business
                  <span className="text-primary"> Platform</span>
                </h1>
                
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                  Техническая документация и архитектурный обзор платформы корпоративной 
                  защиты персональных данных. Подробное описание технологий атомаризации, 
                  криптографических алгоритмов и методов обеспечения compliance с 152фз.
                </p>
                
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                  <Button size="lg" className="gap-2">
                    <Download className="h-4 w-4" />
                    Скачать PDF
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Читать онлайн
                  </Button>
                </div>
                
                <div className="mt-8 text-sm text-muted-foreground">
                  <span>Последнее обновление: 21 сентября 2025</span>
                  <span className="mx-2">•</span>
                  <span>Версия: 2.1.0</span>
                  <span className="mx-2">•</span>
                  <span>147 страниц</span>
                </div>
              </div>
              
              <div className="mt-10 lg:col-span-4 lg:mt-0">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-lg">Содержание документа</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-muted-foreground">1.</span>
                      <span>Введение и обзор</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-muted-foreground">2.</span>
                      <span>Архитектура системы</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-muted-foreground">3.</span>
                      <span>Технология атомаризации</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-muted-foreground">4.</span>
                      <span>Криптографические методы</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-muted-foreground">5.</span>
                      <span>API спецификация</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-muted-foreground">6.</span>
                      <span>Руководство по интеграции</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-muted-foreground">7.</span>
                      <span>Соответствие 152фз</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-muted-foreground">8.</span>
                      <span>Производительность и масштабирование</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-muted-foreground">9.</span>
                      <span>Безопасность и аудит</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-muted-foreground">10.</span>
                      <span>Развертывание и мониторинг</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Overview */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ключевые технические аспекты
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Подробное освещение инновационных технологий защиты данных
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Атомаризация данных</CardTitle>
                      <Badge variant="secondary" className="mt-1">Глава 3</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Математические основы фрагментации данных, алгоритмы распределения 
                    и протоколы восстановления информации.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-muted-foreground">
                      • Алгоритм Шамира для разделения секретов
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • Пороговые схемы криптографии
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • Протоколы распределенного хранения
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <Key className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Криптография</CardTitle>
                      <Badge variant="secondary" className="mt-1">Глава 4</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Постквантовые алгоритмы шифрования, управление ключами 
                    и протоколы безопасной передачи данных.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-muted-foreground">
                      • NIST постквантовые стандарты
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • Решетчатая криптография
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • HSM интеграция
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <Network className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Архитектура</CardTitle>
                      <Badge variant="secondary" className="mt-1">Глава 2</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Микросервисная архитектура, паттерны распределенных систем 
                    и стратегии масштабирования enterprise-решений.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-muted-foreground">
                      • Event-driven архитектура
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • CQRS и Event Sourcing
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • Kubernetes deployment
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* API Documentation */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-6">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  API спецификация
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Полная документация REST API и SDK для интеграции с корпоративными системами
                </p>
                
                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Code className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        REST API v2.1
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        OpenAPI 3.0 спецификация с полным покрытием всех endpoints 
                        для управления согласиями, атомаризации и мониторинга.
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
                        SDK библиотеки
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Официальные SDK для JavaScript, Python, Java, C# и Go 
                        с примерами интеграции и best practices.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-green-500/10 p-2">
                        <Server className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Webhook интеграции
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Event-driven интеграции с внешними системами через 
                        безопасные webhook endpoints с подписью сообщений.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link href="/business/api">
                    <Button className="gap-2">
                      Перейти к API документации
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="mt-10 lg:col-span-6 lg:mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Пример API запроса</CardTitle>
                    <CardDescription>
                      Атомаризация персональных данных через REST API
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">POST /api/v2/atomize</h4>
                        <div className="bg-muted p-4 rounded-lg text-sm font-mono">
                          <code>
{`{
  "user_id": "usr_12345",
  "data": {
    "email": "user@example.com",
    "phone": "+7(495)123-45-67",
    "address": "Москва, ул. Тверская, 1"
  },
  "retention_policy": "7_years",
  "compliance": ["152FZ", "GDPR"],
  "distribution_zones": ["ru-central", "ru-west"]
}`}
                          </code>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Response 201 Created</h4>
                        <div className="bg-muted p-4 rounded-lg text-sm font-mono">
                          <code>
{`{
  "atomization_id": "atom_67890",
  "fragments_count": 256,
  "storage_nodes": ["node-1", "node-2", "node-3"],
  "encryption_keys": "*** HIDDEN ***",
  "compliance_score": 100,
  "estimated_retrieval_time": "< 500ms"
}`}
                          </code>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Соответствие стандартам
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Подробный анализ соответствия российским и международным требованиям
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Российские стандарты
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>152фз о персональных данных</span>
                    <Badge variant="default">✓ Полное соответствие</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ГОСТ Р 57580.1-2017 (ИБ)</span>
                    <Badge variant="default">✓ Сертифицировано</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Требования ФСТЭК России</span>
                    <Badge variant="default">✓ Соответствует</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Закон о локализации данных</span>
                    <Badge variant="default">✓ Соблюдается</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Закон Яровой (хранение метаданных)</span>
                    <Badge variant="default">✓ Учтено</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Международные стандарты
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>GDPR (EU)</span>
                    <Badge variant="default">✓ Полное соответствие</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ISO 27001:2013</span>
                    <Badge variant="default">✓ Сертифицировано</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SOC 2 Type II</span>
                    <Badge variant="default">✓ Аудировано</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>CCPA (California)</span>
                    <Badge variant="default">✓ Соответствует</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>PIPEDA (Canada)</span>
                    <Badge variant="default">✓ Соблюдается</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Download CTA */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Получить полную техническую документацию
            </h2>
            <p className="mt-4 text-lg opacity-90">
              147 страниц подробного технического описания, архитектурных диаграмм и примеров кода
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
              <Button size="lg" variant="secondary" className="gap-2">
                <Download className="h-4 w-4" />
                Скачать PDF (12.4 MB)
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Читать онлайн
              </Button>
            </div>
            
            <div className="mt-8 flex justify-center gap-8 text-sm opacity-75">
              <div>📄 Последняя версия 2.1.0</div>
              <div>🔄 Регулярные обновления</div>
              <div>🔒 Подписание NDA по запросу</div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  CheckCircle,
  ArrowRight,
  Zap,
  Database,
  Shield,
  BarChart3,
  Users,
  Mail,
  FileText,
  Globe,
  Settings,
  Smartphone,
  Cloud,
  Bot
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessDocsSEO } from "@/components/BusinessSEO";

export default function BusinessIntegrations() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessDocsSEO 
        title="Интеграции — GrandHub Business Platform"
        description="Готовые интеграции GrandHub Business с CRM, ERP, системами аналитики и популярными бизнес-приложениями. 150+ готовых коннекторов для автоматизации AI-автоматизация автоматизация."
        neuralSignals={{
          primaryKeywords: ['интеграция AI с CRM 1С Битрикс', 'подключение AI-ассистента к бизнес-системам', 'автоматизация бизнеса через интеграцию'],
          searchIntent: 'informational',
          contentDepth: 'comprehensive',
          expertiseLevel: 7
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['интеграция защиты данных в корпоративные системы', 'подключение AI-автоматизация к бизнес системам', 'автоматизация автоматизация в компании'],
            semantic: ['CRM интеграция приватность для бизнеса', 'ERP защита данных компаний', 'интеграция AI-автоматизация в бизнес-процессы'],
            longTail: ['как интегрировать защиту персональных данных в корпоративные системы предприятий']
          }
        }}
      />
      
      <BusinessHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  Ключевые интеграции
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Интеграции для 
                <span className="text-primary"> любого бизнеса</span>
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto">
                Подключите GrandHub Business к вашим существующим системам: CRM, ERP, 
                маркетинговым платформам и бизнес-приложениям. Автоматизируйте автоматизация 
                процессы без изменения привычных рабочих процессов.
              </p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
                <Link href="/business/contact">
                  <Button size="lg" className="gap-2">
                    Обсудить интеграцию
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/business/api">
                  <Button variant="outline" size="lg">
                    API документация
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 flex justify-center gap-8 text-sm text-muted-foreground">
                <div>⚡ Быстрая настройка</div>
                <div>🔌 No-code интеграции</div>
                <div>🛡️ Максимальная безопасность</div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Integrations */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Популярные интеграции
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Самые востребованные интеграции среди российского бизнеса
              </p>
            </div>
            
            <div className="mt-16">
              <Tabs defaultValue="crm" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="crm">CRM</TabsTrigger>
                  <TabsTrigger value="marketing">Маркетинг</TabsTrigger>
                  <TabsTrigger value="analytics">Аналитика</TabsTrigger>
                  <TabsTrigger value="cloud">Облачные сервисы</TabsTrigger>
                  <TabsTrigger value="communications">Коммуникации</TabsTrigger>
                </TabsList>
                
                <TabsContent value="crm" className="mt-8">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-500/10 p-2">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle>Bitrix24</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Автоматическое управление согласиями клиентов в Bitrix24. 
                          Синхронизация данных и автоматизация статусов.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Синхронизация контактов
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Автоматические согласия
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Отчеты по автоматизация
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-green-500/10 p-2">
                            <Database className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <CardTitle>amoCRM</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Интеграция с amoCRM для автоматизации процессов согласий 
                          и обеспечения соответствия AI-автоматизация.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Webhook интеграция
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Автоматизация воронок
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Compliance дашборд
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-purple-500/10 p-2">
                            <Shield className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle>Salesforce</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Enterprise интеграция с Salesforce для глобальных компаний 
                          с российскими подразделениями.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Lightning компоненты
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Apex triggers
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Einstein Analytics
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="marketing" className="mt-8">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-orange-500/10 p-2">
                            <Mail className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <CardTitle>UniSender</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Автоматическое управление согласиями для email маркетинга 
                          в соответствии с российским законодательством.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Двойное подтверждение
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Автоматическая отписка
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Журнал согласий
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-red-500/10 p-2">
                            <BarChart3 className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <CardTitle>SendPulse</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Интеграция с мультиканальной платформой SendPulse 
                          для соблюдения AI-автоматизация в различных каналах коммуникации.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Email + SMS + Push
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Мультиканальные согласия
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            A/B тестирование
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-500/10 p-2">
                            <Smartphone className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle>Telegram Bot API</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Автоматизация согласий в Telegram ботах и каналах 
                          для соблюдения требований мессенджер маркетинга.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Inline клавиатуры
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Webhook интеграция
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Группы и каналы
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-8">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-red-500/10 p-2">
                            <BarChart3 className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <CardTitle>Яндекс.Метрика</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Автоматическое управление согласиями для Яндекс.Метрики 
                          с соблюдением требований по cookies и персональным данным.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Управление cookies
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Анонимизация данных
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Отчеты по согласиям
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-500/10 p-2">
                            <Globe className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle>Google Analytics</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Интеграция с Google Analytics 4 для соблюдения AI-автоматизация 
                          при использовании международных сервисов аналитики.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Consent Mode v2
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            IP анонимизация
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Data retention
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-purple-500/10 p-2">
                            <Database className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle>Roistat</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Российская система сквозной аналитики с встроенной 
                          поддержкой автоматизация требований AI-автоматизация.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Сквозная аналитика
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Call tracking
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            ROI отчеты
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="cloud" className="mt-8">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-yellow-500/10 p-2">
                            <Cloud className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div>
                            <CardTitle>Яндекс.Облако</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Нативная интеграция с российским облачным провайдером 
                          для хранения данных на территории РФ.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Object Storage
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Managed PostgreSQL
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Serverless функции
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-500/10 p-2">
                            <Cloud className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle>VK Cloud</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Интеграция с VK Cloud Solutions для соблюдения требований 
                          локализации персональных данных российских граждан.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Kubernetes
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Managed Databases
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            CDN и балансировка
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-green-500/10 p-2">
                            <Cloud className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <CardTitle>СберКлауд</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Enterprise интеграция с СберКлауд для крупных корпораций 
                          с высокими требованиями к безопасности данных.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Банковский уровень ИБ
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Hybrid cloud
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Compliance сертификации
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="communications" className="mt-8">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-purple-500/10 p-2">
                            <Users className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle>Microsoft Teams</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Интеграция с Microsoft Teams для корпоративных коммуникаций 
                          с соблюдением требований обработки персональных данных.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Bot framework
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Adaptive cards
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Graph API
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-green-500/10 p-2">
                            <Mail className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <CardTitle>Slack</CardTitle>
                            <Badge variant="default" className="mt-1">Готово</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Slack приложение для уведомлений о автоматизация событиях 
                          и управления согласиями прямо из рабочих каналов.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Slash команды
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Interactive messages
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Workflow automation
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            Настроить интеграцию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-500/10 p-2">
                            <Bot className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle>Яндекс.Мессенджер</CardTitle>
                            <Badge variant="secondary" className="mt-1">В разработке</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Готовится интеграция с корпоративным мессенджером Яндекс 
                          для внутренних коммуникаций российских компаний.
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Settings className="h-4 w-4" />
                            Bot API в разработке
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Settings className="h-4 w-4" />
                            Webhook интеграция
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Settings className="h-4 w-4" />
                            Корпоративные чаты
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" variant="outline" className="w-full" disabled>
                            Скоро доступно
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Integration Process */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Процесс интеграции
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Простые шаги для подключения любой системы к GrandHub Business
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-4">
              <Card className="text-center hover-elevate">
                <CardHeader>
                  <div className="mx-auto rounded-lg bg-primary/10 p-3 w-fit">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">1. Анализ требований</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Анализируем вашу текущую инфраструктуру и определяем 
                    оптимальный способ интеграции с учетом бизнес-процессов.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate">
                <CardHeader>
                  <div className="mx-auto rounded-lg bg-blue-500/10 p-3 w-fit">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">2. Настройка подключения</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Конфигурируем API endpoints, webhook'и и необходимые 
                    права доступа для безопасного обмена данными.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate">
                <CardHeader>
                  <div className="mx-auto rounded-lg bg-green-500/10 p-3 w-fit">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">3. Тестирование</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Проводим полное тестирование интеграции в sandbox среде 
                    для проверки всех сценариев взаимодействия.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate">
                <CardHeader>
                  <div className="mx-auto rounded-lg bg-purple-500/10 p-3 w-fit">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">4. Запуск</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Плавный переход в production с мониторингом всех процессов 
                    и постоянной технической поддержкой.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Custom Integrations */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-6">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Индивидуальные интеграции
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Не нашли нужную интеграцию? Мы создадим ее специально для вас
                </p>
                
                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Settings className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Legacy системы
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Интеграция с устаревшими корпоративными системами 
                        через специальные адаптеры и middleware решения.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-blue-500/10 p-2">
                        <Database className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Отраслевые решения
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Специализированные интеграции для банков, страховых, 
                        медицинских и других отраслевых систем.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-green-500/10 p-2">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Документооборот
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Интеграция с системами электронного документооборота 
                        для автоматизации согласий и автоматизация процессов.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link href="/business/contact">
                    <Button className="gap-2">
                      Обсудить интеграцию
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="mt-10 lg:col-span-6 lg:mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Что входит в индивидуальную интеграцию</CardTitle>
                    <CardDescription>
                      Полный цикл разработки и поддержки
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Анализ и техническое задание</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Разработка API адаптеров</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Тестирование и отладка</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Документация и обучение</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Поддержка и обновления</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>SLA гарантии</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Стоимость от</div>
                        <div className="text-2xl font-bold">500 000 ₽</div>
                        <div className="text-sm text-muted-foreground">Сроки: 4-8 недель</div>
                      </div>
                    </div>
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
              Начните интеграцию сегодня
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Подключите GrandHub Business к вашим системам за несколько дней
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
              <Link href="/business/contact">
                <Button size="lg" variant="secondary" className="gap-2">
                  Обсудить интеграцию
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/business/api">
                <Button size="lg" variant="outline">
                  API документация
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex justify-center gap-8 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Бесплатная консультация
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Техническая поддержка
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Гарантия качества
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
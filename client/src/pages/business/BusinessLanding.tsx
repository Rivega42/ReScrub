import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Building2, 
  BarChart3, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Users,
  Lock,
  Database,
  Settings,
  Monitor,
  FileText,
  Globe,
  Smartphone
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessLandingSEO } from "@/components/BusinessSEO";

export default function BusinessLanding() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessLandingSEO 
        title="ResCrub Business — Защита персональных данных для бизнеса"
        description="Защита персональных данных для бизнеса: автоматизация 152фз, управление согласиями клиентов B2B, корпоративная безопасность данных для предприятий."
        neuralSignals={{
          primaryKeywords: ['защита персональных данных для бизнеса', '152фз что такое', 'соответствие 152фз для компаний'],
          searchIntent: 'commercial',
          contentDepth: 'comprehensive',
          expertiseLevel: 9
        }}
        russianSEO={{
          yaTheme: 'корпоративные технологии',
          russianKeywords: {
            primary: ['защита персональных данных для бизнеса', '152фз что такое', 'корпоративная безопасность данных'],
            semantic: ['автоматизация compliance в компании', 'DPO услуги для организаций', 'управление согласиями клиентов B2B'],
            longTail: ['внедрение защиты данных в бизнес процессы компании', 'консультации по 152фз для предприятий']
          }
        }}
      />
      
      <BusinessHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 lg:py-32" itemScope itemType="https://schema.org/Service">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
              <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6" itemScope itemType="https://schema.org/Organization">
                <div className="flex items-center gap-2 mb-6">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    152фз Compliance
                  </Badge>
                  <Badge variant="secondary">
                    Enterprise Ready
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-5xl xl:text-6xl" itemProp="name">
                  Корпоративная защита 
                  <span className="text-primary"> персональных данных</span>
                </h1>
                
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl" itemProp="description">
                  Автоматизируйте соблюдение 152фз в вашей компании. 
                  Управление согласиями клиентов, защита корпоративных данных и 
                  непрерывный мониторинг compliance для российских предприятий.
                </p>
                
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                  <Link href="/business/register">
                    <Button size="lg" className="gap-2" data-testid="button-start-trial">
                      Начать бесплатно
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/business/contact">
                    <Button variant="outline" size="lg" data-testid="button-contact-sales">
                      Связаться с экспертом
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 flex items-center gap-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Бесплатная интеграция
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    30 дней тестирования
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Российская локализация
                  </div>
                </div>
              </div>
              
              <div className="relative mx-auto mt-10 max-w-lg lg:col-span-5 lg:mx-0 lg:mt-0 xl:col-span-6">
                <div className="mx-auto aspect-square max-w-xs lg:max-w-none" itemScope itemType="https://schema.org/SoftwareApplication">
                  <Card className="p-6 shadow-2xl border-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="font-semibold" itemProp="name">ResCrub Business</span>
                      </div>
                      <Badge variant="default">Live</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Активные согласия</span>
                        <span className="font-mono text-green-600">127,439</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Обработано запросов</span>
                        <span className="font-mono">2,847</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Compliance Score</span>
                        <span className="font-mono text-green-600">98.7%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Экономия времени</span>
                        <span className="font-mono text-blue-600">156 часов</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Products Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Корпоративные решения для 152фз
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Все инструменты для автоматизации compliance в одной платформе
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <Card className="relative overflow-hidden hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Виджет согласий</CardTitle>
                      <Badge variant="secondary" className="mt-1">Готовое решение</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Готовый виджет для сбора согласий на обработку персональных данных 
                    в соответствии с требованиями 152фз. Простая интеграция и настройка.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Cookie consent и персонализация
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Российская правовая база
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      API для интеграции
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href="/business/consent">
                      <Button variant="outline" className="w-full gap-2">
                        Подробнее
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <Database className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Атомаризация данных</CardTitle>
                      <Badge variant="secondary" className="mt-1">Инновации</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Революционная технология распределенного хранения персональных данных. 
                    Максимальная безопасность через фрагментацию и децентрализацию.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Распределенное хранение
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Криптографическая защита
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Право на забвение
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href="/business/atomization">
                      <Button variant="outline" className="w-full gap-2">
                        Подробнее
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <Monitor className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Мониторинг</CardTitle>
                      <Badge variant="secondary" className="mt-1">24/7</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Непрерывный мониторинг соблюдения 152фз, контроль утечек данных 
                    и автоматические уведомления о нарушениях compliance.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Мониторинг утечек
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Аудит обработки данных
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Отчеты для регуляторов
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button variant="outline" className="w-full gap-2" disabled>
                      Скоро
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Почему ResCrub Business?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Единственная платформа, созданная специально для российского бизнеса
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              <div className="grid gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      100% соответствие 152фз для бизнеса
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Корпоративные решения разработаны с учетом всех требований 
                      152фз для предприятий и российского бизнеса
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Быстрая интеграция
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Настройка за 1 день. API, SDK и готовые интеграции 
                      с популярными CRM и системами
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Экономия ресурсов
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Автоматизация снижает затраты на compliance 
                      до 80% и освобождает время юристов
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-purple-500/10 p-2">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Экспертная поддержка
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Команда экспертов по российскому праву и информационной 
                      безопасности всегда готова помочь
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-orange-500/10 p-2">
                      <Globe className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Российская разработка
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Продукт разработан в России для российского рынка 
                      с учетом локальной специфики
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-red-500/10 p-2">
                      <Lock className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Enterprise Security
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Банковский уровень безопасности, сертификация 
                      по российским стандартам ИБ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Готовы автоматизировать compliance?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Начните бесплатное тестирование и убедитесь в эффективности решений
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
              <Link href="/business/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Начать бесплатно
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/business/pricing">
                <Button size="lg" variant="outline">
                  Посмотреть тарифы
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
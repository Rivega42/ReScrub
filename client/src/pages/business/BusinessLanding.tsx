import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Building2, 
  BarChart3, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Users,
  Database,
  Settings,
  Monitor,
  MessageSquare,
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
        title="GrandHub Business — AI-помощник для бизнеса в России"
        description="GrandHub — AI-помощник для автоматизации бизнеса: интеграция с 1С, Битрикс24, AmoCRM, Telegram. CRM-автоматизация, аналитика и AI для российских компаний."
        neuralSignals={{
          primaryKeywords: ['AI-помощник для бизнеса', 'автоматизация CRM 1С', 'AI аналитика для компаний'],
          searchIntent: 'commercial',
          contentDepth: 'comprehensive',
          expertiseLevel: 9
        }}
        russianSEO={{
          yaTheme: 'корпоративные технологии',
          russianKeywords: {
            primary: ['AI-помощник для бизнеса в России', 'автоматизация 1С Битрикс24', 'CRM AI аналитика'],
            semantic: ['интеграция 1С и AI', 'автоматизация бизнес-процессов', 'умная CRM для компании'],
            longTail: ['AI-помощник для автоматизации бизнеса с интеграцией 1С и CRM']
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
                    <Bot className="h-3 w-3" />
                    AI-платформа
                  </Badge>
                  <Badge variant="secondary">
                    B2B Russia
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-5xl xl:text-6xl" itemProp="name">
                  AI-помощник для 
                  <span className="text-primary"> вашего бизнеса</span>
                </h1>
                
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl" itemProp="description">
                  GrandHub — умный AI-ассистент, который автоматизирует бизнес-процессы, 
                  интегрируется с 1С, Битрикс24, AmoCRM и Telegram. 
                  Аналитика, CRM и AI в единой платформе для российских компаний.
                </p>
                
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                  <Link href="/business/register">
                    <Button size="lg" className="gap-2" data-testid="button-start-trial">
                      Попробовать бесплатно
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/business/contact">
                    <Button variant="outline" size="lg" data-testid="button-contact-sales">
                      Связаться с командой
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 flex items-center gap-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Интеграция за 1 день
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    14 дней бесплатно
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Российская разработка
                  </div>
                </div>
              </div>
              
              <div className="relative mx-auto mt-10 max-w-lg lg:col-span-5 lg:mx-0 lg:mt-0 xl:col-span-6">
                <div className="mx-auto aspect-square max-w-xs lg:max-w-none" itemScope itemType="https://schema.org/SoftwareApplication">
                  <Card className="p-6 shadow-2xl border-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <span className="font-semibold" itemProp="name">GrandHub Business</span>
                      </div>
                      <Badge variant="default">Live</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Автоматизированных задач</span>
                        <span className="font-mono text-green-600">12,847</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Интеграций активно</span>
                        <span className="font-mono">4 системы</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Экономия времени</span>
                        <span className="font-mono text-green-600">68%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Рост продаж</span>
                        <span className="font-mono text-blue-600">+34%</span>
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
                Продукты GrandHub для бизнеса
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Все инструменты для AI-автоматизации в одной платформе
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <Card className="relative overflow-hidden hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>AI-ассистент</CardTitle>
                      <Badge variant="secondary" className="mt-1">Готовое решение</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Умный AI-помощник для сотрудников и клиентов. Отвечает на вопросы, 
                    обрабатывает заявки, интегрируется в Telegram и веб-чат.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Telegram и веб-чат
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Интеграция с CRM
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Обучение на ваших данных
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
                      <CardTitle>AI-аналитика</CardTitle>
                      <Badge variant="secondary" className="mt-1">Инновации</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Умная аналитика продаж, клиентов и операций. AI анализирует данные 
                    из 1С, CRM и строит прогнозы и рекомендации.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Данные из 1С и CRM
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Прогнозирование продаж
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Дашборды в реальном времени
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
                      <CardTitle>Мониторинг бизнеса</CardTitle>
                      <Badge variant="secondary" className="mt-1">24/7</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Непрерывный мониторинг KPI, контроль исполнения задач и 
                    автоматические уведомления о важных событиях в бизнесе.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Отслеживание KPI
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Уведомления в Telegram
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Отчёты для руководства
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href="/business/monitoring">
                      <Button variant="outline" className="w-full gap-2">
                        Подробнее
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
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
                Почему GrandHub Business?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Единственный AI-помощник, созданный специально для российского бизнеса
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              <div className="grid gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Интеграция с 1С и российскими системами
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Готовые коннекторы для 1С:Предприятие, Битрикс24, AmoCRM 
                      и Telegram — без программирования
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
                      Быстрый запуск
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Настройка и запуск за 1 день. API, SDK и готовые 
                      интеграции с популярными бизнес-системами
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
                      AI автоматизирует до 70% рутинных задач и 
                      освобождает время сотрудников для важных дел
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
                      Поддержка и обучение
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Персональный менеджер, обучение команды и 
                      техподдержка 24/7 на русском языке
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
                      с учетом локальной специфики и требований
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-red-500/10 p-2">
                      <MessageSquare className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Telegram-первый подход
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      AI-бот в Telegram для сотрудников и клиентов, 
                      уведомления и отчёты прямо в мессенджер
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
              Готовы автоматизировать бизнес с AI?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Начните бесплатное тестирование и убедитесь в эффективности GrandHub
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
              <Link href="/business/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Попробовать бесплатно
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

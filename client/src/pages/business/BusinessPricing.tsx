import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  Shield,
  Database,
  Zap,
  Building2,
  Users,
  Star,
  HeadphonesIcon,
  Clock,
  Globe,
  Lock,
  X
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessPricingSEO } from "@/components/BusinessSEO";

export default function BusinessPricing() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessPricingSEO 
        title="Тарифы ResCrub Business — Корпоративные планы защиты данных"
        description="Гибкие тарифные планы ResCrub Business для автоматизации 152фз. От стартапов до enterprise: виджет согласий, атомаризация данных, техподдержка 24/7."
        neuralSignals={{
          primaryKeywords: ['тарифы защита персональных данных', 'цены compliance автоматизация', 'стоимость 152фз решений'],
          searchIntent: 'commercial',
          contentDepth: 'comprehensive',
          expertiseLevel: 6
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['тарифы корпоративной защиты данных', 'цены business compliance решений', 'стоимость автоматизации 152фз для предприятий'],
            semantic: ['корпоративные планы защиты данных', 'enterprise тарифы 152фз', 'цены на DPO услуги для организаций'],
            longTail: ['сколько стоит корпоративная автоматизация соблюдения 152фз для предприятий и компаний']
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
                  <BarChart3 className="h-3 w-3" />
                  Гибкие тарифы
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Тарифы для 
                <span className="text-primary"> вашего бизнеса</span>
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto">
                Выберите оптимальный план для автоматизации соблюдения 152фз в вашей компании. 
                От стартапов до enterprise корпораций — у нас есть решение для каждого бизнеса.
              </p>
              
              <div className="mt-8 flex justify-center">
                <Badge variant="secondary" className="text-sm">
                  🎯 Экономия до 80% на compliance процессах
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="monthly" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="monthly">Ежемесячно</TabsTrigger>
                  <TabsTrigger value="annual">Ежегодно</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="monthly">
                <div className="grid gap-8 lg:grid-cols-4">
                  {/* Starter Plan */}
                  <Card className="relative hover-elevate">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <CardTitle>Starter</CardTitle>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">9 900</span>
                        <span className="text-sm text-muted-foreground">₽/мес</span>
                      </div>
                      <CardDescription>
                        Для стартапов и малого бизнеса. Основные функции compliance.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Виджет согласий (базовый)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">До 10 000 пользователей</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Базовая аналитика</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Email поддержка</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">152фз compliance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Атомаризация данных</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Приоритетная поддержка</span>
                        </div>
                      </div>
                      
                      <Link href="/business/register">
                        <Button className="w-full">
                          Начать бесплатно
                        </Button>
                      </Link>
                      
                      <div className="text-center text-xs text-muted-foreground">
                        30 дней бесплатно
                      </div>
                    </CardContent>
                  </Card>

                  {/* Professional Plan */}
                  <Card className="relative hover-elevate border-primary">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Популярный
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <CardTitle>Professional</CardTitle>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">29 900</span>
                        <span className="text-sm text-muted-foreground">₽/мес</span>
                      </div>
                      <CardDescription>
                        Для средних компаний. Расширенные возможности и интеграции.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Виджет согласий (расширенный)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">До 100 000 пользователей</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Продвинутая аналитика</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Чат поддержка</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">API доступ</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">CRM интеграции</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Мониторинг нарушений</span>
                        </div>
                      </div>
                      
                      <Link href="/business/register">
                        <Button className="w-full">
                          Выбрать план
                        </Button>
                      </Link>
                      
                      <div className="text-center text-xs text-muted-foreground">
                        30 дней бесплатно
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enterprise Plan */}
                  <Card className="relative hover-elevate">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                        <CardTitle>Enterprise</CardTitle>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">99 900</span>
                        <span className="text-sm text-muted-foreground">₽/мес</span>
                      </div>
                      <CardDescription>
                        Для крупного бизнеса. Атомаризация данных и enterprise SLA.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Все функции Professional</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Неограниченно пользователей</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Атомаризация данных</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Поддержка 24/7</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Персональный менеджер</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">On-premise развертывание</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">SLA 99.9%</span>
                        </div>
                      </div>
                      
                      <Link href="/business/contact">
                        <Button className="w-full">
                          Связаться с нами
                        </Button>
                      </Link>
                      
                      <div className="text-center text-xs text-muted-foreground">
                        Индивидуальные условия
                      </div>
                    </CardContent>
                  </Card>

                  {/* Custom Plan */}
                  <Card className="relative hover-elevate border-dashed">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-orange-600" />
                        <CardTitle>Custom</CardTitle>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">По запросу</span>
                      </div>
                      <CardDescription>
                        Индивидуальные решения для уникальных требований бизнеса.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Все функции Enterprise</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Кастомная разработка</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Интеграция с legacy</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Выделенная инфраструктура</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Белая марка</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Консультации экспертов</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Гибкие SLA</span>
                        </div>
                      </div>
                      
                      <Link href="/business/contact">
                        <Button variant="outline" className="w-full">
                          Обсудить проект
                        </Button>
                      </Link>
                      
                      <div className="text-center text-xs text-muted-foreground">
                        Индивидуальная оценка
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="annual">
                <div className="grid gap-8 lg:grid-cols-4">
                  {/* Annual plans with discounts */}
                  <Card className="relative hover-elevate">
                    <div className="absolute -top-3 right-3">
                      <Badge variant="secondary" className="text-xs">
                        -20%
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <CardTitle>Starter</CardTitle>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">95 040</span>
                        <span className="text-sm text-muted-foreground">₽/год</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="line-through">118 800 ₽</span>
                        <span className="text-green-600 ml-2">экономия 23 760 ₽</span>
                      </div>
                      <CardDescription>
                        Для стартапов и малого бизнеса. Основные функции compliance.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/business/register">
                        <Button className="w-full">
                          Выбрать годовой план
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="relative hover-elevate border-primary">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Лучшее предложение
                      </Badge>
                    </div>
                    <div className="absolute -top-3 right-3">
                      <Badge variant="secondary" className="text-xs">
                        -25%
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <CardTitle>Professional</CardTitle>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">269 100</span>
                        <span className="text-sm text-muted-foreground">₽/год</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="line-through">358 800 ₽</span>
                        <span className="text-green-600 ml-2">экономия 89 700 ₽</span>
                      </div>
                      <CardDescription>
                        Для средних компаний. Расширенные возможности и интеграции.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/business/register">
                        <Button className="w-full">
                          Выбрать годовой план
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="relative hover-elevate">
                    <div className="absolute -top-3 right-3">
                      <Badge variant="secondary" className="text-xs">
                        -30%
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                        <CardTitle>Enterprise</CardTitle>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">839 160</span>
                        <span className="text-sm text-muted-foreground">₽/год</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="line-through">1 198 800 ₽</span>
                        <span className="text-green-600 ml-2">экономия 359 640 ₽</span>
                      </div>
                      <CardDescription>
                        Для крупного бизнеса. Атомаризация данных и enterprise SLA.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/business/contact">
                        <Button className="w-full">
                          Связаться с нами
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="relative hover-elevate border-dashed">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-orange-600" />
                        <CardTitle>Custom</CardTitle>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">По запросу</span>
                      </div>
                      <CardDescription>
                        Индивидуальные решения для уникальных требований бизнеса.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/business/contact">
                        <Button variant="outline" className="w-full">
                          Обсудить проект
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Подробное сравнение планов
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Выберите функции, которые нужны именно вашему бизнесу
              </p>
            </div>
            
            <div className="mt-16 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Функция</th>
                    <th className="text-center py-4 px-4">Starter</th>
                    <th className="text-center py-4 px-4">Professional</th>
                    <th className="text-center py-4 px-4">Enterprise</th>
                    <th className="text-center py-4 px-4">Custom</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-4 px-4 font-medium">Виджет согласий</td>
                    <td className="text-center py-4 px-4">Базовый</td>
                    <td className="text-center py-4 px-4">Расширенный</td>
                    <td className="text-center py-4 px-4">Полный</td>
                    <td className="text-center py-4 px-4">Кастомный</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">Количество пользователей</td>
                    <td className="text-center py-4 px-4">10K</td>
                    <td className="text-center py-4 px-4">100K</td>
                    <td className="text-center py-4 px-4">Неограниченно</td>
                    <td className="text-center py-4 px-4">Неограниченно</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">Атомаризация данных</td>
                    <td className="text-center py-4 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">API доступ</td>
                    <td className="text-center py-4 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">Поддержка</td>
                    <td className="text-center py-4 px-4">Email</td>
                    <td className="text-center py-4 px-4">Чат</td>
                    <td className="text-center py-4 px-4">24/7</td>
                    <td className="text-center py-4 px-4">24/7 + менеджер</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">SLA</td>
                    <td className="text-center py-4 px-4">99%</td>
                    <td className="text-center py-4 px-4">99.5%</td>
                    <td className="text-center py-4 px-4">99.9%</td>
                    <td className="text-center py-4 px-4">Индивидуальный</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-6">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Калькулятор экономии
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Посчитайте, сколько ваша компания сэкономит на автоматизации compliance
                </p>
                
                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-green-500/10 p-2">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Экономия времени
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Автоматизация освобождает до 20 часов юриста в неделю 
                        от рутинных операций с согласиями.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-blue-500/10 p-2">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Снижение рисков
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Предотвращение штрафов Роскомнадзора до 1% от оборота 
                        за нарушения 152фз.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-purple-500/10 p-2">
                        <Shield className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Репутационная защита
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Предотвращение репутационных потерь от утечек данных 
                        и нарушений конфиденциальности.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 lg:col-span-6 lg:mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Расчет экономии для Professional плана</CardTitle>
                    <CardDescription>
                      Средние показатели для компании из 500 сотрудников
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Зарплата юриста (в месяц)</span>
                      <span className="font-mono">200 000 ₽</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Освобожденное время</span>
                      <span className="font-mono">40%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Экономия на зарплате</span>
                      <span className="font-mono text-green-600">80 000 ₽</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Стоимость ResCrub</span>
                      <span className="font-mono">29 900 ₽</span>
                    </div>
                    <div className="flex justify-between items-center py-2 font-bold text-lg">
                      <span>Чистая экономия в месяц</span>
                      <span className="font-mono text-green-600">50 100 ₽</span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">ROI: 268%</div>
                        <div className="text-sm text-green-600">Окупаемость за 11 дней</div>
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
              Начните экономить уже сегодня
            </h2>
            <p className="mt-4 text-lg opacity-90">
              30-дневная бесплатная пробная версия без обязательств
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
              <Link href="/business/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Начать бесплатно
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/business/contact">
                <Button size="lg" variant="outline">
                  Связаться с экспертом
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex justify-center gap-8 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Без привязки карты
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Полный функционал
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Техподдержка включена
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
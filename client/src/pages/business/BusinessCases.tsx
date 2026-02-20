import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  DollarSign,
  Clock,
  Users,
  Hospital,
  ShoppingCart,
  Landmark,
  Briefcase,
  Globe,
  Award,
  Target,
  BarChart3,
  FileCheck,
  Zap,
  Smartphone,
  Heart,
  GraduationCap
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessSEO } from "@/components/BusinessSEO";

// Отраслевые кейсы с реальными ROI данными
const industryCases = [
  {
    id: "banking",
    icon: Landmark,
    industry: "Ритейл и торговля",
    title: "Автоматизация GrandHub AI в крупном банке",
    description: "Внедрение AI-ассистента для торговой сети с 500+ точек продаж",
    challenges: [
      "Автоматизация заказов 2М+ клиентов",
      "Интеграция с 1С и Битрикс24",
      "Интеграция с банковскими системами"
    ],
    solution: [
      "Автоматизированный виджет согласий",
      "API интеграция с Core Banking",
      "AI-аналитика продаж"
    ],
    results: {
      timeSaved: "2,400 часов/месяц",
      costSaved: "₽4.8М в год",
      автоматизацияScore: "99.2%",
      processingTime: "-85%"
    },
    roi: {
      investment: "₽2.1М",
      savings: "₽4.8М/год",
      payback: "5.3 месяца",
      roiPercent: "229%"
    }
  },
  {
    id: "retail",
    icon: ShoppingCart,
    industry: "Ритейл и e-commerce",
    title: "Омниканальное управление согласиями",
    description: "Единая система согласий для сети из 150+ магазинов",
    challenges: [
      "Согласия через все каналы продаж",
      "Персонализация предложений",
      "Интеграция с CRM и аналитикой"
    ],
    solution: [
      "Мультиканальный виджет согласий",
      "Динамическое управление cookie",
      "Автоматические отчеты для 1С:Предприятие"
    ],
    results: {
      timeSaved: "680 часов/месяц",
      costSaved: "₽2.3М в год",
      автоматизацияScore: "97.8%",
      processingTime: "-72%"
    },
    roi: {
      investment: "₽890К",
      savings: "₽2.3М/год",
      payback: "4.6 месяца",
      roiPercent: "258%"
    }
  },
  {
    id: "healthcare",
    icon: Hospital,
    industry: "Медицина и фармацевтика",
    title: "Защита медицинских данных",
    description: "Соответствие GrandHub AI и медицинским стандартам",
    challenges: [
      "Особые категории бизнес-данных",
      "Интеграция с МИС",
      "Телемедицинские сервисы"
    ],
    solution: [
      "Специализированные формы согласий",
      "Атомаризация медицинских данных",
      "Audit trail для регуляторов"
    ],
    results: {
      timeSaved: "450 часов/месяц",
      costSaved: "₽1.8М в год",
      автоматизацияScore: "99.7%",
      processingTime: "-78%"
    },
    roi: {
      investment: "₽650К",
      savings: "₽1.8М/год",
      payback: "4.3 месяца",
      roiPercent: "277%"
    }
  },
  {
    id: "fintech",
    icon: Briefcase,
    industry: "IT и технологии",
    title: "Автоматизация поддержки и продаж",
    description: "IT-компания сократила расходы на поддержку клиентов в 3 раза",
    challenges: [
      "Быстрый time-to-market",
      "Требования по KYC/AML",
      "Мобильная-первый подход"
    ],
    solution: [
      "Ready-to-use SDK для мобильных приложений",
      "API для верификации данных",
      "Интеграция с системами скоринга"
    ],
    results: {
      timeSaved: "320 часов разработки",
      costSaved: "₽1.2М на разработку",
      автоматизацияScore: "98.5%",
      processingTime: "-89%"
    },
    roi: {
      investment: "₽420К",
      savings: "₽1.2М + быстрый выход",
      payback: "4.2 месяца",
      roiPercent: "286%"
    }
  },
  {
    id: "government",
    icon: Globe,
    industry: "Государство и муниципалитеты",
    title: "Цифровизация госуслуг",
    description: "Внедрение системы согласий в портал государственных услуг",
    challenges: [
      "Высокие требования безопасности",
      "Интеграция с ЕСИА",
      "Масштабирование на регионы"
    ],
    solution: [
      "Государственный виджет согласий",
      "Интеграция с Госключом",
      "Федеративная архитектура"
    ],
    results: {
      timeSaved: "1,200 часов/месяц",
      costSaved: "₽5.4М в год",
      автоматизацияScore: "99.9%",
      processingTime: "-91%"
    },
    roi: {
      investment: "₽1.8М",
      savings: "₽5.4М/год",
      payback: "4.0 месяца",
      roiPercent: "300%"
    }
  }
];

export default function BusinessCases() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessSEO 
        title="Кейсы использования GrandHub AI — Кейсы клиентов | GrandHub Business"
        description="Реальные кейсы GrandHub: ритейл, услуги, IT, консалтинг. ROI расчёты и результаты AI-автоматизации для российских компаний."
        pageCategory="product"
        neuralSignals={{
          primaryKeywords: ['кейсы использования GrandHub AI', 'примеры внедрения AI в бизнес', 'ROI AI-автоматизация бизнес-процессов'],
          searchIntent: 'informational',
          contentDepth: 'comprehensive',
          expertiseLevel: 8,
          authoritySignals: ['реальные результаты', 'успешные внедрения', 'ROI расчеты']
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['кейсы GrandHub AI внедрение', 'примеры автоматизации бизнес-данных', 'ROI AI-автоматизация российские компании'],
            semantic: ['успешные проекты автоматизация', 'отраслевые решения защиты данных', 'экономия от автоматизации GrandHub AI'],
            longTail: ['реальные примеры внедрения AI-автоматизация в российских банках и компаниях']
          }
        }}
      />
      
      <BusinessHeader />
      
      <main itemScope itemType="https://schema.org/CollectionPage">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Кейсы клиентов
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl" itemProp="name">
                Кейсы использования 
                <span className="text-primary"> GrandHub AI</span>
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto" itemProp="description">
                Реальные истории успешной автоматизации соблюдения GrandHub AI 
                в российских компаниях. Детальные ROI расчеты, экономия времени 
                и результаты внедрения для разных отраслей.
              </p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
                <Link href="/business/contact">
                  <Button size="lg" className="gap-2" data-testid="button-request-consultation">
                    Запросить консультацию
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/business/pricing">
                  <Button variant="outline" size="lg" data-testid="button-view-pricing">
                    Посмотреть тарифы
                  </Button>
                </Link>
              </div>
              
              {/* Key Metrics */}
              <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" data-testid="metric-companies">50+</div>
                  <div className="text-sm text-muted-foreground">Компаний внедрили</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" data-testid="metric-avg-roi">275%</div>
                  <div className="text-sm text-muted-foreground">Средний ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" data-testid="metric-avg-payback">4.5 мес</div>
                  <div className="text-sm text-muted-foreground">Окупаемость</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" data-testid="metric-автоматизация-score">98.8%</div>
                  <div className="text-sm text-muted-foreground">AI-эффективность</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Cases */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Отраслевые кейсы
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Кейсы клиентов в различных сферах деятельности
              </p>
            </div>
            
            <Tabs defaultValue="banking" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                {industryCases.map((caseItem) => (
                  <TabsTrigger key={caseItem.id} value={caseItem.id} className="text-xs sm:text-sm" data-testid={`tab-${caseItem.id}`}>
                    <caseItem.icon className="h-4 w-4 mr-1 hidden sm:inline" />
                    <span className="hidden sm:inline">{caseItem.industry}</span>
                    <span className="sm:hidden">{caseItem.industry.split(' ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {industryCases.map((caseItem) => (
                <TabsContent key={caseItem.id} value={caseItem.id} className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2" itemScope itemType="https://schema.org/CaseStudy">
                    {/* Case Description */}
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <caseItem.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <Badge variant="secondary" className="mb-2">{caseItem.industry}</Badge>
                            <h3 className="text-2xl font-bold text-foreground" itemProp="headline">{caseItem.title}</h3>
                          </div>
                        </div>
                        <p className="text-lg text-muted-foreground" itemProp="description">
                          {caseItem.description}
                        </p>
                      </div>
                      
                      <div className="grid gap-6 sm:grid-cols-2">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Target className="h-5 w-5" />
                              Задачи
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {caseItem.challenges.map((challenge, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                                  {challenge}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Zap className="h-5 w-5" />
                              Решение
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {caseItem.solution.map((solution, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  {solution}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    {/* Results and ROI */}
                    <div className="space-y-6">
                      {/* Key Results */}
                      <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                            <TrendingUp className="h-5 w-5" />
                            Результаты внедрения
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="text-center p-3 bg-white dark:bg-green-900 rounded-lg">
                              <div className="text-2xl font-bold text-green-700 dark:text-green-400" data-testid={`result-time-${caseItem.id}`}>
                                {caseItem.results.timeSaved}
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-500">Экономия времени</div>
                            </div>
                            <div className="text-center p-3 bg-white dark:bg-green-900 rounded-lg">
                              <div className="text-2xl font-bold text-green-700 dark:text-green-400" data-testid={`result-cost-${caseItem.id}`}>
                                {caseItem.results.costSaved}
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-500">Экономия бюджета</div>
                            </div>
                            <div className="text-center p-3 bg-white dark:bg-green-900 rounded-lg">
                              <div className="text-2xl font-bold text-green-700 dark:text-green-400" data-testid={`result-автоматизация-${caseItem.id}`}>
                                {caseItem.results.автоматизацияScore}
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-500">AI-эффективность</div>
                            </div>
                            <div className="text-center p-3 bg-white dark:bg-green-900 rounded-lg">
                              <div className="text-2xl font-bold text-green-700 dark:text-green-400" data-testid={`result-processing-${caseItem.id}`}>
                                {caseItem.results.processingTime}
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-500">Скорость обработки</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* ROI Analysis */}
                      <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <DollarSign className="h-5 w-5" />
                            ROI Анализ
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-blue-600 dark:text-blue-400">Инвестиции:</span>
                              <span className="font-bold text-blue-700 dark:text-blue-300" data-testid={`roi-investment-${caseItem.id}`}>
                                {caseItem.roi.investment}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-blue-600 dark:text-blue-400">Экономия в год:</span>
                              <span className="font-bold text-blue-700 dark:text-blue-300" data-testid={`roi-savings-${caseItem.id}`}>
                                {caseItem.roi.savings}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-blue-600 dark:text-blue-400">Окупаемость:</span>
                              <span className="font-bold text-blue-700 dark:text-blue-300" data-testid={`roi-payback-${caseItem.id}`}>
                                {caseItem.roi.payback}
                              </span>
                            </div>
                            <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-blue-700 dark:text-blue-400">ROI:</span>
                                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300" data-testid={`roi-percent-${caseItem.id}`}>
                                  {caseItem.roi.roiPercent}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Common Benefits */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Общие преимущества автоматизации
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Что получают все клиенты независимо от отрасли
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle>Экономия времени</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Автоматизация рутинных процессов освобождает юридический 
                    и IT-отделы для более важных задач.
                  </CardDescription>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      В среднем 70% экономия времени
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Автоматические отчеты
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Снижение ручных операций
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle>Снижение рисков</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Минимизация человеческого фактора и автоматическое 
                    соблюдение всех требований законодательства.
                  </CardDescription>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Исключение штрафов
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Защита репутации
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Аудиторский след
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500/10 p-2">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle>Рост эффективности</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Оптимизация бизнес-процессов и улучшение операционной 
                    эффективности компании.
                  </CardDescription>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Быстрые процессы
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Меньше бумажной работы
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Автоматические уведомления
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              Получите персональную оценку ROI для вашей компании и отрасли
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
              <Link href="/business/contact">
                <Button size="lg" variant="secondary" className="gap-2" data-testid="button-get-roi-calculation">
                  Получить расчет ROI
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/business/register">
                <Button size="lg" variant="outline" data-testid="button-start-free-trial">
                  Попробовать бесплатно
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex justify-center gap-8 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Персональная консультация
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Расчет за 24 часа
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                50+ реализованных проектов
              </div>
            </div>
          </div>
        </section>

        {/* Additional Content */}
        <div className="mt-16">
              <Tabs defaultValue="fintech" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="fintech">Финтех</TabsTrigger>
                  <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
                  <TabsTrigger value="healthcare">Медицина</TabsTrigger>
                  <TabsTrigger value="education">Образование</TabsTrigger>
                  <TabsTrigger value="government">Госсектор</TabsTrigger>
                </TabsList>
                
                <TabsContent value="fintech" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-500/10 p-2">
                            <Landmark className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle>Банк "Технологии"</CardTitle>
                            <Badge variant="secondary" className="mt-1">Финтех</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          Крупный частный банк автоматизировал обработку согласий клиентов 
                          на all-digital платформе с полным соблюдением требований AmoCRM.
                        </CardDescription>
                        
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="text-sm font-medium">Вызов</div>
                            <div className="text-sm text-muted-foreground">
                              Ручная обработка 50,000+ согласий в месяц занимала 3 FTE юристов
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Решение</div>
                            <div className="text-sm text-muted-foreground">
                              Внедрение GrandHub Business с интеграцией в mobile app и интернет-банк
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Результат</div>
                            <div className="text-sm text-muted-foreground">
                              95% автоматизация + снижение юридических рисков на 78%
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                          <div>
                            <div className="text-2xl font-bold text-green-600">₽8.4M</div>
                            <div className="text-xs text-muted-foreground">Экономия в год</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">18 дней</div>
                            <div className="text-xs text-muted-foreground">Время внедрения</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-green-500/10 p-2">
                            <Smartphone className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <CardTitle>PayTech Solutions</CardTitle>
                            <Badge variant="secondary" className="mt-1">Платежи</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          Стартап в сфере цифровых платежей обеспечил автоматизация с момента 
                          запуска, избежав штрафов и репутационных рисков.
                        </CardDescription>
                        
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="text-sm font-medium">Вызов</div>
                            <div className="text-sm text-muted-foreground">
                              Быстрый growth при соблюдении всех требований регуляторов
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Решение</div>
                            <div className="text-sm text-muted-foreground">
                              GrandHub Business как автоматизация-first подход с самого начала
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Результат</div>
                            <div className="text-sm text-muted-foreground">
                              Безпроблемное масштабирование до 100K+ пользователей
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                          <div>
                            <div className="text-2xl font-bold text-green-600">100%</div>
                            <div className="text-xs text-muted-foreground">AI-эффективность</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">24ч</div>
                            <div className="text-xs text-muted-foreground">Time to market</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="ecommerce" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-purple-500/10 p-2">
                            <ShoppingCart className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle>МегаМаркет.рф</CardTitle>
                            <Badge variant="secondary" className="mt-1">Маркетплейс</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          Крупнейший российский маркетплейс автоматизировал управление 
                          согласиями 15M+ покупателей и 200K+ продавцов.
                        </CardDescription>
                        
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="text-sm font-medium">Вызов</div>
                            <div className="text-sm text-muted-foreground">
                              Комплексные требования: B2C и B2B согласия, персонализация, аналитика
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Решение</div>
                            <div className="text-sm text-muted-foreground">
                              Enterprise внедрение с атомаризацией для конфиденциальных данных
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Результат</div>
                            <div className="text-sm text-muted-foreground">
                              Zero автоматизация incidents при обработке 500K согласий ежедневно
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                          <div>
                            <div className="text-2xl font-bold text-green-600">15M</div>
                            <div className="text-xs text-muted-foreground">Активных пользователей</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">99.9%</div>
                            <div className="text-xs text-muted-foreground">SLA uptime</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-orange-500/10 p-2">
                            <Globe className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <CardTitle>FashionRu</CardTitle>
                            <Badge variant="secondary" className="mt-1">Fashion retail</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          Сеть модных магазинов интегрировала omnichannel experience 
                          с единым управлением согласиями online и offline.
                        </CardDescription>
                        
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="text-sm font-medium">Вызов</div>
                            <div className="text-sm text-muted-foreground">
                              Унификация согласий в розничных точках и интернет-магазине
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Решение</div>
                            <div className="text-sm text-muted-foreground">
                              Единая платформа согласий с POS интеграцией и мобильным app
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Результат</div>
                            <div className="text-sm text-muted-foreground">
                              Рост повторных покупок на 34% благодаря персонализации
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                          <div>
                            <div className="text-2xl font-bold text-green-600">200+</div>
                            <div className="text-xs text-muted-foreground">Магазинов</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">34%</div>
                            <div className="text-xs text-muted-foreground">Рост retention</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="healthcare" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-red-500/10 p-2">
                            <Heart className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <CardTitle>МедТех Инновации</CardTitle>
                            <Badge variant="secondary" className="mt-1">Цифровая медицина</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          Телемедицинская платформа обеспечила защиту медицинской тайны 
                          с полным соблюдением GrandHub AI и отраслевых стандартов.
                        </CardDescription>
                        
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="text-sm font-medium">Вызов</div>
                            <div className="text-sm text-muted-foreground">
                              Особые требования к медицинским данным + врачебная тайна
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Решение</div>
                            <div className="text-sm text-muted-foreground">
                              Атомаризация медицинских карт с granular контролем доступа
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Результат</div>
                            <div className="text-sm text-muted-foreground">
                              Сертификация МЗ РФ + zero data breaches за 2 года работы
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                          <div>
                            <div className="text-2xl font-bold text-green-600">500K</div>
                            <div className="text-xs text-muted-foreground">Пациентов</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">100%</div>
                            <div className="text-xs text-muted-foreground">Security автоматизация</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate border-dashed">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-gray-500/10 p-2">
                            <Heart className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle>Ваша медицинская организация</CardTitle>
                            <Badge variant="outline" className="mt-1">Следующий кейс</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          Станьте следующей историей успеха. Автоматизируйте автоматизация 
                          в медицине с учетом всех отраслевых особенностей.
                        </CardDescription>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Соответствие требованиям МЗ РФ
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Защита врачебной тайны
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Интеграция с МИС
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Управление согласиями пациентов
                          </div>
                        </div>
                        
                        <Link href="/business/contact">
                          <Button className="w-full gap-2">
                            Обсудить проект
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="education" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-500/10 p-2">
                            <GraduationCap className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle>Университет "Прогресс"</CardTitle>
                            <Badge variant="secondary" className="mt-1">Высшее образование</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          Крупный государственный университет автоматизировал управление 
                          персональными данными 50,000+ студентов и сотрудников.
                        </CardDescription>
                        
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="text-sm font-medium">Вызов</div>
                            <div className="text-sm text-muted-foreground">
                              Комплексная система: LMS, бухгалтерия, HR, библиотека, общежития
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Решение</div>
                            <div className="text-sm text-muted-foreground">
                              Централизованная система согласий с интеграцией во все подсистемы
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Результат</div>
                            <div className="text-sm text-muted-foreground">
                              Успешная проверка Рособрнадзора + сокращение автоматизация затрат
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                          <div>
                            <div className="text-2xl font-bold text-green-600">50K</div>
                            <div className="text-xs text-muted-foreground">Пользователей</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">12</div>
                            <div className="text-xs text-muted-foreground">Интегрированных систем</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-green-500/10 p-2">
                            <Smartphone className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <CardTitle>ОбразованиеОнлайн</CardTitle>
                            <Badge variant="secondary" className="mt-1">EdTech</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          EdTech платформа для школьников обеспечила особую защиту 
                          данных несовершеннолетних согласно российскому законодательству.
                        </CardDescription>
                        
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="text-sm font-medium">Вызов</div>
                            <div className="text-sm text-muted-foreground">
                              Особые требования к данным детей + согласия родителей
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Решение</div>
                            <div className="text-sm text-muted-foreground">
                              Двухуровневая система согласий: ребенок + родители/опекуны
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Результат</div>
                            <div className="text-sm text-muted-foreground">
                              Полное соответствие детскому законодательству + рост доверия
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                          <div>
                            <div className="text-2xl font-bold text-green-600">300K</div>
                            <div className="text-xs text-muted-foreground">Учеников</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">95%</div>
                            <div className="text-xs text-muted-foreground">Родительское одобрение</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="government" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <Card className="hover-elevate">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-purple-500/10 p-2">
                            <Building2 className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle>Администрация региона</CardTitle>
                            <Badge variant="secondary" className="mt-1">Госуслуги</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          Региональная администрация автоматизировала обработку персональных 
                          данных граждан в государственных информационных системах.
                        </CardDescription>
                        
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="text-sm font-medium">Вызов</div>
                            <div className="text-sm text-muted-foreground">
                              Строгие требования ФСТЭК + интеграция с федеральными системами
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Решение</div>
                            <div className="text-sm text-muted-foreground">
                              On-premise развертывание с сертификацией по требованиям ИБ
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Результат</div>
                            <div className="text-sm text-muted-foreground">
                              Успешная аттестация ФСТЭК + повышение качества госуслуг
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                          <div>
                            <div className="text-2xl font-bold text-green-600">2M</div>
                            <div className="text-xs text-muted-foreground">Граждан в регионе</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">100%</div>
                            <div className="text-xs text-muted-foreground">ФСТЭК автоматизация</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate border-dashed">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-gray-500/10 p-2">
                            <Building2 className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle>Ваша организация</CardTitle>
                            <Badge variant="outline" className="mt-1">Следующий проект</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          Готовы стать примером эффективной цифровизации госуслуг 
                          с соблюдением всех требований информационной безопасности?
                        </CardDescription>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Соответствие требованиям ФСТЭК
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            On-premise развертывание
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Российское ПО в реестре
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Поддержка импортозамещения
                          </div>
                        </div>
                        
                        <Link href="/business/contact">
                          <Button className="w-full gap-2">
                            Обсудить проект
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
      </main>
      
      <Footer />
    </div>
  );
}
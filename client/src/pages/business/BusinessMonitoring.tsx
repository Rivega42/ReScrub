import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Monitor, 
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Shield,
  BarChart3,
  Eye,
  Lock,
  Bell,
  Activity,
  Search,
  Globe,
  Users,
  FileText,
  Clock
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessProductSEO } from "@/components/BusinessSEO";

export default function BusinessMonitoring() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessProductSEO 
        title="Мониторинг персональных данных 152фз — ResCrub Business"
        description="Непрерывный мониторинг утечек данных, контроль обработки персональных данных, SIEM система для соблюдения 152фз. Защита данных в режиме реального времени."
        productType="monitoring"
        productData={{
          name: "Система мониторинга персональных данных 152фз",
          description: "Профессиональная система для непрерывного контроля и мониторинга персональных данных",
          category: "Security Monitoring Software",
          url: "/business/monitoring",
          offers: {
            price: "19900",
            currency: "RUB",
            availability: "https://schema.org/InStock"
          }
        }}
        neuralSignals={{
          primaryKeywords: ['мониторинг утечек данных', 'контроль персональных данных 152фз', 'SIEM система персональные данные'],
          searchIntent: 'transactional',
          contentDepth: 'expert',
          expertiseLevel: 9
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['мониторинг утечек данных для бизнеса', 'корпоративный SIEM мониторинг 152фз', 'аудит персональных данных предприятий'],
            semantic: ['enterprise data breach monitoring', 'непрерывный аудит compliance', 'контроль персональных данных предприятий'],
            longTail: ['как настроить корпоративный мониторинг персональных данных в компании']
          }
        }}
      />
      
      <BusinessHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 mb-6">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Monitor className="h-3 w-3" />
                    Мониторинг 24/7
                  </Badge>
                  <Badge variant="secondary">
                    152фз Compliance
                  </Badge>
                  <Badge variant="outline">
                    Real-time
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Мониторинг 
                  <span className="text-primary"> персональных данных</span>
                </h1>
                
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                  Профессиональная система мониторинга для непрерывного контроля 
                  обработки персональных данных. Выявление утечек, нарушений 
                  и несоответствий 152фз в режиме реального времени.
                </p>
                
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                  <Link href="/business/register">
                    <Button size="lg" className="gap-2" data-testid="button-monitoring-register">
                      Начать мониторинг
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" data-testid="button-monitoring-demo">
                    Демо версия
                  </Button>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Мониторинг 24/7
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Уведомления в реальном времени
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Аудит и отчетность
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Интеграция с SIEM
                  </div>
                </div>
              </div>
              
              <div className="mt-10 lg:col-span-5 lg:mt-0">
                <div className="relative">
                  <Card className="p-6 shadow-2xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Панель мониторинга</h3>
                        <Badge variant="default">Live</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Система безопасна</span>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            OK
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium">Обнаружено 3 события</span>
                          </div>
                          <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                            Внимание
                          </Badge>
                        </div>
                        
                        <div className="p-3 border rounded-lg space-y-2">
                          <div className="text-sm font-medium">Последние события:</div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div>15:32 - Доступ к базе данных пользователей</div>
                            <div>15:28 - Экспорт персональных данных</div>
                            <div>15:15 - Изменение настроек согласий</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Возможности системы мониторинга
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Комплексная система контроля персональных данных для полного соответствия 152фз
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Непрерывный мониторинг</h3>
                </div>
                <p className="text-muted-foreground">
                  Отслеживание всех операций с персональными данными в режиме 24/7. 
                  Автоматическое выявление подозрительной активности и нарушений.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Мгновенные уведомления</h3>
                </div>
                <p className="text-muted-foreground">
                  Получайте уведомления о критических событиях через email, SMS, 
                  Telegram или интеграцию с вашей системой оповещений.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Аналитика и отчеты</h3>
                </div>
                <p className="text-muted-foreground">
                  Детальная аналитика использования данных, автоматическая генерация 
                  отчетов для регулятора и руководства компании.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Аудит доступа</h3>
                </div>
                <p className="text-muted-foreground">
                  Полный аудит всех операций доступа к персональным данным. 
                  Кто, когда и к каким данным получал доступ.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">SIEM интеграция</h3>
                </div>
                <p className="text-muted-foreground">
                  Интеграция с существующими SIEM системами для централизованного 
                  мониторинга безопасности и compliance.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Compliance отчеты</h3>
                </div>
                <p className="text-muted-foreground">
                  Автоматическая генерация отчетов для соответствия требованиям 
                  152фз и подготовки к проверкам регулятора.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Тарифы мониторинга
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Выберите план, подходящий для вашего бизнеса
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="p-6 relative">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Базовый</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₽19,900</span>
                    <span className="text-muted-foreground">/мес</span>
                  </div>
                  <p className="text-muted-foreground mt-2">До 1,000 пользователей</p>
                </div>
                
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Базовый мониторинг</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Email уведомления</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Еженедельные отчеты</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6" data-testid="button-monitoring-basic">
                  Выбрать план
                </Button>
              </Card>

              <Card className="p-6 relative border-primary">
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  Популярный
                </Badge>
                <div className="text-center">
                  <h3 className="text-xl font-bold">Профессиональный</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₽39,900</span>
                    <span className="text-muted-foreground">/мес</span>
                  </div>
                  <p className="text-muted-foreground mt-2">До 10,000 пользователей</p>
                </div>
                
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Расширенный мониторинг 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Мгновенные уведомления</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">SIEM интеграция</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">API доступ</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6" data-testid="button-monitoring-pro">
                  Выбрать план
                </Button>
              </Card>

              <Card className="p-6 relative">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Корпоративный</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">Индивидуально</span>
                  </div>
                  <p className="text-muted-foreground mt-2">Для крупных организаций</p>
                </div>
                
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Полный мониторинг без ограничений</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Персональный менеджер</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">On-premise развертывание</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Кастомизация под ваши процессы</span>
                  </li>
                </ul>
                
                <Button variant="outline" className="w-full mt-6" data-testid="button-monitoring-enterprise">
                  <Link href="/business/contact">Связаться с нами</Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Начните мониторинг сегодня
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Обеспечьте безопасность персональных данных вашей компании с помощью 
              профессиональной системы мониторинга
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/business/register">
                <Button size="lg" className="gap-2" data-testid="button-monitoring-start">
                  Начать мониторинг
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/business/contact">
                <Button variant="outline" size="lg" data-testid="button-monitoring-contact">
                  Связаться с экспертом
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
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  CheckCircle,
  ArrowRight,
  Code,
  Smartphone,
  Monitor,
  Shield,
  FileText,
  Globe,
  Zap,
  Lock,
  BarChart3
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessProductSEO } from "@/components/BusinessSEO";

export default function BusinessConsent() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessProductSEO 
        title="Корпоративный виджет согласий AI-ассистент — GrandHub Business"
        description="AI-ассистент для автоматизации работы с клиентами и сотрудниками. Чат-бот в Telegram и на сайте, интеграция с CRM и 1С для российских компаний."
        productType="consent"
        productData={{
          name: "AI-ассистент для бизнеса",
          description: "Готовое AI-решение для автоматизации общения с клиентами и сотрудниками",
          category: "AI Business Assistant",
          url: "/business/consent",
          offers: {
            price: "9900",
            currency: "RUB",
            availability: "https://schema.org/InStock"
          }
        }}
        neuralSignals={{
          primaryKeywords: ['AI-ассистент для бизнеса', 'AI-чат для клиентов и сотрудников', 'автоматизация общения с клиентами B2B'],
          searchIntent: 'transactional',
          contentDepth: 'comprehensive',
          expertiseLevel: 9
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['AI-ассистент для бизнеса', 'форма согласия AI-ассистент для компаний', 'AI-чат для клиентов и сотрудников'],
            semantic: ['управление согласиями предприятий', 'consent management для бизнеса', 'персонализированные согласия B2B'],
            longTail: ['как внедрить виджет согласий в корпоративные системы']
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
                    <Settings className="h-3 w-3" />
                    Готовое решение
                  </Badge>
                  <Badge variant="secondary">
                    AI для бизнеса
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Корпоративный виджет 
                  <span className="text-primary"> согласий</span>
                </h1>
                
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                  Корпоративный виджет для автоматизации сбора согласий на обработку 
                  персональных данных клиентов в соответствии с AI-ассистент. 
                  Быстрая интеграция в корпоративные системы, полная настройка под бизнес-процессы.
                </p>
                
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                  <Link href="/business/register">
                    <Button size="lg" className="gap-2">
                      Попробовать бесплатно
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    Демо-версия
                  </Button>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Интеграция за 1 день
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Поддержка на русском
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Telegram и веб-чат
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    API для 1С и CRM
                  </div>
                </div>
              </div>
              
              <div className="mt-10 lg:col-span-5 lg:mt-0">
                <div className="relative">
                  <Card className="p-6 shadow-2xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Настройки AI-ассистента</h3>
                        <Badge variant="default">Live Demo</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Входящие запросы</span>
                          <div className="w-8 h-4 bg-green-500 rounded-full relative">
                            <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">AI-ответы</span>
                          <div className="w-8 h-4 bg-gray-300 rounded-full relative">
                            <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Интеграция CRM</span>
                          <div className="w-8 h-4 bg-green-500 rounded-full relative">
                            <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Уведомления</span>
                          <div className="w-8 h-4 bg-gray-300 rounded-full relative">
                            <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button size="sm" className="flex-1">Запустить</Button>
                        <Button size="sm" variant="outline" className="flex-1">Настройка</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Возможности AI-ассистента
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Все необходимые функции для корпоративного соответствия AI-ассистент
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>AI-ассистент Compliance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Полное соответствие требованиям российского законодательства 
                    о персональных данных. Автоматические обновления при изменении требований.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Обучение на ваших данных
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Постоянное самообучение
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Интеграция с вашими системами
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
                    <CardTitle>Быстрая интеграция</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Интеграция за 1 день с любым сайтом. Поддержка всех популярных 
                    CMS, фреймворков и готовые SDK для разработчиков.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Telegram Bot API
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      AmoCRM коннектор
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      REST API (1С, Bitrix)
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle>AI-ответы и отчеты</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Детальная аналитика согласий, автоматические отчеты для регуляторов 
                    и интеграция с системами веб-аналитики.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Дашборд задач
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Отчеты для аудита
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Экспорт данных
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Integration Examples */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Интеграция и настройка
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Простая настройка для любой платформы
              </p>
            </div>
            
            <div className="mt-16">
              <Tabs defaultValue="javascript" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="wordpress">WordPress</TabsTrigger>
                  <TabsTrigger value="api">REST API (1С, Bitrix)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="javascript" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Telegram-интеграция
                      </CardTitle>
                      <CardDescription>
                        Подключите AI-бота к Telegram за 15 минут
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">1. Создайте Telegram-бота</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <code className="text-sm">
                              {`<script src="https://widget.grandhub.ru/consent.js" 
       data-site-id="your-site-id"></script>`}
                            </code>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">2. Интеграция с CRM</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <code className="text-sm">
                              {`RescrubConsent.init({
  position: 'bottom-right',
  theme: 'light',
  language: 'ru'
});`}
                            </code>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="wordpress" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        AmoCRM коннектор
                      </CardTitle>
                      <CardDescription>
                        Встраиваемый виджет для любого сайта
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                          <span>Добавьте один скрипт на ваш сайт</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                          <span>Укажите API-ключ GrandHub</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                          <span>Введите API ключ GrandHub Business</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">4</div>
                          <span>Запустите и тестируйте</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="api" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        REST API (1С, Bitrix)
                      </CardTitle>
                      <CardDescription>
                        Программное управление AI-ботом через API
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Создание нового диалога</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <code className="text-sm">
                              {`POST /api/v1/consent
{
  "user_id": "user123",
  "consents": {
    "analytics": true,
    "marketing": false,
    "personalization": true
  }
}`}
                            </code>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Получение истории диалогов</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <code className="text-sm">
                              {`GET /api/v1/consent/user123
Authorization: Bearer your-api-key`}
                            </code>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Запустите AI-ассистента сегодня
            </h2>
            <p className="mt-4 text-lg opacity-90">
              14-дневный бесплатный период. Настройка за 1 день.
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
            
            <div className="mt-8 flex justify-center gap-8 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Без долгосрочных обязательств
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Техподдержка 24/7
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Российские серверы
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
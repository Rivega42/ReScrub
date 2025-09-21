import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle, 
  MessageCircle,
  Phone,
  Mail,
  Clock,
  User,
  BookOpen,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Globe,
  Users,
  FileText,
  Headphones
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessSEO } from "@/components/BusinessSEO";

export default function BusinessSupport() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessSEO 
        title="Техническая поддержка — ResCrub Business"
        description="Профессиональная техническая поддержка ResCrub Business 24/7. Помощь в настройке 152фз решений, консультации экспертов, документация и обучение."
        pageCategory="contact"
        neuralSignals={{
          primaryKeywords: ['техническая поддержка 152фз', 'помощь настройка персональные данные', 'консультации юриста 152фз'],
          searchIntent: 'informational',
          contentDepth: 'comprehensive',
          expertiseLevel: 8
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['техническая поддержка для предприятий 152фз', 'консультации по 152фз для предприятий', 'помощь внедрение защиты данных в бизнес'],
            semantic: ['корпоративная техподдержка', 'обучение сотрудников защите данных', 'DPO услуги для организаций'],
            longTail: ['консультации по 152фз для предприятий и корпоративных клиентов']
          }
        }}
      />
      
      <BusinessHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 mb-6">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Headphones className="h-3 w-3" />
                  Поддержка 24/7
                </Badge>
                <Badge variant="secondary">
                  Эксперты 152фз
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Техническая 
                <span className="text-primary"> поддержка</span>
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto">
                Профессиональная поддержка от экспертов по защите персональных данных. 
                Помогаем решить любые вопросы по 152фз и настройке наших решений.
              </p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
                <Button size="lg" className="gap-2" data-testid="button-support-chat">
                  <MessageCircle className="h-4 w-4" />
                  Написать в чат
                </Button>
                <Button variant="outline" size="lg" className="gap-2" data-testid="button-support-call">
                  <Phone className="h-4 w-4" />
                  Заказать звонок
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Способы связи
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Выберите удобный для вас способ получения помощи
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center hover-elevate">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Онлайн чат</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Мгновенные ответы на вопросы в режиме реального времени
                </p>
                <div className="flex items-center justify-center gap-1 text-sm text-green-600 mb-4">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Сейчас онлайн
                </div>
                <Button variant="outline" size="sm" data-testid="button-contact-chat">
                  Открыть чат
                </Button>
              </Card>

              <Card className="p-6 text-center hover-elevate">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Телефон</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Прямая связь с экспертами по защите данных
                </p>
                <div className="text-sm font-medium mb-2">+7 (495) 123-45-67</div>
                <div className="text-xs text-muted-foreground mb-4">
                  Пн-Пт: 9:00-20:00 МСК
                </div>
                <Button variant="outline" size="sm" data-testid="button-contact-phone">
                  Заказать звонок
                </Button>
              </Card>

              <Card className="p-6 text-center hover-elevate">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Подробные консультации и техническая помощь
                </p>
                <div className="text-sm font-medium mb-2">support@rescrub.ru</div>
                <div className="text-xs text-muted-foreground mb-4">
                  Ответ в течение 4 часов
                </div>
                <Button variant="outline" size="sm" data-testid="button-contact-email">
                  Написать email
                </Button>
              </Card>

              <Card className="p-6 text-center hover-elevate">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Персональный менеджер</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Индивидуальный подход для корпоративных клиентов
                </p>
                <div className="text-xs text-muted-foreground mb-4">
                  Для Enterprise планов
                </div>
                <Button variant="outline" size="sm" data-testid="button-contact-manager">
                  Запросить менеджера
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Часто задаваемые вопросы
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ответы на самые популярные вопросы о 152фз и наших решениях
              </p>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Как быстро можно внедрить виджет согласий на наш сайт?
                    </h3>
                    <p className="text-muted-foreground">
                      Стандартное внедрение виджета согласий занимает от 15 минут до 1 часа, 
                      в зависимости от сложности вашего сайта. Мы предоставляем готовый JavaScript 
                      код и подробную инструкцию по интеграции.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Соответствуют ли ваши решения требованиям 152фз?
                    </h3>
                    <p className="text-muted-foreground">
                      Да, все наши решения полностью соответствуют требованиям Федерального закона 
                      №152фз "О персональных данных". Мы регулярно обновляем продукты в соответствии 
                      с изменениями в законодательстве и получили экспертные заключения от юристов.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Какое время ответа службы поддержки?
                    </h3>
                    <p className="text-muted-foreground">
                      Мы гарантируем ответ на обращения в течение 4 часов в рабочее время. 
                      Критические инциденты обрабатываются в течение 1 часа. Чат поддержка 
                      работает в режиме реального времени с 9:00 до 20:00 МСК.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Предоставляете ли вы обучение сотрудников?
                    </h3>
                    <p className="text-muted-foreground">
                      Да, мы проводим онлайн-обучение для ваших сотрудников по работе с нашими 
                      системами и требованиям 152фз. Также предоставляем подробную документацию, 
                      видеоинструкции и проводим индивидуальные консультации.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Можно ли интегрировать ваши решения с существующими системами?
                    </h3>
                    <p className="text-muted-foreground">
                      Да, наши решения поддерживают интеграцию с популярными CRM, ERP системами 
                      и другими корпоративными приложениями через REST API. Мы также предоставляем 
                      готовые плагины для популярных CMS (WordPress, Битрикс, Drupal).
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Полезные ресурсы
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Документация, гайды и обучающие материалы
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link href="/business/whitepaper">
                <Card className="p-6 hover-elevate h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Техническая документация</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Подробная документация по всем нашим продуктам с примерами кода 
                    и пошаговыми инструкциями интеграции.
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-primary">
                    <span className="text-sm font-medium">Читать документацию</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>

              <Link href="/business/api">
                <Card className="p-6 hover-elevate h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">API справочник</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Полное описание всех API методов с примерами запросов и ответов. 
                    Интерактивная документация для разработчиков.
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-primary">
                    <span className="text-sm font-medium">Открыть API docs</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>

              <Card className="p-6 hover-elevate">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">База знаний</h3>
                </div>
                <p className="text-muted-foreground">
                  Обучающие статьи, видеоуроки и лучшие практики по защите 
                  персональных данных и соблюдению 152фз.
                </p>
                <div className="flex items-center gap-2 mt-4 text-primary">
                  <span className="text-sm font-medium">Перейти к материалам</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Нужна персональная консультация?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Наши эксперты помогут выбрать оптимальное решение для вашего бизнеса 
              и ответят на все вопросы по 152фз
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2" data-testid="button-support-consultation">
                <MessageCircle className="h-4 w-4" />
                Получить консультацию
              </Button>
              <Link href="/business/contact">
                <Button variant="outline" size="lg" data-testid="button-support-contact-page">
                  Все способы связи
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
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CalendarDays, 
  CheckCircle,
  ArrowRight,
  Shield,
  Database,
  Bot,
  Smartphone,
  Cloud,
  BarChart3,
  Zap,
  Globe,
  Lock,
  Settings,
  Network,
  Cpu,
  Monitor
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessDocsSEO } from "@/components/BusinessSEO";

export default function BusinessRoadmap() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessDocsSEO 
        title="Дорожная карта развития — ResCrub Business Platform"
        description="Стратегический план развития ResCrub Business на 2025-2027 годы. Новые продукты, технологии ИИ, расширение compliance возможностей и международная экспансия."
        author="ResCrub Product Team"
        publishedTime="2024-12-01"
        modifiedTime={new Date().toISOString()}
        neuralSignals={{
          primaryKeywords: ['дорожная карта защита данных', 'развитие compliance платформы', 'будущее 152фз технологий'],
          searchIntent: 'informational',
          contentDepth: 'intermediate',
          expertiseLevel: 7
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['roadmap защиты данных для бизнеса', 'планы развития корпоративного compliance', 'будущее автоматизации 152фз для предприятий'],
            semantic: ['стратегия развития business compliance', 'корпоративные планы защиты данных', 'roadmap enterprise security'],
            longTail: ['дорожная карта развития корпоративных технологий защиты данных для российского бизнеса']
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
                  <CalendarDays className="h-3 w-3" />
                  Roadmap 2025-2027
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Дорожная карта 
                <span className="text-primary"> развития</span>
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto">
                Стратегический план развития ResCrub Business Platform на ближайшие три года. 
                Новые продукты, интеграция ИИ-технологий, расширение compliance возможностей 
                и международная экспансия российского стандарта защиты данных.
              </p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
                <Link href="/business/contact">
                  <Button size="lg" className="gap-2">
                    Обсудить приоритеты
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Подписаться на обновления
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Current Status */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Текущее состояние платформы
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Достигнутые результаты и текущий уровень зрелости продуктов
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-green-500/10 p-2">
                        <Settings className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle>Виджет согласий</CardTitle>
                    </div>
                    <Badge variant="default">Готов</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Разработка</span>
                      <Progress value={100} className="w-20" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Тестирование</span>
                      <Progress value={100} className="w-20" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Производство</span>
                      <Progress value={95} className="w-20" />
                    </div>
                  </div>
                  <CardDescription className="mt-4">
                    Полнофункциональный виджет с поддержкой 152фз в production. 
                    Активно используется 500+ компаниями.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-500/10 p-2">
                        <Database className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle>Атомаризация данных</CardTitle>
                    </div>
                    <Badge variant="secondary">Beta</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Разработка</span>
                      <Progress value={90} className="w-20" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Тестирование</span>
                      <Progress value={75} className="w-20" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Производство</span>
                      <Progress value={25} className="w-20" />
                    </div>
                  </div>
                  <CardDescription className="mt-4">
                    Революционная технология в closed beta. Пилотное тестирование 
                    с 12 enterprise клиентами.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-purple-500/10 p-2">
                        <Monitor className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle>Мониторинг compliance</CardTitle>
                    </div>
                    <Badge variant="outline">Разработка</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Разработка</span>
                      <Progress value={60} className="w-20" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Тестирование</span>
                      <Progress value={30} className="w-20" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Производство</span>
                      <Progress value={0} className="w-20" />
                    </div>
                  </div>
                  <CardDescription className="mt-4">
                    Система непрерывного мониторинга нарушений 152фз. 
                    Запланирован релиз в Q2 2025.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 2025 Roadmap */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Планы на 2025 год
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ключевые релизы и новые продукты следующего года
              </p>
            </div>
            
            <div className="mt-16 space-y-8">
              {/* Q1 2025 */}
              <div className="relative">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                  <div className="lg:col-span-3">
                    <div className="sticky top-8">
                      <Badge variant="outline" className="mb-2">Q1 2025</Badge>
                      <h3 className="text-xl font-bold">Январь - Март</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Фокус на ИИ-интеграции и автоматизации
                      </p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-9 mt-6 lg:mt-0">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="hover-elevate">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-lg">ИИ-ассистент для compliance</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Интеллектуальный ассистент на базе LLM для автоматического 
                            анализа compliance требований и генерации рекомендаций.
                          </CardDescription>
                          <div className="mt-3 flex gap-2">
                            <Badge variant="secondary">Машинное обучение</Badge>
                            <Badge variant="outline">GPT-4</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover-elevate">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-green-600" />
                            <CardTitle className="text-lg">Мобильное приложение</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Нативные iOS и Android приложения для управления согласиями 
                            и мониторинга статуса защиты данных на мобильных устройствах.
                          </CardDescription>
                          <div className="mt-3 flex gap-2">
                            <Badge variant="secondary">React Native</Badge>
                            <Badge variant="outline">Push-уведомления</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>

              {/* Q2 2025 */}
              <div className="relative">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                  <div className="lg:col-span-3">
                    <div className="sticky top-8">
                      <Badge variant="outline" className="mb-2">Q2 2025</Badge>
                      <h3 className="text-xl font-bold">Апрель - Июнь</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Мониторинг и расширенная аналитика
                      </p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-9 mt-6 lg:mt-0">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="hover-elevate">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-red-600" />
                            <CardTitle className="text-lg">Система мониторинга</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Релиз полнофункциональной системы мониторинга нарушений 152фз 
                            с real-time оповещениями и автоматическими отчетами.
                          </CardDescription>
                          <div className="mt-3 flex gap-2">
                            <Badge variant="secondary">Real-time</Badge>
                            <Badge variant="outline">Kafka</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover-elevate">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-purple-600" />
                            <CardTitle className="text-lg">Advanced Analytics</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Продвинутая аналитика с предиктивными моделями для прогнозирования 
                            рисков нарушений и оптимизации compliance процессов.
                          </CardDescription>
                          <div className="mt-3 flex gap-2">
                            <Badge variant="secondary">Предиктивный анализ</Badge>
                            <Badge variant="outline">ML модели</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>

              {/* Q3 2025 */}
              <div className="relative">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                  <div className="lg:col-span-3">
                    <div className="sticky top-8">
                      <Badge variant="outline" className="mb-2">Q3 2025</Badge>
                      <h3 className="text-xl font-bold">Июль - Сентябрь</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Атомаризация в production
                      </p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-9 mt-6 lg:mt-0">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="hover-elevate">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-lg">Атомаризация GA</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            General Availability релиз технологии атомаризации данных 
                            с enterprise SLA и полной технической поддержкой.
                          </CardDescription>
                          <div className="mt-3 flex gap-2">
                            <Badge variant="default">GA Release</Badge>
                            <Badge variant="outline">Enterprise SLA</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover-elevate">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Cloud className="h-5 w-5 text-green-600" />
                            <CardTitle className="text-lg">Multi-cloud deployment</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Поддержка развертывания в российских облачных провайдерах: 
                            Яндекс.Облако, VK Cloud, СберКлауд с автоматической репликацией.
                          </CardDescription>
                          <div className="mt-3 flex gap-2">
                            <Badge variant="secondary">Мультиоблачность</Badge>
                            <Badge variant="outline">Российские облака</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>

              {/* Q4 2025 */}
              <div className="relative">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                  <div className="lg:col-span-3">
                    <div className="sticky top-8">
                      <Badge variant="outline" className="mb-2">Q4 2025</Badge>
                      <h3 className="text-xl font-bold">Октябрь - Декабрь</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Международная экспансия
                      </p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-9 mt-6 lg:mt-0">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="hover-elevate">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-orange-600" />
                            <CardTitle className="text-lg">СНГ экспансия</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Локализация платформы для стран СНГ с адаптацией 
                            под местные требования защиты персональных данных.
                          </CardDescription>
                          <div className="mt-3 flex gap-2">
                            <Badge variant="secondary">Казахстан</Badge>
                            <Badge variant="outline">Беларусь</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover-elevate">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Network className="h-5 w-5 text-indigo-600" />
                            <CardTitle className="text-lg">Blockchain интеграция</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Интеграция с российскими блокчейн платформами для 
                            неизменяемого аудита операций с персональными данными.
                          </CardDescription>
                          <div className="mt-3 flex gap-2">
                            <Badge variant="secondary">Ethereum</Badge>
                            <Badge variant="outline">Waves Platform</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2026-2027 Vision */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Видение 2026-2027
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Долгосрочная стратегия и революционные технологии будущего
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Квантовые технологии
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Интеграция квантовых алгоритмов шифрования и квантово-устойчивой 
                    криптографии для защиты от угроз квантовых компьютеров.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-muted-foreground">
                      • Квантовое распределение ключей (QKD)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • Постквантовые алгоритмы NIST
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • Квантовые генераторы случайных чисел
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-4">2026 год</Badge>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Автономный compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Полностью автономная система обеспечения compliance с использованием 
                    ИИ для принятия решений без участия человека.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-muted-foreground">
                      • Автоматическое принятие решений
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • Самообучающиеся алгоритмы
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • Предиктивное предотвращение нарушений
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-4">2027 год</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Feedback CTA */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Влияйте на развитие платформы
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Ваши потребности определяют наши приоритеты. Расскажите, какие функции важны для вашего бизнеса.
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
              <Link href="/business/contact">
                <Button size="lg" variant="secondary" className="gap-2">
                  Обсудить потребности
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Присоединиться к beta-программе
              </Button>
            </div>
            
            <div className="mt-8 flex justify-center gap-8 text-sm opacity-75">
              <div>🚀 Ранний доступ к новым функциям</div>
              <div>💬 Прямая связь с командой разработки</div>
              <div>🎯 Влияние на roadmap</div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
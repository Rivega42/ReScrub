import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
  Lock,
  HardDrive,
  Network,
  FileX,
  Key,
  Cpu,
  Globe,
  Server,
  BarChart3
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessProductSEO } from "@/components/BusinessSEO";

export default function BusinessAtomization() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessProductSEO 
        title="Атомаризация данных — Революционная защита | ResCrub Business"
        description="Инновационная технология распределенного хранения персональных данных. Максимальная безопасность через фрагментацию, шифрование и децентрализацию для российского бизнеса."
        productType="atomization"
        productData={{
          name: "Технология атомаризации данных",
          description: "Революционная система распределенного хранения персональных данных",
          category: "Data Security Technology",
          url: "/business/atomization",
          offers: {
            price: "49900",
            currency: "RUB",
            availability: "https://schema.org/PreOrder"
          }
        }}
        neuralSignals={{
          primaryKeywords: ['атомаризация данных распределенное хранение', 'фрагментация персональных данных', 'децентрализованное хранение данных'],
          searchIntent: 'informational',
          contentDepth: 'expert',
          expertiseLevel: 10
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['атомаризация данных для бизнеса', 'распределенное хранение корпоративных данных', 'технология фрагментации данных для предприятий'],
            semantic: ['микросервисы данных для компаний', 'enterprise data atomization', 'корпоративное блокчейн хранение'],
            longTail: ['как внедрить атомаризацию данных в корпоративные системы компании']
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
                    <Database className="h-3 w-3" />
                    Инновации
                  </Badge>
                  <Badge variant="secondary">
                    Patent Pending
                  </Badge>
                  <Badge variant="outline">
                    Enterprise
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Атомаризация 
                  <span className="text-primary"> данных</span>
                </h1>
                
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                  Революционная технология распределенного хранения персональных данных. 
                  Максимальная безопасность через фрагментацию, криптографическую защиту 
                  и децентрализацию. Будущее защиты данных уже здесь.
                </p>
                
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                  <Link href="/business/contact">
                    <Button size="lg" className="gap-2">
                      Узнать больше
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/business/whitepaper">
                    <Button variant="outline" size="lg">
                      Техническая документация
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Невозможность восстановления
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Квантовая криптография
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Мгновенное удаление
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Российские серверы
                  </div>
                </div>
              </div>
              
              <div className="mt-10 lg:col-span-5 lg:mt-0">
                <div className="relative">
                  <Card className="p-6 shadow-2xl border-2">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                          <Database className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Атомаризация в реальном времени</span>
                        </div>
                      </div>
                      
                      {/* Visual representation of data atomization */}
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="inline-block p-4 bg-blue-100 rounded-lg">
                            <FileX className="h-8 w-8 text-blue-600" />
                          </div>
                          <p className="text-xs mt-2">Исходные данные</p>
                        </div>
                        
                        <div className="flex justify-center">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="text-center">
                              <div className="p-2 bg-green-100 rounded border-2 border-dashed border-green-300">
                                <div className="h-3 w-3 bg-green-600 rounded-full mx-auto"></div>
                              </div>
                              <p className="text-xs mt-1">Фрагмент {i}</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-center">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center p-2 bg-purple-100 rounded">
                            <Server className="h-4 w-4 text-purple-600 mx-auto" />
                            <p className="text-xs mt-1">Сервер А</p>
                          </div>
                          <div className="text-center p-2 bg-purple-100 rounded">
                            <Server className="h-4 w-4 text-purple-600 mx-auto" />
                            <p className="text-xs mt-1">Сервер Б</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Badge variant="outline" className="text-xs">
                          🔒 Максимальная защита достигнута
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Как работает атомаризация
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Революционный подход к защите персональных данных
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-4">
              <Card className="text-center hover-elevate">
                <CardHeader>
                  <div className="mx-auto rounded-lg bg-blue-500/10 p-3 w-fit">
                    <FileX className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">1. Фрагментация</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Персональные данные разбиваются на микрофрагменты, каждый из которых 
                    не несет информационной ценности отдельно от других.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate">
                <CardHeader>
                  <div className="mx-auto rounded-lg bg-green-500/10 p-3 w-fit">
                    <Key className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">2. Шифрование</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Каждый фрагмент шифруется индивидуальным ключом с использованием 
                    квантово-устойчивых алгоритмов криптографии.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate">
                <CardHeader>
                  <div className="mx-auto rounded-lg bg-purple-500/10 p-3 w-fit">
                    <Network className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">3. Распределение</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Зашифрованные фрагменты распределяются по географически разнесенным 
                    серверам в соответствии с требованиями локализации данных.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate">
                <CardHeader>
                  <div className="mx-auto rounded-lg bg-red-500/10 p-3 w-fit">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">4. Защита</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Система контроля доступа и аудита обеспечивает невозможность 
                    несанкционированного восстановления данных.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technical Advantages */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-6">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Технические преимущества
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Атомаризация решает фундаментальные проблемы традиционных методов защиты данных
                </p>
                
                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Невозможность восстановления
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Даже при компрометации части системы восстановление исходных 
                        данных математически невозможно без доступа ко всем фрагментам.
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
                        Мгновенное удаление
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Реализация "права на забвение" за миллисекунды путем 
                        уничтожения криптографических ключей фрагментов.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-green-500/10 p-2">
                        <Cpu className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Квантовая устойчивость
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Защита от будущих квантовых компьютеров с использованием 
                        постквантовых алгоритмов криптографии.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 lg:col-span-6 lg:mt-0">
                <Tabs defaultValue="security" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="security">Безопасность</TabsTrigger>
                    <TabsTrigger value="performance">Производительность</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="security" className="mt-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Многоуровневая защита
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Фрагментация данных</span>
                          <Badge variant="default">256 фрагментов</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Шифрование AES-256</span>
                          <Badge variant="default">Per-fragment</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Географическое распределение</span>
                          <Badge variant="default">5+ регионов</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Аудит доступа</span>
                          <Badge variant="default">Real-time</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="performance" className="mt-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Метрики производительности
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Время фрагментации</span>
                          <Badge variant="secondary">&lt; 100ms</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Время удаления</span>
                          <Badge variant="secondary">&lt; 50ms</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Пропускная способность</span>
                          <Badge variant="secondary">10k ops/sec</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Доступность SLA</span>
                          <Badge variant="secondary">99.99%</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="compliance" className="mt-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileX className="h-5 w-5" />
                          Соответствие стандартам
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>152фз о персональных данных</span>
                          <Badge variant="default">✓ Полное</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>GDPR Article 17</span>
                          <Badge variant="default">✓ Право на забвение</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>ISO 27001</span>
                          <Badge variant="default">✓ Сертифицировано</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>FSTEC Россия</span>
                          <Badge variant="default">✓ Соответствует</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Сценарии применения
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Атомаризация данных решает критические задачи современного бизнеса
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Банки и финтех
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Защита персональных данных клиентов, биометрии и финансовой информации 
                    с соблюдением требований ЦБ РФ и международных стандартов.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Защита ПИН-кодов и биометрии
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Соответствие требованиям ЦБ РФ
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Международные переводы
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Телеком и интернет
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Защита пользовательских данных, геолокации и метаданных трафика 
                    в соответствии с законом Яровой и требованиями Роскомнадзора.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Геолокация и метаданные
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Соответствие закону Яровой
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      DPI и анализ трафика
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileX className="h-5 w-5" />
                    Медицина и healthcare
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Защита медицинской информации, результатов анализов и генетических данных 
                    с соблюдением врачебной тайны и международных стандартов.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Медицинские карты
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Генетические данные
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      HIPAA compliance
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Государственные службы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Защита персональных данных граждан в государственных информационных 
                    системах с соблюдением требований ФСТЭК и ФСБ России.
                  </CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Госуслуги и реестры
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Соответствие ФСТЭК
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Грим документооборот
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
              Будущее защиты данных доступно сегодня
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Внедрите атомаризацию в вашу инфраструктуру и получите непревзойденный уровень защиты
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
              <Link href="/business/contact">
                <Button size="lg" variant="secondary" className="gap-2">
                  Обсудить внедрение
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/business/whitepaper">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Техническая документация
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex justify-center gap-8 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Консультация экспертов
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Пилотное внедрение
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Техническая поддержка
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
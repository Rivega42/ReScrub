import { Link } from "wouter";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Shield, Search, Database, CheckCircle, AlertTriangle, Users, Clock, Target } from "lucide-react";

export default function Whitepaper() {
  // Add SEO metadata for whitepaper page
  useEffect(() => {
    document.title = "Техническое исследование GrandHub - Защита персональных данных в России";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Комплексное техническое исследование проблем конфиденциальности персональных данных в российском интернете и методологии их защиты согласно 152-ФЗ.');
    }
    
    // Add Open Graph tags
    const addMetaTag = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };
    
    addMetaTag('og:title', 'GrandHub: Техническое исследование защиты персональных данных');
    addMetaTag('og:description', 'Анализ методологии защиты персональных данных российских граждан в соответствии с 152-ФЗ');
    addMetaTag('og:type', 'article');
    
    return () => {
      document.title = "GrandHub - Защита ваших персональных данных";
    };
  }, []);

  const sections = [
    { id: "abstract", title: "Аннотация", icon: FileText },
    { id: "introduction", title: "Введение в проблему", icon: AlertTriangle },
    { id: "market-analysis", title: "Анализ российского рынка", icon: Search },
    { id: "methodology", title: "Техническая методология", icon: Target },
    { id: "architecture", title: "Архитектура платформы", icon: Database },
    { id: "compliance", title: "Соответствие законодательству", icon: Shield },
    { id: "effectiveness", title: "Исследования эффективности", icon: CheckCircle },
    { id: "conclusions", title: "Выводы и перспективы", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4" data-testid="badge-document-type">
              Техническая документация
            </Badge>
            <h1 className="text-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              GrandHub: Автоматизированная защита персональных данных в России
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Комплексное исследование проблем конфиденциальности персональных данных 
              в российском интернете и технические решения для их защиты
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" disabled className="opacity-50 cursor-not-allowed" data-testid="button-download-pdf">
                <Download className="mr-2 h-4 w-4" />
                PDF (в разработке)
              </Button>
              <Button variant="outline" size="lg" disabled className="opacity-50 cursor-not-allowed" data-testid="button-share-document">
                Поделиться (в разработке)
              </Button>
            </div>
            
            {/* Document metadata */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Обновлено: Сентябрь 2025
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Команда GrandHub Research
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                32 страницы
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto py-4" data-testid="nav-whitepaper-sections">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"
                data-testid={`link-section-${section.id}`}
              >
                <section.icon className="h-4 w-4" />
                <span>{section.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <article className="prose prose-lg max-w-none">
          
          {/* Abstract */}
          <section id="abstract" className="mb-16" data-testid="section-abstract">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Аннотация
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-foreground leading-relaxed">
                  <p>
                    Персональные данные российских граждан широко распространены в открытом доступе 
                    через различные онлайн-платформы, брокеров данных и утечки информации. 
                    Существующие механизмы защиты данных согласно 152-ФЗ "О персональных данных" 
                    требуют индивидуальных запросов на удаление, что создает значительные барьеры для обычных пользователей.
                  </p>
                  <p>
                    GrandHub представляет концепцию автоматизированной платформы для обнаружения и запроса удаления 
                    персональных данных с российских интернет-ресурсов. Планируемая система предусматривает использование комбинации 
                    веб-сканирования, алгоритмов анализа данных и автоматизированной отправки запросов в соответствии с 
                    требованиями российского законодательства.
                  </p>
                  <p>
                    Данное исследование анализирует предлагаемую техническую архитектуру платформы, методологию 
                    обнаружения данных, процессы соответствия законодательству и теоретические подходы к 
                    автоматизации запросов на удаление персональных данных с российских интернет-ресурсов.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Introduction */}
          <section id="introduction" className="mb-16" data-testid="section-introduction">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6" />
              1. Введение в проблему
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Состояние защиты персональных данных в России</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      Российское законодательство о персональных данных, основанное на Федеральном законе 
                      № 152-ФЗ, предоставляет гражданам право на удаление своих персональных данных. 
                      Однако практическая реализация этого права сталкивается с множеством препятствий:
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-3 flex-shrink-0"></span>
                        Необходимость индивидуального обращения к каждому оператору данных
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-3 flex-shrink-0"></span>
                        Сложность идентификации всех источников персональных данных
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-3 flex-shrink-0"></span>
                        Отсутствие стандартизированных процедур удаления
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-3 flex-shrink-0"></span>
                        Длительные сроки рассмотрения заявлений (до 30 дней согласно закону)
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Масштаб проблемы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      Анализ открытых источников показывает, что персональные данные российских пользователей 
                      присутствуют на множественных платформах:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-foreground">~500</div>
                        <div className="text-sm text-muted-foreground">Оценочное количество сайтов сбора данных*</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-foreground">~30</div>
                        <div className="text-sm text-muted-foreground">Примерное число категорий данных*</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      * Оценки основаны на анализе открытых источников и публичных исследований рынка данных
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Market Analysis */}
          <section id="market-analysis" className="mb-16" data-testid="section-market-analysis">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Search className="h-6 w-6" />
              2. Анализ российского рынка данных
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Типы операторов персональных данных</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Социальные сети и мессенджеры</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        ВКонтакте, Одноклассники, Telegram каналы с открытой информацией
                      </p>
                      <Badge variant="outline">Высокий объем данных</Badge>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold mb-2">Справочные и поисковые системы</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Телефонные справочники, системы поиска людей, адресные базы
                      </p>
                      <Badge variant="outline">Публичные данные</Badge>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold mb-2">Коммерческие базы данных</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Маркетинговые агентства, CRM системы, клиентские базы
                      </p>
                      <Badge variant="outline">Коммерческое использование</Badge>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold mb-2">Государственные реестры</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        ЕГРЮЛ, ЕГРИП, реестры недвижимости с открытыми данными
                      </p>
                      <Badge variant="outline">Официальные источники</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Правовые особенности российского рынка</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      Российское законодательство создает специфические условия для работы с персональными данными:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>152-ФЗ "О персональных данных"</strong> - основной закон, регулирующий обработку персональных данных
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Постановление Правительства РФ № 1119</strong> - требования к защите персональных данных
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Требования Роскомнадзора</strong> - административные процедуры и штрафы
                        </div>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technical Methodology */}
          <section id="methodology" className="mb-16" data-testid="section-methodology">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Target className="h-6 w-6" />
              3. Техническая методология GrandHub
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Процесс обнаружения персональных данных</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">Сбор поисковых запросов</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Система формирует поисковые запросы на основе предоставленной пользователем информации 
                          (ФИО, номер телефона, email, адрес) для поиска в российских поисковых системах.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Веб-сканирование</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Автоматизированное сканирование найденных сайтов с соблюдением robots.txt 
                          и ограничений скорости для выявления страниц с персональными данными пользователя.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">Анализ и верификация</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Использование алгоритмов обработки естественного языка для подтверждения 
                          соответствия найденных данных персональной информации пользователя.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold">Категоризация данных</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Классификация найденных данных по категориям согласно 152-ФЗ: 
                          общедоступные, биометрические, специальные категории персональных данных.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Технические ограничения и этические принципы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">Технические ограничения</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Соблюдение robots.txt файлов</li>
                          <li>• Ограничение скорости запросов</li>
                          <li>• Уважение к авторским правам</li>
                          <li>• Отсутствие обхода защиты</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">Этические принципы</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Согласие пользователя на поиск</li>
                          <li>• Прозрачность процессов</li>
                          <li>• Минимизация данных</li>
                          <li>• Защита конфиденциальности</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture" className="mb-16" data-testid="section-architecture">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Database className="h-6 w-6" />
              4. Архитектура платформы
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Компоненты системы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Search className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-semibold">Поисковый модуль</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Интеграция с российскими поисковыми системами
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-semibold">Система сканирования</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Распределенное веб-сканирование
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-semibold">Модуль соответствия</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Генерация запросов согласно 152-ФЗ
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Технический стек</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Целевой Backend</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Node.js / TypeScript (базовая реализация)</li>
                        <li>• PostgreSQL для хранения данных (планируется)</li>
                        <li>• Redis для кэширования (планируется)</li>
                        <li>• Message Queue для обработки задач (планируется)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Целевые требования безопасности</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Планируется end-to-end шифрование</li>
                        <li>• Планируется двухфакторная аутентификация</li>
                        <li>• Предусматривается аудит всех операций</li>
                        <li>• Архитектурная совместимость с ГОСТ Р 57580.1-2017</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Compliance */}
          <section id="compliance" className="mb-16" data-testid="section-compliance">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Shield className="h-6 w-6" />
              5. Соответствие российскому законодательству
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Соответствие 152-ФЗ "О персональных данных"</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Статья 14. Право субъекта персональных данных на доступ к персональным данным</strong>
                          <p className="text-sm text-muted-foreground mt-1">
                            Планируемая система будет обеспечивать возможность субъекта получить информацию о наличии его персональных данных у операторов.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Статья 21. Право на удаление или уничтожение персональных данных</strong>
                          <p className="text-sm text-muted-foreground mt-1">
                            Предусматривается автоматическая генерация заявлений на удаление персональных данных в соответствии с требованиями закона.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Статья 18. Порядок обращения субъекта персональных данных</strong>
                          <p className="text-sm text-muted-foreground mt-1">
                            Соблюдение формальных требований к обращениям субъектов персональных данных к операторам.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Процедура подачи заявлений на удаление</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      Система автоматически генерирует заявления, соответствующие требованиям российского законодательства:
                    </p>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Структура заявления</h4>
                      <ol className="text-sm space-y-1">
                        <li>1. Наименование и адрес оператора персональных данных</li>
                        <li>2. ФИО и контактные данные субъекта персональных данных</li>
                        <li>3. Описание персональных данных, подлежащих удалению</li>
                        <li>4. Ссылка на статью 21 Федерального закона № 152-ФЗ</li>
                        <li>5. Требование удалить персональные данные в течение 10 дней</li>
                        <li>6. Подпись субъекта персональных данных</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Effectiveness Research */}
          <section id="effectiveness" className="mb-16" data-testid="section-effectiveness">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <CheckCircle className="h-6 w-6" />
              6. Исследования эффективности
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Методология тестирования</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      Для оценки эффективности платформы было проведено пилотное исследование 
                      с участием добровольцев, предоставивших согласие на поиск и удаление их персональных данных.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-xl font-bold text-foreground">50</div>
                        <div className="text-xs text-muted-foreground">Участников тестирования</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-xl font-bold text-foreground">200+</div>
                        <div className="text-xs text-muted-foreground">Проверенных сайтов</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-xl font-bold text-foreground">30 дней</div>
                        <div className="text-xs text-muted-foreground">Период наблюдения</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Предварительные результаты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      <em>Примечание: Данные результаты получены в ходе пилотного тестирования и требуют дополнительных исследований для статистической значимости.</em>
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="text-sm">Обнаружение персональных данных</span>
                        <Badge variant="outline">В процессе изучения</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="text-sm">Ответы операторов на запросы</span>
                        <Badge variant="outline">Мониторинг продолжается</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="text-sm">Среднее время обработки запроса</span>
                        <Badge variant="outline">15-30 дней согласно 152-ФЗ</Badge>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <strong className="text-yellow-800 dark:text-yellow-200">Важное замечание:</strong>
                          <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                            Эффективность системы зависит от готовности операторов персональных данных 
                            соблюдать требования российского законодательства. Процесс удаления может занимать 
                            время, предусмотренное законом (до 30 дней), и требует последующего мониторинга.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Conclusions */}
          <section id="conclusions" className="mb-16" data-testid="section-conclusions">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Users className="h-6 w-6" />
              7. Выводы и перспективы развития
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основные выводы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Техническая осуществимость</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Автоматизация процесса обнаружения и удаления персональных данных технически 
                          осуществима с использованием современных веб-технологий и алгоритмов обработки данных.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">Правовые аспекты</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Российское законодательство предоставляет правовую основу для запроса удаления 
                          персональных данных, однако требует дальнейшего развития механизмов принуждения к исполнению.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">Практические ограничения</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Эффективность системы ограничивается готовностью операторов данных соблюдать 
                          законодательные требования и техническими возможностями автоматического обнаружения данных.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Направления дальнейших исследований</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-3 flex-shrink-0"></span>
                      <span className="text-sm">Разработка более точных алгоритмов обнаружения персональных данных</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-3 flex-shrink-0"></span>
                      <span className="text-sm">Создание базы знаний российских операторов персональных данных</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-3 flex-shrink-0"></span>
                      <span className="text-sm">Интеграция с государственными системами мониторинга соблюдения 152-ФЗ</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-3 flex-shrink-0"></span>
                      <span className="text-sm">Расширение международного сотрудничества в области защиты данных</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Appendices */}
          <section className="mb-16" data-testid="section-appendices">
            <h2 className="text-3xl font-bold mb-8">Приложения</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Приложение А: Образец заявления на удаление персональных данных</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <div className="space-y-2">
                      <p>Оператору персональных данных</p>
                      <p>[Наименование организации]</p>
                      <p>[Адрес организации]</p>
                      <br />
                      <p>От: [ФИО субъекта персональных данных]</p>
                      <p>[Адрес субъекта]</p>
                      <p>[Контактные данные]</p>
                      <br />
                      <p><strong>ЗАЯВЛЕНИЕ</strong></p>
                      <p>о прекращении обработки и об удалении персональных данных</p>
                      <br />
                      <p>На основании статьи 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных" прошу прекратить обработку и удалить следующие мои персональные данные:</p>
                      <p>[Описание персональных данных]</p>
                      <br />
                      <p>Прошу подтвердить выполнение данного требования в письменной форме в срок, не превышающий 10 дней с даты получения настоящего заявления.</p>
                      <br />
                      <p>Дата: [Дата]</p>
                      <p>Подпись: _____________</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Приложение Б: Ссылки на нормативные документы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Федеральный закон от 27.07.2006 № 152-ФЗ</strong><br />
                      <span className="text-muted-foreground">"О персональных данных"</span>
                    </div>
                    <div>
                      <strong>Постановление Правительства РФ от 15.09.2008 № 687</strong><br />
                      <span className="text-muted-foreground">"Об утверждении Положения об особенностях обработки персональных данных"</span>
                    </div>
                    <div>
                      <strong>Приказ Роскомнадзора от 24.02.2021 № 18</strong><br />
                      <span className="text-muted-foreground">"Об утверждении требований к защите персональных данных"</span>
                    </div>
                    <div>
                      <strong>ГОСТ Р 57580.1-2017</strong><br />
                      <span className="text-muted-foreground">"Безопасность финансовых (банковских) операций. Защита информации финансовых организаций"</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </article>
      </div>

      <Footer />
    </div>
  );
}
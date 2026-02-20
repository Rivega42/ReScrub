import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import {
  Bot, Building2, FileText, MessageSquare, Shield, BarChart3, Users, Clock,
  CheckCircle, ArrowRight, Zap, BookOpen, Heart, Lock, TrendingUp, Phone,
  AlertTriangle, Search, MapPin, GraduationCap, Activity, ChevronRight
} from "lucide-react";

// Flow diagram component for citizen appeal
function AppealFlowDiagram() {
  const steps = [
    { icon: MessageSquare, label: "Обращение", sub: "Гражданин пишет", color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400" },
    { icon: Bot, label: "AI-приём", sub: "Классификация", color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400" },
    { icon: FileText, label: "Черновик", sub: "Ответ готов", color: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400" },
    { icon: Users, label: "Маршрут", sub: "Нужный отдел", color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400" },
    { icon: Clock, label: "Дедлайн", sub: "59-ФЗ контроль", color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400" },
    { icon: CheckCircle, label: "Ответ", sub: "Гражданин получил", color: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400" },
  ];

  return (
    <div className="relative py-8">
      <div className="flex flex-wrap justify-center items-center gap-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex flex-col items-center p-3 rounded-xl border-2 ${step.color} transition-transform hover:scale-105`} style={{ minWidth: 90 }}>
              <step.icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-bold">{step.label}</span>
              <span className="text-xs opacity-70 text-center">{step.sub}</span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Chat example visualization
function CitizenChatExample() {
  const messages = [
    { from: "citizen", text: "Как получить маткапитал?" },
    { from: "bot", text: "📋 Маткапитал: для семей с 2+ детьми. Сумма в 2024 — 631 тыс. ₽. Подать заявление можно через Госуслуги или МФЦ. Хотите я запишу вас на приём?" },
    { from: "citizen", text: "Да, запиши в МФЦ" },
    { from: "bot", text: "✅ Записал! МФЦ на ул. Ленина, 5 — пятница 14:00. Документы: паспорт, СНИЛС, свидетельства о рождении. Напомню за день." },
    { from: "citizen", text: "А где оплатить штраф ГИБДД?" },
    { from: "bot", text: "💳 Штраф можно оплатить прямо здесь — введите номер постановления или СТС, проверю базу и отправлю ссылку." },
  ];

  return (
    <div className="bg-muted/50 rounded-2xl border border-border p-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm font-semibold">GrandHub Госпомощник</div>
          <div className="text-xs text-green-500">● Онлайн 24/7</div>
        </div>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "citizen" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              msg.from === "citizen"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-background border border-border rounded-bl-sm"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sentiment map visualization
function SentimentMap() {
  const zones = [
    { name: "Центральный р-н", sentiment: 82, color: "bg-green-500" },
    { name: "Северный р-н", sentiment: 61, color: "bg-yellow-500" },
    { name: "Восточный р-н", sentiment: 43, color: "bg-red-500" },
    { name: "Западный р-н", sentiment: 74, color: "bg-green-400" },
    { name: "Южный р-н", sentiment: 55, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground mb-3">Индекс удовлетворённости по районам</div>
      {zones.map((zone, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${zone.color} flex-shrink-0`} />
          <span className="text-sm flex-1">{zone.name}</span>
          <div className="flex-1 bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${zone.color} transition-all duration-700`}
              style={{ width: `${zone.sentiment}%` }}
            />
          </div>
          <span className="text-sm font-semibold w-10 text-right">{zone.sentiment}%</span>
        </div>
      ))}
      <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-xs text-red-700 dark:text-red-400 font-medium">
            Восточный р-н: рост обращений по ЖКХ +34% — требует внимания
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BusinessGovernment() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 lg:py-32">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center gap-2 mb-6">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  Государственный сектор
                </Badge>
                <Badge variant="secondary">Пилотные проекты</Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
                GrandHub для государства —
                <span className="text-primary block mt-2">AI-помощник нового поколения</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                Автоматизация госуправления, единый помощник гражданина и аналитика настроений —
                всё на отечественной платформе, сертифицированной по ФСТЭК/ФСБ.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/business/contact">
                  <Button size="lg" className="gap-2">
                    Обсудить пилот
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/business/cases">
                  <Button variant="outline" size="lg">Кейсы</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="py-12 bg-muted/30 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "−40%", label: "Нагрузка на сотрудников", color: "text-green-600" },
                { value: "+60%", label: "Скорость обработки", color: "text-blue-600" },
                { value: "24/7", label: "Доступность системы", color: "text-purple-600" },
                { value: "×3", label: "ROI за первый год", color: "text-orange-600" },
              ].map((m, i) => (
                <div key={i} className="p-4">
                  <div className={`text-4xl font-bold ${m.color} mb-2`}>{m.value}</div>
                  <div className="text-sm text-muted-foreground">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Secretary */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0">AI-секретарь</Badge>
                <h2 className="text-3xl font-bold mb-6">AI-секретарь для госслужащих</h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  Умный помощник берёт на себя рутину: приём обращений, классификацию, подготовку черновиков
                  ответов и контроль сроков по 59-ФЗ.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Clock, text: "Приём обращений граждан 24/7 без выходных" },
                    { icon: Bot, text: "Автоматическая классификация по темам и срочности" },
                    { icon: FileText, text: "Черновики ответов по шаблонам ведомства" },
                    { icon: AlertTriangle, text: "Контроль дедлайнов по 59-ФЗ (30 дней)" },
                    { icon: Phone, text: "Онлайн-запись граждан на приём" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
                  <h3 className="font-semibold mb-4 text-center text-muted-foreground text-sm uppercase tracking-wide">Жизненный цикл обращения</h3>
                  <AppealFlowDiagram />
                  <div className="mt-4 p-3 rounded-lg bg-muted/50 text-center">
                    <span className="text-xs text-muted-foreground">⚡ Среднее время обработки: <strong>2 минуты</strong> вместо 2 дней</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unified Citizen Assistant */}
        <section className="py-20 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <CitizenChatExample />
              </div>
              <div className="order-1 lg:order-2">
                <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0">Единый помощник</Badge>
                <h2 className="text-3xl font-bold mb-6">Единый помощник гражданина</h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  Вместо 50 разных сайтов и очередей — один умный бот в Telegram или на сайте.
                  Все госуслуги в одном месте.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "👶 Материнский капитал",
                    "🏥 Запись к врачу",
                    "🏠 Вопросы ЖКХ",
                    "🚗 Штрафы ГИБДД",
                    "📋 Справки и документы",
                    "🎓 Школы и детсады",
                    "💼 Пособия и льготы",
                    "🏦 Налоги и ФНС",
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border text-sm hover:border-primary/50 transition-colors">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sentiment Monitoring */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-0">Мониторинг настроений</Badge>
                <h2 className="text-3xl font-bold mb-6">Аналитика настроений граждан</h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  AI анализирует все обращения и выявляет проблемные точки до того, как они
                  станут кризисом. Дашборд губернатора в реальном времени.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: BarChart3, text: "Sentiment-анализ по 27 категориям обращений" },
                    { icon: MapPin, text: "Карта проблем по районам города/региона" },
                    { icon: AlertTriangle, text: "Раннее предупреждение о росте недовольства" },
                    { icon: TrendingUp, text: "Тренды и прогноз на 30/60/90 дней" },
                    { icon: BarChart3, text: "Еженедельные дашборды для руководства" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
                <SentimentMap />
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="py-20 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Полный набор инструментов</h2>
              <p className="text-muted-foreground">Всё что нужно для цифровой трансформации госоргана</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: FileText,
                  title: "Умный документооборот",
                  color: "text-blue-600",
                  bg: "bg-blue-100 dark:bg-blue-900/30",
                  items: ["Автоклассификация входящих", "Интеллектуальная маршрутизация", "Краткие сводки длинных документов", "Поиск противоречий в НПА"]
                },
                {
                  icon: GraduationCap,
                  title: "Образование",
                  color: "text-green-600",
                  bg: "bg-green-100 dark:bg-green-900/30",
                  items: ["AI-репетитор для учеников", "Подготовка к ЕГЭ/ОГЭ", "Генерация тестов по предмету", "Аналитика успеваемости"]
                },
                {
                  icon: Heart,
                  title: "Здравоохранение",
                  color: "text-red-600",
                  bg: "bg-red-100 dark:bg-red-900/30",
                  items: ["Первичный триаж жалоб", "Напоминания о приёмах и приёме лекарств", "Умная запись к врачу", "Разгрузка колл-центра"]
                },
                {
                  icon: Search,
                  title: "Аналитика данных",
                  color: "text-purple-600",
                  bg: "bg-purple-100 dark:bg-purple-900/30",
                  items: ["Анализ больших массивов обращений", "Выявление паттернов и аномалий", "Сравнение регионов", "Отчёты по KPI"]
                },
                {
                  icon: Users,
                  title: "Внутренние коммуникации",
                  color: "text-teal-600",
                  bg: "bg-teal-100 dark:bg-teal-900/30",
                  items: ["AI-база знаний ведомства", "Автоответы на внутренние запросы", "Обучение новых сотрудников", "Корпоративный чат-бот"]
                },
                {
                  icon: Shield,
                  title: "Безопасность и суверенитет",
                  color: "text-gray-600",
                  bg: "bg-gray-100 dark:bg-gray-800",
                  items: ["Данные только на серверах в РФ", "Совместимость ФСТЭК/ФСБ", "Без зарубежных API", "Отечественные LLM-модели"]
                },
              ].map((feature, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-3`}>
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Готовы запустить пилот?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Начнём с одного ведомства — внедрим, измерим результат, масштабируем.
                Пилот за 2 месяца без риска.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/business/contact">
                  <Button size="lg" className="gap-2">
                    Обсудить пилот
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/business/cases">
                  <Button variant="outline" size="lg">Посмотреть кейсы</Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Данные в РФ
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  ФСТЭК совместимость
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Запуск за 2 месяца
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

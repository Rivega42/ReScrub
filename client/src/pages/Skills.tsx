import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import {
  Heart, GraduationCap, Briefcase, Users, Dumbbell, ArrowRight,
  CheckCircle, Bot, Calendar, DollarSign, BookOpen, ShoppingCart,
  BarChart3, Brain, Clock, Target, Plane, Baby, Zap, Utensils,
  TrendingUp, MessageSquare, Shield, Activity
} from "lucide-react";

const personas = [
  {
    id: "woman",
    emoji: "👩",
    label: "Для женщины",
    subtitle: "Здоровье, семья, саморазвитие",
    color: "from-pink-500 to-rose-500",
    cardBg: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800",
    activeBg: "bg-pink-500 text-white",
    badgeColor: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    skills: [
      {
        icon: Heart,
        title: "Женское здоровье",
        description: "AI-дневник здоровья: отслеживание цикла, симптомов, напоминания о приёмах. Персональные рекомендации.",
        tags: ["Цикл", "Симптомы", "Напоминания"],
      },
      {
        icon: DollarSign,
        title: "Семейный бюджет",
        description: "Контроль расходов, цели накопления, советы по экономии. AI анализирует траты и предлагает оптимизацию.",
        tags: ["Расходы", "Накопления", "Экономия"],
      },
      {
        icon: Zap,
        title: "Забота о себе",
        description: "Self-care планировщик: настроение, привычки, медитации, мотивация. Ваш личный коуч по жизни.",
        tags: ["Self-care", "Настроение", "Привычки"],
      },
      {
        icon: Utensils,
        title: "Рецепты и питание",
        description: "Персональное меню с учётом предпочтений и ограничений. AI подбирает рецепты под настроение и время.",
        tags: ["Меню", "Рецепты", "Нутритология"],
      },
    ],
  },
  {
    id: "student",
    emoji: "🎓",
    label: "Для студента",
    subtitle: "Учёба, планирование, финансы",
    color: "from-blue-500 to-cyan-500",
    cardBg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    activeBg: "bg-blue-500 text-white",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    skills: [
      {
        icon: GraduationCap,
        title: "Репетитор Pro",
        description: "Подготовка к ЕГЭ/ОГЭ, объяснения по любому предмету, проверка заданий. Всегда доступен.",
        tags: ["ЕГЭ/ОГЭ", "Объяснения", "Тесты"],
      },
      {
        icon: Calendar,
        title: "Умный планировщик",
        description: "Расписание занятий, дедлайны, сессия — всё в порядке. AI напоминает, помогает расставить приоритеты.",
        tags: ["Расписание", "Дедлайны", "Сессия"],
      },
      {
        icon: DollarSign,
        title: "Финансы студента",
        description: "Учёт стипендии и подработки, бюджет на месяц, советы как сэкономить и накопить.",
        tags: ["Стипендия", "Подработка", "Бюджет"],
      },
      {
        icon: BookOpen,
        title: "Конспекты AI",
        description: "Суммаризация лекций и статей, создание шпаргалок, флешкарты для запоминания.",
        tags: ["Конспекты", "Суммаризация", "Карточки"],
      },
    ],
  },
  {
    id: "entrepreneur",
    emoji: "💼",
    label: "Для предпринимателя",
    subtitle: "Бизнес, деньги, аналитика",
    color: "from-amber-500 to-orange-500",
    cardBg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    activeBg: "bg-amber-500 text-white",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    skills: [
      {
        icon: BarChart3,
        title: "Финансы Pro",
        description: "Бухгалтерский учёт, налоговые напоминания, отчёты P&L, контроль дебиторки. Финдир в кармане.",
        tags: ["Бухгалтерия", "Налоги", "Отчёты"],
      },
      {
        icon: TrendingUp,
        title: "Trading Hub",
        description: "Участие в тендерах, аукционах, продажа товаров и услуг. AI ищет лучшие сделки.",
        tags: ["Тендеры", "Аукционы", "Продажи"],
      },
      {
        icon: MessageSquare,
        title: "AI-секретарь",
        description: "Приём заявок 24/7, запись клиентов, ответы на типовые вопросы, CRM в Telegram.",
        tags: ["Заявки", "Клиенты", "CRM"],
      },
      {
        icon: BarChart3,
        title: "Бизнес-аналитика",
        description: "Дашборды метрик, анализ конкурентов, отслеживание KPI, прогнозы продаж.",
        tags: ["Дашборды", "KPI", "Прогнозы"],
      },
    ],
  },
  {
    id: "family",
    emoji: "👨‍👩‍👧‍👦",
    label: "Для семьи",
    subtitle: "Организация, дети, путешествия",
    color: "from-green-500 to-teal-500",
    cardBg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    activeBg: "bg-green-500 text-white",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    skills: [
      {
        icon: Calendar,
        title: "Семейный синхрон",
        description: "Общий календарь, список задач для всей семьи, напоминания о важных событиях.",
        tags: ["Календарь", "Задачи", "Напоминания"],
      },
      {
        icon: DollarSign,
        title: "Семейный бюджет",
        description: "Общий учёт расходов, цели накопления (отпуск, ремонт), аналитика трат семьи.",
        tags: ["Расходы", "Цели", "Аналитика"],
      },
      {
        icon: Baby,
        title: "Дети",
        description: "Расписание секций, домашние задания, дедлайны по учёбе, напоминания о прививках.",
        tags: ["Уроки", "Секции", "Здоровье"],
      },
      {
        icon: Plane,
        title: "Путешествия",
        description: "Планирование отпуска, поиск билетов и отелей, маршруты, пакинг-лист, страховки.",
        tags: ["Билеты", "Маршруты", "Отели"],
      },
    ],
  },
  {
    id: "athlete",
    emoji: "💪",
    label: "Для спортсмена",
    subtitle: "Тренировки, питание, результат",
    color: "from-red-500 to-pink-500",
    cardBg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    activeBg: "bg-red-500 text-white",
    badgeColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    skills: [
      {
        icon: Activity,
        title: "Здоровье и тело",
        description: "Трекинг тренировок, питание по целям, анализ сна, восстановление. Всё в одном месте.",
        tags: ["Тренировки", "Питание", "Сон"],
      },
      {
        icon: Target,
        title: "AI-коуч",
        description: "Постановка целей, работа с привычками, мотивационные push-уведомления, разбор прогресса.",
        tags: ["Цели", "Привычки", "Мотивация"],
      },
      {
        icon: Calendar,
        title: "Планировщик тренировок",
        description: "Умное расписание с учётом нагрузки, периодизация, замена упражнений при травмах.",
        tags: ["Расписание", "Периодизация", "Нагрузка"],
      },
    ],
  },
];

export default function Skills() {
  const [activePersona, setActivePersona] = useState(personas[0].id);

  const current = personas.find((p) => p.id === activePersona)!;

  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-6 inline-flex items-center gap-1">
              <Bot className="h-3 w-3" />
              Персонализированные сценарии
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              GrandHub знает,
              <span className="text-primary block mt-2">чего хотите именно вы</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Сотни навыков, настроенных под вашу жизнь. Выберите свою роль —
              и увидите, какие именно инструменты работают для вас.
            </p>
          </div>
        </section>

        {/* Persona Selector */}
        <section className="py-8 sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePersona(p.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    activePersona === p.id
                      ? `${p.activeBg} border-transparent shadow-md scale-105`
                      : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <span className="text-base">{p.emoji}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Persona Content */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Persona header */}
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">{current.emoji}</div>
              <h2 className="text-3xl font-bold mb-3">{current.label}</h2>
              <p className="text-muted-foreground text-lg">{current.subtitle}</p>
            </div>

            {/* Skills grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {current.skills.map((skill, i) => (
                <Card
                  key={`${current.id}-${i}`}
                  className={`border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${current.cardBg}`}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl ${current.badgeColor} flex items-center justify-center mb-3`}>
                      <skill.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-base">{skill.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{skill.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {skill.tags.map((tag, j) => (
                        <span key={j} className={`text-xs px-2 py-0.5 rounded-full font-medium ${current.badgeColor}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All personas overview */}
        <section className="py-20 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Один помощник — для всей семьи</h2>
              <p className="text-muted-foreground">
                Каждый член семьи получает персональный профиль с настроенными навыками
              </p>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePersona(p.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`p-4 rounded-2xl border-2 text-center hover:shadow-md transition-all hover:-translate-y-1 ${
                    activePersona === p.id ? p.cardBg + " border-primary" : "bg-card border-border"
                  }`}
                >
                  <div className="text-4xl mb-2">{p.emoji}</div>
                  <div className="text-sm font-semibold">{p.label.replace("Для ", "")}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.skills.length} навыка</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Попробуйте бесплатно</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Подключите GrandHub и активируйте навыки за одну минуту.
                Первые 14 дней — бесплатно.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="gap-2">
                    Открыть в Telegram
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
                <Link href="/business/pricing">
                  <Button variant="outline" size="lg">Тарифы</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

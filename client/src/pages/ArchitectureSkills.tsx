import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Zap, ArrowLeft, ShoppingBag, Code, Link as LinkIcon, TrendingUp, Calendar, FileText, Calculator, MessageSquare, Globe, Music, Camera, Heart, Home, Briefcase, BookOpen, DollarSign, Clock, Mail } from "lucide-react";

const builtinSkills = [
  { icon: DollarSign, name: "Финансы", desc: "Бюджет, расходы, инвестиции" },
  { icon: Calendar, name: "Планировщик", desc: "Задачи, напоминания, календарь" },
  { icon: TrendingUp, name: "Trading Hub", desc: "Акции, крипта, портфель" },
  { icon: FileText, name: "Документы", desc: "Шаблоны, заявления, договоры" },
  { icon: Globe, name: "Новости", desc: "Агрегация и краткое содержание" },
  { icon: Calculator, name: "Аналитика", desc: "Данные, графики, отчёты" },
  { icon: Mail, name: "Email-ассист", desc: "Составление писем, ответы" },
  { icon: Home, name: "Умный дом", desc: "Управление устройствами" },
  { icon: Heart, name: "Здоровье", desc: "Трекинг, рекомендации" },
  { icon: BookOpen, name: "Обучение", desc: "Курсы, конспекты, тесты" },
  { icon: Briefcase, name: "HR-ассист", desc: "Резюме, собеседования" },
  { icon: Clock, name: "Тайм-менеджмент", desc: "Pomodoro, отчёты времени" },
];

const skillFlow = [
  { step: "1", icon: "📋", title: "Определение", desc: "JSON-схема: название, описание, входные параметры, permissions" },
  { step: "2", icon: "🔧", title: "Tools", desc: "Набор функций-инструментов. AI вызывает их автоматически" },
  { step: "3", icon: "⚡", title: "Execution", desc: "Secure sandbox выполняет код. Результат возвращается AI" },
  { step: "4", icon: "💬", title: "Response", desc: "AI формирует финальный ответ пользователю с результатом" },
];

const colorBorder: Record<string, string> = {
  purple: "border-purple-500/40 bg-purple-500/5",
  cyan: "border-cyan-500/40 bg-cyan-500/5",
  emerald: "border-emerald-500/40 bg-emerald-500/5",
};
const colorText: Record<string, string> = {
  purple: "text-purple-400",
  cyan: "text-cyan-400",
  emerald: "text-emerald-400",
};

export default function ArchitectureSkills() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link href="/architecture">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors cursor-pointer">
                <ArrowLeft className="h-4 w-4" /> Архитектура
              </div>
            </Link>
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-400 mb-6">
                <Zap className="mr-2 h-4 w-4" />
                Система навыков
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Навыки — суперсилы{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">
                  твоего ассистента
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                12 встроенных навыков + 169 из Marketplace. Каждый навык — это специализированный
                инструмент, который AI вызывает автоматически при необходимости.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: "12", label: "Встроенных навыков", color: "purple" },
                { value: "169", label: "В Marketplace", color: "cyan" },
                { value: "No-code", label: "Создание навыков", color: "emerald" },
                { value: "Cross-skill", label: "Экосистема", color: "purple" },
              ].map((s) => (
                <div key={s.label} className={`rounded-2xl border p-5 text-center ${colorBorder[s.color]}`}>
                  <div className={`text-2xl sm:text-3xl font-bold mb-1 ${colorText[s.color]}`}>{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Built-in skills grid */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">
              12 встроенных навыков
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
              Доступны сразу после подключения — без настройки
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {builtinSkills.map((skill, i) => {
                const Icon = skill.icon;
                const colors = ["purple", "cyan", "emerald"];
                const color = colors[i % 3];
                return (
                  <div
                    key={skill.name}
                    className={`rounded-2xl border p-4 text-center group hover:scale-[1.03] transition-transform cursor-default ${colorBorder[color]}`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl mx-auto mb-3 bg-${color}-500/20`}>
                      <Icon className={`h-5 w-5 ${colorText[color]}`} />
                    </div>
                    <div className="font-semibold text-sm text-foreground">{skill.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{skill.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Skill lifecycle */}
        <section className="py-16 bg-muted/20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-10 text-center">
              Как работает навык
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {skillFlow.map((step) => (
                <div key={step.step} className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{step.icon}</span>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Шаг {step.step}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skill definition example */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Анатомия навыка
            </h2>
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <pre className="text-sm text-muted-foreground font-mono leading-relaxed overflow-x-auto">
{`// Пример навыка: Финансовый трекер
const financeSkill = {
  name: "finance_tracker",
  description: "Трекинг доходов и расходов пользователя",
  permissions: ["read:transactions", "write:budget"],

  tools: [
    {
      name: "add_expense",
      description: "Добавить расход",
      parameters: {
        amount: { type: "number", required: true },
        category: { type: "string" },
        note: { type: "string" },
      },
      execute: async ({ amount, category, note }, ctx) => {
        // Secure execution в изолированном контексте
        return await db.insertTransaction(ctx.userId, {
          amount, category, note,
          timestamp: Date.now(),
        });
      },
    },
    {
      name: "get_summary",
      description: "Получить сводку за период",
      parameters: { period: { type: "string", enum: ["week", "month"] } },
      execute: async ({ period }, ctx) => {
        return await analytics.getSummary(ctx.userId, period);
      },
    },
  ],

  // Cross-skill: интеграция с Планировщиком
  crossSkillHooks: {
    "budget_exceeded": async (ctx) => {
      await plannerSkill.createReminder(ctx.userId, "Превышен бюджет!", "high");
    },
  },
};`}
              </pre>
            </div>
          </div>
        </section>

        {/* No-code & Marketplace */}
        <section className="py-16 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 mb-4">
                  <Code className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">No-code создание</h3>
                <p className="text-muted-foreground mb-4">
                  Создавай навыки через интерфейс без единой строчки кода. Опиши что должен делать
                  навык — GrandHub сгенерирует схему автоматически.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="bg-cyan-400 h-1.5 w-1.5 rounded-full" />Визуальный редактор инструментов</li>
                  <li className="flex items-center gap-2"><span className="bg-cyan-400 h-1.5 w-1.5 rounded-full" />AI-генерация схемы по описанию</li>
                  <li className="flex items-center gap-2"><span className="bg-cyan-400 h-1.5 w-1.5 rounded-full" />Тестирование в sandbox</li>
                  <li className="flex items-center gap-2"><span className="bg-cyan-400 h-1.5 w-1.5 rounded-full" />One-click публикация</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 mb-4">
                  <ShoppingBag className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Marketplace — 169 навыков</h3>
                <p className="text-muted-foreground mb-4">
                  Сообщество разработчиков создаёт навыки, которые доступны всем пользователям.
                  Монетизация через подписку или разовую оплату.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="bg-emerald-400 h-1.5 w-1.5 rounded-full" />Каталог с поиском и категориями</li>
                  <li className="flex items-center gap-2"><span className="bg-emerald-400 h-1.5 w-1.5 rounded-full" />Рейтинги и отзывы</li>
                  <li className="flex items-center gap-2"><span className="bg-emerald-400 h-1.5 w-1.5 rounded-full" />Sandbox review перед публикацией</li>
                  <li className="flex items-center gap-2"><span className="bg-emerald-400 h-1.5 w-1.5 rounded-full" />Revenue sharing для авторов</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-skill */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20 mx-auto mb-4">
              <LinkIcon className="h-8 w-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Cross-skill экосистема
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Навыки не работают в изоляции — они общаются между собой. Финансовый трекер
              уведомляет Планировщик. Trading Hub синхронизируется с Аналитикой.
              Это создаёт синергию, которую не достичь отдельными инструментами.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Финансы → Планировщик", "Trading → Аналитика", "Email → Задачи", "Новости → Дайджест", "Здоровье → Напоминания"].map((link) => (
                <span key={link} className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
                  {link}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Nav */}
        <section className="py-12 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/architecture/security">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <ArrowLeft className="h-4 w-4" /> Безопасность
              </div>
            </Link>
            <Link href="/architecture">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
                ← Обзор архитектуры
              </div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

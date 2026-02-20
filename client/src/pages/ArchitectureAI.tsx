import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Brain, Zap, ChevronRight, ArrowLeft, ArrowRight, Cpu } from "lucide-react";

const models = [
  {
    name: "GH-Light",
    role: "Быстрые задачи",
    color: "cyan",
    speed: "< 500 мс",
    cost: "дёшево",
    usecases: ["Короткие ответы", "Classify запросов", "Извлечение фактов", "Простые команды"],
    desc: "Мгновенные реакции. Идеален для рутинных операций, не требующих глубокого мышления.",
  },
  {
    name: "GH-Pro",
    role: "Рабочая лошадка",
    color: "purple",
    speed: "~2 сек",
    cost: "баланс",
    usecases: ["Анализ документов", "Написание текстов", "Планирование задач", "Сложные запросы"],
    desc: "80% всех запросов. Оптимальный баланс скорости и качества для большинства задач.",
  },
  {
    name: "GH-Ultra",
    role: "Тяжёлые задачи",
    color: "emerald",
    speed: "~5-10 сек",
    cost: "дороже",
    usecases: ["Глубокий анализ", "Стратегия", "Юридические тексты", "Исследования"],
    desc: "Самая мощная модель. Используется только когда задача требует максимального качества.",
  },
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
const colorBadge: Record<string, string> = {
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};
const colorDot: Record<string, string> = {
  purple: "bg-purple-400",
  cyan: "bg-cyan-400",
  emerald: "bg-emerald-400",
};

const flowSteps = [
  { icon: "💬", label: "Сообщение юзера", color: "purple" },
  { icon: "🛡️", label: "Guardian AI\nбезопасность", color: "emerald" },
  { icon: "🧠", label: "Smart Router\nвыбор модели", color: "cyan" },
  { icon: "💾", label: "buildContext()\nпамять + RAG", color: "purple" },
  { icon: "⚡", label: "AI Engine\n(Light/Pro/Ultra)", color: "cyan" },
  { icon: "🔧", label: "Tool Use\nнавыки", color: "emerald" },
  { icon: "✅", label: "Ответ\nпользователю", color: "purple" },
];

export default function ArchitectureAI() {
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
              <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400 mb-6">
                <Brain className="mr-2 h-4 w-4" />
                AI Runtime
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Мозг GrandHub —{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  мультимодельная архитектура
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Три уровня AI под одним умным роутером. Каждый запрос получает
                оптимальную модель — быстро, качественно, экономно.
              </p>
            </div>
          </div>
        </section>

        {/* Flow diagram */}
        <section className="py-12 bg-muted/20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xl font-semibold text-foreground mb-10">
              Flow запроса: от пользователя до ответа
            </h2>
            <div className="overflow-x-auto pb-4">
              <div className="flex items-center gap-2 min-w-max mx-auto w-fit px-4">
                {flowSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`flex flex-col items-center gap-2 w-24 text-center rounded-xl border p-3 ${colorBorder[step.color]}`}>
                      <span className="text-2xl">{step.icon}</span>
                      <span className="text-xs text-muted-foreground leading-tight whitespace-pre-line">{step.label}</span>
                    </div>
                    {i < flowSteps.length - 1 && (
                      <ChevronRight className={`h-5 w-5 shrink-0 ${colorText[step.color]}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Models */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">
              Три модели — одна платформа
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Smart Router автоматически выбирает модель под задачу
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {models.map((m) => (
                <div key={m.name} className={`rounded-2xl border p-6 ${colorBorder[m.color]}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${m.color}-500/20`}>
                      <Cpu className={`h-5 w-5 ${colorText[m.color]}`} />
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${colorBadge[m.color]}`}>
                      {m.role}
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold ${colorText[m.color]}`}>{m.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 mb-4">{m.desc}</p>
                  <div className="flex gap-4 text-xs mb-4">
                    <div>
                      <span className="text-muted-foreground">Скорость: </span>
                      <span className={`font-mono font-medium ${colorText[m.color]}`}>{m.speed}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Цена: </span>
                      <span className={`font-mono font-medium ${colorText[m.color]}`}>{m.cost}</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {m.usecases.map((u) => (
                      <li key={u} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${colorDot[m.color]}`} />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Smart Router */}
        <section className="py-16 bg-muted/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
              Smart Router — автовыбор модели
            </h2>
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <pre className="text-sm text-muted-foreground font-mono leading-relaxed overflow-x-auto">
{`function smartRouter(message, context) {
  const complexity = analyzeComplexity(message);
  const hasTools   = requiresTools(message, context);
  const isLong     = message.length > 500;

  // Light: быстрые и простые
  if (complexity === 'low' && !hasTools && !isLong) {
    return 'claude-3-haiku-20240307';
  }

  // Ultra: только когда реально нужно
  if (complexity === 'high' && (isLong || hasTools)) {
    return 'claude-3-opus-20240229';
  }

  // Pro: по умолчанию (80% запросов)
  return 'claude-3-5-sonnet-20241022';
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Key features */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-12 text-center">
              Ключевые возможности AI Runtime
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "🧠", title: "Tool Use", desc: "Навыки как инструменты. AI сам вызывает нужный skill.", color: "purple" },
                { icon: "📚", title: "1M контекст", desc: "Помощник помнит месяцы разговоров без потери контекста.", color: "cyan" },
                { icon: "⚡", title: "Streaming", desc: "Ответы появляются в реальном времени — нет ожидания.", color: "emerald" },
                { icon: "🔄", title: "Retry Logic", desc: "Автоматический retry при ошибках API с экспоненциальной паузой.", color: "purple" },
              ].map((f) => (
                <div key={f.title} className={`rounded-2xl border p-5 ${colorBorder[f.color]}`}>
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className={`font-semibold mb-1 ${colorText[f.color]}`}>{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nav */}
        <section className="py-12 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/architecture/memory">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <ArrowLeft className="h-4 w-4" /> Система памяти
              </div>
            </Link>
            <Link href="/architecture/security">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">
                Безопасность <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

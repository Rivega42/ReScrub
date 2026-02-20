import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Database, Zap, Search, RefreshCw, ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";

const levels = [
  {
    level: 1,
    color: "purple",
    icon: Zap,
    title: "Regex-факты",
    subtitle: "Мгновенно · Бесплатно",
    desc: "10 регулярных паттернов извлекают ключевые факты прямо из сообщения — без вызова AI.",
    patterns: ["Имя: «Меня зовут...»", "Возраст: «мне 28 лет»", "Город: «живу в Москве»", "Работа: «работаю в...»", "Семья: «моя жена»", "Предпочтения: «люблю...»", "Режим: «я жаворонок»", "Цели: «хочу похудеть»", "Животные: «у меня собака»", "Хобби: «играю в...»"],
    latency: "< 1 мс",
    cost: "0 токенов",
  },
  {
    level: 2,
    color: "cyan",
    icon: Search,
    title: "RAG-векторы",
    subtitle: "Векторный движок · Семантический поиск",
    desc: "LLM извлекает факты из разговора → векторные эмбеддинги → семантический поиск + FTS fallback.",
    patterns: ["LLM-экстракция фактов", "Векторные embeddings", "Семантический поиск", "FTS-fallback (полнотекстовый)", "Дедупликация фактов", "Временное взвешивание"],
    latency: "~200 мс",
    cost: "~50 токенов",
  },
  {
    level: 3,
    color: "emerald",
    icon: RefreshCw,
    title: "Open Loops",
    subtitle: "Проактивные напоминания",
    desc: "Незавершённые темы и задачи. Бот сам возвращается к ним при следующем контакте.",
    patterns: ["Незавершённые задачи", "Ожидание результата", "Напоминания по времени", "Контекстуальные триггеры", "Цепочки диалога", "Follow-up вопросы"],
    latency: "async",
    cost: "проактивно",
  },
];

const colorBorder: Record<string, string> = {
  purple: "border-purple-500/40 bg-purple-500/5",
  cyan: "border-cyan-500/40 bg-cyan-500/5",
  emerald: "border-emerald-500/40 bg-emerald-500/5",
};
const colorIcon: Record<string, string> = {
  purple: "bg-purple-500/20 text-purple-400",
  cyan: "bg-cyan-500/20 text-cyan-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
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

export default function ArchitectureMemory() {
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
                <Database className="mr-2 h-4 w-4" />
                Система памяти
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Как GrandHub тебя{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  запоминает
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                3-уровневая система памяти: от мгновенных regex-фактов до семантических векторов
                и проактивных напоминаний. Бот помнит тебя навсегда.
              </p>
            </div>
          </div>
        </section>

        {/* Pyramid diagram */}
        <section className="py-8 bg-muted/20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xl font-semibold text-foreground mb-10">
              Пирамида памяти
            </h2>
            <div className="flex flex-col items-center gap-2 max-w-2xl mx-auto">
              {/* Level 3 (top = slowest but deepest) */}
              <div className="w-full max-w-xl rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-6 py-4 text-center">
                <div className="text-xs text-emerald-400 font-semibold mb-1">УРОВЕНЬ 3 — ГЛУБОКИЙ</div>
                <div className="text-base font-semibold text-foreground">Open Loops</div>
                <div className="text-sm text-muted-foreground">незавершённые темы · проактивные напоминания</div>
              </div>
              <div className="text-muted-foreground text-lg">↓</div>
              {/* Level 2 */}
              <div className="w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-cyan-500/5 px-6 py-4 text-center">
                <div className="text-xs text-cyan-400 font-semibold mb-1">УРОВЕНЬ 2 — СЕМАНТИКА</div>
                <div className="text-base font-semibold text-foreground">RAG-векторы</div>
                <div className="text-sm text-muted-foreground">embeddings · semantic search · FTS fallback</div>
              </div>
              <div className="text-muted-foreground text-lg">↓</div>
              {/* Level 1 (base = fastest) */}
              <div className="w-full rounded-2xl border border-purple-500/30 bg-purple-500/5 px-6 py-4 text-center">
                <div className="text-xs text-purple-400 font-semibold mb-1">УРОВЕНЬ 1 — БЫСТРЫЙ (БАЗА)</div>
                <div className="text-base font-semibold text-foreground">Regex-факты</div>
                <div className="text-sm text-muted-foreground">10 паттернов · &lt;1 мс · 0 токенов</div>
              </div>
            </div>
          </div>
        </section>

        {/* Levels detail */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {levels.map((lvl) => {
                const Icon = lvl.icon;
                return (
                  <div key={lvl.level} className={`rounded-2xl border p-6 sm:p-8 ${colorBorder[lvl.color]}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${colorIcon[lvl.color]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className={`text-xs font-bold uppercase tracking-widest ${colorText[lvl.color]}`}>
                            Уровень {lvl.level}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${colorBadge[lvl.color]}`}>
                            {lvl.subtitle}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">{lvl.title}</h3>
                        <p className="mt-2 text-muted-foreground">{lvl.desc}</p>

                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {lvl.patterns.map((p) => (
                            <div key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${colorDot[lvl.color]}`} />
                              {p}
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Задержка: </span>
                            <span className={`font-mono font-medium ${colorText[lvl.color]}`}>{lvl.latency}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Стоимость: </span>
                            <span className={`font-mono font-medium ${colorText[lvl.color]}`}>{lvl.cost}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Example */}
        <section className="py-16 bg-muted/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
              Пример: «Меня зовут Роман, живу в Питере»
            </h2>
            <div className="space-y-4">
              {[
                { step: "1", color: "purple", text: "Regex L1 находит: имя=Роман, город=Санкт-Петербург — мгновенно, <1мс", icon: "⚡" },
                { step: "2", color: "cyan", text: "LLM извлекает: {«имя»: «Роман», «город»: «Санкт-Петербург»} → векторизация", icon: "🔍" },
                { step: "3", color: "emerald", text: "Факты сохранены в векторной БД. buildContext() добавит их в любой будущий промпт", icon: "💾" },
                { step: "4", color: "purple", text: "Следующий запрос: бот уже знает «Роман из Питера» — без повторных вопросов", icon: "✅" },
              ].map((s) => (
                <div key={s.step} className={`flex items-start gap-4 rounded-xl border p-4 ${colorBorder[s.color]}`}>
                  <div className="text-2xl w-8 text-center shrink-0">{s.icon}</div>
                  <div>
                    <span className={`text-xs font-semibold uppercase ${colorText[s.color]}`}>Шаг {s.step}</span>
                    <p className="text-sm text-muted-foreground mt-0.5">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* buildContext */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              buildContext() — сборка промпта
            </h2>
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <pre className="text-sm text-muted-foreground font-mono leading-relaxed overflow-x-auto">
{`async function buildContext(userId, message) {
  // L1: Regex-факты (синхронно, <1мс)
  const regexFacts = extractRegexFacts(message);

  // L2: RAG-поиск (async, ~200мс)
  const embedding = await voyage.embed(message);
  const ragFacts  = await vectorDB.search(userId, embedding, topK=5);

  // L3: Open Loops (незавершённые темы)
  const openLoops = await getOpenLoops(userId);

  // Сборка системного промпта
  return \`
    Пользователь: \${regexFacts.name ?? ragFacts.name}
    Город: \${ragFacts.city}
    Известные факты: \${ragFacts.join(', ')}
    Незакрытые темы: \${openLoops.join(', ')}
    Запрос: \${message}
  \`;
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Nav */}
        <section className="py-12 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/architecture">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <ArrowLeft className="h-4 w-4" /> Обзор архитектуры
              </div>
            </Link>
            <Link href="/architecture/ai">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
                AI Runtime <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

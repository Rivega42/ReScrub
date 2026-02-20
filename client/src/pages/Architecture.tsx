import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Brain, Shield, Zap, Database, ArrowRight, ChevronRight } from "lucide-react";

const subpages = [
  {
    href: "/architecture/memory",
    icon: Database,
    color: "purple",
    title: "Система памяти",
    desc: "3 уровня: Regex-факты, RAG-векторы, Open Loops. Бот запоминает тебя навсегда.",
    badge: "Уровень 1–3",
  },
  {
    href: "/architecture/ai",
    icon: Brain,
    color: "cyan",
    title: "AI Runtime",
    desc: "Мультимодельная архитектура: GH-Light, GH-Pro, GH-Ultra. Smart Router выбирает модель под задачу.",
    badge: "1M токенов",
  },
  {
    href: "/architecture/security",
    icon: Shield,
    color: "emerald",
    title: "Безопасность",
    desc: "Guardian AI, Injection Scanner, tenantId-изоляция. Твои данные — только твои.",
    badge: "Enterprise-grade",
  },
  {
    href: "/architecture/skills",
    icon: Zap,
    color: "purple",
    title: "Система навыков",
    desc: "12 встроенных + 169 из Marketplace. No-code создание. Cross-skill экосистема.",
    badge: "169 навыков",
  },
];

const colorMap: Record<string, string> = {
  purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400",
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400",
  emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400",
};
const iconColorMap: Record<string, string> = {
  purple: "bg-purple-500/20 text-purple-400",
  cyan: "bg-cyan-500/20 text-cyan-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
};
const badgeColorMap: Record<string, string> = {
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

export default function Architecture() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-400 mb-6">
                <Brain className="mr-2 h-4 w-4" />
                Техническая документация
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Архитектура GrandHub —<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  как это работает
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                GrandHub — это не просто чат-бот. Это многоуровневая AI-платформа с памятью,
                навыками и защитой. Разберём устройство по блокам.
              </p>
            </div>
          </div>
        </section>

        {/* Platform diagram */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-semibold text-foreground mb-12">
              Схема платформы
            </h2>
            {/* SVG diagram */}
            <div className="overflow-x-auto">
              <div className="min-w-[640px] max-w-4xl mx-auto">
                <svg viewBox="0 0 800 220" className="w-full h-auto" aria-label="Схема архитектуры GrandHub">
                  {/* Boxes */}
                  {/* User */}
                  <rect x="10" y="80" width="110" height="60" rx="12" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5"/>
                  <text x="65" y="105" textAnchor="middle" fontSize="11" fill="hsl(var(--foreground))" fontWeight="600">Пользователь</text>
                  <text x="65" y="122" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">Telegram</text>

                  {/* Arrow 1 */}
                  <line x1="120" y1="110" x2="155" y2="110" stroke="#a855f7" strokeWidth="2" markerEnd="url(#arrowPurple)"/>
                  <defs>
                    <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#a855f7"/>
                    </marker>
                    <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#22d3ee"/>
                    </marker>
                    <marker id="arrowEmerald" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#34d399"/>
                    </marker>
                  </defs>

                  {/* Telegram Bot */}
                  <rect x="160" y="80" width="110" height="60" rx="12" fill="hsl(var(--muted))" stroke="#a855f7" strokeWidth="1.5"/>
                  <text x="215" y="105" textAnchor="middle" fontSize="11" fill="#a855f7" fontWeight="600">Telegram Bot</text>
                  <text x="215" y="122" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">Gateway</text>

                  {/* Arrow 2 */}
                  <line x1="270" y1="110" x2="305" y2="110" stroke="#a855f7" strokeWidth="2" markerEnd="url(#arrowPurple)"/>

                  {/* AI Runtime */}
                  <rect x="310" y="70" width="120" height="80" rx="12" fill="hsl(var(--muted))" stroke="#22d3ee" strokeWidth="2"/>
                  <text x="370" y="100" textAnchor="middle" fontSize="11" fill="#22d3ee" fontWeight="600">AI Runtime</text>
                  <text x="370" y="116" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">Smart Router</text>
                  <text x="370" y="132" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">Light/Pro/Ultra</text>

                  {/* Arrow 3 — to Skills */}
                  <line x1="430" y1="95" x2="465" y2="75" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#arrowCyan)"/>
                  {/* Arrow 4 — to Memory */}
                  <line x1="430" y1="125" x2="465" y2="145" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#arrowCyan)"/>

                  {/* Skills */}
                  <rect x="470" y="40" width="110" height="60" rx="12" fill="hsl(var(--muted))" stroke="#a855f7" strokeWidth="1.5"/>
                  <text x="525" y="65" textAnchor="middle" fontSize="11" fill="#a855f7" fontWeight="600">Skills</text>
                  <text x="525" y="82" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">12 + 169 навыков</text>

                  {/* Memory */}
                  <rect x="470" y="120" width="110" height="60" rx="12" fill="hsl(var(--muted))" stroke="#34d399" strokeWidth="1.5"/>
                  <text x="525" y="145" textAnchor="middle" fontSize="11" fill="#34d399" fontWeight="600">Memory</text>
                  <text x="525" y="162" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">Regex + RAG</text>

                  {/* Arrow 5 — Memory to RAG */}
                  <line x1="580" y1="150" x2="615" y2="150" stroke="#34d399" strokeWidth="2" markerEnd="url(#arrowEmerald)"/>

                  {/* RAG */}
                  <rect x="620" y="120" width="110" height="60" rx="12" fill="hsl(var(--muted))" stroke="#34d399" strokeWidth="1.5"/>
                  <text x="675" y="145" textAnchor="middle" fontSize="11" fill="#34d399" fontWeight="600">RAG</text>
                  <text x="675" y="162" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">Векторный движок</text>

                  {/* Return arrow from AI Runtime back to User (bottom) */}
                  <path d="M370 150 Q370 200 215 200 Q120 200 65 170" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="5,4" markerEnd="url(#arrowIndigo)"/>
                  <defs>
                    <marker id="arrowIndigo" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#6366f1"/>
                    </marker>
                  </defs>
                  <text x="215" y="215" textAnchor="middle" fontSize="9" fill="#6366f1">ответ</text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-semibold text-foreground mb-4">
              Разделы архитектуры
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Углубитесь в каждый компонент платформы
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {subpages.map((page) => {
                const Icon = page.icon;
                return (
                  <Link key={page.href} href={page.href}>
                    <div className={`group relative rounded-2xl border bg-gradient-to-br p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colorMap[page.color]}`}>
                      <div className="flex items-start justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconColorMap[page.color]}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${badgeColorMap[page.color]}`}>
                          {page.badge}
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-foreground">{page.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{page.desc}</p>
                      <div className="mt-4 flex items-center text-sm font-medium text-foreground group-hover:gap-2 gap-1 transition-all">
                        Подробнее <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Попробуй GrandHub прямо сейчас
            </h2>
            <p className="text-muted-foreground mb-8">
              Вся эта архитектура работает для тебя в Telegram — бесплатно
            </p>
            <a
              href="https://t.me/Grandhub_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-600 transition-colors"
            >
              Открыть GrandHub <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

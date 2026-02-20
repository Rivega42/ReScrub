import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Link } from "wouter";
import { Brain, Zap, TrendingUp, ArrowRight } from "lucide-react";

const SOLUTIONS = [
  { icon: Brain, title: "Помнит тебя", desc: "Один помощник, который знает твои привычки, предпочтения и историю", counterValue: 1000000, counterSuffix: "+ токенов контекста", displayLabel: "1M+", href: "/features/rag-memory" },
  { icon: Zap, title: "Делает за тебя", desc: "Чеки, записи, подписки, поиск — автоматически", counterValue: 169, counterSuffix: " навыков", displayLabel: null, href: "/features/skills-marketplace" },
  { icon: TrendingUp, title: "Растёт с тобой", desc: "Чем больше общаешься, тем полезнее становится", counterValue: 22, counterSuffix: " сервиса", displayLabel: null, href: "/features/cross-skill-ecosystem" },
];

export default function Solution() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">GrandHub решает это</h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">Один помощник вместо десятка приложений</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SOLUTIONS.map((sol, i) => {
            const Icon = sol.icon;
            return (
              <div key={i} className="scroll-reveal text-center flex flex-col items-center gap-4" style={{ transitionDelay: `${i * 120}ms` }}>
                <Icon className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-2xl font-bold text-foreground">{sol.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">{sol.desc}</p>
                <div className="mt-2 rounded-xl bg-primary/10 border border-primary/20 px-6 py-3">
                  <span className="text-2xl font-bold text-primary tabular-nums">
                    {sol.displayLabel ? (
                      <>{sol.displayLabel}<span className="text-sm font-medium text-muted-foreground ml-1">токенов контекста</span></>
                    ) : (
                      <AnimatedCounter value={sol.counterValue} suffix={sol.counterSuffix} />
                    )}
                  </span>
                </div>
                <Link href={sol.href}>
                  <button className="text-sm text-foreground hover:text-muted-foreground font-medium flex items-center gap-1 transition-colors mt-2">
                    Узнать больше <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

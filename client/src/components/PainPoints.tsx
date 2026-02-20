import { GlowCard } from "@/components/GlowCard";
import { Link } from "wouter";
import { Wallet, Calendar, Bot, Home, ArrowRight } from "lucide-react";

const PAINS = [
  { icon: Wallet, title: "Расходы не считаются", desc: "Чеки теряются, подписки забываются, бюджет — в голове", href: "/features/receipts-ai" },
  { icon: Calendar, title: "Рутина съедает время", desc: "Записи, напоминания, поиск информации — всё вручную", href: "/features/ai-secretary" },
  { icon: Bot, title: "AI не помнит тебя", desc: "ChatGPT каждый раз как новый знакомый. Контекст теряется", href: "/features/rag-memory" },
  { icon: Home, title: "Нет единого помощника", desc: "Разные приложения для разных задач. Ничего не связано", href: "/features/cross-skill-ecosystem" },
];

export default function PainPoints() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Знакомо?</h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">Большинство людей сталкиваются с этими проблемами каждый день</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PAINS.map((pain, i) => {
            const Icon = pain.icon;
            return (
              <div key={i} className="scroll-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <GlowCard className="h-full p-6 flex flex-col gap-4">
                  <Icon className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">{pain.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{pain.desc}</p>
                  <Link href={pain.href}>
                    <button className="text-sm text-foreground hover:text-muted-foreground font-medium flex items-center gap-1 transition-colors">
                      Подробнее <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </GlowCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

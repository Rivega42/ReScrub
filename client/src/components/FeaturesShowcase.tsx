import { Link } from "wouter";
import { GlowCard } from "@/components/GlowCard";
import { ArrowRight, Receipt, Handshake, Brain, ShoppingCart, BarChart3, Mic } from "lucide-react";

const FEATURES = [
  { icon: Receipt, title: "Чеки + AI", desc: "Сфоткай чек — расходы посчитаются сами", href: "/features/receipts-ai" },
  { icon: Handshake, title: "AI-секретарь", desc: "Принимает заявки и записывает клиентов", href: "/features/ai-secretary" },
  { icon: Brain, title: "RAG-память", desc: "Помнит всё, что ты рассказывал", href: "/features/rag-memory" },
  { icon: ShoppingCart, title: "Маркетплейс", desc: "169 навыков — выбери нужные", href: "/features/skills-marketplace" },
  { icon: BarChart3, title: "Trading Hub", desc: "AI торгуется за тебя 24/7", href: "/features/trading-hub" },
  { icon: Mic, title: "Голос", desc: "Говори голосом — AI слушает и отвечает", href: "/features/voice-audio" },
];

export default function FeaturesShowcase() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Что умеет GrandHub</h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">169 навыков для работы, жизни и бизнеса</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="scroll-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <Link href={feat.href}>
                  <GlowCard className="h-full p-6 cursor-pointer group">
                    <div className="flex flex-col gap-4">
                      <Icon className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-muted-foreground transition-colors flex items-center gap-2">
                          {feat.title}
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200" />
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  </GlowCard>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

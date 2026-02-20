import { Link } from "wouter";
import { Smartphone, Brain, Check } from "lucide-react";

const STEPS = [
  {
    icon: Smartphone,
    title: "Напиши в Telegram",
    desc: "Отправь сообщение @Grandhub_bot — текстом, голосом или фото",
    href: "/features/telegram-bot",
  },
  {
    icon: Brain,
    title: "AI поймёт",
    desc: "Помощник разберётся в задаче, вспомнит контекст и найдёт решение",
    href: "/features/ai-assistant",
  },
  {
    icon: Check,
    title: "Получи результат",
    desc: "Чеки посчитаны, встреча записана, подписка отменена",
    href: null,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Как это работает
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
            Три шага до результата
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-0 md:gap-0">
          {STEPS.map((step, i) => {
            const IconComponent = step.icon;
            return (
              <div key={i} className="flex flex-col md:flex-row items-center flex-1 w-full">
                <div
                  className="scroll-reveal flex-1 w-full md:max-w-xs mx-auto flex flex-col items-center text-center gap-4 px-6 py-8"
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="h-16 w-16 rounded-xl border border-border flex items-center justify-center bg-background">
                    <IconComponent className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                      Шаг {i + 1}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    {step.href && (
                      <Link href={step.href}>
                        <button className="text-sm text-foreground hover:text-muted-foreground font-medium mt-3 transition-colors">
                          Узнать больше →
                        </button>
                      </Link>
                    )}
                  </div>
                </div>

                {i < STEPS.length - 1 && (
                  <>
                    <div className="hidden md:flex items-center justify-center flex-shrink-0 text-2xl text-muted-foreground">
                      →
                    </div>
                    <div className="flex md:hidden items-center justify-center text-2xl text-muted-foreground py-1">
                      ↓
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 scroll-reveal text-center">
          <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-background px-6 py-4">
            <span className="text-sm text-muted-foreground">
              В среднем <span className="font-semibold text-foreground">4 секунды</span> на ответ
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

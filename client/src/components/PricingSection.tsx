import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const TG_BOT = "https://t.me/Grandhub_bot";

const PLANS = [
  {
    name: "Free",
    price: "0₽",
    priceNote: "навсегда",
    badge: null,
    features: [
      "5 запросов в день",
      "Базовые навыки",
      "Работает в Telegram",
      "История чата 7 дней",
    ],
    cta: "Начать бесплатно",
    highlight: false,
  },
  {
    name: "Старт",
    price: "990₽",
    priceNote: "/мес",
    badge: "790₽ для первых 500",
    features: [
      "100 запросов в день",
      "30 навыков",
      "RAG-память 30 дней",
      "Распознавание чеков",
      "Голосовые сообщения",
    ],
    cta: "Подключить",
    highlight: false,
  },
  {
    name: "Про",
    price: "2 490₽",
    priceNote: "/мес",
    badge: "Популярный",
    features: [
      "Безлимитные запросы",
      "Все 169 навыков",
      "RAG-память навсегда",
      "AI-секретарь",
      "Trading Hub",
      "Приоритетная поддержка",
    ],
    cta: "Подключить",
    highlight: true,
  },
  {
    name: "Бизнес",
    price: "7 990₽",
    priceNote: "/мес",
    badge: null,
    features: [
      "До 10 пользователей",
      "Командный аккаунт",
      "Все возможности Про",
      "API доступ",
      "Аналитика команды",
      "SLA поддержка",
    ],
    cta: "Подключить",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Выбери свой тариф
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
            Начни бесплатно, вырасти до безлимита
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className={`scroll-reveal relative rounded-2xl border bg-background p-6 flex flex-col gap-4 transition-all ${
                plan.highlight
                  ? "border-muted-foreground/50 shadow-md"
                  : "border-border"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-semibold whitespace-nowrap border ${
                    plan.highlight
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border"
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.priceNote}</span>
                </div>
              </div>

              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>

              <a href={TG_BOT} target="_blank" rel="noopener noreferrer">
                <Button
                  className="w-full"
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

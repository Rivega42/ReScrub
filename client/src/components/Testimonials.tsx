import { GlowCard } from "@/components/GlowCard";

const TESTIMONIALS = [
  { name: "Роман Г.", initials: "РГ", text: "Экономлю 3 часа в неделю на рутине. AI помнит мои предпочтения и сам предлагает решения.", stars: 5 },
  { name: "Артём Е.", initials: "АЕ", text: "Наконец-то помощник, который понимает российские реалии. Чеки, Robokassa, рубли.", stars: 5 },
  { name: "Станислав М.", initials: "СМ", text: "AI-секретарь записывает клиентов за меня. Как будто нанял ассистента за 990₽/мес.", stars: 5 },
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Что говорят пользователи</h2>
          <p className="mt-3 text-muted-foreground text-lg">Реальные отзывы первых пользователей</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="scroll-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <GlowCard className="h-full p-6 flex flex-col gap-4">
                <div className="flex gap-1 text-yellow-400">
                  {Array.from({ length: t.stars }).map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="text-foreground leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="h-10 w-10 rounded-full bg-muted border border-border flex items-center justify-center text-foreground text-sm font-semibold flex-shrink-0">{t.initials}</div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">Ранний пользователь</div>
                  </div>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

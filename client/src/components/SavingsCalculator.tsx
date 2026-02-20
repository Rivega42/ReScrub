import { useState, useEffect } from "react";
import { Calculator, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRESETS = [
  { label: "30 000₽", income: 30000 },
  { label: "60 000₽", income: 60000 },
  { label: "100 000₽", income: 100000 },
  { label: "150 000₽", income: 150000 },
];

function AnimatedNumber({ value, suffix = "₽" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display.toLocaleString("ru-RU")}{suffix}</span>;
}

export default function SavingsCalculator() {
  const [income, setIncome] = useState(60000);
  const [subscriptions, setSubscriptions] = useState(3);
  const [foodSpend, setFoodSpend] = useState(30);

  // Savings logic
  const subSavings = Math.round(subscriptions * 350); // ~350₽ avg per unused sub
  const foodSavings = Math.round((income * foodSpend / 100) * 0.12); // 12% optimization
  const timeSavings = Math.round(income / 160 * 8); // 8 hours/month saved * hourly rate
  const totalSavings = subSavings + foodSavings + timeSavings;
  const yearSavings = totalSavings * 12;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 scroll-reveal">
          <div className="inline-flex items-center rounded-full bg-muted border border-border px-4 py-1.5 text-sm text-muted-foreground gap-2 mb-6">
            <Calculator className="h-4 w-4" />
            Калькулятор
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Сколько вы сэкономите с GrandHub?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Настройте параметры под себя — покажем конкретную выгоду
          </p>
        </div>

        <div className="scroll-reveal rounded-2xl border border-border bg-background shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Controls */}
            <div className="p-6 sm:p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-border">
              {/* Income */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Ежемесячный доход
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESETS.map((p) => (
                    <button
                      key={p.income}
                      onClick={() => setIncome(p.income)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        income === p.income
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min={15000}
                  max={300000}
                  step={5000}
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>15 000₽</span>
                  <span className="font-medium text-foreground">{income.toLocaleString("ru-RU")}₽</span>
                  <span>300 000₽</span>
                </div>
              </div>

              {/* Subscriptions */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Количество подписок (стриминг, приложения, сервисы)
                </label>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={1}
                  value={subscriptions}
                  onChange={(e) => setSubscriptions(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span className="font-medium text-foreground">{subscriptions} подписок</span>
                  <span>15</span>
                </div>
              </div>

              {/* Food spend */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Доля расходов на продукты и еду
                </label>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={5}
                  value={foodSpend}
                  onChange={(e) => setFoodSpend(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10%</span>
                  <span className="font-medium text-foreground">{foodSpend}% ({Math.round(income * foodSpend / 100).toLocaleString("ru-RU")}₽)</span>
                  <span>60%</span>
                </div>
              </div>
            </div>

            {/* Right: Results */}
            <div className="p-6 sm:p-8 bg-muted/20 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border">
                  <TrendingDown className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Оптимизация подписок</p>
                    <p className="text-xl font-bold text-foreground">
                      <AnimatedNumber value={subSavings} /> <span className="text-sm font-normal text-muted-foreground">/мес</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border">
                  <Wallet className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Экономия на продуктах и еде</p>
                    <p className="text-xl font-bold text-foreground">
                      <AnimatedNumber value={foodSavings} /> <span className="text-sm font-normal text-muted-foreground">/мес</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border">
                  <PiggyBank className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Экономия времени (в деньгах)</p>
                    <p className="text-xl font-bold text-foreground">
                      <AnimatedNumber value={timeSavings} /> <span className="text-sm font-normal text-muted-foreground">/мес</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20 text-center">
                <p className="text-sm text-muted-foreground mb-1">Итого экономия</p>
                <p className="text-3xl font-bold text-foreground">
                  <AnimatedNumber value={totalSavings} />
                  <span className="text-base font-normal text-muted-foreground"> /мес</span>
                </p>
                <p className="text-lg text-muted-foreground mt-2">
                  <AnimatedNumber value={yearSavings} />
                  <span className="text-sm"> /год</span>
                </p>
                <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer" className="inline-block mt-4">
                  <Button className="gap-2">
                    Начать экономить
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

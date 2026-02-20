import { useState, useEffect } from "react";
import { Clock, Users, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

function AnimNum({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [d, setD] = useState(0);
  useEffect(() => {
    let step = 0;
    const steps = 25;
    const inc = value / steps;
    const t = setInterval(() => {
      step++;
      setD(Math.min(Math.round(inc * step), value));
      if (step >= steps) clearInterval(t);
    }, 600 / steps);
    return () => clearInterval(t);
  }, [value]);
  return <span>{d.toLocaleString("ru-RU")}{suffix}</span>;
}

export default function ROICalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(2000);
  const [clientsPerDay, setClientsPerDay] = useState(5);

  const monthlyTimeCost = Math.round(hoursPerWeek * 4.3 * hourlyRate);
  const aiHandles = Math.round(clientsPerDay * 0.7 * 22); // 70% auto, 22 work days
  const timeSavedHours = Math.round(hoursPerWeek * 4.3 * 0.75); // AI saves 75%
  const moneySaved = Math.round(timeSavedHours * hourlyRate);
  const roi = Math.round((moneySaved / 2490) * 100); // vs Pro plan

  return (
    <section className="py-16 border-t border-border/30">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">Окупаемость AI-секретаря</h2>
          <p className="mt-3 text-muted-foreground">Посчитайте сколько времени и денег вернёт автоматизация</p>
        </div>

        <div className="rounded-2xl border border-border bg-background shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 sm:p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-border">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Часов в неделю на рутину (звонки, запись, FAQ)
                </label>
                <input type="range" min={2} max={40} step={1} value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>2 ч</span>
                  <span className="font-medium text-foreground">{hoursPerWeek} ч/нед</span>
                  <span>40 ч</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Стоимость вашего часа
                </label>
                <input type="range" min={500} max={10000} step={250} value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>500₽</span>
                  <span className="font-medium text-foreground">{hourlyRate.toLocaleString("ru-RU")}₽/ч</span>
                  <span>10 000₽</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Входящих обращений в день
                </label>
                <input type="range" min={1} max={50} step={1} value={clientsPerDay}
                  onChange={(e) => setClientsPerDay(Number(e.target.value))}
                  className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span className="font-medium text-foreground">{clientsPerDay} обращений/день</span>
                  <span>50</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-muted/20 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border">
                  <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Сейчас тратите в месяц</p>
                    <p className="text-xl font-bold text-foreground"><AnimNum value={monthlyTimeCost} suffix="₽" /></p>
                    <p className="text-xs text-muted-foreground">{Math.round(hoursPerWeek * 4.3)} часов</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border">
                  <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">AI обработает автоматически</p>
                    <p className="text-xl font-bold text-foreground"><AnimNum value={aiHandles} /> <span className="text-sm font-normal text-muted-foreground">обращений/мес</span></p>
                    <p className="text-xs text-muted-foreground">70% без вашего участия</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border">
                  <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Времени освободится</p>
                    <p className="text-xl font-bold text-foreground"><AnimNum value={timeSavedHours} /> <span className="text-sm font-normal text-muted-foreground">часов/мес</span></p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 rounded-xl bg-primary/5 border border-primary/20 text-center">
                <p className="text-sm text-muted-foreground mb-1">Экономия</p>
                <p className="text-3xl font-bold text-foreground"><AnimNum value={moneySaved} suffix="₽" /><span className="text-base font-normal text-muted-foreground"> /мес</span></p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <p className="text-sm text-muted-foreground">ROI: <span className="font-bold text-foreground"><AnimNum value={roi} suffix="%" /></span> от тарифа Про</p>
                </div>
                <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer" className="inline-block mt-4">
                  <Button className="gap-2">Подключить AI-секретаря</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

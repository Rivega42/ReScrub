import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Bot, Brain, Shield, TrendingUp, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import FeatureDemoChat from "@/components/FeatureDemoChat";

const DEMO_DIALOGS = [
  [
    { role: "user" as const, text: "Хочу продать iPhone 14 Pro" },
    { role: "ai" as const, type: "chart" as const, data: [{ label: "Avito", value: 85 }, { label: "Юла", value: 70 }, { label: "VK", value: 55 }, { label: "Hub", value: 95 }] },
    { role: "ai" as const, type: "table" as const, headers: ["Площадка", "Средняя цена", "Срок продажи"], rows: [["Avito", "54 000₽", "5-7 дней"], ["Trading Hub", "56 000₽", "2-3 дня"], ["VK Маркет", "51 000₽", "7-10 дней"]] },
    { role: "ai" as const, text: "Рекомендую: Trading Hub, цена выше + быстрее" },
    { role: "ai" as const, type: "buttons" as const, text: "Действия:", buttons: ["Создать объявление", "Создать аукцион", "Найти покупателя через AI"] },
  ],
  [
    { role: "user" as const, text: "Ищу подрядчика на ремонт ванной" },
    { role: "ai" as const, text: "Создаю тендер..." },
    { role: "ai" as const, type: "table" as const, headers: ["Подрядчик", "Цена", "Сроки", "Рейтинг"], rows: [["СтройКомфорт", "195 000₽", "10 дней", "★4.9"], ["Бригада Мастер", "180 000₽", "14 дней", "★4.8"], ["ИП Петров", "165 000₽", "21 день", "★4.6"]] },
    { role: "ai" as const, type: "progress" as const, label: "Отклики на тендер", current: 3, total: 10 },
    { role: "ai" as const, type: "buttons" as const, text: "Рекомендую СтройКомфорт", buttons: ["Связаться", "Запросить портфолио", "Ждать ещё отклики"] },
  ],
  [
    { role: "ai" as const, text: "Новая ставка на ваш лот MacBook Pro M3!" },
    { role: "ai" as const, type: "table" as const, headers: ["Участник", "Ставка", "Время"], rows: [["Дмитрий К.", "95 000₽", "только что"], ["Анна М.", "92 000₽", "5 мин"], ["Сергей П.", "88 000₽", "12 мин"]] },
    { role: "ai" as const, type: "chart" as const, data: [{ label: "Старт", value: 20 }, { label: "1ч", value: 45 }, { label: "2ч", value: 60 }, { label: "3ч", value: 75 }, { label: "Сейчас", value: 95 }] },
    { role: "ai" as const, type: "progress" as const, label: "До закрытия аукциона", current: 82, total: 100 },
    { role: "ai" as const, type: "buttons" as const, text: "Лидирует 95K", buttons: ["Принять ставку", "Ждать", "Повысить мин. цену"] },
  ],
];

export default function TradingHub() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Trading Hub — GrandHub" description="Аукционы, тендеры, AI-автоторг 24/7, эскроу, AI-арбитраж. Покупайте и продавайте с AI." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <TrendingUp className="h-3 w-3 mr-1" /> Q3 2026 · Планируется
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Trading Hub</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Полноценная торговая платформа: аукционы, тендеры, AI-автоторг 24/7, защищённые сделки через эскроу и AI-арбитраж при спорах.
            </p>
            <div className="mt-8">
              <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">Попробовать <ArrowRight className="h-4 w-4" /></Button>
              </a>
            </div>
              </div>
              <div className="hidden lg:flex justify-center">
                <FeatureDemoChat dialogs={DEMO_DIALOGS} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-border/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Как это работает</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { step: "1", title: "Создайте лот", desc: "Опишите что продаёте или что ищете через тендер" },
                  { step: "2", title: "AI-автоторг", desc: "ИИ автоматически торгуется по вашей стратегии 24/7" },
                  { step: "3", title: "Эскроу", desc: "Деньги заморожены — безопасная сделка для обеих сторон" },
                  { step: "4", title: "Закрытие", desc: "AI-арбитраж при спорах, автоматическое завершение сделки" },
                ].map((item) => (
                  <Card key={item.step} className="bg-muted/30 border-border/50">
                    <CardHeader>
                      <div className="text-3xl font-bold text-muted-foreground/30 mb-2">{item.step}</div>
                      <CardTitle className="text-foreground text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-muted-foreground text-sm">{item.desc}</p></CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Что даёт</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { icon: TrendingUp, title: "Аукционы и тендеры", desc: "Покупайте и продавайте на лучших условиях" },
                { icon: Bot, title: "AI-автоторг 24/7", desc: "ИИ торгуется пока вы спите по вашей стратегии" },
                { icon: Shield, title: "Эскроу", desc: "Защита денег для покупателя и продавца" },
                { icon: Brain, title: "AI-арбитраж", desc: "Нейтральное AI-решение при спорах" },
                { icon: Zap, title: "Мгновенные сделки", desc: "Автоматическое исполнение при достижении условий" },
                { icon: BarChart3, title: "Аналитика", desc: "История сделок, лучшие цены, рыночные тренды" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-background">
                  <item.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Почему это удобно</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-muted/30 border-border/50">
                <CardHeader><CardTitle className="text-muted-foreground">Альтернативы</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <p>❌ Риск мошенничества без эскроу</p>
                  <p>❌ Надо следить вручную 24/7</p>
                  <p>❌ Долгие споры при конфликтах</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Эскроу защищает обе стороны</p>
                  <p>✅ AI торгуется автоматически</p>
                  <p>✅ AI-арбитраж за минуты</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Взаимодействие с другими навыками</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/ai-secretary"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">AI-секретарь</Badge></Link>
              <Link href="/features/b2b-platform"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">B2B платформа</Badge></Link>
              <Link href="/features/billing"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Биллинг</Badge></Link>
              <Link href="/features/cross-skill-ecosystem"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Cross-skill экосистема</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Присоединяйтесь к Trading Hub — выгодные сделки с AI</p>
            <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">Открыть @Grandhub_bot <ArrowRight className="h-4 w-4" /></Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

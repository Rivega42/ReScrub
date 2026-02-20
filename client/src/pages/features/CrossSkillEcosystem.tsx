import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Database, Globe, Network, Star, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import FeatureDemoChat from "@/components/FeatureDemoChat";
import EcosystemGraph from "@/components/EcosystemGraph";

const DEMO_DIALOGS = [
  [
    { role: "user" as const, type: "image" as const, src: "/receipt.jpg", caption: "Купил продукты" },
    { role: "ai" as const, text: "Распознаю чек... Магнолия, 3 240₽" },
    { role: "ai" as const, type: "list" as const, title: "4 навыка сработали:", items: ["Финансы: записано в бюджет", "Семья: уведомлена жена", "Здоровье: обновлён рацион", "Аналитика: пересчитан прогноз"] },
    { role: "ai" as const, type: "progress" as const, label: "Бюджет семьи: Продукты", current: 22400, total: 30000 },
    { role: "ai" as const, type: "buttons" as const, text: "Что ещё?", buttons: ["Разделить с женой", "Добавить к закупкам", "Детали чека"] },
  ],
  [
    { role: "user" as const, text: "Запиши на тренировку в четверг 19:00" },
    { role: "ai" as const, type: "list" as const, title: "3 навыка задействованы:", items: ["Календарь: Чт 19:00 — Тренажёрный зал", "Здоровье: Цель 3/неделя (станет 2/3)", "Маршрут: 12 мин пешком от дома"] },
    { role: "ai" as const, type: "chart" as const, data: [{ label: "Пн", value: 100 }, { label: "Вт", value: 0 }, { label: "Ср", value: 0 }, { label: "Чт", value: 100 }, { label: "Пт", value: 0 }, { label: "Сб", value: 50 }, { label: "Вс", value: 0 }] },
    { role: "ai" as const, type: "buttons" as const, text: "Готово!", buttons: ["Напомнить собрать сумку", "Позвать друга", "Изменить время"] },
  ],
  [
    { role: "user" as const, text: "Нужно купить подарок жене до 8 марта" },
    { role: "ai" as const, text: "Проверяю бюджет + торговые площадки + историю..." },
    { role: "ai" as const, type: "table" as const, headers: ["Магазин", "Товар", "Цена", "Рейтинг"], rows: [["Wildberries", "Духи Chanel", "8 900₽", "★★★★★"], ["Ozon", "Сумка Coach", "12 400₽", "★★★★☆"], ["Л'Этуаль", "Набор косметики", "5 600₽", "★★★★★"]] },
    { role: "ai" as const, type: "progress" as const, label: "Бюджет на подарки", current: 0, total: 15000 },
    { role: "ai" as const, type: "buttons" as const, text: "Напомнить 5 марта?", buttons: ["Купить духи", "Сравнить цены", "Напомнить позже"] },
  ],
];

export default function CrossSkillEcosystem() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Cross-skill экосистема — GrandHub" description="Навыки работают вместе: чек → бюджет, голос → умный дом, заявка → Trading Hub." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Network className="h-3 w-3 mr-1" /> Q4 2026 · Планируется
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Cross-skill экосистема</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Все 169 навыков GrandHub работают вместе. Чек автоматически попадает в семейный бюджет. Голосовая команда управляет умным домом. AI объединяет всё в единую экосистему.
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
                  { step: "1", title: "Вы действуете", desc: "Фото чека, голосовая команда или сообщение" },
                  { step: "2", title: "AI определяет контекст", desc: "Понимает что нужно и какие навыки задействовать" },
                  { step: "3", title: "Навыки взаимодействуют", desc: "Чек → учёт + бюджет + аналитика одновременно" },
                  { step: "4", title: "Единый результат", desc: "Вы видите связанный результат, а не разрозненные данные" },
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

        <EcosystemGraph />

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Что даёт</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { icon: Network, title: "Связанные навыки", desc: "Навыки обмениваются данными автоматически" },
                { icon: Brain, title: "AI-оркестрация", desc: "Claude управляет вызовами нужных навыков" },
                { icon: Zap, title: "Автоматизация", desc: "Одно действие запускает цепочку навыков" },
                { icon: Database, title: "Единая память", desc: "Все навыки видят ваш контекст и историю" },
                { icon: Globe, title: "Экосистема", desc: "Не набор инструментов, а живая система" },
                { icon: Star, title: "Синергия", desc: "Навыки усиливают друг друга" },
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
                  <p>❌ Изолированные приложения</p>
                  <p>❌ Данные не передаются между сервисами</p>
                  <p>❌ Всё делаете вручную</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Навыки работают вместе</p>
                  <p>✅ Единая память для всех навыков</p>
                  <p>✅ Автоматические цепочки действий</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Взаимодействие с другими навыками</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/skills-marketplace"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Маркетплейс навыков</Badge></Link>
              <Link href="/features/rag-memory"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">RAG-память</Badge></Link>
              <Link href="/features/no-code-builder"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">No-code конструктор</Badge></Link>
              <Link href="/features/ai-assistant"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">AI-помощник</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Попробуйте экосистему — начните с любого навыка</p>
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

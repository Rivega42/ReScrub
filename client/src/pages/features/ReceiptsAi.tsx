import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Bell, Brain, Database, Receipt, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import FeatureDemoChat from "@/components/FeatureDemoChat";

const DEMO_DIALOGS = [
  [
    { role: "user" as const, type: "image" as const, src: "/receipt.jpg", caption: "Чек из Перекрёстка" },
    { role: "ai" as const, text: "Распознаю... Перекрёсток, 2 847₽" },
    { role: "ai" as const, type: "table" as const, headers: ["Позиция", "Цена"], rows: [["Молоко 3.2%", "89₽"], ["Хлеб Бородинский", "64₽"], ["Куриная грудка 1кг", "389₽"], ["Овощи, фрукты", "1 240₽"], ["Прочее", "1 065₽"]] },
    { role: "ai" as const, type: "progress" as const, label: "Бюджет: Продукты", current: 18400, total: 25000 },
    { role: "ai" as const, type: "buttons" as const, text: "Записано!", buttons: ["Детали чека", "Статистика за месяц", "Установить лимит"] },
  ],
  [
    { role: "user" as const, text: "Сколько потратил за неделю?" },
    { role: "ai" as const, type: "table" as const, headers: ["Категория", "Сумма", "Доля"], rows: [["Продукты", "6 200₽", "50%"], ["Транспорт", "3 100₽", "25%"], ["Кафе", "2 050₽", "17%"], ["Подписки", "990₽", "8%"]] },
    { role: "ai" as const, type: "chart" as const, data: [{ label: "Пн", value: 40 }, { label: "Вт", value: 15 }, { label: "Ср", value: 65 }, { label: "Чт", value: 30 }, { label: "Пт", value: 80 }, { label: "Сб", value: 55 }, { label: "Вс", value: 20 }] },
    { role: "ai" as const, text: "Итого: 12 340₽. На 8% меньше прошлой недели" },
    { role: "ai" as const, type: "buttons" as const, text: "Что дальше?", buttons: ["Сравнить с прошлым месяцем", "Экспорт в Excel", "Настроить бюджет"] },
  ],
  [
    { role: "ai" as const, text: "Новый чек из email: OFD #4829 от Яндекс.Лавка" },
    { role: "ai" as const, type: "list" as const, title: "Автоимпорт:", items: ["Яндекс.Лавка — 1 560₽", "Категория: Продукты (авто)", "Способ оплаты: Тинькофф ****4521"] },
    { role: "ai" as const, type: "progress" as const, label: "Бюджет: Продукты", current: 19960, total: 25000 },
    { role: "ai" as const, type: "chart" as const, data: [{ label: "1 нед", value: 30 }, { label: "2 нед", value: 45 }, { label: "3 нед", value: 60 }, { label: "4 нед", value: 80 }] },
    { role: "ai" as const, text: "Осталось 5 040₽. Прогноз: уложитесь с запасом 2 000₽" },
  ],
];

export default function ReceiptsAi() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Чеки + AI — GrandHub" description="Фото чека → автоматическая категоризация расходов. Интеграция с ОФД для автоимпорта." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Receipt className="h-3 w-3 mr-1" /> Март 2026 · Планируется
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Чеки + AI</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Сфотографируйте чек или настройте автоимпорт из email — AI автоматически категоризирует расходы, ведёт статистику и помогает контролировать бюджет.
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
                  { step: "1", title: "Фото или email", desc: "Сфотографируйте чек или подключите ОФД-интеграцию" },
                  { step: "2", title: "AI читает", desc: "Claude vision распознаёт: сумма, магазин, позиции" },
                  { step: "3", title: "Категоризация", desc: "Автоматически: еда, транспорт, развлечения, здоровье..." },
                  { step: "4", title: "Аналитика", desc: "Отчёты, тренды, советы по экономии" },
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
                { icon: Receipt, title: "Распознавание чеков", desc: "Любой формат — бумажный чек, PDF, скриншот" },
                { icon: Database, title: "Интеграция с ОФД", desc: "1-ofd.ru, taxcom.ru — автоимпорт без фото" },
                { icon: BarChart3, title: "Аналитика", desc: "Статистика по категориям, месяцам, магазинам" },
                { icon: Brain, title: "AI-советы", desc: "Где тратите больше и как сэкономить" },
                { icon: Bell, title: "Напоминания", desc: "Предупреждение если расходы превышают лимит" },
                { icon: Users, title: "Семейный учёт", desc: "Общий бюджет для всей семьи" },
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
                  <p>❌ Вручную вводить каждый чек</p>
                  <p>❌ Забываете занести расходы</p>
                  <p>❌ Нет аналитики по категориям</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Фото — и готово, данные записаны</p>
                  <p>✅ Автоимпорт из email от ОФД</p>
                  <p>✅ Полная аналитика и советы от AI</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Взаимодействие с другими навыками</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/family-budget"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Семейный бюджет</Badge></Link>
              <Link href="/features/subscriptions"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Трекер подписок</Badge></Link>
              <Link href="/features/billing"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Биллинг</Badge></Link>
              <Link href="/features/multimodal"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Мультимодальность</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Подключите учёт чеков — перестаньте терять деньги</p>
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

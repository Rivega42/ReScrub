import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Bell, Brain, CheckCircle2, Database, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function Subscriptions() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Трекер подписок — GrandHub" description="Яндекс.Плюс, Netflix, Spotify — AI напоминает о списаниях и помогает отменить ненужное." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Bell className="h-3 w-3 mr-1" /> Март 2026 · Планируется
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Трекер подписок</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              AI отслеживает все ваши подписки: когда следующее списание, сколько стоит, можно ли сэкономить. Никаких неожиданных списаний с карты.
            </p>
            <div className="mt-8">
              <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">Попробовать <ArrowRight className="h-4 w-4" /></Button>
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Как это работает</h2>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { step: "1", title: "Добавьте подписки", desc: "Введите список или AI найдёт их из чеков и email" },
                { step: "2", title: "AI следит", desc: "Отслеживает даты, суммы, изменения цен" },
                { step: "3", title: "Напоминания", desc: "За 3 дня до списания приходит уведомление в Telegram" },
                { step: "4", title: "Аналитика", desc: "Сколько тратите на подписки суммарно в месяц" },
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
                { icon: Bell, title: "Напоминания о списаниях", desc: "За 3 дня до списания — в Telegram" },
                { icon: BarChart3, title: "Аналитика", desc: "Суммарные расходы на подписки по месяцам" },
                { icon: Brain, title: "AI-советы", desc: "Находит дублирующиеся или неиспользуемые подписки" },
                { icon: CheckCircle2, title: "Все сервисы", desc: "Стриминг, софт, доставка, спорт — любые подписки" },
                { icon: Database, title: "Автообнаружение", desc: "AI находит подписки из чеков и банковских выписок" },
                { icon: Shield, title: "Защита от забывания", desc: "Никаких неожиданных списаний" },
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
                  <p>❌ Забываете когда списание</p>
                  <p>❌ Платите за ненужные подписки</p>
                  <p>❌ Нет понимания суммарных расходов</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Напоминание за 3 дня</p>
                  <p>✅ AI найдёт ненужные подписки</p>
                  <p>✅ Полная картина расходов на подписки</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Взаимодействие с другими навыками</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/receipts-ai"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🧾 Чеки + AI</Badge></Link>
              <Link href="/features/family-budget"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">👨‍👩‍👧 Семейный бюджет</Badge></Link>
              <Link href="/features/billing"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">💳 Биллинг</Badge></Link>
              <Link href="/features/ai-assistant"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🤖 AI-помощник</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Подключите трекер — перестаньте платить за то, чем не пользуетесь</p>
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

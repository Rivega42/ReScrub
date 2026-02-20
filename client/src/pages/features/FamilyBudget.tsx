import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Bell, Brain, Heart, Shield, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function FamilyBudget() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Семейный бюджет — GrandHub" description="Общий учёт расходов для семьи: до 5 членов, раздельные категории, единый дашборд." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Users className="h-3 w-3 mr-1" /> Март 2026 · Планируется
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Семейный бюджет</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Общий бюджет для всей семьи: каждый добавляет расходы, AI анализирует и даёт советы. До 5 человек в одном плане с гибкими правами доступа.
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
                { step: "1", title: "Создайте семью", desc: "Пригласите членов семьи по ссылке или username" },
                { step: "2", title: "Каждый добавляет", desc: "Фото чека или вручную — в общую копилку" },
                { step: "3", title: "AI анализирует", desc: "Общие расходы, категории, тренды по семье" },
                { step: "4", title: "Советы", desc: "AI видит полную картину и предлагает где сэкономить" },
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
                { icon: Users, title: "До 5 человек", desc: "Муж, жена, дети — у каждого свой аккаунт, общий бюджет" },
                { icon: BarChart3, title: "Общая аналитика", desc: "Кто, что, когда тратит — полная прозрачность" },
                { icon: Shield, title: "Гибкие права", desc: "Можно скрыть личные расходы от общего вида" },
                { icon: Brain, title: "AI-советы", desc: "Персональные советы на основе семейных паттернов" },
                { icon: Bell, title: "Лимиты и уведомления", desc: "Установите лимиты по категориям для всей семьи" },
                { icon: Heart, title: "Цели", desc: "Копите вместе на отпуск, ремонт, крупные покупки" },
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
                  <p>❌ Excel-таблицы на всю семью</p>
                  <p>❌ Кто-то забывает вносить данные</p>
                  <p>❌ Нет общей аналитики</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Каждый вносит сам через бот</p>
                  <p>✅ AI напоминает и мотивирует</p>
                  <p>✅ Полная семейная аналитика</p>
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
              <Link href="/features/subscriptions"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🔔 Трекер подписок</Badge></Link>
              <Link href="/features/billing"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">💳 Биллинг</Badge></Link>
              <Link href="/features/ai-assistant"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🤖 AI-помощник</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Настройте семейный бюджет — финансовая прозрачность для всей семьи</p>
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

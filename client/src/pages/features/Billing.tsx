import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CreditCard, Gift, ShoppingCart, Star, Users, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function Billing() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Биллинг и тарифы — GrandHub" description="Free, Старт, Про, Бизнес — тарифы как у сотового оператора. Оплата через Robokassa." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <CreditCard className="h-3 w-3 mr-1" /> Март 2026 · Планируется
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Биллинг и тарифы</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Гибкие тарифы для каждого: от бесплатного до бизнес-плана. Пополнение баланса пакетами с бонусами до 25%. Early Bird тариф для первых 500 пользователей.
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
                { step: "1", title: "Выберите тариф", desc: "Free / Старт 990₽ / Про 2490₽ / Бизнес 7990₽" },
                { step: "2", title: "Оплата", desc: "Robokassa — карта, СБП, электронные кошельки" },
                { step: "3", title: "Пакеты", desc: "Пополнение баланса пакетами 100–3000₽ с бонусами" },
                { step: "4", title: "Early Bird", desc: "Первые 500 пользователей получают скидку навсегда" },
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
                { icon: CreditCard, title: "Тариф Free", desc: "Базовые функции бесплатно — попробуйте без риска" },
                { icon: Zap, title: "Старт — 990₽/мес", desc: "Расширенные возможности для личного использования" },
                { icon: Star, title: "Про — 2490₽/мес", desc: "Все навыки, приоритетная поддержка, расширенная память" },
                { icon: Users, title: "Бизнес — 7990₽/мес", desc: "Команды, API доступ, SLA, выделенный менеджер" },
                { icon: ShoppingCart, title: "Пакеты с бонусами", desc: "До 25% бонусных токенов при пополнении" },
                { icon: Gift, title: "Early Bird", desc: "Постоянная скидка для первых 500 пользователей" },
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
                  <p>❌ Сложные тарифные планы</p>
                  <p>❌ Нельзя попробовать бесплатно</p>
                  <p>❌ Скрытые платежи и списания</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Прозрачные тарифы</p>
                  <p>✅ Бесплатный тариф навсегда</p>
                  <p>✅ Никаких скрытых платежей</p>
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
              <Link href="/features/trading-hub"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">📈 Trading Hub</Badge></Link>
              <Link href="/features/skills-marketplace"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🛒 Маркетплейс навыков</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Начните бесплатно — перейдите на платный план когда будете готовы</p>
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

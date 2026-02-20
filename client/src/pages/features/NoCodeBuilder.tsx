import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, CheckCircle2, ShoppingCart, Star, Wrench, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function NoCodeBuilder() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="No-code конструктор навыков — GrandHub" description="Создайте свой навык для AI-помощника без написания кода. Опубликуйте в маркетплейс." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Wrench className="h-3 w-3 mr-1" /> Q2 2026 · Планируется
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">No-code конструктор</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Визуальный редактор для создания навыков AI. Задайте промпт, настройте параметры, протестируйте и опубликуйте в маркетплейсе — без единой строки кода.
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
                { step: "1", title: "Опишите навык", desc: "Напишите что должен делать навык — AI поможет с промптом" },
                { step: "2", title: "Настройте", desc: "Выберите иконку, категорию, входные данные" },
                { step: "3", title: "Протестируйте", desc: "Попробуйте навык в режиме preview прямо в интерфейсе" },
                { step: "4", title: "Опубликуйте", desc: "Поделитесь с сообществом или монетизируйте в маркетплейсе" },
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
                { icon: Wrench, title: "Визуальный редактор", desc: "Drag & drop интерфейс без кода" },
                { icon: Brain, title: "AI-помощник в создании", desc: "Claude помогает написать и улучшить промпт" },
                { icon: ShoppingCart, title: "Публикация в маркетплейс", desc: "Ваш навык доступен всем пользователям" },
                { icon: Star, title: "Монетизация", desc: "Получайте доход с каждого использования" },
                { icon: CheckCircle2, title: "Version control", desc: "История версий навыка с diff-просмотром" },
                { icon: Zap, title: "Быстрый старт", desc: "Готовые шаблоны для популярных сценариев" },
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
                  <p>❌ Нужен разработчик для создания</p>
                  <p>❌ Сложные API и конфигурации</p>
                  <p>❌ Нет монетизации</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Создаёте сами без кода</p>
                  <p>✅ AI помогает написать промпт</p>
                  <p>✅ Монетизация через маркетплейс</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Взаимодействие с другими навыками</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/skills-marketplace"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🛒 Маркетплейс навыков</Badge></Link>
              <Link href="/features/cross-skill-ecosystem"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🌐 Cross-skill экосистема</Badge></Link>
              <Link href="/features/ai-assistant"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🤖 AI-помощник</Badge></Link>
              <Link href="/features/billing"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">💳 Биллинг</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Создайте свой первый навык — это проще, чем кажется</p>
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

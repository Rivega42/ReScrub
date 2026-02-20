import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, CheckCircle2, ImageIcon, MessageSquare, Star, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function ImageGeneration() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Генерация картинок — GrandHub" description="DALL-E и Midjourney интеграция: создавайте изображения прямо в Telegram-боте." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <ImageIcon className="h-3 w-3 mr-1" /> Q2 2026 · Планируется
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Генерация картинок</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Создавайте изображения прямо в Telegram-боте: DALL-E 3 и Midjourney. Опишите картинку текстом — получите готовое изображение за секунды.
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
                { step: "1", title: "Опишите картинку", desc: "Напишите что хотите увидеть — на русском или английском" },
                { step: "2", title: "AI улучшает промпт", desc: "Claude оптимизирует описание для лучшего результата" },
                { step: "3", title: "Генерация", desc: "DALL-E 3 или Midjourney создают изображение" },
                { step: "4", title: "Получите результат", desc: "Готовое изображение прямо в Telegram-чате" },
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
                { icon: ImageIcon, title: "DALL-E 3 + Midjourney", desc: "Два лучших генератора на выбор" },
                { icon: Brain, title: "Умный промпт", desc: "AI улучшает ваш запрос перед генерацией" },
                { icon: Zap, title: "Быстро", desc: "Результат за 10-30 секунд" },
                { icon: MessageSquare, title: "Итерации", desc: "Попросите изменить — AI уточнит запрос" },
                { icon: CheckCircle2, title: "На русском", desc: "Описывайте на родном языке" },
                { icon: Star, title: "Стили", desc: "Реализм, аниме, акварель, цифровое искусство и др." },
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
                  <p>❌ Нужен отдельный сервис</p>
                  <p>❌ Сложные промпты на английском</p>
                  <p>❌ Нет контекста вашего запроса</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Прямо в Telegram-боте</p>
                  <p>✅ Описывайте на русском</p>
                  <p>✅ AI помнит контекст разговора</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Взаимодействие с другими навыками</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/ai-assistant"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🤖 AI-помощник</Badge></Link>
              <Link href="/features/multimodal"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">📷 Мультимодальность</Badge></Link>
              <Link href="/features/no-code-builder"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🔧 No-code конструктор</Badge></Link>
              <Link href="/features/skills-marketplace"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🛒 Маркетплейс навыков</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Попробуйте генерацию — опишите любую картинку</p>
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

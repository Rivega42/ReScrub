import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bell, Home, Mic, Shield, Smartphone, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function MobileApp() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Мобильное приложение — GrandHub" description="iOS и Android приложение GrandHub. Нативный интерфейс, push-уведомления, офлайн-режим." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Smartphone className="h-3 w-3 mr-1" /> Q3 2026 · Планируется
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Мобильное приложение</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Нативное приложение для iOS и Android: удобный интерфейс, push-уведомления, быстрый доступ ко всем навыкам, виджеты на главный экран и офлайн-режим.
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
                { step: "1", title: "Скачайте приложение", desc: "App Store или Google Play — бесплатно" },
                { step: "2", title: "Войдите в аккаунт", desc: "Ваш GrandHub-аккаунт со всеми данными" },
                { step: "3", title: "Полный функционал", desc: "Все навыки, история, память — как в веб-версии" },
                { step: "4", title: "Push и виджеты", desc: "Уведомления и виджет на главный экран" },
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
                { icon: Smartphone, title: "iOS + Android", desc: "Нативные приложения для обеих платформ" },
                { icon: Bell, title: "Push-уведомления", desc: "Важные события приходят мгновенно" },
                { icon: Zap, title: "Быстрый запуск", desc: "Открывается за доли секунды" },
                { icon: Home, title: "Виджеты", desc: "Быстрый доступ с главного экрана телефона" },
                { icon: Mic, title: "Голосовой ввод", desc: "Говорите напрямую в микрофон, без Telegram" },
                { icon: Shield, title: "Биометрия", desc: "Face ID / Touch ID для быстрого входа" },
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
                  <p>❌ Только через Telegram-бот</p>
                  <p>❌ Нет нативного интерфейса</p>
                  <p>❌ Нет виджетов и push</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Нативное приложение</p>
                  <p>✅ Push-уведомления и виджеты</p>
                  <p>✅ Face ID / Touch ID</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Взаимодействие с другими навыками</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/voice-audio"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🎙️ Голос и аудио</Badge></Link>
              <Link href="/features/smart-home"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🏠 Умный дом</Badge></Link>
              <Link href="/features/telegram-bot"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">💬 Telegram-бот</Badge></Link>
              <Link href="/features/cross-skill-ecosystem"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🌐 Cross-skill экосистема</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Следите за выходом в App Store и Google Play</p>
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

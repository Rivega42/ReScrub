import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bell, Brain, Home, Mic, Smartphone, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function SmartHome() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Умный дом — GrandHub" description="IoT-интеграции и голосовое управление умным домом через AI-помощника в Telegram." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Home className="h-3 w-3 mr-1" /> Q3 2026 · Планируется
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Умный дом</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Управляйте умным домом через голосовые команды в Telegram. AI интегрирован с популярными IoT-платформами: Tuya, Home Assistant, Яндекс Алиса.
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
                { step: "1", title: "Подключите устройства", desc: "Интеграция с Tuya, Home Assistant или Яндекс" },
                { step: "2", title: "Голосовые команды", desc: "«Включи свет в спальне» — прямо в Telegram-боте" },
                { step: "3", title: "AI управляет", desc: "Отправляет команды на устройства через API" },
                { step: "4", title: "Автоматизация", desc: "Сценарии: «уходу из дома» — AI всё отключит" },
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
                { icon: Home, title: "IoT-интеграции", desc: "Tuya, Home Assistant, Яндекс Алиса, MQTT" },
                { icon: Mic, title: "Голосовое управление", desc: "Говорите в Telegram — умный дом слушает" },
                { icon: Zap, title: "Автоматизация", desc: "Сценарии на основе времени, локации, команд" },
                { icon: Brain, title: "AI понимает контекст", desc: "«Сделай уютно» — AI сам выбирает правильные настройки" },
                { icon: Bell, title: "Уведомления", desc: "Дверь открыта, датчик движения сработал" },
                { icon: Smartphone, title: "С телефона", desc: "Управление из любой точки мира" },
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
                  <p>❌ Отдельные приложения для каждого устройства</p>
                  <p>❌ Нет единого интерфейса</p>
                  <p>❌ Сложная настройка сценариев</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Всё управление в Telegram</p>
                  <p>✅ Голос + текст + кнопки</p>
                  <p>✅ AI понимает вас, а не команды</p>
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
              <Link href="/features/mobile-app"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">📱 Мобильное приложение</Badge></Link>
              <Link href="/features/ai-assistant"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🤖 AI-помощник</Badge></Link>
              <Link href="/features/cross-skill-ecosystem"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🌐 Cross-skill экосистема</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Подключите умный дом к AI-помощнику</p>
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

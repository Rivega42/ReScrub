import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, MessageSquare, Mic, Network, Volume2, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import FeatureDemoChat from "@/components/FeatureDemoChat";

const DEMO_DIALOGS = [
  [
    { role: "user" as const, type: "voice" as const, duration: "0:12" },
    { role: "ai" as const, text: "Расшифровываю... Запиши на стрижку завтра в 15:00" },
    { role: "ai" as const, type: "list" as const, title: "Выполнено:", items: ["Календарь: Завтра 15:00 — Барбершоп", "Маршрут: 20 мин от дома", "Напоминание: за 1 час"] },
    { role: "ai" as const, type: "buttons" as const, text: "Готово!", buttons: ["Напомнить за час", "Построить маршрут", "Отменить"] },
  ],
  [
    { role: "user" as const, text: "Прочитай последние сообщения" },
    { role: "ai" as const, type: "table" as const, headers: ["От кого", "Тема", "Время"], rows: [["Марина", "Встреча завтра", "10 мин"], ["Андрей", "Документы готовы", "32 мин"], ["Банк", "Начисление кэшбэка", "1 час"]] },
    { role: "ai" as const, type: "voice" as const, duration: "0:28" },
    { role: "ai" as const, type: "buttons" as const, text: "Озвучено 3 сообщения", buttons: ["Ответить Марине", "Открыть документ", "Тишина"] },
  ],
  [
    { role: "user" as const, type: "voice" as const, duration: "0:45" },
    { role: "ai" as const, text: "Распознано: идея для проекта — мобильное приложение для садоводов" },
    { role: "ai" as const, type: "list" as const, title: "Заметка сохранена:", items: ["Категория: Идеи для бизнеса", "Теги: приложения, садоводство, стартап", "Приоритет: Средний"] },
    { role: "ai" as const, type: "chart" as const, data: [{ label: "Идеи", value: 12 }, { label: "Задачи", value: 8 }, { label: "Заметки", value: 25 }, { label: "Встречи", value: 5 }] },
    { role: "ai" as const, type: "buttons" as const, text: "Что дальше?", buttons: ["Создать задачу", "Исследовать рынок", "Напомнить завтра"] },
  ],
];

export default function VoiceAudio() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Голос и аудио — GrandHub" description="Whisper STT расшифровывает голосовые, ElevenLabs TTS озвучивает ответы AI." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Mic className="h-3 w-3 mr-1" /> Q2 2026 · Планируется
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Голос и аудио</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Полноценный голосовой интерфейс: Whisper STT превращает ваши голосовые сообщения в текст, ElevenLabs TTS озвучивает ответы AI человеческим голосом.
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
                  { step: "1", title: "Запишите голосовое", desc: "Нажмите микрофон в Telegram и говорите" },
                  { step: "2", title: "Whisper расшифровывает", desc: "OpenAI Whisper large-v3 — точное распознавание русского" },
                  { step: "3", title: "AI отвечает", desc: "Claude обрабатывает транскрипт и формирует ответ" },
                  { step: "4", title: "ElevenLabs озвучивает", desc: "Ответ приходит голосовым сообщением с реалистичным голосом" },
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
                { icon: Mic, title: "Whisper STT", desc: "OpenAI Whisper large-v3 — лучшее распознавание русского" },
                { icon: Volume2, title: "ElevenLabs TTS", desc: "Реалистичные голоса — не синтетика, а живая речь" },
                { icon: MessageSquare, title: "Голосовые команды", desc: "Управляйте помощником голосом без набора текста" },
                { icon: Zap, title: "Низкая задержка", desc: "Транскрипция и ответ за секунды" },
                { icon: CheckCircle2, title: "Hands-free", desc: "Удобно за рулём, на кухне, во время тренировки" },
                { icon: Network, title: "Интеграция с навыками", desc: "Все 169 навыков доступны голосом" },
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
                  <p>❌ Только текст — неудобно на ходу</p>
                  <p>❌ Плохое распознавание русского</p>
                  <p>❌ Роботизированные TTS-голоса</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Полноценный голосовой интерфейс</p>
                  <p>✅ Whisper — точный русский</p>
                  <p>✅ ElevenLabs — живой голос</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Взаимодействие с другими навыками</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/ai-assistant"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">AI-помощник</Badge></Link>
              <Link href="/features/smart-home"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Умный дом</Badge></Link>
              <Link href="/features/mobile-app"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Мобильное приложение</Badge></Link>
              <Link href="/features/telegram-bot"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Telegram-бот</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Попробуйте голосовой режим — пришлите голосовое в @Grandhub_bot</p>
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

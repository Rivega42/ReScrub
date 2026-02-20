import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ArrowRight, CheckCircle2, Bot, Zap, Bell } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function TelegramBot() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Telegram-бот — GrandHub" description="@Grandhub_bot с inline-кнопками, typing indicator и мгновенным откликом. AI-помощник прямо в Telegram." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <MessageSquare className="h-3 w-3 mr-1" /> Февраль 2026 · В работе
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Telegram-бот</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              @Grandhub_bot — ваш персональный AI-помощник прямо в Telegram. Inline-кнопки, мгновенный отклик, typing indicator и полноценный доступ ко всем навыкам без установки приложений.
            </p>
            <div className="mt-8">
              <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">Открыть бота <ArrowRight className="h-4 w-4" /></Button>
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Как это работает</h2>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { step: "1", title: "Найдите бота", desc: "Поищите @Grandhub_bot в Telegram или перейдите по прямой ссылке" },
                { step: "2", title: "Онбординг", desc: "AI познакомится с вами, запомнит имя и предпочтения" },
                { step: "3", title: "Выберите навык", desc: "Нажмите inline-кнопку или напишите запрос в свободной форме" },
                { step: "4", title: "Получите ответ", desc: "AI отвечает с учётом всего вашего контекста и истории" },
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
                { icon: Bot, title: "Inline-кнопки", desc: "Быстрый доступ к навыкам без набора команд — просто нажмите кнопку" },
                { icon: Zap, title: "Typing indicator", desc: "Видите, что бот «печатает» — ощущение живого общения" },
                { icon: MessageSquare, title: "Фото и документы", desc: "Отправьте фото чека или документа — AI автоматически его распознает" },
                { icon: Bell, title: "Уведомления", desc: "Бот напомнит о подписках, встречах и важных событиях" },
                { icon: CheckCircle2, title: "Без установки", desc: "Работает в Telegram — приложении, которое уже у вас есть" },
                { icon: ArrowRight, title: "Голосовые сообщения", desc: "Whisper STT расшифрует голосовое в текст для AI-ответа" },
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
                <CardHeader><CardTitle className="text-muted-foreground">Обычные боты</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <p>❌ Тупые команды /start /help</p>
                  <p>❌ Не понимают свободный текст</p>
                  <p>❌ Нет памяти между сессиями</p>
                  <p>❌ Один бот — одна функция</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">@Grandhub_bot</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Понимает любой запрос на русском</p>
                  <p>✅ Помнит всё из прошлых разговоров</p>
                  <p>✅ 169+ навыков в одном боте</p>
                  <p>✅ Inline-кнопки для быстрой навигации</p>
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
              <Link href="/features/onboarding"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">👋 Онбординг</Badge></Link>
              <Link href="/features/voice-audio"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🎙️ Голос и аудио</Badge></Link>
              <Link href="/features/ai-secretary"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">📋 AI-секретарь</Badge></Link>
              <Link href="/features/multimodal"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">📷 Мультимодальность</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Откройте @Grandhub_bot в Telegram — бесплатно</p>
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

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowRight, CheckCircle2, Zap, MessageSquare, Database, Network } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function AiAssistant() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="AI-помощник — GrandHub" description="Claude Sonnet 4.6 с контекстом до 1M токенов. Персональный AI-помощник, который знает вас по имени." />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Brain className="h-3 w-3 mr-1" /> Февраль 2026 · В работе
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              AI-помощник
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Claude Sonnet 4.6 с контекстом до 1 миллиона токенов. Помощник, который помнит всё, что вы ему рассказали — и использует это в каждом ответе.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">Попробовать <ArrowRight className="h-4 w-4" /></Button>
              </a>
            </div>
          </div>
        </section>

        {/* Как это работает */}
        <section className="py-16 border-t border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Как это работает</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { step: "1", title: "Знакомство", desc: "AI проводит онбординг — узнаёт ваше имя, интересы, цели и стиль общения" },
                { step: "2", title: "Контекст", desc: "Каждый разговор сохраняется в RAG-памяти с embeddings для семантического поиска" },
                { step: "3", title: "Ответ", desc: "Claude получает релевантные воспоминания и отвечает с учётом всего контекста о вас" },
              ].map((item) => (
                <Card key={item.step} className="bg-muted/30 border-border/50">
                  <CardHeader>
                    <div className="text-3xl font-bold text-muted-foreground/30 mb-2">{item.step}</div>
                    <CardTitle className="text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Что даёт */}
        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Что даёт</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { icon: Brain, title: "Контекст 1M токенов", desc: "Помнит огромный объём информации о вас — целую историю общения" },
                { icon: Zap, title: "Claude Sonnet 4.6", desc: "Один из самых умных AI-помощников в мире, обновлённая модель 2025 года" },
                { icon: MessageSquare, title: "Inline-кнопки в Telegram", desc: "Быстрые ответы, меню навыков — удобно без набора текста" },
                { icon: CheckCircle2, title: "Понимает русский", desc: "Нативная поддержка русского языка без потери качества" },
                { icon: Database, title: "RAG-память", desc: "Семантический поиск по вашей истории для точных и релевантных ответов" },
                { icon: Network, title: "Навыки на выбор", desc: "169+ специализированных навыков: финансы, здоровье, путешествия и многое другое" },
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

        {/* Почему удобно */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Почему это удобно</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-muted/30 border-border/50">
                <CardHeader><CardTitle className="text-muted-foreground">Другие AI-чаты</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <p>❌ Не помнят предыдущие разговоры</p>
                  <p>❌ Не знают вашего имени и контекста</p>
                  <p>❌ Нет специализированных навыков</p>
                  <p>❌ Нет интеграции с вашей жизнью</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub AI</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Помнит всё — семантический RAG-поиск</p>
                  <p>✅ Знает вас по имени и вашим предпочтениям</p>
                  <p>✅ 169+ навыков под разные задачи</p>
                  <p>✅ Интегрирован с чеками, подписками, бюджетом</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Связанные навыки */}
        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Взаимодействие с другими навыками</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/rag-memory"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🧠 RAG-память</Badge></Link>
              <Link href="/features/multimodal"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">📷 Мультимодальность</Badge></Link>
              <Link href="/features/voice-audio"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🎙️ Голос и аудио</Badge></Link>
              <Link href="/features/skills-marketplace"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🛒 Маркетплейс навыков</Badge></Link>
              <Link href="/features/telegram-bot"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">💬 Telegram-бот</Badge></Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Первые 500 пользователей получают Early Bird тариф навсегда</p>
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

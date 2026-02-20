import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowRight, CheckCircle2, User, Heart, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Персональный онбординг — GrandHub" description="AI знакомится с вами: имя, интересы, цели, стиль общения. Один раз — навсегда в памяти." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <GraduationCap className="h-3 w-3 mr-1" /> Февраль 2026 · В работе
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Персональный онбординг</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              При первом запуске AI знакомится с вами — узнаёт имя, интересы, цели и предпочтения. Эта информация сохраняется навсегда и используется в каждом ответе.
            </p>
            <div className="mt-8">
              <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">Начать знакомство <ArrowRight className="h-4 w-4" /></Button>
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Как это работает</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { step: "1", title: "AI задаёт вопросы", desc: "Дружелюбный диалог: как вас зовут, чем занимаетесь, что для вас важно" },
                { step: "2", title: "Профиль сохраняется", desc: "Всё попадает в RAG-память с embeddings — бот помнит навсегда" },
                { step: "3", title: "Персонализация", desc: "Каждый ответ AI учитывает ваш профиль, имя и предпочтения" },
              ].map((item) => (
                <Card key={item.step} className="bg-muted/30 border-border/50">
                  <CardHeader>
                    <div className="text-3xl font-bold text-muted-foreground/30 mb-2">{item.step}</div>
                    <CardTitle className="text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent><p className="text-muted-foreground">{item.desc}</p></CardContent>
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
                { icon: User, title: "AI знает вас по имени", desc: "Никакого «Пользователь» — настоящее общение с персонализацией" },
                { icon: Heart, title: "Учёт предпочтений", desc: "Диета, хобби, работа — бот всегда в контексте вашей жизни" },
                { icon: Star, title: "Стиль общения", desc: "Формальный или неформальный — AI адаптируется под вас" },
                { icon: CheckCircle2, title: "Один раз навсегда", desc: "Прошли онбординг — больше не нужно объяснять, кто вы" },
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
                <CardHeader><CardTitle className="text-muted-foreground">Без онбординга</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <p>❌ Каждый раз объяснять контекст заново</p>
                  <p>❌ Безличные ответы без персонализации</p>
                  <p>❌ AI не знает ваших целей и привычек</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">С онбордингом GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ AI помнит всё о вас с первого дня</p>
                  <p>✅ Персонализированные советы и ответы</p>
                  <p>✅ Ощущение личного помощника, а не бота</p>
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
              <Link href="/features/rag-memory"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🧠 RAG-память</Badge></Link>
              <Link href="/features/telegram-bot"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">💬 Telegram-бот</Badge></Link>
              <Link href="/features/ai-secretary"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">📋 AI-секретарь</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Познакомьтесь с AI-помощником</h2>
            <p className="text-muted-foreground mb-8">Онбординг займёт 2 минуты — зато AI будет знать вас навсегда</p>
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

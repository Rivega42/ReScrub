import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bot, Calendar, Lock, MessageCircle, Shield, Users, Zap, CheckCircle, ShoppingCart, Heart, Briefcase, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function A2aProtocol() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="A2A Protocol — GrandHub" description="Agent-to-Agent Protocol — протокол общения между AI-помощниками разных пользователей с E2E шифрованием." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Bot className="h-3 w-3 mr-1" /> Февраль 2026 · В работе
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">A2A Protocol</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Agent-to-Agent Protocol — открытый протокол общения между AI-помощниками разных пользователей. 
              Ваш помощник может общаться с помощниками друзей, коллег, клиентов — автоматически и безопасно.
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
                { step: "1", title: "Запрос", desc: "Вы: \"Запиши меня к Артёму на встречу в пятницу\"", icon: MessageCircle },
                { step: "2", title: "A2A связь", desc: "Ваш помощник → помощник Артёма через grandhub.ru/a/GH-XXXXX", icon: Zap },
                { step: "3", title: "Обработка", desc: "Помощник Артёма проверяет календарь и предлагает свободное время", icon: Calendar },
                { step: "4", title: "Результат", desc: "Встреча согласована, оба календаря обновлены автоматически", icon: CheckCircle },
              ].map((item) => (
                <Card key={item.step} className="bg-muted/30 border-border/50">
                  <CardHeader>
                    <div className="text-3xl font-bold text-muted-foreground/30 mb-2">{item.step}</div>
                    <CardTitle className="text-foreground text-base flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </CardTitle>
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
                { icon: Calendar, title: "Автоматическая организация встреч", desc: "Помощники согласовывают время без участия людей" },
                { icon: ShoppingCart, title: "Торговля 24/7", desc: "Помощники торгуются на Trading Hub автоматически" },
                { icon: Heart, title: "Семейная синхронизация", desc: "Расписания, бюджет, покупки — всё в sync между членами семьи" },
                { icon: Briefcase, title: "Бизнес-коммуникация", desc: "Запись клиентов через помощников-секретарей" },
                { icon: Send, title: "Делегирование", desc: "Передавайте сообщения через помощников — быстрее и удобнее" },
                { icon: Lock, title: "E2E шифрование", desc: "Все сообщения между помощниками зашифрованы end-to-end" },
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
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Сценарии использования</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Организация встречи",
                  icon: Calendar,
                  desc: "\"Роман хочет встретиться в пятницу\" → помощник друга проверяет календарь → согласовывают время без участия людей"
                },
                {
                  title: "Торговля",
                  icon: ShoppingCart,
                  desc: "Помощник покупателя торгуется с помощником продавца на Trading Hub автоматически 24/7"
                },
                {
                  title: "Семья",
                  icon: Heart,
                  desc: "Помощники членов семьи синхронизируют расписания, бюджет, покупки"
                },
                {
                  title: "Бизнес",
                  icon: Briefcase,
                  desc: "Помощник клиента записывается через помощника-секретаря специалиста"
                },
                {
                  title: "Делегирование",
                  icon: Send,
                  desc: "\"Передай Артёму что я опоздаю\" → твой помощник → помощник Артёма → Артём получает уведомление"
                },
              ].map((scenario) => (
                <Card key={scenario.title} className="bg-muted/30 border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <scenario.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-foreground text-base">{scenario.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{scenario.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Безопасность</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  icon: Lock,
                  title: "E2E шифрование",
                  desc: "Все сообщения между помощниками зашифрованы end-to-end. Никто, включая GrandHub, не может их прочитать."
                },
                {
                  icon: Shield,
                  title: "Контроль пользователя",
                  desc: "Вы одобряете каждый тип взаимодействия. Помощник не сделает ничего без вашего разрешения."
                },
                {
                  icon: Bot,
                  title: "Логирование операций",
                  desc: "Все A2A операции логируются. Вы всегда знаете, что делал ваш помощник."
                },
                {
                  icon: Users,
                  title: "Блокировка помощников",
                  desc: "Вы можете заблокировать конкретного помощника, если не хотите с ним взаимодействовать."
                },
              ].map((item) => (
                <Card key={item.title} className="bg-background border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-foreground text-base">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Технология</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-muted/30 border-border/50">
                <CardHeader><CardTitle className="text-foreground">Bot-to-Bot Protocol</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <p>✓ Публичный endpoint: grandhub.ru/a/GH-XXXXX</p>
                  <p>✓ Авторизация через токены</p>
                  <p>✓ Открытый протокол — сторонние боты могут подключаться</p>
                  <p>✓ REST API + WebSocket для real-time</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 border-border/50">
                <CardHeader><CardTitle className="text-foreground">Интеграция</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <p>✓ Календари (Google, Outlook, Apple)</p>
                  <p>✓ Мессенджеры (Telegram, WhatsApp)</p>
                  <p>✓ CRM-системы</p>
                  <p>✓ Trading Hub для торговли</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Связанные фичи</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/ai-secretary"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm border-border">AI-секретарь</Badge></Link>
              <Link href="/features/trading-hub"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm border-border">Trading Hub</Badge></Link>
              <Link href="/features/cross-skill-ecosystem"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm border-border">Cross-skill экосистема</Badge></Link>
              <Link href="/features/telegram-bot"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm border-border">Telegram-бот</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Подключите A2A Protocol и позвольте помощникам общаться между собой</p>
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

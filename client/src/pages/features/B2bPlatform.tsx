import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, Network, Shield, Star, Users, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function B2bPlatform() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="B2B платформа — GrandHub" description="Бизнес-ассистент с интеграцией 1С и CRM. AI для команд и корпоративных клиентов." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Building2 className="h-3 w-3 mr-1" /> Q3 2026 · Планируется
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">B2B платформа</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Корпоративный AI-ассистент: интеграция с 1С, CRM-системами, командный доступ, SLA, выделенный менеджер и полная кастомизация под ваш бизнес.
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
                { step: "1", title: "Корпоративный аккаунт", desc: "Регистрация компании, NDA, SLA-договор" },
                { step: "2", title: "Интеграции", desc: "Подключение 1С, CRM, ERP через API" },
                { step: "3", title: "Команда", desc: "Добавьте сотрудников с гибкими правами доступа" },
                { step: "4", title: "AI работает", desc: "Обрабатывает данные из ваших систем, отвечает сотрудникам" },
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
                { icon: Building2, title: "Корпоративный тариф", desc: "Команды до 100+ человек, выделенные ресурсы" },
                { icon: Network, title: "Интеграции с 1С и CRM", desc: "API для подключения корпоративных систем" },
                { icon: Shield, title: "Безопасность", desc: "GDPR, 152-ФЗ, шифрование, корпоративные политики" },
                { icon: Users, title: "Командный доступ", desc: "Роли: владелец, администратор, пользователь" },
                { icon: Zap, title: "SLA", desc: "99.9% uptime гарантия, поддержка 24/7" },
                { icon: Star, title: "Кастомизация", desc: "Фирменный стиль, кастомные навыки, white-label" },
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
                  <p>❌ Универсальные решения не подходят</p>
                  <p>❌ Нет интеграций с 1С и CRM</p>
                  <p>❌ Нет корпоративной безопасности</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Кастомизация под бизнес</p>
                  <p>✅ Интеграция с 1С, CRM, ERP</p>
                  <p>✅ Корпоративная безопасность и SLA</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Взаимодействие с другими навыками</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/trading-hub"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">📈 Trading Hub</Badge></Link>
              <Link href="/features/ai-secretary"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">📋 AI-секретарь</Badge></Link>
              <Link href="/features/billing"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">💳 Биллинг</Badge></Link>
              <Link href="/features/skills-marketplace"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">🛒 Маркетплейс навыков</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Свяжитесь с нами для корпоративного демо</p>
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

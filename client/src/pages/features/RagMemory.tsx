import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowRight, CheckCircle2, Database, Zap, MessageSquare, Network } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import FeatureDemoChat from "@/components/FeatureDemoChat";

const DEMO_DIALOGS = [
  [
    { role: "user" as const, text: "Какой ресторан мне понравился в прошлом месяце?" },
    { role: "ai" as const, text: "Ищу в памяти..." },
    { role: "ai" as const, type: "table" as const, headers: ["Дата", "Ресторан", "Оценка"], rows: [["15 янв", "Кафе Пушкинъ", "★★★★★"], ["8 янв", "Теремок", "★★★☆☆"], ["2 янв", "Мама Рома", "★★★★☆"]] },
    { role: "ai" as const, text: "Лучший — Кафе Пушкинъ! Вы написали: отличный борщ и обслуживание" },
    { role: "ai" as const, type: "buttons" as const, text: "Что сделать?", buttons: ["Забронировать", "Позвать друзей", "Показать меню"] },
  ],
  [
    { role: "user" as const, text: "Когда я последний раз был у стоматолога?" },
    { role: "ai" as const, type: "table" as const, headers: ["Дата", "Врач", "Процедура"], rows: [["12 нояб", "Д-р Иванов", "Чистка"], ["3 авг", "Д-р Иванов", "Пломба"], ["15 мар", "Д-р Смирнова", "Осмотр"]] },
    { role: "ai" as const, type: "progress" as const, label: "До планового осмотра", current: 85, total: 100 },
    { role: "ai" as const, text: "Последний визит 4 месяца назад. Пора на осмотр!" },
    { role: "ai" as const, type: "buttons" as const, text: "Действия:", buttons: ["Записаться к Иванову", "Найти другого врача", "Напомнить через неделю"] },
  ],
  [
    { role: "user" as const, text: "Что мы решили по проекту на прошлой неделе?" },
    { role: "ai" as const, text: "Поднимаю контекст из переписки..." },
    { role: "ai" as const, type: "list" as const, title: "Решения 14 февраля:", items: ["Дедлайн MVP — 1 марта", "Стек: Next.js + PostgreSQL", "Дизайн: минимализм, тёмная тема", "Бюджет: до 150K на маркетинг"] },
    { role: "ai" as const, type: "table" as const, headers: ["Задача", "Ответственный", "Статус"], rows: [["Фронтенд", "Артём", "В работе"], ["API", "Роман", "Готово"], ["Дизайн", "Анна", "Ревью"], ["Тесты", "AI", "Ожидает"]] },
    { role: "ai" as const, type: "buttons" as const, text: "Нужно что-то обновить?", buttons: ["Обновить статусы", "Напомнить команде", "Создать отчёт"] },
  ],
];

export default function RagMemory() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="RAG-память — GrandHub" description="Семантический поиск по вашей персональной памяти. Voyage AI embeddings — AI никогда ничего не забывает." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Database className="h-3 w-3 mr-1" /> Февраль 2026 · В работе
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">RAG-память</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Семантический поиск по вашей персональной памяти с помощью Voyage AI embeddings. AI находит нужное воспоминание из тысяч — за миллисекунды.
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
                  { step: "1", title: "Вы говорите", desc: "Рассказываете AI что-то важное — факт, событие, предпочтение" },
                  { step: "2", title: "Создаётся embedding", desc: "Voyage AI превращает текст в числовой вектор — 1024 измерения" },
                  { step: "3", title: "Семантический поиск", desc: "При новом вопросе AI ищет релевантные воспоминания по смыслу" },
                  { step: "4", title: "Точный ответ", desc: "Claude получает нужный контекст и отвечает с учётом истории" },
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
                { icon: Brain, title: "Семантический поиск", desc: "Находит по смыслу — не только по точным словам" },
                { icon: Database, title: "Voyage AI Embeddings", desc: "Многоязычная модель voyage-multilingual-2 для русского" },
                { icon: Zap, title: "Миллисекунды", desc: "Поиск по тысячам воспоминаний за доли секунды" },
                { icon: CheckCircle2, title: "Никогда не забывает", desc: "Все факты о вас хранятся вечно и доступны мгновенно" },
                { icon: MessageSquare, title: "Контекстуальные ответы", desc: "AI видит историю, а не только текущий запрос" },
                { icon: Network, title: "Связь между фактами", desc: "Находит неочевидные связи в вашей истории" },
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
                <CardHeader><CardTitle className="text-muted-foreground">Обычные AI-чаты</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <p>❌ Забывают между сессиями</p>
                  <p>❌ Не могут найти старый разговор</p>
                  <p>❌ Ищут только точное совпадение слов</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub RAG-память</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ Помнит всё — навсегда</p>
                  <p>✅ Семантический поиск по смыслу</p>
                  <p>✅ Находит связанные воспоминания</p>
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
              <Link href="/features/multimodal"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Мультимодальность</Badge></Link>
              <Link href="/features/cross-skill-ecosystem"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Cross-skill экосистема</Badge></Link>
              <Link href="/features/onboarding"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Онбординг</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Расскажите AI что-то о себе — и посмотрите, как он запомнит</p>
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

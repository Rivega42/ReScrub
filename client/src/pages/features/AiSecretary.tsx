import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bell, Bot, Calendar, MessageSquare, Shield, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import FeatureDemoChat from "@/components/FeatureDemoChat";
import ROICalculator from "@/components/ROICalculator";

const DEMO_DIALOGS = [
  [
    { role: "user" as const, text: "Здравствуйте, хочу записаться на консультацию" },
    { role: "ai" as const, type: "table" as const, headers: ["Время", "Дата", "Формат"], rows: [["14:00", "Завтра", "Офис"], ["11:00", "Послезавтра", "Онлайн"], ["16:00", "Пятница", "Офис"]] },
    { role: "ai" as const, type: "buttons" as const, text: "Выберите удобный слот:", buttons: ["Завтра 14:00", "Послезавтра 11:00", "Пятница 16:00"] },
    { role: "ai" as const, text: "После выбора пришлю подтверждение и напомню за час" },
  ],
  [
    { role: "user" as const, text: "Какие у вас услуги и цены?" },
    { role: "ai" as const, type: "table" as const, headers: ["Услуга", "Цена", "Время"], rows: [["Консультация", "3 000₽", "1 час"], ["Сопровождение", "50 000₽/мес", "—"], ["Экспертиза", "8 000₽", "3 часа"], ["Обучение", "80 000₽", "2 дня"]] },
    { role: "ai" as const, type: "chart" as const, data: [{ label: "Консульт.", value: 60 }, { label: "Сопров.", value: 25 }, { label: "Эксперт.", value: 10 }, { label: "Обучение", value: 5 }] },
    { role: "ai" as const, type: "buttons" as const, text: "Самая популярная — консультация", buttons: ["Записаться", "Задать вопрос", "Скачать прайс"] },
  ],
  [
    { role: "ai" as const, text: "Входящее сообщение от неизвестного контакта" },
    { role: "ai" as const, type: "table" as const, headers: ["Параметр", "Результат"], rows: [["Спам-вероятность", "12%"], ["Тон", "Деловой"], ["Намерение", "Сотрудничество"], ["Срочность", "Средняя"]] },
    { role: "ai" as const, type: "progress" as const, label: "Достоверность анализа", current: 88, total: 100 },
    { role: "ai" as const, type: "buttons" as const, text: "Похоже на реальный запрос", buttons: ["Переслать вам", "Запросить подробности", "Отклонить"] },
  ],
];

export default function AiSecretary() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="AI-секретарь — GrandHub" description="Приём заявок, запись на встречи, FAQ, фильтр спама — AI работает за вас 24/7." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <Bot className="h-3 w-3 mr-1" /> Февраль 2026 · В работе
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">AI-секретарь</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Ваш персональный секретарь на базе Claude, который принимает заявки, записывает клиентов на встречи, отвечает на FAQ и фильтрует спам — круглосуточно.
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
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Как это работает</h2>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { step: "1", title: "Клиент пишет", desc: "Пишет в бот или на публичную страницу помощника" },
                { step: "2", title: "AI обрабатывает", desc: "Определяет тип запроса: заявка, запись, вопрос или спам" },
                { step: "3", title: "Действие", desc: "Записывает на встречу, отвечает на FAQ или передаёт вам" },
                { step: "4", title: "Уведомление", desc: "Вы получаете уведомление о новых заявках и записях" },
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
                { icon: Bot, title: "Приём заявок 24/7", desc: "Клиенты могут писать в любое время — AI всегда онлайн" },
                { icon: Calendar, title: "Запись на встречи", desc: "Интеграция с kalendar — AI сам предлагает свободные слоты" },
                { icon: MessageSquare, title: "Ответы на FAQ", desc: "AI знает ваши стандартные ответы и отвечает вместо вас" },
                { icon: Shield, title: "Фильтр спама", desc: "Guardian AI отсеивает спам и нерелевантные обращения" },
                { icon: Bell, title: "Уведомления", desc: "Важные заявки сразу к вам в Telegram" },
                { icon: Users, title: "Публичная страница", desc: "grandhub.ru/a/GH-XXXXX — ваш AI-помощник онлайн" },
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
                  <p>❌ Надо отвечать самому 24/7</p>
                  <p>❌ Пропускаете заявки в нерабочее время</p>
                  <p>❌ Тратите время на спам и FAQ</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ AI работает 24/7 без перерывов</p>
                  <p>✅ Ни одна заявка не потеряется</p>
                  <p>✅ Только важные обращения к вам</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Взаимодействие с другими навыками</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/telegram-bot"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">💬 Telegram-бот</Badge></Link>
              <Link href="/features/onboarding"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">👋 Онбординг</Badge></Link>
              <Link href="/features/trading-hub"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">📈 Trading Hub</Badge></Link>
              <Link href="/features/billing"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">💳 Биллинг</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Настройте AI-секретаря и освободите себя от рутины</p>
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

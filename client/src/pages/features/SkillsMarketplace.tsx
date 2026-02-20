import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Globe, Network, ShoppingCart, Star, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import FeatureDemoChat from "@/components/FeatureDemoChat";
import SkillsMap from "@/components/SkillsMap";

const DEMO_DIALOGS = [
  [
    { role: "user" as const, text: "Какие навыки есть для здоровья?" },
    { role: "ai" as const, type: "table" as const, headers: ["Навык", "Рейтинг", "Цена"], rows: [["Фитнес-трекер", "★4.9", "Бесплатно"], ["Дневник питания", "★4.7", "199₽/мес"], ["Контроль сна", "★4.6", "149₽/мес"], ["Напоминания о лекарствах", "★4.8", "Бесплатно"]] },
    { role: "ai" as const, type: "chart" as const, data: [{ label: "Фитнес", value: 95 }, { label: "Питание", value: 82 }, { label: "Сон", value: 76 }, { label: "Лекарства", value: 88 }] },
    { role: "ai" as const, type: "buttons" as const, text: "Выберите:", buttons: ["Установить Фитнес", "Установить всё", "Подробнее"] },
  ],
  [
    { role: "user" as const, text: "Установи Фитнес-трекер" },
    { role: "ai" as const, type: "progress" as const, label: "Загрузка", current: 30, total: 100 },
    { role: "ai" as const, type: "progress" as const, label: "Настройка", current: 75, total: 100 },
    { role: "ai" as const, type: "list" as const, title: "Фитнес-трекер активен:", items: ["Подключён к Apple Health", "Цель: 10 000 шагов/день", "Тренировки: 3 раза/неделю", "Уведомления: включены"] },
    { role: "ai" as const, type: "buttons" as const, text: "Настроить цели?", buttons: ["Да, настроить", "Оставить по умолчанию", "Синхронизировать часы"] },
  ],
  [
    { role: "user" as const, text: "Покажи популярные навыки" },
    { role: "ai" as const, type: "table" as const, headers: ["Навык", "Рейтинг", "Установки"], rows: [["Trading Hub", "★4.9", "12.5K"], ["Чеки AI", "★4.8", "9.2K"], ["Голосовой", "★4.7", "8.1K"], ["RAG-память", "★4.9", "7.8K"], ["AI-секретарь", "★4.6", "6.3K"]] },
    { role: "ai" as const, type: "chart" as const, data: [{ label: "Trading", value: 100 }, { label: "Чеки", value: 74 }, { label: "Голос", value: 65 }, { label: "RAG", value: 62 }, { label: "Секр.", value: 50 }] },
    { role: "ai" as const, type: "buttons" as const, text: "Trading Hub — хит недели!", buttons: ["Установить Trading Hub", "Подробнее", "Все категории"] },
  ],
];

export default function SkillsMarketplace() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Маркетплейс навыков — GrandHub" description="169+ навыков для AI-помощника: финансы, здоровье, путешествия, образование и многое другое." />
      <Header />
      <main>
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-muted text-muted-foreground border-border">
              <ShoppingCart className="h-3 w-3 mr-1" /> Февраль 2026 · В работе
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Маркетплейс навыков</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              169 навыков уже на платформе, 144 переведены на русский. Расширяйте возможности своего AI-помощника — от учёта финансов до умного дома.
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
            <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { step: "1", title: "Выберите навык", desc: "Просмотрите каталог из 169 навыков по категориям" },
                  { step: "2", title: "Активируйте", desc: "Один тап — и навык подключён к вашему помощнику" },
                  { step: "3", title: "Используйте", desc: "AI применяет навык в разговоре автоматически" },
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

        <SkillsMap />

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Что даёт</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { icon: ShoppingCart, title: "169+ навыков", desc: "Финансы, здоровье, образование, путешествия, умный дом и другие" },
                { icon: Star, title: "Категории", desc: "Все навыки разбиты по тематикам для удобного поиска" },
                { icon: Globe, title: "Русификация", desc: "144 навыка переведены и адаптированы для русскоязычных пользователей" },
                { icon: Zap, title: "Мгновенная активация", desc: "Подключите и сразу используйте без настройки" },
                { icon: CheckCircle2, title: "No-code создание", desc: "Создавайте свои навыки без написания кода" },
                { icon: Network, title: "Маркетплейс", desc: "Публикуйте навыки и монетизируйте их" },
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
                  <p>❌ Один бот — одна функция</p>
                  <p>❌ Нет специализации</p>
                  <p>❌ Нельзя расширить возможности</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-foreground">GrandHub</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-foreground">
                  <p>✅ 169+ специализированных навыков</p>
                  <p>✅ Можно создать свой навык</p>
                  <p>✅ Монетизация через маркетплейс</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Взаимодействие с другими навыками</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/features/no-code-builder"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">No-code конструктор</Badge></Link>
              <Link href="/features/cross-skill-ecosystem"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Cross-skill экосистема</Badge></Link>
              <Link href="/features/ai-assistant"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">AI-помощник</Badge></Link>
              <Link href="/features/billing"><Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2 text-sm">Биллинг и тарифы</Badge></Link>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">Попробуйте прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Откройте каталог навыков и выберите то, что нужно именно вам</p>
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

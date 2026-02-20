import { Link } from "wouter";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Brain, TrendingUp, Users, Target, Zap, MessageCircle } from "lucide-react";

export default function Whitepaper() {
  useEffect(() => {
    document.title = "Whitepaper GrandHub — Персональный AI-помощник для России";
    const metaDescription = document.querySelector("meta[name=\"description\"]");
    if (metaDescription) {
      metaDescription.setAttribute("content", "Техническое описание платформы GrandHub: персональный AI-помощник для жизни в России, 12 навыков, Trading Hub, архитектура памяти.");
    }
  }, []);

  const sections = [
    { id: "abstract", title: "Аннотация", icon: FileText },
    { id: "problem", title: "Проблема", icon: Target },
    { id: "solution", title: "Решение: GrandHub", icon: Brain },
    { id: "skills", title: "12 навыков", icon: Zap },
    { id: "trading-hub", title: "Trading Hub", icon: TrendingUp },
    { id: "architecture", title: "Архитектура", icon: Shield },
    { id: "market", title: "Рынок и конкуренция", icon: Users },
    { id: "roadmap", title: "Roadmap", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">Техническая документация</Badge>
          <h1 className="text-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            GrandHub: Персональный AI-помощник для жизни в России
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Платформенный whitepaper: архитектура, навыки, Trading Hub, рыночное позиционирование
            и технические решения первого персонального AI-ассистента для российских пользователей.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Версия 1.0 — Февраль 2026
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Команда GrandHub
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Содержание</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <a key={section.id} href={`#${section.id}`}
                           className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          {section.title}
                        </a>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-12">
            <section id="abstract">
              <h2 className="text-2xl font-bold text-foreground mb-6">Аннотация</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>GrandHub — первый персональный AI-помощник, созданный специально для жизни в России. В отличие от существующих AI-инструментов, GrandHub строится на принципе "знание о тебе важнее знания о мире".</p>
                <p>Платформа работает через Telegram (@Grandhub_bot), не требует установки приложений и предоставляет 12 специализированных навыков — от управления финансами до уникального Trading Hub для участия в аукционах и тендерах.</p>
                <p>Ключевая дифференциация: персонализированная память, российский контекст, экосистема навыков и киллер-фича Trading Hub — то, чего нет ни у одного конкурента.</p>
              </div>
            </section>

            <section id="problem">
              <h2 className="text-2xl font-bold text-foreground mb-6">Проблема</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Российский пользователь сталкивается с четырьмя ключевыми проблемами в AI-инструментах:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Нет персонализации", desc: "Все AI-ассистенты начинают с нуля каждый раз. Никакой памяти о пользователе." },
                    { title: "Плохой российский контекст", desc: "Западные AI не понимают российских реалий, сервисов, цен, законов." },
                    { title: "Нет специализации", desc: "Общие ответы без понимания конкретной жизненной ситуации пользователя." },
                    { title: "Нет уникальных возможностей", desc: "Ни один AI не предлагает Trading Hub — участие в аукционах через AI-автоторг." },
                  ].map((item) => (
                    <Card key={item.title} className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                        <p className="text-sm">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            <section id="solution">
              <h2 className="text-2xl font-bold text-foreground mb-6">Решение: GrandHub</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>GrandHub решает эти проблемы через четыре ключевых принципа:</p>
                <div className="space-y-4">
                  {[
                    { title: "Персональная память", desc: "GrandHub помнит тебя: цели, привычки, предпочтения, семью, финансовое положение. С каждым разговором помощник становится умнее именно для тебя." },
                    { title: "Российский DNA", desc: "Понимание российских сервисов, цен в рублях, местных законов, региональной специфики. Не адаптация западного продукта — создание нового." },
                    { title: "Экосистема 12 навыков", desc: "Специализированные модули усиливают друг друга. Финансы знают о покупках, Коуч знает о расписании, Торговля использует весь профиль." },
                    { title: "Trading Hub", desc: "Уникальная функция без аналогов: AI-автоматизация участия в аукционах, тендерах, поиске поставщиков. Бизнес-возможности для каждого." },
                  ].map((item) => (
                    <div key={item.title} className="border-l-4 border-primary pl-6">
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="skills">
              <h2 className="text-2xl font-bold text-foreground mb-6">12 навыков GrandHub</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: "Финансы", desc: "Бюджет, расходы, накопления, инвестиции" },
                  { name: "Образование", desc: "Обучение, курсы, знания, развитие" },
                  { name: "Здоровье", desc: "Трекинг, напоминания, советы, профилактика" },
                  { name: "Женское здоровье", desc: "Цикл, self-care, специализированная поддержка" },
                  { name: "Расписание", desc: "Планирование дня, встречи, дедлайны" },
                  { name: "Покупки", desc: "Списки, сравнение цен, рекомендации" },
                  { name: "Путешествия", desc: "Планирование маршрутов, билеты, отели" },
                  { name: "Торговля", desc: "Мониторинг цен, поставщики, маркетплейсы" },
                  { name: "Умный дом", desc: "Интеграции, сценарии, контроль устройств" },
                  { name: "Семья", desc: "Общие задачи, дети, семейный календарь" },
                  { name: "Коуч", desc: "Цели, привычки, мотивация, личный рост" },
                  { name: "Подписки", desc: "Контроль подписок, оптимизация расходов" },
                ].map((skill) => (
                  <Card key={skill.name} className="bg-muted/30">
                    <CardContent className="pt-4 pb-4">
                      <h4 className="font-semibold text-foreground text-sm">{skill.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{skill.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="trading-hub">
              <h2 className="text-2xl font-bold text-foreground mb-6">Trading Hub — Киллер-фича</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Trading Hub — уникальная функция, которой нет ни у одного AI-ассистента в мире.</p>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6 space-y-3">
                    <h4 className="font-semibold text-foreground">Возможности Trading Hub:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Мониторинг тендеров</strong>: автоматическое отслеживание тендеров на zakupki.gov.ru и других площадках</li>
                      <li>• <strong>AI-автоторг</strong>: бот анализирует аукционы и предлагает оптимальные стратегии ставок</li>
                      <li>• <strong>Поиск поставщиков</strong>: AI находит поставщиков с лучшим соотношением цена/качество</li>
                      <li>• <strong>Аналитика рынка</strong>: динамика цен, прогнозы, рыночные сигналы</li>
                      <li>• <strong>Уведомления</strong>: мгновенные алерты о новых возможностях по параметрам пользователя</li>
                    </ul>
                  </CardContent>
                </Card>
                <p>Доступно с тарифа Про. Корпоративная версия — в тарифе Бизнес.</p>
              </div>
            </section>

            <section id="market">
              <h2 className="text-2xl font-bold text-foreground mb-6">Рынок и конкурентная позиция</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg text-sm">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="border border-border p-3 text-left font-semibold text-foreground">Параметр</th>
                        <th className="border border-border p-3 text-center">Алиса</th>
                        <th className="border border-border p-3 text-center">GigaChat</th>
                        <th className="border border-border p-3 text-center">ChatGPT</th>
                        <th className="border border-border p-3 text-center font-bold text-primary">GrandHub</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Персональная память", "✗", "✗", "Частично", "✓"],
                        ["Российский контекст", "✓", "✓", "✗", "✓"],
                        ["Специализированные навыки", "✗", "✗", "✗", "✓ (12)"],
                        ["Trading Hub", "✗", "✗", "✗", "✓"],
                        ["Telegram-бот", "✗", "✗", "✗", "✓"],
                        ["Цена (базовый)", "Бесплатно", "Бесплатно", "$20/мес", "0₽ Free"],
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 1 ? "bg-muted/10" : ""}>
                          {row.map((cell, j) => (
                            <td key={j} className={`border border-border p-3 ${j === 4 ? "text-center font-medium text-primary" : j === 0 ? "" : "text-center"}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section id="roadmap">
              <h2 className="text-2xl font-bold text-foreground mb-6">Roadmap</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  {[
                    { q: "Q1 2026", items: ["Запуск @Grandhub_bot", "Free и Старт тарифы", "12 навыков (базовая версия)"] },
                    { q: "Q2 2026", items: ["Trading Hub v1.0: тендеры и аукционы", "Про и Бизнес тарифы", "Семейный доступ"] },
                    { q: "Q3 2026", items: ["AI-автоторг v1.0", "Интеграции с российскими сервисами", "API для партнёров"] },
                    { q: "Q4 2026", items: ["Мобильное приложение", "Умный дом интеграции", "Расширение Trading Hub"] },
                  ].map((period) => (
                    <div key={period.q} className="border-l-4 border-primary pl-6">
                      <h4 className="font-semibold text-foreground">{period.q}</h4>
                      <ul className="mt-2 space-y-1 text-sm">
                        {period.items.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="mt-16 text-center">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Попробуй GrandHub прямо сейчас</h3>
                  <p className="text-muted-foreground mb-6">5 Pro-запросов бесплатно. Без регистрации.</p>
                  <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                    <Button size="lg">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      @Grandhub_bot
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

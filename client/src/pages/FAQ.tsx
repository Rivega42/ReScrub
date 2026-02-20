import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { HelpCircle, MessageCircle, CreditCard, Brain } from "lucide-react";
import { useEffect } from "react";

interface FAQItem { id: string; question: string; answer: string; }

const faqData: FAQItem[] = [
  {
    id: "what-is-grandhub",
    question: "Что такое GrandHub и чем он отличается от ChatGPT?",
    answer: `GrandHub — первый персональный AI-помощник для жизни в России. Принципиальное отличие от ChatGPT и других AI:

ChatGPT знает всё в мире — но не знает тебя. GrandHub знает тебя — твои цели, привычки, семью, финансы, расписание.

Конкретные отличия:
• **Память**: GrandHub помнит твой контекст между сессиями
• **12 навыков**: специализированные модули для каждой сферы жизни
• **Российский контекст**: понимает российские реалии, работает с рублями и местными сервисами
• **Trading Hub**: уникальная функция участия в аукционах и тендерах
• **Telegram**: никаких новых приложений — всё в привычном мессенджере`
  },
  {
    id: "how-to-start",
    question: "Как начать пользоваться GrandHub?",
    answer: `Начать проще простого — три шага:

1. Открой Telegram и найди @Grandhub_bot
2. Нажми /start — авторизация через Telegram, без паролей
3. Пройди онбординг (2 минуты) — расскажи боту о себе

Сразу после этого получишь:
• 5 бесплатных Pro-запросов
• 50 базовых запросов в месяц
• Доступ к 3 навыкам на выбор

Никакой кредитной карты на старте не нужно.`
  },
  {
    id: "skills",
    question: "Какие навыки есть в GrandHub?",
    answer: `GrandHub включает 12 специализированных навыков:

**Управление жизнью:**
• Финансы — бюджет, расходы, накопления
• Расписание — планирование дня, встречи, дедлайны
• Семья — совместные задачи, напоминания, дети

**Здоровье и саморазвитие:**
• Здоровье — трекинг, напоминания о таблетках, советы
• Женское здоровье — цикл, здоровье, self-care
• Коуч — цели, привычки, мотивация

**Покупки и быт:**
• Покупки — списки, сравнение цен, рекомендации
• Подписки — контроль подписок, оптимизация
• Умный дом — интеграции, сценарии, контроль

**Торговля и возможности:**
• Торговля — мониторинг цен, поставщики
• Путешествия — планирование, маршруты, билеты
• Trading Hub — аукционы, тендеры, AI-автоторг`
  },
  {
    id: "trading-hub",
    question: "Что такое Trading Hub и как он работает?",
    answer: `Trading Hub — уникальная киллер-фича GrandHub. Это AI-платформа для участия в аукционах, тендерах и B2B-торговле.

**Возможности Trading Hub:**
• Мониторинг тендеров и аукционов в реальном времени
• AI-автоторг — бот сам отслеживает торги и предлагает оптимальные ставки
• Поиск поставщиков с лучшими ценами
• Уведомления о новых возможностях по твоим параметрам

**Кто использует:**
• Малый и средний бизнес
• ИП и самозанятые
• Менеджеры по закупкам
• Продавцы на маркетплейсах

Trading Hub доступен с тарифа Про.`
  },
  {
    id: "pricing",
    question: "Сколько стоит GrandHub?",
    answer: `GrandHub предлагает 4 тарифа:

**Free — 0₽ навсегда**
• 5 Pro-запросов + 50 базовых/мес
• 3 навыка на выбор
• Попробовать без риска

**Старт — 990₽/мес (Early Bird: 790₽)**
• 500 Pro-запросов + безлимит базовых
• Все 12 навыков
• Расширенная память

**Про — 2490₽/мес**
• Безлимит Pro-запросов
• Trading Hub (аукционы, тендеры, AI-автоторг)
• Семейный доступ до 3 человек

**Бизнес — 7990₽/мес**
• До 10 пользователей
• API-доступ
• Корпоративный Trading Hub`
  },
  {
    id: "data-security",
    question: "Как обеспечивается безопасность моих данных?",
    answer: `Безопасность — наш приоритет:

• Данные шифруются при передаче и хранении
• Мы не продаём твои данные третьим лицам
• Данные не используются для обучения общих моделей
• Авторизация через Telegram — безопасна по умолчанию
• Ты можешь запросить удаление всех своих данных в любое время

GrandHub использует твои данные только чтобы лучше помогать тебе — и ни для чего другого.`
  },
  {
    id: "vs-competitors",
    question: "Чем GrandHub лучше Алисы, GigaChat и YandexGPT?",
    answer: `Честное сравнение:

**Алиса (Яндекс):** Простые ответы на вопросы, нет памяти, нет персонализации, нет сложных задач.

**GigaChat (Сбер):** Корпоративный продукт, ориентирован на бизнес-интеграции, а не на личную жизнь.

**YandexGPT:** Мощный генератор текста, но нет персонального профиля и специализированных навыков жизни.

**ChatGPT:** Умнее всех, но не знает тебя, не адаптирован для России, платёж в долларах.

**GrandHub:** Знает тебя. Российский. Специализированные навыки. Trading Hub. Telegram.`
  },
  {
    id: "support",
    question: "Как связаться с поддержкой GrandHub?",
    answer: `Несколько способов связи:

• **Telegram:** @Grandhub_bot — написать /help внутри бота
• **Email:** hello@grandhub.ru
• **Сайт:** grandhub.ru/contacts

Время ответа:
• В боте: обычно в течение нескольких часов
• Email: до 24 часов в рабочие дни

Поддержка ведётся на русском языке.`
  },
];

export default function FAQ() {
  useEffect(() => {
    document.title = "Часто задаваемые вопросы - GrandHub";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Часто задаваемые вопросы
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Ответы на вопросы о GrandHub — первом персональном AI-помощнике для жизни в России
              </p>
            </div>
          </div>
        </section>

        <section className="pb-24 sm:pb-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem key={faq.id} value={faq.id}
                  className="bg-card rounded-lg border border-border shadow-sm px-6"
                  data-testid={`faq-item-${index + 1}`}>
                  <AccordionTrigger
                    className="text-left text-base font-medium text-foreground hover:text-muted-foreground transition-colors py-6"
                    data-testid={`faq-trigger-${index + 1}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent
                    className="text-muted-foreground leading-7 pb-6 whitespace-pre-line"
                    data-testid={`faq-content-${index + 1}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Нужна помощь?
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Не нашёл ответ? Напиши нам — отвечаем быстро.
              </p>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Telegram-бот</h3>
                  <p className="text-sm text-muted-foreground mb-4">Напиши /help в боте</p>
                  <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full">@Grandhub_bot</Button>
                  </a>
                </div>
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Тарифы</h3>
                  <p className="text-sm text-muted-foreground mb-4">Выбери подходящий план</p>
                  <Link href="/#pricing">
                    <Button variant="outline" size="sm" className="w-full">Посмотреть тарифы</Button>
                  </Link>
                </div>
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">О продукте</h3>
                  <p className="text-sm text-muted-foreground mb-4">Подробнее о GrandHub</p>
                  <Link href="/about">
                    <Button variant="outline" size="sm" className="w-full">Узнать больше</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Попробуй GrandHub бесплатно
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              5 Pro-запросов без оплаты. Просто открой бот.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                <Button size="lg" data-testid="button-start-protection">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Открыть @Grandhub_bot
                </Button>
              </a>
              <Link href="/about">
                <Button variant="outline" size="lg">Узнать больше</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

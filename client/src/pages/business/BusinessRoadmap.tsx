import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Brain,
  MessageSquare,
  ShoppingCart,
  Heart,
  GraduationCap,
  Home,
  TrendingUp,
  Users,
  Sparkles,
  Bot,
  Globe,
  Smartphone,
  Mic,
  Image,
  Zap,
  Shield,
  BarChart3
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { GlowCard } from "@/components/GlowCard";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status: "done" | "current" | "planned";
  items?: string[];
}

interface RoadmapPhase {
  quarter: string;
  title: string;
  status: "done" | "current" | "planned";
  icon: React.ReactNode;
  features: { name: string; status: "done" | "current" | "planned"; description: string; link?: string }[];
}

const timeline: TimelineEvent[] = [
  {
    date: "2024",
    title: "Исследование и прототипы",
    description: "Анализ рынка AI-ассистентов, эксперименты с LLM-моделями, первые прототипы.",
    status: "done",
    items: [
      "Исследование рынка AI-ассистентов в России и мире",
      "Тестирование GPT-4, Claude, GigaChat, YandexGPT",
      "Прототип персонального бота на OpenAI API",
      "Определение ниши: персональный помощник для жизни, не для работы",
      "Анализ конкурентов: Алиса, GigaChat, ChatGPT — у всех нет персонализации",
      "Первые концепции навыков: финансы, здоровье, расписание",
    ],
  },
  {
    date: "H1 2025",
    title: "Формирование концепции",
    description: "Определение бизнес-модели, технологического стека и продуктовой стратегии.",
    status: "done",
    items: [
      "Выбор стека: Next.js + Express + PostgreSQL + Redis + RabbitMQ",
      "Концепция «Один человек = один помощник»",
      "Проектирование микросервисной архитектуры",
      "Модель монетизации: тарифы как у сотового оператора",
      "Исследование юридических аспектов (152-ФЗ, хранение данных)",
      "Формирование позиционирования: «ChatGPT знает всё. GrandHub знает тебя.»",
      "Выбор AI-провайдеров: Anthropic Claude как основа",
    ],
  },
  {
    date: "H2 2025",
    title: "Техническая база",
    description: "Настройка инфраструктуры, CI/CD, базовые сервисы.",
    status: "done",
    items: [
      "Развёртывание серверной инфраструктуры (VPS, Docker, nginx)",
      "Настройка CI/CD через GitHub Actions + self-hosted runner",
      "Система мониторинга: Prometheus + Grafana",
      "Booking-система для записи клиентов (booking.1int.ru)",
      "VPN-инфраструктура для обхода блокировок API",
      "Прокси для OpenAI и Voyage AI (российские серверы блокируют)",
      "Настройка автоматических бэкапов с ротацией",
      "SSL-сертификаты, DNS, домены (grandhub.ru, gbzr.ru)",
    ],
  },
  {
    date: "Январь 2026",
    title: "Архитектура и документация",
    description: "Полное проектирование платформы: 22 микросервиса, 12 навыков, Trading Hub.",
    status: "done",
    items: [
      "Архитектура: 22 микросервиса (Auth, Billing, Escrow, Trading, Marketplace и др.)",
      "12 встроенных навыков: Финансы, Здоровье, Образование, Покупки, Путешествия и др.",
      "Trading Hub — аукционы, тендеры, AI-автоторг 24/7, эскроу, AI-арбитраж",
      "Frontend: 10 компонентов ландинга (Hero, Features, TradingHub, FamilyPlan, Security)",
      "Docker Compose для всех сервисов с health checks",
      "Документация: 25+ файлов (architecture-deep-dive, monetization, SERVICES, SKILLS)",
      "Unit Economics v4: ARPU 3509₽, break-even ~200 юзеров, чистая маржа 48%",
      "5000+ тестов (Trading, Tender, Event Bus, Notifications, WebSocket, Memory)",
      "Инвестиционный питч: ₽92M на 18 месяцев, ROI 165% Year 1",
      "Семейные планы: 3/5/10 человек с общим бюджетом и контролем",
    ],
  },
  {
    date: "Февраль 2026",
    title: "MVP — запуск платформы",
    description: "Боевой запуск. Первые пользователи. AI-runtime, Telegram-бот, маркетплейс навыков.",
    status: "current",
    items: [
      { text: "AI-runtime на Claude Sonnet 4.6 с контекстом до 1M токенов", link: "/features/ai-assistant" },
      { text: "Telegram-бот @Grandhub_bot с inline-кнопками и typing indicator", link: "/features/telegram-bot" },
      { text: "Мультимодальность: распознавание фото чеков, документов, изображений", link: "/features/multimodal" },
      { text: "Персональный онбординг — AI знакомится и запоминает пользователя", link: "/features/onboarding" },
      { text: "RAG-поиск по памяти: семантический поиск через Voyage AI embeddings", link: "/features/rag-memory" },
      { text: "Маркетплейс навыков — 169 скиллов импортировано, 144 переведено на RU", link: "/features/skills-marketplace" },
      { text: "Публичные страницы помощников: grandhub.ru/a/GH-XXXXX", link: "/features/ai-secretary" },
      { text: "AI-секретарь: приём заявок, запись на встречи, FAQ, фильтр спама", link: "/features/ai-secretary" },
      "Bot Registry: каждый пользователь получает уникальный GH-ID",
      "Design System: тёмный glassmorphism, B&W минимализм",
      "Version Diff: сравнение версий навыков (side-by-side/unified)",
      "Command Palette (Cmd+K): быстрый поиск по всему",
      "Pipeline разработки: Architect→Coder→Reviewer с автоматическим retry",
      { text: "A2A Protocol — помощники общаются между собой (Bot-to-Bot + E2E шифрование)", link: "/features/a2a-protocol" },
      "Первые 8 пользователей в системе",
      "Guardian AI: защита от prompt injection",
      "Audit Log: полная история действий",
    ],
  },
  {
    date: "Март 2026",
    title: "Финансовый помощник",
    description: "Полноценный финансовый модуль: чеки, подписки, бюджет, биллинг.",
    status: "planned",
    items: [
      { text: "Чеки + AI — фото чека → автоматическая категоризация расходов", link: "/features/receipts-ai" },
      "Интеграция с ОФД (1-ofd.ru, taxcom.ru) — автоимпорт чеков из email",
      { text: "Трекер подписок: Яндекс.Плюс, Netflix, Spotify — напоминания о списаниях", link: "/features/subscriptions" },
      { text: "Семейный бюджет — общий учёт расходов для семьи", link: "/features/family-budget" },
      { text: "Интеграция Robokassa — оплата тарифов GrandHub", link: "/features/billing" },
      "Early Bird тариф для первых 500 пользователей",
      "Тарифные планы: Free / Старт (990₽) / Про (2490₽) / Бизнес (7990₽)",
      "Пополнение баланса: пакеты 100–3000₽ с бонусами до 25%",
      "Аналитика расходов: графики, тренды, прогнозы",
      "Финансовые цели и накопления",
    ],
  },
  {
    date: "Апрель 2026",
    title: "Skills Marketplace",
    description: "Открытая платформа навыков: создание, публикация, монетизация.",
    status: "planned",
    items: [
      { text: "Skills Marketplace — каталог с рейтингами и отзывами", link: "/features/skills-marketplace" },
      { text: "No-code создание навыков: опиши задачу → AI создаёт навык", link: "/features/no-code-builder" },
      "Royalty-модель для авторов — до 30% с каждой продажи",
      "Премиум-навыки: Финансы Pro (199₽), Здоровье Pro (199₽), Торговля (399₽)",
      "Навык «Настроение + AI» — трекер эмоционального состояния",
      "Навык «Репетитор Pro» (349₽) — подготовка к ЕГЭ/ОГЭ",
      { text: "Cross-skill экосистема: навыки общаются друг с другом", link: "/features/cross-skill-ecosystem" },
      "Stateful skills: навык помнит контекст и растёт со временем",
      "Пакет «ВСЁ»: 1990₽/мес за все премиум-навыки",
      "API для разработчиков — публикация через CLI",
    ],
  },
  {
    date: "Май–Июнь 2026",
    title: "Мультимодальность и голос",
    description: "Полная мультимодальность: голос, изображения, видео, музыка.",
    status: "planned",
    items: [
      { text: "Голосовые сообщения — Whisper STT (распознавание) + ElevenLabs TTS (озвучка)", link: "/features/voice-audio" },
      "Персональный голос помощника — выбор из библиотеки или клонирование",
      { text: "Генерация изображений — DALL-E 3 / Midjourney (5–12₽/шт)", link: "/features/image-generation" },
      "Генерация видео — Sora / Runway (15₽/сек)",
      "Генерация музыки — Suno (15₽/трек)",
      "Длинный контекст: обработка документов >100 страниц",
      "Расширенное хранилище: +99₽ за каждые 5GB сверх тарифа",
      "Распознавание голосовых команд в реальном времени",
      "Мультиязычность: английский, турецкий, казахский",
    ],
  },
  {
    date: "Q3 2026",
    title: "Trading Hub и B2B",
    description: "Торговая площадка с AI-автоторгом и бизнес-инструменты.",
    status: "planned",
    items: [
      { text: "Аукционы с AI-автоторгом 24/7 — комиссия 5%", link: "/features/trading-hub" },
      "Тендеры для бизнеса — комиссия 7%",
      "Эскроу-платежи — безопасные сделки, комиссия 1.5%",
      "AI-арбитраж споров между участниками",
      "Fraud Detection — машинное обучение для выявления мошенничества",
      "Premium размещение: 49–249₽ за продвижение в каталоге",
      { text: "B2B бизнес-ассистент — подключение к сайту + CRM + 1С", link: "/features/b2b-platform" },
      "Аудит бизнеса за 30 минут — AI анализирует данные компании",
      "Двусторонний маркетплейс: бизнесы ↔ специалисты",
      "Система репутации: рейтинги продавцов и покупателей",
    ],
  },
  {
    date: "Q4 2026",
    title: "Умный дом и экосистема",
    description: "IoT-интеграции, мобильное приложение, международная экспансия.",
    status: "planned",
    items: [
      "Навык «Умный дом» (249₽/мес) — Яндекс.Станция / Tuya / Zigbee",
      "Голосовые команды через помощника → управление устройствами",
      "Автоматические сценарии: «Ушёл из дома» → выключить свет, закрыть шторы",
      "Мониторинг расхода электричества и воды",
      { text: "Мобильное приложение iOS и Android", link: "/features/mobile-app" },
      "Push-уведомления и виджеты на рабочий стол",
      "Интеграция с календарями: Google, Яндекс, Apple",
      "Навык «Забота+» (149₽) — напоминания о лекарствах, витаминах",
      "Женское здоровье (149₽) — трекер цикла с AI-прогнозами",
      "Международная экспансия: СНГ, Турция",
    ],
  },
  {
    date: "2027",
    title: "Масштабирование",
    description: "Выход на массовый рынок. 100K+ пользователей. Мобильные приложения.",
    status: "planned",
    items: [
      "100 000+ активных пользователей",
      "Мульти-секретарь для команд и бизнеса",
      "AI предсказывает потребности до того, как пользователь попросит",
      "Партнёрская программа: интеграции с банками, ритейлерами, сервисами",
      "Открытое API для третьих сторон",
      "Помощники общаются между собой (Bot-to-Bot Protocol)",
      "Корпоративный тариф: white-label AI-ассистент",
      "Exit valuation: ₽100–200B",
    ],
  },
];

const phases: RoadmapPhase[] = [
  {
    quarter: "Сейчас",
    title: "Ядро платформы",
    status: "current",
    icon: <Brain className="h-6 w-6" />,
    features: [
      { name: "AI-помощник", status: "done", description: "Claude Sonnet 4.6, контекст до 1M токенов" },
      { link: "/features/telegram-bot", name: "Telegram-бот", status: "done", description: "Полнофункциональный бот с inline-кнопками" },
      { name: "Онбординг", status: "done", description: "AI знакомится с пользователем и запоминает" },
      { name: "Multimodal", status: "done", description: "Распознавание фото, чеков, документов" },
      { name: "RAG-память", status: "done", description: "Семантический поиск по истории пользователя" },
      { name: "Маркетплейс", status: "current", description: "169 навыков, поиск, категории" },
      { link: "/features/ai-secretary", name: "AI-секретарь", status: "current", description: "Приём заявок, запись на встречи" },
    ],
  },
  {
    quarter: "Март",
    title: "Финансы",
    status: "planned",
    icon: <TrendingUp className="h-6 w-6" />,
    features: [
      { link: "/features/receipts-ai", name: "Чеки + AI", status: "planned", description: "Фото чека → автоматическая категоризация" },
      { link: "/features/subscriptions", name: "Трекер подписок", status: "planned", description: "Отслеживание и оптимизация подписок" },
      { name: "Биллинг", status: "planned", description: "Robokassa, тарифы, пополнение баланса" },
      { link: "/features/family-budget", name: "Семейный бюджет", status: "planned", description: "Общий учёт для семьи" },
    ],
  },
  {
    quarter: "Q2",
    title: "Экосистема",
    status: "planned",
    icon: <Globe className="h-6 w-6" />,
    features: [
      { link: "/features/skills-marketplace", name: "Skills Marketplace", status: "planned", description: "Публикация и монетизация навыков" },
      { link: "/features/no-code-builder", name: "No-code конструктор", status: "planned", description: "Создание навыков без кода" },
      { link: "/features/voice-audio", name: "Голос и аудио", status: "planned", description: "Whisper STT + ElevenLabs TTS" },
      { link: "/features/image-generation", name: "Генерация картинок", status: "planned", description: "DALL-E / Midjourney интеграция" },
    ],
  },
  {
    quarter: "Q3–Q4",
    title: "Масштабирование",
    status: "planned",
    icon: <Zap className="h-6 w-6" />,
    features: [
      { link: "/features/trading-hub", name: "Trading Hub", status: "planned", description: "Аукционы, тендеры, AI-автоторг" },
      { link: "/features/b2b-platform", name: "B2B платформа", status: "planned", description: "Бизнес-ассистент с 1С и CRM" },
      { link: "/features/smart-home", name: "Умный дом", status: "planned", description: "IoT-интеграции и голосовое управление" },
      { link: "/features/mobile-app", name: "Мобильное приложение", status: "planned", description: "iOS и Android" },
    ],
  },
];

function StatusIcon({ status }: { status: "done" | "current" | "planned" }) {
  if (status === "done") return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
  if (status === "current") return <Clock className="h-5 w-5 text-blue-400 animate-pulse" />;
  return <Circle className="h-5 w-5 text-muted-foreground/50" />;
}

function StatusBadge({ status }: { status: "done" | "current" | "planned" }) {
  if (status === "done") return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30">Готово</Badge>;
  if (status === "current") return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 animate-pulse">В работе</Badge>;
  return <Badge className="bg-muted text-muted-foreground border-border hover:bg-muted/80">Планируется</Badge>;
}

export default function BusinessRoadmap() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Дорожная карта — GrandHub"
        description="План развития GrandHub: от AI-помощника до полноценной экосистемы. Хронология, текущий статус и будущие фичи."
      />
      
      <Header />
      
      <main>
        {/* Hero */}
        <section className="aurora-bg relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-muted text-muted-foreground border-border flex items-center gap-1.5">
                <CalendarDays className="h-3 w-3" />
                2026 — 2027
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Дорожная карта
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Как GrandHub превращается из AI-помощника в экосистему, 
              которая знает тебя лучше любого приложения.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-16">
              Хронология развития
            </h2>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-blue-500/50 to-border/30" />
              
              <div className="space-y-12">
                {timeline.map((event, i) => (
                  <div key={i} className="relative pl-20 scroll-reveal" style={{transitionDelay: `${i * 100}ms`}}>
                    {/* Dot on timeline */}
                    <div className={`absolute left-6 top-1.5 h-4 w-4 rounded-full border-2 ${
                      event.status === "done" ? "bg-emerald-500 border-emerald-400" :
                      event.status === "current" ? "bg-blue-500 border-blue-400 animate-pulse" :
                      "bg-muted border-border"
                    }`} />
                    
                    <div className={`rounded-2xl border p-6 transition-all ${
                      event.status === "current" 
                        ? "border-blue-500/30 bg-blue-500/5" 
                        : event.status === "done"
                        ? "border-border/50 bg-muted/30"
                        : "border-border/30 bg-muted/20"
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-muted-foreground/70">{event.date}</span>
                        <StatusBadge status={event.status} />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      {event.items && (
                        <ul className="space-y-2">
                          {event.items.map((item, j) => {
                            const text = typeof item === "string" ? item : item.text;
                            const link = typeof item === "string" ? undefined : item.link;
                            return (
                              <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <StatusIcon status={event.status} />
                                {link ? (
                                  <Link href={link}>
                                    <span className="text-primary hover:underline underline-offset-2 cursor-pointer">{text}</span>
                                  </Link>
                                ) : (
                                  <span>{text}</span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Phases Overview */}
        <section className="py-16 lg:py-24 border-t border-border/30">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">Фазы развития</h2>
              <p className="mt-4 text-muted-foreground">Детализация по направлениям</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {phases.map((phase, i) => (
                <GlowCard key={i} className={`bg-muted/30 border scroll-reveal transition-all ${
                  phase.status === "current" ? "border-blue-500/30" : "border-border/30"
                }`} style={{transitionDelay: `${i * 100}ms`}}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 ${
                          phase.status === "done" ? "bg-emerald-500/10 text-emerald-400" :
                          phase.status === "current" ? "bg-blue-500/10 text-blue-400" :
                          "bg-muted/50 text-muted-foreground/70"
                        }`}>
                          {phase.icon}
                        </div>
                        <div>
                          <CardTitle className="text-foreground">{phase.title}</CardTitle>
                          <CardDescription className="text-muted-foreground/70">{phase.quarter}</CardDescription>
                        </div>
                      </div>
                      <StatusBadge status={phase.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {phase.features.map((feature, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <StatusIcon status={feature.status} />
                          <div>
                            {feature.link ? (
                              <Link href={feature.link}>
                                <p className="text-sm font-medium text-foreground/80 hover:text-primary cursor-pointer underline-offset-2 hover:underline">{feature.name}</p>
                              </Link>
                            ) : (
                              <p className="text-sm font-medium text-foreground/80">{feature.name}</p>
                            )}
                            <p className="text-xs text-muted-foreground/70">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 border-t border-border/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Хочешь быть в числе первых?
            </h2>
            <p className="text-muted-foreground mb-8">
              Первые 500 пользователей получают Early Bird тариф — навсегда.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  Попробовать бесплатно
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Link href="/#pricing">
                <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-muted">
                  Посмотреть тарифы
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

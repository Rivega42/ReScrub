import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { confetti, matrixRain, rocketLaunch } from "@/lib/effects";
import {
  Home,
  Info,
  HelpCircle,
  Mail,
  Activity,
  BookOpen,
  CreditCard,
  Bot,
  MessageCircle,
  UserCheck,
  Image,
  Brain,
  ShoppingBag,
  CalendarCheck,
  Receipt,
  Repeat,
  Wallet,
  Users,
  Wand2,
  Mic,
  Sparkles,
  TrendingUp,
  Building2,
  Cpu,
  Smartphone,
  Network,
  Map,
  Code2,
  Plug,
  FileText,
  Layers,
  Database,
  Zap,
  Search,
  Palette,
  Link,
  MessageCircle as MessageCircleIcon,
} from "lucide-react";

interface PageEntry {
  title: string;
  description: string;
  keywords: string;
  url: string;
  category: "Фичи" | "Бизнес" | "Архитектура" | "Общее";
  icon: React.ElementType;
}

const PAGES: PageEntry[] = [
  // ── Общее ──────────────────────────────────────────────
  {
    title: "Главная",
    description: "Всё начинается здесь",
    keywords: "главная home grandhub ai помощник старт",
    url: "/",
    category: "Общее",
    icon: Home,
  },
  {
    title: "О проекте",
    description: "Кто мы и зачем всё это затеяли",
    keywords: "о проекте about нас история команда миссия",
    url: "/about",
    category: "Общее",
    icon: Info,
  },
  {
    title: "FAQ",
    description: "Ответы на то, что спрашивают чаще всего",
    keywords: "faq вопросы ответы помощь справка",
    url: "/faq",
    category: "Общее",
    icon: HelpCircle,
  },
  {
    title: "Контакты",
    description: "Напиши нам — мы реальные люди",
    keywords: "контакты contacts связаться email телефон",
    url: "/contacts",
    category: "Общее",
    icon: Mail,
  },
  {
    title: "Статус платформы",
    description: "Всё ли работает прямо сейчас",
    keywords: "статус status uptime сервисы доступность",
    url: "/status",
    category: "Общее",
    icon: Activity,
  },
  {
    title: "Блог",
    description: "Что нового и интересного",
    keywords: "блог blog статьи новости обновления",
    url: "/blog",
    category: "Общее",
    icon: BookOpen,
  },
  {
    title: "Тарифы",
    description: "Найди тариф под себя",
    keywords: "тарифы pricing цены подписка free старт про бизнес план оплата",
    url: "/business/pricing",
    category: "Общее",
    icon: CreditCard,
  },

  // ── Фичи ───────────────────────────────────────────────
  {
    title: "AI-помощник",
    description: "Твой личный AI, который помнит и понимает",
    keywords: "ai помощник claude нейросеть искусственный интеллект assistant",
    url: "/features/ai-assistant",
    category: "Фичи",
    icon: Bot,
  },
  {
    title: "Telegram-бот",
    description: "Пишешь в Telegram — получаешь суперсилу",
    keywords: "telegram телеграм бот чат messenger",
    url: "/features/telegram-bot",
    category: "Фичи",
    icon: MessageCircle,
  },
  {
    title: "Онбординг",
    description: "AI знакомится с тобой и подстраивается",
    keywords: "онбординг onboarding регистрация знакомство настройка старт",
    url: "/features/onboarding",
    category: "Фичи",
    icon: UserCheck,
  },
  {
    title: "Мультимодальность",
    description: "Отправь фото — AI разберётся",
    keywords: "мультимодальность multimodal фото изображения распознавание чеки vision",
    url: "/features/multimodal",
    category: "Фичи",
    icon: Image,
  },
  {
    title: "RAG-память",
    description: "Помнит всё, что ты рассказывал",
    keywords: "rag память memory поиск история контекст embeddings векторная",
    url: "/features/rag-memory",
    category: "Фичи",
    icon: Brain,
  },
  {
    title: "Маркетплейс навыков",
    description: "169 навыков — выбери нужные",
    keywords: "маркетплейс навыки skills marketplace каталог магазин скиллы",
    url: "/features/skills-marketplace",
    category: "Фичи",
    icon: ShoppingBag,
  },
  {
    title: "AI-секретарь",
    description: "AI принимает заявки и записывает клиентов за тебя",
    keywords: "секретарь secretary запись заявки визитка встречи calendar",
    url: "/features/ai-secretary",
    category: "Фичи",
    icon: CalendarCheck,
  },
  {
    title: "Чеки + AI",
    description: "Сфоткай чек — расходы посчитаются сами",
    keywords: "чеки receipts расходы финансы учёт ofd касса траты",
    url: "/features/receipts-ai",
    category: "Фичи",
    icon: Receipt,
  },
  {
    title: "Трекер подписок",
    description: "Не переплачивай за забытые подписки",
    keywords: "подписки subscriptions netflix яндекс плюс spotify трекер",
    url: "/features/subscriptions",
    category: "Фичи",
    icon: Repeat,
  },
  {
    title: "Биллинг",
    description: "Прозрачная оплата без сюрпризов",
    keywords: "биллинг billing оплата robokassa тариф баланс платёж",
    url: "/features/billing",
    category: "Фичи",
    icon: Wallet,
  },
  {
    title: "Семейный бюджет",
    description: "Считайте деньги вместе, без ссор",
    keywords: "семья семейный бюджет family budget расходы общие",
    url: "/features/family-budget",
    category: "Фичи",
    icon: Users,
  },
  {
    title: "No-code конструктор",
    description: "Опиши задачу — AI сделает навык",
    keywords: "no-code конструктор builder создание без кода навыки nocode",
    url: "/features/no-code-builder",
    category: "Фичи",
    icon: Wand2,
  },
  {
    title: "Голос и аудио",
    description: "Говори голосом — AI слушает и отвечает",
    keywords: "голос аудио voice audio whisper elevenlabs stt tts озвучка речь",
    url: "/features/voice-audio",
    category: "Фичи",
    icon: Mic,
  },
  {
    title: "Генерация картинок",
    description: "Опиши картинку — получи за секунды",
    keywords: "картинки изображения image generation dall-e midjourney stable diffusion генерация",
    url: "/features/image-generation",
    category: "Фичи",
    icon: Sparkles,
  },
  {
    title: "Trading Hub",
    description: "AI торгуется за тебя 24/7",
    keywords: "trading hub торговля аукцион тендер сделки маркетплейс b2b",
    url: "/features/trading-hub",
    category: "Фичи",
    icon: TrendingUp,
  },
  {
    title: "B2B платформа",
    description: "Подключи AI к своему бизнесу",
    keywords: "b2b платформа бизнес 1с crm интеграция корпоративный",
    url: "/features/b2b-platform",
    category: "Фичи",
    icon: Building2,
  },
  {
    title: "Умный дом",
    description: "Управляй домом голосом через AI",
    keywords: "умный дом smart home iot яндекс станция zigbee устройства автоматизация",
    url: "/features/smart-home",
    category: "Фичи",
    icon: Cpu,
  },
  {
    title: "Мобильное приложение",
    description: "GrandHub всегда в кармане",
    keywords: "мобильное приложение mobile app ios android телефон",
    url: "/features/mobile-app",
    category: "Фичи",
    icon: Smartphone,
  },
  {
    title: "Cross-skill экосистема",
    description: "Навыки работают вместе, как команда",
    keywords: "cross-skill экосистема ecosystem интеграция навыки взаимодействие",
    url: "/features/cross-skill-ecosystem",
    category: "Фичи",
    icon: Network,
  },

  // ── Бизнес ─────────────────────────────────────────────
  {
    title: "Roadmap",
    description: "Куда мы движемся и что будет дальше",
    keywords: "roadmap дорожная карта план будущее развитие релизы",
    url: "/business/roadmap",
    category: "Бизнес",
    icon: Map,
  },
  {
    title: "API",
    description: "Для тех, кто хочет строить поверх GrandHub",
    keywords: "api разработчик developer интеграция endpoint rest",
    url: "/business/api",
    category: "Бизнес",
    icon: Code2,
  },
  {
    title: "Интеграции",
    description: "Работает с тем, что ты уже используешь",
    keywords: "интеграции integrations подключение сервисы партнёры",
    url: "/business/integrations",
    category: "Бизнес",
    icon: Plug,
  },
  {
    title: "Кейсы",
    description: "Реальные истории реальных людей",
    keywords: "кейсы cases примеры use cases истории успеха",
    url: "/business/cases",
    category: "Бизнес",
    icon: FileText,
  },
  {
    title: "Whitepaper",
    description: "Как устроен GrandHub под капотом",
    keywords: "whitepaper документ технический white paper описание",
    url: "/business/whitepaper",
    category: "Бизнес",
    icon: Layers,
  },

  // ── Архитектура ────────────────────────────────────────
  {
    title: "AI Architecture",
    description: "Мозг платформы — как он думает",
    keywords: "архитектура ai architecture нейросеть система устройство",
    url: "/architecture/ai",
    category: "Архитектура",
    icon: Zap,
  },
  {
    title: "Memory Architecture",
    description: "Как AI запоминает и не забывает",
    keywords: "память memory хранение данные архитектура уровни",
    url: "/architecture/memory",
    category: "Архитектура",
    icon: Database,
  },
  {
    title: "Skills Architecture",
    description: "Как навыки учатся и взаимодействуют",
    keywords: "навыки skills архитектура скиллы система модули",
    url: "/architecture/skills",
    category: "Архитектура",
    icon: Network,
  },
];

const CATEGORIES = ["Фичи", "Бизнес", "Архитектура", "Общее"] as const;

function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return true;
  // Direct substring match first (fast path)
  if (t.includes(q)) return true;
  // Fuzzy: all chars of query appear in order in text
  let ti = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const idx = t.indexOf(q[qi], ti);
    if (idx === -1) return false;
    ti = idx + 1;
  }
  return true;
}

function matchesQuery(page: PageEntry, query: string): boolean {
  if (!query.trim()) return true;
  const haystack = `${page.title} ${page.description} ${page.keywords}`;
  return fuzzyMatch(haystack, query);
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();

  // Easter egg detection
  const lowerQuery = query.toLowerCase().trim();
  const isParty = lowerQuery === "party" || lowerQuery === "🎉";
  const isMatrix = lowerQuery === "matrix";
  const isRocket = lowerQuery === "rocket" || lowerQuery === "🚀";

  // Theme toggle helper
  const toggleTheme = () => {
    const current = localStorage.getItem("theme") as "light" | "dark" || "light";
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    onOpenChange(false);
    setQuery("");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Ссылка скопирована!");
    });
    onOpenChange(false);
    setQuery("");
  };

  const openBot = () => {
    window.open("https://t.me/Grandhub_bot", "_blank");
    onOpenChange(false);
    setQuery("");
  };

  const filteredByCategory = CATEGORIES.map((cat) => ({
    category: cat,
    pages: PAGES.filter((p) => p.category === cat && matchesQuery(p, query)),
  })).filter((g) => g.pages.length > 0);

  const allFiltered = filteredByCategory.flatMap((g) => g.pages);

  const handleSelect = useCallback(
    (url: string) => {
      navigate(url);
      onOpenChange(false);
      setQuery("");
    },
    [navigate, onOpenChange]
  );

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Поиск по GrandHub... (навыки, фичи, страницы)"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-8">
            <Search className="h-8 w-8 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground text-sm">Ничего не найдено по запросу «{query}»</p>
          </div>
        </CommandEmpty>

        {/* Easter Eggs */}
        {isParty && (
          <CommandItem
            key="__party"
            value="party confetti"
            onSelect={() => { confetti(); onOpenChange(false); setQuery(""); }}
            className="flex items-center gap-3 py-2.5 cursor-pointer text-yellow-500"
          >
            <span className="text-lg">🎉</span>
            <span className="font-medium">Конфетти!</span>
          </CommandItem>
        )}
        {isMatrix && (
          <CommandItem
            key="__matrix"
            value="matrix rain"
            onSelect={() => { matrixRain(); onOpenChange(false); setQuery(""); }}
            className="flex items-center gap-3 py-2.5 cursor-pointer text-green-500"
          >
            <span className="text-lg">💊</span>
            <span className="font-medium">Добро пожаловать в Матрицу</span>
          </CommandItem>
        )}
        {isRocket && (
          <CommandItem
            key="__rocket"
            value="rocket launch"
            onSelect={() => { rocketLaunch(); onOpenChange(false); setQuery(""); }}
            className="flex items-center gap-3 py-2.5 cursor-pointer text-orange-500"
          >
            <span className="text-lg">🚀</span>
            <span className="font-medium">Поехали!</span>
          </CommandItem>
        )}

        {/* Actions group */}
        {(!query.trim() || "действия сменить тему скопировать ссылку написать помощнику".includes(lowerQuery)) && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Действия">
              <CommandItem
                value="сменить тему dark light theme"
                onSelect={toggleTheme}
                className="flex items-center gap-3 py-2.5 cursor-pointer"
              >
                <Palette className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-foreground text-sm leading-tight">Сменить тему</span>
                  <span className="text-xs text-muted-foreground">Переключить dark / light</span>
                </div>
              </CommandItem>
              <CommandItem
                value="скопировать ссылку copy link url"
                onSelect={copyLink}
                className="flex items-center gap-3 py-2.5 cursor-pointer"
              >
                <Link className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-foreground text-sm leading-tight">Скопировать ссылку</span>
                  <span className="text-xs text-muted-foreground">Текущий URL в буфер обмена</span>
                </div>
              </CommandItem>
              <CommandItem
                value="написать помощнику telegram bot grandhub"
                onSelect={openBot}
                className="flex items-center gap-3 py-2.5 cursor-pointer"
              >
                <MessageCircleIcon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-foreground text-sm leading-tight">Написать помощнику</span>
                  <span className="text-xs text-muted-foreground">Открыть @Grandhub_bot в Telegram</span>
                </div>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {filteredByCategory.map((group, idx) => (
          <div key={group.category}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={group.category}>
              {group.pages.map((page) => {
                const Icon = page.icon;
                return (
                  <CommandItem
                    key={page.url}
                    value={`${page.title} ${page.description} ${page.keywords}`}
                    onSelect={() => handleSelect(page.url)}
                    className="flex items-start gap-3 py-2.5 cursor-pointer"
                  >
                    <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-foreground text-sm leading-tight">
                        {page.title}
                      </span>
                      <span className="text-xs text-muted-foreground truncate mt-0.5">
                        {page.description}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ))}
      </CommandList>

      <div className="border-t border-border px-4 py-2.5 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {allFiltered.length} {allFiltered.length === 1 ? "страница" : "страниц"}
        </p>
        <p className="text-xs text-muted-foreground">
          ↑↓ навигация · Enter выбрать · Esc закрыть
        </p>
      </div>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return { open, setOpen };
}

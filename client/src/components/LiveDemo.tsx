import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ExternalLink } from "lucide-react";

const REQUESTS_STORAGE_KEY = "grandhub_demo_requests";
const CHAT_STORAGE_KEY = "grandhub_demo_chat";
const MAX_REQUESTS = 5;
const TG_LINK = "https://t.me/Grandhub_bot?start=web_demo";
const API_ENDPOINT = "/api/demo/chat";
const API_TIMEOUT = 10000;

interface ChatMsg {
  role: "user" | "ai";
  text: string;
  ts: number;
}

const PRESET_PROMPTS = [
  "Сколько я трачу на еду?",
  "Запиши меня к врачу на пятницу",
  "Какие подписки я могу отменить?",
];

const FALLBACK_RESPONSES: Record<string, string> = {
  "Сколько я трачу на еду?":
    "За последний месяц на еду ушло 18 450₽. Основные траты: продукты (12 300₽) и доставка (6 150₽). Хочешь, покажу по дням или сравню с прошлым месяцем?",
  "Запиши меня к врачу на пятницу":
    "Нашёл свободное время у терапевта: пятница 15:00 или 17:30. Какое удобнее? Я добавлю в календарь и напомню за 2 часа.",
  "Какие подписки я могу отменить?":
    "Нашёл 3 подписки которые ты не используешь: Кинопоиск (199₽/мес — не смотрел 2 месяца), Яндекс.Музыка (199₽/мес — 2 прослушивания), Дропбокс (690₽/мес — 0.1GB из 2TB). Итого можно сэкономить 1 088₽/мес.",
};

const UNIVERSAL_FALLBACK =
  "Отличный вопрос! В полной версии я смогу помочь с этим, используя твою историю и персональные данные. Попробуй бесплатно в Telegram!";

function loadMessages(): ChatMsg[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveMessages(msgs: ChatMsg[]) {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs));
  } catch {}
}

function getRequestCount(): number {
  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (raw) {
      const count = parseInt(raw, 10);
      if (!isNaN(count)) return count;
    }
  } catch {}
  return 0;
}

function incrementRequestCount(): number {
  const count = getRequestCount() + 1;
  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, count.toString());
  } catch {}
  return count;
}

async function callAPI(message: string, history: ChatMsg[] = []): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || data.message || data.text || UNIVERSAL_FALLBACK;
  } catch (error) {
    console.error("API call failed:", error);
    return FALLBACK_RESPONSES[message] || UNIVERSAL_FALLBACK;
  }
}

export default function LiveDemo() {
  const [messages, setMessages] = useState<ChatMsg[]>(loadMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const count = getRequestCount();
    setRequestCount(count);
    setLimitReached(count >= MAX_REQUESTS);
  }, []);

  useEffect(() => {
    saveMessages(messages);
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || disabled) return;

    if (requestCount >= MAX_REQUESTS) {
      setLimitReached(true);
      return;
    }

    setInput("");
    setDisabled(true);

    const userMsg: ChatMsg = { role: "user", text: text.trim(), ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => setIsTyping(true), 500);

    const aiText = await callAPI(text.trim(), [...messages, userMsg]);
    const newCount = incrementRequestCount();
    setRequestCount(newCount);

    setIsTyping(false);
    const aiMsg: ChatMsg = { role: "ai", text: aiText, ts: Date.now() };
    setMessages((prev) => [...prev, aiMsg]);

    if (newCount >= MAX_REQUESTS) {
      setLimitReached(true);
    }

    setDisabled(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handlePreset(prompt: string) {
    sendMessage(prompt);
  }

  if (limitReached) {
    return (
      <section id="live-demo" className="py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Познакомься со своим будущим помощником
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Это настоящий AI. 5 сообщений бесплатно — попробуй прямо сейчас.
            </p>
          </div>

          <div className="scroll-reveal rounded-2xl border border-border bg-background shadow-xl overflow-hidden p-8 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Тебе понравилось?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Продолжи общение в Telegram — там я смогу запомнить тебя и помогать каждый день.
              </p>
              <a href={TG_LINK} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 text-base px-8 py-4 h-auto w-full sm:w-auto">
                  Продолжить в Telegram
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </a>
              <p className="text-xs text-muted-foreground mt-4">
                История чата сохранена и станет первым воспоминанием твоего AI
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="live-demo" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Познакомься со своим будущим помощником
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Это настоящий AI. 5 сообщений бесплатно — попробуй прямо сейчас.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Осталось запросов: <span className="font-semibold text-foreground">{MAX_REQUESTS - requestCount}</span>
          </p>
        </div>

        <div className="scroll-reveal rounded-2xl border border-border bg-background shadow-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/50">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
              G
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">GrandHub AI</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block"></span>
                онлайн
              </div>
            </div>
          </div>

          <div ref={chatContainerRef} className="h-72 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-background">
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground text-center px-8">
                Привет! Я GrandHub — твой персональный AI-помощник. Спроси меня что-нибудь или выбери готовый вопрос ниже.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 items-end flex-shrink-0 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {msg.role === "ai" && (
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                    G
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-end flex-shrink-0">
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                  G
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 text-xs text-muted-foreground flex items-center gap-1">
                  GrandHub печатает
                  <span className="flex gap-0.5 ml-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]"></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {!disabled && (
            <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-border bg-muted/20">
              {PRESET_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePreset(prompt)}
                  disabled={disabled}
                  className="text-xs rounded-full border border-border bg-background px-3 py-1 text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 px-4 py-3 border-t border-border"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напиши что-нибудь..."
              disabled={disabled}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={disabled || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Чат сохранён в браузере. Перенеси в Telegram:
            </p>
            <a
              href={TG_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="gap-1.5 whitespace-nowrap">
                Продолжить в Telegram
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

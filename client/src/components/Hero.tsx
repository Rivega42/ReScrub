import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { TypewriterText } from "@/components/TypewriterText";
import { useEffect, useState, useRef } from "react";

const TYPEWRITER_TEXTS = [
  "Финансовый советник",
  "AI-секретарь",
  "Семейный планировщик",
  "Торговый агент",
  "Персональный помощник",
];

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

const DEMO_MESSAGES: ChatMessage[] = [
  { role: "user", text: "Сколько я потратил на еду в январе?" },
  {
    role: "ai",
    text: "В январе расходы на еду составили 18 450₽. Это на 12% больше декабря. Основные траты: Пятёрочка (8 200₽), Лента (5 100₽), доставка (5 150₽).",
  },
  { role: "user", text: "А на транспорт?" },
  {
    role: "ai",
    text: "Транспорт в январе: 4 200₽. Метро 2 800₽, такси 1 400₽. Рекомендую: безлимитный проездной за 2 900₽ сэкономит ~900₽/мес.",
  },
];

function ChatDemo() {
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [step, setStep] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; }, [visibleMessages, showTyping]);

  useEffect(() => {
    if (step >= DEMO_MESSAGES.length) {
      const t = setTimeout(() => {
        setVisibleMessages([]);
        setStep(0);
      }, 4000);
      return () => clearTimeout(t);
    }

    const msg = DEMO_MESSAGES[step];
    if (msg.role === "user") {
      const t = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg]);
        setStep((s) => s + 1);
      }, step === 0 ? 800 : 2500);
      return () => clearTimeout(t);
    } else {
      const t1 = setTimeout(() => {
        setShowTyping(true);
      }, 600);
      const t2 = setTimeout(() => {
        setShowTyping(false);
        setVisibleMessages((prev) => [...prev, msg]);
        setStep((s) => s + 1);
      }, 2200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [step]);

  return (
    <div className="rounded-2xl border border-border bg-background shadow-lg p-4 flex flex-col gap-3 h-[340px] w-full max-w-sm">
      <div className="flex items-center gap-2 border-b border-border pb-2 mb-1">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
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

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto scrollbar-hide" ref={chatContainerRef}>
        {visibleMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 items-end animate-[fadeInUp_0.4s_ease-out] ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {msg.role === "ai" && (
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                G
              </div>
            )}
            <div
              className={`rounded-2xl px-3 py-2 text-xs leading-relaxed max-w-[80%] ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {showTyping && (
          <div className="flex gap-2 items-end animate-[fadeInUp_0.3s_ease-out]">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
              G
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1 items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]"></span>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="py-12 sm:py-20 md:py-28 aurora-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center rounded-full bg-background border border-border px-4 py-1.5 text-sm text-muted-foreground gap-2">
            <span className="font-semibold text-foreground">Ранний доступ</span> — первые 500 бесплатно
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Персональный AI-помощник{" "}
              <span className="text-primary">для жизни</span>
            </h1>

            <div className="mt-4 sm:mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed h-[5.5rem] sm:h-[4rem] flex items-start">
              <p className="w-full">
                <TypewriterText
                  texts={TYPEWRITER_TEXTS}
                  className="font-semibold text-foreground"
                />{" "}
                с памятью, который знает тебя и работает для тебя.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#live-demo">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Попробовать бесплатно
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  <Sparkles className="h-4 w-4" />
                  Как это работает
                </Button>
              </a>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                <span>Без карты</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                <span>Работает в Telegram</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                <span>Сделано для России</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:justify-center w-full">
            <ChatDemo />
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";

interface FAQ {
  q: string;
  a: string | JSX.Element;
}

const FAQS: FAQ[] = [
  {
    q: "Чем GrandHub отличается от ChatGPT?",
    a: (
      <>
        ChatGPT знает всё, но не знает тебя. GrandHub{" "}
        <Link href="/features/rag-memory">
          <span className="text-foreground hover:text-muted-foreground cursor-pointer underline">
            помнит твои привычки, расходы, встречи
          </span>
        </Link>
        . Это не просто чат — это персональный помощник.
      </>
    ),
  },
  {
    q: "Это безопасно?",
    a: "Все данные хранятся на российских серверах. Шифрование end-to-end. Мы не передаём данные третьим лицам.",
  },
  {
    q: "Какие модели AI используются?",
    a: "Claude от Anthropic — одна из лучших моделей в мире. Контекст до 1 миллиона токенов.",
  },
  {
    q: "Можно попробовать бесплатно?",
    a: "Да! Бесплатный тариф — навсегда. 5 запросов в день, базовые навыки.",
  },
  {
    q: "Как подключить AI-секретаря?",
    a: (
      <>
        Напиши{" "}
        <Link href="/features/telegram-bot">
          <span className="text-foreground hover:text-muted-foreground cursor-pointer underline">
            боту
          </span>
        </Link>{" "}
        —{" "}
        <Link href="/features/ai-secretary">
          <span className="text-foreground hover:text-muted-foreground cursor-pointer underline">
            он сам предложит настроить
          </span>
        </Link>
        . Занимает 2 минуты.
      </>
    ),
  },
  {
    q: "Работает с голосовыми?",
    a: (
      <>
        Да,{" "}
        <Link href="/features/voice-audio">
          <span className="text-foreground hover:text-muted-foreground cursor-pointer underline">
            отправляй голосовые
          </span>
        </Link>{" "}
        — AI распознает и ответит текстом или голосом.
      </>
    ),
  },
  {
    q: "А семейный план?",
    a: (
      <>
        <Link href="/features/family-budget">
          <span className="text-foreground hover:text-muted-foreground cursor-pointer underline">
            До 10 человек на одном аккаунте
          </span>
        </Link>
        . Общий бюджет, отдельные помощники.
      </>
    ),
  },
  {
    q: "Когда мобильное приложение?",
    a: "Q4 2026. Пока Telegram-бот работает как приложение — с кнопками и всем функционалом.",
  },
];

function FAQItem({ q, a, open, onToggle }: { q: string; a: string | JSX.Element; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-48 pb-4" : "max-h-0"
        }`}
      >
        <div className="text-sm text-muted-foreground leading-relaxed">{a}</div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Частые вопросы
          </h2>
        </div>

        <div className="scroll-reveal rounded-2xl border border-border bg-background px-6">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

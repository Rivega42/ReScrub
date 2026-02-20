import { Link } from "wouter";
import { Check, X } from "lucide-react";

const ROWS = [
  { feature: "Помнит тебя", href: "/features/rag-memory", grandhub: true, chatgpt: false, alisa: false, gigachat: false },
  { feature: "Работает в Telegram", href: "/features/telegram-bot", grandhub: true, chatgpt: false, alisa: false, gigachat: true },
  { feature: "Оплата в рублях", href: null, grandhub: true, chatgpt: false, alisa: true, gigachat: true },
  { feature: "Навыки и плагины", href: "/features/skills-marketplace", grandhub: "169", chatgpt: "partial", alisa: false, gigachat: false },
  { feature: "Распознаёт чеки", href: "/features/receipts-ai", grandhub: true, chatgpt: false, alisa: false, gigachat: false },
  { feature: "AI-секретарь", href: "/features/ai-secretary", grandhub: true, chatgpt: false, alisa: false, gigachat: false },
  { feature: "Trading Hub", href: "/features/trading-hub", grandhub: true, chatgpt: false, alisa: false, gigachat: false },
  { feature: "Семейный план", href: "/features/family-budget", grandhub: true, chatgpt: false, alisa: true, gigachat: false },
];

const COLS = [
  { key: "grandhub", label: "GrandHub", highlight: true },
  { key: "chatgpt", label: "ChatGPT", highlight: false },
  { key: "alisa", label: "Алиса", highlight: false },
  { key: "gigachat", label: "GigaChat", highlight: false },
];

type RowData = {
  feature: string;
  href: string | null;
  grandhub: boolean | string;
  chatgpt: boolean | string;
  alisa: boolean | string;
  gigachat: boolean | string;
};

function CellValue({ val }: { val: boolean | string }) {
  if (typeof val === "string") {
    if (val === "partial") {
      return <Check className="h-5 w-5 text-green-500/60 mx-auto" />;
    }
    return <span className="text-foreground font-semibold text-sm">{val} навыков</span>;
  }
  if (val === true) {
    return <Check className="h-5 w-5 text-green-500 mx-auto" />;
  }
  return <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />;
}

export default function ComparisonTable() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            GrandHub vs Альтернативы
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
            Сравни и убедись сам
          </p>
        </div>

        <div className="scroll-reveal overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Возможность
                </th>
                {COLS.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-center font-semibold ${
                      col.highlight
                        ? "text-foreground bg-muted/30"
                        : "text-foreground"
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-border last:border-0 ${
                    i % 2 === 0 ? "bg-background" : "bg-muted/20"
                  }`}
                >
                  <td className="px-4 py-3 text-foreground font-medium">
                    {row.href ? (
                      <Link href={row.href}>
                        <span className="text-foreground hover:text-muted-foreground cursor-pointer underline">
                          {row.feature}
                        </span>
                      </Link>
                    ) : (
                      row.feature
                    )}
                  </td>
                  {COLS.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-center ${
                        col.highlight ? "bg-muted/30" : ""
                      }`}
                    >
                      <CellValue val={row[col.key as keyof RowData] as boolean | string} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState, useRef } from "react";
import { Camera, Volume2 } from "lucide-react";

type ChatMessageBase = {
  role: "user" | "ai";
};

type TextMessage = ChatMessageBase & {
  type?: "text";
  text: string;
};

type ImageMessage = ChatMessageBase & {
  type: "image";
  src: string;
  caption?: string;
};

type ListMessage = ChatMessageBase & {
  type: "list";
  title?: string;
  items: string[];
};

type ButtonMessage = ChatMessageBase & {
  type: "buttons";
  text?: string;
  buttons: string[];
};

type TableMessage = ChatMessageBase & {
  type: "table";
  headers: string[];
  rows: string[][];
};

type ChartMessage = ChatMessageBase & {
  type: "chart";
  data: { label: string; value: number }[];
};

type ProgressMessage = ChatMessageBase & {
  type: "progress";
  label: string;
  current: number;
  total: number;
};

type VoiceMessage = ChatMessageBase & {
  type: "voice";
  duration?: string;
};

type ChatMessage =
  | TextMessage
  | ImageMessage
  | ListMessage
  | ButtonMessage
  | TableMessage
  | ChartMessage
  | ProgressMessage
  | VoiceMessage;

interface FeatureDemoChatProps {
  dialogs: ChatMessage[][];
  title?: string;
}

export default function FeatureDemoChat({
  dialogs,
  title = "GrandHub AI",
}: FeatureDemoChatProps) {
  const [currentDialogIndex, setCurrentDialogIndex] = useState(() =>
    Math.floor(Math.random() * dialogs.length)
  );
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [step, setStep] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const messages = dialogs[currentDialogIndex] || [];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [visibleMessages, showTyping]);

  useEffect(() => {
    if (step >= messages.length) {
      const t = setTimeout(() => {
        setVisibleMessages([]);
        setStep(0);
        setCurrentDialogIndex((prev) => (prev + 1) % dialogs.length);
      }, 4000);
      return () => clearTimeout(t);
    }

    const msg = messages[step];
    if (msg.role === "user") {
      const t = setTimeout(
        () => {
          setVisibleMessages((prev) => [...prev, msg]);
          setStep((s) => s + 1);
        },
        step === 0 ? 800 : 2500
      );
      return () => clearTimeout(t);
    } else {
      const t1 = setTimeout(() => {
        setShowTyping(true);
      }, 600);
      const t2 = setTimeout(
        () => {
          setShowTyping(false);
          setVisibleMessages((prev) => [...prev, msg]);
          setStep((s) => s + 1);
        },
        2200
      );
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [step, messages, dialogs.length]);

  const renderMessageContent = (msg: ChatMessage) => {
    if (!msg.type || msg.type === "text") {
      return (
        <div className="text-xs leading-relaxed">
          {(msg as TextMessage).text}
        </div>
      );
    }

    if (msg.type === "image") {
      const imgMsg = msg as ImageMessage;
      return (
        <div className="flex flex-col gap-1">
          <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-center border border-border">
            <Camera className="w-8 h-8 text-muted-foreground" />
          </div>
          {imgMsg.caption && (
            <div className="text-xs text-muted-foreground">{imgMsg.caption}</div>
          )}
        </div>
      );
    }

    if (msg.type === "voice") {
      const voiceMsg = msg as VoiceMessage;
      return (
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 rounded-full p-2">
            <Volume2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 h-1 bg-primary/30 rounded-full">
            <div className="h-full w-1/3 bg-primary rounded-full"></div>
          </div>
          <div className="text-xs text-muted-foreground">
            {voiceMsg.duration || "0:15"}
          </div>
        </div>
      );
    }

    if (msg.type === "list") {
      const listMsg = msg as ListMessage;
      return (
        <div className="flex flex-col gap-1">
          {listMsg.title && (
            <div className="text-xs font-semibold mb-1">{listMsg.title}</div>
          )}
          <ul className="text-xs space-y-1">
            {listMsg.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (msg.type === "buttons") {
      const btnMsg = msg as ButtonMessage;
      return (
        <div className="flex flex-col gap-2">
          {btnMsg.text && <div className="text-xs">{btnMsg.text}</div>}
          <div className="flex flex-wrap gap-1">
            {btnMsg.buttons.map((btn, i) => (
              <button
                key={i}
                className="bg-primary/10 text-primary hover:bg-primary/20 rounded-lg px-3 py-1 text-xs transition-colors"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (msg.type === "table") {
      const tableMsg = msg as TableMessage;
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {tableMsg.headers.map((h, i) => (
                  <th key={i} className="text-left py-1 px-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableMsg.rows.map((row, i) => (
                <tr key={i} className="even:bg-muted/30">
                  {row.map((cell, j) => (
                    <td key={j} className="py-1 px-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (msg.type === "chart") {
      const chartMsg = msg as ChartMessage;
      const maxValue = Math.max(...chartMsg.data.map((d) => d.value));
      return (
        <div className="flex flex-col gap-2">
          {chartMsg.data.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="text-xs w-12 text-right text-muted-foreground">
                {item.label}
              </div>
              <div className="flex-1 bg-muted/30 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs w-12 text-muted-foreground">
                {item.value}%
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (msg.type === "progress") {
      const progMsg = msg as ProgressMessage;
      const percentage = (progMsg.current / progMsg.total) * 100;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs">
            <span>{progMsg.label}</span>
            <span className="text-muted-foreground">
              {progMsg.current.toLocaleString()} / {progMsg.total.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            {percentage.toFixed(1)}%
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="rounded-2xl border border-border bg-background/30 backdrop-blur-sm ring-1 ring-white/10 shadow-lg p-4 flex flex-col gap-3 h-[400px] w-full max-w-md">
      <div className="flex items-center gap-2 border-b border-border pb-2 mb-1">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
          G
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block"></span>
            онлайн
          </div>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 flex-1 overflow-y-auto scrollbar-hide"
        ref={chatContainerRef}
      >
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
              className={`rounded-2xl px-3 py-2 max-w-[80%] ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}
            >
              {renderMessageContent(msg)}
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

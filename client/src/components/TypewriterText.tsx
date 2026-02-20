import { useEffect, useState } from "react";

interface TypewriterTextProps {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
  className?: string;
  cursorClassName?: string;
}

export function TypewriterText({
  texts,
  typeSpeed = 80,
  deleteSpeed = 40,
  pauseMs = 2000,
  className = "",
  cursorClassName = "",
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (texts.length === 0) return;
    const current = texts[textIndex % texts.length];

    if (phase === "typing") {
      if (charIndex < current.length) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, typeSpeed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("deleting"), pauseMs);
        return () => clearTimeout(t);
      }
    }

    if (phase === "deleting") {
      if (charIndex > 0) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        }, deleteSpeed);
        return () => clearTimeout(t);
      } else {
        setTextIndex((i) => (i + 1) % texts.length);
        setPhase("typing");
      }
    }
  }, [texts, textIndex, phase, charIndex, typeSpeed, deleteSpeed, pauseMs]);

  return (
    <span className={className}>
      {displayed}
      <span
        className={`inline-block w-0.5 h-[1em] bg-current align-middle ml-0.5 ${cursorClassName} animate-[blink_1s_step-end_infinite]`}
      />
    </span>
  );
}

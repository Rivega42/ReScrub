import { useRef, MouseEvent, ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function GlowCard({ children, className, style }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--glow-x", `${x}px`);
    el.style.setProperty("--glow-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--glow-x", "-9999px");
    el.style.setProperty("--glow-y", "-9999px");
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "glow-card-wrapper relative rounded-xl bg-muted/30 border",
        className
      )}
      style={
        {
          "--glow-x": "-9999px",
          "--glow-y": "-9999px",
          ...style,
        } as CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow overlay */}
      <div className="glow-card-overlay pointer-events-none absolute inset-0 rounded-[inherit] z-10" />
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export default function FinalCTA() {
  return (
    <section className="py-20 sm:py-32 aurora-bg">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="scroll-reveal flex flex-col items-center gap-6">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">Начни сейчас</h2>
          <p className="text-xl text-muted-foreground max-w-lg">Первая 1000 — Ранняя пасочка тариф навсегда</p>
          <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm px-8 py-4 flex flex-col items-center gap-1">
            <p className="text-sm text-muted-foreground">Осталось мест</p>
            <p className="text-4xl font-bold text-foreground"><AnimatedCounter value={1000} suffix=" мест" /></p>
          </div>
          <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2 text-base px-8 py-6 h-auto">
              Попробовать бесплатно <ArrowRight className="h-5 w-5" />
            </Button>
          </a>
          <p className="text-sm text-muted-foreground">Без карты. Без обязательств. 30 секунд на старт.</p>
        </div>
      </div>
    </section>
  );
}

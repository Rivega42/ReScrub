import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Cal.com style simple badge */}
          <div className="mb-8 inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            <Shield className="mr-2 h-4 w-4" />
            Соответствует 152-ФЗ
          </div>
          
          {/* Dramatic headline in incogni.com style */}
          <h1 className="text-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Если ваши данные нельзя найти, вам нельзя навредить
          </h1>
          
          {/* Problem-focused subtitle */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            ResCrub автоматически удаляет ваши персональные данные из интернета, 
            предотвращая мошенничество, кражу личности и нарушение приватности.
          </p>
          
          {/* Cal.com style minimal CTA */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/reports">
              <Button 
                size="lg" 
                data-testid="button-hero-get-started"
              >
                Начать защиту
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/#pricing">
              <Button 
                variant="ghost" 
                size="lg" 
                data-testid="button-hero-pricing"
              >
                Смотреть тарифы
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>30-дневная гарантия возврата средств</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>SSL защищено</span>
            </div>
          </div>

          {/* Partnership logos/trust indicators */}
          <div className="mt-12">
            <p className="text-sm text-muted-foreground mb-6">Рекомендуют эксперты по кибербезопасности</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-sm font-medium text-muted-foreground">InfoSec.ru</div>
              <div className="text-sm font-medium text-muted-foreground">CyberSecurity</div>
              <div className="text-sm font-medium text-muted-foreground">Privacy.ru</div>
              <div className="text-sm font-medium text-muted-foreground">Data Protection</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
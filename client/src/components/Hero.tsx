import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="py-12 sm:py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Cal.com style simple badge */}
          <div className="mb-6 sm:mb-8 inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            <Shield className="mr-2 h-4 w-4" />
            Соответствует 152ФЗ
          </div>
          
          {/* Mobile-optimized headline */}
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground">
            Защита ваших персональных данных по 152ФЗ
          </h1>
          
          {/* Mobile-optimized subtitle */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground">
            ResCrub автоматически удаляет ваши персональные данные из интернета и помогает управлять личной информацией в соответствии с требованиями 152ФЗ.
          </p>
          
          {/* Mobile-friendly CTA buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link href="/login" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto touch-target"
                data-testid="button-hero-get-started"
              >
                Начать защиту
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/#pricing" className="w-full sm:w-auto">
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full sm:w-auto touch-target"
                data-testid="button-hero-pricing"
              >
                Смотреть тарифы
              </Button>
            </Link>
          </div>
          
          {/* Mobile-responsive trust indicators */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-center">30-дневная гарантия возврата средств</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span>SSL защищено</span>
            </div>
          </div>

          {/* Mobile-adapted partnership logos */}
          <div className="mt-8 sm:mt-12">
            <p className="text-sm text-muted-foreground mb-4 sm:mb-6">Рекомендуют эксперты по кибербезопасности</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 opacity-60">
              <div className="text-xs sm:text-sm font-medium text-muted-foreground">InfoSec.ru</div>
              <div className="text-xs sm:text-sm font-medium text-muted-foreground">CyberSecurity</div>
              <div className="text-xs sm:text-sm font-medium text-muted-foreground">Privacy.ru</div>
              <div className="text-xs sm:text-sm font-medium text-muted-foreground">Data Protection</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
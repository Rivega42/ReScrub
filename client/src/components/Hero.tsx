import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Cal.com style simple badge */}
          <div className="mb-8 inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            Соответствует 152-ФЗ
          </div>
          
          {/* Cal.com style clean headline */}
          <h1 className="text-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Защитите ваши персональные данные
          </h1>
          
          {/* Simple subtitle */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            ReScrub автоматически находит и удаляет вашу личную информацию с сайтов брокеров данных в соответствии с российским законодательством.
          </p>
          
          {/* Cal.com style minimal CTA */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/reports">
              <Button 
                size="lg" 
                data-testid="button-hero-get-started"
                className="h-11 px-8"
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
                className="h-11 px-8"
              >
                Смотреть тарифы
              </Button>
            </Link>
          </div>
          
          {/* Simple trust indicator - Cal.com style */}
          <p className="mt-8 text-sm leading-6 text-muted-foreground">
            Бесплатный пробный период 30 дней
          </p>
        </div>
      </div>
    </section>
  );
}
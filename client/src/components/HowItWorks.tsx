import { Search, Send, RotateCcw, TrendingUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Mobile optimized */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Защита данных не должна быть сложной
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground">
            Мы обеспечиваем это с помощью автоматического удаления данных
          </p>
        </div>

        {/* Mobile-optimized process steps */}
        <div className="mx-auto mt-12 sm:mt-16 max-w-4xl">
          <div className="space-y-8 sm:space-y-12">
            
            {/* Step 1 - Mobile-first design */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8" data-testid="step-1">
              <div className="md:w-1/2">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary flex-shrink-0">
                    <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">1. Начинаем со сканирования</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">~ 14 дней до решения</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Мы сканируем сайты поиска людей на предмет вашей персональной информации 
                  и отправляем запросы на удаление при обнаружении записей.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Search className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-2 sm:mb-4" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Сканирование брокеров данных</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse md:items-center gap-6 md:gap-8" data-testid="step-2">
              <div className="lg:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <Send className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">2. Отправляются первые запросы на удаление</h3>
                </div>
                <p className="text-muted-foreground">
                  Мы отправляем автоматические запросы на удаление всем охваченным брокерам данных 
                  в соответствии с требованиями 152-ФЗ, чтобы гарантировать, 
                  что ни одна из ваших записей не останется в их базах данных.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Send className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Автоматические запросы</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8" data-testid="step-3">
              <div className="lg:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <RotateCcw className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">3. Запросы отправляются регулярно</h3>
                    <p className="text-sm text-muted-foreground">10 дней до следующего запроса</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Мы регулярно пересканируем и отправляем новые волны запросов на удаление, 
                  чтобы брокеры данных и сайты поиска людей не имели возможности собирать 
                  и начинать продавать больше вашей персональной информации.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <RotateCcw className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Циклические запросы</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col lg:flex-row-reverse lg:items-center gap-8" data-testid="step-4">
              <div className="lg:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <TrendingUp className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">4. Мы не останавливаемся на достигнутом</h3>
                </div>
                <p className="text-muted-foreground">
                  Мы постоянно отслеживаем и добавляем новых брокеров данных и сайты поиска людей 
                  в наш список, поэтому ваш уровень защиты продолжает улучшаться с течением времени.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Расширение покрытия</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-8" data-testid="step-5">
              <div className="lg:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <FileText className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">5. Отчеты о прогрессе держат вас в курсе</h3>
                </div>
                <p className="text-muted-foreground">
                  Вы будете получать регулярные отчеты о конфиденциальности, чтобы быть в курсе событий — 
                  в конце концов, наша цель — дать вам полный контроль над вашими персональными данными.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Отчеты о прогрессе</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Готовы начать автоматическую защиту?
          </h3>
          <p className="text-muted-foreground mb-8">
            Позвольте нам взять на себя всю работу по защите ваших данных
          </p>
          <Link href="#pricing">
            <Button data-testid="button-how-it-works-get-started">
              Начать защиту данных
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
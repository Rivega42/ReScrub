import { User, Search, Shield, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function SignupProcess() {
  return (
    <section id="signup-process" className="py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Mobile optimized */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-6 sm:mb-8" data-testid="badge-152-fz">
            <Shield className="mr-2 h-4 w-4" />
            Соответствует 152-ФЗ
          </Badge>
          <h2 className="text-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Начните защиту за 3 простых шага
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground">
            Процесс регистрации займёт всего 5 минут, а первые результаты вы увидите уже через 24 часа
          </p>
        </div>

        {/* Mobile-responsive 3-step process grid */}
        <div className="mx-auto mt-12 sm:mt-16 max-w-5xl">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            
            {/* Step 1: Registration and Data Input */}
            <Card className="relative hover-elevate" data-testid="step-1">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <User className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    1
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Регистрация и указание данных
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">~ 5 минут</span>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Создайте аккаунт и укажите персональные данные для поиска: ФИО, адрес, номер телефона. 
                  Мы используем эти данные только для поиска ваших записей у брокеров данных.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Email и пароль</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>ФИО и адрес проживания</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Согласие на обработку (152-ФЗ)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Automatic Scanning */}
            <Card className="relative hover-elevate" data-testid="step-2">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <Search className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    2
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Автоматическое сканирование
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">~ 24 часа</span>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Наши алгоритмы автоматически сканируют более 100 российских и международных 
                  сайтов поиска людей, баз данных и брокеров персональных данных на предмет ваших записей.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Поиск по 100+ российским сайтам</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Международные брокеры данных</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Отчёт об обнаруженных записях</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Data Removal Begins */}
            <Card className="relative hover-elevate" data-testid="step-3">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <Shield className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    3
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Начало удаления данных
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">7-14 дней до результата</span>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Мы автоматически отправляем официальные запросы на удаление в соответствии с требованиями 
                  152-ФЗ и международного законодательства. Первые результаты поступают в течение недели.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Официальные запросы по 152-ФЗ</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Еженедельные отчёты о прогрессе</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Гарантия возврата средств</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">Регистрация</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">Сканирование</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">Защита</span>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Готовы защитить свои персональные данные?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Присоединитесь к тысячам россиян, которые уже защищают свою цифровую приватность
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" data-testid="button-signup-process-start" asChild>
              <Link href="/reports">
                Начать защиту сейчас
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" data-testid="button-signup-process-pricing" asChild>
              <Link href="#pricing">
                Посмотреть тарифы
              </Link>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>30-дневная гарантия</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>Соответствует 152-ФЗ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>SSL защищено</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
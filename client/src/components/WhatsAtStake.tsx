import { Phone, Shield, CreditCard, Eye, Mail, AlertTriangle, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function WhatsAtStake() {
  return (
    <section className="py-24 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Вот что поставлено на карту
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Ваши персональные данные в открытом доступе создают серьезные риски для вашей безопасности, 
            финансового благополучия и приватности.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:gap-12">
          {/* Повседневные неудобства */}
          <div className="relative overflow-hidden rounded-lg bg-background border border-border p-8 shadow-sm" data-testid="card-risk-daily">
            <div className="flex items-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="ml-4 text-xl font-semibold text-foreground" data-testid="text-risk-daily-title">Повседневные неудобства</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Маркетологи покупают ваши персональные профили у брокеров данных и извлекают контактную 
              информацию с сайтов поиска людей. Это создает постоянные помехи и повышенный стресс.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Спам звонки и электронные письма</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Нежелательная почтовая рассылка</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Спам сообщения и робозвонки</span>
              </div>
            </div>
          </div>

          {/* Угроза киберпреступников */}
          <div className="relative overflow-hidden rounded-lg bg-background border border-border p-8 shadow-sm" data-testid="card-risk-cyber">
            <div className="flex items-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="ml-4 text-xl font-semibold text-foreground" data-testid="text-risk-cyber-title">Угроза киберпреступников</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Киберпреступникам нужна ваша персональная информация для более точных и персонализированных атак. 
              Брокеры данных и сайты поиска людей — идеальный источник для получения этой информации.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Мошенничество и фишинг</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Кража личности</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Хакерские атаки</span>
              </div>
            </div>
          </div>

          {/* Финансовые трудности */}
          <div className="relative overflow-hidden rounded-lg bg-background border border-border p-8 shadow-sm" data-testid="card-risk-financial">
            <div className="flex items-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <CreditCard className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="ml-4 text-xl font-semibold text-foreground" data-testid="text-risk-financial-title">Финансовые трудности</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Финансовые брокеры данных продают информацию о ваших поисковых запросах, связанных со здоровьем, 
              кредитной истории и биографии страховым компаниям, банкам и работодателям.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Повышение страховых тарифов</span>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Отказы в кредитах</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Потеря возможностей трудоустройства</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Сложности с получением жилья</span>
              </div>
            </div>
          </div>

          {/* Компрометация приватности и безопасности */}
          <div className="relative overflow-hidden rounded-lg bg-background border border-border p-8 shadow-sm" data-testid="card-risk-privacy">
            <div className="flex items-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="ml-4 text-xl font-semibold text-foreground" data-testid="text-risk-privacy-title">Компрометация приватности</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Сайты поиска людей предоставляют незнакомцам доступ к вам — виртуально и физически. 
              Они раскрывают ваш адрес, работу, контакты, семью, убеждения и многое другое.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Сталкинг и преследование</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Доксинг и публичное раскрытие данных</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Дискриминация</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Физический вред и шантаж</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Не позволяйте вашим данным подвергать вас риску
          </h3>
          <p className="text-muted-foreground mb-8">
            ResCrub автоматически защищает вас от всех этих угроз, удаляя ваши данные с сайтов брокеров.
          </p>
          <Link href="#pricing">
            <Button data-testid="button-whats-at-stake-get-started">
              Начать защиту данных
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
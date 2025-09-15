import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "wouter";

export default function PricingSection() {
  // Функция для форматирования российских цен
  const formatRussianPrice = (price: string) => {
    return price.replace(',', ' ') + '₽';
  };

  const plans = [
    {
      name: 'Базовый',
      price: '1,790',
      period: 'месяц',
      description: 'Для частных лиц',
      features: [
        'Мониторинг 150+ брокеров данных',
        'Автоматическое удаление данных',
        'Соответствие 152-ФЗ "О персональных данных"',
        'Ежемесячные отчеты о прогрессе',
        'Email поддержка (2 рабочих дня)'
      ],
      popular: false,
      buttonText: 'Начать защиту'
    },
    {
      name: 'Семейный',
      price: '2,990',
      period: 'месяц',
      description: 'Для семьи до 5 человек',
      features: [
        'Все функции Базового плана',
        'Защита до 5 членов семьи',
        'Объединенный семейный дашборд',
        'Родительский контроль данных детей',
        'Приоритетная поддержка (1 рабочий день)'
      ],
      popular: true,
      buttonText: 'Защитить семью'
    },
    {
      name: 'Профессиональный',
      price: '4,990',
      period: 'месяц',
      description: 'Максимальная защита',
      features: [
        'Все функции Семейного плана',
        'Мониторинг 300+ источников данных',
        'Ручное удаление сложных случаев',
        'API доступ для интеграции',
        'Персональный менеджер',
        'SLA поддержка 24/7 (4 часа ответ)'
      ],
      popular: false,
      buttonText: 'Максимальная защита'
    }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Cal.com style */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Прозрачное ценообразование
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Выберите тариф для автоматической защиты ваших персональных данных в интернете
          </p>
        </div>

        {/* Pricing grid - Cal.com style minimal */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border border-border p-8 ${
                plan.popular ? 'border-foreground bg-muted/50' : ''
              }`}
              data-testid={`plan-${plan.name.toLowerCase()}`}
            >
              {plan.popular && (
                <div className="mb-4">
                  <span 
                    className="inline-flex items-center rounded-full bg-foreground px-3 py-1 text-sm font-medium text-background"
                    data-testid="badge-popular"
                  >
                    Популярный
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold leading-8 text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span 
                    className="text-4xl font-bold tracking-tight text-foreground"
                    data-testid={`text-price-${plan.name.toLowerCase()}`}
                  >
                    {formatRussianPrice(plan.price)}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">
                    /{plan.period}
                  </span>
                </p>
              </div>
              
              <ul className="mb-8 space-y-3 text-sm leading-6 text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-5 w-5 flex-none text-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                asChild
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                data-testid={`button-${plan.name.toLowerCase()}`}
              >
                <Link href="/reports">
                  {plan.buttonText}
                </Link>
              </Button>
            </div>
          ))}
        </div>
        
        {/* Simple footer note */}
        <div className="mt-16 text-center">
          <p className="text-sm leading-6 text-muted-foreground">
            Все цены в рублях с НДС. 30-дневная гарантия возврата средств. Отмена в любое время.
          </p>
        </div>
      </div>
    </section>
  );
}
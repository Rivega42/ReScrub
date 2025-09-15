import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "wouter";

export default function PricingSection() {
  const plans = [
    {
      name: 'Стандарт',
      price: '1,990',
      period: 'месяц',
      description: 'Для частных лиц',
      features: [
        'Мониторинг 200+ сайтов',
        'Автоматическое удаление',
        'Месячные отчеты',
        'Email поддержка'
      ],
      popular: false,
      buttonText: 'Начать'
    },
    {
      name: 'Семья',
      price: '3,490',
      period: 'месяц',
      description: 'Для семьи до 5 человек',
      features: [
        'Все из тарифа Стандарт',
        'До 5 членов семьи',
        'Семейный дашборд',
        'Родительский контроль'
      ],
      popular: true,
      buttonText: 'Выбрать план'
    },
    {
      name: 'Профессионал',
      price: '5,990',
      period: 'месяц',
      description: 'Максимальная защита',
      features: [
        'Все из тарифа Семья',
        'Мониторинг 500+ сайтов',
        'Приоритетная поддержка',
        'API доступ'
      ],
      popular: false,
      buttonText: 'Начать'
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
            Выберите подходящий тариф для защиты ваших данных
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
                  <span className="inline-flex items-center rounded-full bg-foreground px-3 py-1 text-sm font-medium text-background">
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
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">
                    ₽/{plan.period}
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
              
              <Link href="/reports">
                <Button 
                  className={`w-full ${
                    plan.popular ? '' : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  data-testid={`button-${plan.name.toLowerCase()}`}
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Simple footer note */}
        <div className="mt-16 text-center">
          <p className="text-sm leading-6 text-muted-foreground">
            Все цены в рублях с НДС. Отмена в любое время.
          </p>
        </div>
      </div>
    </section>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { Link } from "wouter";

export default function PricingSection() {
  const plans = [
    {
      name: 'Стандарт',
      price: '1,990',
      originalPrice: '3,980',
      period: 'месяц',
      yearlyPrice: '19,900',
      yearlyOriginal: '47,760',
      description: 'Основная защита для частных лиц',
      features: [
        'Мониторинг 200+ сайтов брокеров',
        'Автоматическое удаление',
        'Месячные отчеты',
        'Поддержка email'
      ],
      popular: false,
      buttonText: 'Начать защиту',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Семья',
      price: '3,490',
      originalPrice: '6,980',
      period: 'месяц',
      yearlyPrice: '34,900',
      yearlyOriginal: '83,760',
      description: 'Защита для всей семьи',
      features: [
        'Все возможности Стандарт',
        'До 5 членов семьи',
        'Родительский контроль',
        'Общий дашборд семьи'
      ],
      popular: true,
      buttonText: 'Начать семейную защиту',
      buttonVariant: 'default' as const
    },
    {
      name: 'Профессионал',
      price: '5,990',
      originalPrice: '11,980',
      period: 'месяц',
      yearlyPrice: '59,900',
      yearlyOriginal: '143,760',
      description: 'Максимальная защита и контроль',
      features: [
        'Все возможности Семья',
        'Мониторинг 500+ сайтов',
        'Приоритетная поддержка',
        'API для интеграции'
      ],
      popular: false,
      buttonText: 'Получить максимум',
      buttonVariant: 'outline' as const
    }
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Прозрачное ценообразование
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Выберите тариф для надежной защиты ваших персональных данных
          </p>
          
          {/* Savings badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-chart-2/10 rounded-full">
            <Star className="h-4 w-4 text-chart-2" />
            <span className="text-sm font-medium text-chart-2">
              Экономьте 50% при годовой оплате
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-300 hover-elevate ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
              data-testid={`card-plan-${plan.name.toLowerCase()}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                  Популярный выбор
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </CardTitle>
                <p className="text-muted-foreground mb-6">
                  {plan.description}
                </p>
                
                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {plan.originalPrice} ₽
                    </span>
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">/ {plan.period}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Или {plan.yearlyPrice} ₽/год (экономия {parseInt(plan.yearlyOriginal) - parseInt(plan.yearlyPrice)} ₽)
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="px-6 pb-6">
                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-chart-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <Link href="/signup">
                  <Button 
                    variant={plan.buttonVariant} 
                    className="w-full"
                    data-testid={`button-plan-${plan.name.toLowerCase()}`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
                
                {/* Additional info */}
                <p className="text-xs text-muted-foreground text-center mt-4">
                  30 дней гарантии возврата
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Additional information */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Все цены указаны в рублях с учетом НДС. Оплата через Robokassa.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>• Отмена в любое время</span>
            <span>• Без скрытых комиссий</span>
            <span>• SSL шифрование</span>
          </div>
        </div>
      </div>
    </section>
  );
}
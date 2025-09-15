import { Search, FileText, Trash2, Shield } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      icon: Search,
      title: 'Сканирование',
      description: 'Автоматически сканируем брокеров данных на предмет наличия вашей информации'
    },
    {
      step: 2,
      icon: FileText,
      title: 'Отправка запросов',
      description: 'Отправляем запросы на удаление данных согласно 152-ФЗ'
    },
    {
      step: 3,
      icon: Trash2,
      title: 'Удаление данных',
      description: 'Контролируем процесс удаления и получаем подтверждения'
    },
    {
      step: 4,
      icon: Shield,
      title: 'Мониторинг',
      description: 'Постоянно отслеживаем появление новых данных и удаляем их'
    }
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Cal.com style */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Как это работает
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Простой процесс защиты ваших персональных данных
          </p>
        </div>

        {/* Steps - minimal Cal.com style */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.step} className="flex flex-col" data-testid={`step-${step.step}`}>
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                    <div className="h-5 w-5 flex-none">
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                    </div>
                    {step.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">{step.description}</p>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
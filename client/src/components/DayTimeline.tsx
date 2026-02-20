import { useState } from 'react';
import { Sun, Mail, UtensilsCrossed, Phone, TrendingUp, FileText, Moon, ChevronDown, ChevronUp } from 'lucide-react';

interface TimelineEvent {
  time: string;
  icon: any;
  title: string;
  description: string;
  details?: string;
}

const events: TimelineEvent[] = [
  {
    time: '07:00',
    icon: Sun,
    title: 'Утренняя сводка',
    description: 'Погода, календарь, задачи на день',
    details: 'Температура +15°C, облачно. 3 встречи сегодня: 10:00 созвон с клиентом, 14:00 обед с партнёром, 18:00 тренировка. Задачи: подготовить отчёт, купить продукты.',
  },
  {
    time: '09:30',
    icon: Mail,
    title: 'Автоимпорт чека',
    description: 'Чек из email автоматически добавлен в бюджет',
    details: 'Магазин "Пятёрочка", сумма 1 240₽. Категория: продукты. Остаток бюджета на месяц: 28 760₽.',
  },
  {
    time: '12:00',
    icon: UtensilsCrossed,
    title: 'Напоминание об обеде',
    description: 'Ресторан забронирован, бюджет учтён',
    details: 'Ресторан "IL Патио", столик на 2 персоны. Примерная стоимость: 3 500₽. Резерв в бюджете: развлечения.',
  },
  {
    time: '14:00',
    icon: Phone,
    title: 'AI-секретарь принял заявку',
    description: 'Заявка от клиента обработана и добавлена в CRM',
    details: 'Клиент: ООО "Альфа". Тип: консультация. Приоритет: средний. Назначена встреча на 21 февраля в 15:00.',
  },
  {
    time: '16:30',
    icon: TrendingUp,
    title: 'Новая ставка на аукционе',
    description: 'Уведомление о перебитой ставке на Wildberries',
    details: 'Товар: "Смартфон Samsung Galaxy S23". Ваша ставка: 45 000₽. Новая ставка конкурента: 45 500₽. Рекомендация: повысить до 46 000₽.',
  },
  {
    time: '19:00',
    icon: FileText,
    title: 'Отчёт за день',
    description: 'Расходы, доходы, советы по оптимизации',
    details: 'Расходы: 4 740₽ (продукты, обед). Доходы: 12 000₽ (оплата от клиента). Баланс дня: +7 260₽. Совет: сэкономьте 15% на продуктах, используя скидки.',
  },
  {
    time: '22:00',
    icon: Moon,
    title: 'Итоги дня',
    description: 'Экономия 3 200₽ благодаря GrandHub',
    details: 'Автоматический учёт чеков: 1 240₽. Напоминание об обеде: сэкономлено время. Оптимизация торговли: 1 960₽. Общая экономия времени: 2 часа.',
  },
];

export default function DayTimeline() {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  return (
    <div className="w-full py-20 bg-muted/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground text-center mb-4">
          Типичный день с GrandHub
        </h2>
        <p className="text-center text-muted-foreground mb-16">
          Автоматизация от рассвета до заката
        </p>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-8">
            {events.map((event, index) => {
              const Icon = event.icon;
              const isExpanded = expandedEvent === index;

              return (
                <div
                  key={index}
                  className="relative scroll-reveal"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 top-4 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />

                  {/* Event Card */}
                  <div className="ml-20">
                    <button
                      onClick={() => setExpandedEvent(isExpanded ? null : index)}
                      className="w-full text-left group"
                    >
                      <div className="p-6 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors duration-200 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-sm font-mono text-muted-foreground">{event.time}</span>
                              <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                            </div>
                            <p className="text-muted-foreground">{event.description}</p>
                            
                            {isExpanded && event.details && (
                              <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border text-sm text-foreground animate-in slide-in-from-top-2 duration-300">
                                {event.details}
                              </div>
                            )}
                          </div>

                          {event.details && (
                            <div className="shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

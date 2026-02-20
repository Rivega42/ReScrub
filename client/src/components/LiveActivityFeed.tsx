import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const NAMES = [
  'Алексей', 'Марина', 'Дмитрий', 'Анна', 'Сергей', 'Елена', 'Андрей', 'Ольга',
  'Михаил', 'Татьяна', 'Владимир', 'Наталья', 'Игорь', 'Светлана', 'Александр',
  'Екатерина', 'Павел', 'Ирина', 'Максим', 'Юлия', 'Антон', 'Мария'
];

const CITIES = [
  'Москвы', 'Санкт-Петербурга', 'Казани', 'Новосибирска', 'Екатеринбурга',
  'Нижнего Новгорода', 'Самары', 'Омска', 'Челябинска', 'Ростова-на-Дону',
  'Уфы', 'Красноярска', 'Воронежа', 'Перми', 'Волгограда'
];

const ACTIONS = [
  { text: 'установил Фитнес-трекер', icon: '💪' },
  { text: 'создала тендер на ремонт кухни', icon: '🏠' },
  { text: 'сэкономил {amount}₽ на подписках', icon: '💰' },
  { text: 'записалась к стоматологу через AI-секретаря', icon: '🦷' },
  { text: 'продал iPhone за {amount}₽', icon: '📱' },
  { text: 'подключил навык Чеки AI', icon: '🧾' },
  { text: 'создала семейный бюджет', icon: '👨‍👩‍👧' },
  { text: 'нашёл авиабилеты на {amount}₽ дешевле', icon: '✈️' },
  { text: 'установила напоминания о лекарствах', icon: '💊' },
  { text: 'подключил Trading Hub', icon: '📈' },
  { text: 'продала ноутбук через маркетплейс', icon: '💻' },
  { text: 'нашла репетитора для ребёнка', icon: '📚' },
  { text: 'оплатил счета через AI-помощника', icon: '🧾' },
  { text: 'создал задачу на доставку цветов', icon: '💐' },
  { text: 'подключила контроль сна', icon: '😴' },
  { text: 'сэкономил {amount}₽ на продуктах', icon: '🛒' },
  { text: 'записался на массаж через бота', icon: '💆' },
  { text: 'создала план тренировок', icon: '🏋️' },
  { text: 'нашёл самую дешёвую АЗС рядом', icon: '⛽' },
  { text: 'подключил умное управление освещением', icon: '💡' }
];

const COLORS = [
  'bg-amber-500/80', 'bg-blue-500/80', 'bg-green-500/80', 'bg-purple-500/80',
  'bg-pink-500/80', 'bg-teal-500/80', 'bg-orange-500/80', 'bg-cyan-500/80'
];

interface Activity {
  id: number;
  name: string;
  city: string;
  action: string;
  timestamp: string;
  color: string;
  initials: string;
}

function generateActivity(id: number): Activity {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const actionTemplate = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  
  let action = actionTemplate.text;
  if (action.includes('{amount}')) {
    const amounts = [1200, 2500, 3400, 4200, 5600, 8900, 12000, 15500, 28000, 45000, 56000, 67000];
    const amount = amounts[Math.floor(Math.random() * amounts.length)].toLocaleString('ru-RU');
    action = action.replace('{amount}', amount);
  }
  
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const initials = name.slice(0, 1);
  
  const now = Date.now();
  const elapsed = Math.floor(Math.random() * 120); // 0-120 секунд
  
  let timestamp = 'только что';
  if (elapsed >= 60) {
    const mins = Math.floor(elapsed / 60);
    timestamp = `${mins} мин назад`;
  } else if (elapsed >= 10) {
    timestamp = `${elapsed} сек назад`;
  }
  
  return { id, name, city, action, timestamp, color, initials };
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([
    generateActivity(1),
    generateActivity(2),
    generateActivity(3),
    generateActivity(4)
  ]);
  const [nextId, setNextId] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      const delay = 3000 + Math.random() * 2000; // 3-5 секунд
      
      setTimeout(() => {
        const newActivity = generateActivity(nextId);
        setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
        setNextId(prev => prev + 1);
      }, 0);
    }, 3500);

    return () => clearInterval(interval);
  }, [nextId]);

  return (
    <section className="py-16 border-t border-border/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Активность пользователей</h2>
          <p className="text-muted-foreground">В реальном времени</p>
        </div>

        <Card className="bg-muted/30 border-border/50 p-6">
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/50 animate-in fade-in slide-in-from-top-2 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center text-white font-semibold text-sm shrink-0`}>
                  {activity.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{activity.name}</span> из {activity.city} {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

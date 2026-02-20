import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
}

const ALL_SKILLS: Skill[] = [
  // Финансы
  { id: '1', name: 'Чеки AI', category: 'Финансы' },
  { id: '2', name: 'Бюджет', category: 'Финансы' },
  { id: '3', name: 'Подписки', category: 'Финансы' },
  { id: '4', name: 'Инвестиции', category: 'Финансы' },
  { id: '5', name: 'Криптовалюта', category: 'Финансы' },
  { id: '6', name: 'Налоги', category: 'Финансы' },
  
  // Здоровье
  { id: '7', name: 'Фитнес', category: 'Здоровье' },
  { id: '8', name: 'Питание', category: 'Здоровье' },
  { id: '9', name: 'Сон', category: 'Здоровье' },
  { id: '10', name: 'Медикаменты', category: 'Здоровье' },
  { id: '11', name: 'Медитация', category: 'Здоровье' },
  
  // Продуктивность
  { id: '12', name: 'Календарь', category: 'Продуктивность' },
  { id: '13', name: 'Заметки', category: 'Продуктивность' },
  { id: '14', name: 'Задачи', category: 'Продуктивность' },
  { id: '15', name: 'Привычки', category: 'Продуктивность' },
  { id: '16', name: 'Таймер', category: 'Продуктивность' },
  { id: '17', name: 'Email', category: 'Продуктивность' },
  
  // Торговля
  { id: '18', name: 'Маркетплейс', category: 'Торговля' },
  { id: '19', name: 'Аукционы', category: 'Торговля' },
  { id: '20', name: 'Тендеры', category: 'Торговля' },
  { id: '21', name: 'Поиск цен', category: 'Торговля' },
  { id: '22', name: 'Trading Hub', category: 'Торговля' },
  
  // Семья
  { id: '23', name: 'Семейный бюджет', category: 'Семья' },
  { id: '24', name: 'Дети', category: 'Семья' },
  { id: '25', name: 'Питомцы', category: 'Семья' },
  { id: '26', name: 'Покупки', category: 'Семья' },
  { id: '27', name: 'События', category: 'Семья' },
  
  // Развлечения
  { id: '28', name: 'Кино', category: 'Развлечения' },
  { id: '29', name: 'Музыка', category: 'Развлечения' },
  { id: '30', name: 'Книги', category: 'Развлечения' },
  { id: '31', name: 'Путешествия', category: 'Развлечения' },
  { id: '32', name: 'Рестораны', category: 'Развлечения' },
];

interface Preset {
  name: string;
  icon: string;
  skills: string[];
}

const PRESETS: Preset[] = [
  {
    name: 'Для фрилансера',
    icon: '💼',
    skills: ['1', '2', '12', '13', '14', '17', '18', '21']
  },
  {
    name: 'Для мамы',
    icon: '👩‍👧',
    skills: ['2', '7', '8', '23', '24', '25', '26', '27']
  },
  {
    name: 'Для бизнеса',
    icon: '📊',
    skills: ['1', '2', '4', '5', '12', '14', '17', '18', '19', '20', '22']
  }
];

function calculateTier(skillCount: number): { name: string; price: string; color: string } {
  if (skillCount === 0) return { name: 'Free', price: 'Бесплатно', color: 'bg-muted' };
  if (skillCount <= 5) return { name: 'Free', price: 'Бесплатно', color: 'bg-green-500/10 text-green-600 border-green-500/30' };
  if (skillCount <= 15) return { name: 'Старт', price: '990₽/мес', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' };
  if (skillCount <= 30) return { name: 'Про', price: '2 490₽/мес', color: 'bg-purple-500/10 text-purple-600 border-purple-500/30' };
  return { name: 'Бизнес', price: '7 990₽/мес', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' };
}

export default function AssistantConfigurator() {
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());

  const toggleSkill = (skillId: string) => {
    const newSelected = new Set(selectedSkills);
    if (newSelected.has(skillId)) {
      newSelected.delete(skillId);
    } else {
      newSelected.add(skillId);
    }
    setSelectedSkills(newSelected);
  };

  const applyPreset = (preset: Preset) => {
    setSelectedSkills(new Set(preset.skills));
  };

  const tier = calculateTier(selectedSkills.size);
  const selectedSkillsList = ALL_SKILLS.filter(skill => selectedSkills.has(skill.id));

  const categories = Array.from(new Set(ALL_SKILLS.map(s => s.category)));

  return (
    <section className="py-16 border-t border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Собери своего помощника</h2>
          <p className="text-muted-foreground">Выбери навыки — мы рассчитаем тариф</p>
        </div>

        {/* Пресеты */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {PRESETS.map(preset => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset)}
              className="gap-2 border-border hover:bg-muted"
            >
              <span>{preset.icon}</span>
              {preset.name}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Сетка навыков */}
          <div className="lg:col-span-2 space-y-6">
            {categories.map(category => {
              const categorySkills = ALL_SKILLS.filter(s => s.category === category);
              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{category}</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {categorySkills.map(skill => {
                      const isSelected = selectedSkills.has(skill.id);
                      return (
                        <button
                          key={skill.id}
                          onClick={() => toggleSkill(skill.id)}
                          className={`
                            relative p-4 rounded-lg border-2 text-left transition-all
                            ${isSelected 
                              ? 'border-primary bg-primary/5 scale-105 shadow-md' 
                              : 'border-border/50 bg-background hover:border-primary/50 hover:bg-muted/50'
                            }
                          `}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-medium text-foreground text-sm">{skill.name}</span>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 animate-in zoom-in duration-200">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Корзина и расчёт */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-border bg-background">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Ваш помощник
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Выбранные навыки */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Выбрано навыков: <span className="font-semibold text-foreground">{selectedSkills.size}</span>
                  </p>
                  
                  {selectedSkillsList.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto space-y-1 mb-4 pr-2">
                      {selectedSkillsList.map(skill => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm animate-in fade-in slide-in-from-right duration-200"
                        >
                          <span className="text-foreground">{skill.name}</span>
                          <button
                            onClick={() => toggleSkill(skill.id)}
                            className="text-muted-foreground hover:text-foreground text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic py-4">
                      Выберите навыки слева
                    </p>
                  )}
                </div>

                {/* Тариф */}
                <div className={`p-4 rounded-lg border-2 ${tier.color}`}>
                  <p className="text-xs text-muted-foreground mb-1">Ваш тариф</p>
                  <p className="text-2xl font-bold mb-1">{tier.name}</p>
                  <p className="text-lg font-semibold">{tier.price}</p>
                </div>

                {/* Описание тарифов */}
                <div className="text-xs text-muted-foreground space-y-1 border-t border-border/50 pt-4">
                  <p>• 0-5 навыков → Бесплатно</p>
                  <p>• 6-15 → 990₽/мес</p>
                  <p>• 16-30 → 2 490₽/мес</p>
                  <p>• Все навыки → 7 990₽/мес</p>
                </div>

                {/* Кнопка */}
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  disabled={selectedSkills.size === 0}
                  asChild={selectedSkills.size > 0}
                >
                  {selectedSkills.size > 0 ? (
                    <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                      <Sparkles className="h-4 w-4" />
                      Собрать помощника
                    </a>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Выберите навыки
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

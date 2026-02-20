import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Star, Users } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  installs: string;
}

const SKILLS: Skill[] = [
  // Финансы
  { id: '1', name: 'Чеки AI', category: 'Финансы', description: 'Автоматическое распознавание чеков и учёт расходов', rating: 4.9, installs: '12.5K' },
  { id: '2', name: 'Бюджет', category: 'Финансы', description: 'Планирование и контроль личного бюджета', rating: 4.7, installs: '8.2K' },
  { id: '3', name: 'Подписки', category: 'Финансы', description: 'Управление подписками и отмена ненужных', rating: 4.8, installs: '9.1K' },
  { id: '4', name: 'Инвестиции', category: 'Финансы', description: 'Мониторинг портфеля и инвестиционные идеи', rating: 4.6, installs: '5.3K' },
  
  // Здоровье
  { id: '5', name: 'Фитнес', category: 'Здоровье', description: 'Трекинг тренировок и достижения целей', rating: 4.8, installs: '11.2K' },
  { id: '6', name: 'Питание', category: 'Здоровье', description: 'Дневник питания и подсчёт калорий', rating: 4.5, installs: '7.8K' },
  { id: '7', name: 'Сон', category: 'Здоровье', description: 'Анализ качества сна и рекомендации', rating: 4.7, installs: '6.4K' },
  { id: '8', name: 'Медикаменты', category: 'Здоровье', description: 'Напоминания о приёме лекарств', rating: 4.9, installs: '4.9K' },
  
  // Продуктивность
  { id: '9', name: 'Календарь', category: 'Продуктивность', description: 'Умное планирование встреч и событий', rating: 4.8, installs: '10.3K' },
  { id: '10', name: 'Заметки', category: 'Продуктивность', description: 'Быстрые заметки с AI-тегированием', rating: 4.6, installs: '8.7K' },
  { id: '11', name: 'Задачи', category: 'Продуктивность', description: 'Управление задачами и приоритетами', rating: 4.7, installs: '9.5K' },
  { id: '12', name: 'Привычки', category: 'Продуктивность', description: 'Трекер привычек и напоминания', rating: 4.5, installs: '6.1K' },
  
  // Торговля
  { id: '13', name: 'Маркетплейс', category: 'Торговля', description: 'Покупка и продажа через единый интерфейс', rating: 4.9, installs: '13.2K' },
  { id: '14', name: 'Аукционы', category: 'Торговля', description: 'Участие в аукционах с уведомлениями', rating: 4.4, installs: '3.8K' },
  { id: '15', name: 'Тендеры', category: 'Торговля', description: 'Создание и участие в тендерах', rating: 4.6, installs: '2.7K' },
  { id: '16', name: 'Поиск цен', category: 'Торговля', description: 'Сравнение цен по магазинам', rating: 4.8, installs: '7.9K' },
  
  // Семья
  { id: '17', name: 'Семейный бюджет', category: 'Семья', description: 'Общий бюджет для всей семьи', rating: 4.7, installs: '5.6K' },
  { id: '18', name: 'Дети', category: 'Семья', description: 'Расписание и активности детей', rating: 4.8, installs: '6.2K' },
  { id: '19', name: 'Питомцы', category: 'Семья', description: 'Уход за питомцами и ветеринария', rating: 4.6, installs: '4.3K' },
  { id: '20', name: 'Совместные покупки', category: 'Семья', description: 'Список покупок и планирование', rating: 4.5, installs: '5.1K' },
  
  // Развлечения
  { id: '21', name: 'Кино', category: 'Развлечения', description: 'Рекомендации фильмов и бронирование', rating: 4.7, installs: '9.8K' },
  { id: '22', name: 'Музыка', category: 'Развлечения', description: 'Плейлисты и концерты', rating: 4.6, installs: '8.4K' },
  { id: '23', name: 'Книги', category: 'Развлечения', description: 'Библиотека и рекомендации книг', rating: 4.8, installs: '6.7K' },
  { id: '24', name: 'Путешествия', category: 'Развлечения', description: 'Планирование поездок и маршруты', rating: 4.9, installs: '10.1K' },
];

const CATEGORIES = ['Все', 'Финансы', 'Здоровье', 'Продуктивность', 'Торговля', 'Семья', 'Развлечения'];

export default function SkillsMap() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const filteredSkills = SKILLS.filter(skill => {
    const matchesCategory = selectedCategory === 'Все' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-16 bg-muted/20 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Все навыки</h2>
          <p className="text-muted-foreground">Выберите то, что нужно именно вам</p>
        </div>

        {/* Поиск */}
        <div className="mb-6 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск навыков..."
              className="pl-10 bg-background border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Фильтры по категориям */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Сетка навыков */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSkills.map((skill, index) => (
            <Card
              key={skill.id}
              className="group cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-border/50 bg-background animate-in fade-in zoom-in-95 duration-300"
              style={{ animationDelay: `${index * 30}ms` }}
              onClick={() => setSelectedSkill(skill)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base text-foreground">{skill.name}</CardTitle>
                  <Badge variant="outline" className="text-xs border-border/50">
                    {skill.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {skill.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="font-semibold">{skill.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{skill.installs}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Детальная карточка */}
        {selectedSkill && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedSkill(null)}
          >
            <Card
              className="max-w-md w-full border-border bg-background animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-foreground">{selectedSkill.name}</CardTitle>
                    <Badge variant="outline" className="mt-2 border-border/50">
                      {selectedSkill.category}
                    </Badge>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{selectedSkill.description}</p>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="font-semibold text-foreground">{selectedSkill.rating}</span>
                    <span className="text-muted-foreground">рейтинг</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{selectedSkill.installs}</span>
                    <span className="text-muted-foreground">установок</span>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                    Подключить
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Навыки не найдены</p>
          </div>
        )}
      </div>
    </section>
  );
}

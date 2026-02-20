import { useState } from 'react';
import { StickyNote, Landmark, Calendar, MessageSquare, Table, Check, X, ArrowRight } from 'lucide-react';

export default function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, container: HTMLDivElement) => {
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX, e.currentTarget);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX, e.currentTarget);
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            До и после GrandHub
          </h2>
          <p className="mt-4 text-muted-foreground">
            Перетащите ползунок, чтобы увидеть разницу
          </p>
        </div>

        <div
          className="scroll-reveal relative w-full h-[480px] overflow-hidden rounded-2xl border border-border shadow-lg cursor-ew-resize select-none"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
        >
          {/* BEFORE — full background, visible on left side */}
          <div className="absolute inset-0 bg-muted/40">
            <div className="h-full flex flex-col items-center justify-center p-8">
              <h3 className="text-xl font-bold text-muted-foreground mb-6">Без GrandHub</h3>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8 max-w-sm">
                {[
                  { icon: StickyNote, label: 'Заметки' },
                  { icon: Landmark, label: 'Банк' },
                  { icon: Calendar, label: 'Календарь' },
                  { icon: MessageSquare, label: 'Мессенджер' },
                  { icon: Table, label: 'Таблица' },
                ].map((app, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 opacity-50">
                    <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center">
                      <app.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{app.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 w-full max-w-xs">
                {[
                  '12 приложений для разных задач',
                  'Чеки теряются, расходы не считаются',
                  'Встречи забываются, записи пропускаются',
                  'Нет общей картины по финансам',
                  'Подписки списываются незаметно',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <X className="w-4 h-4 text-destructive shrink-0" />
                    <span className="text-sm text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AFTER — overlaid, clipped from right */}
          <div 
            className="absolute inset-0 bg-background"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <div className="h-full flex flex-col items-center justify-center p-8">
              <h3 className="text-xl font-bold text-foreground mb-8">С GrandHub</h3>

              <div className="space-y-4 w-full max-w-sm">
                {[
                  { text: 'Все расходы видны в одном месте', sub: 'Чеки распознаются автоматически' },
                  { text: 'Ни одна встреча не забыта', sub: 'AI напоминает заранее' },
                  { text: 'Бюджет под контролем', sub: 'Экономия 3-5 тыс. в месяц' },
                  { text: 'Подписки оптимизированы', sub: 'Лишние найдены и отменены' },
                  { text: 'Вся семья синхронизирована', sub: 'Общий бюджет, календарь, задачи' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.text}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Slider line + handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-border z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-background rounded-full shadow-lg border-2 border-border flex items-center justify-center cursor-ew-resize">
              <ArrowRight className="w-4 h-4 text-muted-foreground rotate-180 -ml-0.5" />
              <ArrowRight className="w-4 h-4 text-muted-foreground -mr-0.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

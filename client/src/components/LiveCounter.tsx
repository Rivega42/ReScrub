import { useState, useEffect } from 'react';

export default function LiveCounter() {
  const currentHour = new Date().getHours();
  const baseAmount = 847350 + (currentHour * 12000);
  const [amount, setAmount] = useState(baseAmount);

  useEffect(() => {
    const interval = setInterval(() => {
      setAmount(prev => prev + 50);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border/50">
      <div className="relative flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <div className="absolute w-2 h-2 rounded-full bg-green-500/30 animate-ping" />
      </div>
      <p className="text-sm text-muted-foreground">
        Пользователи GrandHub сегодня сэкономили{' '}
        <span className="font-bold text-foreground">
          {amount.toLocaleString('ru-RU')} ₽
        </span>
      </p>
    </div>
  );
}

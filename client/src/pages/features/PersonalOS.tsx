import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from "wouter";
import {
  Brain, Cpu, Network, Shield, Clock, Calendar, Wallet,
  Heart, ShoppingCart, GraduationCap, Home, Users, Zap,
  Layers, ArrowRight, Globe, Smartphone, MessageSquare,
  TrendingUp, Lock, Sparkles, CircuitBoard
} from "lucide-react";

export default function PersonalOS() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border mb-8">
            <CircuitBoard className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Новая парадигма</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Личная операционная<br />система
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            У каждого человека есть компьютер с операционной системой. Скоро у каждого
            будет личная AI-система, которая управляет его цифровой жизнью. GrandHub —
            это она.
          </p>
        </div>
      </section>

      {/* What is Personal OS */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Что такое личная ОС</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Представьте, что ваш телефон — это железо. Android или iOS — это операционная
                система. А приложения — это программы, которые вы ставите под свои задачи.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Теперь представьте то же самое, но для вашей жизни. Личная ОС — это
                AI-платформа, на которую вы устанавливаете навыки: финансы, здоровье,
                покупки, обучение, работа. Она знает вас, помнит ваш контекст и работает
                24/7.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Не десять приложений. Не двадцать вкладок. Один помощник, который понимает
                всё и связывает это вместе.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Cpu, label: "Ядро", desc: "AI-движок, который думает и принимает решения" },
                { icon: Brain, label: "Память", desc: "Ваш контекст, предпочтения, история" },
                { icon: Layers, label: "Навыки", desc: "Модули для каждой сферы жизни" },
                { icon: Network, label: "Интеграции", desc: "Банки, магазины, госуслуги, календарь" },
                { icon: Shield, label: "Безопасность", desc: "Ваши данные — только ваши" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium mb-1">{label}</div>
                    <div className="text-sm text-muted-foreground">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why everyone will have one */}
      <section className="py-20 px-4 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Почему это будет у каждого</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Так же, как каждый получил email, потом смартфон, потом мессенджер —
            следующий шаг неизбежен.
          </p>

          <div className="space-y-8">
            {[
              {
                title: "Цифровая жизнь стала слишком сложной",
                text: "Банковские приложения, трекеры привычек, календари, заметки, таск-менеджеры, мессенджеры, почта. Человек тратит часы в день просто на переключение между приложениями. Личная ОС объединяет всё в один интерфейс с одним помощником.",
                icon: Smartphone,
              },
              {
                title: "AI стал достаточно умным",
                text: "ChatGPT показал, что AI может понимать естественный язык. Но он не знает вас лично — он каждый раз начинает с нуля. Личная ОС помнит всё: ваши привычки, предпочтения, контекст. Она становится умнее с каждым днём.",
                icon: Brain,
              },
              {
                title: "Экономика внимания проиграла",
                text: "Люди устали от приложений, которые борются за их внимание. Уведомления, баннеры, подписки. Личная ОС работает НА вас, а не НАД вами. Она фильтрует шум и показывает только важное.",
                icon: Zap,
              },
              {
                title: "Стоимость AI упала в 100 раз за 2 года",
                text: "В 2024 году персональный AI стоил десятки долларов в день. В 2026 — копейки. Это как с интернетом: сначала роскошь, потом — коммунальная услуга. Личная ОС станет доступна каждому.",
                icon: TrendingUp,
              },
            ].map(({ title, text, icon: Icon }, i) => (
              <div key={i} className="flex gap-6 p-6 rounded-2xl bg-background border border-border">
                <Icon className="w-6 h-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Как это работает</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                step: "01",
                title: "Вы говорите",
                desc: "Текстом или голосом. Как обычному человеку. Без меню, кнопок и форм.",
                icon: MessageSquare,
              },
              {
                step: "02",
                title: "ОС понимает",
                desc: "AI разбирает контекст, подключает нужные навыки, вспоминает вашу историю.",
                icon: Brain,
              },
              {
                step: "03",
                title: "ОС действует",
                desc: "Переводит деньги, записывает к врачу, заказывает продукты, планирует день.",
                icon: Zap,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="text-center p-6">
                <div className="text-4xl font-bold text-primary/20 mb-4">{step}</div>
                <Icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {/* Use cases */}
          <h3 className="text-2xl font-bold mb-8 text-center">Один день с личной ОС</h3>
          <div className="space-y-4">
            {[
              { time: "07:00", icon: Clock, text: "Будильник подстроился под фазу сна. ОС знает, что вы легли в 23:40." },
              { time: "07:15", icon: Globe, text: "Утренняя сводка: погода, пробки на маршруте, 3 важных письма, день рождения коллеги." },
              { time: "08:30", icon: Calendar, text: "Напоминание: встреча в 10:00 перенесена на 11:00. Календарь уже обновлён." },
              { time: "12:00", icon: Wallet, text: "Оплатили обед. ОС записала расход, обновила бюджет. До лимита на еду осталось 4 200." },
              { time: "14:00", icon: ShoppingCart, text: "Заканчивается корм для кота. ОС нашла лучшую цену и предлагает заказать." },
              { time: "17:00", icon: Heart, text: "Пульс повышен весь день. ОС спрашивает: может, прогуляться? До нормы шагов осталось 3 000." },
              { time: "19:00", icon: GraduationCap, text: "Вечерний урок английского. ОС подготовила карточки на основе ваших ошибок." },
              { time: "21:00", icon: Home, text: "Свет приглушён, температура снижена. ОС готовит вас ко сну." },
            ].map(({ time, icon: Icon, text }) => (
              <div key={time} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div className="text-sm font-mono text-primary w-12 shrink-0 mt-0.5">{time}</div>
                <Icon className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills ecosystem */}
      <section className="py-20 px-4 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Навыки — это ваши приложения</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Как в смартфоне вы ставите приложения, в личной ОС вы подключаете навыки.
            Но с одним отличием: все навыки знают друг о друге и работают вместе.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Wallet, name: "Финансы", desc: "Бюджет, расходы, инвестиции, налоги" },
              { icon: Heart, name: "Здоровье", desc: "Трекинг, питание, сон, тренировки" },
              { icon: Calendar, name: "Расписание", desc: "Календарь, встречи, напоминания" },
              { icon: ShoppingCart, name: "Покупки", desc: "Сравнение цен, списки, заказы" },
              { icon: GraduationCap, name: "Обучение", desc: "Языки, курсы, карточки, прогресс" },
              { icon: Home, name: "Умный дом", desc: "Свет, климат, безопасность" },
              { icon: Users, name: "Семья", desc: "Общий бюджет, дети, расписание" },
              { icon: Globe, name: "Путешествия", desc: "Билеты, отели, маршруты, визы" },
              { icon: TrendingUp, name: "Торговля", desc: "Покупка и продажа, аукционы" },
              { icon: Lock, name: "Безопасность", desc: "Пароли, 2FA, мониторинг утечек" },
              { icon: Sparkles, name: "Креатив", desc: "Тексты, изображения, идеи" },
              { icon: Smartphone, name: "Свой навык", desc: "Создайте под свою задачу" },
            ].map(({ icon: Icon, name, desc }) => (
              <div key={name} className="p-4 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors">
                <Icon className="w-5 h-5 text-primary mb-2" />
                <div className="font-medium mb-1">{name}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-background border border-border text-center">
            <p className="text-muted-foreground mb-2">
              Навык "Финансы" видит, что вы купили билет. Навык "Календарь" создаёт
              событие. Навык "Здоровье" напоминает взять аптечку.
            </p>
            <p className="font-medium">Это не набор приложений. Это единый организм.</p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Чем это отличается от ChatGPT</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-muted-foreground font-medium">Критерий</th>
                  <th className="text-left py-4 px-4 text-muted-foreground font-medium">ChatGPT / Алиса</th>
                  <th className="text-left py-4 px-4 font-medium text-primary">Личная ОС</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Память", "Сессия или минимальная", "Полная история, контекст жизни"],
                  ["Персонализация", "Общие ответы", "Знает ваши привычки, цели, людей"],
                  ["Действия", "Только текст", "Переводы, заказы, запись, управление"],
                  ["Интеграции", "Плагины (ограниченно)", "Банки, госуслуги, IoT, магазины"],
                  ["Навыки", "Фиксированные", "Маркетплейс, создание своих"],
                  ["Работает", "Когда спросите", "Проактивно, 24/7"],
                  ["Данные", "На сервере компании", "Ваш контроль, шифрование"],
                ].map(([criterion, chatgpt, personalOS], i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">{criterion}</td>
                    <td className="py-3 px-4 text-muted-foreground">{chatgpt}</td>
                    <td className="py-3 px-4">{personalOS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Future vision */}
      <section className="py-20 px-4 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Будущее личных ОС</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                year: "2026",
                title: "Ранние пользователи",
                items: ["Текстовый интерфейс (Telegram, Web)", "Базовые навыки: финансы, расписание, покупки", "Память и персонализация", "Маркетплейс навыков"],
              },
              {
                year: "2027",
                title: "Массовое принятие",
                items: ["Голосовой интерфейс", "AI-секретарь принимает звонки и заявки", "Интеграции с банками и госуслугами", "Семейные планы, общие помощники"],
              },
              {
                year: "2028",
                title: "Стандарт жизни",
                items: ["AR/VR интерфейс", "AI-to-AI коммуникация между помощниками", "Управление умным домом и автомобилем", "Предиктивные действия без запроса"],
              },
              {
                year: "2030+",
                title: "Цифровой двойник",
                items: ["Полный цифровой аватар", "Автономные решения в рамках правил", "Наследуемый цифровой профиль", "Часть цифровой идентичности"],
              },
            ].map(({ year, title, items }) => (
              <div key={year} className="p-6 rounded-2xl bg-background border border-border">
                <div className="text-2xl font-bold text-primary mb-1">{year}</div>
                <div className="text-lg font-semibold mb-4">{title}</div>
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Станьте одним из первых</h2>
          <p className="text-muted-foreground mb-8">
            GrandHub — это личная операционная система, которая уже работает.
            Присоединяйтесь к ранним пользователям и определяйте будущее вместе с нами.
          </p>
          <Link href="/early-access">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
              Получить доступ
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

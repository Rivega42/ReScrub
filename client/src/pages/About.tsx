import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Zap, Lock, Award, Globe, Brain } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                О GrandHub
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Мы создаём первый персональный AI-помощник для жизни в России —
                тот, который знает тебя, а не просто отвечает на вопросы.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Наша миссия
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                ChatGPT знает всё. Но он не знает тебя, твои цели, твою семью, твой контекст.
                GrandHub — это разница между энциклопедией и личным помощником. Мы строим второе.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Brain className="h-6 w-6 text-primary-foreground" />
                    </div>
                    Персонализация как основа
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    GrandHub запоминает тебя. С каждым запросом помощник становится умнее
                    и точнее — как настоящий ассистент, который работает с тобой годами.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Zap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    Удобство в России
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    Российские сервисы, цены в рублях, понимание местного контекста.
                    Не адаптация западного продукта, а создание нового — для России.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Lock className="h-6 w-6 text-primary-foreground" />
                    </div>
                    Безопасность данных
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    Твои данные остаются твоими. Мы не продаём профили, не используем данные
                    для рекламы — только для улучшения твоего опыта.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Globe className="h-6 w-6 text-primary-foreground" />
                    </div>
                    Экосистема навыков
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    12 специализированных навыков — от финансов до Trading Hub.
                    Каждый навык усиливает другие, создавая синергию для твоей жизни.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Команда
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Основатели, разработчики и продуктовые дизайнеры — люди, которые сами
                устали от неудобных AI-инструментов и решили создать то, что нужно на самом деле.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
              <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Продукт и AI</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Команда продакт-менеджеров и AI-инженеров с опытом в Яндексе, VK и стартапах
                </p>
              </div>
              <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
                  <Award className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Trading Hub</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Эксперты по тендерам и аукционам с 10+ годами опыта в B2B-торговле
                </p>
              </div>
              <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Разработка</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Full-stack команда, строящая надёжную и масштабируемую платформу для России
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Наши принципы
              </h2>
            </div>
            <div className="mx-auto mt-16 max-w-2xl lg:max-w-4xl">
              <div className="space-y-8">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-lg font-semibold text-foreground">Память как суперсила</h3>
                  <p className="mt-2 text-muted-foreground">
                    Мы верим, что настоящий помощник — тот, кто помнит тебя. Персонализация —
                    наше конкурентное преимущество, не мощность модели.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-lg font-semibold text-foreground">Российский контекст</h3>
                  <p className="mt-2 text-muted-foreground">
                    Мы строим продукт для жизни в России. Это не перевод американского продукта —
                    это нативное решение для российских реалий.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-lg font-semibold text-foreground">Экосистема, а не инструмент</h3>
                  <p className="mt-2 text-muted-foreground">
                    12 навыков — это единая экосистема. Финансы знают о твоих покупках,
                    Коуч знает о твоём расписании, Trading Hub использует контекст всего профиля.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Попробуй GrandHub сейчас
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                5 Pro-запросов бесплатно. Без регистрации. Прямо в Telegram.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer"
                   className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/80"
                   data-testid="button-about-get-started">
                  <MessageCircle className="inline mr-2 h-4 w-4" />
                  Открыть @Grandhub_bot
                </a>
                <a href="/contacts" className="text-sm font-semibold leading-6 text-foreground hover:text-muted-foreground"
                   data-testid="link-about-contacts">
                  Связаться с нами <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

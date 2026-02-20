import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Users, Zap, Lock, Award, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                О GrandHub
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Мы защищаем персональные данные россиян в соответствии с 152-ФЗ, 
                автоматически удаляя информацию с сайтов брокеров данных.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Наша миссия
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Каждый россиянин имеет право на защиту своих персональных данных. 
                Мы делаем эту защиту простой, автоматической и эффективной.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Shield className="h-6 w-6 text-primary-foreground" />
                    </div>
                    Соответствие 152-ФЗ
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    Полное соблюдение российского законодательства о персональных данных. 
                    Работаем в правовом поле РФ.
                  </dd>
                </div>

                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Zap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    Автоматизация
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    Автоматический поиск и удаление данных с сотен сайтов брокеров. 
                    Без необходимости ручной работы.
                  </dd>
                </div>

                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Lock className="h-6 w-6 text-primary-foreground" />
                    </div>
                    Безопасность
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    Высокие стандарты безопасности данных. Мы не храним ваши персональные 
                    данные дольше необходимого.
                  </dd>
                </div>

                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Globe className="h-6 w-6 text-primary-foreground" />
                    </div>
                    Российский сервис
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    Разработано в России, для россиян. Понимаем специфику российского 
                    интернета и законодательства.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Команда экспертов
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Наша команда состоит из специалистов по кибербезопасности, юристов 
                и разработчиков с многолетним опытом в области защиты данных.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
              <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Кибербезопасность</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Специалисты с опытом работы в ведущих ИБ-компаниях России
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
                  <Award className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Юридическая экспертиза</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Юристы, специализирующиеся на 152-ФЗ и защите персональных данных
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Разработка</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Инженеры, создающие надежные и масштабируемые решения
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
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
                  <h3 className="text-lg font-semibold text-foreground">Прозрачность</h3>
                  <p className="mt-2 text-muted-foreground">
                    Мы открыто рассказываем о том, как работает наш сервис, 
                    какие данные обрабатываем и как их защищаем.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-lg font-semibold text-foreground">Результативность</h3>
                  <p className="mt-2 text-muted-foreground">
                    Мы измеряем успех количеством удаленных записей и уровнем 
                    защищенности ваших данных.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-lg font-semibold text-foreground">Непрерывное развитие</h3>
                  <p className="mt-2 text-muted-foreground">
                    Постоянно совершенствуем алгоритмы, добавляем новые источники 
                    и улучшаем качество защиты.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Готовы защитить свои данные?
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Начните с бесплатного пробного периода и убедитесь в эффективности нашего решения.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/reports"
                  className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  data-testid="button-about-get-started"
                >
                  Начать защиту
                </a>
                <a 
                  href="/contacts" 
                  className="text-sm font-semibold leading-6 text-foreground hover:text-muted-foreground"
                  data-testid="link-about-contacts"
                >
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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Clock, Scale, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Terms() {
  useEffect(() => {
    document.title = "Условия использования - GrandHub";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Условия использования
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Условия использования сервиса GrandHub
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Действует с: 1 февраля 2026 г.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Важно</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Используя GrandHub, вы соглашаетесь с этими условиями.
                      Внимательно ознакомьтесь перед началом использования.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="pb-24 sm:pb-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12">
              <section id="general">
                <h2 className="text-2xl font-semibold text-foreground mb-6">1. Общие положения</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>1.1. Настоящие Условия использования регулируют отношения между GrandHub и пользователем при использовании сервиса.</p>
                  <p>1.2. Использование @Grandhub_bot в Telegram или сайта grandhub.ru означает согласие с этими условиями.</p>
                  <p>1.3. GrandHub — персональный AI-помощник для жизни в России. Бот доступен в Telegram: @Grandhub_bot.</p>
                </div>
              </section>

              <section id="service">
                <h2 className="text-2xl font-semibold text-foreground mb-6">2. Описание сервиса</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>GrandHub предоставляет:</p>
                  <ul className="space-y-2">
                    <li>• Персональный AI-помощник с памятью в Telegram</li>
                    <li>• 12 специализированных навыков для разных сфер жизни</li>
                    <li>• Trading Hub: аукционы, тендеры, AI-автоторг</li>
                    <li>• Подписки Free, Старт, Про, Бизнес</li>
                  </ul>
                  <p>Сервис предоставляется "как есть". Мы стремимся к 99%+ доступности, но не гарантируем её в случае форс-мажора.</p>
                </div>
              </section>

              <section id="user-rules">
                <h2 className="text-2xl font-semibold text-foreground mb-6">3. Правила использования</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Пользователь обязуется:</p>
                  <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                    <CardContent className="pt-6">
                      <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                        <li>• Не использовать сервис для незаконных целей</li>
                        <li>• Не пытаться обойти ограничения тарифа</li>
                        <li>• Не передавать доступ третьим лицам (кроме семейного тарифа)</li>
                        <li>• Не использовать автоматизацию для злоупотребления API</li>
                        <li>• Предоставлять достоверную информацию</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section id="payment">
                <h2 className="text-2xl font-semibold text-foreground mb-6">4. Оплата и тарифы</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>4.1. Тарифы: Free (0₽), Старт (990₽/мес), Про (2490₽/мес), Бизнес (7990₽/мес).</p>
                  <p>4.2. Оплата в российских рублях через ЮKassa или Robokassa.</p>
                  <p>4.3. Подписка продлевается автоматически. Отменить можно в любое время.</p>
                  <p>4.4. Возврат: в течение 3 дней с момента оплаты, если услуга не была активно использована.</p>
                  <p>4.5. Тарифы могут меняться с уведомлением за 10 дней.</p>
                </div>
              </section>

              <section id="liability">
                <h2 className="text-2xl font-semibold text-foreground mb-6">5. Ответственность</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>5.1. GrandHub не несёт ответственности за:</p>
                  <ul className="space-y-2">
                    <li>• Решения, принятые на основе советов бота</li>
                    <li>• Результаты Trading Hub (участие в торгах — риск пользователя)</li>
                    <li>• Перебои в работе Telegram</li>
                    <li>• Форс-мажорные обстоятельства</li>
                  </ul>
                  <p>5.2. GrandHub несёт ответственность за защиту твоих персональных данных согласно Политике конфиденциальности.</p>
                </div>
              </section>

              <section id="ip">
                <h2 className="text-2xl font-semibold text-foreground mb-6">6. Интеллектуальная собственность</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Все права на GrandHub, торговые марки, алгоритмы и контент принадлежат команде GrandHub. Пользователю предоставляется личная неисключительная лицензия на использование сервиса.</p>
                </div>
              </section>

              <section id="disputes">
                <h2 className="text-2xl font-semibold text-foreground mb-6">7. Споры</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>7.1. Споры решаются путём переговоров. Для обращения: <a href="mailto:legal@grandhub.ru" className="text-primary hover:text-primary/80">legal@grandhub.ru</a></p>
                  <p>7.2. При недостижении согласия — в судах Санкт-Петербурга по российскому праву.</p>
                </div>
              </section>

              <section id="final">
                <h2 className="text-2xl font-semibold text-foreground mb-6">8. Заключительные положения</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>8.1. Условия могут меняться с уведомлением пользователей.</p>
                  <p>8.2. Действующая версия всегда на grandhub.ru/terms</p>
                  <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
                    <p><strong>Контакты:</strong> legal@grandhub.ru | <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">@Grandhub_bot</a></p>
                    <p className="mt-1">GrandHub, Санкт-Петербург, Россия</p>
                  </div>
                </div>
              </section>

              <section className="mt-16 text-center">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Согласен? Давай начнём!</h3>
                    <p className="text-muted-foreground mb-6">Попробуй GrandHub бесплатно прямо сейчас</p>
                    <div className="flex items-center justify-center gap-4">
                      <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" data-testid="button-terms-get-started">Открыть @Grandhub_bot</Button>
                      </a>
                      <Link href="/contacts">
                        <Button variant="outline" size="lg" data-testid="button-terms-contact">Задать вопрос</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

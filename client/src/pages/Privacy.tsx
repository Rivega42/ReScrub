import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, FileText, Clock, Mail } from "lucide-react";
import { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
    document.title = "Политика конфиденциальности - GrandHub";
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
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Политика конфиденциальности
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                GrandHub уважает твою приватность. Твои данные используются только чтобы лучше помогать тебе.
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Последнее обновление: 1 февраля 2026 г.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-24 sm:pb-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Содержание
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <a href="#general" className="text-primary hover:text-primary/80">1. Кто мы</a>
                  <a href="#data-collected" className="text-primary hover:text-primary/80">2. Какие данные собираем</a>
                  <a href="#data-use" className="text-primary hover:text-primary/80">3. Как используем данные</a>
                  <a href="#data-storage" className="text-primary hover:text-primary/80">4. Хранение и безопасность</a>
                  <a href="#data-rights" className="text-primary hover:text-primary/80">5. Твои права</a>
                  <a href="#third-parties" className="text-primary hover:text-primary/80">6. Третьи стороны</a>
                  <a href="#cookies" className="text-primary hover:text-primary/80">7. Cookies</a>
                  <a href="#contact" className="text-primary hover:text-primary/80">8. Контакты</a>
                </nav>
              </CardContent>
            </Card>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12">
              <section id="general">
                <h2 className="text-2xl font-semibold text-foreground mb-6">1. Кто мы</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>GrandHub — персональный AI-помощник для жизни в России, доступный через Telegram (@Grandhub_bot) и сайт grandhub.ru.</p>
                  <p>Настоящая политика описывает, как мы собираем, используем и защищаем твои данные. Используя GrandHub, ты соглашаешься с этой политикой.</p>
                  <p>По вопросам обработки данных: <a href="mailto:privacy@grandhub.ru" className="text-primary hover:text-primary/80">privacy@grandhub.ru</a></p>
                </div>
              </section>

              <section id="data-collected">
                <h2 className="text-2xl font-semibold text-foreground mb-6">2. Какие данные мы собираем</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Мы собираем только то, что нужно для работы сервиса:</p>
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Данные аккаунта:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Telegram ID и имя пользователя</li>
                            <li>• Настройки и предпочтения</li>
                            <li>• История запросов (для памяти)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Данные использования:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Запросы к боту</li>
                            <li>• Выбранные навыки</li>
                            <li>• Техническая статистика</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <p>Мы НЕ собираем: биометрические данные, данные о местоположении без запроса, банковские данные (оплата через защищённые шлюзы).</p>
                </div>
              </section>

              <section id="data-use">
                <h2 className="text-2xl font-semibold text-foreground mb-6">3. Как мы используем данные</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Твои данные используются исключительно для:</p>
                  <ul className="space-y-2">
                    <li>• Предоставления персонализированной помощи</li>
                    <li>• Обеспечения памяти и контекста между сессиями</li>
                    <li>• Улучшения качества ответов</li>
                    <li>• Технической поддержки</li>
                    <li>• Обработки платежей (через защищённые шлюзы)</li>
                  </ul>
                  <p className="font-medium text-foreground">Мы никогда не используем твои данные для продажи рекламы или передачи третьим лицам в коммерческих целях.</p>
                </div>
              </section>

              <section id="data-storage">
                <h2 className="text-2xl font-semibold text-foreground mb-6">4. Хранение и безопасность</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Данные хранятся на серверах в России. Мы применяем:</p>
                  <ul className="space-y-2">
                    <li>• Шифрование данных при передаче (TLS)</li>
                    <li>• Шифрование хранимых данных</li>
                    <li>• Ограниченный доступ сотрудников</li>
                    <li>• Регулярные аудиты безопасности</li>
                  </ul>
                  <p>Данные хранятся пока ты пользуешься сервисом + 1 год после удаления аккаунта.</p>
                </div>
              </section>

              <section id="data-rights">
                <h2 className="text-2xl font-semibold text-foreground mb-6">5. Твои права</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Ты имеешь право:</p>
                  <ul className="space-y-2">
                    <li>• Запросить копию всех своих данных</li>
                    <li>• Исправить неверные данные</li>
                    <li>• Удалить аккаунт и все данные</li>
                    <li>• Отозвать согласие на обработку</li>
                    <li>• Ограничить обработку данных</li>
                  </ul>
                  <p>Для реализации прав напиши: <a href="mailto:privacy@grandhub.ru" className="text-primary hover:text-primary/80">privacy@grandhub.ru</a></p>
                </div>
              </section>

              <section id="third-parties">
                <h2 className="text-2xl font-semibold text-foreground mb-6">6. Третьи стороны</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Мы работаем со следующими категориями партнёров:</p>
                  <ul className="space-y-2">
                    <li>• <strong>AI-провайдеры</strong>: для обработки запросов (данные обезличены)</li>
                    <li>• <strong>Платёжные системы</strong>: ЮKassa, Robokassa для обработки платежей</li>
                    <li>• <strong>Хостинг</strong>: серверы в России</li>
                    <li>• <strong>Аналитика</strong>: только агрегированная, обезличенная статистика</li>
                  </ul>
                  <p>Мы не продаём данные и не передаём их без необходимости.</p>
                </div>
              </section>

              <section id="cookies">
                <h2 className="text-2xl font-semibold text-foreground mb-6">7. Cookies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Сайт grandhub.ru использует только необходимые cookies:</p>
                  <ul className="space-y-2">
                    <li>• Авторизационные токены сессии</li>
                    <li>• Настройки темы оформления</li>
                  </ul>
                  <p>Маркетинговые и рекламные cookies не используются.</p>
                </div>
              </section>

              <section id="contact">
                <h2 className="text-2xl font-semibold text-foreground mb-6">8. Контакты по вопросам данных</h2>
                <div className="space-y-4 text-muted-foreground">
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Email:</strong> <a href="mailto:privacy@grandhub.ru" className="text-primary hover:text-primary/80">privacy@grandhub.ru</a></p>
                          <p className="mt-2"><strong>Telegram:</strong> <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">@Grandhub_bot</a></p>
                        </div>
                        <div>
                          <p><strong>Срок ответа:</strong> до 30 дней</p>
                          <p className="mt-2"><strong>Расположение:</strong> Санкт-Петербург, Россия</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Вопросы о конфиденциальности?
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Пиши — ответим на любой вопрос о твоих данных
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="mailto:privacy@grandhub.ru">
                <Button size="lg" data-testid="button-contact-privacy">
                  <Mail className="mr-2 h-4 w-4" />
                  privacy@grandhub.ru
                </Button>
              </a>
              <Link href="/contacts">
                <Button variant="outline" size="lg">Контакты</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

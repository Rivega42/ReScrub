import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function Reports() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Панель управления
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Контролируйте защиту ваших персональных данных в режиме реального времени
              </p>
            </div>
          </div>
        </section>

        {/* Demo Notice */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
              <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <CardTitle className="text-amber-800 dark:text-amber-200">Демо-версия</CardTitle>
                  </div>
                  <CardDescription className="text-amber-700 dark:text-amber-300">
                    Это демонстрационная версия панели управления. Для доступа к полному функционалу 
                    необходимо войти в систему или зарегистрироваться.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      asChild 
                      size="sm"
                      data-testid="button-reports-login"
                    >
                      <a href="/login">Войти в систему</a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      data-testid="button-reports-back-home"
                      asChild
                    >
                      <a href="/">Вернуться на главную</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Demo Dashboard */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Статистика защиты */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Удалено записей</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">247</div>
                  <p className="text-xs text-muted-foreground">За последние 30 дней</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активные запросы</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">В процессе обработки</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Уровень защиты</CardTitle>
                  <Shield className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89%</div>
                  <p className="text-xs text-muted-foreground">Высокий уровень</p>
                </CardContent>
              </Card>
            </div>

            {/* Последние активности */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Последние активности</CardTitle>
                  <CardDescription>
                    Недавние действия по защите ваших данных
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Удалена запись с brokerdata.com</p>
                        <p className="text-xs text-muted-foreground">2 часа назад</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Отправлен запрос на удаление в datamart.ru</p>
                        <p className="text-xs text-muted-foreground">6 часов назад</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Удалена запись с peoplesearch.net</p>
                        <p className="text-xs text-muted-foreground">1 день назад</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Начните защищать свои данные
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Войдите в систему или создайте аккаунт для доступа к полному функционалу защиты данных
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button asChild data-testid="button-reports-cta-login">
                  <a href="/login">Войти в систему</a>
                </Button>
                <a 
                  href="/about" 
                  className="text-sm font-semibold leading-6 text-foreground hover:text-muted-foreground"
                  data-testid="link-reports-learn-more"
                >
                  Узнать больше <span aria-hidden="true">→</span>
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
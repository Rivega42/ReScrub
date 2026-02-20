import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, MessageCircle, Clock, ExternalLink } from "lucide-react";
import { useEffect } from "react";

export default function Contacts() {
  useEffect(() => {
    document.title = "Контакты - GrandHub";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Свяжитесь с нами
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Готовы ответить на любые вопросы о GrandHub — первом персональном AI-помощнике для жизни в России
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Telegram-бот</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Самый быстрый способ — написать боту напрямую</p>
                  <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer"
                     className="font-medium text-primary hover:text-primary/80 block text-xl">
                    @Grandhub_bot
                  </a>
                  <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" data-testid="button-telegram-bot">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Написать боту
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Для подробных вопросов и партнёрства</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Общие вопросы:</p>
                      <a href="mailto:hello@grandhub.ru" className="font-medium text-primary hover:text-primary/80">
                        hello@grandhub.ru
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Партнёрство:</p>
                      <a href="mailto:partner@grandhub.ru" className="font-medium text-primary hover:text-primary/80">
                        partner@grandhub.ru
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Поддержка:</p>
                      <a href="mailto:support@grandhub.ru" className="font-medium text-primary hover:text-primary/80">
                        support@grandhub.ru
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Офис</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Санкт-Петербург, Россия</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Пн–Пт 10:00–19:00 МСК</span>
                    </div>
                    <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full mt-2">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Связаться онлайн
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground">
                Реквизиты
              </h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <div>
                      <p className="text-muted-foreground">Проект:</p>
                      <p className="font-medium">GrandHub</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Сайт:</p>
                      <a href="https://grandhub.ru" className="font-medium text-primary hover:text-primary/80">grandhub.ru</a>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Telegram-бот:</p>
                      <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:text-primary/80">@Grandhub_bot</a>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-muted-foreground">Расположение:</p>
                      <p className="font-medium">Санкт-Петербург, Россия</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email для юридических вопросов:</p>
                      <a href="mailto:legal@grandhub.ru" className="font-medium text-primary hover:text-primary/80">legal@grandhub.ru</a>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Конфиденциальность:</p>
                      <div className="flex gap-2 flex-wrap mt-1">
                        <Button variant="outline" size="sm" asChild>
                          <a href="/privacy">Политика конфиденциальности</a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href="/terms">Условия использования</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

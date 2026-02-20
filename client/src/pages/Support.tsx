import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  Users, 
  Shield, 
  FileText, 
  Video,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Timer,
  Scale,
  CreditCard,
  Settings
} from "lucide-react";

// Support contact form schema  
const contactFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email адрес"),
  category: z.string().min(1, "Выберите категорию обращения"),
  priority: z.string().min(1, "Выберите приоритет"),
  subject: z.string().min(5, "Тема должна содержать минимум 5 символов"),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
  agreeToProcessing: z.boolean().refine(val => val === true, {
    message: "Необходимо согласие на обработку персональных данных"
  })
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Moscow timezone helper
const getMoscowTime = () => {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
};

// Support FAQ data
const supportFAQ = [
  {
    id: "response-time",
    question: "Как быстро вы отвечаете на обращения?",
    answer: `**Мы стремимся отвечать как можно быстрее:**

• **Email поддержка:** обычно в течение нескольких часов в рабочее время
• **Онлайн-чат:** как правило, очень быстро в рабочие часы  
• **Телефон:** сразу при обращении в рабочие часы
• **Приоритетные обращения:** обрабатываются в первую очередь

**Рабочее время:** Понедельник-Пятница 9:00-21:00, Суббота 10:00-18:00 (МСК)`
  },
  {
    id: "account-issues",
    question: "Что делать, если не могу войти в личный кабинет?",
    answer: `**Попробуйте следующие шаги:**

1. **Сброс пароля:** Используйте функцию "Забыли пароль?"
2. **Проверьте email:** Убедитесь, что используете правильный адрес
3. **Очистите кэш:** Очистите кэш браузера и cookies
4. **Попробуйте другой браузер:** Иногда помогает смена браузера

**Если проблема остается:** Напишите нам на support@grandhub.ru с указанием вашего email для регистрации.`
  },
  {
    id: "billing-questions",
    question: "Как изменить тариф или отменить подписку?",
    answer: `**Управление подпиской:**

• **Смена тарифа:** Доступна в любое время в личном кабинете → "Тариф"
• **Отмена подписки:** Можно отменить до следующего списания
• **Возврат средств:** В течение 14 дней для новых клиентов

**Для помощи:** Обратитесь в поддержку с указанием желаемых изменений.`
  },
  {
    id: "data-protection",
    question: "Как GrandHub защищает мои персональные данные?",
    answer: `**Защита данных в соответствии с AI-помощник:**

• **Минимизация:** Обрабатываем только необходимые данные
• **Шифрование:** Используем современные методы шифрования
• **Локализация:** Данные хранятся в соответствии с требованиями законодательства РФ
• **Безопасность:** Применяем современные методы защиты информации

**Ваши права:** Вы можете запросить удаление, изменение или выгрузку своих данных в любое время.`
  }
];

export default function Support() {
  const [moscowTime, setMoscowTime] = useState<string>('');
  const [isBusinessHours, setIsBusinessHours] = useState(false);
  const { toast } = useToast();

  // Support ticket mutation
  const supportMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest('POST', '/api/support', data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Обращение отправлено",
        description: `${data.message || "Мы получили ваше сообщение и ответим в ближайшее время."} ${data.ticketId ? `\nID обращения: ${data.ticketId}` : ''}`,
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка отправки",
        description: error.message || "Не удалось отправить обращение. Попробуйте еще раз или напишите на support@grandhub.ru",
        variant: "destructive",
      });
    },
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      priority: "",
      subject: "",
      message: "",
      agreeToProcessing: false
    }
  });

  // Update Moscow time every minute
  useEffect(() => {
    const updateTime = () => {
      const time = getMoscowTime();
      setMoscowTime(time);
      
      // Check if it's business hours (Mon-Fri 9-21, Sat 10-18 Moscow time)
      const now = new Date();
      const moscowNow = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Moscow"}));
      const hour = moscowNow.getHours();
      const day = moscowNow.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
      const isWeekday = day >= 1 && day <= 5; // Monday to Friday
      const isSaturday = day === 6;
      const isWeekdayHours = hour >= 9 && hour < 21;
      const isSaturdayHours = hour >= 10 && hour < 18;
      
      setIsBusinessHours((isWeekday && isWeekdayHours) || (isSaturday && isSaturdayHours));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Handle form submission
  const onSubmit = async (data: ContactFormData) => {
    supportMutation.mutate(data);
  };

  useEffect(() => {
    document.title = "Поддержка - GrandHub";
    
    // Add meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Техническая поддержка GrandHub - получите помощь по вопросам защиты персональных данных и AI-помощник. Обратитесь к экспертам через удобную форму связи.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Техническая поддержка GrandHub - получите помощь по вопросам защиты персональных данных и AI-помощник. Обратитесь к экспертам через удобную форму связи.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Центр поддержки
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Получите помощь по любым вопросам защиты данных, AI-помощник и работе с сервисом GrandHub
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="text-muted-foreground">Время в Москве:</span>
                  <span className="font-mono font-semibold">{moscowTime}</span>
                </div>
                <Badge variant={isBusinessHours ? "default" : "secondary"} className="gap-1">
                  {isBusinessHours ? <CheckCircle className="h-3 w-3" /> : <Timer className="h-3 w-3" />}
                  {isBusinessHours ? 'Онлайн' : 'Офлайн'}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground">
                Быстрая помощь
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Выберите удобный способ связи с нашей командой поддержки
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Email Support */}
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Email поддержка</CardTitle>
                  <CardDescription>Обычно отвечаем быстро</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Общие вопросы:</p>
                    <a 
                      href="mailto:support@grandhub.ru" 
                      className="font-medium text-primary hover:text-primary/80"
                      data-testid="link-email-support"
                    >
                      support@grandhub.ru
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Продажи и тарифы:</p>
                    <a 
                      href="mailto:sales@grandhub.ru" 
                      className="font-medium text-primary hover:text-primary/80"
                      data-testid="link-email-sales"
                    >
                      sales@grandhub.ru
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Live Chat */}
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Онлайн чат</CardTitle>
                  <CardDescription>
                    {isBusinessHours ? 'Доступен сейчас' : 'Офлайн до утра'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Быстрая помощь в рабочее время через личный кабинет
                  </p>
                  <Button 
                    variant={isBusinessHours ? "default" : "outline"} 
                    disabled={!isBusinessHours}
                    data-testid="button-start-chat"
                    onClick={() => {
                      if (isBusinessHours) {
                        // Simulate opening chat functionality
                        alert('Чат будет доступен в ближайшее время. Пока воспользуйтесь формой обратной связи ниже.');
                      }
                    }}
                  >
                    {isBusinessHours ? 'Начать чат' : 'Чат недоступен'}
                  </Button>
                </CardContent>
              </Card>

              {/* Phone Support */}
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Телефон</CardTitle>
                  <CardDescription>Пн-Пт 9:00-21:00, Сб 10:00-18:00</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Общая поддержка:</p>
                    <a 
                      href="tel:+74951234567" 
                      className="font-medium text-primary hover:text-primary/80"
                      data-testid="link-phone-support"
                    >
                      +7 (495) 123-45-67
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Экстренная линия (премиум):</p>
                    <a 
                      href="tel:+78005550123" 
                      className="font-medium text-primary hover:text-primary/80"
                      data-testid="link-phone-emergency"
                    >
                      +7 (800) 555-01-23
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground">
                Форма обратной связи
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Опишите свою проблему подробно, и мы поможем найти решение
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Новое обращение</CardTitle>
                <CardDescription>
                  Все поля обязательны для заполнения. Стремимся ответить как можно быстрее.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ваше имя</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Иван Иванов" 
                                data-testid="input-support-name"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email адрес</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="ivan@example.com" 
                                data-testid="input-support-email"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Категория обращения</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-support-category">
                                  <SelectValue placeholder="Выберите категорию" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="technical">Техническая поддержка</SelectItem>
                                <SelectItem value="billing">Вопросы оплаты</SelectItem>
                                <SelectItem value="account">Проблемы с аккаунтом</SelectItem>
                                <SelectItem value="legal">Юридические вопросы</SelectItem>
                                <SelectItem value="privacy">Защита данных/AI-помощник</SelectItem>
                                <SelectItem value="feature">Запрос функций</SelectItem>
                                <SelectItem value="other">Другое</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Приоритет</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-support-priority">
                                  <SelectValue placeholder="Выберите приоритет" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Низкий - общие вопросы</SelectItem>
                                <SelectItem value="medium">Средний - нужна помощь</SelectItem>
                                <SelectItem value="high">Высокий - проблема блокирует работу</SelectItem>
                                <SelectItem value="urgent">Критичный - данные под угрозой</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Тема обращения</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Краткое описание проблемы" 
                              data-testid="input-support-subject"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Подробное описание</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Опишите проблему как можно подробнее. Укажите какие действия привели к проблеме, какой результат вы ожидали и что произошло на самом деле."
                              className="min-h-[120px]"
                              data-testid="textarea-support-message"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreeToProcessing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-support-agreement"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              Согласие на обработку персональных данных
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Я согласен на обработку моих персональных данных в соответствии с AI-помощник 
                              для предоставления технической поддержки. Данные будут использоваться только 
                              для решения моего обращения и удалены после его закрытия.
                            </p>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={supportMutation.isPending}
                        data-testid="button-submit-support"
                      >
                        {supportMutation.isPending ? "Отправляем..." : "Отправить обращение"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => form.reset()}
                        data-testid="button-reset-support"
                      >
                        Очистить
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Support Status & Response Times */}
        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground">
                Статус обращений и время ответа
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Прозрачная информация о наших стандартах поддержки
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Response Times */}
              <Card>
                <CardHeader className="text-center pb-2">
                  <Timer className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Email</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-semibold text-foreground mb-1">Быстро</div>
                  <div className="text-sm text-muted-foreground">в рабочее время</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center pb-2">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Онлайн чат</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-semibold text-foreground mb-1">Быстро</div>
                  <div className="text-sm text-muted-foreground">оперативно</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center pb-2">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Телефон</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-semibold text-foreground mb-1">Сразу</div>
                  <div className="text-sm text-muted-foreground">при звонке</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center pb-2">
                  <AlertCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Экстренные</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-semibold text-foreground mb-1">Приоритетно</div>
                  <div className="text-sm text-muted-foreground">важные вопросы</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Specialized Support */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground">
                Специализированная поддержка
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Эксперты по разным аспектам защиты персональных данных
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Техническая поддержка</CardTitle>
                  <CardDescription>Проблемы с аккаунтом, настройками, мониторингом</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <a href="mailto:tech@grandhub.ru" className="text-primary hover:text-primary/80">tech@grandhub.ru</a>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Телефон:</span>
                      <span className="font-medium">доб. 101</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Юридическая поддержка</CardTitle>
                  <CardDescription>Вопросы по AI-помощник, правовые аспекты защиты данных</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <a href="mailto:legal@grandhub.ru" className="text-primary hover:text-primary/80">legal@grandhub.ru</a>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Телефон:</span>
                      <span className="font-medium">доб. 102</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Продажи и тарифы</CardTitle>
                  <CardDescription>Выбор тарифа, оплата, корпоративные решения</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <a href="mailto:sales@grandhub.ru" className="text-primary hover:text-primary/80">sales@grandhub.ru</a>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Телефон:</span>
                      <span className="font-medium">доб. 103</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Self-Service */}
        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground">
                Самообслуживание
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Найдите ответы на вопросы самостоятельно в нашей базе знаний
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Документация</CardTitle>
                  <CardDescription>Подробные инструкции по использованию сервиса</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full" data-testid="button-view-docs">
                    Посмотреть документацию
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Видео-инструкции</CardTitle>
                  <CardDescription>Пошаговые видео по настройке и использованию</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full" data-testid="button-view-videos">
                    Смотреть видео
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>База знаний</CardTitle>
                  <CardDescription>Часто задаваемые вопросы и решения проблем</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full" data-testid="button-view-kb">
                    База знаний
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground">
                Быстрые ответы
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ответы на самые популярные вопросы поддержки
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {supportFAQ.map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id} 
                  className="bg-card rounded-lg border border-border shadow-sm px-6"
                  data-testid={`support-faq-item-${index + 1}`}
                >
                  <AccordionTrigger 
                    className="text-left text-base font-medium text-foreground hover:text-muted-foreground transition-colors py-6"
                    data-testid={`support-faq-trigger-${index + 1}`}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent 
                    className="text-muted-foreground leading-7 pb-6 whitespace-pre-line"
                    data-testid={`support-faq-content-${index + 1}`}
                  >
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Business Hours */}
        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground mb-8">
                Часы работы поддержки
              </h2>
              
              <Card>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Рабочие дни
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Понедельник - Пятница</span>
                          <span className="font-medium">9:00 - 21:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Суббота</span>
                          <span className="font-medium">10:00 - 18:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Воскресенье</span>
                          <span className="font-medium text-destructive">Выходной</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Экстренная поддержка
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Критичные инциденты</span>
                          <span className="font-medium">24/7</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Доступно для тарифов</span>
                          <span className="font-medium">Премиум</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Время ответа</span>
                          <span className="font-medium">приоритетно</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Время указано для часового пояса Москвы (UTC+3)
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-muted-foreground">Сейчас в Москве:</span>
                        <span className="font-mono font-semibold">{moscowTime}</span>
                        <Badge variant={isBusinessHours ? "default" : "secondary"} className="gap-1">
                          {isBusinessHours ? <CheckCircle className="h-3 w-3" /> : <Timer className="h-3 w-3" />}
                          {isBusinessHours ? 'Работаем' : 'Не работаем'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
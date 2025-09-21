import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Shield,
  Users,
  Headphones,
  FileText,
  Building2,
  Globe,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Calendar,
  Star
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessSEO } from "@/components/BusinessSEO";

// Схема валидации формы обратной связи
const contactFormSchema = z.object({
  firstName: z.string().min(2, "Минимум 2 символа").max(50, "Максимум 50 символов"),
  lastName: z.string().min(2, "Минимум 2 символа").max(50, "Максимум 50 символов"),
  email: z.string().email("Неверный формат email"),
  phone: z.string().min(10, "Неверный формат телефона").regex(/^[+]?[0-9\s\-\(\)]+$/, "Неверный формат телефона"),
  company: z.string().min(2, "Укажите название компании"),
  position: z.string().min(2, "Укажите должность"),
  industry: z.string().min(1, "Выберите отрасль"),
  subject: z.string().min(1, "Выберите тему обращения"),
  message: z.string().min(10, "Минимум 10 символов").max(1000, "Максимум 1000 символов"),
  urgency: z.string().min(1, "Выберите приоритет"),
  agreementProcessing: z.boolean().refine((val) => val === true, "Необходимо согласие на обработку данных")
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const industries = [
  { value: "banking", label: "Банковские услуги" },
  { value: "fintech", label: "Финтех и платежи" },
  { value: "retail", label: "Ритейл и e-commerce" },
  { value: "healthcare", label: "Медицина и фармацевтика" },
  { value: "government", label: "Государственные услуги" },
  { value: "insurance", label: "Страхование" },
  { value: "education", label: "Образование" },
  { value: "telecom", label: "Телекоммуникации" },
  { value: "other", label: "Другое" }
];

const subjects = [
  { value: "demo", label: "Демо и презентация" },
  { value: "pricing", label: "Коммерческое предложение" },
  { value: "implementation", label: "Вопросы внедрения" },
  { value: "support", label: "Техническая поддержка" },
  { value: "compliance", label: "Консультация по 152фз" },
  { value: "integration", label: "API и интеграция" },
  { value: "partnership", label: "Партнерство" },
  { value: "other", label: "Другое" }
];

const urgencyLevels = [
  { value: "low", label: "Обычный (ответ в течение дня)" },
  { value: "medium", label: "Средний (ответ в течение 4 часов)" },
  { value: "high", label: "Высокий (ответ в течение часа)" },
  { value: "critical", label: "Критический (немедленный ответ)" }
];

export default function BusinessContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      industry: "",
      subject: "",
      message: "",
      urgency: "medium",
      agreementProcessing: false
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Имитация отправки формы
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Сообщение отправлено",
        description: "Мы свяжемся с вами в ближайшее время"
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение. Попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" itemScope itemType="https://schema.org/ContactPage">
      <BusinessSEO 
        title="Контакты и техподдержка — Персональные данные 152фз | ResCrub Business"
        description="Техподдержка 24/7 для защиты персональных данных. Контакты разработчика ResCrub Business, консультации по 152фз, юридическая информация компании."
        pageCategory="contact"
        neuralSignals={{
          primaryKeywords: ['техподдержка персональные данные', 'контакты разработчика 152фз', 'консультации защита данных'],
          searchIntent: 'transactional',
          contentDepth: 'comprehensive',
          expertiseLevel: 7,
          authoritySignals: ['поддержка 24/7', 'персональные консультации', 'юридическая информация']
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['контакты техподдержки персональных данных', 'консультации по 152 фз разработчик', 'поддержка систем защиты данных'],
            semantic: ['техническая поддержка compliance', 'консультации по автоматизации 152фз', 'контакты разработчика GDPR'],
            longTail: ['круглосуточная техподдержка по вопросам защиты персональных данных российских компаний']
          }
        }}
        organizationSchema={{
          name: "ResCrub Business",
          description: "Платформа автоматизации соблюдения 152фз",
          contactPoints: [
            {
              telephone: "+7 (495) 123-45-67",
              contactType: "customer service"
            }
          ]
        }}
      />
      
      <BusinessHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Экспертная поддержка
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Свяжитесь с 
                <span className="text-primary"> экспертами</span>
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto">
                Получите профессиональную консультацию по автоматизации соблюдения 152фз 
                от ведущих экспертов в области защиты персональных данных в России. 
                Мы готовы обсудить ваш проект и подобрать оптимальное решение.
              </p>
              
              <div className="mt-8 flex justify-center">
                <Badge variant="secondary" className="text-sm">
                  ⚡ Ответим в течение 2 часов в рабочее время
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Выберите удобный способ связи
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Мы всегда готовы ответить на ваши вопросы
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-4">
              <Card className="text-center hover-elevate">
                <CardHeader>
                  <div className="mx-auto rounded-lg bg-primary/10 p-3 w-fit">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Телефон</CardTitle>
                  <CardDescription>Прямая связь с экспертами</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-mono text-lg font-semibold">+7 (495) 123-45-67</div>
                    <div className="text-sm text-muted-foreground">Продажи и консультации</div>
                    <div className="font-mono text-sm">+7 (495) 123-45-68</div>
                    <div className="text-sm text-muted-foreground">Техническая поддержка</div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" className="w-full">
                      Заказать звонок
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate">
                <CardHeader>
                  <div className="mx-auto rounded-lg bg-blue-500/10 p-3 w-fit">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Email</CardTitle>
                  <CardDescription>Подробная переписка</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">sales@rescrub.ru</div>
                    <div className="text-sm text-muted-foreground">Коммерческие вопросы</div>
                    <div className="text-sm font-semibold">support@rescrub.ru</div>
                    <div className="text-sm text-muted-foreground">Техническая поддержка</div>
                    <div className="text-sm font-semibold">partners@rescrub.ru</div>
                    <div className="text-sm text-muted-foreground">Партнерство</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate">
                <CardHeader>
                  <div className="mx-auto rounded-lg bg-green-500/10 p-3 w-fit">
                    <MessageSquare className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Онлайн-чат</CardTitle>
                  <CardDescription>Мгновенные ответы</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">Доступен 24/7</div>
                    <div className="text-sm text-muted-foreground">Автоматические ответы + эксперты</div>
                    <div className="text-sm">Среднее время ответа: 2 минуты</div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" className="w-full">
                      Открыть чат
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate">
                <CardHeader>
                  <div className="mx-auto rounded-lg bg-purple-500/10 p-3 w-fit">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Встреча</CardTitle>
                  <CardDescription>Личная консультация</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">Онлайн или офлайн</div>
                    <div className="text-sm text-muted-foreground">Персональная консультация</div>
                    <div className="text-sm">Демонстрация решений</div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" className="w-full">
                      Записаться на встречу
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-7">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Напишите нам</CardTitle>
                    <CardDescription>
                      Заполните форму, и наш эксперт свяжется с вами в течение 2 часов
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Имя *</Label>
                        <Input id="name" placeholder="Ваше имя" data-testid="input-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="email@company.ru" data-testid="input-email" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input id="phone" placeholder="+7 (___) ___-__-__" data-testid="input-phone" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Компания *</Label>
                        <Input id="company" placeholder="Название компании" data-testid="input-company" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="position">Должность</Label>
                        <Input id="position" placeholder="Ваша должность" data-testid="input-position" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Отрасль</Label>
                        <Select>
                          <SelectTrigger data-testid="select-industry">
                            <SelectValue placeholder="Выберите отрасль" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fintech">Финтех и банки</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="healthcare">Медицина</SelectItem>
                            <SelectItem value="education">Образование</SelectItem>
                            <SelectItem value="government">Государственный сектор</SelectItem>
                            <SelectItem value="manufacturing">Производство</SelectItem>
                            <SelectItem value="retail">Ритейл</SelectItem>
                            <SelectItem value="other">Другое</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Тема обращения</Label>
                      <Select>
                        <SelectTrigger data-testid="select-subject">
                          <SelectValue placeholder="Выберите тему" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Консультация по 152фз</SelectItem>
                          <SelectItem value="demo">Демонстрация решений</SelectItem>
                          <SelectItem value="pricing">Тарифы и стоимость</SelectItem>
                          <SelectItem value="integration">Техническая интеграция</SelectItem>
                          <SelectItem value="support">Техническая поддержка</SelectItem>
                          <SelectItem value="partnership">Партнерство</SelectItem>
                          <SelectItem value="other">Другой вопрос</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Сообщение *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Расскажите подробнее о вашей задаче, количестве пользователей, текущих системах и ожиданиях от внедрения ResCrub Business..."
                        className="min-h-32"
                        data-testid="textarea-message"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <input 
                          type="checkbox" 
                          id="consent" 
                          className="mt-1"
                          data-testid="checkbox-consent"
                        />
                        <Label htmlFor="consent" className="text-sm leading-5">
                          Я согласен на обработку персональных данных в соответствии с{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            политикой конфиденциальности
                          </Link>{" "}
                          и даю согласие на получение коммерческих предложений *
                        </Label>
                      </div>
                      
                      <Button 
                          type="submit" 
                          className="w-full" 
                          size="lg" 
                          disabled={isSubmitting}
                          data-testid="button-submit"
                        >
                          {isSubmitting ? "Отправка..." : "Отправить сообщение"}
                        </Button>
                    </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-10 lg:col-span-5 lg:mt-0">
                <div className="space-y-8">
                  {/* Office Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Наш офис
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="font-medium">Адрес</div>
                          <div className="text-sm text-muted-foreground">
                            г. Москва, ул. Тверская, д. 1, офис 100<br />
                            БЦ "Технопарк", 10 этаж
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Метро</div>
                          <div className="text-sm text-muted-foreground">
                            Охотный ряд, Театральная (5 мин пешком)
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Парковка</div>
                          <div className="text-sm text-muted-foreground">
                            Подземная парковка, 2 часа бесплатно для гостей
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Working Hours */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Режим работы
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Понедельник - Пятница</span>
                          <span className="font-medium">09:00 - 19:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Суббота</span>
                          <span className="font-medium">10:00 - 16:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Воскресенье</span>
                          <span className="text-muted-foreground">Выходной</span>
                        </div>
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <div className="text-sm">
                            <div className="font-medium text-green-600">🟢 Чат поддержка: 24/7</div>
                            <div className="text-muted-foreground">Автоответы + дежурные специалисты</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Response Times */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Headphones className="h-5 w-5" />
                        Время ответа
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Коммерческие вопросы</span>
                          <Badge variant="default">2 часа</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Техническая поддержка</span>
                          <Badge variant="default">4 часа</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Партнерские запросы</span>
                          <Badge variant="secondary">1 день</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Критические инциденты</span>
                          <Badge variant="destructive">15 минут</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Наша команда
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="font-medium">15+ экспертов</div>
                          <div className="text-sm text-muted-foreground">
                            Юристы, специалисты по ИБ, разработчики
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">8+ лет опыта</div>
                          <div className="text-sm text-muted-foreground">
                            В области защиты персональных данных
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">500+ проектов</div>
                          <div className="text-sm text-muted-foreground">
                            Успешно реализованных решений
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Частые вопросы
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ответы на самые популярные вопросы наших клиентов
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Сколько времени занимает внедрение?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Стандартное внедрение занимает 2-4 недели. Для enterprise проектов 
                      с кастомными интеграциями - до 8 недель. Простые случаи могут быть 
                      реализованы за 3-5 дней.
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Какие гарантии вы предоставляете?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Мы гарантируем 100% соответствие 152фз, SLA 99.9% для Enterprise клиентов, 
                      возврат средств в течение 30 дней при неудовлетворенности результатом.
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Поддерживаете ли вы интеграцию с нашими системами?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      У нас есть 150+ готовых интеграций и возможность создания 
                      индивидуальных коннекторов для любых систем через REST API, webhooks 
                      или прямые интеграции.
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Можно ли попробовать бесплатно?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Да, мы предоставляем 30-дневный бесплатный период для всех тарифов. 
                      Также доступна demo-версия и персональная консультация без обязательств.
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Где хранятся данные?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Все данные хранятся на территории России в сертифицированных 
                      дата-центрах. Поддерживаем on-premise развертывание и гибридные 
                      cloud решения.
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Какая техническая поддержка включена?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      24/7 чат поддержка, email support, персональный менеджер для Enterprise, 
                      техническая документация, обучающие материалы и регулярные вебинары.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Готовы начать работу?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Получите персональную консультацию и начните автоматизировать compliance уже сегодня
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4">
              <Button size="lg" variant="secondary" className="gap-2">
                <Phone className="h-4 w-4" />
                +7 (495) 123-45-67
              </Button>
              <Link href="/business/register">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2">
                  Начать бесплатно
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex justify-center gap-8 text-sm opacity-75">
              <div>📞 Ответим в течение 2 часов</div>
              <div>🛡️ Бесплатная консультация</div>
              <div>⚡ Быстрый старт проекта</div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
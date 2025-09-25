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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Users, 
  MessageCircle,
  Copy,
  ExternalLink,
  CheckCircle,
  Timer,
  Building,
  Globe,
  Shield,
  Scale,
  Headphones,
  CreditCard,
  FileText
} from "lucide-react";
import { SiTelegram, SiWhatsapp } from "react-icons/si";

// Quick contact form schema (simplified version of support form)
const quickContactSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email адрес"),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
  department: z.string().min(1, "Выберите отдел")
});

type QuickContactData = z.infer<typeof quickContactSchema>;

// Moscow timezone helper
const getMoscowTime = () => {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
};

// Copy to clipboard helper
const copyToClipboard = async (text: string, label: string, toast: any) => {
  try {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: `${label} скопирован в буфер обмена`,
      duration: 2000,
    });
  } catch (err) {
    toast({
      title: "Ошибка копирования",
      description: "Не удалось скопировать в буфер обмена",
      variant: "destructive",
    });
  }
};

export default function Contacts() {
  const [moscowTime, setMoscowTime] = useState<string>('');
  const [isBusinessHours, setIsBusinessHours] = useState(false);
  const { toast } = useToast();

  // Quick contact mutation
  const quickContactMutation = useMutation({
    mutationFn: async (data: QuickContactData) => {
      // Convert to support ticket format
      const supportData = {
        name: data.name,
        email: data.email,
        message: data.message,
        category: data.department,
        priority: "medium",
        subject: "Обращение с страницы Контакты",
      };
      const response = await apiRequest('POST', '/api/support', supportData);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Сообщение отправлено",
        description: "Мы получили ваше сообщение и свяжемся с вами в ближайшее время.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение. Попробуйте еще раз или напишите на info@rescrub.ru",
        variant: "destructive",
      });
    },
  });

  const form = useForm<QuickContactData>({
    resolver: zodResolver(quickContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      department: ""
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
  const onSubmit = async (data: QuickContactData) => {
    quickContactMutation.mutate(data);
  };

  useEffect(() => {
    document.title = "Контакты - ReScrub";
    
    // Add meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Контакты ReScrub - свяжитесь с нами по вопросам защиты персональных данных. Московский офис, телефоны, email, онлайн-чат. Работаем с соблюдением 152-ФЗ.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Контакты ReScrub - свяжитесь с нами по вопросам защиты персональных данных. Московский офис, телефоны, email, онлайн-чат. Работаем с соблюдением 152-ФЗ.';
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
                  <Phone className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Свяжитесь с нами
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Готовы ответить на любые вопросы о защите персональных данных, 152-ФЗ и работе с ReScrub
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="text-muted-foreground">Время в Москве:</span>
                  <span className="font-mono font-semibold">{moscowTime}</span>
                </div>
                <Badge variant={isBusinessHours ? "default" : "secondary"} className="gap-1">
                  {isBusinessHours ? <CheckCircle className="h-3 w-3" /> : <Timer className="h-3 w-3" />}
                  {isBusinessHours ? 'Работаем' : 'Закрыто'}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Main Office Info */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground">
                Московский офис
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Наш главный офис в деловом центре Москвы
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Address & Hours */}
              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Адрес офиса
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-semibold">ИП Гудков Роман Владимирович</p>
                    <p className="text-muted-foreground">
                      Москва, ул. Тверская, 7, стр. 1<br />
                      Бизнес-центр "Тверской Пассаж"<br />
                      этаж 15, офис 1508<br />
                      125009, Россия
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard("Москва, ул. Тверская, 7, стр. 1, 125009", "Адрес", toast)}
                        data-testid="button-copy-address"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Копировать
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        data-testid="link-maps"
                      >
                        <a 
                          href="https://yandex.ru/maps/-/CCUPgPF-lD" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Яндекс.Карты
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Часы работы
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Понедельник - Пятница</span>
                      <span className="font-mono">09:00 - 21:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Суббота</span>
                      <span className="font-mono">10:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Воскресенье</span>
                      <span className="font-mono">Выходной</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      Время московское (МСК/UTC+3)<br />
                      Возможна предварительная запись на встречу
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Departments */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground">
                Отделы и контакты
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Обращайтесь в нужный отдел для быстрого решения вопросов
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* General Info */}
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Общие вопросы</CardTitle>
                  <CardDescription>Основная информация о сервисе</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <a 
                        href="mailto:info@rescrub.ru" 
                        className="text-primary hover:text-primary/80 font-medium"
                        data-testid="link-email-info"
                      >
                        info@rescrub.ru
                      </a>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard("info@rescrub.ru", "Email", toast)}
                        data-testid="button-copy-email-info"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <a 
                        href="tel:+74951234567" 
                        className="text-primary hover:text-primary/80 font-medium"
                        data-testid="link-phone-info"
                      >
                        +7 (495) 123-45-67
                      </a>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard("+74951234567", "Телефон", toast)}
                        data-testid="button-copy-phone-info"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ответы на общие вопросы о защите данных и 152-ФЗ
                  </p>
                </CardContent>
              </Card>

              {/* Sales */}
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Отдел продаж</CardTitle>
                  <CardDescription>Тарифы, подписки, коммерческие вопросы</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <a 
                        href="mailto:sales@rescrub.ru" 
                        className="text-primary hover:text-primary/80 font-medium"
                        data-testid="link-email-sales"
                      >
                        sales@rescrub.ru
                      </a>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard("sales@rescrub.ru", "Email", toast)}
                        data-testid="button-copy-email-sales"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <a 
                        href="tel:+74951234568" 
                        className="text-primary hover:text-primary/80 font-medium"
                        data-testid="link-phone-sales"
                      >
                        +7 (495) 123-45-68
                      </a>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard("+74951234568", "Телефон", toast)}
                        data-testid="button-copy-phone-sales"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Консультации по тарифам и корпоративным решениям
                  </p>
                </CardContent>
              </Card>

              {/* Technical Support */}
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <Headphones className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Техподдержка</CardTitle>
                  <CardDescription>Помощь с аккаунтом и техническими вопросами</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <a 
                        href="mailto:support@rescrub.ru" 
                        className="text-primary hover:text-primary/80 font-medium"
                        data-testid="link-email-support"
                      >
                        support@rescrub.ru
                      </a>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard("support@rescrub.ru", "Email", toast)}
                        data-testid="button-copy-email-support"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <a 
                        href="tel:+78005550123" 
                        className="text-primary hover:text-primary/80 font-medium"
                        data-testid="link-phone-support"
                      >
                        8 (800) 555-01-23
                      </a>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard("88005550123", "Телефон", toast)}
                        data-testid="button-copy-phone-support"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Техническая поддержка 24/7 (звонок бесплатный)
                  </p>
                </CardContent>
              </Card>

              {/* Legal Department */}
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Юридический отдел</CardTitle>
                  <CardDescription>Вопросы права, 152-ФЗ, соответствие</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <a 
                        href="mailto:legal@rescrub.ru" 
                        className="text-primary hover:text-primary/80 font-medium"
                        data-testid="link-email-legal"
                      >
                        legal@rescrub.ru
                      </a>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard("legal@rescrub.ru", "Email", toast)}
                        data-testid="button-copy-email-legal"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <a 
                        href="tel:+74951234569" 
                        className="text-primary hover:text-primary/80 font-medium"
                        data-testid="link-phone-legal"
                      >
                        +7 (495) 123-45-69
                      </a>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard("+74951234569", "Телефон", toast)}
                        data-testid="button-copy-phone-legal"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Юридические консультации по защите персональных данных
                  </p>
                </CardContent>
              </Card>

              {/* Press & Media */}
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Пресс-служба</CardTitle>
                  <CardDescription>СМИ, пресс-релизы, интервью</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <a 
                        href="mailto:press@rescrub.ru" 
                        className="text-primary hover:text-primary/80 font-medium"
                        data-testid="link-email-press"
                      >
                        press@rescrub.ru
                      </a>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard("press@rescrub.ru", "Email", toast)}
                        data-testid="button-copy-email-press"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Запросы СМИ, пресс-материалы и медиа-партнерство
                  </p>
                </CardContent>
              </Card>

              {/* Security Issues */}
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Безопасность</CardTitle>
                  <CardDescription>Уязвимости, вопросы ИБ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <a 
                        href="mailto:security@rescrub.ru" 
                        className="text-primary hover:text-primary/80 font-medium"
                        data-testid="link-email-security"
                      >
                        security@rescrub.ru
                      </a>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard("security@rescrub.ru", "Email", toast)}
                        data-testid="button-copy-email-security"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Сообщить об уязвимости или проблеме безопасности
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Messengers & Social */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground">
                Мессенджеры и соцсети
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Быстрая связь через популярные мессенджеры
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Telegram */}
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 mx-auto mb-4">
                    <SiTelegram className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Telegram</CardTitle>
                  <CardDescription>Быстрые ответы в рабочее время</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Официальный канал:</p>
                    <a 
                      href="https://t.me/rescruboffficial" 
                      className="font-medium text-blue-500 hover:text-blue-400"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="link-telegram-channel"
                    >
                      @rescruboffficial
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Поддержка:</p>
                    <a 
                      href="https://t.me/rescrub_support" 
                      className="font-medium text-blue-500 hover:text-blue-400"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="link-telegram-support"
                    >
                      @rescrub_support
                    </a>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    data-testid="button-telegram-chat"
                  >
                    <a 
                      href="https://t.me/rescrub_support" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Написать в Telegram
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* WhatsApp */}
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 mx-auto mb-4">
                    <SiWhatsapp className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle>WhatsApp</CardTitle>
                  <CardDescription>Персональная поддержка клиентов</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Номер поддержки:</p>
                    <a 
                      href="https://wa.me/79261234567" 
                      className="font-medium text-green-500 hover:text-green-400"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="link-whatsapp-number"
                    >
                      +7 (926) 123-45-67
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Доступно в рабочие часы для платящих клиентов
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    data-testid="button-whatsapp-chat"
                  >
                    <a 
                      href="https://wa.me/79261234567?text=Здравствуйте! У меня вопрос по ReScrub" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Написать в WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Contact Form */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground">
                Быстрая связь
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Оставьте сообщение, и мы свяжемся с вами в ближайшее время
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Отправить сообщение</CardTitle>
                <CardDescription>
                  Все поля обязательны для заполнения
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
                                data-testid="input-quick-contact-name"
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
                                data-testid="input-quick-contact-email"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Выберите отдел</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-quick-contact-department">
                                <SelectValue placeholder="Выберите подходящий отдел" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">Общие вопросы</SelectItem>
                              <SelectItem value="sales">Отдел продаж</SelectItem>
                              <SelectItem value="technical">Техподдержка</SelectItem>
                              <SelectItem value="legal">Юридический отдел</SelectItem>
                              <SelectItem value="press">Пресс-служба</SelectItem>
                              <SelectItem value="security">Безопасность</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ваше сообщение</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Опишите ваш вопрос или пожелание..."
                              className="min-h-[120px]"
                              data-testid="textarea-quick-contact-message"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={quickContactMutation.isPending}
                      className="w-full"
                      data-testid="button-send-quick-contact"
                    >
                      {quickContactMutation.isPending ? "Отправляем..." : "Отправить сообщение"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Legal Info */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-display text-2xl font-semibold tracking-tight text-foreground">
                Реквизиты компании
              </h2>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Полное наименование:</p>
                      <p className="font-medium">Общество с ограниченной ответственностью "РесКраб"</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ОГРН:</p>
                      <p className="font-mono">1137746123456</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ИНН:</p>
                      <p className="font-mono">7707123456</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">КПП:</p>
                      <p className="font-mono">770701001</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Юридический адрес:</p>
                      <p className="font-medium">125009, г. Москва, ул. Тверская, д. 7, стр. 1, офис 1508</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Обработка персональных данных:</p>
                      <p className="text-sm">В соответствии с 152-ФЗ "О персональных данных"</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Документы:</p>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm" asChild data-testid="link-privacy-policy">
                          <a href="/privacy" target="_blank">
                            <FileText className="h-3 w-3 mr-1" />
                            Политика конфиденциальности
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild data-testid="link-terms">
                          <a href="/terms" target="_blank">
                            <Scale className="h-3 w-3 mr-1" />
                            Пользовательское соглашение
                          </a>
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
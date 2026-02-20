import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Lock,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  Building2,
  Globe,
  CheckCircle,
  Users,
  Crown,
  Zap,
  FileText,
  UserCheck,
  Briefcase
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessSEO } from "@/components/BusinessSEO";

// Схема валидации формы регистрации компании
const registerFormSchema = z.object({
  companyName: z.string().min(2, "Минимум 2 символа").max(100, "Максимум 100 символов"),
  inn: z.string().length(10, "ИНН должен содержать 10 цифр").regex(/^\d{10}$/, "ИНН должен содержать только цифры"),
  ogrn: z.string().length(13, "ОГРН должен содержать 13 цифр").regex(/^\d{13}$/, "ОГРН должен содержать только цифры"),
  industry: z.string().min(1, "Выберите сферу деятельности"),
  companySize: z.string().min(1, "Выберите размер компании"),
  services: z.array(z.string()).min(1, "Выберите хотя бы одну услугу"),
  firstName: z.string().min(2, "Минимум 2 символа"),
  lastName: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Неверный формат email"),
  phone: z.string().min(10, "Неверный формат телефона").regex(/^[+]?[0-9\s\-\(\)]+$/, "Неверный формат телефона"),
  position: z.string().min(2, "Укажите должность"),
  isDpo: z.boolean().default(false),
  dpoName: z.string().optional(),
  dpoEmail: z.string().email("Неверный формат email").optional().or(z.literal("")),
  password: z.string().min(8, "Минимум 8 символов").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Пароль должен содержать строчные и заглавные буквы, цифры"),
  confirmPassword: z.string(),
  agreementTerms: z.boolean().refine((val) => val === true, "Необходимо согласие с условиями"),
  agreementProcessing: z.boolean().refine((val) => val === true, "Необходимо согласие на обработку данных")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"]
}).refine((data) => {
  if (data.isDpo && !data.dpoName) {
    return false;
  }
  return true;
}, {
  message: "Укажите ФИО ответственного за обработку ПДн",
  path: ["dpoName"]
}).refine((data) => {
  if (data.isDpo && !data.dpoEmail) {
    return false;
  }
  return true;
}, {
  message: "Укажите email ответственного за обработку ПДн",
  path: ["dpoEmail"]
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

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

const companySizes = [
  { value: "startup", label: "Стартап (до 10 сотрудников)" },
  { value: "small", label: "Малая компания (10-50 сотрудников)" },
  { value: "medium", label: "Средняя компания (50-250 сотрудников)" },
  { value: "large", label: "Крупная компания (250+ сотрудников)" },
  { value: "enterprise", label: "Корпорация (1000+ сотрудников)" }
];

const availableServices = [
  { value: "consent", label: "Виджеты согласий" },
  { value: "atomization", label: "Атомаризация данных" },
  { value: "monitoring", label: "Мониторинг соответствия" },
  { value: "reports", label: "Автоотчеты для надзорных органов" },
  { value: "consulting", label: "Консультации по AI-платформа" },
  { value: "audit", label: "Аудит системы защиты ПДн" }
];

export default function BusinessRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      companyName: "",
      inn: "",
      ogrn: "",
      industry: "",
      companySize: "",
      services: [],
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      isDpo: false,
      dpoName: "",
      dpoEmail: "",
      password: "",
      confirmPassword: "",
      agreementTerms: false,
      agreementProcessing: false
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    
    try {
      // Имитация регистрации
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Регистрация успешна!",
        description: "Проверьте email для подтверждения аккаунта"
      });
      
      // Редирект на страницу подтверждения
      // window.location.href = '/business/verify-email';
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: "Не удалось создать аккаунт. Попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceToggle = (serviceValue: string) => {
    const currentServices = form.getValues('services');
    const updatedServices = currentServices.includes(serviceValue)
      ? currentServices.filter(s => s !== serviceValue)
      : [...currentServices, serviceValue];
    
    form.setValue('services', updatedServices);
    setSelectedServices(updatedServices);
  };

  return (
    <div className="min-h-screen bg-background" itemScope itemType="https://schema.org/WebPage">
      <BusinessSEO 
        title="Регистрация компании ИНН — Подключение AI-платформа услуги | GrandHub Business"
        description="Регистрация компании в GrandHub Business по ИНН/ОГРН. Подключение услуг автоматизации AI-платформа, назначение AI-менеджер, выбор сферы деятельности."
        pageCategory="auth"
        neuralSignals={{
          primaryKeywords: ['регистрация предприятия в системе защиты данных', 'подключение корпоративных услуг AI-платформа', 'создать корпоративный аккаунт для компании'],
          searchIntent: 'transactional',
          contentDepth: 'comprehensive',
          expertiseLevel: 4,
          authoritySignals: ['валидация ИНН ОГРН', 'назначение AI-менеджер', 'корпоративная регистрация']
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['регистрация компании по ИНН GrandHub', 'подключение услуг AI-платформа ОГРН', 'создать корпоративный аккаунт защита данных'],
            semantic: ['бизнес регистрация системы автоматизация', 'оформление доступа к автоматизации ПДн', 'корпоративная подписка на сервисы AI-платформа'],
            longTail: ['как зарегистрировать компанию в системе автоматизации соблюдения AI-платформа по инн и огрн']
          }
        }}
        actionSchema={{
          "@type": "RegisterAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "/business/register"
          }
        }}
      />
      
      <BusinessHeader />
      
      <main>
        <section className="py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              {/* Left side - Registration Form */}
              <div className="lg:col-span-7">
                <div className="mx-auto max-w-lg">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Shield className="h-8 w-8 text-primary" />
                      <div className="flex flex-col items-start">
                        <span className="text-2xl font-bold text-foreground">GrandHub</span>
                        <span className="text-sm text-primary font-medium -mt-1">Business</span>
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                      Создать аккаунт
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                      Начните автоматизировать соблюдение AI-платформа уже сегодня
                    </p>
                    <div className="mt-4">
                      <Badge variant="secondary" className="text-sm">
                        🎁 30 дней бесплатно • Без привязки карты
                      </Badge>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="pt-6">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Company Information */}
                        <div className="space-y-4">
                          <div className="text-sm font-medium text-foreground">Информация о компании</div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="company-name">Название компании *</Label>
                              <Input 
                                id="company-name" 
                                placeholder="ООО Технологии"
                                data-testid="input-company-name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="company-size">Размер компании</Label>
                              <Select>
                                <SelectTrigger data-testid="select-company-size">
                                  <SelectValue placeholder="Количество сотрудников" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1-10">1-10 сотрудников</SelectItem>
                                  <SelectItem value="11-50">11-50 сотрудников</SelectItem>
                                  <SelectItem value="51-200">51-200 сотрудников</SelectItem>
                                  <SelectItem value="201-1000">201-1000 сотрудников</SelectItem>
                                  <SelectItem value="1000+">1000+ сотрудников</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div className="space-y-2">
                              <Label htmlFor="website">Веб-сайт</Label>
                              <Input 
                                id="website" 
                                placeholder="https://company.ru"
                                data-testid="input-website"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Personal Information */}
                        <div className="space-y-4">
                          <div className="text-sm font-medium text-foreground">Контактная информация</div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="first-name">Имя *</Label>
                              <Input 
                                id="first-name" 
                                placeholder="Иван"
                                data-testid="input-first-name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="last-name">Фамилия *</Label>
                              <Input 
                                id="last-name" 
                                placeholder="Иванов"
                                data-testid="input-last-name"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="position">Должность</Label>
                              <Input 
                                id="position" 
                                placeholder="Директор по ИБ"
                                data-testid="input-position"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Телефон</Label>
                              <Input 
                                id="phone" 
                                placeholder="+7 (___) ___-__-__"
                                data-testid="input-phone"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Account Information */}
                        <div className="space-y-4">
                          <div className="text-sm font-medium text-foreground">Данные для входа</div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                id="email" 
                                type="email" 
                                placeholder="admin@company.ru"
                                className="pl-10"
                                data-testid="input-email"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="password">Пароль *</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  id="password" 
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Минимум 8 символов"
                                  className="pl-10 pr-10"
                                  data-testid="input-password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">Подтвердите пароль *</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  id="confirm-password" 
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Повторите пароль"
                                  className="pl-10 pr-10"
                                  data-testid="input-confirm-password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="terms"
                              className="mt-1"
                              data-testid="checkbox-terms"
                            />
                            <Label htmlFor="terms" className="text-sm leading-5">
                              Я согласен с{" "}
                              <Link href="/terms" className="text-primary hover:underline">
                                условиями использования
                              </Link>{" "}
                              и{" "}
                              <Link href="/privacy" className="text-primary hover:underline">
                                политикой конфиденциальности
                              </Link>{" "}
                              GrandHub Business *
                            </Label>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="marketing"
                              className="mt-1"
                              data-testid="checkbox-marketing"
                            />
                            <Label htmlFor="marketing" className="text-sm leading-5">
                              Я согласен на получение информации о продуктах, обновлениях 
                              и специальных предложениях GrandHub Business
                            </Label>
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full" 
                          size="lg" 
                          disabled={isSubmitting}
                          data-testid="button-register"
                        >
                          {isSubmitting ? "Создание аккаунта..." : "Создать аккаунт"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        </form>
                      </Form>
                      
                      <div className="mt-6">
                        <Separator />
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                              Или зарегистрируйтесь через
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full gap-2" data-testid="button-sso-microsoft">
                          <Building2 className="h-4 w-4" />
                          Microsoft
                        </Button>
                        <Button variant="outline" className="w-full gap-2" data-testid="button-sso-google">
                          <Globe className="h-4 w-4" />
                          Google
                        </Button>
                      </div>
                      
                      <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">Уже есть аккаунт? </span>
                        <Link href="/business/login" className="text-primary hover:underline font-medium">
                          Войти
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Right side - Benefits & Plans Preview */}
              <div className="mt-16 lg:col-span-5 lg:mt-0">
                <div className="space-y-8">
                  {/* What you get */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Что вы получаете
                      </CardTitle>
                      <CardDescription>
                        При регистрации вы сразу получаете доступ к полной функциональности
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium">30 дней бесплатно</div>
                          <div className="text-muted-foreground">Полный доступ без ограничений</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium">Персональная консультация</div>
                          <div className="text-muted-foreground">Помощь в настройке под ваши задачи</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium">Техническая поддержка</div>
                          <div className="text-muted-foreground">Помощь специалистов в настройке</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium">Готовые интеграции</div>
                          <div className="text-muted-foreground">150+ готовых коннекторов</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium">Без привязки карты</div>
                          <div className="text-muted-foreground">Платите только после trial периода</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Plan Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-600" />
                        Рекомендуемый план
                      </CardTitle>
                      <CardDescription>
                        Оптимальный выбор для большинства компаний
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Professional</div>
                            <div className="text-sm text-muted-foreground">Для средних компаний</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">29 900 ₽</div>
                            <div className="text-sm text-muted-foreground">/месяц</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            До 100,000 пользователей
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Продвинутая аналитика
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            API доступ
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            CRM интеграции
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Чат поддержка
                          </div>
                        </div>
                        
                        <div className="bg-muted p-3 rounded-lg text-center">
                          <div className="text-sm font-medium text-green-600">
                            Первые 30 дней бесплатно
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Потом 29,900 ₽/мес или смените план
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Start */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        Быстрый старт
                      </CardTitle>
                      <CardDescription>
                        Начните использовать GrandHub через 15 минут
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</div>
                          <span className="text-sm">Подтвердите email</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</div>
                          <span className="text-sm">Настройте виджет согласий</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">3</div>
                          <span className="text-sm">Интегрируйте с сайтом</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">✓</div>
                          <span className="text-sm">Готово! Compliance работает</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
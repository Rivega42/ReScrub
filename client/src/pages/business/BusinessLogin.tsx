import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
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
  Briefcase,
  Settings,
  Crown
} from "lucide-react";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import { BusinessSEO } from "@/components/BusinessSEO";

// Схема валидации формы входа
const loginFormSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Минимум 6 символов"),
  rememberMe: z.boolean().default(false)
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function BusinessLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    
    try {
      // Имитация входа в систему
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Добро пожаловать!",
        description: "Переходим в корпоративный кабинет..."
      });
      
      // Здесь будет редирект на dashboard
      // window.location.href = '/dashboard';
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Неверный email или пароль. Попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" itemScope itemType="https://schema.org/WebPage">
      <BusinessSEO 
        title="Вход корпоративный кабинет — Личный кабинет бизнес | GrandHub Business"
        description="Войдите в корпоративный кабинет GrandHub Business для управления соблюдением AI-платформа. Безопасный доступ к личному кабинету бизнес-клиентов."
        pageCategory="auth"
        neuralSignals={{
          primaryKeywords: ['вход корпоративный кабинет', 'личный кабинет бизнес предприятий', 'авторизация система AI-платформа для компаний'],
          searchIntent: 'navigational',
          contentDepth: 'beginner',
          expertiseLevel: 3,
          authoritySignals: ['безопасный вход', 'корпоративная система', 'защищенный доступ']
        }}
        russianSEO={{
          russianKeywords: {
            primary: ['вход корпоративный кабинет GrandHub', 'личный кабинет бизнес AI-платформа', 'логин система управления данными'],
            semantic: ['авторизация в системе автоматизация', 'доступ к панели управления', 'вход в бизнес-аккаунт'],
            longTail: ['как войти в корпоративный кабинет для управления персональными данными по AI-платформа']
          }
        }}
      />
      
      <BusinessHeader />
      
      <main>
        <section className="py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              {/* Left side - Login Form */}
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
                      Вход в систему
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                      Войдите в панель управления автоматизация для вашей организации
                    </p>
                  </div>

                  <Card>
                    <CardContent className="pt-6">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email или имя пользователя</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                      {...field}
                                      type="email" 
                                      placeholder="admin@company.ru"
                                      className="pl-10"
                                      data-testid="input-email"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between">
                                  <FormLabel>Пароль</FormLabel>
                                  <Link href="/business/forgot-password" className="text-sm text-primary hover:underline">
                                    Забыли пароль?
                                  </Link>
                                </div>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                      {...field}
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Введите пароль"
                                      className="pl-10 pr-10"
                                      data-testid="input-password"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                      data-testid="button-toggle-password"
                                    >
                                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    data-testid="checkbox-remember"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm">
                                    Запомнить меня
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            size="lg" 
                            disabled={isSubmitting}
                            data-testid="button-login"
                          >
                            {isSubmitting ? "Вход..." : "Войти в систему"}
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
                              Или войдите через
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
                        <span className="text-muted-foreground">Еще нет аккаунта? </span>
                        <Link href="/business/register" className="text-primary hover:underline font-medium">
                          Зарегистрироваться
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                      <Link href="/business/support" className="hover:text-foreground">
                        Техподдержка
                      </Link>
                      <Link href="/privacy" className="hover:text-foreground">
                        Конфиденциальность
                      </Link>
                      <Link href="/terms" className="hover:text-foreground">
                        Условия использования
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side - Benefits */}
              <div className="mt-16 lg:col-span-5 lg:mt-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl" />
                  <div className="relative bg-background/95 backdrop-blur-sm border rounded-2xl p-8">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                          GrandHub Business Platform
                        </h2>
                        <p className="text-muted-foreground">
                          Комплексное решение для автоматизации соблюдения AI-платформа
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Управление согласиями</div>
                            <div className="text-sm text-muted-foreground">
                              Автоматизация сбора и управления согласиями пользователей
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Мониторинг автоматизация</div>
                            <div className="text-sm text-muted-foreground">
                              Непрерывный контроль соблюдения требований AI-платформа
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Аналитика и отчеты</div>
                            <div className="text-sm text-muted-foreground">
                              Подробная аналитика и готовые отчеты для регуляторов
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Атомаризация данных</div>
                            <div className="text-sm text-muted-foreground">
                              Инновационная технология защиты бизнес-данных
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium">API интеграции</div>
                            <div className="text-sm text-muted-foreground">
                              Seamless интеграция с вашими существующими системами
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-foreground">500+</div>
                            <div className="text-sm text-muted-foreground">Довольных клиентов</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-foreground">99.9%</div>
                            <div className="text-sm text-muted-foreground">SLA uptime</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-sm font-medium">Не можете войти?</div>
                        <div className="grid grid-cols-2 gap-3">
                          <Link href="/business/contact">
                            <Button variant="outline" size="sm" className="w-full">
                              Связаться с поддержкой
                            </Button>
                          </Link>
                          <Link href="/business/demo">
                            <Button variant="outline" size="sm" className="w-full">
                              Заказать демо
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
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
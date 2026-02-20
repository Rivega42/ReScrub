import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Eye, EyeOff, Shield, Building, CreditCard, Search, MessageCircle, Bot, Brain, Zap, Lock } from "lucide-react";
import { SiVk, SiTelegram } from "react-icons/si";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/hooks/use-toast';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';

type FormMode = 'login' | 'register' | 'recovery' | 'check-email';

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

const passwordValidation = z.string()
  .min(8, 'Минимум 8 символов')
  .refine(password => /[A-Z]/.test(password), 'Должна быть хотя бы одна заглавная буква')
  .refine(password => /[a-z]/.test(password), 'Должна быть хотя бы одна строчная буква')
  .refine(password => /\d/.test(password), 'Должна быть хотя бы одна цифра')
  .refine(password => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password), 'Должен быть хотя бы один специальный символ');

const phoneValidation = z.string()
  .min(10, 'Минимум 10 цифр')
  .refine(phone => /^(\+7|8)[\s\-]?(\([0-9]{3}\)|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(phone.replace(/\s/g, '')), 'Введите корректный российский номер телефона');

const emailValidation = z.string()
  .email('Введите корректный email адрес')
  .refine(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Email должен содержать домен');

const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, 'Введите пароль'),
  remember: z.boolean().optional()
});

const registerSchema = z.object({
  firstName: z.string().min(2, 'Минимум 2 символа'),
  lastName: z.string().min(2, 'Минимум 2 символа'),
  email: emailValidation,
  phone: phoneValidation,
  password: passwordValidation,
  confirmPassword: z.string(),
  agree: z.boolean().refine(val => val === true, 'Необходимо согласие с условиями')
}).refine(data => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"]
});

const recoverySchema = z.object({
  email: z.string().email('Введите корректный email')
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type RecoveryFormData = z.infer<typeof recoverySchema>;

// GrandHub animated logo for login
function GrandHubLogo() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Pulse rings */}
      <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
      <div className="absolute inset-4 rounded-full border border-primary/15 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
      <div className="absolute inset-8 rounded-full border border-primary/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
      
      {/* Core cube */}
      <div className="relative z-10 w-24 h-24 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))' }}>
          {/* Back face */}
          <polygon points="50,15 85,35 85,65 50,85 15,65 15,35" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/30" />
          {/* Front face */}
          <polygon points="50,20 80,37 80,63 50,80 20,63 20,37" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
            <animate attributeName="stroke-dashoffset" from="300" to="0" dur="2s" fill="freeze" />
          </polygon>
          {/* Inner lines */}
          <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="1" className="text-primary/40" />
          <line x1="20" y1="37" x2="80" y2="63" stroke="currentColor" strokeWidth="1" className="text-primary/40" />
          <line x1="80" y1="37" x2="20" y2="63" stroke="currentColor" strokeWidth="1" className="text-primary/40" />
          {/* Center dot */}
          <circle cx="50" cy="50" r="3" className="fill-primary">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Orbiting icons */}
      {[
        { Icon: Brain, angle: 0, label: 'AI' },
        { Icon: Zap, angle: 90, label: 'Fast' },
        { Icon: Lock, angle: 180, label: 'Secure' },
        { Icon: Bot, angle: 270, label: 'Smart' },
      ].map(({ Icon, angle }, i) => (
        <div
          key={i}
          className="absolute w-8 h-8 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center"
          style={{
            top: `${50 - 42 * Math.cos((angle * Math.PI) / 180)}%`,
            left: `${50 + 42 * Math.sin((angle * Math.PI) / 180)}%`,
            transform: 'translate(-50%, -50%)',
            animation: `float 3s ease-in-out infinite ${i * 0.5}s`
          }}
        >
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      ))}
    </div>
  );
}

export default function Login() {
  const [mode, setMode] = useState<FormMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTelegramLoading, setIsTelegramLoading] = useState(false);
  
  const [, setLocation] = useLocation();
  const { login, register: registerUser, isAuthenticated, setAuth } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/app/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  // Load Telegram Widget Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    document.body.appendChild(script);

    window.onTelegramAuth = async (user: any) => {
      try {
        setIsTelegramLoading(true);
        setError('');
        const response = await fetch('/api/v1/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error?.message || 'Ошибка авторизации через Telegram');
        }
        const { accessToken, refreshToken } = result.data;
        localStorage.setItem('token', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (setAuth) setAuth({ token: accessToken, user: null });
        toast({ title: 'Добро пожаловать!', description: 'Вы вошли в GrandHub' });
        setLocation('/app/dashboard');
      } catch (err: any) {
        setError(err.message || 'Ошибка авторизации через Telegram');
        toast({ title: 'Ошибка', description: err.message || 'Не удалось войти через Telegram', variant: 'destructive' });
      } finally {
        setIsTelegramLoading(false);
      }
    };

    return () => {
      document.body.removeChild(script);
      delete window.onTelegramAuth;
    };
  }, [toast, setLocation, setAuth]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false }
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', agree: false }
  });

  const watchedPassword = registerForm.watch('password');

  const recoveryForm = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { email: '' }
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setError(''); setIsLoading(true);
      await login(data.email, data.password);
      toast({ title: 'Добро пожаловать!', description: 'Вы вошли в GrandHub' });
    } catch (error: any) {
      setError(error.message || 'Ошибка входа');
    } finally { setIsLoading(false); }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setError(''); setIsLoading(true);
      await registerUser(data.email, data.password);
      toast({ title: 'Аккаунт создан', description: 'Проверьте email для подтверждения' });
      setMode('check-email');
    } catch (error: any) {
      setError(error.message || 'Ошибка регистрации');
    } finally { setIsLoading(false); }
  };

  const onRecoverySubmit = async (data: RecoveryFormData) => {
    try {
      setError(''); setIsLoading(true);
      toast({ title: 'Инструкции отправлены', description: 'Проверьте email' });
      setMode('login');
    } catch (error: any) {
      setError(error.message || 'Ошибка восстановления');
    } finally { setIsLoading(false); }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Войти в GrandHub';
      case 'register': return 'Создать аккаунт';
      case 'recovery': return 'Восстановление пароля';
      case 'check-email': return 'Проверьте почту';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Ваш персональный AI-помощник ждёт';
      case 'register': return 'Присоединяйтесь к GrandHub';
      case 'recovery': return 'Мы отправим инструкции на ваш email';
      case 'check-email': return 'Мы отправили письмо с подтверждением на ваш email';
    }
  };

  const oauthProviders = [
    { id: 'esia', name: 'Госуслуги', icon: Shield, color: 'text-blue-600' },
    { id: 'sberbank', name: 'Сбербанк ID', icon: CreditCard, color: 'text-green-600' },
    { id: 'tbank', name: 'Т-Банк ID', icon: Building, color: 'text-yellow-600' },
    { id: 'vk', name: 'VK ID', icon: SiVk, color: 'text-blue-500' },
    { id: 'yandex', name: 'Yandex ID', icon: Search, color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel - GrandHub branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-muted/30 border-r border-border flex-col items-center justify-center p-12">
        <GrandHubLogo />
        
        <div className="mt-8 text-center max-w-md">
          <h2 className="text-3xl font-semibold text-foreground mb-3">
            GrandHub
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Персональный AI-помощник, который знает тебя и работает для тебя
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            {[
              { icon: Brain, text: '12 навыков из коробки' },
              { icon: Lock, text: 'Полная конфиденциальность' },
              { icon: Zap, text: 'Мгновенные ответы' },
              { icon: Bot, text: 'Растёт вместе с вами' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
                <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              На главную
            </Link>
          </Button>

          <Card className="border-border shadow-sm bg-background/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center">
              {/* Mobile logo */}
              <div className="lg:hidden flex justify-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-semibold">{getTitle()}</CardTitle>
              <p className="text-sm text-muted-foreground">{getSubtitle()}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Telegram Login - PRIMARY */}
              {(mode === 'login' || mode === 'register') && (
                <div 
                  className="flex items-center justify-center w-full p-3 rounded-lg bg-[#0088cc] hover:bg-[#0077b3] text-white font-medium cursor-pointer transition-colors"
                  onClick={() => {
                    // Trigger Telegram widget
                    const iframe = document.querySelector('iframe[src*="telegram"]') as HTMLIFrameElement;
                    if (iframe) iframe.click();
                  }}
                >
                  <SiTelegram className="h-5 w-5 mr-2" />
                  {isTelegramLoading ? 'Вход...' : 'Войти через Telegram'}
                  <script
                    async
                    src="https://telegram.org/js/telegram-widget.js?22"
                    data-telegram-login="Grandhub_bot"
                    data-size="large"
                    data-onauth="onTelegramAuth(user)"
                    data-request-access="write"
                  />
                </div>
              )}

              {/* Login form */}
              {mode === 'login' && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">или email</span>
                    </div>
                  </div>

                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" {...loginForm.register('email')} />
                      {loginForm.formState.errors.email && <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Пароль</Label>
                      <div className="relative">
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="********" className="pr-8" {...loginForm.register('password')} />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <Button type="button" variant="ghost" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      {loginForm.formState.errors.password && <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Controller name="remember" control={loginForm.control} render={({ field }) => (
                          <Checkbox id="remember" checked={field.value} onCheckedChange={field.onChange} />
                        )} />
                        <Label htmlFor="remember" className="text-sm">Запомнить меня</Label>
                      </div>
                      <Button type="button" variant="ghost" className="p-0 h-auto text-sm text-foreground hover:text-muted-foreground" onClick={() => setMode('recovery')}>Забыли пароль?</Button>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Вход...' : 'Войти'}</Button>
                  </form>
                </>
              )}

              {/* OAuth buttons */}
              {(mode === 'login' || mode === 'register') && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">скоро</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {oauthProviders.map((provider) => {
                      const IconComp = provider.icon;
                      return (
                        <Button key={provider.id} variant="outline" className="w-full opacity-50 cursor-not-allowed" disabled>
                          <IconComp className="h-4 w-4 mr-2" />
                          {provider.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Register form */}
              {mode === 'register' && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">или email</span>
                    </div>
                  </div>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Имя</Label>
                        <Input id="firstName" placeholder="Иван" {...registerForm.register('firstName')} />
                        {registerForm.formState.errors.firstName && <p className="text-sm text-destructive">{registerForm.formState.errors.firstName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Фамилия</Label>
                        <Input id="lastName" placeholder="Иванов" {...registerForm.register('lastName')} />
                        {registerForm.formState.errors.lastName && <p className="text-sm text-destructive">{registerForm.formState.errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-reg">Email</Label>
                      <Input id="email-reg" type="email" placeholder="your@email.com" {...registerForm.register('email')} />
                      {registerForm.formState.errors.email && <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input id="phone" type="tel" placeholder="+7 (999) 123-45-67" {...registerForm.register('phone')} />
                      {registerForm.formState.errors.phone && <p className="text-sm text-destructive">{registerForm.formState.errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-reg">Пароль</Label>
                      <div className="relative">
                        <Input id="password-reg" type={showPassword ? "text" : "password"} placeholder="********" className="pr-8" {...registerForm.register('password')} />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <Button type="button" variant="ghost" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      {registerForm.formState.errors.password && <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>}
                      {watchedPassword && <PasswordStrengthIndicator password={watchedPassword} className="mt-2" />}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Подтверждение</Label>
                      <div className="relative">
                        <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="********" className="pr-8" {...registerForm.register('confirmPassword')} />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <Button type="button" variant="ghost" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      {registerForm.formState.errors.confirmPassword && <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>}
                    </div>
                    <div className="flex items-start space-x-2">
                      <Controller name="agree" control={registerForm.control} render={({ field }) => (
                        <Checkbox id="agree" checked={field.value} onCheckedChange={field.onChange} />
                      )} />
                      <Label htmlFor="agree" className="text-sm leading-normal">
                        Я согласен с <Link href="/terms" className="underline underline-offset-4 hover:text-muted-foreground">условиями</Link> и <Link href="/privacy" className="underline underline-offset-4 hover:text-muted-foreground">политикой конфиденциальности</Link>
                      </Label>
                    </div>
                    {registerForm.formState.errors.agree && <p className="text-sm text-destructive">{registerForm.formState.errors.agree.message}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Создание...' : 'Создать аккаунт'}</Button>
                  </form>
                </>
              )}

              {/* Recovery form */}
              {mode === 'recovery' && (
                <form onSubmit={recoveryForm.handleSubmit(onRecoverySubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-recovery">Email</Label>
                    <Input id="email-recovery" type="email" placeholder="your@email.com" {...recoveryForm.register('email')} />
                    {recoveryForm.formState.errors.email && <p className="text-sm text-destructive">{recoveryForm.formState.errors.email.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Отправка...' : 'Отправить инструкции'}</Button>
                </form>
              )}

              {/* Check email screen */}
              {mode === 'check-email' && (
                <div className="space-y-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Не получили? Проверьте спам или напишите support@grandhub.ru</p>
                  <Button className="w-full" onClick={() => setMode('login')}>Перейти к входу</Button>
                </div>
              )}

              {/* Mode switch */}
              <div className="text-center text-sm text-muted-foreground">
                {mode === 'login' && (
                  <p>Нет аккаунта? <Button type="button" variant="ghost" className="p-0 h-auto text-sm underline underline-offset-4" onClick={() => setMode('register')}>Регистрация</Button></p>
                )}
                {mode === 'register' && (
                  <p>Уже есть аккаунт? <Button type="button" variant="ghost" className="p-0 h-auto text-sm underline underline-offset-4" onClick={() => setMode('login')}>Войти</Button></p>
                )}
                {(mode === 'recovery' || mode === 'check-email') && (
                  <p><Button type="button" variant="ghost" className="p-0 h-auto text-sm underline underline-offset-4" onClick={() => setMode('login')}>Вернуться к входу</Button></p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

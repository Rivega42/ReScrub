import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Eye, EyeOff, Shield, Building, CreditCard, Search, MessageCircle } from "lucide-react";
import { SiVk } from "react-icons/si";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/hooks/use-toast';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import heroShieldImage from '@assets/generated_images/ResCrub_hero_shield_illustration_17021890.png';

type FormMode = 'login' | 'register' | 'recovery' | 'check-email';

// Схемы валидации

// Сильная валидация пароля
const passwordValidation = z.string()
  .min(8, 'Минимум 8 символов')
  .refine(password => /[A-Z]/.test(password), 'Должна быть хотя бы одна заглавная буква')
  .refine(password => /[a-z]/.test(password), 'Должна быть хотя бы одна строчная буква')
  .refine(password => /\d/.test(password), 'Должна быть хотя бы одна цифра')
  .refine(password => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password), 'Должен быть хотя бы один специальный символ');

// Улучшенная валидация телефона
const phoneValidation = z.string()
  .min(10, 'Минимум 10 цифр')
  .refine(phone => /^(\+7|8)[\s\-]?(\([0-9]{3}\)|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(phone.replace(/\s/g, '')), 'Введите корректный российский номер телефона');

// Улучшенная валидация email  
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

export default function Login() {
  const [mode, setMode] = useState<FormMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [, setLocation] = useLocation();
  const { login, register: registerUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/app/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  // Мемоизируем позиции частиц для избежания пересчета при рендере
  const particlePositions = useMemo(() => 
    Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2
    })), []);

  // Паралакс эффект
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setParallaxOffset(scrolled * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Формы
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false }
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '',
      password: '', confirmPassword: '', agree: false
    }
  });

  const watchedPassword = registerForm.watch('password');

  const recoveryForm = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { email: '' }
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setIsLoading(true);
      
      await login(data.email, data.password);
      
      toast({
        title: 'Успешный вход',
        description: 'Добро пожаловать в ReScrub!',
      });
      
      // Don't navigate immediately - let useEffect handle it after auth state updates
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка входа';
      setError(errorMessage);
      
      if (errorMessage.includes('подтвердите email')) {
        toast({
          title: 'Требуется подтверждение',
          description: 'Проверьте email для подтверждения аккаунта',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      setIsLoading(true);
      
      await registerUser(data.email, data.password);
      
      toast({
        title: 'Аккаунт создан',
        description: 'Проверьте email для подтверждения аккаунта',
      });
      
      // Switch to check-email mode to show instructions
      setMode('check-email');
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка регистрации';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onRecoverySubmit = async (data: RecoveryFormData) => {
    try {
      setError('');
      setIsLoading(true);
      
      // TODO: Implement password recovery API
      toast({
        title: 'Инструкции отправлены',
        description: 'Проверьте email для восстановления пароля',
      });
      
      setMode('login');
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка восстановления пароля';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Добро пожаловать в ResCrub';
      case 'register': return 'Создать аккаунт';
      case 'recovery': return 'Восстановление пароля';
      case 'check-email': return 'Проверьте вашу почту';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Войдите в свой аккаунт для управления защитой данных';
      case 'register': return 'Начните защищать свои персональные данные уже сегодня';
      case 'recovery': return 'Мы отправим инструкции по восстановлению на ваш email';
      case 'check-email': return 'Мы отправили письмо с подтверждением на ваш email адрес. Проверьте почту и перейдите по ссылке для активации аккаунта.';
    }
  };

  // OAuth handlers - redirect to backend OAuth endpoints
  const handleOAuthLogin = (providerId: string) => {
    console.log(`OAuth login with ${providerId}`);
    // Redirect to backend OAuth start endpoint
    window.location.href = `/api/oauth/${providerId}/start`;
  };

  // OAuth providers data
  const oauthProviders = [
    {
      id: 'esia',
      name: 'Госуслуги',
      icon: Shield,
      color: 'text-blue-600',
      testId: 'button-oauth-esia'
    },
    {
      id: 'sberbank',
      name: 'Сбербанк ID',
      icon: CreditCard,
      color: 'text-green-600',
      testId: 'button-oauth-sberbank'
    },
    {
      id: 'tbank',
      name: 'Т-Банк ID',
      icon: Building,
      color: 'text-yellow-600',
      testId: 'button-oauth-tbank'
    },
    {
      id: 'vk',
      name: 'VK ID',
      icon: SiVk,
      color: 'text-blue-500',
      testId: 'button-oauth-vk'
    },
    {
      id: 'yandex',
      name: 'Yandex ID',
      icon: Search,
      color: 'text-red-500',
      testId: 'button-oauth-yandex'
    }
  ];

  // OAuth buttons component
  const OAuthButtons = () => (
    <div className="space-y-4">
      {/* Разделитель */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">или</span>
        </div>
      </div>

      {/* OAuth кнопки */}
      <div className="grid grid-cols-1 gap-3">
        {oauthProviders.map((provider) => {
          const IconComponent = provider.icon;
          return (
            <Button
              key={provider.id}
              variant="outline"
              className="w-full cursor-not-allowed bg-muted text-muted-foreground border-muted hover:bg-muted hover:text-muted-foreground hover:border-muted"
              onClick={(e) => e.preventDefault()}
              data-testid={provider.testId}
              disabled={true}
            >
              <IconComponent className="h-4 w-4 mr-2 text-muted-foreground" />
              Войти через {provider.name}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Левая половина - Cal.com style с крабом и паралакс эффектом */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-muted/30 border-r border-border">
        {/* Паралакс изображение */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translateY(${parallaxOffset}px)`
          }}
        >
          <img 
            src={heroShieldImage} 
            alt="Защита персональных данных" 
            className="w-full max-w-lg h-auto object-contain filter drop-shadow-lg opacity-80"
          />
        </div>
        
        {/* Цифровые частицы в нейтральных тонах */}
        <div className="absolute inset-0 pointer-events-none">
          {particlePositions.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-muted-foreground/30 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `float 3s ease-in-out infinite ${particle.delay}s`
              }}
            />
          ))}
        </div>

        {/* Текст на изображении - Cal.com style */}
        <div className="absolute bottom-8 left-8 right-8">
          <h2 className="text-display text-3xl font-semibold text-foreground mb-2">
            Защитите свои данные
          </h2>
          <p className="text-base text-muted-foreground">
            Автоматическое удаление персональной информации с сайтов брокеров данных
          </p>
        </div>
      </div>

      {/* Правая половина - формы */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Кнопка назад - Cal.com style */}
          <Button 
            variant="ghost" 
            className="mb-6"
            data-testid="button-back-home"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              На главную
            </Link>
          </Button>

          <Card className="border-border shadow-sm">
            <CardHeader className="space-y-4 text-center">
              <CardTitle className="text-display text-2xl font-semibold">
                {getTitle()}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {getSubtitle()}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive" data-testid="alert-error">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {/* Форма входа */}
              {mode === 'login' && (
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      data-testid="input-login-email"
                      {...loginForm.register('email')}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        data-testid="input-login-password"
                        {...loginForm.register('password')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="remember"
                        control={loginForm.control}
                        render={({ field }) => (
                          <Checkbox 
                            id="remember" 
                            data-testid="checkbox-remember"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="remember" className="text-sm">Запомнить меня</Label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-0 h-auto text-sm text-foreground hover:text-muted-foreground"
                      onClick={() => setMode('recovery')}
                      data-testid="button-forgot-password"
                    >
                      Забыли пароль?
                    </Button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-login-submit"
                  >
                    {isLoading ? 'Вход...' : 'Войти'}
                  </Button>
                </form>
              )}

              {/* OAuth кнопки для входа и регистрации */}
              {(mode === 'login' || mode === 'register') && (
                <OAuthButtons />
              )}

              {/* Форма регистрации */}
              {mode === 'register' && (
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">Имя</Label>
                      <Input
                        id="firstName"
                        placeholder="Иван"
                        data-testid="input-register-firstname"
                        {...registerForm.register('firstName')}
                      />
                      {registerForm.formState.errors.firstName && (
                        <p className="text-sm text-destructive">
                          {registerForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">Фамилия</Label>
                      <Input
                        id="lastName"
                        placeholder="Иванов"
                        data-testid="input-register-lastname"
                        {...registerForm.register('lastName')}
                      />
                      {registerForm.formState.errors.lastName && (
                        <p className="text-sm text-destructive">
                          {registerForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-reg" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email-reg"
                      type="email"
                      placeholder="your@email.com"
                      data-testid="input-register-email"
                      {...registerForm.register('email')}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      data-testid="input-register-phone"
                      {...registerForm.register('phone')}
                    />
                    {registerForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-reg" className="text-sm font-medium">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="password-reg"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        data-testid="input-register-password"
                        {...registerForm.register('password')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                        data-testid="button-toggle-password-register"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                    {/* Индикатор сложности пароля */}
                    {watchedPassword && (
                      <PasswordStrengthIndicator 
                        password={watchedPassword} 
                        className="mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Подтверждение пароля</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        data-testid="input-register-confirm-password"
                        {...registerForm.register('confirmPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        data-testid="button-toggle-confirm-password-register"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Controller
                      name="agree"
                      control={registerForm.control}
                      render={({ field }) => (
                        <Checkbox 
                          id="agree" 
                          data-testid="checkbox-agree"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label htmlFor="agree" className="text-sm leading-normal">
                      Я согласен с{' '}
                      <Link href="/terms" className="text-foreground hover:text-muted-foreground underline underline-offset-4">
                        условиями использования
                      </Link>{' '}
                      и{' '}
                      <Link href="/privacy" className="text-foreground hover:text-muted-foreground underline underline-offset-4">
                        политикой конфиденциальности
                      </Link>
                    </Label>
                  </div>
                  {registerForm.formState.errors.agree && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.agree.message}
                    </p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-register-submit"
                  >
                    {isLoading ? 'Создание...' : 'Создать аккаунт'}
                  </Button>
                </form>
              )}

              {/* Форма восстановления пароля */}
              {mode === 'recovery' && (
                <form onSubmit={recoveryForm.handleSubmit(onRecoverySubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-recovery" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email-recovery"
                      type="email"
                      placeholder="your@email.com"
                      data-testid="input-recovery-email"
                      {...recoveryForm.register('email')}
                    />
                    {recoveryForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {recoveryForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-recovery-submit"
                  >
                    {isLoading ? 'Отправка...' : 'Отправить инструкции'}
                  </Button>
                </form>
              )}

              {/* Экран проверки email после регистрации */}
              {mode === 'check-email' && (
                <div className="space-y-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Проверьте папку "Спам" если письмо не пришло в основную папку.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Не получили письмо? Обратитесь в техподдержку: <strong>support@rescrub.ru</strong>
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    className="w-full"
                    onClick={() => setMode('login')}
                    data-testid="button-goto-login"
                  >
                    Перейти к входу
                  </Button>
                </div>
              )}

              {/* Переключение между режимами - Cal.com style */}
              <div className="text-center text-sm text-muted-foreground">
                {mode === 'login' && (
                  <p>
                    Нет аккаунта?{' '}
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-0 h-auto text-sm text-foreground hover:text-muted-foreground underline underline-offset-4"
                      onClick={() => setMode('register')}
                      data-testid="button-switch-register"
                    >
                      Регистрация
                    </Button>
                  </p>
                )}
                {mode === 'register' && (
                  <p>
                    Уже есть аккаунт?{' '}
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-0 h-auto text-sm text-foreground hover:text-muted-foreground underline underline-offset-4"
                      onClick={() => setMode('login')}
                      data-testid="button-switch-login"
                    >
                      Войти
                    </Button>
                  </p>
                )}
                {mode === 'recovery' && (
                  <p>
                    Вспомнили пароль?{' '}
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-0 h-auto text-sm text-foreground hover:text-muted-foreground underline underline-offset-4"
                      onClick={() => setMode('login')}
                      data-testid="button-switch-login-from-recovery"
                    >
                      Войти
                    </Button>
                  </p>
                )}
                {mode === 'check-email' && (
                  <p>
                    Уже подтвердили email?{' '}
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-0 h-auto text-sm text-foreground hover:text-muted-foreground underline underline-offset-4"
                      onClick={() => setMode('login')}
                      data-testid="button-switch-login-from-check-email"
                    >
                      Войти
                    </Button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
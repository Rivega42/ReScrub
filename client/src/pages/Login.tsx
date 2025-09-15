import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import crabImage from '@assets/generated_images/Red_pixel_crab_sweeping_documents_b0d5ab08.png';

type FormMode = 'login' | 'register' | 'recovery';

// Схемы валидации
const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
  remember: z.boolean().optional()
});

const registerSchema = z.object({
  firstName: z.string().min(2, 'Минимум 2 символа'),
  lastName: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  password: z.string().min(8, 'Минимум 8 символов'),
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

  const recoveryForm = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { email: '' }
  });

  const onLoginSubmit = (data: LoginFormData) => {
    // TODO: Интеграция с API аутентификации
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    // TODO: Интеграция с API регистрации
  };

  const onRecoverySubmit = (data: RecoveryFormData) => {
    // TODO: Интеграция с API восстановления пароля
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Добро пожаловать в ResCrub';
      case 'register': return 'Создать аккаунт';
      case 'recovery': return 'Восстановление пароля';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Войдите в свой аккаунт для управления защитой данных';
      case 'register': return 'Начните защищать свои персональные данные уже сегодня';
      case 'recovery': return 'Мы отправим инструкции по восстановлению на ваш email';
    }
  };

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
            src={crabImage} 
            alt="Красный пиксельный краб подметает документы" 
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
                        className="absolute right-2 top-1/2 -translate-y-1/2"
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
                    data-testid="button-login-submit"
                  >
                    Войти
                  </Button>
                </form>
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
                        className="absolute right-2 top-1/2 -translate-y-1/2"
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
                        className="absolute right-2 top-1/2 -translate-y-1/2"
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
                    data-testid="button-register-submit"
                  >
                    Создать аккаунт
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
                    data-testid="button-recovery-submit"
                  >
                    Отправить инструкции
                  </Button>
                </form>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
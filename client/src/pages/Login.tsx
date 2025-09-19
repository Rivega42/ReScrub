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
import crabImage from '@assets/generated_images/Red_pixel_crab_sweeping_documents_b0d5ab08.png';

type FormMode = 'login' | 'register' | 'recovery' | 'check-email';

// Схемы валидации
const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
  remember: z.boolean().optional()
});

// Сильная валидация пароля
const passwordValidation = z.string()
  .min(8, 'Минимум 8 символов')
  .refine(password => /[A-Z]/.test(password), 'Должна быть хотя бы одна заглавная буква')
  .refine(password => /[a-z]/.test(password), 'Должна быть хотя бы одна строчная буква')
  .refine(password => /\d/.test(password), 'Должна быть хотя бы одна цифра')
  .refine(password => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password), 'Должен быть хотя бы один специальный символ');

const registerSchema = z.object({
  firstName: z.string().min(2, 'Минимум 2 символа'),
  lastName: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
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
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Состояния для крабика-наблюдателя
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  
  const [, setLocation] = useLocation();
  const { login, register: registerUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/app/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  // Формы
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agree: false
    }
  });

  const recoveryForm = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: ''
    }
  });

  // Обработчики форм
  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login(data.email, data.password);
      setLocation('/app/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка входа';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone
      });
      
      toast({
        title: 'Регистрация успешна!',
        description: 'Проверьте вашу почту для подтверждения аккаунта',
      });
      
      setMode('check-email');
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка регистрации';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onRecoverySubmit = async (data: RecoveryFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Здесь будет запрос на восстановление пароля
      console.log('Password recovery for:', data.email);
      
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Кнопки навигации */}
        <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
          <Link href="/" className="inline-flex items-center hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Регистрация
          </Link>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="p-0 h-auto text-sm"
              onClick={() => setMode('recovery')}
            >
              Забыли пароль?
            </Button>
            <Link href="/support" className="hover:text-foreground">
              Служба поддержки
            </Link>
          </div>
        </div>

        {/* Заголовок с крабом */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-muted-foreground mb-4">
            {mode === 'login' ? 'Вход в ResCrub' : 
             mode === 'register' ? 'Регистрация в ResCrub' :
             mode === 'recovery' ? 'Забыли пароль?' : 'Проверьте почту'}
          </h1>
          
          {/* Краб-наблюдатель */}
          <div className="relative mb-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-blue-100 border-4 border-blue-200 flex items-center justify-center relative overflow-hidden">
              <img 
                src={crabImage} 
                alt="Красный краб следит за безопасностью" 
                className={`w-20 h-20 object-contain transition-transform duration-300 ${
                  isPasswordFocused ? 'scale-110' : 'scale-100'
                }`}
              />
              
              {/* Глаза крабика следят за полями */}
              {(isEmailFocused || isPasswordFocused) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className={`absolute w-2 h-2 bg-red-600 rounded-full transition-transform duration-200 ${
                      isEmailFocused ? '-translate-x-1 -translate-y-1' : 
                      isPasswordFocused ? 'translate-x-1 translate-y-1' : 'translate-x-0 translate-y-0'
                    }`} style={{ top: '10px', left: '15px' }} />
                    <div className={`absolute w-2 h-2 bg-red-600 rounded-full transition-transform duration-200 ${
                      isEmailFocused ? '-translate-x-1 -translate-y-1' : 
                      isPasswordFocused ? 'translate-x-1 translate-y-1' : 'translate-x-0 translate-y-0'
                    }`} style={{ top: '10px', right: '15px' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Форма входа */}
        {mode === 'login' && (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive" data-testid="alert-error">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg font-medium text-primary">Логин</Label>
              <Input
                id="email"
                type="email"
                placeholder="имя_пользователя@компания"
                className="h-12 text-lg border-2 border-primary/20 focus:border-primary rounded-md"
                data-testid="input-login-email"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                {...loginForm.register('email')}
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg font-medium text-primary">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="h-12 text-lg border-2 border-primary/20 focus:border-primary rounded-md pr-12"
                  data-testid="input-login-password"
                  onFocus={() => setIsPasswordFocused(true)}
                  {...loginForm.register('password', {
                    onBlur: () => setIsPasswordFocused(false)
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2 pt-2">
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
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                Нажимая на кнопку, я даю согласие на обработку своих персональных данных
                и подтверждаю, что с положением об обработке персональных данных ознакомлен.
              </Label>
            </div>

            <p className="text-sm text-muted-foreground">
              Используя сервис, вы соглашаетесь с условиями договора-оферты.
            </p>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-cyan-500 hover:bg-cyan-600 text-white rounded-md"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        )}

        {/* Форма регистрации упрощённая */}
        {mode === 'register' && (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive" data-testid="alert-error">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-lg font-medium text-primary">Имя</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Иван"
                  className="h-12 text-lg border-2 border-primary/20 focus:border-primary rounded-md"
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
                <Label htmlFor="lastName" className="text-lg font-medium text-primary">Фамилия</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Иванов"
                  className="h-12 text-lg border-2 border-primary/20 focus:border-primary rounded-md"
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
              <Label htmlFor="email-reg" className="text-lg font-medium text-primary">Email</Label>
              <Input
                id="email-reg"
                type="email"
                placeholder="your@email.com"
                className="h-12 text-lg border-2 border-primary/20 focus:border-primary rounded-md"
                data-testid="input-register-email"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                {...registerForm.register('email')}
              />
              {registerForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-lg font-medium text-primary">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                className="h-12 text-lg border-2 border-primary/20 focus:border-primary rounded-md"
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
              <Label htmlFor="password-reg" className="text-lg font-medium text-primary">Пароль</Label>
              <div className="relative">
                <Input
                  id="password-reg"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 text-lg border-2 border-primary/20 focus:border-primary rounded-md pr-12"
                  data-testid="input-register-password"
                  onFocus={() => setIsPasswordFocused(true)}
                  {...registerForm.register('password', {
                    onBlur: () => setIsPasswordFocused(false)
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password-register"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
              {registerForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-lg font-medium text-primary">Подтверждение пароля</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 text-lg border-2 border-primary/20 focus:border-primary rounded-md pr-12"
                  data-testid="input-register-confirm-password"
                  {...registerForm.register('confirmPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  data-testid="button-toggle-confirm-password"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2 pt-2">
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
              <Label htmlFor="agree" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                Я согласен с условиями использования и политикой конфиденциальности
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-cyan-500 hover:bg-cyan-600 text-white rounded-md"
              disabled={isLoading}
              data-testid="button-register"
            >
              {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт'}
            </Button>
          </form>
        )}

        {/* Форма восстановления пароля */}
        {mode === 'recovery' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Введите Вашу электронную почту, указанную при регистрации
              </p>
              <p className="text-sm text-muted-foreground">
                И всю необходимую информацию мы отправим Вам на нее
              </p>
            </div>
            
            <form onSubmit={recoveryForm.handleSubmit(onRecoverySubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive" data-testid="alert-error">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Input
                  id="recovery-email"
                  type="email"
                  placeholder="your@email.com"
                  className="h-12 text-lg border-2 border-primary/20 focus:border-primary rounded-md"
                  data-testid="input-recovery-email"
                  onFocus={() => setIsEmailFocused(true)}
                  {...recoveryForm.register('email', {
                    onBlur: () => setIsEmailFocused(false)
                  })}
                />
                {recoveryForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {recoveryForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-cyan-500 hover:bg-cyan-600 text-white rounded-md"
                disabled={isLoading}
                data-testid="button-recovery"
              >
                {isLoading ? 'Отправка...' : 'Вспомнить всё'}
              </Button>
            </form>
          </div>
        )}

        {/* Сообщение о проверке email */}
        {mode === 'check-email' && (
          <div className="text-center space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">
                Проверьте вашу почту и перейдите по ссылке для подтверждения регистрации
              </p>
            </div>
            <Button 
              variant="outline" 
              type="button" 
              className="w-full"
              onClick={() => setMode('login')}
              data-testid="button-goto-login"
            >
              Перейти к входу
            </Button>
          </div>
        )}

        {/* Переключение между режимами */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          {mode === 'login' && (
            <p>
              Нет аккаунта?{' '}
              <Button
                type="button"
                variant="ghost"
                className="p-0 h-auto text-sm text-primary hover:text-primary/80 underline underline-offset-4"
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
                className="p-0 h-auto text-sm text-primary hover:text-primary/80 underline underline-offset-4"
                onClick={() => setMode('login')}
                data-testid="button-switch-login"
              >
                Войти
              </Button>
            </p>
          )}
          {mode === 'recovery' && (
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-primary hover:text-primary/80 underline underline-offset-4"
              onClick={() => setMode('register')}
              data-testid="button-goto-register"
            >
              Регистрация
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
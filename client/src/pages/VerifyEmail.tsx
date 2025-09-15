import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/hooks/use-toast';

type VerificationState = 'loading' | 'success' | 'error' | 'expired';

export default function VerifyEmail() {
  const [state, setState] = useState<VerificationState>('loading');
  const [message, setMessage] = useState('');
  const [, setLocation] = useLocation();
  const { verifyEmail } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Get token and email from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');

        if (!token || !email) {
          setState('error');
          setMessage('Отсутствует токен подтверждения или email в ссылке');
          return;
        }

        // Verify the email
        await verifyEmail(email, token);
        
        setState('success');
        setMessage('Email успешно подтвержден! Теперь вы можете войти в систему.');
        
        toast({
          title: 'Email подтвержден',
          description: 'Ваш аккаунт активирован. Добро пожаловать в ReScrub!',
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          setLocation('/login');
        }, 3000);

      } catch (error: any) {
        console.error('Email verification error:', error);
        setState('error');
        
        if (error.message?.includes('истек')) {
          setState('expired');
          setMessage('Токен подтверждения истек. Пожалуйста, зарегистрируйтесь заново.');
        } else {
          setMessage(error.message || 'Ошибка подтверждения email. Проверьте ссылку.');
        }
      }
    };

    verifyToken();
  }, [verifyEmail, setLocation, toast]);

  const getIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="h-16 w-16 text-primary animate-spin" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'error':
      case 'expired':
        return <XCircle className="h-16 w-16 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (state) {
      case 'loading':
        return 'Подтверждение email...';
      case 'success':
        return 'Email подтвержден!';
      case 'expired':
        return 'Токен истек';
      case 'error':
        return 'Ошибка подтверждения';
    }
  };

  const getAlertVariant = () => {
    switch (state) {
      case 'success':
        return 'default';
      case 'error':
      case 'expired':
        return 'destructive' as const;
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        {/* Back button */}
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
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center">
              {getIcon()}
            </div>
            <CardTitle className="text-display text-2xl font-semibold">
              {getTitle()}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <Alert variant={getAlertVariant()} data-testid="alert-verification-result">
              <AlertDescription className="text-center">
                {message}
              </AlertDescription>
            </Alert>

            {state === 'loading' && (
              <p className="text-sm text-muted-foreground">
                Пожалуйста, подождите...
              </p>
            )}

            {state === 'success' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Вы будете автоматически перенаправлены на страницу входа через несколько секунд.
                </p>
                <Button asChild className="w-full" data-testid="button-go-login">
                  <Link href="/login">
                    Войти в систему
                  </Link>
                </Button>
              </div>
            )}

            {(state === 'error' || state === 'expired') && (
              <div className="space-y-4">
                {state === 'expired' && (
                  <Button asChild className="w-full" data-testid="button-register-again">
                    <Link href="/login">
                      Зарегистрироваться заново
                    </Link>
                  </Button>
                )}
                
                {state === 'error' && (
                  <div className="space-y-2">
                    <Button asChild className="w-full" data-testid="button-try-login">
                      <Link href="/login">
                        Попробовать войти
                      </Link>
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Если проблема повторяется, обратитесь в{' '}
                      <Link href="/support" className="text-foreground hover:text-muted-foreground underline underline-offset-4">
                        службу поддержки
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
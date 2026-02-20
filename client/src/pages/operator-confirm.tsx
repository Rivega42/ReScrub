import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useParams } from "wouter";
import { ArrowLeft, CheckCircle, XCircle, Loader2, Shield, AlertTriangle } from "lucide-react";
import { useAutoSEO } from '@/hooks/useSEO';

type ConfirmationState = 
  | 'loading' 
  | 'success' 
  | 'invalid_token' 
  | 'token_not_found' 
  | 'token_already_used' 
  | 'network_error' 
  | 'server_error';

interface ConfirmationData {
  deletionRequestId?: string;
  confirmedAt?: string;
  usedAt?: string;
}

export default function OperatorConfirm() {
  const [state, setState] = useState<ConfirmationState>('loading');
  const [message, setMessage] = useState('');
  const [data, setData] = useState<ConfirmationData>({});
  const params = useParams();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  // SEO configuration
  useAutoSEO({
    title: 'Подтверждение удаления персональных данных — ReScruB',
    description: 'Подтверждение выполнения запроса на удаление персональных данных оператором. Безопасная система подтверждений ReScruB.',
    keywords: ['подтверждение удаления', 'персональные данные', 'оператор', 'GDPR', 'ФЗ-152'],
    type: 'website'
  });

  useEffect(() => {
    const confirmToken = async () => {
      if (!token || typeof token !== 'string') {
        setState('invalid_token');
        setMessage('Отсутствует токен подтверждения в ссылке');
        return;
      }

      try {
        const response = await fetch(`/api/operator/confirm/${encodeURIComponent(token)}`, {
          method: 'GET',
          credentials: 'include',
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setState('success');
          setMessage('Подтверждение принято и обработано');
          setData({
            deletionRequestId: result.data?.deletionRequestId,
            confirmedAt: result.data?.confirmedAt
          });
        } else {
          // Handle specific error codes based on API response
          switch (result.error) {
            case 'INVALID_TOKEN':
              setState('invalid_token');
              setMessage('Ссылка недействительна или истекла');
              break;
            case 'TOKEN_NOT_FOUND':
              setState('token_not_found');
              setMessage('Указанный токен не существует в системе');
              break;
            case 'TOKEN_ALREADY_USED':
              setState('token_already_used');
              setMessage('Данное подтверждение уже получено');
              setData({ usedAt: result.usedAt });
              break;
            case 'INTERNAL_ERROR':
              setState('server_error');
              setMessage('Произошла ошибка сервера. Попробуйте позже');
              break;
            default:
              setState('server_error');
              setMessage(result.message || 'Произошла неизвестная ошибка');
          }
        }
      } catch (error) {
        console.error('Operator confirmation error:', error);
        setState('network_error');
        setMessage('Ошибка соединения. Проверьте подключение к интернету и попробуйте позже');
      }
    };

    confirmToken();
  }, [token]);

  const getIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="h-16 w-16 text-primary animate-spin" data-testid="icon-loading" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" data-testid="icon-success" />;
      case 'token_already_used':
        return <AlertTriangle className="h-16 w-16 text-yellow-500" data-testid="icon-already-used" />;
      case 'invalid_token':
      case 'token_not_found':
      case 'network_error':
      case 'server_error':
        return <XCircle className="h-16 w-16 text-red-500" data-testid="icon-error" />;
    }
  };

  const getTitle = () => {
    switch (state) {
      case 'loading':
        return 'Проверка подтверждения...';
      case 'success':
        return 'Подтверждение принято!';
      case 'token_already_used':
        return 'Подтверждение уже получено';
      case 'invalid_token':
        return 'Ссылка недействительна';
      case 'token_not_found':
        return 'Токен не найден';
      case 'network_error':
        return 'Ошибка соединения';
      case 'server_error':
        return 'Ошибка сервера';
    }
  };

  const getAlertVariant = () => {
    switch (state) {
      case 'success':
        return 'default';
      case 'token_already_used':
        return 'default';
      case 'invalid_token':
      case 'token_not_found':
      case 'network_error':
      case 'server_error':
        return 'destructive' as const;
      default:
        return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const isError = ['invalid_token', 'token_not_found', 'network_error', 'server_error'].includes(state);
  const showSupportInfo = isError || state === 'token_already_used';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
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
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>ReScruB — Защита персональных данных</span>
              </div>
              <CardTitle className="text-display text-2xl font-semibold" data-testid="title-confirmation">
                {getTitle()}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            {state !== 'loading' && (
              <Alert variant={getAlertVariant()} data-testid="alert-confirmation-result">
                <AlertDescription className="text-center">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {state === 'loading' && (
              <p className="text-sm text-muted-foreground" data-testid="text-loading">
                Пожалуйста, подождите пока система проверяет подтверждение...
              </p>
            )}

            {state === 'success' && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Дата подтверждения:</span>
                    <span className="font-medium" data-testid="text-confirmed-date">
                      {formatDate(data.confirmedAt)}
                    </span>
                  </div>
                  {data.deletionRequestId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID запроса:</span>
                      <span className="font-mono text-xs" data-testid="text-request-id">
                        {data.deletionRequestId.substring(0, 8)}...
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    ✓ Ваше подтверждение получено и зафиксировано в системе
                  </p>
                  <p>
                    ✓ Информация сохранена для соблюдения требований ФЗ-152
                  </p>
                  <p>
                    ✓ Запрос на удаление данных отмечен как выполненный
                  </p>
                </div>
              </div>
            )}

            {state === 'token_already_used' && data.usedAt && (
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Использован:</span>
                  <span className="font-medium" data-testid="text-used-date">
                    {formatDate(data.usedAt)}
                  </span>
                </div>
              </div>
            )}

            {showSupportInfo && (
              <div className="space-y-4">
                {(state === 'network_error' || state === 'server_error') && (
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="w-full"
                    data-testid="button-retry"
                  >
                    Попробовать снова
                  </Button>
                )}
                
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>
                    Если проблема повторяется, обратитесь в{' '}
                    <Link href="/support" className="text-foreground hover:text-muted-foreground underline underline-offset-4">
                      службу поддержки
                    </Link>
                  </p>
                  <p>
                    Или напишите на{' '}
                    <a 
                      href="mailto:support@grandhub.ru" 
                      className="text-foreground hover:text-muted-foreground underline underline-offset-4"
                      data-testid="link-support-email"
                    >
                      support@grandhub.ru
                    </a>
                  </p>
                </div>
              </div>
            )}

            {state === 'success' && (
              <div className="pt-4 border-t">
                <Button asChild variant="outline" className="w-full" data-testid="button-visit-site">
                  <Link href="/">
                    Перейти на сайт ReScruB
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional info footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Система подтверждений ReScruB обеспечивает безопасность и соответствие требованиям ФЗ-152 «О персональных данных»
          </p>
        </div>
      </div>
    </div>
  );
}
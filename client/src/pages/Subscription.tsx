import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Crown, 
  Shield, 
  Zap, 
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  AlertTriangle
} from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  intervalCount: number;
  isActive: boolean;
  features: string[];
}

interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'pending' | 'active' | 'cancelled' | 'suspended';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: SubscriptionPlan;
}

export default function Subscription() {
  const { toast } = useToast();

  // Загрузка доступных планов
  const { data: plans = [], isLoading: plansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['/api/subscription-plans'],
  });

  // Загрузка текущей подписки пользователя
  const { data: currentSubscription, isLoading: subscriptionLoading } = useQuery<UserSubscription | null>({
    queryKey: ['/api/my-subscription'],
  });

  // Мутация для создания подписки
  const createSubscriptionMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка создания подписки');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.paymentUrl) {
        // Перенаправляем на Robokassa для оплаты
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Мутация для отмены подписки
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка отмены подписки');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-subscription'] });
      toast({
        title: "Подписка отменена",
        description: "Подписка будет отменена в конце текущего периода",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (planId: string) => {
    createSubscriptionMutation.mutate(planId);
  };

  const handleCancelSubscription = () => {
    cancelSubscriptionMutation.mutate();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Активна
        </Badge>;
      case 'pending':
        return <Badge variant="secondary">
          <RefreshCw className="w-3 h-3 mr-1" />
          Ожидание
        </Badge>;
      case 'cancelled':
        return <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Отменена
        </Badge>;
      case 'suspended':
        return <Badge variant="destructive">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Приостановлена
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (plansLoading || subscriptionLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-subscription-title">Подписка</h1>
        <p className="text-muted-foreground">Управление вашим планом защиты данных</p>
      </div>

      {/* Текущая подписка */}
      {currentSubscription && (
        <Card data-testid="card-current-subscription">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Текущая подписка</h3>
                  <p className="text-sm text-muted-foreground">{currentSubscription.plan.displayName}</p>
                </div>
              </div>
              {getStatusBadge(currentSubscription.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Стоимость:</span>
                <p className="font-medium">{currentSubscription.plan.price} {currentSubscription.plan.currency} / {currentSubscription.plan.interval}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Следующее списание:</span>
                <p className="font-medium">{formatDate(currentSubscription.currentPeriodEnd)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Начало периода:</span>
                <p className="font-medium">{formatDate(currentSubscription.currentPeriodStart)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Автопродление:</span>
                <p className="font-medium">{currentSubscription.cancelAtPeriodEnd ? 'Отключено' : 'Включено'}</p>
              </div>
            </div>

            {currentSubscription.status === 'active' && !(currentSubscription.cancelAtPeriodEnd ?? false) && (
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  onClick={handleCancelSubscription}
                  disabled={cancelSubscriptionMutation.isPending}
                  data-testid="button-cancel-subscription"
                >
                  {cancelSubscriptionMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Отменить подписку
                </Button>
              </div>
            )}

            {currentSubscription.cancelAtPeriodEnd && (
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-orange-800 dark:text-orange-200">Подписка будет отменена</p>
                    <p className="text-orange-700 dark:text-orange-300">
                      Доступ к сервису сохранится до {formatDate(currentSubscription.currentPeriodEnd)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Доступные планы */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Доступные планы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative" data-testid={`card-plan-${plan.name}`}>
              {plan.name === 'premium' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Crown className="w-3 h-3 mr-1" />
                    Популярный
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="text-center">
                  <h3 className="text-xl font-bold">{plan.displayName}</h3>
                  <p className="text-2xl font-bold mt-2">
                    {plan.price} <span className="text-sm font-normal text-muted-foreground">{plan.currency}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">за {plan.interval}</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">{plan.description}</p>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Включено:
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {plan.name === 'basic' && (
                      <>
                        <li>• Сканирование 50+ сайтов</li>
                        <li>• Базовые запросы на удаление</li>
                        <li>• Ежемесячные отчеты</li>
                        <li>• Email поддержка</li>
                      </>
                    )}
                    {plan.name === 'premium' && (
                      <>
                        <li>• Сканирование 200+ сайтов</li>
                        <li>• Приоритетные запросы на удаление</li>
                        <li>• Еженедельные отчеты</li>
                        <li>• Мониторинг в реальном времени</li>
                        <li>• Приоритетная поддержка</li>
                        <li>• Защита семьи (до 5 человек)</li>
                      </>
                    )}
                    {plan.name === 'enterprise' && (
                      <>
                        <li>• Сканирование 500+ сайтов</li>
                        <li>• Персональный менеджер</li>
                        <li>• API доступ</li>
                        <li>• Кастомные интеграции</li>
                        <li>• SLA 99.9%</li>
                        <li>• 24/7 поддержка</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <Button 
                  className="w-full mt-4"
                  variant={plan.name === 'premium' ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={
                    createSubscriptionMutation.isPending || 
                    (currentSubscription && 'planId' in currentSubscription && currentSubscription.planId === plan.id && currentSubscription.status === 'active')
                  }
                  data-testid={`button-subscribe-${plan.name}`}
                >
                  {createSubscriptionMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  {(currentSubscription && 'planId' in currentSubscription && currentSubscription.planId === plan.id && currentSubscription.status === 'active')
                    ? 'Текущий план'
                    : 'Выбрать план'
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Информация об оплате */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Безопасная оплата
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Платежная система:</span>
            <span className="font-medium">Robokassa</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Поддерживаемые методы:</span>
            <span className="font-medium">Банковские карты, СБП, электронные кошельки</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Защита данных:</span>
            <span className="font-medium">SSL шифрование, PCI DSS</span>
          </div>
          
          <Separator />
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Платеж обрабатывается через защищенный шлюз Robokassa</p>
            <p>• Ваши банковские данные не сохраняются на наших серверах</p>
            <p>• Возможна отмена подписки в любое время</p>
            <p>• При отмене доступ сохраняется до конца оплаченного периода</p>
          </div>
          
          <div className="flex justify-center pt-2">
            <Link href="/terms">
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-3 h-3 mr-1" />
                Условия использования
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Bell,
  Plus,
  Activity,
  Eye,
  Users,
  Link,
  Copy,
  Share2,
  Gift,
  TrendingUp
} from "lucide-react";

interface DeletionRequest {
  id: string;
  userId: string;
  dataBroker?: {
    name: string;
    website: string;
    category: string;
  };
  status: 'pending' | 'sent' | 'processing' | 'completed' | 'rejected' | 'failed';
  createdAt: string;
  completedAt?: string;
  followUpRequired: boolean;
  responseReceived: boolean;
}

interface Notification {
  id: string;
  userId: string;
  type: 'deletion_update' | 'document_required' | 'scan_complete' | 'follow_up';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalRewards: number;
  activeCode?: string;
}

interface PointsBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

interface UserSubscription {
  id: string;
  planId: string;
  status: 'active' | 'pending' | 'cancelled' | 'suspended';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: {
    displayName: string;
    price: number;
  };
}

const statusConfig = {
  pending: { label: 'В ожидании', color: 'secondary', icon: Clock },
  sent: { label: 'Отправлен', color: 'default', icon: Activity },
  processing: { label: 'Обрабатывается', color: 'default', icon: Activity },
  completed: { label: 'Выполнен', color: 'default', icon: CheckCircle },
  rejected: { label: 'Отклонен', color: 'destructive', icon: AlertTriangle },
  failed: { label: 'Ошибка', color: 'destructive', icon: AlertTriangle },
} as const;

export default function Dashboard() {
  const { toast } = useToast();

  // Fetch deletion requests
  const { data: deletionRequests = [], isLoading: requestsLoading, error: requestsError } = useQuery<DeletionRequest[]>({
    queryKey: ['/api/deletion-requests'],
    enabled: true,
  });

  // Fetch notifications (unread only for dashboard summary)
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery<Notification[]>({
    queryKey: ['/api/notifications', { unread: true }],
    enabled: true,
  });

  const allNotifications = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
    enabled: true,
  });

  // Fetch referral stats
  const { data: referralStats, isLoading: statsLoading } = useQuery<ReferralStats>({
    queryKey: ['/api/referrals/stats'],
    enabled: true,
  });

  // Fetch points balance
  const { data: pointsBalance, isLoading: pointsLoading } = useQuery<PointsBalance>({
    queryKey: ['/api/points'],
    enabled: true,
  });

  // Fetch user subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery<UserSubscription | null>({
    queryKey: ['/api/subscription'],
    enabled: true,
  });

  // Generate referral code mutation
  const generateCodeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/referrals/generate', {});
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/referrals/stats'] });
      toast({
        title: "Реферальный код создан!",
        description: `Ваш код: ${(data as any)?.code || 'Создан'}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать реферальный код",
        variant: "destructive",
      });
    },
  });

  // Copy referral link function
  const copyReferralLink = async () => {
    if (!referralStats?.activeCode) {
      toast({
        title: "Нет активного кода",
        description: "Создайте реферальный код",
        variant: "destructive",
      });
      return;
    }

    const link = `${window.location.origin}/invite/${referralStats.activeCode}`;
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Ссылка скопирована!",
        description: "Поделитесь ссылкой с друзьями",
      });
    } catch (err) {
      toast({
        title: "Ошибка копирования",
        description: "Попробуйте скопировать вручную",
        variant: "destructive",
      });
    }
  };

  // Social share functions
  const shareToTelegram = () => {
    if (!referralStats?.activeCode) return;
    const link = `${window.location.origin}/invite/${referralStats.activeCode}`;
    const text = encodeURIComponent("Я уже защитил свои данные и получил приватность! Присоединяйся - получи 30% скидку!");
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`, '_blank');
  };

  const shareToVK = () => {
    if (!referralStats?.activeCode) return;
    const link = `${window.location.origin}/invite/${referralStats.activeCode}`;
    const text = encodeURIComponent("Я уже защитил свои данные и получил приватность! Присоединяйся - получи 30% скидку!");
    window.open(`https://vk.com/share.php?url=${encodeURIComponent(link)}&title=${text}`, '_blank');
  };

  const shareToWhatsApp = () => {
    if (!referralStats?.activeCode) return;
    const link = `${window.location.origin}/invite/${referralStats.activeCode}`;
    const text = encodeURIComponent(`Я уже защитил свои данные и получил приватность! Присоединяйся - получи 30% скидку! ${link}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Calculate days until subscription expires
  const getSubscriptionDaysRemaining = (subscription: UserSubscription | null) => {
    if (!subscription || !subscription.currentPeriodEnd) return null;
    
    const now = new Date();
    const endDate = new Date(subscription.currentPeriodEnd);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysRemaining = getSubscriptionDaysRemaining(subscription || null);
  const shouldShowExpiryWarning = subscription && daysRemaining !== null && daysRemaining <= 3;

  // Calculate statistics
  const stats = {
    totalRequests: deletionRequests.length,
    completedRequests: deletionRequests.filter((r: DeletionRequest) => r.status === 'completed').length,
    pendingRequests: deletionRequests.filter((r: DeletionRequest) => ['pending', 'sent', 'processing'].includes(r.status)).length,
    failedRequests: deletionRequests.filter((r: DeletionRequest) => ['rejected', 'failed'].includes(r.status)).length,
    unreadNotifications: notifications.length,
  };

  const completionRate = stats.totalRequests > 0 ? (stats.completedRequests / stats.totalRequests) * 100 : 0;

  if (requestsLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Загружаем данные...</p>
          </div>
        </div>
      </div>
    );
  }

  if (requestsError) {
    return (
      <div className="p-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Ошибка загрузки данных
            </CardTitle>
            <CardDescription>
              Не удалось загрузить данные панели управления. Попробуйте обновить страницу.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              data-testid="button-dashboard-reload"
            >
              Обновить страницу
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Панель управления
          </h1>
          <p className="text-muted-foreground">
            Контролируйте защиту ваших персональных данных
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto touch-target"
            data-testid="button-dashboard-view-notifications"
          >
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Уведомления</span>
            <span className="sm:hidden">Увед.</span>
            {stats.unreadNotifications > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {stats.unreadNotifications}
              </Badge>
            )}
          </Button>
          <Button 
            size="lg"
            className="w-full sm:w-auto touch-target"
            data-testid="button-dashboard-new-request"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Новый запрос</span>
            <span className="sm:hidden">Создать</span>
          </Button>
        </div>
      </div>

      {/* Subscription Expiry Warning */}
      {shouldShowExpiryWarning && (
        <Alert 
          variant={daysRemaining <= 0 ? "destructive" : "default"} 
          className="mb-6"
          data-testid="alert-subscription-expiry"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {daysRemaining <= 0 
              ? "Подписка истекла!" 
              : `Подписка истекает через ${daysRemaining} ${daysRemaining === 1 ? 'день' : daysRemaining <= 4 ? 'дня' : 'дней'}!`
            }
          </AlertTitle>
          <AlertDescription className="mt-2">
            {daysRemaining <= 0 ? (
              <>
                Ваша подписка "{subscription?.plan.displayName}" истекла. 
                Продлите подписку, чтобы продолжить защищать ваши данные.
              </>
            ) : (
              <>
                Ваша подписка "{subscription?.plan.displayName}" истекает {new Date(subscription?.currentPeriodEnd || '').toLocaleDateString('ru-RU')}. 
                Продлите подписку заранее, чтобы избежать перерыва в защите данных.
              </>
            )}
            <div className="mt-3">
              <Button 
                variant={daysRemaining <= 0 ? "default" : "outline"}
                size="sm"
                data-testid="button-renew-subscription"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Продлить подписку
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card data-testid="card-stat-total">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего запросов</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-requests">
              {stats.totalRequests}
            </div>
            <p className="text-xs text-muted-foreground">
              запросов на удаление данных
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-completed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выполнено</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-completed-requests">
              {stats.completedRequests}
            </div>
            <p className="text-xs text-muted-foreground">
              успешно обработано
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-pending">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В процессе</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600" data-testid="text-pending-requests">
              {stats.pendingRequests}
            </div>
            <p className="text-xs text-muted-foreground">
              ожидают обработки
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-progress">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Прогресс</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-completion-rate">
              {Math.round(completionRate)}%
            </div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              данных защищено
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-points">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Баллы</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {pointsLoading ? (
              <div className="text-2xl font-bold text-muted-foreground" data-testid="text-points-loading">
                ...
              </div>
            ) : (
              <div className="text-2xl font-bold text-green-600" data-testid="text-points-balance">
                {pointsBalance?.balance || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              баллов = рублей (1:1)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Referral Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Мои приглашения
            </CardTitle>
            <CardDescription>
              Зарабатывайте, приглашая друзей защитить данные
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                <Activity className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm">Загружаем статистику...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600" data-testid="text-referral-clicks">
                      {referralStats?.totalReferrals || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">кликов</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600" data-testid="text-referral-conversions">
                      {referralStats?.successfulReferrals || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">регистраций</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600" data-testid="text-referral-earnings">
                      {referralStats?.totalRewards || 0}₽
                    </div>
                    <p className="text-xs text-muted-foreground">заработано</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  {!referralStats?.activeCode ? (
                    <Button
                      onClick={() => generateCodeMutation.mutate()}
                      disabled={generateCodeMutation.isPending}
                      className="w-full"
                      size="lg"
                      data-testid="button-generate-referral"
                    >
                      {generateCodeMutation.isPending ? (
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Gift className="h-4 w-4 mr-2" />
                      )}
                      Создать реферальный код
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Ваша ссылка:</p>
                        <p className="font-mono text-sm break-all" data-testid="text-referral-link">
                          {window.location.origin}/invite/{referralStats.activeCode}
                        </p>
                      </div>
                      
                      <Button
                        onClick={copyReferralLink}
                        variant="outline"
                        className="w-full"
                        size="lg"
                        data-testid="button-copy-referral"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Скопировать ссылку
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Поделиться с друзьями
            </CardTitle>
            <CardDescription>
              Расскажите о защите данных в соцсетях
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={shareToTelegram}
                  disabled={!referralStats?.activeCode}
                  variant="outline"
                  size="lg"
                  className="flex flex-col gap-1 h-auto py-3"
                  data-testid="button-share-telegram"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                    T
                  </div>
                  <span className="text-xs">Telegram</span>
                </Button>
                
                <Button
                  onClick={shareToVK}
                  disabled={!referralStats?.activeCode}
                  variant="outline"
                  size="lg"
                  className="flex flex-col gap-1 h-auto py-3"
                  data-testid="button-share-vk"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    VK
                  </div>
                  <span className="text-xs">ВКонтакте</span>
                </Button>
                
                <Button
                  onClick={shareToWhatsApp}
                  disabled={!referralStats?.activeCode}
                  variant="outline"
                  size="lg"
                  className="flex flex-col gap-1 h-auto py-3"
                  data-testid="button-share-whatsapp"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
                    W
                  </div>
                  <span className="text-xs">WhatsApp</span>
                </Button>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
                <p className="text-sm text-center">
                  <span className="font-medium">🎁 Вирусное сообщение:</span><br />
                  "Я уже защитил свои данные и получил приватность! Присоединяйся - получи 30% скидку!"
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>💰 За каждую подписку:</span>
                <Badge variant="outline" className="font-mono">+50%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests & Notifications - Mobile Optimized */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Deletion Requests */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Последние запросы
              </CardTitle>
              <CardDescription>
                Статус ваших запросов на удаление персональных данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deletionRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">Запросов пока нет</p>
                    <p className="text-sm">Создайте первый запрос на удаление данных</p>
                    <Button 
                      className="mt-3 touch-target" 
                      size="lg"
                      data-testid="button-create-first-request"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Создать запрос
                    </Button>
                  </div>
                ) : (
                  <>
                    {deletionRequests.slice(0, 5).map((request: DeletionRequest) => {
                      const config = statusConfig[request.status];
                      const IconComponent = config.icon;
                      
                      return (
                        <div 
                          key={request.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                          data-testid={`request-item-${request.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium" data-testid={`text-broker-name-${request.id}`}>
                                {request.dataBroker?.name || 'Неизвестный провайдер'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {request.followUpRequired && (
                              <Badge variant="outline" className="text-xs">
                                Требует действий
                              </Badge>
                            )}
                            <Badge 
                              variant={config.color as any}
                              data-testid={`status-${request.id}`}
                            >
                              {config.label}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              data-testid={`button-view-request-${request.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    
                    {deletionRequests.length > 5 && (
                      <div className="text-center pt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid="button-view-all-requests"
                        >
                          Показать все ({deletionRequests.length})
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notifications */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Уведомления
                {stats.unreadNotifications > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {stats.unreadNotifications}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Важные обновления и уведомления
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notificationsLoading ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <Activity className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Загрузка...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Новых уведомлений нет</p>
                  </div>
                ) : (
                  <>
                    {notifications.slice(0, 5).map((notification: Notification) => (
                      <div 
                        key={notification.id}
                        className="p-3 border rounded-lg space-y-1 hover-elevate"
                        data-testid={`notification-${notification.id}`}
                      >
                        <p className="font-medium text-sm" data-testid={`notification-title-${notification.id}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    ))}
                    
                    {(allNotifications.data?.length || 0) > 5 && (
                      <div className="text-center pt-2">
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="touch-target"
                          data-testid="button-view-all-notifications"
                        >
                          Все уведомления
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
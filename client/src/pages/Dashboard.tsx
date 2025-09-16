import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Bell,
  Plus,
  Activity,
  Eye
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

const statusConfig = {
  pending: { label: 'В ожидании', color: 'secondary', icon: Clock },
  sent: { label: 'Отправлен', color: 'default', icon: Activity },
  processing: { label: 'Обрабатывается', color: 'default', icon: Activity },
  completed: { label: 'Выполнен', color: 'default', icon: CheckCircle },
  rejected: { label: 'Отклонен', color: 'destructive', icon: AlertTriangle },
  failed: { label: 'Ошибка', color: 'destructive', icon: AlertTriangle },
} as const;

export default function Dashboard() {
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
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Панель управления
          </h1>
          <p className="text-muted-foreground">
            Контролируйте защиту ваших персональных данных
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            data-testid="button-dashboard-view-notifications"
          >
            <Bell className="h-4 w-4 mr-2" />
            Уведомления
            {stats.unreadNotifications > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {stats.unreadNotifications}
              </Badge>
            )}
          </Button>
          <Button 
            size="sm"
            data-testid="button-dashboard-new-request"
          >
            <Plus className="h-4 w-4 mr-2" />
            Новый запрос
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div>

      {/* Recent Requests & Notifications */}
      <div className="grid gap-8 lg:grid-cols-3">
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
                      className="mt-3" 
                      size="sm"
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
                          size="sm"
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
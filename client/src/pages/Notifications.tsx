import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Bell, 
  BellOff,
  Mail, 
  MessageSquare,
  Smartphone,
  Settings,
  CheckCircle2,
  Circle,
  Trash2,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Shield
} from 'lucide-react';

interface Notification {
  id: string;
  userId: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  category: 'scan_completed' | 'deletion_request' | 'verification' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  sent: boolean;
  sentAt?: string;
  createdAt: string;
}

interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  categories: {
    scan_completed: boolean;
    deletion_request: boolean;
    verification: boolean;
    system: boolean;
  };
}

// Notification type icon component
function NotificationTypeIcon({ type }: { type: Notification['type'] }) {
  const icons = {
    email: Mail,
    sms: MessageSquare,
    push: Smartphone,
    in_app: Bell,
  };
  
  const Icon = icons[type];
  return <Icon className="w-4 h-4" />;
}

// Notification category icon component
function NotificationCategoryIcon({ category }: { category: Notification['category'] }) {
  const icons = {
    scan_completed: CheckCircle,
    deletion_request: Trash2,
    verification: Shield,
    system: Info,
  };
  
  const Icon = icons[category];
  return <Icon className="w-4 h-4" />;
}

// Category display component
function CategoryBadge({ category }: { category: Notification['category'] }) {
  const categoryConfig = {
    scan_completed: { label: 'Сканирование', variant: 'default' as const },
    deletion_request: { label: 'Запрос удаления', variant: 'secondary' as const },
    verification: { label: 'Верификация', variant: 'default' as const },
    system: { label: 'Система', variant: 'outline' as const },
  };

  const config = categoryConfig[category];

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <NotificationCategoryIcon category={category} />
      {config.label}
    </Badge>
  );
}

// Type display component
function TypeBadge({ type }: { type: Notification['type'] }) {
  const typeConfig = {
    email: { label: 'Email', variant: 'outline' as const },
    sms: { label: 'SMS', variant: 'outline' as const },
    push: { label: 'Push', variant: 'outline' as const },
    in_app: { label: 'В приложении', variant: 'outline' as const },
  };

  const config = typeConfig[type];

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <NotificationTypeIcon type={type} />
      {config.label}
    </Badge>
  );
}

// Individual notification item component
function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  isLoading 
}: { 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      return 'Только что';
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)} ч назад`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)} д назад`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <Card 
      className={`transition-colors ${
        notification.read 
          ? 'bg-background' 
          : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
      }`}
      data-testid={`notification-${notification.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {!notification.read && (
                <Circle className="w-2 h-2 fill-blue-600 text-blue-600" />
              )}
              <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                {notification.title}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CategoryBadge category={notification.category} />
            <TypeBadge type={notification.type} />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(notification.createdAt)}
          </div>
          {notification.sent && notification.sentAt && (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              Доставлено
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">
          {notification.message}
        </p>
        
        {/* Additional data display if available */}
        {notification.data && Object.keys(notification.data).length > 0 && (
          <div className="p-3 bg-muted rounded text-sm mb-4">
            <details>
              <summary className="cursor-pointer font-medium">Дополнительная информация</summary>
              <pre className="mt-2 text-xs overflow-x-auto">
                {JSON.stringify(notification.data, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {!notification.read && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMarkAsRead(notification.id)}
                disabled={isLoading}
                data-testid={`button-mark-read-${notification.id}`}
              >
                <Eye className="w-4 h-4 mr-1" />
                Отметить как прочитанное
              </Button>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(notification.id)}
            disabled={isLoading}
            data-testid={`button-delete-${notification.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Notifications list component
function NotificationsList() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Fetch notifications
  const { data: notifications = [], isLoading, error } = useQuery<Notification[]>({
    queryKey: ['/api/notifications', { unread: filter === 'unread' }]
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('PUT', `/api/notifications/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  // Delete notification mutation (assuming API exists)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/notifications/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'read' && !notification.read) return false;
    if (categoryFilter !== 'all' && notification.category !== categoryFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Ошибка загрузки
          </CardTitle>
          <CardDescription>
            Не удалось загрузить уведомления
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Уведомления
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Управление вашими уведомлениями и настройками
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Статус</Label>
              <Tabs value={filter} onValueChange={(value: any) => setFilter(value)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all" data-testid="filter-all">
                    Все ({notifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread" data-testid="filter-unread">
                    Непрочитанные ({unreadCount})
                  </TabsTrigger>
                  <TabsTrigger value="read" data-testid="filter-read">
                    Прочитанные ({notifications.length - unreadCount})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div>
              <Label>Категория</Label>
              <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all" data-testid="category-all">
                    Все
                  </TabsTrigger>
                  <TabsTrigger value="scan_completed" data-testid="category-scan">
                    Сканирование
                  </TabsTrigger>
                  <TabsTrigger value="deletion_request" data-testid="category-deletion">
                    Запросы
                  </TabsTrigger>
                  <TabsTrigger value="verification" data-testid="category-verification">
                    Верификация
                  </TabsTrigger>
                  <TabsTrigger value="system" data-testid="category-system">
                    Система
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Notifications List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BellOff className="w-12 h-12 mx-auto mb-4" />
              <p>Уведомления не найдены</p>
              <p className="text-sm">
                {filter === 'unread' 
                  ? 'У вас нет непрочитанных уведомлений'
                  : 'История уведомлений пуста'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  isLoading={markAsReadMutation.isPending || deleteMutation.isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Notification preferences component
function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    inAppEnabled: true,
    categories: {
      scan_completed: true,
      deletion_request: true,
      verification: true,
      system: true,
    }
  });

  const { toast } = useToast();

  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: async (prefs: NotificationPreferences) => {
      return apiRequest('PUT', '/api/profile/notification-preferences', prefs);
    },
    onSuccess: () => {
      toast({
        title: "Настройки сохранены",
        description: "Настройки уведомлений успешно обновлены",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка сохранения",
        description: error.message || "Не удалось сохранить настройки",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    savePreferencesMutation.mutate(preferences);
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const updateCategory = (category: keyof NotificationPreferences['categories'], enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      categories: { ...prev.categories, [category]: enabled }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Настройки уведомлений
        </CardTitle>
        <CardDescription>
          Настройте способы получения уведомлений
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Methods */}
        <div>
          <h4 className="font-medium mb-4">Способы доставки</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <Label htmlFor="email">Email уведомления</Label>
              </div>
              <Switch
                id="email"
                checked={preferences.emailEnabled}
                onCheckedChange={(checked) => updatePreference('emailEnabled', checked)}
                data-testid="switch-email-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <Label htmlFor="sms">SMS уведомления</Label>
              </div>
              <Switch
                id="sms"
                checked={preferences.smsEnabled}
                onCheckedChange={(checked) => updatePreference('smsEnabled', checked)}
                data-testid="switch-sms-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <Label htmlFor="push">Push уведомления</Label>
              </div>
              <Switch
                id="push"
                checked={preferences.pushEnabled}
                onCheckedChange={(checked) => updatePreference('pushEnabled', checked)}
                data-testid="switch-push-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <Label htmlFor="inApp">Уведомления в приложении</Label>
              </div>
              <Switch
                id="inApp"
                checked={preferences.inAppEnabled}
                onCheckedChange={(checked) => updatePreference('inAppEnabled', checked)}
                data-testid="switch-inapp-notifications"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <h4 className="font-medium mb-4">Категории уведомлений</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <Label htmlFor="scan">Завершение сканирования</Label>
              </div>
              <Switch
                id="scan"
                checked={preferences.categories.scan_completed}
                onCheckedChange={(checked) => updateCategory('scan_completed', checked)}
                data-testid="switch-scan-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <Label htmlFor="deletion">Статус запросов на удаление</Label>
              </div>
              <Switch
                id="deletion"
                checked={preferences.categories.deletion_request}
                onCheckedChange={(checked) => updateCategory('deletion_request', checked)}
                data-testid="switch-deletion-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <Label htmlFor="verification">Верификация документов</Label>
              </div>
              <Switch
                id="verification"
                checked={preferences.categories.verification}
                onCheckedChange={(checked) => updateCategory('verification', checked)}
                data-testid="switch-verification-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <Label htmlFor="system">Системные уведомления</Label>
              </div>
              <Switch
                id="system"
                checked={preferences.categories.system}
                onCheckedChange={(checked) => updateCategory('system', checked)}
                data-testid="switch-system-notifications"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave}
            disabled={savePreferencesMutation.isPending}
            data-testid="button-save-preferences"
          >
            {savePreferencesMutation.isPending ? 'Сохранение...' : 'Сохранить настройки'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Notifications page component
export default function Notifications() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="title-notifications">
          Уведомления
        </h1>
        <p className="text-muted-foreground">
          Управление уведомлениями и настройками их доставки
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" data-testid="tab-notifications">
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="preferences" data-testid="tab-preferences">
            Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <NotificationsList />
        </TabsContent>

        <TabsContent value="preferences">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}
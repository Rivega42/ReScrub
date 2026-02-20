import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  FileText, 
  Mail, 
  Server, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  Shield
} from 'lucide-react';
import { useLocation } from 'wouter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SEO } from '@/components/SEO';

interface AdminStats {
  users: {
    total: number;
    verified: number;
    admins: number;
    recentRegistrations: number;
  };
  blog: {
    totalArticles: number;
    publishedArticles: number;
    schedulerStatus: boolean;
    lastGenerated: string | null;
    nextGeneration: string | null;
  };
  system: {
    uptime: number;
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    serverTime: string;
    environment: string;
  };
}

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  
  const { data: statsData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    select: (data: any) => data.stats as AdminStats,
    refetchInterval: 30000, // Auto refresh every 30 seconds
  });

  const stats = statsData;
  
  // Navigation handlers
  const handleManageUsers = () => {
    setLocation('/admin/users');
  };
  
  const handleManageBlog = () => {
    setLocation('/admin/blog');
  };
  
  const handleEmailLogs = () => {
    setLocation('/admin/email-logs');
  };
  
  const handleSystemMonitor = () => {
    setLocation('/admin/system');
  };
  
  const handleViewLogs = () => {
    alert('Функция просмотра логов в разработке');
  };
  
  const handleSystemSettings = () => {
    alert('Функция настроек системы в разработке');
  };
  
  const handleSAZPD = () => {
    setLocation('/admin/sazpd');
  };

  // Format uptime
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}д ${hours}ч ${minutes}м`;
  };

  // Format memory usage
  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title="Ошибка доступа - Админская панель"
          description="Ошибка доступа к админской панели GrandHub"
        />
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4" data-testid="text-admin-error">
              Ошибка доступа
            </h1>
            <p className="text-muted-foreground mb-4">
              У вас нет прав доступа к админской панели
            </p>
            <Button onClick={() => window.location.href = '/'} data-testid="button-back-home">
              Вернуться на главную
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Админская панель - GrandHub"
        description="Панель управления платформой GrandHub: пользователи, блог, система мониторинга"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-admin-title">
              Админская панель
            </h1>
            <p className="text-muted-foreground">
              Управление платформой GrandHub
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" data-testid="badge-environment">
              {stats?.system.environment || 'development'}
            </Badge>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              disabled={isLoading}
              data-testid="button-refresh-stats"
            >
              <Clock className="h-4 w-4 mr-2" />
              Обновить
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загружаем статистику...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* System Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card data-testid="card-users-stats">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-users-total">
                    {stats?.users.total || 0}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-4">
                    <span>Подтвержден: {stats?.users.verified || 0}</span>
                    <span>Админы: {stats?.users.admins || 0}</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    +{stats?.users.recentRegistrations || 0} за неделю
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-blog-stats">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Блог</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-articles-total">
                    {stats?.blog.totalArticles || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Опубликовано: {stats?.blog.publishedArticles || 0}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {stats?.blog.schedulerStatus ? (
                      <Badge variant="default" className="text-xs" data-testid="badge-scheduler-active">
                        <Play className="h-3 w-3 mr-1" />
                        Активен
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs" data-testid="badge-scheduler-inactive">
                        <Pause className="h-3 w-3 mr-1" />
                        Остановлен
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-system-stats">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Система</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-system-uptime">
                    {stats?.system.uptime ? formatUptime(stats.system.uptime) : '0м'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Память: {stats?.system.memory ? formatBytes(stats.system.memory.heapUsed) : '0 MB'}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    Работает
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-performance-stats">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Производительность</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600" data-testid="text-performance-status">
                    Отлично
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Heap: {stats?.system.memory ? formatBytes(stats.system.memory.heapTotal) : '0 MB'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Загрузка: Низкая
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Blog Scheduler Status */}
              <Card data-testid="card-blog-scheduler">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Планировщик блога
                  </CardTitle>
                  <CardDescription>
                    Автоматическая генерация статей о 152-ФЗ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Статус:</span>
                    {stats?.blog.schedulerStatus ? (
                      <Badge variant="default" data-testid="badge-blog-scheduler-running">
                        <Play className="h-3 w-3 mr-1" />
                        Запущен
                      </Badge>
                    ) : (
                      <Badge variant="destructive" data-testid="badge-blog-scheduler-stopped">
                        <Pause className="h-3 w-3 mr-1" />
                        Остановлен
                      </Badge>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Последняя генерация:</span>
                      <span data-testid="text-last-generated">
                        {stats?.blog.lastGenerated
                          ? new Date(stats.blog.lastGenerated).toLocaleString('ru-RU')
                          : 'Пусто'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Следующая генерация:</span>
                      <span data-testid="text-next-generation">
                        {stats?.blog.nextGeneration
                          ? new Date(stats.blog.nextGeneration).toLocaleString('ru-RU')
                          : 'Не запланирована'
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" data-testid="button-force-generation">
                      Принудительная генерация
                    </Button>
                    <Button size="sm" variant="outline" data-testid="button-blog-settings">
                      Настройки
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Information */}
              <Card data-testid="card-system-info">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Информация о системе
                  </CardTitle>
                  <CardDescription>
                    Детали работы сервера
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Окружение:</span>
                      <div className="font-medium" data-testid="text-environment">
                        {stats?.system.environment}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Время сервера:</span>
                      <div className="font-medium" data-testid="text-server-time">
                        {stats?.system.serverTime
                          ? new Date(stats.system.serverTime).toLocaleString('ru-RU')
                          : 'Неизвестно'
                        }
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Использование памяти:</div>
                    {stats?.system.memory && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div data-testid="text-memory-used">
                          Используется: {formatBytes(stats.system.memory.heapUsed)}
                        </div>
                        <div data-testid="text-memory-total">
                          Всего: {formatBytes(stats.system.memory.heapTotal)}
                        </div>
                        <div data-testid="text-memory-rss">
                          RSS: {formatBytes(stats.system.memory.rss)}
                        </div>
                        <div data-testid="text-memory-external">
                          Внешняя: {formatBytes(stats.system.memory.external)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleViewLogs} data-testid="button-view-logs">
                      Просмотр логов
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleSystemSettings} data-testid="button-system-settings">
                      Настройки системы
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card data-testid="card-quick-actions">
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
                <CardDescription>
                  Часто используемые функции администратора
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Button variant="outline" className="h-20 flex-col" onClick={handleManageUsers} data-testid="button-manage-users">
                    <Users className="h-6 w-6 mb-2" />
                    Управление пользователями
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={handleManageBlog} data-testid="button-manage-blog">
                    <FileText className="h-6 w-6 mb-2" />
                    Управление блогом
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={handleEmailLogs} data-testid="button-email-logs">
                    <Mail className="h-6 w-6 mb-2" />
                    Email логи
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={handleSystemMonitor} data-testid="button-system-monitor">
                    <Server className="h-6 w-6 mb-2" />
                    Мониторинг системы
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={handleSAZPD} data-testid="button-sazpd">
                    <Shield className="h-6 w-6 mb-2" />
                    САЗПД
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
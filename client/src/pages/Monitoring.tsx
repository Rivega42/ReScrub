import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Send,
  Archive,
  Users,
  Globe,
  BarChart3,
  Calendar,
  Filter,
  RefreshCw,
  Target
} from 'lucide-react';

// Mock data for monitoring - in real app would come from API
const mockStats = {
  totalRequests: 156,
  completedRequests: 89,
  pendingRequests: 42,
  failedRequests: 25,
  totalBrokers: 127,
  activeScans: 8,
  dataPointsFound: 2847,
  completionRate: 57,
  averageResponseTime: '5.2 дня',
  lastScanDate: '2025-09-16T10:30:00Z'
};

const mockRequestsByStatus = [
  { name: 'Завершено', count: 89, color: '#10b981' },
  { name: 'В процессе', count: 42, color: '#3b82f6' },
  { name: 'Отклонено', count: 25, color: '#ef4444' },
];

const mockRequestsByCategory = [
  { name: 'Банки', count: 45, percentage: 29 },
  { name: 'Телеком', count: 38, percentage: 24 },
  { name: 'Ритейл', count: 31, percentage: 20 },
  { name: 'Государственные', count: 26, percentage: 17 },
  { name: 'Другие', count: 16, percentage: 10 },
];

const mockWeeklyProgress = [
  { name: 'Пн', requests: 12, completed: 8 },
  { name: 'Вт', requests: 15, completed: 11 },
  { name: 'Ср', requests: 8, completed: 6 },
  { name: 'Чт', requests: 22, completed: 18 },
  { name: 'Пт', requests: 18, completed: 14 },
  { name: 'Сб', requests: 6, completed: 4 },
  { name: 'Вс', requests: 9, completed: 7 },
];

const mockRecentActivity = [
  {
    id: '1',
    type: 'scan_completed',
    title: 'Сканирование завершено',
    description: 'Найдено 12 записей в банках',
    timestamp: '2 мин назад',
    status: 'success'
  },
  {
    id: '2', 
    type: 'deletion_request',
    title: 'Запрос отправлен',
    description: 'Альфа-Банк - запрос на удаление данных',
    timestamp: '1 час назад',
    status: 'pending'
  },
  {
    id: '3',
    type: 'response_received',
    title: 'Ответ получен',
    description: 'МТС подтвердил удаление персональных данных',
    timestamp: '3 часа назад',
    status: 'success'
  },
  {
    id: '4',
    type: 'verification',
    title: 'Требуется верификация',
    description: 'Загрузите документ для подтверждения личности',
    timestamp: '5 часов назад',
    status: 'warning'
  }
];

// Activity status icon component
function ActivityStatusIcon({ status }: { status: string }) {
  const icons = {
    success: CheckCircle,
    pending: Clock,
    warning: AlertTriangle,
    error: AlertTriangle,
  };
  
  const colors = {
    success: 'text-green-600',
    pending: 'text-blue-600', 
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };
  
  const Icon = icons[status as keyof typeof icons] || Activity;
  const colorClass = colors[status as keyof typeof colors] || 'text-gray-600';
  
  return <Icon className={`w-4 h-4 ${colorClass}`} />;
}

// Statistics cards component
function StatisticsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всего запросов</CardTitle>
          <Send className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="stat-total-requests">
            {mockStats.totalRequests}
          </div>
          <p className="text-xs text-muted-foreground">
            +12% за последний месяц
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Завершено</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600" data-testid="stat-completed-requests">
            {mockStats.completedRequests}
          </div>
          <p className="text-xs text-muted-foreground">
            {mockStats.completionRate}% успешности
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">В обработке</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600" data-testid="stat-pending-requests">
            {mockStats.pendingRequests}
          </div>
          <p className="text-xs text-muted-foreground">
            Среднее время: {mockStats.averageResponseTime}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Организации</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="stat-total-brokers">
            {mockStats.totalBrokers}
          </div>
          <p className="text-xs text-muted-foreground">
            {mockStats.activeScans} активных сканирований
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Progress overview component  
function ProgressOverview() {
  const progressValue = (mockStats.completedRequests / mockStats.totalRequests) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Общий прогресс
        </CardTitle>
        <CardDescription>
          Статус выполнения запросов на удаление данных
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Завершено запросов</span>
            <span className="font-medium">
              {mockStats.completedRequests} из {mockStats.totalRequests}
            </span>
          </div>
          <Progress value={progressValue} className="h-3" data-testid="progress-completion" />
          <p className="text-xs text-muted-foreground">
            {progressValue.toFixed(1)}% от общего числа запросов
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {mockStats.completedRequests}
            </div>
            <div className="text-xs text-muted-foreground">Завершено</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {mockStats.pendingRequests}
            </div>
            <div className="text-xs text-muted-foreground">В процессе</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {mockStats.failedRequests}
            </div>
            <div className="text-xs text-muted-foreground">Отклонено</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Найдено записей с данными</span>
            <span className="font-medium">{mockStats.dataPointsFound.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Среднее время ответа</span>
            <span className="font-medium">{mockStats.averageResponseTime}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Последнее сканирование</span>
            <span className="font-medium">
              {new Date(mockStats.lastScanDate).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Charts component
function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Статус запросов</CardTitle>
          <CardDescription>Распределение по статусам</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockRequestsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {mockRequestsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [value, 'Количество']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {mockRequestsByStatus.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}: {item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Активность за неделю</CardTitle>
          <CardDescription>Запросы и их выполнение</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWeeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#3b82f6" name="Запросы" />
                <Bar dataKey="completed" fill="#10b981" name="Завершено" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Categories breakdown component
function CategoriesBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Запросы по категориям
        </CardTitle>
        <CardDescription>
          Распределение запросов по типам организаций
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRequestsByCategory.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{category.name}</span>
                <span>{category.count} запросов ({category.percentage}%)</span>
              </div>
              <Progress value={category.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Recent activity component
function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Последняя активность
        </CardTitle>
        <CardDescription>
          Недавние события и обновления
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRecentActivity.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              data-testid={`activity-${activity.id}`}
            >
              <div className="flex-shrink-0 mt-1">
                <ActivityStatusIcon status={activity.status} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline" size="sm" data-testid="button-view-all-activity">
            Показать всю историю
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Controls component
function MonitoringControls() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" data-testid="button-refresh-data">
          <RefreshCw className="w-4 h-4 mr-2" />
          Обновить данные
        </Button>
        <Button variant="outline" size="sm" data-testid="button-filter-data">
          <Filter className="w-4 h-4 mr-2" />
          Фильтры
        </Button>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span>Обновлено: {new Date().toLocaleDateString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}</span>
      </div>
    </div>
  );
}

// Main Monitoring page component
export default function Monitoring() {
  // In real app, would fetch real data from API
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['/api/monitoring/stats'],
    queryFn: () => Promise.resolve(mockStats), // Mock for now
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Ошибка загрузки
            </CardTitle>
            <CardDescription>
              Не удалось загрузить данные мониторинга
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Попробовать снова
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="title-monitoring">
          Мониторинг процесса удаления данных
        </h1>
        <p className="text-muted-foreground">
          Отслеживание статуса запросов, прогресс выполнения и аналитика
        </p>
      </div>

      <div className="space-y-8">
        {/* Controls */}
        <MonitoringControls />

        {/* Statistics Overview */}
        <StatisticsCards />

        {/* Progress and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProgressOverview />
          </div>
          <div className="lg:col-span-2">
            <ChartsSection />
          </div>
        </div>

        {/* Categories and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoriesBreakdown />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
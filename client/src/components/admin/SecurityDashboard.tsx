import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Lock,
  UserX,
  Activity,
  Users,
  Key,
  FileWarning,
  BarChart3,
  ShieldAlert
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface SecurityMetrics {
  failedLogins: {
    total: number;
    trend: 'up' | 'down' | 'stable';
    recentAttempts: Array<{
      email: string;
      ipAddress: string;
      timestamp: Date;
      attempts: number;
    }>;
    chartData: Array<{
      date: string;
      attempts: number;
    }>;
  };
  suspiciousActivity: {
    count: number;
    alerts: Array<{
      id: string;
      severity: 'high' | 'medium' | 'low';
      type: string;
      description: string;
      timestamp: Date;
      userId?: string;
      ipAddress?: string;
    }>;
  };
  activeAdmins: {
    total: number;
    list: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      lastActive: Date;
      actionsToday: number;
      sensitiveActions: number;
    }>;
  };
  sensitiveOperations: {
    total: number;
    recent: Array<{
      id: string;
      adminName: string;
      action: string;
      targetType: string;
      timestamp: Date;
      result: 'success' | 'failure';
    }>;
    breakdown: Array<{
      type: string;
      count: number;
    }>;
  };
  compliance: {
    score: number;
    status: 'compliant' | 'warning' | 'critical';
    checks: Array<{
      name: string;
      status: 'pass' | 'fail' | 'warning';
      message: string;
    }>;
  };
  systemHealth: {
    overall: 'healthy' | 'degraded' | 'critical';
    services: Array<{
      name: string;
      status: 'online' | 'offline' | 'degraded';
      responseTime: number;
      uptime: number;
    }>;
  };
}

export default function SecurityDashboard() {
  // Query for security metrics
  const { data: metrics, isLoading } = useQuery<SecurityMetrics>({
    queryKey: ['/api/admin/security/dashboard'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const COLORS = {
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
    primary: '#3b82f6',
    secondary: '#8b5cf6'
  };

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {metrics.suspiciousActivity.alerts.filter(a => a.severity === 'high').length > 0 && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Критические предупреждения безопасности</AlertTitle>
          <AlertDescription>
            Обнаружено {metrics.suspiciousActivity.alerts.filter(a => a.severity === 'high').length} критических 
            событий, требующих немедленного внимания.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserX className="h-4 w-4" />
              Неудачные попытки входа
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.failedLogins.total}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {metrics.failedLogins.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : metrics.failedLogins.trend === 'down' ? (
                <TrendingDown className="h-3 w-3 text-green-500" />
              ) : (
                <Activity className="h-3 w-3" />
              )}
              <span>за последние 24 часа</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Подозрительная активность
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.suspiciousActivity.count}</div>
            <div className="text-xs text-muted-foreground">
              Требует проверки
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              Критические операции
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sensitiveOperations.total}</div>
            <div className="text-xs text-muted-foreground">
              За последнюю неделю
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Уровень соответствия
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Progress value={metrics.compliance.score} className="flex-1" />
              <span className="text-sm font-bold">{metrics.compliance.score}%</span>
            </div>
            <Badge 
              variant={metrics.compliance.status === 'compliant' ? 'default' : 
                      metrics.compliance.status === 'warning' ? 'secondary' : 'destructive'}
              className="mt-2"
            >
              {metrics.compliance.status === 'compliant' ? 'Соответствует' :
               metrics.compliance.status === 'warning' ? 'Требует внимания' : 'Критично'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="failed-logins" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="failed-logins" data-testid="tab-failed-logins">
            Попытки входа
          </TabsTrigger>
          <TabsTrigger value="suspicious" data-testid="tab-suspicious">
            Подозрительное
          </TabsTrigger>
          <TabsTrigger value="admins" data-testid="tab-admins">
            Администраторы
          </TabsTrigger>
          <TabsTrigger value="sensitive" data-testid="tab-sensitive">
            Критические
          </TabsTrigger>
          <TabsTrigger value="compliance" data-testid="tab-compliance">
            Соответствие
          </TabsTrigger>
        </TabsList>

        {/* Failed Logins Tab */}
        <TabsContent value="failed-logins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>График неудачных попыток входа</CardTitle>
              <CardDescription>
                Динамика за последние 7 дней
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={metrics.failedLogins.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="attempts" 
                    stroke={COLORS.danger}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Последние попытки</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {metrics.failedLogins.recentAttempts.map((attempt, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg"
                      data-testid={`card-failed-login-${idx}`}
                    >
                      <div>
                        <p className="font-medium">{attempt.email}</p>
                        <p className="text-xs text-muted-foreground">
                          IP: {attempt.ipAddress} • {attempt.attempts} попыток
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(attempt.timestamp), 'HH:mm:ss')}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suspicious Activity Tab */}
        <TabsContent value="suspicious" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Подозрительная активность</CardTitle>
              <CardDescription>
                События, требующие проверки администратором
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {metrics.suspiciousActivity.alerts.map((alert) => (
                    <Alert 
                      key={alert.id}
                      variant={alert.severity === 'high' ? 'destructive' : 'default'}
                      data-testid={`alert-suspicious-${alert.id}`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center gap-2">
                        {alert.type}
                        <Badge variant={
                          alert.severity === 'high' ? 'destructive' :
                          alert.severity === 'medium' ? 'secondary' : 'outline'
                        }>
                          {alert.severity === 'high' ? 'Высокий' :
                           alert.severity === 'medium' ? 'Средний' : 'Низкий'}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription>
                        <p>{alert.description}</p>
                        <p className="text-xs mt-2 text-muted-foreground">
                          {format(new Date(alert.timestamp), 'dd.MM.yyyy HH:mm:ss', { locale: ru })}
                          {alert.ipAddress && ` • IP: ${alert.ipAddress}`}
                        </p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Admins Tab */}
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Активные администраторы</CardTitle>
              <CardDescription>
                Всего активных: {metrics.activeAdmins.total}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {metrics.activeAdmins.list.map((admin) => (
                    <div 
                      key={admin.id}
                      className="border rounded-lg p-4"
                      data-testid={`card-admin-${admin.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{admin.name}</p>
                          <p className="text-xs text-muted-foreground">{admin.email}</p>
                        </div>
                        <Badge variant="outline">{admin.role}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Последняя активность</p>
                          <p>{format(new Date(admin.lastActive), 'HH:mm', { locale: ru })}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Действий сегодня</p>
                          <p>{admin.actionsToday}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Критических</p>
                          <p className={admin.sensitiveActions > 0 ? 'text-red-500' : ''}>
                            {admin.sensitiveActions}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sensitive Operations Tab */}
        <TabsContent value="sensitive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Распределение критических операций</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={metrics.sensitiveOperations.breakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.type}: ${entry.count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {metrics.sensitiveOperations.breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Последние критические операции</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {metrics.sensitiveOperations.recent.map((op) => (
                    <div 
                      key={op.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-red-50 dark:bg-red-950"
                      data-testid={`card-sensitive-op-${op.id}`}
                    >
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <FileWarning className="h-4 w-4 text-red-500" />
                          {op.action} - {op.targetType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Администратор: {op.adminName}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={op.result === 'success' ? 'default' : 'destructive'}>
                          {op.result === 'success' ? 'Успешно' : 'Ошибка'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(op.timestamp), 'HH:mm:ss')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Проверки соответствия</CardTitle>
              <CardDescription>
                Результаты автоматических проверок безопасности
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.compliance.checks.map((check, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-lg"
                    data-testid={`card-compliance-check-${idx}`}
                  >
                    <div className="flex items-center gap-3">
                      {check.status === 'pass' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : check.status === 'warning' ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{check.name}</p>
                        <p className="text-xs text-muted-foreground">{check.message}</p>
                      </div>
                    </div>
                    <Badge variant={
                      check.status === 'pass' ? 'default' :
                      check.status === 'warning' ? 'secondary' : 'destructive'
                    }>
                      {check.status === 'pass' ? 'Пройдено' :
                       check.status === 'warning' ? 'Предупреждение' : 'Ошибка'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
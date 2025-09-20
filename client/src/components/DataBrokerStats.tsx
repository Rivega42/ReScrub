import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  Legend,
} from 'recharts';
import {
  Building,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Bot,
  FileText,
  Shield,
  Activity,
} from 'lucide-react';
import type { DataBroker } from '@shared/schema';

interface DataBrokerStatsProps {
  brokers: DataBroker[];
}

const CATEGORY_LABELS: Record<string, string> = {
  banks: 'Банки',
  telecom: 'Телеком',
  retail: 'Ритейл',
  insurance: 'Страхование',
  government: 'Государственные',
  healthcare: 'Здравоохранение',
  education: 'Образование',
  realestate: 'Недвижимость',
  transport: 'Транспорт',
  social: 'Социальные сети',
  other: 'Другое',
};

const DIFFICULTY_COLORS = {
  easy: '#10b981',
  medium: '#eab308',
  hard: '#f97316',
  very_hard: '#ef4444',
};

export default function DataBrokerStats({ brokers }: DataBrokerStatsProps) {
  const stats = useMemo(() => {
    const total = brokers.length;
    const active = brokers.filter(b => b.isActive).length;
    const automated = brokers.filter(b => b.automatedRemoval).length;
    const verified = brokers.filter(b => b.lastVerifiedAt).length;
    
    // Recently verified (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentlyVerified = brokers.filter(b => 
      b.lastVerifiedAt && new Date(b.lastVerifiedAt) > thirtyDaysAgo
    ).length;

    // Category distribution
    const categoryStats = Object.entries(
      brokers.reduce((acc, broker) => {
        acc[broker.category] = (acc[broker.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([category, count]) => ({
      name: CATEGORY_LABELS[category] || category,
      value: count,
      percentage: Math.round((count / total) * 100),
    }));

    // Difficulty distribution
    const difficultyStats = Object.entries(
      brokers.reduce((acc, broker) => {
        acc[broker.difficultyLevel] = (acc[broker.difficultyLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([level, count]) => ({
      name: level === 'easy' ? 'Легко' : 
            level === 'medium' ? 'Средне' :
            level === 'hard' ? 'Сложно' : 'Очень сложно',
      value: count,
      level,
    }));

    // Response time analysis
    const responseTimeStats = brokers.reduce((acc, broker) => {
      if (broker.responseTime) {
        const key = broker.responseTime === '1-3_days' ? '1-3 дня' :
                   broker.responseTime === 'week' ? 'Неделя' :
                   broker.responseTime === '2_weeks' ? '2 недели' :
                   broker.responseTime === 'month' ? 'Месяц' :
                   broker.responseTime === '2_months' ? '2 месяца' : 'Не отвечают';
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Average success rate
    const successRates = brokers.filter(b => b.successRate !== undefined).map(b => b.successRate!);
    const avgSuccessRate = successRates.length > 0 
      ? Math.round(successRates.reduce((a, b) => a + b, 0) / successRates.length)
      : 0;

    // Average processing days
    const processingDays = brokers.filter(b => b.averageProcessingDays).map(b => b.averageProcessingDays!);
    const avgProcessingDays = processingDays.length > 0
      ? Math.round(processingDays.reduce((a, b) => a + b, 0) / processingDays.length)
      : 0;

    // Brokers with warnings
    const withWarnings = brokers.filter(b => b.warnings).length;

    return {
      total,
      active,
      automated,
      verified,
      recentlyVerified,
      categoryStats,
      difficultyStats,
      responseTimeStats,
      avgSuccessRate,
      avgProcessingDays,
      withWarnings,
      activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
      automatedPercentage: total > 0 ? Math.round((automated / total) * 100) : 0,
      verifiedPercentage: total > 0 ? Math.round((verified / total) * 100) : 0,
    };
  }, [brokers]);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего операторов</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="mr-1 h-3 w-3" />
                {stats.active} активных
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Автоматизация</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.automatedPercentage}%</div>
            <Progress value={stats.automatedPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.automated} из {stats.total} операторов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Проверенные</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verifiedPercentage}%</div>
            <Progress value={stats.verifiedPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.recentlyVerified} за последние 30 дней
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Успешность</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSuccessRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              В среднем {stats.avgProcessingDays} дней обработки
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Распределение по категориям</CardTitle>
            <CardDescription>
              Количество операторов в каждой категории
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.categoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Difficulty Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Сложность удаления</CardTitle>
            <CardDescription>
              Распределение по уровням сложности
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.difficultyStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.difficultyStats.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={DIFFICULTY_COLORS[entry.level as keyof typeof DIFFICULTY_COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Response Time Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Время отклика операторов</CardTitle>
          <CardDescription>
            Распределение операторов по среднему времени ответа на запросы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.responseTimeStats).map(([time, count]) => (
              <div key={time} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{time}</span>
                  </div>
                  <span className="text-muted-foreground">{count} операторов</span>
                </div>
                <Progress 
                  value={(count / stats.total) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">С предупреждениями</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withWarnings}</div>
            <p className="text-xs text-muted-foreground">
              Требуют особого внимания
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Требуют проверки</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total - stats.verified}</div>
            <p className="text-xs text-muted-foreground">
              Не проверялись или устарели
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">База данных</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePercentage}%</div>
            <p className="text-xs text-muted-foreground">
              Активных операторов
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
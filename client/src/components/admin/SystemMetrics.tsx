import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  HardDrive, 
  MemoryStick,
  Network,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SystemMetricsProps {
  metrics?: {
    cpu: {
      usage: number; // 0-100
      cores: number;
      loadAverage: number[];
    };
    memory: {
      used: number; // в байтах
      total: number; // в байтах
      percentage: number; // 0-100
    };
    disk: {
      used: number; // в байтах
      total: number; // в байтах
      percentage: number; // 0-100
    };
    network: {
      activeConnections: number;
      requestRate: number; // запросов в секунду
      requestHistory?: Array<{
        time: string;
        rate: number;
      }>;
    };
  };
  isLoading?: boolean;
}

export function SystemMetrics({ metrics, isLoading }: SystemMetricsProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600 dark:text-green-400';
    if (percentage < 75) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage < 90) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 75) return 'bg-yellow-500';
    if (percentage < 90) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return <Minus className="h-3 w-3 text-muted-foreground" />;
    if (current > previous) return <TrendingUp className="h-3 w-3 text-red-500" />;
    if (current < previous) return <TrendingDown className="h-3 w-3 text-green-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  if (isLoading || !metrics) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded" />
                  <div className="h-2 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU метрика */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Процессор
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {metrics.cpu.cores} ядер
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className={`text-2xl font-bold ${getUsageColor(metrics.cpu.usage)}`}>
                  {metrics.cpu.usage.toFixed(1)}%
                </span>
                {getTrendIcon(metrics.cpu.usage)}
              </div>
              <Progress 
                value={metrics.cpu.usage} 
                className="h-2"
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                Нагрузка: {metrics.cpu.loadAverage.map(l => l.toFixed(2)).join(', ')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory метрика */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MemoryStick className="h-4 w-4" />
                Память
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {formatBytes(metrics.memory.total)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className={`text-2xl font-bold ${getUsageColor(metrics.memory.percentage)}`}>
                  {metrics.memory.percentage.toFixed(1)}%
                </span>
                {getTrendIcon(metrics.memory.percentage)}
              </div>
              <Progress 
                value={metrics.memory.percentage} 
                className="h-2"
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                {formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.total)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disk метрика */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Диск
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {formatBytes(metrics.disk.total)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className={`text-2xl font-bold ${getUsageColor(metrics.disk.percentage)}`}>
                  {metrics.disk.percentage.toFixed(1)}%
                </span>
                {getTrendIcon(metrics.disk.percentage)}
              </div>
              <Progress 
                value={metrics.disk.percentage} 
                className="h-2"
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                {formatBytes(metrics.disk.used)} / {formatBytes(metrics.disk.total)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network метрики */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Network className="h-4 w-4" />
              Сетевая активность
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                {metrics.network.activeConnections} соединений
              </Badge>
              <Badge variant="outline" className="text-xs">
                {metrics.network.requestRate} req/s
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {metrics.network.requestHistory && metrics.network.requestHistory.length > 0 ? (
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.network.requestHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                    labelFormatter={(value) => `Время: ${value}`}
                    formatter={(value: any) => [`${value} req/s`, 'Запросов']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
              Нет данных для отображения
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
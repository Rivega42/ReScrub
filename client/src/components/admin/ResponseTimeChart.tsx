import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Download,
  RefreshCw,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ResponseTimeData {
  time: string;
  database?: number;
  email?: number;
  openai?: number;
  storage?: number;
  webserver?: number;
}

interface ResponseTimeChartProps {
  data?: ResponseTimeData[];
  timeRange?: '1h' | '6h' | '24h' | '7d';
  onTimeRangeChange?: (range: '1h' | '6h' | '24h' | '7d') => void;
  selectedServices?: string[];
  onServiceToggle?: (service: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  isLoading?: boolean;
  stats?: {
    average: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
  };
}

const serviceConfig = {
  database: {
    name: 'База данных',
    color: 'hsl(var(--chart-1))',
    strokeColor: '#8884d8'
  },
  email: {
    name: 'Email (Mailganer)',
    color: 'hsl(var(--chart-2))',
    strokeColor: '#82ca9d'
  },
  openai: {
    name: 'OpenAI API',
    color: 'hsl(var(--chart-3))',
    strokeColor: '#ffc658'
  },
  storage: {
    name: 'Хранилище',
    color: 'hsl(var(--chart-4))',
    strokeColor: '#ff7c7c'
  },
  webserver: {
    name: 'Веб-сервер',
    color: 'hsl(var(--chart-5))',
    strokeColor: '#8dd1e1'
  }
};

const timeRangeLabels = {
  '1h': '1 час',
  '6h': '6 часов',
  '24h': '24 часа',
  '7d': '7 дней'
};

export function ResponseTimeChart({
  data = [],
  timeRange = '24h',
  onTimeRangeChange,
  selectedServices = ['database', 'email', 'openai', 'storage', 'webserver'],
  onServiceToggle,
  onRefresh,
  onExport,
  isLoading,
  stats
}: ResponseTimeChartProps) {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const formatTime = (time: string) => {
    const date = new Date(time);
    if (timeRange === '1h' || timeRange === '6h') {
      return format(date, 'HH:mm', { locale: ru });
    }
    if (timeRange === '24h') {
      return format(date, 'HH:mm', { locale: ru });
    }
    return format(date, 'dd MMM HH:mm', { locale: ru });
  };

  const formatTooltipValue = (value: any) => {
    if (typeof value === 'number') {
      return `${value.toFixed(0)}мс`;
    }
    return value;
  };

  const calculateTrend = () => {
    if (data.length < 2) return null;
    
    const recentData = data.slice(-10);
    const olderData = data.slice(-20, -10);
    
    const recentAvg = recentData.reduce((sum, d) => {
      let count = 0;
      let total = 0;
      selectedServices.forEach(service => {
        const value = d[service as keyof ResponseTimeData] as number | undefined;
        if (value) {
          total += value;
          count++;
        }
      });
      return sum + (count > 0 ? total / count : 0);
    }, 0) / recentData.length;
    
    const olderAvg = olderData.reduce((sum, d) => {
      let count = 0;
      let total = 0;
      selectedServices.forEach(service => {
        const value = d[service as keyof ResponseTimeData] as number | undefined;
        if (value) {
          total += value;
          count++;
        }
      });
      return sum + (count > 0 ? total / count : 0);
    }, 0) / olderData.length;
    
    const percentChange = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    return {
      direction: recentAvg > olderAvg ? 'up' : 'down',
      percent: Math.abs(percentChange)
    };
  };

  const trend = calculateTrend();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Время отклика сервисов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Время отклика сервисов
            </CardTitle>
            <CardDescription className="mt-1">
              График времени отклика за {timeRangeLabels[timeRange]}
              {trend && (
                <span className="ml-2">
                  {trend.direction === 'up' ? (
                    <span className="text-red-600 dark:text-red-400 inline-flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{trend.percent.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 inline-flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -{trend.percent.toFixed(1)}%
                    </span>
                  )}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRefresh}
                data-testid="button-refresh-chart"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Обновить
              </Button>
            )}
            {onExport && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onExport}
                data-testid="button-export-data"
              >
                <Download className="h-3 w-3 mr-1" />
                Экспорт
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Временной диапазон */}
        {onTimeRangeChange && (
          <Tabs value={timeRange} onValueChange={onTimeRangeChange as any}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="1h" data-testid="tab-1h">
                <Clock className="h-3 w-3 mr-1" />
                1 час
              </TabsTrigger>
              <TabsTrigger value="6h" data-testid="tab-6h">
                <Clock className="h-3 w-3 mr-1" />
                6 часов
              </TabsTrigger>
              <TabsTrigger value="24h" data-testid="tab-24h">
                <Clock className="h-3 w-3 mr-1" />
                24 часа
              </TabsTrigger>
              <TabsTrigger value="7d" data-testid="tab-7d">
                <Clock className="h-3 w-3 mr-1" />
                7 дней
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Селектор сервисов */}
        {onServiceToggle && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(serviceConfig).map(([key, config]) => (
              <Badge
                key={key}
                variant={selectedServices.includes(key) ? "default" : "outline"}
                className="cursor-pointer transition-all"
                onClick={() => onServiceToggle(key)}
                onMouseEnter={() => setHoveredService(key)}
                onMouseLeave={() => setHoveredService(null)}
                data-testid={`badge-service-${key}`}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-1" 
                  style={{ backgroundColor: config.strokeColor }}
                />
                {config.name}
              </Badge>
            ))}
          </div>
        )}

        {/* График */}
        <div className="h-64">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={formatTime}
                  tick={{ fontSize: 10 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  className="text-muted-foreground"
                  label={{ 
                    value: 'Время отклика (мс)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: 10 }
                  }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                  labelFormatter={(value) => `Время: ${formatTime(value)}`}
                  formatter={formatTooltipValue}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  formatter={(value: string) => serviceConfig[value as keyof typeof serviceConfig]?.name || value}
                />
                
                {/* Линия среднего значения */}
                {stats?.average && (
                  <ReferenceLine 
                    y={stats.average} 
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="5 5"
                    label={{ value: `Среднее: ${stats.average.toFixed(0)}мс`, fontSize: 10 }}
                  />
                )}
                
                {/* Линии для каждого сервиса */}
                {selectedServices.includes('database') && (
                  <Line 
                    type="monotone" 
                    dataKey="database" 
                    stroke={serviceConfig.database.strokeColor}
                    strokeWidth={hoveredService === 'database' ? 3 : 2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
                {selectedServices.includes('email') && (
                  <Line 
                    type="monotone" 
                    dataKey="email" 
                    stroke={serviceConfig.email.strokeColor}
                    strokeWidth={hoveredService === 'email' ? 3 : 2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
                {selectedServices.includes('openai') && (
                  <Line 
                    type="monotone" 
                    dataKey="openai" 
                    stroke={serviceConfig.openai.strokeColor}
                    strokeWidth={hoveredService === 'openai' ? 3 : 2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
                {selectedServices.includes('storage') && (
                  <Line 
                    type="monotone" 
                    dataKey="storage" 
                    stroke={serviceConfig.storage.strokeColor}
                    strokeWidth={hoveredService === 'storage' ? 3 : 2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
                {selectedServices.includes('webserver') && (
                  <Line 
                    type="monotone" 
                    dataKey="webserver" 
                    stroke={serviceConfig.webserver.strokeColor}
                    strokeWidth={hoveredService === 'webserver' ? 3 : 2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Нет данных для отображения
            </div>
          )}
        </div>

        {/* Статистика */}
        {stats && (
          <div className="grid grid-cols-5 gap-4 pt-4 border-t">
            <div>
              <div className="text-xs text-muted-foreground">Среднее</div>
              <div className="text-lg font-semibold">{stats.average.toFixed(0)}мс</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Минимум</div>
              <div className="text-lg font-semibold">{stats.min.toFixed(0)}мс</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Максимум</div>
              <div className="text-lg font-semibold">{stats.max.toFixed(0)}мс</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">P95</div>
              <div className="text-lg font-semibold">{stats.p95.toFixed(0)}мс</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">P99</div>
              <div className="text-lg font-semibold">{stats.p99.toFixed(0)}мс</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
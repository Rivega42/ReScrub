import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
  Brush,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  Database,
  Globe,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Download,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PerformanceData {
  responseTime: Array<{
    time: string;
    average: number;
    p95: number;
    p99: number;
    min: number;
    max: number;
  }>;
  requestVolume: Array<{
    time: string;
    requests: number;
    successful: number;
    failed: number;
    errorRate: number;
  }>;
  errorRate: Array<{
    time: string;
    rate: number;
    errors: number;
    total: number;
    byType?: {
      '4xx': number;
      '5xx': number;
      timeout: number;
      other: number;
    };
  }>;
  databasePerformance: Array<{
    time: string;
    queryTime: number;
    connections: number;
    slowQueries: number;
    cacheHitRate: number;
  }>;
  serviceBreakdown: Array<{
    service: string;
    avgResponseTime: number;
    requests: number;
    errorRate: number;
    availability: number;
  }>;
  stats?: {
    avgResponseTime: number;
    totalRequests: number;
    errorRate: number;
    availability: number;
    peakResponseTime: number;
    peakRequestRate: number;
  };
}

interface PerformanceChartsProps {
  data?: PerformanceData;
  isLoading?: boolean;
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
  onTimeRangeChange?: (range: '1h' | '6h' | '24h' | '7d' | '30d') => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

export function PerformanceCharts({ 
  data, 
  isLoading,
  timeRange = '24h',
  onTimeRangeChange,
  onRefresh,
  onExport 
}: PerformanceChartsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'response' | 'volume' | 'errors' | 'database'>('response');

  const COLORS = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    destructive: 'hsl(var(--destructive))',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',
    muted: 'hsl(var(--muted-foreground))'
  };

  const formatXAxisTick = (tickItem: string) => {
    const date = new Date(tickItem);
    if (timeRange === '1h' || timeRange === '6h') {
      return format(date, 'HH:mm');
    } else if (timeRange === '24h') {
      return format(date, 'HH:mm');
    } else {
      return format(date, 'dd MMM');
    }
  };

  const formatTooltipLabel = (value: string) => {
    return format(new Date(value), 'dd MMM yyyy, HH:mm:ss', { locale: ru });
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous * 1.1) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (current < previous * 0.9) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getPerformanceColor = (value: number, metric: 'responseTime' | 'errorRate') => {
    if (metric === 'responseTime') {
      if (value < 100) return 'text-green-600 dark:text-green-400';
      if (value < 500) return 'text-yellow-600 dark:text-yellow-400';
      if (value < 1000) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    } else {
      if (value < 1) return 'text-green-600 dark:text-green-400';
      if (value < 5) return 'text-yellow-600 dark:text-yellow-400';
      if (value < 10) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    }
  };

  const errorBreakdown = useMemo(() => {
    if (!data?.errorRate) return [];
    
    const totalErrors = data.errorRate.reduce((acc, curr) => {
      if (curr.byType) {
        return {
          '4xx': acc['4xx'] + curr.byType['4xx'],
          '5xx': acc['5xx'] + curr.byType['5xx'],
          timeout: acc.timeout + curr.byType.timeout,
          other: acc.other + curr.byType.other
        };
      }
      return acc;
    }, { '4xx': 0, '5xx': 0, timeout: 0, other: 0 });

    return [
      { name: '4xx Ошибки', value: totalErrors['4xx'], color: COLORS.warning },
      { name: '5xx Ошибки', value: totalErrors['5xx'], color: COLORS.destructive },
      { name: 'Таймауты', value: totalErrors.timeout, color: COLORS.info },
      { name: 'Прочие', value: totalErrors.other, color: COLORS.muted }
    ];
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-32" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value: any) => onTimeRangeChange?.(value)}>
            <SelectTrigger className="w-[140px]" data-testid="select-time-range">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Последний час</SelectItem>
              <SelectItem value="6h">6 часов</SelectItem>
              <SelectItem value="24h">24 часа</SelectItem>
              <SelectItem value="7d">7 дней</SelectItem>
              <SelectItem value="30d">30 дней</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            data-testid="button-refresh-charts"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Обновить
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExport}
            data-testid="button-export-data"
          >
            <Download className="h-4 w-4 mr-1" />
            Экспорт
          </Button>
        </div>

        {/* Stats */}
        {data.stats && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={getPerformanceColor(data.stats.avgResponseTime, 'responseTime')}>
                {data.stats.avgResponseTime.toFixed(0)}мс
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span>{data.stats.totalRequests.toLocaleString()} req</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className={getPerformanceColor(data.stats.errorRate, 'errorRate')}>
                {data.stats.errorRate.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Charts */}
      <Tabs value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="response">Время отклика</TabsTrigger>
          <TabsTrigger value="volume">Объем запросов</TabsTrigger>
          <TabsTrigger value="errors">Ошибки</TabsTrigger>
          <TabsTrigger value="database">База данных</TabsTrigger>
        </TabsList>

        {/* Response Time Chart */}
        <TabsContent value="response" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Время отклика</CardTitle>
              <CardDescription>
                Среднее, P95 и P99 время отклика за период
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.responseTime}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={formatXAxisTick}
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                      label={{ value: 'Время (мс)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                    />
                    <Tooltip 
                      labelFormatter={formatTooltipLabel}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="line"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke={COLORS.primary} 
                      strokeWidth={2}
                      dot={false}
                      name="Среднее"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="p95" 
                      stroke={COLORS.warning} 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="P95"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="p99" 
                      stroke={COLORS.destructive} 
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      dot={false}
                      name="P99"
                    />
                    <ReferenceLine 
                      y={500} 
                      stroke={COLORS.warning} 
                      strokeDasharray="3 3"
                      label={{ value: "SLA: 500мс", position: "right", style: { fontSize: 10 } }}
                    />
                    <Brush 
                      dataKey="time" 
                      height={30} 
                      stroke={COLORS.primary}
                      tickFormatter={formatXAxisTick}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Request Volume Chart */}
        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Объем запросов</CardTitle>
              <CardDescription>
                Количество успешных и неуспешных запросов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.requestVolume}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={formatXAxisTick}
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                      label={{ value: 'Запросы', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                    />
                    <Tooltip 
                      labelFormatter={formatTooltipLabel}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="rect"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="successful" 
                      stackId="1"
                      stroke={COLORS.success} 
                      fill={COLORS.success}
                      fillOpacity={0.6}
                      name="Успешные"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="failed" 
                      stackId="1"
                      stroke={COLORS.destructive} 
                      fill={COLORS.destructive}
                      fillOpacity={0.6}
                      name="Неуспешные"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Error Rate Chart */}
        <TabsContent value="errors" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Процент ошибок</CardTitle>
                  <CardDescription>
                    Динамика ошибок во времени
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data.errorRate}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="time" 
                          tickFormatter={formatXAxisTick}
                          tick={{ fontSize: 11 }}
                          className="text-muted-foreground"
                        />
                        <YAxis 
                          yAxisId="left"
                          tick={{ fontSize: 11 }}
                          className="text-muted-foreground"
                          label={{ value: 'Процент (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: 11 }}
                          className="text-muted-foreground"
                          label={{ value: 'Количество', angle: 90, position: 'insideRight', style: { fontSize: 11 } }}
                        />
                        <Tooltip 
                          labelFormatter={formatTooltipLabel}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: '12px' }}
                        />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="rate"
                          fill={COLORS.destructive}
                          stroke={COLORS.destructive}
                          fillOpacity={0.3}
                          name="% ошибок"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="errors"
                          fill={COLORS.destructive}
                          opacity={0.8}
                          name="Количество"
                        />
                        <ReferenceLine 
                          yAxisId="left"
                          y={5} 
                          stroke={COLORS.warning} 
                          strokeDasharray="3 3"
                          label={{ value: "Порог: 5%", position: "right", style: { fontSize: 10 } }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Error Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Типы ошибок</CardTitle>
                <CardDescription>
                  Распределение по типам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={errorBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {errorBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Database Performance Chart */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Производительность базы данных</CardTitle>
              <CardDescription>
                Время выполнения запросов и метрики подключений
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data.databasePerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={formatXAxisTick}
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                      label={{ value: 'Время (мс)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                      label={{ value: 'Соединения / Hit Rate (%)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }}
                    />
                    <Tooltip 
                      labelFormatter={formatTooltipLabel}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="queryTime"
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      dot={false}
                      name="Время запроса"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="connections"
                      stroke={COLORS.info}
                      strokeWidth={2}
                      dot={false}
                      name="Соединения"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cacheHitRate"
                      stroke={COLORS.success}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Cache Hit Rate"
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="slowQueries"
                      fill={COLORS.destructive}
                      opacity={0.6}
                      name="Медленные запросы"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Service Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Производительность по сервисам</CardTitle>
          <CardDescription>
            Сравнение метрик различных сервисов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.serviceBreakdown}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="service" 
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                  label={{ value: 'Время отклика (мс)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'avgResponseTime') return [`${value}мс`, 'Время отклика'];
                    if (name === 'errorRate') return [`${value}%`, 'Ошибки'];
                    return [value, name];
                  }}
                />
                <Bar 
                  dataKey="avgResponseTime" 
                  fill={COLORS.primary}
                  name="Время отклика"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
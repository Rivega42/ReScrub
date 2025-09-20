import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  ServiceHealthGrid,
  type ServiceHealth 
} from '@/components/admin/ServiceHealthGrid';
import { 
  SystemMetrics 
} from '@/components/admin/SystemMetrics';
import { 
  SystemAlerts,
  type SystemAlert
} from '@/components/admin/SystemAlerts';
import { 
  PerformanceCharts 
} from '@/components/admin/PerformanceCharts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SEO } from '@/components/SEO';
import { 
  Activity, 
  Server,
  RefreshCw,
  Download,
  Settings,
  Bell,
  Clock,
  Info,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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

export default function AdminSystemMonitoring() {
  const { toast } = useToast();
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h');
  const [selectedServices, setSelectedServices] = useState<string[]>(['database', 'email', 'openai', 'storage', 'webserver']);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAlertCountRef = useRef<number>(0);

  // Получить состояние здоровья сервисов
  const { data: healthData, isLoading: isLoadingHealth, refetch: refetchHealth } = useQuery({
    queryKey: ['/api/admin/system/health'],
    refetchInterval: autoRefreshEnabled ? 30000 : false, // Автообновление каждые 30 секунд
  });

  // Получить системные метрики
  const { data: metricsData, isLoading: isLoadingMetrics, refetch: refetchMetrics } = useQuery({
    queryKey: ['/api/admin/system/metrics'],
    refetchInterval: autoRefreshEnabled ? 30000 : false,
  });

  // Получить алерты
  const { data: alertsData, isLoading: isLoadingAlerts, refetch: refetchAlerts } = useQuery({
    queryKey: ['/api/admin/system/alerts'],
    refetchInterval: autoRefreshEnabled ? 10000 : false, // Чаще для алертов
  });

  // Получить данные производительности
  const { data: performanceData, isLoading: isLoadingPerformance, refetch: refetchPerformance } = useQuery<PerformanceData>({
    queryKey: ['/api/admin/system/performance', selectedTimeRange],
  });

  // Мутация для решения алерта
  const resolveAlertMutation = useMutation({
    mutationFn: (alertId: string) => apiRequest({
      method: 'POST',
      url: `/api/admin/system/alerts/${alertId}/resolve`,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/system/alerts'] });
      toast({
        title: "Алерт решен",
        description: "Проблема была успешно решена"
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось решить алерт"
      });
    }
  });

  // Мутация для ручной проверки сервиса
  const checkServiceMutation = useMutation({
    mutationFn: (service: string) => apiRequest({
      method: 'POST',
      url: `/api/admin/system/check/${service}`,
    }),
    onSuccess: (data, service) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/system/health'] });
      toast({
        title: "Проверка выполнена",
        description: `Сервис ${service} проверен`
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Ошибка проверки",
        description: error.message || "Не удалось выполнить проверку"
      });
    }
  });

  // Воспроизведение звука для критичных алертов
  const playAlertSound = (severity: 'critical' | 'warning' | 'info') => {
    if (severity === 'critical') {
      // Используем базовый звук браузера
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSxy0fPTgjMGHm7A7+OZURE');
      audio.play().catch(e => console.log('Could not play sound:', e));
    }
  };

  // Проверка на новые критичные алерты
  useEffect(() => {
    if (alertsData?.alerts) {
      const criticalAlerts = alertsData.alerts.filter(
        (a: SystemAlert) => a.severity === 'critical' && !a.acknowledged
      );
      
      if (criticalAlerts.length > lastAlertCountRef.current) {
        playAlertSound('critical');
        toast({
          variant: "destructive",
          title: "Критичный алерт!",
          description: `Обнаружено ${criticalAlerts.length} критичных проблем`
        });
      }
      
      lastAlertCountRef.current = criticalAlerts.length;
    }
  }, [alertsData, toast]);

  // Экспорт данных
  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      health: healthData,
      metrics: metricsData,
      alerts: alertsData,
      responseTimes: responseTimesData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-monitoring-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Данные экспортированы",
      description: "Файл с данными мониторинга загружен"
    });
  };

  // Обновить все данные
  const handleRefreshAll = async () => {
    await Promise.all([
      refetchHealth(),
      refetchMetrics(),
      refetchAlerts(),
      refetchPerformance()
    ]);
    
    toast({
      title: "Данные обновлены",
      description: "Все данные мониторинга обновлены"
    });
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const services: ServiceHealth[] = healthData?.services || [];
  const metrics = metricsData?.metrics;
  const alerts: SystemAlert[] = alertsData?.alerts || [];
  const performanceStats = performanceData?.stats;

  // Подсчет статистики
  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;
  const downCount = services.filter(s => s.status === 'down').length;
  const overallUptime = services.length > 0 
    ? services.reduce((sum, s) => sum + s.uptime, 0) / services.length 
    : 100;

  return (
    <>
      <SEO 
        title="Системный мониторинг - ReScrub Admin"
        description="Мониторинг состояния систем и сервисов ReScrub"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Системный мониторинг</h1>
                <p className="text-muted-foreground">
                  Отслеживание состояния сервисов и производительности системы
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={autoRefreshEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                  data-testid="button-toggle-auto-refresh"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {autoRefreshEnabled ? 'Автообновление: ВКЛ' : 'Автообновление: ВЫКЛ'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshAll}
                  data-testid="button-refresh-all"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Обновить все
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  data-testid="button-export"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Экспорт
                </Button>
              </div>
            </div>

            {/* Общая статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Общая доступность</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    overallUptime >= 99.9 ? 'text-green-600' :
                    overallUptime >= 99 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {overallUptime.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Работают
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{healthyCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    С проблемами
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{degradedCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    Недоступны
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{downCount}</div>
                </CardContent>
              </Card>
            </div>

            {/* Критичные алерты */}
            {alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length > 0 && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Критичные проблемы обнаружены!</AlertTitle>
                <AlertDescription>
                  {alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length} критичных проблем требуют немедленного внимания
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Tabs defaultValue="services" className="space-y-4">
            <TabsList>
              <TabsTrigger value="services" data-testid="tab-services">
                <Server className="h-4 w-4 mr-2" />
                Состояние сервисов
              </TabsTrigger>
              <TabsTrigger value="metrics" data-testid="tab-metrics">
                <Activity className="h-4 w-4 mr-2" />
                Системные метрики
              </TabsTrigger>
              <TabsTrigger value="alerts" data-testid="tab-alerts">
                <Bell className="h-4 w-4 mr-2" />
                Оповещения
                {alerts.filter(a => !a.acknowledged).length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">
                    {alerts.filter(a => !a.acknowledged).length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="response" data-testid="tab-response">
                <Clock className="h-4 w-4 mr-2" />
                Время отклика
              </TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-6">
              <ServiceHealthGrid
                services={services}
                isLoading={isLoadingHealth}
                onRefreshService={(serviceName) => checkServiceMutation.mutate(serviceName)}
                onViewLogs={(service) => {
                  // Implement view logs functionality
                  console.log('View logs for', service.name);
                }}
              />
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <SystemMetrics 
                metrics={metrics}
                isLoading={isLoadingMetrics}
              />
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <SystemAlerts
                alerts={alerts}
                isLoading={isLoadingAlerts}
                onAcknowledge={async (alertId) => {
                  await apiRequest({
                    method: 'POST',
                    url: `/api/admin/system/alerts/${alertId}/acknowledge`,
                  });
                  queryClient.invalidateQueries({ queryKey: ['/api/admin/system/alerts'] });
                  toast({ title: "Алерт подтвержден" });
                }}
                onResolve={(alertId) => resolveAlertMutation.mutate(alertId)}
                onDelete={async (alertId) => {
                  await apiRequest({
                    method: 'DELETE',
                    url: `/api/admin/system/alerts/${alertId}`,
                  });
                  queryClient.invalidateQueries({ queryKey: ['/api/admin/system/alerts'] });
                  toast({ title: "Алерт удален" });
                }}
              />
            </TabsContent>

            <TabsContent value="response" className="space-y-6">
              <PerformanceCharts
                data={performanceData}
                isLoading={isLoadingPerformance}
                timeRange={selectedTimeRange as any}
                onTimeRangeChange={setSelectedTimeRange as any}
                onRefresh={() => refetchPerformance()}
                onExport={handleExport}
              />
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </>
  );
}
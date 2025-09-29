import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download, Filter, RefreshCw, Settings, Shield, Activity, Users, AlertTriangle, CheckCircle, Clock, TrendingUp, Play, Pause, RotateCcw, Zap, Database, FileText, Eye, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Типы данных для САЗПД тестирования
interface SAZPDTestModule {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  duration?: number;
  startedAt?: string;
  completedAt?: string;
  results?: {
    tests: number;
    passed: number;
    failed: number;
    errors: string[];
    warnings: string[];
  };
}

interface SAZPDTestSession {
  id: string;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  modules: SAZPDTestModule[];
  summary?: {
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    totalDuration: number;
  };
}

// Типы данных для САЗПД админ панели
interface SAZPDLog {
  id: string;
  timestamp: string;
  module: 'response-analyzer' | 'decision-engine' | 'evidence-collector' | 'campaign-manager' | 'email-automation' | 'crypto-validator';
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  requestId?: string;
  status: 'success' | 'failed' | 'processing';
  details?: Record<string, any>;
}

interface SAZPDMetrics {
  totalRequests: number;
  processedRequests: number;
  automatedDecisions: number;
  manualEscalations: number;
  evidenceCollections: number;
  cryptoValidations: number;
  complianceScore: number;
  operatorResponseTime: number;
  violationsDetected: number;
}

interface SAZPDSettings {
  modules: {
    responseAnalyzer: { enabled: boolean; interval: number };
    decisionEngine: { enabled: boolean; autoDecisionThreshold: number };
    evidenceCollector: { enabled: boolean; retentionDays: number };
    campaignManager: { enabled: boolean; maxCampaigns: number };
    emailAutomation: { enabled: boolean; followUpHours: number };
    cryptoValidator: { enabled: boolean; strictMode: boolean };
  };
  compliance: {
    fz152Mode: boolean;
    dataRetentionDays: number;
    autoEscalationHours: number;
    operatorResponseTimeout: number;
  };
}

interface OperatorStats {
  operatorId: string;
  name: string;
  totalResponses: number;
  successRate: number;
  avgResponseTime: number;
  violationsCount: number;
  lastActivity: string;
  complianceScore: number;
}

export default function AdminSAZPD() {
  const [location, setLocation] = useLocation();
  
  // Определяем активную вкладку из URL
  const getActiveTabFromUrl = () => {
    if (location.includes('/diagnostics')) return 'diagnostics';
    if (location.includes('/logs')) return 'logs';
    if (location.includes('/testing')) return 'testing';
    if (location.includes('/settings')) return 'settings';
    if (location.includes('/operators')) return 'operators';
    return 'metrics'; // По умолчанию
  };

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [logFilter, setLogFilter] = useState({
    module: 'all',
    level: 'all',
    status: 'all',
    search: ''
  });
  
  // Состояние для САЗПД тестирования
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [testPollingInterval, setTestPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Real-time monitoring controls
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [monitoringIntervals, setMonitoringIntervals] = useState({
    metrics: 30000,     // 30 seconds
    health: 10000,      // 10 seconds  
    logs: 15000,        // 15 seconds
    operators: 60000,   // 60 seconds
    configs: 120000     // 2 minutes (less frequent)
  });

  // Получение логов САЗПД with real-time monitoring
  const { data: logsResponse, isLoading: logsLoading, refetch: refetchLogs } = useQuery({
    queryKey: ['/api/sazpd/logs', logFilter, selectedDate],
    queryFn: () => apiRequest(`/api/sazpd/logs?${new URLSearchParams({
      module: logFilter.module,
      level: logFilter.level,
      status: logFilter.status,
      search: logFilter.search,
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
    })}`),
    refetchInterval: realTimeEnabled ? monitoringIntervals.logs : false
  });

  // Извлекаем массив логов из ответа API
  const logs = logsResponse?.data?.logs || [];

  // Получение метрик САЗПД with real-time monitoring
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['/api/sazpd/metrics'],
    queryFn: () => apiRequest('/api/sazpd/metrics'),
    refetchInterval: realTimeEnabled ? monitoringIntervals.metrics : false
  });

  // Получение настроек САЗПД with real-time monitoring
  const { data: settings, isLoading: settingsLoading, refetch: refetchSettings } = useQuery({
    queryKey: ['/api/sazpd/settings'],
    queryFn: () => apiRequest('/api/sazpd/settings'),
    refetchInterval: realTimeEnabled ? monitoringIntervals.configs : false
  });

  // Получение статистики операторов with real-time monitoring
  const { data: operatorStats = [], isLoading: operatorStatsLoading, refetch: refetchOperatorStats } = useQuery({
    queryKey: ['/api/sazpd/operator-stats'],
    queryFn: () => apiRequest('/api/sazpd/operator-stats'),
    refetchInterval: realTimeEnabled ? monitoringIntervals.operators : false
  });

  // Получение общих health checks САЗПД модулей with real-time monitoring
  const { data: healthResponse, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ['/api/admin/sazpd/health'],
    queryFn: () => apiRequest('/api/admin/sazpd/health'),
    refetchInterval: realTimeEnabled ? monitoringIntervals.health : false
  });

  const healthData = healthResponse?.data;

  // Получение конфигураций САЗПД модулей with real-time monitoring
  const { data: configResponse, isLoading: configLoading, refetch: refetchConfig } = useQuery({
    queryKey: ['/api/admin/sazpd/config'],
    queryFn: () => apiRequest('/api/admin/sazpd/config'),
    refetchInterval: realTimeEnabled ? monitoringIntervals.configs : false
  });

  const configurations = configResponse?.data?.configurations;

  // Получение статуса САЗПД тестирования
  const { data: testSessionResponse, isLoading: testSessionLoading, refetch: refetchTestSession } = useQuery({
    queryKey: ['/api/admin/sazpd/test/status'],
    queryFn: () => apiRequest('/api/admin/sazpd/test/status'),
    refetchInterval: 2000 // Обновляем каждые 2 секунды
  });
  
  const testSession = testSessionResponse?.data;

  // Получение результатов тестов
  const { data: testResultsResponse } = useQuery({
    queryKey: ['/api/admin/sazpd/test/results'],
    queryFn: () => apiRequest('/api/admin/sazpd/test/results'),
    enabled: testSession?.status === 'completed'
  });
  
  const testResults = testResultsResponse?.data;

  // Мутация для обновления настроек
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<SAZPDSettings>) => 
      apiRequest('/api/sazpd/settings', { method: 'PUT', body: newSettings }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sazpd/settings'] });
    }
  });

  // Экспорт логов
  const exportLogsMutation = useMutation({
    mutationFn: () => apiRequest('/api/sazpd/export-logs', { method: 'POST' }),
    onSuccess: (data) => {
      // Скачивание файла
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sazpd-logs-${format(new Date(), 'yyyy-MM-dd')}.json`;
      a.click();
    }
  });

  // Запуск полного цикла САЗПД тестирования
  const startFullTestMutation = useMutation({
    mutationFn: () => apiRequest('/api/admin/sazpd/test/start', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sazpd/test/status'] });
    }
  });

  // Запуск конкретного этапа тестирования
  const startStepTestMutation = useMutation({
    mutationFn: (stepId: string) => 
      apiRequest(`/api/admin/sazpd/test/step/${stepId}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sazpd/test/status'] });
    }
  });

  // Остановка тестирования
  const stopTestMutation = useMutation({
    mutationFn: () => apiRequest('/api/admin/sazpd/test/stop', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sazpd/test/status'] });
    }
  });

  // Сброс результатов тестирования
  const resetTestMutation = useMutation({
    mutationFn: () => apiRequest('/api/admin/sazpd/test/reset', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sazpd/test/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sazpd/test/results'] });
    }
  });

  // Упрощенная диагностика САЗПД модулей для стабильности
  const renderAdvancedDiagnostics = () => {
    if (healthLoading || configLoading) {
      return <div className="p-8 text-center">Загрузка диагностики модулей...</div>;
    }

    return (
      <div className="space-y-6">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  Диагностика САЗПД системы
                </CardTitle>
                <CardDescription>
                  Система автоматизированной защиты персональных данных по ФЗ-152
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetchHealth()} data-testid="button-refresh-health">
                <RefreshCw className="h-4 w-4 mr-2" />
                Обновить
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Модулей</p>
                <p className="text-3xl font-bold">6</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Активные</p>
                <p className="text-3xl font-bold text-green-600">
                  {healthData?.modules?.filter((m: any) => m.status === 'healthy')?.length || 0}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Проблемы</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {healthData?.modules?.filter((m: any) => m.status !== 'healthy')?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card data-testid="module-card-document-generation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Генерация документов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Автоматическая генерация юридических документов для запросов
              </p>
              <Badge variant="default">Активен</Badge>
            </CardContent>
          </Card>

          <Card data-testid="module-card-response-analysis">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Анализ ответов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Анализ ответов операторов на соответствие ФЗ-152
              </p>
              <Badge variant="default">Активен</Badge>
            </CardContent>
          </Card>

          <Card data-testid="module-card-decision-engine">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Движок решений
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Автоматическое принятие решений на основе анализа
              </p>
              <Badge variant="secondary">Внимание</Badge>
            </CardContent>
          </Card>

          <Card data-testid="module-card-evidence-collection">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" />
                Сбор доказательств
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Криптографический сбор доказательств
              </p>
              <Badge variant="default">Активен</Badge>
            </CardContent>
          </Card>

          <Card data-testid="module-card-legal-knowledge-base">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-indigo-500" />
                Правовая база знаний
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                База знаний правовых норм и прецедентов
              </p>
              <Badge variant="default">Активен</Badge>
            </CardContent>
          </Card>

          <Card data-testid="module-card-campaign-management">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-500" />
                Управление кампаниями
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Автоматизация email кампаний
              </p>
              <Badge variant="default">Активен</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderMetricsCards = () => {
    if (metricsLoading || !metrics) return <div>Загрузка метрик...</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="metric-total-requests">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего запросов</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              Обработано: {metrics.processedRequests}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="metric-automated-decisions">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Автоматические решения</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.automatedDecisions}</div>
            <p className="text-xs text-muted-foreground">
              Эскалаций: {metrics.manualEscalations}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="metric-evidence-collections">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сбор доказательств</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.evidenceCollections}</div>
            <p className="text-xs text-muted-foreground">
              Криптопроверок: {metrics.cryptoValidations}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="metric-compliance-score">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Соответствие ФЗ-152</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">
              Нарушений: {metrics.violationsDetected}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLogsSection = () => {
    return (
      <div className="space-y-4">
        {/* Фильтры логов */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Label htmlFor="module-filter">Модуль:</Label>
            <Select 
              value={logFilter.module} 
              onValueChange={(value) => setLogFilter(prev => ({ ...prev, module: value }))}
            >
              <SelectTrigger className="w-[180px]" data-testid="filter-module">
                <SelectValue placeholder="Все модули" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все модули</SelectItem>
                <SelectItem value="response-analyzer">Анализатор ответов</SelectItem>
                <SelectItem value="decision-engine">Движок решений</SelectItem>
                <SelectItem value="evidence-collector">Сборщик доказательств</SelectItem>
                <SelectItem value="campaign-manager">Менеджер кампаний</SelectItem>
                <SelectItem value="email-automation">Email автоматизация</SelectItem>
                <SelectItem value="crypto-validator">Крипто-валидатор</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="level-filter">Уровень:</Label>
            <Select 
              value={logFilter.level} 
              onValueChange={(value) => setLogFilter(prev => ({ ...prev, level: value }))}
            >
              <SelectTrigger className="w-[140px]" data-testid="filter-level">
                <SelectValue placeholder="Все уровни" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все уровни</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="status-filter">Статус:</Label>
            <Select 
              value={logFilter.status} 
              onValueChange={(value) => setLogFilter(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-[140px]" data-testid="filter-status">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="success">Успех</SelectItem>
                <SelectItem value="failed">Ошибка</SelectItem>
                <SelectItem value="processing">Обработка</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" data-testid="date-picker">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Выбрать дату"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Input
            placeholder="Поиск в логах..."
            value={logFilter.search}
            onChange={(e) => setLogFilter(prev => ({ ...prev, search: e.target.value }))}
            className="max-w-xs"
            data-testid="input-search-logs"
          />

          <Button onClick={() => refetchLogs()} variant="outline" size="sm" data-testid="button-refresh-logs">
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button 
            onClick={() => exportLogsMutation.mutate()} 
            variant="outline" 
            size="sm"
            disabled={exportLogsMutation.isPending}
            data-testid="button-export-logs"
          >
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>

        {/* Таблица логов */}
        <div className="border rounded-lg">
          <div className="max-h-[500px] overflow-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Время</th>
                  <th className="text-left p-3 font-medium">Модуль</th>
                  <th className="text-left p-3 font-medium">Уровень</th>
                  <th className="text-left p-3 font-medium">Статус</th>
                  <th className="text-left p-3 font-medium">Сообщение</th>
                  <th className="text-left p-3 font-medium">ID запроса</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: SAZPDLog) => (
                  <tr key={log.id} className="border-b hover:bg-muted/30" data-testid={`log-row-${log.id}`}>
                    <td className="p-3 text-sm">
                      {format(new Date(log.timestamp), 'HH:mm:ss dd.MM.yyyy')}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{log.module}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={
                          log.level === 'critical' ? 'destructive' :
                          log.level === 'error' ? 'destructive' :
                          log.level === 'warning' ? 'secondary' : 
                          'default'
                        }
                      >
                        {log.level}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={
                          log.status === 'success' ? 'default' :
                          log.status === 'failed' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {log.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm max-w-md truncate" title={log.message}>
                      {log.message}
                    </td>
                    <td className="p-3 text-sm font-mono">
                      {log.requestId || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSAZPDTesting = () => {
    if (testSessionLoading) return <div>Загрузка статуса тестирования...</div>;

    const modules = [
      {
        id: 'document-generation',
        name: 'Document Generation Module',
        description: 'Генерация документов на основе пользовательских запросов',
        icon: FileText
      },
      {
        id: 'response-analysis',
        name: 'Response Analysis Module', 
        description: 'Анализ ответов операторов на предмет соответствия ФЗ-152',
        icon: Shield
      },
      {
        id: 'decision-engine',
        name: 'Decision Engine Module',
        description: 'Автоматическое принятие решений на основе анализа',
        icon: Zap
      },
      {
        id: 'evidence-collection',
        name: 'Evidence Collection Module',
        description: 'Сбор и сохранение доказательств для соблюдения ФЗ-152',
        icon: Database
      },
      {
        id: 'legal-knowledge-base',
        name: 'Legal Knowledge Base Module',
        description: 'База знаний правовых норм и прецедентов',
        icon: CheckCircle
      },
      {
        id: 'campaign-management',
        name: 'Campaign Management Module',
        description: 'Управление кампаниями и процессами удаления данных',
        icon: Activity
      }
    ];

    const getModuleStatus = (moduleId: string) => {
      return testSession?.modules?.find((m: any) => m.id === moduleId) || {
        status: 'idle',
        progress: 0,
        results: { tests: 0, passed: 0, failed: 0, errors: [], warnings: [] }
      };
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'running': return 'text-blue-600';
        case 'completed': return 'text-green-600';
        case 'failed': return 'text-red-600';
        default: return 'text-gray-500';
      }
    };

    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'running': return <Badge className="bg-blue-100 text-blue-700">Выполняется</Badge>;
        case 'completed': return <Badge className="bg-green-100 text-green-700">Завершено</Badge>;
        case 'failed': return <Badge className="bg-red-100 text-red-700">Ошибка</Badge>;
        default: return <Badge variant="outline">Ожидание</Badge>;
      }
    };

    return (
      <div className="space-y-6">
        {/* Заголовок и общие управления */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              САЗПД Тестирование
            </CardTitle>
            <CardDescription>
              Комплексное тестирование всех модулей системы автоматизированной защиты персональных данных
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => startFullTestMutation.mutate()}
                  disabled={testSession?.status === 'running' || startFullTestMutation.isPending}
                  data-testid="button-start-full-test"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Запустить все этапы
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => stopTestMutation.mutate()}
                  disabled={testSession?.status !== 'running' || stopTestMutation.isPending}
                  data-testid="button-stop-test"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Остановить
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => resetTestMutation.mutate()}
                  disabled={testSession?.status === 'running' || resetTestMutation.isPending}
                  data-testid="button-reset-test"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Сбросить
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {testSession?.status && (
                  <div className="text-sm">
                    Статус: {getStatusBadge(testSession.status)}
                  </div>
                )}
                
                {testSession?.status === 'running' && (
                  <div className="text-sm text-muted-foreground">
                    Прогресс: {testSession.progress}%
                  </div>
                )}
              </div>
            </div>

            {/* Общий прогресс-бар */}
            {testSession?.status === 'running' && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${testSession.progress}%` }}
                ></div>
              </div>
            )}

            {/* Сводка результатов */}
            {testSession?.summary && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{testSession.summary.totalTests}</div>
                  <div className="text-sm text-muted-foreground">Всего тестов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{testSession.summary.totalPassed}</div>
                  <div className="text-sm text-muted-foreground">Пройдено</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{testSession.summary.totalFailed}</div>
                  <div className="text-sm text-muted-foreground">Провалено</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{testSession.summary.totalDuration}с</div>
                  <div className="text-sm text-muted-foreground">Длительность</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Модули тестирования */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {modules.map((module) => {
            const moduleStatus = getModuleStatus(module.id);
            const IconComponent = module.icon;
            
            return (
              <Card key={module.id} data-testid={`test-module-${module.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-base">{module.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {module.description}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(moduleStatus.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Прогресс модуля */}
                  {moduleStatus.progress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          moduleStatus.status === 'failed' ? 'bg-red-500' :
                          moduleStatus.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${moduleStatus.progress}%` }}
                      ></div>
                    </div>
                  )}

                  {/* Результаты тестов модуля */}
                  {moduleStatus.results && moduleStatus.results.tests > 0 && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{moduleStatus.results.tests}</div>
                        <div className="text-muted-foreground">Тестов</div>
                      </div>
                      <div className="text-center text-green-600">
                        <div className="font-semibold">{moduleStatus.results.passed}</div>
                        <div className="text-muted-foreground">✓</div>
                      </div>
                      <div className="text-center text-red-600">
                        <div className="font-semibold">{moduleStatus.results.failed}</div>
                        <div className="text-muted-foreground">✗</div>
                      </div>
                    </div>
                  )}

                  {/* Кнопка запуска отдельного модуля */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => startStepTestMutation.mutate(module.id)}
                    disabled={testSession?.status === 'running' || startStepTestMutation.isPending}
                    data-testid={`button-test-${module.id}`}
                  >
                    <Play className="h-3 w-3 mr-2" />
                    Запустить этап
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Логи тестирования */}
        {testSession && (testSession.status === 'running' || testSession.status === 'completed') && (
          <Card>
            <CardHeader>
              <CardTitle>Логи тестирования</CardTitle>
              <CardDescription>
                Детальная информация о процессе выполнения тестов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-auto">
                {testSession.modules?.map((module: any) => (
                  module.results?.errors?.length > 0 || module.results?.warnings?.length > 0 ? (
                    <div key={module.id} className="border rounded p-3 space-y-2">
                      <div className="font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {module.name}
                      </div>
                      
                      {module.results.errors.map((error: any, idx: number) => (
                        <div key={idx} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          ❌ {error}
                        </div>
                      ))}
                      
                      {module.results.warnings.map((warning: any, idx: number) => (
                        <div key={idx} className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                          ⚠️ {warning}
                        </div>
                      ))}
                    </div>
                  ) : null
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderSettings = () => {
    if (settingsLoading || !settings) return <div>Загрузка настроек...</div>;

    return (
      <div className="space-y-6">
        {/* Response Analyzer Module */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Анализатор ответов
            </CardTitle>
            <CardDescription>
              Автоматический анализ ответов на запросы удаления данных и оценка соответствия ФЗ-152
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Включить модуль</Label>
                <div className="text-sm text-muted-foreground">
                  Активировать автоматический анализ ответов операторов
                </div>
              </div>
              <Switch
                checked={settings.modules?.responseAnalyzer?.enabled || false}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    modules: {
                      ...settings.modules,
                      responseAnalyzer: { ...settings.modules?.responseAnalyzer, enabled: checked }
                    }
                  })
                }
                data-testid="switch-response-analyzer"
              />
            </div>

            {settings.modules?.responseAnalyzer?.enabled && (
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="analyzer-interval">Интервал анализа (минуты)</Label>
                  <Input
                    id="analyzer-interval"
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.modules?.responseAnalyzer?.interval || 30}
                    onChange={(e) => 
                      updateSettingsMutation.mutate({
                        modules: {
                          ...settings.modules,
                          responseAnalyzer: { 
                            ...settings.modules?.responseAnalyzer, 
                            interval: parseInt(e.target.value) 
                          }
                        }
                      })
                    }
                    data-testid="input-analyzer-interval"
                  />
                  <div className="text-xs text-muted-foreground">
                    Как часто запускать автоматический анализ (5-1440 минут)
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Decision Engine Module */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Движок решений
            </CardTitle>
            <CardDescription>
              Автоматическое принятие решений на основе анализа ответов и правовых норм
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Включить модуль</Label>
                <div className="text-sm text-muted-foreground">
                  Активировать автоматическое принятие решений
                </div>
              </div>
              <Switch
                checked={settings.modules?.decisionEngine?.enabled || false}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    modules: {
                      ...settings.modules,
                      decisionEngine: { ...settings.modules?.decisionEngine, enabled: checked }
                    }
                  })
                }
                data-testid="switch-decision-engine"
              />
            </div>

            {settings.modules?.decisionEngine?.enabled && (
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="decision-threshold">Порог уверенности (%)</Label>
                  <Input
                    id="decision-threshold"
                    type="number"
                    min="50"
                    max="100"
                    value={settings.modules?.decisionEngine?.autoDecisionThreshold || 85}
                    onChange={(e) => 
                      updateSettingsMutation.mutate({
                        modules: {
                          ...settings.modules,
                          decisionEngine: { 
                            ...settings.modules?.decisionEngine, 
                            autoDecisionThreshold: parseInt(e.target.value) 
                          }
                        }
                      })
                    }
                    data-testid="input-decision-threshold"
                  />
                  <div className="text-xs text-muted-foreground">
                    Минимальный уровень уверенности для автоматического принятия решения (50-100%)
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evidence Collector Module */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Сборщик доказательств
            </CardTitle>
            <CardDescription>
              Сбор и сохранение доказательств соблюдения ФЗ-152 с криптографической защитой
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Включить модуль</Label>
                <div className="text-sm text-muted-foreground">
                  Активировать сбор доказательств соответствия
                </div>
              </div>
              <Switch
                checked={settings.modules?.evidenceCollector?.enabled || false}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    modules: {
                      ...settings.modules,
                      evidenceCollector: { ...settings.modules?.evidenceCollector, enabled: checked }
                    }
                  })
                }
                data-testid="switch-evidence-collector"
              />
            </div>

            {settings.modules?.evidenceCollector?.enabled && (
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="evidence-retention">Срок хранения доказательств (дни)</Label>
                  <Input
                    id="evidence-retention"
                    type="number"
                    min="30"
                    max="3650"
                    value={settings.modules?.evidenceCollector?.retentionDays || 1095}
                    onChange={(e) => 
                      updateSettingsMutation.mutate({
                        modules: {
                          ...settings.modules,
                          evidenceCollector: { 
                            ...settings.modules?.evidenceCollector, 
                            retentionDays: parseInt(e.target.value) 
                          }
                        }
                      })
                    }
                    data-testid="input-evidence-retention"
                  />
                  <div className="text-xs text-muted-foreground">
                    Срок хранения криптографических доказательств (30-3650 дней, рекомендуется 3 года)
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Manager Module */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Менеджер кампаний
            </CardTitle>
            <CardDescription>
              Управление кампаниями удаления данных и координация процессов
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Включить модуль</Label>
                <div className="text-sm text-muted-foreground">
                  Активировать управление кампаниями удаления
                </div>
              </div>
              <Switch
                checked={settings.modules?.campaignManager?.enabled || false}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    modules: {
                      ...settings.modules,
                      campaignManager: { ...settings.modules?.campaignManager, enabled: checked }
                    }
                  })
                }
                data-testid="switch-campaign-manager"
              />
            </div>

            {settings.modules?.campaignManager?.enabled && (
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="max-campaigns">Максимальное количество кампаний</Label>
                  <Input
                    id="max-campaigns"
                    type="number"
                    min="1"
                    max="1000"
                    value={settings.modules?.campaignManager?.maxCampaigns || 50}
                    onChange={(e) => 
                      updateSettingsMutation.mutate({
                        modules: {
                          ...settings.modules,
                          campaignManager: { 
                            ...settings.modules?.campaignManager, 
                            maxCampaigns: parseInt(e.target.value) 
                          }
                        }
                      })
                    }
                    data-testid="input-max-campaigns"
                  />
                  <div className="text-xs text-muted-foreground">
                    Максимальное количество одновременно активных кампаний (1-1000)
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Automation Module */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Email автоматизация
            </CardTitle>
            <CardDescription>
              Автоматическая отправка повторных запросов и уведомлений операторам
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Включить модуль</Label>
                <div className="text-sm text-muted-foreground">
                  Активировать автоматическую email рассылку
                </div>
              </div>
              <Switch
                checked={settings.modules?.emailAutomation?.enabled || false}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    modules: {
                      ...settings.modules,
                      emailAutomation: { ...settings.modules?.emailAutomation, enabled: checked }
                    }
                  })
                }
                data-testid="switch-email-automation"
              />
            </div>

            {settings.modules?.emailAutomation?.enabled && (
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="followup-hours">Интервал повторных запросов (часы)</Label>
                  <Input
                    id="followup-hours"
                    type="number"
                    min="1"
                    max="720"
                    value={settings.modules?.emailAutomation?.followUpHours || 48}
                    onChange={(e) => 
                      updateSettingsMutation.mutate({
                        modules: {
                          ...settings.modules,
                          emailAutomation: { 
                            ...settings.modules?.emailAutomation, 
                            followUpHours: parseInt(e.target.value) 
                          }
                        }
                      })
                    }
                    data-testid="input-followup-hours"
                  />
                  <div className="text-xs text-muted-foreground">
                    Через сколько часов отправлять повторный запрос (1-720 часов)
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crypto Validator Module */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Крипто-валидатор
            </CardTitle>
            <CardDescription>
              Проверка криптографических подписей и сертификатов для обеспечения доказательной базы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Включить модуль</Label>
                <div className="text-sm text-muted-foreground">
                  Активировать криптографическую проверку
                </div>
              </div>
              <Switch
                checked={settings.modules?.cryptoValidator?.enabled || false}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    modules: {
                      ...settings.modules,
                      cryptoValidator: { ...settings.modules?.cryptoValidator, enabled: checked }
                    }
                  })
                }
                data-testid="switch-crypto-validator"
              />
            </div>

            {settings.modules?.cryptoValidator?.enabled && (
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Строгий режим</Label>
                    <div className="text-sm text-muted-foreground">
                      Требовать проверку всех криптографических подписей
                    </div>
                  </div>
                  <Switch
                    checked={settings.modules?.cryptoValidator?.strictMode || false}
                    onCheckedChange={(checked) => 
                      updateSettingsMutation.mutate({
                        modules: {
                          ...settings.modules,
                          cryptoValidator: { 
                            ...settings.modules?.cryptoValidator, 
                            strictMode: checked 
                          }
                        }
                      })
                    }
                    data-testid="switch-crypto-strict-mode"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compliance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Настройки соответствия ФЗ-152
            </CardTitle>
            <CardDescription>
              Расширенные параметры обеспечения соответствия требованиям федерального закона
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Строгий режим ФЗ-152</Label>
                <div className="text-sm text-muted-foreground">
                  Включить усиленные требования защиты персональных данных
                </div>
              </div>
              <Switch
                checked={settings.compliance?.fz152Mode || false}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    compliance: { ...settings.compliance, fz152Mode: checked }
                  })
                }
                data-testid="switch-fz152-mode"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retention-days">Срок хранения данных (дни)</Label>
                <Input
                  id="retention-days"
                  type="number"
                  min="1"
                  max="3650"
                  value={settings.compliance?.dataRetentionDays || 30}
                  onChange={(e) => 
                    updateSettingsMutation.mutate({
                      compliance: { 
                        ...settings.compliance, 
                        dataRetentionDays: parseInt(e.target.value) 
                      }
                    })
                  }
                  data-testid="input-retention-days"
                />
                <div className="text-xs text-muted-foreground">
                  Общий срок хранения персональных данных (1-3650 дней)
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="escalation-hours">Автоэскалация (часы)</Label>
                <Input
                  id="escalation-hours"
                  type="number"
                  min="1"
                  max="720"
                  value={settings.compliance?.autoEscalationHours || 72}
                  onChange={(e) => 
                    updateSettingsMutation.mutate({
                      compliance: { 
                        ...settings.compliance, 
                        autoEscalationHours: parseInt(e.target.value) 
                      }
                    })
                  }
                  data-testid="input-escalation-hours"
                />
                <div className="text-xs text-muted-foreground">
                  Автоматическая эскалация при отсутствии ответа (1-720 часов)
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response-timeout">Таймаут ответа оператора (часы)</Label>
                <Input
                  id="response-timeout"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.compliance?.operatorResponseTimeout || 24}
                  onChange={(e) => 
                    updateSettingsMutation.mutate({
                      compliance: { 
                        ...settings.compliance, 
                        operatorResponseTimeout: parseInt(e.target.value) 
                      }
                    })
                  }
                  data-testid="input-response-timeout"
                />
                <div className="text-xs text-muted-foreground">
                  Максимальное время ожидания ответа от оператора (1-168 часов)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOperatorStats = () => {
    if (operatorStatsLoading) return <div>Загрузка статистики операторов...</div>;

    return (
      <div className="space-y-4">
        <div className="grid gap-4">
          {operatorStats.map((operator: OperatorStats) => (
            <Card key={operator.operatorId} data-testid={`operator-${operator.operatorId}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{operator.name}</CardTitle>
                  <Badge 
                    variant={operator.complianceScore >= 90 ? 'default' : 
                            operator.complianceScore >= 70 ? 'secondary' : 'destructive'}
                  >
                    Соответствие: {operator.complianceScore}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Ответов</p>
                    <p className="text-2xl font-bold">{operator.totalResponses}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Успешность</p>
                    <p className="text-2xl font-bold">{operator.successRate}%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Время ответа</p>
                    <p className="text-2xl font-bold">{operator.avgResponseTime}ч</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Нарушения</p>
                    <p className="text-2xl font-bold text-destructive">{operator.violationsCount}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Последняя активность: {format(new Date(operator.lastActivity), 'dd.MM.yyyy HH:mm')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to get troubleshooting recommendations based on log
  const getTroubleshootingRecommendations = (log: SAZPDLog): string[] => {
    const recommendations: string[] = [];
    
    // Base recommendations by level
    if (log.level === 'error' || log.level === 'critical') {
      if (log.module === 'response-analyzer') {
        recommendations.push('Проверьте настройки интервала анализа в конфигурации модуля');
        recommendations.push('Убедитесь, что модуль активирован в настройках');
        recommendations.push('Проверьте подключение к базе данных и доступность API');
      } else if (log.module === 'decision-engine') {
        recommendations.push('Проверьте корректность настройки порога уверенности (50-100%)');
        recommendations.push('Убедитесь, что EVIDENCE_SERVER_SECRET настроен (32+ символов)');
        recommendations.push('Проверьте импорт и инициализацию модуля в коде');
      } else if (log.module === 'evidence-collector') {
        recommendations.push('Проверьте настройки срока хранения доказательств');
        recommendations.push('Убедитесь в достаточном месте на диске для сохранения данных');
        recommendations.push('Проверьте разрешения файловой системы');
      } else if (log.module === 'email-automation') {
        recommendations.push('Проверьте настройки SMTP и API ключи для Mailganer');
        recommendations.push('Убедитесь в правильности настройки интервала отправки');
        recommendations.push('Проверьте подключение к email сервису');
      }
      
      // Common critical error recommendations
      if (log.level === 'critical') {
        recommendations.push('КРИТИЧНО: Немедленно обратитесь к системному администратору');
        recommendations.push('Рассмотрите возможность временного отключения модуля');
        recommendations.push('Проверьте системные ресурсы (CPU, память, диск)');
      }
    } else if (log.level === 'warning') {
      recommendations.push('Мониторьте ситуацию - возможно потребуется вмешательство');
      recommendations.push('Проверьте соответствие настроек требованиям ФЗ-152');
    }

    // Context-specific recommendations based on message content
    if (log.message.includes('timeout')) {
      recommendations.push('Увеличьте таймауты в настройках модуля');
      recommendations.push('Проверьте скорость сетевого подключения');
    }
    if (log.message.includes('database') || log.message.includes('DB')) {
      recommendations.push('Проверьте подключение к базе данных PostgreSQL');
      recommendations.push('Убедитесь в корректности DATABASE_URL');
    }
    if (log.message.includes('API') || log.message.includes('HTTP')) {
      recommendations.push('Проверьте доступность внешних API сервисов');
      recommendations.push('Убедитесь в корректности API ключей и токенов');
    }

    return recommendations.length > 0 ? recommendations : ['Обратитесь к документации или системному администратору'];
  };

  // Enhanced log detail component
  const LogDetailPanel = ({ log }: { log: SAZPDLog }) => {
    const recommendations = getTroubleshootingRecommendations(log);
    
    return (
      <div className="space-y-4 p-4 bg-muted/10 border rounded-lg">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">ID записи</Label>
            <p className="text-sm font-mono">{log.id}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Статус</Label>
            <Badge variant={log.status === 'failed' ? 'destructive' : log.status === 'processing' ? 'secondary' : 'default'} className="text-xs">
              {log.status === 'success' ? 'Успешно' : log.status === 'failed' ? 'Ошибка' : 'Обработка'}
            </Badge>
          </div>
          {log.requestId && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">ID запроса</Label>
              <p className="text-sm font-mono">{log.requestId}</p>
            </div>
          )}
        </div>

        {/* Full Message */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Полное сообщение</Label>
          <div className="p-3 bg-background border rounded text-sm">
            {log.message}
          </div>
        </div>

        {/* Contextual Details */}
        {log.details && Object.keys(log.details).length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Контекстная информация</Label>
            <div className="p-3 bg-background border rounded">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap overflow-auto">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Troubleshooting Recommendations */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Рекомендации по устранению
          </Label>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 border-l-2 border-blue-200 dark:border-blue-800 rounded-r">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-blue-900 dark:text-blue-100">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" data-testid={`button-copy-log-${log.id}`}>
            <Copy className="h-3 w-3 mr-1" />
            Копировать детали
          </Button>
          {log.level === 'error' || log.level === 'critical' ? (
            <Button variant="outline" size="sm" data-testid={`button-escalate-${log.id}`}>
              <AlertTriangle className="h-3 w-3 mr-1" />
              Эскалировать
            </Button>
          ) : null}
          <Button variant="outline" size="sm" data-testid={`button-mark-resolved-${log.id}`}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Отметить решенным
          </Button>
        </div>
      </div>
    );
  };

  const renderLogsTable = () => {
    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
    
    if (logsLoading) return <div>Загрузка логов...</div>;

    return (
      <div className="space-y-6">
        {/* Enhanced Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Фильтры и поиск
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filter-module">Модуль</Label>
                <Select 
                  value={logFilter.module} 
                  onValueChange={(value) => setLogFilter(prev => ({...prev, module: value}))}
                >
                  <SelectTrigger id="filter-module" data-testid="select-log-module">
                    <SelectValue placeholder="Все модули" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все модули</SelectItem>
                    <SelectItem value="response-analyzer">Анализатор ответов</SelectItem>
                    <SelectItem value="decision-engine">Движок решений</SelectItem>
                    <SelectItem value="evidence-collector">Сборщик доказательств</SelectItem>
                    <SelectItem value="campaign-manager">Менеджер кампаний</SelectItem>
                    <SelectItem value="email-automation">Email автоматизация</SelectItem>
                    <SelectItem value="crypto-validator">Крипто-валидатор</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-level">Уровень</Label>
                <Select 
                  value={logFilter.level} 
                  onValueChange={(value) => setLogFilter(prev => ({...prev, level: value}))}
                >
                  <SelectTrigger id="filter-level" data-testid="select-log-level">
                    <SelectValue placeholder="Все уровни" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все уровни</SelectItem>
                    <SelectItem value="info">Информация</SelectItem>
                    <SelectItem value="warning">Предупреждение</SelectItem>
                    <SelectItem value="error">Ошибка</SelectItem>
                    <SelectItem value="critical">Критическая</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-status">Статус</Label>
                <Select 
                  value={logFilter.status} 
                  onValueChange={(value) => setLogFilter(prev => ({...prev, status: value}))}
                >
                  <SelectTrigger id="filter-status" data-testid="select-log-status">
                    <SelectValue placeholder="Все статусы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="success">Успешно</SelectItem>
                    <SelectItem value="failed">Ошибка</SelectItem>
                    <SelectItem value="processing">Обработка</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-search">Поиск</Label>
                <Input
                  id="filter-search"
                  placeholder="Поиск по сообщению..."
                  value={logFilter.search}
                  onChange={(e) => setLogFilter(prev => ({...prev, search: e.target.value}))}
                  data-testid="input-log-search"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Найдено записей: {logs?.length || 0}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={refetchLogs} data-testid="button-refresh-logs">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Обновить
                </Button>
                <Button variant="outline" size="sm" data-testid="button-export-logs">
                  <Download className="h-4 w-4 mr-2" />
                  Экспорт
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Журнал событий САЗПД
            </CardTitle>
            <CardDescription>
              Детальный журнал всех событий системы с контекстной информацией и рекомендациями
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs && logs.length > 0 ? (
                logs.slice(0, 50).map((log: SAZPDLog) => (
                  <div key={log.id} className="border rounded-lg overflow-hidden">
                    {/* Log Summary Row */}
                    <div className="p-4 hover:bg-muted/20 cursor-pointer" onClick={() => 
                      setExpandedLogId(expandedLogId === log.id ? null : log.id)
                    }>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-sm text-muted-foreground min-w-0">
                            {format(new Date(log.timestamp), 'dd.MM.yyyy HH:mm:ss')}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {log.module === 'response-analyzer' ? 'Анализатор' :
                             log.module === 'decision-engine' ? 'Решения' :
                             log.module === 'evidence-collector' ? 'Доказательства' :
                             log.module === 'campaign-manager' ? 'Кампании' :
                             log.module === 'email-automation' ? 'Email' :
                             log.module === 'crypto-validator' ? 'Криптовалидатор' : log.module}
                          </Badge>
                          <Badge 
                            variant={
                              log.level === 'error' || log.level === 'critical' ? 'destructive' : 
                              log.level === 'warning' ? 'secondary' : 'default'
                            }
                            className="text-xs"
                          >
                            {log.level === 'info' ? 'ИНФО' :
                             log.level === 'warning' ? 'ПРЕДУПР' :
                             log.level === 'error' ? 'ОШИБКА' :
                             log.level === 'critical' ? 'КРИТИЧ' : log.level.toUpperCase()}
                          </Badge>
                          <div className="text-sm truncate min-w-0 flex-1" title={log.message}>
                            {log.message}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={log.status === 'failed' ? 'destructive' : log.status === 'processing' ? 'secondary' : 'default'} 
                            className="text-xs"
                          >
                            {log.status === 'success' ? 'ОК' : log.status === 'failed' ? 'ОШИБКА' : 'ПРОЦЕСС'}
                          </Badge>
                          <Button variant="ghost" size="sm" data-testid={`button-expand-log-${log.id}`}>
                            {expandedLogId === log.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedLogId === log.id && (
                      <div className="border-t bg-muted/5">
                        <LogDetailPanel log={log} />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Нет доступных логов для отображения</p>
                  <p className="text-sm mt-2">Логи появятся по мере работы системы САЗПД</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Main component return
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Админ панель САЗПД</h1>
          <p className="text-muted-foreground">
            Система автоматизированной защиты персональных данных - мониторинг и управление
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600">
            ФЗ-152 Compliant
          </Badge>
          
          {/* Real-time monitoring controls */}
          <div className="flex items-center space-x-2 border-l pl-2">
            <Badge 
              variant={realTimeEnabled ? "default" : "secondary"} 
              className={cn(
                "flex items-center gap-1 text-xs",
                realTimeEnabled ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : ""
              )}
            >
              <div className={cn(
                "w-2 h-2 rounded-full",
                realTimeEnabled ? "bg-green-500 animate-pulse" : "bg-gray-400"
              )} />
              {realTimeEnabled ? "МОНИТОРИНГ АКТИВЕН" : "МОНИТОРИНГ ОТКЛЮЧЕН"}
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setRealTimeEnabled(!realTimeEnabled)}
              data-testid="button-toggle-realtime"
            >
              {realTimeEnabled ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {realTimeEnabled ? "Пауза" : "Запуск"}
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              refetchMetrics();
              refetchHealth();
              refetchLogs();
              refetchOperatorStats();
              refetchConfig();
              refetchSettings();
            }}
            data-testid="button-refresh-all"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить все
          </Button>
        </div>
      </div>

      <Tabs value={getActiveTabFromUrl()} onValueChange={(value) => {
        // Изменяем URL при переключении вкладок
        const basePath = '/admin/sazpd';
        if (value === 'metrics') {
          setLocation(basePath);
        } else {
          setLocation(`${basePath}/${value}`);
        }
      }} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="metrics" data-testid="tab-metrics">
            <Activity className="h-4 w-4 mr-2" />
            Метрики
          </TabsTrigger>
          <TabsTrigger value="diagnostics" data-testid="tab-diagnostics">
            <Shield className="h-4 w-4 mr-2" />
            Диагностика
          </TabsTrigger>
          <TabsTrigger value="testing" data-testid="tab-testing">
            <Play className="h-4 w-4 mr-2" />
            Тестирование
          </TabsTrigger>
          <TabsTrigger value="logs" data-testid="tab-logs">
            <Filter className="h-4 w-4 mr-2" />
            Логи
          </TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">
            <Settings className="h-4 w-4 mr-2" />
            Настройки
          </TabsTrigger>
          <TabsTrigger value="operators" data-testid="tab-operators">
            <Users className="h-4 w-4 mr-2" />
            Операторы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {/* Real-time monitoring status panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Статус real-time мониторинга
              </CardTitle>
              <CardDescription>
                Состояние автоматического обновления данных системы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Monitoring status overview */}
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        realTimeEnabled ? "bg-green-500 animate-pulse" : "bg-gray-400"
                      )} />
                      Общий статус
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">
                      {realTimeEnabled ? "АКТИВЕН" : "ОТКЛЮЧЕН"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Автообновление данных
                    </p>
                  </CardContent>
                </Card>

                {/* Active queries count */}
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Активных запросов</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-blue-600">
                      {realTimeEnabled ? 5 : 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Обновляются автоматически
                    </p>
                  </CardContent>
                </Card>

                {/* Next update countdown */}
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Быстрое обновление</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-green-600">
                      {realTimeEnabled ? `${Math.floor(monitoringIntervals.health / 1000)}с` : "—"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Health checks
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed monitoring intervals */}
              {realTimeEnabled && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Интервалы обновления:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Health: {monitoringIntervals.health / 1000}с</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span>Логи: {monitoringIntervals.logs / 1000}с</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      <span>Метрики: {monitoringIntervals.metrics / 1000}с</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      <span>Операторы: {monitoringIntervals.operators / 1000}с</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                      <span>Конфиги: {monitoringIntervals.configs / 1000}с</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Метрики САЗПД системы</CardTitle>
              <CardDescription>
                Основные показатели работы модулей защиты персональных данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderMetricsCards()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-6">
          {renderAdvancedDiagnostics()}
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Логи работы САЗПД модулей</CardTitle>
              <CardDescription>
                Детальное отслеживание работы всех компонентов системы
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderLogsTable()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          {renderSAZPDTesting()}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {renderSettings()}
        </TabsContent>

        <TabsContent value="operators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика операторов</CardTitle>
              <CardDescription>
                Анализ эффективности работы операторов и соблюдения требований ФЗ-152
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderOperatorStats()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
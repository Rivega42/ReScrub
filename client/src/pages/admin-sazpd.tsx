import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { CalendarIcon, Download, Filter, RefreshCw, Settings, Shield, Activity, Users, AlertTriangle, CheckCircle, Clock, TrendingUp, Play, Pause, RotateCcw, Zap, Database, FileText } from "lucide-react";
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

  // Получение логов САЗПД
  const { data: logs = [], isLoading: logsLoading, refetch: refetchLogs } = useQuery({
    queryKey: ['/api/sazpd/logs', logFilter, selectedDate],
    queryFn: () => apiRequest(`/api/sazpd/logs?${new URLSearchParams({
      module: logFilter.module,
      level: logFilter.level,
      status: logFilter.status,
      search: logFilter.search,
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
    })}`)
  });

  // Получение метрик САЗПД
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/sazpd/metrics'],
    queryFn: () => apiRequest('/api/sazpd/metrics')
  });

  // Получение настроек САЗПД
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/sazpd/settings'],
    queryFn: () => apiRequest('/api/sazpd/settings')
  });

  // Получение статистики операторов
  const { data: operatorStats = [], isLoading: operatorStatsLoading } = useQuery({
    queryKey: ['/api/sazpd/operator-stats'],
    queryFn: () => apiRequest('/api/sazpd/operator-stats')
  });

  // Получение статуса САЗПД тестирования
  const { data: testSession, isLoading: testSessionLoading, refetch: refetchTestSession } = useQuery({
    queryKey: ['/api/admin/sazpd/test/status'],
    queryFn: () => apiRequest('/api/admin/sazpd/test/status'),
    refetchInterval: 2000 // Обновляем каждые 2 секунды
  });

  // Получение результатов тестов
  const { data: testResults } = useQuery({
    queryKey: ['/api/admin/sazpd/test/results'],
    queryFn: () => apiRequest('/api/admin/sazpd/test/results'),
    enabled: testSession?.status === 'completed'
  });

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

  const renderLogsTable = () => {
    if (logsLoading) return <div>Загрузка логов...</div>;

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
      return testSession?.modules?.find(m => m.id === moduleId) || {
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
                {testSession.modules?.map((module) => (
                  module.results?.errors?.length > 0 || module.results?.warnings?.length > 0 ? (
                    <div key={module.id} className="border rounded p-3 space-y-2">
                      <div className="font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {module.name}
                      </div>
                      
                      {module.results.errors.map((error, idx) => (
                        <div key={idx} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          ❌ {error}
                        </div>
                      ))}
                      
                      {module.results.warnings.map((warning, idx) => (
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
        <Card>
          <CardHeader>
            <CardTitle>Настройки модулей САЗПД</CardTitle>
            <CardDescription>
              Конфигурация работы модулей системы автоматизированной защиты персональных данных
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Анализатор ответов */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Анализатор ответов</Label>
                <div className="text-sm text-muted-foreground">
                  Автоматический анализ ответов на запросы удаления данных
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

            <Separator />

            {/* Движок решений */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Движок решений</Label>
                <div className="text-sm text-muted-foreground">
                  Автоматическое принятие решений на основе анализа
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

            <Separator />

            {/* Сборщик доказательств */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Сборщик доказательств</Label>
                <div className="text-sm text-muted-foreground">
                  Сбор и сохранение доказательств для соблюдения ФЗ-152
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

            <Separator />

            {/* Менеджер кампаний */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Менеджер кампаний</Label>
                <div className="text-sm text-muted-foreground">
                  Управление кампаниями и процессами удаления данных
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

            <Separator />

            {/* Email автоматизация */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email автоматизация</Label>
                <div className="text-sm text-muted-foreground">
                  Автоматическая отправка повторных запросов и уведомлений
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

            <Separator />

            {/* Крипто-валидатор */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Крипто-валидатор</Label>
                <div className="text-sm text-muted-foreground">
                  Проверка криптографических подписей и сертификатов
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Настройки соответствия ФЗ-152</CardTitle>
            <CardDescription>
              Параметры обеспечения соответствия требованиям федерального закона
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retention-days">Срок хранения данных (дни)</Label>
                <Input
                  id="retention-days"
                  type="number"
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="escalation-hours">Автоэскалация (часы)</Label>
                <Input
                  id="escalation-hours"
                  type="number"
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
          <Button variant="outline" size="sm" data-testid="button-refresh-all">
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить все
          </Button>
        </div>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="metrics" data-testid="tab-metrics">
            <Activity className="h-4 w-4 mr-2" />
            Метрики
          </TabsTrigger>
          <TabsTrigger value="testing" data-testid="tab-testing">
            <Play className="h-4 w-4 mr-2" />
            САЗПД Тестирование
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
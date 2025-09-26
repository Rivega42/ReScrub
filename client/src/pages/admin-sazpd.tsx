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
import { CalendarIcon, Download, Filter, RefreshCw, Settings, Shield, Activity, Users, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";

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
                checked={settings.modules.responseAnalyzer.enabled}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    modules: {
                      ...settings.modules,
                      responseAnalyzer: { ...settings.modules.responseAnalyzer, enabled: checked }
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
                checked={settings.modules.decisionEngine.enabled}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    modules: {
                      ...settings.modules,
                      decisionEngine: { ...settings.modules.decisionEngine, enabled: checked }
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
                checked={settings.modules.evidenceCollector.enabled}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    modules: {
                      ...settings.modules,
                      evidenceCollector: { ...settings.modules.evidenceCollector, enabled: checked }
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
                checked={settings.modules.campaignManager.enabled}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    modules: {
                      ...settings.modules,
                      campaignManager: { ...settings.modules.campaignManager, enabled: checked }
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
                checked={settings.modules.emailAutomation.enabled}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    modules: {
                      ...settings.modules,
                      emailAutomation: { ...settings.modules.emailAutomation, enabled: checked }
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
                checked={settings.modules.cryptoValidator.enabled}
                onCheckedChange={(checked) => 
                  updateSettingsMutation.mutate({
                    modules: {
                      ...settings.modules,
                      cryptoValidator: { ...settings.modules.cryptoValidator, enabled: checked }
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
                checked={settings.compliance.fz152Mode}
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
                  value={settings.compliance.dataRetentionDays}
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
                  value={settings.compliance.autoEscalationHours}
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics" data-testid="tab-metrics">
            <Activity className="h-4 w-4 mr-2" />
            Метрики
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
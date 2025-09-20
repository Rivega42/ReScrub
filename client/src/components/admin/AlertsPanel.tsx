import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Bell,
  BellOff,
  Filter,
  X,
  Clock,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export interface SystemAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  service: string;
  message: string;
  details?: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

interface AlertsPanelProps {
  alerts?: SystemAlert[];
  onAcknowledge?: (alertId: string) => void;
  onDelete?: (alertId: string) => void;
  onPlaySound?: (severity: 'critical' | 'warning' | 'info') => void;
  isLoading?: boolean;
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    label: 'Критично',
    badgeVariant: 'destructive' as const
  },
  warning: {
    icon: AlertCircle,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    label: 'Предупреждение',
    badgeVariant: 'secondary' as const
  },
  info: {
    icon: Info,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    label: 'Информация',
    badgeVariant: 'outline' as const
  }
};

export function AlertsPanel({ 
  alerts = [], 
  onAcknowledge, 
  onDelete,
  onPlaySound,
  isLoading 
}: AlertsPanelProps) {
  const [filterService, setFilterService] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Получить уникальные сервисы для фильтра
  const services = Array.from(new Set(alerts.map(a => a.service)));

  // Фильтрация алертов
  const filteredAlerts = alerts.filter(alert => {
    if (filterService !== 'all' && alert.service !== filterService) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    return true;
  });

  // Группировка по статусу подтверждения
  const unacknowledged = filteredAlerts.filter(a => !a.acknowledged);
  const acknowledged = filteredAlerts.filter(a => a.acknowledged);

  // Воспроизвести звук для критичных алертов
  const playAlertSound = (severity: 'critical' | 'warning' | 'info') => {
    if (soundEnabled && onPlaySound) {
      onPlaySound(severity);
    }
  };

  // Проверить на новые критичные алерты
  const criticalCount = unacknowledged.filter(a => a.severity === 'critical').length;
  const warningCount = unacknowledged.filter(a => a.severity === 'warning').length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Системные оповещения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-10 bg-muted rounded" />
            <div className="h-24 bg-muted rounded" />
            <div className="h-24 bg-muted rounded" />
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
              <Bell className="h-5 w-5" />
              Системные оповещения
            </CardTitle>
            <CardDescription className="mt-1">
              {unacknowledged.length > 0 ? (
                <span className="text-yellow-600 dark:text-yellow-400">
                  {unacknowledged.length} неподтвержденных
                </span>
              ) : (
                'Все оповещения обработаны'
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive">
                {criticalCount} критичных
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary">
                {warningCount} предупреждений
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              data-testid="button-toggle-sound"
            >
              {soundEnabled ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Фильтры */}
        <div className="flex gap-2">
          <Select value={filterService} onValueChange={setFilterService}>
            <SelectTrigger className="w-[180px]" data-testid="select-service-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Все сервисы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все сервисы</SelectItem>
              {services.map(service => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[180px]" data-testid="select-severity-filter">
              <SelectValue placeholder="Все уровни" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все уровни</SelectItem>
              <SelectItem value="critical">Критичные</SelectItem>
              <SelectItem value="warning">Предупреждения</SelectItem>
              <SelectItem value="info">Информационные</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Список алертов */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 pr-4">
            {filteredAlerts.length === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Нет оповещений</AlertTitle>
                <AlertDescription>
                  {filterService !== 'all' || filterSeverity !== 'all' 
                    ? 'Нет оповещений, соответствующих выбранным фильтрам'
                    : 'Все системы работают нормально'
                  }
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Неподтвержденные алерты */}
                {unacknowledged.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Требуют внимания
                    </div>
                    {unacknowledged.map(alert => {
                      const config = severityConfig[alert.severity];
                      const Icon = config.icon;
                      
                      return (
                        <Alert 
                          key={alert.id} 
                          className={`${config.borderColor} ${config.bgColor}`}
                        >
                          <Icon className={`h-4 w-4 ${config.color}`} />
                          <AlertTitle className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={config.badgeVariant} className="text-xs">
                                {config.label}
                              </Badge>
                              <span className="text-sm">{alert.service}</span>
                              <span className="text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {formatDistanceToNow(new Date(alert.timestamp), { 
                                  addSuffix: true, 
                                  locale: ru 
                                })}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              {onAcknowledge && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    onAcknowledge(alert.id);
                                    if (alert.severity === 'critical') {
                                      playAlertSound('critical');
                                    }
                                  }}
                                  data-testid={`button-acknowledge-${alert.id}`}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                              {onDelete && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => onDelete(alert.id)}
                                  data-testid={`button-delete-${alert.id}`}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </AlertTitle>
                          <AlertDescription className="mt-2">
                            <div className="text-sm">{alert.message}</div>
                            {alert.details && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {alert.details}
                              </div>
                            )}
                          </AlertDescription>
                        </Alert>
                      );
                    })}
                  </div>
                )}

                {/* Подтвержденные алерты */}
                {acknowledged.length > 0 && (
                  <div className="space-y-2 opacity-60">
                    <div className="text-sm font-medium text-muted-foreground">
                      Обработанные
                    </div>
                    {acknowledged.map(alert => {
                      const config = severityConfig[alert.severity];
                      const Icon = config.icon;
                      
                      return (
                        <Alert key={alert.id} className="border-muted">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <AlertTitle className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {config.label}
                              </Badge>
                              <span className="text-sm">{alert.service}</span>
                              <span className="text-xs text-muted-foreground">
                                <CheckCircle className="h-3 w-3 inline mr-1 text-green-500" />
                                Обработано {alert.acknowledgedBy}
                              </span>
                            </div>
                            {onDelete && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onDelete(alert.id)}
                                data-testid={`button-delete-${alert.id}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </AlertTitle>
                          <AlertDescription className="text-xs text-muted-foreground">
                            {alert.message}
                          </AlertDescription>
                        </Alert>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Trash2,
  Archive,
  ChevronDown,
  ChevronUp,
  Bell,
  BellOff
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SystemAlert {
  id: string;
  service: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  relatedAlerts?: string[];
  affectedComponents?: string[];
  suggestedActions?: string[];
}

interface SystemAlertsProps {
  alerts: SystemAlert[];
  isLoading?: boolean;
  onAcknowledge?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onDelete?: (alertId: string) => void;
  onBulkAction?: (action: 'acknowledge' | 'resolve' | 'delete', alertIds: string[]) => void;
}

export function SystemAlerts({ 
  alerts, 
  isLoading, 
  onAcknowledge,
  onResolve,
  onDelete,
  onBulkAction 
}: SystemAlertsProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

  const getSeverityIcon = (severity: string) => {
    const iconProps = { className: "h-4 w-4" };
    switch (severity) {
      case 'critical': 
        return <XCircle {...iconProps} className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'warning': 
        return <AlertTriangle {...iconProps} className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'info': 
        return <Info {...iconProps} className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default: 
        return <AlertCircle {...iconProps} className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variant = severity === 'critical' ? 'destructive' : 
                    severity === 'warning' ? 'secondary' : 'default';
    const label = severity === 'critical' ? 'Критический' : 
                  severity === 'warning' ? 'Предупреждение' : 'Информация';
    return <Badge variant={variant} className="text-xs">{label}</Badge>;
  };

  const getAlertColor = (severity: string, resolved: boolean) => {
    if (resolved) return 'border-muted bg-muted/20';
    switch (severity) {
      case 'critical': 
        return 'border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/20';
      case 'warning': 
        return 'border-yellow-600 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info': 
        return 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20';
      default: 
        return 'border-border';
    }
  };

  const uniqueServices = useMemo(() => {
    const services = new Set(alerts.map(a => a.service));
    return Array.from(services);
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Filter by severity
      if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
      
      // Filter by service
      if (serviceFilter !== 'all' && alert.service !== serviceFilter) return false;
      
      // Filter by status
      if (statusFilter === 'active' && alert.resolved) return false;
      if (statusFilter === 'resolved' && !alert.resolved) return false;
      if (statusFilter === 'unacknowledged' && alert.acknowledged) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return alert.title.toLowerCase().includes(query) || 
               alert.message.toLowerCase().includes(query) ||
               alert.service.toLowerCase().includes(query);
      }
      
      return true;
    });
  }, [alerts, severityFilter, serviceFilter, statusFilter, searchQuery]);

  const alertStats = useMemo(() => {
    return {
      critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
      warning: alerts.filter(a => a.severity === 'warning' && !a.resolved).length,
      info: alerts.filter(a => a.severity === 'info' && !a.resolved).length,
      unacknowledged: alerts.filter(a => !a.acknowledged && !a.resolved).length,
      total: alerts.filter(a => !a.resolved).length
    };
  }, [alerts]);

  const handleSelectAll = () => {
    if (selectedAlerts.size === filteredAlerts.length) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(filteredAlerts.map(a => a.id)));
    }
  };

  const handleSelectAlert = (alertId: string) => {
    const newSelected = new Set(selectedAlerts);
    if (newSelected.has(alertId)) {
      newSelected.delete(alertId);
    } else {
      newSelected.add(alertId);
    }
    setSelectedAlerts(newSelected);
  };

  const toggleExpanded = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const handleBulkAction = (action: 'acknowledge' | 'resolve' | 'delete') => {
    if (onBulkAction && selectedAlerts.size > 0) {
      onBulkAction(action, Array.from(selectedAlerts));
      setSelectedAlerts(new Set());
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Системные алерты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Системные алерты</CardTitle>
            <CardDescription>
              Всего активных: {alertStats.total} | 
              Критических: {alertStats.critical} | 
              Неподтвержденных: {alertStats.unacknowledged}
            </CardDescription>
          </div>
          {selectedAlerts.size > 0 && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleBulkAction('acknowledge')}
                data-testid="button-bulk-acknowledge"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Подтвердить ({selectedAlerts.size})
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleBulkAction('resolve')}
                data-testid="button-bulk-resolve"
              >
                <Archive className="h-4 w-4 mr-1" />
                Решить ({selectedAlerts.size})
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleBulkAction('delete')}
                data-testid="button-bulk-delete"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Удалить ({selectedAlerts.size})
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-severity-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Критичность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все уровни</SelectItem>
              <SelectItem value="critical">Критический</SelectItem>
              <SelectItem value="warning">Предупреждение</SelectItem>
              <SelectItem value="info">Информация</SelectItem>
            </SelectContent>
          </Select>

          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-service-filter">
              <SelectValue placeholder="Сервис" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все сервисы</SelectItem>
              {uniqueServices.map(service => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="resolved">Решенные</SelectItem>
              <SelectItem value="unacknowledged">Неподтвержденные</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск алертов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-alerts"
            />
          </div>
        </div>

        {/* Alert List */}
        <ScrollArea className="h-[500px]">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2" />
              <p>Нет алертов для отображения</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Checkbox 
                  checked={selectedAlerts.size === filteredAlerts.length}
                  onCheckedChange={handleSelectAll}
                  data-testid="checkbox-select-all"
                />
                <span className="text-sm text-muted-foreground">
                  Выбрать все ({filteredAlerts.length})
                </span>
              </div>

              {filteredAlerts.map((alert) => (
                <Collapsible
                  key={alert.id}
                  open={expandedAlerts.has(alert.id)}
                  onOpenChange={() => toggleExpanded(alert.id)}
                >
                  <div 
                    className={`border-2 rounded-lg p-3 transition-all ${getAlertColor(alert.severity, alert.resolved)}`}
                    data-testid={`card-alert-${alert.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedAlerts.has(alert.id)}
                        onCheckedChange={() => handleSelectAlert(alert.id)}
                        className="mt-1"
                        data-testid={`checkbox-alert-${alert.id}`}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(alert.severity)}
                            <div>
                              <h4 className="font-medium text-sm">{alert.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                {getSeverityBadge(alert.severity)}
                                <Badge variant="outline" className="text-xs">
                                  {alert.service}
                                </Badge>
                                {alert.resolved && (
                                  <Badge variant="default" className="text-xs bg-green-600">
                                    Решено
                                  </Badge>
                                )}
                                {alert.acknowledged && !alert.resolved && (
                                  <Badge variant="secondary" className="text-xs">
                                    Подтверждено
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(alert.timestamp), { 
                                addSuffix: true,
                                locale: ru 
                              })}
                            </span>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                {expandedAlerts.has(alert.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.message}
                        </p>

                        <CollapsibleContent>
                          <div className="space-y-3 pt-3 border-t">
                            {/* Affected Components */}
                            {alert.affectedComponents && alert.affectedComponents.length > 0 && (
                              <div>
                                <p className="text-xs font-medium mb-1">Затронутые компоненты:</p>
                                <div className="flex flex-wrap gap-1">
                                  {alert.affectedComponents.map((component, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {component}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Suggested Actions */}
                            {alert.suggestedActions && alert.suggestedActions.length > 0 && (
                              <div>
                                <p className="text-xs font-medium mb-1">Рекомендуемые действия:</p>
                                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                                  {alert.suggestedActions.map((action, i) => (
                                    <li key={i}>{action}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Details */}
                            {alert.details && Object.keys(alert.details).length > 0 && (
                              <div>
                                <p className="text-xs font-medium mb-1">Детали:</p>
                                <div className="bg-muted/50 rounded p-2">
                                  <pre className="text-xs overflow-x-auto">
                                    {JSON.stringify(alert.details, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            )}

                            {/* Resolution Info */}
                            {alert.resolved && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                Решено {alert.resolvedBy} {' '}
                                {alert.resolvedAt && formatDistanceToNow(new Date(alert.resolvedAt), {
                                  addSuffix: true,
                                  locale: ru
                                })}
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              {!alert.acknowledged && !alert.resolved && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => onAcknowledge?.(alert.id)}
                                  data-testid={`button-acknowledge-${alert.id}`}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Подтвердить
                                </Button>
                              )}
                              {!alert.resolved && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => onResolve?.(alert.id)}
                                  data-testid={`button-resolve-${alert.id}`}
                                >
                                  <Archive className="h-4 w-4 mr-1" />
                                  Решить
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => onDelete?.(alert.id)}
                                data-testid={`button-delete-${alert.id}`}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Удалить
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </div>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
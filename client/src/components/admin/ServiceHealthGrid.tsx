import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database,
  Mail,
  CreditCard,
  HardDrive,
  Globe,
  Bot,
  Shield,
  Server,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  RefreshCw,
  FileText
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

export interface ServiceHealth {
  name: string;
  type: 'database' | 'email' | 'openai' | 'storage' | 'webserver' | 'payment' | 'auth' | 'monitoring';
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: Date;
  responseTime: number;
  uptime: number;
  error?: string;
  trend?: 'up' | 'down' | 'stable';
  details?: {
    checks?: Array<{
      name: string;
      status: 'success' | 'warning' | 'error';
      message?: string;
      duration?: number;
    }>;
    metrics?: Record<string, any>;
    logs?: Array<{
      timestamp: Date;
      level: 'info' | 'warning' | 'error';
      message: string;
    }>;
  };
}

interface ServiceHealthGridProps {
  services: ServiceHealth[];
  isLoading?: boolean;
  onRefreshService?: (serviceName: string) => void;
  onViewLogs?: (service: ServiceHealth) => void;
}

export function ServiceHealthGrid({ 
  services, 
  isLoading, 
  onRefreshService,
  onViewLogs 
}: ServiceHealthGridProps) {
  const [selectedService, setSelectedService] = useState<ServiceHealth | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getServiceIcon = (type: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (type) {
      case 'database': return <Database {...iconProps} />;
      case 'email': return <Mail {...iconProps} />;
      case 'payment': return <CreditCard {...iconProps} />;
      case 'storage': return <HardDrive {...iconProps} />;
      case 'webserver': return <Globe {...iconProps} />;
      case 'openai': return <Bot {...iconProps} />;
      case 'auth': return <Shield {...iconProps} />;
      case 'monitoring': return <Activity {...iconProps} />;
      default: return <Server {...iconProps} />;
    }
  };

  const getStatusIcon = (status: string) => {
    const iconProps = { className: "h-4 w-4" };
    switch (status) {
      case 'healthy': return <CheckCircle {...iconProps} className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'degraded': return <AlertCircle {...iconProps} className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'down': return <XCircle {...iconProps} className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default: return <Clock {...iconProps} className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-900/20';
      case 'degraded': return 'border-yellow-600 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'down': return 'border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/20';
      default: return 'border-border';
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'healthy' ? 'default' : 
                    status === 'degraded' ? 'secondary' : 'destructive';
    const label = status === 'healthy' ? 'Работает' : 
                  status === 'degraded' ? 'Проблемы' : 'Недоступен';
    return <Badge variant={variant} className="text-xs">{label}</Badge>;
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'text-green-600 dark:text-green-400';
    if (uptime >= 99) return 'text-yellow-600 dark:text-yellow-400';
    if (uptime >= 95) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 100) return 'text-green-600 dark:text-green-400';
    if (responseTime < 500) return 'text-yellow-600 dark:text-yellow-400';
    if (responseTime < 1000) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getServiceLabel = (name: string) => {
    const labels: Record<string, string> = {
      'database': 'База данных',
      'email': 'Email сервис',
      'payment': 'Платежи',
      'storage': 'Хранилище',
      'webserver': 'Веб-сервер',
      'openai': 'AI модель',
      'auth': 'Авторизация',
      'monitoring': 'Мониторинг'
    };
    return labels[name] || name;
  };

  const handleViewDetails = (service: ServiceHealth) => {
    setSelectedService(service);
    setShowDetails(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <Card 
            key={service.name} 
            className={`border-2 transition-all hover:shadow-md cursor-pointer ${getStatusColor(service.status)}`}
            onClick={() => handleViewDetails(service)}
            data-testid={`card-service-${service.name}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getServiceIcon(service.type)}
                  <CardTitle className="text-sm font-medium">
                    {getServiceLabel(service.type)}
                  </CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      data-testid={`button-service-menu-${service.name}`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onRefreshService?.(service.name);
                    }}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Обновить статус
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onViewLogs?.(service);
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      Просмотр логов
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(service);
                    }}>
                      <Activity className="mr-2 h-4 w-4" />
                      Подробная информация
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    {getStatusBadge(service.status)}
                  </div>
                  {service.trend && (
                    <Badge variant="outline" className="text-xs">
                      {service.trend === 'up' ? '↑' : service.trend === 'down' ? '↓' : '→'}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Время отклика</p>
                    <p className={`font-medium ${getResponseTimeColor(service.responseTime)}`}>
                      {service.responseTime}мс
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Аптайм</p>
                    <p className={`font-medium ${getUptimeColor(service.uptime)}`}>
                      {service.uptime.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Последняя проверка:{' '}
                    {formatDistanceToNow(new Date(service.lastCheck), { 
                      addSuffix: true,
                      locale: ru 
                    })}
                  </p>
                  {service.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 line-clamp-2">
                      {service.error}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedService && getServiceIcon(selectedService.type)}
              {selectedService && getServiceLabel(selectedService.type)}
            </DialogTitle>
            <DialogDescription>
              Подробная информация о состоянии сервиса
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {/* Status Overview */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Текущий статус</h3>
                  <div className="flex items-center gap-4">
                    {getStatusIcon(selectedService.status)}
                    {getStatusBadge(selectedService.status)}
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(selectedService.lastCheck), { 
                        addSuffix: true,
                        locale: ru 
                      })}
                    </span>
                  </div>
                  {selectedService.error && (
                    <Alert className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{selectedService.error}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Metrics */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Метрики</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Время отклика</p>
                      <p className={`text-2xl font-bold ${getResponseTimeColor(selectedService.responseTime)}`}>
                        {selectedService.responseTime}мс
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Доступность</p>
                      <p className={`text-2xl font-bold ${getUptimeColor(selectedService.uptime)}`}>
                        {selectedService.uptime.toFixed(3)}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Тренд</p>
                      <p className="text-2xl font-bold">
                        {selectedService.trend === 'up' ? '↑' : selectedService.trend === 'down' ? '↓' : '→'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Health Checks */}
                {selectedService.details?.checks && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Проверки состояния</h3>
                    <div className="space-y-2">
                      {selectedService.details.checks.map((check, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                          <div className="flex items-center gap-2">
                            {check.status === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : check.status === 'warning' ? (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm">{check.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {check.message && (
                              <span className="text-xs text-muted-foreground">{check.message}</span>
                            )}
                            {check.duration && (
                              <Badge variant="outline" className="text-xs">
                                {check.duration}мс
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Logs */}
                {selectedService.details?.logs && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Последние логи</h3>
                    <div className="space-y-1 font-mono text-xs">
                      {selectedService.details.logs.slice(-10).map((log, i) => (
                        <div 
                          key={i} 
                          className={`p-2 rounded ${
                            log.level === 'error' ? 'bg-red-50 dark:bg-red-900/20' :
                            log.level === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                            'bg-muted/50'
                          }`}
                        >
                          <span className="text-muted-foreground">
                            {format(new Date(log.timestamp), 'HH:mm:ss')}
                          </span>
                          <span className={`ml-2 ${
                            log.level === 'error' ? 'text-red-600 dark:text-red-400' :
                            log.level === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                            ''
                          }`}>
                            [{log.level.toUpperCase()}]
                          </span>
                          <span className="ml-2">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

import { format } from 'date-fns';
import type { Alert as AlertType } from '@/components/ui/alert';
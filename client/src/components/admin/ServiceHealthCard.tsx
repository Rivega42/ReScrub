import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Database, 
  Mail, 
  Brain, 
  HardDrive, 
  Globe,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ServiceHealthCardProps {
  service: {
    name: string;
    type: 'database' | 'email' | 'openai' | 'storage' | 'webserver';
    status: 'healthy' | 'degraded' | 'down';
    lastCheck: Date;
    responseTime: number; // в миллисекундах
    uptime: number; // процент
    error?: string;
    trend?: 'up' | 'down' | 'stable';
  };
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const serviceIcons = {
  database: Database,
  email: Mail,
  openai: Brain,
  storage: HardDrive,
  webserver: Globe,
};

const statusConfig = {
  healthy: {
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    icon: CheckCircle,
    label: 'Работает'
  },
  degraded: {
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    icon: AlertCircle,
    label: 'Проблемы'
  },
  down: {
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    icon: XCircle,
    label: 'Недоступен'
  }
};

export function ServiceHealthCard({ service, onRefresh, isRefreshing }: ServiceHealthCardProps) {
  const ServiceIcon = serviceIcons[service.type];
  const StatusIcon = statusConfig[service.status].icon;
  const config = statusConfig[service.status];
  
  const formatResponseTime = (ms: number) => {
    if (ms < 1000) {
      return `${ms}мс`;
    }
    return `${(ms / 1000).toFixed(2)}с`;
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'text-green-600 dark:text-green-400';
    if (uptime >= 99) return 'text-yellow-600 dark:text-yellow-400';
    if (uptime >= 95) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (!service) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24 mt-1" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border ${config.borderColor} ${config.bgColor} transition-all duration-300`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ServiceIcon className={`h-5 w-5 ${config.color}`} />
            <CardTitle className="text-base">{service.name}</CardTitle>
          </div>
          <Badge 
            variant={service.status === 'healthy' ? 'default' : service.status === 'degraded' ? 'secondary' : 'destructive'}
            className="flex items-center gap-1"
          >
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
        <CardDescription className="text-xs mt-1">
          Последняя проверка: {formatDistanceToNow(new Date(service.lastCheck), { addSuffix: true, locale: ru })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Время отклика</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-lg font-semibold">{formatResponseTime(service.responseTime)}</span>
              {service.trend && (
                <>
                  {service.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {service.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                </>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Доступность</div>
            <div className={`text-lg font-semibold mt-1 ${getUptimeColor(service.uptime)}`}>
              {service.uptime.toFixed(2)}%
            </div>
          </div>
        </div>
        
        {service.error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2">
            <div className="text-xs font-medium text-red-700 dark:text-red-400">Ошибка:</div>
            <div className="text-xs text-red-600 dark:text-red-500 mt-1">{service.error}</div>
          </div>
        )}
        
        {onRefresh && (
          <Button 
            onClick={onRefresh}
            disabled={isRefreshing}
            size="sm"
            variant="outline"
            className="w-full"
            data-testid={`button-refresh-${service.type}`}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Проверить сейчас
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  Clock, 
  User, 
  Globe, 
  Terminal,
  Database,
  FileText,
  Key,
  ChevronRight
} from 'lucide-react';

interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId?: string;
  targetName?: string;
  changes?: any;
  metadata?: any;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  result: 'success' | 'failure' | 'warning';
  errorMessage?: string;
  createdAt: Date;
  relatedLogs?: AuditLog[];
}

interface AuditLogViewerProps {
  log: AuditLog;
}

export default function AuditLogViewer({ log }: AuditLogViewerProps) {
  const isSensitiveOperation = log.targetType === 'secrets' || 
                               log.targetType === 'user_data' ||
                               log.action === 'delete';

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const maskSensitiveValue = (value: string, field: string): string => {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'hash'];
    if (sensitiveFields.some(f => field.toLowerCase().includes(f))) {
      return '********';
    }
    if (field === 'email') {
      const [user, domain] = value.split('@');
      return `${user.substring(0, 2)}***@${domain}`;
    }
    if (field === 'phone') {
      return value.replace(/\d{4}$/, '****');
    }
    return value;
  };

  const renderChanges = () => {
    if (!log.changes) return null;

    const { before, after } = log.changes;
    if (!before && !after) return null;

    const allKeys = new Set([
      ...Object.keys(before || {}),
      ...Object.keys(after || {})
    ]);

    return (
      <div className="space-y-3">
        {Array.from(allKeys).map(key => {
          const beforeVal = before?.[key];
          const afterVal = after?.[key];
          const changed = beforeVal !== afterVal;

          if (!changed) return null;

          return (
            <div key={key} className="bg-muted/50 rounded-lg p-3">
              <p className="font-semibold text-sm mb-2">{key}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">До изменения:</p>
                  <pre className="text-xs bg-background p-2 rounded overflow-auto">
                    {isSensitiveOperation 
                      ? maskSensitiveValue(formatValue(beforeVal), key)
                      : formatValue(beforeVal)}
                  </pre>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">После изменения:</p>
                  <pre className="text-xs bg-background p-2 rounded overflow-auto">
                    {isSensitiveOperation
                      ? maskSensitiveValue(formatValue(afterVal), key)
                      : formatValue(afterVal)}
                  </pre>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const parseUserAgent = (ua: string) => {
    const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/);
    const osMatch = ua.match(/(Windows|Mac|Linux|Android|iOS)[^;)]*/)
    
    return {
      browser: browserMatch ? browserMatch[0] : 'Неизвестный браузер',
      os: osMatch ? osMatch[0] : 'Неизвестная ОС',
    };
  };

  const { browser, os } = parseUserAgent(log.userAgent);

  return (
    <div className="space-y-6">
      {/* Alert for sensitive operations */}
      {isSensitiveOperation && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Критическая операция</AlertTitle>
          <AlertDescription>
            Это действие затрагивает конфиденциальные данные или критические настройки системы.
            Все значения частично скрыты для безопасности.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" data-testid="tab-general">Основное</TabsTrigger>
          <TabsTrigger value="changes" data-testid="tab-changes">Изменения</TabsTrigger>
          <TabsTrigger value="technical" data-testid="tab-technical">Технические</TabsTrigger>
          <TabsTrigger value="related" data-testid="tab-related">Связанные</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Общая информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID события</p>
                  <p className="font-mono text-sm" data-testid="text-event-id">{log.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Время</p>
                  <p className="text-sm" data-testid="text-event-time">
                    {format(new Date(log.createdAt), 'dd MMMM yyyy, HH:mm:ss', { locale: ru })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Действие</p>
                  <Badge variant="outline" data-testid="badge-action">
                    {log.action}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Результат</p>
                  <Badge 
                    variant={log.result === 'success' ? 'default' : 'destructive'}
                    data-testid="badge-result"
                  >
                    {log.result === 'success' ? 'Успешно' : 
                     log.result === 'failure' ? 'Ошибка' : 'Предупреждение'}
                  </Badge>
                </div>
              </div>

              {log.errorMessage && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Ошибка</AlertTitle>
                  <AlertDescription>{log.errorMessage}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Администратор
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Имя</p>
                <p className="text-sm font-medium" data-testid="text-admin-name">{log.adminName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-mono" data-testid="text-admin-email">
                  {isSensitiveOperation 
                    ? maskSensitiveValue(log.adminEmail, 'email')
                    : log.adminEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID администратора</p>
                <p className="text-sm font-mono" data-testid="text-admin-id">{log.adminId}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Объект действия
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Тип объекта</p>
                <Badge variant="outline" data-testid="badge-target-type">
                  {log.targetType}
                </Badge>
              </div>
              {log.targetId && (
                <div>
                  <p className="text-sm text-muted-foreground">ID объекта</p>
                  <p className="text-sm font-mono" data-testid="text-target-id">{log.targetId}</p>
                </div>
              )}
              {log.targetName && (
                <div>
                  <p className="text-sm text-muted-foreground">Название объекта</p>
                  <p className="text-sm" data-testid="text-target-name">
                    {log.targetType === 'secrets'
                      ? '********'
                      : log.targetName}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                История изменений
              </CardTitle>
              <CardDescription>
                Сравнение данных до и после операции
              </CardDescription>
            </CardHeader>
            <CardContent>
              {log.changes ? (
                <ScrollArea className="h-[400px]">
                  {renderChanges()}
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Изменения данных отсутствуют
                </p>
              )}
            </CardContent>
          </Card>

          {log.metadata && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Метаданные
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <pre className="text-xs bg-muted p-4 rounded">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Сетевая информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">IP-адрес</p>
                <p className="text-sm font-mono" data-testid="text-ip-address">
                  {isSensitiveOperation
                    ? log.ipAddress.replace(/\.\d+\.\d+$/, '.***.**')
                    : log.ipAddress}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID сессии</p>
                <p className="text-sm font-mono text-xs" data-testid="text-session-id">
                  {log.sessionId}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Клиент
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Браузер</p>
                <p className="text-sm" data-testid="text-browser">{browser}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Операционная система</p>
                <p className="text-sm" data-testid="text-os">{os}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User Agent (полный)</p>
                <p className="text-xs font-mono break-all" data-testid="text-user-agent">
                  {log.userAgent}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Связанные события
              </CardTitle>
              <CardDescription>
                События, связанные с этим действием или объектом
              </CardDescription>
            </CardHeader>
            <CardContent>
              {log.relatedLogs && log.relatedLogs.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {log.relatedLogs.map((related) => (
                      <div 
                        key={related.id}
                        className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                        data-testid={`card-related-log-${related.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{related.action}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(related.createdAt), 'dd.MM HH:mm', { locale: ru })}
                          </span>
                        </div>
                        <p className="text-sm">
                          {related.adminName} - {related.targetType}
                          {related.targetName && `: ${related.targetName}`}
                        </p>
                        {related.result !== 'success' && (
                          <Badge variant="destructive" className="mt-2">
                            {related.result}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Связанные события не найдены
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Download, Search, Shield, AlertTriangle, Info, CheckCircle, XCircle, Filter, Eye, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuditLogViewer from '../components/admin/AuditLogViewer';
import { cn } from '@/lib/utils';

interface AdminAction {
  id: string;
  adminId: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadata: any;
  ipAddress: string;
  userAgent: string;
  sessionId: string | null;
  createdAt: Date;
}

interface AuditLogsResponse {
  logs: AdminAction[];
  total: number;
  page: number;
  totalPages: number;
}

// Severity levels for different actions
const getActionSeverity = (action: string): { color: string; icon: any; label: string } => {
  const severityMap: { [key: string]: { color: string; icon: any; label: string } } = {
    'delete_user': { color: 'destructive', icon: XCircle, label: 'Критично' },
    'grant_permission': { color: 'warning', icon: AlertTriangle, label: 'Важно' },
    'revoke_permission': { color: 'warning', icon: AlertTriangle, label: 'Важно' },
    'update_admin_role': { color: 'warning', icon: AlertTriangle, label: 'Важно' },
    'export_data': { color: 'secondary', icon: Info, label: 'Информация' },
    'view_audit_logs': { color: 'outline', icon: Eye, label: 'Просмотр' },
    'unauthorized_access_attempt': { color: 'destructive', icon: XCircle, label: 'Критично' },
    'failed_login': { color: 'destructive', icon: XCircle, label: 'Критично' },
    'create': { color: 'default', icon: CheckCircle, label: 'Создание' },
    'update': { color: 'secondary', icon: Info, label: 'Обновление' },
    'delete': { color: 'warning', icon: AlertTriangle, label: 'Удаление' },
  };
  
  // Check for patterns in action name
  for (const [pattern, config] of Object.entries(severityMap)) {
    if (action.includes(pattern)) {
      return config;
    }
  }
  
  return { color: 'outline', icon: Info, label: 'Действие' };
};

// Action name translations
const translateAction = (action: string): string => {
  const translations: { [key: string]: string } = {
    'create': 'Создание',
    'update': 'Обновление',
    'delete': 'Удаление',
    'view': 'Просмотр',
    'export': 'Экспорт',
    'import': 'Импорт',
    'login': 'Вход',
    'logout': 'Выход',
    'failed_login': 'Неудачный вход',
    'grant_permission': 'Выдача разрешения',
    'revoke_permission': 'Отзыв разрешения',
    'update_admin_role': 'Изменение роли админа',
    'view_audit_logs': 'Просмотр журнала аудита',
    'export_audit_logs': 'Экспорт журнала аудита',
    'view_security_dashboard': 'Просмотр панели безопасности',
    'unauthorized_access_attempt': 'Попытка несанкционированного доступа',
    'delete_user': 'Удаление пользователя',
    'ban_user': 'Блокировка пользователя',
    'unban_user': 'Разблокировка пользователя',
    'reset_user_password': 'Сброс пароля пользователя',
    'send_notification': 'Отправка уведомления',
    'export_users': 'Экспорт пользователей',
    'create_data_broker': 'Создание брокера данных',
    'update_data_broker': 'Обновление брокера данных',
    'delete_data_broker': 'Удаление брокера данных',
  };
  
  return translations[action] || action.replace(/_/g, ' ');
};

export default function AdminSecurityLogs() {
  const { toast } = useToast();
  const [selectedLog, setSelectedLog] = useState<AdminAction | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    adminId: '',
    action: '',
    targetType: '',
    search: '',
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    page: 1,
    limit: 20
  });
  
  // Query for audit logs
  const { data, isLoading, error, refetch } = useQuery<AuditLogsResponse>({
    queryKey: ['/api/admin/audit-logs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.adminId) params.append('adminId', filters.adminId);
      if (filters.action) params.append('action', filters.action);
      if (filters.targetType) params.append('targetType', filters.targetType);
      if (filters.search) params.append('search', filters.search);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
      if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString());
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());
      
      const response = await apiRequest(`/api/admin/audit-logs?${params.toString()}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }
      
      const result = await response.json();
      return result.data;
    }
  });
  
  // Export mutation
  const exportMutation = useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('from', filters.dateFrom.toISOString());
      if (filters.dateTo) params.append('to', filters.dateTo.toISOString());
      
      const response = await apiRequest(`/api/admin/audit-logs/export?${params.toString()}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Failed to export audit logs');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: 'Успешно',
        description: 'Журнал аудита экспортирован',
      });
    },
    onError: () => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось экспортировать журнал',
        variant: 'destructive',
      });
    },
  });
  
  // Handle filter changes
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page on filter change
    }));
  }, []);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };
  
  // View log details
  const handleViewLog = (log: AdminAction) => {
    setSelectedLog(log);
    setShowViewer(true);
  };
  
  // Render pagination
  const renderPagination = () => {
    if (!data || data.totalPages <= 1) return null;
    
    const pages = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);
    
    let start = Math.max(1, data.page - halfVisible);
    let end = Math.min(data.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, data.page - 1))}
              className={cn(data.page === 1 && 'pointer-events-none opacity-50')}
            />
          </PaginationItem>
          
          {start > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
              </PaginationItem>
              {start > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}
          
          {pages.map(page => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={page === data.page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {end < data.totalPages && (
            <>
              {end < data.totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(data.totalPages)}>
                  {data.totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(data.totalPages, data.page + 1))}
              className={cn(data.page === data.totalPages && 'pointer-events-none opacity-50')}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Журнал безопасности
          </h1>
          <p className="text-muted-foreground mt-2">
            Мониторинг и аудит действий администраторов
          </p>
        </div>
        
        {/* Filters Card */}
        <Card className="mb-6" data-testid="card-audit-filters">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Фильтры
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="adminId">Администратор</Label>
                <Input
                  id="adminId"
                  placeholder="ID админа"
                  value={filters.adminId}
                  onChange={(e) => handleFilterChange('adminId', e.target.value)}
                  data-testid="input-admin-id"
                />
              </div>
              
              <div>
                <Label htmlFor="action">Действие</Label>
                <Input
                  id="action"
                  placeholder="Тип действия"
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  data-testid="input-action"
                />
              </div>
              
              <div>
                <Label htmlFor="targetType">Тип цели</Label>
                <Input
                  id="targetType"
                  placeholder="user, permission..."
                  value={filters.targetType}
                  onChange={(e) => handleFilterChange('targetType', e.target.value)}
                  data-testid="input-target-type"
                />
              </div>
              
              <div>
                <Label htmlFor="dateFrom">Дата с</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.dateFrom && 'text-muted-foreground'
                      )}
                      data-testid="button-date-from"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => handleFilterChange('dateFrom', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="dateTo">Дата по</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.dateTo && 'text-muted-foreground'
                      )}
                      data-testid="button-date-to"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => handleFilterChange('dateTo', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="search">Поиск</Label>
                <div className="relative">
                  <Input
                    id="search"
                    placeholder="Поиск..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pr-8"
                    data-testid="input-search"
                  />
                  <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => refetch()}
                data-testid="button-apply-filters"
              >
                Применить фильтры
              </Button>
              <Button
                variant="outline"
                onClick={() => setFilters({
                  adminId: '',
                  action: '',
                  targetType: '',
                  search: '',
                  dateFrom: undefined,
                  dateTo: undefined,
                  page: 1,
                  limit: 20
                })}
                data-testid="button-reset-filters"
              >
                Сбросить
              </Button>
              <Button
                variant="secondary"
                onClick={() => exportMutation.mutate()}
                disabled={exportMutation.isPending}
                data-testid="button-export"
              >
                <Download className="h-4 w-4 mr-2" />
                Экспорт CSV
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Logs Table */}
        <Card data-testid="card-audit-logs">
          <CardHeader>
            <CardTitle>Журнал действий</CardTitle>
            <CardDescription>
              {data && `Найдено ${data.total} записей (страница ${data.page} из ${data.totalPages})`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Ошибка загрузки журнала: {error.message}
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : data?.logs && data.logs.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Время</TableHead>
                        <TableHead>Администратор</TableHead>
                        <TableHead>Действие</TableHead>
                        <TableHead>Цель</TableHead>
                        <TableHead>IP адрес</TableHead>
                        <TableHead>Уровень</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.logs.map((log) => {
                        const severity = getActionSeverity(log.action);
                        const Icon = severity.icon;
                        
                        return (
                          <TableRow key={log.id} data-testid={`row-audit-log-${log.id}`}>
                            <TableCell className="font-mono text-sm">
                              {format(new Date(log.createdAt), 'dd.MM.yyyy HH:mm:ss', { locale: ru })}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {log.adminId.substring(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {translateAction(log.action)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {log.targetType && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">{log.targetType}</span>
                                  {log.targetId && (
                                    <span className="block font-mono text-xs">
                                      {log.targetId.substring(0, 8)}...
                                    </span>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {log.ipAddress}
                            </TableCell>
                            <TableCell>
                              <Badge variant={severity.color as any} className="gap-1">
                                <Icon className="h-3 w-3" />
                                {severity.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewLog(log)}
                                data-testid={`button-view-log-${log.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4">
                  {renderPagination()}
                </div>
              </>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Нет записей для отображения
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
      
      {/* Audit Log Viewer Modal */}
      {showViewer && selectedLog && (
        <AuditLogViewer
          log={selectedLog}
          onClose={() => {
            setShowViewer(false);
            setSelectedLog(null);
          }}
        />
      )}
    </div>
  );
}
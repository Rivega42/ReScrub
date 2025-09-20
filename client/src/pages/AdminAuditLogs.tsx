import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  Download, 
  Search, 
  Filter, 
  Eye, 
  RefreshCw,
  Shield,
  AlertTriangle,
  UserCheck,
  Database,
  Key,
  Clock,
  FileText,
  Activity
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import AuditLogViewer from '@/components/admin/AuditLogViewer';
import AuditFilters from '@/components/admin/AuditFilters';

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
}

interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
}

interface FilterState {
  search?: string;
  adminId?: string;
  actionType?: string;
  targetType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  ipAddress?: string;
}

export default function AdminAuditLogs() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { toast } = useToast();

  // Query for audit logs
  const { data, isLoading, refetch } = useQuery<AuditLogsResponse>({
    queryKey: ['/api/admin/audit-logs', page, pageSize, filters],
    queryFn: () => apiRequest('/api/admin/audit-logs', {
      method: 'GET',
      params: {
        page,
        pageSize,
        ...filters
      }
    }),
    refetchInterval: autoRefresh ? 5000 : false
  });

  // Mutation for exporting logs
  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/admin/audit-logs/export', {
        method: 'GET',
        params: filters
      });
      
      // Create blob and download
      const blob = new Blob([response.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: 'Экспорт завершен',
        description: 'Журнал аудита успешно экспортирован в CSV',
      });
    },
    onError: () => {
      toast({
        title: 'Ошибка экспорта',
        description: 'Не удалось экспортировать журнал аудита',
        variant: 'destructive'
      });
    }
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (autoRefresh) {
      const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/audit-logs`);
      
      ws.onmessage = (event) => {
        const newLog = JSON.parse(event.data);
        queryClient.invalidateQueries({ queryKey: ['/api/admin/audit-logs'] });
        
        // Show notification for critical actions
        if (newLog.action === 'delete' || newLog.targetType === 'secrets') {
          toast({
            title: 'Критическое действие',
            description: `${newLog.adminName} выполнил(а) действие: ${newLog.action} на ${newLog.targetType}`,
            variant: 'destructive'
          });
        }
      };

      return () => ws.close();
    }
  }, [autoRefresh, toast]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <UserCheck className="h-4 w-4" />;
      case 'update': return <FileText className="h-4 w-4" />;
      case 'delete': return <AlertTriangle className="h-4 w-4" />;
      case 'view': return <Eye className="h-4 w-4" />;
      case 'export': return <Download className="h-4 w-4" />;
      case 'login': return <Key className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Успешно</Badge>;
      case 'failure':
        return <Badge variant="destructive">Ошибка</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-500">Предупреждение</Badge>;
      default:
        return <Badge variant="outline">{result}</Badge>;
    }
  };

  const maskSensitiveData = (value: string, type: string) => {
    if (type === 'email') {
      const [user, domain] = value.split('@');
      return `${user.substring(0, 2)}***@${domain}`;
    }
    if (type === 'ip') {
      const parts = value.split('.');
      return `${parts[0]}.${parts[1]}.***.***.`;
    }
    if (type === 'secret') {
      return '********';
    }
    return value;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, search: query }));
    setPage(1);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

  return (
    <>
      <SEO 
        title="Журнал аудита | Панель администратора"
        description="Управление журналом аудита и мониторинг действий администраторов"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Журнал аудита
            </h1>
            <p className="text-muted-foreground mt-2">
              Мониторинг всех административных действий и операций безопасности
            </p>
          </div>

          {/* Toolbar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Поиск по действиям, администраторам, целям..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                      data-testid="input-audit-search"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    data-testid="button-toggle-filters"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Фильтры
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={autoRefresh ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    data-testid="button-auto-refresh"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                    {autoRefresh ? 'Авто-обновление' : 'Обновлять'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    data-testid="button-manual-refresh"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Обновить
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportMutation.mutate()}
                    disabled={exportMutation.isPending}
                    data-testid="button-export-csv"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Экспорт CSV
                  </Button>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <>
                  <Separator className="my-4" />
                  <AuditFilters 
                    onFiltersChange={handleFiltersChange}
                    currentFilters={filters}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Audit Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>События аудита</CardTitle>
              <CardDescription>
                {data ? `Показано ${data.logs.length} из ${data.total} записей` : 'Загрузка...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Дата/Время</TableHead>
                      <TableHead>Администратор</TableHead>
                      <TableHead>Действие</TableHead>
                      <TableHead>Цель</TableHead>
                      <TableHead>IP-адрес</TableHead>
                      <TableHead className="w-[100px]">Результат</TableHead>
                      <TableHead className="w-[80px]">Детали</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Clock className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                          <p className="mt-2 text-muted-foreground">Загрузка журнала...</p>
                        </TableCell>
                      </TableRow>
                    ) : data?.logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Database className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="mt-2 text-muted-foreground">Записи не найдены</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.logs.map((log) => (
                        <TableRow 
                          key={log.id}
                          className={log.targetType === 'secrets' ? 'bg-red-50 dark:bg-red-950' : ''}
                          data-testid={`row-audit-log-${log.id}`}
                        >
                          <TableCell className="font-mono text-xs">
                            {format(new Date(log.createdAt), 'dd.MM.yyyy HH:mm:ss', { locale: ru })}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{log.adminName}</p>
                              <p className="text-xs text-muted-foreground">
                                {maskSensitiveData(log.adminEmail, 'email')}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getActionIcon(log.action)}
                              <span>{log.action}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <Badge variant="outline" className="mb-1">
                                {log.targetType}
                              </Badge>
                              {log.targetName && (
                                <p className="text-xs text-muted-foreground">
                                  {log.targetType === 'secrets' 
                                    ? maskSensitiveData(log.targetName, 'secret')
                                    : log.targetName}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {maskSensitiveData(log.ipAddress, 'ip')}
                          </TableCell>
                          <TableCell>
                            {getResultBadge(log.result)}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedLog(log)}
                                  data-testid={`button-view-log-${log.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                                <DialogHeader>
                                  <DialogTitle>Детали события аудита</DialogTitle>
                                  <DialogDescription>
                                    Подробная информация о событии #{log.id}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedLog && <AuditLogViewer log={selectedLog} />}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>

              {/* Pagination */}
              {data && data.total > pageSize && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    data-testid="button-prev-page"
                  >
                    Назад
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Страница {page} из {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    data-testid="button-next-page"
                  >
                    Вперед
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
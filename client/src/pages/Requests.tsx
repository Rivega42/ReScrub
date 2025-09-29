import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  FileText, 
  Plus, 
  Filter, 
  Eye, 
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Calendar,
  Globe,
  Search,
  MoreHorizontal,
  Download
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DeletionRequest {
  id: string;
  userId: string;
  dataBroker?: {
    name: string;
    website: string;
    category: string;
  };
  status: 'pending' | 'sent' | 'processing' | 'completed' | 'rejected' | 'failed';
  requestMethod: string;
  requestDetails: any;
  responseReceived: boolean;
  responseDetails?: any;
  followUpRequired: boolean;
  followUpDate?: string;
  createdAt: string;
  completedAt?: string;
}

const statusConfig = {
  pending: { 
    label: 'В ожидании', 
    color: 'secondary' as const, 
    icon: Clock,
    description: 'Запрос подготовлен, но еще не отправлен'
  },
  sent: { 
    label: 'Отправлен', 
    color: 'default' as const, 
    icon: Activity,
    description: 'Запрос отправлен, ожидаем ответа'
  },
  processing: { 
    label: 'Обрабатывается', 
    color: 'default' as const, 
    icon: Activity,
    description: 'Брокер обрабатывает запрос'
  },
  completed: { 
    label: 'Выполнен', 
    color: 'default' as const, 
    icon: CheckCircle,
    description: 'Данные успешно удалены'
  },
  rejected: { 
    label: 'Отклонен', 
    color: 'destructive' as const, 
    icon: AlertTriangle,
    description: 'Запрос отклонен брокером'
  },
  failed: { 
    label: 'Ошибка', 
    color: 'destructive' as const, 
    icon: AlertTriangle,
    description: 'Произошла ошибка при обработке'
  },
};

// Mobile Card Component for Request List
function RequestMobileCard({ 
  request, 
  onView, 
  onStatusUpdate, 
  isUpdating 
}: { 
  request: DeletionRequest; 
  onView: (request: DeletionRequest) => void; 
  onStatusUpdate: (id: string, status: string) => void;
  isUpdating: boolean;
}) {
  const statusInfo = statusConfig[request.status];
  const IconComponent = statusInfo.icon;
  
  return (
    <Card className="hover-elevate" data-testid={`request-card-${request.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-medium truncate" data-testid={`request-broker-${request.id}`}>
                {request.dataBroker?.name || 'Неизвестный провайдер'}
              </CardTitle>
              <CardDescription className="text-sm truncate">
                {request.dataBroker?.website || 'Нет данных'}
              </CardDescription>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex-shrink-0 touch-target"
                data-testid={`button-actions-${request.id}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(request)}>
                <Eye className="h-4 w-4 mr-2" />
                Просмотр
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(request.id, 'processing')}
                disabled={isUpdating}
              >
                <Activity className="h-4 w-4 mr-2" />
                В обработке
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(request.id, 'completed')}
                disabled={isUpdating}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Выполнено
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className="h-4 w-4" />
            <Badge 
              variant={statusInfo.color}
              data-testid={`request-status-${request.id}`}
            >
              {statusInfo.label}
            </Badge>
            {request.followUpRequired && (
              <Badge variant="outline" className="text-xs">
                Требует действий
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(request.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>
          {request.completedAt && (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>{new Date(request.completedAt).toLocaleDateString('ru-RU')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Requests() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<DeletionRequest | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch deletion requests
  const { data: requests = [], isLoading, error, refetch } = useQuery<DeletionRequest[]>({
    queryKey: ['/api/deletion-requests'],
    enabled: true,
  });

  // Filter requests based on status and search
  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesSearch = !searchQuery || 
      request.dataBroker?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.dataBroker?.website?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Update request status mutation
  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await apiRequest('PUT', `/api/deletion-requests/${id}`, updates);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка обновления запроса');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deletion-requests'] });
      toast({
        title: "Запрос обновлен",
        description: "Статус запроса успешно изменен",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (requestId: string, newStatus: string) => {
    updateRequestMutation.mutate({
      id: requestId,
      updates: { status: newStatus }
    });
  };

  // Statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => ['pending', 'sent', 'processing'].includes(r.status)).length,
    completed: requests.filter(r => r.status === 'completed').length,
    failed: requests.filter(r => ['rejected', 'failed'].includes(r.status)).length,
    needsFollowUp: requests.filter(r => r.followUpRequired).length,
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Загружаем запросы...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Ошибка загрузки
            </CardTitle>
            <CardDescription>
              Не удалось загрузить список запросов. Попробуйте обновить страницу.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => refetch()} 
              variant="outline"
              data-testid="button-requests-reload"
            >
              Обновить
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Запросы на удаление
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Управление запросами на удаление персональных данных
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isMobile && (
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  data-testid="button-filters-mobile"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтры
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                  <SheetDescription>
                    Найдите нужные запросы
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="mobile-search">Поиск</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mobile-search"
                        placeholder="Поиск по названию или сайту брокера..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        data-testid="input-search-requests-mobile"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="mobile-status-filter">Статус</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger data-testid="select-status-filter-mobile">
                        <SelectValue placeholder="Все статусы" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все статусы</SelectItem>
                        <SelectItem value="pending">В ожидании</SelectItem>
                        <SelectItem value="sent">Отправлен</SelectItem>
                        <SelectItem value="processing">Обрабатывается</SelectItem>
                        <SelectItem value="completed">Выполнен</SelectItem>
                        <SelectItem value="rejected">Отклонен</SelectItem>
                        <SelectItem value="failed">Ошибка</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          <Button 
            asChild
            size={isMobile ? "sm" : "default"}
            className="flex-1 sm:flex-none"
            data-testid="button-create-request"
          >
            <Link href="/app/create-request">
              <Plus className="h-4 w-4 mr-2" />
              {isMobile ? "Создать" : "Создать запрос"}
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-3 grid-cols-2 md:gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card data-testid="card-stat-total-requests">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-requests">
              {stats.total}
            </div>
            <p className="text-xs text-muted-foreground">запросов создано</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-pending-requests">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В процессе</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600" data-testid="text-pending-requests">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">активных запросов</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-completed-requests">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выполнено</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-completed-requests">
              {stats.completed}
            </div>
            <p className="text-xs text-muted-foreground">успешно завершено</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-failed-requests">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Проблемы</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600" data-testid="text-failed-requests">
              {stats.failed}
            </div>
            <p className="text-xs text-muted-foreground">требуют внимания</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-followup-requests">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидают</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600" data-testid="text-followup-requests">
              {stats.needsFollowUp}
            </div>
            <p className="text-xs text-muted-foreground">требуют действий</p>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Filters - Hidden on Mobile */}
      {!isMobile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Фильтры
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Поиск</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Поиск по названию или сайту брокера..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-requests"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <Label htmlFor="status-filter">Статус</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger data-testid="select-status-filter">
                    <SelectValue placeholder="Все статусы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="pending">В ожидании</SelectItem>
                    <SelectItem value="sent">Отправлен</SelectItem>
                    <SelectItem value="processing">Обрабатывается</SelectItem>
                    <SelectItem value="completed">Выполнен</SelectItem>
                    <SelectItem value="rejected">Отклонен</SelectItem>
                    <SelectItem value="failed">Ошибка</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Список запросов
              <Badge variant="secondary">{filteredRequests.length}</Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" data-testid="button-export-requests">
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {requests.length === 0 ? 'Запросов пока нет' : 'Запросы не найдены'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {requests.length === 0 
                  ? 'Создайте первый запрос на удаление персональных данных'
                  : 'Попробуйте изменить фильтры поиска'
                }
              </p>
              {requests.length === 0 && (
                <Button asChild data-testid="button-create-first-request">
                  <Link href="/app/create-request">
                    <Plus className="h-4 w-4 mr-2" />
                    Создать запрос
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile Card List */}
              {isMobile ? (
                <div className="space-y-3" data-testid="requests-mobile-list">
                  {filteredRequests.map((request) => (
                    <RequestMobileCard
                      key={request.id}
                      request={request}
                      onView={setSelectedRequest}
                      onStatusUpdate={handleStatusUpdate}
                      isUpdating={updateRequestMutation.isPending}
                    />
                  ))}
                </div>
              ) : (
                /* Desktop Table */
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Брокер</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Создан</TableHead>
                        <TableHead>Обновлен</TableHead>
                        <TableHead>Действия</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => {
                        const statusInfo = statusConfig[request.status] || {
                          label: 'Неизвестно',
                          color: 'secondary' as const,
                          icon: Clock,
                          description: 'Неизвестный статус'
                        };
                        const IconComponent = statusInfo.icon;
                        
                        return (
                          <TableRow 
                            key={request.id}
                            className="hover-elevate cursor-pointer"
                            onClick={() => setSelectedRequest(request)}
                            data-testid={`request-row-${request.id}`}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium" data-testid={`request-broker-${request.id}`}>
                                    {request.dataBroker?.name || 'Неизвестный провайдер'}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {request.dataBroker?.website || 'Нет данных'}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                <Badge 
                                  variant={statusInfo.color}
                                  data-testid={`request-status-${request.id}`}
                                >
                                  {statusInfo.label}
                                </Badge>
                                {request.followUpRequired && (
                                  <Badge variant="outline" className="text-xs">
                                    Требует действий
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="text-sm">
                                {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="text-sm">
                                {request.completedAt 
                                  ? new Date(request.completedAt).toLocaleDateString('ru-RU')
                                  : '—'
                                }
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRequest(request);
                                  }}
                                  data-testid={`button-view-${request.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  disabled={['completed', 'rejected', 'failed'].includes(request.status)}
                                  data-testid={`button-edit-${request.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    data-testid={`button-actions-${request.id}`}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setSelectedRequest(request)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Просмотр
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusUpdate(request.id, 'processing')}
                                    disabled={updateRequestMutation.isPending}
                                  >
                                    <Activity className="h-4 w-4 mr-2" />
                                    Отметить как обрабатывается
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusUpdate(request.id, 'completed')}
                                    disabled={updateRequestMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Отметить как выполнено
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Request Details Modal/Panel - placeholder for future implementation */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Детали запроса</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedRequest(null)}
                  data-testid="button-close-details"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Брокер данных</Label>
                <p className="text-sm">{selectedRequest.dataBroker?.name || 'Неизвестный провайдер'}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Статус</Label>
                <div className="flex items-center gap-2 mt-1">
                  {(() => {
                    const statusInfo = statusConfig[selectedRequest.status];
                    const IconComponent = statusInfo.icon;
                    return (
                      <>
                        <IconComponent className="h-4 w-4" />
                        <Badge variant={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </>
                    );
                  })()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {statusConfig[selectedRequest.status].description}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Дата создания</Label>
                <p className="text-sm">{new Date(selectedRequest.createdAt).toLocaleString('ru-RU')}</p>
              </div>
              
              {selectedRequest.completedAt && (
                <div>
                  <Label className="text-sm font-medium">Дата завершения</Label>
                  <p className="text-sm">{new Date(selectedRequest.completedAt).toLocaleString('ru-RU')}</p>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium">Способ запроса</Label>
                <p className="text-sm">{selectedRequest.requestMethod}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div>
                  <Label className="text-sm font-medium">Ответ получен</Label>
                  <p className="text-sm">{selectedRequest.responseReceived ? 'Да' : 'Нет'}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Требует действий</Label>
                  <p className="text-sm">{selectedRequest.followUpRequired ? 'Да' : 'Нет'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
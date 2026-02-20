import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  Download,
  Filter,
  Grid3x3,
  List,
  RefreshCw,
  Building,
  Bot,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import DataBrokerForm from '@/components/DataBrokerForm';
import DataBrokerCard from '@/components/DataBrokerCard';
import DataBrokerImporter from '@/components/DataBrokerImporter';
import DataBrokerStats from '@/components/DataBrokerStats';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import type { DataBroker } from '@shared/schema';

type ViewMode = 'grid' | 'table';

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Все категории' },
  { value: 'banks', label: 'Банки' },
  { value: 'telecom', label: 'Телеком' },
  { value: 'retail', label: 'Ритейл' },
  { value: 'insurance', label: 'Страхование' },
  { value: 'government', label: 'Государственные' },
  { value: 'healthcare', label: 'Здравоохранение' },
  { value: 'education', label: 'Образование' },
  { value: 'realestate', label: 'Недвижимость' },
  { value: 'transport', label: 'Транспорт' },
  { value: 'social', label: 'Социальные сети' },
  { value: 'other', label: 'Другое' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'Любая сложность' },
  { value: 'easy', label: 'Легко' },
  { value: 'medium', label: 'Средне' },
  { value: 'hard', label: 'Сложно' },
  { value: 'very_hard', label: 'Очень сложно' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Все статусы' },
  { value: 'active', label: 'Активные' },
  { value: 'inactive', label: 'Неактивные' },
  { value: 'automated', label: 'Автоматизированные' },
  { value: 'verified', label: 'Проверенные' },
  { value: 'unverified', label: 'Непроверенные' },
  { value: 'with_warnings', label: 'С предупреждениями' },
];

export default function AdminDataBrokers() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingBroker, setEditingBroker] = useState<DataBroker | undefined>();
  const [showStats, setShowStats] = useState(false);
  const { toast } = useToast();

  // Fetch data brokers
  const { data: brokers = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/data-brokers', searchQuery, categoryFilter, difficultyFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (difficultyFilter !== 'all') params.append('difficulty', difficultyFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const response = await fetch(`/api/admin/data-brokers?${params}`);
      if (!response.ok) throw new Error('Failed to fetch data brokers');
      return response.json();
    },
  });

  // Create/Update broker mutation
  const saveBrokerMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingBroker) {
        return apiRequest(`/api/admin/data-brokers/${editingBroker.id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
      } else {
        return apiRequest('/api/admin/data-brokers', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
    },
    onSuccess: () => {
      toast({
        title: editingBroker ? 'Оператор обновлен' : 'Оператор создан',
        description: 'Изменения успешно сохранены',
      });
      setShowForm(false);
      setEditingBroker(undefined);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/data-brokers'] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.message || 'Не удалось сохранить данные',
      });
    },
  });

  // Delete broker mutation
  const deleteBrokerMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/data-brokers/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Оператор удален',
        description: 'Оператор успешно удален из базы данных',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/data-brokers'] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка удаления',
        description: error.message || 'Не удалось удалить оператора',
      });
    },
  });

  // Verify broker mutation
  const verifyBrokerMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/data-brokers/${id}/verify`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Оператор проверен',
        description: 'Статус проверки обновлен',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/data-brokers'] });
    },
  });

  // Import brokers mutation
  const importBrokersMutation = useMutation({
    mutationFn: async (brokers: Partial<DataBroker>[]) => {
      return apiRequest('/api/admin/data-brokers/import', {
        method: 'POST',
        body: JSON.stringify({ brokers }),
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: 'Импорт завершен',
        description: `Успешно импортировано ${data.imported} операторов`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/data-brokers'] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка импорта',
        description: error.message || 'Не удалось импортировать данные',
      });
    },
  });

  // Export to CSV
  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/data-brokers/export');
      if (!response.ok) throw new Error('Failed to export');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-brokers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Экспорт завершен',
        description: 'Файл CSV успешно загружен',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка экспорта',
        description: 'Не удалось экспортировать данные',
      });
    }
  };

  const handleEdit = (broker: DataBroker) => {
    setEditingBroker(broker);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteBrokerMutation.mutate(id);
  };

  const handleVerify = (id: string) => {
    verifyBrokerMutation.mutate(id);
  };

  const handleTestAutomation = async (id: string) => {
    toast({
      title: 'Тестирование автоматизации',
      description: 'Функция в разработке',
    });
  };

  const handleSubmitForm = async (data: any) => {
    await saveBrokerMutation.mutateAsync(data);
  };

  const handleImport = async (brokers: Partial<DataBroker>[]) => {
    await importBrokersMutation.mutateAsync(brokers);
  };

  // Filter brokers based on search and filters
  const filteredBrokers = brokers.filter((broker: DataBroker) => {
    // Search filter
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      const matchesSearch = 
        broker.name.toLowerCase().includes(search) ||
        broker.legalName?.toLowerCase().includes(search) ||
        broker.email?.toLowerCase().includes(search) ||
        broker.website?.toLowerCase().includes(search) ||
        broker.regulatorNumber?.toLowerCase().includes(search) ||
        broker.tags?.some(tag => tag.toLowerCase().includes(search));
      
      if (!matchesSearch) return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && broker.category !== categoryFilter) {
      return false;
    }

    // Difficulty filter
    if (difficultyFilter !== 'all' && broker.difficultyLevel !== difficultyFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && !broker.isActive) return false;
      if (statusFilter === 'inactive' && broker.isActive) return false;
      if (statusFilter === 'automated' && !broker.automatedRemoval) return false;
      if (statusFilter === 'verified' && !broker.lastVerifiedAt) return false;
      if (statusFilter === 'unverified' && broker.lastVerifiedAt) return false;
      if (statusFilter === 'with_warnings' && !broker.warnings) return false;
    }

    return true;
  });

  return (
    <>
      <SEO 
        title="Управление операторами данных | Админ-панель GrandHub"
        description="Управление базой операторов персональных данных"
        index={false}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Управление операторами данных</h1>
              <p className="text-muted-foreground mt-1">
                База операторов персональных данных для автоматизации удаления
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowStats(!showStats)}
                data-testid="button-toggle-stats"
              >
                <ChevronRight className={`mr-2 h-4 w-4 transition-transform ${showStats ? 'rotate-90' : ''}`} />
                Статистика
              </Button>
              <Button
                onClick={() => {
                  setEditingBroker(undefined);
                  setShowForm(true);
                }}
                data-testid="button-add-broker"
              >
                <Plus className="mr-2 h-4 w-4" />
                Добавить оператора
              </Button>
            </div>
          </div>

          {showStats && (
            <div className="animate-in slide-in-from-top-2">
              <DataBrokerStats brokers={brokers} />
              <Separator className="my-6" />
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Фильтры и поиск</CardTitle>
              <CardDescription>
                Найдите нужных операторов по различным параметрам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск по названию, сайту, email, тегам..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-search-brokers"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[200px]" data-testid="select-filter-category">
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-[180px]" data-testid="select-filter-difficulty">
                      <SelectValue placeholder="Сложность" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px]" data-testid="select-filter-status">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <DataBrokerImporter
                      onImport={handleImport}
                      existingBrokers={brokers}
                    />
                    <Button variant="outline" onClick={handleExport} data-testid="button-export-csv">
                      <Download className="mr-2 h-4 w-4" />
                      Экспорт CSV
                    </Button>
                    <Button variant="outline" onClick={() => refetch()} data-testid="button-refresh">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Обновить
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Найдено: {filteredBrokers.length} из {brokers.length}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        data-testid="button-view-grid"
                      >
                        <Grid3x3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('table')}
                        data-testid="button-view-table"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredBrokers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Операторы не найдены</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Попробуйте изменить параметры поиска
                </p>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBrokers.map((broker: DataBroker) => (
                <DataBrokerCard
                  key={broker.id}
                  broker={broker}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onVerify={handleVerify}
                  onTestAutomation={handleTestAutomation}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>Категория</TableHead>
                        <TableHead>Сложность</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Автоматизация</TableHead>
                        <TableHead>Успешность</TableHead>
                        <TableHead>Проверен</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBrokers.map((broker: DataBroker) => (
                        <TableRow key={broker.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{broker.name}</div>
                              {broker.legalName && (
                                <div className="text-xs text-muted-foreground">{broker.legalName}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {CATEGORY_OPTIONS.find(c => c.value === broker.category)?.label || broker.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                broker.difficultyLevel === 'easy' ? 'text-green-600' :
                                broker.difficultyLevel === 'medium' ? 'text-yellow-600' :
                                broker.difficultyLevel === 'hard' ? 'text-orange-600' :
                                'text-red-600'
                              }
                            >
                              {DIFFICULTY_OPTIONS.find(d => d.value === broker.difficultyLevel)?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {broker.isActive ? (
                              <Badge variant="outline" className="text-green-600">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Активен
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-500">
                                <XCircle className="mr-1 h-3 w-3" />
                                Неактивен
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {broker.automatedRemoval ? (
                              <Bot className="h-4 w-4 text-blue-500" />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {broker.successRate !== undefined ? `${broker.successRate}%` : '-'}
                          </TableCell>
                          <TableCell>
                            {broker.lastVerifiedAt ? (
                              <Badge variant="outline" className="text-green-600">
                                <Shield className="mr-1 h-3 w-3" />
                                {new Date(broker.lastVerifiedAt).toLocaleDateString('ru-RU')}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-orange-600">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Требуется
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(broker)}
                                data-testid={`button-edit-${broker.id}`}
                              >
                                Изменить
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerify(broker.id)}
                                data-testid={`button-verify-${broker.id}`}
                              >
                                Проверить
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </main>

        <Footer />
      </div>

      {/* Add/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingBroker ? 'Редактирование оператора' : 'Добавление нового оператора'}
            </DialogTitle>
            <DialogDescription>
              Заполните информацию об операторе персональных данных
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] pr-4">
            <DataBrokerForm
              broker={editingBroker}
              onSubmit={handleSubmitForm}
              onCancel={() => {
                setShowForm(false);
                setEditingBroker(undefined);
              }}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
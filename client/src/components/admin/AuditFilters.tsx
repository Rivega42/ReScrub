import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon, X, Filter, RotateCcw } from 'lucide-react';

interface FilterState {
  search?: string;
  adminId?: string;
  actionType?: string;
  targetType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  ipAddress?: string;
}

interface AuditFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export default function AuditFilters({ onFiltersChange, currentFilters }: AuditFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  // Query for admin users
  const { data: adminUsers } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/users', { role: 'admin' }],
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  const actionTypes = [
    { value: 'create', label: 'Создание' },
    { value: 'update', label: 'Обновление' },
    { value: 'delete', label: 'Удаление' },
    { value: 'view', label: 'Просмотр' },
    { value: 'export', label: 'Экспорт' },
    { value: 'login', label: 'Вход в систему' },
    { value: 'logout', label: 'Выход из системы' },
    { value: 'permission_change', label: 'Изменение прав' },
    { value: 'password_reset', label: 'Сброс пароля' },
  ];

  const targetTypes = [
    { value: 'users', label: 'Пользователи' },
    { value: 'secrets', label: 'Секреты' },
    { value: 'data_brokers', label: 'Дата-брокеры' },
    { value: 'user_data', label: 'Данные пользователей' },
    { value: 'subscriptions', label: 'Подписки' },
    { value: 'payments', label: 'Платежи' },
    { value: 'emails', label: 'Email шаблоны' },
    { value: 'system', label: 'Система' },
    { value: 'roles', label: 'Роли' },
    { value: 'permissions', label: 'Права доступа' },
  ];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilter = (key: keyof FilterState) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="space-y-4">
      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Активные фильтры:</span>
          {filters.adminId && adminUsers && (
            <Badge variant="secondary" className="gap-1">
              Админ: {adminUsers.find(a => a.id === filters.adminId)?.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('adminId')}
                data-testid="button-clear-admin-filter"
              />
            </Badge>
          )}
          {filters.actionType && (
            <Badge variant="secondary" className="gap-1">
              Действие: {actionTypes.find(a => a.value === filters.actionType)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('actionType')}
                data-testid="button-clear-action-filter"
              />
            </Badge>
          )}
          {filters.targetType && (
            <Badge variant="secondary" className="gap-1">
              Цель: {targetTypes.find(t => t.value === filters.targetType)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('targetType')}
                data-testid="button-clear-target-filter"
              />
            </Badge>
          )}
          {filters.dateFrom && (
            <Badge variant="secondary" className="gap-1">
              С: {format(filters.dateFrom, 'dd.MM.yyyy')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('dateFrom')}
                data-testid="button-clear-date-from-filter"
              />
            </Badge>
          )}
          {filters.dateTo && (
            <Badge variant="secondary" className="gap-1">
              По: {format(filters.dateTo, 'dd.MM.yyyy')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('dateTo')}
                data-testid="button-clear-date-to-filter"
              />
            </Badge>
          )}
          {filters.ipAddress && (
            <Badge variant="secondary" className="gap-1">
              IP: {filters.ipAddress}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('ipAddress')}
                data-testid="button-clear-ip-filter"
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            data-testid="button-clear-all-filters"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Очистить все
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Admin User Filter */}
        <div className="space-y-2">
          <Label htmlFor="admin-filter">Администратор</Label>
          <Select
            value={filters.adminId || ''}
            onValueChange={(value) => handleFilterChange('adminId', value)}
          >
            <SelectTrigger id="admin-filter" data-testid="select-admin-filter">
              <SelectValue placeholder="Выберите администратора" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все администраторы</SelectItem>
              {adminUsers?.map(admin => (
                <SelectItem key={admin.id} value={admin.id}>
                  {admin.name} ({admin.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="action-filter">Тип действия</Label>
          <Select
            value={filters.actionType || ''}
            onValueChange={(value) => handleFilterChange('actionType', value)}
          >
            <SelectTrigger id="action-filter" data-testid="select-action-filter">
              <SelectValue placeholder="Выберите действие" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все действия</SelectItem>
              {actionTypes.map(action => (
                <SelectItem key={action.value} value={action.value}>
                  {action.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="target-filter">Тип объекта</Label>
          <Select
            value={filters.targetType || ''}
            onValueChange={(value) => handleFilterChange('targetType', value)}
          >
            <SelectTrigger id="target-filter" data-testid="select-target-filter">
              <SelectValue placeholder="Выберите объект" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все объекты</SelectItem>
              {targetTypes.map(target => (
                <SelectItem key={target.value} value={target.value}>
                  {target.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date From Filter */}
        <div className="space-y-2">
          <Label>Дата с</Label>
          <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                data-testid="button-date-from-filter"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom ? (
                  format(filters.dateFrom, 'dd MMMM yyyy', { locale: ru })
                ) : (
                  <span>Выберите дату</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateFrom}
                onSelect={(date) => {
                  handleFilterChange('dateFrom', date);
                  setDateFromOpen(false);
                }}
                disabled={(date) => date > new Date() || date < new Date('2024-01-01')}
                locale={ru}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date To Filter */}
        <div className="space-y-2">
          <Label>Дата по</Label>
          <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                data-testid="button-date-to-filter"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateTo ? (
                  format(filters.dateTo, 'dd MMMM yyyy', { locale: ru })
                ) : (
                  <span>Выберите дату</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateTo}
                onSelect={(date) => {
                  handleFilterChange('dateTo', date);
                  setDateToOpen(false);
                }}
                disabled={(date) => {
                  const today = new Date();
                  const minDate = filters.dateFrom || new Date('2024-01-01');
                  return date > today || date < minDate;
                }}
                locale={ru}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* IP Address Filter */}
        <div className="space-y-2">
          <Label htmlFor="ip-filter">IP-адрес</Label>
          <Input
            id="ip-filter"
            type="text"
            placeholder="Например: 192.168.1.1"
            value={filters.ipAddress || ''}
            onChange={(e) => handleFilterChange('ipAddress', e.target.value)}
            data-testid="input-ip-filter"
          />
        </div>
      </div>

      {/* Quick filters */}
      <div className="flex gap-2 flex-wrap pt-2">
        <span className="text-sm text-muted-foreground">Быстрые фильтры:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            setFilters({
              dateFrom: today,
              dateTo: new Date()
            });
          }}
          data-testid="button-filter-today"
        >
          Сегодня
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            weekAgo.setHours(0, 0, 0, 0);
            setFilters({
              dateFrom: weekAgo,
              dateTo: new Date()
            });
          }}
          data-testid="button-filter-week"
        >
          Последняя неделя
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilters({
              targetType: 'secrets'
            });
          }}
          data-testid="button-filter-sensitive"
        >
          Критические операции
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilters({
              actionType: 'delete'
            });
          }}
          data-testid="button-filter-deletions"
        >
          Удаления
        </Button>
      </div>
    </div>
  );
}
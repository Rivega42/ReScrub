import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  Shield, 
  UserPlus, 
  UserMinus, 
  Clock, 
  Key,
  AlertTriangle,
  CheckCircle,
  Info,
  CalendarIcon,
  History,
  Users,
  Edit,
  Trash2,
  ChevronDown,
  Lock,
  Unlock,
  ShieldOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { cn } from '@/lib/utils';

interface AdminUser {
  id: string;
  email: string;
  name?: string;
  adminRole: 'admin' | 'moderator' | 'superadmin';
  permissions: string[];
  createdAt: Date;
  lastActive?: Date;
}

interface Permission {
  id: string;
  adminId: string;
  permission: string;
  resource?: string;
  action?: string;
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
  revoked?: boolean;
  revokedAt?: Date;
  revokedBy?: string;
}

interface PermissionTemplate {
  name: string;
  permissions: string[];
  description: string;
}

const permissionTemplates: PermissionTemplate[] = [
  {
    name: 'Полный доступ',
    permissions: ['*'],
    description: 'Все разрешения системы'
  },
  {
    name: 'Модератор контента',
    permissions: ['content:read', 'content:update', 'content:delete', 'users:read'],
    description: 'Управление контентом и просмотр пользователей'
  },
  {
    name: 'Поддержка пользователей',
    permissions: ['users:read', 'users:update', 'notifications:send', 'tickets:manage'],
    description: 'Поддержка и общение с пользователями'
  },
  {
    name: 'Аналитика',
    permissions: ['analytics:read', 'reports:generate', 'logs:read'],
    description: 'Доступ к аналитике и отчетам'
  },
  {
    name: 'Безопасность',
    permissions: ['security:read', 'security:update', 'logs:read', 'permissions:read'],
    description: 'Мониторинг безопасности'
  }
];

const allPermissions = [
  { value: '*', label: 'Полный доступ', category: 'Система' },
  { value: 'users:read', label: 'Просмотр пользователей', category: 'Пользователи' },
  { value: 'users:update', label: 'Редактирование пользователей', category: 'Пользователи' },
  { value: 'users:delete', label: 'Удаление пользователей', category: 'Пользователи' },
  { value: 'users:ban', label: 'Блокировка пользователей', category: 'Пользователи' },
  { value: 'content:read', label: 'Просмотр контента', category: 'Контент' },
  { value: 'content:update', label: 'Редактирование контента', category: 'Контент' },
  { value: 'content:delete', label: 'Удаление контента', category: 'Контент' },
  { value: 'content:publish', label: 'Публикация контента', category: 'Контент' },
  { value: 'analytics:read', label: 'Просмотр аналитики', category: 'Аналитика' },
  { value: 'reports:generate', label: 'Создание отчетов', category: 'Аналитика' },
  { value: 'security:read', label: 'Просмотр безопасности', category: 'Безопасность' },
  { value: 'security:update', label: 'Управление безопасностью', category: 'Безопасность' },
  { value: 'logs:read', label: 'Просмотр логов', category: 'Безопасность' },
  { value: 'permissions:read', label: 'Просмотр разрешений', category: 'Разрешения' },
  { value: 'permissions:grant', label: 'Выдача разрешений', category: 'Разрешения' },
  { value: 'permissions:revoke', label: 'Отзыв разрешений', category: 'Разрешения' },
  { value: 'notifications:send', label: 'Отправка уведомлений', category: 'Коммуникация' },
  { value: 'tickets:manage', label: 'Управление тикетами', category: 'Поддержка' },
  { value: 'settings:read', label: 'Просмотр настроек', category: 'Настройки' },
  { value: 'settings:update', label: 'Изменение настроек', category: 'Настройки' }
];

export default function AdminPermissionsManager() {
  const { toast } = useToast();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [permissionToRevoke, setPermissionToRevoke] = useState<Permission | null>(null);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  
  // Query for admin users
  const { data: admins, isLoading: isLoadingAdmins } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await apiRequest('/api/admin/users?role=admin,moderator,superadmin', {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin users');
      }
      
      const result = await response.json();
      return result.users || [];
    }
  });
  
  // Query for permissions
  const { data: permissions, isLoading: isLoadingPermissions } = useQuery<Permission[]>({
    queryKey: ['/api/admin/permissions', selectedAdmin?.id],
    queryFn: async () => {
      const params = selectedAdmin?.id ? `?adminId=${selectedAdmin.id}` : '';
      const response = await apiRequest(`/api/admin/permissions${params}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }
      
      const result = await response.json();
      return result.data || [];
    }
  });
  
  // Query for permission history
  const { data: permissionHistory, isLoading: isLoadingHistory } = useQuery<Permission[]>({
    queryKey: ['/api/admin/permissions', selectedAdmin?.id, 'history'],
    queryFn: async () => {
      if (!selectedAdmin) return [];
      
      const response = await apiRequest(`/api/admin/permissions/${selectedAdmin.id}/history`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch permission history');
      }
      
      const result = await response.json();
      return result.data || [];
    },
    enabled: !!selectedAdmin
  });
  
  // Grant permission mutation
  const grantMutation = useMutation({
    mutationFn: async (data: { adminId: string; permissions: string[]; expiresAt?: Date }) => {
      const response = await apiRequest('/api/admin/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to grant permission');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Успешно',
        description: 'Разрешения выданы',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/permissions'] });
      setShowGrantDialog(false);
      setSelectedPermissions([]);
      setExpiryDate(undefined);
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выдать разрешения',
        variant: 'destructive',
      });
    },
  });
  
  // Revoke permission mutation
  const revokeMutation = useMutation({
    mutationFn: async (permissionId: string) => {
      const response = await apiRequest(`/api/admin/permissions/${permissionId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to revoke permission');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Успешно',
        description: 'Разрешение отозвано',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/permissions'] });
      setShowRevokeDialog(false);
      setPermissionToRevoke(null);
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отозвать разрешение',
        variant: 'destructive',
      });
    },
  });
  
  // Bulk grant permissions
  const bulkGrantMutation = useMutation({
    mutationFn: async (data: { adminIds: string[]; permissions: string[]; expiresAt?: Date }) => {
      const promises = data.adminIds.map(adminId =>
        apiRequest('/api/admin/permissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adminId,
            permissions: data.permissions,
            expiresAt: data.expiresAt
          })
        })
      );
      
      const responses = await Promise.all(promises);
      const failed = responses.filter(r => !r.ok);
      
      if (failed.length > 0) {
        throw new Error(`Failed to grant permissions to ${failed.length} admins`);
      }
      
      return responses;
    },
    onSuccess: () => {
      toast({
        title: 'Успешно',
        description: 'Разрешения выданы выбранным администраторам',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/permissions'] });
      setShowBulkDialog(false);
      setSelectedAdmins([]);
      setSelectedPermissions([]);
      setExpiryDate(undefined);
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    const selectedTemplate = permissionTemplates.find(t => t.name === template);
    if (selectedTemplate) {
      setSelectedPermissions(selectedTemplate.permissions);
    }
  };
  
  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };
  
  const handleAdminToggle = (adminId: string) => {
    setSelectedAdmins(prev => {
      if (prev.includes(adminId)) {
        return prev.filter(id => id !== adminId);
      } else {
        return [...prev, adminId];
      }
    });
  };
  
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'moderator':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  const isPermissionExpired = (expiresAt?: Date) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };
  
  return (
    <div className="space-y-6">
      <Card data-testid="card-permissions-overview">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Управление разрешениями администраторов
          </CardTitle>
          <CardDescription>
            Управляйте ролями и разрешениями администраторов системы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowGrantDialog(true)}
              disabled={!selectedAdmin}
              data-testid="button-grant-permission"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Выдать разрешение
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowBulkDialog(true)}
              data-testid="button-bulk-manage"
            >
              <Users className="h-4 w-4 mr-2" />
              Массовое управление
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="admins" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="admins" data-testid="tab-admins">Администраторы</TabsTrigger>
          <TabsTrigger value="permissions" data-testid="tab-permissions">Разрешения</TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">История</TabsTrigger>
        </TabsList>
        
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Список администраторов</CardTitle>
              <CardDescription>
                Все пользователи с административными правами
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAdmins ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : admins && admins.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead>Разрешений</TableHead>
                      <TableHead>Последняя активность</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow 
                        key={admin.id}
                        data-testid={`row-admin-${admin.id}`}
                        className={cn(
                          selectedAdmin?.id === admin.id && 'bg-muted'
                        )}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{admin.email}</p>
                            {admin.name && (
                              <p className="text-sm text-muted-foreground">{admin.name}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(admin.adminRole)}>
                            {admin.adminRole}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {admin.permissions?.length || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {admin.lastActive 
                            ? format(new Date(admin.lastActive), 'dd.MM.yyyy HH:mm', { locale: ru })
                            : 'Не активен'
                          }
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedAdmin(admin)}
                            data-testid={`button-select-admin-${admin.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Нет администраторов</AlertTitle>
                  <AlertDescription>
                    В системе не найдено пользователей с административными правами
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Активные разрешения</CardTitle>
              <CardDescription>
                {selectedAdmin 
                  ? `Разрешения для ${selectedAdmin.email}`
                  : 'Все активные разрешения в системе'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPermissions ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : permissions && permissions.length > 0 ? (
                <div className="space-y-4">
                  {permissions.map((permission) => (
                    <div 
                      key={permission.id}
                      className={cn(
                        'border rounded-lg p-4',
                        permission.revoked && 'opacity-50',
                        isPermissionExpired(permission.expiresAt) && 'border-destructive'
                      )}
                      data-testid={`card-permission-${permission.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{permission.permission}</span>
                            {permission.revoked && (
                              <Badge variant="destructive">Отозвано</Badge>
                            )}
                            {isPermissionExpired(permission.expiresAt) && (
                              <Badge variant="warning">Истекло</Badge>
                            )}
                          </div>
                          {permission.resource && (
                            <p className="text-sm text-muted-foreground">
                              Ресурс: {permission.resource}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Выдано: {format(new Date(permission.grantedAt), 'dd.MM.yyyy HH:mm', { locale: ru })}
                            {permission.expiresAt && (
                              <span> • Истекает: {format(new Date(permission.expiresAt), 'dd.MM.yyyy', { locale: ru })}</span>
                            )}
                          </p>
                        </div>
                        {!permission.revoked && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setPermissionToRevoke(permission);
                              setShowRevokeDialog(true);
                            }}
                            data-testid={`button-revoke-${permission.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Нет активных разрешений</AlertTitle>
                  <AlertDescription>
                    {selectedAdmin 
                      ? 'У выбранного администратора нет активных разрешений'
                      : 'В системе нет активных разрешений'
                    }
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                История разрешений
              </CardTitle>
              <CardDescription>
                {selectedAdmin 
                  ? `История изменений для ${selectedAdmin.email}`
                  : 'Выберите администратора для просмотра истории'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedAdmin ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Выберите администратора во вкладке "Администраторы" для просмотра истории разрешений
                  </AlertDescription>
                </Alert>
              ) : isLoadingHistory ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : permissionHistory && permissionHistory.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {permissionHistory.map((item) => (
                      <div 
                        key={item.id}
                        className="border rounded-lg p-3"
                        data-testid={`card-history-${item.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={item.revoked ? 'destructive' : 'default'}>
                            {item.permission}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(item.grantedAt), 'dd.MM.yyyy HH:mm', { locale: ru })}
                          </span>
                        </div>
                        <p className="text-sm">
                          {item.revoked ? (
                            <span className="text-destructive">
                              Отозвано: {item.revokedAt && format(new Date(item.revokedAt), 'dd.MM.yyyy', { locale: ru })}
                            </span>
                          ) : isPermissionExpired(item.expiresAt) ? (
                            <span className="text-warning">
                              Истекло: {format(new Date(item.expiresAt!), 'dd.MM.yyyy', { locale: ru })}
                            </span>
                          ) : (
                            <span className="text-green-600">Активно</span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    История разрешений пуста
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Grant Permission Dialog */}
      <Dialog open={showGrantDialog} onOpenChange={setShowGrantDialog}>
        <DialogContent className="max-w-2xl" data-testid="dialog-grant-permission">
          <DialogHeader>
            <DialogTitle>Выдать разрешения</DialogTitle>
            <DialogDescription>
              {selectedAdmin ? `Выдача разрешений для ${selectedAdmin.email}` : 'Выберите администратора'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAdmin && (
            <div className="space-y-4">
              <div>
                <Label>Шаблон разрешений</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger data-testid="select-template">
                    <SelectValue placeholder="Выберите шаблон..." />
                  </SelectTrigger>
                  <SelectContent>
                    {permissionTemplates.map(template => (
                      <SelectItem key={template.name} value={template.name}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {permissionTemplates.find(t => t.name === selectedTemplate)?.description}
                  </p>
                )}
              </div>
              
              <div>
                <Label>Индивидуальные разрешения</Label>
                <ScrollArea className="h-[200px] border rounded-md p-4 mt-2">
                  {Object.entries(
                    allPermissions.reduce((acc, perm) => {
                      if (!acc[perm.category]) acc[perm.category] = [];
                      acc[perm.category].push(perm);
                      return acc;
                    }, {} as Record<string, typeof allPermissions>)
                  ).map(([category, perms]) => (
                    <div key={category} className="mb-4">
                      <h4 className="font-medium text-sm mb-2">{category}</h4>
                      <div className="space-y-2">
                        {perms.map(perm => (
                          <div key={perm.value} className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedPermissions.includes(perm.value)}
                              onCheckedChange={() => handlePermissionToggle(perm.value)}
                              data-testid={`checkbox-permission-${perm.value}`}
                            />
                            <label className="text-sm">{perm.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
              
              <div>
                <Label>Срок действия (опционально)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal mt-2',
                        !expiryDate && 'text-muted-foreground'
                      )}
                      data-testid="button-expiry-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, 'dd.MM.yyyy', { locale: ru }) : 'Бессрочно'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {selectedPermissions.length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Выбрано разрешений: {selectedPermissions.length}</AlertTitle>
                  <AlertDescription>
                    {selectedPermissions.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowGrantDialog(false);
                setSelectedPermissions([]);
                setExpiryDate(undefined);
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={() => {
                if (selectedAdmin && selectedPermissions.length > 0) {
                  grantMutation.mutate({
                    adminId: selectedAdmin.id,
                    permissions: selectedPermissions,
                    expiresAt: expiryDate
                  });
                }
              }}
              disabled={!selectedAdmin || selectedPermissions.length === 0 || grantMutation.isPending}
              data-testid="button-confirm-grant"
            >
              <Shield className="h-4 w-4 mr-2" />
              Выдать разрешения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Revoke Permission Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent data-testid="dialog-revoke-permission">
          <DialogHeader>
            <DialogTitle>Отозвать разрешение</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите отозвать это разрешение?
            </DialogDescription>
          </DialogHeader>
          
          {permissionToRevoke && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Внимание!</AlertTitle>
              <AlertDescription>
                Это действие отзовет разрешение "{permissionToRevoke.permission}" немедленно.
                Администратор потеряет доступ к соответствующим функциям.
              </AlertDescription>
            </Alert>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRevokeDialog(false);
                setPermissionToRevoke(null);
              }}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (permissionToRevoke) {
                  revokeMutation.mutate(permissionToRevoke.id);
                }
              }}
              disabled={!permissionToRevoke || revokeMutation.isPending}
              data-testid="button-confirm-revoke"
            >
              <ShieldOff className="h-4 w-4 mr-2" />
              Отозвать разрешение
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Management Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent className="max-w-3xl" data-testid="dialog-bulk-manage">
          <DialogHeader>
            <DialogTitle>Массовое управление разрешениями</DialogTitle>
            <DialogDescription>
              Выдайте разрешения нескольким администраторам одновременно
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Выберите администраторов</Label>
              <ScrollArea className="h-[200px] border rounded-md p-4 mt-2">
                {admins?.map(admin => (
                  <div key={admin.id} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      checked={selectedAdmins.includes(admin.id)}
                      onCheckedChange={() => handleAdminToggle(admin.id)}
                      data-testid={`checkbox-bulk-admin-${admin.id}`}
                    />
                    <label className="flex-1">
                      <span className="font-medium">{admin.email}</span>
                      <Badge variant={getRoleBadgeVariant(admin.adminRole)} className="ml-2">
                        {admin.adminRole}
                      </Badge>
                    </label>
                  </div>
                ))}
              </ScrollArea>
              {selectedAdmins.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Выбрано администраторов: {selectedAdmins.length}
                </p>
              )}
            </div>
            
            <div>
              <Label>Разрешения для выдачи</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger data-testid="select-bulk-template">
                  <SelectValue placeholder="Выберите шаблон..." />
                </SelectTrigger>
                <SelectContent>
                  {permissionTemplates.map(template => (
                    <SelectItem key={template.name} value={template.name}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Срок действия</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal mt-2',
                      !expiryDate && 'text-muted-foreground'
                    )}
                    data-testid="button-bulk-expiry"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, 'dd.MM.yyyy', { locale: ru }) : 'Бессрочно'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBulkDialog(false);
                setSelectedAdmins([]);
                setSelectedPermissions([]);
                setExpiryDate(undefined);
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={() => {
                if (selectedAdmins.length > 0 && selectedPermissions.length > 0) {
                  bulkGrantMutation.mutate({
                    adminIds: selectedAdmins,
                    permissions: selectedPermissions,
                    expiresAt: expiryDate
                  });
                }
              }}
              disabled={selectedAdmins.length === 0 || selectedPermissions.length === 0 || bulkGrantMutation.isPending}
              data-testid="button-confirm-bulk"
            >
              <Users className="h-4 w-4 mr-2" />
              Выдать разрешения ({selectedAdmins.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  Shield, 
  Users, 
  Key, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  UserCheck,
  UserX,
  Settings,
  Lock,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  ShieldX,
  Eye,
  EyeOff
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';

interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: Permission[];
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  roleId: string;
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
}

interface PermissionMatrix {
  resource: string;
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    export: boolean;
  };
}

const DEFAULT_PERMISSIONS: { [key: string]: PermissionMatrix[] } = {
  superadmin: [
    { resource: 'users', actions: { create: true, read: true, update: true, delete: true, export: true } },
    { resource: 'secrets', actions: { create: true, read: true, update: true, delete: true, export: true } },
    { resource: 'data_brokers', actions: { create: true, read: true, update: true, delete: true, export: true } },
    { resource: 'subscriptions', actions: { create: true, read: true, update: true, delete: true, export: true } },
    { resource: 'payments', actions: { create: true, read: true, update: true, delete: true, export: true } },
    { resource: 'roles', actions: { create: true, read: true, update: true, delete: true, export: true } },
    { resource: 'audit_logs', actions: { create: false, read: true, update: false, delete: false, export: true } },
    { resource: 'system', actions: { create: true, read: true, update: true, delete: true, export: true } },
  ],
  admin: [
    { resource: 'users', actions: { create: true, read: true, update: true, delete: false, export: true } },
    { resource: 'secrets', actions: { create: false, read: false, update: false, delete: false, export: false } },
    { resource: 'data_brokers', actions: { create: true, read: true, update: true, delete: false, export: true } },
    { resource: 'subscriptions', actions: { create: false, read: true, update: true, delete: false, export: true } },
    { resource: 'payments', actions: { create: false, read: true, update: false, delete: false, export: true } },
    { resource: 'roles', actions: { create: false, read: true, update: false, delete: false, export: false } },
    { resource: 'audit_logs', actions: { create: false, read: true, update: false, delete: false, export: true } },
    { resource: 'system', actions: { create: false, read: true, update: false, delete: false, export: false } },
  ],
  viewer: [
    { resource: 'users', actions: { create: false, read: true, update: false, delete: false, export: true } },
    { resource: 'secrets', actions: { create: false, read: false, update: false, delete: false, export: false } },
    { resource: 'data_brokers', actions: { create: false, read: true, update: false, delete: false, export: true } },
    { resource: 'subscriptions', actions: { create: false, read: true, update: false, delete: false, export: true } },
    { resource: 'payments', actions: { create: false, read: true, update: false, delete: false, export: false } },
    { resource: 'roles', actions: { create: false, read: true, update: false, delete: false, export: false } },
    { resource: 'audit_logs', actions: { create: false, read: true, update: false, delete: false, export: false } },
    { resource: 'system', actions: { create: false, read: true, update: false, delete: false, export: false } },
  ]
};

export default function AdminRoles() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrix[]>([]);
  const { toast } = useToast();

  // Query for roles
  const { data: roles, isLoading: rolesLoading } = useQuery<Role[]>({
    queryKey: ['/api/admin/roles']
  });

  // Query for admin users
  const { data: adminUsers, isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/users', { role: 'admin' }]
  });

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/admin/roles', {
        method: 'POST',
        body: {
          name: newRoleName,
          description: newRoleDescription,
          permissions: permissionMatrixToPermissions(permissionMatrix)
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles'] });
      setShowCreateDialog(false);
      setNewRoleName('');
      setNewRoleDescription('');
      setPermissionMatrix([]);
      toast({
        title: 'Роль создана',
        description: 'Новая роль успешно добавлена в систему',
      });
    },
    onError: () => {
      toast({
        title: 'Ошибка создания',
        description: 'Не удалось создать новую роль',
        variant: 'destructive'
      });
    }
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async (data: { roleId: string; permissions: Permission[] }) => {
      return apiRequest(`/api/admin/roles/${data.roleId}`, {
        method: 'PATCH',
        body: { permissions: data.permissions }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles'] });
      toast({
        title: 'Роль обновлена',
        description: 'Права доступа успешно изменены',
      });
    },
    onError: () => {
      toast({
        title: 'Ошибка обновления',
        description: 'Не удалось обновить права доступа',
        variant: 'destructive'
      });
    }
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/admin/users/${selectedUserId}/roles`, {
        method: 'POST',
        body: { roleId: selectedRoleId }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles'] });
      setShowAssignDialog(false);
      setSelectedUserId('');
      setSelectedRoleId('');
      toast({
        title: 'Роль назначена',
        description: 'Роль успешно назначена пользователю',
      });
    },
    onError: () => {
      toast({
        title: 'Ошибка назначения',
        description: 'Не удалось назначить роль пользователю',
        variant: 'destructive'
      });
    }
  });

  // Helper functions
  const permissionMatrixToPermissions = (matrix: PermissionMatrix[]): Permission[] => {
    const permissions: Permission[] = [];
    matrix.forEach(resource => {
      Object.entries(resource.actions).forEach(([action, enabled]) => {
        if (enabled) {
          permissions.push({
            id: `${resource.resource}_${action}`,
            resource: resource.resource,
            action,
            description: `${action} access for ${resource.resource}`
          });
        }
      });
    });
    return permissions;
  };

  const permissionsToMatrix = (permissions: Permission[]): PermissionMatrix[] => {
    const resources = [...new Set(permissions.map(p => p.resource))];
    return resources.map(resource => {
      const resourcePerms = permissions.filter(p => p.resource === resource);
      return {
        resource,
        actions: {
          create: resourcePerms.some(p => p.action === 'create'),
          read: resourcePerms.some(p => p.action === 'read'),
          update: resourcePerms.some(p => p.action === 'update'),
          delete: resourcePerms.some(p => p.action === 'delete'),
          export: resourcePerms.some(p => p.action === 'export'),
        }
      };
    });
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'superadmin':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'viewer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'users': return <Users className="h-4 w-4" />;
      case 'secrets': return <Key className="h-4 w-4" />;
      case 'roles': return <Shield className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <ChevronRight className="h-4 w-4" />;
    }
  };

  return (
    <>
      <SEO 
        title="Управление ролями | Панель администратора"
        description="Управление ролями и правами доступа администраторов"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Управление ролями и правами доступа
            </h1>
            <p className="text-muted-foreground mt-2">
              Настройка ролей администраторов и их прав доступа к системе
            </p>
          </div>

          {/* Warning for sensitive area */}
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Критическая область</AlertTitle>
            <AlertDescription>
              Изменение ролей и прав доступа может повлиять на безопасность системы. 
              Все действия записываются в журнал аудита.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="roles" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="roles" data-testid="tab-roles">Роли</TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">Администраторы</TabsTrigger>
              <TabsTrigger value="matrix" data-testid="tab-matrix">Матрица прав</TabsTrigger>
            </TabsList>

            {/* Roles Tab */}
            <TabsContent value="roles" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Системные роли</CardTitle>
                      <CardDescription>
                        Управление ролями и их правами доступа
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => {
                        setPermissionMatrix(DEFAULT_PERMISSIONS.viewer);
                        setShowCreateDialog(true);
                      }}
                      data-testid="button-create-role"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Создать роль
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rolesLoading ? (
                      <p className="text-center text-muted-foreground py-8">Загрузка ролей...</p>
                    ) : (
                      roles?.map((role) => (
                        <Card key={role.id} data-testid={`card-role-${role.id}`}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-lg">{role.name}</CardTitle>
                                  <Badge variant={getRoleBadgeVariant(role.name)}>
                                    {role.isSystem ? 'Системная' : 'Пользовательская'}
                                  </Badge>
                                </div>
                                <CardDescription className="mt-1">
                                  {role.description}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  <Users className="h-3 w-3 mr-1" />
                                  {role.userCount} польз.
                                </Badge>
                                {!role.isSystem && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedRole(role)}
                                    data-testid={`button-edit-role-${role.id}`}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-xs text-muted-foreground mb-3">
                              Права доступа: {role.permissions.length} разрешений
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {[...new Set(role.permissions.map(p => p.resource))].map(resource => (
                                <Badge key={resource} variant="secondary" className="text-xs">
                                  {getResourceIcon(resource)}
                                  <span className="ml-1">{resource}</span>
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Администраторы системы</CardTitle>
                      <CardDescription>
                        Назначение и управление ролями администраторов
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => setShowAssignDialog(true)}
                      data-testid="button-assign-role"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Назначить роль
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Пользователь</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Последний вход</TableHead>
                        <TableHead>Создан</TableHead>
                        <TableHead className="w-[100px]">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Загрузка администраторов...
                          </TableCell>
                        </TableRow>
                      ) : adminUsers?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Администраторы не найдены
                          </TableCell>
                        </TableRow>
                      ) : (
                        adminUsers?.map((user) => (
                          <TableRow key={user.id} data-testid={`row-admin-user-${user.id}`}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(user.role)}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.isActive ? "default" : "secondary"}>
                                {user.isActive ? 'Активен' : 'Заблокирован'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {format(new Date(user.lastLogin), 'dd.MM.yyyy HH:mm', { locale: ru })}
                            </TableCell>
                            <TableCell className="text-sm">
                              {format(new Date(user.createdAt), 'dd.MM.yyyy', { locale: ru })}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUserId(user.id);
                                    setSelectedRoleId(user.roleId);
                                    setShowAssignDialog(true);
                                  }}
                                  data-testid={`button-change-role-${user.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // Toggle user active status
                                  }}
                                  data-testid={`button-toggle-status-${user.id}`}
                                >
                                  {user.isActive ? (
                                    <UserX className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <UserCheck className="h-4 w-4 text-green-500" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Permission Matrix Tab */}
            <TabsContent value="matrix" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Матрица прав доступа</CardTitle>
                  <CardDescription>
                    Сравнение прав доступа между ролями
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Ресурс / Действие</TableHead>
                          <TableHead className="text-center">Суперадмин</TableHead>
                          <TableHead className="text-center">Администратор</TableHead>
                          <TableHead className="text-center">Просмотр</TableHead>
                          {roles?.filter(r => !r.isSystem).map(role => (
                            <TableHead key={role.id} className="text-center">
                              {role.name}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.keys(DEFAULT_PERMISSIONS.superadmin[0].actions).map(action => (
                          <>
                            <TableRow key={action}>
                              <TableCell 
                                colSpan={4 + (roles?.filter(r => !r.isSystem).length || 0)} 
                                className="bg-muted font-semibold"
                              >
                                {action === 'create' && 'Создание'}
                                {action === 'read' && 'Чтение'}
                                {action === 'update' && 'Обновление'}
                                {action === 'delete' && 'Удаление'}
                                {action === 'export' && 'Экспорт'}
                              </TableCell>
                            </TableRow>
                            {DEFAULT_PERMISSIONS.superadmin.map(resource => (
                              <TableRow key={`${resource.resource}-${action}`}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    {getResourceIcon(resource.resource)}
                                    {resource.resource}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  {resource.actions[action as keyof typeof resource.actions] ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-500 mx-auto" />
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  {DEFAULT_PERMISSIONS.admin.find(r => r.resource === resource.resource)?.actions[action as keyof typeof resource.actions] ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-500 mx-auto" />
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  {DEFAULT_PERMISSIONS.viewer.find(r => r.resource === resource.resource)?.actions[action as keyof typeof resource.actions] ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-500 mx-auto" />
                                  )}
                                </TableCell>
                                {roles?.filter(r => !r.isSystem).map(role => (
                                  <TableCell key={role.id} className="text-center">
                                    {permissionsToMatrix(role.permissions).find(r => r.resource === resource.resource)?.actions[action as keyof typeof resource.actions] ? (
                                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                    ) : (
                                      <X className="h-4 w-4 text-red-500 mx-auto" />
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Create Role Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Создание новой роли</DialogTitle>
                <DialogDescription>
                  Настройте права доступа для новой роли администратора
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name">Название роли</Label>
                  <Input
                    id="role-name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Например: Модератор"
                    data-testid="input-role-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-description">Описание</Label>
                  <Input
                    id="role-description"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    placeholder="Описание роли и её назначения"
                    data-testid="input-role-description"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Права доступа</Label>
                  <ScrollArea className="h-[300px] border rounded-lg p-4">
                    {permissionMatrix.map((resource, idx) => (
                      <div key={resource.resource} className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 font-medium">
                          {getResourceIcon(resource.resource)}
                          {resource.resource}
                        </div>
                        <div className="grid grid-cols-5 gap-2 pl-6">
                          {Object.entries(resource.actions).map(([action, enabled]) => (
                            <div key={action} className="flex items-center gap-2">
                              <Switch
                                checked={enabled}
                                onCheckedChange={(checked) => {
                                  const newMatrix = [...permissionMatrix];
                                  newMatrix[idx].actions[action as keyof typeof resource.actions] = checked;
                                  setPermissionMatrix(newMatrix);
                                }}
                                data-testid={`switch-${resource.resource}-${action}`}
                              />
                              <Label className="text-xs">
                                {action === 'create' && 'Создание'}
                                {action === 'read' && 'Чтение'}
                                {action === 'update' && 'Обновление'}
                                {action === 'delete' && 'Удаление'}
                                {action === 'export' && 'Экспорт'}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  data-testid="button-cancel-create"
                >
                  Отмена
                </Button>
                <Button
                  onClick={() => createRoleMutation.mutate()}
                  disabled={!newRoleName || !newRoleDescription || createRoleMutation.isPending}
                  data-testid="button-confirm-create"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Создать роль
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Assign Role Dialog */}
          <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Назначение роли</DialogTitle>
                <DialogDescription>
                  Выберите пользователя и роль для назначения
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="user-select">Пользователь</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger id="user-select" data-testid="select-user">
                      <SelectValue placeholder="Выберите пользователя" />
                    </SelectTrigger>
                    <SelectContent>
                      {adminUsers?.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-select">Роль</Label>
                  <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                    <SelectTrigger id="role-select" data-testid="select-role">
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles?.map(role => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAssignDialog(false)}
                  data-testid="button-cancel-assign"
                >
                  Отмена
                </Button>
                <Button
                  onClick={() => assignRoleMutation.mutate()}
                  disabled={!selectedUserId || !selectedRoleId || assignRoleMutation.isPending}
                  data-testid="button-confirm-assign"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Назначить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "lodash";
import { 
  Download, 
  Users, 
  Trash2, 
  Shield, 
  Mail, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileText,
  Activity,
  Key,
  MessageSquare,
  Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import UserSearchFilters, { UserSearchFilters as FilterType } from "@/components/UserSearchFilters";
import UserDataTable, { UserData } from "@/components/UserDataTable";
import UserEditModal from "@/components/UserEditModal";
import SubscriptionManager from "@/components/SubscriptionManager";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface SearchResponse {
  success: boolean;
  users: UserData[];
  total: number;
  limit: number;
  offset: number;
}

interface ActivityItem {
  type: string;
  timestamp: string;
  details: string;
  status?: string;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [searchFilters, setSearchFilters] = useState<FilterType>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [managingSubscription, setManagingSubscription] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(50);
  const [realtimeSearch, setRealtimeSearch] = useState("");
  
  // Dialog states
  const [banDialog, setBanDialog] = useState<{ user: UserData | null; ban: boolean }>({ user: null, ban: false });
  const [resetPasswordDialog, setResetPasswordDialog] = useState<UserData | null>(null);
  const [notificationDialog, setNotificationDialog] = useState<UserData | null>(null);
  const [activityDialog, setActivityDialog] = useState<UserData | null>(null);
  const [noteDialog, setNoteDialog] = useState<UserData | null>(null);
  const [roleDialog, setRoleDialog] = useState<UserData | null>(null);
  const [bulkActionDialog, setBulkActionDialog] = useState<string | null>(null);

  // Search users
  const { data: searchData, isLoading: isSearching, refetch } = useQuery<SearchResponse>({
    queryKey: ["/api/admin/users/search", searchFilters, currentPage, realtimeSearch],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/admin/users/search", {
        ...searchFilters,
        text: realtimeSearch || searchFilters.text,
        limit: pageSize,
        offset: currentPage * pageSize,
      });
      return response.json();
    },
  });

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setRealtimeSearch(value);
      setCurrentPage(0);
    }, 300),
    []
  );

  // User activity query
  const { data: activityData, isLoading: isLoadingActivity } = useQuery<{ activities: ActivityItem[] }>({
    queryKey: ["/api/admin/users", activityDialog?.id, "activity"],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/admin/users/${activityDialog?.id}/activity`);
      return response.json();
    },
    enabled: !!activityDialog,
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      const response = await apiRequest('PATCH', `/api/admin/users/${userId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Успешно", description: "Данные пользователя обновлены" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/search"] });
      setEditingUser(null);
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось обновить пользователя", variant: "destructive" });
    },
  });

  // Subscription mutation
  const subscriptionMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      const response = await apiRequest('POST', `/api/admin/users/${userId}/subscription`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Успешно", description: "Подписка обновлена" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/search"] });
      setManagingSubscription(null);
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось обновить подписку", variant: "destructive" });
    },
  });

  // Ban/unban mutation
  const banMutation = useMutation({
    mutationFn: async ({ userId, ban, reason }: { userId: string; ban: boolean; reason?: string }) => {
      const response = await apiRequest('POST', `/api/admin/users/${userId}/ban`, { ban, reason });
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({ 
        title: "Успешно", 
        description: variables.ban ? "Пользователь заблокирован" : "Пользователь разблокирован" 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/search"] });
      setBanDialog({ user: null, ban: false });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось изменить статус блокировки", variant: "destructive" });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest('POST', `/api/admin/users/${userId}/reset-password`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Успешно", description: "Ссылка для сброса пароля отправлена" });
      setResetPasswordDialog(null);
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось сбросить пароль", variant: "destructive" });
    },
  });

  // Send notification mutation
  const notificationMutation = useMutation({
    mutationFn: async ({ userId, title, message, type }: { userId: string; title: string; message: string; type: string }) => {
      const response = await apiRequest('POST', `/api/admin/users/${userId}/notify`, { title, message, type });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Успешно", description: "Уведомление отправлено" });
      setNotificationDialog(null);
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось отправить уведомление", variant: "destructive" });
    },
  });

  // Add note mutation
  const noteMutation = useMutation({
    mutationFn: async ({ userId, note }: { userId: string; note: string }) => {
      const response = await apiRequest('POST', `/api/admin/users/${userId}/notes`, { note });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Успешно", description: "Заметка добавлена" });
      setNoteDialog(null);
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось добавить заметку", variant: "destructive" });
    },
  });

  // Export to CSV
  const handleExport = async () => {
    try {
      const response = await apiRequest('POST', '/api/admin/users/export', searchFilters);
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({ title: "Успешно", description: "Данные экспортированы" });
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось экспортировать данные", variant: "destructive" });
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast({ title: "Ошибка", description: "Выберите пользователей", variant: "destructive" });
      return;
    }

    switch (action) {
      case "delete":
        // Implement bulk delete
        break;
      case "ban":
        // Implement bulk ban
        for (const userId of selectedUsers) {
          await banMutation.mutateAsync({ userId, ban: true, reason: "Массовая блокировка" });
        }
        setSelectedUsers([]);
        break;
      case "notify":
        // Implement bulk notify
        break;
    }
    setBulkActionDialog(null);
  };

  const totalPages = Math.ceil((searchData?.total || 0) / pageSize);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Управление пользователями</h1>
          <p className="text-muted-foreground mt-1">
            Всего пользователей: {searchData?.total || 0}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline" data-testid="button-refresh">
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
          <Button onClick={handleExport} variant="outline" data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            Экспорт CSV
          </Button>
        </div>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры поиска</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Быстрый поиск</Label>
            <Input
              placeholder="Введите email, имя или телефон..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="max-w-md"
              data-testid="input-quick-search"
            />
          </div>
          <UserSearchFilters
            onSearch={(filters) => {
              setSearchFilters(filters);
              setCurrentPage(0);
            }}
            isLoading={isSearching}
          />
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Выбрано: {selectedUsers.length} пользователей
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkActionDialog("notify")}
                  data-testid="button-bulk-notify"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Уведомить
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkActionDialog("ban")}
                  data-testid="button-bulk-ban"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Заблокировать
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setBulkActionDialog("delete")}
                  data-testid="button-bulk-delete"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <UserDataTable
            users={searchData?.users || []}
            selectedUsers={selectedUsers}
            onSelectUser={(userId, selected) => {
              if (selected) {
                setSelectedUsers([...selectedUsers, userId]);
              } else {
                setSelectedUsers(selectedUsers.filter((id) => id !== userId));
              }
            }}
            onSelectAll={(selected) => {
              if (selected) {
                setSelectedUsers(searchData?.users.map((u) => u.id) || []);
              } else {
                setSelectedUsers([]);
              }
            }}
            onEditUser={setEditingUser}
            onManageSubscription={setManagingSubscription}
            onBanUser={(user, ban) => setBanDialog({ user, ban })}
            onResetPassword={setResetPasswordDialog}
            onSendNotification={setNotificationDialog}
            onViewActivity={setActivityDialog}
            onChangeRole={setRoleDialog}
            onAddNote={setNoteDialog}
            isLoading={isSearching}
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Страница {currentPage + 1} из {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="w-4 h-4" />
              Предыдущая
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              data-testid="button-next-page"
            >
              Следующая
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <UserEditModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={(userId, data) => updateUserMutation.mutateAsync({ userId, data })}
        isLoading={updateUserMutation.isPending}
      />

      {/* Subscription Manager */}
      <SubscriptionManager
        user={managingSubscription}
        isOpen={!!managingSubscription}
        onClose={() => setManagingSubscription(null)}
        onUpdate={(userId, data) => subscriptionMutation.mutateAsync({ userId, data })}
        isLoading={subscriptionMutation.isPending}
      />

      {/* Ban/Unban Dialog */}
      <AlertDialog open={!!banDialog.user} onOpenChange={() => setBanDialog({ user: null, ban: false })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {banDialog.ban ? "Заблокировать пользователя?" : "Разблокировать пользователя?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {banDialog.ban
                ? "Пользователь потеряет доступ к своему аккаунту."
                : "Пользователь снова получит доступ к своему аккаунту."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {banDialog.ban && (
            <div className="my-4">
              <Label>Причина блокировки</Label>
              <Textarea
                id="ban-reason"
                placeholder="Укажите причину..."
                className="mt-2"
                data-testid="textarea-ban-reason"
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (banDialog.user) {
                  const reason = banDialog.ban 
                    ? (document.getElementById("ban-reason") as HTMLTextAreaElement)?.value 
                    : undefined;
                  banMutation.mutate({ 
                    userId: banDialog.user.id, 
                    ban: banDialog.ban, 
                    reason 
                  });
                }
              }}
            >
              {banDialog.ban ? "Заблокировать" : "Разблокировать"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <AlertDialog open={!!resetPasswordDialog} onOpenChange={() => setResetPasswordDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Сбросить пароль?</AlertDialogTitle>
            <AlertDialogDescription>
              Пользователю {resetPasswordDialog?.email} будет отправлена ссылка для сброса пароля.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (resetPasswordDialog) {
                  resetPasswordMutation.mutate(resetPasswordDialog.id);
                }
              }}
            >
              Отправить ссылку
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Notification Dialog */}
      <Dialog open={!!notificationDialog} onOpenChange={() => setNotificationDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отправить уведомление</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Получатель</Label>
              <p className="text-sm text-muted-foreground">{notificationDialog?.email}</p>
            </div>
            <div>
              <Label htmlFor="notification-title">Заголовок</Label>
              <Input id="notification-title" placeholder="Введите заголовок..." data-testid="input-notification-title" />
            </div>
            <div>
              <Label htmlFor="notification-message">Сообщение</Label>
              <Textarea 
                id="notification-message" 
                placeholder="Введите сообщение..." 
                rows={4}
                data-testid="textarea-notification-message"
              />
            </div>
            <div>
              <Label htmlFor="notification-type">Тип уведомления</Label>
              <select id="notification-type" className="w-full p-2 border rounded" data-testid="select-notification-type">
                <option value="in_app">В приложении</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotificationDialog(null)}>
              Отмена
            </Button>
            <Button
              onClick={() => {
                if (notificationDialog) {
                  const title = (document.getElementById("notification-title") as HTMLInputElement)?.value;
                  const message = (document.getElementById("notification-message") as HTMLTextAreaElement)?.value;
                  const type = (document.getElementById("notification-type") as HTMLSelectElement)?.value;
                  
                  if (title && message) {
                    notificationMutation.mutate({ 
                      userId: notificationDialog.id, 
                      title, 
                      message, 
                      type 
                    });
                  }
                }
              }}
            >
              Отправить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Activity Dialog */}
      <Dialog open={!!activityDialog} onOpenChange={() => setActivityDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>История активности</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            {isLoadingActivity ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {activityData?.activities.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Нет активности</p>
                ) : (
                  activityData?.activities.map((activity, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{activity.details}</span>
                        </div>
                        {activity.status && (
                          <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(activity.timestamp), "dd.MM.yyyy HH:mm", { locale: ru })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={!!noteDialog} onOpenChange={() => setNoteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить заметку</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Пользователь</Label>
              <p className="text-sm text-muted-foreground">{noteDialog?.email}</p>
            </div>
            <div>
              <Label htmlFor="user-note">Заметка</Label>
              <Textarea 
                id="user-note" 
                placeholder="Введите заметку о пользователе..." 
                rows={4}
                data-testid="textarea-user-note"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialog(null)}>
              Отмена
            </Button>
            <Button
              onClick={() => {
                if (noteDialog) {
                  const note = (document.getElementById("user-note") as HTMLTextAreaElement)?.value;
                  if (note) {
                    noteMutation.mutate({ userId: noteDialog.id, note });
                  }
                }
              }}
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Confirmation */}
      <AlertDialog open={!!bulkActionDialog} onOpenChange={() => setBulkActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердите действие</AlertDialogTitle>
            <AlertDialogDescription>
              Вы собираетесь выполнить массовое действие для {selectedUsers.length} пользователей.
              Это действие может быть необратимым.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={() => bulkActionDialog && handleBulkAction(bulkActionDialog)}>
              Подтвердить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
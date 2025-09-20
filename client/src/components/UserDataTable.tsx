import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  MoreHorizontal,
  Ban,
  ShieldAlert,
  Mail,
  Key,
  Activity,
  CreditCard,
  UserCheck,
  UserX,
  FileText,
} from "lucide-react";

export interface UserData {
  id: string;
  email: string;
  emailVerified?: boolean;
  adminRole?: string;
  createdAt?: Date | string;
  lastLoginAt?: Date | string | null;
  profile?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    phone?: string;
    city?: string;
  };
  subscription?: {
    status?: string;
    planId?: string;
    currentPeriodEnd?: Date | string;
  } | null;
}

interface UserDataTableProps {
  users: UserData[];
  selectedUsers: string[];
  onSelectUser: (userId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEditUser: (user: UserData) => void;
  onManageSubscription: (user: UserData) => void;
  onBanUser: (user: UserData, ban: boolean) => void;
  onResetPassword: (user: UserData) => void;
  onSendNotification: (user: UserData) => void;
  onViewActivity: (user: UserData) => void;
  onChangeRole: (user: UserData) => void;
  onAddNote: (user: UserData) => void;
  isLoading?: boolean;
}

export default function UserDataTable({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onEditUser,
  onManageSubscription,
  onBanUser,
  onResetPassword,
  onSendNotification,
  onViewActivity,
  onChangeRole,
  onAddNote,
  isLoading,
}: UserDataTableProps) {
  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
  const isPartiallySelected = selectedUsers.length > 0 && selectedUsers.length < users.length;

  const getStatusBadge = (user: UserData) => {
    if (user.adminRole === "banned") {
      return <Badge variant="destructive">Заблокирован</Badge>;
    }
    if (user.emailVerified) {
      return <Badge variant="default">Подтвержден</Badge>;
    }
    return <Badge variant="secondary">Не подтвержден</Badge>;
  };

  const getSubscriptionBadge = (subscription: UserData["subscription"]) => {
    if (!subscription) {
      return <Badge variant="outline">Нет подписки</Badge>;
    }
    
    switch (subscription.status) {
      case "active":
        return <Badge variant="default">Активная</Badge>;
      case "expired":
        return <Badge variant="destructive">Истекла</Badge>;
      case "trial":
        return <Badge variant="secondary">Пробная</Badge>;
      default:
        return <Badge variant="outline">Нет подписки</Badge>;
    }
  };

  const getRoleBadge = (adminRole?: string) => {
    switch (adminRole) {
      case "superadmin":
        return <Badge className="bg-purple-600">Супер админ</Badge>;
      case "admin":
        return <Badge className="bg-blue-600">Администратор</Badge>;
      case "premium":
        return <Badge className="bg-green-600">Премиум</Badge>;
      case "banned":
        return <Badge variant="destructive">Заблокирован</Badge>;
      default:
        return <Badge variant="outline">Пользователь</Badge>;
    }
  };

  const formatDate = (date?: Date | string | null) => {
    if (!date) return "—";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "dd.MM.yyyy HH:mm", { locale: ru });
  };

  const getUserName = (user: UserData) => {
    const { profile } = user;
    if (profile?.firstName || profile?.lastName) {
      return `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
    }
    return user.email.split("@")[0];
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                aria-label="Выбрать всех"
                data-testid="checkbox-select-all"
                {...(isPartiallySelected && { indeterminate: true })}
              />
            </TableHead>
            <TableHead>Пользователь</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Подписка</TableHead>
            <TableHead>Дата регистрации</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                Пользователи не найдены
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => onSelectUser(user.id, !!checked)}
                    aria-label={`Выбрать ${getUserName(user)}`}
                    data-testid={`checkbox-user-${user.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{getUserName(user)}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.profile?.phone || "—"}</TableCell>
                <TableCell>{getStatusBadge(user)}</TableCell>
                <TableCell>{getRoleBadge(user.adminRole)}</TableCell>
                <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`button-menu-${user.id}`}>
                        <span className="sr-only">Открыть меню</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEditUser(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onManageSubscription(user)}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Управление подпиской
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onChangeRole(user)}>
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Изменить роль
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewActivity(user)}>
                        <Activity className="mr-2 h-4 w-4" />
                        История активности
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSendNotification(user)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Отправить уведомление
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAddNote(user)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Добавить заметку
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onResetPassword(user)}>
                        <Key className="mr-2 h-4 w-4" />
                        Сбросить пароль
                      </DropdownMenuItem>
                      {user.adminRole === "banned" ? (
                        <DropdownMenuItem onClick={() => onBanUser(user, false)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Разблокировать
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => onBanUser(user, true)}
                          className="text-destructive"
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Заблокировать
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
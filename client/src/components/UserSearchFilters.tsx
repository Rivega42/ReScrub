import { useForm } from "react-hook-form";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface UserSearchFilters {
  text?: string;
  dateFrom?: Date;
  dateTo?: Date;
  subscriptionStatus?: string;
  verificationStatus?: string;
  adminRole?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface UserSearchFiltersProps {
  onSearch: (filters: UserSearchFilters) => void;
  isLoading?: boolean;
}

export default function UserSearchFilters({ onSearch, isLoading }: UserSearchFiltersProps) {
  const form = useForm<UserSearchFilters>({
    defaultValues: {
      text: "",
      subscriptionStatus: "all",
      verificationStatus: "all",
      adminRole: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  });

  const handleSubmit = (data: UserSearchFilters) => {
    // Clean up empty values
    const filters = Object.entries(data).reduce((acc, [key, value]) => {
      if (value && value !== "all") {
        acc[key as keyof UserSearchFilters] = value;
      }
      return acc;
    }, {} as UserSearchFilters);
    
    onSearch(filters);
  };

  const handleReset = () => {
    form.reset();
    onSearch({});
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Text search */}
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Поиск</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder="Email, имя или телефон"
                      className="pl-8"
                      data-testid="input-search-text"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Date range */}
          <FormField
            control={form.control}
            name="dateFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата регистрации с</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        data-testid="button-date-from"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: ru })
                        ) : (
                          <span>Выберите дату</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата регистрации по</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        data-testid="button-date-to"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: ru })
                        ) : (
                          <span>Выберите дату</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          {/* Subscription status */}
          <FormField
            control={form.control}
            name="subscriptionStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Статус подписки</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-subscription-status">
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="active">Активная</SelectItem>
                    <SelectItem value="expired">Истекла</SelectItem>
                    <SelectItem value="trial">Пробная</SelectItem>
                    <SelectItem value="none">Нет подписки</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Verification status */}
          <FormField
            control={form.control}
            name="verificationStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Статус верификации</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-verification-status">
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="verified">Подтвержден</SelectItem>
                    <SelectItem value="unverified">Не подтвержден</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Admin role */}
          <FormField
            control={form.control}
            name="adminRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Роль</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-admin-role">
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="user">Пользователь</SelectItem>
                    <SelectItem value="premium">Премиум</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="superadmin">Супер админ</SelectItem>
                    <SelectItem value="banned">Заблокирован</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Sort options */}
          <FormField
            control={form.control}
            name="sortBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Сортировать по</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-sort-by">
                      <SelectValue placeholder="Выберите поле" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="createdAt">Дата регистрации</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="name">Имя</SelectItem>
                    <SelectItem value="lastLoginAt">Последний вход</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Порядок сортировки</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-sort-order">
                      <SelectValue placeholder="Выберите порядок" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="desc">По убыванию</SelectItem>
                    <SelectItem value="asc">По возрастанию</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading} data-testid="button-search">
            <Search className="w-4 h-4 mr-2" />
            Поиск
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
            data-testid="button-reset"
          >
            <X className="w-4 h-4 mr-2" />
            Сбросить
          </Button>
        </div>
      </form>
    </Form>
  );
}
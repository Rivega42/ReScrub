import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserData } from "./UserDataTable";

const userEditSchema = z.object({
  email: z.string().email("Неверный формат email"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  emailVerified: z.boolean(),
  adminRole: z.string(),
});

type UserEditFormData = z.infer<typeof userEditSchema>;

interface UserEditModalProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, data: Partial<UserEditFormData>) => Promise<void>;
  isLoading?: boolean;
}

export default function UserEditModal({ user, isOpen, onClose, onSave, isLoading }: UserEditModalProps) {
  const form = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      email: user?.email || "",
      firstName: user?.profile?.firstName || "",
      lastName: user?.profile?.lastName || "",
      middleName: user?.profile?.middleName || "",
      phone: user?.profile?.phone || "",
      city: user?.profile?.city || "",
      emailVerified: user?.emailVerified || false,
      adminRole: user?.adminRole || "user",
    },
  });

  // Reset form when user changes
  if (user) {
    form.reset({
      email: user.email,
      firstName: user.profile?.firstName || "",
      lastName: user.profile?.lastName || "",
      middleName: user.profile?.middleName || "",
      phone: user.profile?.phone || "",
      city: user.profile?.city || "",
      emailVerified: user.emailVerified || false,
      adminRole: user.adminRole || "user",
    });
  }

  const handleSubmit = async (data: UserEditFormData) => {
    if (!user) return;
    
    try {
      await onSave(user.id, data);
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Редактирование пользователя</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Введите имя" data-testid="input-first-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фамилия</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Введите фамилию" data-testid="input-last-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отчество</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Введите отчество" data-testid="input-middle-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="user@example.com" data-testid="input-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+7 (999) 123-45-67" data-testid="input-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Город</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Введите город" data-testid="input-city" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="emailVerified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email подтвержден</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-email-verified"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="adminRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Роль пользователя</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-admin-role">
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">Пользователь</SelectItem>
                      <SelectItem value="premium">Премиум</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                      <SelectItem value="superadmin">Супер администратор</SelectItem>
                      <SelectItem value="banned">Заблокирован</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                data-testid="button-cancel"
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading} data-testid="button-save">
                {isLoading ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, Gift, Ban, Clock } from "lucide-react";
import { UserData } from "./UserDataTable";

const subscriptionSchema = z.object({
  action: z.enum(["change_plan", "extend", "cancel", "add_free_months"]),
  planId: z.string().optional(),
  months: z.number().min(1).max(12).optional(),
  reason: z.string().optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionManagerProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (userId: string, data: SubscriptionFormData) => Promise<void>;
  isLoading?: boolean;
}

const plans = [
  { id: "basic", name: "Базовый", price: 990, features: ["10 сканирований", "Базовая защита"] },
  { id: "pro", name: "Профессиональный", price: 1990, features: ["50 сканирований", "Расширенная защита", "Приоритетная поддержка"] },
  { id: "enterprise", name: "Корпоративный", price: 4990, features: ["Неограниченные сканирования", "Максимальная защита", "VIP поддержка", "API доступ"] },
];

export default function SubscriptionManager({ user, isOpen, onClose, onUpdate, isLoading }: SubscriptionManagerProps) {
  const [selectedAction, setSelectedAction] = useState<"change_plan" | "extend" | "cancel" | "add_free_months">("change_plan");
  
  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      action: "change_plan",
      planId: user?.subscription?.planId || "basic",
      months: 1,
      reason: "",
    },
  });

  const handleSubmit = async (data: SubscriptionFormData) => {
    if (!user) return;
    
    try {
      await onUpdate(user.id, { ...data, action: selectedAction });
      onClose();
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  if (!user) return null;

  const currentPlan = plans.find(p => p.id === user.subscription?.planId);
  const subscriptionEndDate = user.subscription?.currentPeriodEnd
    ? format(new Date(user.subscription.currentPeriodEnd), "dd MMMM yyyy", { locale: ru })
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Управление подпиской</DialogTitle>
          <DialogDescription>
            Пользователь: {user.email}
          </DialogDescription>
        </DialogHeader>
        
        {user.subscription && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Текущая подписка</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">План:</span>
                <Badge>{currentPlan?.name || "Неизвестный"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Статус:</span>
                <Badge variant={user.subscription.status === "active" ? "default" : "secondary"}>
                  {user.subscription.status === "active" ? "Активна" : "Неактивна"}
                </Badge>
              </div>
              {subscriptionEndDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Действует до:</span>
                  <span className="text-sm font-medium">{subscriptionEndDate}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs value={selectedAction} onValueChange={(v) => setSelectedAction(v as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="change_plan" className="text-xs">
              <CreditCard className="w-3 h-3 mr-1" />
              План
            </TabsTrigger>
            <TabsTrigger value="extend" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Продлить
            </TabsTrigger>
            <TabsTrigger value="add_free_months" className="text-xs">
              <Gift className="w-3 h-3 mr-1" />
              Бесплатно
            </TabsTrigger>
            <TabsTrigger value="cancel" className="text-xs">
              <Ban className="w-3 h-3 mr-1" />
              Отменить
            </TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
              <TabsContent value="change_plan" className="space-y-4">
                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Выберите новый план</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          {plans.map((plan) => (
                            <div key={plan.id} className="flex items-center space-x-3 border rounded-lg p-4">
                              <RadioGroupItem value={plan.id} id={plan.id} />
                              <label
                                htmlFor={plan.id}
                                className="flex-1 cursor-pointer"
                              >
                                <div className="font-medium">{plan.name}</div>
                                <div className="text-sm text-muted-foreground">{plan.price} ₽/мес</div>
                                <ul className="text-xs text-muted-foreground mt-1">
                                  {plan.features.map((feature, i) => (
                                    <li key={i}>• {feature}</li>
                                  ))}
                                </ul>
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="extend" className="space-y-4">
                <FormField
                  control={form.control}
                  name="months"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Количество месяцев для продления</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-months-extend"
                        />
                      </FormControl>
                      <FormDescription>
                        Подписка будет продлена на указанное количество месяцев
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Причина продления</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Укажите причину продления (опционально)"
                          data-testid="textarea-reason-extend"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="add_free_months" className="space-y-4">
                <FormField
                  control={form.control}
                  name="months"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Количество бесплатных месяцев</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-months-free"
                        />
                      </FormControl>
                      <FormDescription>
                        Бесплатные месяцы будут добавлены к текущей подписке
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Причина предоставления бесплатных месяцев *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Укажите причину (обязательно)"
                          required
                          data-testid="textarea-reason-free"
                        />
                      </FormControl>
                      <FormDescription>
                        Эта информация будет сохранена в истории изменений
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="cancel" className="space-y-4">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <div className="flex">
                    <Ban className="h-4 w-4 text-destructive mt-0.5 mr-2" />
                    <div className="text-sm">
                      <p className="font-medium text-destructive">Внимание!</p>
                      <p className="text-muted-foreground mt-1">
                        Отмена подписки немедленно прекратит доступ пользователя к платным функциям.
                        Это действие может быть отменено путем повторной активации подписки.
                      </p>
                    </div>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Причина отмены *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Укажите причину отмены подписки"
                          required
                          data-testid="textarea-reason-cancel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
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
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant={selectedAction === "cancel" ? "destructive" : "default"}
                  data-testid="button-submit"
                >
                  {isLoading ? "Обработка..." : 
                    selectedAction === "change_plan" ? "Изменить план" :
                    selectedAction === "extend" ? "Продлить" :
                    selectedAction === "add_free_months" ? "Добавить месяцы" :
                    "Отменить подписку"
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X, Save, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { DataBroker } from '@shared/schema';

const formSchema = z.object({
  name: z.string().min(1, 'Название компании обязательно'),
  legalName: z.string().optional(),
  category: z.string().min(1, 'Категория обязательна'),
  description: z.string().optional(),
  website: z.string().url('Некорректный URL').optional().or(z.literal('')),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  privacyPolicyUrl: z.string().url('Некорректный URL').optional().or(z.literal('')),
  removalInstructions: z.string().optional(),
  removalUrl: z.string().url('Некорректный URL').optional().or(z.literal('')),
  responseTime: z.string().optional(),
  requiredDocuments: z.array(z.string()).optional(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard', 'very_hard']),
  isActive: z.boolean(),
  automatedRemoval: z.boolean(),
  apiCredentials: z.object({
    apiKey: z.string().optional(),
    apiSecret: z.string().optional(),
    apiEndpoint: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
  warnings: z.string().optional(),
  regulatorNumber: z.string().optional(),
  lastVerifiedAt: z.date().optional(),
  tags: z.array(z.string()).optional(),
  successRate: z.number().min(0).max(100).optional(),
  averageProcessingDays: z.number().min(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

const CATEGORIES = [
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

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Легко', color: 'bg-green-500' },
  { value: 'medium', label: 'Средне', color: 'bg-yellow-500' },
  { value: 'hard', label: 'Сложно', color: 'bg-orange-500' },
  { value: 'very_hard', label: 'Очень сложно', color: 'bg-red-500' },
];

const RESPONSE_TIMES = [
  { value: '1-3_days', label: '1-3 дня' },
  { value: 'week', label: 'Неделя' },
  { value: '2_weeks', label: '2 недели' },
  { value: 'month', label: 'Месяц' },
  { value: '2_months', label: '2 месяца' },
  { value: 'no_response', label: 'Не отвечают' },
];

interface DataBrokerFormProps {
  broker?: DataBroker;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel?: () => void;
}

export default function DataBrokerForm({ broker, onSubmit, onCancel }: DataBrokerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDocument, setNewDocument] = useState('');
  const [newTag, setNewTag] = useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: broker?.name || '',
      legalName: broker?.legalName || '',
      category: broker?.category || '',
      description: broker?.description || '',
      website: broker?.website || '',
      email: broker?.email || '',
      phone: broker?.phone || '',
      address: broker?.address || '',
      privacyPolicyUrl: broker?.privacyPolicyUrl || '',
      removalInstructions: broker?.removalInstructions || '',
      removalUrl: broker?.removalUrl || '',
      responseTime: broker?.responseTime || '',
      requiredDocuments: broker?.requiredDocuments || [],
      difficultyLevel: broker?.difficultyLevel || 'medium',
      isActive: broker?.isActive ?? true,
      automatedRemoval: broker?.automatedRemoval || false,
      apiCredentials: broker?.apiCredentials || {},
      notes: broker?.notes || '',
      warnings: broker?.warnings || '',
      regulatorNumber: broker?.regulatorNumber || '',
      lastVerifiedAt: broker?.lastVerifiedAt ? new Date(broker.lastVerifiedAt) : undefined,
      tags: broker?.tags || [],
      successRate: broker?.successRate,
      averageProcessingDays: broker?.averageProcessingDays,
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDocument = () => {
    if (newDocument.trim()) {
      const currentDocs = form.getValues('requiredDocuments') || [];
      form.setValue('requiredDocuments', [...currentDocs, newDocument.trim()]);
      setNewDocument('');
    }
  };

  const removeDocument = (index: number) => {
    const currentDocs = form.getValues('requiredDocuments') || [];
    form.setValue('requiredDocuments', currentDocs.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim()) {
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', [...currentTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Основное</TabsTrigger>
            <TabsTrigger value="removal">Удаление данных</TabsTrigger>
            <TabsTrigger value="automation">Автоматизация</TabsTrigger>
            <TabsTrigger value="metadata">Метаданные</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
                <CardDescription>
                  Базовые данные об операторе персональных данных
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название компании *</FormLabel>
                        <FormControl>
                          <Input placeholder="ПАО Сбербанк" {...field} data-testid="input-broker-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="legalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Юридическое название</FormLabel>
                        <FormControl>
                          <Input placeholder="Публичное акционерное общество..." {...field} data-testid="input-broker-legal-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Категория *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-broker-category">
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Краткое описание деятельности компании..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-broker-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Веб-сайт</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} data-testid="input-broker-website" />
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
                        <FormLabel>Email для запросов</FormLabel>
                        <FormControl>
                          <Input placeholder="privacy@example.com" {...field} data-testid="input-broker-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <Input placeholder="+7 (495) 123-45-67" {...field} data-testid="input-broker-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="regulatorNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Регистрационный номер</FormLabel>
                        <FormControl>
                          <Input placeholder="77-12-345678" {...field} data-testid="input-broker-regulator" />
                        </FormControl>
                        <FormDescription>
                          Номер в реестре Роскомнадзора
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Адрес</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Юридический адрес компании..."
                          {...field}
                          data-testid="textarea-broker-address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-broker-active"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Активный оператор
                        </FormLabel>
                        <FormDescription>
                          Отображать в списке доступных операторов для удаления данных
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="removal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Процесс удаления данных</CardTitle>
                <CardDescription>
                  Информация о процедуре удаления персональных данных
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="privacyPolicyUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL политики конфиденциальности</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/privacy" {...field} data-testid="input-broker-privacy-url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="removalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL страницы удаления данных</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/delete-data" {...field} data-testid="input-broker-removal-url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficultyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Уровень сложности *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-broker-difficulty">
                            <SelectValue placeholder="Выберите уровень сложности" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DIFFICULTY_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <div className="flex items-center gap-2">
                                <div className={cn('w-2 h-2 rounded-full', level.color)} />
                                {level.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="responseTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Время ответа</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-broker-response-time">
                              <SelectValue placeholder="Выберите время ответа" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RESPONSE_TIMES.map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="averageProcessingDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Среднее время обработки (дни)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="14"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-broker-processing-days"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="removalInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Инструкция по удалению</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Пошаговая инструкция по удалению персональных данных..."
                          className="min-h-[200px]"
                          {...field}
                          data-testid="textarea-broker-instructions"
                        />
                      </FormControl>
                      <FormDescription>
                        Детальное описание процесса удаления данных
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Требуемые документы</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newDocument}
                      onChange={(e) => setNewDocument(e.target.value)}
                      placeholder="Паспорт, СНИЛС..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                      data-testid="input-new-document"
                    />
                    <Button
                      type="button"
                      onClick={addDocument}
                      size="icon"
                      variant="outline"
                      data-testid="button-add-document"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch('requiredDocuments')?.map((doc, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {doc}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeDocument(index)}
                          data-testid={`button-remove-document-${index}`}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="successRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Процент успешных удалений (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="85"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-broker-success-rate"
                        />
                      </FormControl>
                      <FormDescription>
                        Статистика успешных запросов на удаление
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Автоматизация</CardTitle>
                <CardDescription>
                  Настройки для автоматического удаления данных
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="automatedRemoval"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-broker-automated"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Поддержка автоматического удаления
                        </FormLabel>
                        <FormDescription>
                          Оператор предоставляет API для автоматического удаления данных
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch('automatedRemoval') && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium">API Credentials</h4>
                    <FormField
                      control={form.control}
                      name="apiCredentials.apiEndpoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Endpoint</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://api.example.com/delete"
                              {...field}
                              data-testid="input-api-endpoint"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="apiCredentials.apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="sk-..."
                              {...field}
                              data-testid="input-api-key"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="apiCredentials.apiSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Secret</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Secret key..."
                              {...field}
                              data-testid="input-api-secret"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Заметки</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Дополнительные заметки для внутреннего использования..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-broker-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warnings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          Предупреждения
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Важные предупреждения для пользователей..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-broker-warnings"
                        />
                      </FormControl>
                      <FormDescription>
                        Предупреждения, которые увидят пользователи
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Метаданные</CardTitle>
                <CardDescription>
                  Дополнительная информация и теги
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="lastVerifiedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дата последней проверки</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              data-testid="button-broker-verified-date"
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ru })
                              ) : (
                                <span>Выберите дату</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("2020-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Теги</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Добавить тег..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      data-testid="input-new-tag"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      size="icon"
                      variant="outline"
                      data-testid="button-add-tag"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch('tags')?.map((tag, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(index)}
                          data-testid={`button-remove-tag-${index}`}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {broker && (
                  <div className="pt-4 space-y-2 text-sm text-muted-foreground border-t">
                    <p>ID: {broker.id}</p>
                    <p>Создан: {format(new Date(broker.createdAt), "PPP", { locale: ru })}</p>
                    {broker.updatedAt && (
                      <p>Изменен: {format(new Date(broker.updatedAt), "PPP", { locale: ru })}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              data-testid="button-cancel"
            >
              Отмена
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            data-testid="button-submit"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Сохранение...' : broker ? 'Обновить' : 'Создать'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
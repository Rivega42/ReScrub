import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Search, 
  Building2, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Mail,
  FileText,
  Globe,
  Send,
  Eye,
  Settings
} from 'lucide-react';

interface DataBroker {
  id: string;
  name: string;
  legalName?: string;
  category: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  privacyPolicyUrl?: string;
  removalInstructions?: string;
  isActive: boolean;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  responseTime?: string;
  tags?: string[];
}

// Form schemas
const brokerSelectionSchema = z.object({
  brokerId: z.string().min(1, 'Выберите организацию'),
  brokerName: z.string().min(1, 'Название организации обязательно'),
});

const requestDetailsSchema = z.object({
  requestType: z.enum(['deletion', 'correction', 'access'], {
    errorMap: () => ({ message: 'Выберите тип запроса' })
  }),
  requestMethod: z.enum(['email', 'form', 'api', 'postal'], {
    errorMap: () => ({ message: 'Выберите способ отправки' })
  }),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов').max(1000, 'Максимум 1000 символов'),
  personalData: z.string().min(5, 'Укажите какие данные нужно удалить').max(500, 'Максимум 500 символов'),
});

type BrokerSelectionData = z.infer<typeof brokerSelectionSchema>;
type RequestDetailsData = z.infer<typeof requestDetailsSchema>;

// Difficulty badge component
function DifficultyBadge({ difficulty }: { difficulty: DataBroker['difficultyLevel'] }) {
  const difficultyConfig = {
    easy: { label: 'Легко', variant: 'default' as const, color: 'text-green-600' },
    medium: { label: 'Средне', variant: 'secondary' as const, color: 'text-yellow-600' },
    hard: { label: 'Сложно', variant: 'destructive' as const, color: 'text-red-600' },
  };

  const config = difficultyConfig[difficulty];

  return (
    <Badge variant={config.variant} className={config.color}>
      {config.label}
    </Badge>
  );
}

// Category display component
function CategoryBadge({ category }: { category: string }) {
  const categoryConfig: { [key: string]: string } = {
    'банк': 'Банк',
    'телеком': 'Телеком',
    'ритейл': 'Ритейл',
    'недвижимость': 'Недвижимость',
    'государственный': 'Государственный',
    'другое': 'Другое',
  };

  return (
    <Badge variant="outline">
      {categoryConfig[category] || category}
    </Badge>
  );
}

// Step 1: Data Broker Selection
function BrokerSelectionStep({ 
  onNext, 
  selectedBroker, 
  onBrokerSelect 
}: { 
  onNext: (data: BrokerSelectionData) => void;
  selectedBroker: DataBroker | null;
  onBrokerSelect: (broker: DataBroker) => void;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const brokerForm = useForm<BrokerSelectionData>({
    resolver: zodResolver(brokerSelectionSchema),
    defaultValues: {
      brokerId: selectedBroker?.id || '',
      brokerName: selectedBroker?.name || '',
    }
  });

  // Fetch data brokers with filters
  const { data: dataBrokers = [], isLoading, error } = useQuery<DataBroker[]>({
    queryKey: ['/api/data-brokers', { search, category, difficulty }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'all') params.append('category', category);
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      
      const response = await fetch(`/api/data-brokers?${params}`);
      if (!response.ok) throw new Error('Failed to fetch data brokers');
      return response.json();
    }
  });

  const handleBrokerClick = (broker: DataBroker) => {
    onBrokerSelect(broker);
    brokerForm.setValue('brokerId', broker.id);
    brokerForm.setValue('brokerName', broker.name);
  };

  const handleNext = (data: BrokerSelectionData) => {
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Выбор организации
          </CardTitle>
          <CardDescription>
            Выберите организацию, в которой нужно удалить ваши данные
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters - Mobile Optimized */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
            <div>
              <Label htmlFor="search">Поиск по названию</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Поиск организации..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="input-broker-search"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category">Категория</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-broker-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="банк">Банки</SelectItem>
                  <SelectItem value="телеком">Телеком</SelectItem>
                  <SelectItem value="ритейл">Ритейл</SelectItem>
                  <SelectItem value="недвижимость">Недвижимость</SelectItem>
                  <SelectItem value="государственный">Государственные</SelectItem>
                  <SelectItem value="другое">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="difficulty">Сложность</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger data-testid="select-broker-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Любая сложность</SelectItem>
                  <SelectItem value="easy">Легко</SelectItem>
                  <SelectItem value="medium">Средне</SelectItem>
                  <SelectItem value="hard">Сложно</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data Brokers List - Responsive */}
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
              <p>Ошибка загрузки организаций</p>
            </div>
          ) : dataBrokers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4" />
              <p>Организации не найдены</p>
            </div>
          ) : (
            <>
              {/* Desktop: Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Организация</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Сложность</TableHead>
                      <TableHead>Время ответа</TableHead>
                      <TableHead>Действие</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataBrokers.map((broker) => (
                      <TableRow 
                        key={broker.id} 
                        className={`cursor-pointer hover:bg-muted/50 ${selectedBroker?.id === broker.id ? 'bg-blue-50 dark:bg-blue-950' : ''}`}
                        onClick={() => handleBrokerClick(broker)}
                        data-testid={`broker-row-${broker.id}`}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{broker.name}</p>
                            {broker.legalName && broker.legalName !== broker.name && (
                              <p className="text-sm text-muted-foreground">{broker.legalName}</p>
                            )}
                            {broker.description && (
                              <p className="text-sm text-muted-foreground">{broker.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <CategoryBadge category={broker.category} />
                        </TableCell>
                        <TableCell>
                          <DifficultyBadge difficulty={broker.difficultyLevel} />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {broker.responseTime || 'Не указано'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant={selectedBroker?.id === broker.id ? "default" : "outline"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBrokerClick(broker);
                            }}
                            data-testid={`button-select-broker-${broker.id}`}
                          >
                            {selectedBroker?.id === broker.id ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Выбрано
                              </>
                            ) : (
                              'Выбрать'
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: Card List */}
              <div className="md:hidden space-y-3">
                {dataBrokers.map((broker) => (
                  <Card 
                    key={broker.id}
                    className={`cursor-pointer hover-elevate transition-colors ${
                      selectedBroker?.id === broker.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => handleBrokerClick(broker)}
                    data-testid={`broker-card-${broker.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-base leading-tight" data-testid={`text-broker-name-${broker.id}`}>
                              {broker.name}
                            </h3>
                            {broker.legalName && broker.legalName !== broker.name && (
                              <p className="text-sm text-muted-foreground mt-1">{broker.legalName}</p>
                            )}
                          </div>
                          <Button 
                            size="sm"
                            variant={selectedBroker?.id === broker.id ? "default" : "outline"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBrokerClick(broker);
                            }}
                            data-testid={`button-select-broker-mobile-${broker.id}`}
                            className="touch-target shrink-0"
                          >
                            {selectedBroker?.id === broker.id ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Выбрано
                              </>
                            ) : (
                              'Выбрать'
                            )}
                          </Button>
                        </div>

                        {/* Description */}
                        {broker.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {broker.description}
                          </p>
                        )}

                        {/* Badges and Info */}
                        <div className="flex flex-wrap items-center gap-2">
                          <CategoryBadge category={broker.category} />
                          <DifficultyBadge difficulty={broker.difficultyLevel} />
                          {broker.responseTime && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {broker.responseTime}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Selected Broker Details */}
      {selectedBroker && (
        <Card>
          <CardHeader>
            <CardTitle>Выбранная организация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Название</Label>
                <p className="font-medium">{selectedBroker.name}</p>
              </div>
              {selectedBroker.website && (
                <div>
                  <Label>Веб-сайт</Label>
                  <a 
                    href={selectedBroker.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    {selectedBroker.website}
                  </a>
                </div>
              )}
              {selectedBroker.email && (
                <div>
                  <Label>Email для обращений</Label>
                  <p className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {selectedBroker.email}
                  </p>
                </div>
              )}
              {selectedBroker.removalInstructions && (
                <div className="md:col-span-2">
                  <Label>Инструкции по удалению</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedBroker.removalInstructions}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <form onSubmit={brokerForm.handleSubmit(handleNext)}>
          <Button 
            type="submit" 
            size="lg"
            className="w-full sm:w-auto touch-target"
            disabled={!selectedBroker} 
            data-testid="button-next-step"
          >
            Далее
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
}

// Step 2: Request Details
function RequestDetailsStep({ 
  onNext, 
  onBack, 
  selectedBroker 
}: { 
  onNext: (data: RequestDetailsData) => void;
  onBack: () => void;
  selectedBroker: DataBroker | null;
}) {
  const detailsForm = useForm<RequestDetailsData>({
    resolver: zodResolver(requestDetailsSchema),
    defaultValues: {
      requestType: 'deletion',
      requestMethod: 'email',
      description: '',
      personalData: '',
    }
  });

  const requestType = detailsForm.watch('requestType');
  const requestMethod = detailsForm.watch('requestMethod');

  const requestTypeOptions = [
    { value: 'deletion', label: 'Удаление данных', icon: Settings, description: 'Полное удаление ваших персональных данных' },
    { value: 'correction', label: 'Исправление данных', icon: FileText, description: 'Исправление неточных или устаревших данных' },
    { value: 'access', label: 'Доступ к данным', icon: Eye, description: 'Получение информации о хранящихся данных' },
  ];

  const requestMethodOptions = [
    { value: 'email', label: 'Email', icon: Mail, description: 'Отправка запроса по электронной почте' },
    { value: 'form', label: 'Веб-форма', icon: Globe, description: 'Заполнение формы на сайте организации' },
    { value: 'postal', label: 'Почта России', icon: Send, description: 'Отправка заказного письма' },
    { value: 'api', label: 'API', icon: Settings, description: 'Автоматический запрос через API' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Детали запроса</CardTitle>
          <CardDescription>
            Укажите тип запроса и способ обращения к организации
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={detailsForm.handleSubmit(onNext)} className="space-y-6">
            {/* Selected Broker Summary */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">Организация:</span>
                <span>{selectedBroker?.name}</span>
              </div>
              <div className="flex gap-2">
                <CategoryBadge category={selectedBroker?.category || ''} />
                <DifficultyBadge difficulty={selectedBroker?.difficultyLevel || 'medium'} />
              </div>
            </div>

            {/* Request Type Selection */}
            <div className="space-y-3">
              <Label>Тип запроса *</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {requestTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        requestType === option.value ? 'border-primary bg-primary/5' : 'border-muted'
                      }`}
                      onClick={() => detailsForm.setValue('requestType', option.value as any)}
                      data-testid={`request-type-${option.value}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {detailsForm.formState.errors.requestType && (
                <p className="text-sm text-destructive">
                  {detailsForm.formState.errors.requestType.message}
                </p>
              )}
            </div>

            {/* Request Method Selection */}
            <div className="space-y-3">
              <Label>Способ отправки *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requestMethodOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        requestMethod === option.value ? 'border-primary bg-primary/5' : 'border-muted'
                      }`}
                      onClick={() => detailsForm.setValue('requestMethod', option.value as any)}
                      data-testid={`request-method-${option.value}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {detailsForm.formState.errors.requestMethod && (
                <p className="text-sm text-destructive">
                  {detailsForm.formState.errors.requestMethod.message}
                </p>
              )}
            </div>

            {/* Personal Data Description */}
            <div className="space-y-2">
              <Label htmlFor="personalData">Какие данные нужно {requestType === 'deletion' ? 'удалить' : requestType === 'correction' ? 'исправить' : 'получить'} *</Label>
              <Textarea
                id="personalData"
                {...detailsForm.register('personalData')}
                placeholder="Например: ФИО, номер телефона, адрес электронной почты, история покупок..."
                data-testid="textarea-personal-data"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Укажите конкретные данные для более эффективной обработки запроса
              </p>
              {detailsForm.formState.errors.personalData && (
                <p className="text-sm text-destructive">
                  {detailsForm.formState.errors.personalData.message}
                </p>
              )}
            </div>

            {/* Additional Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Дополнительная информация *</Label>
              <Textarea
                id="description"
                {...detailsForm.register('description')}
                placeholder="Опишите причину запроса, дополнительные обстоятельства..."
                data-testid="textarea-description"
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Подробное описание поможет организации быстрее обработать ваш запрос
              </p>
              {detailsForm.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {detailsForm.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Navigation Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto touch-target order-2 sm:order-1"
                onClick={onBack} 
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <Button 
                type="submit" 
                size="lg"
                className="w-full sm:w-auto touch-target order-1 sm:order-2"
                data-testid="button-review"
              >
                Просмотр запроса
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Step 3: Review and Submit
function ReviewStep({ 
  onSubmit, 
  onBack, 
  selectedBroker, 
  requestData, 
  isSubmitting 
}: { 
  onSubmit: () => void;
  onBack: () => void;
  selectedBroker: DataBroker | null;
  requestData: RequestDetailsData | null;
  isSubmitting: boolean;
}) {
  const requestTypeLabels = {
    deletion: 'Удаление данных',
    correction: 'Исправление данных',
    access: 'Доступ к данным',
  };

  const requestMethodLabels = {
    email: 'Email',
    form: 'Веб-форма',
    postal: 'Почта России',
    api: 'API',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Проверьте данные запроса
          </CardTitle>
          <CardDescription>
            Убедитесь, что все данные указаны верно, перед отправкой запроса
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Organization Details */}
          <div>
            <h4 className="font-medium mb-3">Организация</h4>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{selectedBroker?.name}</span>
              </div>
              {selectedBroker?.legalName && selectedBroker.legalName !== selectedBroker.name && (
                <p className="text-sm text-muted-foreground">{selectedBroker.legalName}</p>
              )}
              <div className="flex gap-2 mt-2">
                <CategoryBadge category={selectedBroker?.category || ''} />
                <DifficultyBadge difficulty={selectedBroker?.difficultyLevel || 'medium'} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Request Details */}
          <div>
            <h4 className="font-medium mb-3">Детали запроса</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Тип запроса</Label>
                <p className="font-medium">
                  {requestData ? requestTypeLabels[requestData.requestType] : '-'}
                </p>
              </div>
              <div>
                <Label>Способ отправки</Label>
                <p className="font-medium">
                  {requestData ? requestMethodLabels[requestData.requestMethod] : '-'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Description */}
          <div>
            <h4 className="font-medium mb-3">Данные для обработки</h4>
            <div className="space-y-4">
              <div>
                <Label>Персональные данные</Label>
                <div className="p-3 bg-muted rounded text-sm">
                  {requestData?.personalData || '-'}
                </div>
              </div>
              <div>
                <Label>Дополнительная информация</Label>
                <div className="p-3 bg-muted rounded text-sm">
                  {requestData?.description || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Важная информация
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  После отправки запроса его нельзя будет отменить. Организация получит ваш запрос и 
                  начнет его обработку согласно требованиям ФЗ-152 «О персональных данных».
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button 
          variant="outline" 
          size="lg"
          className="w-full sm:w-auto touch-target order-2 sm:order-1"
          onClick={onBack} 
          disabled={isSubmitting} 
          data-testid="button-back-review"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <Button 
          size="lg"
          className="w-full sm:w-auto touch-target bg-green-600 hover:bg-green-700 order-1 sm:order-2"
          onClick={onSubmit} 
          disabled={isSubmitting}
          data-testid="button-submit-request"
        >
          {isSubmitting ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Отправка...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Отправить запрос
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Main CreateRequest component
export default function CreateRequest() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBroker, setSelectedBroker] = useState<DataBroker | null>(null);
  const [brokerData, setBrokerData] = useState<BrokerSelectionData | null>(null);
  const [requestData, setRequestData] = useState<RequestDetailsData | null>(null);
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/deletion-requests', data);
    },
    onSuccess: () => {
      toast({
        title: "Запрос отправлен",
        description: "Ваш запрос на удаление данных успешно отправлен и находится в обработке",
      });
      setLocation('/app/requests');
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка отправки",
        description: error.message || "Не удалось отправить запрос",
        variant: "destructive",
      });
    },
  });

  const handleBrokerSelection = (data: BrokerSelectionData) => {
    setBrokerData(data);
    setCurrentStep(2);
  };

  const handleRequestDetails = (data: RequestDetailsData) => {
    setRequestData(data);
    setCurrentStep(3);
  };

  const handleSubmit = () => {
    if (!brokerData || !requestData || !selectedBroker) {
      toast({
        title: "Ошибка",
        description: "Не все данные заполнены",
        variant: "destructive",
      });
      return;
    }

    const requestPayload = {
      brokerName: brokerData.brokerName,
      requestType: requestData.requestType,
      requestMethod: requestData.requestMethod,
      requestDetails: {
        personalData: requestData.personalData,
        description: requestData.description,
        brokerId: brokerData.brokerId,
        brokerInfo: {
          name: selectedBroker.name,
          category: selectedBroker.category,
          difficulty: selectedBroker.difficultyLevel,
          website: selectedBroker.website,
          email: selectedBroker.email,
        }
      }
    };

    submitMutation.mutate(requestPayload);
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" data-testid="title-create-request">
          Создать запрос на удаление данных
        </h1>
        <p className="text-muted-foreground">
          Пошаговая форма для создания запроса на удаление ваших персональных данных
        </p>
      </div>

      {/* Step Indicator - Mobile Optimized */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-center space-x-4 sm:space-x-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm font-medium ${
                  currentStep === step
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > step
                    ? 'bg-green-600 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step
                )}
              </div>
              <span className={`ml-2 text-sm ${
                currentStep >= step ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step === 1 && 'Выбор организации'}
                {step === 2 && 'Детали запроса'}
                {step === 3 && 'Подтверждение'}
              </span>
              {step < 3 && (
                <div className={`w-16 h-px mx-4 ${
                  currentStep > step ? 'bg-green-600' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <BrokerSelectionStep
          onNext={handleBrokerSelection}
          selectedBroker={selectedBroker}
          onBrokerSelect={setSelectedBroker}
        />
      )}

      {currentStep === 2 && (
        <RequestDetailsStep
          onNext={handleRequestDetails}
          onBack={() => setCurrentStep(1)}
          selectedBroker={selectedBroker}
        />
      )}

      {currentStep === 3 && (
        <ReviewStep
          onSubmit={handleSubmit}
          onBack={() => setCurrentStep(2)}
          selectedBroker={selectedBroker}
          requestData={requestData}
          isSubmitting={submitMutation.isPending}
        />
      )}
    </div>
  );
}
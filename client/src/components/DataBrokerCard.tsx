import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Building,
  Globe,
  Mail,
  Phone,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Link,
  Calendar,
  TrendingUp,
  Bot,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { DataBroker } from '@shared/schema';

interface DataBrokerCardProps {
  broker: DataBroker;
  onEdit?: (broker: DataBroker) => void;
  onDelete?: (id: string) => void;
  onVerify?: (id: string) => void;
  onTestAutomation?: (id: string) => void;
}

const DIFFICULTY_CONFIG = {
  easy: { label: 'Легко', color: 'bg-green-500', textColor: 'text-green-700 dark:text-green-300' },
  medium: { label: 'Средне', color: 'bg-yellow-500', textColor: 'text-yellow-700 dark:text-yellow-300' },
  hard: { label: 'Сложно', color: 'bg-orange-500', textColor: 'text-orange-700 dark:text-orange-300' },
  very_hard: { label: 'Очень сложно', color: 'bg-red-500', textColor: 'text-red-700 dark:text-red-300' },
};

const CATEGORY_LABELS: Record<string, string> = {
  banks: 'Банки',
  telecom: 'Телеком',
  retail: 'Ритейл',
  insurance: 'Страхование',
  government: 'Государственные',
  healthcare: 'Здравоохранение',
  education: 'Образование',
  realestate: 'Недвижимость',
  transport: 'Транспорт',
  social: 'Социальные сети',
  other: 'Другое',
};

export default function DataBrokerCard({
  broker,
  onEdit,
  onDelete,
  onVerify,
  onTestAutomation,
}: DataBrokerCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  const difficulty = DIFFICULTY_CONFIG[broker.difficultyLevel] || DIFFICULTY_CONFIG.medium;
  const categoryLabel = CATEGORY_LABELS[broker.category] || broker.category;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: `${label} скопирован в буфер обмена`,
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(broker.id);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Card className={cn(
        "transition-all duration-200",
        !broker.isActive && "opacity-60"
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {broker.name}
                {broker.automatedRemoval && (
                  <Bot className="h-4 w-4 text-blue-500" title="Автоматизировано" />
                )}
              </CardTitle>
              {broker.legalName && (
                <CardDescription className="text-sm mt-1">
                  {broker.legalName}
                </CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid={`button-broker-menu-${broker.id}`}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Подробности
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(broker)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Редактировать
                  </DropdownMenuItem>
                )}
                {onVerify && (
                  <DropdownMenuItem onClick={() => onVerify(broker.id)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Подтвердить
                  </DropdownMenuItem>
                )}
                {broker.automatedRemoval && onTestAutomation && (
                  <DropdownMenuItem onClick={() => onTestAutomation(broker.id)}>
                    <Bot className="mr-2 h-4 w-4" />
                    Тест автоматизации
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              <Building className="mr-1 h-3 w-3" />
              {categoryLabel}
            </Badge>
            <Badge
              variant="outline"
              className={cn("gap-1", difficulty.textColor)}
            >
              <div className={cn("w-2 h-2 rounded-full", difficulty.color)} />
              {difficulty.label}
            </Badge>
            {broker.isActive ? (
              <Badge variant="outline" className="text-green-700 dark:text-green-300">
                <CheckCircle className="mr-1 h-3 w-3" />
                Активен
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">
                <XCircle className="mr-1 h-3 w-3" />
                Неактивен
              </Badge>
            )}
          </div>

          {broker.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {broker.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            {broker.website && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" />
                <a
                  href={broker.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary truncate flex items-center gap-1"
                  data-testid={`link-broker-website-${broker.id}`}
                >
                  Сайт
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {broker.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{broker.email}</span>
              </div>
            )}
            {broker.responseTime && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {broker.responseTime === '1-3_days' && '1-3 дня'}
                  {broker.responseTime === 'week' && 'Неделя'}
                  {broker.responseTime === '2_weeks' && '2 недели'}
                  {broker.responseTime === 'month' && 'Месяц'}
                  {broker.responseTime === '2_months' && '2 месяца'}
                  {broker.responseTime === 'no_response' && 'Не отвечают'}
                </span>
              </div>
            )}
            {broker.successRate !== undefined && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>{broker.successRate}% успех</span>
              </div>
            )}
          </div>

          {broker.warnings && (
            <div className="flex items-start gap-2 p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              <p className="text-sm line-clamp-2">{broker.warnings}</p>
            </div>
          )}

          {broker.tags && broker.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {broker.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {broker.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{broker.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-4">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            {broker.lastVerifiedAt ? (
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Проверено {format(new Date(broker.lastVerifiedAt), 'd MMM', { locale: ru })}
              </div>
            ) : (
              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                <AlertTriangle className="h-3 w-3" />
                Требует проверки
              </div>
            )}
            {broker.regulatorNumber && (
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {broker.regulatorNumber}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {broker.name}
              {broker.automatedRemoval && (
                <Bot className="h-5 w-5 text-blue-500" title="Автоматизировано" />
              )}
            </DialogTitle>
            <DialogDescription>{broker.legalName}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Status and Category */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  <Building className="mr-1 h-3 w-3" />
                  {categoryLabel}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("gap-1", difficulty.textColor)}
                >
                  <div className={cn("w-2 h-2 rounded-full", difficulty.color)} />
                  {difficulty.label}
                </Badge>
                {broker.isActive ? (
                  <Badge variant="outline" className="text-green-700 dark:text-green-300">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Активен
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    <XCircle className="mr-1 h-3 w-3" />
                    Неактивен
                  </Badge>
                )}
              </div>

              {/* Description */}
              {broker.description && (
                <div>
                  <h4 className="font-medium mb-2">Описание</h4>
                  <p className="text-sm text-muted-foreground">{broker.description}</p>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h4 className="font-medium mb-2">Контактная информация</h4>
                <div className="space-y-2 text-sm">
                  {broker.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={broker.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {broker.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleCopy(broker.website!, 'URL')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {broker.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{broker.email}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleCopy(broker.email!, 'Email')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {broker.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{broker.phone}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleCopy(broker.phone!, 'Телефон')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {broker.address && (
                    <div className="flex items-start gap-2">
                      <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{broker.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Removal Information */}
              <div>
                <h4 className="font-medium mb-2">Процесс удаления данных</h4>
                <div className="space-y-2 text-sm">
                  {broker.privacyPolicyUrl && (
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Политика конфиденциальности:</span>
                      <a
                        href={broker.privacyPolicyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Открыть
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {broker.removalUrl && (
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Страница удаления:</span>
                      <a
                        href={broker.removalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Открыть
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {broker.responseTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Время ответа:</span>
                      <span>
                        {broker.responseTime === '1-3_days' && '1-3 дня'}
                        {broker.responseTime === 'week' && 'Неделя'}
                        {broker.responseTime === '2_weeks' && '2 недели'}
                        {broker.responseTime === 'month' && 'Месяц'}
                        {broker.responseTime === '2_months' && '2 месяца'}
                        {broker.responseTime === 'no_response' && 'Не отвечают'}
                      </span>
                    </div>
                  )}
                  {broker.averageProcessingDays && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Среднее время обработки:</span>
                      <span>{broker.averageProcessingDays} дней</span>
                    </div>
                  )}
                  {broker.successRate !== undefined && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Процент успеха:</span>
                      <span>{broker.successRate}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              {broker.removalInstructions && (
                <div>
                  <h4 className="font-medium mb-2">Инструкция по удалению</h4>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{broker.removalInstructions}</p>
                  </div>
                </div>
              )}

              {/* Required Documents */}
              {broker.requiredDocuments && broker.requiredDocuments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Требуемые документы</h4>
                  <div className="flex flex-wrap gap-2">
                    {broker.requiredDocuments.map((doc, index) => (
                      <Badge key={index} variant="secondary">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {broker.warnings && (
                <div className="p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                        Предупреждения
                      </h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        {broker.warnings}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {broker.notes && (
                <div>
                  <h4 className="font-medium mb-2">Заметки</h4>
                  <p className="text-sm text-muted-foreground">{broker.notes}</p>
                </div>
              )}

              {/* Tags */}
              {broker.tags && broker.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Теги</h4>
                  <div className="flex flex-wrap gap-2">
                    {broker.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <Separator />
              <div className="text-sm text-muted-foreground space-y-1">
                {broker.regulatorNumber && (
                  <div>Регистрационный номер: {broker.regulatorNumber}</div>
                )}
                {broker.lastVerifiedAt && (
                  <div>
                    Последняя проверка: {format(new Date(broker.lastVerifiedAt), 'PPP', { locale: ru })}
                  </div>
                )}
                <div>Создано: {format(new Date(broker.createdAt), 'PPP', { locale: ru })}</div>
                {broker.updatedAt && (
                  <div>Обновлено: {format(new Date(broker.updatedAt), 'PPP', { locale: ru })}</div>
                )}
                <div className="text-xs font-mono">ID: {broker.id}</div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Закрыть
            </Button>
            {onEdit && (
              <Button
                onClick={() => {
                  setShowDetails(false);
                  onEdit(broker);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Редактировать
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить оператора "{broker.name}"? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
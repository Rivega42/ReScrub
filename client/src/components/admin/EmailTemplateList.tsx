import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  Mail,
  Calendar,
  User,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { EmailTemplate } from '@shared/schema';

interface EmailTemplateListProps {
  groupedTemplates: Record<string, EmailTemplate[]>;
  onEdit: (template: EmailTemplate) => void;
  onPreview: (template: EmailTemplate) => void;
  onDelete: (id: string) => void;
  onClone: (id: string) => void;
}

const categoryLabels: Record<string, string> = {
  authentication: 'Аутентификация',
  notifications: 'Уведомления',
  marketing: 'Маркетинг',
  transactional: 'Транзакционные',
};

const categoryColors: Record<string, string> = {
  authentication: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  notifications: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  marketing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  transactional: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

const statusColors: Record<string, string> = {
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  archived: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function EmailTemplateList({ 
  groupedTemplates, 
  onEdit, 
  onPreview, 
  onDelete, 
  onClone 
}: EmailTemplateListProps) {
  const [openCategories, setOpenCategories] = useState<string[]>(
    Object.keys(groupedTemplates)
  );

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Не указано';
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVariableCount = (template: EmailTemplate) => {
    const variables = template.variables as any[] || [];
    return variables.length;
  };

  if (Object.keys(groupedTemplates).length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Шаблоны не найдены. Создайте первый шаблон письма.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedTemplates).map(([category, templates]) => (
        <Collapsible
          key={category}
          open={openCategories.includes(category)}
          onOpenChange={() => toggleCategory(category)}
        >
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {openCategories.includes(category) ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <div className="text-left">
                      <CardTitle className="text-lg">
                        {categoryLabels[category] || category}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {templates.length} шаблон{templates.length === 1 ? '' : 'ов'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={categoryColors[category] || ''}>
                    {templates.filter(t => t.isActive).length} активных
                  </Badge>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="pt-0 pb-4">
                <div className="space-y-3">
                  {templates.map((template) => (
                    <Card key={template.id} className="hover-elevate">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <Mail className="w-5 h-5 text-muted-foreground mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold" data-testid={`text-template-name-${template.id}`}>
                                    {template.name}
                                  </h4>
                                  <Badge 
                                    variant={template.isActive ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {template.isActive ? 'Активный' : 'Неактивный'}
                                  </Badge>
                                  <Badge 
                                    variant="outline"
                                    className={`text-xs ${statusColors[template.status || 'draft']}`}
                                  >
                                    {template.status === 'published' ? 'Опубликован' : 
                                     template.status === 'archived' ? 'Архивный' : 'Черновик'}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-2">
                                  {template.subject}
                                </p>
                                
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Обновлен: {formatDate(template.updatedAt)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{template.createdBy || 'Система'}</span>
                                  </div>
                                  <div>
                                    {getVariableCount(template)} переменных
                                  </div>
                                  {template.sendCount && (
                                    <div>
                                      Отправлено: {template.sendCount}
                                    </div>
                                  )}
                                </div>

                                {template.description && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {template.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onPreview(template)}
                              data-testid={`button-preview-${template.id}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(template)}
                              data-testid={`button-edit-${template.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  data-testid={`button-menu-${template.id}`}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => onClone(template.id)}
                                  data-testid={`button-clone-${template.id}`}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Клонировать
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => onDelete(template.id)}
                                  className="text-destructive"
                                  data-testid={`button-delete-${template.id}`}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Удалить
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}
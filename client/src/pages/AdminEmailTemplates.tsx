import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import EmailTemplateList from '@/components/admin/EmailTemplateList';
import EmailTemplateEditor from '@/components/admin/EmailTemplateEditor';
import EmailTemplatePreview from '@/components/admin/EmailTemplatePreview';
import { Plus, Search, Filter, RefreshCw, Download, Upload } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import type { EmailTemplate } from '@shared/schema';

export default function AdminEmailTemplates() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch email templates
  const { data: templates, isLoading, refetch } = useQuery<EmailTemplate[]>({
    queryKey: ['/api/admin/email-templates', selectedCategory, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      return fetch(`/api/admin/email-templates?${params}`).then(res => res.json());
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest(`/api/admin/email-templates/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({
        title: 'Успешно',
        description: 'Шаблон удален',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/email-templates'] });
    },
    onError: () => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить шаблон',
        variant: 'destructive',
      });
    },
  });

  // Clone template mutation
  const cloneTemplateMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest(`/api/admin/email-templates/${id}/clone`, { method: 'POST' }),
    onSuccess: () => {
      toast({
        title: 'Успешно',
        description: 'Шаблон скопирован',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/email-templates'] });
    },
    onError: () => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать шаблон',
        variant: 'destructive',
      });
    },
  });

  // Export templates
  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/email-templates/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-templates-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: 'Успешно',
        description: 'Шаблоны экспортированы',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось экспортировать шаблоны',
        variant: 'destructive',
      });
    }
  };

  // Import templates
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await apiRequest('/api/admin/email-templates/import', {
        method: 'POST',
        body: formData,
      });
      toast({
        title: 'Успешно',
        description: 'Шаблоны импортированы',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/email-templates'] });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось импортировать шаблоны',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsCreating(false);
    setIsEditorOpen(true);
  };

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleCreate = () => {
    setSelectedTemplate(null);
    setIsCreating(true);
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот шаблон?')) {
      deleteTemplateMutation.mutate(id);
    }
  };

  const handleClone = (id: string) => {
    cloneTemplateMutation.mutate(id);
  };

  const handleSave = () => {
    setIsEditorOpen(false);
    refetch();
  };

  // Group templates by category
  const groupedTemplates = templates?.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, EmailTemplate[]>) || {};

  const categories = [
    { value: 'all', label: 'Все категории' },
    { value: 'authentication', label: 'Аутентификация' },
    { value: 'notifications', label: 'Уведомления' },
    { value: 'marketing', label: 'Маркетинг' },
    { value: 'transactional', label: 'Транзакционные' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="Управление шаблонами писем | Admin" />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
            Управление шаблонами писем
          </h1>
          <p className="text-muted-foreground">
            Создавайте и редактируйте email шаблоны для автоматических рассылок
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Поиск шаблонов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search"
                  />
                </div>

                {/* Category filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]" data-testid="select-category">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Категория" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  data-testid="button-refresh"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Обновить
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  data-testid="button-export"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт
                </Button>
                <label>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    data-testid="button-import"
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Импорт
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
                <Button onClick={handleCreate} data-testid="button-create">
                  <Plus className="w-4 h-4 mr-2" />
                  Создать шаблон
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Всего шаблонов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-templates">
                {templates?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Активные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="text-active-templates">
                {templates?.filter(t => t.isActive).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Черновики</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600" data-testid="text-draft-templates">
                {templates?.filter(t => t.status === 'draft').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Архивные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600" data-testid="text-archived-templates">
                {templates?.filter(t => t.status === 'archived').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template list */}
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Загрузка шаблонов...
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmailTemplateList
            groupedTemplates={groupedTemplates}
            onEdit={handleEdit}
            onPreview={handlePreview}
            onDelete={handleDelete}
            onClone={handleClone}
          />
        )}
      </main>

      {/* Editor Dialog */}
      {isEditorOpen && (
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="max-w-7xl h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {isCreating ? 'Создание нового шаблона' : 'Редактирование шаблона'}
              </DialogTitle>
            </DialogHeader>
            <EmailTemplateEditor
              template={selectedTemplate}
              isCreating={isCreating}
              onSave={handleSave}
              onCancel={() => setIsEditorOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Preview Dialog */}
      {isPreviewOpen && selectedTemplate && (
        <EmailTemplatePreview
          template={selectedTemplate}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import EmailVariableSelector from './EmailVariableSelector';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {
  Save,
  Send,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Code,
  FileText,
  Palette,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Table,
  Undo,
  Redo,
} from 'lucide-react';
import type { EmailTemplate, InsertEmailTemplate } from '@shared/schema';

interface EmailTemplateEditorProps {
  template: EmailTemplate | null;
  isCreating: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function EmailTemplateEditor({ 
  template, 
  isCreating, 
  onSave, 
  onCancel 
}: EmailTemplateEditorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'html' | 'text'>('html');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState<Partial<InsertEmailTemplate>>({
    name: template?.name || '',
    category: template?.category || 'notifications',
    subject: template?.subject || '',
    htmlBody: template?.htmlBody || '',
    textBody: template?.textBody || '',
    fromName: template?.fromName || 'ReScrub',
    fromEmail: template?.fromEmail || 'noreply@rescrub.ru',
    replyTo: template?.replyTo || '',
    status: template?.status || 'draft',
    isActive: template?.isActive || false,
    priority: template?.priority || 0,
    metadata: template?.metadata || {},
    variables: template?.variables || [
      { name: 'firstName', required: false, defaultValue: 'Уважаемый клиент' },
      { name: 'lastName', required: false, defaultValue: '' },
      { name: 'email', required: false, defaultValue: '' },
      { name: 'phone', required: false, defaultValue: '' },
      { name: 'company', required: false, defaultValue: '' },
    ],
  });

  // Test data for preview
  const [testData, setTestData] = useState({
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@example.com',
    phone: '+7 999 123-45-67',
    company: 'ООО "Компания"',
    deletionCount: '42',
    scanDate: new Date().toLocaleDateString('ru-RU'),
    requestDate: new Date().toLocaleDateString('ru-RU'),
    brokerName: 'Сбербанк',
    brokerUrl: 'https://sberbank.ru',
    legalBasis: 'ст. 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ',
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<InsertEmailTemplate>) => {
      if (isCreating) {
        return apiRequest('/api/admin/email-templates', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } else {
        return apiRequest(`/api/admin/email-templates/${template?.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      }
    },
    onSuccess: () => {
      toast({
        title: 'Успешно',
        description: isCreating ? 'Шаблон создан' : 'Шаблон обновлен',
      });
      onSave();
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось сохранить шаблон',
        variant: 'destructive',
      });
    },
  });

  // Test email mutation
  const testEmailMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/admin/email-templates/${template?.id}/test`, {
        method: 'POST',
        body: JSON.stringify({
          email: testData.email,
          data: testData,
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Успешно',
        description: `Тестовое письмо отправлено на ${testData.email}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось отправить тестовое письмо',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (!formData.name || !formData.subject) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive',
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  const handlePublish = () => {
    saveMutation.mutate({ ...formData, status: 'published', isActive: true });
  };

  const insertVariable = (variable: string) => {
    const cursorPosition = (document.activeElement as HTMLTextAreaElement)?.selectionStart || 0;
    const field = activeTab === 'html' ? 'htmlBody' : 'textBody';
    const currentValue = formData[field] || '';
    const newValue = 
      currentValue.slice(0, cursorPosition) + 
      `{{${variable}}}` + 
      currentValue.slice(cursorPosition);
    
    setFormData(prev => ({ ...prev, [field]: newValue }));
  };

  // Replace variables in template for preview
  const replaceVariables = (text: string) => {
    let result = text;
    Object.entries(testData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  const renderedHtml = replaceVariables(formData.htmlBody || '');
  const renderedText = replaceVariables(formData.textBody || '');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <Label>Название шаблона *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="welcome_email"
              className="w-[250px]"
              data-testid="input-template-name"
            />
          </div>
          <div>
            <Label>Категория</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-[200px]" data-testid="select-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="authentication">Аутентификация</SelectItem>
                <SelectItem value="notifications">Уведомления</SelectItem>
                <SelectItem value="marketing">Маркетинг</SelectItem>
                <SelectItem value="transactional">Транзакционные</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Статус</Label>
            <Badge 
              variant={formData.status === 'published' ? 'default' : 'secondary'}
              className="mt-2"
            >
              {formData.status === 'published' ? 'Опубликован' : 'Черновик'}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            data-testid="button-toggle-preview"
          >
            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? 'Скрыть' : 'Показать'} превью
          </Button>
          {!isCreating && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => testEmailMutation.mutate()}
              disabled={testEmailMutation.isPending}
              data-testid="button-test-email"
            >
              <Send className="w-4 h-4 mr-2" />
              Тест
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            data-testid="button-save-draft"
          >
            <Save className="w-4 h-4 mr-2" />
            Сохранить черновик
          </Button>
          <Button
            onClick={handlePublish}
            disabled={saveMutation.isPending}
            data-testid="button-publish"
          >
            <Send className="w-4 h-4 mr-2" />
            Опубликовать
          </Button>
        </div>
      </div>

      {/* Subject line */}
      <div className="mb-4">
        <Label>Тема письма *</Label>
        <div className="flex gap-2">
          <Input
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Добро пожаловать в ReScrub, {{firstName}}!"
            className="flex-1"
            data-testid="input-subject"
          />
          <EmailVariableSelector onSelect={insertVariable} />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'html' | 'text')}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="html" data-testid="tab-html">
                <Code className="w-4 h-4 mr-2" />
                HTML версия
              </TabsTrigger>
              <TabsTrigger value="text" data-testid="tab-text">
                <FileText className="w-4 h-4 mr-2" />
                Текстовая версия
              </TabsTrigger>
              <div className="ml-auto mr-2">
                <EmailVariableSelector onSelect={insertVariable} />
              </div>
            </TabsList>
            
            <TabsContent value="html" className="flex-1 mt-4">
              <CodeEditor
                value={formData.htmlBody}
                language="html"
                placeholder="Введите HTML код шаблона..."
                onChange={(evn) => setFormData(prev => ({ ...prev, htmlBody: evn.target.value }))}
                padding={15}
                data-testid="editor-html"
                style={{
                  fontSize: 14,
                  backgroundColor: '#f5f5f5',
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  height: '100%',
                  overflow: 'auto',
                }}
              />
            </TabsContent>
            
            <TabsContent value="text" className="flex-1 mt-4">
              <CodeEditor
                value={formData.textBody}
                language="text"
                placeholder="Введите текстовую версию шаблона..."
                onChange={(evn) => setFormData(prev => ({ ...prev, textBody: evn.target.value }))}
                padding={15}
                data-testid="editor-text"
                style={{
                  fontSize: 14,
                  backgroundColor: '#f5f5f5',
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  height: '100%',
                  overflow: 'auto',
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="flex-1 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Превью</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                      data-testid="button-desktop-preview"
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                      data-testid="button-mobile-preview"
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="h-full overflow-auto bg-gray-100 p-4">
                  <div 
                    className={`bg-white mx-auto ${
                      previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[600px]'
                    }`}
                    style={{ minHeight: '400px' }}
                  >
                    {/* Email header */}
                    <div className="p-4 border-b">
                      <div className="text-xs text-gray-500 mb-1">От: {formData.fromName} &lt;{formData.fromEmail}&gt;</div>
                      <div className="text-xs text-gray-500 mb-1">Кому: {testData.email}</div>
                      <div className="font-semibold">{replaceVariables(formData.subject || '')}</div>
                    </div>
                    
                    {/* Email body */}
                    <div className="p-4">
                      {activeTab === 'html' ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: renderedHtml }}
                          className="email-preview"
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans text-sm">
                          {renderedText}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test data panel */}
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Тестовые данные</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Имя</Label>
                    <Input
                      value={testData.firstName}
                      onChange={(e) => setTestData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Имя"
                      size="sm"
                      data-testid="input-test-firstname"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Фамилия</Label>
                    <Input
                      value={testData.lastName}
                      onChange={(e) => setTestData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Фамилия"
                      size="sm"
                      data-testid="input-test-lastname"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input
                      value={testData.email}
                      onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Email"
                      size="sm"
                      data-testid="input-test-email"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Компания</Label>
                    <Input
                      value={testData.company}
                      onChange={(e) => setTestData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Компания"
                      size="sm"
                      data-testid="input-test-company"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel} data-testid="button-cancel">
          Отмена
        </Button>
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          data-testid="button-save"
        >
          <Save className="w-4 h-4 mr-2" />
          Сохранить
        </Button>
      </div>
    </div>
  );
}
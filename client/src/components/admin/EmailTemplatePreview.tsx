import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Monitor, Smartphone, Send, Copy } from 'lucide-react';
import type { EmailTemplate } from '@shared/schema';

interface EmailTemplatePreviewProps {
  template: EmailTemplate;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailTemplatePreview({ 
  template, 
  isOpen, 
  onClose 
}: EmailTemplatePreviewProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'html' | 'text'>('html');
  
  // Test data for preview
  const [testData, setTestData] = useState({
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'test@example.com',
    phone: '+7 999 123-45-67',
    company: 'ООО "Компания"',
    deletionCount: '42',
    scanDate: new Date().toLocaleDateString('ru-RU'),
    requestDate: new Date().toLocaleDateString('ru-RU'),
    brokerName: 'Сбербанк',
    brokerUrl: 'https://sberbank.ru',
    legalBasis: 'ст. 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ',
    planName: 'Премиум',
    planPrice: '999 ₽/мес',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
    renewalUrl: 'https://grandhub.ru/subscription',
    daysRemaining: '30',
    verificationUrl: 'https://grandhub.ru/verify-email?token=abc123',
  });

  // Send test email mutation
  const sendTestMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/admin/email-templates/${template.id}/test`, {
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

  // Replace variables in template
  const replaceVariables = (text: string) => {
    let result = text;
    Object.entries(testData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  const renderedSubject = replaceVariables(template.subject);
  const renderedHtml = replaceVariables(template.htmlBody);
  const renderedText = replaceVariables(template.textBody || '');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Скопировано',
      description: 'HTML код скопирован в буфер обмена',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Предпросмотр шаблона: {template.name}</span>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                data-testid="button-desktop-view"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                data-testid="button-mobile-view"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Preview */}
          <div className="flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'html' | 'text')}>
              <TabsList>
                <TabsTrigger value="html" data-testid="tab-preview-html">HTML превью</TabsTrigger>
                <TabsTrigger value="text" data-testid="tab-preview-text">Текст превью</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="flex-1 mt-4 overflow-hidden">
                <div className="h-full bg-gray-100 p-4 overflow-auto">
                  <div 
                    className={`bg-white mx-auto shadow-lg ${
                      viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[700px]'
                    }`}
                    style={{ minHeight: '500px' }}
                  >
                    {/* Email header */}
                    <div className="p-4 border-b bg-gray-50">
                      <div className="text-xs text-gray-600 mb-1">
                        <strong>От:</strong> {template.fromName || 'GrandHub'} &lt;{template.fromEmail || 'noreply@grandhub.ru'}&gt;
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        <strong>Кому:</strong> {testData.email}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        <strong>Дата:</strong> {new Date().toLocaleString('ru-RU')}
                      </div>
                      <div className="font-bold text-lg">{renderedSubject}</div>
                    </div>
                    
                    {/* Email body */}
                    <div className="p-4">
                      <div 
                        dangerouslySetInnerHTML={{ __html: renderedHtml }}
                        className="email-content"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="text" className="flex-1 mt-4 overflow-hidden">
                <div className="h-full bg-gray-100 p-4 overflow-auto">
                  <div 
                    className={`bg-white mx-auto shadow-lg p-4 ${
                      viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[700px]'
                    }`}
                    style={{ minHeight: '500px' }}
                  >
                    <div className="mb-4 pb-4 border-b">
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Тема:</strong> {renderedSubject}
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {renderedText}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(renderedHtml)}
                data-testid="button-copy-html"
              >
                <Copy className="w-4 h-4 mr-2" />
                Копировать HTML
              </Button>
            </div>
          </div>

          {/* Test data panel */}
          <div className="w-[350px] flex flex-col">
            <Card className="flex-1 overflow-auto">
              <CardHeader>
                <CardTitle className="text-lg">Тестовые данные</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Email для отправки</Label>
                    <Input
                      type="email"
                      value={testData.email}
                      onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="test@example.com"
                      data-testid="input-test-email"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Имя</Label>
                      <Input
                        value={testData.firstName}
                        onChange={(e) => setTestData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Имя"
                        data-testid="input-test-firstname"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Фамилия</Label>
                      <Input
                        value={testData.lastName}
                        onChange={(e) => setTestData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Фамилия"
                        data-testid="input-test-lastname"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Компания</Label>
                    <Input
                      value={testData.company}
                      onChange={(e) => setTestData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Название компании"
                      data-testid="input-test-company"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Телефон</Label>
                    <Input
                      value={testData.phone}
                      onChange={(e) => setTestData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+7 999 123-45-67"
                      data-testid="input-test-phone"
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Количество удалений</Label>
                      <Input
                        value={testData.deletionCount}
                        onChange={(e) => setTestData(prev => ({ ...prev, deletionCount: e.target.value }))}
                        placeholder="0"
                        data-testid="input-test-deletions"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Дата сканирования</Label>
                      <Input
                        value={testData.scanDate}
                        onChange={(e) => setTestData(prev => ({ ...prev, scanDate: e.target.value }))}
                        placeholder="01.01.2024"
                        data-testid="input-test-scandate"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Брокер</Label>
                    <Input
                      value={testData.brokerName}
                      onChange={(e) => setTestData(prev => ({ ...prev, brokerName: e.target.value }))}
                      placeholder="Название брокера"
                      data-testid="input-test-broker"
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-xs">Тарифный план</Label>
                    <Input
                      value={testData.planName}
                      onChange={(e) => setTestData(prev => ({ ...prev, planName: e.target.value }))}
                      placeholder="Премиум"
                      data-testid="input-test-plan"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Цена</Label>
                      <Input
                        value={testData.planPrice}
                        onChange={(e) => setTestData(prev => ({ ...prev, planPrice: e.target.value }))}
                        placeholder="999 ₽/мес"
                        data-testid="input-test-price"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Дней осталось</Label>
                      <Input
                        value={testData.daysRemaining}
                        onChange={(e) => setTestData(prev => ({ ...prev, daysRemaining: e.target.value }))}
                        placeholder="30"
                        data-testid="input-test-days"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="button-close"
          >
            Закрыть
          </Button>
          <Button
            onClick={() => sendTestMutation.mutate()}
            disabled={sendTestMutation.isPending}
            data-testid="button-send-test"
          >
            <Send className="w-4 h-4 mr-2" />
            Отправить тест на {testData.email}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
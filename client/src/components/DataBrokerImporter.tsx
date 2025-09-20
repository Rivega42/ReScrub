import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Upload,
  FileJson,
  FilePlus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  Eye,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { DataBroker } from '@shared/schema';

interface ImportData extends Partial<DataBroker> {
  _status?: 'valid' | 'invalid' | 'duplicate';
  _errors?: string[];
}

interface DataBrokerImporterProps {
  onImport: (brokers: Partial<DataBroker>[]) => Promise<void>;
  existingBrokers?: DataBroker[];
}

const CSV_TEMPLATE = `name,legalName,category,website,email,phone,difficultyLevel,responseTime,isActive
"ПАО Сбербанк","Публичное акционерное общество Сбербанк России","banks","https://sberbank.ru","privacy@sberbank.ru","+7 800 555-55-50","medium","week",true
"МегаФон","ПАО МегаФон","telecom","https://megafon.ru","privacy@megafon.ru","+7 800 550-05-00","hard","2_weeks",true`;

const JSON_TEMPLATE = JSON.stringify([
  {
    name: "ПАО Сбербанк",
    legalName: "Публичное акционерное общество Сбербанк России",
    category: "banks",
    website: "https://sberbank.ru",
    email: "privacy@sberbank.ru",
    phone: "+7 800 555-55-50",
    difficultyLevel: "medium",
    responseTime: "week",
    isActive: true,
    description: "Крупнейший банк России",
    removalInstructions: "1. Зайти в личный кабинет\n2. Перейти в настройки конфиденциальности\n3. Подать запрос на удаление",
    requiredDocuments: ["Паспорт", "СНИЛС"],
    tags: ["банк", "финансы", "кредиты"]
  }
], null, 2);

export default function DataBrokerImporter({ onImport, existingBrokers = [] }: DataBrokerImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [importData, setImportData] = useState<ImportData[]>([]);
  const [rawInput, setRawInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importStats, setImportStats] = useState({ valid: 0, invalid: 0, duplicate: 0 });
  const { toast } = useToast();

  const parseCSV = (csvText: string): Partial<DataBroker>[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV должен содержать заголовок и минимум одну строку данных');

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: Partial<DataBroker>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
      const cleanValues = values.map(v => v.trim().replace(/^"|"$/g, ''));
      
      const row: any = {};
      headers.forEach((header, index) => {
        if (cleanValues[index] !== undefined && cleanValues[index] !== '') {
          // Convert string booleans to actual booleans
          if (cleanValues[index] === 'true') {
            row[header] = true;
          } else if (cleanValues[index] === 'false') {
            row[header] = false;
          } else if (header === 'requiredDocuments' || header === 'tags') {
            // Handle arrays
            row[header] = cleanValues[index].split(';').map(s => s.trim());
          } else {
            row[header] = cleanValues[index];
          }
        }
      });
      
      data.push(row);
    }

    return data;
  };

  const parseJSON = (jsonText: string): Partial<DataBroker>[] => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON должен содержать массив операторов');
      }
      return parsed;
    } catch (error: any) {
      throw new Error(`Ошибка парсинга JSON: ${error.message}`);
    }
  };

  const validateBroker = (broker: Partial<DataBroker>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!broker.name) errors.push('Название обязательно');
    if (!broker.category) errors.push('Категория обязательна');
    if (!broker.difficultyLevel) errors.push('Уровень сложности обязателен');
    
    if (broker.website && !isValidUrl(broker.website)) {
      errors.push('Некорректный URL сайта');
    }
    
    if (broker.email && !isValidEmail(broker.email)) {
      errors.push('Некорректный email');
    }

    if (broker.difficultyLevel && !['easy', 'medium', 'hard', 'very_hard'].includes(broker.difficultyLevel)) {
      errors.push('Некорректный уровень сложности');
    }

    // Check for duplicates
    const isDuplicate = existingBrokers.some(existing => 
      existing.name.toLowerCase() === broker.name?.toLowerCase() ||
      (broker.website && existing.website === broker.website)
    );
    
    if (isDuplicate) {
      errors.push('Дубликат существующего оператора');
    }

    return { isValid: errors.length === 0, errors };
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setRawInput(text);
      processImport(text, file.name.endsWith('.json') ? 'json' : 'csv');
    };
    reader.readAsText(file);
  }, [existingBrokers]);

  const processImport = (text: string, format: 'csv' | 'json') => {
    try {
      setValidationErrors([]);
      let parsed: Partial<DataBroker>[] = [];

      if (format === 'csv') {
        parsed = parseCSV(text);
      } else {
        parsed = parseJSON(text);
      }

      const validated: ImportData[] = parsed.map(broker => {
        const validation = validateBroker(broker);
        return {
          ...broker,
          _status: validation.isValid ? 
            (existingBrokers.some(e => e.name === broker.name) ? 'duplicate' : 'valid') : 
            'invalid',
          _errors: validation.errors
        };
      });

      const stats = {
        valid: validated.filter(b => b._status === 'valid').length,
        invalid: validated.filter(b => b._status === 'invalid').length,
        duplicate: validated.filter(b => b._status === 'duplicate').length,
      };

      setImportData(validated);
      setImportStats(stats);

      if (stats.valid === 0 && parsed.length > 0) {
        toast({
          variant: "destructive",
          title: "Нет валидных записей",
          description: "Все записи содержат ошибки или являются дубликатами",
        });
      }
    } catch (error: any) {
      setValidationErrors([error.message]);
      toast({
        variant: "destructive",
        title: "Ошибка импорта",
        description: error.message,
      });
    }
  };

  const handleImport = async () => {
    const validBrokers = importData.filter(b => b._status === 'valid');
    if (validBrokers.length === 0) {
      toast({
        variant: "destructive",
        title: "Нет данных для импорта",
        description: "Выберите валидные записи для импорта",
      });
      return;
    }

    setIsProcessing(true);
    setImportProgress(0);

    try {
      // Clean up the data before import
      const cleanedBrokers = validBrokers.map(({ _status, _errors, ...broker }) => broker);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await onImport(cleanedBrokers);
      
      clearInterval(progressInterval);
      setImportProgress(100);

      toast({
        title: "Импорт завершен",
        description: `Успешно импортировано ${validBrokers.length} операторов`,
      });

      setTimeout(() => {
        setIsOpen(false);
        setImportData([]);
        setRawInput('');
        setImportProgress(0);
      }, 1000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка импорта",
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFromImport = (index: number) => {
    setImportData(prev => prev.filter((_, i) => i !== index));
    setImportStats(prev => ({
      ...prev,
      [importData[index]._status!]: prev[importData[index]._status as keyof typeof prev] - 1
    }));
  };

  const downloadTemplate = (format: 'csv' | 'json') => {
    const content = format === 'csv' ? CSV_TEMPLATE : JSON_TEMPLATE;
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-brokers-template.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" data-testid="button-import-brokers">
        <Upload className="mr-2 h-4 w-4" />
        Импорт операторов
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Импорт операторов персональных данных</DialogTitle>
            <DialogDescription>
              Загрузите файл CSV или JSON с данными операторов для массового импорта
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Загрузка</TabsTrigger>
              <TabsTrigger value="preview" disabled={importData.length === 0}>
                Предпросмотр ({importData.length})
              </TabsTrigger>
              <TabsTrigger value="templates">Шаблоны</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Загрузить файл</CardTitle>
                  <CardDescription>
                    Выберите CSV или JSON файл с данными операторов
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Нажмите для загрузки</span> или перетащите файл
                        </p>
                        <p className="text-xs text-muted-foreground">CSV или JSON (максимум 10MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".csv,.json"
                        onChange={handleFileUpload}
                        data-testid="input-file-upload"
                      />
                    </label>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Или вставьте данные</span>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Вставьте CSV или JSON данные здесь..."
                    className="min-h-[200px] font-mono text-sm"
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    data-testid="textarea-import-data"
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => processImport(rawInput, 'csv')}
                      disabled={!rawInput}
                      variant="outline"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Обработать как CSV
                    </Button>
                    <Button
                      onClick={() => processImport(rawInput, 'json')}
                      disabled={!rawInput}
                      variant="outline"
                    >
                      <FileJson className="mr-2 h-4 w-4" />
                      Обработать как JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Ошибки валидации</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {importStats.valid > 0 || importStats.invalid > 0 || importStats.duplicate > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Результат обработки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Валидные: {importStats.valid}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span>С ошибками: {importStats.invalid}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <span>Дубликаты: {importStats.duplicate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Предпросмотр импорта</CardTitle>
                  <CardDescription>
                    Проверьте данные перед импортом. Записи с ошибками будут пропущены.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Статус</TableHead>
                          <TableHead>Название</TableHead>
                          <TableHead>Категория</TableHead>
                          <TableHead>Сложность</TableHead>
                          <TableHead>Сайт</TableHead>
                          <TableHead>Ошибки</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importData.map((broker, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {broker._status === 'valid' && (
                                <Badge variant="outline" className="text-green-600">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Валидный
                                </Badge>
                              )}
                              {broker._status === 'invalid' && (
                                <Badge variant="outline" className="text-red-600">
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Ошибка
                                </Badge>
                              )}
                              {broker._status === 'duplicate' && (
                                <Badge variant="outline" className="text-yellow-600">
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                  Дубликат
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{broker.name || '-'}</TableCell>
                            <TableCell>{broker.category || '-'}</TableCell>
                            <TableCell>{broker.difficultyLevel || '-'}</TableCell>
                            <TableCell>{broker.website || '-'}</TableCell>
                            <TableCell>
                              {broker._errors && broker._errors.length > 0 && (
                                <ul className="text-sm text-red-600">
                                  {broker._errors.map((error, i) => (
                                    <li key={i}>{error}</li>
                                  ))}
                                </ul>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeFromImport(index)}
                                data-testid={`button-remove-import-${index}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Шаблоны для импорта</CardTitle>
                  <CardDescription>
                    Скачайте шаблоны файлов для правильного формата данных
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">CSV Шаблон</CardTitle>
                        <CardDescription>Простой формат для табличных данных</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                          {CSV_TEMPLATE}
                        </pre>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => downloadTemplate('csv')}
                          variant="outline"
                          className="w-full"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Скачать CSV шаблон
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">JSON Шаблон</CardTitle>
                        <CardDescription>Расширенный формат с полями</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px]">
                          <pre className="text-xs bg-muted p-2 rounded">
                            {JSON_TEMPLATE}
                          </pre>
                        </ScrollArea>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => downloadTemplate('json')}
                          variant="outline"
                          className="w-full"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Скачать JSON шаблон
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={importProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Импорт данных... {importProgress}%
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isProcessing}>
              Отмена
            </Button>
            <Button
              onClick={handleImport}
              disabled={importStats.valid === 0 || isProcessing}
              data-testid="button-confirm-import"
            >
              <FilePlus className="mr-2 h-4 w-4" />
              Импортировать {importStats.valid > 0 && `(${importStats.valid})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
import { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Upload, 
  FileText, 
  Eye, 
  Download, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileX 
} from 'lucide-react';

interface Document {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  category: 'passport' | 'power_of_attorney' | 'other';
  status: 'uploaded' | 'processing' | 'verified' | 'rejected';
  description?: string;
  filePath: string;
  processingNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// File upload form component
function FileUploadForm({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/documents', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: "Документ загружен",
        description: "Ваш документ успешно загружен и отправлен на проверку",
      });
      setSelectedFile(null);
      setCategory('');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка загрузки",
        description: error.message || "Не удалось загрузить документ",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Файл слишком большой",
          description: "Максимальный размер файла: 10 МБ",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Неподдерживаемый формат",
          description: "Поддерживаются только PDF, JPG, PNG файлы",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !category) {
      toast({
        title: "Заполните обязательные поля",
        description: "Выберите файл и категорию документа",
        variant: "destructive",
      });
      return;
    }

    // Simulate file upload - in real app would upload to storage service
    const mockFileData = {
      filename: `${Date.now()}_${selectedFile.name}`,
      originalName: selectedFile.name,
      mimeType: selectedFile.type,
      fileSize: selectedFile.size,
      category,
      description: description.trim() || undefined,
      filePath: `/uploads/documents/${Date.now()}_${selectedFile.name}`, // Mock path
    };

    uploadMutation.mutate(mockFileData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Загрузить документ
        </CardTitle>
        <CardDescription>
          Загрузите паспорт, доверенность или другие документы для подтверждения личности
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Файл документа *</Label>
          <Input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            data-testid="input-file-upload"
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Поддерживаются PDF, JPG, PNG файлы до 10 МБ
          </p>
        </div>

        <div>
          <Label htmlFor="category">Категория документа *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="select-document-category">
              <SelectValue placeholder="Выберите категорию документа" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passport">Паспорт РФ</SelectItem>
              <SelectItem value="power_of_attorney">Доверенность</SelectItem>
              <SelectItem value="other">Другой документ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Описание (необязательно)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Дополнительная информация о документе"
            data-testid="input-document-description"
            rows={3}
          />
        </div>

        {selectedFile && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-sm text-muted-foreground">
                ({Math.round(selectedFile.size / 1024)} КБ)
              </span>
            </div>
          </div>
        )}

        <Button 
          onClick={handleUpload}
          disabled={!selectedFile || !category || uploadMutation.isPending}
          data-testid="button-upload-document"
        >
          {uploadMutation.isPending ? 'Загрузка...' : 'Загрузить документ'}
        </Button>
      </CardContent>
    </Card>
  );
}

// Document status badge component
function DocumentStatusBadge({ status }: { status: Document['status'] }) {
  const statusConfig = {
    uploaded: { 
      label: 'Загружен', 
      variant: 'secondary' as const,
      icon: Clock 
    },
    processing: { 
      label: 'Обработка', 
      variant: 'default' as const,
      icon: Clock 
    },
    verified: { 
      label: 'Подтвержден', 
      variant: 'default' as const,
      icon: CheckCircle 
    },
    rejected: { 
      label: 'Отклонен', 
      variant: 'destructive' as const,
      icon: AlertCircle 
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}

// Category display component
function DocumentCategoryBadge({ category }: { category: Document['category'] }) {
  const categoryLabels = {
    passport: 'Паспорт РФ',
    power_of_attorney: 'Доверенность',
    other: 'Другой документ',
  };

  return (
    <Badge variant="outline">
      {categoryLabels[category]}
    </Badge>
  );
}

// Main Documents page component
export default function Documents() {
  const [showUploadForm, setShowUploadForm] = useState(true);
  
  // Fetch user documents
  const { data: documents = [], isLoading, error } = useQuery<Document[]>({
    queryKey: ['/api/documents']
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Ошибка загрузки
            </CardTitle>
            <CardDescription>
              Не удалось загрузить список документов
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="title-documents">
          Документы
        </h1>
        <p className="text-muted-foreground">
          Загрузка и управление документами для подтверждения личности
        </p>
      </div>

      <div className="grid gap-6">
        {/* Upload Form */}
        {showUploadForm && (
          <FileUploadForm onUploadSuccess={() => setShowUploadForm(false)} />
        )}

        {/* Toggle Upload Form */}
        {!showUploadForm && (
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={() => setShowUploadForm(true)}
                data-testid="button-show-upload-form"
                className="w-full"
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Загрузить еще документ
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Загруженные документы
            </CardTitle>
            <CardDescription>
              {documents.length === 0 
                ? 'У вас пока нет загруженных документов'
                : `Всего документов: ${documents.length}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileX className="w-12 h-12 mx-auto mb-4" />
                <p>Документы не найдены</p>
                <p className="text-sm">Загрузите первый документ для подтверждения личности</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Документ</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Размер</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Дата загрузки</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((document) => (
                      <TableRow key={document.id} data-testid={`document-row-${document.id}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{document.originalName}</p>
                            {document.description && (
                              <p className="text-sm text-muted-foreground">
                                {document.description}
                              </p>
                            )}
                            {document.processingNotes && (
                              <p className="text-sm text-muted-foreground italic">
                                {document.processingNotes}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DocumentCategoryBadge category={document.category} />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {formatFileSize(document.fileSize)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DocumentStatusBadge status={document.status} />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {formatDate(document.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              data-testid={`button-view-${document.id}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              data-testid={`button-download-${document.id}`}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            {document.status === 'uploaded' && (
                              <Button
                                size="sm"
                                variant="outline"
                                data-testid={`button-delete-${document.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Card */}
        {documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Статистика документов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {documents.filter(d => d.status === 'uploaded').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Загружено</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {documents.filter(d => d.status === 'processing').length}
                  </p>
                  <p className="text-sm text-muted-foreground">В обработке</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {documents.filter(d => d.status === 'verified').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Подтверждено</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {documents.filter(d => d.status === 'rejected').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Отклонено</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
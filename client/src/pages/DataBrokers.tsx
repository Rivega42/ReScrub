import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Building2,
  Phone,
  Mail,
  Globe,
  FileText,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { DataBroker } from '@shared/schema';

// Data brokers will be fetched from API

export default function DataBrokers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Используем реальный API для получения data brokers
  const { data: brokers = [], isLoading } = useQuery<DataBroker[]>({
    queryKey: ['/api/data-brokers', searchTerm, categoryFilter, difficultyFilter],
    enabled: true,
  });

  // Фильтрация данных
  const filteredBrokers = brokers.filter((broker: DataBroker) => {
    const matchesSearch = broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         broker.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         broker.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || broker.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || broker.difficultyLevel === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDifficultyIcon = (level: string) => {
    switch (level) {
      case 'easy': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'hard': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const categories = [
    { value: 'all', label: 'Все категории' },
    { value: 'банк', label: 'Банки' },
    { value: 'телеком', label: 'Телекоммуникации' },
    { value: 'технологии', label: 'IT и технологии' },
    { value: 'государственный', label: 'Государственные органы' },
    { value: 'ритейл', label: 'Ритейл и торговля' },
    { value: 'недвижимость', label: 'Недвижимость' },
  ];

  const difficulties = [
    { value: 'all', label: 'Все уровни' },
    { value: 'easy', label: 'Легко' },
    { value: 'medium', label: 'Средне' },
    { value: 'hard', label: 'Сложно' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">
            Справочник операторов персональных данных
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Полный список российских компаний и организаций, которые могут обрабатывать ваши персональные данные, 
            с инструкциями по их удалению в соответствии с 152-ФЗ
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Фильтры и поиск
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию, описанию, тегам..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger data-testid="select-difficulty">
                  <SelectValue placeholder="Сложность удаления" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center" data-testid="stat-total">
                {filteredBrokers.length}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Найдено операторов
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-green-600">
                {filteredBrokers.filter((b: DataBroker) => b.difficultyLevel === 'easy').length}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Легко удалить
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-yellow-600">
                {filteredBrokers.filter((b: DataBroker) => b.difficultyLevel === 'medium').length}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Средняя сложность
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-red-600">
                {filteredBrokers.filter((b: DataBroker) => b.difficultyLevel === 'hard').length}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Сложно удалить
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Brokers List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBrokers.map((broker: DataBroker) => (
            <Card key={broker.id} className="hover-elevate" data-testid={`card-broker-${broker.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2" data-testid={`text-broker-name-${broker.id}`}>
                      {broker.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-3">
                      {broker.legalName}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">
                        {broker.category}
                      </Badge>
                      <Badge 
                        className={getDifficultyColor(broker.difficultyLevel)}
                        data-testid={`badge-difficulty-${broker.id}`}
                      >
                        {getDifficultyIcon(broker.difficultyLevel)}
                        {broker.difficultyLevel === 'easy' ? 'Легко' : 
                         broker.difficultyLevel === 'medium' ? 'Средне' : 'Сложно'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  {broker.description}
                </p>
                
                <Separator className="my-4" />
                
                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  {broker.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={broker.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                        data-testid={`link-website-${broker.id}`}
                      >
                        {broker.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                  
                  {broker.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      <a 
                        href={`mailto:${broker.email}`}
                        className="text-primary hover:underline"
                        data-testid={`link-email-${broker.id}`}
                      >
                        {broker.email}
                      </a>
                    </div>
                  )}
                  
                  {broker.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      <span data-testid={`text-phone-${broker.id}`}>{broker.phone}</span>
                    </div>
                  )}
                  
                  {broker.responseTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Время ответа: {broker.responseTime}</span>
                    </div>
                  )}
                </div>

                {/* Removal Instructions */}
                {broker.removalInstructions && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium text-sm mb-1">Инструкции по удалению:</p>
                        <p className="text-xs text-muted-foreground">
                          {broker.removalInstructions}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {broker.tags && broker.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1">
                      {broker.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  {broker.privacyPolicyUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                      data-testid={`button-privacy-${broker.id}`}
                    >
                      <a href={broker.privacyPolicyUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-1" />
                        Политика конфиденциальности
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBrokers.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Операторы не найдены</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить параметры поиска или фильтров
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
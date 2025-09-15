import { useState, useMemo, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Calendar, Clock, User, Rss, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Types for blog articles
interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  author: string;
  readingTime: number;
  featured: boolean;
  views: number;
}

// Mock blog articles with realistic Russian content
const mockArticles: BlogArticle[] = [
  {
    id: '1',
    title: 'Новые требования 152-ФЗ: что изменилось в 2025 году',
    slug: 'new-152-fz-requirements-2025',
    description: 'Разбираем ключевые изменения в законодательстве о персональных данных, вступившие в силу с 1 января 2025 года, и их влияние на бизнес.',
    content: 'Подробный анализ новых требований...',
    category: '152-ФЗ',
    tags: ['закон', 'персональные данные', 'обновления'],
    publishedAt: '2025-01-15T09:00:00.000Z',
    author: 'Мария Петрова',
    readingTime: 8,
    featured: true,
    views: 2847
  },
  {
    id: '2',
    title: 'GDPR vs 152-ФЗ: сравнительный анализ требований к защите данных',
    slug: 'gdpr-vs-152-fz-comparison',
    description: 'Сравниваем европейские и российские стандарты защиты персональных данных. Что общего и в чем различия для международного бизнеса.',
    content: 'Детальное сравнение регулирований...',
    category: 'Data Privacy',
    tags: ['GDPR', '152-ФЗ', 'сравнение', 'международное право'],
    publishedAt: '2025-01-08T14:30:00.000Z',
    author: 'Александр Соколов',
    readingTime: 12,
    featured: false,
    views: 1923
  },
  {
    id: '3',
    title: 'Автоматическое удаление данных: новые возможности платформы',
    slug: 'automatic-data-deletion-features',
    description: 'Представляем новый функционал ReScrub для автоматического удаления данных по расписанию и соблюдения требований "права на забвение".',
    content: 'Обзор новых функций платформы...',
    category: 'Platform Updates',
    tags: ['обновления', 'автоматизация', 'право на забвение'],
    publishedAt: '2024-12-28T10:15:00.000Z',
    author: 'Дмитрий Волков',
    readingTime: 6,
    featured: true,
    views: 3421
  },
  {
    id: '4',
    title: 'Как настроить мониторинг соответствия 152-ФЗ в вашей компании',
    slug: 'setup-152-fz-compliance-monitoring',
    description: 'Пошаговое руководство по внедрению системы мониторинга соответствия требованиям законодательства о персональных данных.',
    content: 'Подробный гид по настройке мониторинга...',
    category: 'Guides',
    tags: ['руководство', 'мониторинг', 'соответствие'],
    publishedAt: '2024-12-20T16:45:00.000Z',
    author: 'Елена Иванова',
    readingTime: 15,
    featured: false,
    views: 1654
  },
  {
    id: '5',
    title: 'Штрафы за нарушение 152-ФЗ в 2025: статистика и тренды',
    slug: 'fines-152-fz-violations-2025-stats',
    description: 'Анализируем статистику штрафов Роскомнадзора за нарушения в области защиты персональных данных и основные причины нарушений.',
    content: 'Статистический анализ нарушений...',
    category: '152-ФЗ',
    tags: ['штрафы', 'статистика', 'Роскомнадзор'],
    publishedAt: '2024-12-15T11:20:00.000Z',
    author: 'Андрей Смирнов',
    readingTime: 9,
    featured: false,
    views: 2156
  },
  {
    id: '6',
    title: 'Интеграция с популярными CRM: защита данных клиентов',
    slug: 'crm-integration-customer-data-protection',
    description: 'Обеспечиваем защиту персональных данных при интеграции ReScrub с популярными CRM-системами: Битрикс24, amoCRM, Salesforce.',
    content: 'Руководство по интеграции с CRM...',
    category: 'Guides',
    tags: ['интеграция', 'CRM', 'защита данных'],
    publishedAt: '2024-12-05T13:10:00.000Z',
    author: 'Ольга Козлова',
    readingTime: 11,
    featured: false,
    views: 987
  },
  {
    id: '7',
    title: 'Право на забвение в цифровую эпоху: практические аспекты',
    slug: 'right-to-be-forgotten-digital-age',
    description: 'Исследуем практическую реализацию права на забвение в России и Европе. Технические и юридические вызовы современности.',
    content: 'Анализ права на забвение...',
    category: 'Data Privacy',
    tags: ['право на забвение', 'цифровые права', 'технологии'],
    publishedAt: '2024-11-28T09:30:00.000Z',
    author: 'Мария Петрова',
    readingTime: 10,
    featured: true,
    views: 1789
  },
  {
    id: '8',
    title: 'Безопасность API: защита персональных данных в веб-сервисах',
    slug: 'api-security-personal-data-protection',
    description: 'Лучшие практики обеспечения безопасности API при работе с персональными данными. Шифрование, аутентификация и мониторинг.',
    content: 'Руководство по безопасности API...',
    category: 'Guides',
    tags: ['API', 'безопасность', 'веб-сервисы'],
    publishedAt: '2024-11-22T15:25:00.000Z',
    author: 'Владимир Кузнецов',
    readingTime: 14,
    featured: false,
    views: 1432
  }
];

const categories = [
  { name: 'Все статьи', slug: 'all', count: 8 },
  { name: 'Data Privacy', slug: 'data-privacy', count: 2 },
  { name: '152-ФЗ', slug: '152-fz', count: 2 },
  { name: 'Platform Updates', slug: 'platform-updates', count: 1 },
  { name: 'Guides', slug: 'guides', count: 3 }
];

// Format date in Russian
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Moscow'
  };
  return date.toLocaleDateString('ru-RU', options);
};

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'views'>('date');
  
  const articlesPerPage = 6;

  // SEO Meta Tags Management
  useEffect(() => {
    // Update document title
    document.title = 'Блог ReScrub - Защита персональных данных и 152-ФЗ';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Читайте актуальные статьи о защите персональных данных, соблюдении 152-ФЗ, GDPR и цифровой безопасности. Экспертные материалы от команды ReScrub.');
    }

    // Add Open Graph tags
    const addOrUpdateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    addOrUpdateMeta('og:title', 'Блог ReScrub - Защита персональных данных');
    addOrUpdateMeta('og:description', 'Экспертные статьи о защите данных, 152-ФЗ и цифровой безопасности');
    addOrUpdateMeta('og:type', 'website');
    addOrUpdateMeta('og:url', window.location.href);
    addOrUpdateMeta('og:site_name', 'ReScrub');
    
    // Twitter Card tags
    const addOrUpdateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    addOrUpdateTwitterMeta('twitter:card', 'summary_large_image');
    addOrUpdateTwitterMeta('twitter:title', 'Блог ReScrub - Защита персональных данных');
    addOrUpdateTwitterMeta('twitter:description', 'Экспертные статьи о защите данных, 152-ФЗ и цифровой безопасности');

    // Structured Data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Блог ReScrub",
      "description": "Экспертные статьи о защите персональных данных, соблюдении 152-ФЗ и цифровой безопасности",
      "url": window.location.href,
      "publisher": {
        "@type": "Organization",
        "name": "ReScrub",
        "url": window.location.origin
      },
      "blogPost": mockArticles.slice(0, 5).map(article => ({
        "@type": "BlogPosting",
        "headline": article.title,
        "description": article.description,
        "author": {
          "@type": "Person",
          "name": article.author
        },
        "datePublished": article.publishedAt,
        "articleSection": article.category,
        "keywords": article.tags.join(', '),
        "wordCount": Math.round(article.readingTime * 200) // Approximate word count
      }))
    };

    // Add or update structured data script
    let structuredDataScript = document.querySelector('#blog-structured-data') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'blog-structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

    // Cleanup function
    return () => {
      // Remove blog-specific meta tags when component unmounts
      document.title = 'ReScrub - Защита ваших персональных данных';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'ReScrub - российская платформа для защиты персональных данных в соответствии с 152-ФЗ. Автоматическое удаление данных с сайтов брокеров данных.');
      }
    };
  }, []);

  // Filter and search articles
  const filteredArticles = useMemo(() => {
    let filtered = mockArticles;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => 
        article.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort articles
    filtered.sort((a, b) => {
      if (sortBy === 'views') {
        return b.views - a.views;
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
    
    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  // Popular articles (by views)
  const popularArticles = useMemo(() => {
    return [...mockArticles]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }, []);

  // Recent articles
  const recentArticles = useMemo(() => {
    return [...mockArticles]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Blog Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Блог ReScrub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Актуальные статьи о защите персональных данных, соблюдении 152-ФЗ и цифровой безопасности
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Поиск по статьям..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-blog-search"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'date' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('date')}
                    data-testid="button-sort-date"
                  >
                    По дате
                  </Button>
                  <Button
                    variant={sortBy === 'views' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('views')}
                    data-testid="button-sort-views"
                  >
                    По популярности
                  </Button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.slug ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category.slug);
                      setCurrentPage(1);
                    }}
                    data-testid={`button-category-${category.slug}`}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {paginatedArticles.map((article) => (
                <Card key={article.id} className="hover-elevate overflow-hidden">
                  {/* Featured Image Placeholder */}
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">
                      {article.category}
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" data-testid={`badge-category-${article.id}`}>
                        {article.category}
                      </Badge>
                      {article.featured && (
                        <Badge variant="outline" data-testid={`badge-featured-${article.id}`}>
                          Рекомендуем
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-display text-xl font-medium leading-tight hover:text-primary transition-colors">
                      <Link href={`/blog/${article.slug}`} data-testid={`link-article-${article.id}`}>
                        {article.title}
                      </Link>
                    </h3>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-4 leading-relaxed" data-testid={`text-description-${article.id}`}>
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1" data-testid={`text-date-${article.id}`}>
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.publishedAt)}
                        </div>
                        <div className="flex items-center gap-1" data-testid={`text-reading-time-${article.id}`}>
                          <Clock className="h-3 w-3" />
                          {article.readingTime} мин
                        </div>
                      </div>
                      <div className="flex items-center gap-1" data-testid={`text-author-${article.id}`}>
                        <User className="h-3 w-3" />
                        {article.author}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs" data-testid={`badge-tag-${article.id}-${index}`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Назад
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      data-testid={`button-page-${page}`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  data-testid="button-next-page"
                >
                  Вперед
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <h3 className="text-display font-medium">Категории</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.slug}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => {
                          setSelectedCategory(category.slug);
                          setCurrentPage(1);
                        }}
                        data-testid={`sidebar-category-${category.slug}`}
                      >
                        <span>{category.name}</span>
                        <span className="text-muted-foreground">({category.count})</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Articles */}
              <Card>
                <CardHeader>
                  <h3 className="text-display font-medium">Популярные статьи</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {popularArticles.map((article, index) => (
                      <div key={article.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                        <Link href={`/blog/${article.slug}`} data-testid={`sidebar-popular-${article.id}`}>
                          <h4 className="text-sm font-medium leading-snug hover:text-primary transition-colors mb-1">
                            {article.title}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{article.views.toLocaleString('ru-RU')} просмотров</span>
                          <span>•</span>
                          <span>{article.readingTime} мин</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <h3 className="text-display font-medium">Последние публикации</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {recentArticles.map((article) => (
                      <div key={article.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                        <Link href={`/blog/${article.slug}`} data-testid={`sidebar-recent-${article.id}`}>
                          <h4 className="text-sm font-medium leading-snug hover:text-primary transition-colors mb-1">
                            {article.title}
                          </h4>
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(article.publishedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* RSS Subscription */}
              <Card>
                <CardHeader>
                  <h3 className="text-display font-medium flex items-center gap-2">
                    <Rss className="h-4 w-4" />
                    RSS подписка
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    Подпишитесь на RSS для получения последних обновлений блога
                  </p>
                  <Button size="sm" variant="outline" disabled data-testid="button-rss-subscribe">
                    В разработке
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
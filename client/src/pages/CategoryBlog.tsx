import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRight, Calendar, Clock, User, Search, Filter, ArrowLeft, Telescope } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SEO } from '@/components/SEO';
import SidebarCTA from '@/components/SidebarCTA';
import StickyBottomCTA from '@/components/StickyBottomCTA';
import { useQuery } from '@tanstack/react-query';
import {
  createEnhancedBlogArticle,
  generateBreadcrumbJsonLd,
  SEO_CONSTANTS
} from '@shared/seo';
import { type BlogArticle } from '@/data/blogArticles';
import { getCategoryInfoBySlug, SLUG_TO_CATEGORY, generateCategoryMeta, getCategoryCanonicalUrl } from '@shared/categories';


export default function CategoryBlog() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Map URL slug to actual category name using centralized functions
  const categoryName = SLUG_TO_CATEGORY[categorySlug || ''];
  const categoryInfo = getCategoryInfoBySlug(categorySlug || '');
  
  // Fetch articles from API
  const { data: articlesResponse, isLoading, error } = useQuery({
    queryKey: ['/api/blog/articles'],
    select: (data: any) => data.articles as BlogArticle[]
  });
  
  const articles = articlesResponse || [];
  
  // Filter articles by category
  const categoryArticles = articles.filter(article => article.category === categoryName);
  
  // Apply search filter
  const filteredArticles = categoryArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Enhanced articles with SEO features
  const enhancedArticles = filteredArticles.map(article => createEnhancedBlogArticle(article));
  
  // Get featured articles from this category
  const featuredArticles = categoryArticles.filter(article => article.featured).slice(0, 3);
  
  // If category not found
  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Категория не найдена</h1>
          <p className="text-muted-foreground mb-8">
            Запрашиваемая категория не существует.
          </p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться к блогу
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = categoryInfo.icon;

  return (
    <>
      <SEO 
        title={`${categoryInfo.displayName} - Блог GrandHub | Защита персональных данных`}
        description={categoryInfo.seoDescription}
        canonical={getCategoryCanonicalUrl(categorySlug || '')}
        openGraph={{
          title: `${categoryInfo.displayName} - Экспертные статьи по защите данных`,
          description: categoryInfo.seoDescription,
          type: 'website',
          url: `https://grandhub.com/blog/category/${categorySlug}`,
          images: [{
            url: `https://grandhub.com/api/og/category/${categorySlug}`,
            width: 1200,
            height: 630,
            alt: `${categoryInfo.displayName} - GrandHub`
          }]
        }}
        jsonLd={generateBreadcrumbJsonLd([
          { name: 'Главная', url: '/' },
          { name: 'Блог', url: '/blog' },
          { name: categoryInfo.displayName, url: `/blog/category/${categorySlug}` }
        ])}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8" data-testid="main-category-blog">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" data-testid="category-breadcrumbs">
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Блог
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{categoryInfo.displayName}</span>
          </nav>

          {/* Category Header */}
          <div className="text-center mb-12" data-testid="category-header">
            <div className="flex justify-center mb-6">
              <div className={`p-6 rounded-full ${categoryInfo.color} ${categoryInfo.darkColor}`}>
                <IconComponent className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4" data-testid="text-category-title">
              {categoryInfo.displayName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6" data-testid="text-category-description">
              {categoryInfo.description}
            </p>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <span>{categoryArticles.length} статей</span>
              <span>•</span>
              <span>{featuredArticles.length} рекомендуемых</span>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8" data-testid="loading-articles">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Загружаем статьи...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8" data-testid="error-articles">
              <p className="text-destructive mb-4">Ошибка загрузки статей</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Попробовать снова
              </Button>
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && (
            <>
              {/* Search */}
              <div className="flex flex-col md:flex-row gap-4 mb-8" data-testid="search-section">
                <div className="relative flex-1" data-testid="search-container">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={`Поиск в категории "${categoryInfo.displayName}"...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
                <Link href="/blog">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Все категории
                  </Button>
                </Link>
              </div>

              {/* No articles message */}
              {categoryArticles.length === 0 && (
                <div className="text-center py-12" data-testid="no-category-articles">
                  <p className="text-lg text-muted-foreground mb-4">
                    В категории "{categoryInfo.displayName}" пока нет статей
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Мы регулярно добавляем новые материалы. Следите за обновлениями!
                  </p>
                  <Link href="/blog">
                    <Button variant="outline">
                      Посмотреть все статьи
                    </Button>
                  </Link>
                </div>
              )}

              {/* Featured Articles */}
              {featuredArticles.length > 0 && (
                <section className="mb-12" data-testid="featured-articles-section">
                  <h2 className="text-2xl font-bold mb-6">Рекомендуемые статьи в категории</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {featuredArticles.map((article) => (
                      <Card key={article.id} className="hover-elevate transition-all duration-200" data-testid={`card-featured-article-${article.id}`}>
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant="outline" 
                              className={`${categoryInfo.color} ${categoryInfo.darkColor} border`}
                              data-testid={`badge-category-${article.id}`}
                            >
                              <IconComponent className="h-3 w-3 mr-1" />
                              {categoryInfo.displayName}
                            </Badge>
                            <Badge variant="outline" data-testid={`badge-featured-${article.id}`}>Рекомендуется</Badge>
                          </div>
                          <CardTitle className="line-clamp-2" data-testid={`text-article-title-${article.id}`}>
                            {article.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-3" data-testid={`text-article-description-${article.id}`}>
                            {article.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span data-testid={`text-publish-date-${article.id}`}>
                                {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span data-testid={`text-reading-time-${article.id}`}>{article.readingTime} мин</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs" data-testid={`badge-tag-${tag}-${article.id}`}>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link href={`/blog/${article.slug}`}>
                            <Button className="w-full group" data-testid={`button-read-article-${article.id}`}>
                              Читать статью
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* All Articles in Category */}
              {filteredArticles.length > 0 && (
                <section data-testid="category-articles-section">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                      {searchTerm ? 'Результаты поиска' : `Все статьи в категории "${categoryInfo.displayName}"`}
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      {filteredArticles.length} статей найдено
                    </div>
                  </div>

                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-12" data-testid="no-search-results">
                      <p className="text-lg text-muted-foreground mb-4">По вашему запросу ничего не найдено</p>
                      <p className="text-sm text-muted-foreground mb-6">
                        Попробуйте изменить запрос или посмотрите другие статьи в категории
                      </p>
                      <Button 
                        onClick={() => setSearchTerm('')}
                        variant="outline"
                        data-testid="button-clear-search"
                      >
                        Очистить поиск
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {filteredArticles.map((article) => (
                        <Card key={article.id} className="hover-elevate transition-all duration-200" data-testid={`card-article-${article.id}`}>
                          <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant="outline" 
                                className={`${categoryInfo.color} ${categoryInfo.darkColor} border`}
                                data-testid={`badge-category-${article.id}`}
                              >
                                <IconComponent className="h-3 w-3 mr-1" />
                                {categoryInfo.displayName}
                              </Badge>
                              {article.featured && (
                                <Badge variant="outline" data-testid={`badge-featured-${article.id}`}>Рекомендуется</Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl" data-testid={`text-article-title-${article.id}`}>
                              {article.title}
                            </CardTitle>
                            <CardDescription className="text-base" data-testid={`text-article-description-${article.id}`}>
                              {article.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span data-testid={`text-author-${article.id}`}>{article.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span data-testid={`text-publish-date-${article.id}`}>
                                  {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span data-testid={`text-reading-time-${article.id}`}>{article.readingTime} мин</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {article.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs" data-testid={`badge-tag-${tag}-${article.id}`}>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Link href={`/blog/${article.slug}`}>
                              <Button className="group" data-testid={`button-read-article-${article.id}`}>
                                Читать полностью
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </>
          )}
          {/* Category Sidebar CTA */}
          <div className="mt-12">
            <div className="max-w-sm mx-auto">
              <SidebarCTA 
                category={categoryName as keyof typeof import('@shared/cta-config').CATEGORY_CTA_CONTENT}
                compact={false}
                sticky={false}
                variant="promo"
                className="mb-8"
                data-testid="category-sidebar-cta"
              />
            </div>
          </div>
        </main>
        
        {/* Sticky Bottom CTA */}
        <StickyBottomCTA 
          showOnScroll={true}
          hideOnFooter={true}
          data-testid="category-sticky-cta"
        />
        
        <Footer />
      </div>
    </>
  );
}
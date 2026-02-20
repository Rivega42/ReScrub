import { useState, useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRight, Calendar, Clock, User, Search, Filter, ArrowLeft, ExternalLink, Telescope } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SEO } from '@/components/SEO';
import PromoCodeBanner from '@/components/PromoCodeBanner';
import StickyBottomCTA from '@/components/StickyBottomCTA';
import { useQuery } from '@tanstack/react-query';
import { 
  createEnhancedBlogArticle,
  generateBreadcrumbJsonLd,
  SEO_CONSTANTS
} from '@shared/seo';
import { type BlogArticle } from '@/data/blogArticles';
import { BLOG_CATEGORIES, getAllCategoriesSorted, getCategoryUrl } from '@shared/categories';


// Blog listing component
export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Fetch articles from API
  const { data: articlesResponse, isLoading, error } = useQuery({
    queryKey: ['/api/blog/articles'],
    select: (data: any) => data.articles as BlogArticle[]
  });
  
  const articles = articlesResponse || [];
  
  // Enhanced articles with SEO features
  const enhancedArticles = articles.map(article => createEnhancedBlogArticle(article));
  
  // Categories for filtering
  const categories = Array.from(new Set(articles.map(article => article.category)));
  
  // Featured and recent articles
  const featuredArticles = articles.filter(article => article.featured).slice(0, 3);
  const recentArticles = articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO 
        title="Блог GrandHub: защита персональных данных и приватность в России"
        description="Экспертные статьи о защите персональных данных, 152-ФЗ, удалении данных из российских сервисов. Пошаговые инструкции и практические советы."
        canonical="/blog"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Promo Banner - Above the fold */}
        <div className="container mx-auto px-4 pt-4">
          <PromoCodeBanner 
            promoKey="RESCRUB55"
            autoRotate={true}
            className="mb-4"
            data-testid="blog-promo-banner"
          />
        </div>
        
        <main className="container mx-auto px-4 py-8" data-testid="main-blog">
          {/* Blog Header */}
          <div className="text-center mb-12" data-testid="blog-header">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-blog-title">
              Блог о защите персональных данных
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-blog-description">
              Экспертные статьи, пошаговые инструкции и актуальные новости о приватности в российском интернете
            </p>
          </div>

          {/* Category Navigation */}
          <section className="mb-12" data-testid="category-navigation">
            <h2 className="text-2xl font-bold mb-6 text-center">Выберите категорию</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* All Categories Button */}
              <Card 
                className={`cursor-pointer transition-all duration-200 hover-elevate ${
                  selectedCategory === '' 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedCategory('')}
                data-testid="category-card-all"
              >
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`p-3 rounded-full ${selectedCategory === '' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <Telescope className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Все статьи</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Просмотреть все материалы
                      </p>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {articles.length} статей
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Cards */}
              {getAllCategoriesSorted().map((category) => {
                const IconComponent = category.icon;
                const articlesInCategory = articles.filter(article => article.category === category.key);
                const isSelected = selectedCategory === category.key;
                
                return (
                  <Link href={getCategoryUrl(category.key)}>
                    <Card 
                      key={category.key}
                      className={`cursor-pointer transition-all duration-200 hover-elevate ${
                        isSelected 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:shadow-md'
                      }`}
                      data-testid={`category-card-${category.slug}`}
                    >
                    <CardContent className="p-4 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className={`p-3 rounded-full transition-colors ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground' 
                            : `${category.color} ${category.darkColor}`
                        }`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{category.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {category.description}
                          </p>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {articlesInCategory.length} статей
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                );
              })}
            </div>
          </section>

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
          {!isLoading && !error && articles.length === 0 && (
            <div className="text-center py-8" data-testid="no-articles">
              <p className="text-muted-foreground">Статьи не найдены</p>
            </div>
          )}

          {!isLoading && !error && articles.length > 0 && (
            <>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-8" data-testid="search-filter-section">
                <div className="relative flex-1" data-testid="search-container">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Поиск по статьям..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
                <div className="flex items-center gap-2" data-testid="filter-container">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background"
                    data-testid="select-category"
                  >
                    <option value="">Все категории</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Featured Articles */}
              {featuredArticles.length > 0 && (
                <section className="mb-12" data-testid="featured-articles-section">
                  <h2 className="text-2xl font-bold mb-6" data-testid="text-featured-articles-title">Рекомендуемые статьи</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                {featuredArticles.map((article) => (
                  <Card key={article.id} className="hover-elevate transition-all duration-200" data-testid={`card-featured-article-${article.id}`}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {BLOG_CATEGORIES[article.category as keyof typeof BLOG_CATEGORIES] ? (
                          <Badge 
                            variant="outline" 
                            className={`${BLOG_CATEGORIES[article.category as keyof typeof BLOG_CATEGORIES].color} ${BLOG_CATEGORIES[article.category as keyof typeof BLOG_CATEGORIES].darkColor} border`}
                            data-testid={`badge-category-${article.id}`}
                          >
                            {React.createElement(BLOG_CATEGORIES[article.category as keyof typeof BLOG_CATEGORIES].icon, { className: "h-3 w-3 mr-1" })}
                            {article.category}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" data-testid={`badge-category-${article.id}`}>{article.category}</Badge>
                        )}
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

              {/* All Articles */}
              <section data-testid="all-articles-section">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" data-testid="text-all-articles-title">
                    {searchTerm || selectedCategory ? 'Результаты поиска' : 'Все статьи'}
                  </h2>
                  <div className="text-sm text-muted-foreground" data-testid="text-results-count">
                    {filteredArticles.length} статей найдено
                  </div>
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="text-center py-12" data-testid="no-articles-message">
                    <p className="text-lg text-muted-foreground mb-4">Статьи не найдены</p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Попробуйте изменить параметры поиска или выбрать другую категорию
                    </p>
                    <Button 
                      onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                      variant="outline"
                      data-testid="button-clear-filters"
                    >
                      Сбросить фильтры
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {filteredArticles.map((article) => (
                      <Card key={article.id} className="hover-elevate transition-all duration-200" data-testid={`card-article-${article.id}`}>
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            {BLOG_CATEGORIES[article.category as keyof typeof BLOG_CATEGORIES] ? (
                              <Badge 
                                variant="outline" 
                                className={`${BLOG_CATEGORIES[article.category as keyof typeof BLOG_CATEGORIES].color} ${BLOG_CATEGORIES[article.category as keyof typeof BLOG_CATEGORIES].darkColor} border`}
                                data-testid={`badge-category-${article.id}`}
                              >
                                {React.createElement(BLOG_CATEGORIES[article.category as keyof typeof BLOG_CATEGORIES].icon, { className: "h-3 w-3 mr-1" })}
                                {article.category}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" data-testid={`badge-category-${article.id}`}>{article.category}</Badge>
                            )}
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
                        <div className="flex items-center gap-1">
                          <ExternalLink className="h-4 w-4" />
                          <span data-testid={`text-views-${article.id}`}>{article.views.toLocaleString()} просмотров</span>
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
            </>
          )}
        </main>
        
        {/* Sticky Bottom CTA */}
        <StickyBottomCTA 
          showOnScroll={true}
          hideOnFooter={true}
          data-testid="blog-sticky-cta"
        />
        
        <Footer />
      </div>
    </>
  );
}
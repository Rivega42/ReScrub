import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Share2,
  BookOpen,
  Tag,
  Network,
  TrendingUp,
  ExternalLink,
  ArrowRight,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SEO, BlogSEO } from '@/components/SEO';
import ReactMarkdown from 'react-markdown';
import { useMemo } from 'react';
import TableOfContents from '@/components/TableOfContents';
import KeyInsights, { generateInsightsFromContent } from '@/components/KeyInsights';
import {
  EnhancedBlogArticle,
  createEnhancedBlogArticle,
  generateInternalLinks,
  buildEnhancedArticleJsonLd,
  generateRussianSEO,
  generateSearchBotHints,
  generateBreadcrumbJsonLd,
  SEO_CONSTANTS
} from '@shared/seo';
import { type BlogArticle } from '@/data/blogArticles';

// Helper functions for robust anchor processing
function childrenToText(children: any): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return children.toString();
  if (Array.isArray(children)) return children.map(childrenToText).join('');
  if (children && children.props && children.props.children) {
    return childrenToText(children.props.children);
  }
  return '';
}

// Enhanced anchor generation function
function createHeadingId(children: any, existingIds: Set<string>): string {
  const baseText = childrenToText(children);
  
  // Look for existing ID in braces like {#my-id}
  const idMatch = baseText.match(/\{#([^}]+)\}/);
  if (idMatch) {
    return idMatch[1];
  }
  
  // Generate from text
  const baseId = baseText
    .toLowerCase()
    .replace(/[^а-яёa-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 50);
    
  // Generate unique ID directly
  if (!existingIds.has(baseId)) {
    existingIds.add(baseId);
    return baseId;
  }
  
  // Find next available ID with counter
  let counter = 1;
  let uniqueId = `${baseId}-${counter}`;
  while (existingIds.has(uniqueId)) {
    counter++;
    uniqueId = `${baseId}-${counter}`;
  }
  
  existingIds.add(uniqueId);
  return uniqueId;
}

function cleanTextFromId(children: any): any {
  if (typeof children === 'string') {
    return children.replace(/\s*\{#[^}]+\}/, '');
  }
  if (Array.isArray(children)) {
    return children.map(child => 
      typeof child === 'string' 
        ? child.replace(/\s*\{#[^}]+\}/, '') 
        : child
    );
  }
  return children;
}

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  
  // Fetch the article by slug from API
  const { data: articleResponse, isLoading, error } = useQuery({
    queryKey: ['/api/blog/articles', slug],
    select: (data: any) => data.article as BlogArticle,
    enabled: !!slug
  });
  
  const article = articleResponse;
  
  // Convert to enhanced article with advanced SEO
  const enhancedArticle = useMemo(() => {
    if (!article) return null;
    return createEnhancedBlogArticle(article);
  }, [article]);
  
  // For now, skip internal linking until we have full article API integration
  // TODO: Load all articles from API for internal linking
  const allEnhancedArticles: EnhancedBlogArticle[] = [];
  
  // Generate internal links for this article
  const internalLinks = useMemo(() => {
    if (!enhancedArticle) return [];
    return generateInternalLinks(enhancedArticle, allEnhancedArticles);
  }, [enhancedArticle, allEnhancedArticles]);
  
  // Get related articles
  const relatedArticles = internalLinks.slice(0, 4);
  
  // Generate key insights from article content
  const keyInsights = useMemo(() => {
    if (!article) return [];
    return generateInsightsFromContent(article.content, article.category);
  }, [article]);
  
  // Generate Russian SEO signals
  const russianSEO = useMemo(() => {
    if (!article) return null;
    return generateRussianSEO({
      title: article.title,
      content: article.content,
      readingTime: article.readingTime
    });
  }, [article]);
  
  // Generate search bot hints
  const botHints = useMemo(() => {
    if (!article) return null;
    return generateSearchBotHints({
      title: article.title,
      content: article.content,
      category: article.category
    });
  }, [article]);
  
  // Format published date
  const publishedDate = article ? new Date(article.publishedAt).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  
  // Handle share functionality
  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Create stable ID tracker per article  
  const existingIds = useMemo(() => new Set<string>(), [article?.id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загружаем статью...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error or not found
  if (error || !article || !enhancedArticle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4" data-testid="text-article-not-found">Статья не найдена</h1>
          <p className="text-muted-foreground mb-8" data-testid="text-article-not-found-description">
            Запрашиваемая статья не существует или была удалена.
          </p>
          <Link href="/blog">
            <Button data-testid="button-back-to-blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться к блогу
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Enhanced JSON-LD structured data
  const jsonLd = enhancedArticle ? buildEnhancedArticleJsonLd(enhancedArticle, `/blog/${article.slug}`) : null;
  
  // Enhanced breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://rescrub.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Блог",
        "item": "https://rescrub.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://rescrub.com/blog/${article.slug}`
      }
    ]
  };

  return (
    <>
      <SEO 
        title={article.title}
        description={article.description || enhancedArticle.description}
        canonical={`/blog/${article.slug}`}
        type="article"
        publishedTime={article.publishedAt}
        modifiedTime={article.publishedAt}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <article className="container mx-auto px-4 py-8 max-w-7xl" data-testid="article-content">
          {/* Navigation */}
          <nav className="mb-8" data-testid="article-navigation">
            <Link href="/blog">
              <Button variant="outline" size="sm" data-testid="button-back-to-blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к блогу
              </Button>
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12" data-testid="article-header">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" data-testid="badge-article-category">{article.category}</Badge>
              {article.featured && (
                <Badge variant="outline" data-testid="badge-article-featured">Рекомендуется</Badge>
              )}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent" data-testid="text-article-title">
              {article.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-4xl" data-testid="text-article-description">
              {article.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1" data-testid="article-author">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1" data-testid="article-date">
                <Calendar className="h-4 w-4" />
                <span>{publishedDate}</span>
              </div>
              <div className="flex items-center gap-1" data-testid="article-reading-time">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} мин чтения</span>
              </div>
              <div className="flex items-center gap-1" data-testid="article-views">
                <Eye className="h-4 w-4" />
                <span>{article.views.toLocaleString()} просмотров</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-wrap gap-1">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs" data-testid={`badge-tag-${tag}`}>
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                data-testid="button-share-article"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Поделиться
              </Button>
            </div>
          </header>
          
          <Separator className="mb-12" />

          {/* Key Insights */}
          <div className="mb-12">
            <KeyInsights 
              insights={keyInsights}
              readingTime={article.readingTime}
              category={article.category}
            />
          </div>

          {/* Main Content Area with Sidebar Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            {/* Table of Contents Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <TableOfContents 
                content={article.content}
                readingTime={article.readingTime}
                className="lg:sticky lg:top-24"
              />
            </div>

            {/* Article Content */}
            <div className="lg:col-span-3 order-1 lg:order-2" data-testid="article-markdown-content">
              <div className="prose prose-lg max-w-none prose-headings:scroll-mt-24 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-li:leading-relaxed prose-blockquote:border-l-primary prose-blockquote:bg-muted/20 prose-blockquote:not-italic prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown
              components={{
                h1: ({ children, ...props }) => {
                  const id = createHeadingId(children, existingIds);
                  existingIds.add(id);
                  return (
                    <h1 
                      id={id} 
                      className="text-3xl font-bold mt-8 mb-4 scroll-mt-16" 
                      data-testid={`heading-1-${id}`}
                      {...props}
                    >
                      {cleanTextFromId(children)}
                    </h1>
                  );
                },
                h2: ({ children, ...props }) => {
                  const id = createHeadingId(children, existingIds);
                  existingIds.add(id);
                  return (
                    <h2 
                      id={id} 
                      className="text-2xl font-semibold mt-8 mb-4 scroll-mt-16" 
                      data-testid={`heading-2-${id}`}
                      {...props}
                    >
                      {cleanTextFromId(children)}
                    </h2>
                  );
                },
                h3: ({ children, ...props }) => {
                  const id = createHeadingId(children, existingIds);
                  existingIds.add(id);
                  return (
                    <h3 
                      id={id} 
                      className="text-xl font-semibold mt-6 mb-3 scroll-mt-16" 
                      data-testid={`heading-3-${id}`}
                      {...props}
                    >
                      {cleanTextFromId(children)}
                    </h3>
                  );
                },
                h4: ({ children, ...props }) => {
                  const id = createHeadingId(children, existingIds);
                  existingIds.add(id);
                  return (
                    <h4 
                      id={id} 
                      className="text-lg font-semibold mt-6 mb-3 scroll-mt-16" 
                      data-testid={`heading-4-${id}`}
                      {...props}
                    >
                      {cleanTextFromId(children)}
                    </h4>
                  );
                },
                p: ({ children, ...props }) => (
                  <p className="mb-4 leading-relaxed" {...props}>
                    {children}
                  </p>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="mb-4 space-y-2 list-disc list-inside" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="mb-4 space-y-2 list-decimal list-inside" {...props}>
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="leading-relaxed" {...props}>
                    {children}
                  </li>
                ),
                blockquote: ({ children, ...props }) => (
                  <blockquote className="border-l-4 border-primary pl-4 py-2 mb-4 italic bg-muted/50 rounded-r" {...props}>
                    {children}
                  </blockquote>
                ),
                code: ({ children, ...props }) => (
                  <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                ),
                pre: ({ children, ...props }) => (
                  <pre className="bg-muted p-4 rounded mb-4 overflow-x-auto" {...props}>
                    {children}
                  </pre>
                ),
                a: ({ href, children, ...props }) => (
                  <a 
                    href={href} 
                    className="text-primary hover:underline" 
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    {...props}
                  >
                    {children}
                  </a>
                ),
                table: ({ children, ...props }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border border-border rounded" {...props}>
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children, ...props }) => (
                  <thead className="bg-muted" {...props}>
                    {children}
                  </thead>
                ),
                tbody: ({ children, ...props }) => (
                  <tbody {...props}>
                    {children}
                  </tbody>
                ),
                tr: ({ children, ...props }) => (
                  <tr className="border-b border-border" {...props}>
                    {children}
                  </tr>
                ),
                td: ({ children, ...props }) => (
                  <td className="px-4 py-2 text-sm" {...props}>
                    {children}
                  </td>
                ),
                th: ({ children, ...props }) => (
                  <th className="px-4 py-2 text-sm font-semibold text-left" {...props}>
                    {children}
                  </th>
                ),
              }}
            >
              {article.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-12" data-testid="related-articles-section">
              <Separator className="mb-8" />
              <h2 className="text-2xl font-bold mb-6 flex items-center" data-testid="text-related-articles-title">
                <Network className="mr-2 h-6 w-6" />
                Связанные статьи
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Card key={relatedArticle.slug} className="hover-elevate transition-all duration-200" data-testid={`card-related-article-${relatedArticle.slug}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary" data-testid={`badge-related-category-${relatedArticle.slug}`}>
                          {relatedArticle.category}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span>Связанная статья</span>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-2" data-testid={`text-related-title-${relatedArticle.slug}`}>
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2" data-testid={`text-related-description-${relatedArticle.slug}`}>
                        {relatedArticle.linkAnchor || 'Связанная статья по теме'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Чтение</span>
                        </div>
                        <Link href={`/blog/${relatedArticle.slug}`}>
                          <Button variant="ghost" size="sm" className="group" data-testid={`button-read-related-${relatedArticle.slug}`}>
                            Читать
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Article Navigation */}
          <div className="mt-12 pt-8 border-t border-border" data-testid="article-bottom-navigation">
            <div className="flex justify-between items-center">
              <Link href="/blog">
                <Button variant="outline" data-testid="button-back-to-blog-bottom">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Все статьи блога
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleShare}
                data-testid="button-share-article-bottom"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Поделиться статьей
              </Button>
            </div>
          </div>
        </article>
        
        <Footer />
      </div>
    </>
  );
}
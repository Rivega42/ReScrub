import { useMemo } from 'react';
import { 
  PageMeta, 
  buildJsonLd,
  getPageMetaWithFallback,
  DEFAULT_ORGANIZATION_JSONLD,
  DEFAULT_SERVICE_JSONLD,
  SEO_CONSTANTS
} from '@shared/seo';
import { useSEO } from '@/hooks/useSEO';

export interface SEOProps {
  /** Page title (will be used as-is, no site name appending) */
  title?: string;
  /** Meta description for the page */
  description?: string;
  /** Keywords for the page (merged with core keywords) */
  keywords?: string[];
  /** Page type for OpenGraph */
  type?: PageMeta['type'];
  /** Custom canonical URL (auto-generated if not provided) */
  canonical?: string;
  /** OpenGraph image URL */
  ogImage?: string;
  /** Article author (for article type pages) */
  author?: string;
  /** Article published time (for article type pages) */
  publishedTime?: string;
  /** Article modified time (for article type pages) */
  modifiedTime?: string;
  /** Custom robots directive */
  robots?: string;
  /** Current route path (auto-detected if not provided) */
  path?: string;
  /** Base URL for canonical and OG URLs */
  baseUrl?: string;
  /** Whether to include default organization JSON-LD */
  includeOrganizationSchema?: boolean;
  /** Whether to include default service JSON-LD */
  includeServiceSchema?: boolean;
  /** Custom JSON-LD structured data */
  jsonLd?: Record<string, any> | Record<string, any>[];
  /** Article-specific JSON-LD data (for blog posts) */
  articleJsonLd?: {
    headline?: string;
    description?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
  };
}

/**
 * SEO Component for dynamic meta tag management in React SPA
 * 
 * Handles document title, meta descriptions, keywords, canonical links,
 * Open Graph tags, Twitter Cards, and JSON-LD structured data injection.
 * 
 * Designed for Russian localization and 152-ФЗ compliance platform.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <SEO 
 *   title="Панель управления — GrandHub"
 *   description="Управление запросами на удаление персональных данных"
 * />
 * 
 * // Article page with structured data
 * <SEO
 *   title="Как защитить данные по 152-ФЗ"
 *   description="Полное руководство по защите персональных данных"
 *   type="article"
 *   author="GrandHub Team"
 *   publishedTime="2025-01-15"
 *   includeOrganizationSchema
 *   articleJsonLd={{
 *     headline: "Как защитить данные по 152-ФЗ",
 *     description: "Полное руководство по защите персональных данных"
 *   }}
 * />
 * ```
 */
export function SEO({
  title,
  description,
  keywords = [],
  type = 'website',
  canonical,
  ogImage,
  author,
  publishedTime,
  modifiedTime,
  robots,
  path,
  baseUrl = SEO_CONSTANTS.BASE_URL,
  includeOrganizationSchema = false,
  includeServiceSchema = false,
  jsonLd,
  articleJsonLd
}: SEOProps): null {
  // Auto-detect current path if not provided - memoized for performance
  const currentPath = useMemo(() => 
    path || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    [path]
  );
  
  // Get fallback meta from route configuration - memoized
  const fallbackMeta = useMemo(() => 
    getPageMetaWithFallback(currentPath),
    [currentPath]
  );
  
  // Merge keywords: custom + core + fallback - memoized for performance
  const mergedKeywords = useMemo(() => {
    const allKeywords = [
      ...keywords,
      ...SEO_CONSTANTS.CORE_KEYWORDS,
      ...(fallbackMeta.keywords || [])
    ];
    
    // Remove duplicates while preserving order
    return allKeywords.filter((keyword, index, array) => 
      array.indexOf(keyword) === index
    );
  }, [keywords, fallbackMeta.keywords]);

  // Build complete PageMeta object - memoized
  const meta = useMemo((): PageMeta => ({
    title: title || fallbackMeta.title,
    description: description || fallbackMeta.description,
    keywords: mergedKeywords,
    type,
    canonical,
    ogImage: ogImage || fallbackMeta.ogImage,
    author: author || fallbackMeta.author,
    publishedTime,
    modifiedTime,
    robots: robots || fallbackMeta.robots
  }), [
    title, fallbackMeta.title,
    description, fallbackMeta.description,
    mergedKeywords, type, canonical,
    ogImage, fallbackMeta.ogImage,
    author, fallbackMeta.author,
    publishedTime, modifiedTime,
    robots, fallbackMeta.robots
  ]);

  // Build JSON-LD structured data - heavily memoized for performance
  const jsonLdSchemas = useMemo(() => {
    const schemas: Record<string, any>[] = [];

    // Include default organization schema
    if (includeOrganizationSchema) {
      schemas.push(DEFAULT_ORGANIZATION_JSONLD);
    }

    // Include default service schema
    if (includeServiceSchema) {
      schemas.push(DEFAULT_SERVICE_JSONLD);
    }

    // Add article JSON-LD for article type pages
    if (type === 'article' && (articleJsonLd || publishedTime)) {
      const authorName = articleJsonLd?.author || author;
      const articleSchema = buildJsonLd('Article', {
        headline: articleJsonLd?.headline || title || meta.title,
        description: articleJsonLd?.description || description || meta.description,
        author: {
          '@type': 'Organization',
          name: authorName || SEO_CONSTANTS.SITE_NAME,
          url: baseUrl
        },
        datePublished: articleJsonLd?.publishedTime || publishedTime || new Date().toISOString(),
        dateModified: articleJsonLd?.modifiedTime || modifiedTime || new Date().toISOString()
      }, baseUrl);
      
      schemas.push(articleSchema);
    }

    // Add custom JSON-LD schemas
    if (jsonLd) {
      const customSchemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.push(...customSchemas);
    }

    return schemas;
  }, [
    includeOrganizationSchema,
    includeServiceSchema,
    type, articleJsonLd, publishedTime,
    author, title, meta.title,
    description, meta.description,
    baseUrl, jsonLd
  ]);

  // Use the SEO hook for DOM updates - memoized options for performance
  const seoOptions = useMemo(() => ({
    meta,
    path: currentPath,
    baseUrl,
    enableJsonLd: jsonLdSchemas.length > 0,
    jsonLd: jsonLdSchemas.length > 0 ? jsonLdSchemas : undefined
  }), [meta, currentPath, baseUrl, jsonLdSchemas]);

  useSEO(seoOptions);

  // Component renders nothing (all DOM updates handled by hook)
  return null;
}

/**
 * Pre-configured SEO component for dashboard pages
 */
export function DashboardSEO({ 
  title = "Панель управления", 
  description = "Управление защитой персональных данных и запросами на удаление",
  ...props 
}: Omit<SEOProps, 'includeServiceSchema' | 'robots'> = {}) {
  return (
    <SEO
      title={`${title} — ${SEO_CONSTANTS.SITE_NAME}`}
      description={description}
      type="profile"
      robots="noindex, nofollow"
      includeServiceSchema
      {...props}
    />
  );
}

/**
 * Pre-configured SEO component for public landing pages
 */
export function LandingSEO({
  title,
  description,
  ...props
}: Omit<SEOProps, 'includeOrganizationSchema' | 'includeServiceSchema'> = {}) {
  return (
    <SEO
      title={title || `${SEO_CONSTANTS.SITE_NAME} — ${SEO_CONSTANTS.SITE_TAGLINE}`}
      description={description || SEO_CONSTANTS.SITE_DESCRIPTION}
      includeOrganizationSchema
      includeServiceSchema
      {...props}
    />
  );
}

/**
 * Pre-configured SEO component for blog articles
 */
export function BlogSEO({
  title,
  description,
  author = "GrandHub Team",
  publishedTime,
  modifiedTime,
  ...props
}: Omit<SEOProps, 'type' | 'includeOrganizationSchema'> & {
  publishedTime?: string;
  modifiedTime?: string;
}) {
  return (
    <SEO
      title={title ? `${title} — Блог ${SEO_CONSTANTS.SITE_NAME}` : undefined}
      description={description}
      type="article"
      author={author}
      publishedTime={publishedTime}
      modifiedTime={modifiedTime}
      includeOrganizationSchema
      articleJsonLd={{
        headline: title,
        description,
        author,
        publishedTime,
        modifiedTime
      }}
      {...props}
    />
  );
}

/**
 * Pre-configured SEO component for authentication pages
 */
export function AuthSEO({
  title = "Вход в систему",
  description = "Войдите в личный кабинет GrandHub для управления защитой персональных данных",
  ...props
}: Omit<SEOProps, 'robots'> = {}) {
  return (
    <SEO
      title={`${title} — ${SEO_CONSTANTS.SITE_NAME}`}
      description={description}
      robots="noindex, nofollow"
      {...props}
    />
  );
}
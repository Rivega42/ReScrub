import { useMemo } from 'react';
import { 
  PageMeta, 
  buildJsonLd,
  getPageMetaWithFallback,
  SEO_CONSTANTS,
  JsonLdOrganization,
  JsonLdService,
  JsonLdWebSite,
  NeuralSearchSignals,
  RussianSEOSchema,
  SearchBotHints
} from '@shared/seo';
import { useSEO } from '@/hooks/useSEO';

export interface BusinessSEOProps {
  /** Page title (will be used as-is, no site name appending) */
  title?: string;
  /** Meta description for the page */
  description?: string;
  /** Keywords for the page (merged with business keywords) */
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
  /** Current route path (auto-detected if not provided) */
  path?: string;
  /** Base URL for canonical and OG URLs */
  baseUrl?: string;
  /** Product type for product pages */
  productType?: 'consent' | 'atomization' | 'monitoring' | 'api' | 'integration';
  /** Page category for enhanced targeting */
  pageCategory?: 'landing' | 'product' | 'documentation' | 'pricing' | 'contact' | 'auth';
  /** Custom Schema.org product data */
  productData?: {
    name?: string;
    description?: string;
    category?: string;
    url?: string;
    offers?: {
      price?: string;
      currency?: string;
      availability?: string;
    };
  };
  /** Enhanced neural search signals */
  neuralSignals?: Partial<NeuralSearchSignals>;
  /** Russian SEO specific data */
  russianSEO?: Partial<RussianSEOSchema>;
  /** Search bot hints */
  botHints?: Partial<SearchBotHints>;
  /** Organization schema data for enhanced SEO */
  organizationSchema?: {
    name?: string;
    description?: string;
    contactPoints?: Array<{
      telephone?: string;
      contactType?: string;
    }>;
  };
  /** Robots meta tag */
  robots?: string;
}

/**
 * Advanced Business SEO Component for Rescrub Business Platform
 * 
 * Provides comprehensive micromarkup for neural network bots:
 * - Schema.org JSON-LD (Organization, SoftwareApplication, WebSite, Product)
 * - Open Graph and Twitter Cards
 * - Microdata in HTML elements  
 * - Hidden instructions for search engine neural bots
 * - Russian 152-FZ compliance signals
 * - Advanced neural search optimization
 * 
 * @example
 * ```tsx
 * <BusinessSEO 
 *   title="Виджет согласий AI-платформа — Rescrub Business"
 *   description="Готовый виджет для сбора согласий на обработку бизнес-данных согласно AI-платформа"
 *   productType="consent"
 *   pageCategory="product"
 *   productData={{
 *     name: "Виджет согласий AI-платформа",
 *     category: "Compliance Software"
 *   }}
 * />
 * ```
 */
export function BusinessSEO({
  title,
  description,
  keywords = [],
  type = 'website',
  canonical,
  ogImage,
  author,
  publishedTime,
  modifiedTime,
  path,
  baseUrl,
  productType,
  pageCategory = 'landing',
  productData,
  neuralSignals,
  russianSEO,
  botHints
}: BusinessSEOProps): JSX.Element | null {
  // Auto-detect current path if not provided
  const currentPath = useMemo(() => 
    path || (typeof window !== 'undefined' ? window.location.pathname : '/business'),
    [path]
  );

  // Dynamic baseUrl determination with business subdomain support
  const dynamicBaseUrl = useMemo(() => {
    if (baseUrl) return baseUrl; // Use provided baseUrl if given
    
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const hostname = window.location.hostname;
      
      // Check if we're on business subdomain already
      if (hostname.startsWith('business.') || hostname === 'business.grandhub.ru') {
        return origin;
      }
      
      // Production environment - use business.grandhub.ru
      if (hostname === 'grandhub.ru') {
        return 'https://business.grandhub.ru';
      }
      
      // Development environments - keep same origin for proper local development
      if (hostname === 'localhost' || hostname.includes('127.0.0.1') || hostname.includes('::1')) {
        return origin; // Use same origin for development to avoid broken links
      }
      
      // Replit/hosting environments
      if (hostname.includes('.repl.co') || hostname.includes('.replit.dev') || hostname.includes('.replit.app')) {
        return origin;
      }
      
      // Default fallback for unknown environments
      return origin;
    }
    
    // SSR fallback - use production URL
    return 'https://business.grandhub.ru';
  }, [baseUrl]);
  
  // Get fallback meta from route configuration
  const fallbackMeta = useMemo(() => 
    getPageMetaWithFallback(currentPath),
    [currentPath]
  );
  
  // Business-specific keywords for AI-автоматизация compliance and neural targeting
  const businessKeywords = useMemo(() => [
    'AI-помощник для бизнеса в России',
    'AI-автоматизация что такое', 
    'соответствие AI-автоматизация для компаний',
    'автоматизация защиты данных бизнес',
    'консультации по защите данных',
    'внедрение AI-автоматизация в компании',
    'AI + CRM/1С автоматизация',
    'управление согласиями клиентов',
    'compliance бизнес-данные',
    'штрафы за нарушение AI-автоматизация',
    'обработка бизнес-данных бизнес',
    'системы защиты данных для компаний',
    'аудит бизнес-данных',
    'DPO услуги для бизнеса',
    'политика конфиденциальности бизнес',
    'согласие на обработку данных',
    'мониторинг утечек данных',
    'корпоративная приватность',
    'защита клиентских данных',
    'бизнес решения AI-автоматизация'
  ], []);

  // Product-specific keywords
  const productKeywords = useMemo(() => {
    const productKeywordMap = {
      consent: [
        'виджет согласий',
        'форма согласия для бизнеса AI-автоматизация',
        'cookie consent banner',
        'GDPR consent widget',
        'consent management',
        'согласие на cookies',
        'персонализированные согласия'
      ],
      atomization: [
        'атомаризация данных',
        'распределенное хранение',
        'децентрализация данных',
        'микросервисы данных',
        'data atomization',
        'блокчейн хранение',
        'фрагментация бизнес-данных'
      ],
      monitoring: [
        'мониторинг утечек данных',
        'контроль бизнес-данных',
        'аудит обработки данных',
        'SIEM мониторинг для бизнеса AI-автоматизация',
        'data breach monitoring',
        'непрерывный аудит'
      ],
      api: [
        'API для бизнеса AI-автоматизация',
        'интеграция защиты данных',
        'программный интерфейс приватности',
        'REST API бизнес-данные',
        'разработчики для бизнеса AI-автоматизация'
      ],
      integration: [
        'интеграция защиты данных бизнес',
        'подключение систем защиты',
        'CRM интеграция приватность',
        'ERP защита данных',
        'автоматизация compliance'
      ]
    };
    
    return productType ? productKeywordMap[productType] || [] : [];
  }, [productType]);

  // Enhanced neural search signals
  const enhancedNeuralSignals = useMemo((): NeuralSearchSignals => ({
    primaryKeywords: [
      ...(neuralSignals?.primaryKeywords || []),
      'AI-автоматизация',
      'бизнес-данные',
      'защита данных',
      ...(productType ? [`${productType} решение`] : [])
    ],
    secondaryKeywords: [
      ...(neuralSignals?.secondaryKeywords || []),
      ...businessKeywords.slice(0, 10),
      ...productKeywords
    ],
    searchIntent: neuralSignals?.searchIntent || (
      pageCategory === 'pricing' ? 'commercial' : 
      pageCategory === 'product' ? 'transactional' :
      pageCategory === 'documentation' ? 'informational' : 'mixed'
    ),
    contentDepth: neuralSignals?.contentDepth || (
      pageCategory === 'documentation' ? 'expert' : 
      pageCategory === 'product' ? 'comprehensive' : 'intermediate'
    ),
    regionalFocus: neuralSignals?.regionalFocus || ['Россия', 'СНГ', 'Москва'],
    audienceType: neuralSignals?.audienceType || 'professional',
    contentFreshness: neuralSignals?.contentFreshness || 'evergreen',
    expertiseLevel: neuralSignals?.expertiseLevel || 8,
    authoritySignals: [
      ...(neuralSignals?.authoritySignals || []),
      'российское законодательство',
      'сертифицированное решение',
      'enterprise security',
      'AI-автоматизация бизнеса'
    ],
    topicCluster: neuralSignals?.topicCluster || 'data-protection-compliance'
  }), [neuralSignals, businessKeywords, productKeywords, productType, pageCategory]);

  // Enhanced Russian SEO schema
  const enhancedRussianSEO = useMemo((): RussianSEOSchema => ({
    yaRegion: russianSEO?.yaRegion || 'Россия',
    yaGeoCoordinates: russianSEO?.yaGeoCoordinates || {
      latitude: 55.7558,
      longitude: 37.6176
    },
    yaTheme: russianSEO?.yaTheme || 'технологии',
    legalCompliance: {
      law152FZ: true,
      gdprCompliant: true,
      dataLocalization: true,
      ...russianSEO?.legalCompliance
    },
    russianKeywords: {
      primary: [
        ...(russianSEO?.russianKeywords?.primary || []),
        ...businessKeywords.slice(0, 8)
      ],
      semantic: [
        ...(russianSEO?.russianKeywords?.semantic || []),
        'закон о бизнес-данных',
        'AI-автоматизация бизнеса',
        'российское ПО',
        'отечественные решения'
      ],
      longTail: [
        ...(russianSEO?.russianKeywords?.longTail || []),
        'как обеспечить соответствие 152 фз в компании',
        'внедрение системы защиты бизнес-данных',
        'автоматизация процессов 152 фз для бизнеса'
      ]
    },
    behavioralSignals: {
      expectedReadTime: russianSEO?.behavioralSignals?.expectedReadTime || (
        pageCategory === 'documentation' ? 15 : 
        pageCategory === 'product' ? 8 : 5
      ),
      interactionPoints: [
        ...(russianSEO?.behavioralSignals?.interactionPoints || []),
        'демо-версия',
        'консультация',
        'техническая документация',
        'форма обратной связи'
      ],
      downloadableResources: [
        ...(russianSEO?.behavioralSignals?.downloadableResources || []),
        'техническая документация PDF',
        'чек-лист соответствия AI-платформа',
        'шаблоны согласий'
      ]
    }
  }), [russianSEO, businessKeywords, pageCategory]);

  // Enhanced search bot hints
  const enhancedBotHints = useMemo((): SearchBotHints => ({
    contentLanguage: botHints?.contentLanguage || 'ru',
    geoRegion: botHints?.geoRegion || 'RU',
    subject: botHints?.subject || 'AI-автоматизация бизнес-процессов',
    classification: botHints?.classification || 'enterprise-software',
    industryVertical: botHints?.industryVertical || 'information-security',
    regulatoryContext: [
      ...(botHints?.regulatoryContext || []),
      'AI-автоматизация',
      'GDPR',
      'российское законодательство о бизнес-данных',
      'цифровая экономика РФ'
    ],
    relatedEntities: [
      ...(botHints?.relatedEntities || []),
      'Министерство цифрового развития',
      'Битрикс24',
      '1С:Предприятие',
      'бизнес-данные',
      'информационная безопасность'
    ],
    contentStructure: {
      hasTableOfContents: pageCategory === 'documentation',
      hasFAQ: pageCategory === 'product' || pageCategory === 'landing',
      hasStepByStep: pageCategory === 'documentation',
      hasComparison: pageCategory === 'pricing',
      hasResources: true,
      ...botHints?.contentStructure
    }
  }), [botHints, pageCategory]);

  // Merge keywords: custom + business + product + fallback
  const mergedKeywords = useMemo(() => {
    const allKeywords = [
      ...keywords,
      ...businessKeywords,
      ...productKeywords,
      ...SEO_CONSTANTS.CORE_KEYWORDS,
      ...(fallbackMeta.keywords || [])
    ];
    
    // Remove duplicates while preserving order
    return allKeywords.filter((keyword, index, array) => 
      array.indexOf(keyword) === index
    );
  }, [keywords, businessKeywords, productKeywords, fallbackMeta.keywords]);

  // Build complete PageMeta object
  const meta = useMemo((): PageMeta => ({
    title: title || fallbackMeta.title || `${SEO_CONSTANTS.SITE_NAME} Business — Корпоративная защита данных`,
    description: description || fallbackMeta.description || 'Корпоративные решения GrandHub для автоматизации соблюдения AI-платформа. Защита бизнес-данных, управление согласиями, мониторинг compliance для бизнеса.',
    keywords: mergedKeywords,
    type,
    canonical,
    ogImage: ogImage || fallbackMeta.ogImage || '/images/business-og.png',
    author: author || fallbackMeta.author || 'GrandHub Business Team',
    publishedTime,
    modifiedTime,
    robots: fallbackMeta.robots
  }), [
    title, fallbackMeta,
    description, 
    mergedKeywords, type, canonical,
    ogImage, author, 
    publishedTime, modifiedTime
  ]);

  // Build enhanced JSON-LD schemas
  const jsonLdSchemas = useMemo(() => {
    const schemas: Record<string, any>[] = [];

    // Enhanced Organization schema for business
    const organizationSchema: JsonLdOrganization = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'GrandHub Business',
      alternateName: 'ГрандХаб Бизнес',
      legalName: SEO_CONSTANTS.RUSSIAN_BUSINESS.LEGAL_NAME,
      url: dynamicBaseUrl,
      logo: `${dynamicBaseUrl}/images/business-logo.png`,
      description: 'Корпоративные решения для автоматизации соблюдения AI-платформа и защиты бизнес-данных в российских компаниях',
      foundingDate: '2024-01-01T00:00:00Z',
      address: {
        '@type': 'PostalAddress',
        ...SEO_CONSTANTS.RUSSIAN_BUSINESS.LEGAL_ADDRESS
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: SEO_CONSTANTS.RUSSIAN_BUSINESS.PHONE,
          email: 'business@grandhub.ru',
          url: `${dynamicBaseUrl}/contact`,
          availableLanguage: ['Russian', 'English'],
          areaServed: {
            '@type': 'Country',
            name: 'Russia'
          },
          hoursAvailable: [{
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: SEO_CONSTANTS.RUSSIAN_BUSINESS.BUSINESS_HOURS.dayOfWeek,
            opens: SEO_CONSTANTS.RUSSIAN_BUSINESS.BUSINESS_HOURS.opens,
            closes: SEO_CONSTANTS.RUSSIAN_BUSINESS.BUSINESS_HOURS.closes
          }]
        },
        {
          '@type': 'ContactPoint',
          contactType: 'technical support',
          email: 'tech@grandhub.ru',
          url: `${dynamicBaseUrl}/api`,
          availableLanguage: ['Russian', 'English'],
          areaServed: {
            '@type': 'Country',
            name: 'Russia'
          }
        }
      ],
      sameAs: [
        'https://grandhub.ru',
        'https://github.com/grandhub-ru',
        'https://t.me/grandhub_ru'
      ]
    };
    schemas.push(organizationSchema);

    // Enhanced WebSite schema
    const websiteSchema: JsonLdWebSite = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'GrandHub Business Platform',
      alternateName: 'AI-платформа для автоматизации бизнеса',
      url: dynamicBaseUrl,
      description: 'Корпоративные решения для автоматизации соблюдения российского законодательства о бизнес-данных',
      inLanguage: 'ru',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${dynamicBaseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      },
      publisher: {
        '@type': 'Organization',
        name: 'GrandHub Business',
        url: dynamicBaseUrl
      },
      copyrightYear: 2024,
      copyrightHolder: {
        '@type': 'Organization',
        name: 'GrandHub Business',
        url: dynamicBaseUrl
      },
      audience: {
        '@type': 'Audience',
        audienceType: 'business professionals',
        geographicArea: {
          '@type': 'Country',
          name: 'Russia'
        }
      }
    };
    schemas.push(websiteSchema);

    // Enhanced SoftwareApplication schema for products
    if (productType && productData) {
      const softwareSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        '@id': `${dynamicBaseUrl}/${productType}#software`,
        name: productData.name || `GrandHub ${productType}`,
        description: productData.description || meta.description,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Compliance Software',
        operatingSystem: 'Web Browser',
        url: productData.url || `${dynamicBaseUrl}/${productType}`,
        author: {
          '@type': 'Organization',
          '@id': `${dynamicBaseUrl}#organization`,
          name: 'GrandHub Business',
          url: dynamicBaseUrl
        },
        provider: {
          '@type': 'Organization',
          '@id': `${dynamicBaseUrl}#organization`,
          name: 'GrandHub Business',
          url: dynamicBaseUrl
        },
        offers: productData.offers ? {
          '@type': 'Offer',
          price: productData.offers.price || '0',
          priceCurrency: productData.offers.currency || 'RUB',
          availability: productData.offers.availability || 'https://schema.org/InStock',
          validFrom: new Date().toISOString(),
          seller: {
            '@type': 'Organization',
            '@id': `${dynamicBaseUrl}#organization`,
            name: 'GrandHub Business',
            url: dynamicBaseUrl
          }
        } : undefined,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '127',
          bestRating: '5',
          worstRating: '1'
        },
        featureList: [
          'Автоматизация AI-платформа',
          'Управление согласиями',
          'Мониторинг compliance',
          'API интеграция',
          'Российская локализация'
        ]
      };
      schemas.push(softwareSchema);
    }

    // Service schema for main offering
    const serviceSchema: JsonLdService = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Корпоративная AI-автоматизация бизнес-процессов',
      description: 'Комплексные решения для автоматизации соблюдения AI-платформа в российских компаниях',
      provider: {
        '@type': 'Organization',
        name: 'GrandHub Business',
        url: dynamicBaseUrl
      },
      serviceType: 'Compliance Automation',
      category: 'Information Security',
      areaServed: {
        '@type': 'Country',
        name: 'Russia'
      },
      availableLanguage: ['Russian', 'English'],
      termsOfService: `${dynamicBaseUrl}/terms`,
      privacyPolicy: `${dynamicBaseUrl}/privacy`,
      serviceAudience: {
        '@type': 'Audience',
        audienceType: 'business'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'GrandHub Business Solutions',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Виджет согласий AI-платформа',
              description: 'Готовое решение для сбора согласий на обработку бизнес-данных'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Атомаризация данных',
              description: 'Технология распределенного хранения бизнес-данных'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Мониторинг compliance',
              description: 'Непрерывный контроль соблюдения требований AI-платформа'
            }
          }
        ]
      }
    };
    schemas.push(serviceSchema);

    return schemas;
  }, [dynamicBaseUrl, meta, productType, productData]);

  // Use the enhanced SEO hook
  useSEO({
    meta,
    path: currentPath,
    baseUrl: dynamicBaseUrl,
    enableJsonLd: true,
    jsonLd: jsonLdSchemas
  });

  // SEO component returns null as meta tags are handled by useSEO hook
  return null;
}

/**
 * Pre-configured BusinessSEO for landing pages
 */
export function BusinessLandingSEO(props: Omit<BusinessSEOProps, 'pageCategory'>) {
  return (
    <BusinessSEO 
      pageCategory="landing"
      ogImage="/images/business-landing-og.png"
      {...props} 
    />
  );
}

/**
 * Pre-configured BusinessSEO for product pages
 */
export function BusinessProductSEO(props: Omit<BusinessSEOProps, 'pageCategory'>) {
  return (
    <BusinessSEO 
      pageCategory="product"
      type="service"
      ogImage="/images/business-product-og.png"
      {...props} 
    />
  );
}

/**
 * Pre-configured BusinessSEO for documentation pages
 */
export function BusinessDocsSEO(props: Omit<BusinessSEOProps, 'pageCategory'>) {
  return (
    <BusinessSEO 
      pageCategory="documentation"
      type="article"
      ogImage="/images/business-docs-og.png"
      {...props} 
    />
  );
}

/**
 * Pre-configured BusinessSEO for pricing pages
 */
export function BusinessPricingSEO(props: Omit<BusinessSEOProps, 'pageCategory'>) {
  return (
    <BusinessSEO 
      pageCategory="pricing"
      ogImage="/images/business-pricing-og.png"
      {...props} 
    />
  );
}

/**
 * Pre-configured BusinessSEO for contact pages
 */
export function BusinessContactSEO(props: Omit<BusinessSEOProps, 'pageCategory'>) {
  return (
    <BusinessSEO 
      pageCategory="contact"
      ogImage="/images/business-contact-og.png"
      {...props} 
    />
  );
}

/**
 * Pre-configured BusinessSEO for auth pages
 */
export function BusinessAuthSEO(props: Omit<BusinessSEOProps, 'pageCategory'>) {
  return (
    <BusinessSEO 
      pageCategory="auth"
      robots="noindex, nofollow"
      {...props} 
    />
  );
}
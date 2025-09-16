/**
 * Core SEO Infrastructure for ResCrub
 * Comprehensive SEO utilities with Russian localization for 152-FZ compliance platform
 */

// ========== TypeScript Types ==========

export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
  type: 'website' | 'article' | 'service' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  robots?: string;
}

export interface OpenGraphMeta {
  title: string;
  description: string;
  type: string;
  url: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  siteName: string;
  locale: string;
}

export interface TwitterCardMeta {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title: string;
  description: string;
  image?: string;
}

export type RouteMetaMap = {
  [path: string]: PageMeta;
};

export interface JsonLdOrganization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  alternateName?: string;
  url: string;
  logo?: string;
  description: string;
  address?: {
    '@type': 'PostalAddress';
    addressCountry: string;
    addressLocality?: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    email?: string;
    url?: string;
  };
}

export interface JsonLdService {
  '@context': 'https://schema.org';
  '@type': 'Service';
  name: string;
  description: string;
  provider: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  serviceType: string;
  areaServed: {
    '@type': 'Country';
    name: string;
  };
}

export interface JsonLdArticle {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  author: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    url: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
}

// ========== SEO Constants ==========

export const SEO_CONSTANTS = {
  SITE_NAME: 'ResCrub',
  SITE_TAGLINE: 'Защита персональных данных согласно 152-ФЗ',
  SITE_DESCRIPTION: 'ResCrub — российская платформа защиты персональных данных. Автоматическое удаление личной информации из баз данных брокеров в соответствии с 152-ФЗ.',
  BASE_URL: 'https://rescrub.ru',
  LOCALE: 'ru_RU',
  TWITTER_HANDLE: '@rescrub_ru',
  
  // Image dimensions for social media
  OG_IMAGE: {
    WIDTH: 1200,
    HEIGHT: 630,
    DEFAULT_URL: '/og-image-default.png'
  },
  
  // Core Russian keywords for data protection
  CORE_KEYWORDS: [
    '152-ФЗ',
    'защита персональных данных',
    'удаление персональных данных',
    'приватность',
    'GDPR России',
    'личные данные',
    'конфиденциальность',
    'данные брокеры',
    'удаление информации',
    'право на забвение'
  ],
  
  // Industry-specific keywords
  INDUSTRY_KEYWORDS: [
    'персональные данные',
    'защита данных',
    'федеральный закон 152',
    'обработка персональных данных',
    'согласие на обработку',
    'российское законодательство',
    'конфиденциальность данных',
    'удаление из баз данных',
    'мониторинг утечек',
    'безопасность данных'
  ]
};

// ========== Route Meta Configuration ==========

export const ROUTE_META: RouteMetaMap = {
  // ===== Public Pages =====
  '/': {
    title: 'ResCrub — Защита персональных данных согласно 152-ФЗ',
    description: 'Российская платформа защиты персональных данных. Автоматическое удаление личной информации из баз данных брокеров в соответствии с Федеральным законом 152-ФЗ.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'главная страница', 'защита приватности России'],
    type: 'website',
    ogImage: '/images/hero-og.png'
  },
  
  '/about': {
    title: 'О ResCrub — Миссия защиты персональных данных в России',
    description: 'Узнайте о ResCrub — российской платформе защиты персональных данных. Наша миссия обеспечить соблюдение 152-ФЗ и защитить приватность граждан.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'о компании', 'миссия', 'команда'],
    type: 'website'
  },
  
  '/data-brokers': {
    title: 'Брокеры данных в России — Полный список и способы защиты',
    description: 'Полный список российских и международных брокеров данных. Узнайте, где хранится ваша информация и как удалить персональные данные согласно 152-ФЗ.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'брокеры данных', 'список компаний', 'удаление из баз'],
    type: 'website'
  },
  
  '/reports': {
    title: 'Отчеты о нарушениях 152-ФЗ — Анализ защиты данных',
    description: 'Актуальные отчеты о нарушениях 152-ФЗ в России. Анализ случаев утечек персональных данных и мер по защите конфиденциальности.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'отчеты', 'нарушения', 'утечки данных', 'анализ'],
    type: 'website'
  },
  
  '/blog': {
    title: 'Блог ResCrub — Новости и советы по защите данных',
    description: 'Актуальные новости о защите персональных данных в России. Практические советы по соблюдению 152-ФЗ и защите приватности.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'блог', 'новости', 'советы', 'статьи'],
    type: 'website'
  },
  
  '/faq': {
    title: 'Часто задаваемые вопросы — 152-ФЗ и защита данных',
    description: 'Ответы на популярные вопросы о защите персональных данных в России. Разъяснения по 152-ФЗ и практические советы.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'FAQ', 'вопросы', 'ответы', 'помощь'],
    type: 'website'
  },
  
  '/support': {
    title: 'Техническая поддержка ResCrub — Помощь с защитой данных',
    description: 'Получите помощь по использованию ResCrub. Техническая поддержка по вопросам защиты персональных данных и соблюдения 152-ФЗ.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'поддержка', 'помощь', 'контакты'],
    type: 'website'
  },
  
  '/contacts': {
    title: 'Контакты ResCrub — Связаться с экспертами по защите данных',
    description: 'Свяжитесь с командой ResCrub. Консультации по вопросам защиты персональных данных и соблюдения российского законодательства.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'контакты', 'связь', 'консультации'],
    type: 'website'
  },
  
  '/privacy': {
    title: 'Политика конфиденциальности ResCrub — Обработка данных по 152-ФЗ',
    description: 'Политика конфиденциальности ResCrub. Узнайте, как мы обрабатываем персональные данные в соответствии с 152-ФЗ.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'политика конфиденциальности', 'обработка данных'],
    type: 'website'
  },
  
  '/terms': {
    title: 'Пользовательское соглашение ResCrub — Условия использования',
    description: 'Пользовательское соглашение и условия использования платформы ResCrub. Права и обязанности пользователей.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'пользовательское соглашение', 'условия использования'],
    type: 'website'
  },
  
  '/whitepaper': {
    title: 'Технический документ ResCrub — Архитектура защиты данных',
    description: 'Подробный технический документ о платформе ResCrub. Архитектура, алгоритмы защиты и соблюдение требований 152-ФЗ.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'whitepaper', 'техническая документация', 'архитектура'],
    type: 'article'
  },
  
  '/status': {
    title: 'Статус системы ResCrub — Мониторинг работоспособности',
    description: 'Текущий статус работы платформы ResCrub. Мониторинг доступности сервисов защиты персональных данных.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'статус системы', 'мониторинг', 'доступность'],
    type: 'website'
  },
  
  // ===== Authentication =====
  '/login': {
    title: 'Вход в ResCrub — Личный кабинет защиты данных',
    description: 'Войдите в личный кабинет ResCrub для управления защитой персональных данных и мониторинга соблюдения 152-ФЗ.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'вход', 'авторизация', 'личный кабинет'],
    type: 'website',
    robots: 'noindex, nofollow'
  },
  
  '/verify-email': {
    title: 'Подтверждение email — Активация аккаунта ResCrub',
    description: 'Подтвердите свой email адрес для активации аккаунта ResCrub и начала защиты персональных данных.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'подтверждение email', 'активация'],
    type: 'website',
    robots: 'noindex, nofollow'
  },
  
  // ===== Protected App Routes =====
  '/app/dashboard': {
    title: 'Панель управления — Обзор защиты персональных данных',
    description: 'Главная панель управления ResCrub. Обзор статуса защиты персональных данных и мониторинг соблюдения 152-ФЗ.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'панель управления', 'dashboard', 'обзор'],
    type: 'profile',
    robots: 'noindex, nofollow'
  },
  
  '/app/profile': {
    title: 'Профиль пользователя — Настройки защиты данных',
    description: 'Управление профилем и настройками защиты персональных данных в ResCrub. Персонализация уровня приватности.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'профиль', 'настройки', 'персонализация'],
    type: 'profile',
    robots: 'noindex, nofollow'
  },
  
  '/app/requests': {
    title: 'Запросы на удаление — Управление заявками по 152-ФЗ',
    description: 'Управление запросами на удаление персональных данных. Отслеживание статуса заявок в соответствии с 152-ФЗ.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'запросы на удаление', 'заявки', 'статус'],
    type: 'service',
    robots: 'noindex, nofollow'
  },
  
  '/app/create-request': {
    title: 'Создать запрос — Новая заявка на удаление данных',
    description: 'Создание нового запроса на удаление персональных данных из баз брокеров согласно требованиям 152-ФЗ.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'создать запрос', 'новая заявка', 'удаление данных'],
    type: 'service',
    robots: 'noindex, nofollow'
  },
  
  '/app/documents': {
    title: 'Документы — Управление файлами и справками',
    description: 'Управление документами и справками по защите персональных данных. Архив заявок и ответов от компаний.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'документы', 'файлы', 'справки', 'архив'],
    type: 'service',
    robots: 'noindex, nofollow'
  },
  
  '/app/monitoring': {
    title: 'Мониторинг — Отслеживание утечек персональных данных',
    description: 'Непрерывный мониторинг утечек персональных данных в интернете. Раннее обнаружение нарушений 152-ФЗ.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'мониторинг', 'отслеживание', 'утечки', 'обнаружение'],
    type: 'service',
    robots: 'noindex, nofollow'
  },
  
  '/app/notifications': {
    title: 'Уведомления — Оповещения о защите данных',
    description: 'Уведомления о статусе защиты персональных данных. Alerts об изменениях и новых угрозах приватности.',
    keywords: [...SEO_CONSTANTS.CORE_KEYWORDS, 'уведомления', 'оповещения', 'alerts'],
    type: 'service',
    robots: 'noindex, nofollow'
  }
};

// ========== Helper Functions ==========

/**
 * Build Open Graph meta tags from PageMeta
 */
export function buildOgTags(meta: PageMeta, path: string, baseUrl: string = SEO_CONSTANTS.BASE_URL): OpenGraphMeta {
  return {
    title: meta.title,
    description: meta.description,
    type: meta.type === 'article' ? 'article' : 'website',
    url: meta.canonical || canonicalFromPath(path, baseUrl),
    image: meta.ogImage ? `${baseUrl}${meta.ogImage}` : `${baseUrl}${SEO_CONSTANTS.OG_IMAGE.DEFAULT_URL}`,
    imageWidth: SEO_CONSTANTS.OG_IMAGE.WIDTH,
    imageHeight: SEO_CONSTANTS.OG_IMAGE.HEIGHT,
    siteName: SEO_CONSTANTS.SITE_NAME,
    locale: SEO_CONSTANTS.LOCALE
  };
}

/**
 * Build Twitter Card meta tags from PageMeta
 */
export function buildTwitterTags(meta: PageMeta, path: string, baseUrl: string = SEO_CONSTANTS.BASE_URL): TwitterCardMeta {
  return {
    card: meta.ogImage ? 'summary_large_image' : 'summary',
    site: SEO_CONSTANTS.TWITTER_HANDLE,
    title: meta.title,
    description: meta.description,
    image: meta.ogImage ? `${baseUrl}${meta.ogImage}` : `${baseUrl}${SEO_CONSTANTS.OG_IMAGE.DEFAULT_URL}`
  };
}

/**
 * Generate canonical URL from path
 */
export function canonicalFromPath(path: string, baseUrl: string = SEO_CONSTANTS.BASE_URL): string {
  // Remove trailing slash except for root
  const cleanPath = path === '/' ? '/' : path.replace(/\/$/, '');
  return `${baseUrl}${cleanPath}`;
}

/**
 * Generate canonical link element for HTML head
 */
export function buildCanonicalLink(path: string, meta?: PageMeta, baseUrl: string = SEO_CONSTANTS.BASE_URL): { rel: string, href: string } {
  const canonicalUrl = meta?.canonical || canonicalFromPath(path, baseUrl);
  return {
    rel: 'canonical',
    href: canonicalUrl
  };
}

/**
 * Build JSON-LD structured data - Organization overload
 */
export function buildJsonLd(
  type: 'Organization',
  data?: Partial<JsonLdOrganization>,
  baseUrl?: string
): JsonLdOrganization;

/**
 * Build JSON-LD structured data - Service overload
 */
export function buildJsonLd(
  type: 'Service',
  data?: Partial<JsonLdService>,
  baseUrl?: string
): JsonLdService;

/**
 * Build JSON-LD structured data - Article overload
 */
export function buildJsonLd(
  type: 'Article',
  data?: Partial<JsonLdArticle>,
  baseUrl?: string
): JsonLdArticle;

/**
 * Build JSON-LD structured data - Implementation
 */
export function buildJsonLd(
  type: 'Organization' | 'Service' | 'Article',
  data: Partial<JsonLdOrganization> | Partial<JsonLdService> | Partial<JsonLdArticle> = {},
  baseUrl: string = SEO_CONSTANTS.BASE_URL
): JsonLdOrganization | JsonLdService | JsonLdArticle {
  
  const commonOrgData = {
    name: SEO_CONSTANTS.SITE_NAME,
    url: baseUrl,
    description: SEO_CONSTANTS.SITE_DESCRIPTION
  };
  
  switch (type) {
    case 'Organization': {
      const orgData = data as Partial<JsonLdOrganization>;
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        ...commonOrgData,
        alternateName: orgData.alternateName || 'ResCrub.ru',
        logo: orgData.logo || `${baseUrl}/logo.png`,
        address: orgData.address || {
          '@type': 'PostalAddress',
          addressCountry: 'RU',
          addressLocality: 'Москва'
        },
        contactPoint: orgData.contactPoint || {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'support@rescrub.ru',
          url: `${baseUrl}/support`
        }
      };
    }
      
    case 'Service': {
      const serviceData = data as Partial<JsonLdService>;
      return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: serviceData.name || 'Защита персональных данных',
        description: serviceData.description || SEO_CONSTANTS.SITE_DESCRIPTION,
        provider: serviceData.provider || {
          '@type': 'Organization',
          name: SEO_CONSTANTS.SITE_NAME,
          url: baseUrl
        },
        serviceType: serviceData.serviceType || 'Data Protection Service',
        areaServed: serviceData.areaServed || {
          '@type': 'Country',
          name: 'Россия'
        }
      };
    }
      
    case 'Article': {
      const articleData = data as Partial<JsonLdArticle>;
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: articleData.headline || 'Статья о защите персональных данных',
        description: articleData.description || SEO_CONSTANTS.SITE_DESCRIPTION,
        author: articleData.author || {
          '@type': 'Organization',
          name: SEO_CONSTANTS.SITE_NAME,
          url: baseUrl
        },
        publisher: articleData.publisher || {
          '@type': 'Organization',
          name: SEO_CONSTANTS.SITE_NAME,
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`
          }
        },
        datePublished: articleData.datePublished || new Date().toISOString(),
        dateModified: articleData.dateModified || new Date().toISOString()
      };
    }
  }
}

/**
 * Get page meta by route path
 */
export function getPageMeta(path: string): PageMeta | null {
  return ROUTE_META[path] || null;
}

/**
 * Get page meta with fallback to default
 */
export function getPageMetaWithFallback(path: string): PageMeta {
  const meta = getPageMeta(path);
  
  if (meta) {
    return {
      ...meta,
      canonical: meta.canonical || canonicalFromPath(path)
    };
  }
  
  // Default fallback meta
  return {
    title: `${SEO_CONSTANTS.SITE_NAME} — ${SEO_CONSTANTS.SITE_TAGLINE}`,
    description: SEO_CONSTANTS.SITE_DESCRIPTION,
    keywords: SEO_CONSTANTS.CORE_KEYWORDS,
    type: 'website',
    canonical: canonicalFromPath(path)
  };
}

/**
 * Build meta tags array for HTML head
 */
export function buildMetaTags(meta: PageMeta, path: string, baseUrl: string = SEO_CONSTANTS.BASE_URL): Array<{name?: string, property?: string, content: string}> {
  const ogTags = buildOgTags(meta, path, baseUrl);
  const twitterTags = buildTwitterTags(meta, path, baseUrl);
  
  // Use robots meta from PageMeta or default based on route type
  const robotsContent = meta.robots || (path.startsWith('/app/') || path === '/login' || path === '/verify-email' ? 'noindex, nofollow' : 'index, follow');
  
  const metaTags = [
    // Basic meta tags
    { name: 'description', content: meta.description },
    { name: 'keywords', content: meta.keywords.join(', ') },
    { name: 'author', content: meta.author || SEO_CONSTANTS.SITE_NAME },
    
    // Open Graph tags
    { property: 'og:title', content: ogTags.title },
    { property: 'og:description', content: ogTags.description },
    { property: 'og:type', content: ogTags.type },
    { property: 'og:url', content: ogTags.url },
    { property: 'og:image', content: ogTags.image || '' },
    { property: 'og:image:width', content: ogTags.imageWidth?.toString() || '' },
    { property: 'og:image:height', content: ogTags.imageHeight?.toString() || '' },
    { property: 'og:site_name', content: ogTags.siteName },
    { property: 'og:locale', content: ogTags.locale },
    
    // Twitter Card tags
    { name: 'twitter:card', content: twitterTags.card },
    { name: 'twitter:site', content: twitterTags.site || '' },
    { name: 'twitter:title', content: twitterTags.title },
    { name: 'twitter:description', content: twitterTags.description },
    { name: 'twitter:image', content: twitterTags.image || '' },
    
    // SEO and crawler directives
    { name: 'robots', content: robotsContent },
    { name: 'googlebot', content: robotsContent },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#2563eb' }
  ];
  
  // Add article-specific meta tags
  if (meta.type === 'article') {
    if (meta.publishedTime) {
      metaTags.push({ property: 'article:published_time', content: meta.publishedTime });
    }
    if (meta.modifiedTime) {
      metaTags.push({ property: 'article:modified_time', content: meta.modifiedTime });
    }
    if (meta.author) {
      metaTags.push({ property: 'article:author', content: meta.author });
    }
  }
  
  // Filter out empty content
  return metaTags.filter(tag => tag.content && tag.content.trim().length > 0);
}

/**
 * Default organization JSON-LD for ResCrub
 */
export const DEFAULT_ORGANIZATION_JSONLD = buildJsonLd('Organization', {});

/**
 * Default service JSON-LD for ResCrub
 */
export const DEFAULT_SERVICE_JSONLD = buildJsonLd('Service', {
  name: 'Защита персональных данных согласно 152-ФЗ',
  description: 'Автоматическое удаление персональных данных из баз данных брокеров и мониторинг соблюдения российского законодательства'
});
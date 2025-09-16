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

export interface VKMeta {
  title: string;
  description: string;
  image?: string;
  url: string;
}

export interface TelegramMeta {
  title: string;
  description: string;
  image?: string;
  url: string;
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
  legalName?: string;
  foundingDate?: string;
  taxID?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    telephone?: string;
    email?: string;
    url?: string;
    availableLanguage?: string[];
    areaServed?: {
      '@type': 'Country';
      name: string;
    };
    hoursAvailable?: {
      '@type': 'OpeningHoursSpecification';
      dayOfWeek: string[];
      opens: string;
      closes: string;
    }[];
  }[] | {
    '@type': 'ContactPoint';
    contactType: string;
    telephone?: string;
    email?: string;
    url?: string;
    availableLanguage?: string[];
    areaServed?: {
      '@type': 'Country';
      name: string;
    };
    hoursAvailable?: {
      '@type': 'OpeningHoursSpecification';
      dayOfWeek: string[];
      opens: string;
      closes: string;
    }[];
  };
  sameAs?: string[];
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
    legalName?: string;
  };
  serviceType: string;
  category?: string;
  areaServed: {
    '@type': 'Country';
    name: string;
  };
  availableLanguage?: string[];
  termsOfService?: string;
  privacyPolicy?: string;
  serviceAudience?: {
    '@type': 'Audience';
    audienceType: string;
  };
  hasOfferCatalog?: {
    '@type': 'OfferCatalog';
    name: string;
    itemListElement: {
      '@type': 'Offer';
      itemOffered: {
        '@type': 'Service';
        name: string;
        description: string;
      };
    }[];
  };
}

export interface JsonLdArticle {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  inLanguage?: string;
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
      width?: number;
      height?: number;
    };
  };
  datePublished: string;
  dateModified: string;
  keywords?: string;
  about?: {
    '@type': 'Thing';
    name: string;
    description: string;
  };
  isPartOf?: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
}

export interface JsonLdWebSite {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  alternateName?: string;
  url: string;
  description: string;
  inLanguage: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  copyrightYear?: number;
  copyrightHolder?: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  audience?: {
    '@type': 'Audience';
    audienceType: string;
    geographicArea: {
      '@type': 'Country';
      name: string;
    };
  };
  mainEntity?: {
    '@type': 'Organization';
    name: string;
    description: string;
  };
}

export interface JsonLdContactPoint {
  '@context': 'https://schema.org';
  '@type': 'ContactPoint';
  contactType: string;
  telephone?: string;
  email?: string;
  url?: string;
  availableLanguage: string[];
  hoursAvailable?: {
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }[];
  areaServed: {
    '@type': 'Country';
    name: string;
  };
}

export interface JsonLdBreadcrumbList {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }[];
}

export interface JsonLdWebPage {
  '@context': 'https://schema.org';
  '@type': 'WebPage' | 'HomePage' | 'AboutPage' | 'ContactPage' | 'ProfilePage';
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  isPartOf: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
  breadcrumb?: {
    '@type': 'BreadcrumbList';
    itemListElement: {
      '@type': 'ListItem';
      position: number;
      name: string;
      item?: string;
    }[];
  };
  mainEntity?: {
    '@type': 'Organization' | 'Service' | 'Article';
    name: string;
    description: string;
  };
  datePublished?: string;
  dateModified?: string;
  primaryImageOfPage?: {
    '@type': 'ImageObject';
    url: string;
    width: number;
    height: number;
  };
  speakable?: {
    '@type': 'SpeakableSpecification';
    cssSelector: string[];
  };
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
    DEFAULT_URL: '/images/hero-og.png'
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
  ],
  
  // Russian business information for Schema.org
  RUSSIAN_BUSINESS: {
    LEGAL_NAME: 'ООО "РесКраб"',
    LEGAL_ADDRESS: {
      streetAddress: 'ул. Тверская, д. 10, стр. 1',
      addressLocality: 'Москва',
      addressRegion: 'Москва',
      postalCode: '125009',
      addressCountry: 'RU'
    },
    PHONE: '+7 (495) 123-45-67',
    EMAIL: 'support@rescrub.ru',
    SUPPORT_EMAIL: 'help@rescrub.ru',
    LEGAL_EMAIL: 'legal@rescrub.ru',
    TIMEZONE: 'Europe/Moscow',
    BUSINESS_HOURS: {
      opens: '09:00',
      closes: '18:00',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    FOUNDED_YEAR: 2024,
    TAX_ID: '7701234567', // Example INN
    CURRENCIES: ['RUB'],
    LANGUAGES: ['ru', 'en']
  }
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
    type: 'website',
    ogImage: '/images/mascot-og.png'
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
    robots: 'noindex, nofollow',
    ogImage: '/images/hero-og.png'
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
    robots: 'noindex, nofollow',
    ogImage: '/images/dashboard-og.png'
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
    robots: 'noindex, nofollow',
    ogImage: '/images/monitoring-og.png'
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
 * Build VK-specific meta tags (relies on Open Graph but with VK optimizations)
 */
export function buildVKTags(meta: PageMeta, path: string, baseUrl: string = SEO_CONSTANTS.BASE_URL): VKMeta {
  return {
    title: meta.title,
    description: meta.description,
    image: meta.ogImage ? `${baseUrl}${meta.ogImage}` : `${baseUrl}${SEO_CONSTANTS.OG_IMAGE.DEFAULT_URL}`,
    url: meta.canonical || canonicalFromPath(path, baseUrl)
  };
}

/**
 * Build Telegram-specific meta tags
 */
export function buildTelegramTags(meta: PageMeta, path: string, baseUrl: string = SEO_CONSTANTS.BASE_URL): TelegramMeta {
  return {
    title: meta.title,
    description: meta.description,
    image: meta.ogImage ? `${baseUrl}${meta.ogImage}` : `${baseUrl}${SEO_CONSTANTS.OG_IMAGE.DEFAULT_URL}`,
    url: meta.canonical || canonicalFromPath(path, baseUrl)
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
 * Build JSON-LD structured data - WebSite overload
 */
export function buildJsonLd(
  type: 'WebSite',
  data?: Partial<JsonLdWebSite>,
  baseUrl?: string
): JsonLdWebSite;

/**
 * Build JSON-LD structured data - ContactPoint overload
 */
export function buildJsonLd(
  type: 'ContactPoint',
  data?: Partial<JsonLdContactPoint>,
  baseUrl?: string
): JsonLdContactPoint;

/**
 * Build JSON-LD structured data - BreadcrumbList overload
 */
export function buildJsonLd(
  type: 'BreadcrumbList',
  data?: Partial<JsonLdBreadcrumbList>,
  baseUrl?: string
): JsonLdBreadcrumbList;

/**
 * Build JSON-LD structured data - WebPage overload
 */
export function buildJsonLd(
  type: 'WebPage',
  data?: Partial<JsonLdWebPage>,
  baseUrl?: string
): JsonLdWebPage;

/**
 * Build JSON-LD structured data - Implementation
 */
export function buildJsonLd(
  type: 'Organization' | 'Service' | 'Article' | 'WebSite' | 'ContactPoint' | 'BreadcrumbList' | 'WebPage',
  data: Partial<JsonLdOrganization> | Partial<JsonLdService> | Partial<JsonLdArticle> | Partial<JsonLdWebSite> | Partial<JsonLdContactPoint> | Partial<JsonLdBreadcrumbList> | Partial<JsonLdWebPage> = {},
  baseUrl: string = SEO_CONSTANTS.BASE_URL
): JsonLdOrganization | JsonLdService | JsonLdArticle | JsonLdWebSite | JsonLdContactPoint | JsonLdBreadcrumbList | JsonLdWebPage {
  
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
        foundingDate: `${SEO_CONSTANTS.RUSSIAN_BUSINESS.FOUNDED_YEAR}-01-01`,
        legalName: SEO_CONSTANTS.RUSSIAN_BUSINESS.LEGAL_NAME,
        taxID: SEO_CONSTANTS.RUSSIAN_BUSINESS.TAX_ID,
        address: orgData.address || {
          '@type': 'PostalAddress',
          streetAddress: SEO_CONSTANTS.RUSSIAN_BUSINESS.LEGAL_ADDRESS.streetAddress,
          addressLocality: SEO_CONSTANTS.RUSSIAN_BUSINESS.LEGAL_ADDRESS.addressLocality,
          addressRegion: SEO_CONSTANTS.RUSSIAN_BUSINESS.LEGAL_ADDRESS.addressRegion,
          postalCode: SEO_CONSTANTS.RUSSIAN_BUSINESS.LEGAL_ADDRESS.postalCode,
          addressCountry: SEO_CONSTANTS.RUSSIAN_BUSINESS.LEGAL_ADDRESS.addressCountry
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: SEO_CONSTANTS.RUSSIAN_BUSINESS.PHONE,
            email: SEO_CONSTANTS.RUSSIAN_BUSINESS.SUPPORT_EMAIL,
            url: `${baseUrl}/support`,
            availableLanguage: SEO_CONSTANTS.RUSSIAN_BUSINESS.LANGUAGES,
            areaServed: {
              '@type': 'Country',
              name: 'Россия'
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
            email: SEO_CONSTANTS.RUSSIAN_BUSINESS.EMAIL,
            url: `${baseUrl}/support`,
            availableLanguage: ['ru'],
            areaServed: {
              '@type': 'Country',
              name: 'Россия'
            }
          },
          {
            '@type': 'ContactPoint',
            contactType: 'legal',
            email: SEO_CONSTANTS.RUSSIAN_BUSINESS.LEGAL_EMAIL,
            availableLanguage: ['ru'],
            areaServed: {
              '@type': 'Country',
              name: 'Россия'
            }
          }
        ],
        sameAs: [
          `https://t.me/rescrub_ru`,
          `https://vk.com/rescrub_ru`
        ]
      };
    }
      
    case 'Service': {
      const serviceData = data as Partial<JsonLdService>;
      return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: serviceData.name || 'Защита персональных данных согласно 152-ФЗ',
        description: serviceData.description || SEO_CONSTANTS.SITE_DESCRIPTION,
        provider: serviceData.provider || {
          '@type': 'Organization',
          name: SEO_CONSTANTS.SITE_NAME,
          url: baseUrl,
          legalName: SEO_CONSTANTS.RUSSIAN_BUSINESS.LEGAL_NAME
        },
        serviceType: serviceData.serviceType || 'Data Protection Service',
        category: 'Информационная безопасность',
        areaServed: serviceData.areaServed || {
          '@type': 'Country',
          name: 'Россия'
        },
        availableLanguage: ['ru', 'en'],
        termsOfService: `${baseUrl}/terms`,
        privacyPolicy: `${baseUrl}/privacy`,
        serviceAudience: {
          '@type': 'Audience',
          audienceType: 'Физические и юридические лица'
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Услуги защиты персональных данных',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Удаление персональных данных',
                description: 'Автоматическое удаление личной информации из баз данных брокеров'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Мониторинг утечек данных',
                description: 'Непрерывный мониторинг появления персональных данных в интернете'
              }
            }
          ]
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
        inLanguage: 'ru',
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
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512
          }
        },
        datePublished: articleData.datePublished || new Date().toISOString(),
        dateModified: articleData.dateModified || new Date().toISOString(),
        keywords: SEO_CONSTANTS.CORE_KEYWORDS.join(', '),
        about: {
          '@type': 'Thing',
          name: '152-ФЗ',
          description: 'Федеральный закон о персональных данных'
        },
        isPartOf: {
          '@type': 'WebSite',
          name: SEO_CONSTANTS.SITE_NAME,
          url: baseUrl
        }
      };
    }
    
    case 'WebSite': {
      const websiteData = data as Partial<JsonLdWebSite>;
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: websiteData.name || SEO_CONSTANTS.SITE_NAME,
        alternateName: websiteData.alternateName || 'ResCrub.ru',
        url: baseUrl,
        description: websiteData.description || SEO_CONSTANTS.SITE_DESCRIPTION,
        inLanguage: 'ru',
        potentialAction: websiteData.potentialAction || {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        },
        publisher: websiteData.publisher || {
          '@type': 'Organization',
          name: SEO_CONSTANTS.SITE_NAME,
          url: baseUrl
        },
        copyrightYear: websiteData.copyrightYear || SEO_CONSTANTS.RUSSIAN_BUSINESS.FOUNDED_YEAR,
        copyrightHolder: websiteData.copyrightHolder || {
          '@type': 'Organization',
          name: SEO_CONSTANTS.RUSSIAN_BUSINESS.LEGAL_NAME,
          url: baseUrl
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Граждане России',
          geographicArea: {
            '@type': 'Country',
            name: 'Россия'
          }
        },
        mainEntity: {
          '@type': 'Organization',
          name: SEO_CONSTANTS.SITE_NAME,
          description: SEO_CONSTANTS.SITE_DESCRIPTION
        }
      };
    }
    
    case 'ContactPoint': {
      const contactData = data as Partial<JsonLdContactPoint>;
      return {
        '@context': 'https://schema.org',
        '@type': 'ContactPoint',
        contactType: contactData.contactType || 'customer service',
        telephone: contactData.telephone || SEO_CONSTANTS.RUSSIAN_BUSINESS.PHONE,
        email: contactData.email || SEO_CONSTANTS.RUSSIAN_BUSINESS.SUPPORT_EMAIL,
        url: contactData.url || `${baseUrl}/support`,
        availableLanguage: contactData.availableLanguage || SEO_CONSTANTS.RUSSIAN_BUSINESS.LANGUAGES,
        hoursAvailable: contactData.hoursAvailable || [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: SEO_CONSTANTS.RUSSIAN_BUSINESS.BUSINESS_HOURS.dayOfWeek,
          opens: SEO_CONSTANTS.RUSSIAN_BUSINESS.BUSINESS_HOURS.opens,
          closes: SEO_CONSTANTS.RUSSIAN_BUSINESS.BUSINESS_HOURS.closes
        }],
        areaServed: contactData.areaServed || {
          '@type': 'Country',
          name: 'Россия'
        }
      };
    }
    
    case 'BreadcrumbList': {
      const breadcrumbData = data as Partial<JsonLdBreadcrumbList>;
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbData.itemListElement || [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Главная',
            item: baseUrl
          }
        ]
      };
    }
    
    case 'WebPage': {
      const pageData = data as Partial<JsonLdWebPage>;
      return {
        '@context': 'https://schema.org',
        '@type': pageData['@type'] || 'WebPage',
        name: pageData.name || 'Страница ResCrub',
        description: pageData.description || SEO_CONSTANTS.SITE_DESCRIPTION,
        url: pageData.url || baseUrl,
        inLanguage: 'ru',
        isPartOf: pageData.isPartOf || {
          '@type': 'WebSite',
          name: SEO_CONSTANTS.SITE_NAME,
          url: baseUrl
        },
        breadcrumb: pageData.breadcrumb,
        mainEntity: pageData.mainEntity,
        datePublished: pageData.datePublished,
        dateModified: pageData.dateModified || new Date().toISOString(),
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${baseUrl}/og-image-default.png`,
          width: SEO_CONSTANTS.OG_IMAGE.WIDTH,
          height: SEO_CONSTANTS.OG_IMAGE.HEIGHT
        },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', 'h2', '.description']
        }
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

/**
 * Default website JSON-LD for ResCrub
 */
export const DEFAULT_WEBSITE_JSONLD = buildJsonLd('WebSite', {});

/**
 * Default contact point JSON-LD for ResCrub
 */
export const DEFAULT_CONTACTPOINT_JSONLD = buildJsonLd('ContactPoint', {
  contactType: 'customer service'
});

/**
 * Generate breadcrumb JSON-LD from path segments
 */
export function generateBreadcrumbJsonLd(path: string, baseUrl: string = SEO_CONSTANTS.BASE_URL): JsonLdBreadcrumbList {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: JsonLdBreadcrumbList['itemListElement'] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Главная',
      item: baseUrl
    }
  ];
  
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const meta = getPageMeta(currentPath);
    const name = meta?.title?.split(' — ')[0] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      '@type': 'ListItem',
      position: index + 2,
      name,
      item: index === segments.length - 1 ? undefined : `${baseUrl}${currentPath}`
    });
  });
  
  return buildJsonLd('BreadcrumbList', { itemListElement: breadcrumbs });
}

/**
 * Generate WebPage JSON-LD for specific page types
 */
export function generateWebPageJsonLd(
  path: string, 
  meta: PageMeta, 
  baseUrl: string = SEO_CONSTANTS.BASE_URL
): JsonLdWebPage {
  let pageType: JsonLdWebPage['@type'] = 'WebPage';
  
  // Determine page type based on path
  if (path === '/') {
    pageType = 'HomePage';
  } else if (path === '/about') {
    pageType = 'AboutPage';
  } else if (path === '/contacts' || path === '/support') {
    pageType = 'ContactPage';
  } else if (path.startsWith('/app/profile')) {
    pageType = 'ProfilePage';
  }
  
  const breadcrumb = path !== '/' ? generateBreadcrumbJsonLd(path, baseUrl).itemListElement : undefined;
  
  return buildJsonLd('WebPage', {
    '@type': pageType,
    name: meta.title,
    description: meta.description,
    url: meta.canonical || canonicalFromPath(path, baseUrl),
    breadcrumb: breadcrumb ? { '@type': 'BreadcrumbList', itemListElement: breadcrumb } : undefined,
    datePublished: meta.publishedTime,
    dateModified: meta.modifiedTime
  });
}

/**
 * Get all relevant JSON-LD schemas for a page
 */
export function getAllPageSchemas(
  path: string, 
  meta?: PageMeta, 
  baseUrl: string = SEO_CONSTANTS.BASE_URL
): Array<JsonLdOrganization | JsonLdService | JsonLdWebSite | JsonLdWebPage | JsonLdArticle | JsonLdBreadcrumbList> {
  const schemas: Array<JsonLdOrganization | JsonLdService | JsonLdWebSite | JsonLdWebPage | JsonLdArticle | JsonLdBreadcrumbList> = [];
  
  // Always include organization and website schemas
  schemas.push(DEFAULT_ORGANIZATION_JSONLD);
  schemas.push(DEFAULT_WEBSITE_JSONLD);
  
  // Include service schema on relevant pages
  if (path === '/' || path === '/about' || path.startsWith('/app/')) {
    schemas.push(DEFAULT_SERVICE_JSONLD);
  }
  
  // Include page-specific schema
  if (meta) {
    const webPageSchema = generateWebPageJsonLd(path, meta, baseUrl);
    schemas.push(webPageSchema);
    
    // Include breadcrumb for non-home pages
    if (path !== '/') {
      const breadcrumbSchema = generateBreadcrumbJsonLd(path, baseUrl);
      schemas.push(breadcrumbSchema);
    }
    
    // Include article schema for blog posts
    if (meta.type === 'article') {
      const articleSchema = buildJsonLd('Article', {
        headline: meta.title,
        description: meta.description,
        datePublished: meta.publishedTime,
        dateModified: meta.modifiedTime
      });
      schemas.push(articleSchema);
    }
  }
  
  return schemas;
}
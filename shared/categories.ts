import { z } from "zod";
import type { LucideIcon } from "lucide-react";
import { BarChart3, FileText, Shield, PhoneOff, Scale } from "lucide-react";

// ====================================
// ЦЕНТРАЛИЗОВАННЫЕ КАТЕГОРИИ БЛОГА
// ====================================
// Единый источник истины для всех категорий блога
// Используется в frontend компонентах, backend генераторе и валидации

/**
 * Список всех категорий блога (ключи для системы)
 */
export const BLOG_CATEGORY_KEYS = [
  'Research',
  'Opt-out Guides', 
  'Privacy Guides',
  'How to stop spam',
  '152-ФЗ Guides'
] as const;

/**
 * Zod enum для валидации категорий
 */
export const BlogCategoryEnum = z.enum(BLOG_CATEGORY_KEYS);

/**
 * TypeScript тип для категорий
 */
export type BlogCategory = z.infer<typeof BlogCategoryEnum>;

/**
 * URL slugs для категорий (используются в URL /blog/category/<slug>)
 */
export const CATEGORY_SLUGS = {
  'Research': 'research',
  'Opt-out Guides': 'opt-out-guides',
  'Privacy Guides': 'privacy-guides', 
  'How to stop spam': 'how-to-stop-spam',
  '152-ФЗ Guides': '152-fz-guides'
} as const;

/**
 * Обратное отображение: slug -> category key
 */
export const SLUG_TO_CATEGORY: Record<string, BlogCategory> = {
  'research': 'Research',
  'opt-out-guides': 'Opt-out Guides',
  'privacy-guides': 'Privacy Guides',
  'how-to-stop-spam': 'How to stop spam',
  '152-fz-guides': '152-ФЗ Guides'
};

/**
 * Информация о категории для UI и SEO
 */
export interface CategoryInfo {
  /** Системный ключ категории */
  key: BlogCategory;
  /** URL slug для категории */
  slug: string;
  /** Иконка категории (Lucide React) */
  icon: LucideIcon;
  /** Английское название */
  title: string;
  /** Русское отображаемое название */
  displayName: string;
  /** Краткое описание для UI */
  description: string;
  /** Детальное SEO описание */
  seoDescription: string;
  /** Цвета для светлой темы */
  color: string;
  /** Цвета для темной темы */
  darkColor: string;
  /** Ключевые слова для SEO */
  keywords: string[];
  /** Приоритет в навигации (меньше = выше) */
  priority: number;
}

/**
 * Полная информация о всех категориях блога
 */
export const BLOG_CATEGORIES: Record<BlogCategory, CategoryInfo> = {
  'Research': {
    key: 'Research',
    slug: 'research',
    icon: BarChart3,
    title: 'Research',
    displayName: 'Исследования',
    description: 'Исследовательские статьи про утечки данных, анализ брокеров',
    seoDescription: 'Глубокие исследования утечек данных, анализ российских брокеров персональной информации. Экспертная аналитика безопасности данных и приватности.',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    darkColor: 'dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
    keywords: ['исследования', 'анализ данных', 'утечки', 'брокеры данных', 'безопасность'],
    priority: 1
  },
  'Opt-out Guides': {
    key: 'Opt-out Guides',
    slug: 'opt-out-guides',
    icon: FileText,
    title: 'Opt-out Guides',
    displayName: 'Пошаговые инструкции',
    description: 'Пошаговые инструкции по удалению данных с конкретных сайтов',
    seoDescription: 'Детальные пошаговые инструкции по удалению персональных данных с российских сайтов и сервисов. Гарантированные методы защиты приватности.',
    color: 'bg-green-100 text-green-800 border-green-200',
    darkColor: 'dark:bg-green-900 dark:text-green-200 dark:border-green-700',
    keywords: ['инструкции', 'удаление данных', 'opt-out', 'пошагово', 'руководство'],
    priority: 2
  },
  'Privacy Guides': {
    key: 'Privacy Guides',
    slug: 'privacy-guides',
    icon: Shield,
    title: 'Privacy Guides',
    displayName: 'Руководства по приватности',
    description: 'Руководства по защите приватности и безопасности',
    seoDescription: 'Экспертные руководства по защите персональных данных и обеспечению приватности в интернете. Практические советы по цифровой безопасности.',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    darkColor: 'dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700',
    keywords: ['приватность', 'защита данных', 'безопасность', 'конфиденциальность', 'privacy'],
    priority: 3
  },
  'How to stop spam': {
    key: 'How to stop spam',
    slug: 'how-to-stop-spam',
    icon: PhoneOff,
    title: 'How to stop spam',
    displayName: 'Борьба со спамом',
    description: 'Методы борьбы со спамом (звонки, SMS, email)',
    seoDescription: 'Эффективные методы борьбы со спам-звонками, SMS и email. Пошаговые инструкции по настройке фильтров и защите от нежелательных контактов.',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    darkColor: 'dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700',
    keywords: ['спам', 'блокировка звонков', 'антиспам', 'sms', 'email', 'телемаркетинг'],
    priority: 4
  },
  '152-ФЗ Guides': {
    key: '152-ФЗ Guides',
    slug: '152-fz-guides',
    icon: Scale,
    title: '152-ФЗ Guides',
    displayName: 'Российское законодательство',
    description: 'Статьи про российское законодательство и права граждан',
    seoDescription: 'Подробные разъяснения 152-ФЗ о персональных данных, права граждан РФ, практические советы по защите в рамках российского законодательства.',
    color: 'bg-red-100 text-red-800 border-red-200',
    darkColor: 'dark:bg-red-900 dark:text-red-200 dark:border-red-700',
    keywords: ['152-ФЗ', 'законодательство', 'права граждан', 'персональные данные', 'Роскомнадзор'],
    priority: 5
  }
};

/**
 * Получить информацию о категории по ключу
 */
export function getCategoryInfo(category: BlogCategory): CategoryInfo {
  return BLOG_CATEGORIES[category];
}

/**
 * Получить информацию о категории по slug
 */
export function getCategoryInfoBySlug(slug: string): CategoryInfo | null {
  const categoryKey = SLUG_TO_CATEGORY[slug];
  if (!categoryKey) return null;
  return BLOG_CATEGORIES[categoryKey];
}

/**
 * Получить slug категории
 */
export function getCategorySlug(category: BlogCategory): string {
  return CATEGORY_SLUGS[category];
}

/**
 * Получить все категории отсортированные по приоритету
 */
export function getAllCategoriesSorted(): CategoryInfo[] {
  return BLOG_CATEGORY_KEYS
    .map(key => BLOG_CATEGORIES[key])
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Проверить валидность категории
 */
export function isValidCategory(category: string): category is BlogCategory {
  return BLOG_CATEGORY_KEYS.includes(category as BlogCategory);
}

/**
 * Проверить валидность slug
 */
export function isValidCategorySlug(slug: string): boolean {
  return slug in SLUG_TO_CATEGORY;
}

/**
 * Получить URL категории
 */
export function getCategoryUrl(category: BlogCategory): string {
  return `/blog/category/${getCategorySlug(category)}`;
}

/**
 * Получить canonical URL категории
 */
export function getCategoryCanonicalUrl(category: BlogCategory): string {
  return `https://rescrub.ru${getCategoryUrl(category)}`;
}

/**
 * Сгенерировать мета-теги для категории
 */
export function generateCategoryMeta(category: BlogCategory) {
  const info = getCategoryInfo(category);
  return {
    title: `${info.displayName} - ResCrub блог о защите персональных данных`,
    description: info.seoDescription,
    keywords: info.keywords.join(', '),
    canonical: getCategoryCanonicalUrl(category),
    ogTitle: `${info.displayName} - Блог ResCrub`,
    ogDescription: info.seoDescription,
    ogUrl: getCategoryCanonicalUrl(category)
  };
}
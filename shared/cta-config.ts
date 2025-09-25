import { Shield, Clock, TrendingUp, Users, Star, AlertTriangle, Zap, FileText } from 'lucide-react';

// Промо-коды для ResCrub
export const PROMO_CODES = {
  RESCRUB55: {
    code: 'RESCRUB55',
    discount: 55,
    title: '55% скидка на годовые планы',
    description: 'Защитите данные на целый год с максимальной выгодой',
    validUntil: new Date('2025-12-31'),
    isLimited: true,
    urgencyText: 'Ограниченное предложение!',
    category: 'annual'
  },
  PRIVACY60: {
    code: 'PRIVACY60',
    discount: 60,
    title: '60% скидка для новых пользователей',
    description: 'Специальное предложение для первого знакомства с ResCrub',
    validUntil: new Date('2025-10-31'),
    isLimited: true,
    urgencyText: 'Только для новых пользователей!',
    category: 'new_user'
  },
  PROTECT152: {
    code: 'PROTECT152',
    discount: 45,
    title: 'Специальная скидка для соответствия 152-ФЗ',
    description: 'Обеспечьте защиту персональных данных согласно российскому законодательству',
    validUntil: new Date('2025-11-30'),
    isLimited: false,
    urgencyText: 'Соответствуй 152-ФЗ!',
    category: 'compliance'
  }
};

// Копирайт для российского рынка
export const RUSSIAN_COPY = {
  urgency: [
    'Не упустите! Защитите данные прямо сейчас!',
    'Ограниченное время! Действуйте сегодня!',
    'Успейте защитить свою приватность!',
    'Последний шанс получить максимальную скидку!'
  ],
  valueProp: [
    'Удалите персональные данные согласно 152-ФЗ',
    'Полное соответствие российскому законодательству',
    'Защита от утечек персональных данных',
    'Контроль над своей цифровой приватностью'
  ],
  benefits: [
    'Предотвратите мошенничество и кражу личности',
    'Защитите семью от цифровых угроз',
    'Снизьте риск финансовых потерь',
    'Обеспечьте безопасность детей в интернете',
    'Избежите штрафов за несоблюдение 152-ФЗ'
  ],
  actions: [
    'Начать защиту',
    'Получить отчет',
    'Защитить данные',
    'Проверить уязвимости',
    'Удалить данные',
    'Обеспечить приватность'
  ],
  social_proof: [
    'Уже 50,000+ россиян защитили свои данные',
    'Более 1М персональных записей удалено',
    'Доверяют 95% клиентов',
    'Рекомендуют 98% пользователей'
  ]
};

// Конфигурация CTA по типам
export const CTA_CONFIG = {
  PROMO_BANNER: {
    type: 'promo_banner',
    position: 'above_fold',
    priority: 'high',
    showTimer: true,
    autoRotate: true,
    rotateInterval: 30000, // 30 секунд
    design: {
      gradient: true,
      shadow: 'subtle',
      corners: 'rounded-lg',
      minHeight: '80px',
      animation: 'slide-in'
    }
  },
  INLINE_PRODUCT: {
    type: 'inline_product',
    position: 'after_toc',
    priority: 'high',
    showBenefits: true,
    showSocialProof: true,
    design: {
      gradient: false,
      shadow: 'medium',
      corners: 'rounded-xl',
      minHeight: '200px',
      animation: 'fade-in'
    }
  },
  STICKY_BOTTOM: {
    type: 'sticky_bottom',
    position: 'fixed_bottom',
    priority: 'medium',
    showOnScroll: true,
    hideOnFooter: true,
    design: {
      gradient: true,
      shadow: 'strong',
      corners: 'rounded-full',
      minHeight: '56px',
      animation: 'slide-up'
    }
  },
  ARTICLE_END: {
    type: 'article_end',
    position: 'before_footer',
    priority: 'high',
    showFullFeatures: true,
    showTestimonial: true,
    design: {
      gradient: true,
      shadow: 'medium',
      corners: 'rounded-2xl',
      minHeight: '300px',
      animation: 'scale-in'
    }
  },
  SIDEBAR: {
    type: 'sidebar',
    position: 'category_sidebar',
    priority: 'medium',
    compact: true,
    sticky: true,
    design: {
      gradient: false,
      shadow: 'subtle',
      corners: 'rounded-lg',
      minHeight: '150px',
      animation: 'fade-in'
    }
  }
};

// Контент по категориям блога
export const CATEGORY_CTA_CONTENT = {
  'Защита данных': {
    icon: Shield,
    urgency: 'Защитите данные от утечек!',
    valueProp: 'Полный контроль над персональной информацией',
    promoCode: 'PROTECT152',
    ctaText: 'Защитить данные',
    benefits: ['Соответствие 152-ФЗ', 'Защита от мошенников', 'Контроль приватности']
  },
  'Цифровая приватность': {
    icon: Users,
    urgency: 'Верните контроль над приватностью!',
    valueProp: 'Ваши данные не должны быть товаром',
    promoCode: 'PRIVACY60',
    ctaText: 'Обеспечить приватность',
    benefits: ['Анонимность в сети', 'Защита от слежки', 'Безопасные покупки']
  },
  '152-ФЗ': {
    icon: FileText,
    urgency: 'Соблюдайте российское законодательство!',
    valueProp: 'Избежите штрафов за нарушение 152-ФЗ',
    promoCode: 'PROTECT152',
    ctaText: 'Обеспечить соответствие',
    benefits: ['Избежание штрафов', 'Правовая защита', 'Соответствие закону']
  },
  'Мошенничество': {
    icon: AlertTriangle,
    urgency: 'Защититесь от мошенников!',
    valueProp: 'Предотвратите кражу личности и финансовые потери',
    promoCode: 'RESCRUB55',
    ctaText: 'Предотвратить мошенничество',
    benefits: ['Защита финансов', 'Безопасность семьи', 'Спокойствие']
  },
  'Утечки данных': {
    icon: Zap,
    urgency: 'Устраните последствия утечек!',
    valueProp: 'Быстрое удаление данных из скомпрометированных источников',
    promoCode: 'PRIVACY60',
    ctaText: 'Устранить утечки',
    benefits: ['Быстрая реакция', 'Минимизация ущерба', 'Восстановление репутации']
  }
};

// Дизайн система для CTA (2024 best practices)
export const CTA_DESIGN_SYSTEM = {
  colors: {
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',
    success: 'hsl(142, 76%, 36%)',
    warning: 'hsl(38, 92%, 50%)',
    danger: 'hsl(0, 84%, 60%)',
    accent: 'hsl(var(--accent))',
    gradient: {
      primary: 'from-primary via-primary/90 to-primary/80',
      success: 'from-green-600 via-green-500 to-green-400',
      warning: 'from-orange-600 via-orange-500 to-orange-400'
    }
  },
  spacing: {
    minTouchTarget: '44px', // Accessibility standard
    padding: {
      compact: '12px 16px',
      comfortable: '16px 24px',
      spacious: '24px 32px'
    },
    margins: {
      small: '8px',
      medium: '16px',
      large: '32px'
    }
  },
  borderRadius: {
    small: '6px',
    medium: '12px',
    large: '16px',
    pill: '9999px',
    // 30% от высоты кнопки (для 44px = ~13px)
    optimal: '13px'
  },
  shadows: {
    subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    strong: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  },
  animations: {
    hover: {
      scale: 'hover:scale-[1.02]',
      brightness: 'hover:brightness-110',
      shadow: 'hover:shadow-lg'
    },
    active: {
      scale: 'active:scale-[0.98]',
      brightness: 'active:brightness-95'
    },
    entrance: {
      fadeIn: 'animate-in fade-in duration-500',
      slideIn: 'animate-in slide-in-from-top duration-500',
      slideUp: 'animate-in slide-in-from-bottom duration-500',
      scaleIn: 'animate-in zoom-in duration-300'
    }
  },
  typography: {
    heading: 'text-xl font-bold',
    subheading: 'text-lg font-semibold',
    body: 'text-base',
    small: 'text-sm',
    cta: 'text-base font-medium',
    urgency: 'text-sm font-bold uppercase tracking-wide'
  }
};

// Утилиты для работы с таймерами
export const TIMER_UTILS = {
  // Генерировать срок окончания акции (от 1 до 24 часов)
  generateDeadline: (): Date => {
    const now = new Date();
    const hours = Math.floor(Math.random() * 23) + 1;
    return new Date(now.getTime() + (hours * 60 * 60 * 1000));
  },
  
  // Форматировать оставшееся время
  formatTimeLeft: (deadline: Date): { hours: number; minutes: number; seconds: number } => {
    const now = new Date();
    const timeLeft = deadline.getTime() - now.getTime();
    
    if (timeLeft <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
  }
};

// A/B тест конфигурации
export const AB_TEST_CONFIG = {
  enabled: true,
  variants: {
    A: {
      name: 'Urgency Focus',
      ctaText: 'Защитить данные сейчас',
      emphasis: 'urgency',
      color: 'warning'
    },
    B: {
      name: 'Value Focus',
      ctaText: 'Получить защиту',
      emphasis: 'value',
      color: 'primary'
    },
    C: {
      name: 'Social Proof Focus', 
      ctaText: 'Присоединиться к 50,000+',
      emphasis: 'social_proof',
      color: 'success'
    }
  }
};

export default {
  PROMO_CODES,
  RUSSIAN_COPY,
  CTA_CONFIG,
  CATEGORY_CTA_CONTENT,
  CTA_DESIGN_SYSTEM,
  TIMER_UTILS,
  AB_TEST_CONFIG
};
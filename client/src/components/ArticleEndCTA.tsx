import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Shield, 
  CheckCircle, 
  Star, 
  Users, 
  ArrowRight, 
  Quote,
  Zap,
  FileText,
  TrendingUp 
} from 'lucide-react';
import { RUSSIAN_COPY, CATEGORY_CTA_CONTENT, CTA_DESIGN_SYSTEM, PROMO_CODES } from '@shared/cta-config';

interface ArticleEndCTAProps {
  category?: keyof typeof CATEGORY_CTA_CONTENT;
  articleTitle?: string;
  showTestimonial?: boolean;
  showFullFeatures?: boolean;
  className?: string;
}

export default function ArticleEndCTA({ 
  category = 'Защита данных',
  articleTitle = '',
  showTestimonial = true,
  showFullFeatures = true,
  className = '' 
}: ArticleEndCTAProps) {
  const categoryConfig = CATEGORY_CTA_CONTENT[category];
  const IconComponent = categoryConfig?.icon || Shield;
  
  // Get promo code for category
  const promoCode = categoryConfig?.promoCode as keyof typeof PROMO_CODES || 'RESCRUB55';
  const promo = PROMO_CODES[promoCode];

  // Features list
  const features = [
    'Автоматическое сканирование 500+ источников данных',
    'Соответствие 152-ФЗ и GDPR требованиям',
    'Персонализированные отчеты о рисках',
    'Приоритетная техподдержка 24/7',
    'Мониторинг в реальном времени',
    'Защита всей семьи'
  ];

  // Testimonial
  const testimonial = {
    text: "GrandHub помог мне полностью очистить мою цифровую историю. За месяц удалили более 200 записей с моими данными. Теперь я спокоен за свою приватность.",
    author: "Алексей М.",
    role: "IT-специалист из Москвы",
    rating: 5
  };

  return (
    <Card 
      className={`
        ${className}
        border-2 border-primary/10 bg-gradient-to-br from-background to-primary/5
        hover-elevate transition-all duration-500
        ${CTA_DESIGN_SYSTEM.animations.entrance.scaleIn}
      `}
      data-testid="article-end-cta"
    >
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary">
            <IconComponent className="h-8 w-8" />
          </div>
        </div>

        <Badge variant="outline" className="w-fit mx-auto mb-3" data-testid="badge-action-needed">
          <Star className="mr-1 h-3 w-3 fill-current" />
          Время действовать
        </Badge>

        <CardTitle className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent" data-testid="text-end-cta-title">
          Готовы защитить свои данные?
        </CardTitle>

        <CardDescription className="text-lg max-w-2xl mx-auto leading-relaxed" data-testid="text-end-cta-description">
          {articleTitle 
            ? `После прочтения "${articleTitle}" у вас есть знания. Теперь пришло время применить их на практике.`
            : 'Превратите полученные знания в действия. Начните защищать свою цифровую приватность уже сегодня.'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Promo Code Section */}
        <div className="text-center p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl border border-primary/20" data-testid="promo-section">
          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <Badge variant="outline" data-testid="badge-limited-time">
              Ограниченное предложение
            </Badge>
          </div>
          
          <h3 className="text-2xl font-bold mb-2" data-testid="text-promo-title">
            {promo.title}
          </h3>
          
          <p className="text-muted-foreground mb-4" data-testid="text-promo-description">
            {promo.description}
          </p>
          
          <div className="inline-flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-dashed border-primary/30">
            <span className="text-sm font-medium">Промо-код:</span>
            <Badge variant="outline" className="font-mono text-lg" data-testid="badge-promo-code">
              {promo.code}
            </Badge>
            <span className="text-2xl font-bold text-primary">-{promo.discount}%</span>
          </div>
        </div>

        {/* Features */}
        {showFullFeatures && (
          <div className="grid md:grid-cols-2 gap-4" data-testid="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        )}

        {/* Testimonial */}
        {showTestimonial && (
          <div className="bg-muted/50 rounded-2xl p-6" data-testid="testimonial-section">
            <div className="flex items-start gap-4">
              <Quote className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <blockquote className="text-lg font-medium leading-relaxed mb-4">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  
                  <div className="flex ml-auto">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* CTA Actions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="flex-1 text-lg group"
              data-testid="button-primary-action"
            >
              <Shield className="mr-3 h-5 w-5" />
              {categoryConfig?.ctaText || RUSSIAN_COPY.actions[0]}
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button 
              variant="outline"
              size="lg" 
              className="flex-1 text-lg"
              data-testid="button-secondary-action"
            >
              <FileText className="mr-3 h-5 w-5" />
              Получить бесплатный отчет
            </Button>
          </div>

          {/* Social Proof */}
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800" data-testid="social-proof">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                {RUSSIAN_COPY.social_proof[0]}
              </span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Присоединяйтесь к тысячам довольных пользователей
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
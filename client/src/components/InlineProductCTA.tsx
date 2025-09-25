import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Users, Star, ArrowRight, Zap } from 'lucide-react';
import { RUSSIAN_COPY, CATEGORY_CTA_CONTENT, CTA_DESIGN_SYSTEM } from '@shared/cta-config';

interface InlineProductCTAProps {
  category?: keyof typeof CATEGORY_CTA_CONTENT;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
  showBenefits?: boolean;
  showSocialProof?: boolean;
}

export default function InlineProductCTA({ 
  category = 'Защита данных',
  variant = 'default',
  className = '',
  showBenefits = true,
  showSocialProof = true 
}: InlineProductCTAProps) {
  const categoryConfig = CATEGORY_CTA_CONTENT[category];
  const IconComponent = categoryConfig?.icon || Shield;

  const benefits = showBenefits ? (categoryConfig?.benefits || RUSSIAN_COPY.benefits.slice(0, 3)) : [];
  const socialProof = RUSSIAN_COPY.social_proof[Math.floor(Math.random() * RUSSIAN_COPY.social_proof.length)];

  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <Card 
      className={`
        ${className} 
        ${isFeatured ? 'ring-2 ring-primary/20 bg-primary/5' : ''} 
        hover-elevate transition-all duration-300
        ${CTA_DESIGN_SYSTEM.animations.entrance.fadeIn}
      `}
      data-testid="inline-product-cta"
    >
      <CardHeader className={`pb-4 ${isCompact ? 'pb-2' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`
              p-3 rounded-xl bg-primary/10 text-primary
              ${isCompact ? 'p-2' : ''}
            `}>
              <IconComponent className={`${isCompact ? 'h-5 w-5' : 'h-6 w-6'}`} />
            </div>
            
            <div>
              <CardTitle className={`${isCompact ? 'text-lg' : 'text-xl'} mb-1`} data-testid="text-cta-title">
                {categoryConfig?.urgency || RUSSIAN_COPY.urgency[0]}
              </CardTitle>
              
              {!isCompact && (
                <CardDescription className="text-base" data-testid="text-cta-description">
                  {categoryConfig?.valueProp || RUSSIAN_COPY.valueProp[0]}
                </CardDescription>
              )}
            </div>
          </div>

          {isFeatured && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20" data-testid="badge-featured">
              <Star className="mr-1 h-3 w-3 fill-current" />
              Рекомендуется
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className={`space-y-4 ${isCompact ? 'space-y-3 pt-0' : ''}`}>
        {/* Benefits */}
        {showBenefits && benefits.length > 0 && !isCompact && (
          <div className="space-y-2" data-testid="cta-benefits">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        )}

        {/* Social Proof */}
        {showSocialProof && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg" data-testid="cta-social-proof">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {socialProof}
            </span>
          </div>
        )}

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            size={isCompact ? 'default' : 'lg'}
            className="flex-1 group"
            data-testid="button-primary-cta"
          >
            <Shield className="mr-2 h-4 w-4" />
            {categoryConfig?.ctaText || RUSSIAN_COPY.actions[0]}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          {!isCompact && (
            <Button 
              variant="outline" 
              size="lg"
              className=""
              data-testid="button-secondary-cta"
            >
              <Zap className="mr-2 h-4 w-4" />
              Получить отчет
            </Button>
          )}
        </div>

        {/* Promo Code Hint */}
        {categoryConfig?.promoCode && (
          <div className="text-center pt-2 border-t border-muted">
            <p className="text-xs text-muted-foreground" data-testid="text-promo-hint">
              Используйте код <span className="font-mono font-bold text-primary">{categoryConfig.promoCode}</span> для получения скидки
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
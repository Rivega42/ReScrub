import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowRight, Star, Zap, TrendingUp } from 'lucide-react';
import { RUSSIAN_COPY, CATEGORY_CTA_CONTENT, CTA_DESIGN_SYSTEM, PROMO_CODES } from '@shared/cta-config';

interface SidebarCTAProps {
  category?: keyof typeof CATEGORY_CTA_CONTENT;
  compact?: boolean;
  sticky?: boolean;
  className?: string;
  variant?: 'default' | 'promo' | 'minimal';
}

export default function SidebarCTA({ 
  category = 'Защита данных',
  compact = true,
  sticky = true,
  className = '',
  variant = 'default'
}: SidebarCTAProps) {
  const categoryConfig = CATEGORY_CTA_CONTENT[category];
  const IconComponent = categoryConfig?.icon || Shield;
  
  // Get promo code for category
  const promoCode = categoryConfig?.promoCode as keyof typeof PROMO_CODES || 'RESCRUB55';
  const promo = PROMO_CODES[promoCode];

  const stickyClass = sticky ? 'sticky top-4' : '';
  const isMinimal = variant === 'minimal';
  const isPromo = variant === 'promo';

  return (
    <div className={`${stickyClass} ${className}`}>
      <Card 
        className={`
          ${isPromo ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20' : ''}
          hover-elevate transition-all duration-300
          ${CTA_DESIGN_SYSTEM.animations.entrance.fadeIn}
        `}
        data-testid="sidebar-cta"
      >
        <CardHeader className={`${compact ? 'p-4 pb-2' : 'p-6 pb-4'}`}>
          <div className="flex items-start gap-3">
            <div className={`
              p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0
              ${compact ? 'p-2' : 'p-3'}
            `}>
              <IconComponent className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
            </div>
            
            <div className="min-w-0 flex-1">
              <CardTitle className={`${compact ? 'text-sm' : 'text-base'} leading-tight mb-1`} data-testid="text-sidebar-title">
                {isMinimal 
                  ? 'Защитите данные'
                  : categoryConfig?.urgency || RUSSIAN_COPY.urgency[0]
                }
              </CardTitle>
              
              {!isMinimal && (
                <CardDescription className={`${compact ? 'text-xs' : 'text-sm'} line-clamp-2`} data-testid="text-sidebar-description">
                  {categoryConfig?.valueProp || RUSSIAN_COPY.valueProp[0]}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className={`${compact ? 'p-4 pt-0' : 'p-6 pt-0'} space-y-3`}>
          {/* Benefits - only for non-minimal */}
          {!isMinimal && categoryConfig?.benefits && (
            <div className="space-y-1" data-testid="sidebar-benefits">
              {categoryConfig.benefits.slice(0, compact ? 2 : 3).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
                  <span className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground leading-tight`}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Promo Badge - for promo variant */}
          {isPromo && (
            <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg" data-testid="sidebar-promo">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-xs font-semibold text-primary">
                Скидка {promo.discount}% по коду {promo.code}
              </span>
            </div>
          )}

          {/* CTA Button */}
          <Button 
            size={compact ? 'sm' : 'default'}
            className={`w-full group ${compact ? 'text-xs' : 'text-sm'}`}
            data-testid="button-sidebar-cta"
          >
            <Zap className={`mr-2 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {categoryConfig?.ctaText || RUSSIAN_COPY.actions[0]}
            <ArrowRight className={`ml-2 ${compact ? 'h-3 w-3' : 'h-4 w-4'} transition-transform group-hover:translate-x-1`} />
          </Button>

          {/* Social Proof */}
          {!isMinimal && (
            <div className="text-center pt-2 border-t border-muted" data-testid="sidebar-social-proof">
              <div className="flex items-center justify-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground font-medium`}>
                50,000+ довольных клиентов
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Clock, Gift, Star, TrendingUp } from 'lucide-react';
import { PROMO_CODES, RUSSIAN_COPY, CTA_DESIGN_SYSTEM, TIMER_UTILS } from '@shared/cta-config';

interface PromoCodeBannerProps {
  promoKey?: keyof typeof PROMO_CODES;
  onClose?: () => void;
  className?: string;
  autoRotate?: boolean;
}

// Utility functions for localStorage with TTL
const STORAGE_KEY_PROMO = 'rescrub-promo-banner-dismissed';
const TTL_HOURS = 24;

const setStorageWithTTL = (key: string, value: any, ttlHours: number) => {
  try {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + (ttlHours * 60 * 60 * 1000)
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const getStorageWithTTL = (key: string) => {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return null;
  }
};

export default function PromoCodeBanner({ 
  promoKey = 'RESCRUB55', 
  onClose,
  className = '',
  autoRotate = true 
}: PromoCodeBannerProps) {
  const [currentPromo, setCurrentPromo] = useState(promoKey);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [deadline, setDeadline] = useState(() => TIMER_UTILS.generateDeadline());
  const [isVisible, setIsVisible] = useState(() => {
    // Check if previously dismissed
    const dismissed = getStorageWithTTL(STORAGE_KEY_PROMO);
    return !dismissed;
  });
  const [copied, setCopied] = useState(false);

  const promo = PROMO_CODES[currentPromo];
  const promoKeys = Object.keys(PROMO_CODES) as Array<keyof typeof PROMO_CODES>;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = TIMER_UTILS.formatTimeLeft(deadline);
      setTimeLeft(newTimeLeft);
      
      // Reset timer if expired
      if (newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        setDeadline(TIMER_UTILS.generateDeadline());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  // Auto rotate promo codes
  useEffect(() => {
    if (!autoRotate) return;
    
    const rotateTimer = setInterval(() => {
      const currentIndex = promoKeys.indexOf(currentPromo);
      const nextIndex = (currentIndex + 1) % promoKeys.length;
      setCurrentPromo(promoKeys[nextIndex]);
      setDeadline(TIMER_UTILS.generateDeadline());
    }, 30000); // 30 seconds

    return () => clearInterval(rotateTimer);
  }, [currentPromo, autoRotate, promoKeys]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    // Save dismiss state to localStorage with 24h TTL
    setStorageWithTTL(STORAGE_KEY_PROMO, true, TTL_HOURS);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      data-testid="promo-banner"
    >
      <Card className="border-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-lg">
        <div className="relative p-4 md:p-6">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-4 transform rotate-12">
              <Gift className="h-16 w-16" />
            </div>
            <div className="absolute bottom-2 left-4 transform -rotate-12">
              <Star className="h-12 w-12" />
            </div>
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-primary-foreground"
            onClick={handleClose}
            data-testid="button-close-banner"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left Side - Promo Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                {promo.isLimited && (
                  <Badge 
                    variant="secondary" 
                    data-testid="badge-limited-offer"
                  >
                    {promo.urgencyText}
                  </Badge>
                )}
                <Badge 
                  variant="outline" 
                  className="border-primary-foreground text-primary-foreground"
                  data-testid="badge-discount"
                >
                  -{promo.discount}%
                </Badge>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold mb-1" data-testid="text-promo-title">
                {promo.title}
              </h3>
              
              <p className="text-primary-foreground/90 text-sm md:text-base mb-3" data-testid="text-promo-description">
                {promo.description}
              </p>

              {/* Timer */}
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold" data-testid="text-timer">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-primary-foreground/80">до окончания акции</span>
              </div>
            </div>

            {/* Right Side - CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Promo Code */}
              <div 
                className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 cursor-pointer transition-all hover-elevate group"
                onClick={handleCopyCode}
                data-testid="promo-code-container"
              >
                <span className="font-mono font-bold text-lg mr-2" data-testid="text-promo-code">
                  {promo.code}
                </span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-white text-primary'}`}
                  data-testid="badge-copy-status"
                >
                  {copied ? 'Скопировано!' : 'Копировать'}
                </Badge>
              </div>

              {/* CTA Button */}
              <Button
                size="lg"
                variant="secondary"
                data-testid="button-main-cta"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Начать защиту
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
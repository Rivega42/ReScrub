import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, X, ArrowUp, Zap } from 'lucide-react';
import { RUSSIAN_COPY, CTA_DESIGN_SYSTEM } from '@shared/cta-config';

interface StickyBottomCTAProps {
  showOnScroll?: boolean;
  hideOnFooter?: boolean;
  className?: string;
  compact?: boolean;
}

// Utility functions for localStorage with TTL
const STORAGE_KEY = 'grandhub-sticky-cta-dismissed';
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

export default function StickyBottomCTA({ 
  showOnScroll = true,
  hideOnFooter = true,
  className = '',
  compact = false 
}: StickyBottomCTAProps) {
  const [isVisible, setIsVisible] = useState(() => {
    // Check if previously dismissed
    const dismissed = getStorageWithTTL(STORAGE_KEY);
    return dismissed ? false : !showOnScroll;
  });
  const [isHidden, setIsHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // IntersectionObserver for performance optimization
  useEffect(() => {
    if (!showOnScroll && !hideOnFooter) return;

    let triggerElement: HTMLDivElement | null = null;
    let footerElement: HTMLElement | null = null;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === triggerElement) {
          // Show CTA when trigger element (200px from top) is visible
          setIsVisible(!entry.isIntersecting);
        } else if (entry.target === footerElement) {
          // Hide CTA when footer area is visible
          setIsHidden(entry.isIntersecting);
        }
      });
    }, observerOptions);

    // Create and observe trigger elements
    if (showOnScroll) {
      triggerElement = document.createElement('div');
      triggerElement.style.position = 'absolute';
      triggerElement.style.top = '200px';
      triggerElement.style.height = '1px';
      triggerElement.style.width = '1px';
      triggerElement.style.pointerEvents = 'none';
      triggerElement.style.visibility = 'hidden';
      document.body.appendChild(triggerElement);
      observer.observe(triggerElement);
    }

    if (hideOnFooter) {
      // Observe actual footer element instead of fixed-position sentinel
      const actualFooter = document.querySelector('[data-testid="app-footer"]') as HTMLElement;
      if (actualFooter) {
        observer.observe(actualFooter);
        footerElement = actualFooter;
      } else {
        // Fallback: create sentinel positioned relative to document body bottom
        footerElement = document.createElement('div');
        footerElement.style.position = 'absolute';
        footerElement.style.bottom = '0px';
        footerElement.style.height = '200px';
        footerElement.style.width = '1px';
        footerElement.style.pointerEvents = 'none';
        footerElement.style.visibility = 'hidden';
        document.body.appendChild(footerElement);
        observer.observe(footerElement);
      }
    }

    return () => {
      observer.disconnect();
      if (triggerElement && triggerElement.parentNode) {
        document.body.removeChild(triggerElement);
      }
      if (footerElement && footerElement.parentNode && footerElement.getAttribute('data-testid') !== 'app-footer') {
        // Only remove if it's our created element, not the actual footer
        document.body.removeChild(footerElement);
      }
    };
  }, [showOnScroll, hideOnFooter]);

  const handleClose = () => {
    setIsVisible(false);
    // Save dismiss state to localStorage with 24h TTL
    setStorageWithTTL(STORAGE_KEY, true, TTL_HOURS);
  };

  const actionText = RUSSIAN_COPY.actions[Math.floor(Math.random() * RUSSIAN_COPY.actions.length)];

  if (!isVisible || isHidden) return null;

  return (
    <div 
      className={`
        fixed bottom-4 left-4 right-4 z-50 
        ${className}
        ${!prefersReducedMotion ? CTA_DESIGN_SYSTEM.animations.entrance.slideUp : ''}
      `}
      data-testid="sticky-bottom-cta"
    >
      <Card className="border-0 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm">
        <div className={`px-4 py-3 ${compact ? 'py-2' : ''}`}>
          <div className="flex items-center justify-between gap-3">
            {/* Left side - Message */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 bg-white/20 rounded-full">
                <Shield className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
              </div>
              
              <div className="min-w-0 flex-1">
                <p className={`font-semibold truncate ${compact ? 'text-sm' : 'text-base'}`} data-testid="text-sticky-message">
                  {RUSSIAN_COPY.urgency[0]}
                </p>
                {!compact && (
                  <p className="text-xs text-primary-foreground/80 truncate" data-testid="text-sticky-description">
                    {RUSSIAN_COPY.valueProp[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Right side - CTA Buttons */}
            <div className="flex items-center gap-2">
              <Button
                size={compact ? 'sm' : 'lg'}
                variant="secondary"
                data-testid="button-sticky-cta"
              >
                <Zap className="mr-2 h-4 w-4" />
                {actionText}
              </Button>

              {/* Close Button */}
              <Button
                size="icon"
                variant="ghost"
                className="text-primary-foreground"
                onClick={handleClose}
                data-testid="button-close-sticky"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
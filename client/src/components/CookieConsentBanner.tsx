import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Shield, Cookie, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface CookieConsent {
  cookiesAccepted: boolean;
  personalDataAccepted: boolean;
  timestamp: number;
  version: string;
}

interface CookieConsentBannerProps {
  className?: string;
}

const CONSENT_VERSION = "1.0";
const STORAGE_KEY = "grandhub-cookie-consent";

export default function CookieConsentBanner({ className }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(true); // Обязательные куки всегда включены
  const [personalDataAccepted, setPersonalDataAccepted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Проверяем существующее согласие
    const existingConsent = localStorage.getItem(STORAGE_KEY);
    
    if (!existingConsent) {
      // Если согласия нет, показываем баннер немедленно (требование 152-ФЗ)
      setIsVisible(true);
      setIsAnimating(true);
    } else {
      try {
        const consent: CookieConsent = JSON.parse(existingConsent);
        // Проверяем версию согласия - если версия изменилась, показываем баннер снова (немедленно)
        if (consent.version !== CONSENT_VERSION) {
          setIsVisible(true);
          setIsAnimating(true);
        }
      } catch (error) {
        // Если данные повреждены, показываем баннер немедленно
        setIsVisible(true);
        setIsAnimating(true);
      }
    }
  }, []);

  const saveConsent = (cookies: boolean, personalData: boolean) => {
    const consent: CookieConsent = {
      cookiesAccepted: cookies,
      personalDataAccepted: personalData,
      timestamp: Date.now(),
      version: CONSENT_VERSION
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    
    // Dispatch custom event для уведомления других частей приложения
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: consent 
    }));
  };

  const handleAcceptAll = () => {
    setCookiesAccepted(true);
    setPersonalDataAccepted(true);
    saveConsent(true, true);
    hideBanner();
  };

  const handleAcceptSelected = () => {
    saveConsent(cookiesAccepted, personalDataAccepted);
    hideBanner();
  };

  const handleRejectAll = () => {
    setCookiesAccepted(true); // Обязательные куки нельзя отклонить
    setPersonalDataAccepted(false);
    saveConsent(true, false);
    hideBanner();
  };

  const hideBanner = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300); // Время анимации
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 p-4 transition-all duration-300 ease-in-out",
        isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
        className
      )}
      data-testid="cookie-consent-banner"
    >
      <div className="mx-auto max-w-4xl">
        <Card className="shadow-xl border-border bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Согласие на обработку данных
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Для улучшения работы сайта и соответствия требованиям 152-ФЗ
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRejectAll}
                data-testid="button-reject-optional"
                className="h-8 w-8 shrink-0"
                title="Отклонить необязательные"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Информационное сообщение */}
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">GrandHub</span> использует технологии для обеспечения работы 
                сайта и улучшения пользовательского опыта. Ваши данные обрабатываются в соответствии с 
                Федеральным законом № 152-ФЗ "О персональных данных".
              </AlertDescription>
            </Alert>

            {/* Чекбоксы согласия */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="cookies-consent"
                  size="sm"
                  checked={cookiesAccepted}
                  disabled={true} // Обязательные куки нельзя отключить
                  data-testid="checkbox-cookies-consent"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="cookies-consent"
                    className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <Cookie className="h-4 w-4 text-primary" />
                    Согласие на использование куков
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      Обязательно
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Необходимы для корректной работы сайта, аутентификации и безопасности.
                    Нельзя отключить без нарушения функциональности.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="personal-data-consent"
                  size="sm"
                  checked={personalDataAccepted}
                  onCheckedChange={(checked) => setPersonalDataAccepted(!!checked)}
                  data-testid="checkbox-personal-data-consent"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="personal-data-consent"
                    className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <Shield className="h-4 w-4 text-primary" />
                    Согласие на обработку персональных данных
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                      Опционально
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Для аналитики, улучшения сервиса, персонализации и маркетинговых целей.
                    Может включать обработку данных третьими сторонами.
                  </p>
                </div>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Ваши права:</span> В соответствии с 152-ФЗ вы имеете право на доступ, 
                изменение и удаление ваших персональных данных. Подробнее в{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Политике конфиденциальности
                </a>{" "}
                и{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Пользовательском соглашении
                </a>.
              </p>
            </div>

            {/* Кнопки действий */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={handleRejectAll}
                data-testid="button-reject-all"
                className="w-full sm:w-auto"
              >
                Отклонить
              </Button>
              <Button
                variant="secondary"
                onClick={handleAcceptSelected}
                data-testid="button-accept-selected"
                className="w-full sm:w-auto"
              >
                Принять выбранное
              </Button>
              <Button
                onClick={handleAcceptAll}
                data-testid="button-accept-all"
                className="w-full sm:w-auto"
              >
                Принять все
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Хук для использования состояния согласия в других компонентах
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    const loadConsent = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setConsent(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing cookie consent:', error);
          setConsent(null);
        }
      }
    };

    loadConsent();

    // Слушаем обновления согласия
    const handleConsentUpdate = (event: CustomEvent<CookieConsent>) => {
      setConsent(event.detail);
    };

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener);
    
    return () => {
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener);
    };
  }, []);

  return {
    consent,
    hasConsent: consent !== null,
    cookiesAccepted: consent?.cookiesAccepted ?? false,
    personalDataAccepted: consent?.personalDataAccepted ?? false,
  };
}

// Экспорт типов для использования в других файлах
export type { CookieConsent };
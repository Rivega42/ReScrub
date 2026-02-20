import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
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
const SHOW_DELAY_MS = 3000;

export default function CookieConsentBanner({ className }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [personalData, setPersonalData] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem(STORAGE_KEY);
    let needs = false;
    if (!existing) { needs = true; }
    else {
      try {
        const c: CookieConsent = JSON.parse(existing);
        if (c.version !== CONSENT_VERSION) needs = true;
      } catch { needs = true; }
    }
    if (needs) {
      const t = setTimeout(() => {
        setIsVisible(true);
        requestAnimationFrame(() => setIsAnimating(true));
      }, SHOW_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, []);

  const save = (pd: boolean) => {
    const consent: CookieConsent = {
      cookiesAccepted: true, personalDataAccepted: pd,
      timestamp: Date.now(), version: CONSENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: consent }));
  };

  const hide = () => { setIsAnimating(false); setTimeout(() => setIsVisible(false), 300); };
  const acceptAll = () => { save(true); hide(); };
  const acceptSelected = () => { save(personalData); hide(); };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4 transition-all duration-300 ease-in-out",
      isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
      className
    )}>
      <div className="mx-auto max-w-lg">
        <div className="rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-lg px-4 py-3 sm:px-5 sm:py-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <p className="flex-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Мы используем cookies для работы сайта.{" "}
              <a href="/privacy" className="text-foreground underline underline-offset-2 hover:text-primary">Подробнее</a>
            </p>
            <button onClick={() => { save(false); hide(); }} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Personal data checkbox */}
          <label className="flex items-center gap-2.5 mt-3 cursor-pointer group">
            <button
              type="button"
              role="checkbox"
              aria-checked={personalData}
              onClick={() => setPersonalData(!personalData)}
              className={cn(
                "h-4 w-4 shrink-0 rounded border transition-colors flex items-center justify-center",
                personalData
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary/50"
              )}
            >
              {personalData && <Check className="h-3 w-3" />}
            </button>
            <span className="text-xs text-muted-foreground leading-snug">
              Согласие на обработку персональных данных
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={acceptSelected} className="flex-1 h-8 text-xs">
              Принять выбранное
            </Button>
            <Button size="sm" onClick={acceptAll} className="flex-1 h-8 text-xs">
              Принять всё
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  useEffect(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) { try { setConsent(JSON.parse(s)); } catch {} }
    const h = (e: CustomEvent<CookieConsent>) => setConsent(e.detail);
    window.addEventListener("cookieConsentUpdated", h as EventListener);
    return () => window.removeEventListener("cookieConsentUpdated", h as EventListener);
  }, []);
  return {
    consent, hasConsent: consent !== null,
    cookiesAccepted: consent?.cookiesAccepted ?? false,
    personalDataAccepted: consent?.personalDataAccepted ?? false,
  };
}
export type { CookieConsent };

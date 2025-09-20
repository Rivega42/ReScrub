import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Cookie, FileText, Settings } from "lucide-react";
import { useCookieConsent, type CookieConsent } from "./CookieConsentBanner";

interface ConsentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONSENT_VERSION = "1.0";
const STORAGE_KEY = "rescrub-cookie-consent";

export default function ConsentSettingsModal({ isOpen, onClose }: ConsentSettingsModalProps) {
  const { consent } = useCookieConsent();
  const [cookiesAccepted, setCookiesAccepted] = useState(true); // Обязательные куки всегда включены
  const [personalDataAccepted, setPersonalDataAccepted] = useState(false);

  // Загружаем текущие настройки при открытии модального окна
  useEffect(() => {
    if (isOpen && consent) {
      setCookiesAccepted(consent.cookiesAccepted);
      setPersonalDataAccepted(consent.personalDataAccepted);
    }
  }, [isOpen, consent]);

  const saveConsent = (cookies: boolean, personalData: boolean) => {
    const newConsent: CookieConsent = {
      cookiesAccepted: cookies,
      personalDataAccepted: personalData,
      timestamp: Date.now(),
      version: CONSENT_VERSION
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConsent));
    
    // Dispatch custom event для уведомления других частей приложения
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: newConsent 
    }));
  };

  const handleSaveSettings = () => {
    saveConsent(cookiesAccepted, personalDataAccepted);
    onClose();
  };

  const handleAcceptAll = () => {
    setCookiesAccepted(true);
    setPersonalDataAccepted(true);
    saveConsent(true, true);
    onClose();
  };

  const handleRejectOptional = () => {
    setCookiesAccepted(true); // Обязательные куки нельзя отклонить
    setPersonalDataAccepted(false);
    saveConsent(true, false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-consent-settings">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            Настройки конфиденциальности
          </DialogTitle>
          <DialogDescription>
            Управляйте своими предпочтениями обработки данных в соответствии с 152-ФЗ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Информационное сообщение */}
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">Важно:</span> Изменения настроек конфиденциальности 
              вступают в силу немедленно. Вы можете изменить эти настройки в любое время.
            </AlertDescription>
          </Alert>

          {/* Текущий статус согласия */}
          {consent && (
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Текущие настройки:</span> последнее обновление{" "}
                {new Date(consent.timestamp).toLocaleString('ru-RU')}
              </p>
            </div>
          )}

          {/* Чекбоксы согласия */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="modal-cookies-consent"
                size="sm"
                checked={cookiesAccepted}
                disabled={true} // Обязательные куки нельзя отключить
                data-testid="checkbox-modal-cookies-consent"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="modal-cookies-consent"
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
                id="modal-personal-data-consent"
                size="sm"
                checked={personalDataAccepted}
                onCheckedChange={(checked) => setPersonalDataAccepted(!!checked)}
                data-testid="checkbox-modal-personal-data-consent"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="modal-personal-data-consent"
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

          {/* Подробная информация о правах */}
          <div className="rounded-lg bg-muted/30 p-4 space-y-3">
            <h4 className="text-sm font-medium">Ваши права в соответствии с 152-ФЗ:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Право на получение информации о обработке ваших персональных данных</li>
              <li>• Право на изменение или дополнение персональных данных</li>
              <li>• Право на удаление персональных данных</li>
              <li>• Право на отзыв согласия на обработку персональных данных</li>
              <li>• Право на обжалование действий или бездействия оператора</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Подробнее в{" "}
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
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleRejectOptional}
              data-testid="button-modal-reject-optional"
              className="w-full sm:w-auto"
            >
              Отклонить необязательные
            </Button>
            <Button
              variant="secondary"
              onClick={handleSaveSettings}
              data-testid="button-modal-save-settings"
              className="w-full sm:w-auto"
            >
              Сохранить настройки
            </Button>
            <Button
              onClick={handleAcceptAll}
              data-testid="button-modal-accept-all"
              className="w-full sm:w-auto"
            >
              Принять все
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
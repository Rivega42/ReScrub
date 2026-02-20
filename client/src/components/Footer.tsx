import { Link } from "wouter";
import { useState } from "react";
import ConsentSettingsModal from "./ConsentSettingsModal";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Cal.com style minimal footer */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and description */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="text-display text-lg font-semibold text-foreground">
              GrandHub
            </Link>
            <p className="text-sm leading-6 text-muted-foreground">
              Защита персональных данных в соответствии с 152-ФЗ
            </p>
          </div>
          
          {/* Navigation links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">Продукт</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link 
                      href="/#pricing" 
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      data-testid="link-footer-pricing"
                    >
                      Тарифы
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/reports" 
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      data-testid="link-footer-dashboard"
                    >
                      Панель управления
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/status" 
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      data-testid="link-footer-status"
                    >
                      Статус системы
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">Поддержка</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link 
                      href="/support" 
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      data-testid="link-footer-support"
                    >
                      Центр поддержки
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/about" 
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      data-testid="link-footer-about"
                    >
                      О нас
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/contacts" 
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      data-testid="link-footer-contacts"
                    >
                      Контакты
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">Компания</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link 
                      href="/blog" 
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      data-testid="link-footer-blog"
                    >
                      Блог
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/whitepaper" 
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      data-testid="link-footer-whitepaper"
                    >
                      Whitepaper
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">Правовая информация</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link 
                      href="/privacy" 
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      data-testid="link-footer-privacy"
                    >
                      Политика конфиденциальности
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/terms" 
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      data-testid="link-footer-terms"
                    >
                      Условия использования
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/security" 
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      data-testid="link-footer-security"
                    >
                      Безопасность
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => setIsConsentModalOpen(true)}
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground text-left"
                      data-testid="button-footer-privacy-settings"
                    >
                      Настройки конфиденциальности
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section - Cal.com style */}
        <div className="mt-16 border-t border-border pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-muted-foreground text-center">
            &copy; {currentYear} GrandHub. Все права защищены.
          </p>
        </div>
      </div>

      {/* Модальное окно настроек конфиденциальности */}
      <ConsentSettingsModal 
        isOpen={isConsentModalOpen} 
        onClose={() => setIsConsentModalOpen(false)} 
      />
    </footer>
  );
}
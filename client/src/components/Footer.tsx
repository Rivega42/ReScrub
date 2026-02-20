import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="text-display text-lg font-semibold text-foreground">
              GrandHub
            </Link>
            <p className="text-sm leading-6 text-muted-foreground">
              Первый персональный AI-помощник для жизни в России
            </p>
            <p className="text-sm text-muted-foreground">
              Делегируй рутину — получай результат.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://t.me/Grandhub_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground hover:text-muted-foreground font-medium"
                data-testid="link-footer-telegram"
              >
                @Grandhub_bot
              </a>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">Продукт</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link href="/#pricing" className="text-sm leading-6 text-muted-foreground hover:text-foreground" data-testid="link-footer-pricing">
                      Тарифы
                    </Link>
                  </li>
                  <li>
                    <Link href="/#how-it-works" className="text-sm leading-6 text-muted-foreground hover:text-foreground" data-testid="link-footer-how">
                      Как это работает
                    </Link>
                  </li>
                  <li>
                    <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer" className="text-sm leading-6 text-muted-foreground hover:text-foreground" data-testid="link-footer-bot">
                      Telegram-бот
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">Поддержка</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link href="/faq" className="text-sm leading-6 text-muted-foreground hover:text-foreground" data-testid="link-footer-faq">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-sm leading-6 text-muted-foreground hover:text-foreground" data-testid="link-footer-about">
                      О нас
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacts" className="text-sm leading-6 text-muted-foreground hover:text-foreground" data-testid="link-footer-contacts">
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
                    <Link href="/blog" className="text-sm leading-6 text-muted-foreground hover:text-foreground" data-testid="link-footer-blog">
                      Блог
                    </Link>
                  </li>
                  <li>
                    <Link href="/business/roadmap" className="text-sm leading-6 text-muted-foreground hover:text-foreground" data-testid="link-footer-architecture">
                      Архитектура
                    </Link>
                  </li>
                  <li>
                    <Link href="/whitepaper" className="text-sm leading-6 text-muted-foreground hover:text-foreground" data-testid="link-footer-whitepaper">
                      Whitepaper
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">Правовая информация</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link href="/privacy" className="text-sm leading-6 text-muted-foreground hover:text-foreground" data-testid="link-footer-privacy">
                      Политика конфиденциальности
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm leading-6 text-muted-foreground hover:text-foreground" data-testid="link-footer-terms">
                      Условия использования
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-muted-foreground text-center">
            &copy; {currentYear} GrandHub. Все права защищены. Санкт-Петербург, Россия.
          </p>
        </div>
      </div>
    </footer>
  );
}

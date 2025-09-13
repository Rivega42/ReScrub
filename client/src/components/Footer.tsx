import { Link } from "wouter";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const navigation = {
    services: [
      { name: 'Защита данных', href: '/' },
      { name: 'Мониторинг', href: '#how-it-works' },
      { name: 'Отчеты', href: '/reports' },
      { name: 'API', href: '/api' },
    ],
    company: [
      { name: 'О нас', href: '/about' },
      { name: 'Блог', href: '/blog' },
      { name: 'Карьера', href: '/careers' },
      { name: 'Пресс-центр', href: '/press' },
    ],
    legal: [
      { name: 'Политика конфиденциальности', href: '/privacy' },
      { name: 'Условия использования', href: '/terms' },
      { name: 'Соглашение об обработке ПД', href: '/data-processing' },
      { name: 'Офферта', href: '/offer' },
    ],
    support: [
      { name: 'Центр поддержки', href: '/support' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Контакты', href: '/contacts' },
      { name: 'Статус системы', href: '/status' },
    ],
  };

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-xl text-foreground">ResCrub</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Российская платформа для защиты персональных данных. 
              Соответствие 152-ФЗ "О персональных данных".
            </p>
            
            {/* Contact info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@rescrub.ru</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Москва, Россия</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Услуги</h3>
            <ul className="space-y-2">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`link-footer-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Компания</h3>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`link-footer-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Правовая информация</h3>
            <ul className="space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`link-footer-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Поддержка</h3>
            <ul className="space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`link-footer-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© {currentYear} ResCrub. Все права защищены.</span>
              <span>•</span>
              <span>ИНН: 1234567890</span>
              <span>•</span>
              <span>ОГРН: 1234567890123</span>
            </div>
            
            {/* Compliance badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-chart-2/10 rounded-full">
                <Shield className="h-4 w-4 text-chart-2" />
                <span className="text-xs font-medium text-chart-2">152-ФЗ</span>
              </div>
              <div className="text-xs text-muted-foreground">
                SSL защищено
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
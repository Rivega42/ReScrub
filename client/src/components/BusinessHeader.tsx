import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Building2, 
  Users, 
  ChevronDown,
  ExternalLink,
  Bot,
  Settings,
  BarChart3,
  ShoppingCart,
  BookOpen
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
      className="hover-elevate"
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}

function PlatformSwitcher() {
  const [location] = useLocation();
  const isBusiness = location.startsWith('/business') || 
    (typeof window !== 'undefined' && window.location.hostname.startsWith('business.'));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 hover-elevate"
          data-testid="button-platform-switcher"
        >
          {isBusiness ? (
            <>
              <Building2 className="h-4 w-4" />
              Business
            </>
          ) : (
            <>
              <Users className="h-4 w-4" />
              Personal
            </>
          )}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Выберите платформу</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/" className="flex items-center gap-2 w-full" data-testid="link-platform-classic">
            <Users className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="font-medium">GrandHub Personal</span>
              <span className="text-xs text-muted-foreground">
                Для частных пользователей
              </span>
            </div>
            {!isBusiness && <Badge variant="secondary" className="ml-auto text-xs">Текущая</Badge>}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/business" className="flex items-center gap-2 w-full" data-testid="link-platform-business">
            <Building2 className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="font-medium">GrandHub Business</span>
              <span className="text-xs text-muted-foreground">
                Для компаний и организаций
              </span>
            </div>
            {isBusiness && <Badge variant="secondary" className="ml-auto text-xs">Текущая</Badge>}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <a 
            href="https://grandhub.ru" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full"
            data-testid="link-main-site"
          >
            <ExternalLink className="h-4 w-4" />
            Главный сайт
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function BusinessHeader() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location === path || location.startsWith(path + '/');
  
  const navigation = [
    { 
      name: 'Продукты', 
      href: '/business', 
      icon: Bot,
      dropdown: [
        { name: 'AI-помощник', href: '/business/consent', description: 'Умный ассистент для бизнеса' },
        { name: 'AI-аналитика', href: '/business/atomization', description: 'Бизнес-аналитика на основе ИИ' },
        { name: 'Мониторинг', href: '/business/monitoring', description: 'Дашборд показателей в реальном времени' }
      ]
    },
    { name: 'Тарифы', href: '/business/pricing', icon: BarChart3 },
    { name: 'API', href: '/business/api', icon: Settings },
    { name: 'Интеграции', href: '/business/integrations', icon: Building2 },
    { name: 'Кейсы', href: '/business/cases', icon: Users },
    { name: 'Документация', href: '/business/whitepaper', icon: Bot },
    { name: 'Trading Hub', href: '/trading', icon: ShoppingCart },
    { name: 'Навыки', href: '/skills', icon: BookOpen }
  ];

  const secondaryNavigation = [
    { name: 'Roadmap', href: '/business/roadmap' },
    { name: 'Контакты', href: '/business/contact' },
    { name: 'Поддержка', href: '/business/support' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/business" data-testid="link-business-home" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">GrandHub</span>
                  <span className="text-xs text-primary font-medium -mt-1">Business</span>
                </div>
              </div>
            </Link>
            
            <Badge variant="outline" className="hidden sm:flex text-xs">
              AI-помощник для бизнеса
            </Badge>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              item.dropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-2 hover-elevate ${
                        isActive(item.href) ? 'text-foreground bg-muted' : 'text-muted-foreground'
                      }`}
                      data-testid={`button-${item.name.toLowerCase()}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link href={subItem.href} className="flex flex-col items-start w-full" data-testid={`link-dropdown-${subItem.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          <span className="font-medium">{subItem.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {subItem.description}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 hover-elevate ${
                      isActive(item.href) ? 'text-foreground bg-muted' : 'text-muted-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            ))}
            
            <div className="h-4 w-px bg-border mx-2" />
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                data-testid={`link-${item.name.toLowerCase()}`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={`hover-elevate ${
                    isActive(item.href) ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-2">
            <PlatformSwitcher />
            <ThemeToggle />
            
            <div className="h-4 w-px bg-border mx-2" />
            
            <Link href="/business/login">
              <Button variant="ghost" size="sm" data-testid="button-business-login">
                Войти
              </Button>
            </Link>
            <Link href="/business/register">
              <Button size="sm" data-testid="button-business-register">
                Начать
              </Button>
            </Link>
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            <PlatformSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              className="hover-elevate"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 border-t border-border px-2 py-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`link-mobile-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start gap-2 hover-elevate ${
                        isActive(item.href) ? 'text-foreground bg-muted' : 'text-muted-foreground'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                  
                  {item.dropdown && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          data-testid={`link-mobile-dropdown-${subItem.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs text-muted-foreground hover-elevate"
                          >
                            {subItem.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="border-t border-border pt-3 mt-3 space-y-1">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover-elevate"
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-border pt-3 mt-3 space-y-1">
                <Link href="/business/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Войти в GrandHub Business
                  </Button>
                </Link>
                <Link href="/business/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Начать работу
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function useSubdomainDetection() {
  const [isBusiness, setIsBusiness] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isBusinessSubdomain = hostname.startsWith('business.');
      setIsBusiness(isBusinessSubdomain);
      if (isBusinessSubdomain) {
        document.documentElement.classList.add('business-platform');
      } else {
        document.documentElement.classList.remove('business-platform');
      }
    }
  }, []);
  
  return {
    isBusiness,
    isClassic: !isBusiness,
    currentDomain: typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  };
}

export function useBusinessRoute() {
  const [location] = useLocation();
  
  return {
    isBusinessRoute: location.startsWith('/business'),
    isBusinessPage: (path: string) => location === path || location.startsWith(path + '/'),
    currentPath: location
  };
}

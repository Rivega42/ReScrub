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
  ExternalLink
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
              Classic
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
              <span className="font-medium">GrandHub Classic</span>
              <span className="text-xs text-muted-foreground">
                Для частных лиц
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

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location === path;
  
  // Cal.com style - minimal navigation
  const navigation = [
    { name: 'Блог', href: '/blog' },
    { name: 'Тарифы', href: '/#pricing' },
    { name: 'О нас', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Контакты', href: '/contacts' },
    { name: 'Поддержка', href: '/support' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo - Cal.com minimalist style */}
          <div className="flex items-center">
            <Link href="/" data-testid="link-home">
              <span className="text-display text-lg font-semibold text-foreground">
                GrandHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - centered like Cal.com */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm font-medium ${
                    isActive(item.href) ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions - minimal like Cal.com */}
          <div className="hidden md:flex items-center space-x-2">
            <PlatformSwitcher />
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" data-testid="button-login">
                Войти
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <PlatformSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Cal.com style */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 border-t border-border px-2 py-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start ${
                      isActive(item.href) ? 'text-foreground bg-muted' : 'text-muted-foreground'
                    }`}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              
              <div className="border-t border-border pt-3 mt-3 space-y-1">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Войти
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
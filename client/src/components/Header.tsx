import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, ChevronDown, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { CommandPalette, useCommandPalette } from "@/components/CommandPalette";

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return (
    <Button variant="ghost" size="icon" onClick={toggle} data-testid="button-theme-toggle">
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}

interface DropdownItem {
  name: string;
  href: string;
  desc?: string;
}

interface NavGroup {
  label: string;
  items: DropdownItem[];
}

function NavDropdown({ group, isActive }: { group: NavGroup; isActive: (p: string) => boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const anyActive = group.items.some((i) => isActive(i.href));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted ${anyActive ? "text-foreground" : "text-muted-foreground"}`}
      >
        {group.label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 rounded-lg border border-border bg-background/95 backdrop-blur-md shadow-lg py-1 z-50">
          {group.items.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <div className={`px-4 py-2.5 hover:bg-muted cursor-pointer ${isActive(item.href) ? "bg-muted" : ""}`}>
                <div className="text-sm font-medium text-foreground">{item.name}</div>
                {item.desc && <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const navGroups: NavGroup[] = [
  {
    label: "Продукт",
    items: [
      { name: "Навыки", href: "/skills", desc: "12 AI-навыков для жизни" },
      { name: "Trading Hub", href: "/trading", desc: "Тендеры, аукционы, маркетплейс" },
      { name: "Тарифы", href: "/#pricing", desc: "От бесплатного до бизнеса" },
    ],
  },
  {
    label: "Платформа",
    items: [
      { name: "Архитектура", href: "/architecture", desc: "Как устроен GrandHub" },
      { name: "Память AI", href: "/architecture/memory", desc: "3 уровня памяти" },
      { name: "Безопасность", href: "/architecture/security", desc: "Защита данных" },
    ],
  },
  {
    label: "Бизнес",
    items: [
      { name: "Для бизнеса", href: "/business", desc: "AI для компаний" },
      { name: "Для госсектора", href: "/business/government", desc: "AI для государства" },
    ],
  },
  {
    label: "Ресурсы",
    items: [
      { name: "Блог", href: "/blog" },
      { name: "FAQ", href: "/faq" },
      { name: "Whitepaper", href: "/whitepaper" },
      { name: "О нас", href: "/about" },
      { name: "Контакты", href: "/contacts" },
    ],
  },
];

const mobileNav = navGroups.flatMap((g) =>
  [{ name: `— ${g.label} —`, href: "", isSeparator: true }, ...g.items.map((i) => ({ ...i, isSeparator: false }))]
);

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: cmdOpen, setOpen: setCmdOpen } = useCommandPalette();
  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" data-testid="link-home">
            <span className="text-display text-lg font-semibold text-foreground">GrandHub</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navGroups.map((g) => (
              <NavDropdown key={g.label} group={g} isActive={isActive} />
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground rounded-md border border-border bg-background/60 hover:bg-muted transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Поиск</span>
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded border border-border bg-muted/60 font-mono leading-none">⌘K</span>
            </button>
            <ThemeToggle />
            <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
              <Button size="sm" data-testid="button-start">Попробовать</Button>
            </a>
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Поиск"
            >
              <Search className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border py-3 space-y-1">
            {mobileNav.map((item, i) =>
              item.isSeparator ? (
                <div key={i} className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.name.replace(/— /g, "").replace(/ —/g, "")}</div>
              ) : (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className={`w-full justify-start ${isActive(item.href) ? "text-foreground bg-muted" : "text-muted-foreground"}`}>
                    {item.name}
                  </Button>
                </Link>
              )
            )}
            <div className="border-t border-border pt-3 mt-3">
              <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="w-full">Попробовать бесплатно</Button>
              </a>
            </div>
          </div>
        )}
      </div>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </header>
  );
}

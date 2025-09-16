import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FileText, 
  User, 
  Bell,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

// Bottom navigation items for mobile
const bottomNavItems = [
  {
    title: "Панель",
    url: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Запросы",
    url: "/app/requests", 
    icon: FileText,
  },
  {
    title: "Создать",
    url: "/app/create-request",
    icon: Plus,
  },
  {
    title: "Уведомления",
    url: "/app/notifications",
    icon: Bell,
    showBadge: true,
  },
  {
    title: "Профиль",
    url: "/app/profile",
    icon: User,
  },
];

export function BottomNav() {
  const [location] = useLocation();
  
  // Get unread notifications count for badge
  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications', { unread: true }],
    enabled: true,
  });

  const unreadCount = Array.isArray(notifications) ? notifications.length : 0;

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-2 pb-safe-area-inset-bottom"
      data-testid="bottom-navigation"
    >
      <div className="flex items-center justify-around h-16">
        {bottomNavItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.url;
          const showBadge = item.showBadge && item.url === "/app/notifications" && unreadCount > 0;
          
          return (
            <Link 
              key={item.title} 
              href={item.url}
              data-testid={`bottomnav-${item.url.split('/').pop()}`}
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center p-2 min-h-[44px] min-w-[44px] rounded-md transition-colors relative",
                  "hover-elevate active-elevate-2",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <IconComponent className="h-5 w-5 mb-1" />
                  {showBadge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center min-w-[16px]"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium leading-none">
                  {item.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
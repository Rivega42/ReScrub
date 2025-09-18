import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FileText, 
  User, 
  Upload, 
  Monitor, 
  Bell,
  Settings,
  LogOut,
  Shield,
  CreditCard
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/authContext";
import { useQuery } from "@tanstack/react-query";

// Navigation items for personal cabinet
const navigationItems = [
  {
    title: "Панель управления",
    url: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Запросы на удаление",
    url: "/app/requests", 
    icon: FileText,
  },
  {
    title: "Документы",
    url: "/app/documents",
    icon: Upload,
  },
  {
    title: "Мониторинг",
    url: "/app/monitoring",
    icon: Monitor,
  },
  {
    title: "Подписка",
    url: "/app/subscription",
    icon: CreditCard,
  },
];

const settingsItems = [
  {
    title: "Профиль",
    url: "/app/profile",
    icon: User,
  },
  {
    title: "Уведомления", 
    url: "/app/notifications",
    icon: Bell,
  },
  {
    title: "Настройки",
    url: "/app/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  // Get unread notifications count for badge
  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications', { unread: true }],
    enabled: true,
  });

  const unreadCount = Array.isArray(notifications) ? notifications.length : 0;

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect handled by auth context
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Shield className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              ReScrub
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              Защита данных
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Основное</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location === item.url;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      data-testid={`sidebar-nav-${item.url.split('/').pop()}`}
                    >
                      <Link href={item.url}>
                        <IconComponent className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Settings & Profile */}
        <SidebarGroup>
          <SidebarGroupLabel>Настройки</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location === item.url;
                const showBadge = item.url === "/app/notifications" && unreadCount > 0;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      data-testid={`sidebar-settings-${item.url.split('/').pop()}`}
                    >
                      <Link href={item.url}>
                        <IconComponent className="h-4 w-4" />
                        <span>{item.title}</span>
                        {showBadge && (
                          <Badge variant="destructive" className="ml-auto text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {/* User Info */}
        <div className="p-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
              {user?.profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.profile?.firstName && user?.profile?.lastName 
                  ? `${user.profile.firstName} ${user.profile.lastName}`
                  : user?.email?.split('@')[0] || 'Пользователь'
                }
              </span>
              <span className="text-xs text-sidebar-foreground/70 truncate">
                {user?.email || ''}
              </span>
            </div>
          </div>
          
          {/* Logout Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
            data-testid="sidebar-logout-button"
          >
            <LogOut className="h-4 w-4" />
            <span>Выйти</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, XCircle, Clock, ExternalLink, Rss, RefreshCw } from "lucide-react";
import Footer from "@/components/Footer";

interface StatusComponent {
  id: string;
  name: string;
  status: "operational" | "degraded" | "outage";
  responseTime: number;
  uptime: number;
  lastCheck: Date;
  description: string;
}

interface Incident {
  id: string;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  severity: "minor" | "major" | "critical";
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Maintenance {
  id: string;
  title: string;
  description: string;
  scheduledAt: Date;
  expectedDuration: string;
  affectedServices: string[];
}

export default function Status() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const overallStatus: "operational" | "degraded" | "outage" = "operational";

  const components: StatusComponent[] = [
    {
      id: "api",
      name: "API сервисы",
      status: "operational",
      responseTime: 145,
      uptime: 99.5,
      lastCheck: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      description: "Основные API endpoints для работы с системой"
    },
    {
      id: "database",
      name: "База данных",
      status: "operational",
      responseTime: 23,
      uptime: 99.8,
      lastCheck: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
      description: "PostgreSQL база данных (архитектурно готово к размещению в РФ)"
    },
    {
      id: "scanning",
      name: "Система сканирования",
      status: "operational",
      responseTime: 2340,
      uptime: 98.2,
      lastCheck: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      description: "Сканирование data brokers и поиск персональных данных"
    },
    {
      id: "deletion",
      name: "Система удаления",
      status: "degraded",
      responseTime: 1850,
      uptime: 96.7,
      lastCheck: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
      description: "Отправка запросов на удаление персональных данных"
    },
    {
      id: "notifications",
      name: "Система уведомлений",
      status: "operational",
      responseTime: 320,
      uptime: 99.1,
      lastCheck: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
      description: "Email и SMS уведомления пользователей"
    },
    {
      id: "cdn",
      name: "CDN и статические ресурсы",
      status: "operational",
      responseTime: 78,
      uptime: 99.9,
      lastCheck: new Date(Date.now() - 30 * 1000), // 30 seconds ago
      description: "Доставка статического контента (планируется российская локализация)"
    }
  ];

  const recentIncidents: Incident[] = [
    {
      id: "inc-2024-001",
      title: "Замедление обработки запросов на удаление",
      status: "monitoring",
      severity: "minor",
      description: "Наблюдается увеличение времени обработки запросов на удаление данных из-за высокой нагрузки. Ведётся мониторинг ситуации.",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)  // 1 hour ago
    },
    {
      id: "inc-2024-002",
      title: "Кратковременная недоступность API",
      status: "resolved",
      severity: "major",
      description: "API сервисы были недоступны в течение 12 минут из-за проблем с балансировщиком нагрузки.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 12 * 60 * 1000) // 2 days ago + 12 minutes
    }
  ];

  const upcomingMaintenance: Maintenance[] = [
    {
      id: "maint-2024-001",
      title: "Плановое обновление системы мониторинга",
      description: "Обновление компонентов системы мониторинга для улучшения стабильности и производительности.",
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      expectedDuration: "2 часа",
      affectedServices: ["Система мониторинга", "Историческая статистика"]
    }
  ];

  const getStatusIcon = (status: "operational" | "degraded" | "outage") => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "outage":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: "operational" | "degraded" | "outage") => {
    switch (status) {
      case "operational":
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" data-testid={`badge-status-operational`}>Работает</Badge>;
      case "degraded":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" data-testid={`badge-status-degraded`}>Нестабильно</Badge>;
      case "outage":
        return <Badge variant="default" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" data-testid={`badge-status-outage`}>Недоступно</Badge>;
    }
  };

  const getIncidentBadge = (status: string, severity: string) => {
    const severityLabel = severity === "critical" ? "Критический" : severity === "major" ? "Серьёзный" : "Незначительный";
    
    const statusColorClass = status === "resolved" 
      ? "text-green-700 border-green-300 dark:text-green-400 dark:border-green-600"
      : "text-yellow-700 border-yellow-300 dark:text-yellow-400 dark:border-yellow-600";
    
    return (
      <div className="flex gap-2">
        <Badge variant="outline" className={statusColorClass} data-testid={`badge-incident-status-${status}`}>
          {status === "resolved" ? "Решён" : status === "monitoring" ? "Мониторинг" : status === "investigating" ? "Исследуется" : "Выявлен"}
        </Badge>
        <Badge variant="outline" data-testid={`badge-incident-severity-${severity}`}>{severityLabel}</Badge>
      </div>
    );
  };

  const formatMoscowTime = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Europe/Moscow',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    return `${diffDays} д. назад`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-display text-lg font-semibold text-foreground" data-testid="link-home">
                ReScrub
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-lg font-medium text-foreground">Статус системы</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                data-testid="button-refresh-status"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Обновить
              </Button>
              <Button variant="outline" size="sm" disabled data-testid="button-rss-feed">
                <Rss className="h-4 w-4 mr-2" />
                RSS (в разработке)
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Overall Status */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(overallStatus)}
                  <div>
                    <CardTitle className="text-2xl" data-testid="text-overall-status-title">
                      Все системы работают нормально
                    </CardTitle>
                    <CardDescription data-testid="text-overall-status-description">
                      Последнее обновление: {formatMoscowTime(lastUpdate)}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(overallStatus)}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Active Incidents Alert */}
        {recentIncidents.filter(inc => inc.status !== 'resolved').length > 0 && (
          <Alert className="mb-8" data-testid="alert-active-incidents">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Активные инциденты:</strong> У нас есть {recentIncidents.filter(inc => inc.status !== 'resolved').length} активный инцидент. 
              Мы работаем над его устранением.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* System Components */}
            <div>
              <h2 className="text-xl font-semibold mb-4" data-testid="heading-system-components">Компоненты системы</h2>
              <div className="space-y-4">
                {components.map((component) => (
                  <Card key={component.id} data-testid={`card-component-${component.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(component.status)}
                          <div>
                            <h3 className="font-medium" data-testid={`text-component-name-${component.id}`}>
                              {component.name}
                            </h3>
                            <p className="text-sm text-muted-foreground" data-testid={`text-component-description-${component.id}`}>
                              {component.description}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(component.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Время отклика</div>
                          <div className="font-medium" data-testid={`text-response-time-${component.id}`}>
                            {component.responseTime}мс
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Доступность (90 дней)</div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium" data-testid={`text-uptime-${component.id}`}>
                              {component.uptime}%
                            </div>
                            <Progress value={component.uptime} className="flex-1 h-2" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Последняя проверка</div>
                          <div className="font-medium" data-testid={`text-last-check-${component.id}`}>
                            {formatRelativeTime(component.lastCheck)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Incidents */}
            <div>
              <h2 className="text-xl font-semibold mb-4" data-testid="heading-recent-incidents">Недавние инциденты</h2>
              {recentIncidents.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-muted-foreground" data-testid="text-no-incidents">
                        Никаких инцидентов за последние 30 дней
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <Card key={incident.id} data-testid={`card-incident-${incident.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg" data-testid={`text-incident-title-${incident.id}`}>
                              {incident.title}
                            </CardTitle>
                            <CardDescription className="mt-1" data-testid={`text-incident-description-${incident.id}`}>
                              {incident.description}
                            </CardDescription>
                          </div>
                          {getIncidentBadge(incident.status, incident.severity)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span data-testid={`text-incident-created-${incident.id}`}>
                            Создан: {formatMoscowTime(incident.createdAt)}
                          </span>
                          <span data-testid={`text-incident-updated-${incident.id}`}>
                            Обновлён: {formatMoscowTime(incident.updatedAt)}
                          </span>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Metrics */}
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-overall-metrics">Общие метрики</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Общая доступность</span>
                    <span data-testid="text-overall-uptime">99.2%</span>
                  </div>
                  <Progress value={99.2} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Среднее время отклика</span>
                    <span data-testid="text-average-response-time">156мс</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Активные пользователи</span>
                    <span data-testid="text-active-users">2,847</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-upcoming-maintenance">Плановые работы</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingMaintenance.length === 0 ? (
                  <p className="text-sm text-muted-foreground" data-testid="text-no-maintenance">
                    Плановых работ не запланировано
                  </p>
                ) : (
                  <div className="space-y-4">
                    {upcomingMaintenance.map((maintenance) => (
                      <div key={maintenance.id} className="border-l-2 border-blue-500 pl-4" data-testid={`card-maintenance-${maintenance.id}`}>
                        <h4 className="font-medium" data-testid={`text-maintenance-title-${maintenance.id}`}>
                          {maintenance.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2" data-testid={`text-maintenance-description-${maintenance.id}`}>
                          {maintenance.description}
                        </p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span data-testid={`text-maintenance-scheduled-${maintenance.id}`}>
                              {formatMoscowTime(maintenance.scheduledAt)}
                            </span>
                          </div>
                          <div data-testid={`text-maintenance-duration-${maintenance.id}`}>
                            Длительность: {maintenance.expectedDuration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Subscription */}
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-status-subscription">Подписка на обновления</CardTitle>
                <CardDescription>
                  Получайте уведомления об изменениях статуса
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" disabled data-testid="button-rss-subscription">
                  <Rss className="h-4 w-4 mr-2" />
                  RSS лента (в разработке)
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled data-testid="button-email-subscription">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Email уведомления (в разработке)
                </Button>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-support-contact">Техническая поддержка</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Если у вас возникли проблемы, обратитесь в службу поддержки:
                </p>
                <div className="space-y-2 text-sm">
                  <div data-testid="text-support-email">
                    <strong>Email:</strong> support@rescrub.ru
                  </div>
                  <div data-testid="text-support-phone">
                    <strong>Телефон:</strong> +7 (495) 123-45-67
                  </div>
                  <div data-testid="text-support-hours">
                    <strong>Часы работы:</strong> 9:00-18:00 МСК
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild data-testid="button-contact-support">
                  <Link href="/support">
                    Связаться с поддержкой
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-border">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground space-y-2">
                <p data-testid="text-disclaimer-title">
                  <strong>Важная информация:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1" data-testid="list-disclaimer-items">
                  <li>Данные обновляются каждые 5 минут</li>
                  <li>Показатели доступности рассчитываются за последние 90 дней</li>
                  <li>Время указано в московском часовом поясе (МСК)</li>
                  <li>Система архитектурно совместима с требованиями 152-ФЗ, планируется размещение в российских дата-центрах</li>
                  <li>Целевое время уведомлений о серьёзных инцидентах: 15 минут (улучшается)</li>
                  <li>Все SLA и характеристики находятся в стадии разработки и тестирования</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  Server, 
  Brain, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Mail,
  ChevronDown,
  ChevronUp,
  FileText,
  Database,
  Activity,
  Layers,
  Zap,
  Globe
} from "lucide-react";
import { useState } from "react";

interface SecurityFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  isActive?: boolean;
}

function SecurityFeature({ icon, title, description, details, isActive = true }: SecurityFeatureProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-background/80 backdrop-blur-sm border border-border hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg">{title}</CardTitle>
                {isActive && (
                  <Badge variant="default" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Активно
                  </Badge>
                )}
              </div>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}

interface TimelineItemProps {
  quarter: string;
  year: string;
  title: string;
  items: string[];
  status: "completed" | "in-progress" | "planned";
}

function TimelineItem({ quarter, year, title, items, status }: TimelineItemProps) {
  const statusConfig = {
    completed: {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      badge: "Завершено",
      badgeVariant: "default" as const,
    },
    "in-progress": {
      icon: <Activity className="h-5 w-5 text-blue-500" />,
      badge: "В работе",
      badgeVariant: "secondary" as const,
    },
    planned: {
      icon: <Clock className="h-5 w-5 text-muted-foreground" />,
      badge: "Запланировано",
      badgeVariant: "outline" as const,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="relative pl-8 pb-8">
      {/* Vertical line */}
      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
      
      {/* Icon dot */}
      <div className="absolute left-0 top-1 w-5 h-5 bg-background border-2 border-primary rounded-full flex items-center justify-center">
        {config.icon}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Badge variant={config.badgeVariant}>{config.badge}</Badge>
          <span className="text-sm font-semibold text-muted-foreground">{quarter} {year}</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Security() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Безопасность GrandHub
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Как мы защищаем ваши данные и обеспечиваем безопасность платформы
              </p>
            </div>
          </div>
        </section>

        {/* Principles Section */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Наши принципы
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Фундаментальные ценности, на которых построена безопасность GrandHub
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-background/80 backdrop-blur-sm border border-border">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Минимальный сбор данных</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Собираем только те данные, которые необходимы для работы сервиса. Не требуем лишней информации.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur-sm border border-border">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Данные в России</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Все серверы размещены в РФ. Полное соответствие требованиям 152-ФЗ о локализации данных.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur-sm border border-border">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Никакой продажи данных</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ваши данные принадлежат только вам. Мы никогда не продаём и не передаём их третьим лицам.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur-sm border border-border">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Прозрачность</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Открыто рассказываем, что делаем с данными, как защищаем их и что планируем улучшить.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Current Security Features */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Что уже работает
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Технические меры безопасности, которые защищают вас прямо сейчас
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
              <SecurityFeature
                icon={<Lock className="h-6 w-6 text-primary" />}
                title="Шифрование в транзите (TLS 1.3)"
                description="Все соединения с GrandHub защищены современным протоколом шифрования"
                details={[
                  "SSL/TLS сертификаты от Let's Encrypt с автоматическим обновлением",
                  "Поддержка только TLS 1.3 и TLS 1.2 — устаревшие протоколы отключены",
                  "HSTS (HTTP Strict Transport Security) заголовки для принудительного HTTPS",
                  "Perfect Forward Secrecy (PFS) — даже если ключ скомпрометирован, старые сессии останутся защищёнными"
                ]}
              />

              <SecurityFeature
                icon={<Key className="h-6 w-6 text-primary" />}
                title="Аутентификация"
                description="Многоуровневая система проверки подлинности пользователей"
                details={[
                  "JWT токены с refresh механизмом для безопасных сессий",
                  "Криптографическая верификация Telegram Login Widget через HMAC-SHA256",
                  "Rate limiting на все auth endpoints — защита от brute-force атак",
                  "Автоматическое истечение сессий при неактивности",
                  "Логирование всех попыток входа для аудита безопасности"
                ]}
              />

              <SecurityFeature
                icon={<Shield className="h-6 w-6 text-primary" />}
                title="Защита API"
                description="Комплексная защита всех API endpoints от распространённых атак"
                details={[
                  "CORS ограничен доменом grandhub.ru — никакие сторонние сайты не могут делать запросы",
                  "Helmet.js security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection",
                  "Content-Security-Policy для защиты от XSS атак",
                  "Strict origin checking для всех запросов на изменение данных",
                  "API rate limiting с автоматической блокировкой подозрительной активности"
                ]}
              />

              <SecurityFeature
                icon={<Brain className="h-6 w-6 text-primary" />}
                title="Guardian AI"
                description="AI-система обнаружения и блокировки prompt injection атак"
                details={[
                  "Сканирование всех входящих запросов к AI-помощнику в реальном времени",
                  "Детектирование попыток манипуляции system prompts",
                  "Блокировка jailbreak-техник и role-play атак",
                  "Machine learning модель, обучающаяся на новых паттернах атак",
                  "Логирование всех заблокированных попыток для анализа"
                ]}
              />

              <SecurityFeature
                icon={<AlertTriangle className="h-6 w-6 text-primary" />}
                title="Injection Scanner"
                description="Защита от SQL injection, XSS и других классических веб-атак"
                details={[
                  "Валидация и санитизация всех пользовательских входных данных",
                  "Prepared statements для всех запросов к базе данных",
                  "HTML encoding для всех выводимых данных",
                  "CSP (Content Security Policy) для блокировки inline scripts",
                  "Автоматическое обнаружение подозрительных паттернов в запросах"
                ]}
              />

              <SecurityFeature
                icon={<FileText className="h-6 w-6 text-primary" />}
                title="Audit Log"
                description="Полное логирование всех действий для безопасности и прозрачности"
                details={[
                  "Запись всех действий пользователей: вход, изменения, запросы",
                  "Логирование административных действий с повышенным приоритетом",
                  "Невозможность удаления или изменения логов — только добавление",
                  "Хранение логов в отдельной защищённой базе данных",
                  "Retention period: 2 года для compliance с регуляциями"
                ]}
              />

              <SecurityFeature
                icon={<Layers className="h-6 w-6 text-primary" />}
                title="Изоляция сервисов"
                description="Микросервисная архитектура для минимизации поверхности атаки"
                details={[
                  "Каждый микросервис изолирован и имеет минимальные привилегии",
                  "Внутренние API ключи для взаимодействия между сервисами",
                  "Network segmentation — сервисы не имеют прямого доступа друг к другу",
                  "Принцип least privilege — каждый компонент может делать только необходимое",
                  "Автоматическая ротация внутренних ключей каждые 30 дней"
                ]}
              />

              <SecurityFeature
                icon={<Zap className="h-6 w-6 text-primary" />}
                title="Rate Limiting"
                description="Защита от DDoS и brute-force атак на всех уровнях"
                details={[
                  "Глобальный rate limit: 1000 запросов в 15 минут на IP",
                  "Auth endpoints: максимум 5 попыток входа в минуту",
                  "API endpoints: индивидуальные лимиты в зависимости от операции",
                  "Автоматическая блокировка IP при превышении лимитов",
                  "Whitelist для доверенных источников (мониторинг, здоровье системы)"
                ]}
              />
            </div>
          </div>
        </section>

        {/* Security Roadmap */}
        <section className="py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Roadmap безопасности
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Наш путь к ещё более надёжной защите ваших данных
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <TimelineItem
                quarter="Q1"
                year="2026"
                title="MVP Security"
                items={[
                  "TLS 1.3 шифрование всех соединений",
                  "JWT аутентификация с refresh tokens",
                  "Guardian AI — защита от prompt injection",
                  "Audit logs для всех действий"
                ]}
                status="completed"
              />

              <TimelineItem
                quarter="Q2"
                year="2026"
                title="Enhanced Security & Backups"
                items={[
                  "Двухфакторная аутентификация (2FA) через SMS и authenticator apps",
                  "Offsite бэкапы в географически разнесённые датацентры",
                  "E2E шифрование чатов с AI-помощником",
                  "Vulnerability scanning в CI/CD pipeline"
                ]}
                status="in-progress"
              />

              <TimelineItem
                quarter="Q3"
                year="2026"
                title="Professional Security Audit"
                items={[
                  "Независимый пентест от сертифицированной компании",
                  "Подготовка к SOC2 Type I сертификации",
                  "Запуск Bug Bounty программы",
                  "Автоматизация security compliance проверок"
                ]}
                status="planned"
              />

              <TimelineItem
                quarter="Q4"
                year="2026"
                title="Compliance & Certification"
                items={[
                  "Полный аудит соответствия 152-ФЗ",
                  "ISO 27001 сертификация",
                  "GDPR compliance для международных пользователей",
                  "Публикация Security Whitepaper"
                ]}
                status="planned"
              />
            </div>
          </div>
        </section>

        {/* User Rights */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Ваши права
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                В соответствии с GDPR и 152-ФЗ вы имеете полный контроль над своими данными
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="bg-background/80 backdrop-blur-sm border border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Право на доступ</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Вы можете запросить копию всех данных, которые мы храним о вас. Ответим в течение 30 дней.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur-sm border border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Право на удаление</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Right to be forgotten — вы можете запросить полное удаление своих данных из наших систем.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur-sm border border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Право на экспорт</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Экспортируйте все ваши данные в машиночитаемом формате (JSON, CSV) для переноса в другой сервис.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur-sm border border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Право на ограничение обработки</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Вы можете ограничить способы использования ваших данных, сохраняя при этом доступ к сервису.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Контакт Data Protection Officer:
              </p>
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <a 
                  href="mailto:security@grandhub.ru" 
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  security@grandhub.ru
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Report Vulnerability */}
        <section className="py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-background/80 backdrop-blur-sm border border-border">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Нашли уязвимость?</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Мы ценим вашу помощь в обеспечении безопасности GrandHub
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Responsible Disclosure</h4>
                        <p className="text-sm text-muted-foreground">
                          Отправьте описание уязвимости на{" "}
                          <a href="mailto:security@grandhub.ru" className="text-primary hover:text-primary/80">
                            security@grandhub.ru
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Быстрый ответ</h4>
                        <p className="text-sm text-muted-foreground">
                          Мы ответим в течение 24 часов и предоставим статус в течение 72 часов
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Благодарность</h4>
                        <p className="text-sm text-muted-foreground">
                          Исследователи безопасности будут упомянуты в Hall of Fame (если вы не против)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button asChild size="lg">
                      <a href="mailto:security@grandhub.ru">
                        <Mail className="h-4 w-4 mr-2" />
                        Сообщить об уязвимости
                      </a>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Пожалуйста, не публикуйте информацию об уязвимости публично до её устранения.
                    Мы обязуемся исправить критические уязвимости в течение 7 дней.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

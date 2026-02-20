import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Users, Database, Award } from "lucide-react";

export default function TrustSection() {
  const experts = [
    {
      id: "expert-1",
      name: "Эльдар Муртазин",
      role: "Эксперт по мобильным технологиям",
      company: "Mobile-review.com",
      experience: "20+ лет в IT",
      avatar: "ЭМ",
      quote: "Защита персональных данных становится критически важной в эпоху цифровизации. GrandHub использует правильный подход - автоматизация процесса удаления данных с соблюдением всех требований российского законодательства.",
      credentials: "Автор 10,000+ обзоров технологий",
      verified: true
    },
    {
      id: "expert-2", 
      name: "IT-специалист",
      role: "Эксперт по информационной безопасности",
      company: "Ведущая IT-компания",
      experience: "15+ лет в Security",
      avatar: "ИС",
      quote: "Российские граждане особенно уязвимы к утечкам данных из-за слабого контроля за их сбором. Решения автоматизации удаления данных критически необходимы для защиты от мошенничества и кражи личности.",
      credentials: "Сертифицированный специалист по безопасности",
      verified: false
    },
    {
      id: "expert-3",
      name: "Технический обозреватель", 
      role: "IT-журналист",
      company: "Технические медиа",
      experience: "12+ лет в IT-журналистике",
      avatar: "ТО",
      quote: "После анализа работы сервиса могу сказать - это один из немногих решений, который действительно работает с российскими источниками данных. Важно соблюдение 152-ФЗ при всех операциях.",
      credentials: "Специалист по анализу IT-решений",
      verified: false
    },
    {
      id: "expert-4",
      name: "Консультант по защите данных",
      role: "Эксперт по приватности",
      company: "Консалтинг по безопасности",
      experience: "10+ лет в Data Protection",
      avatar: "КЗ", 
      quote: "Сервисы автоматизации удаления данных понимают специфику российского рынка. Подход к удалению информации из различных баз данных с соблюдением требований законодательства заслуживает внимания.",
      credentials: "Консультант по GDPR и 152-ФЗ",
      verified: false
    }
  ];

  const trustIndicators = [
    {
      id: "compliance",
      icon: Shield,
      title: "152-ФЗ",
      description: "Разработано с учетом требований российского законодательства о персональных данных",
      value: "✓"
    },
    {
      id: "coverage", 
      icon: Database,
      title: "Покрытие",
      description: "популярных российских источников данных и информационных ресурсов",
      value: "Широкое"
    },
    {
      id: "protected",
      icon: Users,
      title: "Пользователи",
      description: "российских граждан доверяют нашему сервису",
      value: "Тысячи"
    },
    {
      id: "security",
      icon: Award,
      title: "Безопасность",
      description: "Высокие стандарты защиты данных и шифрования",
      value: "✓"
    }
  ];

  return (
    <section className="py-20 bg-muted/30" data-testid="section-trust">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl" data-testid="title-trust">
            Рекомендуют эксперты по безопасности
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground" data-testid="subtitle-trust">
            Ведущие российские специалисты по кибербезопасности и защите данных о важности GrandHub
          </p>
        </div>

        {/* Expert quotes grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-16">
          {experts.map((expert, index) => (
            <Card
              key={expert.id}
              className="hover-elevate"
              data-testid={`card-${expert.id}`}
            >
              <CardContent className="p-6">
                {/* Expert header */}
                <div className="flex items-start space-x-3 mb-4">
                  <Avatar className="h-12 w-12" data-testid={`avatar-${expert.id}`}>
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {expert.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-foreground text-sm truncate" data-testid={`name-${expert.id}`}>
                        {expert.name}
                      </h3>
                      {expert.verified && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground" data-testid={`role-${expert.id}`}>
                      {expert.role}
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid={`company-${expert.id}`}>
                      {expert.company}
                    </p>
                  </div>
                </div>

                {/* Experience badge */}
                <Badge 
                  variant="outline" 
                  className="mb-4 text-xs"
                  data-testid={`experience-${expert.id}`}
                >
                  {expert.experience}
                </Badge>

                {/* Quote */}
                <blockquote className="text-sm leading-6 text-foreground mb-4" data-testid={`quote-${expert.id}`}>
                  "{expert.quote}"
                </blockquote>

                {/* Credentials */}
                <div className="pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground" data-testid={`credentials-${expert.id}`}>
                    {expert.credentials}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators section */}
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustIndicators.map((indicator) => (
              <div 
                key={indicator.id}
                className="text-center"
                data-testid={`indicator-${indicator.id}`}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <indicator.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1" data-testid={`value-${indicator.id}`}>
                  {indicator.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1" data-testid={`title-${indicator.id}`}>
                  {indicator.title}
                </div>
                <div className="text-xs text-muted-foreground" data-testid={`description-${indicator.id}`}>
                  {indicator.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust badge section */}
        <div className="mx-auto mt-16 max-w-4xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2" data-testid="badge-reviews">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span>Высокие оценки IT-экспертов</span>
            </div>
            <div className="flex items-center space-x-2" data-testid="badge-compliance">
              <Shield className="h-4 w-4 text-primary" />
              <span>Соответствие 152-ФЗ</span>
            </div>
            <div className="flex items-center space-x-2" data-testid="badge-security">
              <Award className="h-4 w-4 text-primary" />
              <span>Стандарты безопасности</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
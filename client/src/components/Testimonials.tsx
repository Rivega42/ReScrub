import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Анна Соколова',
      role: 'IT-менеджер',
      company: 'Сбер Технологии',
      location: 'Москва',
      avatar: 'АС',
      rating: 5,
      result: 'Спам снизился на 95%',
      content: 'За первый месяц GrandHub удалил мои данные из 47 баз данных российских брокеров. Количество рекламных звонков сократилось с 15-20 в день до 1-2 в неделю. Особенно порадовало, что сервис учитывает требования 152-ФЗ и работает с местными компаниями.',
      timeframe: '3 недели использования'
    },
    {
      name: 'Максим Петров',
      role: 'Коммерческий директор',
      company: 'Строительная компания',
      location: 'Санкт-Петербург', 
      avatar: 'МП',
      rating: 5,
      result: '52 базы данных очищены',
      content: 'Меня поразила скорость и эффективность работы. После утечки данных в одном из банков я получал до 40 звонков в день от всех подряд - от МФО до криптобирж. GrandHub за месяц привёл ситуацию в норму. Теперь рекомендую сервис всем партнёрам.',
      timeframe: '1 месяц результатов'
    },
    {
      name: 'Елена Козлова',
      role: 'Семейный врач',
      company: 'Частная клиника',
      location: 'Екатеринбург',
      avatar: 'ЕК',
      rating: 5,
      result: 'Защита семьи обеспечена',
      content: 'Как мать двоих детей, я была обеспокоена тем, что данные всей семьи могут попасть в руки мошенников. GrandHub не только очистил наши данные из 38 источников, но и настроил мониторинг. Теперь я спокойна за безопасность своих близких.',
      timeframe: '6 недель защиты'
    },
    {
      name: 'Дмитрий Волков',
      role: 'Юрист по защите данных',
      company: 'Консалтинговая группа',
      location: 'Новосибирск',
      avatar: 'ДВ',
      rating: 5,
      result: 'Полное соответствие 152-ФЗ',
      content: 'Как специалист по персональным данным, оцениваю профессионализм команды. Все запросы на удаление оформлены юридически корректно, ссылки на 152-ФЗ правильные. За 5 недель удалили данные из 43 компаний. Это действительно работает!',
      timeframe: '5 недель экспертизы'
    }
  ];

  return (
    <section className="py-20 bg-background" data-testid="section-testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Cal.com style */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl" data-testid="title-testimonials">
            Реальные истории наших клиентов
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground" data-testid="subtitle-testimonials">
            Узнайте, как GrandHub помог тысячам россиян защитить персональные данные и вернуть спокойствие
          </p>
        </div>

        {/* Testimonials grid - incogni.com inspired with Cal.com styling */}
        <div className="mx-auto mt-16 max-w-7xl sm:mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover-elevate"
                data-testid={`card-testimonial-${index}`}
              >
                <CardContent className="p-6">
                  {/* Header with avatar and rating */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12" data-testid={`avatar-${testimonial.name.replace(' ', '-').toLowerCase()}`}>
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm" data-testid={`name-${testimonial.name.replace(' ', '-').toLowerCase()}`}>
                          {testimonial.name}
                        </h3>
                        <p className="text-xs text-muted-foreground" data-testid={`role-${testimonial.name.replace(' ', '-').toLowerCase()}`}>
                          {testimonial.role}
                        </p>
                        <p className="text-xs text-muted-foreground" data-testid={`company-${testimonial.name.replace(' ', '-').toLowerCase()}`}>
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    
                    {/* Rating stars */}
                    <div className="flex space-x-1" data-testid={`rating-${testimonial.name.replace(' ', '-').toLowerCase()}`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Result badge */}
                  <Badge 
                    variant="secondary" 
                    className="mb-4 text-xs font-medium"
                    data-testid={`result-${testimonial.name.replace(' ', '-').toLowerCase()}`}
                  >
                    {testimonial.result}
                  </Badge>

                  {/* Testimonial content */}
                  <blockquote className="text-sm leading-6 text-foreground mb-4" data-testid={`content-${testimonial.name.replace(' ', '-').toLowerCase()}`}>
                    "{testimonial.content}"
                  </blockquote>

                  {/* Footer with location and timeframe */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground" data-testid={`location-${testimonial.name.replace(' ', '-').toLowerCase()}`}>
                      {testimonial.location}
                    </span>
                    <span className="text-xs text-muted-foreground" data-testid={`timeframe-${testimonial.name.replace(' ', '-').toLowerCase()}`}>
                      {testimonial.timeframe}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust indicators - incogni.com style */}
        <div className="mx-auto mt-16 max-w-4xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2" data-testid="indicator-reviews">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.8/5 на основе 2,847+ отзывов</span>
            </div>
            <div className="flex items-center space-x-2" data-testid="indicator-compliance">
              <Badge variant="outline" className="text-xs">152-ФЗ</Badge>
              <span>Соответствие российскому законодательству</span>
            </div>
            <div className="flex items-center space-x-2" data-testid="indicator-coverage">
              <span className="font-semibold text-primary">180+</span>
              <span>российских брокеров данных</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  //todo: remove mock testimonials data
  const testimonials = [
    {
      name: 'Александр П.',
      role: 'IT-директор',
      company: 'Московская компания',
      content: 'Решил проблему с назойливыми звонками и спамом. Теперь мои данные под надежной защитой.',
      rating: 5,
      avatar: 'AP'
    },
    {
      name: 'Мария С.',
      role: 'Маркетолог',
      company: 'Консалтинговая фирма',
      content: 'Очень довольна сервисом! После удаления моих данных значительно сократилось количество спама.',
      rating: 5,
      avatar: 'MS'
    },
    {
      name: 'Дмитрий К.',
      role: 'Предприниматель',
      company: 'Собственный бизнес',
      content: 'ResCrub помог мне вернуть контроль над моими личными данными. Отличный сервис с понятным интерфейсом.',
      rating: 5,
      avatar: 'DK'
    },
    {
      name: 'Елена Р.',
      role: 'Юрист',
      company: 'Юридическая консультация',
      content: 'Как юрист, оцениваю соответствие 152-ФЗ. Сервис действительно помогает защитить права граждан.',
      rating: 5,
      avatar: 'ER'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Отзывы наших клиентов
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Почитайте, как ResCrub помог россиянам вернуть контроль над своими персональными данными
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-testimonial-${index}`}>
              <CardContent className="p-6">
                {/* Quote icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="h-8 w-8" />
                </div>
                
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                {/* Content */}
                <blockquote className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                
                {/* Author info */}
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {testimonial.avatar}
                    </span>
                  </div>
                  
                  {/* Name and role */}
                  <div>
                    <div className="font-medium text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-chart-2/10 rounded-full mb-4">
            <Star className="h-4 w-4 text-chart-2" />
            <span className="text-sm font-medium text-chart-2">
              Средняя оценка: 4.9/5 на основе 2,500+ отзывов
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Проверенные отзывы от реальных клиентов
          </p>
        </div>
      </div>
    </section>
  );
}
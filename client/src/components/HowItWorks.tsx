import { Card, CardContent } from "@/components/ui/card";
import { Search, FileText, Trash2, Shield, BarChart3, RefreshCw } from "lucide-react";
import processImage from '@assets/generated_images/Data_monitoring_process_illustration_55c35c41.png';

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      icon: Search,
      title: 'Сканирование',
      description: 'Мы сканируем сайты брокеров данных на предмет наличия вашей личной информации',
      time: '~ 1-2 дня до обнаружения'
    },
    {
      step: 2,
      icon: FileText,
      title: 'Отправка запросов',
      description: 'Отправляем автоматические запросы на удаление согласно 152-ФЗ',
      time: '~ 5-14 дней до обработки'
    },
    {
      step: 3,
      icon: RefreshCw,
      title: 'Повторные проверки',
      description: 'Регулярно повторяем процесс, чтобы новые данные не появлялись',
      time: 'Каждые 30 дней'
    },
    {
      step: 4,
      icon: Trash2,
      title: 'Подтверждение удаления',
      description: 'Получаем подтверждения об успешном удалении ваших данных',
      time: 'Отчет каждые 7 дней'
    },
    {
      step: 5,
      icon: BarChart3,
      title: 'Отчеты о прогрессе',
      description: 'Получаете детальные отчеты о процессе защиты ваших данных',
      time: 'В реальном времени'
    },
    {
      step: 6,
      icon: Shield,
      title: 'Непрерывная защита',
      description: 'Мониторим новые сайты и добавляем их в список мониторинга',
      time: 'Постоянно'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Как мы защищаем ваши данные
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Полностью автоматизированный процесс очистки ваших персональных данных 
            с сотен сайтов брокеров данных
          </p>
        </div>

        {/* Process illustration */}
        <div className="mb-16 flex justify-center">
          <div className="relative max-w-2xl">
            <img 
              src={processImage} 
              alt="Процесс мониторинга и удаления данных" 
              className="w-full h-auto rounded-xl shadow-lg"
            />
            <div className="absolute -top-2 -right-2 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-step-${step.step}`}>
                <CardContent className="p-6">
                  {/* Step number */}
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{step.step}</span>
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Time indicator */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                    {step.time}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-chart-2/10 rounded-full">
            <Shield className="h-5 w-5 text-chart-2" />
            <span className="text-sm font-medium text-chart-2">
              Полное соответствие Федеральному закону № 152-ФЗ "О персональных данных"
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import heroImage from '@assets/generated_images/ResCrub_hero_shield_illustration_17021890.png';

export default function Hero() {
  const features = [
    'Защита от спама и мошенничества',
    'Соответствие 152-ФЗ',
    'Мониторинг брокеров данных',
    'Автоматическое удаление'
  ];

  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                Соответствует 152-ФЗ
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Защитите свои{' '}
              <span className="text-primary">
                персональные данные
              </span>{' '}
              от утечек
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              ResCrub автоматически находит и удаляет вашу личную информацию 
              с сайтов брокеров данных в соответствии с российским законодательством.
            </p>
            
            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-hero-signup">
                  Начать защиту бесплатно
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto" data-testid="button-hero-learn">
                  Как это работает
                </Button>
              </Link>
            </div>
            
            {/* Trust indicator */}
            <p className="text-sm text-muted-foreground mt-6">
              ✅ 30 дней гарантии возврата средств
            </p>
          </div>
          
          {/* Right column - Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={heroImage} 
                alt="Защита персональных данных ResCrub" 
                className="w-full h-auto rounded-xl shadow-xl"
              />
            </div>
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Sparkles, Gift, CheckCircle2, ArrowRight, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralInfo {
  code: string;
  referrerName?: string;
  message: string;
  isValid: boolean;
}

interface Plan {
  id: string;
  displayName: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  description: string;
  isPopular?: boolean;
}

export default function InvitePage() {
  const { code } = useParams();
  const { toast } = useToast();
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (code) {
      // Store referral code in localStorage for persistence
      localStorage.setItem('referralCode', code);
      
      // Track referral click
      fetch(`/api/referrals/track-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code,
          userAgent: navigator.userAgent 
        })
      }).catch(console.error);

      // Get real referral info from server
      fetch(`/api/referrals/${code}`)
        .then(res => res.json())
        .then(data => {
          if (data.isValid) {
            setReferralInfo({
              code,
              referrerName: data.referrerName,
              message: `Я уже защитил свои данные и получил приватность! Присоединяйся - получи ${data.discount}% скидку!`,
              isValid: true
            });
          } else {
            setReferralInfo({
              code,
              message: "Недействительная реферальная ссылка",
              isValid: false
            });
          }
        })
        .catch(error => {
          console.error('Error loading referral info:', error);
          setReferralInfo({
            code,
            message: "Ошибка загрузки реферальной ссылки",
            isValid: false
          });
        });
    }

    // Load subscription plans
    fetch('/api/subscription-plans')
      .then(res => res.json())
      .then(data => {
        setPlans(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading plans:', error);
        setLoading(false);
      });
  }, [code]);

  const copyInviteLink = () => {
    const link = `${window.location.origin}/invite/${code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({
      title: "Ссылка скопирована!",
      description: "Поделитесь ей с друзьями для получения бонусов"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateDiscountedPrice = (originalPrice: number) => {
    return Math.round(originalPrice * 0.7); // 30% discount
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!referralInfo?.isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-red-600">Недействительная ссылка</CardTitle>
            <CardDescription>Эта реферальная ссылка не найдена или истекла</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/" asChild>
              <Button>На главную</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-400/10 dark:to-purple-400/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="text-sm font-medium px-4 py-2">
                <Gift className="w-4 h-4 mr-2" />
                Эксклюзивное приглашение
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Защити свои данные
              </span>
              <br />
              <span className="text-2xl md:text-4xl font-medium text-muted-foreground">
                и получи 30% скидку!
              </span>
            </h1>
            
            <div className="max-w-2xl mx-auto mb-6">
              <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-700 dark:text-green-300">Бонус для друзей</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    За каждого приглашенного друга {referralInfo.referrerName} получает 50% скидку на следующий месяц!
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="max-w-2xl mx-auto mb-8">
              <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">{referralInfo.referrerName}</p>
                      <p className="text-sm text-muted-foreground">Уже защищает свою приватность</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    "{referralInfo.message}"
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href={`/login?ref=${code}`} asChild>
                <Button size="lg" className="text-lg px-8 py-6" data-testid="button-start-protection">
                  <Shield className="w-5 h-5 mr-2" />
                  Начать защиту данных
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={copyInviteLink}
                className="text-lg px-8 py-6"
                data-testid="button-copy-invite"
              >
                <Copy className="w-5 h-5 mr-2" />
                {copied ? "Скопировано!" : "Поделиться ссылкой"}
              </Button>
            </div>

            {/* Features highlights */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
              <Card className="text-center hover-elevate">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Автоматическая защита</h3>
                  <p className="text-sm text-muted-foreground">Находим и удаляем ваши данные с 200+ сайтов брокеров</p>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Мониторинг 24/7</h3>
                  <p className="text-sm text-muted-foreground">Отслеживаем появление ваших данных в интернете</p>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Поддержка экспертов</h3>
                  <p className="text-sm text-muted-foreground">Команда специалистов поможет в сложных случаях</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Выберите план со скидкой 30%
          </h2>
          <p className="text-xl text-muted-foreground">
            Специальная цена для приглашенных пользователей
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative hover-elevate ${plan.isPopular ? 'border-2 border-blue-500 dark:border-blue-400' : ''}`}
              data-testid={`card-plan-${plan.id}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    Рекомендуем
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.displayName}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-muted-foreground line-through">
                      ₽{plan.price}
                    </span>
                    <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                      ₽{calculateDiscountedPrice(plan.price)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">/{plan.interval === 'month' ? 'месяц' : 'год'}</p>
                  <Badge variant="secondary" className="text-green-600 dark:text-green-400">
                    Экономия ₽{plan.price - calculateDiscountedPrice(plan.price)}
                  </Badge>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href={`/login?ref=${code}&plan=${plan.id}`} asChild>
                  <Button 
                    className="w-full" 
                    variant={plan.isPopular ? "default" : "outline"}
                    data-testid={`button-choose-${plan.id}`}
                  >
                    Выбрать план
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            Скидка действует только при регистрации по этой ссылке
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Код приглашения: <code className="font-mono">{code}</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
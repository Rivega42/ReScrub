import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BusinessHeader from "@/components/BusinessHeader";
import Footer from "@/components/Footer";
import {
  Bot, ShoppingCart, Gavel, TrendingUp, Store, Shield, Users, Star,
  ArrowRight, CheckCircle, Zap, Globe, Search, Lock, AlertTriangle,
  FileText, DollarSign, ChevronRight, BarChart3, Award, MapPin, Clock
} from "lucide-react";

// Tender flow visualization
function TenderFlow() {
  const steps = [
    { icon: FileText, label: "Заказ", sub: "Разместил", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    { icon: Users, label: "Предложения", sub: "Исполнители", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    { icon: Bot, label: "AI-оценка", sub: "Сравнение цен", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    { icon: Award, label: "Выбор", sub: "Лучший вариант", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    { icon: Lock, label: "Эскроу", sub: "Деньги в защите", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
    { icon: CheckCircle, label: "Готово!", sub: "Сделка закрыта", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  ];
  return (
    <div className="py-6">
      <div className="flex flex-wrap justify-center items-center gap-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex flex-col items-center p-3 rounded-xl border-2 ${step.color} hover:scale-105 transition-transform`} style={{ minWidth: 80 }}>
              <step.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-bold">{step.label}</span>
              <span className="text-xs opacity-70 text-center leading-tight">{step.sub}</span>
            </div>
            {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// Live auction visualization
function LiveAuction() {
  const [currentPrice, setCurrentPrice] = useState(12500);
  const [bids, setBids] = useState([
    { bidder: "Компания А", amount: 12500, time: "сейчас" },
    { bidder: "ИП Иванов", amount: 13200, time: "1 мин" },
    { bidder: "AI-бот Петровой", amount: 13800, time: "3 мин" },
    { bidder: "ООО Строй+", amount: 14500, time: "5 мин" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const drop = Math.floor(Math.random() * 200) + 50;
      setCurrentPrice((p) => Math.max(p - drop, 9000));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-lg max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Обратный аукцион</div>
          <div className="font-semibold text-sm">Ремонт кровли 200 м²</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-500 font-medium">LIVE</span>
        </div>
      </div>

      <div className="text-center py-4 mb-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="text-xs text-muted-foreground mb-1">Текущая цена</div>
        <div className="text-4xl font-bold text-primary transition-all duration-500">
          {currentPrice.toLocaleString("ru-RU")} ₽
        </div>
        <div className="text-xs text-green-500 mt-1">↓ Цена снижается</div>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-medium">Последние ставки:</div>
        {bids.slice(0, 3).map((bid, i) => (
          <div key={i} className={`flex items-center justify-between p-2 rounded-lg text-xs ${i === 0 ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-muted/50"}`}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-green-500 text-white" : "bg-muted-foreground/20"}`}>
                {bid.bidder[0]}
              </div>
              <span className={i === 0 ? "font-semibold text-green-700 dark:text-green-400" : "text-muted-foreground"}>{bid.bidder}</span>
            </div>
            <div className="text-right">
              <div className={`font-bold ${i === 0 ? "text-green-600 dark:text-green-400" : ""}`}>{bid.amount.toLocaleString("ru-RU")} ₽</div>
              <div className="text-muted-foreground">{bid.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400">
          <Bot className="h-3 w-3" />
          <span>AI-автоторг активен — торгуется за вас 24/7</span>
        </div>
      </div>
    </div>
  );
}

// Shop mockup visualization
function ShopMockup() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden max-w-sm mx-auto">
      <div className="bg-gradient-to-r from-primary/80 to-primary p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">🔨</div>
          <div>
            <div className="font-bold">Мастер Сергей</div>
            <div className="text-xs opacity-80">grandhub.ru/shop/master-sergey</div>
          </div>
        </div>
        <div className="flex gap-3 mt-3 text-xs">
          <div className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-300 text-yellow-300" /> 4.9 (124 отзыва)</div>
          <div className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-300" /> Верифицирован</div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide text-xs">Услуги</div>
        {[
          { name: "Ремонт квартиры под ключ", price: "от 2 000 ₽/м²" },
          { name: "Установка дверей", price: "от 3 500 ₽" },
          { name: "Сантехника", price: "от 1 500 ₽" },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <span className="text-sm">{s.name}</span>
            <span className="text-sm font-bold text-primary">{s.price}</span>
          </div>
        ))}
        <Button className="w-full mt-2" size="sm">
          Написать мастеру
        </Button>
      </div>
    </div>
  );
}

export default function Trading() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-primary/5 py-20 lg:py-32">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-5xl mx-auto">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Gavel className="h-3 w-3" />
                  Trading Hub
                </Badge>
                <Badge className="bg-orange-500 text-white border-0">Киллер-фича</Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
                Trading Hub —
                <span className="text-primary block mt-2">умная торговая площадка с AI</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                Тендеры, аукционы, прямые продажи и виртуальный маркетплейс — всё в одном месте.
                AI торгуется за вас, ищет лучшие сделки и защищает каждую транзакцию.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  Создать магазин бесплатно
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Разместить тендер
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "50 000+", label: "Продавцов", icon: Store },
                { value: "₽2.1 млрд", label: "Оборот", icon: DollarSign },
                { value: "98.7%", label: "Успешных сделок", icon: CheckCircle },
                { value: "24/7", label: "AI-автоторг", icon: Bot },
              ].map((s, i) => (
                <div key={i} className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <s.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tenders */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0">Тендеры</Badge>
                <h2 className="text-3xl font-bold mb-6">Найдите лучшего исполнителя</h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  Разместите заказ — AI автоматически найдёт подходящих исполнителей, сравнит предложения
                  и порекомендует лучший вариант по цене и качеству.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Search, text: "AI анализирует портфолио и рейтинг исполнителей" },
                    { icon: BarChart3, text: "Сравнение предложений по 20+ параметрам" },
                    { icon: Lock, text: "Эскроу: деньги защищены до выполнения работы" },
                    { icon: Bot, text: "Автоматическая коммуникация с исполнителями" },
                    { icon: Shield, text: "Арбитраж в случае споров" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
                <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide text-center">Процесс тендера</h3>
                <TenderFlow />
                <div className="mt-4 p-3 rounded-lg bg-muted/50 text-center">
                  <span className="text-xs text-muted-foreground">⚡ Среднее время закрытия тендера: <strong>3 дня</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Auctions */}
        <section className="py-20 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <LiveAuction />
              </div>
              <div className="order-1 lg:order-2">
                <Badge className="mb-4 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-0">Аукционы</Badge>
                <h2 className="text-3xl font-bold mb-6">Умные аукционы в реальном времени</h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  Продавайте и покупайте по реальной рыночной цене. AI-автоторг работает за вас
                  24/7 — побеждает в нужный момент.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title: "Обратные аукционы",
                      desc: "Цена падает — побеждает лучшее предложение исполнителя",
                      color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    },
                    {
                      title: "Классические аукционы",
                      desc: "Продажа товаров и активов — цена растёт",
                      color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    },
                    {
                      title: "AI-автоторг 24/7",
                      desc: "Настройте параметры — бот торгуется пока вы спите",
                      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
                      <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${item.color}`}>{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Direct Sales & Site Builder */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">Прямые продажи</Badge>
                <h2 className="text-3xl font-bold mb-4">Ваш личный магазин за 5 минут</h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  Каждый продавец получает мини-магазин <strong>grandhub.ru/shop/имя</strong>.
                  Опишите что продаёте — AI создаст страницу магазина автоматически.
                </p>
                <div className="space-y-4 mb-6">
                  {[
                    { icon: Store, text: "Каталог товаров, услуг или работ" },
                    { icon: Bot, text: "AI составляет описания и подбирает теги" },
                    { icon: Search, text: "Умный поиск покупателями по всему каталогу" },
                    { icon: Star, text: "Рейтинги и отзывы для доверия клиентов" },
                    { icon: Users, text: "Рекомендации похожих товаров покупателям" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Button className="gap-2">
                  Создать магазин бесплатно
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <ShopMockup />
                <p className="text-center text-xs text-muted-foreground mt-3">Пример страницы продавца</p>
              </div>
            </div>
          </div>
        </section>

        {/* Virtual Marketplace */}
        <section className="py-20 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0">Маркетплейс</Badge>
              <h2 className="text-3xl font-bold mb-4">Виртуальный маркетплейс</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Все мини-магазины объединены в единый каталог с AI-поиском.
                Найдите то, что нужно, за секунды.
              </p>
            </div>

            {/* AI search example */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-lg">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mb-4">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">«найди мастера по ремонту в Питере до 5000₽»</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Мастер Алексей", spec: "Ремонт и отделка", price: "от 3 500 ₽", rating: 4.9, reviews: 87, city: "СПб" },
                    { name: "ИП Смирнова", spec: "Косметический ремонт", price: "от 2 800 ₽", rating: 4.8, reviews: 45, city: "СПб" },
                    { name: "СтройМастер", spec: "Все виды работ", price: "от 4 200 ₽", rating: 4.7, reviews: 203, city: "СПб" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {s.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.spec} • {s.city}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">{s.price}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {s.rating} ({s.reviews})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Bot className="h-3 w-3 text-primary" />
                  AI нашёл 3 подходящих мастера из 12 000 в вашем городе
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Globe, title: "Единый каталог", desc: "50 000+ продавцов — товары, услуги, цифровые продукты в одном месте" },
                { icon: MapPin, title: "Поиск рядом", desc: "Геолокация и фильтр по городу — найди исполнителя поблизости" },
                { icon: Users, title: "Верификация", desc: "Все продавцы проверены — документы, отзывы, история сделок" },
              ].map((item, i) => (
                <Card key={i} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-0">Безопасность</Badge>
              <h2 className="text-3xl font-bold mb-4">Каждая сделка под защитой</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                AI защищает обе стороны сделки — от мошенничества до справедливого арбитража.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Lock,
                  title: "Эскроу",
                  desc: "Деньги замораживаются на счёте до выполнения работы. Никакого обмана.",
                  color: "text-green-600",
                  bg: "bg-green-100 dark:bg-green-900/30"
                },
                {
                  icon: Bot,
                  title: "AI-арбитраж",
                  desc: "Спор? AI анализирует переписку и историю сделки, выносит справедливое решение за 24 часа.",
                  color: "text-blue-600",
                  bg: "bg-blue-100 dark:bg-blue-900/30"
                },
                {
                  icon: AlertTriangle,
                  title: "Fraud Detection",
                  desc: "Система выявляет мошеннические схемы до того, как вы потеряете деньги.",
                  color: "text-orange-600",
                  bg: "bg-orange-100 dark:bg-orange-900/30"
                },
                {
                  icon: Shield,
                  title: "Верификация",
                  desc: "Проверка документов, ИНН, паспорта, истории сделок перед регистрацией.",
                  color: "text-purple-600",
                  bg: "bg-purple-100 dark:bg-purple-900/30"
                },
              ].map((item, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Прозрачные комиссии</h2>
              <p className="text-muted-foreground">Без скрытых платежей. Платите только за результат.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { type: "Аукционы", fee: "5%", desc: "от суммы сделки", highlight: false },
                { type: "Тендеры", fee: "7%", desc: "от суммы тендера", highlight: false },
                { type: "Эскроу", fee: "1.5%", desc: "за защиту платежа", highlight: false },
                { type: "Магазин", fee: "0 ₽", desc: "базовый тариф бесплатно", highlight: true },
              ].map((p, i) => (
                <Card key={i} className={`text-center ${p.highlight ? "border-primary bg-primary/5" : "hover:border-primary/50"} transition-all hover:shadow-md`}>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-2">{p.type}</div>
                    <div className={`text-4xl font-bold mb-1 ${p.highlight ? "text-primary" : ""}`}>{p.fee}</div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                    {p.highlight && <Badge className="mt-3 bg-primary text-primary-foreground text-xs">Бесплатно</Badge>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Начните зарабатывать прямо сейчас</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Создайте магазин за 5 минут или разместите первый тендер бесплатно.
                AI сделает всё остальное.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  Создать магазин бесплатно
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Разместить тендер
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Регистрация бесплатна</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Эскроу защищает сделку</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> AI-поддержка 24/7</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Calendar, Clock, User, Search } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ARTICLES = [
  {
    id: 1, slug: "grandhub-vs-chatgpt", title: "GrandHub vs ChatGPT: почему знание тебя важнее знания всего",
    description: "ChatGPT знает всё в мире. Но он не знает тебя, твои цели, твою семью. Разбираем, почему персонализация — это новое умное.",
    category: "Продукт", author: "Команда GrandHub", publishedAt: "2026-01-15", readingTime: 7, featured: true,
    tags: ["GrandHub", "ChatGPT", "AI", "персонализация"],
  },
  {
    id: 2, slug: "trading-hub-guide", title: "Trading Hub: как GrandHub помогает участвовать в аукционах и тендерах",
    description: "Полный гайд по Trading Hub — уникальной функции GrandHub для участия в торгах, аукционах и поиска поставщиков через AI.",
    category: "Руководства", author: "Команда GrandHub", publishedAt: "2026-01-22", readingTime: 10, featured: true,
    tags: ["Trading Hub", "тендеры", "аукционы", "бизнес"],
  },
  {
    id: 3, slug: "ai-assistant-life-russia", title: "Почему России нужен свой персональный AI-помощник",
    description: "Алиса тупая, GigaChat корпоративный, ChatGPT западный. Разбираем, чего не хватает российским пользователям от AI.",
    category: "Аналитика", author: "Команда GrandHub", publishedAt: "2026-01-28", readingTime: 8, featured: true,
    tags: ["AI", "Россия", "Алиса", "GigaChat"],
  },
  {
    id: 4, slug: "12-skills-overview", title: "12 навыков GrandHub: полный обзор каждого",
    description: "От Финансов до Женского здоровья, от Умного дома до Коуча — разбираем каждый из 12 навыков GrandHub подробно.",
    category: "Продукт", author: "Команда GrandHub", publishedAt: "2026-02-01", readingTime: 12, featured: false,
    tags: ["навыки", "функции", "GrandHub"],
  },
  {
    id: 5, slug: "delegate-routine-ai", title: "Как делегировать рутину AI-помощнику: практический гайд",
    description: "Конкретные примеры задач, которые можно передать GrandHub: от планирования дня до контроля бюджета.",
    category: "Руководства", author: "Команда GrandHub", publishedAt: "2026-02-05", readingTime: 9, featured: false,
    tags: ["делегирование", "рутина", "продуктивность"],
  },
  {
    id: 6, slug: "family-ai-assistant", title: "Семейный AI-помощник: как GrandHub помогает всей семье",
    description: "Навыки Семья, Расписание, Здоровье — как GrandHub становится помощником для каждого члена семьи.",
    category: "Жизнь", author: "Команда GrandHub", publishedAt: "2026-02-10", readingTime: 6, featured: false,
    tags: ["семья", "дети", "расписание"],
  },
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = Array.from(new Set(ARTICLES.map(a => a.category)));
  const featuredArticles = ARTICLES.filter(a => a.featured);
  const filteredArticles = ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8" data-testid="main-blog">
        <div className="text-center mb-12" data-testid="blog-header">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-blog-title">
            Блог GrandHub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-blog-description">
            Статьи об AI-помощниках, персонализации, Trading Hub и жизни с GrandHub
          </p>
        </div>

        {featuredArticles.length > 0 && (
          <section className="mb-12" data-testid="featured-articles-section">
            <h2 className="text-2xl font-bold mb-6">Рекомендуемые статьи</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="hover-elevate" data-testid={`card-featured-article-${article.id}`}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <Badge variant="outline">Рекомендуется</Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(article.publishedAt).toLocaleDateString("ru-RU")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readingTime} мин</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/blog/${article.slug}`}>
                      <Button className="w-full group">
                        Читать статью
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Поиск по статьям..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
            data-testid="select-category"
          >
            <option value="">Все категории</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <section data-testid="all-articles-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Все статьи</h2>
            <div className="text-sm text-muted-foreground">{filteredArticles.length} статей</div>
          </div>
          <div className="grid gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover-elevate" data-testid={`card-article-${article.id}`}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription className="text-base">{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(article.publishedAt).toLocaleDateString("ru-RU")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readingTime} мин</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/blog/${article.slug}`}>
                    <Button className="group">
                      Читать полностью
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

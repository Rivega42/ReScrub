import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRight, Calendar, Clock, User, Search, Filter, ArrowLeft, ExternalLink } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SEO } from '@/components/SEO';
import { 
  EnhancedBlogArticle, 
  createEnhancedBlogArticle, 
  generateInternalLinks,
  generateCategoryConnections,
  generateBreadcrumbJsonLd,
  SEO_CONSTANTS
} from '@shared/seo';

// Types for blog articles
interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  author: string;
  readingTime: number;
  featured: boolean;
  views: number;
}

// Clean mockArticles array with unique IDs and comprehensive SEO anchors
const mockArticles: BlogArticle[] = [
  {
    id: '1',
    title: 'Как удалить персональные данные из ВКонтакте за 15 минут: пошаговая инструкция 2025',
    slug: 'how-to-delete-vk-personal-data-step-by-step',
    description: 'Полное руководство по удалению данных из ВКонтакте с учетом 152-ФЗ. Пошаговые инструкции, скриншоты, альтернативные способы. Экономия времени: от 3 часов до 15 минут.',
    content: '# Как удалить персональные данные из ВКонтакте за 15 минут {#vk-deletion-guide}\\n\\n[🏠 Главная блога](/blog) → [📖 Пошаговые инструкции](/blog/category/step-by-step) → Удаление данных ВК\\n\\n> **⏱ Время выполнения**: 10–15 минут | **🔒 Сложность**: Базовая | **✅ Эффективность**: 94%\\n\\nВКонтакте хранит огромное количество ваших личных данных — и НЕ в ваших интересах.\\n\\n## 📋 Содержание {#vk-table-of-contents}\\n- [🚀 Быстрое удаление данных](#quick-deletion-guide)\\n- [📝 Пошаговая инструкция](#step-by-step-instructions)\\n- [🔄 Альтернативные способы](#alternative-methods)\\n- [🔗 Связанные инструкции](#related-guides)\\n\\n## 🚀 Быстрое удаление данных {#quick-deletion-guide}\\n\\n**⏱️ Общее время:** 15 минут\\n\\n1. [📦 Создание резервной копии](#backup-data)\\n2. [🧹 Очистка персональной информации](#clear-personal-info)\\n3. [🗑️ Удаление контента](#delete-content)\\n4. [🔌 Отключение приложений](#disconnect-apps)\\n5. [💬 Очистка сообщений](#clear-messages)\\n6. [🔒 Настройка приватности](#privacy-settings)\\n7. [❌ Инициация удаления](#initiate-deletion)\\n8. [📱 Подтверждение по SMS](#sms-confirmation)\\n\\n## 📝 Пошаговая инструкция {#step-by-step-instructions}\\n\\n### Шаг 1: Создайте резервную копию {#backup-data}\\n\\nПерейдите на страницу настроек ВК по адресу **vk.com/settings**. Найдите раздел "Общее" и нажмите "Запросить архив данных".\\n\\n### Шаг 2: Очистите персональную информацию {#clear-personal-info}\\n\\nЗайдите в "Редактировать" в верхней части профиля. Удалите или замените личные данные на фиктивные.\\n\\n## 🔗 Связанные инструкции {#related-guides}\\n- [Как удалить данные из Одноклассников](/blog/ok-deletion)\\n- [Удаление из Яндекс.Справочника](/blog/yandex-directory)\\n- [Telegram: настройка приватности](/blog/telegram-privacy)\\n\\n---\\n*Инструкция обновлена в январе 2025 года с учетом последних изменений ВК и требований 152-ФЗ.*',
    category: 'Пошаговые инструкции',
    tags: ['ВКонтакте', 'удаление данных', '152-ФЗ', 'приватность', 'социальные сети'],
    publishedAt: '2025-01-20T10:00:00.000Z',
    author: 'Елена Краснова',
    readingTime: 15,
    featured: true,
    views: 5847
  },
  {
    id: '2',
    title: 'Рейтинг приватности российских социальных сетей 2025: полный анализ',
    slug: 'russian-social-media-privacy-ranking-2025',
    description: 'Эксклюзивное исследование ResCrub: какие социальные сети лучше защищают персональные данные российских пользователей. Анализ 15 популярных платформ.',
    content: '# Рейтинг приватности российских социальных сетей 2025 {#privacy-ranking-2025}\\n\\n[🏠 Главная блога](/blog) → [🔍 Исследования](/blog/category/research) → Рейтинг приватности соцсетей\\n\\n> **📊 Исследование ResCrub**: 73% российских соцсетей получили оценку ниже среднего по защите данных. VK показал лучшие результаты, Одноклассники — худшие.\\n\\n## 📋 Содержание {#privacy-ranking-contents}\\n- [🔬 Методология исследования](#methodology)\\n- [🏆 Топ-5 лучших по приватности](#top-5-best)\\n- [⚠️ Топ-5 худших по защите данных](#worst-5-platforms)\\n- [💡 Практические рекомендации](#practical-recommendations)\\n\\n## 🔬 Методология исследования {#methodology}\\n\\nResCrub проанализировал **15 популярных социальных платформ** в России по следующим критериям:\\n\\n### Критерии оценки (100 баллов максимум) {#evaluation-criteria}\\n\\n**🔍 Прозрачность политики (25 баллов)**\\n- Понятность языка политики конфиденциальности\\n- Детализация использования данных\\n\\n**👤 Контроль пользователя (25 баллов)**\\n- Настройки приватности\\n- Возможность скачать данные\\n\\n## 🏆 Топ-5 лучших по приватности {#top-5-best}\\n\\n### 🥇 1 место: VK — 78/100 баллов {#vk-first-place}\\n\\n**✅ Сильные стороны:**\\n- Детальные настройки приватности\\n- Полная локализация данных в России\\n- Прозрачная политика конфиденциальности\\n\\n### 🥈 2 место: Telegram — 74/100 баллов {#telegram-second-place}\\n\\n**✅ Сильные стороны:**\\n- Сквозное шифрование в секретных чатах\\n- Минимальный сбор персональных данных\\n\\n## 🔗 Связанные статьи {#related-articles}\\n- [Как удалить персональные данные из ВКонтакте](/blog/vk-deletion-guide)\\n- [152-ФЗ: права граждан на защиту персональных данных](/blog/privacy-law-rights)\\n\\n---\\n*Исследование проведено ResCrub в январе 2025 года.*',
    category: 'Исследования',
    tags: ['рейтинг', 'социальные сети', 'приватность', 'исследование', 'VK', 'Telegram'],
    publishedAt: '2025-01-20T11:00:00.000Z',
    author: 'Елена Краснова',
    readingTime: 12,
    featured: true,
    views: 4234
  },
  {
    id: '3',
    title: 'Как остановить спам-звонки в России за 10 минут: 7 проверенных способов',
    slug: 'how-to-stop-spam-calls-russia-complete-guide',
    description: 'Полное руководство по блокировке спам-звонков в России. Пошаговые инструкции для всех операторов, жалобы в Роскомнадзор, защита по 152-ФЗ.',
    content: '# Как остановить спам-звонки в России за 10 минут {#stop-spam-calls-guide}\\n\\n[🏠 Главная блога](/blog) → [🛡️ Защита от спама](/blog/category/spam-protection) → Блокировка спам-звонков\\n\\n> **📈 Эффективность**: 87% сокращение спам-звонков | **⏱️ Время**: 5-10 минут | **💰 Стоимость**: Бесплатно\\n\\n## 📋 Содержание {#spam-calls-contents}\\n- [🎯 7 способов остановить спам-звонки](#seven-methods)\\n- [📱 Блокировка по операторам связи](#operator-blocking)\\n- [⚖️ Жалоба в Роскомнадзор](#roskomnadzor-complaint)\\n\\n## 🎯 7 способов остановить спам-звонки {#seven-methods}\\n\\n### 1️⃣ Блокировка через МТС {#mts-blocking}\\n\\n**📞 Для абонентов МТС:**\\n1. Наберите **152*2#** и нажмите вызов\\n2. В меню выберите "Черный список"\\n3. Включите "Автоопределение спама"\\n\\n### 2️⃣ Защита от спама в Билайн {#beeline-blocking}\\n\\n**🟡 Для абонентов Билайн:**\\n1. Наберите **110*09#**\\n2. Скачайте приложение "Мой Билайн"\\n3. Включите "АнтиСпам"\\n\\n## ⚖️ Жалоба в Роскомнадзор {#roskomnadzor-complaint}\\n\\n**При системных нарушениях:**\\n1. Перейдите на **rkn.gov.ru**\\n2. Заполните форму жалобы на спам-звонки\\n3. Укажите номера спамеров и нарушения 152-ФЗ\\n\\n## 🔗 Связанные статьи {#related-spam-articles}\\n- [Рейтинг приватности российских соцсетей](/blog/privacy-ranking)\\n- [152-ФЗ: полное руководство](/blog/federal-law-guide)\\n\\n---\\n*Инструкция обновлена в январе 2025 года с учетом новых тарифов операторов.*',
    category: 'Защита от спама',
    tags: ['спам-звонки', 'блокировка', '152-ФЗ', 'операторы связи', 'приватность'],
    publishedAt: '2025-01-20T12:00:00.000Z',
    author: 'Дмитрий Козлов',
    readingTime: 10,
    featured: true,
    views: 3876
  },
  {
    id: '4',
    title: '152-ФЗ: полное руководство по правам граждан и обязанностям компаний 2025',
    slug: 'federal-law-152-complete-guide-2025',
    description: 'Исчерпывающий гид по Федеральному закону 152-ФЗ о персональных данных. Права граждан, обязанности компаний, штрафы, практические примеры.',
    content: '# 152-ФЗ: полное руководство по правам граждан 2025 {#law-152-complete-guide}\\n\\n[🏠 Главная блога](/blog) → [⚖️ Правовые вопросы](/blog/category/legal-issues) → 152-ФЗ руководство\\n\\n> **⚖️ Федеральный закон 152-ФЗ** — основной документ, регулирующий обработку персональных данных в России.\\n\\n## 📋 Содержание {#law-152-contents}\\n- [📜 Основные положения 152-ФЗ](#main-provisions)\\n- [👤 Права граждан](#citizen-rights)\\n- [🏢 Обязанности компаний](#company-obligations)\\n- [💰 Штрафы и санкции](#penalties)\\n\\n## 📜 Основные положения 152-ФЗ {#main-provisions}\\n\\n### 🔍 Что такое персональные данные {#personal-data-definition}\\n\\n**Персональные данные** — любая информация, относящаяся к определенному физическому лицу.\\n\\n**📝 Примеры персональных данных:**\\n- 👤 ФИО, дата и место рождения\\n- 📄 Паспортные данные, ИНН, СНИЛС\\n- 📞 Номер телефона, email-адрес\\n\\n## 👤 Права граждан {#citizen-rights}\\n\\n### 📋 Право на информацию {#right-to-information}\\n\\n**Вы имеете право знать:**\\n- Какие ваши данные обрабатываются\\n- Цели обработки данных\\n- Способы обработки\\n\\n### 🗑️ Право на удаление {#right-to-erasure}\\n\\n**Вы можете требовать удаления данных, если:**\\n- Данные обрабатываются незаконно\\n- Отсутствует согласие на обработку\\n- Цель обработки достигнута\\n\\n## 💰 Штрафы и санкции {#penalties}\\n\\n### 🏢 Штрафы для юридических лиц\\n- Первое нарушение: **от 15 000 до 50 000 рублей**\\n- Повторное нарушение: **от 25 000 до 100 000 рублей**\\n- Грубое нарушение: **от 100 000 рублей до 1% от оборота**\\n\\n## 🔗 Связанные статьи {#related-law-articles}\\n- [Как подать жалобу в Роскомнадзор](/blog/roskomnadzor-complaint-guide)\\n- [Рейтинг приватности российских соцсетей](/blog/social-media-privacy)\\n\\n---\\n*Руководство обновлено в январе 2025 года с учетом последних изменений в 152-ФЗ.*',
    category: 'Правовые вопросы',
    tags: ['152-ФЗ', 'права граждан', 'персональные данные', 'Роскомнадзор', 'законодательство'],
    publishedAt: '2025-01-20T14:00:00.000Z',
    author: 'Анна Петрова',
    readingTime: 18,
    featured: true,
    views: 6543
  },
  {
    id: '5',
    title: 'Утечки персональных данных в России 2024-2025: полный анализ ущерба',
    slug: 'data-breaches-russia-2024-2025-analysis',
    description: 'Анализ утечек персональных данных в России за 2024-2025 годы. Статистика, пострадавшие компании, последствия и меры защиты.',
    content: '# Утечки персональных данных в России 2024-2025 {#data-breaches-analysis}\\n\\n[🏠 Главная блога](/blog) → [📊 Анализ инцидентов](/blog/category/incident-analysis) → Утечки данных 2024-2025\\n\\n> **🚨 Критическая статистика**: За 2024 год в России зафиксировано 847 утечек персональных данных, затронувших 23.7 миллиона пользователей.\\n\\n## 📋 Содержание {#breach-analysis-contents}\\n- [📊 Статистика утечек по отраслям](#industry-statistics)\\n- [💥 Крупнейшие инциденты года](#major-incidents)\\n- [🔍 Анализ причин утечек](#breach-causes)\\n- [🛡️ Как защититься](#protection-measures)\\n\\n## 📊 Статистика утечек по отраслям {#industry-statistics}\\n\\n### 🏆 Топ-5 отраслей по количеству утечек\\n\\n1. **🛒 Интернет-торговля** — 234 инцидента (27.6%)\\n2. **🏦 Финансовые услуги** — 156 инцидентов (18.4%)\\n3. **📡 Телекоммуникации** — 143 инцидента (16.9%)\\n\\n## 💥 Крупнейшие инциденты года {#major-incidents}\\n\\n### 🥇 1. Утечка в "СберМаркет" — 2.3 млн записей\\n\\n**📅 Дата:** Март 2024\\n**💰 Ущерб:** 340 млн рублей\\n**💸 Штраф:** 15 млн рублей\\n\\n### 🥈 2. Взлом базы "Мегафон" — 1.8 млн записей\\n\\n**📅 Дата:** Июнь 2024\\n**💰 Ущерб:** 280 млн рублей\\n**💸 Штраф:** 12 млн рублей\\n\\n## 🔍 Анализ причин утечек {#breach-causes}\\n\\n### 💻 Технические причины (67.3%)\\n- SQL-инъекции\\n- XSS-атаки\\n- Слабая аутентификация\\n\\n### 👥 Человеческий фактор (32.7%)\\n- Инсайдерские атаки\\n- Социальная инженерия\\n- Человеческие ошибки\\n\\n## 🛡️ Как защититься от последствий {#protection-measures}\\n\\n**🚨 Немедленные действия при утечке:**\\n1. **🔑 Смените пароли** во всех сервисах\\n2. **🔐 Включите 2FA** везде, где возможно\\n3. **🚫 Заблокируйте карты** если утекли финансовые данные\\n\\n## 🔗 Связанные статьи {#related-breach-articles}\\n- [152-ФЗ: полное руководство по правам граждан](/blog/federal-law-guide)\\n- [Как подать жалобу в Роскомнадзор](/blog/roskomnadzor-complaint)\\n\\n---\\n*Анализ подготовлен экспертами ResCrub на основе данных Роскомнадзора. Обновлено в январе 2025 года.*',
    category: 'Анализ инцидентов',
    tags: ['утечки данных', 'кибербезопасность', 'статистика', 'ущерб', 'защита'],
    publishedAt: '2025-01-20T15:30:00.000Z',
    author: 'Михаил Сидоров',
    readingTime: 22,
    featured: true,
    views: 8921
  }
];

// Enhanced articles with SEO features
const enhancedArticles = mockArticles.map(article => createEnhancedBlogArticle(article));

// Categories for filtering
const categories = Array.from(new Set(mockArticles.map(article => article.category)));

// Blog listing component
export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredArticles, setFeaturedArticles] = useState<BlogArticle[]>([]);
  const [recentArticles, setRecentArticles] = useState<BlogArticle[]>([]);
  
  useEffect(() => {
    setFeaturedArticles(mockArticles.filter(article => article.featured).slice(0, 3));
    setRecentArticles(
      mockArticles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 6)
    );
  }, []);

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO 
        title="Блог ResCrub: защита персональных данных и приватность в России"
        description="Экспертные статьи о защите персональных данных, 152-ФЗ, удалении данных из российских сервисов. Пошаговые инструкции и практические советы."
        canonical="/blog"
        openGraph={{
          type: 'website',
          title: 'Блог ResCrub - Защита персональных данных',
          description: 'Практические руководства по защите приватности, удалению данных и соблюдению 152-ФЗ в России.',
          images: [{
            url: '/images/blog-hero.jpg',
            width: 1200,
            height: 630,
            alt: 'Блог ResCrub о защите данных'
          }]
        }}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Блог ResCrub',
          description: 'Экспертные статьи о защите персональных данных и приватности в России',
          url: 'https://rescrub.com/blog',
          publisher: {
            '@type': 'Organization',
            name: 'ResCrub',
            logo: {
              '@type': 'ImageObject',
              url: 'https://rescrub.com/logo.png'
            }
          },
          mainEntity: enhancedArticles.map(article => ({
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.description,
            datePublished: article.publishedAt,
            author: {
              '@type': 'Person',
              name: article.author
            },
            url: 'https://rescrub.com/blog/' + article.slug
          }))
        }}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8" data-testid="main-blog">
          {/* Blog Header */}
          <div className="text-center mb-12" data-testid="blog-header">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-blog-title">
              Блог о защите персональных данных
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-blog-description">
              Экспертные статьи, пошаговые инструкции и актуальные новости о приватности в российском интернете
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8" data-testid="search-filter-section">
            <div className="relative flex-1" data-testid="search-container">
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
            <div className="flex items-center gap-2" data-testid="filter-container">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
                data-testid="select-category"
              >
                <option value="">Все категории</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Articles */}
          {searchTerm === '' && selectedCategory === '' && featuredArticles.length > 0 && (
            <section className="mb-12" data-testid="featured-articles">
              <h2 className="text-2xl font-semibold mb-6" data-testid="text-featured-title">
                📌 Рекомендуемые статьи
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredArticles.map(article => (
                  <Card key={article.id} className="hover-elevate" data-testid={'card-featured-' + article.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="secondary" data-testid={'badge-category-' + article.id}>
                          {article.category}
                        </Badge>
                        <Badge variant="outline" data-testid={'badge-featured-' + article.id}>
                          ⭐ Популярное
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2" data-testid={'text-title-' + article.id}>
                        {article.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3" data-testid={'text-description-' + article.id}>
                        {article.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3" data-testid={'meta-' + article.id}>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span data-testid={'text-author-' + article.id}>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span data-testid={'text-reading-time-' + article.id}>{article.readingTime} мин</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3" data-testid={'tags-' + article.id}>
                        {article.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs" data-testid={'tag-' + tag.replace(/\s+/g, '-')}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full" data-testid={'button-read-' + article.id}>
                        <Link href={'/blog/' + article.slug}>
                          Читать статью <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Article Grid */}
          <section data-testid="articles-grid">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12" data-testid="no-articles-message">
                <p className="text-muted-foreground text-lg">
                  Статьи не найдены. Попробуйте изменить критерии поиска.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-6" data-testid="text-articles-title">
                  {searchTerm || selectedCategory ? 'Результаты поиска' : '📚 Все статьи'}
                  {filteredArticles.length > 0 && (
                    <span className="text-base font-normal text-muted-foreground ml-2">
                      ({filteredArticles.length})
                    </span>
                  )}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map(article => (
                    <Card key={article.id} className="hover-elevate h-full flex flex-col" data-testid={'card-article-' + article.id}>
                      <CardHeader className="flex-shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" data-testid={'badge-category-' + article.id}>
                            {article.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span data-testid={'text-date-' + article.id}>
                              {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                        <CardTitle className="text-lg line-clamp-2" data-testid={'text-title-' + article.id}>
                          {article.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3" data-testid={'text-description-' + article.id}>
                          {article.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3" data-testid={'meta-' + article.id}>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span data-testid={'text-author-' + article.id}>{article.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span data-testid={'text-reading-time-' + article.id}>{article.readingTime} мин</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1" data-testid={'tags-' + article.id}>
                          {article.tags.slice(0, 4).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs" data-testid={'tag-' + tag.replace(/\s+/g, '-')}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-shrink-0">
                        <Button asChild className="w-full" data-testid={'button-read-' + article.id}>
                          <Link href={'/blog/' + article.slug}>
                            Читать полностью <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}

// Individual blog post component  
export function BlogPost() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const slug = params.slug as string;
  
  const article = mockArticles.find(a => a.slug === slug);
  
  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8" data-testid="article-not-found">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-not-found-title">
              Статья не найдена
            </h1>
            <p className="text-muted-foreground mb-8" data-testid="text-not-found-description">
              Запрашиваемая статья не существует или была перемещена.
            </p>
            <Button asChild data-testid="button-back-to-blog">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к блогу
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const enhancedArticle = createEnhancedBlogArticle(article);
  const relatedArticles = mockArticles
    .filter(a => a.id !== article.id && 
                 (a.category === article.category || 
                  a.tags.some(tag => article.tags.includes(tag))))
    .slice(0, 3);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: 'Блог', url: '/blog' },
    { name: article.title, url: '/blog/' + article.slug }
  ]);

  return (
    <>
      <SEO 
        title={article.title + ' | ResCrub'}
        description={article.description}
        canonical={'/blog/' + article.slug}
        openGraph={{
          type: 'article',
          title: article.title,
          description: article.description,
          publishedTime: article.publishedAt,
          authors: [article.author],
          tags: article.tags,
          images: [{
            url: '/images/blog/' + article.slug + '.jpg',
            width: 1200,
            height: 630,
            alt: article.title
          }]
        }}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.description,
          image: '/images/blog/' + article.slug + '.jpg',
          datePublished: article.publishedAt,
          dateModified: article.publishedAt,
          author: {
            '@type': 'Person',
            name: article.author
          },
          publisher: {
            '@type': 'Organization',
            name: 'ResCrub',
            logo: {
              '@type': 'ImageObject',
              url: 'https://rescrub.com/logo.png'
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://rescrub.com/blog/' + article.slug
          },
          breadcrumb: breadcrumbJsonLd
        }}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8" data-testid="main-article">
          {/* Breadcrumb */}
          <nav className="mb-8" data-testid="breadcrumb-nav">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground" data-testid="link-home">
                Главная
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-foreground" data-testid="link-blog">
                Блог
              </Link>
              <span>/</span>
              <span className="text-foreground" data-testid="text-current-article">
                {article.category}
              </span>
            </div>
          </nav>

          {/* Article Header */}
          <article className="max-w-4xl mx-auto" data-testid="article-content">
            <header className="mb-8" data-testid="article-header">
              <div className="flex items-center gap-2 mb-4" data-testid="article-meta">
                <Badge variant="secondary" data-testid="badge-category">
                  {article.category}
                </Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span data-testid="text-publish-date">
                      {new Date(article.publishedAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span data-testid="text-author">{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span data-testid="text-reading-time">{article.readingTime} мин чтения</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold mb-4" data-testid="text-article-title">
                {article.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6" data-testid="text-article-description">
                {article.description}
              </p>
              
              <div className="flex flex-wrap gap-2" data-testid="article-tags">
                {article.tags.map(tag => (
                  <Badge key={tag} variant="outline" data-testid={'tag-' + tag.replace(/\s+/g, '-')}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:scroll-mt-20"
              dangerouslySetInnerHTML={{ __html: enhancedArticle.enhancedContent }}
              data-testid="article-body"
            />

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t" data-testid="article-footer">
              <div className="flex justify-between items-center">
                <Button variant="outline" asChild data-testid="button-back-to-blog">
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Назад к блогу
                  </Link>
                </Button>
                
                <Button asChild data-testid="button-share">
                  <a 
                    href={'https://twitter.com/intent/tweet?text=' + encodeURIComponent(article.title) + '&url=' + encodeURIComponent(window.location.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Поделиться
                  </a>
                </Button>
              </div>
            </footer>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-16 max-w-4xl mx-auto" data-testid="related-articles">
              <h2 className="text-2xl font-semibold mb-6" data-testid="text-related-title">
                📖 Связанные статьи
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map(relatedArticle => (
                  <Card key={relatedArticle.id} className="hover-elevate" data-testid={'card-related-' + relatedArticle.id}>
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit" data-testid={'badge-related-category-' + relatedArticle.id}>
                        {relatedArticle.category}
                      </Badge>
                      <CardTitle className="text-lg line-clamp-2" data-testid={'text-related-title-' + relatedArticle.id}>
                        {relatedArticle.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3" data-testid={'text-related-description-' + relatedArticle.id}>
                        {relatedArticle.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button asChild variant="outline" size="sm" className="w-full" data-testid={'button-read-related-' + relatedArticle.id}>
                        <Link href={'/blog/' + relatedArticle.slug}>
                          Читать <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
}
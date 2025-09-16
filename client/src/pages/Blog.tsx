import { useState, useMemo, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Calendar, Clock, User, Rss, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

// Mock blog articles with realistic Russian content
const mockArticles: BlogArticle[] = [
  {
    id: '1',
    title: 'Новые требования 152-ФЗ: что изменилось в 2025 году',
    slug: 'new-152-fz-requirements-2025',
    description: 'Разбираем ключевые изменения в законодательстве о персональных данных, вступившие в силу с 1 января 2025 года, и их влияние на бизнес.',
    content: `# Новые требования 152-ФЗ: что изменилось в 2025 году

С 1 января 2025 года вступили в силу важные изменения в Федеральном законе "О персональных данных" (152-ФЗ), которые существенно влияют на работу российских компаний.

## Ключевые изменения

### 1. Усиленные требования к согласию

Теперь согласие на обработку персональных данных должно быть:
- **Явным и недвусмысленным** - никаких предустановленных галочек
- **Конкретным** - четко указывать цели обработки
- **Информированным** - содержать полную информацию о правах субъекта

### 2. Право на портируемость данных

Нововведение, аналогичное GDPR - граждане теперь имеют право:
- Получить свои данные в структурированном формате
- Передать данные другому оператору
- Требовать прямую передачу между операторами

### 3. Уведомления о нарушениях

Обязательное уведомление Роскомнадзора о нарушениях безопасности:
- **Срок уведомления** - 24 часа с момента обнаружения
- **Детализация** - характер нарушения, количество затронутых субъектов
- **План восстановления** - меры по устранению последствий

### 4. Повышенные штрафы

Значительное увеличение размеров административных штрафов:
- Для юридических лиц - до 6% от оборота
- Для должностных лиц - до 200 тысяч рублей
- Повторные нарушения - удвоение размера штрафа

## Влияние на бизнес

### Технические требования

1. **Обновление систем согласий** - пересмотр всех форм сбора данных
2. **Внедрение систем мониторинга** - отслеживание нарушений в режиме реального времени
3. **Разработка API портируемости** - возможность экспорта данных пользователей

### Организационные меры

1. **Обучение персонала** - новые требования и процедуры
2. **Обновление политик** - приведение документов в соответствие
3. **Аудит текущих процессов** - выявление несоответствий

## Рекомендации по внедрению

### Этап 1: Аудит (январь-февраль 2025)
- Инвентаризация всех обрабатываемых персональных данных
- Анализ текущих согласий на соответствие новым требованиям
- Оценка технической готовности систем

### Этап 2: Планирование (март 2025)
- Разработка плана приведения в соответствие
- Определение бюджета на внедрение
- Назначение ответственных лиц

### Этап 3: Внедрение (апрель-июнь 2025)
- Обновление технических систем
- Переработка документооборота
- Обучение сотрудников

### Этап 4: Контроль (постоянно)
- Регулярный мониторинг соответствия
- Обновление процедур при изменениях
- Подготовка к проверкам регулятора

## Заключение

Новые требования 152-ФЗ создают более строгие рамки для работы с персональными данными, но также способствуют повышению доверия пользователей. Компании, которые проактивно адаптируются к изменениям, получат конкурентное преимущество в области защиты данных.

Для успешного внедрения рекомендуется использовать специализированные платформы, такие как ReScrub, которые автоматизируют процессы соблюдения требований и снижают риски нарушений.`,
    category: '152-ФЗ',
    tags: ['закон', 'персональные данные', 'обновления'],
    publishedAt: '2025-01-15T09:00:00.000Z',
    author: 'Мария Петрова',
    readingTime: 8,
    featured: true,
    views: 2847
  },
  {
    id: '2',
    title: 'GDPR vs 152-ФЗ: сравнительный анализ требований к защите данных',
    slug: 'gdpr-vs-152-fz-comparison',
    description: 'Сравниваем европейские и российские стандарты защиты персональных данных. Что общего и в чем различия для международного бизнеса.',
    content: `# GDPR vs 152-ФЗ: сравнительный анализ требований к защите данных

С развитием международного бизнеса компании всё чаще сталкиваются с необходимостью соблюдения различных требований к защите персональных данных. Рассмотрим ключевые различия между европейским GDPR и российским 152-ФЗ.

## Общие принципы

### Схожие подходы

Оба регулирования основаны на принципах:
- **Законности обработки** - наличие правовых оснований
- **Минимизации данных** - обработка только необходимых данных
- **Прозрачности** - информирование субъектов о обработке
- **Безопасности** - защита от несанкционированного доступа

### Права субъектов

Общие права включают:
- Право на доступ к информации
- Право на исправление данных
- Право на удаление ("право на забвение")
- Право на ограничение обработки

## Ключевые различия

### 1. Территориальная применимость

**GDPR:**
- Применяется к компаниям в ЕС и за пределами ЕС, обрабатывающим данные резидентов ЕС
- Экстерриториальный эффект
- Охватывает предложение товаров/услуг или мониторинг поведения

**152-ФЗ:**
- Применяется к операторам, использующим средства автоматизации на территории РФ
- Распространяется на данные граждан РФ
- Требование локализации для российских граждан

### 2. Правовые основания

**GDPR (статья 6):**
- Согласие субъекта
- Исполнение договора
- Соблюдение правовых обязательств
- Защита жизненно важных интересов
- Выполнение задач в общественных интересах
- Законные интересы (с тестом балансировки)

**152-ФЗ (статья 6):**
- Согласие субъекта
- Исполнение договора
- Осуществление правосудия
- Исполнение законодательно установленных функций
- Обработка общедоступных данных
- Обработка для статистических/исследовательских целей

### 3. Согласие

**GDPR:**
- Должно быть свободным, конкретным, информированным и недвусмысленным
- Возможность легкого отзыва
- Запрет на предварительно отмеченные поля
- Принцип "granular consent" (детализированное согласие)

**152-ФЗ:**
- Письменная форма или электронная подпись
- Возможность отзыва с сохранением законности предыдущей обработки
- Конкретизация целей и способов обработки
- Менее строгие требования к форме

## Сравнение санкций

### GDPR
- **Административные штрафы:** до 4% от мирового оборота или 20 млн евро
- **Компенсации:** неограниченные возмещения ущерба
- **Дополнительные меры:** приостановка передач данных, временный запрет обработки

### 152-ФЗ
- **Административные штрафы:** до 6% от оборота (с 2025 года)
- **Уголовная ответственность:** до 5 лет лишения свободы
- **Блокировка:** возможность блокировки сайтов Роскомнадзором

## Особенности для международного бизнеса

### Передача данных

**GDPR:**
- Решения о адекватности Европейской комиссии
- Стандартные договорные условия (SCC)
- Обязательные корпоративные правила (BCR)
- Сертификация и кодексы поведения

**152-ФЗ:**
- Согласие субъекта на трансграничную передачу
- Передача в страны с адекватным уровнем защиты
- Требование локализации для российских граждан
- Обязательство обеспечить защиту при передаче

### Назначение представителей

**GDPR:**
- Обязательное назначение представителя в ЕС для компаний вне ЕС
- Исключения для случайной обработки

**152-ФЗ:**
- Требования к локализации данных российских граждан
- Назначение ответственного за организацию обработки

## Практические рекомендации

### Для российских компаний, работающих в ЕС:

1. **Двойное соответствие:** разработка политик, учитывающих оба регулирования
2. **Единая система управления:** интеграция требований в общие процессы
3. **Обучение персонала:** понимание специфики каждой юрисдикции
4. **Техническая архитектура:** системы, поддерживающие различные требования

### Для европейских компаний в России:

1. **Локализация данных:** соблюдение требований 152-ФЗ по размещению данных
2. **Адаптация согласий:** учет российских требований к форме согласия
3. **Локальное представительство:** назначение ответственных лиц в России
4. **Регулярный аудит:** контроль соответствия обоим регулированиям

## Тренды конвергенции

Наблюдается сближение подходов:
- **Усиление штрафов** в российском законодательстве
- **Право на портируемость** в 152-ФЗ (с 2025 года)
- **Уведомления о нарушениях** - общий тренд
- **Privacy by Design** - внедрение принципов в российскую практику

## Заключение

Несмотря на различия в подходах, оба регулирования направлены на защиту прав граждан и повышение ответственности компаний. Для международного бизнеса критически важно понимать специфику каждой юрисдикции и строить комплексную стратегию соответствия.

Использование специализированных платформ, таких как ReScrub, позволяет автоматизировать процессы соблюдения требований обоих регулирований и минимизировать риски нарушений.`,
    category: 'Data Privacy',
    tags: ['GDPR', '152-ФЗ', 'сравнение', 'международное право'],
    publishedAt: '2025-01-08T14:30:00.000Z',
    author: 'Александр Соколов',
    readingTime: 12,
    featured: false,
    views: 1923
  },
  {
    id: '3',
    title: 'Автоматическое удаление данных: новые возможности платформы',
    slug: 'automatic-data-deletion-features',
    description: 'Представляем новый функционал ReScrub для автоматического удаления данных по расписанию и соблюдения требований "права на забвение".',
    content: `# Автоматическое удаление данных: новые возможности платформы

Представляем долгожданное обновление ReScrub - функционал автоматического удаления персональных данных, который кардинально упрощает соблюдение требований "права на забвение" и помогает компаниям автоматизировать управление жизненным циклом данных.

## Что нового в платформе

### 1. Автоматическое удаление по расписанию

**Настройка правил удаления:**
- Удаление данных через заданный период после окончания цели обработки
- Автоматическое удаление неактивных аккаунтов
- Очистка временных данных и логов
- Удаление данных маркетинговых кампаний по завершении

**Гибкая конфигурация:**
\`\`\`javascript
// Пример настройки правила
{
  "ruleName": "Удаление неактивных пользователей",
  "condition": "lastActivity > 730 days",
  "action": "deleteUserData",
  "exceptions": ["contractualObligations", "legalRequirements"],
  "notificationPeriod": "30 days"
}
\`\`\`

### 2. Смарт-поиск связанных данных

**Технология Deep Data Discovery:**
- Автоматический поиск данных пользователя во всех связанных системах
- Обнаружение данных в резервных копиях и архивах
- Идентификация связей между различными типами данных
- Поиск производных данных и аналитических выводов

**Визуализация связей:**
- Интерактивная карта данных пользователя
- Граф связей между различными сущностями
- Временная линия обработки данных
- Отчет о полноте обнаружения

### 3. Соблюдение права на забвение

**Автоматическая обработка запросов:**

1. **Получение запроса** - через веб-форму, email или API
2. **Верификация личности** - многофакторная аутентификация
3. **Анализ обоснованности** - проверка исключений из права на удаление
4. **Поиск данных** - использование Deep Data Discovery
5. **Удаление** - безвозвратное удаление с подтверждением
6. **Уведомление** - отчет заявителю о выполнении запроса

**Исключения и ограничения:**
- Данные, необходимые для исполнения договорных обязательств
- Информация, требуемая законодательством
- Данные для защиты прав и законных интересов третьих лиц
- Архивные данные для исторических исследований

### 4. Интеграция с существующими системами

**API для разработчиков:**
\`\`\`javascript
// Создание правила автоудаления
fetch('/api/deletion-rules', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    dataType: 'userProfile',
    retentionPeriod: '2 years',
    triggerEvent: 'accountDeactivation',
    notifications: {
      warning: '30 days',
      confirmation: 'immediate'
    }
  })
});
\`\`\`

**Поддерживаемые системы:**
- CRM: Salesforce, HubSpot, Битрикс24
- Базы данных: PostgreSQL, MySQL, MongoDB
- Облачные хранилища: AWS S3, Google Cloud, Яндекс.Облако
- Email-сервисы: Mailchimp, SendGrid, UniSender

## Преимущества автоматизации

### Снижение рисков

**Compliance-риски:**
- Автоматическое соблюдение сроков хранения данных
- Снижение вероятности штрафов за нарушение права на забвение
- Документирование всех операций с данными
- Соответствие требованиям аудита

**Операционные риски:**
- Исключение человеческого фактора при удалении данных
- Предотвращение случайного удаления важных данных
- Автоматическое резервное копирование перед удалением
- Восстановление в случае ошибочного удаления

### Экономия ресурсов

**Автоматизация процессов:**
- До 90% сокращения времени на обработку запросов на удаление
- Снижение нагрузки на IT-отдел и службу поддержки
- Автоматическое создание отчетов для регулятора
- Масштабируемость без пропорционального роста затрат

**Оптимизация хранения:**
- Автоматическая очистка устаревших данных
- Сжатие и архивирование редко используемых данных
- Освобождение дискового пространства
- Снижение затрат на облачное хранение

## Безопасность удаления

### Методы безопасного удаления

**Для обычных данных:**
- Многократная перезапись случайными данными
- Криптографическое удаление ключей шифрования
- Физическое уничтожение носителей при необходимости
- Верификация полноты удаления

**Для резервных копий:**
- Автоматическое обновление политик резервного копирования
- Исключение удаленных данных из новых копий
- Планируемое удаление из существующих архивов
- Документирование процесса для аудита

### Аудит и отчетность

**Детальные логи:**
- Кто, когда и какие данные были удалены
- Причина удаления (автоматическое правило или запрос)
- Результат операции и подтверждение удаления
- Цепочка обработки от запроса до завершения

**Отчеты для регулятора:**
- Автоматическое формирование отчетов о соблюдении права на забвение
- Статистика по времени обработки запросов
- Анализ причин отказов в удалении
- Доказательства технической невозможности удаления

## Настройка и внедрение

### Пошаговый план внедрения

**Этап 1: Анализ данных (1-2 недели)**
- Инвентаризация всех типов персональных данных
- Определение источников и мест хранения
- Анализ связей между различными системами
- Оценка текущих процессов удаления

**Этап 2: Настройка правил (1 неделя)**
- Определение политик хранения для каждого типа данных
- Настройка автоматических правил удаления
- Конфигурация исключений и особых случаев
- Тестирование на тестовых данных

**Этап 3: Интеграция (2-3 недели)**
- Подключение всех систем через API
- Настройка синхронизации данных
- Конфигурация уведомлений и алертов
- Обучение персонала работе с системой

**Этап 4: Запуск (1 неделя)**
- Поэтапный запуск в продуктивной среде
- Мониторинг работы системы
- Корректировка настроек при необходимости
- Документирование процессов

### Рекомендации по настройке

**Периоды хранения по типам данных:**
- Маркетинговые данные: 1-2 года после последнего взаимодействия
- Данные веб-аналитики: 6-12 месяцев
- Логи безопасности: 3-6 месяцев
- Данные клиентов: согласно договорным обязательствам + 3 года

**Уведомления пользователей:**
- За 30 дней до планируемого удаления
- За 7 дней с возможностью продления
- Немедленно после выполнения удаления
- Ежегодный отчет о обработанных данных

## Заключение

Автоматическое удаление данных - это не просто техническая функция, а стратегический инструмент для построения доверительных отношений с пользователями и соблюдения требований регуляторов.

Новые возможности ReScrub позволяют компаниям:
- Полностью автоматизировать управление жизненным циклом данных
- Обеспечить 100% соблюдение права на забвение
- Сократить операционные расходы на до 80%
- Минимизировать риски нарушений и штрафов

Платформа уже доступна для всех клиентов ReScrub. Новые пользователи могут воспользоваться 30-дневным пробным периодом для тестирования всех возможностей.`,
    category: 'Platform Updates',
    tags: ['обновления', 'автоматизация', 'право на забвение'],
    publishedAt: '2024-12-28T10:15:00.000Z',
    author: 'Дмитрий Волков',
    readingTime: 6,
    featured: true,
    views: 3421
  },
  {
    id: '4',
    title: 'Как настроить мониторинг соответствия 152-ФЗ в вашей компании',
    slug: 'setup-152-fz-compliance-monitoring',
    description: 'Пошаговое руководство по внедрению системы мониторинга соответствия требованиям законодательства о персональных данных.',
    content: 'Подробный гид по настройке мониторинга...',
    category: 'Guides',
    tags: ['руководство', 'мониторинг', 'соответствие'],
    publishedAt: '2024-12-20T16:45:00.000Z',
    author: 'Елена Иванова',
    readingTime: 15,
    featured: false,
    views: 1654
  },
  {
    id: '5',
    title: 'Штрафы за нарушение 152-ФЗ в 2025: статистика и тренды',
    slug: 'fines-152-fz-violations-2025-stats',
    description: 'Анализируем статистику штрафов Роскомнадзора за нарушения в области защиты персональных данных и основные причины нарушений.',
    content: 'Статистический анализ нарушений...',
    category: '152-ФЗ',
    tags: ['штрафы', 'статистика', 'Роскомнадзор'],
    publishedAt: '2024-12-15T11:20:00.000Z',
    author: 'Андрей Смирнов',
    readingTime: 9,
    featured: false,
    views: 2156
  },
  {
    id: '6',
    title: 'Интеграция с популярными CRM: защита данных клиентов',
    slug: 'crm-integration-customer-data-protection',
    description: 'Обеспечиваем защиту персональных данных при интеграции ReScrub с популярными CRM-системами: Битрикс24, amoCRM, Salesforce.',
    content: 'Руководство по интеграции с CRM...',
    category: 'Guides',
    tags: ['интеграция', 'CRM', 'защита данных'],
    publishedAt: '2024-12-05T13:10:00.000Z',
    author: 'Ольга Козлова',
    readingTime: 11,
    featured: false,
    views: 987
  },
  {
    id: '7',
    title: 'Право на забвение в цифровую эпоху: практические аспекты',
    slug: 'right-to-be-forgotten-digital-age',
    description: 'Исследуем практическую реализацию права на забвение в России и Европе. Технические и юридические вызовы современности.',
    content: 'Анализ права на забвение...',
    category: 'Data Privacy',
    tags: ['право на забвение', 'цифровые права', 'технологии'],
    publishedAt: '2024-11-28T09:30:00.000Z',
    author: 'Мария Петрова',
    readingTime: 10,
    featured: true,
    views: 1789
  },
  {
    id: '8',
    title: 'Безопасность API: защита персональных данных в веб-сервисах',
    slug: 'api-security-personal-data-protection',
    description: 'Лучшие практики обеспечения безопасности API при работе с персональными данными. Шифрование, аутентификация и мониторинг.',
    content: 'Руководство по безопасности API...',
    category: 'Guides',
    tags: ['API', 'безопасность', 'веб-сервисы'],
    publishedAt: '2024-11-22T15:25:00.000Z',
    author: 'Владимир Кузнецов',
    readingTime: 14,
    featured: false,
    views: 1432
  }
];

const categories = [
  { name: 'Все статьи', slug: 'all', count: 8 },
  { name: 'Data Privacy', slug: 'data-privacy', count: 2 },
  { name: '152-ФЗ', slug: '152-fz', count: 2 },
  { name: 'Platform Updates', slug: 'platform-updates', count: 1 },
  { name: 'Guides', slug: 'guides', count: 3 }
];

// Format date in Russian
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Moscow'
  };
  return date.toLocaleDateString('ru-RU', options);
};

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'views'>('date');
  
  const articlesPerPage = 6;

  // SEO Meta Tags Management
  useEffect(() => {
    // Update document title
    document.title = 'Блог ReScrub - Защита персональных данных и 152-ФЗ';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Читайте актуальные статьи о защите персональных данных, соблюдении 152-ФЗ, GDPR и цифровой безопасности. Экспертные материалы от команды ReScrub.');
    }

    // Add Open Graph tags
    const addOrUpdateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    addOrUpdateMeta('og:title', 'Блог ReScrub - Защита персональных данных');
    addOrUpdateMeta('og:description', 'Экспертные статьи о защите данных, 152-ФЗ и цифровой безопасности');
    addOrUpdateMeta('og:type', 'website');
    addOrUpdateMeta('og:url', window.location.href);
    addOrUpdateMeta('og:site_name', 'ReScrub');
    
    // Twitter Card tags
    const addOrUpdateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    addOrUpdateTwitterMeta('twitter:card', 'summary_large_image');
    addOrUpdateTwitterMeta('twitter:title', 'Блог ReScrub - Защита персональных данных');
    addOrUpdateTwitterMeta('twitter:description', 'Экспертные статьи о защите данных, 152-ФЗ и цифровой безопасности');

    // Structured Data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Блог ReScrub",
      "description": "Экспертные статьи о защите персональных данных, соблюдении 152-ФЗ и цифровой безопасности",
      "url": window.location.href,
      "publisher": {
        "@type": "Organization",
        "name": "ReScrub",
        "url": window.location.origin
      },
      "blogPost": mockArticles.slice(0, 5).map(article => ({
        "@type": "BlogPosting",
        "headline": article.title,
        "description": article.description,
        "author": {
          "@type": "Person",
          "name": article.author
        },
        "datePublished": article.publishedAt,
        "articleSection": article.category,
        "keywords": article.tags.join(', '),
        "wordCount": Math.round(article.readingTime * 200) // Approximate word count
      }))
    };

    // Add or update structured data script
    let structuredDataScript = document.querySelector('#blog-structured-data') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'blog-structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

    // Cleanup function
    return () => {
      // Remove blog-specific meta tags when component unmounts
      document.title = 'ReScrub - Защита ваших персональных данных';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'ReScrub - российская платформа для защиты персональных данных в соответствии с 152-ФЗ. Автоматическое удаление данных с сайтов брокеров данных.');
      }
    };
  }, []);

  // Filter and search articles
  const filteredArticles = useMemo(() => {
    let filtered = mockArticles;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => 
        article.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort articles
    filtered.sort((a, b) => {
      if (sortBy === 'views') {
        return b.views - a.views;
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
    
    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  // Popular articles (by views)
  const popularArticles = useMemo(() => {
    return [...mockArticles]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }, []);

  // Recent articles
  const recentArticles = useMemo(() => {
    return [...mockArticles]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Blog Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Блог ReScrub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Актуальные статьи о защите персональных данных, соблюдении 152-ФЗ и цифровой безопасности
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Поиск по статьям..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-blog-search"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'date' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('date')}
                    data-testid="button-sort-date"
                  >
                    По дате
                  </Button>
                  <Button
                    variant={sortBy === 'views' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('views')}
                    data-testid="button-sort-views"
                  >
                    По популярности
                  </Button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.slug ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category.slug);
                      setCurrentPage(1);
                    }}
                    data-testid={`button-category-${category.slug}`}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {paginatedArticles.map((article) => (
                <Card key={article.id} className="hover-elevate overflow-hidden">
                  {/* Featured Image Placeholder */}
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">
                      {article.category}
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" data-testid={`badge-category-${article.id}`}>
                        {article.category}
                      </Badge>
                      {article.featured && (
                        <Badge variant="outline" data-testid={`badge-featured-${article.id}`}>
                          Рекомендуем
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-display text-xl font-medium leading-tight hover:text-primary transition-colors">
                      <Link href={`/blog/${article.slug}`} data-testid={`link-article-${article.id}`}>
                        {article.title}
                      </Link>
                    </h3>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-4 leading-relaxed" data-testid={`text-description-${article.id}`}>
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1" data-testid={`text-date-${article.id}`}>
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.publishedAt)}
                        </div>
                        <div className="flex items-center gap-1" data-testid={`text-reading-time-${article.id}`}>
                          <Clock className="h-3 w-3" />
                          {article.readingTime} мин
                        </div>
                      </div>
                      <div className="flex items-center gap-1" data-testid={`text-author-${article.id}`}>
                        <User className="h-3 w-3" />
                        {article.author}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs" data-testid={`badge-tag-${article.id}-${index}`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Назад
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      data-testid={`button-page-${page}`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  data-testid="button-next-page"
                >
                  Вперед
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <h3 className="text-display font-medium">Категории</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.slug}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => {
                          setSelectedCategory(category.slug);
                          setCurrentPage(1);
                        }}
                        data-testid={`sidebar-category-${category.slug}`}
                      >
                        <span>{category.name}</span>
                        <span className="text-muted-foreground">({category.count})</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Articles */}
              <Card>
                <CardHeader>
                  <h3 className="text-display font-medium">Популярные статьи</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {popularArticles.map((article, index) => (
                      <div key={article.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                        <Link href={`/blog/${article.slug}`} data-testid={`sidebar-popular-${article.id}`}>
                          <h4 className="text-sm font-medium leading-snug hover:text-primary transition-colors mb-1">
                            {article.title}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{article.views.toLocaleString('ru-RU')} просмотров</span>
                          <span>•</span>
                          <span>{article.readingTime} мин</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <h3 className="text-display font-medium">Последние публикации</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {recentArticles.map((article) => (
                      <div key={article.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                        <Link href={`/blog/${article.slug}`} data-testid={`sidebar-recent-${article.id}`}>
                          <h4 className="text-sm font-medium leading-snug hover:text-primary transition-colors mb-1">
                            {article.title}
                          </h4>
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(article.publishedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* RSS Subscription */}
              <Card>
                <CardHeader>
                  <h3 className="text-display font-medium flex items-center gap-2">
                    <Rss className="h-4 w-4" />
                    RSS подписка
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    Подпишитесь на RSS для получения последних обновлений блога
                  </p>
                  <Button size="sm" variant="outline" disabled data-testid="button-rss-subscribe">
                    В разработке
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
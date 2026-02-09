# Technical Design Specification: /privacy, /terms, /contacts Pages

Complete documentation for pixel-perfect recreation of the three legal/informational pages on rescrub.ru.

---

## Table of Contents

1. [Global Design System](#1-global-design-system)
2. [Shared Layout Structure](#2-shared-layout-structure)
3. [/privacy Page](#3-privacy-page)
4. [/terms Page](#4-terms-page)
5. [/contacts Page](#5-contacts-page)
6. [Component Specifications](#6-component-specifications)
7. [Responsive Behavior](#7-responsive-behavior)
8. [Interactive Features](#8-interactive-features)

---

## 1. Global Design System

### Typography

| Role | Classes | Usage |
|------|---------|-------|
| Page Title (H1) | `text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl` | Main page heading, centered |
| Section Title (H2) | `text-2xl font-semibold text-foreground mb-6` | Content section headings |
| Section Title (H2, Contacts) | `text-display text-3xl font-semibold tracking-tight text-foreground` | Contacts section headings, centered |
| Subsection Title (H4) | `font-semibold text-foreground` with optional `mb-2` or `mb-3` | Card/list headings |
| Subtitle | `text-lg leading-8 text-muted-foreground` | Below H1, description text |
| Body Text | `text-muted-foreground` (within `space-y-4` container) | Paragraph content |
| Small Text | `text-sm` or `text-sm text-muted-foreground` | List items, descriptions, labels |
| Metadata | `text-sm text-muted-foreground` with icon | Dates, timestamps |
| Monospace | `font-mono` | Legal IDs (OGRN, INN, KPP), phone numbers |
| Font Family | Inter (via Google Fonts) | All text |

### Color Palette

| Token | Usage |
|-------|-------|
| `bg-background` | Page background |
| `bg-muted/30` | Subtle card backgrounds, alternating section backgrounds |
| `bg-muted/10` | Alternating table row backgrounds |
| `bg-primary/10` | Icon container circles/squares |
| `bg-primary` | Step number circles, primary buttons |
| `text-primary` | Links, primary icons |
| `text-primary/80` | Link hover state |
| `text-foreground` | Primary text, headings |
| `text-muted-foreground` | Secondary/body text |
| `text-primary-foreground` | Text on primary backgrounds |
| `border-primary` | Left accent borders on highlighted items |
| `border-border` | Table borders, standard borders |
| `bg-amber-50 / dark:bg-amber-950/30` | Warning notice card background |
| `border-amber-200 / dark:border-amber-800` | Warning notice card border |
| `text-amber-600 / dark:text-amber-400` | Warning icon color |
| `text-amber-800 / dark:text-amber-200` | Warning heading text |
| `text-amber-700 / dark:text-amber-300` | Warning body text |
| `bg-red-50 / dark:bg-red-950/30` | Mandatory requirements card background |
| `border-red-200 / dark:border-red-800` | Mandatory requirements card border |
| `text-red-800 / dark:text-red-200` | Mandatory heading text |
| `text-red-700 / dark:text-red-300` | Mandatory list items |
| `bg-blue-500/10` | Telegram icon container |
| `text-blue-500` | Telegram icon/link color |
| `text-blue-400` | Telegram link hover |
| `bg-green-500/10` | WhatsApp icon container |
| `text-green-500` | WhatsApp icon/link color |
| `text-green-400` | WhatsApp link hover |

### Icons (Lucide React)

| Icon | Pages Used | Context |
|------|-----------|---------|
| `Shield` | Privacy, Contacts | Privacy hero, Security department |
| `Scale` | Terms, Contacts | Terms hero, Terms link |
| `FileText` | All three | TOC heading, Documents links |
| `Clock` | All three | Date metadata, business hours |
| `Phone` | Privacy, Contacts | Phone contact |
| `Mail` | Privacy, Contacts | Email contact |
| `User` | Privacy | Personal account |
| `Building` | Privacy, Terms | Operator info |
| `Globe` | Privacy | Data localization |
| `Lock` | Privacy | Security |
| `CreditCard` | Terms, Contacts | Payment info |
| `AlertTriangle` | Terms | Warning notice |
| `ShieldCheck` | Terms | Data protection |
| `Gavel` | Terms | Legal references |
| `MapPin` | Contacts | Address |
| `Users` | Contacts | General department |
| `MessageCircle` | Contacts | Messenger buttons |
| `Copy` | Contacts | Copy-to-clipboard |
| `ExternalLink` | Contacts | External links |
| `CheckCircle` | Contacts | Success states |
| `Timer` | Contacts | Response time |
| `Headphones` | Contacts | Support department |
| `SiTelegram` | Contacts | Telegram (from react-icons/si) |
| `SiWhatsapp` | Contacts | WhatsApp (from react-icons/si) |

---

## 2. Shared Layout Structure

### Page Wrapper
```
<div className="min-h-screen bg-background">
  <Header />
  <main className="pt-16">
    {/* Page sections */}
  </main>
  <Footer />
</div>
```

- `pt-16` on `<main>` offsets fixed header height (64px)
- `min-h-screen` ensures full viewport coverage

### Hero Section Pattern (Privacy & Terms)
```
<section className="py-24 sm:py-32">
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      {/* Icon circle */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <IconComponent className="h-8 w-8 text-primary" />
        </div>
      </div>
      {/* Title */}
      <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      {/* Subtitle */}
      <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
        {subtitle}
      </p>
      {/* Date metadata */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{dateText}</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

Hero icon container: 64x64px circle (`w-16 h-16 rounded-full bg-primary/10`), icon inside 32x32px (`h-8 w-8 text-primary`).

### Hero Section Pattern (Contacts)
Different from Privacy/Terms - includes business hours badge:
```
<section className="py-24 sm:py-32">
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Phone className="h-8 w-8 text-primary" />
        </div>
      </div>
      <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Свяжитесь с нами
      </h1>
      <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
        Мы всегда готовы помочь вам с вопросами защиты персональных данных
      </p>
      {/* Moscow time + business hours badge */}
      <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Москва: {moscowTime}</span>
        </div>
        <Badge variant={isBusinessHours ? "default" : "secondary"}>
          {isBusinessHours ? "Рабочее время" : "Нерабочее время"}
        </Badge>
      </div>
    </div>
  </div>
</section>
```

### Content Area Widths

| Page | Section | Max Width |
|------|---------|-----------|
| Privacy | All content | `max-w-4xl` (896px) |
| Terms | All content | `max-w-4xl` (896px) |
| Contacts | Hero | `max-w-4xl` (896px) |
| Contacts | Main info cards | `max-w-7xl` (1280px) |
| Contacts | Departments grid | `max-w-7xl` (1280px) |
| Contacts | Messengers | `max-w-4xl` (896px) |
| Contacts | Quick contact form | `max-w-2xl` (672px) |
| Contacts | Legal info | `max-w-4xl` (896px) |

All use horizontal padding: `px-4 sm:px-6 lg:px-8`

### Table of Contents Card (Privacy & Terms)
```
<Card className="mb-12">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <FileText className="h-5 w-5" />
      {tocTitle}
    </CardTitle>
  </CardHeader>
  <CardContent>
    <nav className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
      <a href="#anchor" className="text-primary hover:text-primary/80">
        {number}. {label}
      </a>
      {/* ... more links */}
    </nav>
  </CardContent>
</Card>
```

- 2-column grid on md+ breakpoint
- `gap-3` between links
- Each link: `text-primary hover:text-primary/80`, `text-sm`

### Content Section Pattern
```
<section id="anchor-id" className="mb-12">
  <h2 className="text-2xl font-semibold text-foreground mb-6">{number}. {title}</h2>
  <div className="space-y-4 text-muted-foreground">
    {/* Paragraphs, cards, tables, lists */}
  </div>
</section>
```

- Each section: `mb-12` (48px bottom margin)
- Content container: `space-y-4` (16px vertical gap between children)

---

## 3. /privacy Page

### SEO
- Title: `"Политика конфиденциальности - ReScrub"`
- Meta description: `"Политика конфиденциальности ReScrub - информация об обработке персональных данных в соответствии с 152-ФЗ. Права субъектов данных и безопасность информации."`

### Hero
- Icon: `Shield` in primary circle
- H1: "Политика конфиденциальности"
- Subtitle: "Информация об обработке персональных данных в соответствии с требованиями 152-ФЗ"
- Date: "Последнее обновление: 15 сентября 2025 г."

### TOC Title
"Содержание документа"

### Sections (13 total)

#### Section 1: Общие положения (id="general")
- 5 numbered paragraphs (1.1-1.5)
- Plain text within `space-y-4 text-muted-foreground`

#### Section 2: Сведения об операторе (id="operator-info")
- Intro paragraph 2.1
- Two-column Card grid (`grid grid-cols-1 md:grid-cols-2 gap-4`)
  - Left card: "Основная информация:" - company name, OGRN, INN/KPP, Address
  - Right card: "Контактная информация:" - Phone, Email, Website, Privacy officer
  - Both cards: `bg-muted/30`, `<CardContent className="pt-6">`
  - Each item: label + value on separate lines, `text-sm`

#### Section 3: Локализация данных (id="data-localization")
- Intro paragraphs
- Single Card with icon: `bg-muted/30`
  - `Globe` icon (`h-5 w-5 text-primary`) + bold heading
  - Server location details as bullet points

#### Section 4: Категории персональных данных (id="data-categories")
- Intro paragraph 4.1
- **Table** with 3 columns: "Категория данных", "Описание", "Примеры"
  - Header: `bg-muted/30`, `border border-border p-3 text-left font-semibold text-foreground`
  - Rows alternate: plain / `bg-muted/10`
  - Cells: `border border-border p-3`
  - 5 data rows: Идентификационные, Контактные, Технические, Платежные, Служебные
- Warning card: `bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800`
  - `AlertTriangle` icon (`h-5 w-5 text-amber-600 dark:text-amber-400 mt-1`)
  - Layout: flex with gap-3, icon aligned to top
  - Bold heading: `font-semibold text-amber-800 dark:text-amber-200 mb-2`
  - Body: `text-sm text-amber-700 dark:text-amber-300`

#### Section 5: Цели обработки данных (id="processing-purposes")
- Intro paragraph 5.1
- **Table** with 2 columns: "Цель обработки", "Описание"
  - Same styling as Section 4 table
  - 6 rows: Предоставление услуг, Коммуникации, Безопасность, Улучшение сервиса, Соблюдение законодательства, Маркетинг

#### Section 6: Правовые основания обработки (id="legal-basis")
- Intro paragraph 6.1
- **Left-bordered items** (3 items): `pl-4 border-l-4 border-primary`
  - Container: `space-y-3`
  - Each item: H4 `font-semibold text-foreground` + paragraph `text-sm`
  - Items: Согласие субъекта, Исполнение договора, Защита жизненно важных интересов
- Closing paragraph 6.2

#### Section 7: Порядок сбора персональных данных (id="data-collection")
- Intro paragraph 7.1
- Two-column Card grid (`grid grid-cols-1 md:grid-cols-2 gap-4`)
  - "Непосредственно от субъекта:" - 4 bullet items
  - "Автоматически:" - 4 bullet items
  - Cards: `bg-muted/30`, bullets as `• text`
- Paragraphs 7.2, 7.3

#### Section 8: Хранение и защита персональных данных (id="data-storage")
- Intro paragraph 8.1
- Two-column Card grid: "Технические меры" / "Организационные меры" (4 bullets each)
- Paragraph 8.2
- **Table** with 2 columns: "Категория данных", "Срок хранения"
  - 4 rows with alternating backgrounds
- Paragraph 8.3

#### Section 9: Права субъектов персональных данных (id="data-rights")
- Intro paragraph 9.1
- Two-column Card grid: "Основные права" / "Дополнительные возможности" (4 items each, `space-y-2`)
- Paragraph 9.2
- Three-column Card grid (`grid grid-cols-1 md:grid-cols-3 gap-4`):
  - Each card: `text-center`, `<CardContent className="pt-6">`
  - Centered icon: `h-8 w-8 text-primary mx-auto mb-2`
  - Cards: Email (Mail icon), Телефон (Phone icon), Личный кабинет (User icon)
  - Each shows method name + contact info in `text-sm`
- Paragraph 9.3

#### Section 10: Передача персональных данных третьим лицам (id="third-parties")
- Intro paragraph 10.1
- **Left-bordered items** (4 items): same pattern as Section 6
  - Items: Получение согласия, Исполнение обязательств, Требования законодательства, Защита жизненно важных интересов
- Paragraph 10.2
- **Large table** with 4 columns: "Категория получателя", "Передаваемые данные", "Цель передачи", "Правовое основание"
  - 6 rows with alternating backgrounds
- Paragraph 10.3
- Requirements Card with two-column grid inside: "Обязательные требования" / "Ограничения" (4 bullets each)
- Paragraph 10.4
- Two-column Card grid with additional subject rights

#### Section 11: Политика cookies (id="cookies")
- Intro paragraph
- **Table** with 3 columns: "Тип cookies", "Назначение", "Срок хранения"
  - 4 rows: Необходимые, Аналитические, Функциональные, Маркетинговые
- Paragraph about cookie management

#### Section 12: Изменения политики (id="policy-changes")
- Paragraphs about policy update procedures
- Warning card (amber): notification about material changes
- Paragraph about continued use

#### Section 13: Контактная информация (id="contact-info")
- Intro paragraph
- Card with two-column grid inside
  - Left: "Контакты для обращений:" - 4 items (DPO, Email, Phone, Address)
  - Right: "Государственные органы:" - Роскомнадзор info (name, website, phone, address)
- Closing paragraphs about response times and complaints
- **CTA buttons** at bottom: `flex flex-col sm:flex-row gap-4 justify-center mt-8`
  - "Вернуться на главную" - `<Link href="/">` with `<Button>`
  - "Пользовательское соглашение" - `<Link href="/terms">` with `<Button variant="outline">`

---

## 4. /terms Page

### SEO
- Title: `"Пользовательское соглашение - ReScrub"`
- Meta description: `"Пользовательское соглашение ReScrub - условия предоставления услуг защиты персональных данных в соответствии с российским законодательством."`

### Hero
- Icon: `Scale` in primary circle
- H1: "Пользовательское соглашение"
- Subtitle: "Условия предоставления услуг защиты персональных данных в соответствии с российским законодательством"
- Date: "Действует с: 15 сентября 2025 г."

### Important Notice (between Hero and Content)
Unique to Terms page - positioned in `<section className="pb-12">`:
```
<Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
  <CardContent className="pt-6">
    <div className="flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1" />
      <div>
        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
          Важное уведомление
        </h3>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {warning text about legally binding document}
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

### TOC Title
"Содержание соглашения"

### TOC Links (14 sections)
1. Общие положения
2. Определения
3. Предмет соглашения
4. Права пользователя
5. Обязанности пользователя
6. Права оператора
7. Обязанности оператора
8. Порядок оказания услуг
9. Стоимость и порядок оплаты
10. Ответственность сторон
11. Ограничение ответственности
12. Разрешение споров
13. Заключительные положения
14. Реквизиты оператора

### Sections (14 total)

#### Section 1: Общие положения (id="general")
- 5 numbered paragraphs
- Mentions company name, service description, law references

#### Section 2: Определения (id="definitions")
- Intro paragraph 2.1
- **Table** with 2 columns: "Термин", "Определение"
  - 6 rows: Оператор, Пользователь, Сервис, Персональные данные, Обработка данных, Брокер данных
  - Alternating row backgrounds

#### Section 3: Предмет соглашения (id="subject")
- Intro paragraph 3.1
- Two-column Card grid (`bg-muted/30`):
  - "Основные услуги:" - 4 bullet points
  - "Дополнительные услуги:" - 4 bullet points
- Paragraphs 3.2, 3.3

#### Section 4: Права пользователя (id="user-rights")
- Intro paragraph 4.1
- Two-column Card grid:
  - "Основные права:" - 4 bullets
  - "Право на информацию:" - 4 bullets
- Paragraphs 4.2-4.4

#### Section 5: Обязанности пользователя (id="user-obligations")
- Intro paragraph 5.1
- **Red requirements card**: `bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800`
  - H4: `font-semibold text-red-800 dark:text-red-200 mb-3` "Обязательные требования:"
  - List: `space-y-2 text-sm text-red-700 dark:text-red-300`
  - 6 bullet items
- Paragraph 5.2
- **Table** with 2 columns: "Обязательство", "Описание"
  - 4 rows: Правомочность, Достоверность, Дееспособность, Согласие
- Paragraph 5.3

#### Section 6: Права оператора (id="operator-rights")
- Intro paragraph 6.1
- Two-column Card grid: "Управленческие права" / "Контрольные права" (4 bullets each)
- Paragraphs 6.2 with bullet list (`list-disc pl-6 space-y-1`, 5 items)
- Paragraph 6.3 with indented items (`space-y-2 ml-4`, 4 items with bullet prefix)
- Paragraph 6.4

#### Section 7: Обязанности оператора (id="operator-obligations")
- Intro paragraph 7.1
- **Left-bordered items** (4 items): `pl-4 border-l-4 border-primary`
  - Container: `space-y-3`
  - Items: Качество услуг, Техническая поддержка, Безопасность данных, Уведомления
- Paragraphs 7.2, 7.3

#### Section 8: Порядок оказания услуг (id="service-procedure")
- Intro paragraph 8.1
- **Step cards** - 4-column grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`):
  - Each card: `bg-muted/30`, `text-center`
  - Step number: `w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold mb-2 mx-auto`
  - Steps: 1-Регистрация, 2-Настройка, 3-Поиск, 4-Удаление
- Paragraph 8.2
- **Table** with 3 columns: "Услуга", "Срок выполнения", "Примечания"
  - 4 rows with timing details
- Paragraph 8.3

#### Section 9: Стоимость и порядок оплаты (id="payment")
- Intro paragraph 9.1
- Card with CreditCard icon: `bg-muted/30`
  - Icon + heading in flex row: `flex items-center gap-2 mb-3`
  - `CreditCard className="h-5 w-5 text-primary"`
  - 5 bullet payment terms
- Paragraphs 9.2, 9.3
- Bullet list: `list-disc pl-6 space-y-1` (3 items)

#### Section 10: Ответственность сторон (id="liability")
- Intro paragraph 10.1
- Two-column Card grid: "Оператор отвечает за:" / "Оператор НЕ отвечает за:" (3 bullets each)
- Paragraph 10.2
- Bullet list with exceptions

#### Section 11: Ограничение ответственности (id="limitation")
- Warning card (amber style) with AlertTriangle icon
- Paragraphs about liability limits
- Bullet list of exceptions

#### Section 12: Разрешение споров (id="disputes")
- Paragraphs about dispute resolution
- Left-bordered items (3): Переговоры, Досудебное урегулирование, Судебное разбирательство
- Paragraphs about jurisdiction and timelines

#### Section 13: Заключительные положения (id="final-provisions")
- Paragraphs about agreement validity
- Two-column Card grid with provisions
- Closing paragraphs

#### Section 14: Реквизиты оператора (id="operator-details")
- Card with two-column grid inside
  - Left: Company details (name, OGRN, INN, KPP)
  - Right: Address, email, phone, website
  - Monospace for legal IDs: `font-mono`
- **CTA buttons**: same pattern as Privacy page
  - "Вернуться на главную" + "Политика конфиденциальности" (links to /privacy)

---

## 5. /contacts Page

### SEO
- Title: `"Контакты - ReScrub"`
- Meta description: about contacting for data protection questions

### Component Dependencies (beyond shared)
- `Badge` from shadcn/ui
- `Input`, `Textarea`, `Select` (SelectContent, SelectItem, SelectTrigger, SelectValue) from shadcn/ui
- `Form`, `FormControl`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` from shadcn/ui
- `useForm` from react-hook-form
- `zodResolver` from @hookform/resolvers/zod
- `z` from zod
- `useState`, `useEffect` from react
- `useToast` from @/hooks/use-toast
- `useMutation` from @tanstack/react-query
- `apiRequest` from @/lib/queryClient
- `SiTelegram`, `SiWhatsapp` from react-icons/si

### Hero
- Icon: `Phone` in primary circle
- H1: "Свяжитесь с нами"
- Subtitle: "Мы всегда готовы помочь вам с вопросами защиты персональных данных"
- Dynamic Moscow time display + business hours Badge

### Page Sections (6 major sections)

#### Section A: Main Contact Info Cards
Container: `max-w-7xl`, `py-16 bg-muted/30`

Three-column grid: `grid grid-cols-1 md:grid-cols-3 gap-8`

**Card 1: Phone**
```
<Card className="hover-elevate">
  <CardHeader className="text-center">
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
      <Phone className="h-6 w-6 text-primary" />
    </div>
    <CardTitle>Телефон</CardTitle>
    <CardDescription>Пн-Пт: 9:00-21:00, Сб: 10:00-18:00 МСК</CardDescription>
  </CardHeader>
  <CardContent className="text-center space-y-4">
    {/* Main number */}
    <div>
      <p className="text-sm text-muted-foreground mb-1">Основной:</p>
      <div className="flex items-center justify-center gap-2">
        <a href="tel:+74951234567" className="text-lg font-mono font-semibold text-foreground">
          +7 (495) 123-45-67
        </a>
        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
    {/* Support number */}
    <div>
      <p className="text-sm text-muted-foreground mb-1">Поддержка:</p>
      <div className="flex items-center justify-center gap-2">
        <a href="tel:+74951234568" className="text-lg font-mono font-semibold text-foreground">
          +7 (495) 123-45-68
        </a>
        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
```

**Card 2: Email** - Same structure, shows info@rescrub.ru + support@rescrub.ru

**Card 3: Address** - Same structure but with:
- MapPin icon
- Full address text (centered)
- "Бизнес-центр «Тверской»" subtitle
- Button linking to Google Maps: `<Button variant="outline" size="sm" asChild>`

Icon containers in these cards: `w-12 h-12 rounded-lg bg-primary/10` (48x48px rounded square, not circle)

#### Section B: Departments Grid
Container: `max-w-7xl`, `py-24 sm:py-32`

Section heading: centered, `text-display text-3xl font-semibold`, with subtitle

Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

**6 Department Cards** - all follow this pattern:
```
<Card className="hover-elevate">
  <CardHeader className="text-center">
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
      <DeptIcon className="h-6 w-6 text-primary" />
    </div>
    <CardTitle>{deptName}</CardTitle>
    <CardDescription>{deptDescription}</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <a href="mailto:{email}" className="text-primary hover:text-primary/80 font-medium">
          {email}
        </a>
        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </CardContent>
</Card>
```

Departments:
1. **Общие вопросы** (Users icon) - info@rescrub.ru
2. **Техподдержка** (Headphones icon) - support@rescrub.ru
3. **Отдел продаж** (CreditCard icon) - sales@rescrub.ru
4. **Юридический отдел** (Scale icon) - legal@rescrub.ru
5. **Пресса и PR** (Globe icon) - press@rescrub.ru
6. **Безопасность** (Shield icon) - security@rescrub.ru

#### Section C: Messengers & Social
Container: `max-w-4xl`, `py-16 bg-muted/30`

Grid: `grid grid-cols-1 md:grid-cols-2 gap-6`

**Telegram Card:**
- Icon container: `w-12 h-12 rounded-lg bg-blue-500/10`, icon: `SiTelegram className="h-6 w-6 text-blue-500"`
- Links: `font-medium text-blue-500 hover:text-blue-400`
- Official channel: @rescruboffficial (https://t.me/rescruboffficial)
- Support: @rescrub_support (https://t.me/rescrub_support)
- CTA button: `<Button variant="outline" size="sm" asChild>` with MessageCircle icon

**WhatsApp Card:**
- Icon container: `w-12 h-12 rounded-lg bg-green-500/10`, icon: `SiWhatsapp className="h-6 w-6 text-green-500"`
- Links: `font-medium text-green-500 hover:text-green-400`
- Number: +7 (926) 123-45-67 (https://wa.me/79261234567)
- CTA button with pre-filled message: `?text=Здравствуйте! У меня вопрос по ReScrub`

#### Section D: Quick Contact Form
Container: `max-w-2xl`, `py-24 sm:py-32`

**Form Validation Schema (Zod):**
```typescript
const quickContactSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email адрес"),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
  department: z.string().min(1, "Выберите отдел")
});
```

**Form Layout:**
```
<Card>
  <CardHeader>
    <CardTitle>Отправить сообщение</CardTitle>
    <CardDescription>Все поля обязательны для заполнения</CardDescription>
  </CardHeader>
  <CardContent>
    <Form>
      <form className="space-y-6">
        {/* Row 1: Name + Email side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField name="name">
            <FormItem>
              <FormLabel>Ваше имя</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="email">
            <FormItem>
              <FormLabel>Email адрес</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ivan@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        {/* Row 2: Department select (full width) */}
        <FormField name="department">
          <FormItem>
            <FormLabel>Выберите отдел</FormLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Выберите подходящий отдел" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Общие вопросы</SelectItem>
                <SelectItem value="sales">Отдел продаж</SelectItem>
                <SelectItem value="technical">Техподдержка</SelectItem>
                <SelectItem value="legal">Юридический отдел</SelectItem>
                <SelectItem value="press">Пресс-служба</SelectItem>
                <SelectItem value="security">Безопасность</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        {/* Row 3: Message textarea (full width) */}
        <FormField name="message">
          <FormItem>
            <FormLabel>Ваше сообщение</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Опишите ваш вопрос или пожелание..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        {/* Submit button (full width) */}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Отправляем..." : "Отправить сообщение"}
        </Button>
      </form>
    </Form>
  </CardContent>
</Card>
```

Form submits to: `POST /api/support` with fields mapped to: name, email, message, category (from department), priority: "medium", subject: "Обращение с страницы Контакты"

#### Section E: Legal Info / Company Details
Container: `max-w-4xl`, `py-16 bg-muted/30`

Section heading: `text-display text-2xl font-semibold tracking-tight text-foreground`, centered, `mb-8`

```
<Card>
  <CardContent className="pt-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left column */}
      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Полное наименование:</p>
          <p className="font-medium">Общество с ограниченной ответственностью "РесКраб"</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">ОГРН:</p>
          <p className="font-mono">1137746123456</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">ИНН:</p>
          <p className="font-mono">7707123456</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">КПП:</p>
          <p className="font-mono">770701001</p>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Юридический адрес:</p>
          <p className="font-medium">125009, г. Москва, ул. Тверская, д. 7, стр. 1, офис 1508</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Обработка персональных данных:</p>
          <p className="text-sm">В соответствии с 152-ФЗ "О персональных данных"</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Документы:</p>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" asChild>
              <a href="/privacy" target="_blank">
                <FileText className="h-3 w-3 mr-1" />
                Политика конфиденциальности
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/terms" target="_blank">
                <Scale className="h-3 w-3 mr-1" />
                Пользовательское соглашение
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 6. Component Specifications

### Card Variants Used

| Variant | Classes | Usage |
|---------|---------|-------|
| Default | `<Card>` (no extra classes) | TOC cards, form card, legal info card, contact method cards (3-col) |
| Subtle BG | `<Card className="bg-muted/30">` | Most content cards with bullet lists |
| Hoverable | `<Card className="hover-elevate">` | Department cards, messenger cards, main contact info cards |
| Centered | `<Card className="text-center">` | Contact method mini-cards (email/phone/account) |
| Amber Warning | `<Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">` | Important notices |
| Red Mandatory | `<Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">` | Mandatory requirements |

### Table Pattern
```html
<div className="overflow-x-auto">
  <table className="w-full border border-border rounded-lg">
    <thead className="bg-muted/30">
      <tr>
        <th className="border border-border p-3 text-left font-semibold text-foreground">
          {column header}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>                              {/* odd rows: no bg */}
        <td className="border border-border p-3">{cell}</td>
      </tr>
      <tr className="bg-muted/10">      {/* even rows: subtle bg */}
        <td className="border border-border p-3">{cell}</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Left-Bordered Accent Items
```html
<div className="space-y-3">
  <div className="pl-4 border-l-4 border-primary">
    <h4 className="font-semibold text-foreground">{title}</h4>
    <p className="text-sm">{description}</p>
  </div>
</div>
```

### Icon Container Variants

| Shape | Classes | Size | Usage |
|-------|---------|------|-------|
| Large Circle | `w-16 h-16 rounded-full bg-primary/10` | 64x64px | Hero icons |
| Medium Square | `w-12 h-12 rounded-lg bg-primary/10` | 48x48px | Department cards, contact info cards |
| Small Circle | `w-8 h-8 rounded-full bg-primary text-primary-foreground` | 32x32px | Step numbers |

Icon sizes inside containers:
- In 64px circle: `h-8 w-8`
- In 48px square: `h-6 w-6`
- In 32px circle: text content (numbers)

### Bullet List Pattern
```html
<ul className="space-y-1 text-sm">    {/* or space-y-2 for more spacing */}
  <li>• {item text}</li>
</ul>
```
Uses `•` character prefix, not `<ul>` disc style (except in a few places where `list-disc pl-6` is used for standard HTML disc bullets).

### Copy-to-Clipboard Button
```html
<Button variant="ghost" size="sm" onClick={() => copyToClipboard(text, label, toast)}>
  <Copy className="h-3 w-3" />
</Button>
```
Shows toast notification on success: title "Скопировано", description "{Label} скопирован в буфер обмена", duration 2000ms.

---

## 7. Responsive Behavior

### Breakpoints Used

| Breakpoint | Tailwind | Width | Effect |
|-----------|----------|-------|--------|
| Default (mobile) | none | <768px | Single column, `px-4` |
| sm | `sm:` | 640px+ | Increased section padding (`sm:py-32`, `sm:px-6`) |
| md | `md:` | 768px+ | 2-column grids activate, form fields side-by-side |
| lg | `lg:` | 1024px+ | 3-column grids, 4-column step cards, `lg:px-8` |

### Grid Breakpoint Behavior

| Grid Pattern | Mobile | md (768px+) | lg (1024px+) |
|-------------|--------|-------------|--------------|
| `grid-cols-1 md:grid-cols-2` | 1 col | 2 cols | 2 cols |
| `grid-cols-1 md:grid-cols-3` | 1 col | 3 cols | 3 cols |
| `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | 1 col | 2 cols | 3 cols |
| `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` | 1 col | 2 cols | 4 cols |

### CTA Buttons
`flex flex-col sm:flex-row gap-4 justify-center` - Stack vertically on mobile, horizontal on sm+.

---

## 8. Interactive Features

### Moscow Time Display (Contacts only)
- Updates every 60 seconds via `setInterval`
- Uses `Intl.DateTimeFormat` with `Europe/Moscow` timezone
- Format: HH:MM (24h, ru-RU locale)
- Business hours calculation: Mon-Fri 9:00-21:00, Sat 10:00-18:00 MSK

```typescript
const getMoscowTime = () => {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
};
```

Business hours logic checks Moscow timezone day (0=Sunday, 6=Saturday) and hour.

### Business Hours Badge
- During business hours: `<Badge variant="default">Рабочее время</Badge>`
- Outside business hours: `<Badge variant="secondary">Нерабочее время</Badge>`

### Copy to Clipboard
- Available on: all phone numbers, all email addresses on Contacts page
- Button: `variant="ghost" size="sm"`, icon: `Copy h-3 w-3`
- Success toast: 2000ms duration
- Error toast: `variant="destructive"`

### Quick Contact Form Submission
- Mutation via TanStack Query's `useMutation`
- Submits to `POST /api/support`
- On success: toast + form reset via `form.reset()`
- On error: destructive toast with error message
- Button disabled state: shows "Отправляем..." text

### Table of Contents Navigation
- Anchor links (`href="#section-id"`) scroll to corresponding `<section id="section-id">`
- No smooth scroll behavior defined in CSS (browser default)

### Hover States
- Cards with `hover-elevate` class: subtle elevation effect on hover
- Links: `text-primary hover:text-primary/80` opacity change
- Messenger links: specific color hovers (blue-500→blue-400, green-500→green-400)

---

## Appendix: Data-TestID Reference

All interactive elements have `data-testid` attributes for testing. Pattern examples:

| Element | TestID Pattern |
|---------|---------------|
| TOC links | `link-toc-{section}` |
| Email links | `link-email-{dept}` |
| Copy buttons | `button-copy-{type}-{dept}` |
| Form inputs | `input-quick-contact-{field}` |
| Select trigger | `select-quick-contact-department` |
| Submit button | `button-send-quick-contact` |
| Messenger links | `link-telegram-channel`, `link-whatsapp-number` |
| Legal doc links | `link-privacy-policy`, `link-terms` |

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { HelpCircle, Shield, CreditCard, Phone } from "lucide-react";
import { useEffect } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "what-is-rescrub",
    question: "Что такое ReScrub и как работает сервис?",
    answer: `ReScrub — это автоматизированный сервис защиты персональных данных россиян в соответствии с 152-ФЗ "О персональных данных". 

Мы автоматически сканируем сотни российских и международных сайтов брокеров данных, находим вашу персональную информацию (ФИО, адреса, номера телефонов, email) и отправляем официальные запросы на удаление в соответствии с российским законодательством.

Процесс полностью автоматизирован — вы просто указываете свои данные, а мы берем на себя всю работу по их защите.`
  },
  {
    id: "law-152-fz",
    question: "Как ReScrub соблюдает требования 152-ФЗ?",
    answer: `Мы строго соблюдаем Федеральный закон №152-ФЗ "О персональных данных":

• **Согласие субъекта**: Работаем только с данными, на обработку которых вы дали согласие
• **Минимизация данных**: Обрабатываем только необходимый минимум информации
• **Безопасность**: Используем криптографическую защиту и не храним данные дольше необходимого
• **Право на удаление**: Обеспечиваем ваше право на удаление персональных данных с сайтов третьих лиц

Наша деятельность не противоречит российскому законодательству — мы помогаем гражданам РФ реализовать свои права, предусмотренные 152-ФЗ.`
  },
  {
    id: "what-sites-supported",
    question: "С каких сайтов ReScrub удаляет персональные данные?",
    answer: `Мы работаем с широким спектром российских и международных источников:

**Российские сайты и базы данных:**
• Справочные сервисы (телефонные справочники, адресные базы)
• Социальные сети и форумы
• Объявления и доски объявлений
• Открытые реестры и каталоги

**Международные брокеры данных:**
• Whitepages, Spokeo, BeenVerified
• PeopleFinder, TruePeopleSearch
• Radaris, MyLife, Intelius

Всего более 200+ источников, список постоянно обновляется. Полный перечень доступен в личном кабинете.`
  },
  {
    id: "how-long-process",
    question: "Сколько времени занимает удаление данных?",
    answer: `Процесс удаления зависит от конкретного сайта и может занимать:

**Быстрое удаление (1-7 дней):**
• Сайты с автоматическим удалением
• Зарубежные сервисы с четким процессом

**Стандартное удаление (2-4 недели):**
• Большинство российских сайтов
• Требуют ручной модерации запросов

**Сложные случаи (1-3 месяца):**
• Сайты с требованием дополнительных документов
• Арбитражные процедуры

Мы ведем мониторинг и повторно отправляем запросы при необходимости.`
  },
  {
    id: "pricing-plans",
    question: "Сколько стоят услуги ReScrub?",
    answer: `Мы предлагаем гибкие тарифные планы:

**Базовый план — 1 990₽/месяц**
• До 50 сайтов для сканирования
• Ежемесячные отчеты
• Email поддержка

**Стандартный план — 3 490₽/месяц**
• До 150 сайтов
• Еженедельные отчеты
• Приоритетная поддержка
• SMS уведомления

**Премиум план — 5 990₽/месяц**
• Более 200 сайтов
• Ежедневный мониторинг
• Персональный менеджер
• Экстренное удаление

`
  },
  {
    id: "data-security",
    question: "Как обеспечивается безопасность моих данных?",
    answer: `Безопасность ваших данных — наш приоритет:

**Техническая защита:**
• Шифрование данных AES-256
• Защищенные каналы связи (TLS 1.3)
• Двухфакторная аутентификация

**Организационные меры:**
• Данные хранятся только в России
• Минимальные права доступа сотрудников
• Регулярные аудиты безопасности

**Правовые гарантии:**
• Удаление данных после завершения услуги
• Отсутствие передачи данных третьим лицам
• Соответствие требованиям 152-ФЗ

Мы не используем ваши данные в коммерческих целях и не создаем профили пользователей.`
  },
  {
    id: "payment-methods",
    question: "Как происходит оплата услуг?",
    answer: `Принимаем все основные способы оплаты в России:

**Банковские карты:**
• Visa, MasterCard (российские банки)
• Мир
• Все карты российских банков

**Электронные кошельки:**
• Яндекс.Деньги
• QIWI
• WebMoney

**Другие способы:**
• Банковский перевод для юридических лиц
• Наличные через терминалы
• Сбербанк Онлайн

Оплата защищена и происходит через сертифицированные платежные системы.`
  },
  {
    id: "results-guarantee",
    question: "Гарантируете ли вы результат удаления данных?",
    answer: `Мы предоставляем максимальные гарантии в рамках действующего законодательства:

**Что мы гарантируем:**
• Отправку всех необходимых запросов на удаление
• Соблюдение всех процедур и сроков
• Предоставление детальных отчетов о проделанной работе
• Повторную отправку запросов при необходимости

**Прозрачная отчетность:**
• Детальные отчеты о всех предпринятых действиях
• Информация о статусе каждого запроса
• Регулярные обновления о ходе работы`
  },
  {
    id: "roskomnadzor",
    question: "Нужно ли обращаться в Роскомнадзор самостоятельно?",
    answer: `В большинстве случаев обращение в Роскомнадзор не требуется:

**Когда ReScrub справляется сам:**
• Сайты соблюдают требования 152-ФЗ
• Есть четкие процедуры удаления данных
• Ответственные администраторы ресурсов

**Когда может потребоваться Роскомнадзор:**
• Отказ сайта удалить данные без уважительной причины
• Нарушение сроков рассмотрения (более 30 дней)
• Требование необоснованных документов

При необходимости мы поможем подготовить обращение в Роскомнадзор и предоставим всю документацию о наших попытках урегулировать вопрос в досудебном порядке.`
  },
  {
    id: "family-protection",
    question: "Можно ли защитить данные всей семьи?",
    answer: `Да, мы предлагаем семейные тарифы со скидками:

**Семейный тариф:**
• До 5 членов семьи в одной подписке
• Скидка 30% от стоимости индивидуальных планов
• Общий личный кабинет с раздельными отчетами

**Защита детей:**
• Особое внимание к данным несовершеннолетних
• Уведомление родителей о всех операциях
• Соблюдение требований к обработке детских данных

**Корпоративные решения:**
• Защита данных сотрудников
• Групповые скидки от 10 человек
• Корпоративная отчетность

Для оформления семейного тарифа свяжитесь с нашей поддержкой.`
  },
  {
    id: "monitoring-frequency",
    question: "Как часто проводится мониторинг новых утечек данных?",
    answer: `Частота мониторинга зависит от выбранного тарифа:

**Непрерывный мониторинг:**
• Автоматическое сканирование каждые 24 часа
• Мгновенные уведомления о новых находках
• Автоматическая отправка запросов на удаление

**Источники новых данных:**
• Новые брокеры данных
• Утечки из взломанных баз
• Социальные сети и публичные реестры
• Рекламные и маркетинговые базы

**Реагирование:**
• Уведомление в течение 2 часов после обнаружения
• Автоматическая инициация процедуры удаления
• Детальная информация в личном кабинете

Наши алгоритмы постоянно совершенствуются для выявления новых источников персональных данных.`
  },
  {
    id: "support-contact",
    question: "Как связаться с технической поддержкой?",
    answer: `Мы предлагаем несколько каналов связи:

**Основные каналы:**
• **Email:** support@rescrub.ru (ответ в течение 4 часов)
• **Телефон:** +7 (495) 123-45-67 (будни 9:00-21:00)
• **Онлайн-чат:** доступен в личном кабинете
• **Telegram:** @ReScrubSupport

**Экстренная поддержка:**
• Для премиум-клиентов: персональный менеджер
• Экстренная линия: +7 (800) 555-01-23

**Время ответа:**
• Чат и телефон: мгновенно
• Email: до 4 часов в рабочие дни
• Сложные вопросы: до 24 часов

Вся поддержка ведется на русском языке специалистами, знающими российское законодательство.`
  }
];

export default function FAQ() {
  useEffect(() => {
    document.title = "Часто задаваемые вопросы - ReScrub";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Часто задаваемые вопросы
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Ответы на основные вопросы о защите персональных данных, 
                152-ФЗ и работе сервиса ReScrub
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pb-24 sm:pb-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id} 
                  className="bg-card rounded-lg border border-border shadow-sm px-6"
                  data-testid={`faq-item-${index + 1}`}
                >
                  <AccordionTrigger 
                    className="text-left text-base font-medium text-foreground hover:text-muted-foreground transition-colors py-6"
                    data-testid={`faq-trigger-${index + 1}`}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent 
                    className="text-muted-foreground leading-7 pb-6 whitespace-pre-line"
                    data-testid={`faq-content-${index + 1}`}
                  >
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Additional Help Section */}
        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Нужна дополнительная помощь?
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Не нашли ответ на свой вопрос? Наша команда поддержки готова помочь вам
              </p>
              
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Support Card */}
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Техническая поддержка</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Получите помощь от наших экспертов по любым вопросам
                  </p>
                  <a href="mailto:support@rescrub.ru">
                    <Button variant="outline" size="sm" className="w-full" data-testid="button-contact-support">
                      Связаться
                    </Button>
                  </a>
                </div>

                {/* Pricing Card */}
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Тарифы и оплата</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Выберите подходящий тариф для защиты своих данных
                  </p>
                  <Link href="/#pricing">
                    <Button variant="outline" size="sm" className="w-full" data-testid="button-view-pricing">
                      Посмотреть тарифы
                    </Button>
                  </Link>
                </div>

                {/* About Card */}
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">О сервисе</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Узнайте больше о нашей миссии и принципах работы
                  </p>
                  <Link href="/about">
                    <Button variant="outline" size="sm" className="w-full" data-testid="button-learn-more">
                      Узнать больше
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Готовы защитить свои данные?
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Начните защиту своих персональных данных с помощью нашего сервиса
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/reports">
                  <Button size="lg" data-testid="button-start-protection">
                    Начать защиту
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" data-testid="button-learn-more-cta">
                    Узнать больше
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
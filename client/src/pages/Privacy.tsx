import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, FileText, Clock, Phone, Mail, User, Building, Globe, Lock, CreditCard } from "lucide-react";
import { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
    document.title = "Политика конфиденциальности - ReScrub";
    
    // Add meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Политика конфиденциальности ReScrub - информация об обработке персональных данных в соответствии с 152-ФЗ. Права субъектов данных и безопасность информации.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Политика конфиденциальности ReScrub - информация об обработке персональных данных в соответствии с 152-ФЗ. Права субъектов данных и безопасность информации.';
      document.head.appendChild(meta);
    }
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
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Политика конфиденциальности
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Информация об обработке персональных данных в соответствии с требованиями 152-ФЗ
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Последнее обновление: 15 сентября 2025 г.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Document Content */}
        <section className="pb-24 sm:pb-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Table of Contents */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Содержание документа
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <a href="#general" className="text-primary hover:text-primary/80" data-testid="link-toc-general">
                    1. Общие положения
                  </a>
                  <a href="#operator-info" className="text-primary hover:text-primary/80" data-testid="link-toc-operator">
                    2. Сведения об операторе
                  </a>
                  <a href="#data-localization" className="text-primary hover:text-primary/80" data-testid="link-toc-localization">
                    3. Локализация данных
                  </a>
                  <a href="#data-categories" className="text-primary hover:text-primary/80" data-testid="link-toc-categories">
                    4. Категории персональных данных
                  </a>
                  <a href="#processing-purposes" className="text-primary hover:text-primary/80" data-testid="link-toc-purposes">
                    5. Цели обработки данных
                  </a>
                  <a href="#legal-basis" className="text-primary hover:text-primary/80" data-testid="link-toc-legal">
                    6. Правовые основания
                  </a>
                  <a href="#data-collection" className="text-primary hover:text-primary/80" data-testid="link-toc-collection">
                    7. Порядок сбора данных
                  </a>
                  <a href="#data-storage" className="text-primary hover:text-primary/80" data-testid="link-toc-storage">
                    8. Хранение и защита данных
                  </a>
                  <a href="#data-rights" className="text-primary hover:text-primary/80" data-testid="link-toc-rights">
                    9. Права субъектов данных
                  </a>
                  <a href="#third-parties" className="text-primary hover:text-primary/80" data-testid="link-toc-third-parties">
                    10. Передача третьим лицам
                  </a>
                  <a href="#cookies" className="text-primary hover:text-primary/80" data-testid="link-toc-cookies">
                    11. Политика cookies
                  </a>
                  <a href="#contact" className="text-primary hover:text-primary/80" data-testid="link-toc-contact">
                    12. Контактная информация
                  </a>
                  <a href="#changes" className="text-primary hover:text-primary/80" data-testid="link-toc-changes">
                    13. Изменения политики
                  </a>
                </nav>
              </CardContent>
            </Card>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {/* 1. General Provisions */}
              <section id="general" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">1. Общие положения</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    1.1. Настоящая Политика конфиденциальности (далее — Политика) определяет порядок обработки 
                    персональных данных и меры по обеспечению безопасности персональных данных оператором ReScrub 
                    (далее — Оператор, Сервис) в целях соблюдения требований Федерального закона от 27.07.2006 
                    № 152-ФЗ «О персональных данных» и иных нормативных правовых актов в области защиты персональных данных.
                  </p>
                  <p>
                    1.2. Политика применяется ко всем процедурам обработки персональных данных, осуществляемых 
                    Оператором с использованием средств автоматизации и без использования таких средств.
                  </p>
                  <p>
                    1.3. Оператор обрабатывает персональные данные в соответствии с принципами и правилами, 
                    установленными Федеральным законом «О персональных данных».
                  </p>
                  <p>
                    1.4. Используя сервис ReScrub, вы соглашаетесь с условиями настоящей Политики и даете согласие 
                    на обработку своих персональных данных в порядке и целях, определенных данной Политикой.
                  </p>
                </div>
              </section>

              {/* 2. Operator Information */}
              <section id="operator-info" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">2. Сведения об операторе персональных данных</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    2.1. Оператором персональных данных является:
                  </p>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Building className="h-5 w-5 text-primary" />
                            <h4 className="font-semibold text-foreground">Юридическая информация:</h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p><strong>Полное наименование:</strong><br />
                            Индивидуальный предприниматель Гудков Роман Владимирович</p>
                            <p><strong>ИНН:</strong> 781912607115</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Mail className="h-5 w-5 text-primary" />
                            <h4 className="font-semibold text-foreground">Адреса и контакты:</h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p><strong>Юридический адрес:</strong><br />
                            125009, г. Москва, ул. Тверская, д. 7, оф. 401</p>
                            <p><strong>Почтовый адрес:</strong><br />
                            125009, г. Москва, ул. Тверская, д. 7, оф. 401</p>
                            <p><strong>Email для обращений по ПДн:</strong><br />
                            privacy@rescrub.ru</p>
                            <p><strong>Телефон:</strong> +7 (495) 123-45-67</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <h4 className="font-semibold text-foreground">Банковские реквизиты:</h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p><strong>Расчётный счёт:</strong><br />
                            40802810903500001660</p>
                            <p><strong>Банк:</strong><br />
                            ООО "Банк Точка"</p>
                            <p><strong>БИК:</strong> 044525104</p>
                            <p><strong>Корр. счёт:</strong><br />
                            30101810745374525104</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <p>
                    2.2. Ответственным за организацию обработки персональных данных назначен сотрудник, с которым 
                    можно связаться по электронному адресу: privacy@rescrub.ru
                  </p>
                  
                  <p>
                    2.3. Оператор зарегистрирован в Едином государственном реестре индивидуальных предпринимателей 
                    и осуществляет деятельность в соответствии с законодательством Российской Федерации.
                  </p>
                </div>
              </section>

              {/* 3. Data Localization */}
              <section id="data-localization" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">3. Локализация данных и трансграничная передача</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    3.1. В соответствии с требованиями Федерального закона № 152-ФЗ "О персональных данных" 
                    и Федерального закона № 242-ФЗ о локализации данных:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Lock className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold text-foreground">Основное хранение данных:</h4>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li>• Персональные данные россиян обрабатываются и хранятся на территории Российской Федерации</li>
                          <li>• Используются сертифицированные дата-центры в РФ</li>
                          <li>• Применяются российские криптографические стандарты</li>
                          <li>• Обеспечивается соответствие требованиям ФСТЭК и ФСБ России</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold text-foreground">Трансграничная передача:</h4>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li>• Основная обработка происходит исключительно в РФ</li>
                          <li>• Трансграничная передача осуществляется только в исключительных случаях</li>
                          <li>• При необходимости - только в страны с адекватным уровнем защиты</li>
                          <li>• С обязательным согласием субъекта персональных данных</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <p>
                    3.2. Случаи возможной трансграничной передачи персональных данных:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Цель передачи</th>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Получатель</th>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Правовое основание</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border p-3">Техническая поддержка</td>
                          <td className="border border-border p-3">IT-партнеры в ЕС/США (при необходимости)</td>
                          <td className="border border-border p-3">Договор + согласие субъекта</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="border border-border p-3">Поиск данных в зарубежных источниках</td>
                          <td className="border border-border p-3">Автоматизированные системы поиска</td>
                          <td className="border border-border p-3">Исполнение договора + согласие</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Требования законодательства</td>
                          <td className="border border-border p-3">Уполномоченные органы</td>
                          <td className="border border-border p-3">Императивные нормы права</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    3.3. Оператор гарантирует, что любая трансграничная передача персональных данных 
                    осуществляется исключительно в соответствии с требованиями российского законодательства 
                    и при наличии надлежащих правовых оснований.
                  </p>

                  <p>
                    3.4. Субъекты персональных данных имеют право получить информацию о любых случаях 
                    трансграничной передачи их данных, направив соответствующий запрос по адресу: privacy@rescrub.ru
                  </p>
                </div>
              </section>

              {/* 4. Data Categories */}
              <section id="data-categories" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">4. Категории персональных данных</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    4.1. Оператор может обрабатывать следующие категории персональных данных субъектов:
                  </p>
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Учетные данные:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Фамилия, имя, отчество</li>
                            <li>• Адрес электронной почты</li>
                            <li>• Номер телефона</li>
                            <li>• Логин и пароль</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Данные для защиты:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Домашний адрес</li>
                            <li>• Дополнительные контакты</li>
                            <li>• Информация о месте работы</li>
                            <li>• Иные данные для поиска</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <p>
                    4.2. Специальные категории персональных данных (биометрические данные, данные о расовой, 
                    национальной принадлежности, политических взглядах, религиозных убеждениях) Оператором не обрабатываются.
                  </p>
                  <p>
                    4.3. Обработка персональных данных несовершеннолетних осуществляется с согласия их законных представителей.
                  </p>
                </div>
              </section>

              {/* 5. Processing Purposes */}
              <section id="processing-purposes" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">5. Цели обработки данных</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    5.1. Персональные данные обрабатываются Оператором исключительно для следующих целей:
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Основные цели:</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Предоставление услуг по защите персональных данных</li>
                          <li>• Поиск и удаление персональных данных с сайтов брокеров данных</li>
                          <li>• Создание и ведение учетной записи пользователя</li>
                          <li>• Обеспечение технической поддержки пользователей</li>
                          <li>• Исполнение договорных обязательств</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Дополнительные цели:</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Информирование об изменениях в сервисе</li>
                          <li>• Проведение аналитики для улучшения качества услуг</li>
                          <li>• Соблюдение требований российского законодательства</li>
                          <li>• Предотвращение мошенничества и нарушений безопасности</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <p>
                    5.2. Оператор не обрабатывает персональные данные для целей, не указанных в настоящей Политике.
                  </p>
                </div>
              </section>

              {/* 6. Legal Basis */}
              <section id="legal-basis" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">6. Правовые основания обработки</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    6.1. Правовыми основаниями обработки персональных данных являются:
                  </p>
                  <div className="space-y-3">
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Согласие субъекта персональных данных</h4>
                      <p className="text-sm">
                        на обработку его персональных данных (ст. 6 п. 1 Федерального закона № 152-ФЗ)
                      </p>
                    </div>
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Исполнение договора</h4>
                      <p className="text-sm">
                        стороной которого является субъект персональных данных (ст. 6 п. 2 Федерального закона № 152-ФЗ)
                      </p>
                    </div>
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Защита жизненно важных интересов</h4>
                      <p className="text-sm">
                        субъекта персональных данных в области защиты персональных данных (ст. 6 п. 7 Федерального закона № 152-ФЗ)
                      </p>
                    </div>
                  </div>
                  <p>
                    6.2. Согласие на обработку персональных данных может быть отозвано субъектом персональных данных 
                    путем направления письменного заявления Оператору.
                  </p>
                </div>
              </section>

              {/* 7. Data Collection */}
              <section id="data-collection" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">7. Порядок сбора персональных данных</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    7.1. Сбор персональных данных осуществляется следующими способами:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Непосредственно от субъекта:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• При регистрации в сервисе</li>
                          <li>• При заполнении форм обратной связи</li>
                          <li>• При обращении в службу поддержки</li>
                          <li>• При оформлении подписки</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Автоматически:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• IP-адрес и данные браузера</li>
                          <li>• Информация о посещенных страницах</li>
                          <li>• Данные cookies и метрики</li>
                          <li>• Техническая информация устройства</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <p>
                    7.2. Перед началом обработки персональных данных Оператор информирует субъекта о целях и способах 
                    обработки его персональных данных.
                  </p>
                  <p>
                    7.3. Предоставление персональных данных является добровольным, за исключением случаев, когда 
                    предоставление таких данных необходимо для исполнения договорных обязательств или требований законодательства.
                  </p>
                </div>
              </section>

              {/* 8. Data Storage and Protection */}
              <section id="data-storage" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">8. Хранение и защита персональных данных</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    8.1. Оператор принимает необходимые и достаточные организационные и технические меры для защиты 
                    персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования, 
                    распространения, а также от иных неправомерных действий.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Технические меры:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Шифрование данных в соответствии с современными стандартами</li>
                          <li>• Использование защищенных протоколов передачи данных</li>
                          <li>• Регулярное обновление систем безопасности</li>
                          <li>• Мониторинг несанкционированного доступа</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Организационные меры:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Ограничение доступа к персональным данным</li>
                          <li>• Назначение ответственных за безопасность данных</li>
                          <li>• Обучение сотрудников основам защиты данных</li>
                          <li>• Контроль соблюдения требований безопасности</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <p>
                    8.2. Сроки хранения персональных данных:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Категория данных</th>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Срок хранения</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border p-3">Учетные данные пользователя</td>
                          <td className="border border-border p-3">До прекращения договорных отношений + 3 года</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="border border-border p-3">Данные для поиска и удаления</td>
                          <td className="border border-border p-3">В течение периода оказания услуг</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Техническая информация (логи)</td>
                          <td className="border border-border p-3">Не более 1 года</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="border border-border p-3">Данные cookies</td>
                          <td className="border border-border p-3">Согласно настройкам браузера</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    8.3. По истечении сроков хранения персональные данные подлежат уничтожению, за исключением случаев, 
                    когда их дальнейшее хранение необходимо в соответствии с требованиями законодательства.
                  </p>
                </div>
              </section>

              {/* 9. Data Subject Rights */}
              <section id="data-rights" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">9. Права субъектов персональных данных</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    9.1. В соответствии с Федеральным законом № 152-ФЗ субъект персональных данных имеет право:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Основные права:</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Получать информацию об обработке персональных данных</li>
                          <li>• Требовать уточнения, блокирования или уничтожения данных</li>
                          <li>• Отзывать согласие на обработку данных</li>
                          <li>• Обжаловать действия Оператора в суде</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Дополнительные возможности:</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Получить копию обрабатываемых данных</li>
                          <li>• Ограничить обработку определенных категорий данных</li>
                          <li>• Получать уведомления об изменениях в обработке</li>
                          <li>• Обратиться в Роскомнадзор с жалобой</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <p>
                    9.2. Для реализации своих прав субъект персональных данных может обратиться к Оператору:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h4 className="font-semibold text-foreground mb-1">Email</h4>
                        <p className="text-sm">privacy@rescrub.ru</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h4 className="font-semibold text-foreground mb-1">Телефон</h4>
                        <p className="text-sm">+7 (495) 123-45-67</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <User className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h4 className="font-semibold text-foreground mb-1">Личный кабинет</h4>
                        <p className="text-sm">В разделе "Настройки"</p>
                      </CardContent>
                    </Card>
                  </div>

                  <p>
                    9.3. Оператор обязуется рассмотреть обращение субъекта в течение 30 дней с момента получения 
                    и предоставить мотивированный ответ.
                  </p>
                </div>
              </section>

              {/* 10. Third Parties */}
              <section id="third-parties" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">10. Передача персональных данных третьим лицам</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    10.1. Оператор осуществляет передачу персональных данных третьим лицам исключительно 
                    в соответствии с требованиями Федерального закона № 152-ФЗ и исключительно 
                    в следующих случаях:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Получение согласия субъекта персональных данных</h4>
                      <p className="text-sm">
                        При получении письменного согласия субъекта на передачу его персональных данных 
                        конкретному получателю для определенных целей
                      </p>
                    </div>
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Исполнение договорных обязательств</h4>
                      <p className="text-sm">
                        Для исполнения договора, стороной которого является субъект персональных данных, 
                        включая обработку платежей и предоставление услуг
                      </p>
                    </div>
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Требования законодательства</h4>
                      <p className="text-sm">
                        По обоснованному требованию уполномоченных государственных органов 
                        в рамках их законодательно установленной компетенции
                      </p>
                    </div>
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Защита жизненно важных интересов</h4>
                      <p className="text-sm">
                        В случаях, когда передача необходима для защиты жизни, здоровья или иных 
                        жизненно важных интересов субъекта персональных данных
                      </p>
                    </div>
                  </div>

                  <p>
                    10.2. Подробная информация о категориях получателей персональных данных:
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Категория получателя</th>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Передаваемые данные</th>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Цель передачи</th>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Правовое основание</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border p-3">Хостинг-провайдеры</td>
                          <td className="border border-border p-3">Технические данные, логи</td>
                          <td className="border border-border p-3">Обеспечение работы сервиса</td>
                          <td className="border border-border p-3">Договор поручения (ст. 6 п. 2)</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="border border-border p-3">Платежные системы</td>
                          <td className="border border-border p-3">ФИО, email, данные карты</td>
                          <td className="border border-border p-3">Обработка платежей</td>
                          <td className="border border-border p-3">Исполнение договора (ст. 6 п. 2)</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Службы email-рассылок</td>
                          <td className="border border-border p-3">Email, имя пользователя</td>
                          <td className="border border-border p-3">Уведомления и коммуникации</td>
                          <td className="border border-border p-3">Согласие субъекта (ст. 6 п. 1)</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="border border-border p-3">Аналитические сервисы</td>
                          <td className="border border-border p-3">Обезличенная статистика</td>
                          <td className="border border-border p-3">Улучшение сервиса</td>
                          <td className="border border-border p-3">Согласие субъекта (ст. 6 п. 1)</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Государственные органы</td>
                          <td className="border border-border p-3">По требованию</td>
                          <td className="border border-border p-3">Соблюдение законодательства</td>
                          <td className="border border-border p-3">Требование закона (ст. 6 п. 4)</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="border border-border p-3">Службы поддержки</td>
                          <td className="border border-border p-3">Контактные данные, история обращений</td>
                          <td className="border border-border p-3">Техническая поддержка</td>
                          <td className="border border-border p-3">Исполнение договора (ст. 6 п. 2)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    10.3. Требования к третьим лицам при передаче персональных данных:
                  </p>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Обязательные требования:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Заключение соглашения об обработке персональных данных</li>
                            <li>• Обеспечение конфиденциальности переданных данных</li>
                            <li>• Ограничение целей использования переданных данных</li>
                            <li>• Применение адекватных мер защиты</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Ограничения:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Запрет на дальнейшую передачу без согласия</li>
                            <li>• Обязательство уничтожить данные по требованию</li>
                            <li>• Предоставление отчетности об обработке</li>
                            <li>• Уведомление о нарушениях безопасности</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <p>
                    10.4. Субъекты персональных данных имеют право:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <ul className="space-y-2 text-sm">
                          <li>• Получить полную информацию о всех получателях их персональных данных</li>
                          <li>• Отозвать согласие на передачу данных конкретному получателю</li>
                          <li>• Потребовать прекращения передачи данных третьим лицам</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <ul className="space-y-2 text-sm">
                          <li>• Получить копии соглашений с третьими лицами (в части, касающейся их данных)</li>
                          <li>• Обжаловать действия по передаче данных в Роскомнадзоре</li>
                          <li>• Требовать возмещения ущерба в случае нарушений</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <p>
                    10.5. Все случаи передачи персональных данных третьим лицам документируются 
                    Оператором с указанием получателя, переданных данных, цели и правового основания передачи.
                  </p>
                </div>
              </section>

              {/* 11. Cookies Policy */}
              <section id="cookies" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">11. Политика использования cookies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    11.1. Сервис ReScrub использует технологию cookies для улучшения функциональности и удобства использования.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Необходимые cookies:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Аутентификация пользователя</li>
                          <li>• Безопасность сессий</li>
                          <li>• Основные функции сервиса</li>
                          <li>• Предпочтения пользователя</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Аналитические cookies:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Анализ использования сервиса</li>
                          <li>• Статистика посещений</li>
                          <li>• Улучшение пользовательского опыта</li>
                          <li>• Оптимизация производительности</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <p>
                    11.2. Пользователь может управлять cookies через настройки браузера, включая их полное отключение. 
                    Отключение cookies может ограничить функциональность сервиса.
                  </p>
                  <p>
                    11.3. Сервис не использует cookies третьих лиц для рекламных целей или отслеживания пользователей 
                    на других сайтах.
                  </p>
                </div>
              </section>

              {/* 12. Contact Information */}
              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">12. Контактная информация для обращений</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    12.1. Для обращений по вопросам обработки персональных данных используйте следующие контактные данные:
                  </p>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Основные контакты:</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Email для обращений по ПДн:</strong><br />privacy@rescrub.ru</p>
                            <p><strong>Телефон:</strong> +7 (495) 123-45-67</p>
                            <p><strong>Почтовый адрес для обращений:</strong><br />125009, г. Москва, ул. Тверская, д. 7, оф. 401</p>
                            <p><strong>Время работы службы поддержки:</strong><br />Пн-Пт 9:00-18:00 (МСК)</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Для экстренных обращений:</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Нарушения безопасности:</strong><br />security@rescrub.ru</p>
                            <p><strong>Отзыв согласия:</strong><br />privacy@rescrub.ru</p>
                            <p><strong>Общие вопросы:</strong><br />support@rescrub.ru</p>
                            <p><strong>Макс. срок ответа:</strong> 30 календарных дней</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <p>
                    12.2. При обращении по вопросам персональных данных обязательно указывайте:
                  </p>
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <ul className="space-y-2 text-sm">
                        <li>• Полные ФИО и контактные данные</li>
                        <li>• Предмет обращения (отзыв согласия, удаление данных, исправление данных и т.п.)</li>
                        <li>• Обоснование и доказательства (при необходимости)</li>
                        <li>• Предпочитаемый способ получения ответа</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <p>
                    12.3. Оператор обязуется рассмотреть обращение в течение 30 дней с момента получения и предоставить мотивированный ответ.
                  </p>
                </div>
              </section>

              {/* 13. Policy Changes */}
              <section id="changes" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">13. Изменения в политике конфиденциальности</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    13.1. Оператор оставляет за собой право вносить изменения в настоящую Политику конфиденциальности.
                  </p>
                  <p>
                    13.2. О существенных изменениях в Политике пользователи уведомляются следующими способами:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="text-center bg-muted/30">
                      <CardContent className="pt-6">
                        <Mail className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Email уведомления</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center bg-muted/30">
                      <CardContent className="pt-6">
                        <User className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Уведомления в личном кабинете</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center bg-muted/30">
                      <CardContent className="pt-6">
                        <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Публикация на сайте</p>
                      </CardContent>
                    </Card>
                  </div>
                  <p>
                    13.3. Новая редакция Политики вступает в силу с момента ее размещения на сайте, если иное не установлено новой редакцией.
                  </p>
                  <p>
                    13.4. Действующая версия Политики конфиденциальности всегда доступна по адресу: 
                    <a href="/privacy" className="text-primary hover:text-primary/80 ml-1" data-testid="link-privacy-current">
                      https://rescrub.ru/privacy
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Вопросы о политике конфиденциальности?
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Если у вас остались вопросы о том, как мы обрабатываем ваши персональные данные, 
                наша команда готова предоставить разъяснения
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a href="mailto:privacy@rescrub.ru">
                  <Button size="lg" data-testid="button-contact-privacy">
                    Задать вопрос
                  </Button>
                </a>
                <Link href="/support">
                  <Button variant="outline" size="lg" data-testid="button-support-privacy">
                    Центр поддержки
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
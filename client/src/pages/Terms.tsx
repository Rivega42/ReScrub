import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Clock, Scale, ShieldCheck, Building, Gavel, User, CreditCard, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Terms() {
  useEffect(() => {
    document.title = "Пользовательское соглашение - ReScrub";
    
    // Add meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Пользовательское соглашение ReScrub - условия предоставления услуг защиты персональных данных в соответствии с российским законодательством.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Пользовательское соглашение ReScrub - условия предоставления услуг защиты персональных данных в соответствии с российским законодательством.';
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
                  <Scale className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Пользовательское соглашение
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Условия предоставления услуг защиты персональных данных в соответствии с российским законодательством
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Действует с: 15 сентября 2025 г.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="pb-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                      Важное уведомление
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Настоящее соглашение является юридически обязательным документом. Использование сервиса ReScrub 
                      означает полное согласие с изложенными условиями. Внимательно ознакомьтесь с документом перед началом использования услуг.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  Содержание соглашения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <a href="#general" className="text-primary hover:text-primary/80" data-testid="link-toc-general">
                    1. Общие положения
                  </a>
                  <a href="#definitions" className="text-primary hover:text-primary/80" data-testid="link-toc-definitions">
                    2. Определения
                  </a>
                  <a href="#subject" className="text-primary hover:text-primary/80" data-testid="link-toc-subject">
                    3. Предмет соглашения
                  </a>
                  <a href="#user-rights" className="text-primary hover:text-primary/80" data-testid="link-toc-user-rights">
                    4. Права пользователя
                  </a>
                  <a href="#user-obligations" className="text-primary hover:text-primary/80" data-testid="link-toc-user-obligations">
                    5. Обязанности пользователя
                  </a>
                  <a href="#operator-rights" className="text-primary hover:text-primary/80" data-testid="link-toc-operator-rights">
                    6. Права оператора
                  </a>
                  <a href="#operator-obligations" className="text-primary hover:text-primary/80" data-testid="link-toc-operator-obligations">
                    7. Обязанности оператора
                  </a>
                  <a href="#service-procedure" className="text-primary hover:text-primary/80" data-testid="link-toc-service">
                    8. Порядок оказания услуг
                  </a>
                  <a href="#payment" className="text-primary hover:text-primary/80" data-testid="link-toc-payment">
                    9. Стоимость и оплата
                  </a>
                  <a href="#liability" className="text-primary hover:text-primary/80" data-testid="link-toc-liability">
                    10. Ответственность сторон
                  </a>
                  <a href="#intellectual-property" className="text-primary hover:text-primary/80" data-testid="link-toc-ip">
                    11. Интеллектуальная собственность
                  </a>
                  <a href="#confidentiality" className="text-primary hover:text-primary/80" data-testid="link-toc-confidentiality">
                    12. Конфиденциальность
                  </a>
                  <a href="#disputes" className="text-primary hover:text-primary/80" data-testid="link-toc-disputes">
                    13. Разрешение споров
                  </a>
                  <a href="#final" className="text-primary hover:text-primary/80" data-testid="link-toc-final">
                    14. Заключительные положения
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
                    1.1. Настоящее Пользовательское соглашение (далее — Соглашение) регулирует отношения между 
ИП Гудков Роман Владимирович (далее — Оператор, Исполнитель) и физическим или юридическим лицом 
                    (далее — Пользователь, Заказчик) при использовании сервиса ReScrub.
                  </p>
                  <p>
                    1.2. Соглашение является публичной офертой в соответствии со статьей 437 Гражданского кодекса 
                    Российской Федерации и вступает в силу с момента выражения согласия Пользователем.
                  </p>
                  <p>
                    1.3. Согласие с условиями Соглашения выражается путем:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Регистрации в сервисе ReScrub</li>
                    <li>Начала использования любых функций сервиса</li>
                    <li>Оплаты услуг сервиса</li>
                    <li>Любых иных действий, свидетельствующих о намерении использовать сервис</li>
                  </ul>
                  <p>
                    1.4. Оператор имеет право изменять условия настоящего Соглашения в одностороннем 
                    порядке с обязательным предварительным уведомлением Пользователей не менее чем 
                    за 10 календарных дней до вступления изменений в силу.
                  </p>
                  
                  <p>
                    1.5. Уведомление об изменениях направляется Пользователям посредством:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Размещения уведомления на главной странице сайта rescrub.ru</li>
                    <li>Отправки email-уведомления на указанный при регистрации адрес электронной почты</li>
                    <li>Уведомления в личном кабинете пользователя</li>
                  </ul>
                  
                  <p>
                    1.6. При внесении существенных изменений, затрагивающих права и обязанности Пользователей, 
                    Пользователь имеет право в течение 30 дней с момента уведомления расторгнуть соглашение 
                    с возвратом пропорциональной части платежа за неоказанные услуги.
                  </p>
                </div>
              </section>

              {/* 2. Definitions */}
              <section id="definitions" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">2. Определения</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    2.1. В настоящем Соглашении используются следующие основные понятия:
                  </p>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-3 text-sm">
                          <div>
                            <strong className="text-foreground">ReScrub (Сервис)</strong> — 
                            интернет-сервис по защите персональных данных, предоставляемый Оператором 
                            по адресу rescrub.ru и связанных доменах.
                          </div>
                          <div>
                            <strong className="text-foreground">Пользователь (Заказчик)</strong> — 
                            дееспособное физическое лицо или юридическое лицо, использующее сервис ReScrub.
                          </div>
                          <div>
                            <strong className="text-foreground">Личный кабинет</strong> — 
                            индивидуальная область сервиса, доступная после авторизации.
                          </div>
                          <div>
                            <strong className="text-foreground">Брокеры данных</strong> — 
                            сайты и сервисы, собирающие и публикующие персональные данные физических лиц.
                          </div>
                          <div>
                            <strong className="text-foreground">Поисковый запрос</strong> — 
                            автоматизированный процесс поиска персональных данных Пользователя на сайтах брокеров данных.
                          </div>
                          <div>
                            <strong className="text-foreground">Запрос на удаление</strong> — 
                            официальное обращение к брокеру данных с требованием удалить персональную информацию.
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* 3. Subject */}
              <section id="subject" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">3. Предмет соглашения</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    3.1. Оператор обязуется предоставить, а Пользователь обязуется принять и оплатить 
                    следующие услуги в рамках сервиса ReScrub:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold text-foreground">Основные услуги:</h4>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li>• Автоматизированный поиск персональных данных на сайтах брокеров данных</li>
                          <li>• Формирование и отправка запросов на удаление персональных данных</li>
                          <li>• Мониторинг выполнения запросов на удаление</li>
                          <li>• Предоставление отчетности о проведенной работе</li>
                          <li>• Техническая поддержка пользователей</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold text-foreground">Дополнительные услуги:</h4>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li>• Консультации по вопросам защиты персональных данных</li>
                          <li>• Индивидуальные настройки поиска и мониторинга</li>
                          <li>• Приоритетная обработка запросов</li>
                          <li>• Расширенная аналитика и отчетность</li>
                          <li>• Персональная поддержка специалиста</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <p>
                    3.2. Услуги предоставляются в соответствии с техническими возможностями сервиса 
                    на момент оказания услуг и действующим российским законодательством.
                  </p>
                  
                  <p>
                    3.3. Оператор не гарантирует 100% удаление всех найденных записей, поскольку 
                    результат зависит от политики конкретных брокеров данных и технических ограничений.
                  </p>
                </div>
              </section>

              {/* 4. User Rights */}
              <section id="user-rights" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">4. Права пользователя</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    4.1. Пользователь имеет право:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Право на информацию</h4>
                      <p className="text-sm">
                        Получать полную и достоверную информацию об услугах, их стоимости и условиях предоставления.
                      </p>
                    </div>
                    
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Право на отчетность</h4>
                      <p className="text-sm">
                        Получать подробные отчеты о поиске и удалении персональных данных в личном кабинете.
                      </p>
                    </div>
                    
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Право на техническую поддержку</h4>
                      <p className="text-sm">
                        Обращаться в службу технической поддержки по вопросам использования сервиса.
                      </p>
                    </div>
                    
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Право на прекращение услуг</h4>
                      <p className="text-sm">
                        В любое время прекратить использование сервиса с учетом условий настоящего соглашения.
                      </p>
                    </div>
                  </div>

                  <p>
                    4.2. Пользователь вправе требовать возмещения реального ущерба, причиненного 
                    неисполнением или ненадлежащим исполнением обязательств Оператором, в соответствии 
                    с гражданским законодательством Российской Федерации и Законом о защите прав потребителей.
                  </p>
                  
                  <p>
                    4.3. Для физических лиц (потребителей) действуют дополнительные права и гарантии, 
                    предусмотренные Законом РФ "О защите прав потребителей", включая право на:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Возмещение морального вреда</li>
                    <li>Взыскание штрафа в размере 50% от присужденной суммы при удовлетворении требований потребителя в судебном порядке</li>
                    <li>Компенсацию расходов на экспертизу, юридические и иные расходы</li>
                    <li>Возврат денежных средств с учетом процентов за пользование чужими деньгами</li>
                  </ul>
                  
                  <p>
                    4.4. Иные права Пользователя определяются действующим законодательством Российской Федерации 
                    и настоящим Соглашением.
                  </p>
                </div>
              </section>

              {/* 5. User Obligations */}
              <section id="user-obligations" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">5. Обязанности пользователя</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    5.1. Пользователь обязуется:
                  </p>
                  
                  <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">Обязательные требования:</h4>
                      <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                        <li>• Предоставлять достоверную информацию о себе при регистрации</li>
                        <li>• Использовать сервис исключительно для защиты собственных персональных данных</li>
                        <li>• Не передавать доступ к личному кабинету третьим лицам</li>
                        <li>• Своевременно оплачивать услуги согласно выбранному тарифу</li>
                        <li>• Соблюдать требования российского законодательства при использовании сервиса</li>
                        <li>• Не использовать сервис для незаконных целей или нарушения прав третьих лиц</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <p>
                    5.2. Пользователь гарантирует, что:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Обязательство</th>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Описание</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border p-3">Правомочность</td>
                          <td className="border border-border p-3">Имеет право распоряжаться указанными персональными данными</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="border border-border p-3">Достоверность</td>
                          <td className="border border-border p-3">Предоставленная информация является точной и актуальной</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Дееспособность</td>
                          <td className="border border-border p-3">Является дееспособным лицом или действует от имени дееспособного лица</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="border border-border p-3">Согласие</td>
                          <td className="border border-border p-3">Имеет согласие на обработку данных от всех заинтересованных лиц</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    5.3. В случае нарушения обязательств Пользователь несет ответственность в соответствии 
                    с действующим законодательством Российской Федерации.
                  </p>
                </div>
              </section>

              {/* 6. Operator Rights */}
              <section id="operator-rights" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">6. Права оператора</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    6.1. Оператор имеет право:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Управленческие права:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Изменять функциональность сервиса</li>
                          <li>• Устанавливать технические требования</li>
                          <li>• Приостанавливать работу для технического обслуживания</li>
                          <li>• Модифицировать условия соглашения</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Контрольные права:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Проверять соблюдение условий соглашения</li>
                          <li>• Ограничивать доступ при нарушениях</li>
                          <li>• Требовать подтверждения личности</li>
                          <li>• Прекращать оказание услуг нарушителям</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <p>
                    6.2. Оператор вправе отказать в предоставлении услуг или приостановить их оказание 
                    исключительно в следующих законно обоснованных случаях:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Предоставление заведомо недостоверной информации при регистрации</li>
                    <li>Обоснованные подозрения в мошеннических действиях или использовании сервиса для незаконных целей</li>
                    <li>Существенное нарушение условий настоящего соглашения после предварительного письменного предупреждения</li>
                    <li>Технические ограничения или невозможность оказания услуг по причинам, не зависящим от Оператора</li>
                    <li>Требования органов государственной власти в рамках их полномочий</li>
                  </ul>
                  
                  <p>
                    6.3. При отказе в предоставлении услуг или их приостановлении Оператор обязан:
                  </p>
                  <div className="space-y-2 ml-4">
                    <p>• Уведомить Пользователя с указанием конкретных причин в течение 3 рабочих дней</p>
                    <p>• Предоставить возможность устранения нарушений (если применимо) в срок не менее 10 дней</p>
                    <p>• Обеспечить возможность обжалования решения через службу поддержки</p>
                    <p>• Возвратить пропорциональную часть оплаты за неоказанные услуги</p>
                  </div>

                  <p>
                    6.4. Оператор имеет право привлечь третьих лиц для исполнения своих обязательств 
                    по настоящему соглашению, оставаясь при этом ответственным перед Пользователем 
                    за надлежащее исполнение обязательств.
                  </p>
                </div>
              </section>

              {/* 7. Operator Obligations */}
              <section id="operator-obligations" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">7. Обязанности оператора</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    7.1. Оператор обязуется:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Качество услуг</h4>
                      <p className="text-sm">
                        Предоставлять услуги с разумной степенью профессионализма и в соответствии 
                        с описанием на сайте сервиса.
                      </p>
                    </div>
                    
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Техническая поддержка</h4>
                      <p className="text-sm">
                        Обеспечивать работу службы технической поддержки в рабочие дни с 9:00 до 18:00 МСК.
                      </p>
                    </div>
                    
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Безопасность данных</h4>
                      <p className="text-sm">
                        Принимать разумные меры для защиты персональных данных Пользователя в соответствии 
                        с требованиями 152-ФЗ.
                      </p>
                    </div>
                    
                    <div className="pl-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground">Уведомления</h4>
                      <p className="text-sm">
                        Уведомлять об изменениях в работе сервиса, способных повлиять на оказание услуг.
                      </p>
                    </div>
                  </div>

                  <p>
                    7.2. Оператор обязуется соблюдать конфиденциальность информации, полученной от Пользователя, 
                    и не разглашать ее третьим лицам, за исключением случаев, предусмотренных законодательством 
                    Российской Федерации.
                  </p>
                  
                  <p>
                    7.3. Оператор не обязан проверять достоверность информации, предоставляемой Пользователем, 
                    но вправе требовать подтверждения при наличии сомнений в ее подлинности.
                  </p>
                </div>
              </section>

              {/* 8. Service Procedure */}
              <section id="service-procedure" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">8. Порядок оказания услуг</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    8.1. Услуги оказываются в следующем порядке:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold mb-2 mx-auto">
                            1
                          </div>
                          <h4 className="font-semibold text-foreground mb-2">Регистрация</h4>
                          <p className="text-sm">Создание личного кабинета и выбор тарифного плана</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold mb-2 mx-auto">
                            2
                          </div>
                          <h4 className="font-semibold text-foreground mb-2">Настройка</h4>
                          <p className="text-sm">Указание данных для поиска и настройка параметров</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold mb-2 mx-auto">
                            3
                          </div>
                          <h4 className="font-semibold text-foreground mb-2">Поиск</h4>
                          <p className="text-sm">Автоматизированный поиск данных на сайтах брокеров</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold mb-2 mx-auto">
                            4
                          </div>
                          <h4 className="font-semibold text-foreground mb-2">Удаление</h4>
                          <p className="text-sm">Отправка запросов на удаление и мониторинг результатов</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <p>
                    8.2. Сроки оказания услуг:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Услуга</th>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Срок выполнения</th>
                          <th className="border border-border p-3 text-left font-semibold text-foreground">Примечания</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border p-3">Первичный поиск</td>
                          <td className="border border-border p-3">До 3 рабочих дней</td>
                          <td className="border border-border p-3">С момента настройки параметров</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="border border-border p-3">Отправка запросов на удаление</td>
                          <td className="border border-border p-3">До 5 рабочих дней</td>
                          <td className="border border-border p-3">С момента обнаружения записей</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Мониторинг удаления</td>
                          <td className="border border-border p-3">До 30 календарных дней</td>
                          <td className="border border-border p-3">Зависит от ответа брокеров</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="border border-border p-3">Регулярный мониторинг</td>
                          <td className="border border-border p-3">Согласно тарифу</td>
                          <td className="border border-border p-3">Еженедельно или ежемесячно</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    8.3. Оператор не может гарантировать удаление всех обнаруженных записей, поскольку 
                    окончательное решение принимает соответствующий брокер данных. Оператор обязуется 
                    предпринять все разумные усилия для достижения результата.
                  </p>
                </div>
              </section>

              {/* 9. Payment */}
              <section id="payment" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">9. Стоимость и порядок оплаты услуг</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    9.1. Стоимость услуг определяется согласно действующим тарифам, размещенным на сайте сервиса.
                  </p>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-foreground">Условия оплаты:</h4>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li>• Оплата производится в российских рублях</li>
                        <li>• Доступна оплата банковскими картами и другими электронными способами</li>
                        <li>• Все цены указаны с учетом НДС (при наличии обязанности по его уплате)</li>
                        <li>• Возврат денежных средств осуществляется в соответствии с законом о защите прав потребителей</li>
                        <li>• При просрочке платежа доступ к услугам может быть ограничен</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <p>
                    9.2. Оператор имеет право изменять стоимость услуг с уведомлением Пользователей 
                    не менее чем за 10 календарных дней до вступления изменений в силу.
                  </p>
                  
                  <p>
                    9.3. В случае отказа от услуг Пользователь имеет право на возврат денежных средств 
                    в размере стоимости неоказанных услуг в следующих случаях:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Существенное нарушение условий соглашения со стороны Оператора</li>
                    <li>Невозможность оказания услуг по техническим причинам</li>
                    <li>Иные случаи, предусмотренные законодательством о защите прав потребителей</li>
                  </ul>
                </div>
              </section>

              {/* 10. Liability */}
              <section id="liability" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">10. Ответственность сторон</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    10.1. Оператор несет ответственность за:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Оператор отвечает за:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Неисполнение или ненадлежащее исполнение своих обязательств</li>
                          <li>• Нарушение конфиденциальности персональных данных по своей вине</li>
                          <li>• Предоставление недостоверной информации об услугах</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-foreground mb-2">Оператор НЕ отвечает за:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Действия третьих лиц (брокеров данных)</li>
                          <li>• Технические сбои интернет-провайдеров</li>
                          <li>• Форс-мажорные обстоятельства</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <p>
                    10.2. Ответственность Оператора определяется в соответствии с гражданским 
                    законодательством Российской Федерации. Ограничения ответственности НЕ распространяются на:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Случаи умысла или грубой неосторожности Оператора</li>
                    <li>Вред, причиненный жизни, здоровью или имуществу Пользователя</li>
                    <li>Нарушение требований законодательства о персональных данных</li>
                    <li>Обязательные права потребителей, предусмотренные ЗоЗПП</li>
                    <li>Моральный вред, причиненный потребителям</li>
                  </ul>
                  
                  <p>
                    10.3. Для потребителей (физических лиц) размер возмещения определяется в полном объеме 
                    в соответствии с Законом РФ "О защите прав потребителей" без каких-либо ограничений.
                  </p>
                  
                  <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">Ответственность пользователя:</h4>
                      <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                        <li>• За достоверность предоставленной информации</li>
                        <li>• За правомерность запросов на удаление персональных данных</li>
                        <li>• За соблюдение условий настоящего соглашения</li>
                        <li>• За ущерб, причиненный Оператору вследствие нарушения обязательств</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <p>
                    10.4. Стороны освобождаются от ответственности при наступлении обстоятельств непреодолимой силы, 
                    включая, но не ограничиваясь: стихийными бедствиями, войнами, террористическими актами, 
                    изменениями в законодательстве, техническими сбоями глобальной сети интернет.
                  </p>
                </div>
              </section>

              {/* 11. Intellectual Property */}
              <section id="intellectual-property" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">11. Интеллектуальная собственность</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    11.1. Все объекты интеллектуальной собственности, включая программное обеспечение, 
                    базы данных, товарные знаки, логотипы, тексты, изображения и иные материалы сервиса ReScrub, 
                    принадлежат Оператору или используются на законных основаниях.
                  </p>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Building className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-foreground">Права Оператора:</h4>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li>• Исключительные права на программное обеспечение сервиса</li>
                        <li>• Права на товарный знак "ReScrub" и связанные обозначения</li>
                        <li>• Авторские права на содержание сайта и документацию</li>
                        <li>• Права на методологию и алгоритмы поиска и удаления данных</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <p>
                    11.2. Пользователю предоставляется простая (неисключительная) лицензия на использование 
                    сервиса исключительно для личных нужд в рамках функциональности, предусмотренной сервисом.
                  </p>
                  
                  <p>
                    11.3. Пользователю запрещается:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Воспроизводить, копировать, распространять программное обеспечение сервиса</li>
                    <li>Производить декомпиляцию, дизассемблирование программного кода</li>
                    <li>Использовать товарные знаки Оператора без письменного разрешения</li>
                    <li>Создавать производные продукты на основе сервиса</li>
                  </ul>

                  <p>
                    11.4. Нарушение прав интеллектуальной собственности влечет ответственность 
                    в соответствии с действующим законодательством Российской Федерации.
                  </p>
                </div>
              </section>

              {/* 12. Confidentiality */}
              <section id="confidentiality" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">12. Конфиденциальность</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    12.1. Отношения по обработке персональных данных регулируются Политикой конфиденциальности, 
                    являющейся неотъемлемой частью настоящего соглашения.
                  </p>
                  
                  <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                        <div>
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                            Обязательства по конфиденциальности
                          </h4>
                          <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                            <li>• Персональные данные обрабатываются в соответствии с 152-ФЗ</li>
                            <li>• Данные хранятся на территории Российской Федерации</li>
                            <li>• Применяются современные методы защиты информации</li>
                            <li>• Доступ к данным имеют только уполномоченные сотрудники</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <p>
                    12.2. Стороны обязуются не разглашать конфиденциальную информацию, 
                    ставшую известной в ходе исполнения настоящего соглашения, третьим лицам 
                    без письменного согласия другой стороны.
                  </p>
                  
                  <p>
                    12.3. Обязательства по конфиденциальности действуют в течение срока действия соглашения 
                    и в течение 5 лет после его прекращения.
                  </p>

                  <p>
                    12.4. Подробная информация об обработке персональных данных содержится в 
                    <Link href="/privacy" className="text-primary hover:text-primary/80 underline" data-testid="link-privacy-policy">
                      Политике конфиденциальности
                    </Link>.
                  </p>
                </div>
              </section>

              {/* 13. Disputes */}
              <section id="disputes" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">13. Разрешение споров</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    13.1. Все споры и разногласия, возникающие в связи с настоящим соглашением, 
                    разрешаются путем переговоров между сторонами.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Gavel className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold text-foreground">Досудебный порядок:</h4>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li>• Направление претензии в письменном виде</li>
                          <li>• Срок рассмотрения претензии: 10 рабочих дней</li>
                          <li>• Обязательность соблюдения для обеих сторон</li>
                          <li>• Попытки урегулирования в переговорном порядке</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Building className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold text-foreground">Судебный порядок:</h4>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li>• Подсудность судов г. Москвы</li>
                          <li>• Применимое право: российское законодательство</li>
                          <li>• Соблюдение претензионного порядка</li>
                          <li>• Особенности для споров с потребителями</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <p>
                    13.2. При недостижении согласия в досудебном порядке споры подлежат разрешению 
                    в судебном порядке в соответствии с действующим законодательством Российской Федерации.
                  </p>
                  
                  <p>
                    13.3. Для споров с участием потребителей применяются положения Закона Российской Федерации 
                    "О защите прав потребителей", включая особенности подсудности и возмещения расходов.
                  </p>

                  <p>
                    13.4. К настоящему соглашению применяется материальное право Российской Федерации.
                  </p>
                </div>
              </section>

              {/* 14. Final Provisions */}
              <section id="final" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">14. Заключительные положения</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    14.1. Настоящее соглашение вступает в силу с момента акцепта оферты Пользователем 
                    и действует до полного исполнения сторонами своих обязательств.
                  </p>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-foreground mb-3">Основания прекращения соглашения:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-foreground mb-1">По инициативе Пользователя:</h5>
                          <ul className="space-y-1">
                            <li>• Отказ от услуг с уведомлением</li>
                            <li>• Удаление личного кабинета</li>
                            <li>• Неоплата услуг более 30 дней</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground mb-1">По инициативе Оператора:</h5>
                          <ul className="space-y-1">
                            <li>• Нарушение условий соглашения</li>
                            <li>• Прекращение деятельности</li>
                            <li>• Технические ограничения</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <p>
                    14.2. В случае изменения реквизитов или иных данных, каждая из сторон обязана 
                    в течение 5 рабочих дней письменно уведомить об этом другую сторону.
                  </p>
                  
                  <p>
                    14.3. Если какое-либо положение настоящего соглашения будет признано недействительным, 
                    это не влечет недействительность других положений и соглашения в целом.
                  </p>

                  <p>
                    14.4. Во всем, что не урегулировано настоящим соглашением, стороны руководствуются 
                    действующим законодательством Российской Федерации.
                  </p>

                  <div className="mt-8 p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3">Контактная информация для вопросов по соглашению:</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> legal@rescrub.ru</p>
                      <p><strong>Телефон:</strong> +7 (495) 123-45-67</p>
                      <p><strong>Адрес:</strong> ИП Гудков Роман Владимирович, Москва</p>
                      <p><strong>Время работы:</strong> Понедельник-пятница, 9:00-18:00 МСК</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="mt-16 text-center">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Согласны с условиями соглашения?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Начните защиту своих персональных данных уже сегодня
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <Link href="/reports">
                        <Button size="lg" data-testid="button-terms-get-started">
                          Начать использование сервиса
                        </Button>
                      </Link>
                      <Link href="/contacts">
                        <Button variant="outline" size="lg" data-testid="button-terms-contact">
                          Задать вопрос
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
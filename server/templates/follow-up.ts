import { EmailTemplate } from '../email';

/**
 * Шаблон повторного обращения при отсутствии ответа на первоначальное требование
 * согласно ст. 21 Федерального закона № 152-ФЗ "О персональных данных"
 */
export const followUpTemplate: EmailTemplate = {
  subject: 'ПОВТОРНОЕ требование об удалении персональных данных - {{senderName}} (срок истекает)',

  text: `Уважаемые коллеги!

Направляю Вам ПОВТОРНОЕ требование о прекращении обработки моих персональных данных в связи с отсутствием ответа на предыдущее обращение.

ИСТОРИЯ ОБРАЩЕНИЯ:

Первоначальное требование было направлено {{requestDate}}. В соответствии со статьей 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных" оператор обязан рассмотреть требование субъекта персональных данных в течение 30 дней.

ИДЕНТИФИКАЦИОННЫЕ ДАННЫЕ СУБЪЕКТА ПЕРСОНАЛЬНЫХ ДАННЫХ:

ФИО: {{senderName}}
E-mail: {{senderEmail}}
{{#if senderPhone}}Телефон: {{senderPhone}}{{/if}}

ПРАВОВОЕ ОСНОВАНИЕ:

Настоящее требование направляется в соответствии со статьями 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных", а также в соответствии с Постановлением Правительства РФ от 15.09.2008 № 687 "Об утверждении Положения об особенностях обработки персональных данных, осуществляемой без использования средств автоматизации".

ОБНАРУЖЕННЫЕ ПЕРСОНАЛЬНЫЕ ДАННЫЕ:

{{#if personalDataList}}На вашем сайте {{brokerName}} ({{brokerUrl}}) продолжают размещаться следующие мои персональные данные:
{{personalDataList}}{{else}}На вашем сайте {{brokerName}} {{#if brokerUrl}}({{brokerUrl}}) {{/if}}продолжают размещаться мои персональные данные без моего согласия.{{/if}}

ТРЕБОВАНИЯ (ПОВТОРНО):

1. НЕМЕДЛЕННО прекратить обработку всех моих персональных данных
2. УДАЛИТЬ всю информацию обо мне из ваших баз данных и информационных систем  
3. ИСКЛЮЧИТЬ возможность дальнейшего сбора и обработки моих персональных данных
4. ПОДТВЕРДИТЬ выполнение данного требования письменным уведомлением в течение 7 дней

ПРЕДУПРЕЖДЕНИЕ О ПРАВОВЫХ ПОСЛЕДСТВИЯХ:

В соответствии со статьей 13.11 КоАП РФ нарушение установленного порядка сбора, хранения, использования или распространения информации о гражданах влечет наложение административного штрафа:
- на граждан в размере от 300 до 500 рублей;
- на должностных лиц - от 500 до 1000 рублей;
- на юридических лиц - от 5000 до 10000 рублей.

При неисполнении настоящего требования в течение 7 дней буду вынужден обратиться в Роскомнадзор с жалобой о нарушении требований законодательства о персональных данных.

С уважением,
{{senderName}}
{{senderEmail}}
{{#if senderPhone}}{{senderPhone}}{{/if}}

Дата: {{requestDate}}`,

  html: `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Повторное требование об удалении персональных данных</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.6;
            color: #000;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            font-weight: bold;
            color: #dc2626;
        }
        
        .urgent {
            background-color: #fef2f2;
            border: 2px solid #dc2626;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
        }
        
        .legal-warning {
            background-color: #fef3c7;
            padding: 15px;
            border-left: 4px solid #f59e0b;
            margin: 15px 0;
        }
        
        .requirements {
            background-color: #fef2f2;
            padding: 15px;
            border-left: 4px solid #dc2626;
            margin: 15px 0;
        }
        
        .signature {
            margin-top: 40px;
            text-align: right;
        }
        
        ul, ol {
            padding-left: 25px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        .highlight {
            background-color: #fef3c7;
            padding: 2px 5px;
            font-weight: bold;
        }
        
        .red-text {
            color: #dc2626;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        ПОВТОРНОЕ ТРЕБОВАНИЕ О ПРЕКРАЩЕНИИ ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ
        <br><span class="red-text">(СРОК РАССМОТРЕНИЯ ИСТЕКАЕТ)</span>
    </div>

    <div class="urgent">
        <p><strong>ВНИМАНИЕ!</strong> Данное письмо является повторным обращением в связи с отсутствием ответа на первоначальное требование от {{requestDate}}.</p>
    </div>

    <p>Уважаемые коллеги!</p>
    
    <p>Направляю Вам <strong>ПОВТОРНОЕ</strong> требование о прекращении обработки моих персональных данных в связи с отсутствием ответа на предыдущее обращение.</p>

    <div class="section">
        <div class="section-title">История обращения:</div>
        <p>Первоначальное требование было направлено <strong>{{requestDate}}</strong>. В соответствии со <strong>статьей 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"</strong> оператор обязан рассмотреть требование субъекта персональных данных в течение <span class="highlight">30 дней</span>.</p>
    </div>

    <div class="section">
        <div class="section-title">Идентификационные данные субъекта персональных данных:</div>
        <p><strong>ФИО:</strong> {{senderName}}</p>
        <p><strong>E-mail:</strong> {{senderEmail}}</p>
        {{#if senderPhone}}<p><strong>Телефон:</strong> {{senderPhone}}</p>{{/if}}
    </div>

    <div class="section">
        <div class="section-title">Правовое основание:</div>
        <p>Настоящее требование направляется в соответствии со <strong>статьями 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"</strong>, а также в соответствии с <strong>Постановлением Правительства РФ от 15.09.2008 № 687</strong> "Об утверждении Положения об особенностях обработки персональных данных, осуществляемой без использования средств автоматизации".</p>
    </div>

    <div class="section">
        <div class="section-title">Обнаруженные персональные данные:</div>
        {{#if personalDataList}}
        <p>На вашем сайте <strong>{{brokerName}}</strong> ({{brokerUrl}}) <span class="red-text">продолжают размещаться</span> следующие мои персональные данные:</p>
        <div style="font-style: italic; color: #374151;">{{personalDataList}}</div>
        {{else}}
        <p>На вашем сайте <strong>{{brokerName}}</strong> {{#if brokerUrl}}({{brokerUrl}}) {{/if}}<span class="red-text">продолжают размещаться</span> мои персональные данные без моего согласия.</p>
        {{/if}}
    </div>

    <div class="requirements">
        <div class="section-title red-text">Требования (повторно):</div>
        <ol>
            <li><strong class="red-text">НЕМЕДЛЕННО прекратить обработку</strong> всех моих персональных данных</li>
            <li><strong class="red-text">УДАЛИТЬ всю информацию</strong> обо мне из ваших баз данных и информационных систем</li>
            <li><strong class="red-text">ИСКЛЮЧИТЬ возможность дальнейшего сбора</strong> и обработки моих персональных данных</li>
            <li><strong class="red-text">ПОДТВЕРДИТЬ выполнение</strong> данного требования письменным уведомлением в течение <span class="highlight">7 дней</span></li>
        </ol>
    </div>

    <div class="legal-warning">
        <div class="section-title">Предупреждение о правовых последствиях:</div>
        <p>В соответствии со <strong>статьей 13.11 КоАП РФ</strong> нарушение установленного порядка сбора, хранения, использования или распространения информации о гражданах влечет наложение административного штрафа:</p>
        <ul>
            <li>на граждан в размере от <strong>300 до 500 рублей</strong></li>
            <li>на должностных лиц - от <strong>500 до 1000 рублей</strong></li>
            <li>на юридических лиц - от <strong>5000 до 10000 рублей</strong></li>
        </ul>
    </div>

    <p class="red-text"><strong>При неисполнении настоящего требования в течение 7 дней буду вынужден обратиться в Роскомнадзор с жалобой о нарушении требований законодательства о персональных данных.</strong></p>

    <div class="signature">
        <p>С уважением,</p>
        <p><strong>{{senderName}}</strong></p>
        <p>{{senderEmail}}</p>
        {{#if senderPhone}}<p>{{senderPhone}}</p>{{/if}}
        <p><em>Дата: {{requestDate}}</em></p>
    </div>
</body>
</html>`
};
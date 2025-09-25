import { EmailTemplate } from '../email';

/**
 * Основной шаблон требования об удалении персональных данных
 * согласно ст. 14, 15, 21 Федерального закона № 152-ФЗ "О персональных данных"
 */
export const deletionRequestTemplate: EmailTemplate = {
  subject: 'Требование о прекращении обработки персональных данных - {{senderName}}',

  text: `Уважаемые коллеги!

Направляю Вам требование о прекращении обработки моих персональных данных в соответствии с требованиями российского законодательства.

ИДЕНТИФИКАЦИОННЫЕ ДАННЫЕ СУБЪЕКТА ПЕРСОНАЛЬНЫХ ДАННЫХ:

ФИО: {{senderName}}
E-mail: {{senderEmail}}
{{#if senderPhone}}Телефон: {{senderPhone}}{{/if}}

ПРАВОВОЕ ОСНОВАНИЕ:

Настоящее требование направляется в соответствии со статьями 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных", которые предоставляют субъекту персональных данных право:

- требовать от оператора уточнения его персональных данных, их блокирования или уничтожения в случае, если персональные данные являются неполными, устаревшими, неточными, незаконно полученными или не являются необходимыми для заявленной цели обработки (ст. 14)
- на получение информации, касающейся обработки его персональных данных (ст. 14)
- отозвать согласие на обработку персональных данных (ст. 9, ч. 2)

ОБНАРУЖЕННЫЕ ПЕРСОНАЛЬНЫЕ ДАННЫЕ:

{{#if personalDataList}}На вашем сайте {{brokerName}} ({{brokerUrl}}) обнаружены следующие мои персональные данные:
{{personalDataList}}{{else}}На вашем сайте {{brokerName}} {{#if brokerUrl}}({{brokerUrl}}) {{/if}}обнаружены мои персональные данные без моего согласия.{{/if}}

ТРЕБОВАНИЯ:

1. Немедленно прекратить обработку всех моих персональных данных
2. Удалить всю информацию обо мне из ваших баз данных и информационных систем
3. Исключить возможность дальнейшего сбора и обработки моих персональных данных
4. Подтвердить выполнение данного требования письменным уведомлением

Согласие на обработку персональных данных мной не предоставлялось. Прошу рассмотреть данное требование в течение 30 дней в соответствии с требованиями статьи 21 ФЗ-152.

{{#if token}}
ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ:
Если Вы удалили персональные данные указанного субъекта, подтвердите это по следующей ссылке:
https://rescrub.ru/operator/confirm?token={{token}}

Данная ссылка действительна в течение 30 дней.
{{/if}}

В случае неисполнения данного требования оставляю за собой право обратиться в Федеральную службу по надзору в сфере связи, информационных технологий и массовых коммуникаций (Роскомнадзор) для защиты моих прав как субъекта персональных данных.

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
    <title>Требование об удалении персональных данных</title>
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
        
        .legal-basis {
            background-color: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #2563eb;
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
        
        ul {
            padding-left: 25px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        .data-list {
            font-style: italic;
            color: #374151;
        }
    </style>
</head>
<body>
    <div class="header">
        ТРЕБОВАНИЕ О ПРЕКРАЩЕНИИ ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ
    </div>

    <p>Уважаемые коллеги!</p>
    
    <p>Направляю Вам требование о прекращении обработки моих персональных данных в соответствии с требованиями российского законодательства.</p>

    <div class="section">
        <div class="section-title">Идентификационные данные субъекта персональных данных:</div>
        <p><strong>ФИО:</strong> {{senderName}}</p>
        <p><strong>E-mail:</strong> {{senderEmail}}</p>
        {{#if senderPhone}}<p><strong>Телефон:</strong> {{senderPhone}}</p>{{/if}}
    </div>

    <div class="legal-basis">
        <div class="section-title">Правовое основание:</div>
        <p>Настоящее требование направляется в соответствии со <strong>статьями 14, 15, 21 Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных"</strong>, которые предоставляют субъекту персональных данных право:</p>
        <ul>
            <li>требовать от оператора уточнения его персональных данных, их блокирования или уничтожения в случае, если персональные данные являются неполными, устаревшими, неточными, незаконно полученными или не являются необходимыми для заявленной цели обработки (ст. 14)</li>
            <li>на получение информации, касающейся обработки его персональных данных (ст. 14)</li>
            <li>отозвать согласие на обработку персональных данных (ст. 9, ч. 2)</li>
        </ul>
    </div>

    <div class="section">
        <div class="section-title">Обнаруженные персональные данные:</div>
        {{#if personalDataList}}
        <p>На вашем сайте <strong>{{brokerName}}</strong> ({{brokerUrl}}) обнаружены следующие мои персональные данные:</p>
        <div class="data-list">{{personalDataList}}</div>
        {{else}}
        <p>На вашем сайте <strong>{{brokerName}}</strong> {{#if brokerUrl}}({{brokerUrl}}) {{/if}}обнаружены мои персональные данные без моего согласия.</p>
        {{/if}}
    </div>

    <div class="requirements">
        <div class="section-title">Требования:</div>
        <ol>
            <li><strong>Немедленно прекратить обработку</strong> всех моих персональных данных</li>
            <li><strong>Удалить всю информацию</strong> обо мне из ваших баз данных и информационных систем</li>
            <li><strong>Исключить возможность дальнейшего сбора</strong> и обработки моих персональных данных</li>
            <li><strong>Подтвердить выполнение</strong> данного требования письменным уведомлением</li>
        </ol>
    </div>

    <p><strong>Согласие на обработку персональных данных мной не предоставлялось.</strong> Прошу рассмотреть данное требование в течение <strong>30 дней</strong> в соответствии с требованиями статьи 21 ФЗ-152.</p>

    {{#if token}}
    <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px;">
        <h3 style="color: #495057; margin-bottom: 15px;">Подтверждение удаления персональных данных</h3>
        <p style="color: #6c757d; margin-bottom: 20px;">Если Вы удалили персональные данные указанного субъекта, подтвердите это нажав на кнопку ниже:</p>
        <a href="https://rescrub.ru/operator/confirm?token={{token}}" 
           style="display: inline-block; background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">
            ✓ ДАННЫЕ УДАЛЕНЫ
        </a>
        <p style="font-size: 12px; color: #6c757d; margin-top: 15px;">Данная ссылка действительна в течение 30 дней</p>
    </div>
    {{/if}}

    <p>В случае неисполнения данного требования оставляю за собой право обратиться в <strong>Федеральную службу по надзору в сфере связи, информационных технологий и массовых коммуникаций (Роскомнадзор)</strong> для защиты моих прав как субъекта персональных данных.</p>

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
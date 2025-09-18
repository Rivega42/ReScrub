import crypto from 'crypto';

// Robokassa configuration
const ROBOKASSA_MERCHANT_LOGIN = process.env.ROBOKASSA_MERCHANT_LOGIN;
const ROBOKASSA_PASSWORD_1 = process.env.ROBOKASSA_PASSWORD_1;
const ROBOKASSA_PASSWORD_2 = process.env.ROBOKASSA_PASSWORD_2;
const ROBOKASSA_TEST_MODE = process.env.ROBOKASSA_TEST_MODE === 'true';

// Base URLs for Robokassa API
const ROBOKASSA_BASE_URL = ROBOKASSA_TEST_MODE 
  ? 'https://auth.robokassa.ru/Merchant/Index.aspx'
  : 'https://auth.robokassa.ru/Merchant/Index.aspx';

const ROBOKASSA_RECURRING_URL = ROBOKASSA_TEST_MODE
  ? 'https://auth.robokassa.ru/Merchant/Recurring'
  : 'https://auth.robokassa.ru/Merchant/Recurring';

export interface RobokassaPaymentParams {
  merchantLogin: string;
  invoiceId: string;
  outSum: number;
  description: string;
  signatureValue: string;
  recurring?: boolean;
  previousInvoiceId?: string;
  email?: string;
  culture?: 'ru' | 'en';
  encoding?: 'utf-8';
}

export interface CreatePaymentUrlParams {
  invoiceId: string;
  amount: number; // в рублях
  description: string;
  userEmail?: string;
  isRecurring?: boolean;
  previousInvoiceId?: string;
}

export interface WebhookData {
  OutSum: string;
  InvId: string;
  SignatureValue: string;
  PaymentMethod?: string;
  [key: string]: any;
}

/**
 * Robokassa API Client для работы с платежами и подписками
 */
export class RobokassaClient {
  private merchantLogin: string;
  private password1: string;
  private password2: string;
  private isTestMode: boolean;

  constructor(
    merchantLogin: string = ROBOKASSA_MERCHANT_LOGIN || '',
    password1: string = ROBOKASSA_PASSWORD_1 || '',
    password2: string = ROBOKASSA_PASSWORD_2 || '',
    testMode: boolean = ROBOKASSA_TEST_MODE
  ) {
    if (!merchantLogin || !password1 || !password2) {
      throw new Error('Robokassa credentials are not configured properly');
    }

    this.merchantLogin = merchantLogin;
    this.password1 = password1;
    this.password2 = password2;
    this.isTestMode = testMode;
  }

  /**
   * Создание подписи для инициализации платежа (Password #1)
   */
  private createInitSignature(merchantLogin: string, outSum: string, invoiceId: string, additionalParams: Record<string, string> = {}): string {
    // Сортируем дополнительные параметры по ключам
    const sortedParams = Object.keys(additionalParams)
      .sort()
      .map(key => `${key}=${additionalParams[key]}`)
      .join(':');

    // Формируем строку для подписи: MerchantLogin:OutSum:InvoiceID:Password#1[:дополнительные параметры]
    let signatureString = `${merchantLogin}:${outSum}:${invoiceId}:${this.password1}`;
    
    if (sortedParams) {
      signatureString += `:${sortedParams}`;
    }

    return crypto.createHash('md5').update(signatureString).digest('hex').toLowerCase();
  }

  /**
   * Проверка подписи результата платежа (Password #2)
   */
  public verifyResultSignature(outSum: string, invoiceId: string, signatureValue: string): boolean {
    const expectedSignature = crypto
      .createHash('md5')
      .update(`${outSum}:${invoiceId}:${this.password2}`)
      .digest('hex')
      .toLowerCase();

    return expectedSignature === signatureValue.toLowerCase();
  }

  /**
   * Создание URL для оплаты (материнский платеж для подписки)
   */
  public createPaymentUrl(params: CreatePaymentUrlParams): string {
    const {
      invoiceId,
      amount,
      description,
      userEmail,
      isRecurring = false
    } = params;

    // Конвертируем рубли в копейки для Robokassa
    const outSum = (amount * 100).toString();

    // Дополнительные параметры
    const additionalParams: Record<string, string> = {};
    if (userEmail) {
      additionalParams['Email'] = userEmail;
    }

    // Создаем подпись
    const signature = this.createInitSignature(
      this.merchantLogin,
      outSum,
      invoiceId,
      additionalParams
    );

    // Формируем URL с параметрами
    const urlParams = new URLSearchParams({
      MerchantLogin: this.merchantLogin,
      OutSum: outSum,
      InvoiceID: invoiceId,
      Description: description,
      SignatureValue: signature,
      Culture: 'ru',
      Encoding: 'utf-8'
    });

    // Добавляем дополнительные параметры
    Object.entries(additionalParams).forEach(([key, value]) => {
      urlParams.append(key, value);
    });

    // Добавляем параметр Recurring для подписок
    if (isRecurring) {
      urlParams.append('Recurring', 'true');
    }

    return `${ROBOKASSA_BASE_URL}?${urlParams.toString()}`;
  }

  /**
   * Создание периодического платежа (дочерний платеж)
   */
  public async createRecurringPayment(params: {
    invoiceId: string;
    previousInvoiceId: string;
    amount: number;
    description: string;
  }): Promise<{ success: boolean; invoiceId?: string; error?: string }> {
    const { invoiceId, previousInvoiceId, amount, description } = params;

    // Конвертируем рубли в копейки
    const outSum = (amount * 100).toString();

    // Создаем подпись (без PreviousInvoiceID!)
    const signature = this.createInitSignature(
      this.merchantLogin,
      outSum,
      invoiceId
    );

    // Формируем данные для POST запроса
    const formData = new URLSearchParams({
      MerchantLogin: this.merchantLogin,
      OutSum: outSum,
      InvoiceID: invoiceId,
      PreviousInvoiceID: previousInvoiceId,
      Description: description,
      SignatureValue: signature
    });

    try {
      const response = await fetch(ROBOKASSA_RECURRING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'ResCrub/1.0'
        },
        body: formData.toString()
      });

      const responseText = await response.text();

      // Проверяем ответ Robokassa
      if (responseText.includes('OK')) {
        // Формат ответа: "OK+InvoiceId" или просто "OK"
        const match = responseText.match(/OK\+(\d+)/);
        const returnedInvoiceId = match ? match[1] : invoiceId;

        return {
          success: true,
          invoiceId: returnedInvoiceId
        };
      } else {
        // Ошибка от Robokassa
        return {
          success: false,
          error: `Robokassa error: ${responseText}`
        };
      }
    } catch (error: any) {
      console.error('Recurring payment request failed:', error);
      return {
        success: false,
        error: `Network error: ${error.message}`
      };
    }
  }

  /**
   * Проверка валидности webhook данных от Robokassa
   */
  public validateWebhook(data: WebhookData): boolean {
    const { OutSum, InvId, SignatureValue } = data;
    
    if (!OutSum || !InvId || !SignatureValue) {
      return false;
    }

    return this.verifyResultSignature(OutSum, InvId, SignatureValue);
  }

  /**
   * Парсинг данных webhook от Robokassa
   */
  public parseWebhookData(data: any): {
    invoiceId: string;
    amount: number; // в рублях
    paymentMethod?: string;
    isValid: boolean;
  } | null {
    try {
      const { OutSum, InvId, PaymentMethod, SignatureValue } = data;

      if (!OutSum || !InvId || !SignatureValue) {
        return null;
      }

      const isValid = this.verifyResultSignature(OutSum, InvId, SignatureValue);

      return {
        invoiceId: InvId.toString(),
        amount: parseFloat(OutSum) / 100, // конвертируем копейки в рубли
        paymentMethod: PaymentMethod,
        isValid
      };
    } catch (error) {
      console.error('Error parsing webhook data:', error);
      return null;
    }
  }

  /**
   * Получение тестовых параметров для разработки
   */
  public getTestModeInfo(): {
    isTestMode: boolean;
    merchantLogin: string;
    baseUrl: string;
    recurringUrl: string;
  } {
    return {
      isTestMode: this.isTestMode,
      merchantLogin: this.merchantLogin,
      baseUrl: ROBOKASSA_BASE_URL,
      recurringUrl: ROBOKASSA_RECURRING_URL
    };
  }
}

// Экспортируем инстанс клиента
export const robokassaClient = new RobokassaClient();

// Утилиты для работы с суммами
export const formatAmount = (rubles: number): string => {
  return rubles.toFixed(2);
};

export const formatCurrency = (amount: number, currency: string = 'RUB'): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency
  }).format(amount);
};
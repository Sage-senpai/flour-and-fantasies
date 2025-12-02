interface PaystackConfig {
  secretKey: string;
}

class PaystackAPI {
  private secretKey: string;
  private baseUrl = 'https://api.paystack.co';

  constructor(config: PaystackConfig) {
    this.secretKey = config.secretKey;
  }

  async initializeTransaction(data: {
    email: string;
    amount: number; // Amount in kobo (NGN)
    callback_url: string;
    metadata?: any;
  }) {
    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async verifyTransaction(reference: string) {
    const response = await fetch(
      `${this.baseUrl}/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      }
    );

    return response.json();
  }
}

if (!process.env.PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY is not defined');
}

export const paystack = new PaystackAPI({
  secretKey: process.env.PAYSTACK_SECRET_KEY,
});
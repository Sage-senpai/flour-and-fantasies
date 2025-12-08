import type { PaystackInitResponse, PaystackVerifyResponse } from '@/types';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

if (!PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY is not defined in environment variables');
}

export async function initializePayment(
  email: string,
  amount: number,
  orderId: string
): Promise<PaystackInitResponse> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Convert to kobo
      reference: orderId,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to initialize payment');
  }

  const data: PaystackInitResponse = await response.json();
  return data;
}

export async function verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to verify payment');
  }

  const data: PaystackVerifyResponse = await response.json();
  return data;
}

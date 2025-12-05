import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle successful payment
    if (event.event === 'charge.success') {
      const { metadata } = event.data;
      const orderId = metadata?.orderId;
      const creditsEarned = metadata?.creditsEarned || 0;

      if (orderId) {
        // Update order status
        const order = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PROCESSING' },
          include: { items: true },
        });

        // Update product stock
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Add coupon credits to user wallet
        if (creditsEarned > 0) {
          await prisma.user.update({
            where: { id: order.userId },
            data: {
              walletBalance: { increment: creditsEarned },
              transactions: {
                create: {
                  amount: creditsEarned,
                  type: 'EARNED',
                  description: `Earned ₦${creditsEarned.toFixed(2)} from order #${order.id.slice(0, 8)}`,
                  orderId: order.id,
                },
              },
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
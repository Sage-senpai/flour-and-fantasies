import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { paystack } from '@/lib/paystack';
import { prisma } from '@/lib/prisma';

const COUPON_RATE = 10000; // Every ₦10,000 earns credits
const CREDIT_MIN = 300; // Minimum credit earned
const CREDIT_MAX = 500; // Maximum credit earned

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { items, useCoupons } = body; // useCoupons is array of productIds to use coupons for

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Get user wallet balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { walletBalance: true },
    });

    let totalUSD = 0;
    let couponUsedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const useCoupon = useCoupons?.includes(item.productId) && product.couponEligible;

      if (useCoupon && product.couponPrice) {
        const couponCost = product.couponPrice * item.quantity;
        
        if (user!.walletBalance < couponCost) {
          return NextResponse.json(
            { error: `Insufficient coupon balance for ${product.name}` },
            { status: 400 }
          );
        }

        couponUsedTotal += couponCost;
        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: 0, // Paid with coupons
          paidWithCoupon: true,
        });
      } else {
        totalUSD += product.price * item.quantity;
        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          paidWithCoupon: false,
        });
      }
    }

    // Convert USD to NGN
    const exchangeRate = 1650;
    const totalNGN = Math.round(totalUSD * exchangeRate);
    const amountInKobo = totalNGN * 100;

    // Calculate coupon credits to earn from this purchase
    const creditsEarned = Math.floor(totalNGN / COUPON_RATE) * 
      (CREDIT_MIN + Math.random() * (CREDIT_MAX - CREDIT_MIN));

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: totalUSD,
        couponUsed: couponUsedTotal,
        cashPaid: totalUSD,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
    });

    // Deduct coupon balance if used
    if (couponUsedTotal > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          walletBalance: { decrement: couponUsedTotal },
          transactions: {
            create: {
              amount: -couponUsedTotal,
              type: 'SPENT',
              description: `Used coupons for order #${order.id.slice(0, 8)}`,
              orderId: order.id,
            },
          },
        },
      });
    }

    // If total is 0 (all paid with coupons), mark as completed
    if (amountInKobo === 0) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PROCESSING' },
      });

      // Update stock
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?order_id=${order.id}`,
        couponOnly: true,
      });
    }

    // Initialize Paystack transaction
    const paystackResponse = await paystack.initializeTransaction({
      email: session.user.email!,
      amount: amountInKobo,
      callback_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?order_id=${order.id}&credits_earned=${creditsEarned}`,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
        creditsEarned,
        custom_fields: [
          {
            display_name: 'Order ID',
            variable_name: 'order_id',
            value: order.id,
          },
        ],
      },
    });

    if (!paystackResponse.status) {
      return NextResponse.json(
        { error: 'Failed to initialize payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: paystackResponse.data.authorization_url,
      reference: paystackResponse.data.reference,
    });
  } catch (error) {
    console.error('POST /api/checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
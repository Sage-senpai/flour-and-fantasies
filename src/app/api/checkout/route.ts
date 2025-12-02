import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { paystack } from '@/lib/paystack';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Calculate total
    let totalUSD = 0;
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

      totalUSD += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Convert USD to NGN (Nigerian Naira)
    const exchangeRate = 1650; // Update with current rate or use an API
    const totalNGN = Math.round(totalUSD * exchangeRate);
    const amountInKobo = totalNGN * 100; // Paystack uses kobo

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: totalUSD,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
    });

    // Initialize Paystack transaction
    const paystackResponse = await paystack.initializeTransaction({
      email: session.user.email!,
      amount: amountInKobo,
      callback_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?order_id=${order.id}`,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
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
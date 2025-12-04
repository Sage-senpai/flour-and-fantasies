import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET wallet balance and transactions
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        walletBalance: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET /api/wallet error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet data' },
      { status: 500 }
    );
  }
}

// POST - Add credits (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, amount, description } = await req.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        walletBalance: { increment: amount },
        transactions: {
          create: {
            amount,
            type: 'BONUS',
            description: description || 'Admin bonus',
          },
        },
      },
      include: { transactions: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('POST /api/wallet error:', error);
    return NextResponse.json(
      { error: 'Failed to add credits' },
      { status: 500 }
    );
  }
}
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/utils/formatPrice';
import styles from './account.module.scss';

async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return orders;
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/account');
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className={styles.account}>
      <div className="container">
        <div className={styles.header}>
          <h1>My Account</h1>
          <p>Welcome back, {session.user.name}!</p>
        </div>

        <div className={styles.content}>
          <div className={styles.info}>
            <h2>Account Information</h2>
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Name:</span>
                <span className={styles.value}>{session.user.name}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{session.user.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Role:</span>
                <span className={styles.value}>{session.user.role}</span>
              </div>
            </div>
          </div>

          <div className={styles.orders}>
            <h2>Order History</h2>
            
            {orders.length === 0 ? (
              <div className={styles.noOrders}>
                <p>You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} className={styles.order}>
                    <div className={styles.orderHeader}>
                      <div>
                        <span className={styles.orderId}>Order #{order.id.slice(0, 8)}</span>
                        <span className={styles.orderDate}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className={styles.orderItems}>
                      {order.items.map((item) => (
                        <div key={item.id} className={styles.orderItem}>
                          <span>{item.product.name}</span>
                          <span>× {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.orderTotal}>
                      <span>Total:</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
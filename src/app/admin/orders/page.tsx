import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/utils/formatPrice';
import styles from './orders.module.scss';

async function getAllOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return orders;
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className={styles.orders}>
      <div className={styles.header}>
        <h1>Orders Management</h1>
        <p>Total Orders: {orders.length}</p>
      </div>

      <div className={styles.ordersTable}>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id.slice(0, 8)}</td>
                <td>{order.user.name}</td>
                <td>{order.user.email}</td>
                <td>{order.items.length} items</td>
                <td>{formatPrice(order.total)}</td>
                <td>
                  <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link href={`/admin/orders/${order.id}`} className={styles.viewButton}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
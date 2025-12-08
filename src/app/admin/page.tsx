import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/utils/formatPrice';
import type { OrderWithRelations } from '@/types';
import styles from './dashboard.module.scss';

async function getDashboardData() {
  const [orders, products, totalRevenue, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'COMPLETED' },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
    }),
  ]);

  return {
    totalOrders: orders,
    totalProducts: products,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Total Orders</span>
            <span className={styles.statValue}>{data.totalOrders}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🧁</div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Products</span>
            <span className={styles.statValue}>{data.totalProducts}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Total Revenue</span>
            <span className={styles.statValue}>
              {formatPrice(data.totalRevenue)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.recentOrders}>
        <h2>Recent Orders</h2>
        <div className={styles.ordersTable}>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
             {recentOrders.map((order: OrderWithRelations) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}</td>
                  <td>{order.user.name}</td>
                  <td>{order.items.length} items</td>
                  <td>{formatPrice(order.total)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
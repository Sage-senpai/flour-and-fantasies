import { protectAdmin } from '@/utils/protectAdmin';
import Link from 'next/link';
import styles from './admin.module.scss';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await protectAdmin();

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            📊 Dashboard
          </Link>
          <Link href="/admin/orders" className={styles.navLink}>
            📦 Orders
          </Link>
          <Link href="/admin/products" className={styles.navLink}>
            🧁 Products
          </Link>
        </nav>
      </aside>
      
      <main className={styles.main}>{children}</main>
    </div>
  );
}
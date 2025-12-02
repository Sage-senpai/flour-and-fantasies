'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCart, selectCartCount } from '@/features/cart/cartSlice';
import styles from './Navigation.module.scss';

export default function Navigation() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={styles.nav}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🧁</span>
          <span className={styles.logoText}>Flour & Fantasies </span>
        </Link>

        <div className={styles.menu}>
          <Link href="/menu" className={styles.menuItem}>
            Menu
          </Link>
          {session?.user.role === 'ADMIN' && (
            <Link href="/admin" className={styles.menuItem}>
              Admin
            </Link>
          )}
          {session ? (
            <>
              <Link href="/account" className={styles.menuItem}>
                Account
              </Link>
              <button
                onClick={() => signOut()}
                className={styles.menuItem}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className={styles.menuItem}>
              Sign In
            </Link>
          )}
          
          <button
            onClick={() => dispatch(toggleCart())}
            className={styles.cartButton}
          >
            🛍️
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
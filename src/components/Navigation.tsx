// src/components/Navigation.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { toggleCart, selectCartCount } from '@/features/cart/cartSlice';
import styles from './Navigation.module.scss';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [10, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  const navItemVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      style={{
        opacity: navOpacity,
        backdropFilter: `blur(${navBlur}px)`,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <motion.span
            className={styles.logoIcon}
            animate={{
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            🧁
          </motion.span>
          <span className={styles.logoText}>
            <span className={styles.logoMain}>Flour & Fantasies</span>
            <span className={styles.logoSub}>Bakery</span>
          </span>
        </Link>

        <div className={styles.menu}>
          <motion.div
            variants={navItemVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            <Link 
              href="/menu" 
              className={`${styles.menuItem} ${isActive('/menu') ? styles.active : ''}`}
            >
              <span className={styles.menuIcon}>🍰</span>
              <span>Menu</span>
              {isActive('/menu') && (
                <motion.div
                  className={styles.activeIndicator}
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>

          {session?.user.role === 'ADMIN' && (
            <motion.div
              variants={navItemVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <Link 
                href="/admin" 
                className={`${styles.menuItem} ${isActive('/admin') ? styles.active : ''}`}
              >
                <span className={styles.menuIcon}>👨‍💼</span>
                <span>Admin</span>
                {isActive('/admin') && (
                  <motion.div
                    className={styles.activeIndicator}
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          )}

          {session ? (
            <>
              <motion.div
                variants={navItemVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
              >
                <Link 
                  href="/account" 
                  className={`${styles.menuItem} ${isActive('/account') ? styles.active : ''}`}
                >
                  <span className={styles.menuIcon}>👤</span>
                  <span>Account</span>
                  {isActive('/account') && (
                    <motion.div
                      className={styles.activeIndicator}
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
              <motion.button
                variants={navItemVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                onClick={() => signOut()}
                className={styles.menuItem}
              >
                <span className={styles.menuIcon}>🚪</span>
                <span>Sign Out</span>
              </motion.button>
            </>
          ) : (
            <motion.div
              variants={navItemVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <Link 
                href="/auth/signin" 
                className={`${styles.menuItem} ${isActive('/auth/signin') ? styles.active : ''}`}
              >
                <span className={styles.menuIcon}>🔐</span>
                <span>Sign In</span>
                {isActive('/auth/signin') && (
                  <motion.div
                    className={styles.activeIndicator}
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          )}
          
          <motion.button
            onClick={() => dispatch(toggleCart())}
            className={styles.cartButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{
                rotate: cartCount > 0 ? [0, -10, 10, -10, 0] : 0,
              }}
              transition={{
                duration: 0.5,
                repeat: cartCount > 0 ? Infinity : 0,
                repeatDelay: 2,
              }}
            >
              🛍️
            </motion.span>
            {cartCount > 0 && (
              <motion.span
                className={styles.cartBadge}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <motion.span
                  key={cartCount}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {cartCount}
                </motion.span>
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Animated border */}
      <motion.div
        className={styles.borderGradient}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.nav>
  );
}
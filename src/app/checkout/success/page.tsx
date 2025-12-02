'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/features/cart/cartSlice';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import styles from './success.module.scss';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const reference = searchParams.get('reference');

    if (orderId) {
      // Clear cart
      dispatch(clearCart());
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [searchParams, dispatch]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.card}
        >
          <div className={styles.icon}>❌</div>
          <h1>Payment Failed</h1>
          <p>Something went wrong with your payment.</p>
          <Button onClick={() => router.push('/menu')}>
            Back to Menu
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.card}
      >
        <div className={styles.icon}>✅</div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order is being processed.</p>
        <div className={styles.buttons}>
          <Button onClick={() => router.push('/account')}>
            View Orders
          </Button>
          <Button variant="outline" onClick={() => router.push('/menu')}>
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
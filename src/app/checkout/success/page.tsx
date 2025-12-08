'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import styles from './success.module.scss';

export default function CheckoutSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const reference = searchParams.get('reference');

  useEffect(() => {
    let isMounted = true;

    const verifyPayment = async () => {
      if (!reference) {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`/api/verify-payment?reference=${reference}`);
        const data = await response.json();

        if (!isMounted) return;

        if (data.success) {
          toast.success('✅ Payment successful! Order confirmed.');
          clearCart();
        } else {
          setError(true);
          toast.error('❌ Payment verification failed. Please contact support.');
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
          toast.error('❌ An error occurred. Please contact support.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [reference, clearCart]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>Payment Failed</h1>
          <p>We couldn&apos;t verify your payment. Please contact support with reference: {reference}</p>
          <button onClick={() => router.push('/checkout')}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.success}>
        <div className={styles.checkmark}>✓</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your order. Your payment has been confirmed.</p>
        <p className={styles.reference}>Reference: {reference}</p>
        <button onClick={() => router.push('/account')}>View Orders</button>
        <button onClick={() => router.push('/menu')}>
            Continue Shopping
          </button>
      </div>
    </div>
  );
}
          
       
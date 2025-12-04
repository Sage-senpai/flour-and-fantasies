'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import styles from './WalletCard.module.scss';

interface WalletData {
  walletBalance: number;
  transactions: Array<{
    id: string;
    amount: number;
    type: 'EARNED' | 'SPENT' | 'BONUS';
    description: string;
    createdAt: string;
  }>;
}

export default function WalletCard() {
  const { data: session } = useSession();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    async function fetchWallet() {
      try {
        const res = await fetch('/api/wallet');
        const data = await res.json();
        setWallet(data);
      } catch (error) {
        console.error('Failed to fetch wallet:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWallet();
  }, [session]);

  if (!session || loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.walletCard}
    >
      <div className={styles.header}>
        <div className={styles.icon}>💰</div>
        <div className={styles.info}>
          <span className={styles.label}>Coupon Balance</span>
          <span className={styles.balance}>
            ₦{wallet?.walletBalance.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>

      <div className={styles.earnings}>
        <p className={styles.tip}>
          💡 Earn ₦300-500 in coupons for every ₦10,000 spent!
        </p>
      </div>

      {wallet?.transactions && wallet.transactions.length > 0 && (
        <div className={styles.transactions}>
          <h3>Recent Transactions</h3>
          {wallet.transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className={styles.transaction}>
              <div className={styles.transactionInfo}>
                <span className={styles.transactionDesc}>
                  {transaction.description}
                </span>
                <span className={styles.transactionDate}>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span
                className={`${styles.transactionAmount} ${
                  transaction.type === 'SPENT' ? styles.negative : styles.positive
                }`}
              >
                {transaction.type === 'SPENT' ? '-' : '+'}₦
                {Math.abs(transaction.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
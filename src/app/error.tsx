'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import styles from './error.module.scss';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.error}>
      <div className={styles.content}>
        <h1>🍰 Oops! Something went wrong</h1>
        <p>We&apos;re sorry, but something went wrong.</p>
        <div className={styles.actions}>
          <Button onClick={() => reset()}>Try Again</Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
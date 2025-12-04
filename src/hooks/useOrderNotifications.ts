'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export function useOrderNotifications() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    // Poll for order updates every 30 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/orders/notifications');
        const data = await res.json();

        if (data.newOrders && session.user.role === 'ADMIN') {
          toast.success(`${data.newOrders} new order(s) received! 🎉`, {
            duration: 6000,
          });
        }

        if (data.statusUpdates && session.user.role === 'USER') {
          data.statusUpdates.forEach((update: any) => {
            toast.success(`Your order #${update.id.slice(0, 8)} is now ${update.status}! 📦`, {
              duration: 6000,
            });
          });
        }
      } catch (error) {
        console.error('Notification polling error:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [session]);
}
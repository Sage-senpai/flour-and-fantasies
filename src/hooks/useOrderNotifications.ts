import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import type { OrderNotification } from '@/types';

// Pusher types
interface PusherChannel {
  bind: (event: string, callback: (data: OrderNotification) => void) => void;
  unbind_all: () => void;
  unsubscribe: () => void;
}

interface Pusher {
  subscribe: (channel: string) => PusherChannel;
}

declare global {
  interface Window {
    Pusher?: new (key: string, config: unknown) => Pusher;
  }
}

export function useOrderNotifications() {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);

  useEffect(() => {
    if (!window.Pusher) {
      console.warn('Pusher not loaded');
      return;
    }

    const pusher = new window.Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
    });

    const channel = pusher.subscribe('admin-orders');

    channel.bind('new-order', (data: OrderNotification) => {
      setNotifications((prev) => [data, ...prev]);
      toast.success('🔔 New order received!');
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return { notifications };
}
'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/formatPrice';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import styles from './orderDetail.module.scss';

interface OrderDetail {
  id: string;
  userId: string;
  status: string;
  total: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      image: string;
    };
  }>;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${resolvedParams.id}`);
        if (!res.ok) throw new Error('Order not found');
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error(error);
        toast.error('Order not found');
        router.push('/admin/orders');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [resolvedParams.id, router]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    const loadingToast = toast.loading('Updating order status...');
    
    try {
      const res = await fetch(`/api/orders/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update');

      const updated = await res.json();
      setOrder(updated);
      
      toast.dismiss(loadingToast);
      toast.success(`Order status updated to ${newStatus}! 📦`);
      
      // Send notification to customer
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: updated.userId,
          message: `Your order #${updated.id.slice(0, 8)} status has been updated to ${newStatus}`,
          type: 'order_update',
        }),
      });
    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;
  if (!order) return null;

  return (
    <div className={styles.orderDetail}>
      <Button variant="outline" onClick={() => router.back()}>
        ← Back to Orders
      </Button>

      <div className={styles.header}>
        <div>
          <h1>Order #{order.id.slice(0, 8)}</h1>
          <p>{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
          {order.status}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Customer Information</h2>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span>Name:</span>
              <span>{order.user.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span>Email:</span>
              <span>{order.user.email}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Order Items</h2>
          <div className={styles.items}>
            {order.items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div>
                  <h3>{item.product.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <span className={styles.price}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className={styles.total}>
            <span>Total:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Update Status</h2>
          <div className={styles.statusButtons}>
            <Button
              onClick={() => updateStatus('PENDING')}
              disabled={updating || order.status === 'PENDING'}
              variant={order.status === 'PENDING' ? 'primary' : 'outline'}
            >
              Pending
            </Button>
            <Button
              onClick={() => updateStatus('PROCESSING')}
              disabled={updating || order.status === 'PROCESSING'}
              variant={order.status === 'PROCESSING' ? 'primary' : 'outline'}
            >
              Processing
            </Button>
            <Button
              onClick={() => updateStatus('COMPLETED')}
              disabled={updating || order.status === 'COMPLETED'}
              variant={order.status === 'COMPLETED' ? 'primary' : 'outline'}
            >
              Completed
            </Button>
            <Button
              onClick={() => updateStatus('CANCELLED')}
              disabled={updating || order.status === 'CANCELLED'}
              variant={order.status === 'CANCELLED' ? 'secondary' : 'outline'}
            >
              Cancelled
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
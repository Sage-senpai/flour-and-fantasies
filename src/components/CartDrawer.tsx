'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  selectCartOpen,
  setCartOpen,
  removeFromCart,
  updateQuantity,
} from '@/features/cart/cartSlice';
import { formatPrice } from '@/utils/formatPrice';
import Button from './ui/Button';
import styles from './CartDrawer.module.scss';

export default function CartDrawer() {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isOpen = useSelector(selectCartOpen);

  const handleClose = () => dispatch(setCartOpen(false));

  const handleCheckout = () => {
    handleClose();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.overlay}
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={styles.drawer}
          >
            <div className={styles.header}>
              <h2>Shopping Cart</h2>
              <button onClick={handleClose} className={styles.closeButton}>
                ×
              </button>
            </div>

            <div className={styles.items}>
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <p>Your cart is empty</p>
                  <Button onClick={handleClose}>Continue Shopping</Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className={styles.item}>
                    <div className={styles.itemImage}>
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className={styles.image}
                      />
                    </div>
                    
                    <div className={styles.itemDetails}>
                      <h3>{item.product.name}</h3>
                      <p className={styles.itemPrice}>
                        {formatPrice(item.product.price)}
                      </p>
                      
                      <div className={styles.quantity}>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.product.id,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            )
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.product.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => dispatch(removeFromCart(item.product.id))}
                      className={styles.removeButton}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.total}>
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Button onClick={handleCheckout} fullWidth>
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
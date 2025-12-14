// src/components/ProductCard.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '@/features/cart/cartSlice';
import { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import Button from './ui/Button';
import ProductImage from './ProductImage';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart! 🎂`, {
      icon: '🛍️',
      duration: 2000,
    });
  };

  return (
    <Link href={`/menu/${product.slug}`}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.6, 0.05, 0.01, 0.99] }}
        whileHover={{ y: -8 }}
      >
        <div className={styles.imageWrapper}>
          <motion.div
            className={styles.imageContainer}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>

          {product.couponEligible && (
            <motion.div
              className={styles.couponBadge}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              🎟️ Coupon
            </motion.div>
          )}
          
          {product.stock < 5 && product.stock > 0 && (
            <motion.div
              className={styles.badge}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ⚡ Limited
            </motion.div>
          )}

          {product.stock === 0 && (
            <div className={styles.outOfStockOverlay}>
              <span>Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className={styles.content}>
          <span className={styles.category}>{product.category}</span>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.description}>{product.description}</p>
          
          <div className={styles.footer}>
            <div className={styles.pricing}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.couponEligible && product.couponPrice && (
                <span className={styles.couponPrice}>
                  🎟️ ₦{product.couponPrice}
                </span>
              )}
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              variant="primary"
              size="sm"
            >
              {product.stock === 0 ? 'Sold Out' : 'Add'}
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
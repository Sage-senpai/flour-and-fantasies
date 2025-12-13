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

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart! 🎂`, {
      icon: '🛍️',
    });
  };

  return (
    <Link href={`/menu/${product.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        className={styles.card}
      >
        <div className={styles.imageWrapper}>
          <ProductImage
            src={product.image}
            alt={product.name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.couponEligible && (
            <div className={styles.couponBadge}>🎟️ Coupon</div>
          )}
          {product.stock < 5 && (
            <div className={styles.badge}>Limited Stock</div>
          )}
        </div>
        
        <div className={styles.content}>
          <span className={styles.category}>{product.category}</span>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.description}>{product.description}</p>
          
          <div className={styles.footer}>
            <div>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.couponEligible && product.couponPrice && (
                <span className={styles.couponPrice}>
                  🎟️ ₦{product.couponPrice}
                </span>
              )}
            </div>
            <Button
              onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                handleAddToCart();
              }}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
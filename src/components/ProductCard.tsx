'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart(product));
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
          {product.stock < 5 && (
            <div className={styles.badge}>Limited Stock</div>
          )}
        </div>
        
        <div className={styles.content}>
          <span className={styles.category}>{product.category}</span>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.description}>{product.description}</p>
          
          <div className={styles.footer}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            <Button onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
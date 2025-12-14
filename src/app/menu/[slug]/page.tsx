// src/app/menu/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { addToCart } from '@/features/cart/cartSlice';
import { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import styles from './product.module.scss';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        router.push('/menu');
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug, router]);

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    
    router.push('/menu');
  };

  if (loading) return <Loader />;
  if (!product) return null;

  return (
    <div className={styles.product}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.content}
        >
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={styles.image}
                priority
              />
            </div>
          </div>

          <div className={styles.details}>
            <span className={styles.category}>{product.category}</span>
            <h1>{product.name}</h1>
            <p className={styles.price}>{formatPrice(product.price)}</p>
            
            <div className={styles.description}>
              <p>{product.description}</p>
            </div>

            <div className={styles.stock}>
              {product.stock > 0 ? (
                <span className={styles.inStock}>
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className={styles.outOfStock}>Out of Stock</span>
              )}
            </div>

            <div className={styles.quantity}>
              <label>Quantity:</label>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                fullWidth
                size="lg"
              >
                Add to Cart
              </Button>
              <Button variant="outline" onClick={() => router.back()} fullWidth size="lg">
                Continue Shopping
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
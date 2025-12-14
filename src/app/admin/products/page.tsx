// src/app/admin/products/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/utils/formatPrice';
import type { Product } from '@/types';
import styles from './products.module.scss';

async function getAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return products;
}

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className={styles.products}>
      <div className={styles.header}>
        <div>
          <h1>Products Management</h1>
          <p>Total Products: {products.length}</p>
        </div>
        <Link href="/admin/products/create" className={styles.addButton}>
          + Add New Product
        </Link>
      </div>

      <div className={styles.grid}>
        {products.map((product: Product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.imageWrapper}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={styles.image}
              />
            </div>
            <div className={styles.content}>
              <span className={styles.category}>{product.category}</span>
              <h3>{product.name}</h3>
              <p className={styles.price}>{formatPrice(product.price)}</p>
              <p className={styles.stock}>
                Stock: {product.stock} {product.stock < 5 && '⚠️ Low'}
              </p>
              <div className={styles.actions}>
                {/* Use slug instead of id */}
                <Link href={`/admin/products/${product.slug}`} className={styles.editButton}>
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
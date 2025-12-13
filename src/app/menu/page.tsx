import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import type { Category, Product } from '@/types';
import styles from './menu.module.scss';

export const revalidate = 1800;

// Fetch all products
async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return products;
}

export default async function MenuPage() {
  const products = await getProducts();

  // Generate unique categories
  const categoryNames = Array.from(new Set(products.map((p) => p.category)));

  // Convert to typed Category[]
  const categories: Category[] = categoryNames.map((name) => ({
    name,
    products: products.filter((p: Product) => p.category === name),
  }));

  return (
    <div className={styles.menu}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1>Our Menu</h1>
          <p>Explore our delightful collection of handcrafted treats</p>
        </div>

        {/* Render Categories */}
        {categories.map((category: Category) => (
          <section key={category.name} className={styles.category}>
            <h2>{category.name}</h2>

            <div className={styles.grid}>
              {category.products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import styles from './menu.module.scss';

export const revalidate = 1800;

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return products;
}

export default async function MenuPage() {
  const products = await getProducts();
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className={styles.menu}>
      <div className="container">
        <div className={styles.header}>
          <h1>Our Menu</h1>
          <p>Explore our delightful collection of handcrafted treats</p>
        </div>

        {categories.map((category) => {
          const categoryProducts = products.filter(p => p.category === category);
          
          return (
            <section key={category} className={styles.category}>
              <h2>{category}</h2>
              <div className={styles.grid}>
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
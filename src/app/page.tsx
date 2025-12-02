import AnimatedHero from '@/components/AnimatedHero';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';
import styles from './page.module.scss';

export const revalidate = 3600; // Revalidate every hour

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
  });
  return products;
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className={styles.home}>
      <AnimatedHero />

      <section className={styles.featured}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Featured Delights</h2>
            <p>Discover our most beloved creations</p>
          </div>

          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.about}>
        <div className="container">
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <h2>Our Story</h2>
              <p>
                Flour & Fantasies was born from a passion for creating beautiful, 
                delicious pastries that bring joy to every celebration. Each creation 
                is handcrafted with premium ingredients and baked fresh daily.
              </p>
              <p>
                From ethereal wedding cakes to delicate French macarons, we pour our 
                hearts into every single item that leaves our kitchen.
              </p>
            </div>
            <div className={styles.aboutImage}>
              <div className={styles.imageCircle}>🎂</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
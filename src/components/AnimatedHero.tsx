'use client';

import { motion } from 'framer-motion';
import Button from './ui/Button';
import { useRouter } from 'next/navigation';
import styles from './AnimatedHero.module.scss';

export default function AnimatedHero() {
  const router = useRouter();

  return (
    <section className={styles.hero}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.content}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={styles.title}
        >
           Let our treats Floor you
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className={styles.subtitle}
        >
          Handcrafted cakes and pastries made with love and the finest ingredients
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className={styles.buttons}
        >
          <Button onClick={() => router.push('/menu')}>
            Explore Menu
          </Button>
          <Button variant="outline" onClick={() => router.push('/about')}>
            Our Story
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div
        className={styles.floatingElement}
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🎂
      </motion.div>
    </section>
  );
}
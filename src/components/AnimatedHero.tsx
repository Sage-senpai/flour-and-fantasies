// src/components/AnimatedHero.tsx
'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';
import styles from './AnimatedHero.module.scss';

export default function AnimatedHero() {
  const router = useRouter();

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className={styles.badge}>
            <span className={styles.badgeIcon}>✨</span>
            <span>Handcrafted Daily</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className={styles.title}
          >
            Let our treats{' '}
            <motion.span
              className={styles.highlight}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            >
              Floor
            </motion.span>{' '}
            you
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className={styles.subtitle}
          >
            Handcrafted cakes and pastries made with love and the finest ingredients.
            <br />
            <span className={styles.subtext}>Delivered fresh to your door.</span>
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className={styles.buttons}
          >
            <Button onClick={() => router.push('/menu')} size="lg">
              <span>Explore Menu</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Button>
            <Button variant="outline" onClick={() => router.push('/about')} size="lg">
              Our Story
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={styles.stats}
          >
            <div className={styles.stat}>
              <motion.span
                className={styles.statNumber}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                31
              </motion.span>
              <span className={styles.statLabel}>Recipes</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <motion.span
                className={styles.statNumber}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                80
              </motion.span>
              <span className={styles.statLabel}>Happy Customers</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <motion.span
                className={styles.statNumber}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                100%
              </motion.span>
              <span className={styles.statLabel}>Fresh</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div
        className={styles.floatingElement}
        variants={floatingVariants}
        animate="animate"
      >
        🎂
      </motion.div>

      <motion.div
        className={styles.floatingElement2}
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '1s' }}
      >
        🧁
      </motion.div>

      <motion.div
        className={styles.floatingElement3}
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
      >
        🍰
      </motion.div>

      {/* Animated background elements */}
      <div className={styles.backgroundShapes}>
        <motion.div
          className={styles.shape1}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className={styles.shape2}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </section>
  );
}
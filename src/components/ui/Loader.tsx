'use client';

import { motion } from 'framer-motion';
import styles from './Loader.module.scss';

export default function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <motion.div
        className={styles.loader}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
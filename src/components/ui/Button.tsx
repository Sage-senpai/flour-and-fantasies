// src/components/ui/Button.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.scss';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  onClick,
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick && !disabled && !loading) {
      onClick(e);
    }
  };

  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={classes}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading ? (
        <span className={styles.loading}>
          <span className={styles.spinner} />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
// src/components/ui/Input.tsx
'use client';

import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  step?: string | number;
}

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = false,
  disabled = false,
  className = '',
  step,
  ...rest
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      disabled={disabled}
      step={step}
      className={`${styles.input} ${className}`}
      {...rest}
    />
  );
}
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function ProductImage({ src, alt, fill, className, sizes, priority }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => {
        // Fallback to placeholder
        setImgSrc('https://placehold.co/600x400/F7C6D6/5B3A29?text=' + encodeURIComponent(alt));
      }}
    />
  );
}
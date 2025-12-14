// src/components/ImageUpload.tsx
'use client';

import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import toast from 'react-hot-toast';
import Image from 'next/image';
import styles from './ImageUpload.module.scss';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  return (
    <div className={styles.upload}>
      {value && (
        <div className={styles.preview}>
          <Image 
            src={value} 
            alt="Upload preview" 
            fill
            className={styles.image}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className={styles.removeButton}
          >
            ✕ Remove
          </button>
        </div>
      )}
      
      <UploadButton<OurFileRouter, 'productImage'>
        endpoint="productImage"
        onClientUploadComplete={(res) => {
          if (res && res[0]) {
            onChange(res[0].url);
            toast.success('Image uploaded successfully! 📸');
          }
        }}
        onUploadError={(error: Error) => {
          console.error('Upload error:', error);
          toast.error(`Upload failed: ${error.message}`);
        }}
        appearance={{
          button: {
            background: 'linear-gradient(135deg, #F7C6D6, #FFEAF0)',
            color: '#5B3A29',
            fontWeight: '600',
            fontSize: '0.9375rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            transition: 'all 0.3s ease',
            border: '2px solid #F7C6D6',
          },
          container: {
            marginTop: '1rem',
          },
          allowedContent: {
            color: '#8B6F5B',
            fontSize: '0.875rem',
          },
        }}
      />
    </div>
  );
}
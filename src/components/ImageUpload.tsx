'use client';

import { UploadButton } from '@uploadthing/react';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import toast from 'react-hot-toast';
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
          <img src={value} alt="Upload preview" />
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
          toast.error(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  );
}
'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#FFFFFF',
          color: '#5B3A29',
          padding: '16px',
          borderRadius: '12px',
          border: '2px solid #F7C6D6',
          boxShadow: '0 8px 32px rgba(247, 198, 214, 0.3)',
        },
        success: {
          iconTheme: {
            primary: '#5B3A29',
            secondary: '#F7C6D6',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
}
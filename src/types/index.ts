// src/types/index.ts
import { Prisma } from '@prisma/client';

// ============================================
// USER TYPES
// ============================================
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  walletBalance: number;
}

// ============================================
// PRODUCT TYPES (Using Prisma-generated types)
// ============================================
export type Product = Prisma.ProductGetPayload<Record<string, never>>;

// Category with products
export interface Category {
  name: string;
  products: Product[];
}

// ============================================
// CART TYPES
// ============================================
export interface CartItem {
  product: Product;
  quantity: number;
  useCoupon?: boolean; // Whether to use coupon for this item
}

// ============================================
// ORDER TYPES
// ============================================
export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  total: number;
  couponUsed: number;
  cashPaid: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  paidWithCoupon: boolean;
}

// Order with full relations (Prisma type)
export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: true;
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

// ============================================
// WALLET TYPES
// ============================================
export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'EARNED' | 'SPENT' | 'BONUS';
  description: string;
  orderId: string | null;
  createdAt: Date;
}

// ============================================
// UI COMPONENT TYPES
// ============================================
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  step?: string | number;
}

// ============================================
// PAYSTACK TYPES
// ============================================
export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    customer: {
      email: string;
    };
  };
}

// ============================================
// NOTIFICATION TYPES
// ============================================
export interface OrderNotification {
  id: string;
  type: 'new_order' | 'status_update';
  orderId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
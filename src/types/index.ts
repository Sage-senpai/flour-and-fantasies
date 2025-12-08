export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  walletBalance: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  couponEligible: boolean;
  couponPrice: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  useCoupon?: boolean; // Whether to use coupon for this item
}

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

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'EARNED' | 'SPENT' | 'BONUS';
  description: string;
  orderId: string | null;
  createdAt: Date;
}


import { Prisma } from '@prisma/client';

// Order with full relations
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

// Product type (use Prisma-generated type)
export type Product = Prisma.ProductGetPayload<{}>;

// Category with products
export interface Category {
  name: string;
  products: Product[];
}

// Button Props - supporting both signatures
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

// Input Props with step
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  step?: string | number;
}

// Paystack types
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

// Order notification
export interface OrderNotification {
  id: string;
  type: 'new_order' | 'status_update';
  orderId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
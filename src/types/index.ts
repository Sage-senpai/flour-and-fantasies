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
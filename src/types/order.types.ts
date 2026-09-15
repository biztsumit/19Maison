import type { Product, ProductVariant } from './product.types';

export type OrderStatus =
  | 'PENDING'
  | 'RESERVED'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED'
  // legacy lowercase kept for older API responses
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'COMPLETED';

export type PaymentMethod = 'RAZORPAY' | 'CASH_ON_DELIVERY' | 'card' | 'upi' | 'netbanking' | 'cod' | 'wallet';

export interface OrderAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  sellerId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: OrderAddress;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  couponCode?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemRequest {
  variantId: string;
  quantity: number;
  fulfillmentType: 'WAREHOUSE' | 'STORE';
  warehouseId?: string;
  storeId?: string;
}

export interface CreateOrderRequest {
  addressId?: string;
  items: OrderItemRequest[];
  notes?: string;
}

// Step 2 — initiate payment
export interface InitiatePaymentRequest {
  orderId: string;
  method?: 'RAZORPAY' | 'CASH_ON_DELIVERY';
}

export interface RazorpayInitiateResponse {
  razorpayOrderId: string;
  amount: number;        // in paise
  currency: string;
  paymentId: string;
  keyId: string;
}

// Step 4 — verify payment
export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  orderId: string;
  status: string;
}

// Created order (minimal — Step 1 response)
export interface CreatedOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  trackingNumber?: string;
  trackingUrl?: string;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  total: number;
  isLoading: boolean;
  error: string | null;
}

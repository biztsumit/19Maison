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

export type PaymentMethod =
  | 'RAZORPAY'
  | 'CASH_ON_DELIVERY'
  | 'card'
  | 'upi'
  | 'netbanking'
  | 'cod'
  | 'wallet';

// The API returns the address flat, with `address` as the street line.
export interface OrderAddress {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

// Wire shape of an order line: flat, with no nested product or variant object.
export interface ApiOrderItem {
  id?: string;
  brandName?: string;
  modelNumber?: string;
  variantName?: string;
  quantity: number;
  totalPrice: number | string;
  variant?: { id?: string; imageUrl?: string };
}

// Wire shape of an order. Money fields carry an `Amount` suffix.
export interface ApiOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  source?: string;
  subtotal?: number | string;
  discountAmount?: number | string;
  taxAmount?: number | string;
  shippingAmount?: number | string;
  totalAmount?: number | string;
  items?: ApiOrderItem[];
  user?: { firstName?: string; lastName?: string; phone?: string };
  shippingAddress?: OrderAddress;
  payment?: { method?: string; status?: string };
  invoice?: { id?: string; invoiceNumber?: string; pdfUrl?: string };
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  brandName: string;
  modelNumber: string;
  variantName?: string;
  imageUrl?: string;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  source?: string;
  items: OrderItem[];
  customerName?: string;
  shippingAddress?: OrderAddress;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
  invoiceUrl?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

const num = (value: number | string | undefined): number =>
  typeof value === 'number' ? value : Number(value ?? 0) || 0;

export function mapApiOrderItem(item: ApiOrderItem, index: number): OrderItem {
  return {
    // The API does not return a line id; fall back to the index for list keys.
    id: item.id ?? String(index),
    brandName: item.brandName ?? '',
    modelNumber: item.modelNumber ?? '',
    variantName: item.variantName,
    imageUrl: item.variant?.imageUrl,
    quantity: item.quantity,
    totalPrice: num(item.totalPrice),
  };
}

export function mapApiOrder(api: ApiOrder): Order {
  const name = [api.user?.firstName, api.user?.lastName].filter(Boolean).join(' ').trim();
  return {
    id: api.id,
    orderNumber: api.orderNumber,
    status: api.status,
    source: api.source,
    items: (api.items ?? []).map(mapApiOrderItem),
    customerName: name || undefined,
    shippingAddress: api.shippingAddress,
    subtotal: num(api.subtotal),
    discount: num(api.discountAmount),
    tax: num(api.taxAmount),
    shipping: num(api.shippingAmount),
    total: num(api.totalAmount),
    paymentMethod: api.payment?.method,
    paymentStatus: api.payment?.status,
    invoiceUrl: api.invoice?.pdfUrl,
    trackingNumber: api.trackingNumber,
    trackingUrl: api.trackingUrl,
    estimatedDelivery: api.estimatedDelivery,
    notes: api.notes,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export interface OrderItemRequest {
  variantId: string;
  quantity: number;
  // Optional: the web client omits this on every order, so the server defaults it.
  fulfillmentType?: 'WAREHOUSE' | 'STORE';
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
  // Omitted for online payments, which is what the web client sends and what the
  // server defaults to. Sent explicitly for cash on delivery, which the backend
  // settles on this call with no verify step.
  method?: 'CASH_ON_DELIVERY';
}

// Populated for the Razorpay path only; a cash-on-delivery initiate settles the
// order server-side and returns no checkout details.
export interface RazorpayInitiateResponse {
  razorpayOrderId?: string;
  amount?: number; // in paise
  currency?: string;
  keyId?: string;
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

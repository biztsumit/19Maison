import type { OrderStatus } from '@/types/order.types';

// `OrderStatus` carries both the current uppercase values and a legacy lowercase
// set from an in-flight API migration. Screens must branch on the canonical form
// only, never on the raw string.
export type CanonicalOrderStatus =
  | 'PENDING'
  | 'RESERVED'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED';

const CANONICAL: readonly CanonicalOrderStatus[] = [
  'PENDING',
  'RESERVED',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
  'REFUNDED',
];

// The legacy set has no `paid`; `confirmed` is its closest equivalent.
const ALIASES: Record<string, CanonicalOrderStatus> = {
  CONFIRMED: 'PAID',
};

export function normalizeOrderStatus(
  status: OrderStatus | string | undefined | null,
): CanonicalOrderStatus {
  if (!status) return 'PENDING';
  const upper = String(status)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');
  const aliased = ALIASES[upper] ?? upper;
  return CANONICAL.includes(aliased as CanonicalOrderStatus)
    ? (aliased as CanonicalOrderStatus)
    : 'PENDING';
}

export const ORDER_STATUS_LABELS: Record<CanonicalOrderStatus, string> = {
  PENDING: 'Order Pending',
  RESERVED: 'Awaiting Payment',
  PAID: 'Order Paid',
  PROCESSING: 'Processing',
  SHIPPED: 'Order Dispatched',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Order Delivered',
  CANCELLED: 'Order Cancelled',
  RETURNED: 'Order Returned',
  REFUNDED: 'Refunded',
};

export type OrderStatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const TONES: Record<CanonicalOrderStatus, OrderStatusTone> = {
  PENDING: 'warning',
  RESERVED: 'warning',
  PAID: 'info',
  PROCESSING: 'info',
  SHIPPED: 'info',
  OUT_FOR_DELIVERY: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error',
  RETURNED: 'neutral',
  REFUNDED: 'neutral',
};

export const orderStatusLabel = (status: OrderStatus | string | undefined): string =>
  ORDER_STATUS_LABELS[normalizeOrderStatus(status)];

export const orderStatusTone = (status: OrderStatus | string | undefined): OrderStatusTone =>
  TONES[normalizeOrderStatus(status)];

// Cancelling after dispatch is not generally possible, so this deliberately
// differs from the web, which gates Cancel on SHIPPED.
export const canCancel = (status: OrderStatus | string | undefined): boolean =>
  ['PENDING', 'RESERVED', 'PAID', 'PROCESSING'].includes(normalizeOrderStatus(status));

export const canTrack = (status: OrderStatus | string | undefined): boolean =>
  ['SHIPPED', 'OUT_FOR_DELIVERY'].includes(normalizeOrderStatus(status));

export const canReturn = (status: OrderStatus | string | undefined): boolean =>
  normalizeOrderStatus(status) === 'DELIVERED';

export const canRate = (status: OrderStatus | string | undefined): boolean =>
  normalizeOrderStatus(status) === 'DELIVERED';

export const isTerminal = (status: OrderStatus | string | undefined): boolean =>
  ['DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'].includes(normalizeOrderStatus(status));

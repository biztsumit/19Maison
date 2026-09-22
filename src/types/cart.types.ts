import type { Product, ProductVariant } from './product.types';

// ── Internal UI types (what cart.tsx consumes) ────────────────────────────

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  couponCode?: string;
  couponDiscount?: number;
}

// ── API wire types (raw response from /cart) ──────────────────────────────
// The line item is FLAT: there is no nested `variant` or `variant.product`.
// `price` is the backend-computed LINE TOTAL (unit x quantity), not the unit price.

export interface ApiCartItem {
  id: string;
  variantId?: string;
  quantity: number;
  price: number;
  stock?: number;
  brandName?: string;
  modelNumber?: string;
  variantName?: string;
  colorCode?: string;
  imageUrl?: string;
}

export interface ApiCart {
  id?: string;
  userId?: string;
  subtotal: number;
  itemCount?: number;
  items: ApiCartItem[];
}

// ── Mapper: API → internal ────────────────────────────────────────────────

export function mapApiCartItem(item: ApiCartItem): CartItem {
  const lineTotal = item.price ?? 0;
  const quantity = item.quantity || 1;
  const title = item.modelNumber ?? item.variantName ?? '';
  const images = item.imageUrl
    ? [{ id: item.id, url: item.imageUrl, isPrimary: true, order: 0 }]
    : [];

  return {
    id: item.id,
    product: {
      id: '',
      name: title,
      // The cart payload carries no slug, so rows are not navigable.
      slug: '',
      brand: { id: '', name: item.brandName ?? '' },
      price: lineTotal / quantity,
      images,
      variants: [],
    },
    variant: {
      id: item.variantId ?? '',
      sku: '',
      size: undefined,
      frameColor: item.colorCode ?? item.variantName ?? '',
      lensColor: '',
      lensType: '',
      salePrice: lineTotal / quantity,
      inStock: (item.stock ?? 0) > 0,
      stock: item.stock,
      images,
    },
    quantity: item.quantity,
    unitPrice: lineTotal / quantity,
    totalPrice: lineTotal,
  };
}

export function mapApiCart(api: ApiCart): Cart {
  return {
    id: api.id ?? '',
    userId: api.userId ?? '',
    items: (api.items ?? []).map(mapApiCartItem),
    subtotal: api.subtotal ?? 0,
    // The cart endpoint returns no tax/shipping/discount; the order does.
    discount: 0,
    tax: 0,
    shipping: 0,
    total: api.subtotal ?? 0,
    couponDiscount: 0,
  };
}

// ── Request types ─────────────────────────────────────────────────────────

export interface AddToCartRequest {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}

export interface ApplyCouponRequest {
  code: string;
}

// ── Redux state ────────────────────────────────────────────────────────────

export interface CartState {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

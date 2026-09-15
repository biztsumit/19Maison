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

// ── API wire types (raw response from /cart and /cart/guest) ──────────────

export interface ApiCartVariantProduct {
  id: string;
  name: string;
  slug: string;
}

export interface ApiCartVariant {
  id: string;
  sku: string;
  discountedPrice: number;
  discount: number;
  quantity: number; // stock quantity
  product: ApiCartVariantProduct;
}

export interface ApiCartItem {
  id: string;
  quantity: number;
  price: number;
  variant: ApiCartVariant;
}

export interface ApiCart {
  id: string;
  userId?: string;
  guestToken?: string;
  subtotal: number;
  itemCount: number;
  items: ApiCartItem[];
}

// ── Mapper: API → internal ────────────────────────────────────────────────

export function mapApiCartItem(item: ApiCartItem): CartItem {
  const v = item.variant ?? {} as ApiCartVariant;
  const p = v.product ?? {} as ApiCartVariantProduct;
  return {
    id: item.id,
    product: {
      id: p.id ?? '',
      name: p.name ?? '',
      slug: p.slug ?? '',
      brand: { id: '', name: '' },
      price: item.price ?? v.discountedPrice ?? 0,
      images: [], // API cart does not return product images
      variants: [],
    },
    variant: {
      id: v.id ?? '',
      sku: v.sku ?? '',
      size: undefined,
      frameColor: '',
      lensColor: '',
      lensType: '',
      salePrice: item.price ?? 0,
      discountedPrice: v.discountedPrice,
      inStock: (v.quantity ?? 0) > 0,
    },
    quantity: item.quantity,
    unitPrice: item.price ?? v.discountedPrice ?? 0,
    totalPrice: (item.price ?? v.discountedPrice ?? 0) * item.quantity,
  };
}

export function mapApiCart(api: ApiCart): Cart {
  return {
    id: api.id,
    userId: api.userId ?? '',
    items: (api.items ?? []).map(mapApiCartItem),
    subtotal: api.subtotal ?? 0,
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

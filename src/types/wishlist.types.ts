import type { Product, ProductImage } from './product.types';

// Wire shapes for /wishlist. The payload nests the product inside a wishlist row,
// and carries only the cheapest active variant so the card can show a price.
export interface ApiWishlistVariant {
  id: string;
  salePrice?: number | string;
  discountPercentage?: number | string;
  discountedPrice?: number | string;
}

export interface ApiWishlistProduct {
  id: string;
  modelNumber?: string;
  slug: string;
  productType?: string;
  shape?: string;
  isActive?: boolean;
  brand?: { id?: string; name?: string } | null;
  variants?: ApiWishlistVariant[];
  // Not present in the documented example; mapped when the API does send it.
  images?: Array<{ documentId?: string; imageUrl?: string }>;
}

export interface ApiWishlistItem {
  id: string;
  productId: string;
  product: ApiWishlistProduct;
}

export interface ApiWishlist {
  id: string;
  userId: string;
  count: number;
  items: ApiWishlistItem[];
}

export interface Wishlist {
  items: Product[];
  count: number;
}

const num = (value: number | string | undefined): number =>
  typeof value === 'number' ? value : Number(value ?? 0) || 0;

export function mapWishlistProduct(api: ApiWishlistProduct): Product {
  // Only the cheapest active variant is returned, purely to price the card.
  const variant = api.variants?.[0];
  const salePrice = num(variant?.salePrice);
  const discounted = num(variant?.discountedPrice);
  const hasDiscount = discounted > 0 && discounted < salePrice;

  const images: ProductImage[] = (api.images ?? [])
    .filter(img => Boolean(img.imageUrl))
    .map((img, i) => ({
      id: img.documentId ?? String(i),
      url: img.imageUrl as string,
      isPrimary: i === 0,
      order: i,
    }));

  return {
    id: api.id,
    name: api.modelNumber ?? '',
    slug: api.slug,
    brand: { id: api.brand?.id ?? '', name: api.brand?.name ?? '' },
    price: hasDiscount ? discounted : salePrice,
    comparePrice: hasDiscount ? salePrice : undefined,
    discount: num(variant?.discountPercentage),
    images,
    variants: variant
      ? [
          {
            id: variant.id,
            sku: '',
            frameColor: '',
            lensColor: '',
            salePrice,
            discountedPrice: hasDiscount ? discounted : undefined,
            inStock: true,
          },
        ]
      : [],
  };
}

export function mapApiWishlist(api: ApiWishlist | null | undefined): Wishlist {
  const items = (api?.items ?? []).map(row => mapWishlistProduct(row.product));
  return { items, count: api?.count ?? items.length };
}

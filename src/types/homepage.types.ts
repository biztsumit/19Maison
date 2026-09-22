// ── Hero Slider ──────────────────────────────────────────────────────────────

export interface HeroBannerDocument {
  documentId: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface HeroBanner {
  title: string | null;
  description: string | null;
  documents: HeroBannerDocument[];
}

// Derived flat slide (built from HeroBanner.documents)
export interface HeroSlide {
  documentId: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
  title: string | null;
  description: string | null;
}

// ── Brands ────────────────────────────────────────────────────────────────────

export interface BrandItem {
  name: string;
  documentId: string | null;
  // The API nests the asset; older code assumed a flat imageUrl, which made the
  // brands rail filter itself empty. Both are accepted.
  image?: { documentId: string; imageUrl: string | null } | null;
  imageUrl?: string | null;
  isFeatured: boolean;
  isExclusive: boolean;
  slug: string | null;
}

// ── Shop by Gender ───────────────────────────────────────────────────────────

export interface GenderSection {
  gender: 'MEN' | 'WOMEN' | 'UNISEX';
  documentId: string | null;
  imageUrl: string | null;
}

// ── Brand Banner ─────────────────────────────────────────────────────────────

export interface BrandBanner {
  documentId: string | null;
  imageUrl: string | null;
  title: string | null;
  description: string | null;
}

// ── Flagship Store ────────────────────────────────────────────────────────────

export interface StoreSection {
  title: string | null;
  description: string | null;
  documentId: string | null;
  imageUrl: string | null;
}

// ── Gallery ───────────────────────────────────────────────────────────────────

export interface GalleryImage {
  documentId: string;
  imageUrl: string;
}

// ── Homepage response ─────────────────────────────────────────────────────────

export interface HomepageData {
  heroSection: HeroBanner[];
  brandsSection: BrandItem[];
  shopByGenderSections: GenderSection[];
  brandBannerSection: BrandBanner | null;
  storeSection: StoreSection | null;
  gallerySection: GalleryImage[];
}

export interface HomepageResponse {
  success: boolean;
  data: HomepageData;
}

// ── Product item returned by /products/latest-drop and /products list ─────────

export interface HomepageProductItem {
  id: string;
  // The API returns modelNumber, not name.
  modelNumber?: string;
  name?: string;
  slug: string;
  description: string | null;
  price: number;
  discountPercentage?: number;
  discount?: number;
  discountedPrice?: number | null;
  brand?: { id?: string; name?: string; slug?: string } | null;
  images: Array<{
    documentId: string;
    imageUrl: string;
  }>;
}

export interface LatestDropResponse {
  success: boolean;
  data: HomepageProductItem[];
}

// GET /products returns the products array directly under `data`, with `pagination`
// as a sibling of it (confirmed against the production web client). The nested
// variant is tolerated in case another list endpoint differs.
export interface ProductListApiResponse {
  data:
    | HomepageProductItem[]
    | { products?: HomepageProductItem[]; pagination?: { total?: number } };
  pagination?: { total?: number };
}

import type { Product } from '@/types';

export function mapHomepageProduct(item: HomepageProductItem): Product {
  // discountedPrice is null/0 when there is no discount, so it must not win.
  const discounted = item.discountedPrice ?? 0;
  const hasDiscount = discounted > 0 && discounted < item.price;

  return {
    id: item.id,
    name: item.modelNumber ?? item.name ?? '',
    slug: item.slug,
    description: item.description ?? undefined,
    brand: { id: '', name: item.brand?.name ?? '' },
    price: hasDiscount ? discounted : item.price,
    comparePrice: hasDiscount ? item.price : undefined,
    discount: item.discountPercentage ?? item.discount ?? 0,
    discountedPrice: hasDiscount ? discounted : undefined,
    images: (item.images ?? []).map((img, i) => ({
      id: img.documentId,
      url: img.imageUrl,
      isPrimary: i === 0,
      order: i,
    })),
    variants: [],
  };
}

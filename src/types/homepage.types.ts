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
  imageUrl: string | null;
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
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discount: number;
  discountedPrice: number;
  images: Array<{
    documentId: string;
    imageUrl: string;
  }>;
}

export interface LatestDropResponse {
  success: boolean;
  data: HomepageProductItem[];
}

// GET /products response: { data: { products: [], pagination: { total } } }
export interface ProductListApiResponse {
  data: {
    products: HomepageProductItem[];
    pagination: {
      total: number;
    };
  };
}

import type { Product } from '@/types';

export function mapHomepageProduct(item: HomepageProductItem): Product {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description ?? undefined,
    brand: { id: '', name: '' },
    price: item.discount > 0 ? item.discountedPrice : item.price,
    comparePrice: item.discount > 0 ? item.price : undefined,
    discount: item.discount,
    discountedPrice: item.discountedPrice,
    images: (item.images ?? []).map((img, i) => ({
      id: img.documentId,
      url: img.imageUrl,
      isPrimary: i === 0,
      order: i,
    })),
    variants: [],
  };
}

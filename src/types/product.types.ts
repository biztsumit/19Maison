// ── Internal app types (used throughout UI) ─────────────────────────────────

export type ProductCategory = 'sunglasses' | 'optical' | 'sports' | 'kids' | 'collectors';
export type ProductGender = 'MEN' | 'WOMEN' | 'UNISEX' | 'KIDS';

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size?: number;
  frameColor: string;
  frameColorCode?: string;
  lensColor: string;
  lensType?: string;
  salePrice: number;
  discountedPrice?: number;
  discountPercentage?: number;
  inStock: boolean;
  stock?: number;
  images?: ProductImage[];
}

export interface ProductBrand {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  isLuxury?: boolean;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  brand: ProductBrand;
  category?: ProductCategory;
  gender?: ProductGender;
  // Derived from best variant's discountedPrice ?? salePrice
  price: number;
  comparePrice?: number;
  discount?: number;
  discountedPrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  isInWishlist?: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ── API wire types (match server response exactly) ──────────────────────────

export interface ApiProductImage {
  documentId: string;
  imageUrl: string;
}

export interface ApiProductVariant {
  id: string;
  sku: string;
  size?: number;
  frameColor: string;
  lensColor: string;
  lensType?: string;
  salePrice: string; // server returns string numbers
  discountedPrice?: string;
  inStock: boolean;
}

export interface ApiProductBrand {
  id: string;
  name: string;
  slug?: string;
  image?: ApiProductImage;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  productType?: string;
  shape?: string;
  rimType?: string;
  material?: string;
  lensProperty?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
  brand: ApiProductBrand;
  images: ApiProductImage[];
  variants: ApiProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiProductListResponse {
  data: ApiProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── Mapper: API → internal ──────────────────────────────────────────────────

export function mapApiProduct(api: ApiProduct): Product {
  const images: ProductImage[] = (api.images ?? []).map((img, i) => ({
    id: img.documentId,
    url: img.imageUrl,
    isPrimary: i === 0,
    order: i,
  }));

  const variants: ProductVariant[] = (api.variants ?? []).map(v => ({
    id: v.id,
    sku: v.sku,
    size: v.size,
    frameColor: v.frameColor,
    lensColor: v.lensColor,
    lensType: v.lensType,
    salePrice: parseFloat(v.salePrice) || 0,
    discountedPrice: v.discountedPrice ? parseFloat(v.discountedPrice) : undefined,
    inStock: v.inStock,
  }));

  // Best price: use discountedPrice if available, else salePrice
  const bestVariant = variants[0];
  const price = bestVariant?.discountedPrice ?? bestVariant?.salePrice ?? 0;
  const comparePrice = bestVariant?.discountedPrice != null ? bestVariant.salePrice : undefined;

  return {
    id: api.id,
    name: api.name,
    slug: api.slug,
    description: api.description,
    shortDescription: api.shortDescription,
    brand: {
      id: api.brand.id,
      name: api.brand.name,
      slug: api.brand.slug,
      logo: api.brand.image?.imageUrl,
    },
    price,
    comparePrice,
    images,
    variants,
    isFeatured: api.isFeatured,
    isExclusive: api.isExclusive,
    isActive: api.isActive,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

// ── Detail API types (GET /products/:id) — different image shape from list ───

export interface ApiProductDetailImage {
  id: string;
  url: string;
}

export interface ApiProductDetailVariant {
  id: string;
  sku: string;
  size?: number;
  frameColor: string;
  frameColorCode?: string;
  salePrice: number; // number (not string) in detail response
  discountPercentage?: number;
  discountedPrice: number;
  inStock: boolean;
  stock?: number;
  images?: ApiProductDetailImage[];
}

export interface ApiProductDetail {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  averageRating?: number;
  totalRatings?: number;
  brand: { id: string; name: string; slug?: string };
  images: ApiProductDetailImage[];
  variants: ApiProductDetailVariant[];
}

export function mapApiProductDetail(api: ApiProductDetail): Product {
  const images: ProductImage[] = (api.images ?? []).map((img, i) => ({
    id: img.id,
    url: img.url,
    isPrimary: i === 0,
    order: i,
  }));

  const variants: ProductVariant[] = (api.variants ?? []).map(v => ({
    id: v.id,
    sku: v.sku,
    size: v.size,
    frameColor: v.frameColor,
    frameColorCode: v.frameColorCode,
    lensColor: '',
    salePrice: v.salePrice,
    discountedPrice: v.discountedPrice,
    discountPercentage: v.discountPercentage,
    inStock: v.inStock,
    stock: v.stock,
    images: (v.images ?? []).map((img, i) => ({
      id: img.id,
      url: img.url,
      isPrimary: i === 0,
      order: i,
    })),
  }));

  const bestVariant = variants[0];
  const price = bestVariant?.discountedPrice ?? bestVariant?.salePrice ?? 0;
  const comparePrice =
    bestVariant?.discountedPrice != null && bestVariant.discountedPrice < bestVariant.salePrice
      ? bestVariant.salePrice
      : undefined;

  return {
    id: api.id,
    name: api.name,
    slug: api.slug,
    description: api.description,
    shortDescription: api.shortDescription,
    brand: { id: api.brand.id, name: api.brand.name, slug: api.brand.slug },
    price,
    comparePrice,
    images,
    variants,
    rating: api.averageRating,
    reviewCount: api.totalRatings,
  };
}

// ── Query params ─────────────────────────────────────────────────────────────

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  brandId?: string;
  brandSlugs?: string[];
  targetAudience?: string[];
  productType?: string[];
  shape?: string[];
  rimType?: string[];
  lensProperty?: string[];
  material?: string[];
  frameColor?: string[];
  lensColor?: string[];
  lensType?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Filter types ─────────────────────────────────────────────────────────────

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

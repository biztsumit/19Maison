import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type {
  ProductListParams,
  ProductListResponse,
  ProductReview,
  FilterGroup,
} from '@/types/product.types';
import type { Product } from '@/types';
import { mapApiProductDetail } from '@/types/product.types';
import type { ApiProductDetail } from '@/types/product.types';
import {
  mapHomepageProduct,
  type HomepageProductItem,
  type ProductListApiResponse,
} from '@/types/homepage.types';

// The list endpoint puts the products array directly on `data`, with `pagination`
// as a sibling. Older code assumed `data.products`, which silently yielded an
// empty list. Both shapes are accepted so one endpoint drifting cannot blank the UI.
function unwrapProductList(body: ProductListApiResponse): {
  items: HomepageProductItem[];
  total: number;
} {
  const payload = body?.data;
  const items = Array.isArray(payload) ? payload : (payload?.products ?? []);
  const total =
    (Array.isArray(payload) ? body?.pagination?.total : payload?.pagination?.total) ??
    body?.pagination?.total ??
    items.length;
  return { items, total };
}

export const ProductService = {
  // GET /products → { data: Product[], pagination: { total } }
  async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
    const res = await apiClient.get<ProductListApiResponse>(Endpoints.products.list, { params });
    const limit = params?.limit ?? 20;
    const page = params?.page ?? 1;
    const { items, total } = unwrapProductList(res.data);
    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
    return {
      products: items.map(mapHomepageProduct),
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getProduct(id: string): Promise<Product> {
    const url = Endpoints.products.detail(id);
    const res = await apiClient.get<{ data: ApiProductDetail }>(url);
    return mapApiProductDetail(res.data.data);
  },

  async getLatest(): Promise<Product[]> {
    const res = await apiClient.get<ProductListApiResponse>(Endpoints.products.list, {
      params: { sortBy: 'createdAt', sortOrder: 'desc', limit: 10, isActive: true },
    });
    return unwrapProductList(res.data).items.map(mapHomepageProduct);
  },

  async getFeatured(): Promise<Product[]> {
    const res = await apiClient.get<ProductListApiResponse>(Endpoints.products.list, {
      params: { isFeatured: true, limit: 10, isActive: true },
    });
    return unwrapProductList(res.data).items.map(mapHomepageProduct);
  },

  async getCollectorsEdition(): Promise<Product[]> {
    const res = await apiClient.get<ProductListApiResponse>(Endpoints.products.list, {
      params: { isExclusive: true, limit: 10, isActive: true },
    });
    return unwrapProductList(res.data).items.map(mapHomepageProduct);
  },

  async getReviews(productId: string): Promise<ProductReview[]> {
    const res = await apiClient.get<{ data: ProductReview[] }>(
      Endpoints.products.reviews(productId),
    );
    return res.data.data ?? [];
  },

  async getFilters(): Promise<FilterGroup[]> {
    const res = await apiClient.get<{ data: FilterGroup[] }>(Endpoints.products.filters);
    return res.data.data ?? [];
  },

  async addReview(
    productId: string,
    data: { rating: number; title: string; body: string },
  ): Promise<ProductReview> {
    const res = await apiClient.post<{ data: ProductReview }>(
      Endpoints.products.addReview(productId),
      data,
    );
    return res.data.data;
  },
};

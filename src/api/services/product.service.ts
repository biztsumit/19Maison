import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type {
  ProductListParams,
  ProductListResponse,
  ProductReview,
  FilterGroup,
} from '@/types/product.types';
import type { Product } from '@/types';
import { mapApiProduct, mapApiProductDetail } from '@/types/product.types';
import type { ApiProductDetail } from '@/types/product.types';
import {
  mapHomepageProduct,
  type ProductListApiResponse,
} from '@/types/homepage.types';

export const ProductService = {
  // GET /products → { data: { products: [], pagination: { total } } }
  async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
    const res = await apiClient.get<ProductListApiResponse>(Endpoints.products.list, { params });
    const limit = params?.limit ?? 20;
    const page = params?.page ?? 1;
    const total = res.data.data?.pagination?.total ?? 0;
    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
    return {
      products: (res.data.data?.products ?? []).map(mapHomepageProduct),
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
    return (res.data.data?.products ?? []).map(mapHomepageProduct);
  },

  async getFeatured(): Promise<Product[]> {
    const res = await apiClient.get<ProductListApiResponse>(Endpoints.products.list, {
      params: { isFeatured: true, limit: 10, isActive: true },
    });
    return (res.data.data?.products ?? []).map(mapHomepageProduct);
  },

  async getCollectorsEdition(): Promise<Product[]> {
    const res = await apiClient.get<ProductListApiResponse>(Endpoints.products.list, {
      params: { isExclusive: true, limit: 10, isActive: true },
    });
    return (res.data.data?.products ?? []).map(mapHomepageProduct);
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

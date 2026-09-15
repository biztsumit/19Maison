import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type {
  SellerProfile,
  SalesAnalytics,
  InventoryItem,
  UpdateStoreRequest,
  Order,
  UpdateOrderStatusRequest,
  Product,
  ProductListParams,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const SellerService = {
  async getProfile(): Promise<SellerProfile> {
    const res = await apiClient.get<ApiResponse<SellerProfile>>(Endpoints.seller.profile);
    return res.data.data;
  },

  async updateProfile(data: UpdateStoreRequest): Promise<SellerProfile> {
    const res = await apiClient.put<ApiResponse<SellerProfile>>(
      Endpoints.seller.updateProfile,
      data,
    );
    return res.data.data;
  },

  async getAnalytics(period?: 'week' | 'month' | 'year'): Promise<SalesAnalytics> {
    const res = await apiClient.get<ApiResponse<SalesAnalytics>>(Endpoints.seller.analytics, {
      params: { period },
    });
    return res.data.data;
  },

  async getProducts(params?: ProductListParams): Promise<PaginatedResponse<Product>> {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      Endpoints.seller.products.list,
      { params },
    );
    return res.data.data;
  },

  async createProduct(data: FormData): Promise<Product> {
    const res = await apiClient.post<ApiResponse<Product>>(
      Endpoints.seller.products.create,
      data,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return res.data.data;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const res = await apiClient.put<ApiResponse<Product>>(
      Endpoints.seller.products.update(id),
      data,
    );
    return res.data.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(Endpoints.seller.products.delete(id));
  },

  async getOrders(params?: { page?: number; status?: string }): Promise<PaginatedResponse<Order>> {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      Endpoints.seller.orders.list,
      { params },
    );
    return res.data.data;
  },

  async updateOrderStatus(id: string, data: UpdateOrderStatusRequest): Promise<Order> {
    const res = await apiClient.put<ApiResponse<Order>>(
      Endpoints.seller.orders.updateStatus(id),
      data,
    );
    return res.data.data;
  },

  async getInventory(): Promise<InventoryItem[]> {
    const res = await apiClient.get<ApiResponse<InventoryItem[]>>(Endpoints.seller.inventory.list);
    return res.data.data;
  },

  async updateInventoryStock(variantId: string, stock: number): Promise<InventoryItem> {
    const res = await apiClient.put<ApiResponse<InventoryItem>>(
      Endpoints.seller.inventory.update(variantId),
      { stock },
    );
    return res.data.data;
  },
};

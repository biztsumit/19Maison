import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type {
  Order,
  CreateOrderRequest,
  OrderListParams,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const OrderService = {
  async getOrders(params?: OrderListParams): Promise<PaginatedResponse<Order>> {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      Endpoints.orders.list,
      { params },
    );
    return res.data.data;
  },

  async getOrder(id: string): Promise<Order> {
    const res = await apiClient.get<ApiResponse<Order>>(Endpoints.orders.detail(id));
    return res.data.data;
  },

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const res = await apiClient.post<ApiResponse<Order>>(Endpoints.orders.create, data);
    return res.data.data;
  },

  async cancelOrder(id: string): Promise<Order> {
    const res = await apiClient.post<ApiResponse<Order>>(Endpoints.orders.cancel(id));
    return res.data.data;
  },
};

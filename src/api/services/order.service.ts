import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type {
  Order,
  CreateOrderRequest,
  OrderListParams,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export interface OrderListResult {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export const OrderService = {
  // The list endpoint may return a bare array or a pagination envelope; the web
  // client assumes the former while mobile's types assumed the latter. Tolerate both.
  async getOrders(params?: OrderListParams): Promise<OrderListResult> {
    const res = await apiClient.get<ApiResponse<Order[] | PaginatedResponse<Order>>>(
      Endpoints.orders.list,
      { params },
    );
    const payload = res.data.data;

    if (Array.isArray(payload)) {
      return { orders: payload, total: payload.length, page: 1, totalPages: 1 };
    }

    return {
      orders: payload?.data ?? [],
      total: payload?.total ?? 0,
      page: payload?.page ?? 1,
      totalPages: payload?.totalPages ?? 1,
    };
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

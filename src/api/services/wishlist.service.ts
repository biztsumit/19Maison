import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type { Product, ApiResponse } from '@/types';

export const WishlistService = {
  async getWishlist(): Promise<Product[]> {
    const res = await apiClient.get<ApiResponse<Product[]>>(Endpoints.wishlist.get);
    return res.data.data;
  },

  async addToWishlist(productId: string): Promise<void> {
    await apiClient.post(Endpoints.wishlist.add, { productId });
  },

  async removeFromWishlist(productId: string): Promise<void> {
    await apiClient.delete(Endpoints.wishlist.remove(productId));
  },

  async checkWishlist(productId: string): Promise<boolean> {
    const res = await apiClient.get<ApiResponse<{ isInWishlist: boolean }>>(
      Endpoints.wishlist.check(productId),
    );
    return res.data.data.isInWishlist;
  },
};

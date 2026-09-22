import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type { ApiResponse } from '@/types';
import type { ApiWishlist, Wishlist } from '@/types/wishlist.types';
import { mapApiWishlist } from '@/types/wishlist.types';

// The error interceptor normalises failures to { message, statusCode }.
const statusOf = (error: unknown): number | undefined =>
  (error as { statusCode?: number } | null)?.statusCode;

export const WishlistService = {
  async getWishlist(): Promise<Wishlist> {
    const res = await apiClient.get<ApiResponse<ApiWishlist>>(Endpoints.wishlist.get);
    return mapApiWishlist(res.data.data);
  },

  // Returns the full updated wishlist, so callers need no follow-up GET.
  async addToWishlist(productId: string): Promise<Wishlist> {
    try {
      const res = await apiClient.post<ApiResponse<ApiWishlist>>(Endpoints.wishlist.add, {
        productId,
      });
      return mapApiWishlist(res.data.data);
    } catch (error) {
      // 409 means it is already saved, which is the state the user wanted.
      if (statusOf(error) === 409) return WishlistService.getWishlist();
      throw error;
    }
  },

  async removeFromWishlist(productId: string): Promise<void> {
    try {
      await apiClient.delete(Endpoints.wishlist.remove(productId));
    } catch (error) {
      // 404 means it is already gone, which is also the desired end state.
      if (statusOf(error) === 404) return;
      throw error;
    }
  },

  async clearWishlist(): Promise<void> {
    await apiClient.delete(Endpoints.wishlist.clear);
  },
};

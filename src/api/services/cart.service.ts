import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type { Cart, AddToCartRequest, UpdateCartItemRequest, ApplyCouponRequest } from '@/types';
import type { ApiCart } from '@/types/cart.types';
import { mapApiCart } from '@/types/cart.types';

const GUEST_TOKEN_KEY = '@19maison:guest_token';

// ── Guest token lifecycle ─────────────────────────────────────────────────

export const GuestTokenManager = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(GUEST_TOKEN_KEY);
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(GUEST_TOKEN_KEY, token);
  },

  async clearToken(): Promise<void> {
    await AsyncStorage.removeItem(GUEST_TOKEN_KEY);
  },

  /** Returns existing token or creates a new guest cart session. */
  async getOrCreateToken(): Promise<string> {
    const existing = await AsyncStorage.getItem(GUEST_TOKEN_KEY);
    if (existing) return existing;
    const res = await apiClient.post<{ data: { guestToken: string } }>(
      Endpoints.cart.guestCreate,
    );
    const token = res.data.data.guestToken;
    await AsyncStorage.setItem(GUEST_TOKEN_KEY, token);
    return token;
  },
};

// ── Cart service ──────────────────────────────────────────────────────────

export const CartService = {
  // ── Authenticated cart ──────────────────────────────────────────────────

  async getCart(): Promise<Cart> {
    const res = await apiClient.get<{ data: ApiCart }>(Endpoints.cart.get);
    return mapApiCart(res.data.data);
  },

  async addItem(data: AddToCartRequest): Promise<Cart> {
    const res = await apiClient.post<{ data: ApiCart }>(Endpoints.cart.add, data);
    return mapApiCart(res.data.data);
  },

  async updateItem({ cartItemId, quantity }: UpdateCartItemRequest): Promise<Cart> {
    const res = await apiClient.patch<{ data: ApiCart }>(
      Endpoints.cart.update(cartItemId),
      { quantity },
    );
    return mapApiCart(res.data.data);
  },

  async removeItem(cartItemId: string): Promise<Cart> {
    const res = await apiClient.delete<{ data: ApiCart }>(Endpoints.cart.remove(cartItemId));
    return mapApiCart(res.data.data);
  },

  async clearCart(): Promise<void> {
    await apiClient.delete(Endpoints.cart.clear);
  },

  async applyCoupon(data: ApplyCouponRequest): Promise<Cart> {
    const res = await apiClient.post<{ data: ApiCart }>(Endpoints.cart.coupon, data);
    return mapApiCart(res.data.data);
  },

  async removeCoupon(): Promise<Cart> {
    const res = await apiClient.delete<{ data: ApiCart }>(Endpoints.cart.coupon);
    return mapApiCart(res.data.data);
  },

  // ── Guest cart ──────────────────────────────────────────────────────────

  async getGuestCart(guestToken: string): Promise<Cart> {
    const res = await apiClient.get<{ data: ApiCart }>(Endpoints.cart.guestGet, {
      params: { guestToken },
    });
    return mapApiCart(res.data.data);
  },

  async addGuestItem(guestToken: string, data: AddToCartRequest): Promise<Cart> {
    const res = await apiClient.post<{ data: ApiCart }>(Endpoints.cart.guestAdd, {
      guestToken,
      ...data,
    });
    return mapApiCart(res.data.data);
  },

  async updateGuestItem(
    guestToken: string,
    cartItemId: string,
    quantity: number,
  ): Promise<Cart> {
    const res = await apiClient.patch<{ data: ApiCart }>(
      Endpoints.cart.guestUpdate(cartItemId),
      { guestToken, quantity },
    );
    return mapApiCart(res.data.data);
  },

  async removeGuestItem(guestToken: string, cartItemId: string): Promise<Cart> {
    const res = await apiClient.delete<{ data: ApiCart }>(
      Endpoints.cart.guestRemove(cartItemId),
      { data: { guestToken } },
    );
    return mapApiCart(res.data.data);
  },

  /** Merge guest cart into user cart after login. Caller must clear the token afterwards. */
  async mergeGuestCart(guestToken: string): Promise<void> {
    await apiClient.post(Endpoints.cart.guestMerge, { guestToken });
  },
};

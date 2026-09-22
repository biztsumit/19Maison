import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type { Cart, AddToCartRequest, UpdateCartItemRequest, ApplyCouponRequest } from '@/types';
import type { ApiCart } from '@/types/cart.types';
import { mapApiCart } from '@/types/cart.types';

async function fetchCart(): Promise<Cart> {
  const res = await apiClient.get<{ data: ApiCart }>(Endpoints.cart.get);
  return mapApiCart(res.data.data);
}

export const CartService = {
  getCart: fetchCart,

  // Mutations return an unspecified body (sometimes just a message), so the
  // response is discarded and the cart is re-read — the same approach the web
  // client takes. Mapping the mutation body risks blanking the cart.
  async addItem(data: AddToCartRequest): Promise<Cart> {
    await apiClient.post(Endpoints.cart.add, data);
    return fetchCart();
  },

  async updateItem({ cartItemId, quantity }: UpdateCartItemRequest): Promise<Cart> {
    await apiClient.patch(Endpoints.cart.update(cartItemId), { quantity });
    return fetchCart();
  },

  async removeItem(cartItemId: string): Promise<Cart> {
    await apiClient.delete(Endpoints.cart.remove(cartItemId));
    return fetchCart();
  },

  async clearCart(): Promise<void> {
    await apiClient.delete(Endpoints.cart.clear);
  },

  async applyCoupon(data: ApplyCouponRequest): Promise<Cart> {
    await apiClient.post(Endpoints.cart.coupon, data);
    return fetchCart();
  },

  async removeCoupon(): Promise<Cart> {
    await apiClient.delete(Endpoints.cart.coupon);
    return fetchCart();
  },
};

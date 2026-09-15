import type { RootState } from '../index';

export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartItems = (state: RootState) => state.cart.cart?.items ?? [];
export const selectCartItemCount = (state: RootState) => state.cart.itemCount;
export const selectCartTotal = (state: RootState) => state.cart.cart?.total ?? 0;
export const selectCartSubtotal = (state: RootState) => state.cart.cart?.subtotal ?? 0;
export const selectCartLoading = (state: RootState) => state.cart.isLoading;
export const selectCartDiscount = (state: RootState) => state.cart.cart?.couponDiscount ?? 0;

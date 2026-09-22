import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchCartThunk,
  addToCartThunk,
  updateCartItemThunk,
  removeCartItemThunk,
  applyCouponThunk,
  clearCartThunk,
} from '@/store/slices/cart.slice';
import {
  selectCart,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
  selectCartLoading,
} from '@/store/selectors/cart.selectors';
import type { AddToCartRequest } from '@/types';
import { haptics } from '@/utils/haptics';

export function useCart() {
  const dispatch = useAppDispatch();

  const cart = useAppSelector(selectCart);
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const total = useAppSelector(selectCartTotal);
  const isLoading = useAppSelector(selectCartLoading);

  const fetchCart = useCallback(() => dispatch(fetchCartThunk()), [dispatch]);

  const addToCart = useCallback(
    (data: AddToCartRequest) => {
      haptics.success();
      return dispatch(addToCartThunk(data));
    },
    [dispatch],
  );

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      haptics.tap();
      return dispatch(updateCartItemThunk({ cartItemId, quantity }));
    },
    [dispatch],
  );

  const removeItem = useCallback(
    (cartItemId: string) => dispatch(removeCartItemThunk(cartItemId)),
    [dispatch],
  );

  const applyCoupon = useCallback((code: string) => dispatch(applyCouponThunk(code)), [dispatch]);

  const clearCartRemote = useCallback(() => dispatch(clearCartThunk()), [dispatch]);

  return {
    cart,
    items,
    itemCount,
    total,
    isLoading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    clearCartRemote,
  };
}

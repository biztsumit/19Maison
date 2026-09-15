import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchCartThunk,
  addToCartThunk,
  updateCartItemThunk,
  removeCartItemThunk,
  applyCouponThunk,
} from '@/store/slices/cart.slice';
import {
  selectCart,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
  selectCartLoading,
} from '@/store/selectors/cart.selectors';
import { selectIsAuthenticated } from '@/store/selectors/auth.selectors';
import type { AddToCartRequest } from '@/types';

export function useCart() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const cart = useAppSelector(selectCart);
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const total = useAppSelector(selectCartTotal);
  const isLoading = useAppSelector(selectCartLoading);

  const fetchCart = useCallback(
    () => dispatch(fetchCartThunk({ isAuthenticated })),
    [dispatch, isAuthenticated],
  );

  const addToCart = useCallback(
    (data: AddToCartRequest) => dispatch(addToCartThunk({ isAuthenticated, data })),
    [dispatch, isAuthenticated],
  );

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) =>
      dispatch(updateCartItemThunk({ isAuthenticated, cartItemId, quantity })),
    [dispatch, isAuthenticated],
  );

  const removeItem = useCallback(
    (cartItemId: string) => dispatch(removeCartItemThunk({ isAuthenticated, cartItemId })),
    [dispatch, isAuthenticated],
  );

  const applyCoupon = useCallback(
    (code: string) => dispatch(applyCouponThunk(code)),
    [dispatch],
  );

  return {
    cart,
    items,
    itemCount,
    total,
    isLoading,
    isAuthenticated,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    applyCoupon,
  };
}

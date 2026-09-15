import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectAuth,
  selectIsAuthenticated,
  selectPendingPhone,
  selectUser,
  selectUserRole,
} from '@/store/selectors/auth.selectors';
import {
  clearError,
  loginThunk,
  logoutThunk,
  registerThunk,
  staffLoginThunk,
  verifyOtpThunk,
} from '@/store/slices/auth.slice';
import { clearCart } from '@/store/slices/cart.slice';
import { clearWishlist } from '@/store/slices/wishlist.slice';
import type { LoginRequest, RegisterRequest, StaffLoginRequest, VerifyOtpRequest } from '@/types';
import { useCallback } from 'react';

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);
  const pendingPhone = useAppSelector(selectPendingPhone);

  const login = useCallback(
    (data: LoginRequest) => dispatch(loginThunk(data)),
    [dispatch],
  );

  const staffLogin = useCallback(
    (data: StaffLoginRequest) => dispatch(staffLoginThunk(data)),
    [dispatch],
  );

  const register = useCallback(
    (data: RegisterRequest) => dispatch(registerThunk(data)),
    [dispatch],
  );

  const verifyOtp = useCallback(
    (data: VerifyOtpRequest) => dispatch(verifyOtpThunk(data)),
    [dispatch],
  );

  const logout = useCallback(async () => {
    await dispatch(logoutThunk());
    dispatch(clearCart());
    dispatch(clearWishlist());
  }, [dispatch]);

  const dismissError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    user,
    isAuthenticated,
    role,
    pendingPhone,
    isLoading: auth.isLoading,
    error: auth.error,
    login,
    staffLogin,
    register,
    verifyOtp,
    logout,
    dismissError,
    // Display name helper
    displayName: user ? `${user.firstName} ${user.lastName}`.trim() : null,
  };
}

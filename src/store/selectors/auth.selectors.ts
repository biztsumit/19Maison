import type { RootState } from '../index';

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectIsCustomer = (state: RootState) => state.auth.user?.role === 'CUSTOMER';
export const selectIsEmployee = (state: RootState) => state.auth.user?.role === 'EMPLOYEE';
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectPendingPhone = (state: RootState) => state.auth.pendingPhone;

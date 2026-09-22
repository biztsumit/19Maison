import { isStaff } from '@/constants/roles';
import type { RootState } from '../index';

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
// Every non-staff role is a customer; the backend has no CUSTOMER literal.
export const selectIsCustomer = (state: RootState) =>
  Boolean(state.auth.user) && !isStaff(state.auth.user);
export const selectIsStaff = (state: RootState) => isStaff(state.auth.user);
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthBootstrapped = (state: RootState) => state.auth.bootstrapped;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectPendingPhone = (state: RootState) => state.auth.pendingPhone;

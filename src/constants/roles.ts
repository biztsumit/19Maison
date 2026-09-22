import type { AuthUser } from '@/types/auth.types';

// The backend's only named role is STORE_STAFF; everything else is a customer.
// Mirrors config/roles.ts in the web client, which compares against this literal
// and treats every other value as a customer by elimination.
export const ROLES = {
  STAFF: 'STORE_STAFF',
} as const;

// This app ships the customer experience only. Anyone whose role is a back-office
// one is refused at the gate and sent back to login.
//
// STORE_STAFF is the only value confirmed against the backend (it is the sole role
// the web client names, and it matched the JWT we inspected). The rest are listed
// defensively: if the backend never emits them nothing matches, and if it does we
// fail closed rather than letting a back-office account into the storefront.
export const NON_CUSTOMER_ROLES: readonly string[] = [
  'STORE_STAFF',
  'STAFF',
  'SELLER',
  'VENDOR',
  'ADMIN',
  'SUPER_ADMIN',
];

export const isCustomerRole = (role: string | undefined | null): boolean => {
  if (!role) return false;
  return !NON_CUSTOMER_ROLES.includes(role.toUpperCase());
};

export const isStaff = (user: Pick<AuthUser, 'role'> | null | undefined): boolean =>
  user?.role === ROLES.STAFF;

export const isStaffRole = (role: string | undefined): boolean => role === ROLES.STAFF;

// Staff accounts carry a single `name`; customers carry firstName/lastName.
export const displayNameFor = (user: AuthUser | null | undefined): string | null => {
  if (!user) return null;
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return full || user.name?.trim() || null;
};

// Matches GET /auth/me, which is the only endpoint that returns a user.
// Login and verify-otp return tokens only.
export interface PosStore {
  id: string;
  name: string;
  code: string;
  warehouseId: string;
}

export interface AuthUser {
  id: string;
  phone: string;
  // The backend sends STORE_STAFF for staff; customers carry other values.
  // Left open rather than a union so an unknown role cannot break parsing.
  role: string;
  email?: string;
  // customer-only
  firstName?: string;
  lastName?: string;
  profileImage?: {
    documentId: string | null;
    imageUrl: string | null;
  };
  // staff-only
  name?: string;
  storeId?: string;
  isActive?: boolean;
  store?: PosStore;
}
// Tokens returned by login and verify-otp (flat, not nested)
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ── Request payloads ────────────────────────────────────────────────────────

// POST /auth/login (customer)
export interface LoginRequest {
  phone: string; // E.164 e.g. +919999999999
  password: string;
}

// POST /auth/staff-login (employee — username + password, no OTP)
export interface StaffLoginRequest {
  username: string;
  password: string;
}

// POST /auth/register
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phone: string; // E.164
  email?: string;
  password: string;
  avatarDocumentId?: string;
}

// POST /auth/verify-otp
export interface VerifyOtpRequest {
  phone: string; // E.164
  otp: string;
}

// Legacy (unused but kept for compatibility)
export interface ForgotPasswordRequest {
  phone: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// ── Response shapes ─────────────────────────────────────────────────────────

// Register returns OTP message (no tokens yet)
export interface RegisterResponse {
  message?: string;
  otp?: string; // returned in development
}

// Login and verify-otp return tokens only. The production web client never reads a
// user from them (the key is `pos` for staff), and fetches GET /auth/me instead.
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

// ── Redux state ─────────────────────────────────────────────────────────────

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  // In-flight flag for login/register/verify requests. Never gate routing on this.
  isLoading: boolean;
  // True once session restore has settled either way. Routing gates on this.
  bootstrapped: boolean;
  error: string | null;
  // Temporarily holds the phone during the register → OTP → verify flow
  pendingPhone: string | null;
}

// ── Legacy type aliases for backwards-compat with non-updated callers ───────
export type UserRole = string;

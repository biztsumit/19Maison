// ── API User shape (matches /auth/login and /auth/verify-otp responses) ────
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  role: 'CUSTOMER' | 'EMPLOYEE';
  profileImage?: {
    documentId: string;
    imageUrl: string;
  };
}

// Tokens returned by login and verify-otp (flat, not nested)
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ── Request payloads ────────────────────────────────────────────────────────

// POST /auth/login (customer)
export interface LoginRequest {
  phone: string;   // E.164 e.g. +919999999999
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
  phone: string;   // E.164
  email?: string;
  password: string;
  avatarDocumentId?: string;
}

// POST /auth/verify-otp
export interface VerifyOtpRequest {
  phone: string;   // E.164
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
  message: string;
  otp?: string; // returned in development
}

// Login + verify-otp both return tokens + user
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// ── Redux state ─────────────────────────────────────────────────────────────

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Temporarily holds the phone during the register → OTP → verify flow
  pendingPhone: string | null;
}

// ── Legacy type aliases for backwards-compat with non-updated callers ───────
export type UserRole = 'CUSTOMER' | 'EMPLOYEE';

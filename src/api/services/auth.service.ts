import { Endpoints } from '@/constants/api';
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  StaffLoginRequest,
  VerifyOtpRequest,
} from '@/types';
import type { ApiResponse } from '@/types/api.types';
import { apiClient } from '../client';

// The web client reads every auth payload as `json?.data ?? json`, because some
// responses are enveloped and some are not. Mirror that tolerance.
function unwrap<T>(body: unknown): T {
  const envelope = body as { data?: T } | null;
  return (envelope?.data ?? body) as T;
}

export const AuthService = {
  // POST /auth/login → { accessToken, refreshToken }. The user is NOT read here:
  // the payload nests it under a role-specific key (`pos` for staff). Call getMe().
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post(Endpoints.auth.login, data);
    return unwrap<AuthResponse>(res.data);
  },

  // POST /auth/staff-login → { accessToken, refreshToken }
  async staffLogin(data: StaffLoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post(Endpoints.auth.staffLogin, data);
    return unwrap<AuthResponse>(res.data);
  },

  // POST /auth/register → { message, otp? }  (no tokens yet)
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const res = await apiClient.post<ApiResponse<RegisterResponse>>(Endpoints.auth.register, data);
    return res.data.data;
  },

  // POST /auth/verify-otp → { accessToken, refreshToken }
  async verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
    const res = await apiClient.post(Endpoints.auth.verifyOtp, data);
    return unwrap<AuthResponse>(res.data);
  },

  // POST /auth/resend-otp → { otp? }
  async resendOtp(phone: string): Promise<{ otp?: string }> {
    const res = await apiClient.post(Endpoints.auth.resendOtp, { phone });
    return unwrap<{ otp?: string }>(res.data);
  },

  async logout(): Promise<void> {
    await apiClient.post(Endpoints.auth.logout);
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(Endpoints.auth.forgotPassword, data);
  },

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post(Endpoints.auth.resetPassword, data);
  },

  async getMe(): Promise<AuthUser> {
    const res = await apiClient.get(Endpoints.auth.me);
    return unwrap<AuthUser>(res.data);
  },
};

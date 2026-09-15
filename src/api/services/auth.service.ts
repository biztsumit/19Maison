import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type {
  LoginRequest,
  StaffLoginRequest,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthUser,
} from '@/types';
import type { ApiResponse } from '@/types/api.types';

export const AuthService = {
  // POST /auth/login → { accessToken, refreshToken, user }
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(Endpoints.auth.login, data);
    return res.data.data;
  },

  // POST /auth/staff-login → { accessToken, refreshToken, user } (role: EMPLOYEE)
  async staffLogin(data: StaffLoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(Endpoints.auth.staffLogin, data);
    return res.data.data;
  },

  // POST /auth/register → { message, otp? }  (no tokens yet)
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const res = await apiClient.post<ApiResponse<RegisterResponse>>(Endpoints.auth.register, data);
    return res.data.data;
  },

  // POST /auth/verify-otp → { accessToken, refreshToken, user }
  async verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(Endpoints.auth.verifyOtp, data);
    return res.data.data;
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
    const res = await apiClient.get<ApiResponse<AuthUser>>(Endpoints.auth.me);
    return res.data.data;
  },
};

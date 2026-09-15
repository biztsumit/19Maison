import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '@/api/services/auth.service';
import { StorageService } from '@/services/storage.service';
import type {
  AuthState,
  AuthUser,
  AuthTokens,
  LoginRequest,
  StaffLoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
} from '@/types';

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  pendingPhone: null,
};

// ── Login: phone + password → tokens + user ───────────────────────────────
export const loginThunk = createAsyncThunk('auth/login', async (data: LoginRequest) => {
  const response = await AuthService.login(data);
  await StorageService.setTokens(response.accessToken, response.refreshToken);
  await StorageService.setUser(response.user);
  return response;
});

// ── Staff login: username + password → tokens + user (role: EMPLOYEE) ────
export const staffLoginThunk = createAsyncThunk(
  'auth/staffLogin',
  async (data: StaffLoginRequest) => {
    const response = await AuthService.staffLogin(data);
    await StorageService.setTokens(response.accessToken, response.refreshToken);
    await StorageService.setUser(response.user);
    return response;
  },
);

// ── Register: sends OTP, stores phone for verification step ──────────────
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest) => {
    const response = await AuthService.register(data);
    return { ...response, phone: data.phone };
  },
);

// ── Verify OTP: phone + otp → tokens + user ───────────────────────────────
export const verifyOtpThunk = createAsyncThunk(
  'auth/verifyOtp',
  async (data: VerifyOtpRequest) => {
    const response = await AuthService.verifyOtp(data);
    await StorageService.setTokens(response.accessToken, response.refreshToken);
    await StorageService.setUser(response.user);
    return response;
  },
);

// ── Logout ────────────────────────────────────────────────────────────────
export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    await AuthService.logout();
  } finally {
    await StorageService.clearTokens();
  }
});

// ── Restore session from SecureStore on app launch ────────────────────────
export const restoreSessionThunk = createAsyncThunk('auth/restoreSession', async () => {
  const [user, accessToken, refreshToken] = await Promise.all([
    StorageService.getUser<AuthUser>(),
    StorageService.getAccessToken(),
    StorageService.getRefreshToken(),
  ]);
  if (!user || !accessToken) return null;
  return { user, tokens: { accessToken, refreshToken: refreshToken ?? '' } };
});

// ── Slice ─────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    updateTokens(state, action: PayloadAction<AuthTokens>) {
      state.tokens = action.payload;
    },
    clearPendingPhone(state) {
      state.pendingPhone = null;
    },
  },
  extraReducers: builder => {
    // ── Login ──────────────────────────────────────────────────────────
    builder
      .addCase(loginThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = {
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        };
        state.isAuthenticated = true;
        state.pendingPhone = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Login failed';
      });

    // ── Staff login ────────────────────────────────────────────────────
    builder
      .addCase(staffLoginThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(staffLoginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = {
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        };
        state.isAuthenticated = true;
        state.pendingPhone = null;
      })
      .addCase(staffLoginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Login failed';
      });

    // ── Register (OTP sent, no tokens yet) ────────────────────────────
    builder
      .addCase(registerThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Store phone so verification screen can read it
        state.pendingPhone = action.payload.phone;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Registration failed';
      });

    // ── Verify OTP → fully authenticated ──────────────────────────────
    builder
      .addCase(verifyOtpThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = {
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        };
        state.isAuthenticated = true;
        state.pendingPhone = null;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Verification failed';
      });

    // ── Logout ─────────────────────────────────────────────────────────
    builder.addCase(logoutThunk.fulfilled, state => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
      state.pendingPhone = null;
    });

    // ── Restore session ────────────────────────────────────────────────
    builder.addCase(restoreSessionThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
      }
    });
  },
});

export const { clearError, setUser, updateTokens, clearPendingPhone } = authSlice.actions;
export default authSlice.reducer;

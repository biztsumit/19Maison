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
  bootstrapped: false,
  error: null,
  pendingPhone: null,
};

// ── Login: phone + password → tokens + user ───────────────────────────────
// Login returns tokens only. The user must be fetched separately from /auth/me —
// the login payload nests it under a role-specific key (`pos` for staff), which is
// why the production web client never reads it from here either.
export const loginThunk = createAsyncThunk('auth/login', async (data: LoginRequest) => {
  const tokens = await AuthService.login(data);
  await StorageService.setTokens(tokens.accessToken, tokens.refreshToken);
  const user = await AuthService.getMe();
  await StorageService.setUser(user);
  return { ...tokens, user };
});

// ── Staff login: username + password → tokens, then /auth/me ────────────
export const staffLoginThunk = createAsyncThunk(
  'auth/staffLogin',
  async (data: StaffLoginRequest) => {
    const tokens = await AuthService.staffLogin(data);
    await StorageService.setTokens(tokens.accessToken, tokens.refreshToken);
    const user = await AuthService.getMe();
    await StorageService.setUser(user);
    return { ...tokens, user };
  },
);

// ── Register: sends OTP, stores phone for verification step ──────────────
export const registerThunk = createAsyncThunk('auth/register', async (data: RegisterRequest) => {
  const response = await AuthService.register(data);
  return { ...response, phone: data.phone };
});

// ── Verify OTP: phone + otp → tokens + user ───────────────────────────────
export const verifyOtpThunk = createAsyncThunk('auth/verifyOtp', async (data: VerifyOtpRequest) => {
  const tokens = await AuthService.verifyOtp(data);
  await StorageService.setTokens(tokens.accessToken, tokens.refreshToken);
  const user = await AuthService.getMe();
  await StorageService.setUser(user);
  return { ...tokens, user };
});

// ── Logout ────────────────────────────────────────────────────────────────
// Signing out must always succeed locally. A failing (or 401-ing) /auth/logout
// used to reject this thunk, and with only a fulfilled case the session stayed
// in state — which is why the first tap appeared to do nothing.
export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    await AuthService.logout();
  } catch {
    // Server-side sign-out is best effort; the local session goes regardless.
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
    // Local-only session teardown, dispatched when a token refresh fails.
    // Tokens are already cleared by the interceptor; this stops the UI believing
    // it is still signed in while every request 401s.
    forceLogout(state) {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
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
    const endSession = (state: AuthState) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.pendingPhone = null;
    };
    builder.addCase(logoutThunk.fulfilled, endSession).addCase(logoutThunk.rejected, endSession);

    // ── Restore session ────────────────────────────────────────────────
    // Both cases must set `bootstrapped`. Without the rejected case a throwing
    // SecureStore read (corrupt keychain entry) leaves the app on the splash forever.
    builder
      .addCase(restoreSessionThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.tokens = action.payload.tokens;
          state.isAuthenticated = true;
        }
        state.bootstrapped = true;
      })
      .addCase(restoreSessionThunk.rejected, state => {
        state.bootstrapped = true;
      });
  },
});

export const { clearError, setUser, updateTokens, clearPendingPhone, forceLogout } =
  authSlice.actions;
export default authSlice.reducer;

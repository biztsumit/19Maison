import { QueryProvider } from '@/context/query-provider';
import { CUSTOMER_HOME } from '@/constants/routes';
import { ReduxProvider } from '@/context/redux-provider';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectAuthBootstrapped,
  selectIsAuthenticated,
  selectUserRole,
} from '@/store/selectors/auth.selectors';
import { forceLogout, logoutThunk, restoreSessionThunk } from '@/store/slices/auth.slice';
import { fetchCartThunk } from '@/store/slices/cart.slice';
import { fetchWishlistThunk } from '@/store/slices/wishlist.slice';
import { setUnauthorizedHandler } from '@/api/auth-events';
import { isCustomerRole } from '@/constants/roles';
import { setAuthNotice } from '@/utils/auth-notice';
import { isResumableTarget, setRedirectIntent, takeRedirectIntent } from '@/utils/redirect-intent';
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { useQueryClient } from '@tanstack/react-query';
import type { Href } from 'expo-router';
import {
  Slot,
  useGlobalSearchParams,
  usePathname,
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ErrorBoundary } from '@/components/customer/layout/ErrorBoundary';
import { OfflineBanner } from '@/components/customer/layout/OfflineBanner';
import { toastConfig } from '@/components/customer/ui/toast-config';
import { ConfirmProvider } from '@/providers/ConfirmProvider';

SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const globalParams = useGlobalSearchParams();
  const queryClient = useQueryClient();

  const bootstrapped = useAppSelector(selectAuthBootstrapped);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);

  // router.replace is a no-op until the root navigator has mounted.
  const navigationState = useRootNavigationState();
  const navigatorReady = Boolean(navigationState?.key);

  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Tracks that the route guard has run at least once, so the splash can stay up
  // until the correct screen is the one being painted.
  const [routed, setRouted] = useState(false);

  // True once the first routing decision has been made. Distinguishes a cold
  // start (where a deep link is worth resuming) from a later sign-out.
  const hasRoutedOnce = useRef(false);

  useEffect(() => {
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  // A failed token refresh clears storage but cannot reach the store from the
  // interceptor, so it signals through auth-events instead.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      dispatch(forceLogout());
      queryClient.clear();
    });
    return () => setUnauthorizedHandler(null);
  }, [dispatch, queryClient]);

  // Server state that every customer screen assumes is already loaded.
  useEffect(() => {
    if (!isAuthenticated || !isCustomerRole(role)) return;
    dispatch(fetchCartThunk());
    dispatch(fetchWishlistThunk());
  }, [isAuthenticated, role, dispatch]);

  useEffect(() => {
    if (!bootstrapped || !navigatorReady) return;

    const group = segments[0] as string | undefined;
    const inAuthGroup = group === '(auth)';
    const inCustomerGroup = group === '(customer)';

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        // Only on a cold start: after a sign-out the current screen is just where
        // the user happened to be, and resuming it would drop them back on, say,
        // Profile instead of the homepage.
        if (!hasRoutedOnce.current && isResumableTarget(segments as string[])) {
          setRedirectIntent({
            pathname,
            params: globalParams as Record<string, string>,
          });
        }
        router.replace('/(auth)/login');
      }
    } else if (!isCustomerRole(role)) {
      // This build is the customer storefront. A back-office account is signed out
      // again rather than routed anywhere, so no staff session can linger on the
      // device, and the login screen explains why.
      setAuthNotice(
        'This app is for customers only. Staff and seller accounts cannot sign in here.',
      );
      dispatch(logoutThunk());
      queryClient.clear();
      router.replace('/(auth)/login');
    } else if (!inCustomerGroup) {
      const intent = takeRedirectIntent();
      router.replace(
        intent ? ({ pathname: intent.pathname, params: intent.params } as Href) : CUSTOMER_HOME,
      );
    }

    hasRoutedOnce.current = true;
    setRouted(true);
  }, [
    bootstrapped,
    navigatorReady,
    isAuthenticated,
    role,
    segments,
    pathname,
    globalParams,
    router,
    dispatch,
    queryClient,
  ]);

  // The native splash stays up until fonts, session and routing have all settled,
  // so the first painted frame is always the correct screen.
  const ready = fontsLoaded && bootstrapped && routed;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ReduxProvider>
        <QueryProvider>
          <StatusBar style="dark" />
          {/* Inside the providers so the fallback screen can still be themed, and
              so a crash in a screen does not take the navigator's context with it. */}
          <ErrorBoundary>
            <ConfirmProvider>
              <AuthGate />
            </ConfirmProvider>
          </ErrorBoundary>
          <OfflineBanner />
          {/* Last, so toasts and dialogs render above every screen. */}
          <Toast config={toastConfig} topOffset={60} />
        </QueryProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}

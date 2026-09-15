import { QueryProvider } from '@/context/query-provider';
import { ReduxProvider } from '@/context/redux-provider';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectIsAuthenticated, selectUserRole } from '@/store/selectors/auth.selectors';
import { restoreSessionThunk } from '@/store/slices/auth.slice';
import { fetchCartThunk } from '@/store/slices/cart.slice';
import { CartService, GuestTokenManager } from '@/api/services/cart.service';
import { Colors } from '@/theme/colors';
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);
  const isLoading = useAppSelector(state => state.auth.isLoading);
  const prevAuthenticated = useRef(false);

  // Restore session on launch
  useEffect(() => {
    dispatch(restoreSessionThunk()).finally(() => {
      SplashScreen.hideAsync();
    });
  }, [dispatch]);

  // Merge guest cart when user logs in, then fetch fresh auth cart
  useEffect(() => {
    if (!prevAuthenticated.current && isAuthenticated) {
      GuestTokenManager.getToken().then(async token => {
        if (token) {
          try {
            await CartService.mergeGuestCart(token);
          } catch {
            // Merge failure is non-fatal
          } finally {
            await GuestTokenManager.clearToken();
          }
        }
        dispatch(fetchCartThunk({ isAuthenticated: true }));
      });
    }
    prevAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, dispatch]);

  // Route protection
  useEffect(() => {
    if (isLoading) return;

    const seg0 = segments[0] as string;
    const inAuthGroup = seg0 === '(auth)';
    const inCustomerGroup = seg0 === '(customer)';
    const inStaffGroup = seg0 === '(staff)';

    if (!isAuthenticated) {
      // Staff routes require login; guest users can browse customer section
      if (inStaffGroup) {
        router.replace('/(auth)/login');
      } else if (!inCustomerGroup && !inAuthGroup) {
        // Default landing for fresh installs
        router.replace('/(customer)');
      }
    } else if (role === 'EMPLOYEE') {
      if (!inStaffGroup) router.replace('/(staff)');
    } else {
      // Authenticated customer — leave auth screens
      if (inAuthGroup) router.replace('/(customer)');
    }
  }, [isAuthenticated, role, segments, isLoading, router]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  return (
    <ReduxProvider>
      <QueryProvider>
        <StatusBar style="dark" />
        <AuthGate />
        <Toast />
      </QueryProvider>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

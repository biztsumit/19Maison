import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { createCustomerText } from './customer';
import type { CustomerTextStyles } from './customer';
import { palettes } from './palette';
import type { CustomerPalette } from './palette';

export type ColorScheme = 'light' | 'dark';

// 'system' is the default: the app follows the device until the user picks a side.
export type ThemeMode = 'system' | ColorScheme;

export const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark'];

const STORAGE_KEY = '@19maison:theme_mode';

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

// Built once per scheme rather than per render: every `Text` in the tree reads these.
const TEXT_BY_SCHEME: Record<ColorScheme, CustomerTextStyles> = {
  light: createCustomerText(palettes.light),
  dark: createCustomerText(palettes.dark),
};

interface ThemeValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** The scheme actually being painted, with 'system' already resolved. */
  scheme: ColorScheme;
  isDark: boolean;
  colors: CustomerPalette;
  text: CustomerTextStyles;
  /** False until the stored preference has been read back. */
  ready: boolean;
}

// Defaults to light rather than throwing, so a component rendered above the provider
// (an error fallback, a test) still paints something readable.
const ThemeContext = createContext<ThemeValue>({
  mode: 'system',
  setMode: () => {},
  scheme: 'light',
  isDark: false,
  colors: palettes.light,
  text: TEXT_BY_SCHEME.light,
  ready: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then(stored => {
        if (cancelled) return;
        if (isThemeMode(stored)) setModeState(stored);
      })
      .catch(() => {
        // A read failure just means "follow the system", which is the default anyway.
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // React Native reports 'unspecified' when the device has no preference set.
  const scheme: ColorScheme =
    mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

  // Keeps React Native's own appearance in step, so native pieces we do not style
  // — keyboard appearance, text selection handles, the default Modal backdrop —
  // match the scheme the user picked rather than the device setting.
  useEffect(() => {
    Appearance.setColorScheme(mode === 'system' ? 'unspecified' : mode);
  }, [mode]);

  // The root view shows through during navigation transitions and overscroll; left
  // white it flashes on every push in dark mode.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(palettes[scheme].bg).catch(() => {});
  }, [scheme]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // The choice still applies for this session.
    });
  }, []);

  const value = useMemo<ThemeValue>(
    () => ({
      mode,
      setMode,
      scheme,
      isDark: scheme === 'dark',
      colors: palettes[scheme],
      text: TEXT_BY_SCHEME[scheme],
      ready,
    }),
    [mode, setMode, scheme, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}

export function useThemeColors(): CustomerPalette {
  return useContext(ThemeContext).colors;
}

type StylesFactory<T> = (c: CustomerPalette) => T;

// One StyleSheet per (factory, scheme) for the whole app, not one per mounted
// component: the factories are module-level constants, so the WeakMap entry lives
// exactly as long as the module does.
const stylesCache = new WeakMap<StylesFactory<unknown>, Partial<Record<ColorScheme, unknown>>>();

export function useThemedStyles<T>(factory: StylesFactory<T>): T {
  const { scheme } = useTheme();
  const key = factory as StylesFactory<unknown>;

  let perScheme = stylesCache.get(key);
  if (!perScheme) {
    perScheme = {};
    stylesCache.set(key, perScheme);
  }
  if (!perScheme[scheme]) {
    perScheme[scheme] = factory(palettes[scheme]);
  }
  return perScheme[scheme] as T;
}

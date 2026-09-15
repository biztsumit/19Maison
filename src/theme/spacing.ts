export const Spacing = {
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export const Layout = {
  screenPaddingH: Spacing[4],
  screenPaddingV: Spacing[6],
  cardPadding: Spacing[4],
  sectionSpacing: Spacing[8],
  productCardWidth: 160,
  maxContentWidth: 480,
  tabBarHeight: 60,
  headerHeight: 56,
} as const;

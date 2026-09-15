// Poppins font families loaded via @expo-google-fonts/poppins
export const Font = {
  light: 'Poppins_300Light',
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

// Legacy FontFamily kept for seller screens
export const FontFamily = {
  display: 'serif',
  body: 'sans-serif',
  mono: 'monospace',
};

export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
} as const;

export const FontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const LineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
} as const;

export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
  ultra: 4,
} as const;

export const TextStyles = {
  displayLarge: {
    fontFamily: Font.light,
    fontSize: FontSize['5xl'],
    lineHeight: FontSize['5xl'] * LineHeight.tight,
  },
  displayMedium: {
    fontFamily: Font.light,
    fontSize: FontSize['4xl'],
    lineHeight: FontSize['4xl'] * LineHeight.tight,
  },
  displaySmall: {
    fontFamily: Font.regular,
    fontSize: FontSize['3xl'],
    lineHeight: FontSize['3xl'] * LineHeight.snug,
  },
  headingLarge: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * LineHeight.snug,
  },
  headingMedium: {
    fontFamily: Font.semibold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.snug,
  },
  headingSmall: {
    fontFamily: Font.semibold,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.snug,
  },
  titleLarge: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSize.md * LineHeight.normal,
  },
  titleMedium: {
    fontFamily: Font.medium,
    fontSize: FontSize.base,
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSize.base * LineHeight.normal,
  },
  label: {
    fontFamily: Font.semibold,
    fontSize: FontSize.sm,
    letterSpacing: LetterSpacing.widest,
    lineHeight: FontSize.sm * LineHeight.normal,
    textTransform: 'uppercase' as const,
  },
  body: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  bodySmall: {
    fontFamily: Font.regular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.relaxed,
  },
  caption: {
    fontFamily: Font.regular,
    fontSize: FontSize.xs,
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSize.xs * LineHeight.normal,
  },
  price: {
    fontFamily: Font.bold,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.snug,
  },
  priceSmall: {
    fontFamily: Font.medium,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.snug,
  },
} as const;

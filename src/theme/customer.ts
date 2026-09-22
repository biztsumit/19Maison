import { Font, FontSize, LetterSpacing, LineHeight } from './typography';
import { Spacing } from './spacing';
import { lightPalette } from './palette';
import type { CustomerPalette } from './palette';

// The light palette, kept as a named export because seller/staff screens and a few
// module-level constants read tokens outside of React. Anything that renders inside
// the customer flow should use `useThemeColors()` instead so it follows the scheme.
export const CustomerColors = lightPalette;

// Text presets carry a colour, so they have to be rebuilt per scheme. `createCustomerText`
// is called once per palette by the theme provider and the result is cached.
export function createCustomerText(c: CustomerPalette) {
  return {
    sectionHeading: {
      fontFamily: Font.semibold,
      fontSize: FontSize.xl,
      lineHeight: FontSize.xl * LineHeight.snug,
      color: c.text,
    },
    sectionHeadingOnDark: {
      fontFamily: Font.semibold,
      fontSize: FontSize.xl,
      lineHeight: FontSize.xl * LineHeight.snug,
      color: c.textInverse,
    },
    screenTitle: {
      fontFamily: Font.semibold,
      fontSize: FontSize['2xl'],
      lineHeight: FontSize['2xl'] * LineHeight.snug,
      color: c.text,
    },
    eyebrow: {
      fontFamily: Font.medium,
      fontSize: FontSize.sm,
      letterSpacing: LetterSpacing.widest,
      lineHeight: FontSize.sm * LineHeight.normal,
      textTransform: 'uppercase' as const,
      color: c.accent,
    },
    cardTitle: {
      fontFamily: Font.medium,
      fontSize: FontSize.base,
      lineHeight: FontSize.base * LineHeight.snug,
      color: c.text,
    },
    cardBrand: {
      fontFamily: Font.semibold,
      fontSize: FontSize.sm,
      lineHeight: FontSize.sm * LineHeight.snug,
      color: c.text,
    },
    cardPrice: {
      fontFamily: Font.semibold,
      fontSize: FontSize.md,
      lineHeight: FontSize.md * LineHeight.snug,
      color: c.text,
    },
    priceLarge: {
      fontFamily: Font.bold,
      fontSize: FontSize['2xl'],
      lineHeight: FontSize['2xl'] * LineHeight.snug,
      color: c.text,
    },
    priceStrike: {
      fontFamily: Font.regular,
      fontSize: FontSize.base,
      lineHeight: FontSize.base * LineHeight.snug,
      textDecorationLine: 'line-through' as const,
      color: c.textMuted,
    },
    ctaLabel: {
      fontFamily: Font.semibold,
      fontSize: FontSize.base,
      letterSpacing: LetterSpacing.wider,
      lineHeight: FontSize.base * LineHeight.normal,
      textTransform: 'uppercase' as const,
    },
    link: {
      fontFamily: Font.medium,
      fontSize: FontSize.base,
      lineHeight: FontSize.base * LineHeight.normal,
      textDecorationLine: 'underline' as const,
      color: c.accent,
    },
    body: {
      fontFamily: Font.regular,
      fontSize: FontSize.base,
      lineHeight: FontSize.base * LineHeight.relaxed,
      color: c.text,
    },
    bodyMuted: {
      fontFamily: Font.regular,
      fontSize: FontSize.base,
      lineHeight: FontSize.base * LineHeight.relaxed,
      color: c.textMuted,
    },
    bodySmall: {
      fontFamily: Font.regular,
      fontSize: FontSize.sm,
      lineHeight: FontSize.sm * LineHeight.relaxed,
      color: c.text,
    },
    bodySmallMuted: {
      fontFamily: Font.regular,
      fontSize: FontSize.sm,
      lineHeight: FontSize.sm * LineHeight.relaxed,
      color: c.textMuted,
    },
    caption: {
      fontFamily: Font.regular,
      fontSize: FontSize.xs,
      letterSpacing: LetterSpacing.wide,
      lineHeight: FontSize.xs * LineHeight.normal,
      color: c.textMuted,
    },
    inputLabel: {
      fontFamily: Font.medium,
      fontSize: FontSize.sm,
      lineHeight: FontSize.sm * LineHeight.normal,
      color: c.text,
    },
    errorText: {
      fontFamily: Font.regular,
      fontSize: FontSize.sm,
      lineHeight: FontSize.sm * LineHeight.normal,
      color: c.error,
    },
  };
}

export type CustomerTextStyles = ReturnType<typeof createCustomerText>;
export type CustomerTextVariant = keyof CustomerTextStyles;

// Memoised per palette, so a style factory can spread a text preset without
// rebuilding the whole preset table on every call.
const textCache = new WeakMap<CustomerPalette, CustomerTextStyles>();

export function textFor(c: CustomerPalette): CustomerTextStyles {
  let cached = textCache.get(c);
  if (!cached) {
    cached = createCustomerText(c);
    textCache.set(c, cached);
  }
  return cached;
}

// Light-mode presets for the few call sites that are outside React (and for
// colour-free presets such as `ctaLabel`).
export const CustomerText = createCustomerText(lightPalette);

// The customer flow uses 24pt gutters throughout; `Layout.screenPaddingH` is 16
// and is relied on by seller screens, so override here rather than changing it.
export const CustomerLayout = {
  screenPaddingH: Spacing[6],
  sectionPaddingV: Spacing[8],
  sectionGap: Spacing[5],
  cardRadius: 0,
  controlHeight: 50,
  ctaHeight: 56,
  swatchSize: 50,
  headerHeight: 56,
} as const;

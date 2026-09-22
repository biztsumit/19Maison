import { Colors } from './colors';
import { Font, FontSize, LetterSpacing, LineHeight } from './typography';
import { Spacing } from './spacing';

// Semantic light-theme palette for the customer flow.
// Seller/staff screens depend on the raw `Colors` names, so this aliases rather than renames.
export const CustomerColors = {
  bg: Colors.white,
  bgAlt: Colors.offWhite,
  bgDark: Colors.sectionDark,
  bgDarkAlt: Colors.sectionDarkAlt,
  bgGold: Colors.sectionGold,

  border: Colors.lightBorder,
  borderStrong: Colors.textDark,

  text: Colors.textDark,
  textMuted: Colors.textGray,
  textInverse: Colors.white,
  textInverseMuted: 'rgba(255,255,255,0.72)',

  accent: Colors.gold,
  accentLight: Colors.goldLight,
  accentDark: Colors.goldDark,
  accentMuted: Colors.goldMuted,
  accentGradient: Colors.goldGradient,

  success: Colors.success,
  error: Colors.error,
  warning: Colors.warning,
  info: Colors.info,

  overlayLight: Colors.overlay40,
  overlayMedium: Colors.overlay60,
  overlayHeavy: Colors.overlay80,

  frostedLight: 'rgba(255,255,255,0.15)',
  frostedDark: 'rgba(0,0,0,0.35)',

  inputBg: '#F5F5F5',
  skeleton: '#EDEDED',

  transparent: Colors.transparent,
} as const;

// Composed presets. Each bundles family + size + lineHeight + colour so screens
// stop redeclaring five properties per text node.
export const CustomerText = {
  sectionHeading: {
    fontFamily: Font.semibold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.snug,
    color: CustomerColors.text,
  },
  sectionHeadingOnDark: {
    fontFamily: Font.semibold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.snug,
    color: CustomerColors.textInverse,
  },
  screenTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * LineHeight.snug,
    color: CustomerColors.text,
  },
  eyebrow: {
    fontFamily: Font.medium,
    fontSize: FontSize.sm,
    letterSpacing: LetterSpacing.widest,
    lineHeight: FontSize.sm * LineHeight.normal,
    textTransform: 'uppercase' as const,
    color: CustomerColors.accent,
  },
  cardTitle: {
    fontFamily: Font.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.snug,
    color: CustomerColors.text,
  },
  cardBrand: {
    fontFamily: Font.semibold,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.snug,
    color: CustomerColors.text,
  },
  cardPrice: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.snug,
    color: CustomerColors.text,
  },
  priceLarge: {
    fontFamily: Font.bold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * LineHeight.snug,
    color: CustomerColors.text,
  },
  priceStrike: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.snug,
    textDecorationLine: 'line-through' as const,
    color: CustomerColors.textMuted,
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
    color: CustomerColors.accent,
  },
  body: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.relaxed,
    color: CustomerColors.text,
  },
  bodyMuted: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.relaxed,
    color: CustomerColors.textMuted,
  },
  bodySmall: {
    fontFamily: Font.regular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.relaxed,
    color: CustomerColors.text,
  },
  bodySmallMuted: {
    fontFamily: Font.regular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.relaxed,
    color: CustomerColors.textMuted,
  },
  caption: {
    fontFamily: Font.regular,
    fontSize: FontSize.xs,
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSize.xs * LineHeight.normal,
    color: CustomerColors.textMuted,
  },
  inputLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
    color: CustomerColors.text,
  },
  errorText: {
    fontFamily: Font.regular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
    color: CustomerColors.error,
  },
} as const;

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

export type CustomerTextVariant = keyof typeof CustomerText;

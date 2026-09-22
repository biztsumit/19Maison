import { Colors } from './colors';

// The customer flow ships a light and a dark palette. Both expose the same keys so
// a screen never branches on the scheme — it reads a token and gets the right value.
//
// Token groups, and the rule for each:
//   bg*          page/band surfaces. `bgDark` is *deliberately* black in BOTH schemes:
//                it is a brand contrast band (hero, footer, newsletter), not "the dark
//                version of the page". `bgGold` deepens to bronze in dark mode so the
//                ordinary page text sitting on it stays legible.
//   inverseSurface / onInverse
//                the filled-control pair (solid button, selected chip, checked box).
//                Black-on-white in light, white-on-black in dark, so a primary button
//                is always the highest-contrast thing on the page.
//   textInverse* text that sits on `bgDark`, on a gold band or over an image. Light in
//                both schemes, because those surfaces are dark in both schemes.
export interface CustomerPalette {
  bg: string;
  bgAlt: string;
  bgElevated: string;
  bgDark: string;
  bgDarkAlt: string;
  bgGold: string;
  /** Toasts and banners: a dark card that floats over the page in both schemes,
   *  lifted in dark mode so it does not merge into the background. */
  bgNotice: string;

  border: string;
  borderStrong: string;

  text: string;
  textMuted: string;
  textInverse: string;
  textInverseMuted: string;

  inverseSurface: string;
  onInverse: string;
  /** Text/icon colour for anything sitting on `accent` or `bgGold`. Gold is a light
   *  surface in both schemes, so this stays dark. */
  onAccent: string;

  accent: string;
  accentLight: string;
  accentDark: string;
  accentMuted: string;
  accentGradient: readonly [string, string, ...string[]];

  success: string;
  error: string;
  warning: string;
  info: string;

  overlayLight: string;
  overlayMedium: string;
  overlayHeavy: string;

  frostedLight: string;
  frostedDark: string;

  /** The sign-in canvas. Pinned dark in both schemes: the auth screens are a
   *  full-bleed brand moment in the design, not a page of the storefront. Kept as
   *  palette tokens so flipping them to follow the scheme is a one-file change. */
  authBg: string;
  authSurface: string;
  authBorder: string;
  authText: string;
  authTextMuted: string;

  inputBg: string;
  skeleton: string;

  transparent: string;
}

export const lightPalette: CustomerPalette = {
  bg: Colors.white,
  bgAlt: Colors.offWhite,
  bgElevated: Colors.white,
  bgDark: Colors.sectionDark,
  bgDarkAlt: Colors.sectionDarkAlt,
  bgGold: Colors.sectionGold,
  bgNotice: Colors.sectionDark,

  border: Colors.lightBorder,
  borderStrong: Colors.textDark,

  text: Colors.textDark,
  textMuted: Colors.textGray,
  textInverse: Colors.white,
  textInverseMuted: 'rgba(255,255,255,0.72)',

  inverseSurface: Colors.sectionDark,
  onInverse: Colors.white,
  onAccent: Colors.textDark,

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

  authBg: '#000000',
  authSurface: '#131313',
  authBorder: 'rgba(98, 98, 98, 0.87)',
  authText: '#F9F9F9',
  authTextMuted: '#626262',

  inputBg: '#F5F5F5',
  skeleton: '#EDEDED',

  transparent: Colors.transparent,
};

export const darkPalette: CustomerPalette = {
  // Not near-black: the brand's contrast bands are pure #000 (and the native splash
  // is too), so the page has to sit a clear step above them or every dark section,
  // hero and footer would vanish into the page it is meant to stand out from.
  bg: '#121212',
  bgAlt: '#1A1A1A',
  bgElevated: '#202020',
  bgDark: '#000000',
  bgDarkAlt: '#0D0D0D',
  // A deep bronze rather than the bright #D4AF37 band: gold sections carry ordinary
  // page text, which has to stay legible once that text is near-white.
  bgGold: '#3A2E0F',
  bgNotice: '#242424',

  border: 'rgba(255,255,255,0.14)',
  borderStrong: 'rgba(255,255,255,0.72)',

  // #F2F2F2 rather than #FFF — pure white on near-black is what makes dark themes
  // feel like they vibrate.
  text: '#F2F2F2',
  textMuted: '#A0A0A0',
  textInverse: Colors.white,
  textInverseMuted: 'rgba(255,255,255,0.72)',

  inverseSurface: '#F2F2F2',
  onInverse: '#121212',
  onAccent: '#141414',

  // Lifted a little: #D4AF37 reads muddy against a dark surface.
  accent: '#E0BC5C',
  accentLight: Colors.goldLight,
  accentDark: Colors.goldDark,
  accentMuted: 'rgba(224, 188, 92, 0.18)',
  accentGradient: Colors.goldGradient,

  success: '#5BC48F',
  error: '#F0736F',
  warning: '#F0B429',
  info: '#57ACEC',

  overlayLight: 'rgba(0,0,0,0.5)',
  overlayMedium: 'rgba(0,0,0,0.7)',
  overlayHeavy: 'rgba(0,0,0,0.88)',

  frostedLight: 'rgba(255,255,255,0.10)',
  frostedDark: 'rgba(0,0,0,0.45)',

  authBg: '#000000',
  authSurface: '#131313',
  authBorder: 'rgba(98, 98, 98, 0.87)',
  authText: '#F9F9F9',
  authTextMuted: '#626262',

  inputBg: '#1C1C1C',
  skeleton: '#242424',

  transparent: Colors.transparent,
};

export const palettes = { light: lightPalette, dark: darkPalette } as const;

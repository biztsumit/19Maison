export const Colors = {
  // === Dark theme (seller screens) ===
  black: '#0A0A0A',
  surface: '#141414',
  surfaceElevated: '#1E1E1E',
  surfaceHighlight: '#2A2A2A',
  border: '#2A2A2A',
  borderSubtle: '#1E1E1E',

  // === Light theme (customer/auth — Figma accurate) ===
  white: '#FFFFFF',
  offWhite: '#F9F9F9',
  lightBorder: 'rgba(221, 221, 221, 0.87)',
  textDark: '#000000',
  textGray: '#626262',
  textLight: '#F9F9F9',
  sectionDark: '#000000',
  sectionDarkAlt: '#0D0D0D',
  sectionGold: '#D4AF37',
  sectionGray: '#F9F9F9',

  // === Gold (Figma exact: #D4AF37) ===
  gold: '#D4AF37',
  goldLight: '#FCF6BA',
  goldDark: '#BF953F',
  goldMuted: 'rgba(249, 195, 85, 0.24)',
  goldGradient: ['#BF953F', '#FCF6BA', '#B38728', '#FBF5B7', '#AA771C'] as const,

  // Amber (seller tab accent)
  amber: '#D4A853',
  amberLight: '#E0BC6E',
  amberDark: '#B08030',

  // Text (dark theme)
  textPrimary: '#FFFFFF',
  textSecondary: '#A8A8A8',
  textMuted: '#666666',
  textInverse: '#0A0A0A',
  textGold: '#D4AF37',

  // Status
  success: '#4CAF82',
  successBg: '#0D2B1E',
  error: '#E05555',
  errorBg: '#2B0D0D',
  warning: '#F59E0B',
  warningBg: '#2B200D',
  info: '#3B9EE8',
  infoBg: '#0D1E2B',

  // Overlays
  overlay40: 'rgba(0,0,0,0.4)',
  overlay60: 'rgba(0,0,0,0.6)',
  overlay80: 'rgba(0,0,0,0.8)',
  whiteOverlay08: 'rgba(255,255,255,0.08)',
  whiteOverlay15: 'rgba(255,255,255,0.15)',

  transparent: 'transparent',
  cream: '#F5F0E8',
} as const;

export type ColorKey = keyof typeof Colors;

import { Platform } from 'react-native';

export const Palette = {
  // Medical Forest Green & Mint Emerald palette
  primary: '#0A5C36',         // Medical Forest Green
  primaryDark: '#052E16',
  primaryLight: '#15803D',
  primaryAccent: '#10B981',   // Mint Emerald
  primarySoft: '#ECFDF5',     // Soft Mint background
  primaryMuted: '#D1FAE5',
  primaryBorder: '#A7F3D0',

  subsidizedGold: '#B45309',
  subsidizedSoft: '#FEF3C7',
  subsidizedBorder: '#FDE68A',

  alertRed: '#DC2626',
  alertRedSoft: '#FEE2E2',
  alertRedBorder: '#FECACA',

  successGreen: '#059669',
  successGreenSoft: '#ECFDF5',
  successGreenBorder: '#A7F3D0',

  gold: '#D97706',
  goldLight: '#FEF3C7',
  goldBorder: '#FDE68A',

  heroAlert: '#0A5C36',
  heroAlertRing: 'rgba(10, 92, 54, 0.12)',
  heroAlertBorder: 'rgba(10, 92, 54, 0.22)',

  // Surface and slate neutrals
  zinc50: '#F8FAFC',
  zinc100: '#F1F5F9',
  zinc200: '#E2E8F0',
  zinc300: '#CBD5E1',
  zinc400: '#94A3B8',
  zinc500: '#64748B',
  zinc600: '#475569',
  zinc700: '#334155',
  zinc800: '#1E293B',
  zinc900: '#0F172A',
  zinc950: '#020617',

  white: '#FFFFFF',
  black: '#000000',
  navySlate: '#0F172A',
  navySlateBorder: '#1E293B',

  // CBHI Status tokens
  status: {
    active: {
      bg: '#ECFDF5',
      border: '#A7F3D0',
      text: '#047857',
      dot: '#10B981',
    },
    subsidized: {
      bg: '#FEF3C7',
      border: '#FDE68A',
      text: '#B45309',
      dot: '#D97706',
    },
    expired: {
      bg: '#FEE2E2',
      border: '#FECACA',
      text: '#B91C1C',
      dot: '#DC2626',
    },
    pending: {
      bg: '#F1F5F9',
      border: '#E2E8F0',
      text: '#64748B',
      dot: '#94A3B8',
    },
  },
} as const;

export const COLORS = {
  primary: Palette.primary,
  primaryDark: Palette.primaryDark,
  primaryLight: Palette.primaryLight,
  primaryAccent: Palette.primaryAccent,
  primarySoft: Palette.primarySoft,
  primaryMuted: Palette.primaryMuted,
  primaryBorder: Palette.primaryBorder,

  subsidizedGold: Palette.subsidizedGold,
  subsidizedSoft: Palette.subsidizedSoft,
  subsidizedBorder: Palette.subsidizedBorder,

  expiredRed: Palette.alertRed,
  expiredSoft: Palette.alertRedSoft,

  navy: '#0F2D59',
  background: '#F8FAFC',
  card: '#FFFFFF',
  surface: '#F1F5F9',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
  textLight: '#94A3B8',
  white: '#FFFFFF',
};

export const Colors = {
  light: {
    background: '#F8FAFC',
    card: Palette.white,
    cardHeader: Palette.primarySoft,
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: Palette.zinc400,
    border: '#E2E8F0',
    borderMuted: '#F1F5F9',
    primary: Palette.primary,
    primaryForeground: Palette.white,
    secondary: Palette.primarySoft,
    secondaryForeground: Palette.primary,
    input: '#FFFFFF',
    inputBorder: '#E2E8F0',
    inputPlaceholder: '#94A3B8',
    backgroundElement: Palette.primarySoft,
    backgroundSelected: '#D1FAE5',
    destructive: '#DC2626',
    tint: Palette.primary,
    icon: '#64748B',
    tabIconDefault: '#64748B',
    tabIconSelected: Palette.primary,
  },
  dark: {
    background: '#0F172A',
    card: '#1E293B',
    cardHeader: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    border: '#334155',
    borderMuted: '#1E293B',
    primary: '#10B981',
    primaryForeground: '#FFFFFF',
    secondary: '#1E293B',
    secondaryForeground: '#A7F3D0',
    input: '#1E293B',
    inputBorder: '#334155',
    inputPlaceholder: '#64748B',
    backgroundElement: '#1E293B',
    backgroundSelected: '#064E3B',
    destructive: '#EF4444',
    tint: '#10B981',
    icon: '#94A3B8',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#10B981',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semiBold: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
  sans: 'DMSans_400Regular',
  mono: Platform.select({
    ios: 'Courier New',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const Typography = {
  h1: {
    fontSize: 22,
    fontWeight: '700' as const,
    fontFamily: Fonts.bold,
    letterSpacing: -0.4,
    color: '#0F172A',
  },
  h2: {
    fontSize: 18,
    fontWeight: '700' as const,
    fontFamily: Fonts.bold,
    letterSpacing: -0.3,
    color: '#0F172A',
  },
  h3: {
    fontSize: 15,
    fontWeight: '600' as const,
    fontFamily: Fonts.medium,
    letterSpacing: -0.2,
    color: '#0F172A',
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: Fonts.regular,
    color: '#334155',
    lineHeight: 20,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily: Fonts.medium,
    color: '#0F172A',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: Fonts.regular,
    color: '#64748B',
  },
  overline: {
    fontSize: 11,
    fontWeight: '700' as const,
    fontFamily: Fonts.bold,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    color: '#64748B',
  },
  mono: {
    fontSize: 13,
    fontWeight: '600' as const,
    fontFamily: Fonts.mono,
    letterSpacing: 0.5,
    color: Palette.primary,
  },
  headline: {
    fontSize: 22,
    fontWeight: '700' as const,
    fontFamily: Fonts.bold,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: Fonts.medium,
  },
};

export const Radii = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
  full: 9999,
};

export const Shadows = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0A5C36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const MUNICIPAL_HEADER = {
  subcityEn: 'Nifas Silk Lafto Subcity Administration',
  subcityAm: 'ንፋስ ስልክ ላፍቶ ክፍለ ከተማ አስተዳደር',
  officeEn: 'Subcity Health Office — CBHI Scheme',
  officeAm: 'የጤና ጽ/ቤት — ማህበረሰብ አቀፍ ጤና መድህን',
  schemeCode: 'NSL-HEALTH-CBHI',
};

// Premium Athletic & Lifestyle Design System (Apple Fitness+, Nike, WHOOP, Linear)
// Supports both Light and Dark modes with System theme default.

export interface ColorPalette {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSubtle: string;

  border: string;
  borderLight: string;
  borderFocus: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;

  primary: string;
  primaryText: string;

  accent: string;
  accentSoft: string;
  accentSubtle: string;

  coral: string;
  coralSoft: string;
  blue: string;
  blueSoft: string;

  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;

  white: string;
  white70: string;
  white50: string;
  white30: string;
  white12: string;
  white06: string;
  black: string;
  cardShadow: string;
}

export const darkColors: ColorPalette = {
  background: '#09070F',
  surface: '#13101D',
  surfaceElevated: '#1C172B',
  surfaceSubtle: '#26203B',

  border: 'rgba(168, 85, 247, 0.12)',
  borderLight: 'rgba(168, 85, 247, 0.20)',
  borderFocus: '#8B5CF6',

  textPrimary: '#FFFFFF',
  textSecondary: '#C4B5FD',
  textMuted: '#8B82A8',
  textDisabled: '#564E6E',

  primary: '#FFFFFF',
  primaryText: '#09070F',

  accent: '#8B5CF6',
  accentSoft: 'rgba(139, 92, 246, 0.18)',
  accentSubtle: 'rgba(139, 92, 246, 0.08)',

  coral: '#F472B6',
  coralSoft: 'rgba(244, 114, 182, 0.15)',
  blue: '#A78BFA',
  blueSoft: 'rgba(167, 139, 250, 0.15)',

  success: '#10B981',
  successSoft: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.15)',
  danger: '#EF4444',
  dangerSoft: 'rgba(239, 68, 68, 0.15)',

  white: '#FFFFFF',
  white70: 'rgba(255, 255, 255, 0.70)',
  white50: 'rgba(255, 255, 255, 0.50)',
  white30: 'rgba(255, 255, 255, 0.30)',
  white12: 'rgba(255, 255, 255, 0.12)',
  white06: 'rgba(255, 255, 255, 0.06)',
  black: '#000000',
  cardShadow: 'rgba(0, 0, 0, 0.45)',
};

export const lightColors: ColorPalette = {
  background: '#FAF8FF',
  surface: '#FFFFFF',
  surfaceElevated: '#F3EEFF',
  surfaceSubtle: '#E9E0FD',

  border: 'rgba(124, 58, 237, 0.08)',
  borderLight: 'rgba(124, 58, 237, 0.14)',
  borderFocus: '#7C3AED',

  textPrimary: '#19142E',
  textSecondary: '#554B75',
  textMuted: '#7E73A1',
  textDisabled: '#A89EC5',

  primary: '#19142E',
  primaryText: '#FFFFFF',

  accent: '#7C3AED',
  accentSoft: 'rgba(124, 58, 237, 0.12)',
  accentSubtle: 'rgba(124, 58, 237, 0.05)',

  coral: '#DB2777',
  coralSoft: 'rgba(219, 39, 119, 0.12)',
  blue: '#6D28D9',
  blueSoft: 'rgba(109, 40, 217, 0.12)',

  success: '#059669',
  successSoft: 'rgba(5, 150, 105, 0.12)',
  warning: '#D97706',
  warningSoft: 'rgba(217, 119, 6, 0.12)',
  danger: '#DC2626',
  dangerSoft: 'rgba(220, 38, 38, 0.12)',

  white: '#FFFFFF',
  white70: 'rgba(0, 0, 0, 0.70)',
  white50: 'rgba(0, 0, 0, 0.50)',
  white30: 'rgba(0, 0, 0, 0.30)',
  white12: 'rgba(0, 0, 0, 0.08)',
  white06: 'rgba(0, 0, 0, 0.04)',
  black: '#000000',
  cardShadow: 'rgba(124, 58, 237, 0.08)',
};

// Default export for backwards compatibility
export const colors: ColorPalette = darkColors;

export const typography = {
  displayLarge: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  headlineLarge: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  headlineMedium: {
    fontSize: 19,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 25,
  },
  headlineSmall: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 21,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  labelLarge: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  metricLarge: {
    fontSize: 44,
    fontWeight: '700' as const,
    letterSpacing: -1,
    lineHeight: 48,
  },
  metricMedium: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

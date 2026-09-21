/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LUXURY DESIGN SYSTEM · "Quiet Athletic Luxury"
 *  Single source of truth for the palette, radii, spacing and type scale used
 *  across the redesigned Dashboard, Tab Bar and shared components.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useMemo } from 'react';
import { Platform } from 'react-native';
import { useTheme } from './ThemeContext';

/* ── Palette ──────────────────────────────────────────────────────────────── */

export const LUXURY_PALETTE = {
  /** Deep Midnight Violet Obsidian — the primary dark experience. */
  dark: {
    background: '#09070F',
    backgroundElevated: '#0B0813',
    surface: '#13101D',
    surfaceRaised: '#1A1626',
    hairline: 'rgba(168, 85, 247, 0.12)',
    hairlineStrong: 'rgba(168, 85, 247, 0.24)',
    textPrimary: '#F5F3FF',
    textSecondary: '#ABA5C5',
    textMuted: '#6F6989',
    accent: '#8B5CF6',
    accentSoft: '#C4B5FD',
    orchid: '#C084FC',
    rose: '#F472B6',
    gold: '#F59E0B',
    success: '#3DDC97',
    track: 'rgba(245, 243, 255, 0.07)',
    pillFill: 'rgba(139, 92, 246, 0.12)',
    pillBorder: 'rgba(139, 92, 246, 0.28)',
    chartGrid: 'rgba(168, 85, 247, 0.08)',
    tabBar: 'rgba(10, 8, 17, 0.98)',
    glow: 'rgba(139, 92, 246, 0.55)',
  },
  /** Pure Lilac Mist — daylight companion with deep indigo typography. */
  light: {
    background: '#F3EEFA',
    backgroundElevated: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceRaised: '#EDE5F8',
    hairline: 'rgba(25, 20, 46, 0.08)',
    hairlineStrong: 'rgba(124, 58, 237, 0.25)',
    textPrimary: '#19142E',
    textSecondary: '#5C5578',
    textMuted: '#857D9E',
    accent: '#7C3AED',
    accentSoft: '#6D28D9',
    orchid: '#A855F7',
    rose: '#EC4899',
    gold: '#D97706',
    success: '#0F9D77',
    track: 'rgba(124, 58, 237, 0.08)',
    pillFill: 'rgba(124, 58, 237, 0.12)',
    pillBorder: 'rgba(124, 58, 237, 0.28)',
    chartGrid: 'rgba(124, 58, 237, 0.08)',
    tabBar: 'rgba(255, 255, 255, 0.95)',
    glow: 'rgba(124, 58, 237, 0.45)',
  },
} as const;

export type LuxuryPalette = {
  [K in keyof typeof LUXURY_PALETTE.dark]: string;
};

/* ── Geometry & type scale ───────────────────────────────────────────────── */

export const RADII = { xs: 10, sm: 14, md: 18, lg: 24, xl: 28, full: 999 } as const;

export const SPACE = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 } as const;

const SYSTEM_FONT = Platform.select({ ios: 'System', default: 'sans-serif' });

export const TYPE = {
  microLabel: { fontSize: 10, fontWeight: '600' as const, letterSpacing: 1.4, fontFamily: SYSTEM_FONT },
  eyebrow: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.6, fontFamily: SYSTEM_FONT },
  body: { fontSize: 13, fontWeight: '500' as const, fontFamily: SYSTEM_FONT },
  caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.1, fontFamily: SYSTEM_FONT },
  heading: { fontSize: 17, fontWeight: '700' as const, letterSpacing: -0.2, fontFamily: SYSTEM_FONT },
  title: { fontSize: 23, fontWeight: '800' as const, letterSpacing: -0.6, fontFamily: SYSTEM_FONT },
  metric: { fontSize: 21, fontWeight: '800' as const, letterSpacing: -0.3, fontFamily: SYSTEM_FONT },
  heroMetric: { fontSize: 34, fontWeight: '800' as const, letterSpacing: -1, fontFamily: SYSTEM_FONT },
} as const;

/* ── Shadow depth systems ────────────────────────────────────────────────── */

export const SHADOWS = {
  glassCard: (isDark: boolean, accentGlow?: string) => ({
    boxShadow: isDark
      ? `0px 4px 10px rgba(0, 0, 0, 0.40), 0px 14px 28px rgba(0, 0, 0, 0.60), 0px 22px 44px ${accentGlow ?? 'rgba(124, 58, 237, 0.22)'}`
      : `0px 4px 10px rgba(76, 29, 149, 0.08), 0px 14px 28px rgba(109, 40, 217, 0.14), 0px 22px 44px ${accentGlow ?? 'rgba(124, 58, 237, 0.10)'}`,
    shadowColor: isDark ? '#000000' : 'rgba(109, 40, 217, 0.45)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: isDark ? 0.45 : 0.18,
    shadowRadius: 22,
    elevation: 0,
  }),
  glassCardElevated: (isDark: boolean, accentGlow?: string) => ({
    boxShadow: isDark
      ? `0px 6px 14px rgba(0, 0, 0, 0.45), 0px 20px 38px rgba(0, 0, 0, 0.70), 0px 30px 56px ${accentGlow ?? 'rgba(168, 85, 247, 0.28)'}`
      : `0px 6px 14px rgba(76, 29, 149, 0.10), 0px 18px 36px rgba(109, 40, 217, 0.20), 0px 28px 52px ${accentGlow ?? 'rgba(124, 58, 237, 0.16)'}`,
    shadowColor: isDark ? '#000000' : 'rgba(109, 40, 217, 0.55)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: isDark ? 0.55 : 0.22,
    shadowRadius: 28,
    elevation: 0,
  }),
  glassCardSubtle: (isDark: boolean) => ({
    boxShadow: isDark
      ? '0px 2px 6px rgba(0, 0, 0, 0.30), 0px 8px 18px rgba(0, 0, 0, 0.45)'
      : '0px 2px 6px rgba(76, 29, 149, 0.05), 0px 8px 18px rgba(109, 40, 217, 0.09)',
    shadowColor: isDark ? '#000000' : 'rgba(109, 40, 217, 0.35)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: isDark ? 0.32 : 0.12,
    shadowRadius: 14,
    elevation: 0,
  }),
} as const;

/* ── Colour utilities ────────────────────────────────────────────────────── */

/** `#8B5CF6` + 0.1 → `rgba(139, 92, 246, 0.1)`. Safe on malformed input. */
export function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.trim().replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const int = Number.parseInt(full, 16);
  if (!Number.isFinite(int) || full.length !== 6) return hex;
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, alpha))})`;
}

function isColorDark(color: string): boolean {
  let r = 0;
  let g = 0;
  let b = 0;
  const trimmed = color.trim();
  if (trimmed.startsWith('#')) {
    const raw = trimmed.replace('#', '');
    const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
    const int = Number.parseInt(full, 16);
    if (!Number.isFinite(int) || full.length !== 6) return true;
    r = (int >> 16) & 255;
    g = (int >> 8) & 255;
    b = int & 255;
  } else {
    const match = trimmed.match(/rgba?\(([^)]+)\)/);
    if (!match) return true;
    const parts = match[1].split(',').map((p) => Number.parseFloat(p));
    r = parts[0] ?? 0;
    g = parts[1] ?? 0;
    b = parts[2] ?? 0;
  }
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.45;
}

/* ── Theme adapter ───────────────────────────────────────────────────────── */

/**
 * Resolves `isDark` from any common theme-provider shape:
 *   { isDark } · { colorScheme } · { scheme } · { theme: { isDark | dark | colors } }
 * Falls back to dark (the flagship experience) when nothing matches.
 */
function resolveIsDark(context: unknown): boolean {
  if (!context || typeof context !== 'object') return true;
  const ctx = context as Record<string, any>;
  if (typeof ctx.isDark === 'boolean') return ctx.isDark;
  if (typeof ctx.colorScheme === 'string') return ctx.colorScheme !== 'light';
  if (typeof ctx.scheme === 'string') return ctx.scheme !== 'light';

  const theme = ctx.theme;
  if (theme && typeof theme === 'object') {
    if (typeof theme.isDark === 'boolean') return theme.isDark;
    if (typeof theme.dark === 'boolean') return theme.dark;
    if (typeof theme.name === 'string') return theme.name !== 'light';
    const background = theme.colors?.background ?? theme.background;
    if (typeof background === 'string') return isColorDark(background);
  }
  if (typeof ctx.colors?.background === 'string') return isColorDark(ctx.colors.background);
  return true;
}

export interface LuxuryTheme {
  isDark: boolean;
  palette: LuxuryPalette;
  radii: typeof RADII;
  spacing: typeof SPACE;
  type: typeof TYPE;
}

/**
 * The one hook every redesigned file consumes.
 * Wraps YOUR `useTheme()` and returns the full luxury token set.
 */
export function useLuxuryTheme(): LuxuryTheme {
  const { isDark } = useTheme();
  const palette = isDark ? LUXURY_PALETTE.dark : LUXURY_PALETTE.light;
  return useMemo(
    () => ({ isDark, palette, radii: RADII, spacing: SPACE, type: TYPE }),
    [isDark, palette],
  );
}

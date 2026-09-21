import { colors, darkColors, lightColors, ColorPalette, typography, spacing, radii } from './tokens';
import { ThemeProvider, useTheme, ThemeMode } from './ThemeContext';

export {
  colors,
  darkColors,
  lightColors,
  ColorPalette,
  typography,
  spacing,
  radii,
  ThemeProvider,
  useTheme,
  ThemeMode,
};

export const theme = {
  colors,
  typography,
  spacing,
  radii,
} as const;

export type Theme = typeof theme;
export default theme;

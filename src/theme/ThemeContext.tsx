import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, ColorPalette, typography, spacing, radii } from './tokens';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ColorPalette;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const STORAGE_KEY = '@fit_ai_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useRNColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');

  // Load saved theme preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((savedMode) => {
      if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
        setThemeModeState(savedMode);
      }
    }).catch((err) => {
      console.warn('Failed to load theme preference:', err);
    });
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
    } catch (err) {
      console.warn('Failed to save theme preference:', err);
    }
  };

  const toggleTheme = async () => {
    const nextMode: ThemeMode =
      themeMode === 'system' ? 'light' : themeMode === 'light' ? 'dark' : 'system';
    await setThemeMode(nextMode);
  };

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemScheme]);

  const colors = useMemo(() => {
    return isDark ? darkColors : lightColors;
  }, [isDark]);

  const value = useMemo(
    () => ({
      themeMode,
      isDark,
      colors,
      typography,
      spacing,
      radii,
      setThemeMode,
      toggleTheme,
    }),
    [themeMode, isDark, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside provider
    const isDark = true;
    return {
      themeMode: 'system',
      isDark: true,
      colors: darkColors,
      typography,
      spacing,
      radii,
      setThemeMode: async () => {},
      toggleTheme: async () => {},
    };
  }
  return context;
};

export default ThemeContext;

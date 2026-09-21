/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THEME SWITCHER · "Liquid Glass Theme Control"
 *  Allows instant switching between System, Light, and Dark themes.
 *  Supports:
 *    - 'segmented': Full 3-option pill [ System | Light | Dark ]
 *    - 'compact': 44x44 liquid glass button that cycles modes on tap
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, type ThemeMode } from '@/theme/ThemeContext';
import { useLuxuryTheme, hexToRgba } from '@/theme/luxury';

interface ThemeSwitcherProps {
  variant?: 'segmented' | 'compact';
  style?: StyleProp<ViewStyle>;
  size?: number;
}

const MODES: Array<{ mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { mode: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { mode: 'light', label: 'Light', icon: 'sunny-outline' },
  { mode: 'dark', label: 'Dark', icon: 'moon-outline' },
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'segmented',
  style,
  size = 44,
}) => {
  const { themeMode, setThemeMode, toggleTheme } = useTheme();
  const { palette, isDark } = useLuxuryTheme();

  if (variant === 'compact') {
    const currentMode = MODES.find((m) => m.mode === themeMode) || MODES[0];
    const activeIcon =
      themeMode === 'light'
        ? 'sunny'
        : themeMode === 'dark'
        ? 'moon'
        : 'phone-portrait';

    return (
      <TouchableOpacity
        onPress={toggleTheme}
        activeOpacity={0.75}
        style={[
          styles.compactButton,
          {
            width: size,
            height: size,
            borderRadius: size * 0.36,
            borderColor: isDark
              ? hexToRgba(palette.accentSoft, 0.25)
              : hexToRgba(palette.accent, 0.20),
            backgroundColor: isDark
              ? 'rgba(25, 17, 46, 0.65)'
              : 'rgba(255, 255, 255, 0.85)',
          },
          style,
        ]}
      >
        {/* Specular top rim highlight */}
        <LinearGradient
          colors={
            isDark
              ? ['rgba(255, 255, 255, 0.45)', 'rgba(196, 181, 253, 0.2)', 'transparent']
              : ['rgba(255, 255, 255, 0.9)', 'rgba(196, 181, 253, 0.4)', 'transparent']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.compactSpecular}
        />

        <Ionicons
          name={activeIcon as any}
          size={Math.round(size * 0.45)}
          color={isDark ? palette.accentSoft : palette.accent}
        />
      </TouchableOpacity>
    );
  }

  // Segmented 3-option control
  return (
    <View
      style={[
        styles.segmentedContainer,
        {
          borderColor: isDark
            ? hexToRgba(palette.accentSoft, 0.2)
            : hexToRgba(palette.accent, 0.15),
          backgroundColor: isDark
            ? 'rgba(22, 15, 42, 0.65)'
            : 'rgba(255, 255, 255, 0.85)',
        },
        style,
      ]}
    >
      {/* Specular top rim */}
      <LinearGradient
        colors={
          isDark
            ? ['rgba(255, 255, 255, 0.35)', 'rgba(196, 181, 253, 0.15)', 'transparent']
            : ['rgba(255, 255, 255, 0.85)', 'rgba(196, 181, 253, 0.35)', 'transparent']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.segmentedSpecular}
      />

      {MODES.map((item) => {
        const isActive = themeMode === item.mode;
        return (
          <TouchableOpacity
            key={item.mode}
            onPress={() => setThemeMode(item.mode)}
            activeOpacity={0.8}
            style={[
              styles.segmentButton,
              isActive && styles.segmentButtonActive,
              isActive && {
                borderColor: hexToRgba(palette.accentSoft, isDark ? 0.55 : 0.4),
                borderTopColor: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.95)',
              },
            ]}
          >
            {isActive && (
              <LinearGradient
                colors={
                  isDark
                    ? ['#8B5CF6', '#6D28D9']
                    : ['#8B5CF6', '#7C3AED']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Ionicons
              name={item.icon}
              size={15}
              color={isActive ? '#FFFFFF' : palette.textMuted}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.segmentLabel,
                { color: isActive ? '#FFFFFF' : palette.textMuted },
                isActive && styles.segmentLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  compactButton: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 0,
  },
  compactSpecular: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    zIndex: 2,
  },
  segmentedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    padding: 4,
    gap: 4,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 0,
  },
  segmentedSpecular: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    zIndex: 2,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  segmentButtonActive: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 0,
  },
  segmentLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  segmentLabelActive: {
    fontWeight: '800',
  },
});

export default ThemeSwitcher;

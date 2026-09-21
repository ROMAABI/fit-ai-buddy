import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLuxuryTheme, hexToRgba, SHADOWS } from '../../theme/luxury';
import { LiquidBackground } from '../LiquidGlass';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  RISE ANIMATION
 *  Smooth spring-like upward fade entrance.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const Rise: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}> = ({ children, delay = 0, style }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [anim, delay]);

  return (
    <Animated.View
      style={[
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
              }),
            },
          ],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SCREEN SHELL
 *  Liquid glass container with ambient fluid background.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const ScreenShell: React.FC<{
  header?: React.ReactNode;
  children: React.ReactNode;
}> = ({ header, children }) => {
  const { palette } = useLuxuryTheme();

  return (
    <LiquidBackground style={styles.shellContainer}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {header}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </LiquidBackground>
  );
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  STEP HEADING
 *  Refined typography with luminous eyebrow and high-contrast titles.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const StepHeading: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
}> = ({ eyebrow, title, subtitle }) => {
  const { palette } = useLuxuryTheme();

  return (
    <View style={styles.headingContainer}>
      {eyebrow && (
        <View style={styles.eyebrowRow}>
          <View style={[styles.eyebrowDot, { backgroundColor: palette.accent }]} />
          <Text style={[styles.eyebrow, { color: palette.accentSoft }]}>{eyebrow}</Text>
        </View>
      )}
      <Text style={[styles.title, { color: palette.textPrimary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SELECTION CARD (LIQUID GLASS)
 *  Translucent glass container with specular top rim, fluid glow when selected,
 *  and tactile press feedback.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const SelectionCard: React.FC<{
  selected: boolean;
  onPress: () => void;
  children: React.ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}> = ({ selected, onPress, children, accessibilityLabel, style }) => {
  const { palette, isDark } = useLuxuryTheme();

  const cardBgColors = isDark
    ? selected
      ? [
          'rgba(139, 92, 246, 0.18)',
          'rgba(40, 26, 75, 0.75)',
          'rgba(18, 12, 38, 0.88)',
        ]
      : [
          'rgba(255, 255, 255, 0.05)',
          'rgba(25, 18, 48, 0.65)',
          'rgba(13, 9, 26, 0.80)',
        ]
    : selected
    ? [
        'rgba(240, 230, 255, 0.85)',
        'rgba(224, 208, 255, 0.65)',
        'rgba(215, 195, 255, 0.75)',
      ]
    : [
        'rgba(255, 255, 255, 0.74)',
        'rgba(247, 241, 255, 0.48)',
        'rgba(238, 228, 255, 0.58)',
      ];

  const specularColors = selected
    ? isDark
      ? ['rgba(255, 255, 255, 0.7)', 'rgba(196, 181, 253, 0.4)', 'transparent']
      : ['rgba(255, 255, 255, 1)', 'rgba(168, 85, 247, 0.6)', 'rgba(255, 255, 255, 0.9)']
    : isDark
    ? ['rgba(255, 255, 255, 0.4)', 'rgba(196, 181, 253, 0.15)', 'transparent']
    : ['rgba(255, 255, 255, 0.85)', 'rgba(196, 181, 253, 0.4)', 'rgba(255, 255, 255, 0.6)'];

  const sheenColors = isDark
    ? ['rgba(255, 255, 255, 0.06)', 'transparent']
    : ['rgba(255, 255, 255, 0.65)', 'rgba(245, 240, 255, 0.15)', 'transparent'];

  // Separate content layout styles (flexDirection, padding, alignItems) from outer positioning styles
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const {
    flexDirection,
    alignItems,
    justifyContent,
    padding: _p,
    paddingVertical,
    paddingHorizontal,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    ...outerStyle
  } = flattenedStyle as any;

  const contentLayoutStyle = {
    flexDirection,
    alignItems,
    justifyContent,
    padding: _p,
    paddingVertical,
    paddingHorizontal,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectionOuter,
        selected
          ? SHADOWS.glassCardElevated(isDark, palette.accent)
          : SHADOWS.glassCard(isDark),
        pressed && { transform: [{ scale: 0.985 }], opacity: 0.92 },
        outerStyle,
      ]}
    >
      <View
        style={[
          styles.selectionSurface,
          {
            borderColor: selected
              ? palette.accent
              : isDark
              ? hexToRgba(palette.accentSoft, 0.18)
              : 'rgba(124, 58, 237, 0.22)',
            borderTopColor: selected
              ? isDark
                ? 'rgba(255, 255, 255, 0.55)'
                : 'rgba(255, 255, 255, 1)'
              : isDark
              ? 'rgba(255, 255, 255, 0.28)'
              : 'rgba(255, 255, 255, 0.92)',
            borderBottomColor: selected
              ? palette.accent
              : isDark
              ? 'rgba(168, 85, 247, 0.15)'
              : 'rgba(124, 58, 237, 0.16)',
          },
        ]}
      >
        {/* Translucent Liquid Glass Fill */}
        <LinearGradient
          colors={cardBgColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Specular Top Rim Reflection */}
        <LinearGradient
          colors={specularColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.specularTopRim}
        />

        {/* Diagonal Glass Sheen */}
        <LinearGradient
          colors={sheenColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 0.6 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Content with layout styles (flexDirection, padding, etc.) */}
        <View style={contentLayoutStyle}>
          {children}
        </View>
      </View>
    </Pressable>
  );
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  RADIO DOT (LIQUID GLASS)
 *  Glass ring with glowing amethyst center when active.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const RadioDot: React.FC<{ selected: boolean }> = ({ selected }) => {
  const { palette, isDark } = useLuxuryTheme();

  return (
    <View
      style={[
        styles.radioOuter,
        {
          borderColor: selected
            ? palette.accent
            : isDark
            ? hexToRgba(palette.accentSoft, 0.28)
            : 'rgba(124, 58, 237, 0.35)',
          backgroundColor: selected
            ? hexToRgba(palette.accent, 0.15)
            : isDark
            ? 'rgba(255, 255, 255, 0.04)'
            : 'rgba(124, 58, 237, 0.06)',
        },
      ]}
    >
      {selected && (
        <View
          style={[
            styles.radioInner,
            {
              backgroundColor: palette.accent,
              shadowColor: palette.accent,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shellContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 36,
  },
  headingContainer: {
    marginBottom: 28,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  selectionOuter: {
    position: 'relative',
    overflow: 'visible',
    borderRadius: 20,
    marginBottom: 12,
  },
  selectionSurface: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  specularTopRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    zIndex: 2,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 0,
  },
});

import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect, Circle } from 'react-native-svg';
import { useLuxuryTheme, hexToRgba, SHADOWS } from '../theme/luxury';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LIQUID BACKGROUND
 *  Floating ambient fluid light orbs that illuminate translucent glass surfaces
 *  from beneath. Without this, dark glass appears flat and opaque.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const LiquidBackground: React.FC<{
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  const { palette, isDark } = useLuxuryTheme();

  return (
    <View style={[styles.backgroundContainer, { backgroundColor: palette.background }, style]}>
      {/* Ambient Liquid Glow Orbs (SVG Radial Gradients) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            {/* Top Left Orb: Prismatic Gleam */}
            <RadialGradient
              id="orbTopLeft"
              cx={SCREEN_WIDTH * 0.15}
              cy={SCREEN_HEIGHT * 0.08}
              rx={SCREEN_WIDTH * 0.55}
              ry={SCREEN_WIDTH * 0.5}
              fx={SCREEN_WIDTH * 0.15}
              fy={SCREEN_HEIGHT * 0.08}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={isDark ? "#6366F1" : "#818CF8"} stopOpacity={isDark ? 0.22 : 0.28} />
              <Stop offset="50%" stopColor={isDark ? "#8B5CF6" : "#C7D2FE"} stopOpacity={isDark ? 0.08 : 0.12} />
              <Stop offset="100%" stopColor={palette.background} stopOpacity={0} />
            </RadialGradient>

            {/* Top Right Orb: Royal Amethyst Aura */}
            <RadialGradient
              id="orbTopRight"
              cx={SCREEN_WIDTH * 0.85}
              cy={SCREEN_HEIGHT * 0.16}
              rx={SCREEN_WIDTH * 0.72}
              ry={SCREEN_WIDTH * 0.65}
              fx={SCREEN_WIDTH * 0.85}
              fy={SCREEN_HEIGHT * 0.16}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={isDark ? "#8B5CF6" : "#7C3AED"} stopOpacity={isDark ? 0.35 : 0.32} />
              <Stop offset="45%" stopColor={isDark ? "#7C3AED" : "#A78BFA"} stopOpacity={isDark ? 0.14 : 0.18} />
              <Stop offset="75%" stopColor={isDark ? "#6D28D9" : "#DDD6FE"} stopOpacity={isDark ? 0.06 : 0.08} />
              <Stop offset="100%" stopColor={palette.background} stopOpacity={0} />
            </RadialGradient>

            {/* Mid Left Orb: Luminous Orchid Fluid */}
            <RadialGradient
              id="orbMidLeft"
              cx={SCREEN_WIDTH * 0.08}
              cy={SCREEN_HEIGHT * 0.46}
              rx={SCREEN_WIDTH * 0.68}
              ry={SCREEN_WIDTH * 0.58}
              fx={SCREEN_WIDTH * 0.08}
              fy={SCREEN_HEIGHT * 0.46}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={isDark ? "#C084FC" : "#C026D3"} stopOpacity={isDark ? 0.28 : 0.26} />
              <Stop offset="45%" stopColor={isDark ? "#9333EA" : "#E879F9"} stopOpacity={isDark ? 0.10 : 0.14} />
              <Stop offset="75%" stopColor={isDark ? "#7E22CE" : "#F5D0FE"} stopOpacity={isDark ? 0.04 : 0.06} />
              <Stop offset="100%" stopColor={palette.background} stopOpacity={0} />
            </RadialGradient>

            {/* Bottom Right Orb: Electric Sapphire / Indigo Pool */}
            <RadialGradient
              id="orbBottomRight"
              cx={SCREEN_WIDTH * 0.82}
              cy={SCREEN_HEIGHT * 0.8}
              rx={SCREEN_WIDTH * 0.78}
              ry={SCREEN_WIDTH * 0.65}
              fx={SCREEN_WIDTH * 0.82}
              fy={SCREEN_HEIGHT * 0.8}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={isDark ? "#6366F1" : "#4F46E5"} stopOpacity={isDark ? 0.26 : 0.28} />
              <Stop offset="45%" stopColor={isDark ? "#4F46E5" : "#818CF8"} stopOpacity={isDark ? 0.08 : 0.14} />
              <Stop offset="75%" stopColor={isDark ? "#3730A3" : "#C7D2FE"} stopOpacity={isDark ? 0.03 : 0.06} />
              <Stop offset="100%" stopColor={palette.background} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          <Rect x="0" y="0" width="100%" height="100%" fill="url(#orbTopLeft)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#orbTopRight)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#orbMidLeft)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#orbBottomRight)" />
        </Svg>
      </View>

      {children}
    </View>
  );
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LIQUID GLASS CARD
 *  Multi-stop translucent glass with specular top-rim highlight, diagonal
 *  sheen reflection, and luminous hairline border.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export interface LiquidGlassCardProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  glowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
  variant?: 'base' | 'elevated' | 'subtle';
  bordered?: boolean;
  borderRadius?: number;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  style,
  contentStyle,
  onPress,
  glowColor,
  intensity = 'medium',
  variant,
  bordered = true,
  borderRadius,
}) => {
  const { palette, isDark } = useLuxuryTheme();

  const glow = glowColor || palette.accent;

  const resolvedVariant =
    variant ?? (intensity === 'high' ? 'elevated' : intensity === 'low' ? 'subtle' : 'base');

  const bgGradient = isDark
    ? intensity === 'high'
      ? ['rgba(255, 255, 255, 0.08)', 'rgba(32, 22, 58, 0.72)', 'rgba(16, 11, 32, 0.85)']
      : intensity === 'low'
      ? ['rgba(255, 255, 255, 0.04)', 'rgba(24, 17, 44, 0.55)', 'rgba(12, 8, 24, 0.70)']
      : ['rgba(255, 255, 255, 0.06)', 'rgba(28, 19, 52, 0.65)', 'rgba(14, 9, 28, 0.80)']
    : intensity === 'high'
    ? ['rgba(255, 255, 255, 0.82)', 'rgba(245, 238, 255, 0.58)', 'rgba(235, 224, 255, 0.68)']
    : intensity === 'low'
    ? ['rgba(255, 255, 255, 0.65)', 'rgba(246, 240, 255, 0.40)', 'rgba(238, 230, 255, 0.50)']
    : ['rgba(255, 255, 255, 0.74)', 'rgba(247, 241, 255, 0.48)', 'rgba(236, 226, 255, 0.58)'];

  // Separate outer layout styles (margins, flex, dimensions, positioning) from inner surface styles
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const {
    padding,
    paddingHorizontal,
    paddingVertical,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    margin,
    marginHorizontal,
    marginVertical,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    flex,
    flexGrow,
    flexShrink,
    flexBasis,
    alignSelf,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    position,
    top,
    bottom,
    left,
    right,
    zIndex,
    ...surfaceStyle
  } = flattenedStyle as any;

  const outerLayoutStyle = {
    margin,
    marginHorizontal,
    marginVertical,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    flex,
    flexGrow,
    flexShrink,
    flexBasis,
    alignSelf,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    position,
    top,
    bottom,
    left,
    right,
    zIndex,
  };

  const paddingStyle = {
    padding,
    paddingHorizontal,
    paddingVertical,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  };

  const shadowConfig =
    resolvedVariant === 'elevated'
      ? SHADOWS.glassCardElevated(isDark, glow)
      : resolvedVariant === 'subtle'
      ? SHADOWS.glassCardSubtle(isDark)
      : SHADOWS.glassCard(isDark, glow);

  const resolvedRadius = borderRadius ?? 22;

  const outerContainerStyles = [
    styles.glassCardOuter,
    { borderRadius: resolvedRadius },
    shadowConfig,
    outerLayoutStyle,
  ];

  const surfaceStyles = [
    styles.glassCardSurface,
    {
      borderRadius: resolvedRadius,
    },
    outerLayoutStyle.height !== undefined && { height: '100%' },
    outerLayoutStyle.flex !== undefined && { flex: 1 },
    bordered && {
      borderColor: isDark ? hexToRgba(palette.accentSoft, 0.22) : 'rgba(124, 58, 237, 0.22)',
      borderTopColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.95)',
      borderBottomColor: isDark ? 'rgba(168, 85, 247, 0.15)' : 'rgba(124, 58, 237, 0.16)',
    },
    surfaceStyle,
  ];

  const specularColors = isDark
    ? ['rgba(255, 255, 255, 0.55)', 'rgba(196, 181, 253, 0.25)', 'transparent']
    : ['rgba(255, 255, 255, 1)', 'rgba(168, 85, 247, 0.55)', 'rgba(255, 255, 255, 0.9)'];

  const sheenColors = isDark
    ? ['rgba(255, 255, 255, 0.07)', 'rgba(255, 255, 255, 0.015)', 'transparent']
    : ['rgba(255, 255, 255, 0.65)', 'rgba(245, 240, 255, 0.18)', 'transparent'];




  const content = (
    <View style={surfaceStyles}>
      {/* 1. Translucent Base Gradient */}
      <LinearGradient
        colors={bgGradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* 2. Specular Top-Rim Light Refraction (Thin 1.5px Edge Gleam) */}
      <LinearGradient
        colors={specularColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.specularTopRim}
      />

      {/* 3. Diagonal Glass Sheen Reflection */}
      <LinearGradient
        colors={sheenColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.7, y: 0.7 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Inner Content */}
      <View style={[styles.innerContent, paddingStyle, contentStyle]}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }: any) => [
          outerContainerStyles,
          pressed && {
            transform: [{ scale: 0.985 }],
            opacity: 0.92,
          },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={outerContainerStyles}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    position: 'relative',
  },
  glassCardOuter: {
    position: 'relative',
    overflow: 'visible',
  },
  glassCardSurface: {
    width: '100%',
    borderRadius: 22,
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
  innerContent: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
  },
});

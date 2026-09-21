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
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLuxuryTheme, hexToRgba, SHADOWS } from '@/theme/luxury';

export interface StatCardTrend {
  direction: 'up' | 'down' | 'flat';
  delta: string;
  positive: boolean;
}

export type IoniconName = keyof typeof Ionicons.glyphMap;

export interface StatCardProps {
  index?: number;
  label: string;
  value: string;
  unit?: string;
  valueColor?: string;
  tint?: string;
  icon?: IoniconName | React.ReactNode;
  trailing?: React.ReactNode;
  trend?: StatCardTrend | null;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const StatCard: React.FC<StatCardProps> = ({
  index = 0,
  label,
  value,
  unit,
  valueColor,
  tint,
  icon,
  trailing,
  trend,
  onPress,
  style,
}) => {
  const { palette, isDark } = useLuxuryTheme();
  const accentTint = tint || palette.accent;
  const resolvedValueColor = valueColor || palette.textPrimary;

  const appear = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 550,
      delay: Math.min(index * 90, 400),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [appear, index]);

  return (
    <Animated.View
      style={[
        styles.outerWrapper,
        SHADOWS.glassCard(isDark, hexToRgba(accentTint, 0.28)),
        {
          opacity: appear,
          transform: [
            {
              translateY: appear.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 0],
              }),
            },
          ],
        },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [
          styles.container,
          {
            borderColor: isDark ? hexToRgba(palette.accentSoft, 0.22) : 'rgba(124, 58, 237, 0.22)',
            borderTopColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.95)',
            borderBottomColor: isDark ? 'rgba(168, 85, 247, 0.15)' : 'rgba(124, 58, 237, 0.16)',
          },
          Boolean(onPress && pressed) && { opacity: 0.88, transform: [{ scale: 0.98 }] },
        ]}
      >
        {/* 1. Translucent Liquid Glass Fill */}
        <LinearGradient
          colors={
            isDark
              ? [
                  'rgba(255, 255, 255, 0.07)',
                  'rgba(28, 19, 52, 0.65)',
                  'rgba(14, 9, 28, 0.82)',
                ]
              : [
                  'rgba(255, 255, 255, 0.78)',
                  'rgba(247, 241, 255, 0.50)',
                  'rgba(238, 228, 255, 0.60)',
                ]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* 2. Specular Top Rim Reflection */}
        <LinearGradient
          colors={
            isDark
              ? ['rgba(255, 255, 255, 0.5)', 'rgba(196, 181, 253, 0.2)', 'transparent']
              : ['rgba(255, 255, 255, 1)', 'rgba(168, 85, 247, 0.55)', 'rgba(255, 255, 255, 0.9)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.specularTopRim}
        />

        {/* 3. Diagonal Glass Sheen */}
        <LinearGradient
          colors={
            isDark
              ? ['rgba(255, 255, 255, 0.06)', 'transparent']
              : ['rgba(255, 255, 255, 0.65)', 'rgba(245, 240, 255, 0.15)', 'transparent']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0.7, y: 0.7 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Header: Icon & Trend Chip / Trailing */}
        <View style={styles.headerRow}>
          {icon ? (
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: hexToRgba(accentTint, 0.15),
                  borderColor: hexToRgba(accentTint, 0.35),
                  borderTopColor: 'rgba(255, 255, 255, 0.35)',
                },
              ]}
            >
              {typeof icon === 'string' ? (
                <Ionicons name={icon as IoniconName} size={18} color={accentTint} />
              ) : (
                icon
              )}
            </View>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}

          {trend ? (
            <View
              style={[
                styles.trendPill,
                {
                  backgroundColor: hexToRgba(
                    trend.positive ? palette.success : palette.rose,
                    0.12,
                  ),
                  borderColor: hexToRgba(
                    trend.positive ? palette.success : palette.rose,
                    0.3,
                  ),
                },
              ]}
            >
              <Ionicons
                name={
                  trend.direction === 'up'
                    ? 'trending-up'
                    : trend.direction === 'down'
                    ? 'trending-down'
                    : 'remove'
                }
                size={11}
                color={trend.positive ? palette.success : palette.rose}
              />
              <Text
                style={[
                  styles.trendText,
                  { color: trend.positive ? palette.success : palette.rose },
                ]}
              >
                {trend.delta}
              </Text>
            </View>
          ) : trailing ? (
            <View style={styles.trailingContainer}>{trailing}</View>
          ) : null}
        </View>

        {/* Middle: Micro Label & Value + Unit */}
        <View style={styles.metricsContainer}>
          <Text style={[styles.label, { color: palette.textMuted }]} numberOfLines={1}>
            {label}
          </Text>

          <View style={styles.valueRow}>
            <Text
              style={[styles.value, { color: resolvedValueColor }]}
              numberOfLines={1}
              maxFontSizeMultiplier={1.2}
            >
              {value}
            </Text>
            {unit && (
              <Text style={[styles.unit, { color: palette.textMuted }]}>{unit}</Text>
            )}
          </View>
        </View>

        {/* Bottom progress track with dynamic fill */}
        <View
          style={[
            styles.progressTrack,
            {
              backgroundColor: hexToRgba(accentTint, isDark ? 0.12 : 0.10),
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: hexToRgba(accentTint, 0.85),
                width: trend
                  ? trend.direction === 'up'
                    ? '78%'
                    : trend.direction === 'down'
                    ? '35%'
                    : '55%'
                  : '60%',
                shadowColor: accentTint,
                shadowOpacity: 0.65,
                shadowRadius: 4,
              },
            ]}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'relative',
    overflow: 'visible',
    borderRadius: 20,
  },
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    zIndex: 1,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconPlaceholder: {
    width: 38,
    height: 38,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  trendText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  trailingContainer: {
    marginLeft: 'auto',
  },
  metricsContainer: {
    marginVertical: 4,
    zIndex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    zIndex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    zIndex: 1,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 26,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  unit: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    lineHeight: 14,
    paddingBottom: 2.5,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  progressTrack: {
    height: 3,
    borderRadius: 1.5,
    zIndex: 1,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
});

export default StatCard;

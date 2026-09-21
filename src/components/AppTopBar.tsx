import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLuxuryTheme, hexToRgba } from '@/theme/luxury';

export interface AppTopBarProps {
  title?: string;
  subtitle?: string;
  centerNode?: ReactNode;
  leftMode?: 'avatar' | 'back' | 'none';
  leftNode?: ReactNode;
  avatarInitials?: string;
  onBackPress?: () => void;
  rightNode?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AppTopBar({
  title,
  subtitle,
  centerNode,
  leftMode = 'none',
  leftNode,
  avatarInitials = 'AT',
  onBackPress,
  rightNode,
  style,
}: AppTopBarProps) {
  const { palette, isDark } = useLuxuryTheme();
  const router = useRouter();

  const topRimColors = isDark
    ? ['rgba(255, 255, 255, 0.45)', 'rgba(196, 181, 253, 0.2)', 'transparent']
    : ['rgba(255, 255, 255, 1)', 'rgba(168, 85, 247, 0.45)', 'rgba(255, 255, 255, 0.8)'];

  const renderLeft = () => {
    if (leftNode) return leftNode;

    if (leftMode === 'avatar') {
      return (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.push('/profile')}
          style={({ pressed }) => [
            styles.iconButton,
            {
              borderColor: isDark ? hexToRgba(palette.accentSoft, 0.3) : 'rgba(124, 58, 237, 0.22)',
              backgroundColor: isDark ? 'rgba(25, 17, 46, 0.65)' : 'rgba(255, 255, 255, 0.75)',
            },
            pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
          ]}
        >
          <LinearGradient
            colors={topRimColors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.specularTopRim}
          />
          <View
            style={[
              styles.avatarInner,
              { backgroundColor: hexToRgba(palette.accent, isDark ? 0.16 : 0.12) },
            ]}
          >
            <Text
              style={[
                styles.avatarInitials,
                { color: isDark ? palette.accentSoft : palette.accent },
              ]}
            >
              {avatarInitials}
            </Text>
          </View>
        </Pressable>
      );
    }

    if (leftMode === 'back') {
      return (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBackPress || (() => router.back())}
          style={({ pressed }) => [
            styles.iconButton,
            {
              borderColor: isDark ? hexToRgba(palette.accentSoft, 0.25) : 'rgba(124, 58, 237, 0.2)',
              backgroundColor: isDark ? 'rgba(25, 17, 46, 0.65)' : 'rgba(255, 255, 255, 0.75)',
            },
            pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
          ]}
        >
          <LinearGradient
            colors={topRimColors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.specularTopRim}
          />
          <Ionicons name="chevron-back" size={20} color={palette.textPrimary} />
        </Pressable>
      );
    }

    return <View style={styles.placeholder} />;
  };

  return (
    <View style={[styles.container, style]}>
      {/* Left Slot */}
      <View style={styles.leftSlot}>{renderLeft()}</View>

      {/* Center Slot */}
      <View style={styles.centerSlot}>
        {centerNode ? (
          centerNode
        ) : (
          <View style={styles.centerTextWrap}>
            {subtitle ? (
              <Text
                style={[styles.subtitle, { color: palette.textMuted }]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            ) : null}
            {title ? (
              <Text
                style={[styles.title, { color: palette.textPrimary }]}
                numberOfLines={1}
                maxFontSizeMultiplier={1.2}
              >
                {title}
              </Text>
            ) : null}
          </View>
        )}
      </View>

      {/* Right Slot */}
      <View style={styles.rightSlot}>
        {rightNode ? rightNode : <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

export function TopBarIconButton({
  icon,
  onPress,
  accessibilityLabel,
  color,
  badgeDot = false,
  badgeDotColor,
  size = 40,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel?: string;
  color?: string;
  badgeDot?: boolean;
  badgeDotColor?: string;
  size?: number;
}) {
  const { palette, isDark } = useLuxuryTheme();

  const topRimColors = isDark
    ? ['rgba(255, 255, 255, 0.45)', 'rgba(196, 181, 253, 0.2)', 'transparent']
    : ['rgba(255, 255, 255, 1)', 'rgba(168, 85, 247, 0.45)', 'rgba(255, 255, 255, 0.8)'];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.36),
          borderColor: isDark ? hexToRgba(palette.accentSoft, 0.2) : 'rgba(124, 58, 237, 0.2)',
          backgroundColor: isDark ? 'rgba(25, 17, 46, 0.65)' : 'rgba(255, 255, 255, 0.75)',
        },
        pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
      ]}
    >
      <LinearGradient
        colors={topRimColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.specularTopRim}
      />
      <Ionicons
        name={icon}
        size={Math.round(size * 0.48)}
        color={color || palette.textSecondary}
      />
      {badgeDot && (
        <View
          style={[
            styles.badgeDot,
            {
              backgroundColor: badgeDotColor || palette.rose,
              borderColor: isDark ? 'rgba(25, 17, 46, 0.9)' : '#FFFFFF',
            },
          ]}
        />
      )}
    </Pressable>
  );
}

const SYSTEM_FONT = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  leftSlot: {
    width: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSlot: {
    width: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  centerTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontFamily: SYSTEM_FONT,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontFamily: SYSTEM_FONT,
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 0,
  },
  specularTopRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    zIndex: 2,
  },
  avatarInner: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: SYSTEM_FONT,
  },
  badgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
});

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

interface BrandIconProps {
  size?: number;
  style?: ViewStyle;
}

export const BrandIcon: React.FC<BrandIconProps> = ({ size = 64, style }) => {
  const { colors, isDark } = useTheme();
  const borderRadius = Math.round(size * 0.28);
  const iconSize = Math.round(size * 0.52);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: isDark ? '#120F1D' : '#FFFFFF',
          borderColor: isDark ? 'rgba(168, 85, 247, 0.15)' : 'rgba(124, 58, 237, 0.1)',
          shadowColor: isDark ? '#000000' : '#7C3AED',
          shadowOpacity: isDark ? 0.4 : 0.14,
          shadowRadius: size * 0.22,
          shadowOffset: { width: 0, height: Math.round(size * 0.08) },
          elevation: 6,
        },
        style,
      ]}
    >
      {/* Subtle ambient aura ring behind heart */}
      <View
        style={[
          styles.glowRing,
          {
            width: Math.round(size * 0.68),
            height: Math.round(size * 0.68),
            borderRadius: Math.round(size * 0.34),
            backgroundColor: isDark
              ? 'rgba(139, 92, 246, 0.16)'
              : 'rgba(124, 58, 237, 0.1)',
          },
        ]}
      />

      {/* Heart-like fitness icon */}
      <Ionicons
        name="fitness"
        size={iconSize}
        color={colors.accent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
  },
});

export default BrandIcon;

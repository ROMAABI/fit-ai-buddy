import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  leading,
  trailing,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { radii, isDark } = useTheme();

  const getGradientColors = (): [string, string, ...string[]] | null => {
    switch (variant) {
      case 'primary':
        return ['#9333EA', '#7C3AED', '#6D28D9'];
      case 'accent':
        return ['#A855F7', '#8B5CF6', '#7C3AED'];
      case 'secondary':
        return isDark
          ? ['rgba(255, 255, 255, 0.09)', 'rgba(139, 92, 246, 0.06)']
          : ['rgba(245, 240, 255, 0.9)', 'rgba(238, 230, 255, 0.7)'];
      default:
        return null;
    }
  };

  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          borderWidth: 1,
          borderColor: 'rgba(196, 181, 253, 0.45)',
          borderTopColor: 'rgba(255, 255, 255, 0.65)',
          borderTopWidth: 1.5,
          shadowColor: '#8B5CF6',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark ? 0.45 : 0.25,
          shadowRadius: 16,
          elevation: 0,
        };
      case 'accent':
        return {
          borderWidth: 1,
          borderColor: 'rgba(236, 72, 153, 0.45)',
          borderTopColor: 'rgba(255, 255, 255, 0.65)',
          borderTopWidth: 1.5,
          shadowColor: '#EC4899',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark ? 0.4 : 0.2,
          shadowRadius: 16,
          elevation: 0,
        };
      case 'secondary':
        return {
          borderWidth: 1,
          borderColor: isDark ? 'rgba(168, 85, 247, 0.28)' : 'rgba(124, 58, 237, 0.25)',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)',
          borderTopWidth: 1.2,
          elevation: 0,
        };
      case 'outline':
        return {
          backgroundColor: isDark ? 'rgba(139, 92, 246, 0.06)' : 'rgba(139, 92, 246, 0.08)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(168, 85, 247, 0.35)' : 'rgba(124, 58, 237, 0.35)',
        };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      default:
        return {};
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'ghost':
        return { color: isDark ? '#C4B5FD' : '#7C3AED' };
      case 'outline':
        return { color: isDark ? '#EDE9FE' : '#6D28D9' };
      case 'secondary':
        return { color: isDark ? '#FFFFFF' : '#19142E' };
      case 'accent':
      case 'primary':
      default:
        return { color: '#FFFFFF' };
    }
  };

  const getSizeStyle = (): { height: number; paddingHorizontal: number; borderRadius: number; fontSize: number } => {
    switch (size) {
      case 'sm':
        return { height: 40, paddingHorizontal: 16, borderRadius: radii.sm, fontSize: 13 };
      case 'lg':
        return { height: 56, paddingHorizontal: 24, borderRadius: 18, fontSize: 16 };
      case 'md':
      default:
        return { height: 50, paddingHorizontal: 20, borderRadius: 16, fontSize: 15 };
    }
  };

  const sizeStyles = getSizeStyle();
  const gradientColors = getGradientColors();

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <View style={styles.contentRow}>
          {leading && <View style={styles.leadingContainer}>{leading}</View>}
          <Text
            style={[
              styles.baseText,
              { fontSize: sizeStyles.fontSize },
              getTextStyle(),
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {label}
          </Text>
          {trailing && <View style={styles.trailingContainer}>{trailing}</View>}
        </View>
      )}
    </>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      style={[
        styles.base,
        {
          height: sizeStyles.height,
          borderRadius: sizeStyles.borderRadius,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        getContainerStyle(),
        disabled && styles.disabledContainer,
        style,
      ]}
    >
      {gradientColors && (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: sizeStyles.borderRadius,
            },
          ]}
        />
      )}
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledContainer: {
    opacity: 0.45,
  },
  disabledText: {
    color: '#8B82A8',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  leadingContainer: {
    marginRight: 8,
  },
  trailingContainer: {
    marginLeft: 8,
  },
  baseText: {
    fontWeight: '700',
    letterSpacing: 0.2,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
});

export default Button;

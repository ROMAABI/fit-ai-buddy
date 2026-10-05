import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextStyle, Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useLuxuryTheme, hexToRgba } from '@/theme/luxury';

export interface CircularProgressRingProps {
  progress: number; // 0.0 to 1.0+
  size?: number;
  strokeWidth?: number;
  centerText?: string;
  unitText?: string;
  ringColor?: string;
  trackColor?: string;
  centerTextStyle?: TextStyle;
  children?: React.ReactNode | ((animatedProgress: number) => React.ReactNode);
}

export const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  progress,
  size = 180,
  strokeWidth = 14,
  centerText,
  unitText,
  ringColor,
  trackColor,
  centerTextStyle,
  children,
}) => {
  const { palette } = useLuxuryTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const anim = useRef(new Animated.Value(0)).current;
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const listenerId = anim.addListener(({ value }) => {
      setDisplayProgress(value);
    });

    Animated.timing(anim, {
      toValue: progress,
      duration: 1100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      anim.removeListener(listenerId);
    };
  }, [anim, progress]);

  const clampedProgress = Math.min(Math.max(displayProgress, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);

  const effectiveRingColor = ringColor || palette.accent;
  const effectiveTrackColor = trackColor || palette.track;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {/* Background Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={effectiveTrackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Layered Ambient Aura Glow (without blur) */}
          {clampedProgress > 0 && (
            <>
              {/* Outer soft aura */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={hexToRgba(effectiveRingColor, 0.14)}
                strokeWidth={strokeWidth + 12}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
              {/* Inner ambient glow */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={hexToRgba(effectiveRingColor, 0.28)}
                strokeWidth={strokeWidth + 5}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
              {/* Core Sharp Stroke */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={effectiveRingColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}
        </G>
      </Svg>

      <View style={styles.centerContent}>
        {typeof children === 'function' ? (
          children(displayProgress)
        ) : children ? (
          children
        ) : (
          <>
            {centerText && (
              <Text
                style={[
                  styles.centerText,
                  {
                    fontSize: size * 0.2,
                    color: palette.textPrimary,
                  },
                  centerTextStyle,
                ]}
              >
                {centerText}
              </Text>
            )}
            {unitText && (
              <Text
                style={[
                  styles.unitText,
                  {
                    fontSize: size * 0.09,
                    color: palette.textMuted,
                  },
                ]}
              >
                {unitText}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  unitText: {
    fontWeight: '600',
    letterSpacing: 1.2,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});

export default CircularProgressRing;

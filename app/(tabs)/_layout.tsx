/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TAB NAVIGATION · "Liquid Glass Dock"
 *  A floating, translucent liquid glass dock with specular top-rim highlight,
 *  ambient depth glow, and liquid violet active tab pills.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLuxuryTheme, hexToRgba, type LuxuryPalette } from '@/theme/luxury';

interface TabBarProps {
  state: {
    index: number;
    routes: Array<{ key: string; name: string; params?: any }>;
  };
  descriptors: Record<string, { options: any }>;
  navigation: {
    emit: (event: any) => any;
    navigate: (name: string) => void;
  };
}

type IoniconName = keyof typeof Ionicons.glyphMap;

interface TabDescriptor {
  name: string;
  label: string;
  icon: IoniconName;
  activeIcon: IoniconName;
}

const TAB_ITEMS: TabDescriptor[] = [
  { name: 'dashboard', label: 'Home', icon: 'grid-outline', activeIcon: 'grid' },
  { name: 'workout', label: 'Workout', icon: 'barbell-outline', activeIcon: 'barbell' },
  { name: 'ai-coach', label: 'AI Coach', icon: 'sparkles-outline', activeIcon: 'sparkles' },
  { name: 'nutrition', label: 'Nutrition', icon: 'nutrition-outline', activeIcon: 'nutrition' },
  { name: 'expense', label: 'Expense', icon: 'wallet-outline', activeIcon: 'wallet' },
];

const makeStyles = (palette: LuxuryPalette, isDark: boolean, bottomInset: number) =>
  StyleSheet.create({
    tabBarContainer: {
      position: 'absolute',
      bottom: Math.max(bottomInset, 8),
      left: 14,
      right: 14,
      height: 66,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: isDark ? hexToRgba(palette.accentSoft, 0.22) : hexToRgba(palette.accent, 0.16),
      borderTopColor: isDark ? 'rgba(255, 255, 255, 0.38)' : 'rgba(255, 255, 255, 0.85)',
      overflow: 'hidden',
      shadowColor: palette.accent,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.32 : 0.10,
      shadowRadius: 20,
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
    tabBarInner: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingHorizontal: 6,
      zIndex: 1,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    },
    pill: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2.5,
      paddingVertical: 6,
      paddingHorizontal: 6,
      minWidth: 50,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'transparent',
      position: 'relative',
      overflow: 'hidden',
    },
    pillActive: {
      borderColor: hexToRgba(palette.accentSoft, 0.5),
      borderTopColor: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.9)',
      shadowColor: palette.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.45 : 0.20,
      shadowRadius: 8,
      elevation: 0,
    },
    tabLabel: {
      fontSize: 8.5,
      fontWeight: '600',
      letterSpacing: 0.2,
      textTransform: 'uppercase',
    },
    tabLabelActive: {
      fontWeight: '800',
      letterSpacing: 0.4,
      color: palette.textPrimary,
    },
  });

function LuxuryTabBar({ state, descriptors, navigation }: TabBarProps) {
  const { palette, isDark } = useLuxuryTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(palette, isDark, insets.bottom), [palette, isDark, insets.bottom]);

  const tabBgColors = isDark
    ? ['rgba(255, 255, 255, 0.08)', 'rgba(14, 9, 28, 0.95)', 'rgba(10, 7, 20, 0.98)']
    : ['rgba(255, 255, 255, 0.97)', 'rgba(248, 245, 255, 0.95)', 'rgba(243, 238, 250, 0.98)'];

  const specularColors = isDark
    ? ['rgba(255, 255, 255, 0.5)', 'rgba(196, 181, 253, 0.25)', 'transparent']
    : ['rgba(255, 255, 255, 0.95)', 'rgba(196, 181, 253, 0.45)', 'transparent'];

  return (
    <View style={styles.tabBarContainer}>
      {/* Translucent Liquid Glass Fill */}
      <LinearGradient
        colors={tabBgColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
        colors={['rgba(255, 255, 255, 0.05)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.7, y: 0.7 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          if (!TAB_ITEMS.some((tab) => tab.name === route.name)) {
            return null;
          }
          const isFocused = state.index === index;
          const options = descriptors[route.key]?.options ?? {};
          const item =
            TAB_ITEMS.find((tab) => tab.name === route.name) ?? {
              name: route.name,
              label: options.title ?? route.name,
              icon: 'ellipse-outline' as IoniconName,
              activeIcon: 'ellipse' as IoniconName,
            };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? item.label}
              onPress={onPress}
              onLongPress={onLongPress}
              hitSlop={{ top: 8, bottom: 8, left: 2, right: 2 }}
              style={({ pressed }) => [
                styles.tabButton,
                pressed && { opacity: 0.8, transform: [{ scale: 0.94 }] },
              ]}
            >
              <View style={[styles.pill, isFocused && styles.pillActive]}>
                {isFocused && (
                  <LinearGradient
                    colors={[
                      'rgba(139, 92, 246, 0.55)',
                      'rgba(192, 132, 252, 0.25)',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <Ionicons
                  name={isFocused ? item.activeIcon : item.icon}
                  size={20}
                  color={isFocused ? palette.accentSoft : palette.textMuted}
                />
                <Text
                  numberOfLines={1}
                  maxFontSizeMultiplier={1.2}
                  style={[
                    styles.tabLabel,
                    { color: palette.textMuted },
                    isFocused && styles.tabLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { palette } = useLuxuryTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: palette.background },
      }}
      tabBar={(props) => <LuxuryTabBar {...props} />}
    >
      {TAB_ITEMS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.label }} />
      ))}
      <Tabs.Screen name="ai-chat" options={{ href: null }} />
    </Tabs>
  );
}

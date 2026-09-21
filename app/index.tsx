import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme';
import { useUserStore } from '../src/store/userStore';
import { authService } from '../src/services/auth';

import { BrandIcon } from '../src/components/BrandIcon';

export default function SplashScreen() {
  const router = useRouter();
  const { colors, typography } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Smooth, gentle fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    let isMounted = true;

    const initializeAndRoute = async () => {
      try {
        await authService.init();
      } catch (e) {
        console.warn('Auth init error in splash:', e);
      }

      setTimeout(() => {
        if (!isMounted) return;

        const state = useUserStore.getState();
        const hasProfile = state.age > 0 && state.weight > 0 && state.height > 0;

        // Exact 4-step routing sequence:
        // 1. If onboarding complete -> dashboard
        // 2. Else if logged in and profile has age, weight, height -> dashboard
        // 3. Else if logged in -> onboarding
        // 4. Else -> login
        if (state.isOnboardingComplete) {
          router.replace('/(tabs)/dashboard');
        } else if (state.isLoggedIn && hasProfile) {
          router.replace('/(tabs)/dashboard');
        } else if (state.isLoggedIn) {
          router.replace('/onboarding/step1-sex');
        } else {
          router.replace('/login');
        }
      }, 1000);
    };

    initializeAndRoute();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <BrandIcon size={84} style={{ marginBottom: 24 }} />

        <Text style={[typography.displayMedium, { color: colors.textPrimary, marginBottom: 8 }]}>
          Fit AI Buddy
        </Text>
        <Text
          style={[
            typography.bodyMedium,
            { color: colors.textSecondary, textAlign: 'center', maxWidth: 260 },
          ]}
        >
          Your personal fitness & nutrition coach
        </Text>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={colors.textSecondary} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  loaderContainer: {
    marginTop: 40,
  },
});

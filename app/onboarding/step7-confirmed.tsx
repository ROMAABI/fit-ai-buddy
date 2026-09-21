/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ONBOARDING · STEP 7 · Plan Ready
 *  Liquid glass celebration card with summary metrics and start button.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLuxuryTheme, hexToRgba } from '../../src/theme/luxury';
import { Button } from '../../src/components/Button';
import { OnboardingHeader } from '../../src/components/OnboardingHeader';
import { useUserStore } from '../../src/store/userStore';
import { authService } from '../../src/services/auth';
import {
  Rise,
  ScreenShell,
} from '../../src/components/onboarding/Luxury';
import { LiquidGlassCard } from '../../src/components/LiquidGlass';

export default function Step7ConfirmedScreen() {
  const router = useRouter();
  const { palette } = useLuxuryTheme();

  const userState = useUserStore();

  const handleStartNow = async () => {
    try {
      await authService.markOnboardingComplete();
    } catch (e) {
      console.warn('Error marking onboarding complete:', e);
    }
    router.replace('/(tabs)/dashboard');
  };

  return (
    <ScreenShell
      header={
        <OnboardingHeader
          currentStep={7}
          totalSteps={7}
          stepTitle="PROGRAM READY"
          onBack={() => router.back()}
        />
      }
    >
      {/* Ready Badge */}
      <Rise delay={60}>
        <View style={styles.badgeWrapper}>
          <View
            style={[
              styles.readyBadge,
              {
                backgroundColor: hexToRgba(palette.accent, 0.18),
                borderColor: hexToRgba(palette.accent, 0.4),
              },
            ]}
          >
            <Ionicons name="sparkles" size={14} color={palette.accent} style={{ marginRight: 6 }} />
            <Text style={[styles.badgeText, { color: palette.accent }]}>
              PROGRAM CALIBRATED
            </Text>
          </View>
        </View>
      </Rise>

      {/* Title */}
      <Rise delay={120}>
        <Text style={[styles.title, { color: palette.textPrimary }]}>
          28-Day Full Body Challenge
        </Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
          Your personalized AI workout and nutrition roadmap is ready. Calibrated for steady progression and sustainable longevity.
        </Text>
      </Rise>

      {/* Summary Metrics Grid */}
      <Rise delay={180}>
        <View style={styles.gridContainer}>
          <LiquidGlassCard style={styles.summaryCard} borderRadius={20}>
            <View style={styles.metricCardInner}>
              <View style={[styles.iconPill, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                <Ionicons name="flag-outline" size={18} color="#A78BFA" />
              </View>
              <Text style={[styles.metricLabel, { color: palette.textMuted }]}>
                OBJECTIVE
              </Text>
              <Text style={[styles.metricValue, { color: palette.textPrimary }]}>
                {userState.objective || 'Build Muscle'}
              </Text>
            </View>
          </LiquidGlassCard>

          <LiquidGlassCard style={styles.summaryCard} borderRadius={20}>
            <View style={styles.metricCardInner}>
              <View style={[styles.iconPill, { backgroundColor: 'rgba(96, 165, 250, 0.15)' }]}>
                <Ionicons name="calendar-outline" size={18} color="#60A5FA" />
              </View>
              <Text style={[styles.metricLabel, { color: palette.textMuted }]}>
                FREQUENCY
              </Text>
              <Text style={[styles.metricValue, { color: palette.textPrimary }]}>
                {userState.trainingDaysPerWeek || 5} days / week
              </Text>
            </View>
          </LiquidGlassCard>

          <LiquidGlassCard style={styles.summaryCard} borderRadius={20}>
            <View style={styles.metricCardInner}>
              <View style={[styles.iconPill, { backgroundColor: 'rgba(244, 114, 182, 0.15)' }]}>
                <Ionicons name="flash-outline" size={18} color="#F472B6" />
              </View>
              <Text style={[styles.metricLabel, { color: palette.textMuted }]}>
                FITNESS LEVEL
              </Text>
              <Text style={[styles.metricValue, { color: palette.textPrimary }]}>
                {userState.fitnessLevel || 'Intermediate'}
              </Text>
            </View>
          </LiquidGlassCard>

          <LiquidGlassCard style={styles.summaryCard} borderRadius={20}>
            <View style={styles.metricCardInner}>
              <View style={[styles.iconPill, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
                <Ionicons name="scale-outline" size={18} color="#FBBF24" />
              </View>
              <Text style={[styles.metricLabel, { color: palette.textMuted }]}>
                TARGET BASELINE
              </Text>
              <Text style={[styles.metricValue, { color: palette.textPrimary }]}>
                {userState.weight ? `${userState.weight} kg` : '75.0 kg'}
              </Text>
            </View>
          </LiquidGlassCard>
        </View>
      </Rise>

      {/* Start Now CTA */}
      <Rise delay={260}>
        <Button
          label="Start My Journey"
          onPress={handleStartNow}
          size="lg"
          trailing={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
          style={styles.actionButton}
        />
      </Rise>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  badgeWrapper: {
    alignItems: 'center',
    marginBottom: 14,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 26,
    paddingHorizontal: 10,
  },
  gridContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  summaryCard: {
    width: '48%',
    flexGrow: 1,
  },
  metricCardInner: {
    padding: 16,
  },
  iconPill: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  actionButton: {
    width: '100%',
    marginBottom: 20,
  },
});

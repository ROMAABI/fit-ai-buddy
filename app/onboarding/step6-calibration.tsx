/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ONBOARDING · STEP 6 · Calibration
 *  Liquid glass measurement cards with stepper controls and unit toggles.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
  StepHeading,
} from '../../src/components/onboarding/Luxury';
import { LiquidGlassCard } from '../../src/components/LiquidGlass';

export default function Step6CalibrationScreen() {
  const router = useRouter();
  const { palette, isDark } = useLuxuryTheme();

  const userState = useUserStore();
  const [weightKg, setWeightKg] = useState<number>(userState.weight > 0 ? userState.weight : 75.0);
  const [isKg, setIsKg] = useState<boolean>(true);

  const [heightCm, setHeightCm] = useState<number>(userState.height > 0 ? userState.height : 182);
  const [isCm, setIsCm] = useState<boolean>(true);

  const [age, setAge] = useState<number>(userState.age > 0 ? userState.age : 28);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const stepperIconColor = isDark ? '#EDE9FE' : '#6D28D9';
  const stepperBtnStyle = [
    styles.stepperButton,
    {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(124, 58, 237, 0.12)',
      borderColor: isDark ? 'rgba(168, 85, 247, 0.28)' : 'rgba(124, 58, 237, 0.28)',
      borderTopColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.95)',
    },
  ];
  const unitToggleStyle = [
    styles.unitToggle,
    {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(124, 58, 237, 0.08)',
      borderColor: isDark ? 'rgba(168, 85, 247, 0.18)' : 'rgba(124, 58, 237, 0.22)',
    },
  ];
  const unitPillActiveStyle = [
    styles.unitPillActive,
    {
      backgroundColor: isDark ? '#8B5CF6' : '#7C3AED',
      borderColor: isDark ? 'rgba(196, 181, 253, 0.4)' : 'rgba(124, 58, 237, 0.35)',
    },
  ];

  const handleSaveAndContinue = async () => {
    setIsSaving(true);
    try {
      const finalWeight = Math.round(weightKg * 10) / 10;
      const finalHeight = Math.round(heightCm);

      const profileUpdate = {
        weight: finalWeight,
        height: finalHeight,
        age,
        name: userState.name,
        sex: userState.sex,
        trainingDaysPerWeek: userState.trainingDaysPerWeek,
        firstDayOfWeek: userState.firstDayOfWeek,
        objective: userState.objective,
        fitnessLevel: userState.fitnessLevel,
      };

      await authService.saveUserProfileToFirebase(profileUpdate);
      router.push('/onboarding/step7-confirmed');
    } catch (e) {
      console.warn('Error saving calibration profile:', e);
      router.push('/onboarding/step7-confirmed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenShell
      header={
        <OnboardingHeader
          currentStep={6}
          totalSteps={7}
          stepTitle="BIOMETRIC CALIBRATION"
          onBack={() => router.back()}
        />
      }
    >
      <Rise delay={60}>
        <StepHeading
          eyebrow="BIOMETRIC PRECISION"
          title="Calibrate your metrics"
          subtitle="Configure your body parameters for personalized caloric baselines and volume algorithms."
        />
      </Rise>

      {/* Measurement 1: Weight */}
      <Rise delay={120}>
        <LiquidGlassCard style={styles.measurementCard} borderRadius={22}>
          <View style={styles.cardTopRow}>
            <Text style={[styles.cardLabel, { color: palette.textMuted }]}>
              01 • WEIGHT
            </Text>
            <View style={unitToggleStyle}>
              <TouchableOpacity
                onPress={() => setIsKg(true)}
                activeOpacity={0.8}
                style={[
                  styles.unitPill,
                  isKg && unitPillActiveStyle,
                ]}
              >
                <Text
                  style={[
                    styles.unitText,
                    { color: isKg ? '#FFFFFF' : isDark ? palette.textMuted : '#7C6F9B' },
                  ]}
                >
                  KG
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsKg(false)}
                activeOpacity={0.8}
                style={[
                  styles.unitPill,
                  !isKg && unitPillActiveStyle,
                ]}
              >
                <Text
                  style={[
                    styles.unitText,
                    { color: !isKg ? '#FFFFFF' : isDark ? palette.textMuted : '#7C6F9B' },
                  ]}
                >
                  LBS
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.valueRow}>
            <TouchableOpacity
              onPress={() => setWeightKg((prev) => Math.max(35, prev - 0.5))}
              activeOpacity={0.7}
              style={stepperBtnStyle}
            >
              <Ionicons name="remove" size={20} color={stepperIconColor} />
            </TouchableOpacity>

            <Text style={[styles.metricValue, { color: palette.textPrimary }]}>
              {isKg ? weightKg.toFixed(1) : (weightKg * 2.20462).toFixed(1)}{' '}
              <Text style={[styles.metricUnit, { color: palette.textMuted }]}>
                {isKg ? 'kg' : 'lbs'}
              </Text>
            </Text>

            <TouchableOpacity
              onPress={() => setWeightKg((prev) => Math.min(220, prev + 0.5))}
              activeOpacity={0.7}
              style={stepperBtnStyle}
            >
              <Ionicons name="add" size={20} color={stepperIconColor} />
            </TouchableOpacity>
          </View>
        </LiquidGlassCard>
      </Rise>

      {/* Measurement 2: Height */}
      <Rise delay={180}>
        <LiquidGlassCard style={styles.measurementCard} borderRadius={22}>
          <View style={styles.cardTopRow}>
            <Text style={[styles.cardLabel, { color: palette.textMuted }]}>
              02 • HEIGHT
            </Text>
            <View style={unitToggleStyle}>
              <TouchableOpacity
                onPress={() => setIsCm(true)}
                activeOpacity={0.8}
                style={[
                  styles.unitPill,
                  isCm && unitPillActiveStyle,
                ]}
              >
                <Text
                  style={[
                    styles.unitText,
                    { color: isCm ? '#FFFFFF' : isDark ? palette.textMuted : '#7C6F9B' },
                  ]}
                >
                  CM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsCm(false)}
                activeOpacity={0.8}
                style={[
                  styles.unitPill,
                  !isCm && unitPillActiveStyle,
                ]}
              >
                <Text
                  style={[
                    styles.unitText,
                    { color: !isCm ? '#FFFFFF' : isDark ? palette.textMuted : '#7C6F9B' },
                  ]}
                >
                  FT
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.valueRow}>
            <TouchableOpacity
              onPress={() => setHeightCm((prev) => Math.max(100, prev - 1))}
              activeOpacity={0.7}
              style={stepperBtnStyle}
            >
              <Ionicons name="remove" size={20} color={stepperIconColor} />
            </TouchableOpacity>

            <Text style={[styles.metricValue, { color: palette.textPrimary }]}>
              {isCm ? heightCm : (heightCm / 30.48).toFixed(1)}{' '}
              <Text style={[styles.metricUnit, { color: palette.textMuted }]}>
                {isCm ? 'cm' : 'ft'}
              </Text>
            </Text>

            <TouchableOpacity
              onPress={() => setHeightCm((prev) => Math.min(240, prev + 1))}
              activeOpacity={0.7}
              style={stepperBtnStyle}
            >
              <Ionicons name="add" size={20} color={stepperIconColor} />
            </TouchableOpacity>
          </View>
        </LiquidGlassCard>
      </Rise>

      {/* Measurement 3: Age */}
      <Rise delay={240}>
        <LiquidGlassCard style={[styles.measurementCard, { marginBottom: 26 }]} borderRadius={22}>
          <View style={styles.cardTopRow}>
            <Text style={[styles.cardLabel, { color: palette.textMuted }]}>
              03 • AGE
            </Text>
            <Text style={[styles.cardLabel, { color: palette.textMuted }]}>
              YEARS
            </Text>
          </View>

          <View style={styles.valueRow}>
            <TouchableOpacity
              onPress={() => setAge((prev) => Math.max(14, prev - 1))}
              activeOpacity={0.7}
              style={stepperBtnStyle}
            >
              <Ionicons name="remove" size={20} color={stepperIconColor} />
            </TouchableOpacity>

            <Text style={[styles.metricValue, { color: palette.textPrimary }]}>
              {age}{' '}
              <Text style={[styles.metricUnit, { color: palette.textMuted }]}>yrs</Text>
            </Text>

            <TouchableOpacity
              onPress={() => setAge((prev) => Math.min(95, prev + 1))}
              activeOpacity={0.7}
              style={stepperBtnStyle}
            >
              <Ionicons name="add" size={20} color={stepperIconColor} />
            </TouchableOpacity>
          </View>
        </LiquidGlassCard>
      </Rise>

      {/* Get Plan Button */}
      <Rise delay={300}>
        <Button
          label="Generate My Plan"
          onPress={handleSaveAndContinue}
          loading={isSaving}
          size="lg"
          trailing={<Ionicons name="sparkles" size={18} color="#FFFFFF" />}
          style={styles.actionButton}
        />
      </Rise>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  measurementCard: {
    width: '100%',
    padding: 18,
    marginBottom: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.18)',
  },
  unitPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unitPillActive: {
    backgroundColor: '#8B5CF6',
    borderWidth: 1,
    borderColor: 'rgba(196, 181, 253, 0.4)',
  },
  unitText: {
    fontSize: 11,
    fontWeight: '700',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.25)',
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderTopWidth: 1.2,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  metricUnit: {
    fontSize: 18,
    fontWeight: '500',
  },
  actionButton: {
    width: '100%',
    marginBottom: 20,
  },
});

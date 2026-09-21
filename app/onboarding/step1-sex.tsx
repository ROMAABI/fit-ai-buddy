/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ONBOARDING · STEP 1 · Biological Sex
 *  Large, high-end selection cards with a subtle amethyst glow on selection.
 *  Store contract unchanged: setUserProfile({ sex }) → /onboarding/step2-name.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLuxuryTheme, hexToRgba } from '../../src/theme/luxury';
import { Button } from '../../src/components/Button';
import { OnboardingHeader } from '../../src/components/OnboardingHeader';
import { useUserStore } from '../../src/store/userStore';
import { Sex } from '../../src/types';
import {
  Rise,
  ScreenShell,
  SelectionCard,
  StepHeading,
  RadioDot,
} from '../../src/components/onboarding/Luxury';

interface SexOption {
  id: Sex;
  title: string;
  caption: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const SEX_OPTIONS: SexOption[] = [
  {
    id: 'Male',
    title: 'Male',
    caption: 'Calibrated for higher lean-mass baselines',
    icon: 'male-outline',
  },
  {
    id: 'Female',
    title: 'Female',
    caption: 'Calibrated for distinct metabolic profiles',
    icon: 'female-outline',
  },
];

export default function Step1SexScreen() {
  const router = useRouter();
  const { palette } = useLuxuryTheme();

  const userSex = useUserStore((state) => state.sex);
  const [selectedSex, setSelectedSex] = useState<Sex>(userSex || 'Female');

  const handleNext = () => {
    useUserStore.getState().setUserProfile({ sex: selectedSex });
    router.push('/onboarding/step2-name');
  };

  return (
    <ScreenShell
      header={
        <OnboardingHeader
          currentStep={1}
          totalSteps={7}
          stepTitle="BIOLOGICAL SEX"
          onBack={() => router.replace('/login')}
        />
      }
    >
      <Rise delay={60}>
        <StepHeading
          eyebrow="PERSONAL PROFILE"
          title="What is your biological sex?"
          subtitle="Used to calculate metabolic rate and tailored biometric baselines."
        />
      </Rise>

      <Rise delay={140}>
        <View style={styles.optionsContainer}>
          {SEX_OPTIONS.map((option) => {
            const isSelected = selectedSex === option.id;
            return (
              <SelectionCard
                key={option.id}
                selected={isSelected}
                onPress={() => setSelectedSex(option.id)}
                accessibilityLabel={option.title}
                style={styles.optionCard}
              >
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.iconBadge,
                      {
                        backgroundColor: isSelected
                          ? hexToRgba(palette.accent, 0.18)
                          : 'rgba(255, 255, 255, 0.05)',
                        borderColor: isSelected
                          ? hexToRgba(palette.accent, 0.35)
                          : hexToRgba(palette.accentSoft, 0.15),
                      },
                    ]}
                  >
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={isSelected ? palette.accent : palette.textMuted}
                    />
                  </View>
                  <View style={styles.optionText}>
                    <Text
                      style={[
                        styles.optionTitle,
                        { color: isSelected ? palette.textPrimary : palette.textSecondary },
                      ]}
                    >
                      {option.title}
                    </Text>
                    <Text style={[styles.optionCaption, { color: palette.textMuted }]}>
                      {option.caption}
                    </Text>
                  </View>
                </View>

                <RadioDot selected={isSelected} />
              </SelectionCard>
            );
          })}
        </View>
      </Rise>

      <Rise delay={220}>
        <View style={styles.privacyRow}>
          <Ionicons name="shield-checkmark-outline" size={13} color={palette.textMuted} />
          <Text style={[styles.privacyText, { color: palette.textMuted }]}>
            Your biometric data is kept private and secure.
          </Text>
        </View>

        <Button
          label="Continue"
          onPress={handleNext}
          size="lg"
          trailing={<Ionicons name="arrow-forward" size={18} color={palette.textPrimary} />}
          style={styles.actionButton}
        />
      </Rise>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    width: '100%',
    gap: 14,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  optionText: {
    flex: 1,
    marginLeft: 16,
    gap: 3,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  optionCaption: {
    fontSize: 11.5,
    fontWeight: '500',
    lineHeight: 15,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    gap: 6,
  },
  privacyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButton: {
    width: '100%',
  },
});

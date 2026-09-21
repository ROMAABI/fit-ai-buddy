/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ONBOARDING · STEP 5 · Fitness Assessment
 *  Liquid glass selection cards with glowing amethyst borders and radio dots.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLuxuryTheme, hexToRgba } from '../../src/theme/luxury';
import { Button } from '../../src/components/Button';
import { OnboardingHeader } from '../../src/components/OnboardingHeader';
import { useUserStore } from '../../src/store/userStore';
import { FitnessLevel } from '../../src/types';
import {
  Rise,
  ScreenShell,
  SelectionCard,
  StepHeading,
  RadioDot,
} from '../../src/components/onboarding/Luxury';

interface LevelOption {
  id: FitnessLevel;
  title: string;
  reps: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const FITNESS_LEVELS: LevelOption[] = [
  {
    id: 'Beginner',
    title: 'Beginner',
    reps: '3 – 5 repetitions with baseline form',
    icon: 'walk-outline',
  },
  {
    id: 'Intermediate',
    title: 'Intermediate',
    reps: '5 – 10 repetitions with strict cadence',
    icon: 'flash-outline',
  },
  {
    id: 'Advanced',
    title: 'Advanced',
    reps: '10+ repetitions with high endurance',
    icon: 'trophy-outline',
  },
];

export default function Step5FitnessScreen() {
  const router = useRouter();
  const { palette } = useLuxuryTheme();

  const currentLevel = useUserStore((state) => state.fitnessLevel) || 'Intermediate';
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel>(currentLevel);

  const handleNext = () => {
    useUserStore.getState().setUserProfile({ fitnessLevel: selectedLevel });
    router.push('/onboarding/step6-calibration');
  };

  return (
    <ScreenShell
      header={
        <OnboardingHeader
          currentStep={5}
          totalSteps={7}
          stepTitle="FITNESS ASSESSMENT"
          onBack={() => router.back()}
        />
      }
    >
      <Rise delay={60}>
        <StepHeading
          eyebrow="STRENGTH CALIBRATION"
          title="How many push-ups can you do?"
          subtitle="Your baseline strength helps us calibrate starting weights, reps, and progression volume."
        />
      </Rise>

      <Rise delay={140}>
        <View style={styles.optionsList}>
          {FITNESS_LEVELS.map((item) => {
            const isSelected = selectedLevel === item.id;
            return (
              <SelectionCard
                key={item.id}
                selected={isSelected}
                onPress={() => setSelectedLevel(item.id)}
                accessibilityLabel={item.title}
                style={styles.optionCard}
              >
                <View style={styles.cardInner}>
                  <View
                    style={[
                      styles.iconBadge,
                      {
                        backgroundColor: isSelected
                          ? hexToRgba(palette.accent, 0.2)
                          : 'rgba(255, 255, 255, 0.06)',
                        borderColor: isSelected
                          ? hexToRgba(palette.accent, 0.45)
                          : 'rgba(255, 255, 255, 0.1)',
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={isSelected ? palette.accent : palette.textMuted}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.optionTitle,
                        { color: isSelected ? palette.textPrimary : palette.textSecondary },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={[styles.optionReps, { color: palette.textMuted }]}>
                      {item.reps}
                    </Text>
                  </View>

                  <RadioDot selected={isSelected} />
                </View>
              </SelectionCard>
            );
          })}
        </View>
      </Rise>

      <Rise delay={220}>
        <Button
          label="Continue"
          onPress={handleNext}
          size="lg"
          trailing={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
          style={styles.actionButton}
        />
      </Rise>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  optionsList: {
    width: '100%',
    gap: 14,
    marginBottom: 32,
  },
  optionCard: {
    width: '100%',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  optionReps: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  actionButton: {
    width: '100%',
    marginBottom: 20,
  },
});

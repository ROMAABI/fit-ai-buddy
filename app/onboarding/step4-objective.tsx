/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ONBOARDING · STEP 4 · Primary Objective
 *  Liquid glass selection cards with glowing amethyst borders and radio indicators.
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
import { Objective } from '../../src/types';
import {
  Rise,
  ScreenShell,
  SelectionCard,
  StepHeading,
  RadioDot,
} from '../../src/components/onboarding/Luxury';

interface ObjectiveOption {
  id: Objective;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const OBJECTIVES: ObjectiveOption[] = [
  {
    id: 'Lose Weight',
    title: 'Lose Weight',
    subtitle: 'Metabolic optimization & fat reduction',
    icon: 'flame-outline',
  },
  {
    id: 'Build Muscle',
    title: 'Build Muscle',
    subtitle: 'Hypertrophy, strength & muscle tone',
    icon: 'barbell-outline',
  },
  {
    id: 'Keep Fit',
    title: 'Keep Fit',
    subtitle: 'Endurance, vitality & overall mobility',
    icon: 'heart-outline',
  },
];

export default function Step4ObjectiveScreen() {
  const router = useRouter();
  const { palette } = useLuxuryTheme();

  const currentObjective = useUserStore((state) => state.objective) || 'Build Muscle';
  const [selectedObjective, setSelectedObjective] = useState<Objective>(currentObjective);

  const handleNext = () => {
    useUserStore.getState().setUserProfile({ objective: selectedObjective });
    router.push('/onboarding/step5-fitness');
  };

  return (
    <ScreenShell
      header={
        <OnboardingHeader
          currentStep={4}
          totalSteps={7}
          stepTitle="PRIMARY OBJECTIVE"
          onBack={() => router.back()}
        />
      }
    >
      <Rise delay={60}>
        <StepHeading
          eyebrow="TARGET OUTCOME"
          title="Select your primary objective"
          subtitle="Define your focus. Our algorithms adjust daily volume and calorie targets based on your choice."
        />
      </Rise>

      <Rise delay={140}>
        <View style={styles.optionsList}>
          {OBJECTIVES.map((item) => {
            const isSelected = selectedObjective === item.id;
            return (
              <SelectionCard
                key={item.id}
                selected={isSelected}
                onPress={() => setSelectedObjective(item.id)}
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
                    <Text style={[styles.optionSubtitle, { color: palette.textMuted }]}>
                      {item.subtitle}
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
  optionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  actionButton: {
    width: '100%',
    marginBottom: 20,
  },
});

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ONBOARDING · STEP 3 · Weekly Goal
 *  Liquid glass days selector, intensity badge, and modal picker.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLuxuryTheme, hexToRgba } from '../../src/theme/luxury';
import { Button } from '../../src/components/Button';
import { OnboardingHeader } from '../../src/components/OnboardingHeader';
import { useUserStore } from '../../src/store/userStore';
import { DayOfWeek } from '../../src/types';
import {
  Rise,
  ScreenShell,
  StepHeading,
} from '../../src/components/onboarding/Luxury';
import { LiquidGlassCard } from '../../src/components/LiquidGlass';

const WEEK_DAYS: DayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

export default function Step3GoalScreen() {
  const router = useRouter();
  const { palette } = useLuxuryTheme();

  const currentDays = useUserStore((state) => state.trainingDaysPerWeek) || 5;
  const currentFirstDay = useUserStore((state) => state.firstDayOfWeek) || 'SUNDAY';

  const [selectedDays, setSelectedDays] = useState<number>(currentDays);
  const [firstDay, setFirstDay] = useState<DayOfWeek>(currentFirstDay);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const getIntensityLabel = (days: number): { text: string; color: string } => {
    if (days <= 2) return { text: 'LIGHT', color: '#60A5FA' };
    if (days <= 4) return { text: 'MODERATE', color: '#A78BFA' };
    if (days === 5) return { text: 'INTENSE', color: '#C084FC' };
    return { text: 'EXTREME', color: '#F472B6' };
  };

  const intensity = getIntensityLabel(selectedDays);

  const handleNext = () => {
    useUserStore.getState().setUserProfile({
      trainingDaysPerWeek: selectedDays,
      firstDayOfWeek: firstDay,
    });
    router.push('/onboarding/step4-objective');
  };

  return (
    <ScreenShell
      header={
        <OnboardingHeader
          currentStep={3}
          totalSteps={7}
          stepTitle="WEEKLY GOAL"
          onBack={() => router.back()}
        />
      }
    >
      <Rise delay={60}>
        <StepHeading
          eyebrow="FREQUENCY & TARGETS"
          title="Set your weekly goal"
          subtitle="We recommend training at least 3 days weekly for optimal progression."
        />
      </Rise>

      {/* Training Days Selector Card */}
      <Rise delay={120}>
        <LiquidGlassCard style={styles.sectionCard} borderRadius={24}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionLabel, { color: palette.textMuted }]}>
              TRAINING DAYS PER WEEK
            </Text>
            <View
              style={[
                styles.intensityBadge,
                {
                  backgroundColor: hexToRgba(intensity.color, 0.15),
                  borderColor: hexToRgba(intensity.color, 0.4),
                },
              ]}
            >
              <Text style={[styles.intensityText, { color: intensity.color }]}>
                {intensity.text}
              </Text>
            </View>
          </View>

          <View style={styles.daysRow}>
            {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => {
              const isSelected = selectedDays === day;
              return (
                <TouchableOpacity
                  key={day}
                  activeOpacity={0.75}
                  onPress={() => setSelectedDays(day)}
                  style={[
                    styles.dayButton,
                    isSelected
                      ? styles.dayButtonSelected
                      : styles.dayButtonUnselected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      {
                        color: isSelected ? '#FFFFFF' : palette.textSecondary,
                        fontWeight: isSelected ? '800' : '600',
                      },
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </LiquidGlassCard>
      </Rise>

      {/* First Day of Week Card */}
      <Rise delay={180}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowDayPicker(true)}
          style={{ width: '100%' }}
        >
          <LiquidGlassCard style={styles.firstDayCard} borderRadius={20}>
            <View style={styles.firstDayInner}>
              <View>
                <Text style={[styles.sectionLabel, { color: palette.textMuted, marginBottom: 4 }]}>
                  FIRST DAY OF WEEK
                </Text>
                <Text style={[styles.firstDayValue, { color: palette.textPrimary }]}>
                  {firstDay}
                </Text>
              </View>
              <View style={styles.forwardIconBadge}>
                <Ionicons name="chevron-forward" size={18} color={palette.accentSoft} />
              </View>
            </View>
          </LiquidGlassCard>
        </TouchableOpacity>
      </Rise>

      {/* Pro Tip */}
      <Rise delay={240}>
        <LiquidGlassCard style={styles.proTipCard} borderRadius={18}>
          <View style={styles.proTipRow}>
            <View style={styles.tipIconBadge}>
              <Ionicons name="trending-up" size={18} color={palette.accent} />
            </View>
            <Text style={[styles.proTipText, { color: palette.textSecondary }]}>
              <Text style={{ fontWeight: '700', color: '#EDE9FE' }}>Pro Tip: </Text>
              Setting a 5-day goal increases consistency by 24% among dedicated athletes.
            </Text>
          </View>
        </LiquidGlassCard>
      </Rise>

      {/* Next Button */}
      <Rise delay={300}>
        <Button
          label="Continue"
          onPress={handleNext}
          size="lg"
          trailing={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
          style={styles.actionButton}
        />
      </Rise>

      {/* Day Picker Modal */}
      <Modal visible={showDayPicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDayPicker(false)}
        >
          <View style={styles.modalCardWrapper}>
            <LiquidGlassCard borderRadius={28} style={styles.modalSheet}>
              <View style={styles.modalContent}>
                <Text style={[styles.modalTitle, { color: palette.textPrimary }]}>
                  Select First Day of Week
                </Text>
                {WEEK_DAYS.map((day) => {
                  const isSelected = firstDay === day;
                  return (
                    <TouchableOpacity
                      key={day}
                      activeOpacity={0.7}
                      onPress={() => {
                        setFirstDay(day);
                        setShowDayPicker(false);
                      }}
                      style={[
                        styles.dayOption,
                        isSelected && {
                          backgroundColor: hexToRgba(palette.accent, 0.2),
                          borderColor: hexToRgba(palette.accent, 0.4),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayOptionText,
                          {
                            color: isSelected ? palette.textPrimary : palette.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {day}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={18} color={palette.accent} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </LiquidGlassCard>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    padding: 20,
    marginBottom: 16,
    width: '100%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  intensityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  intensityText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayButton: {
    flex: 1,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dayButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: 'rgba(196, 181, 253, 0.5)',
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderTopWidth: 1.5,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  dayButtonUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  dayButtonText: {
    fontSize: 17,
  },
  firstDayCard: {
    width: '100%',
    marginBottom: 16,
  },
  firstDayInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  firstDayValue: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  forwardIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  proTipCard: {
    padding: 16,
    marginBottom: 28,
    width: '100%',
  },
  proTipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    marginRight: 12,
  },
  proTipText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  actionButton: {
    width: '100%',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCardWrapper: {
    width: '100%',
    maxWidth: 380,
  },
  modalSheet: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  dayOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayOptionText: {
    fontSize: 15,
  },
});

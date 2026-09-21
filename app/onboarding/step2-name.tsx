/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ONBOARDING · STEP 2 · Your Name
 *  Liquid glass input card with glowing amethyst focus border.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLuxuryTheme, hexToRgba } from '../../src/theme/luxury';
import { Button } from '../../src/components/Button';
import { OnboardingHeader } from '../../src/components/OnboardingHeader';
import { useUserStore } from '../../src/store/userStore';
import {
  Rise,
  ScreenShell,
  StepHeading,
} from '../../src/components/onboarding/Luxury';
import { LiquidGlassCard } from '../../src/components/LiquidGlass';

export default function Step2NameScreen() {
  const router = useRouter();
  const { palette } = useLuxuryTheme();

  const currentName = useUserStore((state) => state.name);
  const [name, setName] = useState(currentName === 'User' ? '' : currentName);
  const [isFocused, setIsFocused] = useState(false);

  const isValid = name.trim().length > 0;

  const handleNext = () => {
    if (!isValid) return;
    const trimmed = name.trim();
    const initials =
      trimmed.length >= 2
        ? trimmed.substring(0, 2).toUpperCase()
        : trimmed.toUpperCase();

    useUserStore.getState().setUserProfile({ name: trimmed, initials });
    router.push('/onboarding/step3-goal');
  };

  return (
    <ScreenShell
      header={
        <OnboardingHeader
          currentStep={2}
          totalSteps={7}
          stepTitle="YOUR IDENTITY"
          onBack={() => router.back()}
        />
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <Rise delay={60}>
          <StepHeading
            eyebrow="PERSONAL IDENTITY"
            title="What should we call you?"
            subtitle="Enter your preferred name or nickname to personalize your AI fitness journey."
          />
        </Rise>

        <Rise delay={140}>
          <LiquidGlassCard
            borderRadius={22}
            style={[
              styles.inputCard,
              isFocused && {
                borderColor: palette.accent,
                borderTopColor: 'rgba(255, 255, 255, 0.7)',
                shadowColor: palette.accent,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 16,
              },
            ]}
          >
            <View style={styles.inputInnerRow}>
              <View
                style={[
                  styles.iconBadge,
                  {
                    backgroundColor: isFocused
                      ? hexToRgba(palette.accent, 0.2)
                      : 'rgba(255, 255, 255, 0.06)',
                    borderColor: isFocused
                      ? hexToRgba(palette.accent, 0.4)
                      : 'rgba(255, 255, 255, 0.1)',
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={isFocused ? palette.accent : palette.textMuted}
                />
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: palette.textPrimary,
                  },
                ]}
                placeholder="Your full name"
                placeholderTextColor={palette.textMuted}
                value={name}
                onChangeText={setName}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoCapitalize="words"
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={handleNext}
              />
            </View>
          </LiquidGlassCard>
        </Rise>

        <Rise delay={220}>
          <View style={styles.bottomSection}>
            <Button
              label="Continue"
              onPress={handleNext}
              disabled={!isValid}
              size="lg"
              trailing={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
              style={styles.actionButton}
            />
          </View>
        </Rise>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  inputCard: {
    width: '100%',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.22)',
  },
  inputInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 14,
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  bottomSection: {
    marginTop: 32,
    marginBottom: 16,
  },
  actionButton: {
    width: '100%',
  },
});

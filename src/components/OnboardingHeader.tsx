import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps?: number;
  stepTitle?: string;
  onBack?: () => void;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  currentStep,
  totalSteps = 7,
  stepTitle,
  onBack,
}) => {
  const { typography, isDark } = useTheme();

  return (
    <View style={styles.container}>
      {/* Top Controls Row */}
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.75}
            style={[
              styles.backButton,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(124, 58, 237, 0.08)',
                borderColor: isDark ? 'rgba(168, 85, 247, 0.28)' : 'rgba(124, 58, 237, 0.2)',
                borderTopColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.9)',
              },
            ]}
          >
            <Ionicons name="chevron-back" size={18} color={isDark ? '#FFFFFF' : '#19142E'} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.stepInfoContainer}>
          <Text
            style={[
              typography.labelMedium,
              styles.stepCounterText,
              { color: isDark ? '#8B82A8' : '#7C6F9B' },
            ]}
          >
            STEP {currentStep} OF {totalSteps}
          </Text>
          {stepTitle && (
            <Text
              style={[
                typography.labelLarge,
                styles.stepTitleText,
                { color: isDark ? '#EDE9FE' : '#19142E' },
              ]}
            >
              {stepTitle}
            </Text>
          )}
        </View>

        {/* Balance layout symmetrically with placeholder */}
        <View style={styles.placeholder} />
      </View>

      {/* Segmented Progress Bar */}
      <View style={styles.progressBarRow}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index < currentStep;
          return (
            <View
              key={index}
              style={[
                styles.progressSegment,
                isCompleted
                  ? styles.progressSegmentActive
                  : [
                      styles.progressSegmentInactive,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(124, 58, 237, 0.12)',
                      },
                    ],
                {
                  marginRight: index < totalSteps - 1 ? 5 : 0,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.28)',
    borderTopWidth: 1.2,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
  },
  placeholder: {
    width: 38,
    height: 38,
  },
  stepInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCounterText: {
    color: '#8B82A8',
    fontSize: 10.5,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  stepTitleText: {
    color: '#EDE9FE',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 3.5,
    width: '100%',
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    borderRadius: 3,
  },
  progressSegmentActive: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  progressSegmentInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});

export default OnboardingHeader;

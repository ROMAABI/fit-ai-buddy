import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLuxuryTheme, hexToRgba, SHADOWS } from '@/theme/luxury';
import { LiquidBackground, LiquidGlassCard } from '@/components/LiquidGlass';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTopBar, TopBarIconButton } from '@/components/AppTopBar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const FILTERS = ['Push Day', 'Pull Day', 'Leg Day', 'HIIT & Core'];

const MOCK_EXERCISES = [
  { id: '1', name: 'Barbell Bench Press', sets: '4 × 10 reps', weight: '80 kg', icon: 'barbell' },
  { id: '2', name: 'Overhead Press', sets: '3 × 12 reps', weight: '45 kg', icon: 'fitness' },
  { id: '3', name: 'Incline Dumbbell Flyes', sets: '3 × 15 reps', weight: '20 kg', icon: 'body' },
  { id: '4', name: 'Tricep Dips', sets: '4 × failure', weight: 'BW', icon: 'accessibility' },
];

export default function WorkoutScreen() {
  const { palette } = useLuxuryTheme();
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState('');

  const toggleExercise = (id: string) => {
    setCompletedExercises(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const increaseDuration = () => setDuration(prev => prev + 5);
  const decreaseDuration = () => setDuration(prev => Math.max(5, prev - 5));

  return (
    <LiquidBackground>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Unified Top Bar */}
        <AppTopBar
          leftMode="avatar"
          avatarInitials="AT"
          subtitle={activeFilter.toUpperCase()}
          title="WORKOUTS"
          rightNode={
            <>
              <ThemeSwitcher variant="compact" size={40} />
              <TopBarIconButton
                icon="add"
                accessibilityLabel="Log Workout"
                onPress={() => setModalVisible(true)}
                color={palette.accent}
                size={40}
              />
            </>
          }
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer} style={styles.filtersScroll}>
            {FILTERS.map(filter => {
              const isActive = activeFilter === filter;
              return (
                <Pressable key={filter} onPress={() => setActiveFilter(filter)}>
                  <LiquidGlassCard
                    borderRadius={20}
                    variant="subtle"
                    intensity={isActive ? 'high' : 'low'}
                    glowColor={isActive ? palette.accent : undefined}
                    style={styles.filterChip}
                    contentStyle={[
                      styles.filterChipContent,
                      isActive && { backgroundColor: hexToRgba(palette.accent, 0.15) }
                    ]}
                  >
                    <Text style={[
                      styles.filterText,
                      { color: isActive ? palette.accent : palette.textSecondary },
                      isActive && styles.filterTextActive
                    ]}>
                      {filter}
                    </Text>
                  </LiquidGlassCard>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Hero Card */}
          <LiquidGlassCard
            borderRadius={24}
            variant="elevated"
            intensity="high"
            glowColor={palette.accent}
            style={styles.heroCard}
            contentStyle={styles.heroContent}
          >
            <View style={styles.heroTop}>
              <View style={styles.heroTextContainer}>
                <Text style={[styles.heroRoutineName, { color: palette.textPrimary }]}>Push Day — Chest & Triceps</Text>
                <Text style={[styles.heroDetails, { color: palette.textSecondary }]}>4 exercises · ~45 min · 320 kcal</Text>
              </View>
              <View style={[styles.heroIconBadge, { backgroundColor: hexToRgba(palette.accent, 0.2) }]}>
                <Ionicons name="flame" size={24} color={palette.accent} />
              </View>
            </View>
            <Pressable style={styles.startButton}>
              <LinearGradient
                colors={[palette.accent, palette.accentSoft]}
                style={styles.startGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.startText}>Start Workout</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.startIcon} />
              </LinearGradient>
            </Pressable>
          </LiquidGlassCard>

          {/* Exercise List */}
          <View style={styles.exerciseList}>
            <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Today's Plan</Text>
            {MOCK_EXERCISES.map(exercise => {
              const isCompleted = completedExercises[exercise.id];
              return (
                <LiquidGlassCard
                  key={exercise.id}
                  borderRadius={20}
                  variant="subtle"
                  intensity={isCompleted ? 'low' : 'medium'}
                  glowColor={isCompleted ? palette.success : palette.accent}
                  style={styles.exerciseCard}
                  contentStyle={[
                    styles.exerciseContent,
                    isCompleted && { backgroundColor: hexToRgba(palette.success, 0.05) }
                  ]}
                >
                  <View style={styles.exerciseLeft}>
                    <View style={[
                      styles.exerciseIconBadge,
                      { backgroundColor: hexToRgba(isCompleted ? palette.success : palette.accent, 0.15) }
                    ]}>
                      <Ionicons name={exercise.icon as any} size={20} color={isCompleted ? palette.success : palette.accent} />
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text style={[
                        styles.exerciseName,
                        { color: palette.textPrimary },
                        isCompleted && styles.completedText
                      ]}>{exercise.name}</Text>
                      <Text style={[styles.exerciseSets, { color: palette.textSecondary }]}>
                        {exercise.sets} <Text style={{ color: palette.accent }}>· {exercise.weight}</Text>
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => toggleExercise(exercise.id)} style={styles.checkboxContainer}>
                    <Ionicons 
                      name={isCompleted ? "checkmark-circle" : "ellipse-outline"} 
                      size={28} 
                      color={isCompleted ? palette.success : palette.textMuted} 
                    />
                  </Pressable>
                </LiquidGlassCard>
              );
            })}
          </View>
        </ScrollView>

        {/* Modal */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={[styles.modalOverlay, { backgroundColor: 'rgba(8,4,16,0.94)' }]}>
            <SafeAreaView style={styles.modalSafe}>
              <LiquidGlassCard
                borderRadius={28}
                variant="elevated"
                intensity="high"
                glowColor={palette.accent}
                style={styles.modalCard}
                contentStyle={styles.modalContent}
              >
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: palette.textPrimary }]}>Log Workout Session</Text>
                  <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={palette.textPrimary} />
                  </Pressable>
                </View>

                <View style={styles.modalBody}>
                  <Text style={[styles.inputLabel, { color: palette.textSecondary }]}>Duration (minutes)</Text>
                  <View style={styles.stepper}>
                    <Pressable onPress={decreaseDuration} style={[styles.stepButton, { backgroundColor: hexToRgba(palette.accent, 0.1) }]}>
                      <Ionicons name="remove" size={24} color={palette.accent} />
                    </Pressable>
                    <Text style={[styles.durationText, { color: palette.textPrimary }]}>{duration}</Text>
                    <Pressable onPress={increaseDuration} style={[styles.stepButton, { backgroundColor: hexToRgba(palette.accent, 0.1) }]}>
                      <Ionicons name="add" size={24} color={palette.accent} />
                    </Pressable>
                  </View>

                  <Text style={[styles.inputLabel, { color: palette.textSecondary }]}>Notes</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      { 
                        color: palette.textPrimary,
                        backgroundColor: hexToRgba(palette.surface, 0.4),
                        borderColor: hexToRgba(palette.hairline, 0.3)
                      }
                    ]}
                    placeholder="How did you feel today?"
                    placeholderTextColor={palette.textMuted}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <Pressable onPress={() => setModalVisible(false)} style={styles.saveButton}>
                  <LinearGradient
                    colors={[palette.accent, palette.accentSoft]}
                    style={styles.saveGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.saveText}>Save Session</Text>
                  </LinearGradient>
                </Pressable>
              </LiquidGlassCard>
            </SafeAreaView>
          </View>
        </Modal>
      </SafeAreaView>
    </LiquidBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  activeTagText: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 12,
    fontWeight: '700',
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  filtersScroll: {
    flexGrow: 0,
    marginBottom: 24,
  },
  filtersContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  filterChip: {
  },
  filterChipContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterText: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    fontWeight: '800',
  },
  heroCard: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  heroContent: {
    padding: 24,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  heroRoutineName: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroDetails: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 14,
    fontWeight: '500',
  },
  heroIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  startText: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  startIcon: {
    marginLeft: 4,
  },
  exerciseList: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  exerciseCard: {
    marginBottom: 12,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  exerciseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  exerciseIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  exerciseSets: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 13,
  },
  checkboxContainer: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalSafe: {
    width: '100%',
  },
  modalCard: {
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  stepButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationText: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 32,
    fontWeight: '700',
  },
  textInput: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveText: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

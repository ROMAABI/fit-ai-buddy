import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLuxuryTheme, hexToRgba } from '../src/theme/luxury';
import { useUserStore } from '../src/store/userStore';
import { authService } from '../src/services/auth';
import { Button } from '../src/components/Button';
import { Sex, Objective, FitnessLevel, DayOfWeek } from '../src/types';
import { LiquidBackground, LiquidGlassCard } from '../src/components/LiquidGlass';
import { ThemeSwitcher } from '../src/components/ThemeSwitcher';
import { AppTopBar, TopBarIconButton } from '../src/components/AppTopBar';

export default function ProfileScreen() {
  const router = useRouter();
  const { palette, isDark } = useLuxuryTheme();
  const user = useUserStore();

  // Edit Profile Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editSex, setEditSex] = useState<Sex>(user.sex);
  const [editObjective, setEditObjective] = useState<Objective>(user.objective);
  const [editFitnessLevel, setEditFitnessLevel] = useState<FitnessLevel>(user.fitnessLevel);
  const [editTrainingDays, setEditTrainingDays] = useState<number>(user.trainingDaysPerWeek);
  const [editFirstDay, setEditFirstDay] = useState<DayOfWeek>(user.firstDayOfWeek);
  const [editWeight, setEditWeight] = useState<number>(user.weight || 70);
  const [editHeight, setEditHeight] = useState<number>(user.height || 175);
  const [editAge, setEditAge] = useState<number>(user.age || 25);
  const [saving, setSaving] = useState(false);

  const handleOpenEdit = () => {
    setEditName(user.name);
    setEditSex(user.sex);
    setEditObjective(user.objective);
    setEditFitnessLevel(user.fitnessLevel);
    setEditTrainingDays(user.trainingDaysPerWeek);
    setEditFirstDay(user.firstDayOfWeek);
    setEditWeight(user.weight || 70);
    setEditHeight(user.height || 175);
    setEditAge(user.age || 25);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      const updatedData = {
        name: editName.trim(),
        sex: editSex,
        objective: editObjective,
        fitnessLevel: editFitnessLevel,
        trainingDaysPerWeek: editTrainingDays,
        firstDayOfWeek: editFirstDay,
        weight: editWeight,
        height: editHeight,
        age: editAge,
      };

      user.setUserProfile(updatedData);
      await authService.saveUserProfileToFirebase(updatedData);
      setIsEditModalOpen(false);
    } catch (e) {
      console.warn('Failed to update profile:', e);
      Alert.alert('Notice', 'Profile saved locally.');
      setIsEditModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await authService.signOut();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <LiquidBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Unified Top Bar */}
        <AppTopBar
          leftMode="back"
          onBackPress={() => router.back()}
          title="PROFILE & PROTOCOL"
          rightNode={
            <>
              <ThemeSwitcher variant="compact" size={40} />
              <TopBarIconButton
                icon="create-outline"
                accessibilityLabel="Edit Profile"
                onPress={handleOpenEdit}
                color={palette.accentSoft}
                size={40}
              />
            </>
          }
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Profile Card */}
          <LiquidGlassCard
            borderRadius={26}
            style={styles.heroCard}
            contentStyle={{ alignItems: 'center' }}
          >
            <View style={styles.avatarWrapper}>
              <View
                style={[
                  styles.avatarContainer,
                  {
                    backgroundColor: hexToRgba(palette.accent, 0.18),
                    borderColor: hexToRgba(palette.accent, 0.4),
                  },
                ]}
              >
                <Text style={[styles.avatarText, { color: palette.accentSoft }]}>
                  {user.initials ? user.initials.toUpperCase() : 'U'}
                </Text>
              </View>

              <View
                style={[
                  styles.fitnessBadge,
                  {
                    backgroundColor: '#8B5CF6',
                    borderColor: 'rgba(196, 181, 253, 0.4)',
                  },
                ]}
              >
                <Text style={styles.fitnessBadgeText}>
                  {user.fitnessLevel ? user.fitnessLevel.toUpperCase() : 'ACTIVE'}
                </Text>
              </View>
            </View>

            <View style={styles.userTextContainer}>
              <Text style={[styles.userName, { color: palette.textPrimary }]}>
                {user.name || 'Athlete'}
              </Text>

              <Text style={[styles.userSubtext, { color: palette.textSecondary }]}>
                {user.sex} • {user.objective}
              </Text>

              {user.email ? (
                <Text style={[styles.userEmail, { color: palette.textMuted }]}>
                  {user.email}
                </Text>
              ) : null}
            </View>

            <Button
              label="Edit Profile"
              variant="secondary"
              size="sm"
              onPress={handleOpenEdit}
              leading={
                <Ionicons
                  name="create-outline"
                  size={16}
                  color={isDark ? '#FFFFFF' : palette.textPrimary}
                />
              }
              style={styles.editButton}
            />
          </LiquidGlassCard>

          {/* Biometrics & Training Specs */}
          <Text style={[styles.sectionTitle, { color: palette.textMuted }]}>
            BIOMETRICS & PROTOCOL
          </Text>

          <View style={styles.specsRow}>
            <LiquidGlassCard borderRadius={18} style={styles.specCard}>
              <View style={styles.specHeader}>
                <Ionicons name="scale-outline" size={16} color="#A78BFA" />
                <Text style={[styles.specLabel, { color: palette.textMuted }]}>WEIGHT</Text>
              </View>
              <Text style={[styles.specValue, { color: palette.textPrimary }]}>
                {user.weight ? `${user.weight} kg` : '--'}
              </Text>
            </LiquidGlassCard>

            <LiquidGlassCard borderRadius={18} style={styles.specCard}>
              <View style={styles.specHeader}>
                <Ionicons name="resize-outline" size={16} color="#60A5FA" />
                <Text style={[styles.specLabel, { color: palette.textMuted }]}>HEIGHT</Text>
              </View>
              <Text style={[styles.specValue, { color: palette.textPrimary }]}>
                {user.height ? `${user.height} cm` : '--'}
              </Text>
            </LiquidGlassCard>
          </View>

          <View style={styles.specsRow}>
            <LiquidGlassCard borderRadius={18} style={styles.specCard}>
              <View style={styles.specHeader}>
                <Ionicons name="calendar-outline" size={16} color="#F472B6" />
                <Text style={[styles.specLabel, { color: palette.textMuted }]}>AGE</Text>
              </View>
              <Text style={[styles.specValue, { color: palette.textPrimary }]}>
                {user.age ? `${user.age} yrs` : '--'}
              </Text>
            </LiquidGlassCard>

            <LiquidGlassCard borderRadius={18} style={styles.specCard}>
              <View style={styles.specHeader}>
                <Ionicons name="fitness-outline" size={16} color="#FBBF24" />
                <Text style={[styles.specLabel, { color: palette.textMuted }]}>TRAINING</Text>
              </View>
              <Text style={[styles.specValue, { color: palette.textPrimary }]}>
                {user.trainingDaysPerWeek} days/wk
              </Text>
            </LiquidGlassCard>
          </View>

          {/* Appearance & Theme Mode */}
          <Text style={[styles.sectionTitle, { color: palette.textMuted }]}>
            APPEARANCE & THEME
          </Text>

          <View style={{ marginBottom: 24 }}>
            <ThemeSwitcher variant="segmented" />
          </View>

          {/* Account Actions */}
          <View style={styles.actionsSection}>
            <Button
              label="Sign Out"
              variant="secondary"
              onPress={handleSignOut}
              leading={<Ionicons name="log-out-outline" size={18} color="#EF4444" />}
              textStyle={{ color: '#EF4444' }}
              style={{ marginBottom: 12 }}
            />
          </View>
        </ScrollView>

        {/* Edit Profile Modal */}
        <Modal
          visible={isEditModalOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsEditModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCardWrapper}>
              <LiquidGlassCard borderRadius={28} style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: palette.textPrimary }]}>
                    Edit Profile
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsEditModalOpen(false)}
                    style={styles.modalCloseBtn}
                  >
                    <Ionicons name="close" size={22} color={palette.textMuted} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  contentContainerStyle={styles.modalScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Name */}
                  <Text style={[styles.inputLabel, { color: palette.textMuted }]}>FULL NAME</Text>
                  <TextInput
                    value={editName}
                    onChangeText={setEditName}
                    style={[
                      styles.modalInput,
                      {
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        borderColor: 'rgba(168, 85, 247, 0.25)',
                        color: palette.textPrimary,
                      },
                    ]}
                    placeholder="Your name"
                    placeholderTextColor={palette.textMuted}
                  />

                  {/* Sex */}
                  <Text style={[styles.inputLabel, { color: palette.textMuted, marginTop: 14 }]}>
                    BIOLOGICAL SEX
                  </Text>
                  <View style={styles.pillsRow}>
                    {(['Male', 'Female'] as Sex[]).map((sex) => (
                      <TouchableOpacity
                        key={sex}
                        onPress={() => setEditSex(sex)}
                        style={[
                          styles.pill,
                          {
                            backgroundColor:
                              editSex === sex ? '#8B5CF6' : 'rgba(255, 255, 255, 0.06)',
                            borderColor:
                              editSex === sex ? 'rgba(196, 181, 253, 0.45)' : 'rgba(168, 85, 247, 0.22)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pillText,
                            {
                              color: editSex === sex ? '#FFFFFF' : palette.textSecondary,
                              fontWeight: editSex === sex ? '700' : '500',
                            },
                          ]}
                        >
                          {sex}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Objective */}
                  <Text style={[styles.inputLabel, { color: palette.textMuted, marginTop: 14 }]}>
                    FITNESS OBJECTIVE
                  </Text>
                  <View style={styles.pillsRow}>
                    {(['Lose Weight', 'Build Muscle', 'Keep Fit'] as Objective[]).map((obj) => (
                      <TouchableOpacity
                        key={obj}
                        onPress={() => setEditObjective(obj)}
                        style={[
                          styles.pill,
                          {
                            backgroundColor:
                              editObjective === obj ? '#8B5CF6' : 'rgba(255, 255, 255, 0.06)',
                            borderColor:
                              editObjective === obj ? 'rgba(196, 181, 253, 0.45)' : 'rgba(168, 85, 247, 0.22)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pillText,
                            {
                              color: editObjective === obj ? '#FFFFFF' : palette.textSecondary,
                              fontWeight: editObjective === obj ? '700' : '500',
                            },
                          ]}
                        >
                          {obj}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Fitness Level */}
                  <Text style={[styles.inputLabel, { color: palette.textMuted, marginTop: 14 }]}>
                    FITNESS LEVEL
                  </Text>
                  <View style={styles.pillsRow}>
                    {(['Beginner', 'Intermediate', 'Advanced'] as FitnessLevel[]).map((level) => (
                      <TouchableOpacity
                        key={level}
                        onPress={() => setEditFitnessLevel(level)}
                        style={[
                          styles.pill,
                          {
                            backgroundColor:
                              editFitnessLevel === level ? '#8B5CF6' : 'rgba(255, 255, 255, 0.06)',
                            borderColor:
                              editFitnessLevel === level ? 'rgba(196, 181, 253, 0.45)' : 'rgba(168, 85, 247, 0.22)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pillText,
                            {
                              color: editFitnessLevel === level ? '#FFFFFF' : palette.textSecondary,
                              fontWeight: editFitnessLevel === level ? '700' : '500',
                            },
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Training Days */}
                  <Text style={[styles.inputLabel, { color: palette.textMuted, marginTop: 14 }]}>
                    TRAINING DAYS / WEEK ({editTrainingDays} DAYS)
                  </Text>
                  <View style={styles.daysRow}>
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <TouchableOpacity
                        key={d}
                        onPress={() => setEditTrainingDays(d)}
                        style={[
                          styles.dayBtn,
                          {
                            backgroundColor:
                              editTrainingDays === d ? '#8B5CF6' : 'rgba(255, 255, 255, 0.06)',
                            borderColor:
                              editTrainingDays === d ? 'rgba(196, 181, 253, 0.45)' : 'rgba(168, 85, 247, 0.22)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayBtnText,
                            {
                              color: editTrainingDays === d ? '#FFFFFF' : palette.textSecondary,
                              fontWeight: editTrainingDays === d ? '700' : '500',
                            },
                          ]}
                        >
                          {d}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Weight & Height Steppers */}
                  <View style={styles.metricsEditRow}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={[styles.inputLabel, { color: palette.textMuted }]}>
                        WEIGHT (KG)
                      </Text>
                      <View style={styles.stepperContainer}>
                        <TouchableOpacity
                          onPress={() => setEditWeight((w) => Math.max(30, w - 1))}
                          style={styles.stepperBtn}
                        >
                          <Ionicons name="remove" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={[styles.stepperValue, { color: palette.textPrimary }]}>
                          {editWeight}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setEditWeight((w) => Math.min(250, w + 1))}
                          style={styles.stepperBtn}
                        >
                          <Ionicons name="add" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={[styles.inputLabel, { color: palette.textMuted }]}>
                        HEIGHT (CM)
                      </Text>
                      <View style={styles.stepperContainer}>
                        <TouchableOpacity
                          onPress={() => setEditHeight((h) => Math.max(100, h - 1))}
                          style={styles.stepperBtn}
                        >
                          <Ionicons name="remove" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={[styles.stepperValue, { color: palette.textPrimary }]}>
                          {editHeight}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setEditHeight((h) => Math.min(240, h + 1))}
                          style={styles.stepperBtn}
                        >
                          <Ionicons name="add" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <Button
                    label="Save Changes"
                    onPress={handleSaveProfile}
                    loading={saving}
                    size="lg"
                    style={{ marginTop: 24, marginBottom: 10 }}
                  />
                </ScrollView>
              </LiquidGlassCard>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LiquidBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  topBarTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.28)',
    borderTopWidth: 1.2,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  heroCard: {
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '900',
  },
  fitnessBadge: {
    position: 'absolute',
    bottom: -8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  fitnessBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  userTextContainer: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  userSubtext: {
    fontSize: 13,
    marginBottom: 2,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  editButton: {
    minWidth: 154,
    height: 42,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  specCard: {
    flex: 1,
    padding: 14,
  },
  specHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  specLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  actionsSection: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 4, 16, 0.94)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalCardWrapper: {
    width: '100%',
    maxHeight: '85%',
  },
  modalCard: {
    width: '100%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScroll: {
    paddingBottom: 10,
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  modalInput: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  dayBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  dayBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  metricsEditRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  stepperBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});

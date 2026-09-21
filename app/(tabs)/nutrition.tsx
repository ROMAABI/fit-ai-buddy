import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLuxuryTheme, hexToRgba, SHADOWS } from '@/theme/luxury';
import { LiquidBackground, LiquidGlassCard } from '@/components/LiquidGlass';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTopBar, TopBarIconButton } from '@/components/AppTopBar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function NutritionScreen() {
  const { palette, isDark } = useLuxuryTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('Lunch');

  const textColor = palette.textPrimary;
  const secondaryTextColor = palette.textSecondary;

  const renderProgressBar = (current: number, total: number, color: string) => {
    const percentage = Math.min((current / total) * 100, 100);
    return (
      <View style={[styles.progressTrack, { backgroundColor: hexToRgba(color, 0.2) }]}>
        <LinearGradient
          colors={[color, hexToRgba(color, 0.7)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${percentage}%` }]}
        />
      </View>
    );
  };

  const MealCard = ({ title, calories, description, time, icon }: any) => (
    <LiquidGlassCard intensity="low" borderRadius={16} style={styles.mealCard}>
      <View style={styles.mealCardHeader}>
        <View style={styles.mealIconContainer}>
          <Ionicons name={icon} size={20} color={palette.accent} />
        </View>
        <View style={styles.mealInfo}>
          <Text style={[styles.mealTitle, { color: textColor }]}>{title}</Text>
          <Text style={[styles.mealDescription, { color: secondaryTextColor }]}>{description}</Text>
        </View>
        <View style={styles.mealRight}>
          <Text style={[styles.mealCalories, { color: textColor }]}>{calories} kcal</Text>
          <Text style={[styles.mealTime, { color: secondaryTextColor }]}>{time}</Text>
        </View>
      </View>
    </LiquidGlassCard>
  );

  return (
    <LiquidBackground>
      <SafeAreaView style={styles.container}>
        {/* Unified Top Bar */}
        <AppTopBar
          leftMode="avatar"
          avatarInitials="AT"
          subtitle="TODAY · SEP 22"
          title="NUTRITION"
          rightNode={
            <>
              <ThemeSwitcher variant="compact" size={40} />
              <TopBarIconButton
                icon="add"
                accessibilityLabel="Log Meal"
                onPress={() => setModalVisible(true)}
                color={palette.accent}
                size={40}
              />
            </>
          }
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Calorie Target Hero Card */}
          <LiquidGlassCard intensity="high" borderRadius={24} style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <Text style={[styles.heroSubtitle, { color: secondaryTextColor }]}>Daily Target</Text>
              <View style={[styles.statusBadge, { backgroundColor: hexToRgba(palette.success, 0.2) }]}>
                <Text style={[styles.statusText, { color: palette.success }]}>On track</Text>
              </View>
            </View>
            <View style={styles.heroCalories}>
              <Text style={[styles.heroCaloriesNumber, { color: textColor }]}>1,840</Text>
              <Text style={[styles.heroCaloriesTotal, { color: secondaryTextColor }]}> / 2,400 kcal</Text>
            </View>
            {renderProgressBar(1840, 2400, palette.accent)}
          </LiquidGlassCard>

          {/* Macro Breakdown Row */}
          <View style={styles.macrosRow}>
            {/* Protein */}
            <LiquidGlassCard intensity="low" borderRadius={16} style={styles.macroCard}>
              <Text style={[styles.macroTitle, { color: secondaryTextColor }]}>Protein</Text>
              <Text style={[styles.macroValue, { color: textColor }]}>140g <Text style={styles.macroTotal}>/ 180g</Text></Text>
              {renderProgressBar(140, 180, palette.accent)}
            </LiquidGlassCard>
            
            {/* Carbs */}
            <LiquidGlassCard intensity="low" borderRadius={16} style={styles.macroCard}>
              <Text style={[styles.macroTitle, { color: secondaryTextColor }]}>Carbs</Text>
              <Text style={[styles.macroValue, { color: textColor }]}>195g <Text style={styles.macroTotal}>/ 250g</Text></Text>
              {renderProgressBar(195, 250, '#DA70D6')} {/* Orchid */}
            </LiquidGlassCard>

            {/* Fats */}
            <LiquidGlassCard intensity="low" borderRadius={16} style={styles.macroCard}>
              <Text style={[styles.macroTitle, { color: secondaryTextColor }]}>Fats</Text>
              <Text style={[styles.macroValue, { color: textColor }]}>52g <Text style={styles.macroTotal}>/ 65g</Text></Text>
              {renderProgressBar(52, 65, '#FFD700')} {/* Gold */}
            </LiquidGlassCard>
          </View>

          {/* Meal Timeline */}
          <Text style={[styles.sectionTitle, { color: textColor }]}>Meals</Text>
          <View style={styles.timeline}>
            <MealCard title="Breakfast" calories={480} description="Oats, banana, whey shake" time="8:30 AM" icon="cafe-outline" />
            <MealCard title="Lunch" calories={620} description="Grilled chicken, rice, veggies" time="1:00 PM" icon="restaurant-outline" />
            <MealCard title="Snack" calories={200} description="Greek yogurt, almonds" time="4:00 PM" icon="nutrition-outline" />
            <MealCard title="Dinner" calories={540} description="Salmon, sweet potato, broccoli" time="7:30 PM" icon="fast-food-outline" />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Log Meal Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <LiquidGlassCard intensity="high" borderRadius={24} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Log Meal</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={textColor} />
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
              {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map(type => (
                <Pressable key={type} onPress={() => setSelectedMealType(type)} style={[styles.chip, selectedMealType === type ? { backgroundColor: palette.accent } : { backgroundColor: hexToRgba(palette.surface, 0.5) }]}>
                  <Text style={[styles.chipText, { color: selectedMealType === type ? '#000' : textColor }]}>{type}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <TextInput
              style={[styles.input, { backgroundColor: hexToRgba(palette.surface, 0.5), color: textColor, borderColor: hexToRgba(palette.hairline, 0.5) }]}
              placeholder="Food name..."
              placeholderTextColor={secondaryTextColor}
            />
            
            <View style={styles.macrosInputRow}>
              <View style={styles.macroInputContainer}>
                <Text style={[styles.macroInputLabel, { color: secondaryTextColor }]}>Calories</Text>
                <TextInput style={[styles.macroInput, { backgroundColor: hexToRgba(palette.surface, 0.5), color: textColor }]} keyboardType="numeric" placeholder="0" placeholderTextColor={secondaryTextColor} />
              </View>
              <View style={styles.macroInputContainer}>
                <Text style={[styles.macroInputLabel, { color: secondaryTextColor }]}>Protein</Text>
                <TextInput style={[styles.macroInput, { backgroundColor: hexToRgba(palette.surface, 0.5), color: textColor }]} keyboardType="numeric" placeholder="0g" placeholderTextColor={secondaryTextColor} />
              </View>
            </View>
            <View style={styles.macrosInputRow}>
              <View style={styles.macroInputContainer}>
                <Text style={[styles.macroInputLabel, { color: secondaryTextColor }]}>Carbs</Text>
                <TextInput style={[styles.macroInput, { backgroundColor: hexToRgba(palette.surface, 0.5), color: textColor }]} keyboardType="numeric" placeholder="0g" placeholderTextColor={secondaryTextColor} />
              </View>
              <View style={styles.macroInputContainer}>
                <Text style={[styles.macroInputLabel, { color: secondaryTextColor }]}>Fats</Text>
                <TextInput style={[styles.macroInput, { backgroundColor: hexToRgba(palette.surface, 0.5), color: textColor }]} keyboardType="numeric" placeholder="0g" placeholderTextColor={secondaryTextColor} />
              </View>
            </View>

            <Pressable style={[styles.saveButton, { backgroundColor: palette.accent }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.saveButtonText}>Save Meal</Text>
            </Pressable>
          </LiquidGlassCard>
        </View>
      </Modal>
    </LiquidBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  datePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  logButton: {
    padding: 8,
  },
  logButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  heroCard: {
    padding: 24,
    marginBottom: 16,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  heroCalories: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    gap: 4,
  },
  heroCaloriesNumber: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 50,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  heroCaloriesTotal: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    paddingBottom: 4,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  macroCard: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
  },
  macroTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  macroTotal: {
    fontSize: 12,
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    marginLeft: 4,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  timeline: {
    gap: 12,
  },
  mealCard: {
    padding: 16,
  },
  mealCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  mealDescription: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  mealRight: {
    alignItems: 'flex-end',
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  mealTime: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  chipsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 16,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  macrosInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  macroInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  macroInputLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  macroInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  saveButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
});

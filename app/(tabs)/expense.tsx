import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLuxuryTheme, hexToRgba, SHADOWS } from '@/theme/luxury';
import { LiquidBackground, LiquidGlassCard } from '@/components/LiquidGlass';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTopBar, TopBarIconButton } from '@/components/AppTopBar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const CATEGORIES = ['All', 'Gym', 'Supplements', 'Gear', 'Coaching'];

const MOCK_TRANSACTIONS = [
  { id: '1', name: 'Premium Gym Membership', amount: 89, date: 'Sep 1', category: 'Gym', icon: 'barbell-outline' },
  { id: '2', name: 'Whey Protein (5lb)', amount: 52, date: 'Sep 5', category: 'Supplements', icon: 'flask-outline' },
  { id: '3', name: 'Running Shoes', amount: 129, date: 'Sep 8', category: 'Gear', icon: 'walk-outline' },
  { id: '4', name: 'Personal Training (4x)', amount: 45, date: 'Sep 12', category: 'Coaching', icon: 'people-outline' },
  { id: '5', name: 'Creatine Monohydrate', amount: 18, date: 'Sep 15', category: 'Supplements', icon: 'flask-outline' },
  { id: '6', name: 'Resistance Bands Set', amount: 7, date: 'Sep 18', category: 'Gear', icon: 'fitness-outline' },
];

export default function ExpenseScreen() {
  const { palette, isDark } = useLuxuryTheme();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Gym');

  const filteredTransactions = activeFilter === 'All'
    ? MOCK_TRANSACTIONS
    : MOCK_TRANSACTIONS.filter(t => t.category === activeFilter);

  const budget = 500;
  const spent = 340;
  const remaining = budget - spent;
  const progressPercent = (spent / budget) * 100;

  return (
    <LiquidBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Unified Top Bar */}
        <AppTopBar
          leftMode="avatar"
          avatarInitials="AT"
          subtitle="SEPTEMBER"
          title="EXPENSES"
          rightNode={
            <>
              <ThemeSwitcher variant="compact" size={40} />
              <TopBarIconButton
                icon="add"
                accessibilityLabel="Add Expense"
                onPress={() => setIsModalVisible(true)}
                color={palette.accent}
                size={40}
              />
            </>
          }
        />

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Budget Hero Card */}
          <LiquidGlassCard intensity="high" style={styles.heroCard} borderRadius={24}>
            <View style={styles.heroTopRow}>
              <View>
                <Text style={[styles.heroSpent, { color: palette.textPrimary }]}>₹{spent}</Text>
                <Text style={[styles.heroSubtitle, { color: palette.textSecondary }]}>/ ₹{budget} budget</Text>
              </View>
              <View style={[styles.remainingBadge, { backgroundColor: hexToRgba(palette.success, 0.2) }]}>
                <Text style={[styles.remainingText, { color: palette.success }]}>₹{remaining} remaining</Text>
              </View>
            </View>

            <View style={[styles.progressTrack, { backgroundColor: hexToRgba(palette.textPrimary, 0.1) }]}>
              <LinearGradient
                colors={[palette.accent, palette.accentSoft]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progressPercent}%` }]}
              />
            </View>
          </LiquidGlassCard>

          {/* Category Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
            {CATEGORIES.map(category => {
              const isActive = activeFilter === category;
              return (
                <Pressable
                  key={category}
                  onPress={() => setActiveFilter(category)}
                  style={[
                    styles.filterChip,
                    { backgroundColor: isActive ? palette.accent : hexToRgba(palette.surfaceRaised, 0.5) },
                    !isActive && { borderColor: hexToRgba(palette.textPrimary, 0.1), borderWidth: 1 }
                  ]}
                >
                  <Text style={[styles.filterChipText, { color: isActive ? '#fff' : palette.textSecondary }]}>
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Transaction List */}
          <View style={styles.transactionList}>
            {filteredTransactions.map(tx => (
              <LiquidGlassCard key={tx.id} intensity="low" style={styles.txCard} borderRadius={16}>
                <View style={styles.txRow}>
                  <View style={[styles.txIconContainer, { backgroundColor: hexToRgba(palette.accent, 0.1) }]}>
                    <Ionicons name={tx.icon as any} size={20} color={palette.accent} />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={[styles.txName, { color: palette.textPrimary }]}>{tx.name}</Text>
                    <Text style={[styles.txDate, { color: palette.textSecondary }]}>{tx.date}</Text>
                  </View>
                  <Text style={[styles.txAmount, { color: palette.textPrimary }]}>₹{tx.amount}</Text>
                </View>
              </LiquidGlassCard>
            ))}
          </View>
        </ScrollView>

        {/* Add Expense Modal */}
        <Modal visible={isModalVisible} transparent animationType="fade">
          <View style={[styles.modalOverlay, { backgroundColor: hexToRgba('#000', 0.6) }]}>
            <View style={styles.modalContent}>
              <LiquidGlassCard intensity="high" borderRadius={24} style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: palette.textPrimary }]}>Add Expense</Text>
                  <Pressable onPress={() => setIsModalVisible(false)}>
                    <Ionicons name="close" size={24} color={palette.textSecondary} />
                  </Pressable>
                </View>

                <Text style={[styles.inputLabel, { color: palette.textSecondary }]}>Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: hexToRgba(palette.surfaceRaised, 0.3), color: palette.textPrimary, borderColor: hexToRgba(palette.textPrimary, 0.1) }]}
                  placeholder="e.g., Pre-workout"
                  placeholderTextColor={hexToRgba(palette.textPrimary, 0.3)}
                  value={newName}
                  onChangeText={setNewName}
                />

                <Text style={[styles.inputLabel, { color: palette.textSecondary }]}>Amount</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: hexToRgba(palette.surfaceRaised, 0.3), color: palette.textPrimary, borderColor: hexToRgba(palette.textPrimary, 0.1) }]}
                  placeholder="0.00"
                  placeholderTextColor={hexToRgba(palette.textPrimary, 0.3)}
                  keyboardType="numeric"
                  value={newAmount}
                  onChangeText={setNewAmount}
                />

                <Text style={[styles.inputLabel, { color: palette.textSecondary }]}>Category</Text>
                <View style={styles.modalCategories}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => {
                    const isSelected = newCategory === c;
                    return (
                      <Pressable
                        key={c}
                        onPress={() => setNewCategory(c)}
                        style={[
                          styles.modalCategoryChip,
                          { backgroundColor: isSelected ? hexToRgba(palette.accent, 0.2) : hexToRgba(palette.surfaceRaised, 0.3) },
                          isSelected && { borderColor: palette.accent, borderWidth: 1 }
                        ]}
                      >
                        <Text style={[styles.modalCategoryText, { color: isSelected ? palette.accent : palette.textSecondary }]}>
                          {c}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable
                  style={({ pressed }) => [styles.saveButton, pressed && { opacity: 0.8 }]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <LinearGradient
                    colors={[palette.accent, palette.accentSoft]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveButtonGradient}
                  >
                    <Text style={styles.saveButtonText}>Save Expense</Text>
                  </LinearGradient>
                </Pressable>
              </LiquidGlassCard>
            </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  monthPillText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  heroCard: {
    padding: 24,
    marginBottom: 24,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  heroSpent: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 52,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 4,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  remainingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  remainingText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  filterScroll: {
    marginHorizontal: -24,
    marginBottom: 24,
  },
  filterContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  transactionList: {
    gap: 12,
  },
  txCard: {
    padding: 16,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  txIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: {
    flex: 1,
  },
  txName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  txDate: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  txAmount: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
  },
  modalCard: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  modalCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  modalCategoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modalCategoryText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  saveButton: {
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
});

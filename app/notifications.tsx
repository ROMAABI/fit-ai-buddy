import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLuxuryTheme, hexToRgba } from '@/theme/luxury';
import { LiquidBackground, LiquidGlassCard } from '@/components/LiquidGlass';
import { AppTopBar, TopBarIconButton } from '@/components/AppTopBar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function NotificationsScreen() {
  const router = useRouter();
  const { palette } = useLuxuryTheme();
  
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Workout Reminder',
      message: 'Push Day is scheduled for today at 6:00 PM',
      time: '2h ago',
      icon: 'barbell',
      tint: palette.accent,
    },
    {
      id: '2',
      title: 'Hydration Target Met',
      message: 'You reached your 3L water intake goal!',
      time: '4h ago',
      icon: 'water',
      tint: '#60A5FA', // Blue tint
    },
    {
      id: '3',
      title: 'Macro Goal Reached',
      message: 'Daily protein target of 180g achieved',
      time: '6h ago',
      icon: 'nutrition',
      tint: '#34D399', // Success tint
    },
    {
      id: '4',
      title: 'AI Coach Tip',
      message: 'Consider adding 5 mins of mobility work post-workout',
      time: '1d ago',
      icon: 'sparkles',
      tint: '#D946EF', // Orchid tint
    },
    {
      id: '5',
      title: 'Expense Alert',
      message: 'Monthly fitness budget is 68% utilized',
      time: '2d ago',
      icon: 'wallet',
      tint: '#FBBF24', // Gold tint
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications([]);
  };

  return (
    <LiquidBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Unified Top Bar */}
        <AppTopBar
          leftMode="back"
          onBackPress={() => router.back()}
          title="NOTIFICATIONS"
          rightNode={
            <>
              <ThemeSwitcher variant="compact" size={40} />
              <TopBarIconButton
                icon="checkmark-done-outline"
                accessibilityLabel="Mark All Read"
                onPress={handleMarkAllRead}
                color={palette.accentSoft}
                size={40}
              />
            </>
          }
        />

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color={palette.textMuted} />
              <Text style={[styles.emptyTitle, { color: palette.textPrimary }]}>
                All caught up
              </Text>
              <Text style={[styles.emptySubtitle, { color: palette.textMuted }]}>
                You have no new notifications.
              </Text>
            </View>
          ) : (
            notifications.map((notif) => (
              <LiquidGlassCard
                key={notif.id}
                borderRadius={20}
                style={styles.notificationCard}
                contentStyle={styles.cardContent}
              >
                <View
                  style={[
                    styles.iconBadge,
                    {
                      backgroundColor: hexToRgba(notif.tint, 0.15),
                      borderColor: hexToRgba(notif.tint, 0.3),
                    },
                  ]}
                >
                  {/* @ts-ignore - dynamic icon names */}
                  <Ionicons name={notif.icon} size={22} color={notif.tint} />
                </View>
                
                <View style={styles.textContainer}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: palette.textPrimary }]}>
                      {notif.title}
                    </Text>
                    <Text style={[styles.time, { color: palette.textMuted }]}>
                      {notif.time}
                    </Text>
                  </View>
                  <Text style={[styles.message, { color: palette.textSecondary }]}>
                    {notif.message}
                  </Text>
                </View>
              </LiquidGlassCard>
            ))
          )}
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderTopWidth: 1.2,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
  },
  headerTitle: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  markReadButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  markReadText: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  notificationCard: {
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 11,
    fontWeight: '500',
  },
  message: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 13,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontSize: 14,
    textAlign: 'center',
  },
});

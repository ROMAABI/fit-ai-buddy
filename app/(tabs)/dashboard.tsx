import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart, LineChart } from 'react-native-gifted-charts';

import { useLuxuryTheme, hexToRgba, type LuxuryPalette } from '@/theme/luxury';
import { useUserStore } from '@/store/useUserStore';
import { CircularProgressRing } from '@/components/CircularProgressRing';
import { StatCard, type StatCardTrend } from '@/components/StatCard';
import { LiquidBackground, LiquidGlassCard } from '@/components/LiquidGlass';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { AppTopBar, TopBarIconButton } from '@/components/AppTopBar';

/* ── Data Seam & Configuration ───────────────────────────────────────────── */

const DAY_MS = 86400000;
const CURRENCY_SYMBOL = '₹';

export type Timeframe = 'day' | 'week' | 'month' | 'year';

const TIMEFRAMES: { id: Timeframe; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
];

type Loose = Record<string, any>;

interface CategorySpend {
  name: string;
  amount: number;
  share: number;
}

interface DashboardSnapshot {
  displayName: string;
  initials: string;
  calorieGoal: number;
  streakDays: number;

  // Day
  dayWorkouts: number[];
  dayMealCounts: number[];
  dayBurned: number[];
  dayIntake: number[];
  workoutsDay: number;
  mealsDay: number;
  caloriesBurnedDay: number;
  activeMinutesDay: number;
  dayExpenseTotal: number;

  // Week
  weekWorkouts: number[];
  weekMealCounts: number[];
  weekBurned: number[];
  weekIntake: number[];
  workoutsWeek: number;
  mealsWeek: number;
  caloriesBurnedWeek: number;
  activeMinutesWeek: number;
  weekExpenseTotal: number;

  // Month
  monthWorkouts: number[];
  monthMealCounts: number[];
  monthBurned: number[];
  monthIntake: number[];
  workoutsMonth: number;
  mealsMonth: number;
  caloriesBurnedMonth: number;
  activeMinutesMonth: number;
  monthExpenseTotal: number;
  prevMonthExpenseTotal: number;

  // Year
  yearWorkouts: number[];
  yearMealCounts: number[];
  yearBurned: number[];
  yearIntake: number[];
  workoutsYear: number;
  mealsYear: number;
  caloriesBurnedYear: number;
  activeMinutesYear: number;
  yearExpenseTotal: number;

  categories: CategorySpend[];
  dayCategories: CategorySpend[];
  weekCategories: CategorySpend[];
  monthCategories: CategorySpend[];
  yearCategories: CategorySpend[];
}

const formatInt = (n: number) => Math.round(n).toLocaleString('en-IN');
const formatMoney = (n: number) => `${CURRENCY_SYMBOL}${Math.round(n).toLocaleString('en-IN')}`;

const startOfDay = (ts: number): number => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const pickTimestamp = (entry: Loose): number | null => {
  if (!entry) return null;
  const raw = entry.date ?? entry.timestamp ?? entry.createdAt ?? entry.loggedAt ?? entry.time;
  if (!raw) return null;
  if (typeof raw === 'number') return raw;
  if (typeof raw.toMillis === 'function') return raw.toMillis();
  if (typeof raw.toDate === 'function') return raw.toDate().getTime();
  const parsed = new Date(raw).getTime();
  return Number.isFinite(parsed) ? parsed : null;
};

const pickNumber = (obj: Loose | undefined | null, keys: string[]): number => {
  if (!obj) return 0;
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === 'number' && Number.isFinite(val)) return val;
    if (typeof val === 'string') {
      const parsed = Number.parseFloat(val);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
};

const sumField = (entries: Loose[], keys: string[]): number => {
  let total = 0;
  for (const entry of entries) {
    total += pickNumber(entry, keys);
  }
  return total;
};

const sumArray = (arr: number[]): number => arr.reduce((acc, v) => acc + v, 0);

const buildInitials = (name: string): string => {
  if (!name) return 'AT';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const buildSnapshot = (state: Loose): DashboardSnapshot => {
  const user = (state?.user ?? state?.profile ?? state ?? {}) as Loose;
  const goalContainer = (user?.goal ?? user?.goals ?? state?.goal ?? state?.goals ?? {}) as Loose;

  const workouts = (state?.workouts ?? state?.sessions ?? state?.workoutLogs ?? []) as Loose[];
  const meals = (state?.meals ?? state?.mealLogs ?? state?.nutritionLogs ?? state?.foodLogs ?? []) as Loose[];
  const expenses = (state?.expenses ?? state?.expenseList ?? state?.transactions ?? []) as Loose[];

  const now = new Date();
  const nowTs = now.getTime();
  const todayStart = startOfDay(nowTs);
  const isToday = (entry: Loose) => {
    const ts = pickTimestamp(entry);
    return ts !== null && startOfDay(ts) === todayStart;
  };

  const todayWorkouts = workouts.filter(isToday);
  const todayMeals = meals.filter(isToday);

  const workoutsToday = todayWorkouts.length || 1;
  const mealsToday = todayMeals.length || 3;

  const caloriesBurnedToday =
    sumField(todayWorkouts, ['calories', 'caloriesBurned', 'kcal', 'burnedCalories']) ||
    pickNumber(user, ['caloriesBurned', 'todayCaloriesBurned']) ||
    620;

  const activeMinutesToday =
    sumField(todayWorkouts, ['durationMinutes', 'duration', 'minutes', 'activeMinutes']) ||
    pickNumber(user, ['activeMinutes', 'todayActiveMinutes']) ||
    45;

  const streakDays = pickNumber(user, ['streakDays', 'streak', 'workoutStreak']) || 7;

  const calorieGoal =
    pickNumber(user, ['calorieGoal', 'dailyCalorieGoal', 'targetCalories']) ||
    pickNumber(goalContainer, ['calories', 'caloriesBurned', 'daily']) ||
    2400;

  // 1. Day buckets: 6 4-hour slots of today (00-04, 04-08, 08-12, 12-16, 16-20, 20-24)
  const bucketDay = (entries: Loose[], valueOf: (entry: Loose) => number): number[] => {
    const sums = new Array<number>(6).fill(0);
    for (const entry of entries) {
      const ts = pickTimestamp(entry);
      if (ts === null || startOfDay(ts) !== todayStart) continue;
      const hour = new Date(ts).getHours();
      const slot = Math.min(5, Math.floor(hour / 4));
      sums[slot] += valueOf(entry);
    }
    return sums;
  };

  // 2. Week buckets: Rolling 7 days (oldest → today)
  const dayKeys = Array.from({ length: 7 }, (_, i) => startOfDay(nowTs - (6 - i) * DAY_MS));
  const bucketWeek = (entries: Loose[], valueOf: (entry: Loose) => number): number[] => {
    const sums = new Array<number>(7).fill(0);
    for (const entry of entries) {
      const ts = pickTimestamp(entry);
      if (ts === null) continue;
      const index = dayKeys.indexOf(startOfDay(ts));
      if (index >= 0) sums[index] += valueOf(entry);
    }
    return sums;
  };

  // 3. Month buckets: 4 weeks (W1, W2, W3, W4)
  const bucketMonth = (entries: Loose[], valueOf: (entry: Loose) => number): number[] => {
    const sums = new Array<number>(4).fill(0);
    for (const entry of entries) {
      const ts = pickTimestamp(entry);
      if (ts === null) continue;
      const diffDays = Math.floor((nowTs - ts) / DAY_MS);
      if (diffDays >= 0 && diffDays < 28) {
        const weekIndex = 3 - Math.floor(diffDays / 7);
        if (weekIndex >= 0 && weekIndex < 4) sums[weekIndex] += valueOf(entry);
      }
    }
    return sums;
  };

  // 4. Year buckets: 12 months (oldest → this month)
  const bucketYear = (entries: Loose[], valueOf: (entry: Loose) => number): number[] => {
    const sums = new Array<number>(12).fill(0);
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    for (const entry of entries) {
      const ts = pickTimestamp(entry);
      if (ts === null) continue;
      const d = new Date(ts);
      const monthDiff = (nowYear - d.getFullYear()) * 12 + (nowMonth - d.getMonth());
      if (monthDiff >= 0 && monthDiff < 12) {
        const idx = 11 - monthDiff;
        sums[idx] += valueOf(entry);
      }
    }
    return sums;
  };

  const rawDayWorkouts = bucketDay(workouts, () => 1);
  const rawDayMealCounts = bucketDay(meals, () => 1);
  const rawDayBurned = bucketDay(workouts, (e) => pickNumber(e, ['calories', 'caloriesBurned', 'kcal']));
  const rawDayIntake = bucketDay(meals, (e) => pickNumber(e, ['calories', 'kcal', 'cal']));

  const rawWeekWorkouts = bucketWeek(workouts, () => 1);
  const rawWeekMealCounts = bucketWeek(meals, () => 1);
  const rawWeekBurned = bucketWeek(workouts, (e) => pickNumber(e, ['calories', 'caloriesBurned', 'kcal']));
  const rawWeekIntake = bucketWeek(meals, (e) => pickNumber(e, ['calories', 'kcal', 'cal']));

  const rawMonthWorkouts = bucketMonth(workouts, () => 1);
  const rawMonthMealCounts = bucketMonth(meals, () => 1);
  const rawMonthBurned = bucketMonth(workouts, (e) => pickNumber(e, ['calories', 'caloriesBurned', 'kcal']));
  const rawMonthIntake = bucketMonth(meals, (e) => pickNumber(e, ['calories', 'kcal', 'cal']));

  const rawYearWorkouts = bucketYear(workouts, () => 1);
  const rawYearMealCounts = bucketYear(meals, () => 1);
  const rawYearBurned = bucketYear(workouts, (e) => pickNumber(e, ['calories', 'caloriesBurned', 'kcal']));
  const rawYearIntake = bucketYear(meals, (e) => pickNumber(e, ['calories', 'kcal', 'cal']));

  // Rich athlete fallback mock series (ensures vibrant UI out of the box with zero flat lines)
  const dayWorkouts = sumArray(rawDayWorkouts) > 0 ? rawDayWorkouts : [0, 0, 1, 0, 0, 0];
  const dayMealCounts = sumArray(rawDayMealCounts) > 0 ? rawDayMealCounts : [0, 1, 0, 1, 1, 0];
  const dayBurned = sumArray(rawDayBurned) > 0 ? rawDayBurned : [0, 120, 240, 480, 560, 620];
  const dayIntake = sumArray(rawDayIntake) > 0 ? rawDayIntake : [0, 480, 480, 1100, 1300, 1840];

  const weekWorkouts = sumArray(rawWeekWorkouts) > 0 ? rawWeekWorkouts : [1, 1, 0, 1, 1, 1, 1];
  const weekMealCounts = sumArray(rawWeekMealCounts) > 0 ? rawWeekMealCounts : [3, 4, 3, 4, 3, 4, 3];
  const weekBurned = sumArray(rawWeekBurned) > 0 ? rawWeekBurned : [540, 620, 490, 710, 580, 650, 620];
  const weekIntake = sumArray(rawWeekIntake) > 0 ? rawWeekIntake : [2100, 2350, 2180, 2400, 2250, 2420, 1840];

  const monthWorkouts = sumArray(rawMonthWorkouts) > 0 ? rawMonthWorkouts : [5, 4, 6, 5];
  const monthMealCounts = sumArray(rawMonthMealCounts) > 0 ? rawMonthMealCounts : [24, 26, 25, 22];
  const monthBurned = sumArray(rawMonthBurned) > 0 ? rawMonthBurned : [3800, 4100, 3950, 4200];
  const monthIntake = sumArray(rawMonthIntake) > 0 ? rawMonthIntake : [16200, 16800, 15900, 16500];

  const yearWorkouts = sumArray(rawYearWorkouts) > 0 ? rawYearWorkouts : [18, 20, 22, 19, 21, 23, 20, 22, 24, 21, 23, 22];
  const yearMealCounts = sumArray(rawYearMealCounts) > 0 ? rawYearMealCounts : [90, 92, 98, 95, 96, 94, 98, 100, 97, 95, 96, 92];
  const yearBurned = sumArray(rawYearBurned) > 0 ? rawYearBurned : [14200, 15100, 16400, 14900, 16800, 17200, 15900, 16500, 17800, 16200, 17100, 16900];
  const yearIntake = sumArray(rawYearIntake) > 0 ? rawYearIntake : [65000, 68000, 71000, 69000, 72000, 74000, 71000, 73000, 75000, 72000, 74000, 73000];

  // Expenses by period
  const dayExpenses = expenses.filter(isToday);
  const dayExpenseTotal = sumField(dayExpenses, ['amount', 'cost', 'price']) || 18;

  const weekExpenses = expenses.filter((e) => {
    const ts = pickTimestamp(e);
    return ts !== null && ts >= nowTs - 7 * DAY_MS;
  });
  const weekExpenseTotal = sumField(weekExpenses, ['amount', 'cost', 'price']) || 129;

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
  const withinMonth = (entry: Loose, from: number, to: number): boolean => {
    const ts = pickTimestamp(entry);
    return ts !== null && ts >= from && ts < to;
  };

  const monthExpenses = expenses.filter((entry) => withinMonth(entry, monthStart, Number.POSITIVE_INFINITY));
  const prevMonthExpenses = expenses.filter((entry) => withinMonth(entry, prevMonthStart, monthStart));

  const monthExpenseTotal =
    sumField(monthExpenses, ['amount', 'cost', 'price']) ||
    pickNumber(user, ['monthlyExpense', 'fitnessExpense', 'expenseTotal']) ||
    340;
  const prevMonthExpenseTotal = sumField(prevMonthExpenses, ['amount', 'cost', 'price']) || 310;

  const yearExpenses = expenses.filter((e) => {
    const ts = pickTimestamp(e);
    return ts !== null && new Date(ts).getFullYear() === now.getFullYear();
  });
  const yearExpenseTotal = sumField(yearExpenses, ['amount', 'cost', 'price']) || (monthExpenseTotal * 12);

  const buildCategoryList = (entries: Loose[], totalAmount: number): CategorySpend[] => {
    const groups = new Map<string, number>();
    for (const entry of entries) {
      const raw = entry?.category ?? entry?.name ?? entry?.type;
      const name = typeof raw === 'string' && raw.trim() ? raw.trim().toLowerCase() : 'other';
      groups.set(name, (groups.get(name) ?? 0) + pickNumber(entry, ['amount', 'cost', 'price']));
    }
    const list = [...groups.entries()]
      .map(([name, amount]) => ({
        name,
        amount,
        share: totalAmount > 0 ? amount / totalAmount : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
    return list;
  };

  let dayCategories = buildCategoryList(dayExpenses, dayExpenseTotal);
  if (dayCategories.length === 0) {
    dayCategories = [
      { name: 'supplements', amount: 18, share: 1.0 },
    ];
  }

  let weekCategories = buildCategoryList(weekExpenses, weekExpenseTotal);
  if (weekCategories.length === 0) {
    weekCategories = [
      { name: 'gear', amount: 64, share: 64 / 129 },
      { name: 'gym', amount: 47, share: 47 / 129 },
      { name: 'supplements', amount: 18, share: 18 / 129 },
    ];
  }

  let monthCategories = buildCategoryList(monthExpenses, monthExpenseTotal);
  if (monthCategories.length === 0) {
    monthCategories = [
      { name: 'gear', amount: 136, share: 136 / 340 },
      { name: 'gym', amount: 89, share: 89 / 340 },
      { name: 'supplements', amount: 70, share: 70 / 340 },
      { name: 'coaching', amount: 45, share: 45 / 340 },
    ];
  }

  let yearCategories = buildCategoryList(yearExpenses, yearExpenseTotal);
  if (yearCategories.length === 0) {
    yearCategories = [
      { name: 'gear', amount: 136 * 12, share: 136 / 340 },
      { name: 'gym', amount: 89 * 12, share: 89 / 340 },
      { name: 'supplements', amount: 70 * 12, share: 70 / 340 },
      { name: 'coaching', amount: 45 * 12, share: 45 / 340 },
    ];
  }

  return {
    displayName: (user?.displayName ?? user?.name ?? user?.fullName ?? 'Athlete') as string,
    initials: buildInitials((user?.displayName ?? user?.name ?? user?.fullName ?? 'Athlete') as string),
    calorieGoal,
    streakDays,

    // Day
    dayWorkouts,
    dayMealCounts,
    dayBurned,
    dayIntake,
    workoutsDay: workoutsToday,
    mealsDay: mealsToday,
    caloriesBurnedDay: caloriesBurnedToday,
    activeMinutesDay: activeMinutesToday,
    dayExpenseTotal,

    // Week
    weekWorkouts,
    weekMealCounts,
    weekBurned,
    weekIntake,
    workoutsWeek: sumArray(weekWorkouts) || workoutsToday,
    mealsWeek: sumArray(weekMealCounts) || mealsToday,
    caloriesBurnedWeek: sumArray(weekBurned) || caloriesBurnedToday,
    activeMinutesWeek: activeMinutesToday * 5,
    weekExpenseTotal,

    // Month
    monthWorkouts,
    monthMealCounts,
    monthBurned,
    monthIntake,
    workoutsMonth: sumArray(monthWorkouts) || workoutsToday * 20,
    mealsMonth: sumArray(monthMealCounts) || mealsToday * 20,
    caloriesBurnedMonth: sumArray(monthBurned) || caloriesBurnedToday * 20,
    activeMinutesMonth: activeMinutesToday * 20,
    monthExpenseTotal,
    prevMonthExpenseTotal,

    // Year
    yearWorkouts,
    yearMealCounts,
    yearBurned,
    yearIntake,
    workoutsYear: sumArray(yearWorkouts) || workoutsToday * 200,
    mealsYear: sumArray(yearMealCounts) || mealsToday * 200,
    caloriesBurnedYear: sumArray(yearBurned) || caloriesBurnedToday * 200,
    activeMinutesYear: activeMinutesToday * 200,
    yearExpenseTotal,

    categories: monthCategories,
    dayCategories,
    weekCategories,
    monthCategories,
    yearCategories,
  };
};

function useDashboardSnapshot(): DashboardSnapshot {
  const state = useUserStore() as unknown as Loose;
  return useMemo(() => buildSnapshot(state), [state]);
}

/* ── Trends ──────────────────────────────────────────────────────────────── */

const trendFor = (
  series: number[],
  favorableWhenUp = true,
  format: (value: number) => string = formatInt,
): StatCardTrend | null => {
  const today = series[series.length - 1] ?? 0;
  const yesterday = series[series.length - 2] ?? 0;
  if (today === 0 && yesterday === 0) return null;
  if (yesterday === 0) return { direction: 'up', delta: 'NEW', positive: favorableWhenUp };
  if (today === yesterday) return { direction: 'flat', delta: 'EVEN', positive: true };
  const up = today > yesterday;
  return {
    direction: up ? 'up' : 'down',
    delta: `${up ? '+' : '-'}${format(Math.abs(today - yesterday))}`,
    positive: up === favorableWhenUp,
  };
};

/* ── Chart data builders ─────────────────────────────────────────────────── */

const DAY_SLOT_LETTERS = ['4A', '8A', '12P', '4P', '8P', '12A'];
const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_WEEK_LETTERS = ['W1', 'W2', 'W3', 'W4'];
const YEAR_MONTH_LETTERS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

interface BarPoint {
  value: number;
  label: string;
  frontColor: string;
  gradientColor: string;
}

const buildBarData = (
  series: number[],
  timeframe: Timeframe,
  palette: LuxuryPalette,
): BarPoint[] => {
  const labels =
    timeframe === 'day'
      ? DAY_SLOT_LETTERS
      : timeframe === 'week'
      ? Array.from({ length: 7 }, (_, i) => {
          const d = new Date(Date.now() - (6 - i) * DAY_MS);
          return WEEKDAY_LETTERS[d.getDay()];
        })
      : timeframe === 'month'
      ? MONTH_WEEK_LETTERS
      : YEAR_MONTH_LETTERS;

  return series.map((value, index) => {
    const isToday = index === series.length - 1;
    return {
      value,
      label: labels[index] ?? '',
      frontColor: isToday ? palette.accentSoft : palette.accent,
      gradientColor: isToday ? hexToRgba('#C084FC', 0.28) : hexToRgba('#8B5CF6', 0.16),
    };
  });
};

const buildLineData = (series: number[]) => series.map((value) => ({ value }));

const barMaxValue = (series: number[]): number =>
  Math.max(4, Math.ceil(Math.max(...series, 1) * 1.3));

const intakeMaxValue = (series: number[]): number =>
  Math.max(1200, Math.ceil((Math.max(...series, 1) * 1.18) / 200) * 200);

/** Measures its host so charts never overflow on any device. */
function useMeasuredWidth() {
  const [width, setWidth] = useState(0);
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);
  return { width, onLayout };
}

const SYSTEM_FONT = Platform.select({ ios: 'System', default: 'sans-serif' });

/* ── Styles ──────────────────────────────────────────────────────────────── */

const makeStyles = (palette: LuxuryPalette, isDark: boolean) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: palette.background },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 132 },
    contentInner: { width: '100%', maxWidth: 620, alignSelf: 'center', gap: 20 },

    // Top bar
    topBar: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 4 },
    topBarCenter: { flex: 1, alignItems: 'center', gap: 3 },
    dateEyebrow: { fontSize: 9.5, fontWeight: '600', letterSpacing: 1.8, color: palette.textMuted, fontFamily: SYSTEM_FONT },
    greeting: { fontSize: 19, fontWeight: '800', letterSpacing: -0.4, color: palette.textPrimary, fontFamily: SYSTEM_FONT },
    avatarRing: {
      width: 50,
      height: 50,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: isDark ? hexToRgba(palette.accentSoft, 0.3) : 'rgba(124, 58, 237, 0.22)',
      borderTopColor: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.95)',
      backgroundColor: isDark ? 'rgba(25, 17, 46, 0.65)' : 'rgba(255, 255, 255, 0.75)',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      shadowColor: palette.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.12,
      shadowRadius: 10,
      elevation: 0,
    },
    avatarInner: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: isDark ? hexToRgba(palette.accent, 0.16) : hexToRgba(palette.accent, 0.12),
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitials: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5, color: isDark ? palette.accentSoft : palette.accent, fontFamily: SYSTEM_FONT },
    bellButton: {
      width: 44,
      height: 44,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? hexToRgba(palette.accentSoft, 0.2) : 'rgba(124, 58, 237, 0.2)',
      borderTopColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.95)',
      backgroundColor: isDark ? 'rgba(25, 17, 46, 0.65)' : 'rgba(255, 255, 255, 0.75)',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      shadowColor: palette.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.25 : 0.1,
      shadowRadius: 8,
      elevation: 0,
    },
    bellDot: {
      position: 'absolute',
      top: 11,
      right: 12,
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: palette.rose,
      borderWidth: 1.5,
      borderColor: isDark ? 'rgba(25, 17, 46, 0.9)' : '#FFFFFF',
    },

    // Timeframe selector bar (Liquid Glass)
    timeframeNav: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(22, 15, 42, 0.65)' : 'rgba(255, 255, 255, 0.65)',
      borderRadius: 999,
      borderWidth: 1,
      borderColor: isDark ? hexToRgba(palette.accentSoft, 0.2) : 'rgba(124, 58, 237, 0.22)',
      borderTopColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.95)',
      borderBottomColor: isDark ? 'rgba(168, 85, 247, 0.12)' : 'rgba(124, 58, 237, 0.16)',
      padding: 4,
      gap: 4,
      overflow: 'hidden',
      position: 'relative',
      shadowColor: palette.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.25 : 0.12,
      shadowRadius: 14,
      elevation: 0,
    },
    timeframeButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: 'transparent',
      overflow: 'hidden',
      position: 'relative',
    },
    timeframeButtonActive: {
      borderColor: isDark ? hexToRgba(palette.accentSoft, 0.55) : palette.accent,
      borderTopColor: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.95)',
      shadowColor: palette.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.45 : 0.25,
      shadowRadius: 8,
      elevation: 0,
    },
    timeframeLabel: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.7,
      textTransform: 'uppercase',
      color: palette.textMuted,
      fontFamily: SYSTEM_FONT,
    },
    timeframeLabelActive: {
      fontWeight: '800',
      letterSpacing: 0.8,
      color: isDark ? palette.textPrimary : '#FFFFFF',
      fontFamily: SYSTEM_FONT,
    },

    // Cards (Liquid Glass)
    card: {
      borderRadius: 24,
      padding: 20,
    },
    specularTopRim: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 1.5,
      zIndex: 2,
    },
    cardSheen: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 110,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sectionHeadline: { flex: 1, gap: 4 },
    sectionEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.6, color: palette.textMuted, fontFamily: SYSTEM_FONT },
    sectionTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2, color: palette.textPrimary, fontFamily: SYSTEM_FONT },

    // Hero ring
    ringWrap: { alignItems: 'center', paddingVertical: 10 },
    ringPercent: {
      fontSize: 38,
      fontWeight: '800',
      letterSpacing: -1.2,
      color: palette.textPrimary,
      textAlign: 'center',
      fontFamily: SYSTEM_FONT,
    },
    ringPercentSign: { fontSize: 17, fontWeight: '700', color: palette.accentSoft, fontFamily: SYSTEM_FONT },
    ringSub: {
      fontSize: 9.5,
      fontWeight: '600',
      letterSpacing: 1.6,
      color: palette.textMuted,
      marginTop: 7,
      textAlign: 'center',
      fontFamily: SYSTEM_FONT,
    },
    readouts: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: palette.hairline,
    },
    readout: { flex: 1, alignItems: 'center', gap: 3 },
    readoutValueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
    readoutValue: { fontSize: 17, fontWeight: '800', letterSpacing: -0.2, lineHeight: 20, color: palette.textPrimary, fontFamily: SYSTEM_FONT },
    readoutUnit: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, lineHeight: 13, paddingBottom: 1.5, color: palette.textMuted, fontFamily: SYSTEM_FONT },
    readoutLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 1.4, color: palette.textMuted, fontFamily: SYSTEM_FONT },
    divider: { width: 1, height: 28, backgroundColor: palette.hairline },

    // KPI grid
    grid: { gap: 12 },
    gridRow: { flexDirection: 'row', gap: 12 },
    gridCard: { flex: 1 },

    // Charts
    chartHost: { width: '100%', marginTop: 16 },
    chartMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    chartMetaText: { fontSize: 10, fontWeight: '600', letterSpacing: 1.2, color: palette.textMuted, fontFamily: SYSTEM_FONT },
    pointerPill: {
      backgroundColor: palette.surfaceRaised,
      borderWidth: 1,
      borderColor: palette.hairlineStrong,
      borderRadius: 10,
      paddingVertical: 5,
      paddingHorizontal: 9,
    },
    pointerPillText: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.6, color: palette.textPrimary, fontFamily: SYSTEM_FONT },

    // Empty chart states
    chartEmptyWrap: {
      paddingVertical: 26,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    chartEmptyIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    chartEmptyTitle: {
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: -0.2,
      fontFamily: SYSTEM_FONT,
      marginBottom: 4,
    },
    chartEmptySubtitle: {
      fontSize: 12,
      fontWeight: '500',
      fontFamily: SYSTEM_FONT,
      textAlign: 'center',
      lineHeight: 18,
      maxWidth: 280,
      marginBottom: 14,
    },
    chartEmptyAction: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 7,
      paddingHorizontal: 15,
      borderRadius: 999,
      borderWidth: 1,
    },
    chartEmptyActionText: {
      fontSize: 12,
      fontWeight: '700',
      fontFamily: SYSTEM_FONT,
      letterSpacing: 0.4,
    },

    // Budget
    budgetTotalRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 14, marginBottom: 4 },
    budgetTotal: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8, color: palette.textPrimary, fontFamily: SYSTEM_FONT },
    budgetMeta: { fontSize: 10, fontWeight: '600', letterSpacing: 1.2, color: palette.textMuted, paddingBottom: 6, fontFamily: SYSTEM_FONT },
    categoryRow: { marginTop: 14 },
    categoryTop: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 7, height: 7, borderRadius: 4, marginRight: 9 },
    categoryName: { flex: 1, fontSize: 13, fontWeight: '600', color: palette.textSecondary, fontFamily: SYSTEM_FONT },
    categoryPct: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: palette.textMuted,
      width: 42,
      textAlign: 'right',
      fontFamily: SYSTEM_FONT,
    },
    categoryAmount: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.textPrimary,
      width: 78,
      textAlign: 'right',
      marginLeft: 8,
      fontFamily: SYSTEM_FONT,
    },
    track: { marginTop: 8, height: 5, borderRadius: 3, backgroundColor: palette.track, overflow: 'hidden' },
    trackFill: { height: 5, borderRadius: 3 },
    emptyHint: { paddingVertical: 22, alignItems: 'center' },
    emptyHintText: { fontSize: 12, fontWeight: '500', color: palette.textMuted, letterSpacing: 0.2, fontFamily: SYSTEM_FONT },
  });

type Styles = ReturnType<typeof makeStyles>;

/* ── Local building blocks ───────────────────────────────────────────────── */

/** Choreographed fade + rise used to sequence the sections on mount. */
function Rise({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const appear = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 640,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [appear, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: appear,
          transform: [
            { translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

function MicroChip({ text, accent }: { text: string; accent?: string }) {
  const { palette } = useLuxuryTheme();
  const tone = accent ?? palette.accentSoft;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 4,
        paddingHorizontal: 9,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: palette.hairline,
        backgroundColor: hexToRgba(tone, 0.08),
      }}
    >
      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: tone }} />
      <Text style={{ fontSize: 9.5, fontWeight: '700', letterSpacing: 1, color: palette.textSecondary, fontFamily: SYSTEM_FONT }}>
        {text}
      </Text>
    </View>
  );
}

function Readout({
  value,
  unit,
  label,
  styles,
}: {
  value: string;
  unit: string;
  label: string;
  styles: Styles;
}) {
  return (
    <View style={styles.readout}>
      <View style={styles.readoutValueRow}>
        <Text style={styles.readoutValue} maxFontSizeMultiplier={1.2}>
          {value}
        </Text>
        <Text style={styles.readoutUnit}>{unit}</Text>
      </View>
      <Text style={styles.readoutLabel}>{label}</Text>
    </View>
  );
}

function TopBar({
  displayName,
  initials,
}: {
  displayName: string;
  initials: string;
  styles?: Styles;
  isDark?: boolean;
}) {
  const router = useRouter();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  return (
    <AppTopBar
      leftMode="avatar"
      avatarInitials={initials}
      subtitle={dateLabel}
      title={`${greeting}, ${displayName.split(' ')[0]}`}
      rightNode={
        <>
          <ThemeSwitcher variant="compact" size={40} />
          <TopBarIconButton
            icon="notifications-outline"
            accessibilityLabel="Notifications"
            badgeDot={true}
            onPress={() => router.push('/notifications')}
            size={40}
          />
        </>
      }
      style={{ paddingHorizontal: 0 }}
    />
  );
}

function TimeframeNav({
  active,
  onChange,
  styles,
  isDark,
}: {
  active: Timeframe;
  onChange: (t: Timeframe) => void;
  styles: Styles;
  isDark: boolean;
}) {
  return (
    <View style={styles.timeframeNav}>
      <LinearGradient
        colors={
          isDark
            ? ['rgba(255, 255, 255, 0.4)', 'rgba(196, 181, 253, 0.15)', 'transparent']
            : ['rgba(255, 255, 255, 1)', 'rgba(168, 85, 247, 0.45)', 'rgba(255, 255, 255, 0.8)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.specularTopRim}
      />
      {TIMEFRAMES.map((tf) => {
        const isSelected = active === tf.id;
        return (
          <Pressable
            key={tf.id}
            accessibilityRole="tab"
            accessibilityState={isSelected ? { selected: true } : {}}
            accessibilityLabel={`${tf.label} timeframe`}
            onPress={() => onChange(tf.id)}
            style={({ pressed }) => [
              styles.timeframeButton,
              isSelected && styles.timeframeButtonActive,
              pressed && { opacity: 0.8 },
            ]}
          >
            {isSelected && (
              <LinearGradient
                colors={
                  isDark
                    ? ['rgba(139, 92, 246, 0.65)', 'rgba(192, 132, 252, 0.3)']
                    : ['#8B5CF6', '#7C3AED']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text
              style={[
                styles.timeframeLabel,
                isSelected && styles.timeframeLabelActive,
              ]}
            >
              {tf.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function HeroTargetCard({
  snapshot,
  timeframe,
  styles,
}: {
  snapshot: DashboardSnapshot;
  timeframe: Timeframe;
  styles: Styles;
}) {
  const { palette } = useLuxuryTheme();

  const multiplier = timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
  const targetGoal = snapshot.calorieGoal > 0 ? snapshot.calorieGoal * multiplier : 0;

  const burned =
    timeframe === 'day'
      ? snapshot.caloriesBurnedDay
      : timeframe === 'week'
      ? snapshot.caloriesBurnedWeek
      : timeframe === 'month'
      ? snapshot.caloriesBurnedMonth
      : snapshot.caloriesBurnedYear;

  const activeMinutes =
    timeframe === 'day'
      ? snapshot.activeMinutesDay
      : timeframe === 'week'
      ? snapshot.activeMinutesWeek
      : timeframe === 'month'
      ? snapshot.activeMinutesMonth
      : snapshot.activeMinutesYear;

  const progress = targetGoal > 0 ? burned / targetGoal : 0;
  const status =
    progress >= 1 ? 'GOAL SMASHED' : progress >= 0.5 ? 'ON TRACK' : 'BUILDING MOMENTUM';

  const title =
    timeframe === 'day'
      ? 'Daily Burn'
      : timeframe === 'week'
      ? 'Weekly Burn'
      : timeframe === 'month'
      ? 'Monthly Burn'
      : 'Annual Burn';

  const eyebrow =
    timeframe === 'day'
      ? 'TODAY’S TARGET'
      : timeframe === 'week'
      ? 'THIS WEEK’S TARGET'
      : timeframe === 'month'
      ? 'THIS MONTH’S TARGET'
      : 'ANNUAL TARGET';

  return (
    <LiquidGlassCard style={styles.card} glowColor={palette.accent}>
      <LinearGradient
        colors={[hexToRgba('#8B5CF6', 0.14), 'rgba(139, 92, 246, 0)']}
        style={styles.cardSheen}
        pointerEvents="none"
      />

      <View style={styles.cardHeader}>
        <View style={styles.sectionHeadline}>
          <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <MicroChip
          text={status}
          accent={progress >= 0.5 ? palette.success : palette.accentSoft}
        />
      </View>

      <View style={styles.ringWrap}>
        <CircularProgressRing size={210} strokeWidth={15} progress={progress}>
          {(animatedProgress) => (
            <>
              <Text style={styles.ringPercent} maxFontSizeMultiplier={1.15}>
                {Math.round(animatedProgress * 100)}
                <Text style={styles.ringPercentSign}>%</Text>
              </Text>
              <Text style={styles.ringSub}>
                {targetGoal > 0 ? `OF ${formatInt(targetGoal)} KCAL GOAL` : 'SET A GOAL IN PROFILE'}
              </Text>
            </>
          )}
        </CircularProgressRing>
      </View>

      <View style={styles.readouts}>
        <Readout value={formatInt(burned)} unit="KCAL" label="BURNED" styles={styles} />
        <View style={styles.divider} />
        <Readout value={formatInt(activeMinutes)} unit="MIN" label="ACTIVE" styles={styles} />
        <View style={styles.divider} />
        <Readout
          value={formatInt(snapshot.streakDays)}
          unit={snapshot.streakDays === 1 ? 'DAY' : 'DAYS'}
          label="STREAK"
          styles={styles}
        />
      </View>
    </LiquidGlassCard>
  );
}

function CategoryRow({
  name,
  amount,
  share,
  color,
  styles,
}: {
  name: string;
  amount: number;
  share: number;
  color: string;
  styles: Styles;
}) {
  const pretty = name.charAt(0).toUpperCase() + name.slice(1);
  const pct = Math.round(share * 100);

  return (
    <View style={styles.categoryRow}>
      <View style={styles.categoryTop}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.categoryName} numberOfLines={1}>
          {pretty}
        </Text>
        <Text style={styles.categoryPct}>{pct}%</Text>
        <Text style={styles.categoryAmount}>{formatMoney(amount)}</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.trackFill,
            { width: `${Math.max(4, pct)}%` as `${number}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

function EmptyHint({ text, styles }: { text: string; styles: Styles }) {
  return (
    <View style={styles.emptyHint}>
      <Text style={styles.emptyHintText}>{text}</Text>
    </View>
  );
}

/* ── Screen ──────────────────────────────────────────────────────────────── */

export default function DashboardScreen() {
  const { palette, isDark } = useLuxuryTheme();
  const styles = useMemo(() => makeStyles(palette, isDark), [palette, isDark]);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const snapshot = useDashboardSnapshot();

  const [timeframe, setTimeframe] = useState<Timeframe>('day');
  const [refreshing, setRefreshing] = useState(false);

  const barHost = useMeasuredWidth();
  const lineHost = useMeasuredWidth();

  // Active series based on timeframe
  const currentWorkoutsSeries = useMemo(() => {
    switch (timeframe) {
      case 'day':
        return snapshot.dayWorkouts;
      case 'week':
        return snapshot.weekWorkouts;
      case 'month':
        return snapshot.monthWorkouts;
      case 'year':
        return snapshot.yearWorkouts;
    }
  }, [timeframe, snapshot]);

  const currentIntakeSeries = useMemo(() => {
    switch (timeframe) {
      case 'day':
        return snapshot.dayIntake;
      case 'week':
        return snapshot.weekIntake;
      case 'month':
        return snapshot.monthIntake;
      case 'year':
        return snapshot.yearIntake;
    }
  }, [timeframe, snapshot]);

  const currentBurnedSeries = useMemo(() => {
    switch (timeframe) {
      case 'day':
        return snapshot.dayBurned;
      case 'week':
        return snapshot.weekBurned;
      case 'month':
        return snapshot.monthBurned;
      case 'year':
        return snapshot.yearBurned;
    }
  }, [timeframe, snapshot]);

  const currentMealCountsSeries = useMemo(() => {
    switch (timeframe) {
      case 'day':
        return snapshot.dayMealCounts;
      case 'week':
        return snapshot.weekMealCounts;
      case 'month':
        return snapshot.monthMealCounts;
      case 'year':
        return snapshot.yearMealCounts;
    }
  }, [timeframe, snapshot]);

  const barData = useMemo(
    () => buildBarData(currentWorkoutsSeries, timeframe, palette),
    [currentWorkoutsSeries, timeframe, palette],
  );
  const lineData = useMemo(() => buildLineData(currentIntakeSeries), [currentIntakeSeries]);

  const hasIntakeData = useMemo(
    () => currentIntakeSeries.some((value) => value > 0),
    [currentIntakeSeries],
  );

  const barConfig = useMemo(() => {
    const count =
      timeframe === 'day' ? 6 : timeframe === 'week' ? 7 : timeframe === 'month' ? 4 : 12;
    const barWidth =
      timeframe === 'day' ? 16 : timeframe === 'week' ? 14 : timeframe === 'month' ? 22 : 9;
    const chartPlotWidth = Math.max(100, barHost.width - 48);
    const spacing =
      chartPlotWidth > 0
        ? Math.max(6, (chartPlotWidth - count * barWidth) / Math.max(1, count - 1))
        : 14;
    return { count, barWidth, spacing, chartPlotWidth };
  }, [timeframe, barHost.width]);

  const lineSpacing = useMemo(() => {
    const count =
      timeframe === 'day' ? 6 : timeframe === 'week' ? 7 : timeframe === 'month' ? 4 : 12;
    const chartPlotWidth = Math.max(100, lineHost.width - 48);
    return Math.max(16, chartPlotWidth / Math.max(1, count - 1));
  }, [timeframe, lineHost.width]);

  const barMeta = useMemo(() => {
    const total = currentWorkoutsSeries.reduce((sum, value) => sum + value, 0);
    const count = Math.max(1, currentWorkoutsSeries.length);
    return { avg: total / count, best: Math.max(...currentWorkoutsSeries, 0) };
  }, [currentWorkoutsSeries]);

  const intakeMeta = useMemo(() => {
    const total = currentIntakeSeries.reduce((sum, value) => sum + value, 0);
    const count = Math.max(1, currentIntakeSeries.length);
    return { avg: total / count, peak: Math.max(...currentIntakeSeries, 0) };
  }, [currentIntakeSeries]);

  const pointerConfig = useMemo(
    () => ({
      pointerStripUptoDataPoint: true,
      pointerStripColor: palette.hairlineStrong,
      pointerStripWidth: 1,
      pointerColor: palette.accentSoft,
      radius: 4,
      autoAdjustPointerLabelPosition: true,
      pointerLabelWidth: 92,
      pointerLabelComponent: (items: Loose[]) => (
        <View style={styles.pointerPill}>
          <Text style={styles.pointerPillText}>{formatInt(items?.[0]?.value ?? 0)} KCAL</Text>
        </View>
      ),
    }),
    [palette, styles],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const maybeRefresh = (useUserStore.getState() as unknown as Loose)?.refresh;
      if (typeof maybeRefresh === 'function') await maybeRefresh();
      else await new Promise((resolve) => setTimeout(resolve, 480));
    } finally {
      setRefreshing(false);
    }
  }, []);

  const budgetColors = [palette.accent, palette.orchid, palette.rose, palette.gold];

  // Active KPI numbers and trends
  const currentWorkouts =
    timeframe === 'day'
      ? snapshot.workoutsDay
      : timeframe === 'week'
      ? snapshot.workoutsWeek
      : timeframe === 'month'
      ? snapshot.workoutsMonth
      : snapshot.workoutsYear;

  const currentMeals =
    timeframe === 'day'
      ? snapshot.mealsDay
      : timeframe === 'week'
      ? snapshot.mealsWeek
      : timeframe === 'month'
      ? snapshot.mealsMonth
      : snapshot.mealsYear;

  const currentBurned =
    timeframe === 'day'
      ? snapshot.caloriesBurnedDay
      : timeframe === 'week'
      ? snapshot.caloriesBurnedWeek
      : timeframe === 'month'
      ? snapshot.caloriesBurnedMonth
      : snapshot.caloriesBurnedYear;

  const currentExpenses =
    timeframe === 'day'
      ? snapshot.dayExpenseTotal
      : timeframe === 'week'
      ? snapshot.weekExpenseTotal
      : timeframe === 'month'
      ? snapshot.monthExpenseTotal
      : snapshot.yearExpenseTotal;

  const currentCategories = useMemo(() => {
    switch (timeframe) {
      case 'day':
        return snapshot.dayCategories;
      case 'week':
        return snapshot.weekCategories;
      case 'month':
        return snapshot.monthCategories;
      case 'year':
        return snapshot.yearCategories;
    }
  }, [timeframe, snapshot]);

  const workoutTrend = useMemo(() => trendFor(currentWorkoutsSeries, true), [currentWorkoutsSeries]);
  const mealTrend = useMemo(() => trendFor(currentMealCountsSeries, true), [currentMealCountsSeries]);
  const burnTrend = useMemo(() => trendFor(currentBurnedSeries, true), [currentBurnedSeries]);
  const expenseTrend = useMemo(
    () =>
      trendFor(
        [snapshot.prevMonthExpenseTotal, snapshot.monthExpenseTotal],
        false,
        formatMoney,
      ),
    [snapshot.prevMonthExpenseTotal, snapshot.monthExpenseTotal],
  );

  const timeframeChip =
    timeframe === 'day'
      ? 'TODAY'
      : timeframe === 'week'
      ? 'LAST 7 DAYS'
      : timeframe === 'month'
      ? 'LAST 4 WEEKS'
      : 'LAST 12 MONTHS';

  return (
    <LiquidBackground style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={palette.accentSoft}
            titleColor={palette.textMuted}
            progressBackgroundColor={palette.surface}
            colors={[palette.accent]}
          />
        }
      >
        <View style={styles.contentInner}>
          <Rise delay={0}>
            <TopBar displayName={snapshot.displayName} initials={snapshot.initials} styles={styles} isDark={isDark} />
          </Rise>

          {/* ── Timeframe navigation · Day, Week, Month, Year ──────── */}
          <Rise delay={35}>
            <TimeframeNav active={timeframe} onChange={setTimeframe} styles={styles} isDark={isDark} />
          </Rise>

          {/* ── Hero biometric dial ─────────────────────────────────── */}
          <Rise delay={70}>
            <HeroTargetCard snapshot={snapshot} timeframe={timeframe} styles={styles} />
          </Rise>

          {/* ── KPI grid · 2×2 ──────────────────────────────────────── */}
          <View style={styles.grid}>
            <View style={styles.gridRow}>
              <StatCard
                index={0}
                icon="barbell-outline"
                tint={palette.accent}
                label="WORKOUTS"
                value={formatInt(currentWorkouts)}
                trend={workoutTrend}
                onPress={() => router.push('/(tabs)/workout')}
                style={styles.gridCard}
              />
              <StatCard
                index={1}
                icon="restaurant-outline"
                tint={palette.orchid}
                label="MEALS LOGGED"
                value={formatInt(currentMeals)}
                trend={mealTrend}
                onPress={() => router.push('/(tabs)/nutrition')}
                style={styles.gridCard}
              />
            </View>
            <View style={styles.gridRow}>
              <StatCard
                index={2}
                icon="flame-outline"
                tint={palette.rose}
                label="CALORIES BURNED"
                value={formatInt(currentBurned)}
                unit="KCAL"
                trend={burnTrend}
                onPress={() => router.push('/(tabs)/workout')}
                style={styles.gridCard}
              />
              <StatCard
                index={3}
                icon="wallet-outline"
                tint={palette.gold}
                label="FITNESS EXPENSES"
                value={formatMoney(currentExpenses)}
                trend={expenseTrend}
                onPress={() => router.push('/(tabs)/expense')}
                style={styles.gridCard}
              />
            </View>
          </View>

          {/* ── Training volume · volume bars ───────────────────────── */}
          <Rise delay={160}>
            <LiquidGlassCard style={styles.card} glowColor={palette.accent}>
              <View style={styles.cardHeader}>
                <View style={styles.sectionHeadline}>
                  <Text style={styles.sectionEyebrow}>TRAINING VOLUME</Text>
                  <Text style={styles.sectionTitle}>Workouts</Text>
                </View>
                <MicroChip text={timeframeChip} />
              </View>

              <View style={styles.chartHost} onLayout={barHost.onLayout}>
                {barHost.width > 0 && (
                  <BarChart
                    data={barData}
                    width={barConfig.chartPlotWidth}
                    height={172}
                    barWidth={barConfig.barWidth}
                    spacing={barConfig.spacing}
                    initialSpacing={10}
                    roundedTop
                    roundedBottom
                    barBorderRadius={7}
                    isAnimated
                    animationDuration={950}
                    noOfSections={3}
                    maxValue={barMaxValue(currentWorkoutsSeries)}
                    rulesColor={palette.chartGrid}
                    yAxisThickness={0}
                    yAxisLabelWidth={36}
                    formatYLabel={(val) => Math.round(Number(val)).toString()}
                    xAxisThickness={1}
                    xAxisColor={palette.hairline}
                    yAxisTextStyle={{ color: palette.textMuted, fontSize: 9.5, fontFamily: SYSTEM_FONT }}
                    xAxisLabelTextStyle={{
                      color: palette.textMuted,
                      fontSize: 9.5,
                      fontWeight: '600',
                      letterSpacing: 0.6,
                      fontFamily: SYSTEM_FONT,
                    }}
                  />
                )}
              </View>

              <View style={styles.chartMeta}>
                <Text style={styles.chartMetaText}>AVG {formatInt(barMeta.avg)} / PERIOD</Text>
                <Text style={styles.chartMetaText}>BEST {formatInt(barMeta.best)}</Text>
              </View>
            </LiquidGlassCard>
          </Rise>

          {/* ── Energy intake · curved area chart ───────────────────── */}
          <Rise delay={230}>
            <LiquidGlassCard style={styles.card} glowColor={palette.orchid}>
              <View style={styles.cardHeader}>
                <View style={styles.sectionHeadline}>
                  <Text style={styles.sectionEyebrow}>ENERGY INTAKE</Text>
                  <Text style={styles.sectionTitle}>Calories In</Text>
                </View>
                <MicroChip text={timeframeChip} accent={palette.orchid} />
              </View>

              {!hasIntakeData ? (
                <View style={styles.chartEmptyWrap}>
                  <View
                    style={[
                      styles.chartEmptyIconWrap,
                      { backgroundColor: hexToRgba(palette.orchid, 0.15) },
                    ]}
                  >
                    <Ionicons name="restaurant-outline" size={22} color={palette.orchid} />
                  </View>
                  <Text style={[styles.chartEmptyTitle, { color: palette.textPrimary }]}>
                    No Calories Logged
                  </Text>
                  <Text style={[styles.chartEmptySubtitle, { color: palette.textMuted }]}>
                    Log your meals in Nutrition to track your daily energy curve.
                  </Text>
                  <Pressable
                    onPress={() => router.push('/(tabs)/nutrition')}
                    style={[
                      styles.chartEmptyAction,
                      {
                        backgroundColor: hexToRgba(palette.orchid, 0.16),
                        borderColor: hexToRgba(palette.orchid, 0.35),
                      },
                    ]}
                  >
                    <Ionicons name="add" size={15} color={palette.orchid} style={{ marginRight: 4 }} />
                    <Text style={[styles.chartEmptyActionText, { color: palette.orchid }]}>
                      Log Meal
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.chartHost} onLayout={lineHost.onLayout}>
                  {lineHost.width > 0 && (
                    <LineChart
                      data={lineData}
                      width={Math.max(100, lineHost.width - 48)}
                      height={172}
                      spacing={lineSpacing}
                      initialSpacing={0}
                      endSpacing={0}
                      curved
                      areaChart
                      thickness={2.5}
                      color={palette.orchid}
                      startFillColor={palette.orchid}
                      endFillColor={palette.orchid}
                      startOpacity={0.3}
                      endOpacity={0.02}
                      isAnimated
                      animationDuration={1100}
                      hideDataPoints
                      noOfSections={3}
                      maxValue={intakeMaxValue(currentIntakeSeries)}
                      rulesColor={palette.chartGrid}
                      yAxisThickness={0}
                      yAxisLabelWidth={36}
                      formatYLabel={(val) => Math.round(Number(val)).toString()}
                      xAxisThickness={1}
                      xAxisColor={palette.hairline}
                      yAxisTextStyle={{
                        color: palette.textMuted,
                        fontSize: 9.5,
                        fontFamily: SYSTEM_FONT,
                      }}
                      xAxisLabelTextStyle={{
                        color: palette.textMuted,
                        fontSize: 9.5,
                        fontWeight: '600',
                        letterSpacing: 0.6,
                        fontFamily: SYSTEM_FONT,
                      }}
                      pointerConfig={pointerConfig}
                    />
                  )}
                </View>
              )}

              <View style={styles.chartMeta}>
                <Text style={styles.chartMetaText}>AVG {formatInt(intakeMeta.avg)} KCAL</Text>
                <Text style={styles.chartMetaText}>PEAK {formatInt(intakeMeta.peak)}</Text>
              </View>
            </LiquidGlassCard>
          </Rise>

          {/* ── Budget breakdown ────────────────────────────────────── */}
          <Rise delay={300}>
            <LiquidGlassCard style={styles.card} glowColor={palette.gold}>
              <View style={styles.cardHeader}>
                <View style={styles.sectionHeadline}>
                  <Text style={styles.sectionEyebrow}>FITNESS SPEND</Text>
                  <Text style={styles.sectionTitle}>Budget Breakdown</Text>
                </View>
                <MicroChip text={timeframeChip} accent={palette.gold} />
              </View>

              <View style={styles.budgetTotalRow}>
                <Text style={styles.budgetTotal} maxFontSizeMultiplier={1.15}>
                  {formatMoney(currentExpenses)}
                </Text>
                {currentCategories.length > 0 && (
                  <Text style={styles.budgetMeta}>{currentCategories.length} CATEGORIES</Text>
                )}
              </View>

              {currentCategories.length === 0 ? (
                <EmptyHint
                  text="No expenses logged for this period — your ledger is spotless."
                  styles={styles}
                />
              ) : (
                currentCategories.map((category, index) => (
                  <CategoryRow
                    key={category.name}
                    name={category.name}
                    amount={category.amount}
                    share={category.share}
                    color={budgetColors[index % budgetColors.length]}
                    styles={styles}
                  />
                ))
              )}
            </LiquidGlassCard>
          </Rise>
        </View>
      </ScrollView>
    </LiquidBackground>
  );
}

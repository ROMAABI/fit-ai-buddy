import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../core/theme.dart';
import '../../core/user_data.dart';
import '../profile/profile_screen.dart';
import 'notification_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final UserData _userData = UserData();
  String _period = 'weekly';

  List<Map<String, dynamic>> _workouts = [];
  List<Map<String, dynamic>> _nutrition = [];
  List<Map<String, dynamic>> _expenses = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
  }

  DateTime get _periodStart {
    final now = DateTime.now();
    switch (_period) {
      case 'daily':
        return DateTime(now.year, now.month, now.day);
      case 'weekly':
        final start = now.subtract(Duration(days: now.weekday - 1));
        return DateTime(start.year, start.month, start.day);
      case 'monthly':
        return DateTime(now.year, now.month, 1);
      case 'yearly':
        return DateTime(now.year, 1, 1);
      default:
        return now.subtract(const Duration(days: 7));
    }
  }

  int get _totalWorkouts => _workouts.length;
  int get _totalMeals => _nutrition.length;
  double get _totalCalories => _nutrition.fold<double>(
      0, (sum, m) => sum + ((m['calories'] ?? 0) as num).toDouble());
  double get _totalProtein => _nutrition.fold<double>(
      0, (sum, m) => sum + ((m['protein_g'] ?? 0) as num).toDouble());
  double get _totalCarbs => _nutrition.fold<double>(
      0, (sum, m) => sum + ((m['carbs_g'] ?? 0) as num).toDouble());
  double get _totalFats => _nutrition.fold<double>(
      0, (sum, m) => sum + ((m['fats_g'] ?? 0) as num).toDouble());
  double get _totalExpenses => _expenses.fold<double>(
      0, (sum, e) => sum + ((e['amount'] ?? 0) as num).toDouble());

  Map<String, double> get _expenseByCategory {
    final map = <String, double>{};
    for (final e in _expenses) {
      final cat = (e['category'] ?? 'Other') as String;
      final amount = (e['amount'] ?? 0) as num;
      map[cat] = (map[cat] ?? 0) + amount.toDouble();
    }
    return map;
  }

  Map<String, int> get _workoutsByDay {
    final map = <String, int>{};
    for (final w in _workouts) {
      final ts = w['timestamp'] as Timestamp?;
      if (ts == null) continue;
      final date = ts.toDate();
      final key = _period == 'daily'
          ? '${date.hour}:00'
          : _period == 'weekly'
              ? [
                  'Mon',
                  'Tue',
                  'Wed',
                  'Thu',
                  'Fri',
                  'Sat',
                  'Sun'
                ][date.weekday - 1]
              : _period == 'monthly'
                  ? 'W${(date.day - 1) ~/ 7 + 1}'
                  : '${date.month.toString().padLeft(2, '0')}';
      map[key] = (map[key] ?? 0) + 1;
    }
    return map;
  }

  Map<String, double> get _caloriesByDay {
    final map = <String, double>{};
    for (final n in _nutrition) {
      final ts = n['timestamp'] as Timestamp?;
      if (ts == null) continue;
      final date = ts.toDate();
      final key = _period == 'daily'
          ? '${date.hour}:00'
          : _period == 'weekly'
              ? [
                  'Mon',
                  'Tue',
                  'Wed',
                  'Thu',
                  'Fri',
                  'Sat',
                  'Sun'
                ][date.weekday - 1]
              : _period == 'monthly'
                  ? 'W${(date.day - 1) ~/ 7 + 1}'
                  : '${date.month.toString().padLeft(2, '0')}';
      map[key] = (map[key] ?? 0) + ((n['calories'] ?? 0) as num).toDouble();
    }
    return map;
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      return Scaffold(
        backgroundColor: AppColors.background,
        body: const Center(child: Text('Not logged in')),
      );
    }

    final start = _periodStart;
    final firestore = FirebaseFirestore.instance;
    final userRef = firestore.collection('users').doc(user.uid);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _buildTopBar(),
            Expanded(
              child: StreamBuilder<QuerySnapshot>(
                stream: userRef.collection('workouts').snapshots(),
                builder: (context, workoutSnap) {
                  return StreamBuilder<QuerySnapshot>(
                    stream: userRef.collection('nutrition').snapshots(),
                    builder: (context, nutritionSnap) {
                      return StreamBuilder<QuerySnapshot>(
                        stream: userRef.collection('expenses').snapshots(),
                        builder: (context, expenseSnap) {
                          final allWorkouts = workoutSnap.data?.docs.map((d) {
                                final data = d.data() as Map<String, dynamic>;
                                data['id'] = d.id;
                                return data;
                              }).toList() ??
                              [];
                          final allNutrition =
                              nutritionSnap.data?.docs.map((d) {
                                    final data =
                                        d.data() as Map<String, dynamic>;
                                    data['id'] = d.id;
                                    return data;
                                  }).toList() ??
                                  [];
                          final allExpenses = expenseSnap.data?.docs.map((d) {
                                final data = d.data() as Map<String, dynamic>;
                                data['id'] = d.id;
                                return data;
                              }).toList() ??
                              [];

                          _workouts = allWorkouts.where((w) {
                            final ts = w['timestamp'] as Timestamp?;
                            if (ts == null) return false;
                            return !ts.toDate().isBefore(start);
                          }).toList();

                          _nutrition = allNutrition.where((n) {
                            final ts = n['timestamp'] as Timestamp?;
                            if (ts == null) return false;
                            return !ts.toDate().isBefore(start);
                          }).toList();

                          _expenses = allExpenses.where((e) {
                            final ts = e['timestamp'] as Timestamp?;
                            if (ts == null) return false;
                            return !ts.toDate().isBefore(start);
                          }).toList();

                          return RefreshIndicator(
                            onRefresh: () async => setState(() {}),
                            color: AppColors.cyan,
                            child: SingleChildScrollView(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SizedBox(height: 16),
                                  _buildWelcomeSection(),
                                  const SizedBox(height: 20),
                                  _buildPeriodToggle(),
                                  const SizedBox(height: 20),
                                  _buildStatsRow(),
                                  const SizedBox(height: 20),
                                  _buildWorkoutBarChart(),
                                  const SizedBox(height: 20),
                                  _buildCalorieLineChart(),
                                  const SizedBox(height: 20),
                                  _buildExpensePieChart(),
                                  const SizedBox(height: 32),
                                ],
                              ),
                            ),
                          );
                        },
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (_) => const ProfileScreen())),
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.white12),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(7),
                child: _userData.photoUrl.isNotEmpty
                    ? Image.network(_userData.photoUrl,
                        width: 36,
                        height: 36,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Center(
                            child: Text(_userData.initials.toUpperCase(),
                                style: const TextStyle(
                                    color: AppColors.cyan,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w900))))
                    : Center(
                        child: Text(_userData.initials.toUpperCase(),
                            style: const TextStyle(
                                color: AppColors.cyan,
                                fontSize: 12,
                                fontWeight: FontWeight.w900))),
              ),
            ),
          ),
          const SizedBox(width: 12),
          const Text('DASHBOARD',
              style: TextStyle(
                  color: AppColors.white,
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 2)),
          const Spacer(),
          GestureDetector(
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (_) => const NotificationScreen())),
            child: const Icon(Icons.notifications_outlined,
                color: AppColors.textMuted, size: 20),
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Welcome back, ${_userData.name}!',
            style: const TextStyle(
                color: AppColors.white,
                fontSize: 22,
                fontWeight: FontWeight.w900)),
        const SizedBox(height: 4),
        Text('Your ${_userData.objective.toLowerCase()} journey continues',
            style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
      ],
    );
  }

  Widget _buildPeriodToggle() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.white06)),
      child: Row(
        children: ['daily', 'weekly', 'monthly', 'yearly'].map((p) {
          final isSelected = _period == p;
          return Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _period = p),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.cyan : Colors.transparent,
                  borderRadius: BorderRadius.circular(7),
                ),
                child: Center(
                  child: Text(
                    p[0].toUpperCase() + p.substring(1),
                    style: TextStyle(
                      color: isSelected
                          ? AppColors.background
                          : AppColors.textMuted,
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildStatsRow() {
    return Row(
      children: [
        _statCard('WORKOUTS', '$_totalWorkouts', AppColors.cyan,
            Icons.fitness_center),
        _statCard('MEALS', '$_totalMeals', AppColors.success, Icons.restaurant),
        _statCard('CALORIES', '${_totalCalories.toInt()}', Colors.orange,
            Icons.local_fire_department),
        _statCard('SPENT', '₹${_totalExpenses.toInt()}', Colors.purple,
            Icons.payments),
      ],
    );
  }

  Widget _statCard(String label, String value, Color color, IconData icon) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: AppColors.white06)),
        child: Column(
          children: [
            Icon(icon, color: color, size: 18),
            const SizedBox(height: 6),
            Text(value,
                style: TextStyle(
                    color: AppColors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w900)),
            const SizedBox(height: 2),
            Text(label,
                style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 8,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1)),
          ],
        ),
      ),
    );
  }

  Widget _buildWorkoutBarChart() {
    final data = _workoutsByDay;
    final labels = data.keys.toList();
    final values = data.values.toList();
    final maxVal = values.isEmpty
        ? 1.0
        : values.reduce((a, b) => a > b ? a : b).toDouble();

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.white06)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('WORKOUTS',
              style: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2)),
          const SizedBox(height: 16),
          if (labels.isEmpty)
            const Center(
                child: Text('No workouts yet',
                    style: TextStyle(color: AppColors.textMuted, fontSize: 12)))
          else
            SizedBox(
              height: 160,
              child: BarChart(
                BarChartData(
                  alignment: BarChartAlignment.spaceAround,
                  maxY: maxVal + 1,
                  barTouchData: BarTouchData(enabled: false),
                  titlesData: FlTitlesData(
                    show: true,
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (val, _) {
                          final idx = val.toInt();
                          if (idx < 0 || idx >= labels.length)
                            return const SizedBox();
                          return Padding(
                            padding: const EdgeInsets.only(top: 6),
                            child: Text(labels[idx],
                                style: const TextStyle(
                                    color: AppColors.textMuted, fontSize: 9)),
                          );
                        },
                      ),
                    ),
                    leftTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false)),
                    topTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false)),
                    rightTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false)),
                  ),
                  gridData: const FlGridData(show: false),
                  borderData: FlBorderData(show: false),
                  barGroups: List.generate(labels.length, (i) {
                    return BarChartGroupData(
                      x: i,
                      barRods: [
                        BarChartRodData(
                          toY: values[i].toDouble(),
                          color: AppColors.cyan,
                          width: 16,
                          borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(4)),
                        ),
                      ],
                    );
                  }),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildCalorieLineChart() {
    final data = _caloriesByDay;
    final labels = data.keys.toList();
    final values = data.values.toList();

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.white06)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('CALORIES',
              style: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2)),
          const SizedBox(height: 8),
          Text('${_totalCalories.toInt()} kcal total',
              style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w900)),
          const SizedBox(height: 4),
          Text(
              'Protein: ${_totalProtein.toInt()}g · Carbs: ${_totalCarbs.toInt()}g · Fats: ${_totalFats.toInt()}g',
              style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
          const SizedBox(height: 16),
          if (labels.isEmpty)
            const Center(
                child: Text('No meals logged yet',
                    style: TextStyle(color: AppColors.textMuted, fontSize: 12)))
          else
            SizedBox(
              height: 140,
              child: LineChart(
                LineChartData(
                  lineTouchData: LineTouchData(
                    touchTooltipData: LineTouchTooltipData(
                      getTooltipItems: (touchedSpots) {
                        return touchedSpots.map((spot) {
                          final idx = spot.x.toInt();
                          final label = idx >= 0 && idx < labels.length
                              ? labels[idx]
                              : '';
                          return LineTooltipItem(
                              '${label}\n${spot.y.toInt()} kcal',
                              const TextStyle(
                                  color: AppColors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700));
                        }).toList();
                      },
                    ),
                  ),
                  titlesData: FlTitlesData(
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (val, _) {
                          final idx = val.toInt();
                          if (idx < 0 || idx >= labels.length)
                            return const SizedBox();
                          return Padding(
                            padding: const EdgeInsets.only(top: 6),
                            child: Text(labels[idx],
                                style: const TextStyle(
                                    color: AppColors.textMuted, fontSize: 9)),
                          );
                        },
                      ),
                    ),
                    leftTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false)),
                    topTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false)),
                    rightTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false)),
                  ),
                  gridData: const FlGridData(show: false),
                  borderData: FlBorderData(show: false),
                  lineBarsData: [
                    LineChartBarData(
                      spots: List.generate(values.length,
                          (i) => FlSpot(i.toDouble(), values[i])),
                      isCurved: true,
                      curveSmoothness: 0.3,
                      color: Colors.orange,
                      barWidth: 2.5,
                      dotData: const FlDotData(show: true),
                      belowBarData: BarAreaData(
                        show: true,
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.orange.withValues(alpha: 0.3),
                            Colors.orange.withValues(alpha: 0.0)
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildExpensePieChart() {
    final categories = _expenseByCategory;
    final labels = categories.keys.toList();
    final values = categories.values.toList();
    final total = values.isEmpty ? 1.0 : values.reduce((a, b) => a + b);
    final colors = [
      AppColors.cyan,
      AppColors.success,
      Colors.orange,
      Colors.purple,
      Colors.pink,
      Colors.grey
    ];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.white06)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('EXPENSES',
              style: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2)),
          const SizedBox(height: 8),
          Text('₹${_totalExpenses.toStringAsFixed(0)} total',
              style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w900)),
          const SizedBox(height: 16),
          if (labels.isEmpty)
            const Center(
                child: Text('No expenses yet',
                    style: TextStyle(color: AppColors.textMuted, fontSize: 12)))
          else
            Row(
              children: [
                SizedBox(
                  height: 140,
                  width: 140,
                  child: PieChart(
                    PieChartData(
                      sectionsSpace: 2,
                      centerSpaceRadius: 30,
                      sections: List.generate(labels.length, (i) {
                        return PieChartSectionData(
                          value: values[i],
                          title: '${(values[i] / total * 100).toInt()}%',
                          color: colors[i % colors.length],
                          radius: 50,
                          titleStyle: const TextStyle(
                              color: AppColors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w700),
                        );
                      }),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: List.generate(labels.length, (i) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 6),
                        child: Row(
                          children: [
                            Container(
                                width: 10,
                                height: 10,
                                decoration: BoxDecoration(
                                    color: colors[i % colors.length],
                                    borderRadius: BorderRadius.circular(2))),
                            const SizedBox(width: 8),
                            Expanded(
                                child: Text(labels[i],
                                    style: const TextStyle(
                                        color: AppColors.textSecondary,
                                        fontSize: 11))),
                            Text('₹${values[i].toStringAsFixed(0)}',
                                style: const TextStyle(
                                    color: AppColors.white,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700)),
                          ],
                        ),
                      );
                    }),
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }
}

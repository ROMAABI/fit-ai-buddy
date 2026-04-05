import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../core/theme.dart';

class ExpenseScreen extends StatefulWidget {
  const ExpenseScreen({super.key});

  @override
  State<ExpenseScreen> createState() => _ExpenseScreenState();
}

class _ExpenseScreenState extends State<ExpenseScreen> {
  List<Map<String, dynamic>> _expenses = [];

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

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      return Scaffold(
          backgroundColor: AppColors.background,
          body: const Center(child: Text('Not logged in')));
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: StreamBuilder<QuerySnapshot>(
          stream: FirebaseFirestore.instance
              .collection('users')
              .doc(user.uid)
              .collection('expenses')
              .orderBy('timestamp', descending: true)
              .snapshots(),
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              _expenses = snapshot.data!.docs.map((d) {
                final data = d.data() as Map<String, dynamic>;
                data['id'] = d.id;
                return data;
              }).toList();
            }

            return Column(
              children: [
                _buildTopBar(context),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 20),
                        _buildTotalCard(),
                        const SizedBox(height: 20),
                        _buildCategoryChart(),
                        const SizedBox(height: 20),
                        if (_expenses.isEmpty) _buildEmptyState(),
                        const SizedBox(height: 20),
                        _buildLoggedExpenses(),
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildTopBar(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text('EXPENSES',
              style: TextStyle(
                  color: AppColors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w800)),
          const Icon(Icons.settings, color: AppColors.white),
        ],
      ),
    );
  }

  Widget _buildTotalCard() {
    final categories = _expenseByCategory;
    final topCategory = categories.isEmpty
        ? '—'
        : categories.entries.reduce((a, b) => a.value > b.value ? a : b).key;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.white06)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('TOTAL THIS MONTH',
              style: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2)),
          const SizedBox(height: 8),
          Text(
            '₹${_totalExpenses.toStringAsFixed(2)}',
            style: const TextStyle(
                color: AppColors.white,
                fontSize: 42,
                fontWeight: FontWeight.w900,
                letterSpacing: -1),
          ),
          const SizedBox(height: 8),
          Text('${_expenses.length} transactions · Top: $topCategory',
              style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
          const SizedBox(height: 16),
          _buildMonthlyTrend(),
        ],
      ),
    );
  }

  Widget _buildMonthlyTrend() {
    final now = DateTime.now();
    final months = List.generate(6, (i) {
      final d = DateTime(now.year, now.month - 5 + i, 1);
      return [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ][d.month - 1];
    });

    final monthlyTotals = List.generate(6, (i) {
      final monthStart = DateTime(now.year, now.month - 5 + i, 1);
      final monthEnd = DateTime(now.year, now.month - 4 + i, 1);
      return _expenses.where((e) {
        final ts = e['timestamp'] as Timestamp?;
        if (ts == null) return false;
        final date = ts.toDate();
        return date.isAfter(monthStart) && date.isBefore(monthEnd);
      }).fold<double>(
          0, (sum, e) => sum + ((e['amount'] ?? 0) as num).toDouble());
    });

    final maxVal = monthlyTotals.isEmpty
        ? 1.0
        : monthlyTotals.reduce((a, b) => a > b ? a : b);
    final scale = maxVal > 0 ? 40.0 / maxVal : 0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('6-MONTH TREND',
            style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 9,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.5)),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: List.generate(6, (i) {
            return Column(
              children: [
                Container(
                  width: 28,
                  height: (monthlyTotals[i] * scale).clamp(4, 40),
                  decoration: BoxDecoration(
                    color: monthlyTotals[i] > 0
                        ? Colors.orange
                        : AppColors.white12,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(height: 6),
                Text(months[i],
                    style: const TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 9,
                        fontWeight: FontWeight.w600)),
              ],
            );
          }),
        ),
      ],
    );
  }

  Widget _buildCategoryChart() {
    final categories = _expenseByCategory;
    final categoryColors = {
      'Supplements': AppColors.cyan,
      'Gym Access': Colors.grey,
      'Coaching': AppColors.success,
      'Gear': Colors.orange,
      'Other': Colors.purple,
    };

    final total = categories.values.isEmpty
        ? 1.0
        : categories.values.reduce((a, b) => a + b);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.white06)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('SPENDING BY CATEGORY',
              style: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2)),
          const SizedBox(height: 16),
          if (categories.isEmpty)
            const Center(
                child: Text('No expenses to categorize',
                    style: TextStyle(color: AppColors.textMuted, fontSize: 12)))
          else
            ...categories.entries.map((entry) => _buildCategoryRow(
                  entry.key,
                  entry.value,
                  categoryColors[entry.key] ?? Colors.purple,
                  total,
                )),
        ],
      ),
    );
  }

  Widget _buildCategoryRow(
      String name, double value, Color color, double total) {
    final percentage =
        total > 0 ? (value / total * 100).toStringAsFixed(0) : '0';
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
          const SizedBox(width: 10),
          Expanded(
              child: Text(name,
                  style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                      fontWeight: FontWeight.w600))),
          Text('₹${value.toStringAsFixed(0)}',
              style: TextStyle(
                  color: color, fontSize: 13, fontWeight: FontWeight.w800)),
          const SizedBox(width: 8),
          Text('$percentage%',
              style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.white06)),
      child: const Column(
        children: [
          Icon(Icons.receipt_long_outlined,
              color: AppColors.textMuted, size: 48),
          SizedBox(height: 16),
          Text('NO EXPENSES YET',
              style: TextStyle(
                  color: AppColors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.5)),
          SizedBox(height: 8),
          Text('Tap + ADD to track your fitness expenses',
              textAlign: TextAlign.center,
              style: TextStyle(
                  color: AppColors.textMuted, fontSize: 12, height: 1.5)),
        ],
      ),
    );
  }

  Widget _buildLoggedExpenses() {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return const SizedBox.shrink();
    if (_expenses.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('LOGGED ENTRIES',
            style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 2)),
        const SizedBox(height: 10),
        ..._expenses.map((data) {
          return Dismissible(
            key: Key(data['id'] ?? data.hashCode.toString()),
            direction: DismissDirection.endToStart,
            background: Container(
              alignment: Alignment.centerRight,
              padding: const EdgeInsets.only(right: 20),
              margin: const EdgeInsets.only(bottom: 8),
              decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.red.withValues(alpha: 0.3))),
              child:
                  const Icon(Icons.delete_outline, color: Colors.red, size: 24),
            ),
            confirmDismiss: (direction) async {
              return await showDialog<bool>(
                context: context,
                builder: (context) => AlertDialog(
                  backgroundColor: AppColors.surface,
                  title: const Text('Delete Entry',
                      style: TextStyle(color: AppColors.white)),
                  content: const Text(
                      'Are you sure you want to delete this expense?',
                      style: TextStyle(color: AppColors.textMuted)),
                  actions: [
                    TextButton(
                        onPressed: () => Navigator.pop(context, false),
                        child: const Text('Cancel',
                            style: TextStyle(color: AppColors.textMuted))),
                    TextButton(
                        onPressed: () => Navigator.pop(context, true),
                        child: const Text('Delete',
                            style: TextStyle(color: Colors.red))),
                  ],
                ),
              );
            },
            onDismissed: (direction) {
              FirebaseFirestore.instance
                  .collection('users')
                  .doc(user.uid)
                  .collection('expenses')
                  .doc(data['id'])
                  .delete();
            },
            child: _buildLoggedExpenseCard(data),
          );
        }).toList(),
      ],
    );
  }

  Widget _buildLoggedExpenseCard(Map<String, dynamic> data) {
    final item = data['item'] ?? 'Unknown';
    final amount = data['amount'] ?? 0.0;
    final category = data['category'] ?? '';

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.orange.withValues(alpha: 0.2))),
      child: Row(
        children: [
          Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                  color: Colors.orange.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(6)),
              child:
                  const Icon(Icons.payments, color: Colors.orange, size: 16)),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item,
                    style: const TextStyle(
                        color: AppColors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w700)),
                if (category.isNotEmpty)
                  Text(category,
                      style: const TextStyle(
                          color: AppColors.textMuted, fontSize: 10)),
              ],
            ),
          ),
          Text('₹${amount.toStringAsFixed(2)}',
              style: const TextStyle(
                  color: Colors.orange,
                  fontSize: 16,
                  fontWeight: FontWeight.w800)),
        ],
      ),
    );
  }
}

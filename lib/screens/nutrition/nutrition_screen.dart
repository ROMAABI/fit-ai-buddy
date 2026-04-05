import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../core/theme.dart';

class NutritionScreen extends StatefulWidget {
  const NutritionScreen({super.key});

  @override
  State<NutritionScreen> createState() => _NutritionScreenState();
}

class _NutritionScreenState extends State<NutritionScreen> {
  List<Map<String, dynamic>> _meals = [];

  double get _totalCalories => _meals.fold<double>(
      0, (sum, m) => sum + ((m['calories'] ?? 0) as num).toDouble());
  double get _totalProtein => _meals.fold<double>(
      0, (sum, m) => sum + ((m['protein_g'] ?? 0) as num).toDouble());
  double get _totalCarbs => _meals.fold<double>(
      0, (sum, m) => sum + ((m['carbs_g'] ?? 0) as num).toDouble());
  double get _totalFats => _meals.fold<double>(
      0, (sum, m) => sum + ((m['fats_g'] ?? 0) as num).toDouble());

  int get _calorieTarget => 2400;
  int get _proteinTarget => 180;
  int get _carbsTarget => 220;
  int get _fatsTarget => 65;

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
              .collection('nutrition')
              .orderBy('timestamp', descending: true)
              .snapshots(),
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              _meals = snapshot.data!.docs.map((d) {
                final data = d.data() as Map<String, dynamic>;
                data['id'] = d.id;
                return data;
              }).toList();
            }

            return Column(
              children: [
                _buildHeaderSection(),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 16),
                        _buildCalorieSummary(),
                        const SizedBox(height: 20),
                        _buildMacroChart(),
                        const SizedBox(height: 20),
                        if (_meals.isEmpty) _buildEmptyState(),
                        const SizedBox(height: 20),
                        _buildLoggedMeals(),
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

  Widget _buildHeaderSection() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text('NUTRITION',
              style: TextStyle(
                  color: AppColors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w800)),
          Icon(Icons.settings, color: AppColors.white),
        ],
      ),
    );
  }

  Widget _buildCalorieSummary() {
    final progress = _totalCalories / _calorieTarget;
    final percentage = (progress * 100).clamp(0, 100).toInt();

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.white06)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('TODAY\'S CALORIES',
              style: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2)),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                        text: '${_totalCalories.toInt()}',
                        style: const TextStyle(
                            color: AppColors.white,
                            fontSize: 36,
                            fontWeight: FontWeight.w900)),
                    TextSpan(
                        text: ' / $_calorieTarget kcal',
                        style: const TextStyle(
                            color: AppColors.textMuted, fontSize: 14)),
                  ],
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                    color: AppColors.success.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(6)),
                child: Text('$percentage%',
                    style: const TextStyle(
                        color: AppColors.success,
                        fontSize: 14,
                        fontWeight: FontWeight.w800)),
              ),
            ],
          ),
          const SizedBox(height: 14),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress.clamp(0.0, 1.0),
              backgroundColor: AppColors.white12,
              valueColor:
                  const AlwaysStoppedAnimation<Color>(AppColors.success),
              minHeight: 8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMacroChart() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.white06)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('MACRO BREAKDOWN',
              style: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2)),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildMacroBar('Protein', _totalProtein.toInt(), _proteinTarget,
                  AppColors.cyan),
              _buildMacroBar(
                  'Carbs', _totalCarbs.toInt(), _carbsTarget, Colors.grey),
              _buildMacroBar(
                  'Fats', _totalFats.toInt(), _fatsTarget, Colors.orange),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMacroBar(String label, int current, int target, Color color) {
    final progress = (current / target).clamp(0.0, 1.0);
    return Column(
      children: [
        SizedBox(
          height: 80,
          width: 40,
          child: Stack(
            alignment: Alignment.bottomCenter,
            children: [
              Container(
                  width: 40,
                  height: 80,
                  decoration: BoxDecoration(
                      color: AppColors.white12,
                      borderRadius: BorderRadius.circular(8))),
              Container(
                  width: 40,
                  height: 80 * progress,
                  decoration: BoxDecoration(
                      color: color, borderRadius: BorderRadius.circular(8))),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Text(label,
            style: const TextStyle(
                color: AppColors.textMuted,
                fontSize: 10,
                fontWeight: FontWeight.w600)),
        const SizedBox(height: 2),
        Text('$current/$target',
            style: TextStyle(
                color: color, fontSize: 12, fontWeight: FontWeight.w800)),
      ],
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
          Icon(Icons.restaurant_menu, color: AppColors.textMuted, size: 48),
          SizedBox(height: 16),
          Text('NO MEALS LOGGED',
              style: TextStyle(
                  color: AppColors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.5)),
          SizedBox(height: 8),
          Text('Tap + ADD to log your first meal and track macros',
              textAlign: TextAlign.center,
              style: TextStyle(
                  color: AppColors.textMuted, fontSize: 12, height: 1.5)),
        ],
      ),
    );
  }

  Widget _buildLoggedMeals() {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return const SizedBox.shrink();

    if (_meals.isEmpty) {
      return const SizedBox.shrink();
    }

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
        ..._meals.map((data) {
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
                      'Are you sure you want to delete this meal?',
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
                  .collection('nutrition')
                  .doc(data['id'])
                  .delete();
            },
            child: _buildLoggedMealCard(data),
          );
        }).toList(),
      ],
    );
  }

  Widget _buildLoggedMealCard(Map<String, dynamic> data) {
    final meal = data['meal'] ?? 'Unknown';
    final calories = data['calories'] ?? 0;
    final protein = data['protein_g'];
    final carbs = data['carbs_g'];
    final fats = data['fats_g'];

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.success.withValues(alpha: 0.2))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                      color: AppColors.success.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(6)),
                  child: const Icon(Icons.restaurant,
                      color: AppColors.success, size: 16)),
              const SizedBox(width: 10),
              Expanded(
                  child: Text(meal,
                      style: const TextStyle(
                          color: AppColors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w700))),
              Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                      color: AppColors.success.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(4)),
                  child: Text('$calories kcal',
                      style: const TextStyle(
                          color: AppColors.success,
                          fontSize: 10,
                          fontWeight: FontWeight.w700))),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              if (protein != null) _miniStat('${protein}g', 'PROTEIN'),
              if (carbs != null) _miniStat('$carbs g', 'CARBS'),
              if (fats != null) _miniStat('$fats g', 'FATS'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _miniStat(String value, String label) {
    return Padding(
      padding: const EdgeInsets.only(right: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(value,
              style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w800)),
          Text(label,
              style: const TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 8,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1)),
        ],
      ),
    );
  }
}

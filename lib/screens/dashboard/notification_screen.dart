import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../core/theme.dart';

class NotificationItem {
  final String id;
  final String title;
  final String body;
  final DateTime time;
  final IconData icon;
  final Color iconColor;

  NotificationItem({
    required this.id,
    required this.title,
    required this.body,
    required this.time,
    required this.icon,
    required this.iconColor,
  });
}

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  String _timeAgo(DateTime time) {
    final diff = DateTime.now().difference(time);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }

  String _formatTimestamp(Timestamp? ts) {
    if (ts == null) return '';
    final date = ts.toDate();
    return '${date.day}/${date.month}/${date.year} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }

  List<NotificationItem> _buildNotifications(
    List<Map<String, dynamic>> workouts,
    List<Map<String, dynamic>> nutrition,
    List<Map<String, dynamic>> expenses,
  ) {
    final notifications = <NotificationItem>[];

    for (final w in workouts) {
      final activity = w['activity'] ?? 'Workout';
      final duration = w['duration_min'];
      final intensity = w['intensity'] ?? '';
      final ts = w['timestamp'] as Timestamp?;

      String body = activity;
      if (duration != null) body += ' — ${duration}min';
      if (intensity.isNotEmpty) body += ' • $intensity';

      notifications.add(NotificationItem(
        id: 'workout_${w['id'] ?? ts?.millisecondsSinceEpoch ?? DateTime.now().millisecondsSinceEpoch}',
        title: 'Workout Logged',
        body: body,
        time: ts?.toDate() ?? DateTime.now(),
        icon: Icons.fitness_center,
        iconColor: AppColors.cyan,
      ));
    }

    for (final n in nutrition) {
      final meal = n['meal'] ?? 'Meal';
      final calories = n['calories'];
      final protein = n['protein_g'];
      final ts = n['timestamp'] as Timestamp?;

      String body = meal;
      if (calories != null) body += ' — ${calories} kcal';
      if (protein != null) body += ' • ${protein}g protein';

      notifications.add(NotificationItem(
        id: 'nutrition_${n['id'] ?? ts?.millisecondsSinceEpoch ?? DateTime.now().millisecondsSinceEpoch}',
        title: 'Meal Logged',
        body: body,
        time: ts?.toDate() ?? DateTime.now(),
        icon: Icons.restaurant,
        iconColor: AppColors.success,
      ));
    }

    for (final e in expenses) {
      final item = e['item'] ?? 'Expense';
      final amount = e['amount'];
      final category = e['category'] ?? '';
      final ts = e['timestamp'] as Timestamp?;

      String body = item;
      if (amount != null) body += ' — ₹${amount.toStringAsFixed(0)}';
      if (category.isNotEmpty) body += ' • $category';

      notifications.add(NotificationItem(
        id: 'expense_${e['id'] ?? ts?.millisecondsSinceEpoch ?? DateTime.now().millisecondsSinceEpoch}',
        title: 'Expense Logged',
        body: body,
        time: ts?.toDate() ?? DateTime.now(),
        icon: Icons.payments,
        iconColor: Colors.orange,
      ));
    }

    notifications.sort((a, b) => b.time.compareTo(a.time));
    return notifications;
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

    final userRef =
        FirebaseFirestore.instance.collection('users').doc(user.uid);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: StreamBuilder<QuerySnapshot>(
          stream: userRef
              .collection('workouts')
              .orderBy('timestamp', descending: true)
              .snapshots(),
          builder: (context, workoutSnap) {
            return StreamBuilder<QuerySnapshot>(
              stream: userRef
                  .collection('nutrition')
                  .orderBy('timestamp', descending: true)
                  .snapshots(),
              builder: (context, nutritionSnap) {
                return StreamBuilder<QuerySnapshot>(
                  stream: userRef
                      .collection('expenses')
                      .orderBy('timestamp', descending: true)
                      .snapshots(),
                  builder: (context, expenseSnap) {
                    final workouts = workoutSnap.data?.docs.map((d) {
                          final data = d.data() as Map<String, dynamic>;
                          data['id'] = d.id;
                          return data;
                        }).toList() ??
                        [];

                    final nutrition = nutritionSnap.data?.docs.map((d) {
                          final data = d.data() as Map<String, dynamic>;
                          data['id'] = d.id;
                          return data;
                        }).toList() ??
                        [];

                    final expenses = expenseSnap.data?.docs.map((d) {
                          final data = d.data() as Map<String, dynamic>;
                          data['id'] = d.id;
                          return data;
                        }).toList() ??
                        [];

                    final notifications =
                        _buildNotifications(workouts, nutrition, expenses);

                    return Column(
                      children: [
                        _buildTopBar(notifications),
                        Expanded(
                          child: notifications.isEmpty
                              ? _buildEmptyState()
                              : ListView.builder(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16),
                                  itemCount: notifications.length,
                                  itemBuilder: (context, index) {
                                    return _buildNotificationCard(
                                        notifications[index]);
                                  },
                                ),
                        ),
                      ],
                    );
                  },
                );
              },
            );
          },
        ),
      ),
    );
  }

  Widget _buildTopBar(List<NotificationItem> notifications) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.white06)),
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.white30),
                borderRadius: BorderRadius.circular(6),
              ),
              child:
                  const Icon(Icons.close, color: AppColors.white70, size: 16),
            ),
          ),
          const SizedBox(width: 12),
          const Text(
            'NOTIFICATIONS',
            style: TextStyle(
              color: AppColors.white,
              fontSize: 12,
              fontWeight: FontWeight.w800,
              letterSpacing: 2,
            ),
          ),
          const Spacer(),
          if (notifications.isNotEmpty)
            Text(
              '${notifications.length}',
              style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
            ),
        ],
      ),
    );
  }

  Widget _buildNotificationCard(NotificationItem notification) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.white06),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: notification.iconColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(notification.icon,
                color: notification.iconColor, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        notification.title,
                        style: const TextStyle(
                          color: AppColors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    Text(
                      _timeAgo(notification.time),
                      style: const TextStyle(
                          color: AppColors.textMuted, fontSize: 10),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  notification.body,
                  style: const TextStyle(
                      color: AppColors.textMuted, fontSize: 12, height: 1.5),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Icon(Icons.notifications_off_outlined,
                color: AppColors.textMuted, size: 40),
          ),
          const SizedBox(height: 20),
          const Text(
            'NO NOTIFICATIONS',
            style: TextStyle(
                color: AppColors.white,
                fontSize: 14,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.5),
          ),
          const SizedBox(height: 8),
          const Text(
            'Log workouts, meals, or expenses to see them here',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.textMuted, fontSize: 12),
          ),
        ],
      ),
    );
  }
}

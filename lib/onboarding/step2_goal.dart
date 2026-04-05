import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../core/user_data.dart';
import '../../widgets/cyber_button.dart';

class Step2GoalScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const Step2GoalScreen(
      {super.key, required this.onNext, required this.onBack});

  @override
  State<Step2GoalScreen> createState() => _Step2GoalScreenState();
}

class _Step2GoalScreenState extends State<Step2GoalScreen> {
  int _selectedDays = 5;
  String _firstDayOfWeek = 'SUNDAY';

  final List<String> _weekDays = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY'
  ];

  String get _intensityLabel {
    if (_selectedDays <= 2) return 'LIGHT';
    if (_selectedDays <= 4) return 'MODERATE';
    if (_selectedDays == 5) return 'INTENSE';
    return 'EXTREME';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight: constraints.maxHeight -
                      MediaQuery.of(context).viewInsets.bottom -
                      24,
                ),
                child: IntrinsicHeight(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildTopBar(),
                      const SizedBox(height: 28),
                      _buildStepBar(),
                      const SizedBox(height: 32),
                      _buildTitle(),
                      const SizedBox(height: 12),
                      _buildDescription(),
                      const SizedBox(height: 36),
                      _buildDaysSelector(),
                      const SizedBox(height: 24),
                      _buildFirstDayPicker(),
                      const SizedBox(height: 20),
                      _buildProTip(),
                      const SizedBox(height: 32),
                      _buildBottomBar(),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.white06))),
      child: Row(
        children: [
          GestureDetector(
            onTap: widget.onBack,
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.white30),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Icon(Icons.arrow_back_ios_new,
                  color: AppColors.white70, size: 14),
            ),
          ),
          const SizedBox(width: 12),
          const Text(
            'GOAL SETTING',
            style: TextStyle(
              color: AppColors.white70,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 2,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepBar() {
    return Row(
      children: [
        ...List.generate(
          4,
          (i) => Expanded(
            child: Container(
              margin: EdgeInsets.only(right: i < 3 ? 3 : 0),
              height: 3,
              decoration: BoxDecoration(
                color: i <= 1 ? AppColors.cyan : AppColors.white12,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        const Text(
          'STEP 02 / 04',
          style: TextStyle(
            color: AppColors.textMuted,
            fontSize: 10,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.5,
          ),
        ),
      ],
    );
  }

  Widget _buildTitle() {
    return const Text(
      'Set your weekly\ngoal',
      style: TextStyle(
        color: AppColors.white,
        fontSize: 30,
        fontWeight: FontWeight.w800,
        height: 1.2,
      ),
    );
  }

  Widget _buildDescription() {
    return const Text(
      'We recommend training at least 3 days\nweekly for a better result.',
      style: TextStyle(
        color: AppColors.textMuted,
        fontSize: 13,
        height: 1.6,
      ),
    );
  }

  Widget _buildDaysSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'TRAINING DAYS PER WEEK',
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.8,
              ),
            ),
            Text(
              _intensityLabel,
              style: const TextStyle(
                color: AppColors.white,
                fontSize: 10,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.5,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(7, (i) {
            final day = i + 1;
            final isSelected = _selectedDays == day;
            return GestureDetector(
              onTap: () => setState(() => _selectedDays = day),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                width: 38,
                height: 44,
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.cyan : AppColors.surface,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isSelected ? AppColors.cyan : AppColors.white12,
                  ),
                  boxShadow: isSelected
                      ? [
                          const BoxShadow(
                              color: AppColors.cyanGlow,
                              blurRadius: 12,
                              spreadRadius: 0)
                        ]
                      : [],
                ),
                child: Center(
                  child: Text(
                    '$day',
                    style: TextStyle(
                      color: isSelected
                          ? AppColors.background
                          : AppColors.textSecondary,
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
            );
          }),
        ),
      ],
    );
  }

  Widget _buildFirstDayPicker() {
    return GestureDetector(
      onTap: () => _showDayPicker(),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.white12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.calendar_today_outlined,
                    color: AppColors.textMuted, size: 14),
                SizedBox(width: 8),
                Text(
                  'FIRST DAY OF WEEK',
                  style: TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.8,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _firstDayOfWeek,
                  style: const TextStyle(
                    color: AppColors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1,
                  ),
                ),
                const Icon(Icons.chevron_right,
                    color: AppColors.textMuted, size: 20),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showDayPicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (_) => ListView(
        shrinkWrap: true,
        children: _weekDays
            .map((d) => ListTile(
                  title:
                      Text(d, style: const TextStyle(color: AppColors.white)),
                  onTap: () {
                    setState(() => _firstDayOfWeek = d);
                    Navigator.pop(context);
                  },
                ))
            .toList(),
      ),
    );
  }

  Widget _buildProTip() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cyan.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.cyan.withValues(alpha: 0.15)),
      ),
      child: const Row(
        children: [
          Icon(Icons.trending_up, color: AppColors.cyan, size: 16),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              'PRO TIP: Setting a 5-day goal increases adherence by 24% among elite athletes.',
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 11,
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.white30),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.remove, color: AppColors.white50, size: 18),
          ),
          const Spacer(),
          SizedBox(
            width: 160,
            child: CyberButton(
              label: 'CONTINUE',
              onTap: () {
                UserData().trainingDaysPerWeek = _selectedDays;
                UserData().firstDayOfWeek = _firstDayOfWeek;
                widget.onNext();
              },
              trailing: const Icon(Icons.chevron_right,
                  color: AppColors.background, size: 18),
            ),
          ),
        ],
      ),
    );
  }
}

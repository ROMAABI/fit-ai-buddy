import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../core/user_data.dart';
import '../../widgets/cyber_button.dart';

class Step4FitnessScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const Step4FitnessScreen(
      {super.key, required this.onNext, required this.onBack});

  @override
  State<Step4FitnessScreen> createState() => _Step4FitnessScreenState();
}

class _Step4FitnessScreenState extends State<Step4FitnessScreen> {
  int _selected = 2;

  final _levels = [
    _FitnessLevel(
      title: 'BEGINNER',
      description: '3-5 repetitions',
      icon: Icons.signal_cellular_alt_1_bar,
    ),
    _FitnessLevel(
      title: 'INTERMEDIATE',
      description: '5-10 repetitions',
      icon: Icons.bolt,
    ),
    _FitnessLevel(
      title: 'ADVANCED',
      description: 'At least 10 repetitions',
      icon: Icons.multiple_stop,
    ),
  ];

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
                      const SizedBox(height: 20),
                      _buildStepBar(),
                      const SizedBox(height: 32),
                      _buildTitle(),
                      const SizedBox(height: 14),
                      _buildDescription(),
                      const SizedBox(height: 32),
                      ...List.generate(
                        _levels.length,
                        (i) => Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _LevelCard(
                            level: _levels[i],
                            isSelected: _selected == i,
                            onTap: () => setState(() => _selected = i),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      _buildImagePlaceholder(),
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
            child: CustomPaint(
              painter: _DashedBoxPainter(),
              child: const SizedBox(
                width: 36,
                height: 36,
                child: Icon(Icons.arrow_back_ios_new,
                    color: AppColors.cyan, size: 14),
              ),
            ),
          ),
          const SizedBox(width: 12),
          const Text(
            'ASSESSMENT 01',
            style: TextStyle(
              color: AppColors.textMuted,
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
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'STEP 4 OF 4',
          style: TextStyle(
            color: AppColors.cyan,
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 10),
        Row(
          children: List.generate(4, (i) {
            return Expanded(
              child: Container(
                margin: EdgeInsets.only(right: i < 3 ? 4 : 0),
                height: 3,
                decoration: BoxDecoration(
                  color: AppColors.cyan,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            );
          }),
        ),
      ],
    );
  }

  Widget _buildTitle() {
    return const Text(
      'HOW MANY PUSH-UPS\nCAN YOU DO?',
      style: TextStyle(
        color: AppColors.white,
        fontSize: 28,
        fontWeight: FontWeight.w900,
        letterSpacing: 0.3,
        height: 1.15,
      ),
    );
  }

  Widget _buildDescription() {
    return const Text(
      'Your current strength level helps us calibrate your adaptive performance algorithm.',
      style: TextStyle(
        color: AppColors.textMuted,
        fontSize: 13,
        height: 1.6,
      ),
    );
  }

  Widget _buildImagePlaceholder() {
    return Container(
      height: 100,
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.transparent,
            AppColors.cyan.withValues(alpha: 0.05),
          ],
        ),
      ),
      child: Center(
        child: Icon(
          Icons.sports_gymnastics,
          size: 48,
          color: AppColors.white.withValues(alpha: 0.1),
        ),
      ),
    );
  }

  Widget _buildBottomBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
      child: CyberButton(
        label: 'NEXT',
        onTap: () {
          final levels = ['Beginner', 'Intermediate', 'Advanced'];
          UserData().fitnessLevel = levels[_selected];
          widget.onNext();
        },
        trailing: const Icon(Icons.arrow_forward,
            color: AppColors.background, size: 16),
      ),
    );
  }
}

class _FitnessLevel {
  final String title;
  final String description;
  final IconData icon;

  _FitnessLevel(
      {required this.title, required this.description, required this.icon});
}

class _LevelCard extends StatelessWidget {
  final _FitnessLevel level;
  final bool isSelected;
  final VoidCallback onTap;

  const _LevelCard(
      {required this.level, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.cyan.withValues(alpha: 0.06)
              : AppColors.surface,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected ? AppColors.cyan : AppColors.white12,
            width: isSelected ? 1.5 : 1,
          ),
          boxShadow: isSelected
              ? [const BoxShadow(color: AppColors.cyanGlow, blurRadius: 16)]
              : [],
        ),
        child: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.cyan.withValues(alpha: 0.15)
                    : AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                level.icon,
                color: isSelected ? AppColors.cyan : AppColors.textMuted,
                size: 18,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    level.title,
                    style: TextStyle(
                      color: isSelected
                          ? AppColors.white
                          : AppColors.textSecondary,
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    level.description,
                    style: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? AppColors.cyan : AppColors.white30,
                  width: 2,
                ),
                color: isSelected ? AppColors.cyan : Colors.transparent,
              ),
              child: isSelected
                  ? const Icon(Icons.circle,
                      color: AppColors.background, size: 10)
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}

class _DashedBoxPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.cyan.withValues(alpha: 0.5)
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;
    const dashWidth = 5.0;
    const dashSpace = 3.0;
    final path = Path()
      ..addRRect(RRect.fromRectAndRadius(
          Rect.fromLTWH(0, 0, size.width, size.height),
          const Radius.circular(6)));
    final pathMetrics = path.computeMetrics();
    for (final metric in pathMetrics) {
      double distance = 0;
      while (distance < metric.length) {
        canvas.drawPath(
            metric.extractPath(distance, distance + dashWidth), paint);
        distance += dashWidth + dashSpace;
      }
    }
  }

  @override
  bool shouldRepaint(_DashedBoxPainter oldDelegate) => false;
}

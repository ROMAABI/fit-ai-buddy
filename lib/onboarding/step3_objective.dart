import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../core/user_data.dart';
import '../../widgets/cyber_button.dart';

class Step3ObjectiveScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const Step3ObjectiveScreen(
      {super.key, required this.onNext, required this.onBack});

  @override
  State<Step3ObjectiveScreen> createState() => _Step3ObjectiveScreenState();
}

class _Step3ObjectiveScreenState extends State<Step3ObjectiveScreen> {
  int _selected = 1;

  final _objectives = [
    _Objective(
        title: 'LOSE WEIGHT',
        titleLines: 'LOSE WEIGHT',
        subtitle: 'METABOLIC OPTIMIZATION',
        icon: Icons.monitor_weight_outlined,
        gradientColors: [const Color(0xFF1a2a1a), const Color(0xFF0d1a0d)]),
    _Objective(
        title: 'BUILD\nMUSCLE',
        titleLines: 'BUILD\nMUSCLE',
        subtitle: 'HYPERTROPHY & POWER',
        icon: Icons.fitness_center,
        gradientColors: [const Color(0xFF1a1a2a), const Color(0xFF0d0d1a)]),
    _Objective(
        title: 'KEEP FIT',
        titleLines: 'KEEP FIT',
        subtitle: 'ENDURANCE & VITALITY',
        icon: Icons.directions_run,
        gradientColors: [const Color(0xFF2a1a1a), const Color(0xFF1a0d0d)]),
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
                      _buildStepRow(),
                      const SizedBox(height: 28),
                      _buildTitle(),
                      const SizedBox(height: 12),
                      _buildDescription(),
                      const SizedBox(height: 28),
                      ...List.generate(
                          _objectives.length,
                          (i) => Padding(
                                padding: const EdgeInsets.only(bottom: 12),
                                child: _ObjectiveCard(
                                  objective: _objectives[i],
                                  isSelected: _selected == i,
                                  onTap: () => setState(() => _selected = i),
                                ),
                              )),
                      const SizedBox(height: 24),
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
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
          Container(width: 1, height: 24, color: AppColors.white12),
          const SizedBox(width: 12),
          const Text(
            'PERFORMANCE GOALS',
            style: TextStyle(
              color: AppColors.white70,
              fontSize: 11,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.5,
            ),
          ),
          const Spacer(),
          const Text(
            'VRTX_SYSTIM',
            style: TextStyle(
              color: AppColors.cyan,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 2,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepRow() {
    return Row(
      children: [
        const Text(
          'STEP 3 OF 4',
          style: TextStyle(
            color: AppColors.cyan,
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 2,
          ),
        ),
        const SizedBox(width: 16),
        const Text(
          'CALIBRATION IN PROGRESS',
          style: TextStyle(
            color: AppColors.textMuted,
            fontSize: 10,
            fontWeight: FontWeight.w600,
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Row(
            children: List.generate(4, (i) {
              return Expanded(
                child: Container(
                  margin: EdgeInsets.only(right: i < 3 ? 3 : 0),
                  height: 3,
                  decoration: BoxDecoration(
                    color: i <= 2 ? AppColors.cyan : AppColors.white12,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              );
            }),
          ),
        ),
      ],
    );
  }

  Widget _buildTitle() {
    return RichText(
      text: const TextSpan(
        children: [
          TextSpan(
            text: 'SELECT YOUR\n',
            style: TextStyle(
              color: AppColors.white,
              fontSize: 32,
              fontWeight: FontWeight.w900,
              letterSpacing: 0.5,
              height: 1.1,
            ),
          ),
          TextSpan(
            text: 'PRIMARY OBJECTIVE',
            style: TextStyle(
              color: AppColors.cyan,
              fontSize: 32,
              fontWeight: FontWeight.w900,
              fontStyle: FontStyle.italic,
              height: 1.2,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDescription() {
    return const Text(
      'Define your focus parameters. The engine will recalibrate biometric targets based on this selection.',
      style: TextStyle(color: AppColors.textMuted, fontSize: 13, height: 1.6),
    );
  }

  Widget _buildBottomBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.white12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.chevron_left,
                color: AppColors.white50, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: CyberButton(
              label: 'CONTINUE',
              onTap: () {
                final objectives = ['Lose Weight', 'Build Muscle', 'Keep Fit'];
                UserData().objective = objectives[_selected];
                widget.onNext();
              },
              trailing: const Icon(Icons.arrow_forward,
                  color: AppColors.background, size: 16),
            ),
          ),
          const SizedBox(width: 12),
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.white12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.chevron_right,
                color: AppColors.white50, size: 18),
          ),
        ],
      ),
    );
  }
}

class _Objective {
  final String title;
  final String titleLines;
  final String subtitle;
  final IconData icon;
  final List<Color> gradientColors;

  _Objective({
    required this.title,
    required this.titleLines,
    required this.subtitle,
    required this.icon,
    required this.gradientColors,
  });
}

class _ObjectiveCard extends StatelessWidget {
  final _Objective objective;
  final bool isSelected;
  final VoidCallback onTap;

  const _ObjectiveCard({
    required this.objective,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        height: 110,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected ? AppColors.cyan : AppColors.white12,
            width: isSelected ? 1.5 : 1,
          ),
          gradient: LinearGradient(
            colors: isSelected
                ? [AppColors.cyan.withValues(alpha: 0.08), AppColors.surface]
                : [AppColors.surface, AppColors.surface],
          ),
          boxShadow: isSelected
              ? [const BoxShadow(color: AppColors.cyanGlow, blurRadius: 20)]
              : [],
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          children: [
            Positioned(
              right: 0,
              top: 0,
              bottom: 0,
              width: 130,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                    colors: objective.gradientColors,
                  ),
                ),
                child: Center(
                  child: Icon(
                    objective.icon,
                    size: 42,
                    color: AppColors.white.withValues(alpha: 0.15),
                  ),
                ),
              ),
            ),
            Positioned(
              right: 0,
              top: 0,
              bottom: 0,
              width: 130,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      isSelected
                          ? AppColors.surface.withValues(alpha: 0.8)
                          : AppColors.surface,
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
            if (isSelected)
              Positioned(
                left: 0,
                right: 0,
                top: 0,
                child: Container(
                    height: 1.5, color: AppColors.cyan.withValues(alpha: 0.6)),
              ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    objective.titleLines,
                    style: const TextStyle(
                      color: AppColors.white,
                      fontSize: 19,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.3,
                      height: 1.15,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    objective.subtitle,
                    style: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 9,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.8,
                    ),
                  ),
                ],
              ),
            ),
            if (isSelected)
              Positioned(
                right: 95,
                top: 0,
                bottom: 0,
                child: Center(
                  child: Container(
                    width: 24,
                    height: 24,
                    decoration: const BoxDecoration(
                      color: AppColors.cyan,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(color: AppColors.cyanGlow, blurRadius: 8)
                      ],
                    ),
                    child: const Icon(Icons.check,
                        color: AppColors.background, size: 14),
                  ),
                ),
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

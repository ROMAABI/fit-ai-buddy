import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../widgets/cyber_button.dart';

class PlanConfirmedScreen extends StatelessWidget {
  final VoidCallback onStartNow;
  final VoidCallback? onBack;

  const PlanConfirmedScreen({super.key, required this.onStartNow, this.onBack});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 14),
              _buildTopBar(),
              SizedBox(height: MediaQuery.of(context).size.height * 0.15),
              _buildReadyBadge(),
              const SizedBox(height: 16),
              _buildTitle(),
              const SizedBox(height: 20),
              _buildDescription(),
              const SizedBox(height: 48),
              GestureDetector(
                onTap: () {
                  debugPrint('START NOW tapped');
                  onStartNow();
                },
                child: Container(
                  height: 54,
                  decoration: BoxDecoration(
                    color: AppColors.cyan,
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.cyan.withValues(alpha: 0.3),
                        blurRadius: 20,
                        spreadRadius: 0,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Text(
                        'START NOW',
                        style: TextStyle(
                          color: AppColors.background,
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 2,
                        ),
                      ),
                      SizedBox(width: 8),
                      Icon(Icons.bolt, color: AppColors.background, size: 18),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Row(
      children: [
        if (onBack != null)
          GestureDetector(
            onTap: onBack,
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.white30),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.arrow_back_ios_new,
                  color: AppColors.white70, size: 14),
            ),
          )
        else
          const SizedBox(width: 36),
        const SizedBox(width: 12),
        const Text(
          'PLAN CONFIRMED',
          style: TextStyle(
            color: AppColors.textSecondary,
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 2,
          ),
        ),
        const Spacer(),
        const Icon(Icons.more_vert, color: AppColors.textMuted),
      ],
    );
  }

  Widget _buildReadyBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
      decoration: BoxDecoration(
        border: const Border(left: BorderSide(color: AppColors.cyan, width: 3)),
        color: AppColors.cyan.withValues(alpha: 0.06),
      ),
      child: const Text(
        'READY FOR DEPLOYMENT',
        style: TextStyle(
          color: AppColors.cyan,
          fontSize: 10,
          fontWeight: FontWeight.w800,
          letterSpacing: 2,
        ),
      ),
    );
  }

  Widget _buildTitle() {
    return RichText(
      text: const TextSpan(
        children: [
          TextSpan(
            text: '28 DAYS ',
            style: TextStyle(
              color: AppColors.white,
              fontSize: 38,
              fontWeight: FontWeight.w900,
              height: 1.1,
            ),
          ),
          TextSpan(
            text: 'FULL\nBODY\n',
            style: TextStyle(
              color: AppColors.cyan,
              fontSize: 38,
              fontWeight: FontWeight.w900,
              height: 1.1,
            ),
          ),
          TextSpan(
            text: 'CHALLENGE',
            style: TextStyle(
              color: AppColors.white,
              fontSize: 38,
              fontWeight: FontWeight.w900,
              height: 1.1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDescription() {
    return const Text(
      'Start your body-toning journey to target all muscle groups and build your dream body in 4 weeks! This precision-engineered program optimizes intensity and recovery for maximum neural adaptation.',
      style: TextStyle(
        color: AppColors.textSecondary,
        fontSize: 13,
        height: 1.7,
      ),
    );
  }
}

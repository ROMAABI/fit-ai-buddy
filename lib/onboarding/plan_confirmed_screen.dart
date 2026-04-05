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
      body: Stack(
        children: [
          // Hero image section (top ~55% of screen)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: MediaQuery.of(context).size.height * 0.55,
            child: Stack(
              children: [
                Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color(0xFF0D1520),
                        AppColors.background,
                      ],
                    ),
                  ),
                  child: Center(
                    child: Icon(
                      Icons.directions_run,
                      size: 140,
                      color: AppColors.white.withValues(alpha: 0.06),
                    ),
                  ),
                ),
                // Gradient overlay bottom
                Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 120,
                  child: Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, AppColors.background],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Content
          SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildTopBar(context),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                            height: MediaQuery.of(context).size.height * 0.25),
                        _buildReadyBadge(),
                        const SizedBox(height: 16),
                        _buildTitle(),
                        const SizedBox(height: 20),
                        _buildDescription(),
                        const SizedBox(height: 36),
                        CyberButton(
                          label: 'START NOW',
                          onTap: onStartNow,
                          trailing: const Icon(Icons.bolt,
                              color: AppColors.background, size: 18),
                        ),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopBar(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
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
      ),
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

import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../core/user_data.dart';
import '../../widgets/cyber_button.dart';

class Step1SexScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback? onBack;

  const Step1SexScreen({super.key, required this.onNext, this.onBack});

  @override
  State<Step1SexScreen> createState() => _Step1SexScreenState();
}

class _Step1SexScreenState extends State<Step1SexScreen> {
  int _selected = 1; // 0=Male, 1=Female

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            bottom: MediaQuery.of(context).viewInsets.bottom + 24,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 40),
              _buildTitle(),
              const SizedBox(height: 16),
              _buildDescription(),
              const SizedBox(height: 48),
              _buildOption(0, Icons.male, 'Male', '\u2642'),
              const SizedBox(height: 12),
              _buildOption(1, Icons.female, 'Female', '\u2640'),
              const SizedBox(height: 48),
              _buildPrivacyNote(),
              const SizedBox(height: 20),
              CyberButton(
                label: 'CONTINUE',
                onTap: () {
                  UserData().sex = _selected == 0 ? 'Male' : 'Female';
                  widget.onNext();
                },
                trailing: const Icon(Icons.chevron_right,
                    color: AppColors.background, size: 18),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.white06)),
      ),
      child: Row(
        children: [
          if (widget.onBack != null)
            GestureDetector(
              onTap: widget.onBack,
              child: const Icon(Icons.arrow_back_ios_new,
                  color: AppColors.white70, size: 18),
            )
          else
            const SizedBox(width: 18),
          const Expanded(
            child: Center(
              child: Text(
                'STEP 1 OF 4',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2,
                ),
              ),
            ),
          ),
          const SizedBox(width: 60),
        ],
      ),
    );
  }

  Widget _buildTitle() {
    return RichText(
      textAlign: TextAlign.center,
      text: const TextSpan(
        children: [
          TextSpan(
            text: 'Select your ',
            style: TextStyle(
              color: AppColors.white,
              fontSize: 30,
              fontWeight: FontWeight.w800,
              height: 1.2,
            ),
          ),
          TextSpan(
            text: 'biological\nsex',
            style: TextStyle(
              color: AppColors.cyan,
              fontSize: 30,
              fontWeight: FontWeight.w800,
              height: 1.2,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDescription() {
    return const Text(
      'This helps our algorithm calibrate your\nmetabolic baseline with precision.',
      textAlign: TextAlign.center,
      style: TextStyle(
        color: AppColors.textMuted,
        fontSize: 13,
        height: 1.6,
      ),
    );
  }

  Widget _buildOption(int index, IconData icon, String label, String symbol) {
    final isSelected = _selected == index;
    return GestureDetector(
      onTap: () => setState(() => _selected = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
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
              ? [
                  const BoxShadow(
                      color: AppColors.cyanGlow,
                      blurRadius: 20,
                      spreadRadius: 0)
                ]
              : [],
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.cyan.withValues(alpha: 0.15)
                    : AppColors.white06,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: Text(
                  symbol,
                  style: TextStyle(
                    fontSize: 20,
                    color: isSelected ? AppColors.cyan : AppColors.textMuted,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? AppColors.white : AppColors.textSecondary,
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
            const Spacer(),
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

  Widget _buildPrivacyNote() {
    return const Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.lock_outline, color: AppColors.textDisabled, size: 12),
        SizedBox(width: 6),
        Text(
          'BIOMETRIC DATA IS ENCRYPTED AND PRIVATE',
          style: TextStyle(
            color: AppColors.textDisabled,
            fontSize: 9,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.5,
          ),
        ),
      ],
    );
  }
}

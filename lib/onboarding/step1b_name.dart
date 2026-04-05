import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../core/user_data.dart';
import '../../widgets/cyber_button.dart';

class StepNameScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const StepNameScreen({super.key, required this.onNext, required this.onBack});

  @override
  State<StepNameScreen> createState() => _StepNameScreenState();
}

class _StepNameScreenState extends State<StepNameScreen> {
  final TextEditingController _nameController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _buildTopBar(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 28),
                    _buildStepBar(),
                    const SizedBox(height: 32),
                    _buildTitle(),
                    const SizedBox(height: 12),
                    _buildDescription(),
                    const SizedBox(height: 36),
                    _buildNameInput(),
                  ],
                ),
              ),
            ),
            _buildBottomBar(),
          ],
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
            'PROFILE SETUP',
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
          5,
          (i) => Expanded(
            child: Container(
              margin: EdgeInsets.only(right: i < 4 ? 3 : 0),
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
          'NAME',
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
      'What should we\ncall you?',
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
      'Enter your name or nickname to personalize your experience.',
      style: TextStyle(
        color: AppColors.textMuted,
        fontSize: 13,
        height: 1.6,
      ),
    );
  }

  Widget _buildNameInput() {
    return TextField(
      controller: _nameController,
      style: const TextStyle(
        color: AppColors.white,
        fontSize: 18,
        fontWeight: FontWeight.w600,
      ),
      decoration: InputDecoration(
        hintText: 'YOUR NAME',
        hintStyle: const TextStyle(
          color: AppColors.textMuted,
          fontSize: 14,
          fontWeight: FontWeight.w800,
          letterSpacing: 2,
        ),
        filled: true,
        fillColor: AppColors.surface,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppColors.white12),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppColors.cyan),
        ),
      ),
      onChanged: (val) => setState(() {}),
    );
  }

  Widget _buildBottomBar() {
    final bool hasName = _nameController.text.trim().isNotEmpty;
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
            child: Opacity(
              opacity: hasName ? 1.0 : 0.5,
              child: CyberButton(
                label: 'CONTINUE',
                onTap: hasName
                    ? () {
                        final name = _nameController.text.trim();
                        UserData().name = name;
                        UserData().initials = name.length >= 2
                            ? name.substring(0, 2).toUpperCase()
                            : name.toUpperCase();
                        widget.onNext();
                      }
                    : () {},
                trailing: const Icon(Icons.chevron_right,
                    color: AppColors.background, size: 18),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

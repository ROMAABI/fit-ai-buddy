import 'package:flutter/material.dart';
import 'step1_sex.dart';
import 'step1b_name.dart';
import 'step2_goal.dart';
import 'step3_objective.dart';
import 'step4_fitness.dart';
import 'calibration_screen.dart';
import 'plan_confirmed_screen.dart';
import '../shell/main_shell.dart';
import '../core/auth_service.dart';

class OnboardingFlow extends StatefulWidget {
  const OnboardingFlow({super.key});

  @override
  State<OnboardingFlow> createState() => _OnboardingFlowState();
}

class _OnboardingFlowState extends State<OnboardingFlow> {
  final _controller = PageController();

  void _next() {
    debugPrint('OnboardingFlow: _next called');
    _controller.nextPage(
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeInOut,
    );
  }

  void _back() {
    _controller.previousPage(
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeInOut,
    );
  }

  void _onComplete() async {
    debugPrint('OnboardingFlow: onComplete called');
    await AuthService().markOnboardingComplete();
    if (!mounted) return;
    debugPrint('OnboardingFlow: navigating to MainShell');
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const MainShell()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return PageView(
      controller: _controller,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        Step1SexScreen(onNext: _next, onBack: _back),
        StepNameScreen(onNext: _next, onBack: _back),
        Step2GoalScreen(onNext: _next, onBack: _back),
        Step3ObjectiveScreen(onNext: _next, onBack: _back),
        Step4FitnessScreen(onNext: _next, onBack: _back),
        CalibrationScreen(onGetPlan: _next, onBack: _back),
        PlanConfirmedScreen(
          onStartNow: _onComplete,
        ),
      ],
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}

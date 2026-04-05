import 'package:flutter/material.dart';
import 'step1_sex.dart';
import 'step1b_name.dart';
import 'step2_goal.dart';
import 'step3_objective.dart';
import 'step4_fitness.dart';
import 'calibration_screen.dart';
import 'plan_confirmed_screen.dart';

class OnboardingFlow extends StatefulWidget {
  final VoidCallback onComplete;

  const OnboardingFlow({super.key, required this.onComplete});

  @override
  State<OnboardingFlow> createState() => _OnboardingFlowState();
}

class _OnboardingFlowState extends State<OnboardingFlow> {
  final _controller = PageController();

  void _next() {
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
          onStartNow: widget.onComplete,
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

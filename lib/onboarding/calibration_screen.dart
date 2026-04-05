import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../widgets/cyber_button.dart';
import '../../core/auth_service.dart';
import '../../core/user_data.dart';

class CalibrationScreen extends StatefulWidget {
  final VoidCallback onGetPlan;
  final VoidCallback? onBack;

  const CalibrationScreen({super.key, required this.onGetPlan, this.onBack});

  @override
  State<CalibrationScreen> createState() => _CalibrationScreenState();
}

class _CalibrationScreenState extends State<CalibrationScreen> {
  double _weight = 75.0;
  int _height = 182;
  int _age = 28;
  bool _weightKg = true;
  bool _heightCm = true;
  bool _isSaving = false;

  Future<void> _saveAndContinue() async {
    setState(() => _isSaving = true);

    try {
      // Save to UserData
      UserData().weight = _weightKg ? _weight : _weight / 2.205;
      UserData().height = _heightCm ? _height : (_height * 30.48).round();
      UserData().age = _age;

      // Save to Firebase
      final authService = AuthService();
      await authService.saveUserProfileToFirebase({
        'name': UserData().name,
        'email': UserData().email,
        'photoUrl': UserData().photoUrl,
        'sex': UserData().sex,
        'age': _age,
        'weight': _weightKg ? _weight : _weight / 2.205,
        'height': _heightCm ? _height : (_height * 30.48).round(),
        'trainingDaysPerWeek': UserData().trainingDaysPerWeek,
        'firstDayOfWeek': UserData().firstDayOfWeek,
        'objective': UserData().objective,
        'fitnessLevel': UserData().fitnessLevel,
      });

      if (mounted) {
        debugPrint('CalibrationScreen: calling onGetPlan');
        widget.onGetPlan();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error saving profile: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTopBar(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 24),
                    _buildHeader(),
                    const SizedBox(height: 32),
                    _buildWeightCard(),
                    const SizedBox(height: 16),
                    _buildHeightCard(),
                    const SizedBox(height: 16),
                    _buildAgeCard(),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
              child: CyberButton(
                label: _isSaving ? 'SAVING...' : 'GET MY PLAN',
                onTap: _isSaving ? () {} : _saveAndContinue,
                trailing: _isSaving
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: AppColors.background,
                        ),
                      )
                    : const Icon(Icons.bolt,
                        color: AppColors.background, size: 18),
              ),
            ),
          ],
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
                'CALIBRATION',
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

  Widget _buildHeader() {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'FINAL CALIBRATION',
          style: TextStyle(
            color: AppColors.white,
            fontSize: 30,
            fontWeight: FontWeight.w900,
            letterSpacing: 0.5,
          ),
        ),
        SizedBox(height: 8),
        Text(
          'CONFIGURE YOUR PHYSICAL PARAMETERS\nFOR PEAK ALGORITHMIC ACCURACY.',
          style: TextStyle(
            color: AppColors.textMuted,
            fontSize: 11,
            fontWeight: FontWeight.w600,
            letterSpacing: 1.2,
            height: 1.6,
          ),
        ),
      ],
    );
  }

  Widget _buildWeightCard() {
    return _MeasurementCard(
      measurementNumber: '01',
      label: 'WEIGHT',
      units: const ['KG', 'LBS'],
      selectedUnit: _weightKg ? 0 : 1,
      onUnitChange: (i) => setState(() => _weightKg = i == 0),
      displayValue: _weightKg
          ? '${_weight.toStringAsFixed(1)} kg'
          : '${(_weight * 2.205).toStringAsFixed(1)} lbs',
      onDecrease: () =>
          setState(() => _weight = (_weight - 0.5).clamp(30, 200)),
      onIncrease: () =>
          setState(() => _weight = (_weight + 0.5).clamp(30, 200)),
    );
  }

  Widget _buildHeightCard() {
    return _MeasurementCard(
      measurementNumber: '02',
      label: 'HEIGHT',
      units: const ['CM', 'FT'],
      selectedUnit: _heightCm ? 0 : 1,
      onUnitChange: (i) => setState(() => _heightCm = i == 0),
      displayValue: _heightCm
          ? '$_height cm'
          : '${(_height / 30.48).toStringAsFixed(1)} ft',
      onDecrease: () => setState(() => _height = (_height - 1).clamp(100, 250)),
      onIncrease: () => setState(() => _height = (_height + 1).clamp(100, 250)),
    );
  }

  Widget _buildAgeCard() {
    return _MeasurementCard(
      measurementNumber: '03',
      label: 'AGE',
      units: const ['YEARS'],
      selectedUnit: 0,
      onUnitChange: (_) {},
      displayValue: '$_age',
      onDecrease: () => setState(() => _age = (_age - 1).clamp(10, 100)),
      onIncrease: () => setState(() => _age = (_age + 1).clamp(10, 100)),
    );
  }
}

class _MeasurementCard extends StatelessWidget {
  final String measurementNumber;
  final String label;
  final List<String> units;
  final int selectedUnit;
  final ValueChanged<int> onUnitChange;
  final String displayValue;
  final VoidCallback onDecrease;
  final VoidCallback onIncrease;

  const _MeasurementCard({
    required this.measurementNumber,
    required this.label,
    required this.units,
    required this.selectedUnit,
    required this.onUnitChange,
    required this.displayValue,
    required this.onDecrease,
    required this.onIncrease,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onHorizontalDragUpdate: (details) {
        if (details.delta.dx > 0) {
          onIncrease();
        } else if (details.delta.dx < 0) {
          onDecrease();
        }
      },
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.white06),
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Text(
                      'MEASUREMENT $measurementNumber',
                      style: const TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 9,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.8,
                      ),
                    ),
                  ],
                ),
                _UnitToggle(
                  units: units,
                  selected: selectedUnit,
                  onChanged: onUnitChange,
                ),
              ],
            ),
            const SizedBox(height: 4),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                label,
                style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1,
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              displayValue,
              style: const TextStyle(
                color: AppColors.cyan,
                fontSize: 52,
                fontWeight: FontWeight.w900,
                letterSpacing: -1,
              ),
            ),
            const SizedBox(height: 16),
            _buildRuler(),
          ],
        ),
      ),
    );
  }

  Widget _buildRuler() {
    return SizedBox(
      height: 32,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(21, (i) {
              final isMid = i == 10;
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 3),
                width: 1.5,
                height: isMid ? 28 : (i % 5 == 0 ? 18 : 10),
                color: isMid
                    ? AppColors.cyan
                    : AppColors.white.withValues(alpha: isMid ? 1 : 0.2),
              );
            }),
          ),
        ],
      ),
    );
  }
}

class _UnitToggle extends StatelessWidget {
  final List<String> units;
  final int selected;
  final ValueChanged<int> onChanged;

  const _UnitToggle({
    required this.units,
    required this.selected,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    if (units.length == 1) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: AppColors.white12),
        ),
        child: Text(
          units[0],
          style: const TextStyle(
            color: AppColors.cyan,
            fontSize: 10,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.5,
          ),
        ),
      );
    }

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(units.length, (i) {
        final isSelected = selected == i;
        return GestureDetector(
          onTap: () => onChanged(i),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.white : AppColors.surfaceElevated,
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: AppColors.white12),
            ),
            child: Text(
              units[i],
              style: TextStyle(
                color: isSelected ? AppColors.background : AppColors.textMuted,
                fontSize: 10,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.2,
              ),
            ),
          ),
        );
      }),
    );
  }
}

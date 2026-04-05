import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/theme.dart';
import 'add_session_screen.dart';

enum WorkoutMode { home, gym }

enum Difficulty { all, beginner, intermediate, advanced }

class WorkoutExercise {
  final String name;
  final String muscleGroup;
  final Difficulty difficulty;
  final int sets;
  final String reps;
  final String weight;
  final int restSeconds;
  final String formTip;
  final bool isHomeWorkout;

  const WorkoutExercise({
    required this.name,
    required this.muscleGroup,
    required this.difficulty,
    required this.sets,
    required this.reps,
    required this.weight,
    required this.restSeconds,
    required this.formTip,
    required this.isHomeWorkout,
  });
}

const _homeExercises = [
  WorkoutExercise(
      name: 'Push-Up',
      muscleGroup: 'Chest',
      difficulty: Difficulty.beginner,
      sets: 4,
      reps: '15',
      weight: 'BW',
      restSeconds: 45,
      formTip:
          'Place hands shoulder-width apart. Core tight. Slow down, fast up.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Wide Push-Up',
      muscleGroup: 'Chest',
      difficulty: Difficulty.intermediate,
      sets: 4,
      reps: '12',
      weight: 'BW',
      restSeconds: 60,
      formTip: 'Place hands wide — outer chest activates. Elbows at 45° angle.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Diamond Push-Up',
      muscleGroup: 'Chest',
      difficulty: Difficulty.advanced,
      sets: 3,
      reps: '10',
      weight: 'BW',
      restSeconds: 75,
      formTip:
          'Form diamond shape with hands — inner chest + tricep. Elbows close to body.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Decline Push-Up',
      muscleGroup: 'Chest',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '12',
      weight: 'BW',
      restSeconds: 60,
      formTip: 'Place feet on chair. Upper chest target. Control the descent.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Archer Push-Up',
      muscleGroup: 'Chest',
      difficulty: Difficulty.advanced,
      sets: 3,
      reps: '8',
      weight: 'BW',
      restSeconds: 90,
      formTip:
          'Extend one arm to the side while pushing on the other. Builds unilateral strength.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Superman Hold',
      muscleGroup: 'Back',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '15',
      weight: 'BW',
      restSeconds: 45,
      formTip: 'Lift hands & feet simultaneously. Hold 2 sec. Erectors fire.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Reverse Snow Angel',
      muscleGroup: 'Back',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '12',
      weight: 'BW',
      restSeconds: 45,
      formTip: 'Lie face down. Slow arc with arms. Squeeze back at top.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Table Row',
      muscleGroup: 'Back',
      difficulty: Difficulty.intermediate,
      sets: 4,
      reps: '12',
      weight: 'BW',
      restSeconds: 60,
      formTip: 'Lie under a table. Pull chest to table. Retract scapula.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Good Morning (BW)',
      muscleGroup: 'Back',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '15',
      weight: 'BW',
      restSeconds: 45,
      formTip: 'Hinge at hips. Keep back straight. Feel hamstring stretch.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Door Pull-Up',
      muscleGroup: 'Lat',
      difficulty: Difficulty.advanced,
      sets: 4,
      reps: '8',
      weight: 'BW',
      restSeconds: 90,
      formTip:
          'Loop towel over door and pull. Elbows down & back. Full range of motion.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Bedsheet Row',
      muscleGroup: 'Lat',
      difficulty: Difficulty.intermediate,
      sets: 4,
      reps: '12',
      weight: 'BW',
      restSeconds: 60,
      formTip: 'Tie bedsheet to door handle. Lean back, row up. Squeeze lats.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Lat Prayer Stretch',
      muscleGroup: 'Lat',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '12',
      weight: 'BW',
      restSeconds: 45,
      formTip:
          'Place hands on chair. Push hips back. Feel the lat stretch. Hold 2 sec.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Chair Dip',
      muscleGroup: 'Arms',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '15',
      weight: 'BW',
      restSeconds: 60,
      formTip:
          'Grip chair edge. Bend elbows to 90°. Full tricep squeeze at top.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Bottle Curl',
      muscleGroup: 'Arms',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '15',
      weight: 'Bottle',
      restSeconds: 45,
      formTip:
          'Fill water bottles. Slow curl up, slow down. Keep elbows fixed.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Diamond Push-Up (Tri)',
      muscleGroup: 'Arms',
      difficulty: Difficulty.advanced,
      sets: 3,
      reps: '12',
      weight: 'BW',
      restSeconds: 60,
      formTip:
          'Diamond hand position. Elbows close to body. Perfect tricep isolation.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Wall Curl (Isometric)',
      muscleGroup: 'Arms',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '30s',
      weight: 'BW',
      restSeconds: 45,
      formTip:
          'Push against wall in curl position and hold. Time under tension.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Pike Push-Up',
      muscleGroup: 'Shoulders',
      difficulty: Difficulty.intermediate,
      sets: 4,
      reps: '12',
      weight: 'BW',
      restSeconds: 60,
      formTip: 'Form V shape. Elbows out — like shoulder press. Head to floor.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Wall Handstand Hold',
      muscleGroup: 'Shoulders',
      difficulty: Difficulty.advanced,
      sets: 3,
      reps: '20s',
      weight: 'BW',
      restSeconds: 90,
      formTip: 'Handstand against wall. Core tight. Shoulders fully loaded.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Arm Circles',
      muscleGroup: 'Shoulders',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '20',
      weight: 'BW',
      restSeconds: 30,
      formTip: 'Big & small circles. Forward + backward. Perfect warm-up.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Bottle Lateral Raise',
      muscleGroup: 'Shoulders',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '15',
      weight: 'Bottle',
      restSeconds: 45,
      formTip: 'Hold bottle in each hand. Slow raise to sides. Pinky up.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Crunch',
      muscleGroup: 'Abdomen',
      difficulty: Difficulty.beginner,
      sets: 4,
      reps: '25',
      weight: 'BW',
      restSeconds: 30,
      formTip: 'Keep lower back on floor. Don\'t pull neck. Exhale at top.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Plank',
      muscleGroup: 'Abdomen',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '45s',
      weight: 'BW',
      restSeconds: 45,
      formTip: 'Keep hips level. Maintain straight line. Breathe steadily.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Bicycle Crunch',
      muscleGroup: 'Abdomen',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '20',
      weight: 'BW',
      restSeconds: 45,
      formTip: 'Slow rotation. Opposite elbow to knee. Feel the obliques.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Leg Raise',
      muscleGroup: 'Abdomen',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '15',
      weight: 'BW',
      restSeconds: 45,
      formTip: 'Keep legs straight. Lower abs fire. Slow lower down.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Mountain Climber',
      muscleGroup: 'Abdomen',
      difficulty: Difficulty.advanced,
      sets: 3,
      reps: '30s',
      weight: 'BW',
      restSeconds: 45,
      formTip: 'Go fast — cardio + core combo. Keep hips level.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Russian Twist',
      muscleGroup: 'Abdomen',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '20',
      weight: 'Bottle',
      restSeconds: 45,
      formTip: 'Hold bottle. Lift feet — harder version. Oblique burn.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Bodyweight Squat',
      muscleGroup: 'Legs',
      difficulty: Difficulty.beginner,
      sets: 4,
      reps: '20',
      weight: 'BW',
      restSeconds: 45,
      formTip: 'Knees over toes. Chest up. Squat deep. Keep heels flat.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Jump Squat',
      muscleGroup: 'Legs',
      difficulty: Difficulty.advanced,
      sets: 3,
      reps: '15',
      weight: 'BW',
      restSeconds: 60,
      formTip: 'Squat down, explosive jump up, soft landing. Quad burn!',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Lunge',
      muscleGroup: 'Legs',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '12',
      weight: 'BW',
      restSeconds: 45,
      formTip: '12 reps per leg. Front knee at 90°. Keep torso upright.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Glute Bridge',
      muscleGroup: 'Legs',
      difficulty: Difficulty.beginner,
      sets: 4,
      reps: '20',
      weight: 'BW',
      restSeconds: 45,
      formTip:
          'Shoulder blades on floor. Push hips high. Squeeze glutes at top.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Wall Sit',
      muscleGroup: 'Legs',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '45s',
      weight: 'BW',
      restSeconds: 60,
      formTip: '90° angle. Back flat against wall. Thighs parallel to floor.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Calf Raise',
      muscleGroup: 'Legs',
      difficulty: Difficulty.beginner,
      sets: 4,
      reps: '25',
      weight: 'BW',
      restSeconds: 30,
      formTip:
          'Hold wall for balance. Rise on toes, slow down. Try single leg.',
      isHomeWorkout: true),
  WorkoutExercise(
      name: 'Pistol Squat (Assist)',
      muscleGroup: 'Legs',
      difficulty: Difficulty.advanced,
      sets: 3,
      reps: '8',
      weight: 'BW',
      restSeconds: 90,
      formTip: 'Use chair for support. One leg deep squat. Balance + strength.',
      isHomeWorkout: true),
];

const _gymExercises = [
  WorkoutExercise(
      name: 'Bench Press',
      muscleGroup: 'Chest',
      difficulty: Difficulty.intermediate,
      sets: 4,
      reps: '10',
      weight: '80kg',
      restSeconds: 90,
      formTip:
          'Keep shoulder blades retracted, feet flat on the floor. Control the descent.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Incline Dumbbell Press',
      muscleGroup: 'Chest',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '12',
      weight: '25kg',
      restSeconds: 60,
      formTip:
          "Control the descent, don't let dumbbells touch at top. Upper chest focus.",
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Cable Fly',
      muscleGroup: 'Chest',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '15',
      weight: '15kg',
      restSeconds: 60,
      formTip:
          'Arms slightly bent throughout. Squeeze at centre. Feel the stretch.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Chest Dip',
      muscleGroup: 'Chest',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '12',
      weight: 'BW',
      restSeconds: 75,
      formTip:
          'Lean forward slightly for chest emphasis. Full ROM. Slow negative.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Pec Deck Machine',
      muscleGroup: 'Chest',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '15',
      weight: '40kg',
      restSeconds: 60,
      formTip:
          'Elbows at shoulder height. Squeeze for 1 sec at peak contraction.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Deadlift',
      muscleGroup: 'Back',
      difficulty: Difficulty.advanced,
      sets: 4,
      reps: '8',
      weight: '120kg',
      restSeconds: 120,
      formTip:
          'Bar over mid-foot. Hinge, brace, drive through floor. Neutral spine always.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Barbell Row',
      muscleGroup: 'Back',
      difficulty: Difficulty.intermediate,
      sets: 4,
      reps: '10',
      weight: '70kg',
      restSeconds: 90,
      formTip: 'Hip hinge position. Pull to lower chest. Elbows drive back.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'T-Bar Row',
      muscleGroup: 'Back',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '12',
      weight: '50kg',
      restSeconds: 75,
      formTip: 'Chest on pad. Full stretch at bottom. Squeeze at top.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Seated Cable Row',
      muscleGroup: 'Back',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '15',
      weight: '55kg',
      restSeconds: 60,
      formTip:
          'Sit tall. Pull to belly button. Pause, control return. No momentum.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Lat Pulldown',
      muscleGroup: 'Lat',
      difficulty: Difficulty.beginner,
      sets: 4,
      reps: '12',
      weight: '55kg',
      restSeconds: 75,
      formTip: 'Lean back slightly. Pull to upper chest. Full stretch at top.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Wide Grip Pull-Up',
      muscleGroup: 'Lat',
      difficulty: Difficulty.advanced,
      sets: 4,
      reps: '8',
      weight: 'BW',
      restSeconds: 90,
      formTip:
          'Dead hang start. Drive elbows down. Chin over bar. Full extension.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Straight Arm Pulldown',
      muscleGroup: 'Lat',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '15',
      weight: '25kg',
      restSeconds: 60,
      formTip: 'Arms straight. Hinge forward. Pull cable to thighs. Lats only.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Single Arm Row',
      muscleGroup: 'Lat',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '12',
      weight: '28kg',
      restSeconds: 60,
      formTip: 'Brace on bench. Elbow drive back. Full range. Lat squeeze.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Barbell Curl',
      muscleGroup: 'Arms',
      difficulty: Difficulty.beginner,
      sets: 4,
      reps: '12',
      weight: '30kg',
      restSeconds: 60,
      formTip:
          'Elbows pinned to sides. Full ROM. Squeeze at top. Slow negative.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Tricep Pushdown',
      muscleGroup: 'Arms',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '15',
      weight: '25kg',
      restSeconds: 60,
      formTip:
          'Elbows fixed. Full extension at bottom. Control return. No swinging.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Hammer Curl',
      muscleGroup: 'Arms',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '12',
      weight: '16kg',
      restSeconds: 60,
      formTip: 'Neutral grip. Brachialis + brachioradialis. Alternate arms.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Skull Crushers',
      muscleGroup: 'Arms',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '10',
      weight: '30kg',
      restSeconds: 75,
      formTip: 'Lower bar to forehead. Elbows stationary. Tricep long head.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Preacher Curl',
      muscleGroup: 'Arms',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '12',
      weight: '25kg',
      restSeconds: 60,
      formTip: 'Chest on pad. Full stretch at bottom. No momentum. Bicep peak.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Overhead Press',
      muscleGroup: 'Shoulders',
      difficulty: Difficulty.intermediate,
      sets: 4,
      reps: '10',
      weight: '50kg',
      restSeconds: 90,
      formTip: 'Bar from front rack. Press overhead. Lockout. Core braced.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Lateral Raise',
      muscleGroup: 'Shoulders',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '15',
      weight: '10kg',
      restSeconds: 60,
      formTip:
          'Slight forward lean. Pinky up. Stop at shoulder height. Feel the burn.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Face Pull',
      muscleGroup: 'Shoulders',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '20',
      weight: '20kg',
      restSeconds: 60,
      formTip:
          'Pull to face. External rotate at end. Rear delt + rotator cuff.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Arnold Press',
      muscleGroup: 'Shoulders',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '12',
      weight: '18kg',
      restSeconds: 75,
      formTip: 'Rotate palms as you press. All three delt heads engaged.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Cable Crunch',
      muscleGroup: 'Abdomen',
      difficulty: Difficulty.intermediate,
      sets: 4,
      reps: '20',
      weight: '30kg',
      restSeconds: 60,
      formTip: 'Kneel, pull cable to floor. Curl spine. Hips stay stationary.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Hanging Leg Raise',
      muscleGroup: 'Abdomen',
      difficulty: Difficulty.advanced,
      sets: 3,
      reps: '15',
      weight: 'BW',
      restSeconds: 60,
      formTip: 'Dead hang. Raise legs to 90°. Control the lower. No swing.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Ab Wheel Rollout',
      muscleGroup: 'Abdomen',
      difficulty: Difficulty.advanced,
      sets: 3,
      reps: '12',
      weight: 'BW',
      restSeconds: 75,
      formTip:
          'Start kneeling. Roll out slow. Pull back with core. Do not collapse.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Decline Sit-Up',
      muscleGroup: 'Abdomen',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '20',
      weight: 'BW',
      restSeconds: 45,
      formTip: 'Anchor feet. Arms crossed. Full ROM. Exhale on the way up.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Barbell Squat',
      muscleGroup: 'Legs',
      difficulty: Difficulty.advanced,
      sets: 5,
      reps: '8',
      weight: '100kg',
      restSeconds: 120,
      formTip:
          'Bar on traps. Brace core. Break at hips & knees. Drive floor away.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Leg Press',
      muscleGroup: 'Legs',
      difficulty: Difficulty.intermediate,
      sets: 4,
      reps: '12',
      weight: '140kg',
      restSeconds: 90,
      formTip:
          'Feet hip-width. Full ROM. Do not lock out knees. Control return.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Romanian Deadlift',
      muscleGroup: 'Legs',
      difficulty: Difficulty.intermediate,
      sets: 3,
      reps: '10',
      weight: '80kg',
      restSeconds: 90,
      formTip:
          'Hinge at hips. Bar close to legs. Hamstring stretch. Neutral spine.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Leg Curl Machine',
      muscleGroup: 'Legs',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '15',
      weight: '35kg',
      restSeconds: 60,
      formTip:
          'Hips flat. Curl fully. Pause at peak. Slow negative. Hamstrings.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Leg Extension',
      muscleGroup: 'Legs',
      difficulty: Difficulty.beginner,
      sets: 3,
      reps: '15',
      weight: '40kg',
      restSeconds: 60,
      formTip: 'Toes up. Full extension. Pause 1 sec. Quad isolation perfect.',
      isHomeWorkout: false),
  WorkoutExercise(
      name: 'Calf Raise Machine',
      muscleGroup: 'Legs',
      difficulty: Difficulty.beginner,
      sets: 4,
      reps: '20',
      weight: '60kg',
      restSeconds: 45,
      formTip:
          'Full stretch at bottom. Rise all the way up. Slow & controlled.',
      isHomeWorkout: false),
];

class WorkoutScreen extends StatefulWidget {
  const WorkoutScreen({super.key});

  @override
  State<WorkoutScreen> createState() => _WorkoutScreenState();
}

class _WorkoutScreenState extends State<WorkoutScreen> {
  WorkoutMode _mode = WorkoutMode.home;
  String _selectedMuscle = 'All';
  Difficulty _selectedDiff = Difficulty.all;
  final Set<int> _doneIds = {};
  String? _lastResetDate;

  @override
  void initState() {
    super.initState();
    _checkDailyReset();
  }

  Future<void> _checkDailyReset() async {
    final prefs = await SharedPreferences.getInstance();
    final today = DateTime.now();
    final todayStr = '${today.year}-${today.month}-${today.day}';
    final savedDate = prefs.getString('workout_last_reset');

    if (savedDate != todayStr) {
      setState(() => _doneIds.clear());
      await prefs.setString('workout_last_reset', todayStr);
    }
    _lastResetDate = todayStr;
  }

  final _muscleGroups = [
    'All',
    'Chest',
    'Back',
    'Lat',
    'Arms',
    'Shoulders',
    'Abdomen',
    'Legs'
  ];

  List<WorkoutExercise> get _filtered {
    final source = _mode == WorkoutMode.home ? _homeExercises : _gymExercises;
    return source.where((e) {
      final muscleOk =
          _selectedMuscle == 'All' || e.muscleGroup == _selectedMuscle;
      final diffOk =
          _selectedDiff == Difficulty.all || e.difficulty == _selectedDiff;
      return muscleOk && diffOk;
    }).toList();
  }

  String get _todayProtocol {
    if (_selectedMuscle == 'All') {
      return _mode == WorkoutMode.home
          ? 'Full Body — Bodyweight Blast'
          : 'Full Body — Strength Protocol';
    }
    return '$_selectedMuscle — ${_mode == WorkoutMode.home ? "Home Edition" : "Gym Protocol"}';
  }

  String get _protocolSub {
    final f = _filtered;
    final mins = (f.length * 4).clamp(10, 90);
    final diffStr = _selectedDiff == Difficulty.all
        ? 'Mixed'
        : _selectedDiff == Difficulty.beginner
            ? 'Beginner'
            : _selectedDiff == Difficulty.intermediate
                ? 'Intermediate'
                : 'Advanced';
    return '${f.length} Exercises · ~$mins min · $diffStr';
  }

  @override
  Widget build(BuildContext context) {
    final exercises = _filtered;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _buildTopBar(context),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 12),
                    _buildModeToggle(),
                    const SizedBox(height: 14),
                    _buildTodayProtocol(),
                    const SizedBox(height: 16),
                    _buildSectionLabel('MUSCLE GROUP'),
                    const SizedBox(height: 8),
                    _buildMuscleChips(),
                    const SizedBox(height: 12),
                    _buildSectionLabel('DIFFICULTY'),
                    const SizedBox(height: 8),
                    _buildDifficultyChips(),
                    const SizedBox(height: 20),
                    _buildLoggedWorkouts(),
                    const SizedBox(height: 16),
                    if (exercises.isEmpty)
                      _buildEmpty()
                    else
                      ...List.generate(exercises.length, (i) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _WorkoutCard(
                            exercise: exercises[i],
                            isDone: _doneIds.contains(i),
                            onToggle: () async {
                              final user = FirebaseAuth.instance.currentUser;
                              if (user == null) return;

                              final ex = exercises[i];
                              if (_doneIds.contains(i)) {
                                _doneIds.remove(i);
                                // Delete from Firestore
                                final query = await FirebaseFirestore.instance
                                    .collection('users')
                                    .doc(user.uid)
                                    .collection('workouts')
                                    .where('activity', isEqualTo: ex.name)
                                    .where('source', isEqualTo: 'card_check')
                                    .limit(1)
                                    .get();
                                for (final doc in query.docs) {
                                  await doc.reference.delete();
                                }
                              } else {
                                _doneIds.add(i);
                                // Save to Firestore
                                await FirebaseFirestore.instance
                                    .collection('users')
                                    .doc(user.uid)
                                    .collection('workouts')
                                    .add({
                                  'activity': ex.name,
                                  'duration_min':
                                      ex.restSeconds * ex.sets ~/ 60 + 5,
                                  'intensity': ex.difficulty ==
                                          Difficulty.beginner
                                      ? 'Low'
                                      : ex.difficulty == Difficulty.intermediate
                                          ? 'Medium'
                                          : 'High',
                                  'sets': ex.sets,
                                  'reps': ex.reps,
                                  'weight_kg': ex.weight == 'BW'
                                      ? 0
                                      : int.tryParse(ex.weight.replaceAll(
                                              RegExp(r'[^0-9]'), '')) ??
                                          0,
                                  'source': 'card_check',
                                  'timestamp': Timestamp.now(),
                                });
                              }
                              setState(() {});
                            },
                          ),
                        );
                      }),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          const Text(
            'WORKOUTS',
            style: TextStyle(
              color: AppColors.white,
              fontSize: 20,
              fontWeight: FontWeight.w900,
              letterSpacing: 1,
            ),
          ),
          const Spacer(),
          GestureDetector(
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (_) => const AddSessionScreen())),
            child: const Icon(Icons.settings_outlined,
                color: AppColors.textMuted, size: 22),
          ),
        ],
      ),
    );
  }

  Widget _buildModeToggle() {
    return Container(
      height: 48,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.white12),
      ),
      child: Row(
        children: [
          _ModeTab(
            icon: Icons.home_outlined,
            label: 'Home',
            isActive: _mode == WorkoutMode.home,
            onTap: () => setState(() {
              _mode = WorkoutMode.home;
              _doneIds.clear();
            }),
          ),
          _ModeTab(
            icon: Icons.fitness_center,
            label: 'Gym',
            isActive: _mode == WorkoutMode.gym,
            onTap: () => setState(() {
              _mode = WorkoutMode.gym;
              _doneIds.clear();
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildTodayProtocol() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.cyan.withValues(alpha: 0.25)),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.cyan.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.bolt, color: AppColors.cyan, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'TODAY\'S PROTOCOL',
                  style: TextStyle(
                    color: AppColors.cyan,
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _todayProtocol,
                  style: const TextStyle(
                    color: AppColors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  _protocolSub,
                  style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionLabel(String label) {
    return Text(
      label,
      style: const TextStyle(
        color: AppColors.textMuted,
        fontSize: 10,
        fontWeight: FontWeight.w700,
        letterSpacing: 2,
      ),
    );
  }

  Widget _buildMuscleChips() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: _muscleGroups.map((g) {
          final isActive = _selectedMuscle == g;
          return GestureDetector(
            onTap: () => setState(() {
              _selectedMuscle = g;
              _doneIds.clear();
            }),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              margin: const EdgeInsets.only(right: 8),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: isActive ? AppColors.cyan : AppColors.surface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isActive ? AppColors.cyan : AppColors.white12,
                ),
                boxShadow: isActive
                    ? [BoxShadow(color: AppColors.cyanGlow, blurRadius: 10)]
                    : [],
              ),
              child: Text(
                g,
                style: TextStyle(
                  color:
                      isActive ? AppColors.background : AppColors.textSecondary,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildDifficultyChips() {
    final diffs = [
      (Difficulty.all, 'All'),
      (Difficulty.beginner, 'Beginner'),
      (Difficulty.intermediate, 'Intermediate'),
      (Difficulty.advanced, 'Advanced'),
    ];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: diffs.map((d) {
          final isActive = _selectedDiff == d.$1;
          Color activeColor = AppColors.cyan;
          if (d.$1 == Difficulty.beginner)
            activeColor = const Color(0xFF00FF88);
          if (d.$1 == Difficulty.advanced)
            activeColor = const Color(0xFFFF6400);
          return GestureDetector(
            onTap: () => setState(() {
              _selectedDiff = d.$1;
              _doneIds.clear();
            }),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              margin: const EdgeInsets.only(right: 8),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: isActive
                    ? activeColor.withValues(alpha: 0.15)
                    : AppColors.surface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isActive ? activeColor : AppColors.white12,
                ),
              ),
              child: Text(
                d.$2,
                style: TextStyle(
                  color: isActive ? activeColor : AppColors.textSecondary,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildEmpty() {
    return Container(
      padding: const EdgeInsets.all(32),
      child: const Center(
        child: Text(
          'No exercises found for this combination.\nTry a different filter.',
          textAlign: TextAlign.center,
          style:
              TextStyle(color: AppColors.textMuted, fontSize: 13, height: 1.7),
        ),
      ),
    );
  }

  Widget _buildLoggedWorkouts() {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'LOGGED ENTRIES',
          style: TextStyle(
            color: AppColors.textMuted,
            fontSize: 10,
            fontWeight: FontWeight.w700,
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 10),
        StreamBuilder<QuerySnapshot>(
          stream: FirebaseFirestore.instance
              .collection('users')
              .doc(user.uid)
              .collection('workouts')
              .orderBy('timestamp', descending: true)
              .snapshots(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: AppColors.cyan,
                  ),
                ),
              );
            }
            if (snapshot.hasError) {
              return Center(
                child: Text(
                  'Error: ${snapshot.error}',
                  style: const TextStyle(color: AppColors.textMuted),
                ),
              );
            }
            if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
              return Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.white06),
                ),
                child: const Center(
                  child: Text(
                    'No logged workouts yet. Tap + to add one.',
                    style: TextStyle(color: AppColors.textMuted, fontSize: 12),
                  ),
                ),
              );
            }

            final docs = snapshot.data!.docs;
            return Column(
              children: docs.map((doc) {
                final data = doc.data() as Map<String, dynamic>;
                return Dismissible(
                  key: Key(doc.id),
                  direction: DismissDirection.endToStart,
                  background: Container(
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.only(right: 20),
                    margin: const EdgeInsets.only(bottom: 8),
                    decoration: BoxDecoration(
                      color: Colors.red.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                      border:
                          Border.all(color: Colors.red.withValues(alpha: 0.3)),
                    ),
                    child: const Icon(Icons.delete_outline,
                        color: Colors.red, size: 24),
                  ),
                  confirmDismiss: (direction) async {
                    return await showDialog<bool>(
                      context: context,
                      builder: (context) => AlertDialog(
                        backgroundColor: AppColors.surface,
                        title: const Text('Delete Entry',
                            style: TextStyle(color: AppColors.white)),
                        content: const Text(
                            'Are you sure you want to delete this workout?',
                            style: TextStyle(color: AppColors.textMuted)),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context, false),
                            child: const Text('Cancel',
                                style: TextStyle(color: AppColors.textMuted)),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pop(context, true),
                            child: const Text('Delete',
                                style: TextStyle(color: Colors.red)),
                          ),
                        ],
                      ),
                    );
                  },
                  onDismissed: (direction) {
                    FirebaseFirestore.instance
                        .collection('users')
                        .doc(user.uid)
                        .collection('workouts')
                        .doc(doc.id)
                        .delete();
                  },
                  child: _buildLoggedWorkoutCard(data),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }

  Widget _buildLoggedWorkoutCard(Map<String, dynamic> data) {
    final activity = data['activity'] ?? 'Unknown';
    final duration = data['duration_min'] ?? 0;
    final intensity = data['intensity'] ?? '';
    final sets = data['sets'];
    final reps = data['reps'];
    final weight = data['weight_kg'];

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.cyan.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppColors.cyan.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Icon(Icons.fitness_center,
                    color: AppColors.cyan, size: 16),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  activity,
                  style: const TextStyle(
                    color: AppColors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              if (intensity.isNotEmpty)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: intensity == 'High'
                        ? Colors.orange.withValues(alpha: 0.15)
                        : AppColors.success.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    intensity,
                    style: TextStyle(
                      color: intensity == 'High'
                          ? Colors.orange
                          : AppColors.success,
                      fontSize: 9,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              if (duration > 0) _miniStat('${duration}m', 'DURATION'),
              if (sets != null) _miniStat('$sets', 'SETS'),
              if (reps != null) _miniStat('$reps', 'REPS'),
              if (weight != null) _miniStat('${weight}kg', 'WEIGHT'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _miniStat(String value, String label) {
    return Padding(
      padding: const EdgeInsets.only(right: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: const TextStyle(
              color: AppColors.white,
              fontSize: 14,
              fontWeight: FontWeight.w800,
            ),
          ),
          Text(
            label,
            style: const TextStyle(
              color: AppColors.textMuted,
              fontSize: 8,
              fontWeight: FontWeight.w600,
              letterSpacing: 1,
            ),
          ),
        ],
      ),
    );
  }
}

class _ModeTab extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _ModeTab({
    required this.icon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          margin: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: isActive ? AppColors.cyan : Colors.transparent,
            borderRadius: BorderRadius.circular(9),
            boxShadow: isActive
                ? [BoxShadow(color: AppColors.cyanGlow, blurRadius: 12)]
                : [],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 16,
                color: isActive ? AppColors.background : AppColors.textMuted,
              ),
              const SizedBox(width: 6),
              Text(
                label,
                style: TextStyle(
                  color: isActive ? AppColors.background : AppColors.textMuted,
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _WorkoutCard extends StatelessWidget {
  final WorkoutExercise exercise;
  final bool isDone;
  final VoidCallback onToggle;

  const _WorkoutCard({
    required this.exercise,
    required this.isDone,
    required this.onToggle,
  });

  Color get _diffColor {
    switch (exercise.difficulty) {
      case Difficulty.beginner:
        return const Color(0xFF00FF88);
      case Difficulty.intermediate:
        return AppColors.cyan;
      case Difficulty.advanced:
        return const Color(0xFFFF6400);
      default:
        return AppColors.cyan;
    }
  }

  String get _diffLabel {
    switch (exercise.difficulty) {
      case Difficulty.beginner:
        return 'Beginner';
      case Difficulty.intermediate:
        return 'Intermediate';
      case Difficulty.advanced:
        return 'Advanced';
      default:
        return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isDone
              ? const Color(0xFF00FF88).withValues(alpha: 0.4)
              : AppColors.white06,
          width: isDone ? 1.5 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(
                  exercise.name,
                  style: const TextStyle(
                    color: AppColors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: _diffColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: _diffColor.withValues(alpha: 0.3)),
                ),
                child: Text(
                  _diffLabel,
                  style: TextStyle(
                    color: _diffColor,
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              _StatCol(label: 'SETS', value: '${exercise.sets}'),
              _StatDivider(),
              _StatCol(label: 'REPS', value: exercise.reps),
              _StatDivider(),
              _StatCol(label: 'WEIGHT', value: exercise.weight),
              _StatDivider(),
              _StatCol(label: 'REST', value: '${exercise.restSeconds}s'),
              const Spacer(),
              GestureDetector(
                onTap: onToggle,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color:
                        isDone ? const Color(0xFF00FF88) : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color:
                          isDone ? const Color(0xFF00FF88) : AppColors.white30,
                    ),
                    boxShadow: isDone
                        ? [
                            BoxShadow(
                                color: const Color(0xFF00FF88)
                                    .withValues(alpha: 0.3),
                                blurRadius: 8)
                          ]
                        : [],
                  ),
                  child: Icon(
                    Icons.check,
                    color: isDone ? AppColors.background : AppColors.white30,
                    size: 16,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(2),
            child: LinearProgressIndicator(
              value: isDone ? 1.0 : 0.0,
              backgroundColor: AppColors.white12,
              valueColor: AlwaysStoppedAnimation<Color>(
                isDone ? const Color(0xFF00FF88) : AppColors.cyan,
              ),
              minHeight: 3,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.lightbulb_outline,
                  color: AppColors.cyan, size: 13),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  exercise.formTip,
                  style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 11,
                    fontStyle: FontStyle.italic,
                    height: 1.5,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatCol extends StatelessWidget {
  final String label;
  final String value;

  const _StatCol({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textMuted,
            fontSize: 9,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(height: 3),
        Text(
          value,
          style: const TextStyle(
            color: AppColors.white,
            fontSize: 18,
            fontWeight: FontWeight.w900,
            letterSpacing: -0.5,
          ),
        ),
      ],
    );
  }
}

class _StatDivider extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 1,
      height: 28,
      margin: const EdgeInsets.symmetric(horizontal: 14),
      color: AppColors.white06,
    );
  }
}

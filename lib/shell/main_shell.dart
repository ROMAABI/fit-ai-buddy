import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:curved_navigation_bar/curved_navigation_bar.dart';
import '../core/theme.dart';
import '../screens/dashboard/dashboard_screen.dart';
import '../screens/workout/workout_screen.dart';
import '../screens/workout/add_workout_screen.dart';
import '../screens/nutrition/nutrition_screen.dart';
import '../screens/nutrition/add_nutrition_screen.dart';
import '../screens/expense/expense_screen.dart';
import '../screens/expense/add_expense_screen.dart';
import '../screens/ai_chat/ai_chat_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;
  late final PageController _pageController;

  // Order: Dashboard(0), Workout(1), AI Buddy(2), Nutrition(3), Expense(4)
  final List<Widget> _screens = const [
    DashboardScreen(),
    WorkoutScreen(),
    AiChatScreen(),
    NutritionScreen(),
    ExpenseScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onPageChanged(int index) {
    setState(() => _currentIndex = index);
  }

  void _onNavTap(int index) {
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
    setState(() => _currentIndex = index);
  }

  void _openFAB() {
    Widget screen;
    switch (_currentIndex) {
      case 1:
        screen = const AddWorkoutScreen();
        break;
      case 3:
        screen = const AddNutritionScreen();
        break;
      case 4:
        screen = const AddExpenseScreen();
        break;
      default:
        return;
    }
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => screen),
    );
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppColors.background,
      systemNavigationBarIconBrightness: Brightness.light,
    ));

    final showAddFAB =
        _currentIndex == 1 || _currentIndex == 3 || _currentIndex == 4;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          PageView(
            controller: _pageController,
            onPageChanged: _onPageChanged,
            children: _screens,
          ),
          if (showAddFAB)
            Positioned(
              right: 16,
              bottom: 80,
              child: GestureDetector(
                onTap: _openFAB,
                child: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: AppColors.cyan,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: const [
                      BoxShadow(color: AppColors.cyanGlow, blurRadius: 16)
                    ],
                  ),
                  child: const Icon(Icons.add,
                      color: AppColors.background, size: 22),
                ),
              ),
            ),
        ],
      ),
      bottomNavigationBar: CurvedNavigationBar(
        backgroundColor: AppColors.background,
        color: AppColors.surface,
        buttonBackgroundColor: AppColors.cyan,
        height: 68,
        animationDuration: const Duration(milliseconds: 150),
        items: <Widget>[
          Icon(Icons.home_rounded, size: 30, color: AppColors.white),
          Icon(Icons.fitness_center_rounded, size: 30, color: AppColors.white),
          Icon(Icons.psychology_rounded, size: 30, color: AppColors.white),
          Icon(Icons.restaurant_rounded, size: 30, color: AppColors.white),
          Icon(Icons.payments_rounded, size: 30, color: AppColors.white),
        ],
        onTap: (index) {
          _onNavTap(index);
        },
      ),
    );
  }
}

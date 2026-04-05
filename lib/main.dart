import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'core/theme.dart';
import 'core/auth_service.dart';
import 'core/user_data.dart';
import 'onboarding/onboarding_flow.dart';
import 'shell/main_shell.dart';
import 'screens/auth/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);

  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
  } catch (e) {
    // Firebase initialization failed, continue without it
  }

  runApp(const FitAiBuddyApp());
}

class FitAiBuddyApp extends StatelessWidget {
  const FitAiBuddyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FIT AI BUDDY',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark,
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final AuthService _authService = AuthService();

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    await _authService.init();

    if (!mounted) return;

    // If onboarding is marked complete locally, go straight to dashboard
    if (_authService.isOnboardingComplete) {
      _loadUserData();
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const MainShell()),
      );
      return;
    }

    if (_authService.isLoggedIn) {
      final hasProfile = await _authService.checkUserProfileExists();

      if (!mounted) return;

      if (hasProfile) {
        _loadUserData();
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const MainShell()),
        );
      } else {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => const OnboardingFlow(),
          ),
        );
      }
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    }
  }

  void _loadUserData() {
    final profile = _authService.userProfile;
    if (profile != null) {
      UserData().name = profile['name'] ?? 'User';
      UserData().email = profile['email'] ?? '';
      UserData().sex = profile['sex'] ?? 'Male';
      UserData().age = profile['age'] ?? 25;
      UserData().weight = (profile['weight'] ?? 70.0).toDouble();
      UserData().height = profile['height'] ?? 175;
      UserData().trainingDaysPerWeek = profile['trainingDaysPerWeek'] ?? 5;
      UserData().firstDayOfWeek = profile['firstDayOfWeek'] ?? 'SUNDAY';
      UserData().objective = profile['objective'] ?? 'Build Muscle';
      UserData().fitnessLevel = profile['fitnessLevel'] ?? 'Intermediate';
      UserData().photoUrl = profile['photoUrl'] ?? '';

      final name = UserData().name;
      UserData().initials = name.length >= 2
          ? name.substring(0, 2).toUpperCase()
          : name.toUpperCase();
    }

    // Also get photo from Google Sign-In
    final googleUser = _authService.currentUser;
    if (googleUser != null && googleUser.photoUrl != null) {
      UserData().photoUrl = googleUser.photoUrl!;
    }
  }

  void _onOnboardingComplete() async {
    debugPrint('SplashScreen: _onOnboardingComplete called');
    await _authService.markOnboardingComplete();
    debugPrint('SplashScreen: onboarding marked complete');

    if (!mounted) {
      debugPrint('SplashScreen: NOT mounted, skipping navigation');
      return;
    }

    debugPrint('SplashScreen: navigating to MainShell');
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const MainShell()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: AppColors.cyan),
            SizedBox(height: 20),
            Text(
              'FIT AI BUDDY',
              style: TextStyle(
                color: AppColors.white,
                fontSize: 20,
                fontWeight: FontWeight.w800,
                letterSpacing: 2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

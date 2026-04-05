import 'dart:io' show Platform;
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import '../../core/theme.dart';
import '../../core/auth_service.dart';
import '../../core/user_data.dart';
import '../../onboarding/onboarding_flow.dart';
import '../../shell/main_shell.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final AuthService _authService = AuthService();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _showEmailAuth = false;
  bool _obscurePassword = true;

  bool get _isDesktop =>
      !kIsWeb && (Platform.isLinux || Platform.isWindows || Platform.isMacOS);

  @override
  void initState() {
    super.initState();
    if (_isDesktop) {
      _showEmailAuth = true;
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleGoogleSignIn() async {
    setState(() => _isLoading = true);
    debugPrint('Login button pressed');

    try {
      final account = await _authService.signInWithGoogle();
      debugPrint('Account received: $account');
      debugPrint('Mounted: $mounted');

      if (account != null && mounted) {
        debugPrint('Calling onLoginSuccess');
        _onLoginSuccess();
      } else {
        debugPrint(
            'Not calling onLoginSuccess - account: $account, mounted: $mounted');
      }
    } catch (e) {
      final errorStr = e.toString().toLowerCase();
      debugPrint('Login error: $e');
      if (mounted &&
          !errorStr.contains('popup_closed') &&
          !errorStr.contains('closed')) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Sign in cancelled or failed. Please try again.')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _handleEmailAuth() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all fields')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      await _authService.signInWithEmailPassword(email, password);

      if (mounted) {
        _onLoginSuccess();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _onLoginSuccess() async {
    debugPrint('Login success callback triggered');
    if (!mounted) return;

    bool hasProfile = false;
    try {
      hasProfile = await _authService
          .checkUserProfileExists()
          .timeout(const Duration(seconds: 5), onTimeout: () {
        debugPrint('Profile check timed out, treating as new user');
        return false;
      });
    } catch (e) {
      debugPrint('Error checking profile: $e');
      hasProfile = false;
    }
    debugPrint('Has profile: $hasProfile');

    if (!mounted) return;

    if (hasProfile) {
      debugPrint('Navigating to Dashboard');
      _loadUserData();
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const MainShell()),
      );
    } else {
      debugPrint('Navigating to Onboarding');
      final googleUser = _authService.currentUser;
      if (googleUser != null) {
        UserData().name = googleUser.displayName ?? 'User';
        UserData().email = googleUser.email;
        UserData().photoUrl = googleUser.photoUrl ?? '';
      } else {
        UserData().email = _emailController.text.trim();
        UserData().name = 'User';
      }

      final name = UserData().name;
      UserData().initials = name.length >= 2
          ? name.substring(0, 2).toUpperCase()
          : name.toUpperCase();

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => OnboardingFlow(onComplete: _onOnboardingComplete),
        ),
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

    final googleUser = _authService.currentUser;
    if (googleUser != null && googleUser.photoUrl != null) {
      UserData().photoUrl = googleUser.photoUrl!;
      UserData().name = googleUser.displayName ?? UserData().name;
      UserData().email = googleUser.email;

      final name = UserData().name;
      UserData().initials = name.length >= 2
          ? name.substring(0, 2).toUpperCase()
          : name.toUpperCase();
    }
  }

  void _onOnboardingComplete() async {
    await _authService.markOnboardingComplete();

    if (!mounted) return;

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const MainShell()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              padding: EdgeInsets.only(
                left: 32,
                right: 32,
                top: 24,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight: constraints.maxHeight - 48,
                ),
                child: IntrinsicHeight(
                  child: Column(
                    children: [
                      const SizedBox(height: 40),
                      _buildLogo(),
                      const SizedBox(height: 24),
                      _buildTitle(),
                      const SizedBox(height: 8),
                      _buildSubtitle(),
                      const SizedBox(height: 40),
                      _buildEmailForm(),
                      if (!_isDesktop) ...[
                        const SizedBox(height: 16),
                        Row(
                          children: const [
                            Expanded(child: Divider(color: AppColors.white12)),
                            Padding(
                              padding: EdgeInsets.symmetric(horizontal: 16),
                              child: Text('OR',
                                  style: TextStyle(
                                      color: AppColors.textMuted,
                                      fontSize: 12)),
                            ),
                            Expanded(child: Divider(color: AppColors.white12)),
                          ],
                        ),
                        const SizedBox(height: 16),
                        _buildGoogleButton(),
                      ],
                      const SizedBox(height: 20),
                      _buildTerms(),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildLogo() {
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        color: AppColors.cyan.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cyan.withValues(alpha: 0.3)),
      ),
      child: Image.asset(
        'assets/icon/icon_triple.png',
        width: 60,
        height: 60,
      ),
    );
  }

  Widget _buildTitle() {
    return const Text(
      'FIT AI BUDDY',
      style: TextStyle(
        color: AppColors.white,
        fontSize: 28,
        fontWeight: FontWeight.w900,
        letterSpacing: 2,
      ),
    );
  }

  Widget _buildSubtitle() {
    return const Text(
      'Your AI-powered fitness companion',
      style: TextStyle(
        color: AppColors.textMuted,
        fontSize: 14,
        height: 1.5,
      ),
    );
  }

  Widget _buildEmailForm() {
    return Column(
      children: [
        Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.white12),
          ),
          child: TextField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            style: const TextStyle(color: AppColors.white, fontSize: 14),
            decoration: const InputDecoration(
              hintText: 'Email',
              hintStyle: TextStyle(color: AppColors.textDisabled, fontSize: 14),
              prefixIcon: Icon(Icons.email_outlined,
                  color: AppColors.textMuted, size: 20),
              border: InputBorder.none,
              contentPadding:
                  EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.white12),
          ),
          child: TextField(
            controller: _passwordController,
            obscureText: _obscurePassword,
            style: const TextStyle(color: AppColors.white, fontSize: 14),
            decoration: InputDecoration(
              hintText: 'Password',
              hintStyle:
                  const TextStyle(color: AppColors.textDisabled, fontSize: 14),
              prefixIcon: const Icon(Icons.lock_outline,
                  color: AppColors.textMuted, size: 20),
              suffixIcon: GestureDetector(
                onTap: () =>
                    setState(() => _obscurePassword = !_obscurePassword),
                child: Icon(
                  _obscurePassword ? Icons.visibility_off : Icons.visibility,
                  color: AppColors.textMuted,
                  size: 20,
                ),
              ),
              border: InputBorder.none,
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
          ),
        ),
        const SizedBox(height: 16),
        GestureDetector(
          onTap: _isLoading ? null : _handleEmailAuth,
          child: Container(
            width: double.infinity,
            height: 54,
            decoration: BoxDecoration(
              color: AppColors.cyan,
              borderRadius: BorderRadius.circular(12),
              boxShadow: const [
                BoxShadow(color: AppColors.cyanGlow, blurRadius: 12),
              ],
            ),
            child: Center(
              child: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: AppColors.background,
                      ),
                    )
                  : const Text(
                      'Sign In',
                      style: TextStyle(
                        color: AppColors.background,
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildGoogleButton() {
    return GestureDetector(
      onTap: _isLoading ? null : _handleGoogleSignIn,
      child: Container(
        width: double.infinity,
        height: 54,
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (_isLoading)
              const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor:
                      AlwaysStoppedAnimation<Color>(AppColors.background),
                ),
              )
            else ...[
              const Icon(
                Icons.g_mobiledata,
                size: 28,
                color: AppColors.background,
              ),
              const SizedBox(width: 12),
            ],
            Text(
              _isLoading ? 'Signing in...' : 'Continue with Google',
              style: const TextStyle(
                color: AppColors.background,
                fontSize: 15,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTerms() {
    return const Text(
      'By continuing, you agree to our\nTerms of Service & Privacy Policy',
      textAlign: TextAlign.center,
      style: TextStyle(
        color: AppColors.textDisabled,
        fontSize: 11,
        height: 1.5,
      ),
    );
  }
}

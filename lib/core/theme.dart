import 'package:flutter/material.dart';

class AppColors {
  static const background = Color(0xFF0A0A0F);
  static const surface = Color(0xFF111118);
  static const surfaceElevated = Color(0xFF1A1A24);
  static const surfaceBorder = Color(0xFF252530);

  static const cyan = Color(0xFF00E5FF);
  static const cyanDim = Color(0xFF00B8CC);
  static const cyanGlow = Color(0x3300E5FF);
  static const cyanSubtle = Color(0x1100E5FF);

  static const white = Colors.white;
  static const white70 = Color(0xB3FFFFFF);
  static const white50 = Color(0x80FFFFFF);
  static const white30 = Color(0x4DFFFFFF);
  static const white12 = Color(0x1FFFFFFF);
  static const white06 = Color(0x0FFFFFFF);

  static const textPrimary = Colors.white;
  static const textSecondary = Color(0xB3FFFFFF);
  static const textMuted = Color(0x80FFFFFF);
  static const textDisabled = Color(0x4DFFFFFF);

  static const success = Color(0xFF00FF88);
  static const warning = Color(0xFFFFAA00);
  static const error = Color(0xFFFF4466);
}

class AppTextStyles {
  static const _base = TextStyle(color: AppColors.textPrimary);

  static final displayLarge = _base.copyWith(
    fontSize: 36,
    fontWeight: FontWeight.w900,
    letterSpacing: 0.5,
    height: 1.1,
  );

  static final displayMedium = _base.copyWith(
    fontSize: 28,
    fontWeight: FontWeight.w900,
    letterSpacing: 0.3,
    height: 1.15,
  );

  static final headlineLarge = _base.copyWith(
    fontSize: 22,
    fontWeight: FontWeight.w800,
    letterSpacing: 0.2,
  );

  static final headlineMedium = _base.copyWith(
    fontSize: 18,
    fontWeight: FontWeight.w700,
  );

  static final headlineSmall = _base.copyWith(
    fontSize: 15,
    fontWeight: FontWeight.w700,
    letterSpacing: 0.2,
  );

  static final bodyLarge = _base.copyWith(
    fontSize: 14,
    color: AppColors.textSecondary,
    height: 1.6,
  );

  static final bodyMedium = _base.copyWith(
    fontSize: 13,
    color: AppColors.textSecondary,
    height: 1.5,
  );

  static final bodySmall = _base.copyWith(
    fontSize: 11,
    color: AppColors.textMuted,
    height: 1.4,
  );

  static final labelLarge = _base.copyWith(
    fontSize: 12,
    fontWeight: FontWeight.w700,
    letterSpacing: 1.8,
    color: AppColors.textMuted,
  );

  static final labelMedium = _base.copyWith(
    fontSize: 10,
    fontWeight: FontWeight.w700,
    letterSpacing: 2.0,
    color: AppColors.textMuted,
  );

  static final labelCyan = _base.copyWith(
    fontSize: 11,
    fontWeight: FontWeight.w700,
    letterSpacing: 2.0,
    color: AppColors.cyan,
  );

  static final numberLarge = _base.copyWith(
    fontSize: 52,
    fontWeight: FontWeight.w900,
    letterSpacing: -1,
    color: AppColors.cyan,
  );

  static final numberMedium = _base.copyWith(
    fontSize: 32,
    fontWeight: FontWeight.w900,
    letterSpacing: -0.5,
  );
}

class AppTheme {
  static ThemeData get dark {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.cyan,
        surface: AppColors.surface,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
    );
  }
}

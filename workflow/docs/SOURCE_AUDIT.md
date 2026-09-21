# Source Audit — Fit AI Buddy

Audit of `ROMAABI/fit-ai-buddy` Flutter source repository before migration to Expo React Native.

## Files read

All 32 Dart source files under `lib/**/*.dart`:

1. `lib/main.dart` — App entrypoint, `FitAiBuddyApp`, and `SplashScreen` with 4-step routing logic.
2. `lib/firebase_options.dart` — Multi-platform Firebase configuration options (web, android, ios).
3. `lib/core/auth_service.dart` — Singleton `AuthService`, Firebase Auth, Google Sign-In, profile checking in Firestore, `_keyOnboardingComplete` in SharedPreferences.
4. `lib/core/constants.dart` — App metadata, API keys, AI provider config (`groq`, `gemini`, `ollama`), UI spacing/radii constants.
5. `lib/core/firestore_service.dart` — Singleton `FirestoreService`, CRUD streams and add methods for workouts, nutrition, expenses, and user profile.
6. `lib/core/theme.dart` — `AppColors`, `AppTextStyles`, and `AppTheme.dark`.
7. `lib/core/user_data.dart` — Singleton `UserData` with SharedPreferences persistence for profile fields.
8. `lib/widgets/circular_progress_ring.dart` — `CircularProgressRing` and custom `_RingPainter`.
9. `lib/widgets/cyber_button.dart` — `CyberButton`, `DashedBorderButton`, and `_DashedBorderPainter`.
10. `lib/widgets/stat_card.dart` — `StatCard` with label, value, unit, and colored bottom accent bar.
11. `lib/shell/main_shell.dart` — `MainShell` stateful widget with `CurvedNavigationBar` (5 tabs) and floating action button (+).
12. `lib/onboarding/onboarding_flow.dart` — `PageView` holding 7 onboarding steps, completion trigger saving to `AuthService` and `UserData`.
13. `lib/onboarding/step1_sex.dart` — Step 1: Biological sex selection (Male / Female).
14. `lib/onboarding/step1b_name.dart` — Step 1b: User name entry, generates 2-letter uppercase initials.
15. `lib/onboarding/step2_goal.dart` — Step 2: Training days per week (1-7) & First day of week picker.
16. `lib/onboarding/step3_objective.dart` — Step 3: Primary objective ('Lose Weight', 'Build Muscle', 'Keep Fit').
17. `lib/onboarding/step4_fitness.dart` — Step 4: Fitness level ('Beginner', 'Intermediate', 'Advanced').
18. `lib/onboarding/calibration_screen.dart` — Step 5/6: Weight (kg/lbs), Height (cm/ft), Age (years) with ruler drag, saves to Firebase users/{uid}.
19. `lib/onboarding/plan_confirmed_screen.dart` — Step 7: "28 DAYS FULL BODY CHALLENGE", triggers `onStartNow` and finishes onboarding.
20. `lib/screens/auth/login_screen.dart` — Email/Password sign in & Google Sign-In, routes to Onboarding or MainShell based on profile existence.
21. `lib/screens/dashboard/dashboard_screen.dart` — Dashboard with period filter (daily, weekly, monthly, yearly), 4 stat cards, BarChart for workouts, LineChart for calories, PieChart for expenses.
22. `lib/screens/dashboard/notification_screen.dart` — Chronological log of recent workouts, meals, and expenses.
23. `lib/screens/workout/workout_screen.dart` — Home vs Gym toggle, muscle group filters, difficulty filters, complete exercise catalog, card checkbox logging to Firestore, logged workouts list.
24. `lib/screens/workout/add_workout_screen.dart` — AI Workout Logger: raw text to structured JSON object via Groq/Gemini/Ollama, saves to Firestore `workouts`.
25. `lib/screens/workout/add_session_screen.dart` — Manual protocol builder: session name, time pickers, category, neural priority slider, notes.
26. `lib/screens/nutrition/nutrition_screen.dart` — Daily calorie progress bar vs 2400 kcal target, protein/carbs/fats macro bars, logged meals list.
27. `lib/screens/nutrition/add_nutrition_screen.dart` — AI Nutrition Logger: raw text to structured JSON object with macro estimations, saves to Firestore `nutrition`.
28. `lib/screens/expense/expense_screen.dart` — Monthly expense total, 6-month trend bar chart, category breakdown, logged expenses list.
29. `lib/screens/expense/add_expense_screen.dart` — AI Expense Logger: raw text to structured JSON object with category auto-tagging, saves to Firestore `expenses`.
30. `lib/screens/profile/profile_screen.dart` — Profile card with initials avatar, active protocol details, edit profile modal, initials editor.
31. `lib/screens/add_note_screen.dart` — Quick Add: multi-purpose AI logger that parses text into an array of workouts, nutrition, and expense entries.
32. `lib/screens/ai_chat/ai_chat_screen.dart` — AI Buddy chat with full user profile context injection, Groq/Gemini APIs, voice-to-text, image/file attachments, action block parsing.

## Routes Mapping

| Flutter route/screen | Target route | Notes |
|---|---|---|
| `SplashScreen` (`lib/main.dart`) | `app/index.tsx` | Splash with 4-step routing |
| `LoginScreen` (`lib/screens/auth/login_screen.dart`) | `app/login.tsx` | Email/Pass & Google auth |
| `OnboardingFlow` (`lib/onboarding/onboarding_flow.dart`) | `app/onboarding/` | 7-step sequence |
| `MainShell` (`lib/shell/main_shell.dart`) | `app/(tabs)/_layout.tsx` | 5 tabs with custom nav bar |
| `DashboardScreen` (`lib/screens/dashboard/dashboard_screen.dart`) | `app/(tabs)/dashboard.tsx` | Analytics & charts |
| `WorkoutScreen` (`lib/screens/workout/workout_screen.dart`) | `app/(tabs)/workout.tsx` | Exercise database & checklist |
| `AiChatScreen` (`lib/screens/ai_chat/ai_chat_screen.dart`) | `app/(tabs)/ai-chat.tsx` | AI Coach chat |
| `NutritionScreen` (`lib/screens/nutrition/nutrition_screen.dart`) | `app/(tabs)/nutrition.tsx` | Calorie & macro tracking |
| `ExpenseScreen` (`lib/screens/expense/expense_screen.dart`) | `app/(tabs)/expense.tsx` | Fitness expenses |
| `ProfileScreen` (`lib/screens/profile/profile_screen.dart`) | `app/profile.tsx` | Profile management |
| `NotificationScreen` (`lib/screens/dashboard/notification_screen.dart`) | `app/notifications.tsx` | Activity feed |
| `AddWorkoutScreen` (`lib/screens/workout/add_workout_screen.dart`) | `app/workout/add-workout.tsx` | AI workout logger |
| `AddSessionScreen` (`lib/screens/workout/add_session_screen.dart`) | `app/workout/add-session.tsx` | Manual session logger |
| `AddNutritionScreen` (`lib/screens/nutrition/add_nutrition_screen.dart`) | `app/nutrition/add.tsx` | AI nutrition logger |
| `AddExpenseScreen` (`lib/screens/expense/add_expense_screen.dart`) | `app/expense/add.tsx` | AI expense logger |
| `AddNoteScreen` (`lib/screens/add_note_screen.dart`) | `app/quick-add.tsx` | Multi-category AI quick add |

## Services Mapping

| Dart service | TS service | Behavior |
|---|---|---|
| `AuthService` | `src/services/auth.ts` | Session restoration, login, signup, Google auth, profile check |
| `FirestoreService` | `src/services/firestore.ts` | Typed Firestore collection operations |
| `UserData` | `src/store/userStore.ts` | Zustand store with AsyncStorage persistence |
| AI API calls | `src/services/ai.ts` | Isolated Groq & Gemini client functions |

## Firestore Collections & Schema

| Path | Read | Write | Fields |
|---|---|---|---|
| `users/{uid}` | Yes | Yes | `name`, `email`, `sex`, `age`, `weight`, `height`, `trainingDaysPerWeek`, `firstDayOfWeek`, `objective`, `fitnessLevel`, `photoUrl`, `updatedAt` |
| `users/{uid}/workouts` | Yes | Yes | `activity` / `name`, `duration_min` / `duration`, `intensity`, `sets`, `reps`, `weight_kg`, `notes`, `source`, `category`, `date`, `priority`, `timestamp` / `createdAt` |
| `users/{uid}/nutrition` | Yes | Yes | `meal` / `name`, `calories`, `protein_g` / `protein`, `carbs_g` / `carbs`, `fats_g` / `fats`, `notes`, `timestamp` / `createdAt` |
| `users/{uid}/expenses` | Yes | Yes | `item` / `vendor`, `amount`, `currency`, `category`, `notes`, `date`, `timestamp` / `createdAt` |

## AI Configuration

| Provider | Dart implementation | Target implementation |
|---|---|---|
| **Groq** | `http.post` to `api.groq.com/openai/v1/chat/completions` with `llama-3.3-70b-versatile` | `fetch` to Groq API using `EXPO_PUBLIC_GROQ_API_KEY` |
| **Gemini** | `google_generative_ai` package (`gemini-2.0-flash` / `gemini-1.5-flash`) | `@google/generative-ai` package using `EXPO_PUBLIC_GEMINI_API_KEY` |
| **Prompt** | Dynamic prompt with user profile interpolation & action block format | Recreated identically in `src/services/ai.ts` |

## Shared Widgets Mapping

| Flutter widget | React Native component |
|---|---|
| `CyberButton` | `src/components/CyberButton.tsx` |
| `CircularProgressRing` | `src/components/CircularProgressRing.tsx` |
| `StatCard` | `src/components/StatCard.tsx` |

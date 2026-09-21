# Fit AI Buddy — Flutter → React Native Migration Package

## Mission

Migrate `ROMAABI/fit-ai-buddy` from Flutter 3 / Dart to Expo React Native + TypeScript.

**Source:** https://github.com/ROMAABI/fit-ai-buddy  
**Branch:** `main`

The migration must preserve existing business logic and the existing Firestore schema while replacing the Flutter UI/runtime with Expo React Native.

## Critical rule

Before writing migration code, clone the Flutter repository and read **every file under `lib/**/*.dart`**.

```bash
git clone --depth 1 --branch main https://github.com/ROMAABI/fit-ai-buddy /tmp/fit-ai-buddy-src
find /tmp/fit-ai-buddy-src/lib -type f -name '*.dart' | sort
```

Read all Dart source files before implementation. Do not infer missing behavior.

## UI direction

Read `UI.md` before implementing any screen. The target is professional, minimal, premium, subtle 3D and dark — explicitly **not cyberpunk**. Avoid neon glow, HUD styling, glitch effects, futuristic decoration, and excessive gradients.

## Target stack

- Expo React Native
- TypeScript, strict mode
- Expo Router
- Zustand
- AsyncStorage
- Firebase JS SDK
- `@google/generative-ai`
- Groq through `fetch`
- `.env` / Expo public environment configuration; never hardcode API keys
- NativeWind
- `victory-native` or `gifted-charts`
- `expo-image-picker`
- `expo-document-picker`
- Expo-compatible speech/voice implementation
- Expo-compatible navigation and UI primitives

## Required architecture mapping

| Flutter | React Native |
|---|---|
| `lib/main.dart` | `app/_layout.tsx` |
| `core/auth_service.dart` | `src/services/auth.ts` |
| `firestore_service.dart` | `src/services/firestore.ts` |
| `user_data.dart` | `src/store/userStore.ts` |
| theme/constants | `src/theme/` |
| `firebase_options.dart` | `src/config/firebase.ts` |
| `onboarding/` | `app/onboarding/` |
| `shell/main_shell.dart` | `app/(tabs)/_layout.tsx` |
| `auth/login` | `app/login.tsx` |
| dashboard | `app/(tabs)/dashboard.tsx` |
| workout | `app/(tabs)/workout.tsx` |
| AI chat | `app/(tabs)/ai-chat.tsx` |
| nutrition | `app/(tabs)/nutrition.tsx` |
| expense | `app/(tabs)/expense.tsx` |
| profile | `app/(tabs)/profile.tsx` |
| add_note | notes route/screen |
| `widgets/` | `src/components/` |

## Firestore schema — MUST NOT CHANGE

```text
users/{uid}
{
  name,
  email,
  sex,
  age,
  weight,
  height,
  trainingDaysPerWeek,
  firstDayOfWeek,
  objective,
  fitnessLevel,
  photoUrl
}
```

Read the Dart implementation to determine exact field types, defaults, validation, serialization and update behavior.

## Required splash routing

Preserve the existing routing behavior exactly:

1. If onboarding is complete → MainShell.
2. Else if logged in and profile has `age`, `weight`, and `height` → MainShell.
3. Else if logged in → Onboarding.
4. Else → Login.

Do not change this order unless the Dart source proves the original implementation differs.

## Required AI behavior

Preserve:

- chat history/memory
- user profile context
- profile information in the system prompt
- Gemini integration
- Groq integration
- voice input
- image input

Secrets must never be committed or hardcoded.

## Visual direction

Recreate the existing dark VRTX visual language.

Shared components should include equivalents of:

- `CyberButton`
- `CircularProgressRing`
- `StatCard`

Do not merely wrap Flutter screenshots. Rebuild the UI using React Native primitives and the target component system.

## Completion requirement

At the end provide:

1. Complete migrated file tree.
2. Install commands.
3. Environment-variable setup.
4. Expo development commands.
5. Android/iOS run instructions.
6. TypeScript verification.
7. Tests/checks performed.
8. Any source behavior that could not be reproduced exactly, with the reason.

Do not claim completion if `tsc --noEmit` fails.

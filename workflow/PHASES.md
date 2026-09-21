# PHASES.md — Sequential Migration Plan

## Phase 0 — Source audit + Expo scaffold + Firebase + theme

- Clone source.
- Read all `lib/**/*.dart`.
- Create Expo TypeScript project structure.
- Configure Expo Router.
- Configure strict TypeScript.
- Add Zustand + AsyncStorage.
- Add Firebase JS SDK.
- Add NativeWind.
- Add chart/media dependencies.
- Create environment example.
- Create Firebase config.
- Recreate VRTX theme tokens.
- Create initial shared components:
  - CyberButton
  - CircularProgressRing
  - StatCard
- Verify scaffold.

**Gate:** `npx tsc --noEmit` must pass.

## Phase 1 — Core auth + splash

Migrate:
- AuthService
- Firebase Auth
- Google Sign-In
- profile existence/check
- profile save
- onboarding completion state
- sign out
- root splash routing

Preserve exact routing order.

**Gate:** auth and routing behavior verified.

## Phase 2 — Onboarding

Migrate all 8 onboarding screens in the exact source order.

Preserve:
- fields
- validation
- defaults
- progress
- navigation
- Firestore save behavior
- completion behavior

**Gate:** complete onboarding flow works end-to-end.

## Phase 3 — Shell + Dashboard + Profile

Migrate:
- MainShell
- tab navigation
- dashboard
- profile
- charts/statistics
- profile editing

Preserve existing data calculations.

**Gate:** authenticated user can reach and use the shell.

## Phase 4 — CRUD features

Migrate:
- workout
- nutrition
- expense
- notes/add_note

Preserve:
- Firestore paths
- fields
- validation
- create/read/update/delete behavior
- loading/error states

**Gate:** CRUD operations work against Firebase.

## Phase 5 — AI Chat

Migrate:
- Gemini
- Groq
- chat history/memory
- profile context/system prompt
- voice input
- image input
- media/document flow where supported

Do not expose secrets.

**Gate:** AI chat can send, receive and retain context correctly.

## Phase 6 — Polish + verification

- Visual polish.
- Empty/loading/error states.
- Keyboard handling.
- Safe-area handling.
- Accessibility basics.
- Remove dead code.
- Remove TODOs.
- Strict TypeScript cleanup.
- Verify Expo build/runtime configuration.

Required:

```bash
npx tsc --noEmit
```

Also run available tests/lint/build checks.

**Final gate:** clean TypeScript and documented run instructions.

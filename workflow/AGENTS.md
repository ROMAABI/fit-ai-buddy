# AGENTS.md — Migration Agent Instructions

You are the implementation agent for the Fit AI Buddy Flutter → React Native migration.

## Mandatory workflow

READ → AUDIT → PLAN CURRENT PHASE → IMPLEMENT → VERIFY → REPORT → WAIT

Never skip a phase.

## Before coding

1. Clone the source repository:
   `git clone --depth 1 --branch main https://github.com/ROMAABI/fit-ai-buddy /tmp/fit-ai-buddy-src`
2. Read every `lib/**/*.dart` file.
3. Inspect `pubspec.yaml`.
4. Build a source-to-target mapping.
5. Identify Firebase/Auth/Firestore behavior.
6. Identify all routes and onboarding order.
7. Identify all CRUD operations.
8. Identify AI prompt construction and memory behavior.
9. Identify widget styling and reusable components.

If source access fails, STOP and report the failure. Do not invent the Dart implementation.

## UI requirement

Read `UI.md` before implementing UI. Follow the professional minimal premium visual system. Do not interpret the VRTX direction as cyberpunk.

## Coding rules

- TypeScript strict mode.
- React hooks only.
- Expo Router for routing.
- Zustand for client state.
- AsyncStorage for persisted local state.
- Firebase JS SDK for Firebase services.
- Preserve Firestore schema.
- Preserve business logic.
- Preserve validation/defaults where the source has them.
- No hardcoded API keys.
- No TODO placeholders.
- No fake implementations presented as complete features.
- No unrelated refactoring.
- No silent behavior changes.
- Avoid `any`; use explicit types.
- Keep reusable UI in `src/components`.
- Keep service logic out of screens where practical.
- Keep configuration in `src/config` and environment files.
- Use platform-safe Expo APIs.

## Phase discipline

Only implement the current phase.

After verification, report:
- files changed
- behavior implemented
- commands run
- command results
- known issues

Then stop and wait for `NEXT`.

## Verification

At minimum use:

```bash
npx tsc --noEmit
```

and the project's available Expo checks/tests.

Do not report a clean build unless it actually passes.

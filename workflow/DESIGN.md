# DESIGN.md — Target Architecture

## Application layers

```text
app/
  _layout.tsx
  login.tsx
  onboarding/
  (tabs)/
    _layout.tsx
    dashboard.tsx
    workout.tsx
    ai-chat.tsx
    nutrition.tsx
    expense.tsx
    profile.tsx
    notes/
```

```text
src/
  components/
  config/
  services/
  store/
  theme/
  hooks/
  utils/
  types/
```

## Responsibilities

### `app/`
Expo Router screens and route layouts only.

### `src/services/`
External/backend integration:
- Firebase Auth
- Firestore
- Gemini
- Groq
- media/document services

### `src/store/`
Zustand stores and persistence coordination.

### `src/theme/`
Colors, typography, spacing, radii, shadows and VRTX design tokens.

### `src/components/`
Reusable UI:
- CyberButton
- CircularProgressRing
- StatCard
- cards
- inputs
- chat bubbles
- chart wrappers
- loading/error states

## Authentication

Firebase JS SDK is authoritative for auth state.

Auth service must expose behavior equivalent to the Flutter `AuthService`, including:
- initialization
- silent/session restoration
- sign-in
- Google sign-in
- profile check
- profile save
- onboarding completion
- sign-out

## Navigation

Expo Router layout files replace Flutter navigation/shell code.

The root layout owns initial routing decisions.

## Persistence

Use AsyncStorage only for client-side persisted state that corresponds to Flutter `shared_preferences`.

Firestore remains authoritative for user profile/server data.

## AI

Gemini and Groq calls are isolated behind service functions.

Screens must not contain raw API request construction.

Profile context is generated from the current user data and passed into the AI system/context prompt according to the original Dart behavior.

## Media

Use:
- `expo-image-picker` for image selection/capture.
- `expo-document-picker` for document selection where the original app supports documents.

Do not silently remove image input from AI chat.

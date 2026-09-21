# DECISIONS.md

## D001 — Expo Router

**Decision:** Use Expo Router.

**Reason:** It is the requested target and maps naturally to the Flutter route/shell structure.

## D002 — Zustand

**Decision:** Zustand replaces Flutter local/application state patterns where shared React state is required.

**Reason:** Explicit target requirement.

## D003 — AsyncStorage

**Decision:** AsyncStorage replaces the Flutter `shared_preferences` role.

**Constraint:** Only migrate equivalent persisted client state; do not move Firestore data into AsyncStorage.

## D004 — Firebase JS SDK

**Decision:** Use Firebase JS SDK.

**Constraint:** Preserve Firebase Auth and Firestore behavior/schema.

## D005 — AI providers

**Decision:** Use `@google/generative-ai` and Groq over `fetch`.

**Constraint:** Credentials are environment variables and never hardcoded.

## D006 — Charts

**Decision:** Use `victory-native` or `gifted-charts`.

**Constraint:** Preserve the information and interactions of the Flutter charts, not necessarily the exact rendering engine.

## D007 — Native capabilities

**Decision:** Prefer Expo-supported APIs for image/document/media capabilities.

**Constraint:** If a capability has no exact Expo equivalent, document the compatibility decision rather than silently deleting functionality.

## D008 — Visual migration

**Decision:** Recreate the VRTX theme in React Native rather than embedding Flutter output.

**Constraint:** Shared components should be reusable and typed.

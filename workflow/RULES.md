# RULES.md — Non-Negotiable Migration Rules

1. The Flutter repository is the source of truth for existing behavior.
2. Read all `lib/**/*.dart` before implementing migration logic.
3. Do not skip migration phases.
4. Do not rewrite unrelated code.
5. Do not alter Firestore collection/document names or field names.
6. Do not invent undocumented business rules.
7. Preserve validation, defaults and routing behavior.
8. Preserve AI chat memory and profile context.
9. API keys must come from environment configuration.
10. Never commit secrets.
11. Use strict TypeScript.
12. Use React hooks only.
13. No TODOs in the final implementation.
14. No placeholder screens pretending to be complete.
15. Do not replace Firebase with another backend.
16. Do not replace Zustand with another state library.
17. Do not replace Expo Router with React Navigation directly.
18. Do not remove existing user-facing functionality merely because it is inconvenient to port.
19. When an API/library has no direct Expo equivalent, choose the closest Expo-compatible implementation and document the compatibility decision.
20. If a requirement is genuinely ambiguous after inspecting the Dart source, stop and ask rather than guessing.

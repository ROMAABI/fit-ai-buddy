# Fit AI Buddy (Expo React Native + TypeScript)

A production-grade fitness companion and sports science intelligence application built with Expo React Native, TypeScript, Zustand, and Google Gemini. Featuring a refined "Quiet Athletic Luxury" liquid glass design language.

---

## 1. Project Overview & Architecture

Fit AI Buddy has been fully migrated from Flutter 3 to Expo React Native (Strict TypeScript).

### Tech Stack:
- **Framework**: Expo SDK (React Native 0.76+ / New Architecture)
- **Language**: TypeScript (Strict mode enabled, 0 compiler errors)
- **Routing**: Expo Router (File-based tabs and nested stack navigation)
- **State Management**: Zustand with persistent storage (`useUserStore`)
- **Backend / Auth**: Firebase JS SDK & Google Auth integration
- **Styling**: Luxury Liquid Glass UI theme with specular sheen highlights, dynamic color tokens, and full Light/Dark mode support (`src/theme/luxury.ts`)
- **Charts & Telemetry**: `react-native-gifted-charts` with dynamic progress calculations and empty-state fallbacks
- **AI Engine**: Dual AI Coach intelligence powered by `@google/generative-ai` (Gemini Pro) and Groq API

---

## 2. Directory Structure

```text
fit-ai-buddy/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Liquid glass floating bottom dock (5 tabs)
│   │   ├── dashboard.tsx       # Biometric hero dial, volume bars, calorie curve, budget breakdown
│   │   ├── workout.tsx         # Workout routines, exercise logger cards, completion toggles
│   │   ├── ai-coach.tsx        # AI Sports Science coach chat stream, prompts, input dock
│   │   ├── nutrition.tsx       # Daily calorie targets, macro breakdown (P/C/F), meal timeline
│   │   └── expense.tsx         # Fitness finance manager, category filters, Rupee budget tracking
│   ├── onboarding/             # 8-step onboarding questionnaire
│   ├── login.tsx               # Athlete authentication screen
│   ├── profile.tsx             # Athlete profile, biometrics & edit protocol modal
│   ├── notifications.tsx       # Interactive notification center
│   └── _layout.tsx             # Root layout with SafeAreaProvider & ThemeContext
├── src/
│   ├── components/
│   │   ├── AppTopBar.tsx       # Unified top header & touch target icon buttons
│   │   ├── LiquidGlass.tsx     # LiquidBackground & LiquidGlassCard containers
│   │   ├── ThemeSwitcher.tsx   # Compact & segmented theme switcher
│   │   ├── StatCard.tsx        # KPI cards with dynamic trend badges
│   │   └── CircularProgressRing.tsx # High-precision SVG biometric ring
│   ├── config/
│   │   └── firebase.ts         # Firebase JS SDK initialization
│   ├── services/
│   │   ├── auth.ts             # Auth & profile persistence service
│   │   └── ai.ts               # Gemini & Groq sports science engine
│   ├── store/
│   │   ├── userStore.ts        # Zustand athlete profile & protocol store
│   │   └── useUserStore.ts     # User state seam
│   └── theme/
│       ├── luxury.ts           # Quiet Athletic Luxury tokens & system font fallbacks
│       └── ThemeContext.tsx    # Theme provider (System / Light / Dark)
├── workflow/                   # Migration specifications & design documentation
│   ├── README.md               # Migration mission & architecture mapping
│   ├── PHASES.md               # Sequential migration phases (Phases 0–6)
│   ├── UI.md                   # Visual styling & liquid glass contract
│   └── docs/                   # Source audits & mapping specs
└── package.json
```

---

## 3. Environment Setup & Configuration

Create a `.env` file in the project root:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# AI Services
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

---

## 4. Installation & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. TypeScript Verification
Ensure all TypeScript contracts and types are valid:
```bash
npx tsc --noEmit
```

### 3. Start the Development Server
```bash
npx expo start
```

### 4. Running on Devices
- **Android**: Press `a` in the terminal or run `npx expo run:android`
- **iOS**: Press `i` in the terminal or run `npx expo run:ios`
- **Web**: Press `w` in the terminal or run `npx expo start --web`

---

---

## 5. 30-Second Launch Demo Presentation

A cinematic 30-second presentation video (`brag-output/brag.mp4`) has been rendered showcasing the app's prototype, design system, and capabilities:

- **Poster Frame**: `brag-output/brag.jpg`
- **Video File**: `brag-output/brag.mp4` (1920x1080 Full HD, 30fps)
- **Concept & Storyboard**: `brag-output/brag-plan.md`

### Core Showcase Moments:
1. **The Problem & Hook**: Moving beyond outdated 2012-era spreadsheet fitness apps into a refined athletic luxury cockpit.
2. **High-Precision Biometric Cockpit**: Live caloric burn dial (1,840 kcal), 5-day training streak, and volume telemetry.
3. **Four Dedicated Power Hubs**: Progressive overload workout logs, sports science AI Coach, and fitness ledger in Rupees (₹).
4. **Quiet Athletic Luxury**: Bespoke specular sheen rims, liquid glass cards, and system font typography.

---

## 6. Migration Status & Fit AI Buddy v2 Roadmap

| Phase | Milestone | Status |
| :--- | :--- | :--- |
| **Phase 0** | Source Audit, TypeScript Scaffold, Firebase, Luxury Theme | Completed |
| **Phase 1** | Auth Service, Login, Splash Routing, Google Sign-In | Completed |
| **Phase 2** | 8-Step Onboarding Flow & Firestore Sync | Completed |
| **Phase 3** | Shell, Dashboard, Profile & Protocol Screen | Completed |
| **Phase 4** | Workouts, Nutrition, Expenses Hubs with Modals | Completed |
| **Phase 5** | AI Sports Science Coach Chatbot Stream | Completed |
| **Phase 6** | Polish, Unified Top Bar, Rupee (`₹`) Standardization, Zero Type Errors | Completed |

### Planned for Fit AI Buddy v2:
- Live cloud Firebase Auth session sync & Firestore stream subscriptions.
- Live Gemini Pro & Groq API LLM endpoints for unbounded sports science chat.
- Live reactive database mutations across all workout sets and nutrition logs.
- Expanded workout engine with timer countdowns and custom exercise builders.


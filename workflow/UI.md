# UI.md — Fit AI Buddy Visual Design System

## Design Direction

Build the app as a **professional, minimal, premium fitness product**.

### Core aesthetic

- Minimal
- Modern
- Premium
- Calm
- Clean
- Subtle 3D depth
- Strong typography
- Spacious layouts
- High-quality cards
- Soft shadows and restrained gradients
- Real product/SaaS quality

### Explicitly avoid

**This is NOT a cyberpunk UI.**

Do not use:
- neon green
- neon purple
- neon pink
- glowing borders
- sci-fi HUD panels
- excessive outlines
- glitch effects
- futuristic terminal styling
- hacker/cyberpunk typography
- excessive gradients
- decorative noise
- overuse of glassmorphism

The previous "VRTX/cyber" visual language must be interpreted as a **dark premium product direction**, not cyberpunk.

---

# Visual Foundation

## Theme

Use a sophisticated dark neutral palette.

Suggested tokens:

```ts
background: "#0B0D0F"
surface: "#111417"
surfaceElevated: "#171B1F"
surfaceSoft: "#1D2227"

textPrimary: "#F5F7F8"
textSecondary: "#9BA3AA"
textMuted: "#687078"

border: "#252B30"

accent: "#D9FF4F"
accentSoft: "#C8EA45"

success: "#72D6A1"
warning: "#F4C66A"
danger: "#F27D7D"
```

The accent should be used sparingly for important actions, progress and highlights.

If the source Flutter app uses different colors, preserve its semantic behavior while adapting the visual system to this professional palette.

## Typography

Prefer a clean modern sans-serif.

Hierarchy:

```text
Display       — large, confident
Heading       — strong
Section       — medium/bold
Body          — readable
Caption       — restrained
Metric        — bold and prominent
```

Avoid decorative/futuristic fonts.

---

# Layout Philosophy

Use generous spacing.

```text
Screen padding:       20–24
Section gap:          24–32
Card internal pad:    16–20
Element gap:          8–16
Corner radius:       16–24
Button radius:        14–16
```

Do not overcrowd screens.

A screen should feel intentionally empty rather than packed with widgets.

---

# Subtle 3D

3D should mean **depth**, not futuristic effects.

Use:

- layered surfaces
- soft shadows
- elevation
- subtle highlights
- gently raised cards
- depth through contrast
- occasional rounded 3D illustrations

Do NOT use:
- chrome UI
- glowing 3D objects
- holographic effects
- neon extrusion
- metallic cyberpunk surfaces

Example:

```text
Background
   ↓
Elevated surface
   ↓
Soft shadow
   ↓
Content
```

Cards should appear physically separated from the background without looking glossy.

---

# Cards

Cards are the primary visual primitive.

Characteristics:

- dark neutral surface
- 16–24 radius
- very subtle border
- soft shadow
- clear hierarchy
- generous internal padding

Example structure:

```text
┌──────────────────────────────┐
│  Daily Activity              │
│                              │
│       7,420                  │
│       steps                  │
│                              │
│  ────────────────            │
│  +12% from yesterday         │
└──────────────────────────────┘
```

Avoid excessive nested cards.

---

# Primary Button

## CyberButton → PremiumButton

Keep the component name `CyberButton` for source compatibility if required, but visually it must be a **minimal premium button**, not cyberpunk.

```text
┌──────────────────────────────┐
│        Start Workout         │
└──────────────────────────────┘
```

Characteristics:

- solid accent
- dark text
- medium/bold typography
- 14–16 radius
- subtle pressed state
- no glow
- no animated border

Secondary buttons should use elevated surfaces or subtle outlines.

---

# CircularProgressRing

Use a clean fitness dashboard ring.

Characteristics:

- smooth circular progress
- thin/medium stroke
- one accent color
- muted background track
- large central metric
- small supporting label

Example:

```text
          72%
       ╭───────╮
      ╱         ╲
     │    72     │
     │   kcal    │
      ╲         ╱
       ╰───────╯
```

No neon glow.

---

# StatCard

Stat cards should communicate one important number quickly.

```text
┌──────────────────────────┐
│ Calories                 │
│                          │
│ 1,840 kcal               │
│                          │
│ ↑ 8%                     │
└──────────────────────────┘
```

Use subtle visual hierarchy rather than decorative graphics.

---

# Navigation

Bottom tab navigation should be minimal.

Use:

- clean icons
- active indicator
- neutral inactive icons
- compact labels where appropriate

Avoid:
- oversized glowing tab buttons
- floating neon navigation
- excessive animation

The active tab can use the accent color.

---

# Login

The login screen should feel like a premium fitness application.

Structure:

```text
              Fit AI Buddy

        Your fitness,
        made personal.

     [ Continue with Google ]

     ───────── or ─────────

     Email
     [                    ]

     Password
     [                    ]

     [        Sign in      ]

        Create account
```

Use strong typography and generous whitespace.

---

# Onboarding

Each onboarding screen should have **one clear decision**.

Avoid presenting a giant form.

Structure:

```text
← Back

Step 03 of 08

What's your current
fitness level?

     [ Beginner ]

     [ Intermediate ]

     [ Advanced ]


                     Continue →
```

Progress should be subtle.

Use illustrations sparingly and only when they improve comprehension.

---

# Dashboard

Dashboard hierarchy:

```text
Good morning, Alex

Your progress today

┌──────────────┐ ┌──────────────┐
│ Calories     │ │ Workout      │
│ 1,840        │ │ 42 min       │
└──────────────┘ └──────────────┘

        Progress ring

Today's workout

┌──────────────────────────────┐
│ Upper Body                   │
│ 6 exercises · 42 min         │
│                              │
│             Start →          │
└──────────────────────────────┘
```

The dashboard should prioritize the user's most important fitness information.

---

# Workout

Focus on:

- exercise name
- sets/reps
- weight
- completion
- workout duration

Use large touch targets.

Avoid dense spreadsheet-like layouts.

---

# Nutrition

Nutrition should emphasize:

- calories
- protein
- carbohydrates
- fats
- daily progress

Use clean progress bars/rings and compact cards.

---

# Expense

Keep expense tracking visually consistent with the rest of the app.

Use:

- category
- amount
- date
- simple trend/chart
- clear add action

Avoid overly decorative finance-dashboard styling.

---

# Notes

Notes should feel like a clean personal journal.

Use:

```text
Notes

┌──────────────────────────────┐
│ Recovery                     │
│ Felt strong after today's... │
│                              │
│ Today                        │
└──────────────────────────────┘

                         +
```

---

# Profile

Profile should emphasize identity and core fitness information.

```text
       Profile photo

       Alex

       alex@email.com

────────────────────────────

Personal information

Age             24
Height          174 cm
Weight          68 kg

Fitness goal
Build strength
```

Keep editing actions obvious.

---

# AI Chat

The AI screen should look like a modern premium assistant.

User:

```text
                         How should I
                         train today?
```

Assistant:

```text
Based on your recent activity,
I'd keep today's session moderate.

You trained your upper body
yesterday, so here's a lower-body
session...
```

Use clearly differentiated bubbles but avoid futuristic glowing containers.

Input:

```text
┌──────────────────────────────┐
│ Ask anything...          🎤  │
└──────────────────────────────┘
```

Image and voice actions should be subtle icon buttons.

---

# Charts

Charts should be clean and data-first.

Use:

- restrained grid lines
- minimal labels
- one primary accent
- muted secondary values
- smooth curves where appropriate

Never make charts look like a sci-fi HUD.

---

# Animation

Animations should be subtle:

- 150–250ms transitions
- opacity
- scale from 0.98 → 1
- progress animation
- button press feedback

Avoid:

- glitch
- scanline
- excessive particle effects
- neon pulses
- aggressive transitions

---

# Component Rules

Every reusable component should:

1. Have a clear single responsibility.
2. Accept typed props.
3. Support dark theme.
4. Avoid hardcoded screen-specific dimensions.
5. Respect safe areas.
6. Support accessibility labels where appropriate.

Core components:

```text
src/components/
├── CyberButton.tsx
├── CircularProgressRing.tsx
├── StatCard.tsx
├── AppCard.tsx
├── AppInput.tsx
├── Screen.tsx
├── EmptyState.tsx
├── LoadingState.tsx
├── ErrorState.tsx
├── ProgressBar.tsx
└── ChatBubble.tsx
```

---

# Quality Bar

The final app should feel closer to:

**premium health/fitness SaaS + modern mobile product**

than:

**gaming UI + cyberpunk dashboard + hacker interface**

The design should look professional enough for a production App Store / Play Store application.

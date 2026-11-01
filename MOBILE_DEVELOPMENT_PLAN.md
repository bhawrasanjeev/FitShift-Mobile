# FitShift Mobile Development Plan (Android React Native)

> **Document Type:** Mobile Architecture & Phase-Wise Roadmap  
> **Target OS:** Android 11+ (API 30+)  
> **Framework:** React Native 0.88 (TypeScript)  
> **Date:** November 2026  

---

## 1. Directory Structure

```text
FitShift-Mobile/
├── android/                         # Native Android project (Gradle, manifest, resources)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/com/lr/MainActivity.kt
│   │   │   └── res/
│   │   │       ├── values/strings.xml (app_name: "FitShift")
│   │   │       ├── mipmap-*/ (FitShift app icons)
│   │   │       └── drawable/ (Splash screen & vectors)
│   │   └── build.gradle
│   └── build.gradle
│
├── src/
│   ├── assets/                      # Brand assets, icons, illustrations
│   │   ├── logo/
│   │   └── images/
│   │
│   ├── theme/                       # Centralized FitShift Design System
│   │   ├── colors.ts                # Emerald greens, crisp backgrounds, borders
│   │   ├── typography.ts            # Font families, sizes, line heights, weights
│   │   ├── spacing.ts               # 4pt grid system (4, 8, 12, 16, 24, 32)
│   │   ├── borderRadius.ts          # 8, 12, 16, 24, full
│   │   ├── shadows.ts               # Android elevation tokens
│   │   └── index.ts
│   │
│   ├── types/                       # Strict TypeScript data models
│   │   ├── onboarding.ts
│   │   ├── workout.ts
│   │   ├── nutrition.ts
│   │   ├── diet.ts
│   │   ├── ai.ts
│   │   └── index.ts
│   │
│   ├── services/                    # API and Persistence Layer
│   │   ├── api/
│   │   │   ├── config.ts            # Dynamic base URL (10.0.2.2 / LAN / Prod)
│   │   │   ├── apiClient.ts         # Fetch wrapper with timeouts & error handling
│   │   │   ├── healthService.ts     # Health & dataset status checks
│   │   │   ├── nutritionService.ts  # /api/nutrition/calculate
│   │   │   ├── dietService.ts       # /api/diet/optimize
│   │   │   ├── workoutService.ts    # /api/workouts/generate
│   │   │   └── aiService.ts         # /api/ai/chat & /api/ai/status
│   │   └── storage/
│   │       └── planStorage.ts       # Local cache & session persistence
│   │
│   ├── context/                     # Application State Management
│   │   ├── PlanContext.tsx          # Current active plan, user profile, status
│   │   └── ThemeContext.tsx         # Colors & display scaling
│   │
│   ├── components/
│   │   ├── common/                  # Base design system primitives
│   │   │   ├── Button.tsx           # Tactile button with ripple & loading states
│   │   │   ├── Card.tsx             # Rounded container with border & elevation
│   │   │   ├── Badge.tsx            # Accent, success, warning, neutral pills
│   │   │   ├── SegmentedControl.tsx # Sliding pill tab toggle
│   │   │   ├── ProgressBar.tsx      # Step & macro progress bar
│   │   │   ├── ScreenContainer.tsx  # Safe area & status bar wrapper
│   │   │   ├── Header.tsx           # Brand header with status badges
│   │   │   └── Modal.tsx            # Android bottom sheet / dialog
│   │   │
│   │   ├── onboarding/              # 7-Step Mobile Wizard
│   │   │   ├── StepPersonalBasics.tsx
│   │   │   ├── StepDailyRhythm.tsx
│   │   │   ├── StepTrainingSetup.tsx
│   │   │   ├── StepFoodPreferences.tsx
│   │   │   ├── StepBudget.tsx
│   │   │   ├── StepSupplements.tsx
│   │   │   └── StepReview.tsx
│   │   │
│   │   ├── overview/                # Dashboard Components
│   │   │   ├── MacroRingCard.tsx
│   │   │   ├── TodayWorkoutCard.tsx
│   │   │   ├── TodayMealsCard.tsx
│   │   │   ├── LateTiredBanner.tsx
│   │   │   └── EditPlanModal.tsx
│   │   │
│   │   ├── workout/                 # Workout & Exercise Components
│   │   │   ├── DaySplitSelector.tsx
│   │   │   ├── EnvironmentToggle.tsx
│   │   │   ├── ExerciseItemCard.tsx
│   │   │   ├── ExerciseDetailModal.tsx
│   │   │   └── ExerciseImage.tsx
│   │   │
│   │   ├── diet/                    # Diet & Nutrition Components
│   │   │   ├── MealCourseCard.tsx
│   │   │   ├── MealSwapModal.tsx
│   │   │   ├── SevenDaySchedule.tsx
│   │   │   ├── GroceryListView.tsx
│   │   │   └── SupplementsComparison.tsx
│   │   │
│   │   ├── schedule/                # Daily Timeline Components
│   │   │   ├── TimelineItem.tsx
│   │   │   └── RecoveryPillars.tsx
│   │   │
│   │   └── ai/                      # AI Assistant Components
│   │       ├── ChatBubble.tsx
│   │       ├── ChatInputBar.tsx
│   │       ├── SuggestedPromptChips.tsx
│   │       └── PlanContextBadge.tsx
│   │
│   ├── screens/                     # Primary Screen Views
│   │   ├── WelcomeScreen.tsx        # Hero & value propositions
│   │   ├── OnboardingScreen.tsx     # Wizard hosting the 7 steps
│   │   ├── DashboardScreen.tsx      # Overview tab
│   │   ├── WorkoutScreen.tsx        # 7-day split & exercises
│   │   ├── DietScreen.tsx           # Meals, groceries, supplements
│   │   ├── ScheduleScreen.tsx       # 24-hour routine & recovery
│   │   └── AIAssistantScreen.tsx    # Conversational coach
│   │
│   └── navigation/                  # Navigation Stack & Bottom Bar
│       ├── BottomTabNavigator.tsx   # Overview, Workout, Diet, Schedule, AI Coach
│       └── RootNavigator.tsx        # Welcome -> Onboarding -> AppTabs
│
├── App.tsx                          # Root application bootstrap
└── package.json
```

---

## 2. Phase-by-Phase Roadmap

### Phase 1 — React Native Architecture & Dependencies
- Set up directory structure with clear separation of concerns.
- Verify TypeScript compilation and React Native 0.88 runtime stability.
- Add essential dependencies:
  - Storage: `@react-native-async-storage/async-storage` (local session persistence)
  - Safe area handling: `react-native-safe-area-context` (already present)
  - Vector icons / clean SVG / iconography components.

### Phase 2 — FitShift Mobile Design System
- Create `src/theme/` design tokens matching FitShift brand specifications:
  - Brand green: `#15803D`, `#166534`, light `#ECFDF5`.
  - Crisp background: `#FAFAFA`, `#F4F4F6`, `#FFFFFF`.
  - Text primary: `#111827`, secondary `#4B5563`.
- Build reusable UI primitives: `Button`, `Card`, `Badge`, `SegmentedControl`, `ProgressBar`, `ScreenContainer`, `Modal`.
- Ensure proper Android ripple effects, elevation shadows, and touch target accessibility (min 48dp).

### Phase 3 — Existing Backend Integration Layer
- Create `src/services/api/` with dynamic environment detection:
  - Emulator default: `http://10.0.2.2:5000` (and `5001` fallback).
  - Physical device LAN IP support.
  - Production base URL support.
- Implement API service modules for:
  - `healthService`: `GET /api/health` & `GET /api/data/status`
  - `nutritionService`: `POST /api/nutrition/calculate`
  - `dietService`: `POST /api/diet/optimize`
  - `workoutService`: `POST /api/workouts/generate`
  - `aiService`: `GET /api/ai/status` & `POST /api/ai/chat`
- Build resilient error handling, request timeouts, and offline indicators.

### Phase 4 — Authentication & User Onboarding
- Implement Welcome Screen with FitShift brand mark and value highlights.
- Build 7-step Onboarding Wizard:
  1. Personal Basics (Age, Gender, Height, Weight, Goal)
  2. Daily Rhythm (Occupation, Transit, Sleep, Wake, Activity)
  3. Training Setup (Home/Gym, Duration, Frequency, Level, Equipment)
  4. Food Preferences (Diet type, Cooking situation, Meals/day, Regional style)
  5. Daily Budget (Ultra-Budget ₹50, Budget ₹75, Moderate ₹110, Custom)
  6. Supplements (Food-first default, open, unsure)
  7. Review & Summary with step-editing anchors
- Connect wizard submission directly to backend `/api/nutrition/calculate`, `/api/diet/optimize`, `/api/workouts/generate`.
- Persist generated plan in local storage for instant launch.

### Phase 5 — Dashboard & Main Navigation
- Build native Android Bottom Navigation:
  - 🏠 Overview (Dashboard)
  - 🏋️ Workout
  - 🥗 Diet
  - ⏱️ Schedule
  - 🤖 AI Coach
- Implement Dashboard Screen:
  - User greeting with goal badge.
  - Daily calorie & protein target progress cards.
  - BMR & TDEE breakdown.
  - Today's workout preview with 1-tap start.
  - Today's meals preview.
  - "Late / Tired Today" quick recovery activator.
  - Fast inline "Edit Plan" modal.

### Phase 6 — Workout & Exercise Module
- 7-Day Split Selector (Monday through Sunday with active focus headers).
- Home vs Gym Segmented Toggle (instantly switches movements between bodyweight and gym equipment).
- Exercise cards with CDN demonstration thumbnails (`free-exercise-db`), target muscle badges, sets x reps, rest timers.
- Exercise Details Modal with step-by-step instructions, caution warnings, and equipment requirements.
- 1-Tap Exercise Alternative Swapping with full metadata preservation.

### Phase 7 — Diet, Nutrition, Grocery & Recovery Modules
- Daily Indian Meal Courses (Breakfast, Lunch, Evening Snack, Dinner) with timing, ingredients, macros, and cooking tips.
- Meal Alternative Swapping Modal with macro and cost difference calculations.
- 7-Day Meal Plan variations preventing dietary monotony.
- Consolidated Weekly Grocery Shopping List with interactive checkboxes, category breakdown, cost estimates, and clipboard sharing.
- Whole-Food vs Supplement Advisory with ₹/gram protein economics table.
- 24-Hour Chronological Daily Schedule matching user's sleep, transit, work, and workout rhythms.
- Lifestyle & Recovery Guide (Sleep hygiene, hydration, desk ergonomics, mobility flows).

### Phase 8 — AI Assistant & External Integrations
- FitShift AI Chat Screen connecting to backend `GET /api/ai/status` and `POST /api/ai/chat`.
- "Include my FitShift plan context" toggle (passes goal, environment, diet, budget, duration to LLM).
- Categorized quick prompt chips (Workout, Nutrition, Budget, Recovery).
- Message bubbles with copy action and markdown-style rendering.
- Typing indicators and resilient error banners.

### Phase 9 — Profile, Settings & Offline Resilience
- Edit Plan modal allowing rapid updates to budget, goal, workout duration, and environment.
- Plan reset and re-onboarding trigger.
- Offline cache retrieval ensuring the plan is readable without internet.
- Network connection status indicator.

### Phase 10 — Testing & Quality Assurance
- Functional testing of all flows: Onboarding -> Generation -> Navigation -> Tabs -> Modals -> Swaps.
- UI responsiveness testing across multiple Android screen sizes and densities.
- Verification of hardware back-button dismiss and navigation handling.
- TypeScript static check: `npx tsc --noEmit`.
- Android compilation verification with Gradle.

### Phase 11 — Android APK Build & Demo Preparation
- Configure Android package metadata in `AndroidManifest.xml`, `build.gradle`, and `strings.xml`:
  - App Name: `FitShift`
  - Application ID: `com.fitshift.app` (or updated namespace)
  - Version: `1.0.0`
- Configure FitShift app icon and splash branding.
- Generate Debug APK (`./gradlew assembleDebug`).
- Verify generated APK binary on disk.
- Document step-by-step sideload installation instructions via `adb install` or direct phone download.

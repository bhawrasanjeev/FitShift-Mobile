# FitShift Project Audit & Technical Analysis (Phase 0)

> **Document Type:** System Audit & Architectural Discovery  
> **Source Project:** FitShift (Web Client & Express Backend)  
> **Target Mobile Platform:** Android (React Native)  
> **Date:** November 2026  

---

## 1. Executive Summary

FitShift is a **routine-first, budget-realistic fitness and nutrition planning engine** built specifically for real Indian lives, busy working/college schedules, and authentic whole foods. 

The website philosophy centers on:
1. **Planning, Not Tracking:** Zero calorie-burn anxiety, wearable sync overhead, or gamified streak penalties.
2. **Zero Barrier Entry:** No mandatory registration, passwords, or subscription gates.
3. **Food-First Integrity:** High-protein Indian staples (Chana Sattu, Soya Chunks, Kala Chana, Moong Dal, Dahi, Paneer, Eggs) form the daily foundation. Supplements (Whey, Creatine) remain optional convenience tools.
4. **Home & Gym Parity:** Instant 1-click toggle between home bodyweight/dumbbell movements and gym stations.
5. **Adaptive Routine ("Late / Tired Today"):** 1-click conversion of demanding sessions into an unhurried 15-minute mobility flow with an earlier bedtime recommendation.

This document presents the complete codebase audit of the existing React frontend and Express backend, establishing the baseline for developing the official native Android application in React Native.

---

## 2. Frontend Architecture Audit (`FitShift/client`)

### 2.1 Technology Stack
- **Framework:** React 19 (`19.0.0`)
- **Build Tool:** Vite 6 (`6.1.0`)
- **Styling:** Tailwind CSS v4 (`4.0.6`) with custom CSS tokens
- **Icons:** Lucide React (`0.475.0`)
- **Type System:** TypeScript (`~5.7.2`)
- **Utilities:** `clsx`, `tailwind-merge`

### 2.2 Application State & Routing Flow
The web client operates as a single-page state machine in `src/App.tsx`:
- `currentView`: `'landing' | 'onboarding' | 'plan' | 'ai'`
- `userData`: `OnboardingData` (Personal basics, daily rhythm, training setup, food preferences, budget, supplements)
- `nutritionData`: `NutritionPlanData` (BMR, TDEE, Calorie target, Protein target)
- `dietData`: `DietPlanData` (Foods, meals, grocery list, meal timings, 7-day meal plan, budget management guide)
- `workoutData`: `WorkoutPlanData` (7-day split, exercises, sets/reps, alternatives, home/gym support)
- `hasGeneratedPlan`: boolean flag triggering the plan view.

### 2.3 Component Inventory & Screen Structure

```text
client/src/
├── App.tsx                           # Main state machine & API orchestrator
├── pages/
│   ├── LandingPage.tsx               # Hero, value pillars, Indian food highlights, CTA
│   └── PlanPage.tsx                  # Container for Plan tabs & sidebar navigation
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                # Wordmark, links, CTA
│   │   ├── Footer.tsx                # Transparency & food-first disclaimer
│   │   ├── AppSidebar.tsx            # Desktop navigation sidebar for Plan tabs
│   │   └── PageContainer.tsx         # Responsive container wrapper
│   ├── ui/
│   │   ├── Button.tsx                # 5 variants, 3 sizes, loading state
│   │   ├── SelectCard.tsx            # Single & multi-select choice cards
│   │   ├── ProgressBar.tsx           # Step progress indicator
│   │   ├── SegmentedControl.tsx      # Sliding pill selector
│   │   ├── Modal.tsx                 # Accessible dialog with blur backdrop
│   │   └── Badge.tsx                 # Metric & status tag pills
│   ├── onboarding/
│   │   ├── OnboardingWizard.tsx      # 7-step wizard controller
│   │   ├── PersonalBasicsStep.tsx    # Step 1: Age, gender, height, weight, goal
│   │   ├── DailyRhythmStep.tsx       # Step 2: Occupation, transit hours, sleep, activity level
│   │   ├── TrainingSetupStep.tsx     # Step 3: Home/Gym, duration, frequency, experience, equipment
│   │   ├── FoodPreferencesStep.tsx   # Step 4: Diet type, cooking situation, meals/day, regional style
│   │   ├── BudgetStep.tsx            # Step 5: Daily food budget tiers (Ultra ₹50, Budget ₹75, etc.)
│   │   ├── SupplementsStep.tsx       # Step 6: Food-first default, open to whey, unsure
│   │   └── ReviewStep.tsx            # Step 7: Summary review with granular edit links
│   ├── overview/
│   │   ├── OverviewTab.tsx           # Greeting, targets, daily previews, late/tired trigger
│   │   ├── LateTiredModal.tsx        # 15m gentle mobility routine activator
│   │   └── EditPlanModal.tsx         # Fast inline plan reconfigurator
│   ├── workout/
│   │   ├── WorkoutPlan.tsx           # 7-day split selector & Home/Gym switcher
│   │   ├── ExerciseCard.tsx          # Exercise item with CDN thumbnail & swap button
│   │   └── ExerciseDetailsModal.tsx  # Full instructions, common mistakes, alternatives
│   ├── diet/
│   │   ├── DietPlan.tsx              # Daily Indian meal courses & macro summary
│   │   ├── MealCard.tsx              # Meal card with prep time, ingredients, cooking tip
│   │   └── MealAlternativesModal.tsx # Meal swap modal with protein/calorie/cost diffs
│   ├── schedule/
│   │   └── DailyScheduleView.tsx     # 24-hour chronological timeline
│   ├── grocery/
│   │   └── GroceryList.tsx           # Categorized shopping list & clipboard copy
│   ├── supplements/
│   │   └── SupplementsView.tsx       # Cost-per-gram protein comparison & supplement guide
│   ├── recovery/
│   │   └── RecoveryView.tsx          # Sleep, hydration, desk posture & mobility advice
│   └── ai/
│       ├── AIAssistantPage.tsx       # FitShift AI Chat Coach
│       ├── ChatMessage.tsx           # User & Assistant message bubbles
│       ├── ChatInput.tsx             # Auto-resizing message input
│       ├── ContextToggle.tsx         # Plan context injector toggle
│       ├── SuggestedPrompts.tsx      # Categorized starter question chips
│       ├── TypingIndicator.tsx       # 3-dot thinking indicator
│       └── FollowUpSuggestions.tsx   # Dynamic follow-up chips
```

---

## 3. Backend Architecture Audit (`FitShift/server`)

### 3.1 Technology Stack
- **Runtime:** Node.js (v24.11.1)
- **Framework:** Express.js (v5)
- **Module System:** ES Modules (`"type": "module"`)
- **Security:** Helmet, CORS, custom rate limiters
- **Environment:** dotenv (`PORT` default 5000 / macOS 5001 fallback)
- **Testing:** Node.js built-in test runner (`node:test`, `node:assert`) + Supertest (154 passing tests)

### 3.2 In-Memory Data Repositories & Datasets
1. **`exercises.json` (`server/data/raw/exercises.json`):**
   - 22,694 exercises sourced from `free-exercise-db`.
   - Fields: `name`, `force`, `level`, `mechanic` (compound/isolation), `equipment`, `primaryMuscles`, `secondaryMuscles`, `instructions`, `category`, `images`, `id`.
   - Loaded and indexed into memory by `exercise.repository.js`.
2. **`clean_staples.csv` (`server/data/processed/clean_staples.csv`):**
   - 36 cleaned, benchmarked Indian staple foods.
   - Fields: `id`, `name`, `category`, `tier`, `pricePer100g`, `proteinPer100g`, `costPer10gProtein`, `isSupplement`.
   - Loaded and sorted by `cleanStaples.repository.js`.
3. **`price.csv` (`server/data/raw/price.csv`):**
   - Raw market benchmark price dataset loaded by `foodPrice.repository.js`.
4. **`nutrition.csv` (`server/data/raw/nutrition.csv`):**
   - 1,014 Indian dishes with macro profiles (calories, protein, fats, carbs) loaded by `nutrition.repository.js`.

### 3.3 Core Fitness & Nutrition Algorithms
1. **BMR Calculation (`algorithms/nutrition/bmr.js`):**
   - Uses Mifflin-St Jeor equation:
     $$\text{Male: } 10 \times \text{weightKg} + 6.25 \times \text{heightCm} - 5 \times \text{age} + 5$$
     $$\text{Female: } 10 \times \text{weightKg} + 6.25 \times \text{heightCm} - 5 \times \text{age} - 161$$
2. **TDEE Calculation (`algorithms/nutrition/tdee.js`):**
   - Sedentary: $\times 1.2$
   - Lightly active: $\times 1.375$
   - Moderately active: $\times 1.55$
   - Very active: $\times 1.725$
3. **Calorie & Protein Targets (`algorithms/nutrition/calorieTarget.js`, `proteinTarget.js`):**
   - Muscle gain: $\text{TDEE} + 300\text{ kcal}$, $1.7\text{ g protein/kg}$
   - Fat loss: $\text{TDEE} - 400\text{ kcal}$, $1.9\text{ g protein/kg}$
   - Maintenance: $\text{TDEE} + 0\text{ kcal}$, $1.5\text{ g protein/kg}$
4. **Budget Diet Optimizer (`algorithms/diet/optimizer.js`):**
   - Calculates $\text{cost\_per\_10g\_protein} = (\text{price\_per\_100g} / \text{protein\_per\_100g}) \times 10$.
   - Ranks candidate foods by affordability.
   - Enforces hard **50g/day dry soya limit** and deduplicates soya chunks vs granules.
   - Enforces minimum and maximum serving bounds (e.g. 50–100g dal, 250–500ml milk, 2–6 eggs).
   - Generates daily meals, timings, 7-day variation plan, and consolidated grocery list.
5. **Deterministic Workout Engine (`algorithms/workout/workoutGenerator.js`):**
   - Tailors 7-day split by gender, experience level (Beginner linear foundation vs Intermediate 2-muscle pairings), frequency (3 to 6 days), and duration (20m = 3 exercises, 60m = 6 exercises).
   - Resolves CDN exercise thumbnails: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/<path>`.
   - Generates unique exercise alternatives with complete metadata.
6. **AI Assistant Service (`services/ai.service.js`):**
   - Supports Gemini API (automatic fallback across `gemini-3.6-flash`, `gemini-3.5-flash-lite`, `gemini-flash-lite-latest`, `gemini-3.8-flash`) and OpenAI API (`gpt-4o-mini`).
   - Injects specialized Indian nutrition and progressive overload system prompt with optional user context.
   - API keys are secured strictly on the backend.

---

## 4. Visual Identity & Design System Audit

### 4.1 Color Tokens
| Token | Hex Code | Purpose |
|:---|:---|:---|
| Primary Accent | `#15803D` (`emerald-700`) | Key CTAs, active indicators, brand highlights |
| Dark Accent / Hover | `#166534` (`emerald-800`) | Pressed button state, deep accent |
| Light Accent Tint | `#ECFDF5` (`emerald-50`) | Badges, card accents, active pill backgrounds |
| Accent Border | `#A7F3D0` (`emerald-200`) | Active card borders, highlighted outlines |
| Background | `#FAFAFA` | Global screen background |
| Surface Subtle | `#F4F4F6` | Secondary cards, pill backgrounds, inset wells |
| Surface Card | `#FFFFFF` | Primary cards, modals, sheets |
| Border | `#E5E7EB` (`zinc-200`) | Standard 1px divider and card border |
| Text Primary | `#111827` (`zinc-900`) | Main titles, primary body copy |
| Text Secondary | `#4B5563` (`zinc-600`) | Descriptions, subtitles, labels |
| Text Muted | `#9CA3AF` (`zinc-400`) | Footers, timestamps, placeholders |
| Danger | `#DC2626` / `#EF4444` | Error banners, warning tags |

### 4.2 Typography & Iconography
- **Typography:** Sans-serif with clear weight hierarchy: Bold (700) for titles, Semibold (600) for section headers and buttons, Medium (500) for badges, Regular (400) for body copy.
- **Iconography:** Lucide Icons (Dumbbell, Utensils, Calendar, ShoppingBag, Sparkles, Clock, Compass, ShieldCheck, Moon, Droplets, Activity, Smile, ArrowRight, ChevronRight, Check, X).

---

## 5. Mobile Adaptation Strategy (React Native)

To deliver a truly native Android experience rather than a shrunk-down website:
1. **Navigation:** Native Android Bottom Navigation for the core sections (Overview, Workout, Diet, Schedule, Assistant) paired with Stack Navigation for onboarding, modals, and detail screens.
2. **Header & Status Bar:** Native Android status bar configuration with light/dark icons matching the crisp `#FAFAFA` background.
3. **Card Layouts:** Rounded native cards (`borderRadius: 16`), touchable feedback with Android ripple effects, and subtle shadow elevation.
4. **Modals & Drawers:** Native bottom sheets and full-screen modals with smooth Android enter/exit animations and hardware back-button dismiss.
5. **Session Persistence:** Fast local storage via `AsyncStorage` to persist the user's profile and generated plan between app sessions.
6. **Network Layer:** Configurable base URL supporting Android emulator (`10.0.2.2`), LAN device debugging (`192.168.x.x`), and remote production.
7. **Offline Resilience:** Graceful error cards, retry mechanisms, and local fallback data so the app remains responsive even without an active internet connection.

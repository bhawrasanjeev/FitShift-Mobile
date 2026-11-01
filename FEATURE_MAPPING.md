# FitShift Feature Mapping (Website to Android Mobile)

> **Document Type:** Feature Parity & Implementation Matrix  
> **Source Platform:** React Web Application (`FitShift/client`)  
> **Target Platform:** React Native Android Application (`lr`)  
> **Date:** November 2026  

---

## 1. Complete Feature Mapping Matrix

| # | Website Feature | Existing Backend / API / Source | Mobile Implementation | Status |
|:---|:---|:---|:---|:---|
| 1 | **Brand Identity & Landing View** | Static hero, value pillars, Indian food highlights, CTA button (`LandingPage.tsx`) | Native welcome screen with animated CTA, brand mark, key value props, and instant "Build Plan" trigger | Pending |
| 2 | **Authentication & Session Persistence** | Frictionless philosophy (no server auth wall; state held in React root) | Local mobile session persistence (`AsyncStorage`) to retain user profile and plan across app launches, with plan reset/edit support | Pending |
| 3 | **Onboarding Step 1: Personal Basics** | Client form (`PersonalBasicsStep.tsx`) mapping to `/api/nutrition/calculate` | Mobile form with numeric input validation for age, gender, height (cm), weight (kg), and goal | Pending |
| 4 | **Onboarding Step 2: Daily Rhythm** | Client form (`DailyRhythmStep.tsx`) mapping to schedule and diet services | Native picker cards for occupation, transit departure/return times, sleep hours, wake-up time, and activity level | Pending |
| 5 | **Onboarding Step 3: Training Setup** | Client form (`TrainingSetupStep.tsx`) mapping to `/api/workouts/generate` | Native segmented cards for Home vs Gym, duration (20, 30, 45, 60m), preferred time, weekly frequency (3–6d), experience level, and equipment | Pending |
| 6 | **Onboarding Step 4: Food Preferences** | Client form (`FoodPreferencesStep.tsx`) mapping to `/api/diet/optimize` | Multi-select chips for diet type (`pure_veg`, `eggetarian`, `non_veg`), cooking situation, meals/day (3–5), regional style, avoided foods, and allergies | Pending |
| 7 | **Onboarding Step 5: Daily Budget** | Client form (`BudgetStep.tsx`) mapping to `/api/diet/optimize` | Native budget selection cards (Ultra-Budget ₹50, Budget ₹75, Moderate ₹110, Custom ₹/day) | Pending |
| 8 | **Onboarding Step 6: Supplements** | Client form (`SupplementsStep.tsx`) mapping to `/api/diet/optimize` | Food-first default (`no_supplements`), open to supplements, or unsure, with optional monthly budget | Pending |
| 9 | **Onboarding Step 7: Summary Review** | Client review (`ReviewStep.tsx`) with granular edit step jumps | Mobile summary card with collapsible sections, step jump links, and animated "Generate Plan" action | Pending |
| 10 | **Core Nutrition Engine** | `POST /api/nutrition/calculate` (Mifflin-St Jeor BMR, TDEE, Calorie Target, Protein Target) | Centralized API client call with typed response and target dashboard card | Pending |
| 11 | **Budget Diet Optimizer** | `POST /api/diet/optimize` (Greedy budget optimizer, 50g soya cap, serving bounds) | Centralized API client call returning optimized staple food combination and affordability status | Pending |
| 12 | **Overview Dashboard** | Greeting, macro targets, daily previews, late/tired button (`OverviewTab.tsx`) | Mobile Dashboard screen with progress rings, target metrics, quick-action cards, and shortcuts | Pending |
| 13 | **"Late / Tired Today" Routine** | 15-minute gentle recovery modal (`LateTiredModal.tsx`) | Native bottom sheet / modal with gentle mobility routine and circadian sleep recommendation | Pending |
| 14 | **Fast Inline Plan Editing** | Inline editor modal (`EditPlanModal.tsx`) | Native modal allowing instant adjustment of goal, budget, duration, and environment without re-onboarding | Pending |
| 15 | **Deterministic 7-Day Workout Split** | `POST /api/workouts/generate` & `GET /api/workouts` (`workoutGenerator.js`) | Mobile Workout screen with interactive day split tabs, muscle focus headers, and duration indicators | Pending |
| 16 | **Home vs Gym Environment Toggle** | Segmented toggle in `WorkoutPlan.tsx` | Mobile segmented control switching between bodyweight/calisthenics and gym machine/barbell movements | Pending |
| 17 | **Exercise Card & Thumbnail Media** | `ExerciseCard.tsx` loading remote CDN images (`free-exercise-db`) with fallback | Native image component with CDN loader, fallback placeholder, sets/reps, target muscle badge, and action buttons | Pending |
| 18 | **Exercise Details Modal** | Detailed modal (`ExerciseDetailsModal.tsx`) with instructions, mistakes, equipment | Native bottom sheet / screen with step-by-step instructions, caution warnings, and alternative exercise cards | Pending |
| 19 | **Exercise Alternative Swapping** | In-place exercise swap preserving full metadata | Instant 1-tap exercise substitution within the active workout session | Pending |
| 20 | **Daily Meal Courses (Diet Plan)** | Daily meal cards (`DietPlan.tsx`, `MealCard.tsx`) with prep times and cooking tips | Mobile Diet screen with Breakfast, Lunch, Evening Snack, Dinner cards, ingredients, and macros | Pending |
| 21 | **Meal Alternative Swapping** | Swap modal (`MealAlternativesModal.tsx`) with macro/cost diffs | Native modal presenting alternative Indian meal options with protein, calorie, and cost comparisons | Pending |
| 22 | **7-Day Meal Plan Variations** | 7-day meal breakdown in `DietPlanData` | Mobile swipeable / tabbed 7-day meal schedule preventing dietary monotony | Pending |
| 23 | **Consolidated Weekly Grocery List** | Categorized grocery list (`GroceryList.tsx`) with clipboard copy | Native categorized list with interactive checkmarks, estimated costs, and Android clipboard sharing | Pending |
| 24 | **Supplements & Whole-Food Advisory** | Economic analysis & supplement guide (`SupplementsView.tsx`) | Mobile advisory screen comparing ₹/gram protein across Indian whole foods vs supplements | Pending |
| 25 | **Chronological 24-Hour Daily Schedule** | Timeline mapping wake, meals, transit, workout, and sleep (`DailyScheduleView.tsx`) | Native timeline view with icons, status badges, and duration chips | Pending |
| 26 | **Lifestyle & Recovery Advisory** | Sleep, hydration, desk posture, mobility guide (`RecoveryView.tsx`) | Native recovery cards with actionable daily health rituals and ergonomic resets | Pending |
| 27 | **AI Assistant Chat Interface** | `GET /api/ai/status` & `POST /api/ai/chat` (`AIAssistantPage.tsx`) | Mobile chat screen with message bubbles, auto-scrolling, clear chat, and copy-to-clipboard | Pending |
| 28 | **AI Plan Context Injection** | Context toggle in `ContextToggle.tsx` passing active user metrics | Mobile toggle injecting user goal, environment, diet, budget, and workout duration into prompt | Pending |
| 29 | **AI Suggested Prompts & Follow-ups** | Categorized starter chips (`SuggestedPrompts.tsx`) & follow-ups | Horizontal scrolling question chips for quick 1-tap inquiries | Pending |
| 30 | **Bottom Tab Navigation** | Responsive sidebar on web (`AppSidebar.tsx`) | Native Android Bottom Navigation bar with 5 primary tabs: Dashboard, Workout, Diet, Schedule, Assistant | Pending |
| 31 | **Error Handling & Offline States** | Web inline error banners and reload buttons | Native offline alerts, retry buttons, and friendly error states | Pending |
| 32 | **Configurable API Endpoint** | Vite env proxy (`VITE_API_URL`) | Configurable mobile API client supporting Android emulator (`10.0.2.2`), LAN IP, and production | Pending |

---

## 2. Navigation Architecture for Android

The mobile application will adopt the standard Android navigation model:
- **Bottom Navigation Tabs:**
  1. 🏠 **Overview (Dashboard):** Key targets, today's workout, today's meals, late/tired mode trigger.
  2. 🏋️ **Workout:** 7-day split, exercises, sets/reps, exercise details modal, alternative swap, home/gym toggle.
  3. 🥗 **Diet:** Daily meals, 7-day meal plan, meal swap modal, grocery list, supplement comparison.
  4. ⏱️ **Schedule:** 24-hour chronological daily routine, recovery pillars, lifestyle tips.
  5. 🤖 **AI Coach:** Interactive AI chat with context injection and suggested prompts.
- **Top / Header Actions:**
  - Fast "Edit Plan" modal launcher.
  - "Late / Tired Today" quick-toggle badge.
  - Connection status indicator.
- **Onboarding Flow:**
  - Launch / Welcome Screen.
  - 7-Step Wizard with native animated progress bar, back navigation, and input validation.
  - Plan Generation Loader.

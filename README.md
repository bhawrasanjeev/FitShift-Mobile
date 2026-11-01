# FitShift Android Application (React Native)

> **Official Mobile Client for FitShift**  
> *Routine-first, budget-realistic fitness and nutrition built for real Indian lifestyles.*

---

## 🌟 Overview

FitShift Mobile is a production-quality Android application developed using **React Native 0.88** and **TypeScript**. It connects directly to the existing FitShift Express backend and dataset engine, translating deterministic nutrition algorithms and calisthenics training splits into a polished mobile experience.

### Core Principles
- **"Planning, Not Tracking"**: No fake calorie counters, food weight tracking, or streak anxiety.
- **Zero Login Walls**: Instant offline storage with local caching via `@react-native-async-storage/async-storage`.
- **Authentic Indian Grocery Economics**: Whole-food optimization (Chana Sattu, Yellow Moong, Kala Chana, Curd, Paneer) within daily budget constraints.
- **Deterministic Workouts**: Split routines for both Home (calisthenics/bands) and Commercial Gym with real CDN exercise demonstrations (`free-exercise-db`).

---

## 📱 Application Architecture & Features

### 1. Welcome & Onboarding Wizard
- **Brand Hero:** FitShift Dumbbell Engine logo mark with emerald brand styling (`#15803D`).
- **7-Step Onboarding:**
  1. Personal Basics (Age, Gender, Height, Weight, Goal)
  2. Daily Rhythm (Occupation, Transit schedule, Sleep hours, Activity level)
  3. Training Setup (Home vs. Gym, Duration, Frequency, Equipment)
  4. Food Preferences (Diet type, Cooking setup, Meals/day, Indian cuisine style)
  5. Daily Budget (Ultra-Budget <₹45, Budget ₹45–₹80, Moderate ₹80–₹150, Custom)
  6. Supplement Philosophy (Food-first default, Open, Unsure)
  7. Review & Summary with step-editing anchors

### 2. Dashboard & Navigation
- **Native Android Bottom Navigation:**
  - 🏠 **Overview:** Daily calorie target, protein minimum, BMR/TDEE breakdown, today's workout preview, and today's meal preview.
  - 🏋️ **Workout:** 7-day split rotation, interactive exercise cards, and rest day guidance.
  - 🥗 **Diet:** Daily Indian meal courses, macro allocation, and grocery economics.
  - ⏱️ **Schedule:** 24-hour chronological timeline anchored to transit and work blocks.
  - 🤖 **AI Coach:** Context-aware fitness assistance connecting to `/api/ai/chat`.
- **Recovery & Editing Overlays:**
  - **Late / Tired Today:** 15-minute gentle mobility routine and sleep shift advice.
  - **Inline Edit Plan:** Fast adjustments to environment, duration, weekly frequency, diet, and budget.

### 3. Workout & Exercise Module
- **7-Day Split Rotation:** Monday through Sunday tabs with volume badges (`5 Ex`) and rest indicators.
- **Home vs. Gym Toggle:** Dynamic environment switching with live backend regeneration.
- **CDN Exercise Cards:** Visual demonstration thumbnails loaded from `free-exercise-db`.
- **Exercise Details Modal:** Step-by-step movement instructions, tempo guide, and common form mistakes caution box.
- **1-Tap Exercise Alternative Swapping:** Biomechanically matched substitution preserving volume and target muscle load.
- **Inter-Set Rest Countdown Timer:** Digital countdown with presets (`30s`, `45s`, `60s`, `90s`, `120s`), +/-15s adjustments, and completion vibration.

---

## 🛠️ Project Structure

```text
FitShift-Mobile/
├── android/                         # Android native project (Gradle, Manifest, Resources)
├── src/
│   ├── assets/                      # Brand assets & icons
│   ├── components/
│   │   ├── common/                  # Design system primitives (Button, Card, Badge, etc.)
│   │   ├── fitness/                 # Domain fitness components (ExerciseCard, MacroRing, etc.)
│   │   ├── interactive/             # BottomSheet, Modal, DaySelector, EditPlanModal, etc.
│   │   ├── onboarding/              # 7-Step Mobile Wizard steps & controller
│   │   └── workout/                 # Workout module (EnvironmentToggle, RestTimer, Modals)
│   ├── constants/                   # Initial states and system constants
│   ├── context/                     # PlanContext and ThemeContext
│   ├── navigation/                  # RootNavigator and MainTabNavigator
│   ├── screens/                     # Primary screens (Welcome, Dashboard tabs, Showcases)
│   ├── services/
│   │   ├── api/                     # Dynamic API clients, health, nutrition, diet, workout, AI
│   │   └── storage/                 # AsyncStorage plan persistence
│   ├── theme/                       # Design tokens (colors, typography, spacing, shadows)
│   ├── types/                       # Strict TypeScript models
│   └── utils/                       # Schedule and formatting helpers
├── App.tsx                          # App root bootstrap
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Android Studio & Android SDK (API 30+)
- JDK 17+
- Connected Android device or running Android Emulator

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhawrasanjeev/FitShift-Mobile.git
   cd FitShift-Mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Backend Service Setup:**
   Ensure the existing FitShift Express backend is running on port `5001` (or `5000`):
   ```bash
   # From the FitShift server directory
   npm run dev
   ```

4. **Start Metro Bundler:**
   ```bash
   npm start
   ```

5. **Build and Run on Android:**
   ```bash
   npm run android
   ```

### Connecting to the Backend
- **Android Emulator:** Automatically uses `http://10.0.2.2:5001`.
- **Physical Device:** Update `.env` or use the in-app Developer API Console to configure your computer's local Wi-Fi IP address (e.g. `http://192.168.1.X:5001`).

---

## 🧪 Quality & Verification Commands

- **TypeScript check:**
  ```bash
  npx tsc --noEmit
  ```
- **ESLint check:**
  ```bash
  npm run lint
  ```
- **Android Debug APK build:**
  ```bash
  cd android && ./gradlew assembleDebug
  ```

---

## 📄 License
This project is proprietary and confidential. Developed as part of the FitShift fitness & wellness platform.

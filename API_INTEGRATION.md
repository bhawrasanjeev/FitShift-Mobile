# FitShift Mobile API Integration Specification & Validation Report

> **Document Type:** API Contract, Network Architecture & Validation Results  
> **Backend Service:** Express.js (v5) / Node.js  
> **Active Development Port:** `5001` (primary active port on development machine)  
> **Fallback Development Port:** `5000`  
> **Last Validated:** November 2026 (Phase 3 Completed)  

---

## 1. Mobile Network Environment Configurations

Android devices and emulators operate in different networking sandboxes:

| Environment | Base URL | How to Use / Notes |
|:---|:---|:---|
| **Android Emulator (Active Port)** | `http://10.0.2.2:5001` | **Primary dev preset:** `10.0.2.2` maps to developer host machine. Uses port 5001 (active backend port). |
| **Android Emulator (Standard Port)** | `http://10.0.2.2:5000` | Fallback preset if backend is bound to 5000. `apiClient.ts` will auto-fallback to 5001 if 5000 is unreachable. |
| **Physical Android Device (LAN)** | `http://<DEV_MACHINE_LAN_IP>:5001` | E.g. `http://192.168.1.100:5001`. Phone and development computer must be on the same local Wi-Fi. |
| **Production Backend** | `https://api.fitshift.app` | Deployed SSL production endpoint. |

### 1.1 Physical Device Setup & Host Binding Guide
To connect a physical Android device to your development computer's backend:
1. Ensure both your Android phone and Mac are connected to the same Wi-Fi network.
2. Find your Mac's LAN IP address:
   ```bash
   ipconfig getifaddr en0
   ```
   *(e.g., returns `192.168.1.100`)*
3. In `FitShift/server/.env`, ensure `PORT=5001` (or `PORT=5000`). Express listens on `0.0.0.0` (all network interfaces), so it accepts LAN requests.
4. If macOS firewall is enabled, allow incoming connections to Node.js.
5. In the FitShift mobile app's `ApiValidationConsole`, enter `http://192.168.1.100:5001` into the custom URL input and tap **Apply**. The setting persists in `AsyncStorage`.

### 1.2 Android Cleartext Traffic Configuration
Android 9+ (API 28+) blocks unencrypted HTTP traffic by default.  
In `android/app/src/main/AndroidManifest.xml`, we configured:
```xml
android:usesCleartextTraffic="true"
```
This enables development testing against `http://10.0.2.2:5001` and `http://192.168.*.*:5001` on all Android devices without SSL requirements.

---

## 2. Verified API Endpoints & Real Response Contracts

All 7 backend endpoints have been validated live against the running Express backend.

### 2.1 Server Health Check
- **Endpoint:** `GET /api/health`
- **Method:** `GET`
- **Headers:** `Accept: application/json`
- **Live Response (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "FitShift API is running"
}
```

---

### 2.2 Dataset Availability & Status
- **Endpoint:** `GET /api/data/status`
- **Method:** `GET`
- **Headers:** `Accept: application/json`
- **Live Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "datasets": {
      "exercises": {
        "available": true,
        "recordCount": 876,
        "valid": true,
        "warnings": []
      },
      "foodPrices": {
        "available": true,
        "recordCount": 36,
        "valid": true,
        "warnings": ["Dataset loaded from alternative filename \"price.csv\" instead of \"price_of_food_items.csv\""]
      },
      "cleanStaples": {
        "available": true,
        "recordCount": 36,
        "valid": true,
        "warnings": []
      },
      "nutrition": {
        "available": true,
        "recordCount": 1014,
        "valid": true,
        "warnings": ["82 dish record(s) have missing optional Vitamin C (mg) values"]
      }
    }
  }
}
```

---

### 2.3 Calculate Nutrition Targets
- **Endpoint:** `POST /api/nutrition/calculate`
- **Method:** `POST`
- **Request Body:**
```json
{
  "age": 22,
  "gender": "male",
  "heightCm": 178,
  "weightKg": 70,
  "goal": "muscle_gain",
  "activityLevel": "moderate"
}
```
- **Validation Rules:**
  - `age`: integer (14 to 100)
  - `gender`: `"male"` | `"female"`
  - `heightCm`: integer (100 to 250)
  - `weightKg`: number (30 to 300)
  - `goal`: `"muscle_gain"` | `"fat_loss"` | `"maintenance"` *(Note: mobile client automatically normalizes `"weight_loss"` to `"fat_loss"`)*
  - `activityLevel`: `"sedentary"` | `"light"` | `"moderate"` | `"very_active"`
- **Live Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "bmr": 1708,
    "tdee": 2647,
    "goal": "muscle_gain",
    "calorieTarget": 2947,
    "proteinTargetGrams": 119,
    "activityLevel": "moderate"
  }
}
```

---

### 2.4 Budget Diet Optimization
- **Endpoint:** `POST /api/diet/optimize`
- **Method:** `POST`
- **Request Body:**
```json
{
  "nutrition": {
    "calorieTarget": 2947,
    "proteinTargetGrams": 119
  },
  "dietType": "vegetarian",
  "foodBudget": 80,
  "supplementPreference": "no_supplements"
}
```
- **Validation Rules:**
  - `nutrition.calorieTarget`: required number (500 to 10,000)
  - `nutrition.proteinTargetGrams`: required number (20 to 500)
  - `foodBudget`: required number (10 to 5,000)
  - `dietType`: `"vegetarian"` | `"eggetarian"` | `"non_vegetarian"` *(Mobile client maps `"pure_veg"` -> `"vegetarian"`, `"non_veg"` -> `"non_vegetarian"`)*
  - `supplementPreference`: `"no_supplements"` | `"open_to_supplements"` | `"unsure"` *(Mobile client maps `"not_sure"` -> `"unsure"`)*
- **Live Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "feasible": true,
    "budget": {
      "dailyLimit": 80,
      "estimatedCost": 79
    },
    "protein": {
      "targetGrams": 119,
      "achievedGrams": 120,
      "gapGrams": 0
    },
    "foods": [
      { "name": "Soya Chunks", "quantityGrams": 50, "estimatedCost": 7, "proteinGrams": 26 },
      { "name": "Kala Chana", "quantityGrams": 100, "estimatedCost": 10, "proteinGrams": 20 },
      { "name": "Yellow Moong Dal (Raw)", "quantityGrams": 100, "estimatedCost": 13, "proteinGrams": 24 },
      { "name": "Chana Sattu", "quantityGrams": 60, "estimatedCost": 9, "proteinGrams": 15 },
      { "name": "Raw Peanuts", "quantityGrams": 50, "estimatedCost": 8, "proteinGrams": 13 },
      { "name": "Double Toned Milk", "quantityGrams": 500, "estimatedCost": 27, "proteinGrams": 17 },
      { "name": "Roasted Chana (Bhuna)", "quantityGrams": 30, "estimatedCost": 5, "proteinGrams": 6 }
    ],
    "meals": [
      {
        "id": "meal-breakfast",
        "mealType": "breakfast",
        "title": "Power Breakfast",
        "totalProteinGrams": 22,
        "estimatedCost": 17,
        "items": [
          { "name": "Chana Sattu", "quantityGrams": 60, "proteinGrams": 15, "estimatedCost": 9, "category": "Legumes" },
          { "name": "Rolled Oats", "quantityGrams": 50, "proteinGrams": 7, "estimatedCost": 8, "category": "Grains" }
        ]
      }
    ],
    "groceryList": [
      {
        "id": "grocery-1",
        "name": "Chana Sattu",
        "category": "Legumes",
        "weeklyQuantity": "420 g",
        "weeklyGrams": 420,
        "estimatedWeeklyCost": 63,
        "estimatedDailyCost": 9,
        "checked": false
      }
    ],
    "mealTimings": [
      { "time": "5:20 AM", "meal": "Pre-workout", "description": "Quick-release glycogen fuel" },
      { "time": "7:15 AM", "meal": "Post-workout breakfast", "description": "High-protein recovery" }
    ],
    "sevenDayMealPlan": [
      { "dayNumber": 1, "dayName": "Monday", "focusTitle": "High-Protein Vegetarian Kickoff", "meals": [] }
    ],
    "budgetManagement": {
      "headline": "How to manage your ₹80 daily budget",
      "description": "You do not need expensive foods. Spend more on affordable protein sources.",
      "guidelines": []
    }
  }
}
```

---

### 2.5 Deterministic Workout Plan Generation
- **Endpoint:** `POST /api/workouts/generate` (also supports `GET /api/workouts`)
- **Method:** `POST`
- **Request Body:**
```json
{
  "gender": "male",
  "environment": "home",
  "durationMinutes": 45,
  "weeklyFrequencyDays": 4,
  "experienceLevel": "intermediate",
  "goal": "muscle_gain"
}
```
- **Validation Rules:**
  - `gender`: `"male"` | `"female"`
  - `environment`: `"home"` | `"gym"`
  - `durationMinutes`: `20` | `30` | `45` | `60`
  - `weeklyFrequencyDays`: `3` | `4` | `5` | `6`
  - `experienceLevel`: `"beginner"` | `"intermediate"` | `"advanced"` | `"expert"`
  - `goal`: `"muscle_gain"` | `"fat_loss"` | `"weight_loss"` | `"maintenance"`
- **Live Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "gender": "male",
    "environment": "home",
    "durationMinutes": 45,
    "weeklyFrequencyDays": 4,
    "experienceLevel": "intermediate",
    "goal": "muscle_gain",
    "days": [
      {
        "dayNumber": 1,
        "dayName": "Monday",
        "focus": "Chest & Triceps (Push Synergy)",
        "isRestDay": false,
        "estimatedMinutes": 45,
        "exercises": [
          {
            "id": "Bench_Press_-_With_Bands",
            "name": "Bench Press - With Bands",
            "targetMuscle": "chest",
            "setsReps": "3-4 sets × 8–10 reps",
            "restSeconds": 90,
            "environment": "home",
            "equipment": "bands",
            "thumbnailUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Press_-_With_Bands/0.jpg",
            "instructions": ["Using a flat bench...", "Extend your arms..."],
            "commonMistakes": ["Rushing eccentric phase"],
            "alternative": {
              "id": "Decline_Push-Up",
              "name": "Decline Push-Up",
              "targetMuscle": "chest",
              "environment": "home",
              "equipment": "body only",
              "note": "Substitutes directly for Bench Press - With Bands targeting chest.",
              "thumbnailUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Push-Up/0.jpg"
            }
          }
        ]
      }
    ]
  }
}
```

---

### 2.6 AI Assistant Status Check
- **Endpoint:** `GET /api/ai/status`
- **Method:** `GET`
- **Live Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "configured": true,
    "provider": "gemini"
  }
}
```

---

### 2.7 AI Assistant Chat Query
- **Endpoint:** `POST /api/ai/chat`
- **Method:** `POST`
- **Request Body:**
```json
{
  "query": "What are the cheapest Indian vegetarian protein sources?",
  "context": {
    "goal": "muscle_gain",
    "environment": "home",
    "diet": "vegetarian",
    "dailyBudget": 75,
    "durationMinutes": 45
  }
}
```
- **Live Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "reply": "Here are top budget-friendly Indian protein sources:\n1. Soya Chunks (52g protein per 100g at ~₹16)\n2. Chana Sattu (20g protein per 100g at ~₹15)\n3. Kala Chana (19g protein per 100g at ~₹10)\n4. Moong Dal (24g protein per 100g at ~₹13)",
    "response": "Here are top budget-friendly Indian protein sources...",
    "provider": "gemini",
    "timestamp": "2026-11-01T17:56:39.429Z"
  }
}
```

---

## 3. Negative Testing & Resilient Error Handling

| Scenario | Payload Sent | Expected Response | Actual Live Response | Handled by Client |
|:---|:---|:---|:---|:---:|
| Invalid Age | `{"age": 5}` | HTTP 400 Bad Request | `HTTP 400` ("Age must be between 14 and 100") | Yes (`ApiError` with message) |
| Invalid Budget | `{"foodBudget": -10}` | HTTP 400 Bad Request | `HTTP 400` ("foodBudget must be positive") | Yes (`ApiError` with message) |
| Empty AI Query | `{"query": ""}` | HTTP 400 Bad Request | `HTTP 400` ("Query string is required") | Yes (`ApiError` with message) |
| Port 5000 Unreachable | Request to `:5000` | Auto-fallback to `:5001` | Falls back to `:5001` and connects | Yes (`apiClient.ts` fallback) |
| Network Offline | Device in Airplane Mode | Friendly error banner | Displays `OfflineStatusBanner` with cached plan | Yes (`PlanStorage` cache) |

---

## 4. Backend Integrity Confirmation
The existing FitShift backend test suite (`FitShift/server/tests`) was executed during Phase 3 verification:
- **154 passing tests** across 51 test suites.
- 0 failures, 0 regressions.
- No changes made to backend business logic or security rules.

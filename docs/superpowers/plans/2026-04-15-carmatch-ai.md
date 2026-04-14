# CarMatch AI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack AI car advisor that takes 4 lifestyle questions + optional Quick Start personas, calls Gemini to shortlist 3 Indian cars, and shows results with an emotional "why this fits you" hook per car.

**Architecture:** Next.js App Router with a single `/api/recommend` route that receives wizard answers, builds a structured Gemini prompt using the vibe-to-spec mapping, and returns 3 car recommendations with emotional hooks. State flows from Wizard → URL params → Results page. No DB — static `cars.json` of 40 Indian cars passed to Gemini in the prompt.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Gemini 1.5 Flash API, Vercel deploy

---

## File Map

| File | Responsibility |
|---|---|
| `app/page.tsx` | Landing hero + QuickStart buttons + Wizard container |
| `app/results/page.tsx` | Reads URL params, calls `/api/recommend`, renders car cards |
| `app/api/recommend/route.ts` | Receives answers, builds Gemini prompt, returns 3 cars |
| `app/layout.tsx` | Root layout with font + metadata |
| `app/globals.css` | Tailwind directives + CSS variables |
| `components/QuickStart.tsx` | 3 persona shortcut buttons |
| `components/Wizard.tsx` | Orchestrates 4 wizard steps, manages state |
| `components/WizardStep.tsx` | Single question with 4 tappable option cards |
| `components/CarCard.tsx` | Result card: name, price, specs, emotional hook |
| `data/cars.json` | 40 Indian cars with specs |
| `lib/gemini.ts` | Gemini client init + prompt builder function |
| `types/index.ts` | Shared TS types: WizardAnswers, CarRecommendation |
| `.env.local` | GEMINI_API_KEY |

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `/Users/cryptobulla/Desktop/cardekho-ai-advisor/` (project root)

- [ ] **Step 1: Scaffold Next.js with TypeScript + Tailwind + App Router**

```bash
cd /Users/cryptobulla/Desktop
npx create-next-app@latest cardekho-ai-advisor \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-eslint
cd cardekho-ai-advisor
```

- [ ] **Step 2: Install shadcn/ui + Gemini SDK**

```bash
npx shadcn@latest init -d
npx shadcn@latest add button card badge progress
npm install @google/generative-ai
```

- [ ] **Step 3: Create .env.local**

```bash
echo 'GEMINI_API_KEY=AIzaSyBmmOx6uIVrPYNyD0lx6xISXcVw4Fsyj4I' > .env.local
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```
Expected: `ready - started server on 0.0.0.0:3000`

- [ ] **Step 5: Init git and connect to GitHub**

```bash
git init
git remote add origin https://github.com/SKYDARTIST/cardekho-ai-advisor.git
git add .
git commit -m "feat: scaffold Next.js project"
git branch -M main
git push -u origin main
```

---

## Task 2: Types + Cars Dataset

**Files:**
- Create: `types/index.ts`
- Create: `data/cars.json`

- [ ] **Step 1: Create shared TypeScript types**

Create `types/index.ts`:

```typescript
export type DriveType = 'city' | 'highway' | 'both'
export type PassengerType = 'solo' | 'family' | 'couple' | 'pets'
export type VibeType = 'safe' | 'sharp' | 'smart' | 'arrived'
export type BudgetType = 'under8' | '8to15' | '15to25' | 'above25'

export interface WizardAnswers {
  drive: DriveType
  passengers: PassengerType
  vibe: VibeType
  budget: BudgetType
}

export interface CarSpec {
  id: string
  make: string
  model: string
  variant: string
  priceMin: number   // in lakhs
  priceMax: number   // in lakhs
  bodyType: 'hatchback' | 'sedan' | 'suv' | 'mpv' | 'pickup'
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng'
  mileage: number    // kmpl (0 for EV)
  bootSpace: number  // litres
  ncapRating: number // 0-5
  groundClearance: number // mm
  seatingCapacity: number
  features: string[] // ['sunroof', 'adas', 'wireless_charging', etc.]
  priceLabel: string // display string e.g. "₹8.1L – ₹15.5L"
}

export interface CarRecommendation {
  car: CarSpec
  rank: 1 | 2 | 3
  emotionalHook: string   // AI-generated "why this fits you" sentence
  matchReasons: string[]  // 2-3 spec-level bullet points
}

export interface RecommendResponse {
  recommendations: CarRecommendation[]
  summaryLine: string   // "Based on your lifestyle: family, city driving, safety-first, ₹8–15L"
}
```

- [ ] **Step 2: Create cars.json dataset**

Create `data/cars.json`:

```json
[
  {
    "id": "tata-nexon",
    "make": "Tata",
    "model": "Nexon",
    "variant": "XZ+ (S)",
    "priceMin": 8.1,
    "priceMax": 15.5,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 17,
    "bootSpace": 350,
    "ncapRating": 5,
    "groundClearance": 209,
    "seatingCapacity": 5,
    "features": ["sunroof", "adas", "wireless_charging", "ventilated_seats"],
    "priceLabel": "₹8.1L – ₹15.5L"
  },
  {
    "id": "tata-nexon-ev",
    "make": "Tata",
    "model": "Nexon EV",
    "variant": "Long Range",
    "priceMin": 14.74,
    "priceMax": 19.94,
    "bodyType": "suv",
    "fuelType": "electric",
    "mileage": 0,
    "bootSpace": 350,
    "ncapRating": 5,
    "groundClearance": 209,
    "seatingCapacity": 5,
    "features": ["sunroof", "adas", "wireless_charging", "fast_charging"],
    "priceLabel": "₹14.7L – ₹19.9L"
  },
  {
    "id": "hyundai-creta",
    "make": "Hyundai",
    "model": "Creta",
    "variant": "SX(O)",
    "priceMin": 11,
    "priceMax": 20.15,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 16.8,
    "bootSpace": 433,
    "ncapRating": 5,
    "groundClearance": 190,
    "seatingCapacity": 5,
    "features": ["panoramic_sunroof", "adas", "wireless_charging", "bose_sound"],
    "priceLabel": "₹11L – ₹20.2L"
  },
  {
    "id": "maruti-grand-vitara",
    "make": "Maruti Suzuki",
    "model": "Grand Vitara",
    "variant": "Alpha+ Hybrid",
    "priceMin": 10.7,
    "priceMax": 19.99,
    "bodyType": "suv",
    "fuelType": "hybrid",
    "mileage": 27.97,
    "bootSpace": 373,
    "ncapRating": 3,
    "groundClearance": 185,
    "seatingCapacity": 5,
    "features": ["sunroof", "hybrid_engine", "wireless_charging", "heads_up_display"],
    "priceLabel": "₹10.7L – ₹20L"
  },
  {
    "id": "mahindra-xuv300",
    "make": "Mahindra",
    "model": "XUV300",
    "variant": "W8(O)",
    "priceMin": 8.41,
    "priceMax": 14.38,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 17,
    "bootSpace": 257,
    "ncapRating": 5,
    "groundClearance": 180,
    "seatingCapacity": 5,
    "features": ["sunroof", "dual_airbags", "wireless_charging"],
    "priceLabel": "₹8.4L – ₹14.4L"
  },
  {
    "id": "mahindra-thar",
    "make": "Mahindra",
    "model": "Thar",
    "variant": "LX Hard Top",
    "priceMin": 13.99,
    "priceMax": 17.6,
    "bodyType": "suv",
    "fuelType": "diesel",
    "mileage": 15.2,
    "bootSpace": 0,
    "ncapRating": 4,
    "groundClearance": 226,
    "seatingCapacity": 4,
    "features": ["4wd", "rock_crawl_mode", "adventure_mode", "removable_roof"],
    "priceLabel": "₹14L – ₹17.6L"
  },
  {
    "id": "maruti-jimny",
    "make": "Maruti Suzuki",
    "model": "Jimny",
    "variant": "Zeta",
    "priceMin": 12.74,
    "priceMax": 15.05,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 16.94,
    "bootSpace": 208,
    "ncapRating": 3,
    "groundClearance": 210,
    "seatingCapacity": 4,
    "features": ["4wd", "allgrip_pro", "hill_hold", "adventure_mode"],
    "priceLabel": "₹12.7L – ₹15L"
  },
  {
    "id": "kia-seltos",
    "make": "Kia",
    "model": "Seltos",
    "variant": "GTX+ DCT",
    "priceMin": 10.89,
    "priceMax": 20.35,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 16.5,
    "bootSpace": 433,
    "ncapRating": 3,
    "groundClearance": 190,
    "seatingCapacity": 5,
    "features": ["panoramic_sunroof", "bose_sound", "adas", "wireless_charging", "ambient_lighting"],
    "priceLabel": "₹10.9L – ₹20.4L"
  },
  {
    "id": "honda-city",
    "make": "Honda",
    "model": "City",
    "variant": "ZX CVT",
    "priceMin": 11.77,
    "priceMax": 16.35,
    "bodyType": "sedan",
    "fuelType": "petrol",
    "mileage": 18.4,
    "bootSpace": 506,
    "ncapRating": 4,
    "groundClearance": 165,
    "seatingCapacity": 5,
    "features": ["sunroof", "adas", "wireless_charging", "lane_watch"],
    "priceLabel": "₹11.8L – ₹16.4L"
  },
  {
    "id": "maruti-swift",
    "make": "Maruti Suzuki",
    "model": "Swift",
    "variant": "ZXi+",
    "priceMin": 6.49,
    "priceMax": 9.64,
    "bodyType": "hatchback",
    "fuelType": "petrol",
    "mileage": 24.8,
    "bootSpace": 268,
    "ncapRating": 3,
    "groundClearance": 163,
    "seatingCapacity": 5,
    "features": ["sunroof", "360_camera", "wireless_charging"],
    "priceLabel": "₹6.5L – ₹9.6L"
  },
  {
    "id": "hyundai-i20",
    "make": "Hyundai",
    "model": "i20",
    "variant": "Asta(O) Turbo",
    "priceMin": 7.04,
    "priceMax": 13.5,
    "bodyType": "hatchback",
    "fuelType": "petrol",
    "mileage": 20.35,
    "bootSpace": 311,
    "ncapRating": 3,
    "groundClearance": 174,
    "seatingCapacity": 5,
    "features": ["sunroof", "bose_sound", "wireless_charging", "adas"],
    "priceLabel": "₹7L – ₹13.5L"
  },
  {
    "id": "tata-punch",
    "make": "Tata",
    "model": "Punch",
    "variant": "Accomplished+",
    "priceMin": 6,
    "priceMax": 9.54,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 18.97,
    "bootSpace": 366,
    "ncapRating": 5,
    "groundClearance": 187,
    "seatingCapacity": 5,
    "features": ["adas", "wireless_charging", "terrain_modes"],
    "priceLabel": "₹6L – ₹9.5L"
  },
  {
    "id": "tata-punch-ev",
    "make": "Tata",
    "model": "Punch EV",
    "variant": "Long Range Empowered+",
    "priceMin": 10.99,
    "priceMax": 15.49,
    "bodyType": "suv",
    "fuelType": "electric",
    "mileage": 0,
    "bootSpace": 366,
    "ncapRating": 5,
    "groundClearance": 187,
    "seatingCapacity": 5,
    "features": ["adas", "wireless_charging", "fast_charging", "v2l"],
    "priceLabel": "₹11L – ₹15.5L"
  },
  {
    "id": "mg-zs-ev",
    "make": "MG",
    "model": "ZS EV",
    "variant": "Excite Pro",
    "priceMin": 18.98,
    "priceMax": 25.2,
    "bodyType": "suv",
    "fuelType": "electric",
    "mileage": 0,
    "bootSpace": 448,
    "ncapRating": 5,
    "groundClearance": 177,
    "seatingCapacity": 5,
    "features": ["panoramic_sunroof", "adas", "wireless_charging", "v2l", "ambient_lighting"],
    "priceLabel": "₹19L – ₹25.2L"
  },
  {
    "id": "mahindra-xuv400",
    "make": "Mahindra",
    "model": "XUV400 EV",
    "variant": "EC Pro",
    "priceMin": 15.49,
    "priceMax": 19.19,
    "bodyType": "suv",
    "fuelType": "electric",
    "mileage": 0,
    "bootSpace": 378,
    "ncapRating": 5,
    "groundClearance": 200,
    "seatingCapacity": 5,
    "features": ["sunroof", "adas", "fast_charging", "wireless_charging"],
    "priceLabel": "₹15.5L – ₹19.2L"
  },
  {
    "id": "toyota-innova-hycross",
    "make": "Toyota",
    "model": "Innova HyCross",
    "variant": "GX Hybrid",
    "priceMin": 18.9,
    "priceMax": 28.97,
    "bodyType": "mpv",
    "fuelType": "hybrid",
    "mileage": 21.1,
    "bootSpace": 300,
    "ncapRating": 5,
    "groundClearance": 185,
    "seatingCapacity": 7,
    "features": ["panoramic_sunroof", "captain_seats", "adas", "wireless_charging", "ottoman_seats"],
    "priceLabel": "₹18.9L – ₹29L"
  },
  {
    "id": "maruti-ertiga",
    "make": "Maruti Suzuki",
    "model": "Ertiga",
    "variant": "ZXi+",
    "priceMin": 8.69,
    "priceMax": 13.7,
    "bodyType": "mpv",
    "fuelType": "petrol",
    "mileage": 20.3,
    "bootSpace": 209,
    "ncapRating": 3,
    "groundClearance": 185,
    "seatingCapacity": 7,
    "features": ["sunroof", "wireless_charging", "captain_seats"],
    "priceLabel": "₹8.7L – ₹13.7L"
  },
  {
    "id": "mahindra-xuv700",
    "make": "Mahindra",
    "model": "XUV700",
    "variant": "AX7 L",
    "priceMin": 13.99,
    "priceMax": 26.99,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 14.98,
    "bootSpace": 600,
    "ncapRating": 5,
    "groundClearance": 200,
    "seatingCapacity": 7,
    "features": ["panoramic_sunroof", "adas", "adrenox", "wireless_charging", "7seats"],
    "priceLabel": "₹14L – ₹27L"
  },
  {
    "id": "skoda-slavia",
    "make": "Skoda",
    "model": "Slavia",
    "variant": "Style TSI AT",
    "priceMin": 11.49,
    "priceMax": 19.99,
    "bodyType": "sedan",
    "fuelType": "petrol",
    "mileage": 19.06,
    "bootSpace": 521,
    "ncapRating": 5,
    "groundClearance": 179,
    "seatingCapacity": 5,
    "features": ["sunroof", "ventilated_seats", "wireless_charging", "adas"],
    "priceLabel": "₹11.5L – ₹20L"
  },
  {
    "id": "volkswagen-virtus",
    "make": "Volkswagen",
    "model": "Virtus",
    "variant": "GT Plus DSG",
    "priceMin": 11.56,
    "priceMax": 19.41,
    "bodyType": "sedan",
    "fuelType": "petrol",
    "mileage": 19.89,
    "bootSpace": 521,
    "ncapRating": 5,
    "groundClearance": 179,
    "seatingCapacity": 5,
    "features": ["sunroof", "ventilated_seats", "wireless_charging", "adas"],
    "priceLabel": "₹11.6L – ₹19.4L"
  },
  {
    "id": "hyundai-exter",
    "make": "Hyundai",
    "model": "Exter",
    "variant": "SX(O) Connect",
    "priceMin": 6,
    "priceMax": 10.2,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 19.2,
    "bootSpace": 391,
    "ncapRating": 3,
    "groundClearance": 185,
    "seatingCapacity": 5,
    "features": ["sunroof", "wireless_charging", "adas"],
    "priceLabel": "₹6L – ₹10.2L"
  },
  {
    "id": "renault-kwid",
    "make": "Renault",
    "model": "Kwid",
    "variant": "Climber 1.0 AMT",
    "priceMin": 4.7,
    "priceMax": 6.8,
    "bodyType": "hatchback",
    "fuelType": "petrol",
    "mileage": 22,
    "bootSpace": 279,
    "ncapRating": 0,
    "groundClearance": 184,
    "seatingCapacity": 5,
    "features": ["touchscreen", "reverse_camera"],
    "priceLabel": "₹4.7L – ₹6.8L"
  },
  {
    "id": "maruti-baleno",
    "make": "Maruti Suzuki",
    "model": "Baleno",
    "variant": "Alpha",
    "priceMin": 6.61,
    "priceMax": 9.88,
    "bodyType": "hatchback",
    "fuelType": "petrol",
    "mileage": 22.94,
    "bootSpace": 318,
    "ncapRating": 2,
    "groundClearance": 170,
    "seatingCapacity": 5,
    "features": ["sunroof", "360_camera", "wireless_charging", "heads_up_display"],
    "priceLabel": "₹6.6L – ₹9.9L"
  },
  {
    "id": "toyota-fortuner",
    "make": "Toyota",
    "model": "Fortuner",
    "variant": "4x4 MT",
    "priceMin": 33.43,
    "priceMax": 51.44,
    "bodyType": "suv",
    "fuelType": "diesel",
    "mileage": 13.02,
    "bootSpace": 296,
    "ncapRating": 3,
    "groundClearance": 221,
    "seatingCapacity": 7,
    "features": ["4wd", "sunroof", "downhill_assist", "wireless_charging", "premium_interior"],
    "priceLabel": "₹33.4L – ₹51.4L"
  },
  {
    "id": "hyundai-alcazar",
    "make": "Hyundai",
    "model": "Alcazar",
    "variant": "Platinum(O)",
    "priceMin": 14.99,
    "priceMax": 21.45,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 14.5,
    "bootSpace": 180,
    "ncapRating": 3,
    "groundClearance": 200,
    "seatingCapacity": 6,
    "features": ["panoramic_sunroof", "captain_seats", "adas", "wireless_charging", "bose_sound"],
    "priceLabel": "₹15L – ₹21.5L"
  },
  {
    "id": "kia-carens",
    "make": "Kia",
    "model": "Carens",
    "variant": "Luxury Plus DCT",
    "priceMin": 10.52,
    "priceMax": 20.1,
    "bodyType": "mpv",
    "fuelType": "petrol",
    "mileage": 16,
    "bootSpace": 216,
    "ncapRating": 3,
    "groundClearance": 195,
    "seatingCapacity": 7,
    "features": ["panoramic_sunroof", "captain_seats", "wireless_charging", "bose_sound", "adas"],
    "priceLabel": "₹10.5L – ₹20.1L"
  },
  {
    "id": "mg-hector",
    "make": "MG",
    "model": "Hector",
    "variant": "Select Pro",
    "priceMin": 13.99,
    "priceMax": 21.98,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 15.8,
    "bootSpace": 587,
    "ncapRating": 4,
    "groundClearance": 192,
    "seatingCapacity": 5,
    "features": ["panoramic_sunroof", "large_touchscreen", "wireless_charging", "adas", "ambient_lighting"],
    "priceLabel": "₹14L – ₹22L"
  },
  {
    "id": "jeep-meridian",
    "make": "Jeep",
    "model": "Meridian",
    "variant": "4x4 Limited",
    "priceMin": 29.9,
    "priceMax": 36.95,
    "bodyType": "suv",
    "fuelType": "diesel",
    "mileage": 14.05,
    "bootSpace": 354,
    "ncapRating": 5,
    "groundClearance": 202,
    "seatingCapacity": 7,
    "features": ["4wd", "sunroof", "adas", "premium_interior", "alpine_sound"],
    "priceLabel": "₹29.9L – ₹37L"
  },
  {
    "id": "tata-harrier",
    "make": "Tata",
    "model": "Harrier",
    "variant": "Adventure Plus",
    "priceMin": 14.99,
    "priceMax": 26.44,
    "bodyType": "suv",
    "fuelType": "diesel",
    "mileage": 16.35,
    "bootSpace": 425,
    "ncapRating": 5,
    "groundClearance": 205,
    "seatingCapacity": 5,
    "features": ["panoramic_sunroof", "adas", "wireless_charging", "terrain_modes", "jbl_sound"],
    "priceLabel": "₹15L – ₹26.4L"
  },
  {
    "id": "tata-safari",
    "make": "Tata",
    "model": "Safari",
    "variant": "Adventure Plus",
    "priceMin": 15.49,
    "priceMax": 27.34,
    "bodyType": "suv",
    "fuelType": "diesel",
    "mileage": 16.13,
    "bootSpace": 447,
    "ncapRating": 5,
    "groundClearance": 205,
    "seatingCapacity": 7,
    "features": ["panoramic_sunroof", "adas", "wireless_charging", "terrain_modes", "jbl_sound", "7seats"],
    "priceLabel": "₹15.5L – ₹27.3L"
  },
  {
    "id": "skoda-kushaq",
    "make": "Skoda",
    "model": "Kushaq",
    "variant": "Ambition TSI AT",
    "priceMin": 11.89,
    "priceMax": 19.5,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 18.45,
    "bootSpace": 385,
    "ncapRating": 5,
    "groundClearance": 188,
    "seatingCapacity": 5,
    "features": ["sunroof", "ventilated_seats", "adas", "wireless_charging"],
    "priceLabel": "₹11.9L – ₹19.5L"
  },
  {
    "id": "honda-amaze",
    "make": "Honda",
    "model": "Amaze",
    "variant": "ZX CVT",
    "priceMin": 7.99,
    "priceMax": 10.71,
    "bodyType": "sedan",
    "fuelType": "petrol",
    "mileage": 19.46,
    "bootSpace": 420,
    "ncapRating": 3,
    "groundClearance": 165,
    "seatingCapacity": 5,
    "features": ["wireless_charging", "adas", "one_touch_sunroof"],
    "priceLabel": "₹8L – ₹10.7L"
  },
  {
    "id": "toyota-glanza",
    "make": "Toyota",
    "model": "Glanza",
    "variant": "V MT",
    "priceMin": 6.72,
    "priceMax": 10.21,
    "bodyType": "hatchback",
    "fuelType": "petrol",
    "mileage": 22.94,
    "bootSpace": 318,
    "ncapRating": 2,
    "groundClearance": 170,
    "seatingCapacity": 5,
    "features": ["sunroof", "wireless_charging", "360_camera"],
    "priceLabel": "₹6.7L – ₹10.2L"
  },
  {
    "id": "maruti-fronx",
    "make": "Maruti Suzuki",
    "model": "Fronx",
    "variant": "Alpha Turbo",
    "priceMin": 7.51,
    "priceMax": 13.04,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 21.79,
    "bootSpace": 308,
    "ncapRating": 2,
    "groundClearance": 170,
    "seatingCapacity": 5,
    "features": ["sunroof", "360_camera", "wireless_charging", "heads_up_display"],
    "priceLabel": "₹7.5L – ₹13L"
  },
  {
    "id": "mahindra-scorpio-n",
    "make": "Mahindra",
    "model": "Scorpio N",
    "variant": "Z8 4WD",
    "priceMin": 13.99,
    "priceMax": 24.54,
    "bodyType": "suv",
    "fuelType": "diesel",
    "mileage": 14.97,
    "bootSpace": 720,
    "ncapRating": 5,
    "groundClearance": 200,
    "seatingCapacity": 7,
    "features": ["4wd", "sunroof", "adas", "wireless_charging", "7seats", "terrain_modes"],
    "priceLabel": "₹14L – ₹24.5L"
  },
  {
    "id": "hyundai-venue",
    "make": "Hyundai",
    "model": "Venue",
    "variant": "SX(O) Turbo",
    "priceMin": 7.94,
    "priceMax": 13.48,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 18.15,
    "bootSpace": 355,
    "ncapRating": 3,
    "groundClearance": 195,
    "seatingCapacity": 5,
    "features": ["sunroof", "wireless_charging", "adas", "bose_sound"],
    "priceLabel": "₹7.9L – ₹13.5L"
  },
  {
    "id": "kia-sonet",
    "make": "Kia",
    "model": "Sonet",
    "variant": "GTX+ DCT",
    "priceMin": 7.99,
    "priceMax": 15.96,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 18.3,
    "bootSpace": 392,
    "ncapRating": 3,
    "groundClearance": 211,
    "seatingCapacity": 5,
    "features": ["sunroof", "bose_sound", "wireless_charging", "adas", "ambient_lighting"],
    "priceLabel": "₹8L – ₹16L"
  },
  {
    "id": "maruti-dzire",
    "make": "Maruti Suzuki",
    "model": "Dzire",
    "variant": "ZXi+ AMT",
    "priceMin": 6.79,
    "priceMax": 9.64,
    "bodyType": "sedan",
    "fuelType": "petrol",
    "mileage": 24.79,
    "bootSpace": 382,
    "ncapRating": 3,
    "groundClearance": 163,
    "seatingCapacity": 5,
    "features": ["wireless_charging", "360_camera", "sunroof"],
    "priceLabel": "₹6.8L – ₹9.6L"
  },
  {
    "id": "nissan-magnite",
    "make": "Nissan",
    "model": "Magnite",
    "variant": "Tekna+ Turbo CVT",
    "priceMin": 6,
    "priceMax": 11.99,
    "bodyType": "suv",
    "fuelType": "petrol",
    "mileage": 19.39,
    "bootSpace": 336,
    "ncapRating": 4,
    "groundClearance": 205,
    "seatingCapacity": 5,
    "features": ["sunroof", "wireless_charging", "360_camera"],
    "priceLabel": "₹6L – ₹12L"
  },
  {
    "id": "mahindra-be6",
    "make": "Mahindra",
    "model": "BE 6",
    "variant": "Pack Three",
    "priceMin": 18.9,
    "priceMax": 26.9,
    "bodyType": "suv",
    "fuelType": "electric",
    "mileage": 0,
    "bootSpace": 455,
    "ncapRating": 5,
    "groundClearance": 207,
    "seatingCapacity": 5,
    "features": ["adas", "wireless_charging", "panoramic_roof", "v2l", "ambient_lighting", "fast_charging"],
    "priceLabel": "₹18.9L – ₹26.9L"
  }
]
```

- [ ] **Step 3: Commit dataset**

```bash
git add types/index.ts data/cars.json
git commit -m "feat: add types and 40-car Indian dataset"
```

---

## Task 3: Gemini Client + API Route

**Files:**
- Create: `lib/gemini.ts`
- Create: `app/api/recommend/route.ts`

- [ ] **Step 1: Create Gemini client and prompt builder**

Create `lib/gemini.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
import { CarSpec, CarRecommendation, RecommendResponse, WizardAnswers } from '@/types'
import carsData from '@/data/cars.json'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const BUDGET_MAP: Record<string, { min: number; max: number; label: string }> = {
  under8:  { min: 0,  max: 8,   label: 'under ₹8L' },
  '8to15': { min: 8,  max: 15,  label: '₹8L–₹15L' },
  '15to25':{ min: 15, max: 25,  label: '₹15L–₹25L' },
  above25: { min: 25, max: 999, label: 'above ₹25L' },
}

const VIBE_MAP: Record<string, string> = {
  safe:    'SAFETY_FIRST: Prioritize 5-star NCAP, high ground clearance, advanced safety features. Family protection above all.',
  sharp:   'PERFORMANCE: Prioritize turbocharged engines, sporty variants, responsive handling, driver engagement.',
  smart:   'FUEL_ECONOMY: Prioritize highest mileage, hybrid/EV options, lowest running cost per km.',
  arrived: 'PREMIUM_FEEL: Prioritize brand perception, sunroof, premium audio, tech features that signal success.',
}

export function buildPrompt(answers: WizardAnswers): string {
  const budget = BUDGET_MAP[answers.budget]
  const vibe = VIBE_MAP[answers.vibe]

  const filteredCars = (carsData as CarSpec[]).filter(
    car => car.priceMin <= budget.max && car.priceMax >= budget.min
  )

  const carsJson = JSON.stringify(filteredCars.map(c => ({
    id: c.id,
    make: c.make,
    model: c.model,
    variant: c.variant,
    priceLabel: c.priceLabel,
    bodyType: c.bodyType,
    fuelType: c.fuelType,
    mileage: c.mileage,
    bootSpace: c.bootSpace,
    ncapRating: c.ncapRating,
    groundClearance: c.groundClearance,
    seatingCapacity: c.seatingCapacity,
    features: c.features,
  })))

  return `You are an expert Indian car advisor. A buyer has answered 4 lifestyle questions. Recommend exactly 3 cars from the provided dataset.

BUYER PROFILE:
- Drive pattern: ${answers.drive === 'city' ? 'Mostly city driving (traffic, parking)' : answers.drive === 'highway' ? 'Mostly highway (long distance, speed)' : 'Mixed city and highway equally'}
- Passengers: ${answers.passengers === 'solo' ? 'Drives alone mostly' : answers.passengers === 'family' ? 'Full family with children' : answers.passengers === 'couple' ? 'With partner, no kids' : 'Solo + pets, needs easy-clean boot'}
- Priority vibe: ${vibe}
- Budget: ${budget.label}

AVAILABLE CARS (already filtered to budget range):
${carsJson}

INSTRUCTIONS:
1. Select the 3 best-matching cars from the list above
2. Rank them 1 (best match) to 3
3. For each car write an "emotionalHook" — 1-2 sentences that connect the car to THIS BUYER'S SPECIFIC LIFE. Reference their drive pattern, passengers, or vibe. Sound like a knowledgeable friend, not a salesperson. Example: "With kids in the back and school runs every morning, the Nexon's 5-star safety rating isn't a spec — it's peace of mind you'll feel every single day."
4. Give 2-3 matchReasons as short factual bullet points (e.g., "Best-in-class 5★ NCAP safety", "350L boot fits stroller + groceries")

RESPOND WITH VALID JSON ONLY. No markdown, no explanation. Format:
{
  "recommendations": [
    {
      "carId": "tata-nexon",
      "rank": 1,
      "emotionalHook": "...",
      "matchReasons": ["...", "...", "..."]
    }
  ],
  "summaryLine": "Based on your lifestyle: [brief description of buyer profile]"
}`
}

export async function getRecommendations(answers: WizardAnswers): Promise<RecommendResponse> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const prompt = buildPrompt(answers)

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

  // Strip markdown code fences if Gemini wraps in ```json
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
  const parsed = JSON.parse(cleaned)

  const cars = carsData as CarSpec[]
  const recommendations: CarRecommendation[] = parsed.recommendations.map((r: {
    carId: string;
    rank: 1 | 2 | 3;
    emotionalHook: string;
    matchReasons: string[];
  }) => {
    const car = cars.find(c => c.id === r.carId)
    if (!car) throw new Error(`Car not found: ${r.carId}`)
    return {
      car,
      rank: r.rank,
      emotionalHook: r.emotionalHook,
      matchReasons: r.matchReasons,
    }
  })

  return {
    recommendations: recommendations.sort((a, b) => a.rank - b.rank),
    summaryLine: parsed.summaryLine,
  }
}
```

- [ ] **Step 2: Create API route**

Create `app/api/recommend/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getRecommendations } from '@/lib/gemini'
import { WizardAnswers } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const answers: WizardAnswers = body.answers

    if (!answers?.drive || !answers?.passengers || !answers?.vibe || !answers?.budget) {
      return NextResponse.json({ error: 'Missing required answers' }, { status: 400 })
    }

    const data = await getRecommendations(answers)
    return NextResponse.json(data)
  } catch (err) {
    console.error('Recommend error:', err)
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Test the API manually**

Start dev server and test with curl:
```bash
curl -X POST http://localhost:3000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"answers":{"drive":"city","passengers":"family","vibe":"safe","budget":"8to15"}}'
```
Expected: JSON with `recommendations` array of 3 cars and `summaryLine`

- [ ] **Step 4: Commit**

```bash
git add lib/gemini.ts app/api/recommend/route.ts
git commit -m "feat: add Gemini recommendation engine and API route"
```

---

## Task 4: Landing Page + QuickStart Component

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `components/QuickStart.tsx`
- Modify: `app/page.tsx` (initial version — hero + QuickStart)

- [ ] **Step 1: Set up globals.css with design tokens**

Replace `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #080810;
  --surface: #0f0f1a;
  --surface2: #16162a;
  --border: rgba(255,255,255,0.07);
  --orange: #f97316;
  --orange-dim: rgba(249,115,22,0.12);
  --green: #22c55e;
  --muted: #6b6b8a;
}

body {
  background: var(--bg);
  color: #f0eeff;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 2: Update layout.tsx with fonts and metadata**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Syne } from 'next/font/google'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'CarMatch AI — Find Your Perfect Car',
  description: 'Answer 4 lifestyle questions. Get 3 cars shortlisted by AI. No spec-sheet required.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="font-dm antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Update tailwind.config.ts to include font variables**

Replace `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm)', 'sans-serif'],
      },
      colors: {
        orange: '#f97316',
        surface: '#0f0f1a',
        surface2: '#16162a',
        muted: '#6b6b8a',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Create QuickStart component**

Create `components/QuickStart.tsx`:

```tsx
'use client'

import { WizardAnswers } from '@/types'

interface QuickStartProps {
  onSelect: (answers: WizardAnswers) => void
}

const PERSONAS: { label: string; emoji: string; desc: string; answers: WizardAnswers }[] = [
  {
    label: 'New parent — safety first',
    emoji: '👨‍👩‍👧',
    desc: 'Family SUV, 5-star safety, boot space',
    answers: { drive: 'city', passengers: 'family', vibe: 'safe', budget: '8to15' },
  },
  {
    label: 'Weekend warrior',
    emoji: '🏔️',
    desc: 'Ground clearance, adventure-ready',
    answers: { drive: 'highway', passengers: 'couple', vibe: 'sharp', budget: '15to25' },
  },
  {
    label: 'Smart commuter',
    emoji: '⚡',
    desc: 'Best mileage, lowest running cost',
    answers: { drive: 'city', passengers: 'solo', vibe: 'smart', budget: '8to15' },
  },
]

export default function QuickStart({ onSelect }: QuickStartProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-center text-xs uppercase tracking-widest text-muted mb-4">
        — or start with a persona —
      </p>
      <div className="grid grid-cols-3 gap-3">
        {PERSONAS.map((p) => (
          <button
            key={p.label}
            onClick={() => onSelect(p.answers)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/7 bg-surface hover:border-orange/40 hover:bg-surface2 transition-all text-left group"
          >
            <span className="text-2xl">{p.emoji}</span>
            <span className="font-syne font-semibold text-xs leading-tight text-center">{p.label}</span>
            <span className="text-[11px] text-muted text-center">{p.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Build initial page.tsx (hero + QuickStart, no wizard yet)**

Replace `app/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import QuickStart from '@/components/QuickStart'
import { WizardAnswers } from '@/types'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [showWizard, setShowWizard] = useState(false)

  function handleQuickStart(answers: WizardAnswers) {
    const params = new URLSearchParams(answers as unknown as Record<string, string>)
    router.push(`/results?${params.toString()}`)
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* NAV */}
      <nav className="flex items-center justify-between px-10 py-5 border-b border-white/7 sticky top-0 backdrop-blur-md z-50" style={{ background: 'rgba(8,8,16,0.9)' }}>
        <div className="font-syne font-extrabold text-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange shadow-[0_0_10px_#f97316]" />
          Car<span className="text-orange">Match</span> AI
        </div>
        <span className="text-xs text-muted border border-white/7 px-3 py-1 rounded-full tracking-widest uppercase">by CarDekho</span>
      </nav>

      {/* HERO */}
      <section className="max-w-3xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-orange text-xs uppercase tracking-widest mb-8">
          <span className="w-6 h-px bg-orange" />
          AI-Powered Car Advisor
          <span className="w-6 h-px bg-orange" />
        </div>

        <h1 className="font-syne font-extrabold text-5xl md:text-6xl leading-[1.05] mb-6">
          Find your car.<br />
          Not just <em className="not-italic text-orange">a</em> car.
        </h1>

        <p className="text-muted text-lg leading-relaxed mb-12 font-light max-w-xl mx-auto">
          Answer 4 questions about your life — not your specs.
          We'll shortlist the 3 cars built for how you actually drive.
        </p>

        <button
          onClick={() => setShowWizard(true)}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-orange text-black font-syne font-bold text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(249,115,22,0.35)] transition-all"
        >
          Start Matching
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="flex justify-center gap-10 mt-14 mb-16">
          {[['40+', 'Cars in dataset'], ['4', 'Questions only'], ['3', 'Shortlisted picks']].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="font-syne font-bold text-2xl">{num}</div>
              <div className="text-xs text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>

        <QuickStart onSelect={handleQuickStart} />
      </section>

      {/* WIZARD MODAL — placeholder, will be replaced in Task 5 */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-surface border border-white/7 rounded-2xl p-8 max-w-md w-full mx-4">
            <p className="text-muted text-sm text-center">Wizard coming in Task 5…</p>
            <button onClick={() => setShowWizard(false)} className="mt-4 w-full text-xs text-muted">Close</button>
          </div>
        </div>
      )}
    </main>
  )
}
```

- [ ] **Step 6: Verify landing renders in browser**

Visit `http://localhost:3000` — expect hero, stats, QuickStart buttons, "Start Matching" button.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css app/layout.tsx tailwind.config.ts components/QuickStart.tsx app/page.tsx
git commit -m "feat: landing page with hero and QuickStart personas"
```

---

## Task 5: Wizard Component (4 Questions)

**Files:**
- Create: `components/WizardStep.tsx`
- Create: `components/Wizard.tsx`
- Modify: `app/page.tsx` (wire in real Wizard)

- [ ] **Step 1: Create WizardStep — single question with 4 option cards**

Create `components/WizardStep.tsx`:

```tsx
'use client'

interface Option {
  value: string
  emoji: string
  title: string
  desc: string
}

interface WizardStepProps {
  stepNumber: number
  totalSteps: number
  question: string
  subtext: string
  options: Option[]
  selected: string | null
  onSelect: (value: string) => void
}

export default function WizardStep({
  stepNumber,
  totalSteps,
  question,
  subtext,
  options,
  selected,
  onSelect,
}: WizardStepProps) {
  const progress = (stepNumber / totalSteps) * 100

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-0.5 rounded-full transition-all duration-300"
            style={{ background: i < stepNumber ? 'var(--orange)' : 'var(--surface2)' }}
          />
        ))}
      </div>

      <p className="text-xs text-muted uppercase tracking-widest mb-2">
        Step <span className="text-orange font-semibold">{stepNumber}</span> of {totalSteps}
      </p>

      <h2 className="font-syne font-bold text-2xl mb-1 leading-tight">{question}</h2>
      <p className="text-sm text-muted mb-8 font-light">{subtext}</p>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`
              relative flex flex-col items-start p-5 rounded-2xl border text-left transition-all
              ${selected === opt.value
                ? 'border-orange bg-surface2'
                : 'border-white/7 bg-surface hover:border-orange/40 hover:bg-surface2'
              }
            `}
          >
            {selected === opt.value && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange flex items-center justify-center text-[10px] text-black font-bold">✓</span>
            )}
            <span className="text-3xl mb-3">{opt.emoji}</span>
            <span className="font-syne font-semibold text-sm mb-1">{opt.title}</span>
            <span className="text-xs text-muted leading-relaxed">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create Wizard — orchestrates all 4 steps**

Create `components/Wizard.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WizardStep from './WizardStep'
import { WizardAnswers } from '@/types'

const STEPS = [
  {
    question: "What does your typical drive look like?",
    subtext: "Think about your most common journeys — daily commute, errands, trips.",
    field: 'drive' as keyof WizardAnswers,
    options: [
      { value: 'city', emoji: '🏙️', title: 'City life', desc: 'Traffic, tight parking, short trips.' },
      { value: 'highway', emoji: '🛣️', title: 'Open roads', desc: 'Highway runs, long distances, speed.' },
      { value: 'both', emoji: '🗺️', title: 'Both equally', desc: 'City during week, highway on weekends.' },
    ],
  },
  {
    question: "Who's usually riding with you?",
    subtext: "This shapes the space and safety setup we recommend.",
    field: 'passengers' as keyof WizardAnswers,
    options: [
      { value: 'solo', emoji: '🧑', title: 'Just me', desc: 'Solo driver. Quick and efficient.' },
      { value: 'family', emoji: '👨‍👩‍👧‍👦', title: 'Full family', desc: 'Kids, bags, and never enough boot space.' },
      { value: 'couple', emoji: '👫', title: 'Me + partner', desc: 'Comfort and style over pure practicality.' },
      { value: 'pets', emoji: '🐕', title: 'Me + pets', desc: 'Space and easy-clean surfaces are a must.' },
    ],
  },
  {
    question: "How do you want to feel behind the wheel?",
    subtext: "This is the most important question. Be honest.",
    field: 'vibe' as keyof WizardAnswers,
    options: [
      { value: 'safe', emoji: '🛡️', title: 'Safe & protected', desc: 'My family is everything. Safety first.' },
      { value: 'sharp', emoji: '⚡', title: 'Sharp & alive', desc: 'I want to feel the road. Performance matters.' },
      { value: 'smart', emoji: '🌿', title: 'Smart & efficient', desc: 'I hate wasting money on fuel. Every rupee counts.' },
      { value: 'arrived', emoji: '🏆', title: "I've arrived", desc: "I've earned something that shows it. Premium." },
    ],
  },
  {
    question: "What's your hard limit on budget?",
    subtext: "The number you absolutely won't cross. On-road price.",
    field: 'budget' as keyof WizardAnswers,
    options: [
      { value: 'under8', emoji: '💰', title: 'Under ₹8L', desc: 'Practical and fuel-efficient.' },
      { value: '8to15', emoji: '💳', title: '₹8L – ₹15L', desc: 'The sweet spot for most buyers.' },
      { value: '15to25', emoji: '💎', title: '₹15L – ₹25L', desc: 'Premium features, top-spec variants.' },
      { value: 'above25', emoji: '👑', title: 'Above ₹25L', desc: 'No compromise. The best available.' },
    ],
  },
]

interface WizardProps {
  onClose: () => void
}

export default function Wizard({ onClose }: WizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<WizardAnswers>>({})

  const current = STEPS[step]
  const selectedValue = answers[current.field] ?? null

  function handleSelect(value: string) {
    const updated = { ...answers, [current.field]: value } as Partial<WizardAnswers>
    setAnswers(updated)

    // Auto-advance after short delay for feel
    setTimeout(() => {
      if (step < STEPS.length - 1) {
        setStep(step + 1)
      } else {
        // Last step — go to results
        const params = new URLSearchParams(updated as Record<string, string>)
        router.push(`/results?${params.toString()}`)
      }
    }, 300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full max-w-lg rounded-2xl border border-white/7 p-8"
        style={{ background: 'var(--surface)' }}>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-white text-sm transition-colors"
        >✕</button>

        <WizardStep
          stepNumber={step + 1}
          totalSteps={STEPS.length}
          question={current.question}
          subtext={current.subtext}
          options={current.options}
          selected={selectedValue as string | null}
          onSelect={handleSelect}
        />

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-6 text-xs text-muted hover:text-white transition-colors flex items-center gap-1"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Wire Wizard into page.tsx**

Replace the wizard placeholder in `app/page.tsx` (the `{showWizard && ...}` block at the bottom) with:

```tsx
import Wizard from '@/components/Wizard'

// ... inside the return, replace the placeholder block:
{showWizard && <Wizard onClose={() => setShowWizard(false)} />}
```

Also add the import at the top of `app/page.tsx`:
```tsx
import Wizard from '@/components/Wizard'
```

- [ ] **Step 4: Test wizard flow in browser**

Visit `http://localhost:3000`, click "Start Matching", step through all 4 questions. Last selection should redirect to `/results?drive=...&passengers=...&vibe=...&budget=...`

- [ ] **Step 5: Commit**

```bash
git add components/WizardStep.tsx components/Wizard.tsx app/page.tsx
git commit -m "feat: 4-step lifestyle wizard with auto-advance"
```

---

## Task 6: Results Page + CarCard Component

**Files:**
- Create: `components/CarCard.tsx`
- Create: `app/results/page.tsx`

- [ ] **Step 1: Create CarCard component**

Create `components/CarCard.tsx`:

```tsx
import { CarRecommendation } from '@/types'
import { Badge } from '@/components/ui/badge'

const NCAP_COLOR: Record<number, string> = {
  5: '#22c55e',
  4: '#84cc16',
  3: '#f59e0b',
  2: '#f97316',
  1: '#ef4444',
  0: '#6b6b8a',
}

const FUEL_LABEL: Record<string, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  electric: 'Electric',
  hybrid: 'Hybrid',
  cng: 'CNG',
}

const CAR_EMOJI: Record<string, string> = {
  suv: '🚙',
  sedan: '🚗',
  hatchback: '🚘',
  mpv: '🚐',
  pickup: '🛻',
}

interface CarCardProps {
  rec: CarRecommendation
}

export default function CarCard({ rec }: CarCardProps) {
  const { car, rank, emotionalHook, matchReasons } = rec
  const isTopPick = rank === 1

  return (
    <div className={`
      relative rounded-2xl overflow-hidden border transition-all hover:-translate-y-1
      hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]
      ${isTopPick ? 'border-orange' : 'border-white/7'}
    `} style={{ background: 'var(--surface)' }}>

      {isTopPick && (
        <div className="absolute top-3 left-3 z-10 bg-orange text-black font-syne font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
          ★ Best Match
        </div>
      )}

      {/* Car image area */}
      <div className="h-40 flex items-center justify-center relative overflow-hidden"
        style={{ background: 'var(--surface2)' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)' }} />
        </div>
        <span className="text-6xl z-10 relative drop-shadow-lg">
          {CAR_EMOJI[car.bodyType] || '🚗'}
        </span>
        <div className="absolute bottom-0 inset-x-0 h-10"
          style={{ background: 'linear-gradient(to top, var(--surface), transparent)' }} />
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-widest text-muted mb-1">{car.make}</p>
        <h3 className="font-syne font-bold text-xl mb-0.5">{car.model}</h3>
        <p className="text-orange text-sm font-medium mb-4">{car.priceLabel}</p>

        {/* Emotional hook */}
        <div className="rounded-xl p-3 mb-4 border-l-2 border-orange text-xs text-[#a0a0c0] leading-relaxed italic"
          style={{ background: 'var(--surface2)' }}>
          "{emotionalHook}"
        </div>

        {/* Match reasons */}
        <ul className="space-y-1.5 mb-4">
          {matchReasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted">
              <span className="text-green mt-0.5 shrink-0">✓</span>
              {r}
            </li>
          ))}
        </ul>

        {/* Spec tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {car.ncapRating > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md border border-white/7"
              style={{ color: NCAP_COLOR[car.ncapRating], background: 'var(--surface2)' }}>
              {car.ncapRating}★ NCAP
            </span>
          )}
          {car.mileage > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md border border-white/7 text-muted"
              style={{ background: 'var(--surface2)' }}>
              {car.mileage} kmpl
            </span>
          )}
          {car.bootSpace > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md border border-white/7 text-muted"
              style={{ background: 'var(--surface2)' }}>
              {car.bootSpace}L boot
            </span>
          )}
          <span className="text-[10px] px-2 py-0.5 rounded-md border border-white/7 text-muted"
            style={{ background: 'var(--surface2)' }}>
            {FUEL_LABEL[car.fuelType]}
          </span>
        </div>

        <a
          href={`https://www.cardekho.com/cars/${car.make.toLowerCase().replace(' ', '-')}/${car.model.toLowerCase().replace(' ', '-')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2.5 text-center text-xs border border-white/7 rounded-xl hover:border-orange hover:text-orange transition-all font-dm"
        >
          View on CarDekho →
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create results page**

Create `app/results/page.tsx`:

```tsx
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { WizardAnswers, RecommendResponse } from '@/types'
import CarCard from '@/components/CarCard'

function ResultsContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<RecommendResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const answers: WizardAnswers = {
    drive: params.get('drive') as WizardAnswers['drive'],
    passengers: params.get('passengers') as WizardAnswers['passengers'],
    vibe: params.get('vibe') as WizardAnswers['vibe'],
    budget: params.get('budget') as WizardAnswers['budget'],
  }

  useEffect(() => {
    if (!answers.drive || !answers.passengers || !answers.vibe || !answers.budget) {
      router.push('/')
      return
    }

    fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: 'var(--bg)' }}>
        <div className="w-10 h-10 rounded-full border-2 border-orange border-t-transparent animate-spin" />
        <div className="text-center space-y-2">
          {['Reading your lifestyle...', 'Filtering 40+ cars...', 'Writing your shortlist...'].map((msg, i) => (
            <p key={i} className={`text-sm transition-all duration-500 ${i === 1 ? 'text-orange' : 'text-muted'}`}>{msg}</p>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <p className="text-muted mb-4">Something went wrong: {error}</p>
          <button onClick={() => router.push('/')} className="text-orange text-sm underline">← Start over</button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* NAV */}
      <nav className="flex items-center justify-between px-10 py-5 border-b border-white/7 sticky top-0 backdrop-blur-md"
        style={{ background: 'rgba(8,8,16,0.9)' }}>
        <div className="font-syne font-extrabold text-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange shadow-[0_0_10px_#f97316]" />
          Car<span className="text-orange">Match</span> AI
        </div>
        <button onClick={() => router.push('/')} className="text-xs text-muted hover:text-white transition-colors">← Start over</button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-green flex items-center gap-2 mb-3">
            <span className="w-4 h-px bg-green" /> AI Shortlist Ready
          </p>
          <h1 className="font-syne font-extrabold text-4xl mb-2">Your top 3 matches</h1>
          {data?.summaryLine && (
            <p className="text-muted text-sm font-light">{data.summaryLine}</p>
          )}
        </div>

        {/* Car cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {data?.recommendations.map((rec) => (
            <CarCard key={rec.car.id} rec={rec} />
          ))}
        </div>

        {/* AI reasoning strip */}
        <div className="rounded-2xl border border-white/7 p-5 flex items-start gap-4"
          style={{ background: 'var(--surface)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base border"
            style={{ background: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.25)' }}>
            🤖
          </div>
          <div className="text-sm text-[#a0a0c0] leading-relaxed">
            <strong className="text-white font-medium">How we chose these: </strong>
            We filtered {' '}<strong className="text-white">40+ Indian cars</strong> to your budget,
            then used AI to rank by what matters to <em>you</em> — not just specs.
            The emotional match you see on each card was written specifically for your answers.
            <span className="text-orange ml-2">Not a generic result.</span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-10 h-10 rounded-full border-2 border-orange border-t-transparent animate-spin" />
    </div>}>
      <ResultsContent />
    </Suspense>
  )
}
```

- [ ] **Step 3: Test full flow end-to-end**

1. Visit `http://localhost:3000`
2. Click "Start Matching" → step through 4 wizard questions
3. On last selection → redirects to `/results?...`
4. Spinner shows → Gemini responds → 3 car cards render with emotional hooks
5. Also test QuickStart buttons → should skip wizard and go direct to results

- [ ] **Step 4: Commit**

```bash
git add components/CarCard.tsx app/results/page.tsx
git commit -m "feat: results page with AI-powered car cards and emotional hooks"
```

---

## Task 7: Deploy to Vercel

- [ ] **Step 1: Push all changes**

```bash
git push origin main
```

- [ ] **Step 2: Deploy to Vercel**

```bash
npx vercel --yes
```

When prompted for project settings, accept defaults. When it asks to link to existing project, say No (new project).

- [ ] **Step 3: Add GEMINI_API_KEY to Vercel environment**

```bash
npx vercel env add GEMINI_API_KEY production
# Paste: AIzaSyBmmOx6uIVrPYNyD0lx6xISXcVw4Fsyj4I
```

- [ ] **Step 4: Redeploy with env var**

```bash
npx vercel --prod
```

- [ ] **Step 5: Test live URL**

Open the Vercel URL. Run through full wizard. Confirm results load on live deployment.

- [ ] **Step 6: Final commit + push**

```bash
git add .
git commit -m "feat: production deploy — CarMatch AI v1.0"
git push origin main
```

---

## Self-Review

**Spec coverage check:**
- ✅ Landing with hero + stats
- ✅ Quick Start personas (3 shortcuts → skip wizard)
- ✅ 4-question wizard with auto-advance + back button
- ✅ Gemini API route with vibe-to-spec mapping
- ✅ Results page with 3 car cards
- ✅ Emotional hook per car (AI-generated)
- ✅ AI reasoning strip
- ✅ Vercel deploy

**Placeholder scan:** None found. All code blocks complete.

**Type consistency:**
- `WizardAnswers` defined in `types/index.ts` and used consistently in Wizard, QuickStart, API route, results page
- `CarRecommendation.car` is a `CarSpec` — CarCard receives `CarRecommendation`, accesses `rec.car`
- `getRecommendations(answers: WizardAnswers)` signature matches all call sites

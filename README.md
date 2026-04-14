# CarMatch AI — CarDekho Take-Home Assignment

> AI-powered car advisor that maps your lifestyle to the right car. No spec questions. Just 4 honest questions about how you live.

**Live:** https://cardekho-ai-advisor.vercel.app  
**GitHub:** https://github.com/SKYDARTIST/cardekho-ai-advisor

---

## The Problem

Most car-buying tools ask "what fuel type do you want?" or "how many cc engine?" — questions buyers can't answer without already knowing cars. The result: decision paralysis, filter overwhelm, and abandoned sessions.

**The insight:** confused buyers shop with their hearts, not calculators. So instead of asking spec questions, I ask lifestyle questions. The AI maps lifestyle → specs silently. The buyer feels understood, not interrogated.

---

## What I Built

### Core Flow

```
Landing → 4-question wizard → AI shortlist (3 cars) → Verdict → "View on CarDekho"
```

**The 4 questions:**
1. What does your typical drive look like? — city / highway / both
2. Who's usually riding with you? — solo / family / couple / pets
3. How do you want to feel behind the wheel? — safe / sharp / smart / arrived
4. What's your hard budget limit? — 4 tiers from under ₹8L to above ₹25L

**Results page:**
- 3 ranked car cards, each with a real car photo and fuel-type themed background
- Personalised **emotional hook** written by Gemini for the buyer's exact answer combination
- 2–3 factual match reasons with checkmarks
- **Match score ring** (0–100%) per card — Gemini scores how well each car fits this specific buyer
- **EMI estimate** — auto-calculated from priceMax at 80% loan, 8.5% p.a., 60 months
- **Buyer count** — social proof showing how many buyers with a similar profile chose this car
- Spec tags: NCAP rating, mileage, boot space, fuel type
- Featured user review with star rating per car
- **The Verdict** section — Gemini explains in one sentence why #1 beats #2 for this buyer, plus a 5-year ownership cost comparison (fuel + insurance + maintenance) across all 3 results
- AI reasoning strip — transparency on how the shortlist was generated

**Supporting features:**
- Quick Start personas (New parent / Weekend warrior / Smart commuter) — skip the wizard, land directly on results
- Light/dark theme toggle — warm cream palette in light mode, no generic white
- Full-screen editorial loading state with step-by-step progress indicators

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 App Router | Single repo for frontend + API routes, zero-config Vercel deploy |
| Language | TypeScript | End-to-end type safety from wizard input to API response |
| Styling | Tailwind v4 + CSS custom properties | PostCSS-only approach, no config file; CSS vars handle theming cleanly |
| AI | Gemini 2.5 Flash | Free tier, fast structured JSON output, strong ranking and text generation |
| Data | Static `data/cars.json` (40 cars) | No DB needed — eliminates setup overhead, sufficient for a shortlisting demo |
| Deploy | Vercel | One push, env vars via dashboard, instant preview URLs |

**Fonts:** Barlow Condensed (editorial hero numbers) · Syne (headings, UI labels) · DM Sans (body)

---

## How Gemini Is Used

**Not:** "Here are some cars, write descriptions."

**Actually:**

1. Code performs a hard budget filter on the 40-car dataset before touching the API
2. Filtered cars (full specs) are passed to Gemini in a structured prompt
3. The prompt includes the buyer's 4 answers and an explicit vibe-to-spec mapping:
   - `safe` → prioritise 5-star NCAP, ground clearance, safety features
   - `sharp` → prioritise turbocharged engines, sporty variants, driver engagement
   - `smart` → prioritise highest mileage, hybrid/EV options, lowest running cost
   - `arrived` → prioritise brand prestige, sunroof, premium audio, tech features
4. Gemini returns ranked results with: match score, emotional hook, match reasons, and a head-to-head explanation of why #1 beats #2 for this buyer
5. All responses parsed as strict JSON with markdown fence stripping as a defensive fallback

The emotional hook is the differentiator. A generic tool returns a list. This one returns a sentence that makes you feel seen.

---

## What I Deliberately Cut

| Feature | Why |
|---|---|
| User auth / login | Not needed for a shortlisting tool — adds significant overhead with zero user value |
| Real-time inventory / pricing | Static data is accurate enough for a demo; a live feed would require API keys, rate limiting, and caching |
| Saved shortlists | Would require auth + database migrations — not worth the scope in 48 hours |
| 20-question spec form | 4 emotional questions produce better results than 20 spec questions. Fewer inputs, higher confidence |
| CNG/EV-only filters | Budget + vibe already routes buyers to the right fuel type naturally |

Every cut made the core flow faster and the result more decisive.

---

## What I Added Beyond the Brief

The brief mentioned user reviews and a path to confidence. Both were built:

- **User reviews** — 2 verified-style buyer quotes per car across all 40 cars, with star ratings, short quotes, and reviewer type + city. The highest-rated review surfaces on each result card.
- **Match score** — a 0–100% confidence score per result, not a generic badge. Gemini calculates it based on how well each car maps to the buyer's specific profile.
- **EMI estimate** — converts an abstract ₹X lakh price into a concrete monthly payment. Most buyers decide on EMI, not sticker price.
- **5-year ownership cost** — fuel + insurance + maintenance compared across all 3 results. Removes the hidden cost blind spot.
- **"Why this car" verdict** — Gemini explicitly compares #1 vs #2, naming both, for this buyer. Not a generic recommendation.

---

## How I Used AI Tools

This project was built with Claude Code (Anthropic) as the primary coding assistant.

**Where AI accelerated execution:**
- Gemini prompt architecture and structured JSON response parsing
- CSS variable theming system (dark/light without React context)
- SVG icon components for all UI elements
- Unsplash image integration with per-fuel-type fallback gradients

**Where I made the product decisions:**
- The lifestyle-over-specs framing — asking "how do you want to feel" instead of "what engine"
- Cutting auth, DB, and comparison features to protect the core flow
- The warm cream light mode (not generic white)
- The Verdict section concept — the gap between "this matches" and "I want this"
- Vibe-to-spec mapping logic that drives Gemini's ranking

AI accelerated execution. The product decisions were mine.

---

## Running Locally

```bash
git clone https://github.com/SKYDARTIST/cardekho-ai-advisor.git
cd cardekho-ai-advisor
npm install
```

Create `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## What's Next

1. **CarDekho API integration** — real-time pricing and availability instead of static data
2. **Share shortlist via URL** — query params are already in the URL; just needs an OG image generator
3. **EMI configurator** — let the buyer adjust tenure and down payment on the card
4. **Chain-of-thought prompting** — make Gemini reason about the buyer profile before writing the hook, improving emotional resonance
5. **Test drive CTA** — the highest-intent action a buyer can take; connect to CarDekho's dealer booking flow

---

## Project Structure

```
cardekho-ai-advisor/
├── app/
│   ├── page.tsx                 # Landing: hero, QuickStart personas, Wizard modal
│   ├── results/page.tsx         # Results: Gemini fetch, CarCards, Verdict, reasoning strip
│   ├── api/recommend/route.ts   # POST: budget filter → Gemini → ranked JSON response
│   ├── layout.tsx               # Font loading, metadata
│   └── globals.css              # Tailwind v4, CSS custom properties, light/dark theme vars
├── components/
│   ├── CarCard.tsx              # Result card: photo, score ring, EMI, hook, reasons, review
│   ├── Wizard.tsx               # 4-step wizard orchestrator with auto-advance
│   ├── WizardStep.tsx           # Single question: progress bar + 2×2 option grid
│   ├── QuickStart.tsx           # 3 persona shortcut cards
│   └── ThemeToggle.tsx          # Sun/moon toggle, localStorage persistence
├── hooks/
│   └── useTheme.ts              # Theme state via CustomEvent — no React context needed
├── lib/
│   └── gemini.ts                # Gemini client, prompt builder, vibe mapping, JSON parser
├── data/
│   └── cars.json                # 40 Indian cars: specs, pricing, reviews, image URLs
└── types/
    └── index.ts                 # WizardAnswers, CarSpec, CarReview, CarRecommendation, RecommendResponse
```

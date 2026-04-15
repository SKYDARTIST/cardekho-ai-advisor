@AGENTS.md

# CarMatch AI — Project Context for Claude

> Read this at the start of every session on this project.

---

## What This Is

**CarMatch AI** — a full-stack AI car advisor built for a CarDekho Group take-home assignment. Submitted Apr 16, 2026.

**The insight:** Confused buyers shop with their hearts, not calculators. Instead of spec questions (fuel type? engine CC?), we ask lifestyle questions. The AI maps lifestyle → specs silently. The buyer feels understood, not filtered.

**Live:** https://cardekho-ai-advisor.vercel.app  
**GitHub:** https://github.com/SKYDARTIST/cardekho-ai-advisor

---

## What We Built

### Core Flow
1. **Landing page** — hero, stats (40+ cars / 4 questions / 3 picks), "Start Matching" CTA, Quick Start personas
2. **4-question lifestyle wizard** (modal):
   - Q1: Drive pattern (city / highway / both)
   - Q2: Passengers (solo / family / couple / pets)
   - Q3: Vibe (safe / sharp / smart / arrived)
   - Q4: Budget (under ₹8L / ₹8-15L / ₹15-25L / above ₹25L)
3. **Results page** — 3 car cards each with:
   - Match score ring (0–100%, SVG arc, Gemini-generated)
   - Emotional hook (personalised to buyer profile)
   - EMI estimate (priceMax × 1.12 × 80% loan, 8.5% p.a., 60 months)
   - Buyer count (deterministic hash from car ID)
   - 2–3 factual match reasons with checkmarks
   - Spec tags (NCAP, mileage, boot space, fuel type)
   - Featured user review (highest-rated from car.reviews)
   - "View on CarDekho →" link
4. **The Verdict section** — whyTopPick sentence + 5-year ownership cost bar chart
5. **AI reasoning strip** — transparency on how the shortlist was made

### Vibe-to-Spec Mapping (Key Design Decision)
- `safe` → SAFETY_FIRST: 5-star NCAP, ground clearance
- `sharp` → PERFORMANCE: turbo engines, sporty variants
- `smart` → FUEL_ECONOMY: highest mileage, hybrid/EV
- `arrived` → PREMIUM_FEEL: brand value, sunroof, premium audio

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 App Router | One repo for frontend + API routes, Vercel deploy |
| Language | TypeScript | Type safety across wizard → API → results |
| Styling | Tailwind v4 + CSS custom properties | v4 uses PostCSS, no tailwind.config.ts |
| AI | Gemini 2.5 Flash via @google/generative-ai | Free tier, fast structured JSON output |
| Data | Static data/cars.json (40 cars, 2 reviews each) | No DB needed |
| Deploy | Vercel | One push, env vars via dashboard |

**Fonts:** Barlow Condensed (hero numbers) · Syne (headings) · DM Sans (body)  
**Theme:** `data-theme="light|dark"` on `document.documentElement` + CSS var overrides. CustomEvent `theme-changed` dispatched by ThemeToggle, listened by `useTheme` hook.

---

## File Map

```
cardekho-ai-advisor/
├── app/
│   ├── page.tsx                    # Landing: hero, QuickStart personas, Wizard modal
│   ├── results/page.tsx            # Results: Gemini fetch, CarCards, Verdict, reasoning strip
│   ├── api/recommend/route.ts      # POST: rate limit → enum validation → budget filter → Gemini
│   ├── layout.tsx                  # Font loading, metadata
│   └── globals.css                 # Tailwind v4, CSS custom properties, dark/light theme vars
├── components/
│   ├── CarCard.tsx                 # Result card: ScoreRing, EMI, buyersCount, hook, review
│   ├── Wizard.tsx                  # 4-step wizard orchestrator with auto-advance
│   ├── WizardStep.tsx              # Single question: progress bar + 2×2 option grid
│   ├── QuickStart.tsx              # 3 persona shortcut cards
│   └── ThemeToggle.tsx             # Sun/moon toggle, localStorage persistence
├── hooks/
│   └── useTheme.ts                 # Theme state via CustomEvent — no React context needed
├── lib/
│   └── gemini.ts                   # Gemini client, buildPrompt(), getRecommendations()
├── data/
│   └── cars.json                   # 40 Indian cars: specs, pricing, reviews, image URLs
└── types/
    └── index.ts                    # WizardAnswers, CarSpec, CarReview, CarRecommendation, RecommendResponse
```

---

## API Security

- Rate limiter: 3 req/IP/60s — `Map<ip, {count, resetAt}>` in-memory
- Enum validation on all 4 fields before Gemini is called
- `GEMINI_API_KEY` server-side only — no `NEXT_PUBLIC_` prefix

---

## Gemini Integration

**Model:** gemini-2.5-flash  
**Flow:** Budget filter in code → filtered cars passed as JSON → Gemini returns ranked results  
**Gemini returns:** `matchScore` (0-100), `emotionalHook`, `matchReasons[]`, `whyTopPick`  
**Defensive:** Strip markdown code fences before `JSON.parse` — Gemini sometimes wraps in ```json  
**Known issue:** Gemini can hallucinate car IDs not in dataset — `if (!car) throw new Error(...)` catches this

---

## Tailwind v4 Notes

- `globals.css` uses `@import "tailwindcss"` — NOT `@tailwind base/components/utilities`
- No `tailwind.config.ts` — configuration via PostCSS
- Custom colors are CSS variables `var(--orange)` — NOT `text-orange-500`
- Font families via inline `style={{ fontFamily: 'var(--font-syne)' }}` — NOT `className="font-syne"`

---

## Env Vars

| Key | Where |
|---|---|
| GEMINI_API_KEY | `.env.local` (local) + Vercel Environment Variables (production) |

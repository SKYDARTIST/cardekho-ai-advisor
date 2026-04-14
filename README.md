# CarMatch AI — CarDekho Take-Home Assignment

> AI-powered car advisor that maps your lifestyle to the right car. No spec questions. Just 4 honest questions about how you live.

**Live:** https://cardekho-ai-advisor.vercel.app  
**GitHub:** https://github.com/SKYDARTIST/cardekho-ai-advisor

---

## The Problem I Was Solving

Most car-buying tools ask "what fuel type do you want?" or "how many cc engine?" — questions buyers can't answer without already knowing cars. The result: decision paralysis, filter overwhelm, and bounced sessions.

My insight: **confused buyers shop with their hearts, not calculators.** So instead of asking spec questions, I ask lifestyle questions. The AI maps lifestyle → specs silently. The buyer feels understood, not filtered.

---

## What I Built

### Core User Flow
```
Landing → 4-question wizard → AI shortlist (3 cars) → "View on CarDekho →"
```

**4 questions:**
1. What does your typical drive look like? (city / highway / both)
2. Who's usually riding with you? (solo / family / couple / pets)
3. How do you want to feel behind the wheel? (safe / sharp / smart / arrived)
4. What's your hard budget limit?

**Results page shows:**
- 3 ranked car cards with real car photos
- A personalized **emotional hook** per car written by Gemini for your exact answers
- 2-3 factual match reasons with checkmarks
- Spec tags: NCAP rating, mileage, boot space, fuel type
- Direct link to the car on CarDekho

**Also built:**
- Quick Start personas (New parent / Weekend warrior / Smart commuter) — skip the wizard entirely
- Light/dark theme toggle with warm cream light mode
- AI reasoning strip explaining how Gemini chose the shortlist

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 App Router | One repo for frontend + API routes, zero-config Vercel deploy |
| Language | TypeScript | End-to-end type safety from wizard answers to API response |
| Styling | Tailwind v4 + CSS custom properties | v4's PostCSS approach eliminates config; CSS vars handle theming cleanly |
| AI | Gemini 2.5 Flash | Free tier, fast structured JSON output, strong reasoning for ranking |
| Data | Static `data/cars.json` (40 cars) | No DB needed — cuts setup time, sufficient for a shortlisting demo |
| Deploy | Vercel | One push, env vars, auto preview URLs |

**Fonts:** Barlow Condensed (editorial numbers) + Syne (headings/UI) + DM Sans (body)

---

## What I Deliberately Cut

| Feature | Why Cut |
|---|---|
| User auth / login | Not needed for a shortlisting tool — adds 45+ min, zero user value |
| Real-time inventory / pricing | Static data is accurate enough for a demo; live API would need keys + rate limiting |
| Comparison table | Results page already shows specs; comparison adds complexity without changing the decision |
| Saved shortlists (Supabase) | Would require auth + DB migrations — not worth it in 48 hours |
| 20-question form | 4 emotional questions generate better results than 20 spec questions. More isn't better. |
| CNG/EV-only filter | Budget + vibe already routes buyers there naturally |

The cuts were intentional. Every removed feature made the core flow faster and the emotional hook more prominent.

---

## How Gemini Is Used

**Not:** "Here are some cars, write descriptions."  
**Actually:**

1. Code does a hard budget filter on the 40-car dataset first
2. Filtered cars (with full specs) are passed to Gemini in a structured prompt
3. The prompt includes the buyer's 4 answers + a vibe-to-spec mapping:
   - `safe` → prioritize NCAP rating, ground clearance
   - `sharp` → prioritize turbo engines, sporty variants
   - `smart` → prioritize mileage, hybrid/EV options
   - `arrived` → prioritize brand prestige, sunroof, premium audio
4. Gemini ranks the cars AND writes a personalized emotional hook for each
5. Response is parsed as strict JSON (with markdown fence stripping as defensive code)

The emotional hook is the differentiator. A generic tool returns a list. This one returns a sentence that makes you feel seen.

---

## How I Used AI Tools to Build This

This project was built with Claude Code (Anthropic) as primary coding assistant.

**Where AI helped most:**
- Scaffolding the Gemini prompt structure and defensive JSON parsing
- Designing the vibe-to-spec mapping logic
- Building the CSS variable theming system (dark + light mode without React context)
- Writing all SVG icon components to replace generic emoji

**Where I made the decisions:**
- The emotional hook concept (lifestyle → specs, not specs → lifestyle)
- Cutting auth/DB/comparison features
- The warm cream light mode palette (not generic white)
- Using `CustomEvent` for theme communication instead of React context

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

## If I Had 4 More Hours

1. **Comparison mode** — side-by-side spec table for the 3 results, toggle-able
2. **EMI calculator overlay** — "₹15L at 8.5% for 5 years = ₹X/month" on each card
3. **Share shortlist via URL** — the query params are already there, just need an OG image
4. **Better emotional hooks** — chain-of-thought prompting to make Gemini reason about the buyer before writing the hook
5. **CarDekho API integration** — real-time price + availability instead of static data

---

## Project Structure

```
cardekho-ai-advisor/
├── app/
│   ├── page.tsx                 # Landing: hero + QuickStart personas + Wizard modal
│   ├── results/page.tsx         # Results: Gemini fetch + 3 CarCards + reasoning strip
│   ├── api/recommend/route.ts   # POST: budget filter → Gemini → ranked JSON
│   ├── layout.tsx               # Fonts + metadata
│   └── globals.css              # Tailwind v4 + CSS custom properties + light/dark vars
├── components/
│   ├── CarCard.tsx              # Result card with real photo, emotional hook, specs
│   ├── Wizard.tsx               # 4-step wizard orchestrator
│   ├── WizardStep.tsx           # Single question with progress bar + option grid
│   ├── QuickStart.tsx           # 3 persona shortcut cards
│   └── ThemeToggle.tsx          # Sun/moon toggle with localStorage persistence
├── hooks/
│   └── useTheme.ts              # Theme state via CustomEvent (no React context)
├── lib/
│   └── gemini.ts                # Gemini client + prompt builder + JSON parser
├── data/
│   └── cars.json                # 40 Indian cars with specs + image URLs
└── types/
    └── index.ts                 # WizardAnswers, CarSpec, CarRecommendation, RecommendResponse
```

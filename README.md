# CarMatch AI — CarDekho Take-Home Assignment

> AI-powered car advisor that maps your lifestyle to the right car. No spec questions. Just 4 honest questions about how you live.

**Live:** https://cardekho-ai-advisor.vercel.app  
**GitHub:** https://github.com/SKYDARTIST/cardekho-ai-advisor  
**Demo video:** *(link coming)*

---

## Screenshots

| Landing — Light | Landing — Dark |
|---|---|
| ![Landing page light mode](Screenshot%202026-04-15%20at%204.41.32%20AM.png) | ![Landing page dark mode with personas](Screenshot%202026-04-15%20at%204.41.56%20AM.png) |

| Results — Car Cards | Results — The Verdict |
|---|---|
| ![Results page showing 3 matched car cards](Screenshot%202026-04-15%20at%204.41.00%20AM.png) | ![The Verdict section with 5-year ownership cost comparison](Screenshot%202026-04-15%20at%204.41.15%20AM.png) |

---

## What I Built and Why

Most car-buying tools ask "what fuel type do you want?" or "how many cc engine?" — questions buyers can't answer without already knowing cars. The result: decision paralysis, filter overwhelm, abandoned sessions.

**The insight:** confused buyers shop with their hearts, not calculators. So instead of asking spec questions, I ask lifestyle questions. The AI maps lifestyle → specs silently. The buyer feels understood, not interrogated.

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
- **The Verdict** — Gemini explains in one sentence why #1 beats #2 for this buyer, plus a 5-year ownership cost comparison across all 3 results
- AI reasoning strip — transparency on how the shortlist was generated

**Supporting features:**
- Quick Start personas (New parent / Weekend warrior / Smart commuter) — skip the wizard, land directly on results
- Light/dark theme toggle — warm cream palette in light mode, no generic white
- Full-screen editorial loading state with step-by-step progress indicators

---

## What I Deliberately Cut

| Feature | Why |
|---|---|
| User auth / login | Would've killed conversion at entry — the entire problem I'm solving is reducing friction |
| Real-time inventory / pricing | Static data is accurate enough for a demo; live feed needs API keys, rate limiting, caching |
| Saved shortlists | Requires auth + database migrations — not worth the scope |
| Comparison tables | A comparison table re-introduces the paralysis I was removing. One clear verdict beats a grid |
| 20-question spec form | 4 emotional questions produce better results than 20 spec questions. First version had 6 — cut to 4 |
| CNG/EV-only filters | Budget + vibe already routes buyers to the right fuel type naturally |

Every cut protected the core flow. Adding auth would've killed conversion at the entry point. A comparison table would've paralysed the buyer again — exactly the problem I was solving.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 App Router | Single repo for UI + API routes, zero-config Vercel deploy |
| Language | TypeScript | End-to-end type safety from wizard input to API response |
| Styling | Tailwind v4 + CSS custom properties | PostCSS-only approach, no config file; CSS vars handle dark/light theming cleanly |
| AI | Gemini 2.5 Flash | Free tier, fast structured JSON output, strong ranking and emotional copy generation |
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

## What I Delegated to AI vs. Did Manually

### Where AI accelerated execution
- **Gemini prompt architecture** — figuring out the exact JSON schema and vibe-to-spec mapping instructions that make Gemini rank reliably, not randomly
- **CSS variable theming system** — dark/light without React context using CustomEvents is a non-obvious pattern; AI got it right first try
- **SVG icon components** — replacing every emoji with inline SVG across the entire UI; tedious to write manually, AI generated them cleanly
- **Review content at scale** — 2 verified-style buyer quotes across all 40 cars

### Where I made the product decisions
- The lifestyle-over-specs framing — asking "how do you want to feel" instead of "what engine"
- Cutting auth, DB, and comparison features to protect the core flow
- The warm cream light mode (not generic white)
- The Verdict section concept — the gap between "this matches" and "I want this"
- Vibe-to-spec mapping logic that drives Gemini's ranking
- Deciding to cap at 3 results instead of a scrollable list

### Where AI got in the way

**Gemini hallucinated car IDs.** It would recommend `tata-nexon-ev` when the dataset only had `tata-nexon` — the lookup threw an error and the whole response failed. Had to add strict ID validation (`if (!car) throw new Error(...)`) before the cards could render reliably.

**AI-generated user reviews were uniformly positive and vague.** "Great car, very happy!" reads like fake reviews instantly. Had to manually rewrite several to add credible friction — road noise on highways, tight rear legroom, dealer experience friction — so they felt like real buyers, not marketing copy.

---

## API Security

- `GEMINI_API_KEY` is server-side only (no `NEXT_PUBLIC_` prefix, lives only in `lib/gemini.ts` and `.env.local`)
- In-memory rate limiter: 3 requests / IP / 60 seconds — prevents runaway API costs on a demo
- Enum validation on all 4 wizard fields before Gemini is ever called — rejects anything outside known values

---

## If I Had Another 4 Hours

1. **Chain-of-thought prompting** — make Gemini reason about the buyer profile in a hidden scratchpad before writing the emotional hook. A reasoning step would improve specificity and reduce generic copy.
2. **Share shortlist via URL** — wizard answers are already in query params; just needs an OG image generator so previews look good when shared on WhatsApp.
3. **EMI configurator** — let the buyer adjust loan tenure and down payment on the card. Most decisions happen at EMI level, not sticker price.
4. **CarDekho API integration** — swap the static JSON for live pricing and availability. The architecture is already designed for it; `cars.json` is a stand-in.
5. **Test drive CTA** — the highest-intent action a buyer can take; connect to CarDekho's dealer booking flow.

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

## Project Structure

```
cardekho-ai-advisor/
├── app/
│   ├── page.tsx                 # Landing: hero, QuickStart personas, Wizard modal
│   ├── results/page.tsx         # Results: Gemini fetch, CarCards, Verdict, reasoning strip
│   ├── api/recommend/route.ts   # POST: rate limit → enum validation → budget filter → Gemini
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

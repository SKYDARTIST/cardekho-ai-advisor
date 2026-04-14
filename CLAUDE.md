@AGENTS.md

# CarMatch AI — Project Context for Claude

> Read this at the start of every session on this project.

---

## What This Is

**CarMatch AI** — a full-stack AI car advisor built for a CarDekho Group take-home assignment.

**The brief:** Help a car buyer go from "I don't know what to buy" → "confident about my shortlist."

**The insight that shaped everything:** Confused buyers shop with their hearts, not calculators. So instead of asking spec questions (fuel type? engine CC?), we ask lifestyle questions. The AI maps lifestyle → specs silently. The buyer feels understood, not filtered.

**Live:** https://cardekho-ai-advisor.vercel.app  
**GitHub:** https://github.com/SKYDARTIST/cardekho-ai-advisor  
**Assignment submission:** https://forms.gle/b7wEcsEm7ALdgJUFA

---

## What We Built

### Core Flow
1. **Landing page** — hero, stats (40+ cars / 4 questions / 3 picks), "Start Matching" CTA
2. **Quick Start personas** — 3 shortcut buttons that skip the wizard:
   - 👨‍👩‍👧 New parent — safety first
   - 🏔️ Weekend warrior
   - ⚡ Smart commuter
3. **4-question lifestyle wizard** (modal):
   - Q1: What does your drive look like? (city / highway / both)
   - Q2: Who rides with you? (solo / family / couple / pets)
   - Q3: How do you want to feel behind the wheel? (safe / sharp / smart / arrived)
   - Q4: Hard limit budget? (under ₹8L / ₹8-15L / ₹15-25L / above ₹25L)
4. **Results page** — 3 car cards with:
   - AI-generated **emotional hook** per car ("For your bustling city life with the family...")
   - 2-3 factual match reasons with green checkmarks
   - Spec tags (NCAP rating, mileage, boot space, fuel type)
   - "View on CarDekho →" link
   - AI reasoning strip explaining HOW the shortlist was made

### The Emotional Hook (Key Design Decision)
Q3 ("how do you want to feel") drives the Vibe-to-Spec mapping:
- **safe** → SAFETY_FIRST: 5-star NCAP, ground clearance
- **sharp** → PERFORMANCE: turbo engines, sporty variants
- **smart** → FUEL_ECONOMY: highest mileage, hybrid/EV
- **arrived** → PREMIUM_FEEL: brand value, sunroof, premium audio

Gemini uses this to write a personalized emotional hook for each result. That line is what makes it feel different from CarDekho's filter sidebar.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 App Router | One repo for frontend + API routes, Vercel deploy |
| Language | TypeScript | Type safety across wizard → API → results |
| Styling | Tailwind v4 + CSS custom properties | v4 uses PostCSS, no tailwind.config.ts |
| UI components | shadcn/ui (button, card, badge, progress) | Fast, unstyled base |
| AI | Gemini 2.5 Flash via @google/generative-ai | Free tier, fast JSON output |
| Data | Static data/cars.json (40 cars) | No DB needed, cuts 45 min of setup |
| Deploy | Vercel | One command, env vars, instant |

**Fonts:** Syne (headings, --font-syne) + DM Sans (body, --font-dm)
**Color system:** CSS custom properties — --bg, --surface, --surface2, --orange, --green, --muted, --border

---

## File Map

```
cardekho-ai-advisor/
├── app/
│   ├── page.tsx                    # Landing: nav + hero + QuickStart + Wizard modal
│   ├── results/page.tsx            # Results: Gemini fetch + 3 CarCards + reasoning strip
│   ├── api/recommend/route.ts      # POST: receives WizardAnswers, calls Gemini, returns 3 cars
│   ├── layout.tsx                  # Syne + DM Sans fonts, metadata
│   └── globals.css                 # Tailwind v4 @import + CSS custom properties
├── components/
│   ├── QuickStart.tsx              # 3 persona shortcut buttons
│   ├── Wizard.tsx                  # 4-step wizard orchestrator (auto-advance, back, URL nav)
│   ├── WizardStep.tsx              # Single question: progress bar + 2x2 option grid
│   ├── CarCard.tsx                 # Result card: emoji + hook + reasons + specs + link
│   └── ui/                         # shadcn components
├── lib/
│   └── gemini.ts                   # Gemini client, buildPrompt(), getRecommendations()
├── data/
│   └── cars.json                   # 40 Indian cars (Tata, Hyundai, Maruti, Kia, etc.)
├── types/
│   └── index.ts                    # WizardAnswers, CarSpec, CarRecommendation, RecommendResponse
└── docs/
    └── superpowers/plans/
        └── 2026-04-15-carmatch-ai.md  # Full implementation plan
```

---

## Key Decisions & What We Cut

### Kept
- Static JSON dataset (40 cars) — no DB, no auth, no migrations
- Vibe-to-spec mapping in system prompt — clean, fast, debuggable
- Emotional hook line per car — the differentiator
- Quick Start personas — reduces friction for confused buyers
- Single API route — simple, stateless

### Deliberately Cut
- User auth/login — not needed for a shortlisting tool
- Real-time inventory/pricing — static data is fine for the demo
- Comparison table — adds complexity, results page already shows specs
- User history/saved shortlists — Supabase would add 45+ mins
- 20-question form — 4 emotional questions are enough

---

## Gemini Integration

**Model:** gemini-2.5-flash
**Approach:** Budget filter runs first in code → filtered cars passed to Gemini in prompt → Gemini returns JSON with carId, rank, emotionalHook, matchReasons
**Key defensive code in lib/gemini.ts:** Strip markdown code fences before JSON.parse (Gemini wraps in backtick-json sometimes)
**Prompt strategy:** Lifestyle context + vibe mapping + instruction for emotional language + strict JSON-only output

---

## Tailwind v4 Notes

This project uses Tailwind v4. Key differences from v3:
- globals.css uses `@import "tailwindcss"` NOT `@tailwind base/components/utilities`
- There is NO tailwind.config.ts — configuration happens via PostCSS
- Custom colors are CSS variables (var(--orange)), NOT Tailwind color classes (text-orange-500)
- Font families use CSS variables (var(--font-syne)) via inline style, NOT className="font-syne"

---

## Env Vars

| Key | Where | Value |
|---|---|---|
| GEMINI_API_KEY | .env.local + Vercel production | Gemini API key |

---

## Assignment Notes

- **Deadline:** 48 hrs from Apr 14, 3:34 PM IST = Apr 16, 3:34 PM IST
- **Screen recording required** — most important deliverable (30% of score)
- **README needs:** what was built, what was cut, stack rationale, AI delegation notes, next 4 hours
- **Evaluators want to see:** product decisions, how AI tools were used, code quality, deployed and working

---

## What's Next (If Time Permits)

- Real-time price fetch from CarDekho API
- "Compare" mode — side-by-side spec table for the 3 results
- Persist shortlists to Supabase with anonymous session
- Share results via URL
- Improve emotional hook quality with chain-of-thought prompting

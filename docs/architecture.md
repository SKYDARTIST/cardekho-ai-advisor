# Architecture

CarMatch AI is a no-cost portfolio demo for lifestyle-based car shortlisting. It keeps the original product flow while replacing paid LLM inference with deterministic local scoring.

## Runtime Flow

1. The landing page collects four lifestyle answers.
2. The results page posts those answers to `/api/recommend`.
3. The API route validates enum values and applies a lightweight IP rate limit.
4. `lib/recommendations.ts` filters `data/cars.json` by budget, scores each candidate, and returns the top three cars.
5. The UI renders the same card, verdict, EMI, ownership-cost, and review experience without requiring any API key.

## Why Demo Mode

- API cost: visitors cannot spend Gemini/OpenAI credits.
- Security: no provider key is needed in Vercel or local development.
- Reliability: the demo works even when external AI providers are down.
- Portfolio clarity: the repo now shows product logic, tests, docs, and tradeoffs instead of depending on a black-box prompt.

## Key Files

| Path | Responsibility |
| --- | --- |
| `app/page.tsx` | Landing page and wizard entry |
| `app/results/page.tsx` | Results loading, cards, verdict, ownership costs |
| `app/api/recommend/route.ts` | Validation, rate limit, recommendation response |
| `lib/recommendations.ts` | Local scoring and response generation |
| `data/cars.json` | Static car catalog |
| `tests/recommendations.test.ts` | Unit coverage for ranking behavior |

## Tradeoffs

The local scorer is not as expressive as a live LLM, but it is transparent, free, deterministic, and safer for a public portfolio project. A real production version could add a server-side LLM later with strict usage caps and observability.

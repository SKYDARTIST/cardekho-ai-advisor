# Security

## Demo Mode

This project is designed to run without AI provider API keys. The recommendation engine uses local data from `data/cars.json`.

## Do Not Commit

- `.env` or `.env.local`
- Gemini, OpenAI, Anthropic, or OpenRouter keys
- `.vercel/`
- `.next/`
- `node_modules/`
- local screenshots unless they are intentionally placed under `public/screenshots/`
- local AI session files such as `AGENTS.md`, `CLAUDE.md`, `.claude/`, or scratch outputs

## If Live AI Is Added Later

Use a server-side route only. Add rate limits, daily usage caps, logging, and graceful fallback. Never expose provider keys with `NEXT_PUBLIC_` variables.

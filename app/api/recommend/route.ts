import { NextRequest, NextResponse } from 'next/server'
import { getRecommendations } from '@/lib/gemini'
import { WizardAnswers } from '@/types'

// ── Enum validation ──────────────────────────────────────────────────────────
const VALID: Record<keyof WizardAnswers, readonly string[]> = {
  drive:      ['city', 'highway', 'both'],
  passengers: ['solo', 'family', 'couple', 'pets'],
  vibe:       ['safe', 'sharp', 'smart', 'arrived'],
  budget:     ['under8', '8to15', '15to25', 'above25'],
}

// ── In-memory rate limiter: 3 requests / IP / 60 s ──────────────────────────
// Note: resets per cold start on Vercel serverless — sufficient for a demo.
const rateMap = new Map<string, { count: number; resetAt: number }>()
const LIMIT      = 3
const WINDOW_MS  = 60_000

function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function isAllowed(ip: string): boolean {
  const now   = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= LIMIT) return false
  entry.count++
  return true
}

// ── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limit
  if (!isAllowed(getIP(req))) {
    return NextResponse.json(
      { error: 'Too many requests — please wait a minute before trying again.' },
      { status: 429 }
    )
  }

  try {
    const body    = await req.json()
    const answers: WizardAnswers = body.answers

    // 2. Presence check
    if (!answers?.drive || !answers?.passengers || !answers?.vibe || !answers?.budget) {
      return NextResponse.json({ error: 'Missing required answers.' }, { status: 400 })
    }

    // 3. Enum validation — reject anything outside known values
    for (const key of Object.keys(VALID) as (keyof WizardAnswers)[]) {
      if (!VALID[key].includes(answers[key])) {
        return NextResponse.json(
          { error: `Invalid value for field: ${key}` },
          { status: 400 }
        )
      }
    }

    const data = await getRecommendations(answers)
    return NextResponse.json(data)
  } catch (err) {
    console.error('Recommend error:', err)
    return NextResponse.json({ error: 'Failed to get recommendations.' }, { status: 500 })
  }
}

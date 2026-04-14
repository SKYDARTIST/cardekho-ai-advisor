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

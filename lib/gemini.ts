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
3. For each car assign a "matchScore" (0-100) representing how well it fits this buyer. #1 pick should score 85-98, #2 pick 70-84, #3 pick 55-72. Be precise — don't round to 5s.
4. For each car write an "emotionalHook" — 1-2 sentences that connect the car to THIS BUYER'S SPECIFIC LIFE. Reference their drive pattern, passengers, or vibe. Sound like a knowledgeable friend, not a salesperson.
5. Give 2-3 matchReasons as short factual bullet points (e.g., "Best-in-class 5★ NCAP safety", "350L boot fits stroller + groceries")
6. Write "whyTopPick" — ONE sentence explaining specifically why car #1 beats car #2 for THIS buyer. Name both cars. Be direct, not generic. (e.g., "The Nexon's 5-star NCAP edges out the Venue's 3-star rating — critical when your family is on board.")

RESPOND WITH VALID JSON ONLY. No markdown, no explanation, no code fences. Raw JSON only. Format:
{
  "recommendations": [
    {
      "carId": "tata-nexon",
      "rank": 1,
      "matchScore": 93,
      "emotionalHook": "...",
      "matchReasons": ["...", "...", "..."]
    }
  ],
  "summaryLine": "Based on your lifestyle: [brief description of buyer profile]",
  "whyTopPick": "The [car #1] beats the [car #2] for your profile because..."
}`
}

export async function getRecommendations(answers: WizardAnswers): Promise<RecommendResponse> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
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
    matchScore: number;
    emotionalHook: string;
    matchReasons: string[];
  }) => {
    const car = cars.find(c => c.id === r.carId)
    if (!car) throw new Error(`Car not found in dataset: ${r.carId}`)
    return {
      car,
      rank: r.rank,
      matchScore: r.matchScore ?? (r.rank === 1 ? 92 : r.rank === 2 ? 78 : 64),
      emotionalHook: r.emotionalHook,
      matchReasons: r.matchReasons,
    }
  })

  return {
    recommendations: recommendations.sort((a, b) => a.rank - b.rank),
    summaryLine: parsed.summaryLine,
    whyTopPick: parsed.whyTopPick ?? '',
  }
}

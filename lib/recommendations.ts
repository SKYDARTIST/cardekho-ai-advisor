import { CarSpec, CarRecommendation, RecommendResponse, WizardAnswers } from '@/types'
import carsData from '@/data/cars.json'

export const BUDGET_MAP: Record<string, { min: number; max: number; label: string }> = {
  under8: { min: 0, max: 8, label: 'under ₹8L' },
  '8to15': { min: 8, max: 15, label: '₹8L-₹15L' },
  '15to25': { min: 15, max: 25, label: '₹15L-₹25L' },
  above25: { min: 25, max: 999, label: 'above ₹25L' },
}

const DRIVE_LABELS: Record<WizardAnswers['drive'], string> = {
  city: 'mostly city driving',
  highway: 'mostly highway driving',
  both: 'mixed city and highway use',
}

const PASSENGER_LABELS: Record<WizardAnswers['passengers'], string> = {
  solo: 'solo drives',
  family: 'family use',
  couple: 'couple drives',
  pets: 'pet-friendly trips',
}

const VIBE_LABELS: Record<WizardAnswers['vibe'], string> = {
  safe: 'safety-first ownership',
  sharp: 'a sharper drive',
  smart: 'lower running costs',
  arrived: 'a more premium feel',
}

interface ScoredCar {
  car: CarSpec
  score: number
  reasons: string[]
}

function scoreDrive(car: CarSpec, drive: WizardAnswers['drive']): { points: number; reasons: string[] } {
  const reasons: string[] = []
  let points = 0

  if (drive === 'city') {
    if (car.bodyType === 'hatchback') points += 16
    if (car.bodyType === 'suv') points += 9
    if (car.fuelType === 'electric' || car.fuelType === 'cng' || car.fuelType === 'hybrid') points += 12
    if (car.mileage >= 20 || car.fuelType === 'electric') reasons.push('Low running cost makes daily city use easier')
  }

  if (drive === 'highway') {
    if (car.bodyType === 'suv' || car.bodyType === 'sedan') points += 14
    if (car.groundClearance >= 180) points += 8
    if (car.ncapRating >= 4) points += 8
    if (car.groundClearance >= 180) reasons.push(`${car.groundClearance}mm ground clearance suits broken highways`)
  }

  if (drive === 'both') {
    if (car.bodyType === 'suv') points += 13
    if (car.mileage >= 17 || car.fuelType === 'hybrid') points += 8
    if (car.groundClearance >= 180) points += 6
    reasons.push('Balanced for weekday commutes and weekend runs')
  }

  return { points, reasons }
}

function scorePassengers(car: CarSpec, passengers: WizardAnswers['passengers']): { points: number; reasons: string[] } {
  const reasons: string[] = []
  let points = 0

  if (passengers === 'family') {
    if (car.seatingCapacity >= 5) points += 8
    if (car.bootSpace >= 350) points += 10
    if (car.ncapRating >= 4) points += 14
    if (car.ncapRating >= 4) reasons.push(`${car.ncapRating}-star NCAP rating gives family confidence`)
  }

  if (passengers === 'couple') {
    if (car.features.includes('sunroof') || car.features.includes('panoramic_sunroof')) points += 8
    if (car.bodyType === 'sedan' || car.bodyType === 'suv') points += 7
    reasons.push('Comfort and features fit two-person daily use')
  }

  if (passengers === 'solo') {
    if (car.bodyType === 'hatchback' || car.bodyType === 'sedan') points += 8
    if (car.features.includes('wireless_charging')) points += 5
    reasons.push('Easy to live with as a personal daily driver')
  }

  if (passengers === 'pets') {
    if (car.bootSpace >= 350) points += 12
    if (car.groundClearance >= 180) points += 7
    if (car.bodyType === 'suv' || car.bodyType === 'mpv') points += 8
    if (car.bootSpace >= 350) reasons.push(`${car.bootSpace}L boot is useful for pet gear and luggage`)
  }

  return { points, reasons }
}

function scoreVibe(car: CarSpec, vibe: WizardAnswers['vibe']): { points: number; reasons: string[] } {
  const reasons: string[] = []
  let points = 0

  if (vibe === 'safe') {
    points += car.ncapRating * 6
    if (car.features.includes('adas')) points += 8
    reasons.push(`${car.ncapRating}-star NCAP safety is a strong fit for a safety-first buyer`)
  }

  if (vibe === 'sharp') {
    if (car.features.includes('4wd') || car.features.includes('adventure_mode')) points += 12
    if (car.bodyType === 'sedan' || car.bodyType === 'suv') points += 8
    if (car.fuelType === 'diesel' || car.fuelType === 'petrol') points += 5
    reasons.push('Tuned more for driver engagement than plain commuting')
  }

  if (vibe === 'smart') {
    if (car.fuelType === 'electric' || car.fuelType === 'hybrid' || car.fuelType === 'cng') points += 16
    if (car.mileage >= 20) points += 10
    reasons.push(car.fuelType === 'electric' ? 'EV running cost is the strongest smart-money angle' : `${car.mileage} kmpl keeps ownership costs controlled`)
  }

  if (vibe === 'arrived') {
    if (car.features.includes('panoramic_sunroof') || car.features.includes('bose_sound')) points += 12
    if (car.features.includes('sunroof')) points += 6
    if (car.priceMax >= 15) points += 6
    reasons.push('Feature mix gives it a more premium, feel-good cabin')
  }

  return { points, reasons }
}

function scoreCar(car: CarSpec, answers: WizardAnswers): ScoredCar {
  const drive = scoreDrive(car, answers.drive)
  const passengers = scorePassengers(car, answers.passengers)
  const vibe = scoreVibe(car, answers.vibe)
  const budget = BUDGET_MAP[answers.budget]
  const priceMid = (car.priceMin + car.priceMax) / 2
  const budgetFit = priceMid <= budget.max ? 16 : 6

  const reasons = [...drive.reasons, ...passengers.reasons, ...vibe.reasons]
  const score = budgetFit + drive.points + passengers.points + vibe.points

  return { car, score, reasons: Array.from(new Set(reasons)).slice(0, 3) }
}

function normalizeScore(score: number, rank: number): number {
  const baseline = rank === 0 ? 88 : rank === 1 ? 77 : 66
  return Math.max(55, Math.min(98, baseline + Math.round(score / 12)))
}

function emotionalHook(car: CarSpec, answers: WizardAnswers): string {
  if (answers.vibe === 'safe') {
    return `The ${car.model} keeps the decision practical: safety, visibility, and confidence matter more here than flashy spec-sheet wins.`
  }
  if (answers.vibe === 'smart') {
    return `The ${car.model} fits a buyer who wants the numbers to make sense after the excitement fades: fuel, maintenance, and daily usability stay in check.`
  }
  if (answers.vibe === 'sharp') {
    return `The ${car.model} gives your shortlist some character, so the car feels like a choice you made instead of a compromise you accepted.`
  }
  return `The ${car.model} works when you want the car to feel like an upgrade every time you open the door, not just a transport decision.`
}

function fallbackReason(car: CarSpec): string {
  if (car.ncapRating >= 4) return `${car.ncapRating}-star NCAP rating strengthens the safety case`
  if (car.mileage >= 20) return `${car.mileage} kmpl makes it efficient for regular use`
  if (car.bootSpace >= 350) return `${car.bootSpace}L boot space keeps it practical`
  return `${car.priceLabel} keeps it inside the selected budget band`
}

export function recommendCars(answers: WizardAnswers): RecommendResponse {
  const budget = BUDGET_MAP[answers.budget]
  const cars = carsData as CarSpec[]
  const budgetMatches = cars.filter(car => car.priceMin <= budget.max && car.priceMax >= budget.min)
  const candidates = budgetMatches.length >= 3 ? budgetMatches : cars

  const recommendations: CarRecommendation[] = candidates
    .map(car => scoreCar(car, answers))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.car.priceMax - b.car.priceMax
    })
    .slice(0, 3)
    .map((result, index) => ({
      car: result.car,
      rank: (index + 1) as 1 | 2 | 3,
      matchScore: normalizeScore(result.score, index),
      emotionalHook: emotionalHook(result.car, answers),
      matchReasons: result.reasons.length ? result.reasons : [fallbackReason(result.car)],
    }))

  const first = recommendations[0]?.car
  const second = recommendations[1]?.car

  return {
    recommendations,
    summaryLine: `Based on ${DRIVE_LABELS[answers.drive]}, ${PASSENGER_LABELS[answers.passengers]}, ${VIBE_LABELS[answers.vibe]}, and a ${budget.label} budget.`,
    whyTopPick: first && second
      ? `The ${first.model} beats the ${second.model} for this profile because it scores better across your lifestyle priorities while staying inside the selected budget band.`
      : '',
  }
}

export async function getRecommendations(answers: WizardAnswers): Promise<RecommendResponse> {
  return recommendCars(answers)
}

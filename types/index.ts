export type DriveType = 'city' | 'highway' | 'both'
export type PassengerType = 'solo' | 'family' | 'couple' | 'pets'
export type VibeType = 'safe' | 'sharp' | 'smart' | 'arrived'
export type BudgetType = 'under8' | '8to15' | '15to25' | 'above25'

export interface WizardAnswers {
  drive: DriveType
  passengers: PassengerType
  vibe: VibeType
  budget: BudgetType
}

export interface CarSpec {
  id: string
  make: string
  model: string
  variant: string
  priceMin: number   // in lakhs
  priceMax: number   // in lakhs
  bodyType: 'hatchback' | 'sedan' | 'suv' | 'mpv' | 'pickup'
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng'
  mileage: number    // kmpl (0 for EV)
  bootSpace: number  // litres
  ncapRating: number // 0-5
  groundClearance: number // mm
  seatingCapacity: number
  features: string[]
  priceLabel: string
  imageUrl?: string
}

export interface CarRecommendation {
  car: CarSpec
  rank: 1 | 2 | 3
  emotionalHook: string
  matchReasons: string[]
}

export interface RecommendResponse {
  recommendations: CarRecommendation[]
  summaryLine: string
}

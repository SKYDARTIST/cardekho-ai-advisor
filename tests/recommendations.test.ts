import { describe, expect, it } from 'vitest'
import { BUDGET_MAP, recommendCars } from '../lib/recommendations'
import type { WizardAnswers } from '../types'

const baseAnswers: WizardAnswers = {
  drive: 'city',
  passengers: 'family',
  vibe: 'safe',
  budget: '8to15',
}

describe('demo recommendation engine', () => {
  it('returns three ranked recommendations without API calls', () => {
    const result = recommendCars(baseAnswers)

    expect(result.recommendations).toHaveLength(3)
    expect(result.recommendations.map(rec => rec.rank)).toEqual([1, 2, 3])
    expect(result.summaryLine).toContain(BUDGET_MAP[baseAnswers.budget].label)
  })

  it('keeps recommendations inside the selected budget band when enough cars match', () => {
    const result = recommendCars({ ...baseAnswers, budget: 'under8' })
    const budget = BUDGET_MAP.under8

    expect(result.recommendations.every(({ car }) => car.priceMin <= budget.max && car.priceMax >= budget.min)).toBe(true)
  })

  it('prioritizes safety for family safety-first buyers', () => {
    const result = recommendCars({
      drive: 'both',
      passengers: 'family',
      vibe: 'safe',
      budget: '8to15',
    })

    expect(result.recommendations[0].car.ncapRating).toBeGreaterThanOrEqual(4)
    expect(result.recommendations[0].matchReasons.join(' ')).toMatch(/NCAP|safety/i)
  })

  it('surfaces low-running-cost cars for smart city buyers', () => {
    const result = recommendCars({
      drive: 'city',
      passengers: 'solo',
      vibe: 'smart',
      budget: '15to25',
    })

    expect(result.recommendations.some(({ car }) => ['electric', 'hybrid', 'cng'].includes(car.fuelType))).toBe(true)
  })
})

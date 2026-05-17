# Recommendation Methodology

The demo scorer maps lifestyle answers to measurable car attributes.

## Inputs

- `drive`: city, highway, or mixed
- `passengers`: solo, family, couple, or pets
- `vibe`: safe, sharp, smart, or arrived
- `budget`: four price bands

## Scoring Signals

| Buyer signal | Car attributes considered |
| --- | --- |
| City driving | hatchback/SUV size, EV/CNG/hybrid fuel, mileage |
| Highway driving | SUV/sedan body, ground clearance, NCAP rating |
| Family use | seating, boot space, NCAP rating |
| Pets | boot space, ground clearance, SUV/MPV body |
| Safe | NCAP rating and ADAS |
| Smart | mileage, EV, hybrid, CNG |
| Sharp | driver-oriented body/fuel/adventure features |
| Arrived | premium features, sunroof/audio, higher trim pricing |

## Output

The API returns:

- three ranked cars
- match score from 55-98
- short emotional hook
- factual match reasons
- one-sentence top-pick verdict

## Rules

- No paid AI provider calls.
- No client-side secrets.
- Results must come from `data/cars.json`.
- Missing or invalid wizard answers are rejected before scoring.

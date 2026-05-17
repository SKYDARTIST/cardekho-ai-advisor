# Spec: Demo Recommendation Engine

## Goal

Return useful car recommendations without requiring Gemini, OpenAI, or any paid AI provider.

## Acceptance Criteria

- API returns exactly three ranked recommendations for valid answers.
- Results are deterministic for the same input.
- Recommendations prefer cars overlapping the selected budget band.
- Family/safety profiles prioritize high NCAP cars.
- Smart/city profiles surface lower-running-cost cars where possible.
- The UI copy must not claim a paid model is thinking.

## Non-Goals

- Real-time CarDekho inventory.
- Dealer booking.
- Paid LLM inference.
- User accounts or saved shortlists.

'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { WizardAnswers, RecommendResponse } from '@/types'
import CarCard from '@/components/CarCard'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/hooks/useTheme'

function ResultsContent() {
  const params   = useSearchParams()
  const router   = useRouter()
  const isDark   = useTheme()
  const [data, setData]       = useState<RecommendResponse | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMsg, setLoadingMsg] = useState(0)

  const answers: WizardAnswers = {
    drive:      params.get('drive')      as WizardAnswers['drive'],
    passengers: params.get('passengers') as WizardAnswers['passengers'],
    vibe:       params.get('vibe')       as WizardAnswers['vibe'],
    budget:     params.get('budget')     as WizardAnswers['budget'],
  }

  useEffect(() => {
    if (!answers.drive || !answers.passengers || !answers.vibe || !answers.budget) {
      router.push('/')
      return
    }
    const msgInterval = setInterval(() => setLoadingMsg(m => (m + 1) % 3), 1200)
    fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
      .then(async r => {
        const d = await r.json()
        if (r.status === 429) throw new Error('RATE_LIMIT')
        if (d.error) throw new Error(d.error)
        return d
      })
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => { clearInterval(msgInterval); setLoading(false) })
    return () => clearInterval(msgInterval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadingMessages = [
    'Reading your lifestyle...',
    'Filtering 40+ cars...',
    'Writing your shortlist...',
  ]

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'var(--bg)' }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-100 pointer-events-none" />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,85,0,0.06) 0%, transparent 70%)' }}
        />

        {/* Big background word */}
        <div
          className="absolute select-none pointer-events-none font-black leading-none"
          style={{
            fontFamily: 'var(--font-barlow)',
            fontSize: 'clamp(120px, 20vw, 280px)',
            color: 'rgba(255,85,0,0.04)',
            letterSpacing: '-0.04em',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
          }}
        >
          MATCHING
        </div>

        <div className="relative z-10 flex flex-col items-center gap-10 px-8 text-center">
          {/* Large spinner */}
          <div className="relative">
            {/* Outer decorative ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: '-16px',
                border: '1px solid rgba(255,85,0,0.08)',
              }}
            />
            {/* Spinning ring */}
            <div
              className="w-24 h-24 rounded-full border-2 animate-spin"
              style={{
                borderColor: 'rgba(255,85,0,0.15)',
                borderTopColor: 'var(--orange)',
                animationDuration: '1.2s',
              }}
            />
            {/* Inner glow */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,85,0,0.12) 0%, transparent 70%)' }}
            />
            {/* Centre dot */}
            <div
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: 'var(--orange)', boxShadow: '0 0 12px var(--orange)' }}
              />
            </div>
          </div>

          {/* Heading */}
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.25em] mb-4"
              style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}
            >
              Gemini 2.5 Flash is thinking
            </p>
            <h2
              className="font-black leading-tight mb-2"
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 'clamp(36px, 5vw, 64px)',
                letterSpacing: '-0.02em',
                color: 'var(--text)',
              }}
            >
              FINDING YOUR
              <br />
              <span style={{ color: 'var(--orange-text)' }}>PERFECT MATCH</span>
            </h2>
          </div>

          {/* Step indicators */}
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            {loadingMessages.map((msg, i) => (
              <div
                key={i}
                className="w-full flex items-center gap-3 transition-all duration-500"
                style={{ opacity: i <= loadingMsg ? 1 : 0.25 }}
              >
                {/* Step dot */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
                  style={{
                    background: i < loadingMsg
                      ? 'var(--green-dim)'
                      : i === loadingMsg
                        ? 'var(--orange-dim)'
                        : 'transparent',
                    border: i < loadingMsg
                      ? '1px solid var(--green)'
                      : i === loadingMsg
                        ? '1px solid var(--orange)'
                        : '1px solid var(--border-strong)',
                  }}
                >
                  {i < loadingMsg ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : i === loadingMsg ? (
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--orange)' }} />
                  ) : null}
                </div>
                {/* Step label */}
                <span
                  className="text-sm text-left transition-all duration-500"
                  style={{
                    fontFamily: i === loadingMsg ? 'var(--font-syne)' : 'inherit',
                    fontWeight: i === loadingMsg ? 600 : 400,
                    color: i < loadingMsg
                      ? 'var(--green)'
                      : i === loadingMsg
                        ? 'var(--orange-text)'
                        : 'var(--muted)',
                  }}
                >
                  {msg}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    const isRateLimit = error === 'RATE_LIMIT'
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center max-w-sm px-6">
          {isRateLimit ? (
            <>
              <p className="text-2xl mb-3">⏳</p>
              <p className="font-semibold mb-2" style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}>
                Too many requests
              </p>
              <p className="text-sm mb-5" style={{ color: 'var(--muted2)' }}>
                You've hit the rate limit. Please wait a minute and try again.
              </p>
            </>
          ) : (
            <p className="mb-4 text-sm" style={{ color: 'var(--muted2)' }}>Something went wrong: {error}</p>
          )}
          <button onClick={() => router.push('/')} className="text-sm font-medium" style={{ color: 'var(--orange-text)' }}>
            ← Start over
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* NAV */}
      <nav
        className="flex items-center justify-between px-8 md:px-12 py-5 sticky top-0 z-50 backdrop-blur-xl"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--nav-bg)' }}
      >
        <a href="/" className="font-extrabold text-base flex items-center gap-2.5 cursor-pointer" style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)', textDecoration: 'none' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--orange)', boxShadow: '0 0 12px var(--orange)' }} />
          Car<span style={{ color: 'var(--orange)' }}>Match</span> AI
        </a>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => router.push('/')}
            className="text-xs font-medium transition-colors hover:text-white"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}
          >
            ← New search
          </button>
        </div>
      </nav>

      {/* HEADER */}
      <div className="relative overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-100 pointer-events-none" />
        {/* Spotlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 80% at 50% 0%, rgba(255,85,0,0.06) 0%, transparent 70%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-8 md:px-12 pt-16 pb-14">
          <div className="afu flex items-center gap-3 mb-5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--green)', boxShadow: '0 0 10px var(--green)' }}
            />
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--green)' }}>
              AI Shortlist Ready
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1
              className="afu-1 font-black leading-[0.9]"
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 'clamp(52px, 7vw, 96px)',
                letterSpacing: '-0.02em',
              }}
            >
              YOUR TOP 3
              <br />
              <span style={{ color: 'var(--orange-text)' }}>MATCHES</span>
            </h1>

            {data?.summaryLine && (
              <p
                className="afu-2 text-sm font-light max-w-sm leading-relaxed text-right"
                style={{ color: 'var(--muted2)' }}
              >
                {data.summaryLine}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CAR CARDS */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.recommendations.map((rec, i) => (
            <CarCard
              key={rec.car.id}
              rec={rec}
              enterClass={['card-enter-1', 'card-enter-2', 'card-enter-3'][i]}
            />
          ))}
        </div>

        {/* THE VERDICT */}
        {data && (
          <div
            className="afu-4 mt-10 rounded-2xl overflow-hidden"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            {/* Header */}
            <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <p
                className="text-[9px] uppercase tracking-[0.25em] mb-2 font-medium"
                style={{ color: 'var(--orange-text)', fontFamily: 'var(--font-syne)' }}
              >
                The Verdict
              </p>
              <h3
                className="font-bold text-lg mb-3"
                style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
              >
                Why {data.recommendations[0]?.car.model} is your car
              </h3>
              {data.whyTopPick && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted2)' }}>
                  {data.whyTopPick}
                </p>
              )}
            </div>

            {/* 5-year ownership cost comparison */}
            <div className="px-6 py-5">
              <p
                className="text-[9px] uppercase tracking-[0.25em] mb-5 font-medium"
                style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}
              >
                5-year ownership cost · 15,000 km/year
              </p>
              <div className="space-y-4">
                {(() => {
                  const FUEL_PRICE: Record<string, number> = { petrol: 103, diesel: 90, electric: 0, hybrid: 103, cng: 70 }
                  const MAINT_YEAR: Record<string, number> = { petrol: 7000, diesel: 10000, electric: 4000, hybrid: 8000, cng: 6000 }
                  const FUEL_ACCENT_LOCAL: Record<string, string> = { petrol: '#ff5500', diesel: '#6366f1', electric: '#00b4ff', hybrid: '#00d68f', cng: '#38bdf8' }
                  const KM = 15000

                  const costs = data.recommendations.map(rec => {
                    const c = rec.car
                    const fuelPerYear = c.fuelType === 'electric'
                      ? KM * 1.5
                      : c.mileage > 0 ? (KM / c.mileage) * FUEL_PRICE[c.fuelType] : 0
                    const maintPerYear = MAINT_YEAR[c.fuelType] ?? 7000
                    const insurPerYear = c.priceMax * 100000 * 0.02
                    const total = Math.round(((fuelPerYear + maintPerYear + insurPerYear) * 5) / 10000) / 10
                    return { rec, total }
                  })

                  const maxCost = Math.max(...costs.map(x => x.total))

                  return costs.map(({ rec, total }, i) => {
                    const accent = FUEL_ACCENT_LOCAL[rec.car.fuelType] ?? '#ff5500'
                    const pct = Math.round((total / maxCost) * 100)
                    return (
                      <div key={rec.car.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {i === 0 && (
                              <span
                                className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                style={{ background: 'var(--orange-dim)', color: 'var(--orange-text)', fontFamily: 'var(--font-syne)' }}
                              >
                                Cheapest
                              </span>
                            )}
                            <span className="text-sm font-medium" style={{ color: 'var(--text)', fontFamily: 'var(--font-syne)' }}>
                              {rec.car.model}
                            </span>
                          </div>
                          <span className="text-sm font-bold" style={{ color: accent }}>
                            ₹{total}L
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full w-full"
                          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
                        >
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${pct}%`, background: accent, transition: 'width 1s cubic-bezier(0.16,1,0.3,1)' }}
                          />
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
              <p className="mt-4 text-[10px]" style={{ color: 'var(--muted)' }}>
                Fuel + insurance (2% p.a. of ex-showroom) + maintenance. Actual costs vary by city and usage.
              </p>
            </div>
          </div>
        )}

        {/* AI Reasoning strip */}
        <div
          className="afu-4 mt-10 rounded-2xl p-6 flex items-start gap-5"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'var(--orange-dim)',
              border: '1px solid rgba(255,85,0,0.25)',
              color: 'var(--orange-text)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
              <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none"/>
              <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: 'var(--orange-text)', fontFamily: 'var(--font-syne)' }}
            >
              How we chose these
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted2)' }}>
              We filtered{' '}
              <strong style={{ color: 'var(--text)', fontWeight: 500 }}>40+ Indian cars</strong>{' '}
              to your budget, then used{' '}
              <strong style={{ color: 'var(--text)', fontWeight: 500 }}>Gemini 2.5 Flash</strong>{' '}
              to rank by what matters to <em>you</em> — not just specs. The emotional match on each
              card was written specifically for your answers.{' '}
              <span style={{ color: 'var(--orange-text)' }}>Not a generic result.</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
          <div
            className="w-12 h-12 rounded-full border-2 animate-spin"
            style={{ borderColor: 'rgba(255,85,0,0.2)', borderTopColor: 'var(--orange)' }}
          />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}

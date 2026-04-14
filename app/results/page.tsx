'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { WizardAnswers, RecommendResponse } from '@/types'
import CarCard from '@/components/CarCard'

function ResultsContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<RecommendResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMsg, setLoadingMsg] = useState(0)

  const answers: WizardAnswers = {
    drive: params.get('drive') as WizardAnswers['drive'],
    passengers: params.get('passengers') as WizardAnswers['passengers'],
    vibe: params.get('vibe') as WizardAnswers['vibe'],
    budget: params.get('budget') as WizardAnswers['budget'],
  }

  useEffect(() => {
    if (!answers.drive || !answers.passengers || !answers.vibe || !answers.budget) {
      router.push('/')
      return
    }

    // Cycle loading messages
    const msgInterval = setInterval(() => {
      setLoadingMsg(m => (m + 1) % 3)
    }, 1200)

    fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch(e => setError(e.message))
      .finally(() => {
        clearInterval(msgInterval)
        setLoading(false)
      })

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
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: 'var(--bg)' }}
      >
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--orange)', borderTopColor: 'transparent' }}
        />
        <div className="text-center space-y-2">
          {loadingMessages.map((msg, i) => (
            <p
              key={i}
              className="text-sm transition-all duration-500"
              style={{ color: i === loadingMsg ? 'var(--orange)' : 'var(--muted)' }}
            >
              {msg}
            </p>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg)' }}
      >
        <div className="text-center">
          <p className="mb-4" style={{ color: 'var(--muted)' }}>Something went wrong: {error}</p>
          <button
            onClick={() => router.push('/')}
            className="text-sm underline"
            style={{ color: 'var(--orange)' }}
          >
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
        className="flex items-center justify-between px-10 py-5 sticky top-0 backdrop-blur-md"
        style={{ borderBottom: '1px solid var(--border)', background: 'rgba(8,8,16,0.9)' }}
      >
        <div
          className="font-extrabold text-lg flex items-center gap-2"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--orange)', boxShadow: '0 0 10px #f97316' }}
          />
          Car<span style={{ color: 'var(--orange)' }}>Match</span> AI
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-xs transition-colors hover:text-white"
          style={{ color: 'var(--muted)' }}
        >
          ← Start over
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <p
            className="text-xs uppercase tracking-widest flex items-center gap-2 mb-3"
            style={{ color: 'var(--green)' }}
          >
            <span className="w-4 h-px" style={{ background: 'var(--green)' }} />
            AI Shortlist Ready
          </p>
          <h1
            className="font-extrabold text-4xl mb-2"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Your top 3 matches
          </h1>
          {data?.summaryLine && (
            <p className="text-sm font-light" style={{ color: 'var(--muted)' }}>
              {data.summaryLine}
            </p>
          )}
        </div>

        {/* Car cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {data?.recommendations.map((rec) => (
            <CarCard key={rec.car.id} rec={rec} />
          ))}
        </div>

        {/* AI reasoning strip */}
        <div
          className="rounded-2xl p-5 flex items-start gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
            style={{
              background: 'var(--orange-dim)',
              border: '1px solid rgba(249,115,22,0.25)',
            }}
          >
            🤖
          </div>
          <div className="text-sm leading-relaxed" style={{ color: '#a0a0c0' }}>
            <strong style={{ color: '#f0eeff', fontWeight: 500 }}>How we chose these: </strong>
            We filtered{' '}
            <strong style={{ color: '#f0eeff', fontWeight: 500 }}>40+ Indian cars</strong> to your
            budget, then used Gemini AI to rank by what matters to{' '}
            <em>you</em> — not just specs. The emotional match on each card was written specifically
            for your answers.{' '}
            <span style={{ color: 'var(--orange)' }}>Not a generic result.</span>
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
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'var(--bg)' }}
        >
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--orange)', borderTopColor: 'transparent' }}
          />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}

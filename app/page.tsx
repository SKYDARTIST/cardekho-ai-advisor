'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import QuickStart from '@/components/QuickStart'
import { WizardAnswers } from '@/types'

export default function Home() {
  const router = useRouter()
  const [showWizard, setShowWizard] = useState(false)

  function handleQuickStart(answers: WizardAnswers) {
    const params = new URLSearchParams(answers as unknown as Record<string, string>)
    router.push(`/results?${params.toString()}`)
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* NAV */}
      <nav
        className="flex items-center justify-between px-10 py-5 sticky top-0 z-50 backdrop-blur-md"
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
        <span
          className="text-xs tracking-widest uppercase px-3 py-1 rounded-full"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          by CarDekho
        </span>
      </nav>

      {/* HERO */}
      <section className="max-w-3xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest mb-8" style={{ color: 'var(--orange)' }}>
          <span className="w-6 h-px" style={{ background: 'var(--orange)' }} />
          AI-Powered Car Advisor
          <span className="w-6 h-px" style={{ background: 'var(--orange)' }} />
        </div>

        <h1
          className="font-extrabold text-5xl md:text-6xl leading-[1.05] mb-6"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Find your car.<br />
          Not just <em className="not-italic" style={{ color: 'var(--orange)' }}>a</em> car.
        </h1>

        <p className="text-lg leading-relaxed mb-12 font-light max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
          Answer 4 questions about your life — not your specs.
          We'll shortlist the 3 cars built for how you actually drive.
        </p>

        <button
          onClick={() => setShowWizard(true)}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5"
          style={{
            background: 'var(--orange)',
            color: '#000',
            fontFamily: 'var(--font-syne)',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 12px 30px rgba(249,115,22,0.35)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
        >
          Start Matching
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="flex justify-center gap-10 mt-14 mb-16">
          {[['40+', 'Cars in dataset'], ['4', 'Questions only'], ['3', 'Shortlisted picks']].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="font-bold text-2xl" style={{ fontFamily: 'var(--font-syne)' }}>{num}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        <QuickStart onSelect={handleQuickStart} />
      </section>

      {/* Wizard placeholder — will be replaced in Task 5 */}
      {showWizard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="rounded-2xl p-8 max-w-md w-full"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>Wizard loading...</p>
            <button
              onClick={() => setShowWizard(false)}
              className="mt-4 w-full text-xs"
              style={{ color: 'var(--muted)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

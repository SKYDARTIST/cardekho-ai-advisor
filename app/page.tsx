'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import QuickStart from '@/components/QuickStart'
import Wizard from '@/components/Wizard'
import { WizardAnswers } from '@/types'

export default function Home() {
  const router = useRouter()
  const [showWizard, setShowWizard] = useState(false)

  function handleQuickStart(answers: WizardAnswers) {
    const params = new URLSearchParams(answers as unknown as Record<string, string>)
    router.push(`/results?${params.toString()}`)
  }

  return (
    <main className="min-h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* NAV */}
      <nav
        className="flex items-center justify-between px-8 md:px-12 py-5 sticky top-0 z-50 backdrop-blur-xl"
        style={{ borderBottom: '1px solid var(--border)', background: 'rgba(7,7,15,0.85)' }}
      >
        <div className="font-extrabold text-base flex items-center gap-2.5" style={{ fontFamily: 'var(--font-syne)' }}>
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--orange)', boxShadow: '0 0 12px var(--orange)' }}
          />
          Car<span style={{ color: 'var(--orange)' }}>Match</span> AI
        </div>
        <div className="flex items-center gap-4">
          <span
            className="hidden sm:block text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            by CarDekho
          </span>
          <button
            onClick={() => setShowWizard(true)}
            className="text-[11px] font-semibold px-4 py-2 rounded-full transition-all"
            style={{
              background: 'var(--orange-dim)',
              color: 'var(--orange-text)',
              border: '1px solid rgba(255,85,0,0.3)',
              fontFamily: 'var(--font-syne)',
            }}
          >
            Start →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center">

        {/* Dot grid background */}
        <div className="absolute inset-0 dot-grid opacity-100 pointer-events-none" />

        {/* Radial spotlight */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(255,85,0,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Horizontal speed lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[15, 35, 55, 75].map((top, i) => (
            <div
              key={i}
              className="absolute h-px"
              style={{
                top: `${top}%`,
                right: 0,
                width: `${20 + i * 8}%`,
                background: `linear-gradient(to right, transparent, rgba(255,85,0,${0.04 + i * 0.02}))`,
              }}
            />
          ))}
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-8 md:px-12 py-20 md:py-0">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-12 items-center">

            {/* Left — Text */}
            <div>
              <div className="afu inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] mb-10" style={{ color: 'var(--orange-text)' }}>
                <span className="w-8 h-px" style={{ background: 'var(--orange)' }} />
                AI-Powered Car Advisor for India
              </div>

              <h1
                className="afu-1 font-black leading-[0.92] mb-8"
                style={{
                  fontFamily: 'var(--font-barlow)',
                  fontSize: 'clamp(68px, 9vw, 130px)',
                  letterSpacing: '-0.02em',
                }}
              >
                FIND YOUR
                <br />
                <span style={{ color: 'var(--orange)', WebkitTextStroke: '2px var(--orange)' }}>
                  PERFECT
                </span>
                <br />
                CAR.
              </h1>

              <p
                className="afu-2 text-base md:text-lg font-light leading-relaxed mb-10 max-w-lg"
                style={{ color: 'var(--muted2)' }}
              >
                Answer 4 questions about your <em className="not-italic font-medium" style={{ color: 'var(--text)' }}>life</em> — not your specs.
                We map your lifestyle to the right car. Silently.
              </p>

              <div className="afu-3 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setShowWizard(true)}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all"
                  style={{
                    background: 'var(--orange)',
                    color: '#000',
                    fontFamily: 'var(--font-syne)',
                    boxShadow: '0 0 0 0 rgba(255,85,0,0.4)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(255,85,0,0.4)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 0 0 0 rgba(255,85,0,0.4)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Start Matching
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  No account needed · 30 seconds
                </span>
              </div>

              {/* Stats row */}
              <div className="afu-4 flex items-center gap-0 mt-16 border-t pt-10" style={{ borderColor: 'var(--border)' }}>
                {[
                  { num: '40+', label: 'Indian cars' },
                  { num: '4', label: 'Questions only' },
                  { num: '3', label: 'Shortlisted picks' },
                ].map(({ num, label }, i) => (
                  <div
                    key={label}
                    className="flex-1 text-center border-r last:border-r-0"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div
                      className="font-black text-3xl md:text-4xl leading-none"
                      style={{ fontFamily: 'var(--font-barlow)', color: i === 0 ? 'var(--orange-text)' : 'var(--text)' }}
                    >
                      {num}
                    </div>
                    <div className="text-[11px] mt-2 uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual */}
            <div className="hidden md:flex items-center justify-center relative h-[500px]">

              {/* Outer ring */}
              <div
                className="absolute w-[380px] h-[380px] rounded-full"
                style={{
                  border: '1px solid rgba(255,85,0,0.12)',
                  background: 'radial-gradient(circle at 40% 40%, rgba(255,85,0,0.06) 0%, transparent 60%)',
                }}
              />
              {/* Middle ring */}
              <div
                className="absolute w-[270px] h-[270px] rounded-full"
                style={{ border: '1px dashed rgba(255,85,0,0.18)' }}
              />

              {/* Car emoji — main */}
              <div className="a-float relative z-10 flex flex-col items-center">
                <span
                  className="select-none"
                  style={{
                    fontSize: '160px',
                    lineHeight: 1,
                    filter: 'drop-shadow(0 20px 60px rgba(255,85,0,0.25)) drop-shadow(0 4px 16px rgba(0,0,0,0.8))',
                  }}
                >
                  🚙
                </span>
                <div
                  className="mt-4 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase"
                  style={{
                    background: 'var(--orange-dim)',
                    border: '1px solid rgba(255,85,0,0.3)',
                    color: 'var(--orange-text)',
                    fontFamily: 'var(--font-syne)',
                  }}
                >
                  AI Match Ready
                </div>
              </div>

              {/* Floating spec chips */}
              {[
                { label: '5★ NCAP', top: '10%', right: '5%', color: '#00d68f' },
                { label: '27 kmpl', top: '75%', right: '0%', color: 'var(--orange-text)' },
                { label: 'Gemini AI', top: '20%', left: '0%', color: '#a78bfa' },
                { label: '40+ cars', top: '65%', left: '5%', color: 'var(--muted2)' },
              ].map(({ label, top, right, left, color }: { label: string; top: string; right?: string; left?: string; color: string }) => (
                <div
                  key={label}
                  className="absolute text-[10px] font-semibold px-3 py-1.5 rounded-full tracking-wide"
                  style={{
                    top, right, left,
                    color,
                    background: 'var(--surface)',
                    border: '1px solid var(--border-strong)',
                    fontFamily: 'var(--font-syne)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* QUICK START */}
      <section className="max-w-7xl mx-auto px-8 md:px-12 pb-24">
        <div className="afu-5 flex items-center gap-4 mb-8">
          <span className="h-px flex-1" style={{ background: 'var(--border)' }} />
          <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
            or start with a persona
          </span>
          <span className="h-px flex-1" style={{ background: 'var(--border)' }} />
        </div>
        <QuickStart onSelect={handleQuickStart} />
      </section>

      {showWizard && <Wizard onClose={() => setShowWizard(false)} />}
    </main>
  )
}

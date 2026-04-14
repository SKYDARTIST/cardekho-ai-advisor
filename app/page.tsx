'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import QuickStart from '@/components/QuickStart'
import Wizard from '@/components/Wizard'
import ThemeToggle from '@/components/ThemeToggle'
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
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--nav-bg)' }}
      >
        <div className="font-extrabold text-base flex items-center gap-2.5" style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}>
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
          <ThemeToggle />
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

        {/* Horizontal speed lines — span full width to connect columns */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[15, 35, 55, 75].map((top, i) => (
            <div
              key={i}
              className="absolute h-px"
              style={{
                top: `${top}%`,
                left: '30%',
                right: 0,
                background: `linear-gradient(to right, transparent, rgba(255,85,0,${0.06 + i * 0.025}), transparent)`,
              }}
            />
          ))}
          {/* Centre connecting line between columns */}
          <div
            className="absolute h-px hidden md:block"
            style={{
              top: '50%',
              left: '42%',
              width: '8%',
              background: 'linear-gradient(to right, transparent, rgba(255,85,0,0.18), transparent)',
            }}
          />
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

                <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted2)' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                    <div className="text-xs mt-2 uppercase tracking-widest font-medium" style={{ color: 'var(--muted2)' }}>
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

              {/* Real car image — circular, floating */}
              <div className="a-float relative z-10 flex flex-col items-center">
                <div
                  className="relative overflow-hidden"
                  style={{
                    width: '280px',
                    height: '280px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,85,0,0.2)',
                    boxShadow: '0 0 60px rgba(255,85,0,0.15), 0 30px 60px rgba(0,0,0,0.5)',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=600&h=600&fit=crop&q=85"
                    alt="Featured car"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 60%' }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, rgba(255,85,0,0.08) 0%, transparent 60%)' }}
                  />
                </div>
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

              {/* Floating spec chips — staggered entrance */}
              {[
                { label: '5★ NCAP',  top: '10%', right: '5%',  color: '#00d68f',           cls: 'chip-in-1' },
                { label: '27 kmpl',  top: '75%', right: '0%',  color: 'var(--orange-text)', cls: 'chip-in-2' },
                { label: 'Gemini AI',top: '20%', left: '0%',   color: '#a78bfa',            cls: 'chip-in-3' },
                { label: '40+ cars', top: '65%', left: '5%',   color: 'var(--muted2)',      cls: 'chip-in-4' },
              ].map(({ label, top, right, left, color, cls }: { label: string; top: string; right?: string; left?: string; color: string; cls: string }) => (
                <div
                  key={label}
                  className={`absolute text-[10px] font-semibold px-3 py-1.5 rounded-full tracking-wide ${cls}`}
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
      <section className="max-w-7xl mx-auto px-8 md:px-12 pb-28">
        {/* Section divider */}
        <div className="afu-5 flex items-center gap-6 mb-10">
          <span className="h-px flex-1" style={{ background: 'var(--border)' }} />
          <div className="flex flex-col items-center gap-1.5">
            <span
              className="text-[9px] uppercase tracking-[0.25em] font-medium"
              style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}
            >
              or skip the questions
            </span>
            <span
              className="text-sm font-bold tracking-tight"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-syne)' }}
            >
              Pick your persona
            </span>
          </div>
          <span className="h-px flex-1" style={{ background: 'var(--border)' }} />
        </div>
        <QuickStart onSelect={handleQuickStart} />
      </section>

      {showWizard && <Wizard onClose={() => setShowWizard(false)} />}
    </main>
  )
}

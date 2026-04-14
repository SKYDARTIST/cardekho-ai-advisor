'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WizardStep from './WizardStep'
import { WizardAnswers } from '@/types'

// SVG icons — no emojis
const Icons = {
  city: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="13" height="12"/><path d="M9 21V9l-6 3"/>
      <path d="M16 6h5v15h-5"/>
    </svg>
  ),
  highway: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l3-10 3 6 3-4 3 4 3-6 3 10"/>
      <path d="M12 7V3"/>
    </svg>
  ),
  both: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  solo: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>
    </svg>
  ),
  family: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="6" r="3"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0"/>
      <circle cx="17" cy="8" r="2.5"/><path d="M13.5 20a3.5 3.5 0 0 1 7 0"/>
    </svg>
  ),
  couple: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/>
      <circle cx="17" cy="7" r="3.5"/><path d="M11 20a6 6 0 0 1 12 0"/>
    </svg>
  ),
  pets: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.1 2.344-2"/>
      <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.1-2.344-2"/>
      <path d="M8 14v.5M16 14v.5M11.25 16.25h1.5L12 17z"/>
      <path d="M4.42 11.247A13.2 13.2 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.8 8.8 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
    </svg>
  ),
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  bolt: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  leaf: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
  star: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  coinSmall: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8"/><path d="M12 8v4M10 10h4"/>
    </svg>
  ),
  card: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  gem: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 3 18 3 22 9 12 22 2 9 6 3"/><polyline points="2 9 12 9 22 9"/><line x1="12" y1="3" x2="12" y2="9"/>
    </svg>
  ),
  crown: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17l2-9 4 4 4-7 4 7 4-4 2 9H2z"/><line x1="2" y1="21" x2="22" y2="21"/>
    </svg>
  ),
}

const STEPS = [
  {
    question: "What does your typical drive look like?",
    subtext: "Think about your most common journeys — daily commute, errands, trips.",
    field: 'drive' as keyof WizardAnswers,
    options: [
      { value: 'city',    icon: Icons.city,    title: 'City life',    desc: 'Traffic, tight parking, short trips.' },
      { value: 'highway', icon: Icons.highway, title: 'Open roads',   desc: 'Highway runs, long distances, speed.' },
      { value: 'both',    icon: Icons.both,    title: 'Both equally', desc: 'City during week, highway on weekends.' },
    ],
  },
  {
    question: "Who's usually riding with you?",
    subtext: "This shapes the space and safety setup we recommend.",
    field: 'passengers' as keyof WizardAnswers,
    options: [
      { value: 'solo',   icon: Icons.solo,   title: 'Just me',      desc: 'Solo driver. Quick and efficient.' },
      { value: 'family', icon: Icons.family, title: 'Full family',   desc: 'Kids, bags, and never enough boot space.' },
      { value: 'couple', icon: Icons.couple, title: 'Me + partner',  desc: 'Comfort and style over pure practicality.' },
      { value: 'pets',   icon: Icons.pets,   title: 'Me + pets',    desc: 'Space and easy-clean surfaces are a must.' },
    ],
  },
  {
    question: "How do you want to feel behind the wheel?",
    subtext: "This is the most important question. Be honest.",
    field: 'vibe' as keyof WizardAnswers,
    options: [
      { value: 'safe',    icon: Icons.shield, title: 'Safe & protected', desc: 'My family is everything. Safety first.' },
      { value: 'sharp',   icon: Icons.bolt,   title: 'Sharp & alive',    desc: 'I want to feel the road. Performance matters.' },
      { value: 'smart',   icon: Icons.leaf,   title: 'Smart & efficient', desc: 'I hate wasting money on fuel. Every rupee counts.' },
      { value: 'arrived', icon: Icons.star,   title: "I've arrived",     desc: "I've earned something that shows it. Premium." },
    ],
  },
  {
    question: "What's your hard limit on budget?",
    subtext: "The number you absolutely won't cross. On-road price.",
    field: 'budget' as keyof WizardAnswers,
    options: [
      { value: 'under8',  icon: Icons.coinSmall, title: 'Under ₹8L',      desc: 'Practical and fuel-efficient.' },
      { value: '8to15',   icon: Icons.card,      title: '₹8L – ₹15L',    desc: 'The sweet spot for most buyers.' },
      { value: '15to25',  icon: Icons.gem,       title: '₹15L – ₹25L',   desc: 'Premium features, top-spec variants.' },
      { value: 'above25', icon: Icons.crown,     title: 'Above ₹25L',     desc: 'No compromise. The best available.' },
    ],
  },
]

interface WizardProps {
  onClose: () => void
}

export default function Wizard({ onClose }: WizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<WizardAnswers>>({})

  const current = STEPS[step]
  const selectedValue = (answers[current.field] as string) ?? null

  function handleSelect(value: string) {
    const updated = { ...answers, [current.field]: value } as Partial<WizardAnswers>
    setAnswers(updated)
    setTimeout(() => {
      if (step < STEPS.length - 1) {
        setStep(step + 1)
      } else {
        const params = new URLSearchParams(updated as Record<string, string>)
        router.push(`/results?${params.toString()}`)
      }
    }, 280)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl p-8"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-sm transition-colors hover:text-white"
          style={{ color: 'var(--muted)' }}
          aria-label="Close"
        >
          ✕
        </button>

        <WizardStep
          stepNumber={step + 1}
          totalSteps={STEPS.length}
          question={current.question}
          subtext={current.subtext}
          options={current.options}
          selected={selectedValue}
          onSelect={handleSelect}
        />

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-6 text-xs flex items-center gap-1 transition-colors hover:text-white"
            style={{ color: 'var(--muted)' }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}

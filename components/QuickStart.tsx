'use client'

import { WizardAnswers } from '@/types'

// SVG icons — no emojis
const FamilyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="6" r="3"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0"/>
    <circle cx="17" cy="8" r="2.5"/><path d="M13.5 20a3.5 3.5 0 0 1 7 0"/>
  </svg>
)

const MountainIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
  </svg>
)

const CommutIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2"/>
    <path d="M16 8h4l3 3v5h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

interface QuickStartProps {
  onSelect: (answers: WizardAnswers) => void
}

const PERSONAS = [
  {
    label: 'New parent',
    Icon: FamilyIcon,
    desc: 'Family SUV, 5-star safety, big boot space',
    tag: 'Safety first',
    answers: { drive: 'city', passengers: 'family', vibe: 'safe', budget: '8to15' } as WizardAnswers,
  },
  {
    label: 'Weekend warrior',
    Icon: MountainIcon,
    desc: 'High clearance, adventure-ready, highway cruiser',
    tag: 'Performance',
    answers: { drive: 'highway', passengers: 'couple', vibe: 'sharp', budget: '15to25' } as WizardAnswers,
  },
  {
    label: 'Smart commuter',
    Icon: CommutIcon,
    desc: 'Best mileage, lowest running cost, city nimble',
    tag: 'Fuel economy',
    answers: { drive: 'city', passengers: 'solo', vibe: 'smart', budget: '8to15' } as WizardAnswers,
  },
]

export default function QuickStart({ onSelect }: QuickStartProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
      {PERSONAS.map((p) => (
        <button
          key={p.label}
          onClick={() => onSelect(p.answers)}
          className="group relative flex flex-col items-start gap-3 p-5 rounded-2xl text-left transition-all duration-200"
          style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = 'rgba(255,85,0,0.35)'
            el.style.background = 'var(--orange-dim)'
            el.style.transform = 'translateY(-2px)'
            el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = 'var(--border)'
            el.style.background = 'var(--surface)'
            el.style.transform = 'translateY(0)'
            el.style.boxShadow = 'none'
          }}
        >
          <span
            className="text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
            style={{ color: 'var(--orange-text)', background: 'var(--orange-dim)', border: '1px solid rgba(255,85,0,0.2)', fontFamily: 'var(--font-syne)' }}
          >
            {p.tag}
          </span>
          <span style={{ color: 'var(--muted2)' }}>
            <p.Icon />
          </span>
          <div>
            <p className="font-bold text-sm mb-1" style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}>
              {p.label}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted2)' }}>
              {p.desc}
            </p>
          </div>
          <span className="absolute bottom-4 right-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--orange-text)' }}>
            →
          </span>
        </button>
      ))}
    </div>
  )
}

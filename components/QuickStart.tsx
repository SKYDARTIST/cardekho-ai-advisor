'use client'

import { WizardAnswers } from '@/types'

interface QuickStartProps {
  onSelect: (answers: WizardAnswers) => void
}

const PERSONAS: { label: string; emoji: string; desc: string; tag: string; answers: WizardAnswers }[] = [
  {
    label: 'New parent',
    emoji: '👨‍👩‍👧',
    desc: 'Family SUV, 5-star safety, big boot space',
    tag: 'Safety first',
    answers: { drive: 'city', passengers: 'family', vibe: 'safe', budget: '8to15' },
  },
  {
    label: 'Weekend warrior',
    emoji: '🏔️',
    desc: 'High clearance, adventure-ready, highway cruiser',
    tag: 'Performance',
    answers: { drive: 'highway', passengers: 'couple', vibe: 'sharp', budget: '15to25' },
  },
  {
    label: 'Smart commuter',
    emoji: '⚡',
    desc: 'Best mileage, lowest running cost, city nimble',
    tag: 'Fuel economy',
    answers: { drive: 'city', passengers: 'solo', vibe: 'smart', budget: '8to15' },
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
            el.style.background = 'linear-gradient(135deg, rgba(255,85,0,0.06) 0%, var(--surface) 100%)'
            el.style.transform = 'translateY(-2px)'
            el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = 'var(--border)'
            el.style.background = 'var(--surface)'
            el.style.transform = 'translateY(0)'
            el.style.boxShadow = 'none'
          }}
        >
          {/* Tag */}
          <span
            className="text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
            style={{
              color: 'var(--orange-text)',
              background: 'var(--orange-dim)',
              border: '1px solid rgba(255,85,0,0.2)',
              fontFamily: 'var(--font-syne)',
            }}
          >
            {p.tag}
          </span>

          <span className="text-3xl select-none">{p.emoji}</span>

          <div>
            <p
              className="font-bold text-sm mb-1"
              style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
            >
              {p.label}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted2)' }}>
              {p.desc}
            </p>
          </div>

          {/* Arrow */}
          <span
            className="absolute bottom-4 right-4 text-xs transition-opacity opacity-0 group-hover:opacity-100"
            style={{ color: 'var(--orange-text)' }}
          >
            →
          </span>
        </button>
      ))}
    </div>
  )
}

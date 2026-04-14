'use client'

import { WizardAnswers } from '@/types'

interface QuickStartProps {
  onSelect: (answers: WizardAnswers) => void
}

const PERSONAS: { label: string; emoji: string; desc: string; answers: WizardAnswers }[] = [
  {
    label: 'New parent — safety first',
    emoji: '👨‍👩‍👧',
    desc: 'Family SUV, 5-star safety, boot space',
    answers: { drive: 'city', passengers: 'family', vibe: 'safe', budget: '8to15' },
  },
  {
    label: 'Weekend warrior',
    emoji: '🏔️',
    desc: 'Ground clearance, adventure-ready',
    answers: { drive: 'highway', passengers: 'couple', vibe: 'sharp', budget: '15to25' },
  },
  {
    label: 'Smart commuter',
    emoji: '⚡',
    desc: 'Best mileage, lowest running cost',
    answers: { drive: 'city', passengers: 'solo', vibe: 'smart', budget: '8to15' },
  },
]

export default function QuickStart({ onSelect }: QuickStartProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-center text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
        — or start with a persona —
      </p>
      <div className="grid grid-cols-3 gap-3">
        {PERSONAS.map((p) => (
          <button
            key={p.label}
            onClick={() => onSelect(p.answers)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl text-left transition-all hover:-translate-y-0.5"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(249,115,22,0.4)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--surface2)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--surface)'
            }}
          >
            <span className="text-2xl">{p.emoji}</span>
            <span className="font-semibold text-xs leading-tight text-center" style={{ fontFamily: 'var(--font-syne)' }}>{p.label}</span>
            <span className="text-xs text-center" style={{ color: 'var(--muted)' }}>{p.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

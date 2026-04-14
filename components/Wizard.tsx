'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WizardStep from './WizardStep'
import { WizardAnswers } from '@/types'

const STEPS = [
  {
    question: "What does your typical drive look like?",
    subtext: "Think about your most common journeys — daily commute, errands, trips.",
    field: 'drive' as keyof WizardAnswers,
    options: [
      { value: 'city', emoji: '🏙️', title: 'City life', desc: 'Traffic, tight parking, short trips.' },
      { value: 'highway', emoji: '🛣️', title: 'Open roads', desc: 'Highway runs, long distances, speed.' },
      { value: 'both', emoji: '🗺️', title: 'Both equally', desc: 'City during week, highway on weekends.' },
    ],
  },
  {
    question: "Who's usually riding with you?",
    subtext: "This shapes the space and safety setup we recommend.",
    field: 'passengers' as keyof WizardAnswers,
    options: [
      { value: 'solo', emoji: '🧑', title: 'Just me', desc: 'Solo driver. Quick and efficient.' },
      { value: 'family', emoji: '👨‍👩‍👧‍👦', title: 'Full family', desc: 'Kids, bags, and never enough boot space.' },
      { value: 'couple', emoji: '👫', title: 'Me + partner', desc: 'Comfort and style over pure practicality.' },
      { value: 'pets', emoji: '🐕', title: 'Me + pets', desc: 'Space and easy-clean surfaces are a must.' },
    ],
  },
  {
    question: "How do you want to feel behind the wheel?",
    subtext: "This is the most important question. Be honest.",
    field: 'vibe' as keyof WizardAnswers,
    options: [
      { value: 'safe', emoji: '🛡️', title: 'Safe & protected', desc: 'My family is everything. Safety first.' },
      { value: 'sharp', emoji: '⚡', title: 'Sharp & alive', desc: 'I want to feel the road. Performance matters.' },
      { value: 'smart', emoji: '🌿', title: 'Smart & efficient', desc: 'I hate wasting money on fuel. Every rupee counts.' },
      { value: 'arrived', emoji: '🏆', title: "I've arrived", desc: "I've earned something that shows it. Premium." },
    ],
  },
  {
    question: "What's your hard limit on budget?",
    subtext: "The number you absolutely won't cross. On-road price.",
    field: 'budget' as keyof WizardAnswers,
    options: [
      { value: 'under8', emoji: '💰', title: 'Under ₹8L', desc: 'Practical and fuel-efficient.' },
      { value: '8to15', emoji: '💳', title: '₹8L – ₹15L', desc: 'The sweet spot for most buyers.' },
      { value: '15to25', emoji: '💎', title: '₹15L – ₹25L', desc: 'Premium features, top-spec variants.' },
      { value: 'above25', emoji: '👑', title: 'Above ₹25L', desc: 'No compromise. The best available.' },
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

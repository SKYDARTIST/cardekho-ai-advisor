'use client'

interface Option {
  value: string
  emoji: string
  title: string
  desc: string
}

interface WizardStepProps {
  stepNumber: number
  totalSteps: number
  question: string
  subtext: string
  options: Option[]
  selected: string | null
  onSelect: (value: string) => void
}

export default function WizardStep({
  stepNumber,
  totalSteps,
  question,
  subtext,
  options,
  selected,
  onSelect,
}: WizardStepProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-0.5 rounded-full transition-all duration-300"
            style={{ background: i < stepNumber ? 'var(--orange)' : 'var(--surface2)' }}
          />
        ))}
      </div>

      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
        Step <span style={{ color: 'var(--orange)', fontWeight: 600 }}>{stepNumber}</span> of {totalSteps}
      </p>

      <h2
        className="font-bold text-2xl mb-1 leading-tight"
        style={{ fontFamily: 'var(--font-syne)' }}
      >
        {question}
      </h2>
      <p className="text-sm mb-8 font-light" style={{ color: 'var(--muted)' }}>{subtext}</p>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="relative flex flex-col items-start p-5 rounded-2xl text-left transition-all"
            style={{
              border: selected === opt.value ? '1.5px solid var(--orange)' : '1.5px solid var(--border)',
              background: selected === opt.value ? 'var(--surface2)' : 'var(--surface)',
            }}
          >
            {selected === opt.value && (
              <span
                className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-black font-bold"
                style={{ background: 'var(--orange)', fontSize: '10px' }}
              >
                ✓
              </span>
            )}
            <span className="text-3xl mb-3">{opt.emoji}</span>
            <span className="font-semibold text-sm mb-1" style={{ fontFamily: 'var(--font-syne)' }}>
              {opt.title}
            </span>
            <span className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              {opt.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

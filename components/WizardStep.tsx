'use client'

interface Option {
  value: string
  icon: React.ReactNode
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
      {/* Progress segments */}
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full transition-all duration-300"
            style={{ background: i < stepNumber ? 'var(--orange)' : 'var(--border-strong)' }}
          />
        ))}
      </div>

      {/* Step label */}
      <p className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>
        Question{' '}
        <span style={{ color: 'var(--orange-text)', fontWeight: 700 }}>{stepNumber}</span>
        {' '}of {totalSteps}
      </p>

      <h2 className="font-bold text-2xl md:text-3xl leading-tight mb-2" style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}>
        {question}
      </h2>
      <p className="text-sm mb-8 font-light" style={{ color: 'var(--muted2)' }}>
        {subtext}
      </p>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className="relative flex flex-col items-start p-5 rounded-2xl text-left transition-all duration-200"
              style={{
                border: isSelected ? '1.5px solid var(--orange)' : '1.5px solid var(--border)',
                background: isSelected ? 'var(--orange-dim)' : 'var(--surface2s)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isSelected ? '0 0 20px var(--orange-glow)' : 'none',
              }}
            >
              {isSelected && (
                <span
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-black font-bold"
                  style={{ background: 'var(--orange)', fontSize: '10px' }}
                >
                  ✓
                </span>
              )}
              {/* SVG icon */}
              <span
                className="mb-3"
                style={{ color: isSelected ? 'var(--orange-text)' : 'var(--muted2)' }}
              >
                {opt.icon}
              </span>
              <span className="font-semibold text-sm mb-1 leading-tight" style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}>
                {opt.title}
              </span>
              <span className="text-xs leading-relaxed" style={{ color: 'var(--muted2)' }}>
                {opt.desc}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

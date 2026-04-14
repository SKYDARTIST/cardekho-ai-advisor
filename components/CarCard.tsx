import { CarRecommendation } from '@/types'

const NCAP_COLOR: Record<number, string> = {
  5: '#22c55e',
  4: '#84cc16',
  3: '#f59e0b',
  2: '#f97316',
  1: '#ef4444',
  0: '#6b6b8a',
}

const FUEL_LABEL: Record<string, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  electric: 'Electric',
  hybrid: 'Hybrid',
  cng: 'CNG',
}

const CAR_EMOJI: Record<string, string> = {
  suv: '🚙',
  sedan: '🚗',
  hatchback: '🚘',
  mpv: '🚐',
  pickup: '🛻',
}

interface CarCardProps {
  rec: CarRecommendation
}

export default function CarCard({ rec }: CarCardProps) {
  const { car, rank, emotionalHook, matchReasons } = rec
  const isTopPick = rank === 1

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
      style={{
        background: 'var(--surface)',
        border: isTopPick ? '1px solid var(--orange)' : '1px solid var(--border)',
      }}
    >
      {isTopPick && (
        <div
          className="absolute top-3 left-3 z-10 font-bold text-black text-[10px] tracking-widest uppercase px-3 py-1 rounded-full"
          style={{ background: 'var(--orange)', fontFamily: 'var(--font-syne)' }}
        >
          ★ Best Match
        </div>
      )}

      {/* Car image area */}
      <div
        className="h-40 flex items-center justify-center relative overflow-hidden"
        style={{ background: 'var(--surface2)' }}
      >
        <div
          className="absolute w-32 h-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)' }}
        />
        <span className="text-6xl z-10 relative drop-shadow-lg">
          {CAR_EMOJI[car.bodyType] || '🚗'}
        </span>
        <div
          className="absolute bottom-0 inset-x-0 h-10"
          style={{ background: 'linear-gradient(to top, var(--surface), transparent)' }}
        />
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
          {car.make}
        </p>
        <h3 className="font-bold text-xl mb-0.5" style={{ fontFamily: 'var(--font-syne)' }}>
          {car.model}
        </h3>
        <p className="text-sm font-medium mb-4" style={{ color: 'var(--orange)' }}>
          {car.priceLabel}
        </p>

        {/* Emotional hook */}
        <div
          className="rounded-xl p-3 mb-4 border-l-2 text-xs leading-relaxed italic"
          style={{
            background: 'var(--surface2)',
            borderLeftColor: 'var(--orange)',
            color: '#a0a0c0',
          }}
        >
          &quot;{emotionalHook}&quot;
        </div>

        {/* Match reasons */}
        <ul className="space-y-1.5 mb-4">
          {matchReasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--muted)' }}>
              <span className="mt-0.5 shrink-0" style={{ color: 'var(--green)' }}>✓</span>
              {r}
            </li>
          ))}
        </ul>

        {/* Spec tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {car.ncapRating > 0 && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-md"
              style={{
                color: NCAP_COLOR[car.ncapRating] || '#6b6b8a',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
              }}
            >
              {car.ncapRating}★ NCAP
            </span>
          )}
          {car.mileage > 0 && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-md"
              style={{ color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)' }}
            >
              {car.mileage} kmpl
            </span>
          )}
          {car.bootSpace > 0 && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-md"
              style={{ color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)' }}
            >
              {car.bootSpace}L boot
            </span>
          )}
          <span
            className="text-[10px] px-2 py-0.5 rounded-md"
            style={{ color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)' }}
          >
            {FUEL_LABEL[car.fuelType] || car.fuelType}
          </span>
        </div>

        <a
          href={`https://www.cardekho.com/cars/${car.make.toLowerCase().replace(/\s+/g, '-')}/${car.model.toLowerCase().replace(/\s+/g, '-')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2.5 text-center text-xs rounded-xl transition-all"
          style={{ border: '1px solid var(--border)', color: '#f0eeff' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--orange)'
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--orange)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'
            ;(e.currentTarget as HTMLAnchorElement).style.color = '#f0eeff'
          }}
        >
          View on CarDekho →
        </a>
      </div>
    </div>
  )
}

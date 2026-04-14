'use client'

import { CarRecommendation } from '@/types'

const NCAP_COLOR: Record<number, string> = {
  5: '#00d68f',
  4: '#84cc16',
  3: '#f59e0b',
  2: '#f97316',
  1: '#ef4444',
  0: '#52526e',
}

const FUEL_LABEL: Record<string, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  electric: 'Electric ⚡',
  hybrid: 'Hybrid 🌿',
  cng: 'CNG',
}

// Gradient per fuel type — the "image area" background
const FUEL_BG: Record<string, string> = {
  petrol:   'linear-gradient(145deg, #100800 0%, #1f0c00 40%, #120600 100%)',
  diesel:   'linear-gradient(145deg, #07080f 0%, #0d0f20 40%, #070912 100%)',
  electric: 'linear-gradient(145deg, #040f1a 0%, #061828 40%, #03111a 100%)',
  hybrid:   'linear-gradient(145deg, #041008 0%, #071f0f 40%, #030e07 100%)',
  cng:      'linear-gradient(145deg, #060c14 0%, #0a1624 40%, #050b14 100%)',
}

const FUEL_GLOW: Record<string, string> = {
  petrol:   'rgba(255, 85, 0, 0.22)',
  diesel:   'rgba(99, 102, 241, 0.18)',
  electric: 'rgba(0, 180, 255, 0.22)',
  hybrid:   'rgba(0, 214, 143, 0.22)',
  cng:      'rgba(56, 189, 248, 0.18)',
}

const FUEL_ACCENT: Record<string, string> = {
  petrol:   '#ff5500',
  diesel:   '#6366f1',
  electric: '#00b4ff',
  hybrid:   '#00d68f',
  cng:      '#38bdf8',
}

const CAR_EMOJI: Record<string, string> = {
  suv:       '🚙',
  sedan:     '🚗',
  hatchback: '🚘',
  mpv:       '🚐',
  pickup:    '🛻',
}

const RANK_NUM = ['01', '02', '03']

interface CarCardProps {
  rec: CarRecommendation
  enterClass?: string
}

export default function CarCard({ rec, enterClass = '' }: CarCardProps) {
  const { car, rank, emotionalHook, matchReasons } = rec
  const isTopPick = rank === 1
  const fuelGlow  = FUEL_GLOW[car.fuelType]  || FUEL_GLOW.petrol
  const fuelBg    = FUEL_BG[car.fuelType]    || FUEL_BG.petrol
  const fuelAccent = FUEL_ACCENT[car.fuelType] || FUEL_ACCENT.petrol

  return (
    <div
      className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${enterClass}`}
      style={{
        background: 'var(--surface)',
        border: isTopPick ? `1px solid rgba(255,85,0,0.5)` : '1px solid var(--border)',
        boxShadow: isTopPick ? '0 0 40px rgba(255,85,0,0.1)' : '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >

      {/* ── Image area ── */}
      <div
        className="relative overflow-hidden flex items-center justify-center"
        style={{ height: '220px', background: fuelBg }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 60%, ${fuelGlow} 0%, transparent 65%)`,
          }}
        />

        {/* Rank watermark */}
        <div
          className="absolute right-4 bottom-0 font-black leading-none select-none pointer-events-none"
          style={{
            fontFamily: 'var(--font-barlow)',
            fontSize: '120px',
            color: 'rgba(255,255,255,0.04)',
            lineHeight: 0.85,
          }}
        >
          {RANK_NUM[rank - 1]}
        </div>

        {/* Car emoji — floating */}
        <div className="a-float relative z-10">
          <span
            style={{
              fontSize: '96px',
              lineHeight: 1,
              display: 'block',
              filter: `drop-shadow(0 12px 40px ${fuelGlow}) drop-shadow(0 4px 10px rgba(0,0,0,0.7))`,
            }}
          >
            {CAR_EMOJI[car.bodyType] || '🚗'}
          </span>
        </div>

        {/* Best match badge */}
        {isTopPick && (
          <div
            className="absolute top-3 left-3 z-20 text-black font-bold text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full"
            style={{
              background: 'var(--orange)',
              fontFamily: 'var(--font-syne)',
              boxShadow: '0 4px 12px rgba(255,85,0,0.4)',
            }}
          >
            ★ Best Match
          </div>
        )}

        {/* Rank badge (non-top) */}
        {!isTopPick && (
          <div
            className="absolute top-3 left-3 z-20 font-bold text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full"
            style={{
              color: 'var(--muted2)',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-syne)',
            }}
          >
            #{rank} Pick
          </div>
        )}

        {/* Fuel accent bar at bottom */}
        <div
          className="absolute bottom-0 inset-x-0 h-[2px]"
          style={{ background: `linear-gradient(to right, transparent, ${fuelAccent}, transparent)`, opacity: 0.6 }}
        />

        {/* Fade to card body */}
        <div
          className="absolute bottom-0 inset-x-0 h-12"
          style={{ background: 'linear-gradient(to top, var(--surface), transparent)' }}
        />
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5 pt-4">

        {/* Make + model */}
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: 'var(--muted)' }}>
            {car.make}
          </p>
          <div className="flex items-baseline justify-between gap-2">
            <h3
              className="font-extrabold text-2xl leading-tight"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {car.model}
            </h3>
            <span
              className="text-sm font-semibold shrink-0"
              style={{ color: fuelAccent, fontFamily: 'var(--font-syne)' }}
            >
              {car.priceLabel}
            </span>
          </div>
        </div>

        {/* Emotional hook */}
        <div
          className="rounded-xl px-4 py-3 mb-4 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderLeft: `2px solid ${fuelAccent}`,
          }}
        >
          <p className="text-xs leading-relaxed italic" style={{ color: 'var(--muted2)' }}>
            &ldquo;{emotionalHook}&rdquo;
          </p>
        </div>

        {/* Match reasons */}
        <ul className="space-y-2 mb-5">
          {matchReasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs" style={{ color: 'var(--muted2)' }}>
              <span
                className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold"
                style={{ background: 'var(--green-dim)', color: 'var(--green)' }}
              >
                ✓
              </span>
              {r}
            </li>
          ))}
        </ul>

        {/* Spec tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {car.ncapRating > 0 && (
            <span
              className="text-[10px] px-2.5 py-1 rounded-lg font-medium"
              style={{
                color: NCAP_COLOR[car.ncapRating] || '#52526e',
                background: `${NCAP_COLOR[car.ncapRating]}15`,
                border: `1px solid ${NCAP_COLOR[car.ncapRating]}30`,
              }}
            >
              {car.ncapRating}★ NCAP
            </span>
          )}
          {car.mileage > 0 && (
            <span className="text-[10px] px-2.5 py-1 rounded-lg" style={{ color: 'var(--muted2)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
              {car.mileage} kmpl
            </span>
          )}
          {car.bootSpace > 0 && (
            <span className="text-[10px] px-2.5 py-1 rounded-lg" style={{ color: 'var(--muted2)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
              {car.bootSpace}L boot
            </span>
          )}
          <span
            className="text-[10px] px-2.5 py-1 rounded-lg font-medium"
            style={{ color: fuelAccent, background: `${fuelAccent}15`, border: `1px solid ${fuelAccent}30` }}
          >
            {FUEL_LABEL[car.fuelType] || car.fuelType}
          </span>
        </div>

        {/* CTA */}
        <a
          href={`https://www.cardekho.com/cars/${car.make.toLowerCase().replace(/\s+/g, '-')}/${car.model.toLowerCase().replace(/\s+/g, '-')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block w-full py-3 text-center text-xs font-semibold rounded-xl transition-all duration-200 group"
          style={{
            border: '1px solid var(--border-strong)',
            color: 'var(--muted2)',
            fontFamily: 'var(--font-syne)',
            letterSpacing: '0.06em',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.borderColor = fuelAccent
            el.style.color = fuelAccent
            el.style.background = `${fuelAccent}10`
            el.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.borderColor = 'var(--border-strong)'
            el.style.color = 'var(--muted2)'
            el.style.background = 'transparent'
            el.style.transform = 'translateY(0)'
          }}
        >
          View on CarDekho →
        </a>
      </div>
    </div>
  )
}

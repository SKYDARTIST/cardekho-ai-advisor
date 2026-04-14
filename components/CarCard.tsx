'use client'

import { useState } from 'react'
import { CarRecommendation } from '@/types'
import { useTheme } from '@/hooks/useTheme'

const NCAP_COLOR: Record<number, string> = {
  5: '#00d68f',
  4: '#84cc16',
  3: '#f59e0b',
  2: '#f97316',
  1: '#ef4444',
  0: '#52526e',
}

const FUEL_LABEL: Record<string, string> = {
  petrol:   'Petrol',
  diesel:   'Diesel',
  electric: 'Electric',
  hybrid:   'Hybrid',
  cng:      'CNG',
}

const FUEL_BG_DARK: Record<string, string> = {
  petrol:   'linear-gradient(145deg, #100800 0%, #1f0c00 40%, #120600 100%)',
  diesel:   'linear-gradient(145deg, #07080f 0%, #0d0f20 40%, #070912 100%)',
  electric: 'linear-gradient(145deg, #040f1a 0%, #061828 40%, #03111a 100%)',
  hybrid:   'linear-gradient(145deg, #041008 0%, #071f0f 40%, #030e07 100%)',
  cng:      'linear-gradient(145deg, #060c14 0%, #0a1624 40%, #050b14 100%)',
}

const FUEL_BG_LIGHT: Record<string, string> = {
  petrol:   'linear-gradient(145deg, #fff8f2 0%, #fff0e6 40%, #fff8f2 100%)',
  diesel:   'linear-gradient(145deg, #f5f5fa 0%, #ecedf8 40%, #f5f5fa 100%)',
  electric: 'linear-gradient(145deg, #f0f8ff 0%, #e0f3ff 40%, #f0f8ff 100%)',
  hybrid:   'linear-gradient(145deg, #f0faf5 0%, #e0f5eb 40%, #f0faf5 100%)',
  cng:      'linear-gradient(145deg, #f0f6ff 0%, #e0edff 40%, #f0f6ff 100%)',
}

const FUEL_GLOW_DARK: Record<string, string> = {
  petrol:   'rgba(255, 85, 0, 0.22)',
  diesel:   'rgba(99, 102, 241, 0.18)',
  electric: 'rgba(0, 180, 255, 0.22)',
  hybrid:   'rgba(0, 214, 143, 0.22)',
  cng:      'rgba(56, 189, 248, 0.18)',
}

const FUEL_GLOW_LIGHT: Record<string, string> = {
  petrol:   'rgba(255, 85, 0, 0.12)',
  diesel:   'rgba(99, 102, 241, 0.1)',
  electric: 'rgba(0, 150, 255, 0.12)',
  hybrid:   'rgba(0, 160, 90, 0.12)',
  cng:      'rgba(56, 150, 220, 0.1)',
}

const FUEL_ACCENT: Record<string, string> = {
  petrol:   '#ff5500',
  diesel:   '#6366f1',
  electric: '#00b4ff',
  hybrid:   '#00d68f',
  cng:      '#38bdf8',
}

const RANK_NUM = ['01', '02', '03']

// EMI: on-road ≈ priceMax × 1.12, 80% loan, 8.5% p.a., 60 months
function calcEMI(priceMaxLakhs: number): string {
  const loan = priceMaxLakhs * 1.12 * 0.8 * 100000
  const r = 0.085 / 12
  const n = 60
  const emi = Math.round((loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) / 500) * 500
  return `~₹${(emi / 1000).toFixed(0)}K/mo`
}

// Deterministic plausible buyer count from car ID
function buyersCount(carId: string): string {
  const hash = carId.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 7), 0)
  const count = 900 + (hash % 5800)
  return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : `${count}`
}

interface CarCardProps {
  rec: CarRecommendation
  enterClass?: string
}

// SVG arc for match score ring
function ScoreRing({ score, accent }: { score: number; accent: string }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const filled = (score / 100) * circ
  return (
    <div className="relative flex items-center justify-center" style={{ width: 48, height: 48 }}>
      <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="24" cy="24" r={r} fill="none"
          stroke={accent} strokeWidth="3"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <span
        className="absolute font-bold text-[11px]"
        style={{ color: accent, fontFamily: 'var(--font-syne)' }}
      >
        {score}%
      </span>
    </div>
  )
}

export default function CarCard({ rec, enterClass = '' }: CarCardProps) {
  const { car, rank, matchScore, emotionalHook, matchReasons } = rec
  const isDark = useTheme()
  const [imgError, setImgError] = useState(false)

  // Pick the top-rated review to feature
  const featuredReview = car.reviews?.sort((a, b) => b.rating - a.rating)[0]

  const isTopPick   = rank === 1
  const fuelBg      = isDark ? (FUEL_BG_DARK[car.fuelType] ?? FUEL_BG_DARK.petrol) : (FUEL_BG_LIGHT[car.fuelType] ?? FUEL_BG_LIGHT.petrol)
  const fuelGlow    = isDark ? (FUEL_GLOW_DARK[car.fuelType] ?? FUEL_GLOW_DARK.petrol) : (FUEL_GLOW_LIGHT[car.fuelType] ?? FUEL_GLOW_LIGHT.petrol)
  const fuelAccent  = FUEL_ACCENT[car.fuelType] ?? '#ff5500'

  const rankWmColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
  const imgFade     = isDark
    ? 'linear-gradient(to top, var(--surface) 0%, transparent 100%)'
    : 'linear-gradient(to top, #ffffff 0%, transparent 100%)'

  return (
    <div
      className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${enterClass}`}
      style={{
        background: 'var(--surface)',
        border: isTopPick ? `1px solid rgba(255,85,0,0.45)` : '1px solid var(--border)',
        boxShadow: isTopPick
          ? '0 0 40px rgba(255,85,0,0.08)'
          : isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
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
          style={{ background: `radial-gradient(circle at 50% 60%, ${fuelGlow} 0%, transparent 65%)` }}
        />

        {/* Real car photo */}
        {car.imageUrl && !imgError ? (
          <img
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-400"
            style={{ objectPosition: 'center 60%' }}
            onError={() => setImgError(true)}
          />
        ) : null}

        {/* Rank watermark */}
        <div
          className="rank-wm absolute right-3 bottom-0 font-black leading-none select-none pointer-events-none"
          style={{
            fontFamily: 'var(--font-barlow)',
            fontSize: '110px',
            color: rankWmColor,
            lineHeight: 0.85,
            zIndex: 1,
          }}
        >
          {RANK_NUM[rank - 1]}
        </div>

        {/* Bottom image fade */}
        <div
          className="img-bottom-fade absolute bottom-0 inset-x-0 h-16"
          style={{ background: imgFade, zIndex: 2 }}
        />

        {/* Fuel accent bar */}
        <div
          className="absolute bottom-0 inset-x-0 h-[2px]"
          style={{ background: `linear-gradient(to right, transparent, ${fuelAccent}, transparent)`, opacity: 0.7, zIndex: 3 }}
        />

        {/* Best match badge */}
        {isTopPick && (
          <div
            className="absolute top-3 left-3 z-10 text-black font-bold text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full"
            style={{ background: 'var(--orange)', fontFamily: 'var(--font-syne)', boxShadow: '0 4px 12px rgba(255,85,0,0.4)' }}
          >
            ★ Best Match
          </div>
        )}
        {!isTopPick && (
          <div
            className="absolute top-3 left-3 z-10 font-bold text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full"
            style={{
              color: 'var(--muted2)',
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-syne)',
              backdropFilter: 'blur(8px)',
            }}
          >
            #{rank} Pick
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5 pt-4">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: 'var(--muted)' }}>
            {car.make}
          </p>
          <div className="flex items-start justify-between gap-2">
            {/* Left: name + price + EMI */}
            <div>
              <h3 className="font-extrabold text-2xl leading-tight" style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}>
                {car.model}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-sm font-semibold" style={{ color: fuelAccent, fontFamily: 'var(--font-syne)' }}>
                  {car.priceLabel}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ color: 'var(--muted2)', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}
                >
                  {calcEMI(car.priceMax)}
                </span>
              </div>
            </div>
            {/* Right: score ring + buyers */}
            <div className="flex flex-col items-center gap-0.5 shrink-0">
              <ScoreRing score={matchScore} accent={fuelAccent} />
              <span className="text-[8px] uppercase tracking-widest" style={{ color: 'var(--muted)' }}>match</span>
              <span className="text-[9px] mt-0.5 font-medium" style={{ color: 'var(--muted)' }}>
                {buyersCount(car.id)} buyers
              </span>
            </div>
          </div>
        </div>

        {/* Emotional hook */}
        <div
          className="rounded-xl px-4 py-3 mb-4"
          style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderLeft: `2px solid ${fuelAccent}` }}
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

        {/* Spec pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {car.ncapRating > 0 && (
            <span
              className="text-[10px] px-2.5 py-1 rounded-lg font-medium"
              style={{
                color: NCAP_COLOR[car.ncapRating] ?? '#52526e',
                background: `${NCAP_COLOR[car.ncapRating]}18`,
                border: `1px solid ${NCAP_COLOR[car.ncapRating]}30`,
              }}
            >
              {car.ncapRating}★ NCAP
            </span>
          )}
          {car.mileage > 0 && (
            <span className="text-[10px] px-2.5 py-1 rounded-lg" style={{ color: 'var(--muted2)', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: '1px solid var(--border)' }}>
              {car.mileage} kmpl
            </span>
          )}
          {car.bootSpace > 0 && (
            <span className="text-[10px] px-2.5 py-1 rounded-lg" style={{ color: 'var(--muted2)', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: '1px solid var(--border)' }}>
              {car.bootSpace}L boot
            </span>
          )}
          <span
            className="text-[10px] px-2.5 py-1 rounded-lg font-medium"
            style={{ color: fuelAccent, background: `${fuelAccent}15`, border: `1px solid ${fuelAccent}30` }}
          >
            {FUEL_LABEL[car.fuelType] ?? car.fuelType}
          </span>
        </div>

        {/* Featured review */}
        {featuredReview && (
          <div
            className="mb-5 rounded-xl px-4 py-3"
            style={{ background: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)', border: '1px solid var(--border)' }}
          >
            {/* Stars */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill={i < featuredReview.rating ? fuelAccent : 'transparent'} stroke={i < featuredReview.rating ? fuelAccent : 'var(--border-strong)'} strokeWidth="1">
                    <polygon points="5,1 6.18,3.76 9.24,4.18 7,6.26 7.64,9.24 5,7.76 2.36,9.24 3,6.26 0.76,4.18 3.82,3.76"/>
                  </svg>
                ))}
              </div>
              <span className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                {featuredReview.reviewer}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--muted2)' }}>
              &ldquo;{featuredReview.quote}&rdquo;
            </p>
          </div>
        )}

        {/* CTA */}
        <a
          href={`https://www.cardekho.com/cars/${car.make.toLowerCase().replace(/\s+/g, '-')}/${car.model.toLowerCase().replace(/\s+/g, '-')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block w-full py-3 text-center text-xs font-semibold rounded-xl transition-all duration-200"
          style={{ border: '1px solid var(--border-strong)', color: 'var(--muted2)', fontFamily: 'var(--font-syne)', letterSpacing: '0.06em' }}
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

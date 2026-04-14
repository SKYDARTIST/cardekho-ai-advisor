'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const dark = saved !== 'light'
    setIsDark(dark)
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    const theme = next ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    window.dispatchEvent(new Event('theme-changed'))
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
      style={{
        background: 'var(--orange-dim)',
        border: '1px solid var(--border-strong)',
        color: 'var(--muted2)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,85,0,0.4)'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--orange-text)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--muted2)'
      }}
    >
      {isDark ? (
        /* Sun icon */
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        /* Moon icon */
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}

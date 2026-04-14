'use client'

import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Read initial theme
    const saved = localStorage.getItem('theme')
    const dark = saved !== 'light'
    setIsDark(dark)
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')

    // Listen for theme changes from ThemeToggle
    const handler = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    }
    window.addEventListener('theme-changed', handler)
    return () => window.removeEventListener('theme-changed', handler)
  }, [])

  return isDark
}

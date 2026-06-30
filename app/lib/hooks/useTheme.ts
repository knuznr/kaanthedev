'use client'
import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      const root = document.documentElement
      root.classList.toggle('dark', next === 'dark')
      try {
        localStorage.setItem('theme', next)
      } catch {}
      return next
    })
  }, [])

  return { theme, toggle }
}

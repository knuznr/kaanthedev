'use client'
import { useTheme } from 'app/lib/hooks/useTheme'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`flex h-10 w-10 items-center justify-center border-2 border-ink bg-paper text-ink hover:bg-yellow transition-colors ${className}`}
    >
      <span className="font-mono text-xs font-bold">{isDark ? 'LT' : 'DK'}</span>
    </button>
  )
}

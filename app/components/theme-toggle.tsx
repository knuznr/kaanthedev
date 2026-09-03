'use client'
import { useTheme } from 'app/lib/hooks/useTheme'
import { cn } from 'app/lib/cn'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'flex size-11 items-center justify-center border-2 border-ink bg-paper text-ink transition-colors duration-200 hover:bg-yellow',
        className,
      )}
    >
      <span className="font-mono text-xs font-bold">{isDark ? 'LT' : 'DK'}</span>
    </button>
  )
}

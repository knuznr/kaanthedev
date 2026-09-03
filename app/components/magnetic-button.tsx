'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from 'app/lib/cn'

type Props = {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  ariaLabel?: string
}

export function MagneticButton({ children, href, onClick, className = '', ariaLabel }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18 })
  const sy = useSpring(y, { stiffness: 250, damping: 18 })

  function handleMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35)
  }
  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  const cls = cn(
    'inline-flex min-h-11 items-center justify-center border-2 border-ink bg-ink px-6 py-3 font-mono text-sm uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-yellow hover:text-ink',
    className,
  )

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ x: sx, y: sy }}
        className={cls}
      >
        {children}
      </motion.a>
    )
  }
  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={cls}
    >
      {children}
    </motion.button>
  )
}

'use client'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { cn } from 'app/lib/cn'

export function Marquee({
  items,
  reverse = false,
  className = '',
}: {
  items: string[]
  reverse?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.1 })

  const row = (key: string) => (
    <div
      key={key}
      style={{ animationPlayState: isInView ? 'running' : 'paused' }}
      className={cn(
        'flex shrink-0 animate-marquee items-center gap-6 pr-6 group-hover:[animation-play-state:paused]',
        reverse && '[animation-direction:reverse]',
      )}
    >
      {items.map((it, i) => (
        <span
          key={`${key}-${i}`}
          className="font-display font-extrabold uppercase text-[clamp(1.5rem,4vw,3rem)] leading-none whitespace-nowrap"
        >
          {it}
          <span className="mx-6 inline-block size-3 bg-red align-middle" />
        </span>
      ))}
    </div>
  )
  return (
    <div ref={ref} className={cn('group flex overflow-hidden', className)} aria-hidden="true">
      {row('a')}
      {row('b')}
    </div>
  )
}

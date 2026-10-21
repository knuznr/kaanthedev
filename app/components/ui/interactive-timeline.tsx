'use client'

// based on EasyUI "interactive-timeline" (github.com/Surajmaurya1/easyui), restyled for this site:
// status nodes on a hairline progress track, flat paper surface, 3px corners, no glow, no shadows.

import * as React from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from 'app/lib/cn'

export type TimelineStatus = 'completed' | 'in-progress' | 'pending'

export type TimelineMeta = {
  label: string
  value: string
}

export type TimelineItem = {
  id: string
  title: string
  timestamp: string
  status: TimelineStatus
  description?: string
  /** small mono word next to the title; falls back to the status */
  statusLabel?: string
  meta?: TimelineMeta[]
  href?: string
  hrefLabel?: string
}

export type InteractiveTimelineProps = {
  items: TimelineItem[]
  label?: string
  className?: string
}

const marker: Record<TimelineStatus, string> = {
  completed: 'border-ink bg-ink',
  'in-progress': 'border-signal bg-signal',
  pending: 'border-ink/30 bg-paper',
}

const statusWord: Record<TimelineStatus, string> = {
  completed: 'completed',
  'in-progress': 'in progress',
  pending: 'pending',
}

export function InteractiveTimeline({ items, label = 'timeline', className }: InteractiveTimelineProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const reduceMotion = useReducedMotion()
  const listId = React.useId()

  // the track is ink up to the last reached node, muted after it
  const reachedIndex = items.reduce(
    (acc, item, index) => (item.status === 'completed' || item.status === 'in-progress' ? index : acc),
    -1,
  )

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id))

  if (items.length === 0) return null

  return (
    <ol aria-label={label} className={cn('w-full', className)}>
      {items.map((item, index) => {
        const isExpanded = expandedId === item.id
        const isLast = index === items.length - 1
        const panelId = `${listId}-${item.id}`

        return (
          <li key={item.id} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4">
            {/* status node + the piece of track that follows it */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-[3px]"
              >
                <span className={cn('size-2.5 rounded-[1px] border', marker[item.status])} />
                {item.status === 'in-progress' && (
                  <span aria-hidden="true" className="pointer-events-none absolute size-4 rounded-[1px] border border-ink/30" />
                )}
              </button>
              {!isLast && (
                <motion.span
                  aria-hidden="true"
                  className={cn(
                    'w-[2px] flex-1 origin-top',
                    index < reachedIndex ? 'bg-ink' : 'bg-ink/15',
                  )}
                  initial={reduceMotion ? false : { scaleY: 0 }}
                  whileInView={reduceMotion ? undefined : { scaleY: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.23, 1, 0.32, 1] }}
                />
              )}
            </div>

            {/* entry */}
            <div onClick={() => toggle(item.id)} className={cn('min-w-0 cursor-pointer pb-7', isLast && 'pb-0')}>
              <h3 className="min-w-0 text-[0.95rem] font-medium leading-snug tracking-[-0.015em]">
                {item.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="mono-label text-text-muted">{item.timestamp}</span>
                <span aria-hidden="true" className="h-3 w-px bg-ink/15" />
                <span className="mono-label text-text-muted">
                  {item.statusLabel ?? statusWord[item.status]}
                </span>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    id={panelId}
                    initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 border-t border-ink/10 pt-3">
                      {item.description && (
                        <p className="muted text-sm leading-relaxed">{item.description}</p>
                      )}

                      {item.meta && item.meta.length > 0 && (
                        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                          {item.meta.map((m) => (
                            <div key={m.label}>
                              <dt className="mono-label text-text-muted">{m.label}</dt>
                              <dd className="mt-1 font-mono text-xs text-text-primary">{m.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {item.href && (
                        <p className="mt-4">
                          {item.href.startsWith('/') ? (
                            <Link
                              href={item.href}
                              transitionTypes={['nav-forward']}
                              onClick={(event) => event.stopPropagation()}
                              className="link-muted inline-flex min-h-11 items-center"
                            >
                              {item.hrefLabel ?? 'open'} →
                            </Link>
                          ) : (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              className="link-muted inline-flex min-h-11 items-center"
                            >
                              {item.hrefLabel ?? 'open'} ↗
                            </a>
                          )}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

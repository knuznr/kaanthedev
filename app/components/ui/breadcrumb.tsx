'use client'

// based on EasyUI "breadcrumb" (github.com/Surajmaurya1/easyui), restyled for this site:
// flat paper trail, 3px radius, muted ink, no glow, motion that honours prefers-reduced-motion.

import * as React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { ChevronRight, Ellipsis } from 'lucide-react'
import { cn } from 'app/lib/cn'

export type BreadcrumbItem = {
  label: string
  href?: string
  icon?: React.ReactNode
  /** extra props forwarded to the link element (e.g. Next.js `transitionTypes`) */
  linkProps?: Record<string, unknown>
}

export type BreadcrumbProps = Omit<React.ComponentProps<'nav'>, 'children'> & {
  items: BreadcrumbItem[]
  separator?: 'chevron' | 'slash'
  /** collapse the middle into "…" when there are more items than this */
  maxItems?: number
  /** your router's link, e.g. next/link. Defaults to next/link */
  as?: React.ElementType
}

type CrumbLinkProps = {
  href?: string
  className?: string
  children?: React.ReactNode
  'aria-current'?: 'page' | 'location' | 'true' | 'false'
  'data-revealed'?: string
  onMouseEnter?: () => void
  onFocus?: () => void
  onBlur?: () => void
  [key: string]: unknown
}

export function Breadcrumb({
  items,
  separator = 'chevron',
  maxItems = 4,
  as,
  className,
  ...props
}: BreadcrumbProps) {
  const LinkComponent = (as ?? Link) as React.ComponentType<CrumbLinkProps>
  const uid = React.useId()
  const listRef = React.useRef<HTMLOListElement>(null)
  const [expanded, setExpanded] = React.useState(false)
  const [hover, setHover] = React.useState<number | null>(null)
  const reduceMotion = useReducedMotion()

  const spring: Transition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }

  const canCollapse = items.length > maxItems
  const tail = Math.max(1, maxItems - 2) // items kept at the end while collapsed
  const hiddenFrom = 1
  const hiddenTo = items.length - tail // exclusive
  const collapsed = canCollapse && !expanded

  // move focus to the first revealed crumb
  React.useEffect(() => {
    if (expanded) listRef.current?.querySelector<HTMLElement>('[data-revealed]')?.focus()
  }, [expanded])

  const entries: (number | 'more')[] = []
  items.forEach((_, i) => {
    if (collapsed && i >= hiddenFrom && i < hiddenTo) {
      if (i === hiddenFrom) entries.push('more')
    } else entries.push(i)
  })

  const sep = (
    <span aria-hidden className="text-text-muted [&>svg]:size-3">
      {separator === 'slash' ? <span className="text-sm">/</span> : <ChevronRight />}
    </span>
  )

  const linkBase = 'relative flex h-7 items-center gap-1.5 rounded-[3px] px-2 text-sm'

  return (
    <nav aria-label="Breadcrumb" className={cn('text-text-muted', className)} {...props}>
      <ol
        ref={listRef}
        onMouseLeave={() => setHover(null)}
        className="flex flex-wrap items-center gap-x-1 gap-y-1"
      >
        {entries.map((entry, n) => {
          const first = n === 0

          if (entry === 'more') {
            return (
              <motion.li
                key="more"
                layout={reduceMotion ? false : 'position'}
                className="flex items-center gap-1"
              >
                {sep}
                <button
                  type="button"
                  aria-label="Show hidden pages"
                  onClick={() => setExpanded(true)}
                  className="grid h-7 w-8 place-items-center rounded-[3px] transition-colors hover:bg-surface hover:text-text-primary"
                >
                  <Ellipsis className="size-4" />
                </button>
              </motion.li>
            )
          }

          const item = items[entry]
          const isLast = entry === items.length - 1
          const revealed = expanded && canCollapse && entry >= hiddenFrom && entry < hiddenTo
          const body = (
            <span className="relative flex items-center gap-1.5 [&>svg]:size-4">
              {item.icon}
              <span className="break-words">{item.label}</span>
            </span>
          )

          return (
            <motion.li
              key={entry}
              layout={reduceMotion ? false : 'position'}
              initial={revealed && !reduceMotion ? { opacity: 0, x: -6 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={spring}
              className="flex items-center gap-1"
            >
              {!first && sep}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(linkBase, isLast && 'font-medium text-text-primary')}
                >
                  {body}
                </span>
              ) : (
                <LinkComponent
                  href={item.href}
                  {...item.linkProps}
                  data-revealed={revealed && entry === hiddenFrom ? '' : undefined}
                  onMouseEnter={() => setHover(entry)}
                  onFocus={() => setHover(entry)}
                  onBlur={() => setHover(null)}
                  className={cn(linkBase, 'transition-colors hover:text-text-primary')}
                >
                  {hover === entry && (
                    <motion.span
                      layoutId={`${uid}-hover`}
                      transition={spring}
                      className="absolute inset-0 rounded-[3px] bg-surface"
                    />
                  )}
                  {body}
                </LinkComponent>
              )}
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}

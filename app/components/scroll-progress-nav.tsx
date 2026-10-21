'use client'

// based on EasyUI "scroll-progress-nav" (github.com/Surajmaurya1/easyui), restyled for this site:
// flat paper card, 3px radius, 1px ink border, hairline progress rule, no glow.
// Headings are read from the rendered article, so post content never changes.

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { cn } from 'app/lib/cn'

export type NavSectionItem = {
  id: string
  label: string
  index: string
  level: 2 | 3
}

export type ScrollProgressNavProps = {
  /** id of the element holding the rendered article */
  contentId: string
  /** the pill only shows up once the post has this many headings */
  minHeadings?: number
  label?: string
  className?: string
}

// same shape as the ids the MDX renderer writes, so a derived anchor still matches the existing ones
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

// heading text as a reader would say it: kaTeX renders a formula twice (mathml + hidden html),
// so the hidden half is dropped and the formula source is used once
function readLabel(node: HTMLElement) {
  const clone = node.cloneNode(true) as HTMLElement
  clone.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove())
  clone.querySelectorAll('math').forEach((el) => {
    const source = el.querySelector('annotation')?.textContent
    el.textContent = source ?? el.textContent
  })
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim()
}

const SCROLL_OFFSET = 80 // px of breathing room above a heading when jumping to it

export function ScrollProgressNav({
  contentId,
  minHeadings = 3,
  label = 'contents',
  className,
}: ScrollProgressNavProps) {
  const reduceMotion = useReducedMotion()
  const [sections, setSections] = React.useState<NavSectionItem[]>([])
  const [activeId, setActiveId] = React.useState('')
  const [progress, setProgress] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const navRef = React.useRef<HTMLElement>(null)
  const listId = React.useId()

  // headings come from the rendered article: ids are already on the nodes, derived only when missing
  React.useEffect(() => {
    let cancelled = false

    const read = () => {
      if (cancelled) return false
      const root = document.getElementById(contentId)
      if (!root) return false

      const nodes = Array.from(root.querySelectorAll<HTMLElement>('h2, h3'))
      if (nodes.length === 0) return false // the body has not streamed in yet

      const used = new Set<string>()
      const items: NavSectionItem[] = []

      nodes.forEach((node) => {
        const text = readLabel(node)
        if (!text) return

        let id = node.id
        if (!id) {
          id = slugify(text)
          node.id = id
        }

        let unique = id
        let n = 2
        while (used.has(unique)) unique = `${id}-${n++}`
        if (unique !== id) node.id = unique
        used.add(unique)

        items.push({
          id: unique,
          label: text,
          index: String(items.length + 1).padStart(2, '0'),
          level: node.tagName === 'H3' ? 3 : 2,
        })
      })

      setSections(items)
      if (items.length > 0) setActiveId(items[0].id)
      return true
    }

    if (!read()) {
      // the article may still be streaming in: pick the headings up as soon as it lands
      const observer = new MutationObserver(() => {
        if (read()) observer.disconnect()
      })
      observer.observe(document.body, { childList: true, subtree: true })
      const timer = window.setTimeout(() => observer.disconnect(), 5000)
      return () => {
        cancelled = true
        observer.disconnect()
        window.clearTimeout(timer)
      }
    }

    return () => {
      cancelled = true
    }
  }, [contentId])

  // reading depth + the section currently under the reading line
  React.useEffect(() => {
    if (sections.length === 0) return

    let frame = 0

    const update = () => {
      frame = 0
      const root = document.getElementById(contentId)
      if (!root) return

      const rect = root.getBoundingClientRect()
      const top = rect.top + window.scrollY
      const read = window.scrollY + window.innerHeight - top
      const pct = rect.height > 0 ? Math.min(100, Math.max(0, (read / rect.height) * 100)) : 0
      setProgress(pct)

      let current = sections[0].id
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = section.id
      }
      setActiveId(current)
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [sections, contentId])

  const goTo = (section: NavSectionItem) => {
    const el = document.getElementById(section.id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' })
    setActiveId(section.id)
    setOpen(false)
    // hand the caret to the heading so keyboard reading continues from there
    el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }

  // escape closes the list, a click outside closes it too
  React.useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  if (sections.length < minHeadings) return null

  const active = sections.find((section) => section.id === activeId) ?? sections[0]

  const listTransition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.23, 1, 0.32, 1] }

  // collapsed it stays a small tab; open it takes the full width of the card
  const widthClass = open ? 'w-[13.5rem]' : 'w-[7.5rem] lg:w-[13.5rem]'

  return (
    <div className={cn('fixed bottom-6 right-6 z-40 hidden md:block', className)}>
      <nav
        ref={navRef}
        aria-label="table of contents"
        className={cn(
          'flex flex-col overflow-hidden rounded-[3px] border border-border bg-paper shadow-[0_18px_40px_-24px_rgba(0,0,0,0.5)] transition-[width] duration-200 ease-out motion-reduce:transition-none',
          widthClass,
        )}
      >
        {/* reading depth */}
        <div aria-hidden="true" className="order-1 h-[2px] w-full bg-ink/10">
          <div
            className="h-full bg-ink transition-[width] duration-150 ease-out motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={listId}
          className="order-3 flex w-full items-center gap-1.5 px-3 py-2 text-left"
        >
          <span className="mono-label text-text-muted">{label}</span>
          <span className="ml-auto hidden font-mono text-[10px] tabular-nums text-text-muted lg:inline">
            {Math.round(progress)}%
          </span>
          <ChevronRight
            aria-hidden="true"
            className={cn(
              'ml-auto size-3.5 shrink-0 text-text-muted transition-transform duration-200 motion-reduce:transition-none lg:ml-0',
              open && 'rotate-90',
            )}
          />
        </button>

        {/* the list sits above the trigger so the card grows up from the bottom edge */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="toc-list"
              id={listId}
              initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={listTransition}
              className="order-2 overflow-hidden"
            >
              <ul className="max-h-[50vh] overflow-y-auto border-b border-border py-1">
                {sections.map((section) => {
                  const isActive = section.id === activeId
                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => goTo(section)}
                        aria-current={isActive ? 'location' : undefined}
                        className={cn(
                          'flex w-full items-start gap-2 px-3 py-1.5 text-left transition-colors',
                          section.level === 3 ? 'pl-6 text-xs' : 'text-sm',
                          isActive
                            ? 'bg-surface text-text-primary'
                            : 'text-text-muted hover:bg-surface hover:text-text-primary',
                        )}
                      >
                        <span className="mt-[3px] shrink-0 font-mono text-[9px] tabular-nums text-text-muted">
                          {section.index}
                        </span>
                        <span className="min-w-0 break-words">{section.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <p
          className="order-4 hidden truncate border-t border-border px-3 py-1.5 text-xs text-text-muted lg:block"
          title={active?.label}
        >
          {active?.label}
        </p>
      </nav>
    </div>
  )
}

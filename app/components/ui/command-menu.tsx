'use client'

// based on EasyUI "command-menu" (github.com/Surajmaurya1/easyui), restyled for this site:
// 3px radius, flat paper surface, 1px ink border, no glow, site shadow.

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CornerDownLeft, Search } from 'lucide-react'
import { cn } from 'app/lib/cn'

export type CommandMenuItem = {
  id: string
  label: string
  group: string
  icon?: React.ReactNode
  shortcut?: string
  onSelect: () => void
}

export type CommandMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CommandMenuItem[]
  label?: string
  placeholder?: string
}

const keycap =
  'shrink-0 rounded-[3px] border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted'

export function CommandMenu({
  open,
  onOpenChange,
  items,
  label = 'command menu',
  placeholder = 'search pages and actions…',
}: CommandMenuProps) {
  const [query, setQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const reduceMotion = useReducedMotion()

  const panelRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const restoreRef = React.useRef<HTMLElement | null>(null)
  const listId = React.useId()

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q),
    )
  }, [items, query])

  // group results in the order they appear in `items`, keeping a flat index for keyboard selection
  const groups = React.useMemo(() => {
    const out: { name: string; entries: { item: CommandMenuItem; index: number }[] }[] = []
    filtered.forEach((item) => {
      const existing = out.find((group) => group.name === item.group)
      const entry = { item, index: filtered.indexOf(item) }
      if (existing) existing.entries.push(entry)
      else out.push({ name: item.group, entries: [entry] })
    })
    return out
  }, [filtered])

  const activeIndex = filtered.length === 0 ? -1 : Math.min(selectedIndex, filtered.length - 1)

  // focus: move in on open, restore the trigger on close, lock the page behind the dialog
  React.useEffect(() => {
    if (!open) return
    restoreRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
      const restore = restoreRef.current
      if (restore?.isConnected) restore.focus()
    }
  }, [open])

  React.useEffect(() => {
    if (!open) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  // keep the active row in view while arrowing through a long list
  React.useEffect(() => {
    if (!open || activeIndex < 0) return
    panelRef.current
      ?.querySelector<HTMLElement>(`[data-command-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  // keyboard only: arrows, enter, escape, tab is trapped inside the panel
  React.useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onOpenChange(false)
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        if (filtered.length === 0) return
        const delta = event.key === 'ArrowDown' ? 1 : -1
        setSelectedIndex((prev) => {
          const current = Math.min(prev, filtered.length - 1)
          return (current + delta + filtered.length) % filtered.length
        })
        return
      }

      if (event.key === 'Home' || event.key === 'End') {
        if (filtered.length === 0) return
        event.preventDefault()
        setSelectedIndex(event.key === 'Home' ? 0 : filtered.length - 1)
        return
      }

      if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault()
        filtered[activeIndex]?.onSelect()
        return
      }

      if (event.key === 'Tab') {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'input, button, [href], [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, filtered, activeIndex, onOpenChange])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/45"
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.18, ease: [0.23, 1, 0.32, 1] }
            }
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-[3px] border border-border border-t-[3px] border-t-ink bg-paper shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              <Search aria-hidden="true" strokeWidth={1.75} className="size-4 shrink-0 text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={
                  activeIndex >= 0 ? `${listId}-${filtered[activeIndex]?.id}` : undefined
                }
                aria-label="search commands"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setSelectedIndex(0)
                }}
                placeholder={placeholder}
                className="w-full bg-transparent text-[16px] text-text-primary focus-visible:outline-none! placeholder:text-text-muted"
              />
              <kbd className={keycap}>esc</kbd>
            </div>

            <div
              id={listId}
              role="listbox"
              aria-label="commands"
              className="max-h-[min(60vh,26rem)] overflow-y-auto p-1.5"
            >
              {filtered.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-text-muted">
                  nothing for “{query}”
                </p>
              ) : (
                groups.map((group) => (
                  <div key={group.name} role="presentation" className="pb-1 last:pb-0">
                    <div className="mono-label px-3 pb-1 pt-2 text-text-muted">{group.name}</div>
                    {group.entries.map(({ item, index }) => {
                      const selected = index === activeIndex
                      return (
                        <button
                          key={item.id}
                          id={`${listId}-${item.id}`}
                          data-command-index={index}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          tabIndex={-1}
                          onMouseMove={() => setSelectedIndex(index)}
                          onClick={item.onSelect}
                          className={cn(
                            'flex w-full items-center justify-between gap-3 rounded-[3px] px-3 py-2 text-left text-sm transition-colors',
                            selected
                              ? 'bg-surface text-text-primary'
                              : 'text-text-muted hover:bg-surface hover:text-text-primary',
                          )}
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            {item.icon && (
                              <span aria-hidden="true" className="shrink-0 text-text-muted">
                                {item.icon}
                              </span>
                            )}
                            <span className="truncate">{item.label}</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            {selected && (
                              <CornerDownLeft aria-hidden="true" className="size-3 text-text-primary" />
                            )}
                            {item.shortcut && <kbd className={keycap}>{item.shortcut}</kbd>}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2 text-[11px] text-text-muted">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className={keycap}>↑↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className={keycap}>↵</kbd> select
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em]">kaan uzuner</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

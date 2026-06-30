'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { navItems } from 'app/lib/data/profile'
import { useActiveSection } from 'app/lib/hooks/useActiveSection'
import { ThemeToggle } from './theme-toggle'
import { MagneticButton } from './magnetic-button'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const ids = navItems.map((n) => n.id)
  const active = useActiveSection(ids)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="font-mono text-sm font-bold uppercase tracking-widest border-2 border-ink bg-paper px-3 py-1">
          KAAN&#8599;
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MagneticButton
            href="#contact"
            className="hidden sm:inline-flex !py-2 !px-4 !text-xs"
            ariaLabel="Go to contact section"
          >
            LETS TALK
          </MagneticButton>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="lg:hidden border-2 border-ink bg-ink px-3 py-2 font-mono text-xs uppercase tracking-widest text-paper"
          >
            MENU
          </button>
        </div>
      </header>

      <nav aria-label="Sections" className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <ul className="flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group flex items-center gap-2 font-mono text-xs uppercase tracking-widest ${
                    isActive ? 'text-ink' : 'text-ink/50 hover:text-ink'
                  }`}
                >
                  <span className={`h-px transition-all ${isActive ? 'w-10 bg-ink' : 'w-5 bg-ink/40 group-hover:w-8'}`} />
                  {item.index}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex flex-col bg-yellow"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-mono text-sm font-bold uppercase tracking-widest">MENU</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="border-2 border-ink bg-ink px-3 py-2 font-mono text-xs uppercase tracking-widest text-paper"
              >
                CLOSE
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-2 px-6">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="block font-display text-[clamp(2.5rem,12vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-tight"
                  >
                    <span className="opacity-40 mr-3 font-mono text-base align-middle">{item.index}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

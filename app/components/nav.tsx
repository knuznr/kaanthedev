'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { navItems } from 'app/lib/data/profile'
import { useActiveSection } from 'app/lib/hooks/useActiveSection'
import { cn } from 'app/lib/cn'
import { ThemeToggle } from './theme-toggle'
import { MagneticButton } from './magnetic-button'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const ids = navItems.map((n) => n.id)
  const active = useActiveSection(ids)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pb-3 md:px-6"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <Link href="/" className="inline-flex min-h-11 items-center border-2 border-ink bg-paper px-3 py-1 font-mono text-sm font-bold uppercase tracking-widest">
          KAAN&#8599;
        </Link>
        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="flex items-center gap-5">
            {navItems.slice(1).map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'font-mono text-xs uppercase tracking-widest transition-opacity duration-200',
                      isActive ? 'opacity-100' : 'opacity-50 hover:opacity-100',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MagneticButton
            href="#contact"
            className="hidden sm:inline-flex !py-2 !px-4 !text-xs"
            ariaLabel="Go to contact section"
          >
            LET&apos;S TALK
          </MagneticButton>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-controls="mobile-navigation"
            aria-expanded={open}
            className="min-h-11 border-2 border-ink bg-ink px-3 py-2 font-mono text-xs uppercase tracking-widest text-paper lg:hidden"
          >
            MENU
          </button>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        aria-label="Navigation menu"
        onClose={() => setOpen(false)}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-yellow p-0 text-ink backdrop:bg-ink/30"
      >
        <nav
          aria-label="Mobile sections"
          className="flex h-full flex-col"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-mono text-sm font-bold uppercase tracking-widest">MENU</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="min-h-11 border-2 border-ink bg-ink px-3 py-2 font-mono text-xs uppercase tracking-widest text-paper"
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
                  className="block font-display text-[clamp(2rem,10vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-tight"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </>
  )
}

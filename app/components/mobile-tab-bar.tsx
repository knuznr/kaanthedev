'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { House, Mail, PenLine, User, FolderOpen } from 'lucide-react'
import { cn } from 'app/lib/cn'

const tabs = [
  { href: '/', label: 'home', Icon: House },
  { href: '/about', label: 'about', Icon: User },
  { href: '/work', label: 'work', Icon: FolderOpen },
  { href: '/blog', label: 'writing', Icon: PenLine },
  { href: '/contact', label: 'contact', Icon: Mail },
]

// Phone-only floating capsule in the iOS mould: translucent material, safe-area aware, press feedback on
// pointer-down. The active pill is one shared element that a critically damped spring moves between tabs.
export function MobileTabBar() {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-4 md:hidden"
    >
      <ul className="tab-bar pointer-events-auto flex w-full max-w-sm gap-0.5 rounded-full border border-ink/10 bg-paper/70 p-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150">
        {tabs.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-full py-1 transition-[opacity,color] duration-150 active:opacity-50',
                  active ? 'text-paper' : 'text-muted-foreground',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, duration: 0.4 }}
                  />
                )}
                <Icon aria-hidden="true" strokeWidth={active ? 2.25 : 1.75} className="relative size-[19px]" />
                <span className="relative text-[9.5px] font-medium uppercase tracking-[0.1em]">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

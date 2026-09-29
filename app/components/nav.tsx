import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

const links = [
  { href: '/about', label: 'about' },
  { href: '/work', label: 'work' },
  { href: '/blog', label: 'writing' },
  { href: '/contact', label: 'contact' },
]

// Desktop: name left, links right, thick rule under. Phones get the bottom tab bar instead.
export function Navbar() {
  return (
    <header className="mx-auto w-full max-w-2xl px-6 pb-8 pt-6">
      <div className="flex items-center justify-between border-b-[3px] border-ink pb-3">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm font-extrabold tracking-tight">kaan uzuner</Link>
        <nav aria-label="Sections" className="flex items-center gap-1 md:gap-6">
          <ul className="mono-label hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-muted inline-flex min-h-11 items-center">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

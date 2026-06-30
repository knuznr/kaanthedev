import { socials } from 'app/lib/data/profile'
import type { Accent } from 'app/lib/types'

const accentHover: Record<Accent, string> = {
  yellow: 'hover:bg-yellow',
  red: 'hover:bg-red hover:text-paper',
  blue: 'hover:bg-blue hover:text-paper',
}

export function Socials({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      {socials.map((s) => (
        <li key={s.label} className="flex-1">
          <a
            href={s.href}
            target={s.href.startsWith('http') ? '_blank' : undefined}
            rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`flex items-center justify-between border-2 border-ink px-5 py-4 font-display text-xl font-extrabold uppercase transition-colors ${accentHover[s.accent]}`}
          >
            {s.label}
            <span aria-hidden="true">&#8599;</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

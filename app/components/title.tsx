import { cn } from 'app/lib/cn'

const sizes = {
  page: 'text-[clamp(3.25rem,13vw,5.5rem)]',
  section: 'text-[clamp(2.25rem,8vw,3.25rem)]',
} as const

// The site's display type: heavy grotesk plus the red full stop from the business card.
export function Title({ as: As = 'h2', size = 'section', className, children }: { as?: 'h1' | 'h2'; size?: keyof typeof sizes; className?: string; children: React.ReactNode }) {
  return (
    <As className={cn('title', sizes[size], className)}>
      {children}
      <span className="text-signal">.</span>
    </As>
  )
}

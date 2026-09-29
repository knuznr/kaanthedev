import type { Project } from 'app/lib/types'

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

export function ProjectList({ items }: { items: Project[] }) {
  return (
    <ul className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((p) => (
        <li key={p.id} className="py-5">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-medium">{p.name}</h3>
            <span className="flex shrink-0 gap-4 text-sm">
              {p.liveUrl && <a href={p.liveUrl} className="link-muted" {...ext}>Website ↗</a>}
              {p.repoUrl && <a href={p.repoUrl} className="link-muted" {...ext}>GitHub ↗</a>}
              {!p.liveUrl && !p.repoUrl && <span className="muted tabular-nums">{p.year}</span>}
            </span>
          </div>
          <p className="muted mt-1 text-sm">{p.role} · {p.year}</p>
          <p className="mt-2 leading-relaxed">{p.description}</p>
          <ul className="mono-label mt-3 flex flex-wrap gap-2 !text-[0.65rem]">
            {p.stack.map((t) => (
              <li key={t} className="border border-ink/25 px-1.5 py-0.5">{t}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

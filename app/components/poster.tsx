import type { Project, Accent } from 'app/lib/types'

const accentBg: Record<Accent, string> = {
  yellow: 'bg-yellow',
  red: 'bg-red',
  blue: 'bg-blue',
}

export function Poster({ project }: { project: Project }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-2 border-ink bg-paper">
      <div
        className={`absolute inset-0 ${accentBg[project.accent]}`}
        style={{ clipPath: 'polygon(0 0, 68% 0, 38% 100%, 0 100%)' }}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex justify-between font-mono text-[0.7rem] uppercase tracking-widest">
          <span>{project.index}</span>
          <span>{project.year}</span>
        </div>
        <div className="max-w-[85%]">
          <h3 className="font-display font-extrabold uppercase leading-[0.85] text-[clamp(1.5rem,5vw,3rem)]">
            {project.name}
          </h3>
          <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-widest opacity-80">
            {project.role}
          </p>
        </div>
      </div>
    </div>
  )
}

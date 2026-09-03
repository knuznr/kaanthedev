import { skillCategories, marqueeWords } from 'app/lib/data/skills'
import type { Accent } from 'app/lib/types'
import { SectionHeading } from './section-heading'
import { Marquee } from './marquee'

const accentBg: Record<Accent, string> = {
  yellow: 'bg-yellow',
  red: 'bg-red',
  blue: 'bg-blue',
}

export function Skills() {
  return (
    <section id="skills" className="py-16 md:py-20">
      <div className="px-4 md:px-6">
        <SectionHeading title="Toolbox" id="skills-heading" />
      </div>

      <div className="flex flex-col gap-2 border-y-2 border-ink py-2">
        <Marquee items={marqueeWords} />
        <Marquee items={marqueeWords} reverse />
      </div>

      <div className="px-4 md:px-6 mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillCategories.map((cat) => (
          <div key={cat.title} className="border-2 border-ink bg-paper">
            <div className={`${accentBg[cat.accent]} border-b-2 border-ink px-4 py-2 font-mono text-xs uppercase tracking-widest`}>
              {cat.title}
            </div>
            <ul className="p-4 space-y-2 font-mono text-sm">
              {cat.items.map((item) => (
                <li key={item} className="flex items-center gap-2 hover:text-red transition-colors">
                  <span className="size-2 bg-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

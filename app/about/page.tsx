import type { Metadata } from 'next'
import { Title } from 'app/components/title'
import { PageTransition } from 'app/components/page-transition'
import { ogMeta } from 'app/og/metadata'
import Link from 'next/link'
import { profile, socials } from 'app/lib/data/profile'
import { projects } from 'app/lib/data/projects'
import type { Project } from 'app/lib/types'
import { InteractiveTimeline } from 'app/components/ui/interactive-timeline'
import type { TimelineItem } from 'app/components/ui/interactive-timeline'

export const metadata: Metadata = {
  title: 'About',
  description: 'Kaan Uzuner, founder and developer of Kolay Büro.',
  ...ogMeta({ title: 'About', description: 'Kaan Uzuner, founder and developer of Kolay Büro.', kind: 'about' }),
}

// the timeline holds the roles already listed in app/lib/data/projects.ts, oldest first
const LIVE_PROJECT_ID = 'kolay-buro'

function roleItem(project: Project, live: boolean): TimelineItem {
  return {
    id: project.id,
    title: project.name,
    timestamp: live ? `${project.year} — now` : project.year,
    status: live ? 'in-progress' : 'completed',
    description: project.description,
    statusLabel: project.role,
    meta: [{ label: 'stack', value: project.stack.join(' · ') }],
    href: project.liveUrl,
    hrefLabel: project.liveUrl ? 'visit the site' : undefined,
  }
}

export default function AboutPage() {
  const pastRoles = projects
    .filter((p) => p.id !== LIVE_PROJECT_ID)
    .sort((a, b) => a.year.localeCompare(b.year))

  const liveRole = projects.find((p) => p.id === LIVE_PROJECT_ID)

  const timelineItems: TimelineItem[] = [
    ...pastRoles.map((p) => roleItem(p, false)),
    ...(liveRole ? [roleItem(liveRole, true)] : []),
  ]

  return (
    <PageTransition>
    <section className="space-y-10 pb-12">
      <Title as="h1" size="page">about</Title>
      <div className="space-y-4">
        {profile.bio.map((p) => (
          <p key={p} className="leading-relaxed">{p}</p>
        ))}
        <p className="muted text-sm">{profile.location}</p>
      </div>

      <div className="border-t-[3px] border-ink pt-6">
        <Title>now</Title>
        <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
          {profile.now.map((n) => (
            <li key={n} className="py-3">{n}</li>
          ))}
        </ul>
      </div>

      <div className="border-t-[3px] border-ink pt-6">
        <Title>timeline</Title>
        <p className="muted mt-2 text-sm">roles, oldest first.</p>
        <InteractiveTimeline items={timelineItems} className="mt-6" label="timeline" />
      </div>

      <ul className="flex flex-wrap gap-x-5 text-sm">
        {socials.filter((s) => s.href.startsWith('http')).map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-muted inline-flex min-h-11 items-center">{s.label.toLowerCase()} ↗</a>
          </li>
        ))}
        <li>
          <Link href="/contact" className="link-muted inline-flex min-h-11 items-center">contact →</Link>
        </li>
      </ul>
    </section>
    </PageTransition>
  )
}

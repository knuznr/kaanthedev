import type { Metadata } from 'next'
import { Title } from 'app/components/title'
import { PageTransition } from 'app/components/page-transition'
import { ogMeta } from 'app/og/metadata'
import Link from 'next/link'
import { profile, socials } from 'app/lib/data/profile'

export const metadata: Metadata = {
  title: 'About',
  description: 'Kaan Uzuner, founder and developer of Kolay Büro.',
  ...ogMeta({ title: 'About', description: 'Kaan Uzuner, founder and developer of Kolay Büro.', kind: 'about' }),
}

export default function AboutPage() {
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

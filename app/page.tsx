import Link from 'next/link'
import { profile, socials } from 'app/lib/data/profile'
import { projects } from 'app/lib/data/projects'
import { getLatestPosts, formatDate } from 'app/blog/utils'
import { ProjectList } from 'app/components/project-list'
import { Reveal } from 'app/components/reveal'
import { Button } from 'app/components/ui/button'
import { RotatingRole } from 'app/components/rotating-role'
import { Title } from 'app/components/title'
import { PageTransition } from 'app/components/page-transition'

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

export default function Page() {
  const posts = getLatestPosts(3)
  return (
    <PageTransition>
    <div className="space-y-16 pb-12">
      <section data-stagger className="space-y-5">
        <h1 className="title text-[clamp(3.5rem,15vw,6.5rem)]">
          Kaan<br />Uzuner<span className="text-signal">.</span>
        </h1>
        <RotatingRole />
        {profile.bio.map((p) => (
          <p key={p} className="muted leading-relaxed">{p}</p>
        ))}
        <div className="space-y-4 border-t-[3px] border-ink pt-4">
          <p className="text-lg font-extrabold tracking-tight">Wanna build something? Just leave a note.</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="lg">
              <Link href="/contact">Leave a note</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/blog">Read the devlog</Link>
            </Button>
          </div>
        </div>
        <ul className="flex gap-5 text-sm">
          {socials.filter((s) => s.href.startsWith('http')).map((s) => (
            <li key={s.label}>
              <a href={s.href} className="link-muted inline-flex min-h-11 items-center" {...ext}>{s.label.toLowerCase()} ↗</a>
            </li>
          ))}
        </ul>
      </section>

      <Reveal id="work" className="scroll-mt-8 border-t-[3px] border-ink pt-6">
        <Title>projects</Title>
        <div className="mt-6">
          <ProjectList items={projects.slice(0, 3)} />
        </div>
        <p className="mt-4 text-sm"><Link href="/work" className="link-muted">View all →</Link></p>
      </Reveal>

      <Reveal id="writing" className="scroll-mt-8 border-t-[3px] border-ink pt-6">
        <Title>writing</Title>
        <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
          {posts.map((post) => (
            <li key={post.slug} className="flex items-baseline justify-between gap-4 py-3">
              <Link href={`/blog/${post.slug}`} transitionTypes={['nav-forward']} className="transition-colors hover:text-ink/60">{post.metadata.title}</Link>
              <span className="muted shrink-0 text-sm tabular-nums">{formatDate(post.metadata.publishedAt, false)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm"><Link href="/blog" className="link-muted">View all →</Link></p>
      </Reveal>
    </div>
    </PageTransition>
  )
}

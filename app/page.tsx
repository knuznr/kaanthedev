import Link from 'next/link'
import { ArrowUpRight, BookOpen, Mail } from 'lucide-react'
import { profile, socials } from 'app/lib/data/profile'
import { projects } from 'app/lib/data/projects'
import { getLatestPosts, formatDate } from 'app/blog/utils'
import { ProjectList } from 'app/components/project-list'
import { Activity } from 'app/components/activity'
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
        <div className="space-y-1 rounded-lg bg-accent p-1 text-sm leading-6 font-normal text-accent-foreground">
          <Activity />
          <div className="flex flex-col gap-3 p-2">
            <p>
              Wanna build something? Check out my{' '}
              <Link
                href="/work"
                className="group/link relative inline-flex items-center gap-0.5 font-medium text-muted-foreground transition-colors duration-150 hover:text-ink after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-200 after:ease-[var(--ease-out)] hover:after:scale-x-100"
              >
                work
                <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </Link>
            </p>
            <div className="flex flex-row items-center gap-2">
              <Button asChild>
                <Link href="/contact"><Mail aria-hidden />Leave a note</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/blog"><BookOpen aria-hidden />Read the blog</Link>
              </Button>
            </div>
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

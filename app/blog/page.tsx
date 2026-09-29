import Link from 'next/link'
import type { Metadata } from 'next'
import { Title } from 'app/components/title'
import { PageTransition } from 'app/components/page-transition'
import { ogMeta } from 'app/og/metadata'
import { getBlogPosts, formatDate } from 'app/blog/utils'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on web development, AI, and building things.',
  ...ogMeta({ title: 'Writing', description: 'Notes on web development, AI, and building things.', kind: 'writing' }),
}

export default function BlogPage() {
  const posts = getBlogPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) return -1
    return 1
  })

  return (
    <PageTransition>
    <section className="pb-12">
      <Title as="h1" size="page">writing</Title>
      <ul className="mt-10 space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} transitionTypes={['nav-forward']} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-medium underline-offset-4 group-hover:underline">{post.metadata.title}</h2>
                <span className="muted shrink-0 text-sm tabular-nums">{formatDate(post.metadata.publishedAt, false)}</span>
              </div>
              {post.metadata.summary && <p className="muted mt-1 text-sm leading-relaxed">{post.metadata.summary}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
    </PageTransition>
  )
}

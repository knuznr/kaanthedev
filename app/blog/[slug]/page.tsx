import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getBlogPosts, getPost, formatDate } from 'app/blog/utils'
import { CustomMDX } from 'app/components/mdx'
import { Title } from 'app/components/title'
import { PageTransition } from 'app/components/page-transition'
import { ogMeta } from 'app/og/metadata'

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) {
    return {
      title: 'Writing',
      description: 'A post on web development, AI, and building things.',
    }
  }
  return {
    title: post.metadata.title,
    description: post.metadata.summary,
    ...ogMeta({
      title: post.metadata.title,
      description: post.metadata.summary,
      type: 'article',
      kind: 'writing',
      date: formatDate(post.metadata.publishedAt, false),
    }),
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <PageTransition>
    <article className="pb-12">
      <Link href="/blog" transitionTypes={['nav-back']} className="muted text-sm transition-colors hover:text-ink">
        &#8592; writing
      </Link>
      <header className="mb-10 mt-8">
        <p className="mono-label muted">{formatDate(post.metadata.publishedAt, false)}</p>
        <Title as="h1" className="mt-3 text-[clamp(2.25rem,9vw,3.75rem)]">{post.metadata.title.replace(/[.\s]+$/, '')}</Title>
        {post.metadata.tags && post.metadata.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
            {post.metadata.tags.map((t) => (
              <li key={t} className="border border-ink/20 px-2 py-0.5">{t}</li>
            ))}
          </ul>
        )}
      </header>
      <div className="prose max-w-none">
        <CustomMDX source={post.content} />
      </div>
    </article>
    </PageTransition>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getBlogPosts, getPost, formatDate } from 'app/blog/utils'
import { CustomMDX } from 'app/components/mdx'
import { getOgImage } from 'app/og/metadata'

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
  const image = getOgImage(post.metadata.title)

  return {
    title: post.metadata.title,
    description: post.metadata.summary,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.summary,
      type: 'article',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metadata.title,
      description: post.metadata.summary,
      images: [image.url],
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <article className="px-4 pt-32 pb-24 md:px-6">
      <Link href="/blog" className="font-mono text-xs uppercase tracking-widest opacity-70 hover:opacity-100">
        &#8592; BACK TO WRITING
      </Link>
      <header className="mt-8 border-b-2 border-ink pb-6 mb-10">
        <p className="font-mono text-xs uppercase tracking-widest opacity-70">
          {formatDate(post.metadata.publishedAt, false)}
        </p>
        <h1 className="mt-4 font-display font-extrabold uppercase leading-[0.85] tracking-tight text-[clamp(2.5rem,9vw,6rem)]">
          {post.metadata.title}
        </h1>
        {post.metadata.tags && post.metadata.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.metadata.tags.map((t) => (
              <span key={t} className="border-2 border-ink bg-yellow px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest">
                {t}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="prose max-w-none">
        <CustomMDX source={post.content} />
      </div>
    </article>
  )
}

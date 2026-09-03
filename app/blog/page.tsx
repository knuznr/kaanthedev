import Link from 'next/link'
import type { Metadata } from 'next'
import { getBlogPosts, formatDate } from 'app/blog/utils'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on web development, AI, and building things.',
}

export default function BlogPage() {
  const posts = getBlogPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) return -1
    return 1
  })

  return (
    <section className="px-4 pt-32 pb-24 md:px-6">
      <div className="border-b-2 border-ink pb-4 mb-10">
        <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
          WRITING
        </h1>
      </div>
      <ul className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-1 gap-3 border-2 border-ink bg-paper p-5 hover:bg-yellow transition-colors sm:grid-cols-[auto_1fr_auto] sm:items-center"
            >
              <span className="font-mono text-xs uppercase tracking-widest opacity-70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-extrabold leading-tight">{post.metadata.title}</h2>
                {post.metadata.summary && (
                  <p className="mt-2 text-sm leading-relaxed opacity-80">{post.metadata.summary}</p>
                )}
                {post.metadata.tags && post.metadata.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.metadata.tags.map((t) => (
                      <span key={t} className="border border-ink px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="font-mono text-xs uppercase tracking-widest opacity-70">
                {formatDate(post.metadata.publishedAt, false)} <span className="ml-2">&#8594;</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

import Link from 'next/link'
import { getLatestPosts, formatDate } from 'app/blog/utils'
import { SectionHeading } from './section-heading'
import { MagneticButton } from './magnetic-button'

const bar = ['bg-yellow', 'bg-red', 'bg-blue']

export function BlogPreview() {
  const posts = getLatestPosts(3)
  return (
    <section id="writing" className="px-4 py-24 md:px-6">
      <SectionHeading index="06" title="Writing" id="writing-heading" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block border-2 border-ink bg-paper hover:-translate-y-1 transition-transform"
          >
            <div className={`${bar[i % bar.length]} border-b-2 border-ink h-3`} />
            <div className="p-5">
              <p className="font-mono text-[0.7rem] uppercase tracking-widest opacity-70">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <h3 className="mt-3 font-display text-2xl font-extrabold leading-tight">{post.metadata.title}</h3>
              {post.metadata.summary && (
                <p className="mt-3 text-sm leading-relaxed opacity-80">{post.metadata.summary}</p>
              )}
              {post.metadata.tags && post.metadata.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.metadata.tags.map((t) => (
                    <span key={t} className="border border-ink px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <MagneticButton href="/blog" className="!bg-paper !text-ink hover:!bg-blue hover:!text-paper">
          ALL POSTS &#8594;
        </MagneticButton>
      </div>
    </section>
  )
}

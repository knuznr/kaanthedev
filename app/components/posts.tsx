import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <div className="space-y-3">
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 transition-all hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-neutral-900 dark:text-neutral-100 font-medium tracking-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors truncate">
                    {post.metadata.title}
                  </h3>
                  {post.metadata.summary && (
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1 line-clamp-2">
                      {post.metadata.summary}
                    </p>
                  )}
                </div>
                <p className="text-neutral-500 dark:text-neutral-500 text-sm whitespace-nowrap flex-shrink-0">
                  {formatDate(post.metadata.publishedAt, false)}
                </p>
              </div>
            </div>
          </Link>
        ))}
    </div>
  )
}

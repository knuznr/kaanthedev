import { BlogPosts } from 'app/components/posts'
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'blog',
  description: 'Just blogs.',
};

export default function Page() {
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">my blogs</h1>
      <hr className="my-6 border-neutral-100 dark:border-neutral-800" />
      <BlogPosts />
    </section>
  )
}

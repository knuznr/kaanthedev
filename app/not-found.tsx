import Link from 'next/link'
import { Title } from 'app/components/title'
import { PageTransition } from 'app/components/page-transition'

export default function NotFound() {
  return (
    <PageTransition>
    <section className="space-y-4 py-24">
      <Title as="h1" size="page">404</Title>
      <p className="muted">this page does not exist.</p>
      <Link href="/" className="inline-block underline underline-offset-4">← home</Link>
    </section>
    </PageTransition>
  )
}

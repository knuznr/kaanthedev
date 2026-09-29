import type { Metadata } from 'next'
import { Title } from 'app/components/title'
import { PageTransition } from 'app/components/page-transition'
import { ogMeta } from 'app/og/metadata'
import { profile } from 'app/lib/data/profile'
import { Contact } from 'app/components/contact'
import { BusinessCardDialog } from 'app/components/business-card'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Kaan Uzuner.',
  ...ogMeta({ title: 'Contact', description: 'Get in touch with Kaan Uzuner.', kind: 'contact' }),
}

export default function ContactPage() {
  return (
    <PageTransition>
    <section className="pb-12">
      <Title as="h1" size="page">contact</Title>
      <p className="mt-6 leading-relaxed">
        Wanna build something, or just want to say hello? Leave a note: write to{' '}
        <a href={`mailto:${profile.email}`} className="font-medium underline decoration-2 underline-offset-4">{profile.email}</a>
        , use the form, or <BusinessCardDialog />.
      </p>
      <Contact />
    </section>
    </PageTransition>
  )
}

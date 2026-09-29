import type { Metadata } from 'next'
import { Title } from 'app/components/title'
import { PageTransition } from 'app/components/page-transition'
import { ogMeta } from 'app/og/metadata'
import { projects } from 'app/lib/data/projects'
import { ProjectList } from 'app/components/project-list'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected work: Kolay Büro and other products I have built.',
  ...ogMeta({ title: 'Work', description: 'Selected work: Kolay Büro and other products I have built.', kind: 'work' }),
}

export default function WorkPage() {
  return (
    <PageTransition>
    <section className="pb-12">
      <Title as="h1" size="page">work</Title>
      <div className="mt-10">
        <ProjectList items={projects} />
      </div>
    </section>
    </PageTransition>
  )
}

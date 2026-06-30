import { Hero } from 'app/components/hero'
import { About } from 'app/components/about'
import { Projects } from 'app/components/projects'
import { Skills } from 'app/components/skills'
import { Testimonials } from 'app/components/testimonials'
import { BlogPreview } from 'app/components/blog-preview'
import { Contact } from 'app/components/contact'

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Testimonials />
      <BlogPreview />
      <Contact />
    </>
  )
}

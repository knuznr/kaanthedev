'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { projects } from 'app/lib/data/projects'
import { Poster } from './poster'
import { SectionHeading } from './section-heading'
import { fadeUp, stagger, viewportOnce } from 'app/lib/motion'

export function Projects() {
  return (
    <section id="work" className="px-4 py-24 md:px-6">
      <SectionHeading index="03" title="Selected Work" id="work-heading" />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => {
          const href = project.liveUrl ?? project.repoUrl ?? '#contact'
          const external = href.startsWith('http')
          return (
            <motion.div
              key={project.id}
              variants={fadeUp}
              className={project.featured ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''}
            >
              <Link
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="group block"
              >
                <div className="relative">
                  <div className="absolute -bottom-3 -right-3 hidden h-full w-full border-2 border-ink bg-paper group-hover:bg-yellow transition-colors sm:block" />
                  <div className="relative transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
                    <Poster project={project} />
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <p className="max-w-md text-sm leading-relaxed">{project.description}</p>
                  <span className="font-mono text-xs uppercase tracking-widest opacity-70">
                    {project.stack.slice(0, 3).join(' / ')}
                  </span>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}

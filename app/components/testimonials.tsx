'use client'
import { motion } from 'framer-motion'
import { testimonials } from 'app/lib/data/testimonials'
import type { Accent } from 'app/lib/types'
import { SectionHeading } from './section-heading'
import { fadeUp, viewportOnce } from 'app/lib/motion'

const accentText: Record<Accent, string> = {
  yellow: 'text-yellow',
  red: 'text-red',
  blue: 'text-blue',
}

export function Testimonials() {
  return (
    <section id="words" className="px-4 py-24 md:px-6">
      <SectionHeading index="05" title="Kind Words" id="words-heading" />
      <div className="flex flex-col gap-6">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className={`relative border-2 border-ink bg-paper p-6 md:p-8 md:max-w-[88%] ${
              i % 2 === 1 ? 'md:self-end' : 'md:self-start'
            }`}
          >
            <div className={`${accentText[t.accent]} font-display font-extrabold text-6xl leading-none -mb-4 select-none`} aria-hidden="true">
              &#8220;
            </div>
            <blockquote className="text-xl leading-relaxed md:text-2xl">{t.quote}</blockquote>
            <figcaption className="mt-6 border-t-2 border-ink pt-4 font-mono text-xs uppercase tracking-widest">
              {t.name} &#183; {t.role} &#183; <span className="bg-ink text-paper px-2 py-0.5">{t.company}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}

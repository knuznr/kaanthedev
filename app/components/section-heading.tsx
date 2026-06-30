'use client'
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewportOnce } from 'app/lib/motion'

export function SectionHeading({
  index,
  title,
  id,
}: {
  index: string
  title: string
  id?: string
}) {
  return (
    <motion.div
      id={id}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="flex items-end justify-between gap-6 border-b-2 border-ink pb-4 mb-10 scroll-mt-24"
    >
      <motion.h2
        variants={fadeUp}
        className="font-display font-extrabold uppercase leading-[0.9] tracking-tight text-[clamp(2.5rem,8vw,6rem)]"
      >
        <span className="opacity-40 mr-3">{index}</span>
        {title}
      </motion.h2>
      <motion.span
        variants={fadeUp}
        className="hidden sm:block font-mono text-xs uppercase tracking-widest opacity-60"
      >
        // section
      </motion.span>
    </motion.div>
  )
}

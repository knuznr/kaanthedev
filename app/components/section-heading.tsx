'use client'
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewportOnce } from 'app/lib/motion'

export function SectionHeading({
  title,
  id,
}: {
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
      className="mb-10 flex items-end border-b-2 border-ink pb-4 scroll-mt-24"
    >
      <motion.h2
        variants={fadeUp}
        className="min-w-0 font-display text-[clamp(2rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight"
      >
        {title}
      </motion.h2>
    </motion.div>
  )
}

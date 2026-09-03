'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { profile } from 'app/lib/data/profile'
import { MagneticButton } from './magnetic-button'
import { fadeUp, stagger, wipeIn, viewportOnce } from 'app/lib/motion'

export function Hero() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeInView = useInView(marqueeRef, { amount: 0.1 })

  return (
    <section id="hero" className="relative flex min-h-[85dvh] flex-col justify-center px-4 pb-12 pt-24 md:px-6">
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative">
        <motion.p variants={fadeUp} className="font-mono text-xs uppercase tracking-widest opacity-70 mb-6">
          {profile.status} &#183; {profile.location}
        </motion.p>

        <motion.h1 variants={fadeUp} className="font-display text-[clamp(2.75rem,8vw,6rem)] font-extrabold uppercase leading-[0.88] tracking-tight">
          <span className="block">KAAN</span>
          <span className="block">
            <span className="relative inline-block">
              <span className="absolute -inset-2 -z-10 bg-yellow" />
              UZUNER
            </span>
          </span>
        </motion.h1>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <motion.div variants={fadeUp} className="max-w-xl text-lg leading-relaxed">
            <span className="font-mono text-sm uppercase tracking-widest">// </span>
            {profile.role} building focused software for real work.{' '}
            <span className="inline-block rotate-[-3deg] border-2 border-ink bg-red px-2 font-mono text-sm uppercase tracking-widest text-paper">
              {profile.tagline}
            </span>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <MagneticButton href="#work">VIEW WORK &#8594;</MagneticButton>
            <MagneticButton href="/blog" className="!bg-paper !text-ink hover:!bg-blue hover:!text-paper">
              READ BLOG &#8594;
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        variants={wipeIn}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-10 border-y-2 border-ink bg-ink py-2 text-paper"
      >
        <div ref={marqueeRef} className="group flex overflow-hidden">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              style={{ animationPlayState: marqueeInView ? 'running' : 'paused' }}
              className="flex shrink-0 items-center animate-marquee group-hover:[animation-play-state:paused]"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="font-mono text-xs uppercase tracking-widest whitespace-nowrap px-4"
                >
                  FOCUSED SOFTWARE FOR REAL WORK <span className="mx-2 text-yellow">&#9632;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  )
}

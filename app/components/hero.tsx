'use client'
import { motion } from 'framer-motion'
import { profile } from 'app/lib/data/profile'
import { MagneticButton } from './magnetic-button'
import { fadeUp, stagger, wipeIn, viewportOnce } from 'app/lib/motion'

export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col justify-center px-4 pt-24 pb-16 md:px-6">
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative">
        <motion.p variants={fadeUp} className="font-mono text-xs uppercase tracking-widest opacity-70 mb-6">
          {profile.status} &#183; {profile.location}
        </motion.p>

        <motion.h1 variants={fadeUp} className="font-display font-extrabold uppercase leading-[0.82] tracking-tight text-[clamp(3rem,14vw,11rem)]">
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
            {profile.role} building bold things for the web.{' '}
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
        className="mt-12 border-y-2 border-ink bg-ink py-2 text-paper"
      >
        <div className="group flex overflow-hidden">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center animate-marquee group-hover:[animation-play-state:paused]"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="font-mono text-xs uppercase tracking-widest whitespace-nowrap px-4"
                >
                  BUILDING BOLD THINGS FOR THE WEB <span className="text-yellow mx-2">&#9632;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-10 flex justify-center">
        <span className="font-mono text-[0.7rem] uppercase tracking-widest opacity-60">scroll &#8595;</span>
      </div>
    </section>
  )
}

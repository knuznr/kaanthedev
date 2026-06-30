'use client'
import { motion } from 'framer-motion'
import { profile, stats } from 'app/lib/data/profile'
import { SectionHeading } from './section-heading'
import { fadeUp, stagger, viewportOnce } from 'app/lib/motion'

export function About() {
  return (
    <section id="about" className="px-4 py-24 md:px-6">
      <SectionHeading index="02" title="About" id="about-heading" />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid grid-cols-1 gap-8 lg:grid-cols-12"
      >
        <motion.div variants={fadeUp} className="lg:col-span-7">
          <div className="space-y-5 text-lg leading-relaxed">
            {profile.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="border-2 border-ink p-4">
                <div className="font-display text-[clamp(1.5rem,5vw,3rem)] font-extrabold leading-none">{s.value}</div>
                <div className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest opacity-70">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-5">
          <div className="relative">
            <div className="absolute -right-3 -top-3 h-full w-full border-2 border-ink bg-blue" />
            <div className="relative border-2 border-ink bg-paper p-6">
              <div className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">// id card</div>
              <dl className="space-y-3 font-mono text-sm">
                <Row k="role" v={profile.role} />
                <Row k="focus" v={profile.tagline} />
                <Row k="location" v={profile.location} />
                <Row k="status" v={profile.status} />
              </dl>
              <div className="mt-6 border-t-2 border-ink pt-4">
                <div className="font-mono text-xs uppercase tracking-widest opacity-60 mb-3">now</div>
                <ul className="space-y-2 font-mono text-sm">
                  {profile.now.map((n, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-red">&#9646;</span>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ink/20 pb-2">
      <dt className="uppercase tracking-widest text-[0.7rem] opacity-60">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  )
}

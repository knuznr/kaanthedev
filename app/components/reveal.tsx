'use client'
import { motion, useReducedMotion } from 'framer-motion'

// full transform strings keep it hardware-accelerated; reduced motion = fade only
export function Reveal({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, transform: reduce ? 'translateY(0px)' : 'translateY(8px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.section>
  )
}

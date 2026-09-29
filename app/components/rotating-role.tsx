'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const roles = ['Founder & Developer', 'Full-stack Engineer', 'Building Kolay Büro']
const HOLD_MS = 3200

// Old text blurs out fast, new text blurs in and gets one shimmer sweep.
export function RotatingRole() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), HOLD_MS)
    return () => clearInterval(t)
  }, [reduce])

  return (
    <>
      <span className="sr-only">{roles.join(', ')}</span>
      <span aria-hidden="true" className="mono-label relative block h-5 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: 'blur(4px)', transform: 'translateY(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)', transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ opacity: 0, filter: 'blur(4px)', transform: 'translateY(-4px)', transition: { duration: 0.2 } }}
            className={`block whitespace-nowrap ${reduce ? 'muted' : 'shimmer'}`}
          >
            {roles[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  )
}

'use client'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, type Variants } from 'framer-motion'

// pack: the envelope grows out of the send button, the sheet slides in, the flap closes.
// fly: the envelope lets go and a paper plane crosses the screen.
// The overlay never blocks input: pointer-events are off and the page stays usable underneath.
export type SendStage = 'idle' | 'pack' | 'fly'
export type Origin = { x: number; y: number }

const settle = { type: 'spring', bounce: 0, duration: 0.55 } as const // critically damped: nothing here carries momentum
const out = [0.23, 1, 0.32, 1] as const
const inOut = [0.4, 0, 0.2, 1] as const
const instant = { duration: 0 }

const sheet: Variants = {
  idle: { y: -18, transition: instant },
  pack: { y: 34, transition: { duration: 0.8, delay: 0.4, ease: inOut } },
  fly: { y: 34, transition: instant },
}
const flap: Variants = {
  idle: { scaleY: -1, transition: instant },
  pack: { scaleY: 1, transition: { duration: 0.3, delay: 1.2, ease: out } },
  fly: { scaleY: 1, transition: instant },
}
// the plane is the one thing that carries momentum: a small wind-up, then a slightly springy launch along an arc
const plane: Variants = {
  idle: { opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.6, transition: instant },
  pack: { opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.6, transition: instant },
  fly: {
    opacity: [0, 1, 1, 1, 0],
    x: [0, -6, 150, 150, 150],
    y: [0, 5, -96, -96, -96],
    rotate: [0, 8, -34, -34, -34],
    scale: [0.6, 0.7, 1.1, 1.1, 1.1],
    transition: {
      duration: 1.7,
      times: [0, 0.14, 0.92, 0.96, 1],
      ease: [out, [0.5, 0, 0.3, 1], 'linear', 'linear'],
      opacity: { duration: 1.7, times: [0, 0.06, 0.62, 0.85, 1], ease: 'linear' },
    },
  },
}

const sheetFill = '#FAFAF7' // the sheet is white paper in both themes
const sheetInk = '#111111'
const bodyFill = 'color-mix(in srgb, var(--ink) 7%, var(--paper))'

export function SendAnimation({ stage, origin, onFlown }: { stage: SendStage; origin: Origin; onFlown: () => void }) {
  if (typeof document === 'undefined') return null
  return createPortal(
    <AnimatePresence>
      {stage !== 'idle' && (
        <motion.div
          key="send"
          aria-hidden="true"
          className="send-scrim pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-paper/60"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(14px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.3 } }}
          transition={{ duration: 0.35, ease: out }}
        >
          <motion.svg
            viewBox="0 0 96 56"
            initial="idle"
            animate={stage}
            className="w-[min(64vw,380px)] overflow-visible stroke-ink"
            fill="none"
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <defs>
              <clipPath id="sheet-clip">
                <rect x="0" y="-40" width="96" height="94" />
              </clipPath>
            </defs>
            <motion.g
              initial={{ x: origin.x, y: origin.y, scale: 0.1, opacity: 0 }}
              animate={stage === 'pack' ? { x: 0, y: 0, scale: 1, opacity: 1, transition: settle } : { x: 0, y: 6, scale: 0.85, opacity: 0, transition: { duration: 0.28 } }}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              <rect x="20" y="22" width="56" height="32" rx="3" style={{ fill: bodyFill }} />
              <motion.path variants={flap} d="M20 22L48 40 76 22Z" style={{ fill: 'var(--paper)', originX: 0.5, originY: 0 }} />
              <g clipPath="url(#sheet-clip)">
                <motion.g variants={sheet}>
                  <rect x="31" y="6" width="34" height="26" rx="1.5" style={{ fill: sheetFill, stroke: sheetInk }} />
                  <path d="M37 14h22M37 20h22M37 26h14" style={{ stroke: sheetInk }} strokeOpacity="0.5" />
                </motion.g>
              </g>
              <path d="M20 22V51a3 3 0 0 0 3 3h50a3 3 0 0 0 3-3V22L48 40Z" style={{ fill: 'var(--paper)' }} />
            </motion.g>
            <motion.g variants={plane} onAnimationComplete={(d) => d === 'fly' && onFlown()} style={{ originX: 0.5, originY: 0.5 }}>
              <path d="M32 34L64 22 52 46 46 38Z" style={{ fill: sheetFill, stroke: sheetInk }} />
              <path d="M64 22L46 38" style={{ stroke: sheetInk }} />
            </motion.g>
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

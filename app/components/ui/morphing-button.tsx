'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { cn } from 'app/lib/cn'

// adapted from EasyUI "morphing-button": same idle -> loading -> success -> error
// state model, restyled flat/swiss and made layout-stable with a stacked grid:
// every label stays in the same cell, so the button never resizes mid-morph.
export type MorphingButtonStatus = 'idle' | 'loading' | 'success' | 'error'

type MorphingButtonProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'style' | 'children'
> & {
  status?: MorphingButtonStatus
  idleText?: string
  loadingText?: string
  successText?: string
  errorText?: string
  idleIcon?: React.ReactNode
  loadingIcon?: React.ReactNode
  successIcon?: React.ReactNode
  errorIcon?: React.ReactNode
}

// critical damping, no bounce: the label settles, it does not spring
const settle = { type: 'spring', stiffness: 380, damping: 30, mass: 0.5 } as const
const instant = { duration: 0 } as const

const tone: Record<MorphingButtonStatus, string> = {
  idle: 'bg-primary text-primary-foreground hover:bg-primary/80',
  loading: 'bg-primary text-primary-foreground',
  success: 'bg-primary text-primary-foreground',
  error: 'border-ink/40 bg-transparent text-ink hover:bg-foreground/[0.045]',
}

export function MorphingButton({
  status = 'idle',
  idleText = 'send',
  loadingText = 'sending…',
  successText = 'sent',
  errorText = 'try again',
  idleIcon,
  loadingIcon,
  successIcon,
  errorIcon,
  disabled = false,
  className,
  ...props
}: MorphingButtonProps) {
  const reduce = useReducedMotion()
  const isLoading = status === 'loading'

  const states = [
    { key: 'idle' as const, text: idleText, icon: idleIcon },
    { key: 'loading' as const, text: loadingText, icon: loadingIcon ?? <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" /> },
    { key: 'success' as const, text: successText, icon: successIcon ?? <Check className="size-3.5" aria-hidden="true" /> },
    { key: 'error' as const, text: errorText, icon: errorIcon },
  ]

  return (
    <motion.button
      data-slot="morphing-button"
      data-status={status}
      whileTap={disabled || isLoading || reduce ? undefined : { scale: 0.985 }}
      transition={reduce ? instant : settle}
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      className={cn(
        'relative inline-grid h-9 min-w-[7rem] place-items-center rounded-[3px] border border-transparent px-4 text-sm font-medium whitespace-nowrap select-none transition-colors duration-150 disabled:cursor-wait',
        tone[status],
        className,
      )}
      {...props}
    >
      {states.map((s) => {
        const active = status === s.key
        return (
          <motion.span
            key={s.key}
            aria-hidden={!active}
            initial={false}
            animate={{ opacity: active ? 1 : 0, y: active || reduce ? 0 : 4 }}
            transition={reduce ? instant : settle}
            className="col-start-1 row-start-1 inline-flex items-center justify-center gap-2"
          >
            {s.icon}
            <span>{s.text}</span>
          </motion.span>
        )
      })}
    </motion.button>
  )
}

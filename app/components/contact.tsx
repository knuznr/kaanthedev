'use client'
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { SendAnimation, type Origin, type SendStage } from 'app/components/send-animation'
import { Button } from 'app/components/ui/button'
import { Input } from 'app/components/ui/input'
import { Label } from 'app/components/ui/label'
import { Textarea } from 'app/components/ui/textarea'
import { siteHost } from 'app/lib/site'

// enter slower (ease-out 250ms), exit snappy (120ms)
const fade = {
  initial: { opacity: 0, transform: 'translateY(4px)' },
  animate: { opacity: 1, transform: 'translateY(0px)', transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] as const } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
}


// public by design (Web3Forms access keys are meant to ship in the page); set it in .env.local
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY
const PACK_MS = 1700
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function Contact() {
  const reduce = useReducedMotion()
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [stage, setStage] = useState<SendStage>('idle')
  const [origin, setOrigin] = useState<Origin>({ x: 0, y: 0 })
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    setError('')

    // validate before anything animates
    const invalid = !name || !email || !message
      ? 'All fields are required.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'Please enter a valid email.'
        : message.length < 10
          ? 'Message is too short.'
          : !ACCESS_KEY
            ? 'The form is not configured yet. Please email me instead.'
            : ''
    if (invalid) {
      setStatus('error')
      setError(invalid)
      return
    }

    setStatus('pending')
    if (!reduce) {
      // the envelope grows out of the send button: offset from the viewport center
      const b = form.querySelector('button[type="submit"]')?.getBoundingClientRect()
      if (b) setOrigin({ x: b.x + b.width / 2 - window.innerWidth / 2, y: b.y + b.height / 2 - window.innerHeight / 2 })
      setStage('pack')
    }
    const t0 = performance.now()
    try {
      // straight from the browser: Web3Forms' free plan does not allow server-side calls,
      // and the access key is meant to be public
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `New message from ${name} (${siteHost})`,
          from_name: siteHost,
          name,
          email,
          message,
          botcheck: data.get('botcheck') ? true : '',
        }),
      })
      const json = await res.json()
      if (json.success) {
        form.reset()
        if (reduce) return setStatus('success')
        // let the envelope finish closing, then the plane leaves (onFlown sets success)
        await sleep(Math.max(0, PACK_MS - (performance.now() - t0)))
        setStage('fly')
      } else {
        setStage('idle')
        setStatus('error')
        setError(json.message ?? 'Something went wrong.')
      }
    } catch {
      setStage('idle')
      setStatus('error')
      setError('Network error. Try email instead.')
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="muted">name</Label>
        <Input id="name" name="name" type="text" autoComplete="name" required aria-invalid={status === 'error'} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="muted">email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={status === 'error'} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="muted">message</Label>
        <Textarea id="message" name="message" required minLength={10} rows={5} className="resize-none" aria-invalid={status === 'error'} />
      </div>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <Button type="submit" size="lg" disabled={status === 'pending'}>
        {status === 'pending' ? 'sending…' : 'send'}
      </Button>
      <SendAnimation
        stage={stage}
        origin={origin}
        onFlown={() => {
          setStage('idle')
          setStatus('success')
          navigator.vibrate?.(12) // same moment as the visual: the message has left
        }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' && (
          <motion.p key="ok" role="status" {...fade}>sent. thanks.</motion.p>
        )}
        {status === 'error' && (
          <motion.p key="err" role="alert" {...fade}>{error}</motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}

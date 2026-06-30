'use client'
import { useState } from 'react'
import { profile } from 'app/lib/data/profile'
import { SectionHeading } from './section-heading'

type Status = 'idle' | 'pending' | 'success' | 'error'

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    }
    setStatus('pending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
        setError(json.error ?? 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setError('Network error. Try the email link below.')
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <section id="contact" className="px-4 py-24 md:px-6">
      <SectionHeading index="07" title="Contact" id="contact-heading" />
      <h3 className="font-display font-extrabold uppercase leading-[0.85] tracking-tight text-[clamp(2.5rem,10vw,7rem)] mb-10">
        LET&#201;S BUILD<br />SOMETHING
      </h3>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmit} noValidate className="border-2 border-ink bg-blue p-6 space-y-6">
          <Field label="Name" name="name" type="text" error={error} />
          <Field label="Email" name="email" type="email" error={error} />
          <div>
            <label htmlFor="message" className="block font-mono text-xs uppercase tracking-widest mb-2 text-paper">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              rows={5}
              className="w-full resize-none border-2 border-ink bg-paper px-3 py-2 font-body text-ink outline-none focus:bg-yellow transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'pending'}
            className="w-full border-2 border-ink bg-ink px-6 py-3 font-mono text-sm uppercase tracking-widest text-paper hover:bg-paper hover:text-ink transition-colors disabled:opacity-60"
          >
            {status === 'pending' ? 'SENDING\u2026' : 'SEND MESSAGE \u2192'}
          </button>
          {status === 'success' && (
            <div className="border-2 border-ink bg-green p-4 font-mono text-sm uppercase tracking-widest text-ink">
              &#10003; MESSAGE SENT
            </div>
          )}
          {status === 'error' && (
            <div id="contact-error" className="border-2 border-ink bg-red p-4 font-mono text-sm uppercase tracking-widest text-paper">
              {error || 'ERROR'}
            </div>
          )}
        </form>

        <div className="flex flex-col justify-between border-2 border-ink bg-paper p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">// or reach me directly</p>
            <button
              type="button"
              onClick={copyEmail}
              className="group block break-all text-left font-display text-[clamp(1.5rem,5vw,3rem)] font-extrabold leading-none hover:text-red transition-colors"
            >
              {profile.email}
            </button>
            <p className="mt-3 font-mono text-xs uppercase tracking-widest opacity-70">
              {copied ? 'COPIED &#10003;' : 'click to copy'}
            </p>
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex w-fit border-2 border-ink bg-ink px-5 py-3 font-mono text-sm uppercase tracking-widest text-paper hover:bg-yellow hover:text-ink transition-colors"
          >
            OPEN MAIL CLIENT &#8594;
          </a>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  name,
  type,
  error,
}: {
  label: string
  name: string
  type: 'text' | 'email'
  error?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-xs uppercase tracking-widest mb-2 text-paper">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="w-full border-2 border-ink bg-paper px-3 py-2 font-body text-ink outline-none focus:bg-yellow transition-colors"
        aria-describedby={error ? 'contact-error' : undefined}
      />
    </div>
  )
}

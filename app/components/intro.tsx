'use client'
import { useEffect, useState } from 'react'

const greetings = ['hello', 'merhaba', 'hola', 'bonjour', 'ciao', 'olá', 'hallo']
const GREET_MS = 220

// Rendered on the server but hidden by CSS unless <html class="intro"> is set
// before first paint (see introScript in layout). Plays once per session.
export function Intro() {
  const [i, setI] = useState(0)
  const [name, setName] = useState(false)
  const [exit, setExit] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('intro')) return

    const finish = () => {
      try { sessionStorage.setItem('intro', '1') } catch {}
      root.classList.remove('intro')
    }
    const timers: number[] = []
    greetings.forEach((_, n) => { if (n) timers.push(window.setTimeout(() => setI(n), n * GREET_MS)) })
    const t1 = greetings.length * GREET_MS
    timers.push(window.setTimeout(() => setName(true), t1))
    timers.push(window.setTimeout(() => setExit(true), t1 + 800))
    timers.push(window.setTimeout(finish, t1 + 800 + 620))

    const skip = () => { timers.forEach(clearTimeout); setExit(true); timers.push(window.setTimeout(finish, 620)) }
    window.addEventListener('keydown', skip, { once: true })
    window.addEventListener('pointerdown', skip, { once: true })
    return () => { timers.forEach(clearTimeout); window.removeEventListener('keydown', skip); window.removeEventListener('pointerdown', skip) }
  }, [])

  return (
    <div
      aria-hidden="true"
      data-exit={exit}
      className="intro-overlay fixed inset-0 z-[60] flex-col bg-paper text-ink"
    >
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-6">
        <div className="flex flex-1 items-center">
          {name ? (
            <p key="name" className="greet-in title text-[clamp(4rem,19vw,9rem)]">
              I&apos;m Kaan<span className="text-signal">.</span>
            </p>
          ) : (
            <p key={i} className="title text-[clamp(4rem,19vw,9rem)]">
              {greetings[i]}
              <span className="text-signal">.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

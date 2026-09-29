'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'

// Full-screen transition between sections: a curtain in the theme's own colors rises from the bottom, the
// section names spin in ink and land on the one we are going to, the curtain flips to signal red, then
// keeps rising and reveals the new page.
// Sections only: list <-> post inside "writing" keeps the lighter view transition.
const tabs = ['about', 'work', 'writing', 'contact', 'home']

function nameFor(path: string) {
  if (path === '/') return 'home'
  if (path.startsWith('/about')) return 'about'
  if (path.startsWith('/work')) return 'work'
  if (path.startsWith('/blog')) return 'writing'
  if (path.startsWith('/contact')) return 'contact'
  return null
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const inOut = [0.77, 0, 0.175, 1] as const

export function PageCurtain() {
  const router = useRouter()
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<'idle' | 'in' | 'out'>('idle')
  const [word, setWord] = useState('')
  const [landed, setLanded] = useState(false)
  const path = useRef(pathname)
  const busy = useRef(false)
  path.current = pathname

  useEffect(() => {
    if (reduce) return

    async function run(href: string, dest: string) {
      busy.current = true
      // last four names in tab order, ending on the destination
      const end = tabs.indexOf(dest)
      const seq = [3, 2, 1, 0].map((k) => tabs[(end - k + tabs.length) % tabs.length])
      setLanded(false)
      setWord(seq[0])
      setPhase('in')
      router.push(href)
      const target = new URL(href, location.href).pathname
      await sleep(340) // curtain covers the screen
      for (const w of seq.slice(1)) {
        await sleep(90)
        setWord(w)
      }
      setLanded(true) // the choice is made: the sheet turns red
      const t0 = performance.now()
      while (path.current !== target && performance.now() - t0 < 2500) await sleep(40)
      await sleep(260) // let the destination name land
      setPhase('out')
    }

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || url.pathname === location.pathname) return
      const dest = nameFor(url.pathname)
      if (!dest || dest === nameFor(location.pathname)) return
      e.preventDefault() // Next's Link sees defaultPrevented and steps aside; we drive the router
      if (busy.current) return void router.push(url.pathname + url.search + url.hash)
      void run(url.pathname + url.search + url.hash, dest)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [reduce, router])

  if (phase === 'idle') return null
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[80] transition-colors duration-200 ${landed ? 'bg-signal text-[#F1EFEA]' : 'bg-paper text-ink'}`}
      // named so the view transition (page fade) paints under it instead of over it
      style={{ viewTransitionName: 'curtain' }}
      initial={{ y: '100%' }}
      animate={{ y: phase === 'out' ? '-100%' : '0%' }}
      transition={{ duration: phase === 'out' ? 0.55 : 0.34, ease: inOut }}
      onAnimationComplete={() => {
        if (phase === 'out') {
          setPhase('idle')
          busy.current = false
        }
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-2xl items-center px-6">
        <p className="title text-[clamp(4rem,19vw,9rem)]">
          {word}
          <span className={landed ? 'text-[#111111]' : 'text-signal'}>.</span>
        </p>
      </div>
    </motion.div>
  )
}

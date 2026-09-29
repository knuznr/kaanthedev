'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { Button } from 'app/components/ui/button'
import { Input } from 'app/components/ui/input'
import { Label } from 'app/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from 'app/components/ui/dialog'
import { profile, socials } from 'app/lib/data/profile'
import { cn } from 'app/lib/cn'
import { siteHost } from 'app/lib/site'

// 3.5 x 2 in at 300 dpi. The preview is the export: one canvas, no second renderer.
const W = 1050
const H = 600
const SITE = siteHost

type Side = 'front' | 'back'
type Fonts = { sans: string; mono: string }

const MUTED = '#7A776F'

const github = socials.find((s) => s.label === 'GitHub')?.href.replace('https://', '')
const linkedin = socials.find((s) => s.label === 'LinkedIn')?.href.replace('https://', '')

// deterministic grain so preview and export never differ between paints
function grain(ctx: CanvasRenderingContext2D, light = 0.12, dark = 0.035) {
  let s = 1337
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = rnd() > 0.5 ? `rgba(0,0,0,${dark})` : `rgba(255,255,255,${light})`
    ctx.fillRect(rnd() * W, rnd() * H, 1 + rnd() * 2, 1 + rnd() * 2)
  }
}

type LineOpts = {
  px: number
  weight?: number
  italic?: boolean
  spacing?: number
  caps?: boolean
  align?: 'left' | 'center' | 'right'
  color?: string | CanvasGradient
  emboss?: boolean
}

// One line, drawn glyph by glyph so letter-spacing and small caps work in every browser.
// Emboss: light edge up-left, soft shadow down-right, ink on top. Returns the line width.
function line(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, family: string, o: LineOpts) {
  const weight = o.weight ?? 400
  const style = o.italic ? 'italic' : ''
  const runs = [...text].map((ch) => {
    const small = o.caps && ch !== ch.toUpperCase()
    return { t: small ? ch.toUpperCase() : ch, f: `${style} ${weight} ${Math.round(small ? o.px * 0.8 : o.px)}px ${family}`.trim() }
  })
  const sp = o.spacing ?? 0
  const widths = runs.map((r) => (ctx.font = r.f, ctx.measureText(r.t).width + sp))
  const total = widths.reduce((a, b) => a + b, 0) - sp
  const start = o.align === 'right' ? x - total : o.align === 'left' ? x : x - total / 2
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  const pass = (dx: number, dy: number, color: string | CanvasGradient) => {
    ctx.fillStyle = color
    let cx = start
    runs.forEach((r, i) => {
      ctx.font = r.f
      ctx.fillText(r.t, cx + dx, y + dy)
      cx += widths[i]
    })
  }
  if (o.emboss) {
    pass(-1.5, -1.5, 'rgba(255,255,255,0.9)')
    pass(1.5, 1.5, 'rgba(0,0,0,0.16)')
  }
  pass(0, 0, o.color ?? SW_INK)
  return total
}

// largest px (<= start) at which the line still fits maxW
function fit(ctx: CanvasRenderingContext2D, text: string, family: string, weight: number, spacingEm: number, maxW: number, start: number) {
  let px = start
  for (; px > 20; px -= 2) {
    ctx.font = `${weight} ${px}px ${family}`
    if (ctx.measureText(text).width + spacingEm * px * (text.length - 1) <= maxW) break
  }
  return px
}

// greedy word wrap for short display copy
function wrap(ctx: CanvasRenderingContext2D, text: string, font: string, maxW: number) {
  ctx.font = font
  const out: string[] = []
  let cur = ''
  for (const w of text.split(' ')) {
    const next = cur ? `${cur} ${w}` : w
    if (cur && ctx.measureText(next).width > maxW) { out.push(cur); cur = w } else cur = next
  }
  if (cur) out.push(cur)
  return out
}

const greeting = (guest: string) => (guest ? `Nice to meet you, ${guest}.` : 'Nice to meet you.')
const JOKE = "We couldn't meet in person, so the card came to you."

/* -------------------------------------------------------------------- swiss */

const SW_PAPER = '#F1EFEA'
const SW_INK = '#111111'
const SW_RED = '#E5391F'

// Typography is the hero: an oversized name that nearly bleeds off the card, one red full stop.
function drawSwiss(ctx: CanvasRenderingContext2D, side: Side, guest: string, f: Fonts) {
  const pad = 64
  const mono = (t: string, x: number, y: number, o: Partial<LineOpts> = {}) =>
    line(ctx, t, x, y, f.mono, { px: 21, weight: 500, spacing: 2, align: 'left', ...o })

  if (side === 'front') {
    ctx.fillStyle = SW_PAPER
    ctx.fillRect(0, 0, W, H)
    grain(ctx, 0.1, 0.03)

    ;[profile.role.toUpperCase(), 'KOLAY BÜRO', SITE.toUpperCase()].forEach((t, i) =>
      mono(t, W - pad, pad + 14 + i * 26, { align: 'right', color: i === 0 ? SW_INK : MUTED }),
    )
    ctx.fillStyle = SW_INK
    ctx.fillRect(pad, 150, W - pad * 2, 3)

    const px = fit(ctx, 'Uzuner.', f.sans, 800, -0.045, W - pad * 2, 236)
    const sp = -0.045 * px
    line(ctx, 'Kaan', pad - 4, H - 24 - px * 0.86, f.sans, { px, weight: 800, spacing: sp, align: 'left', color: SW_INK })
    const w = line(ctx, 'Uzuner', pad - 4, H - 24, f.sans, { px, weight: 800, spacing: sp, align: 'left', color: SW_INK })
    line(ctx, '.', pad - 4 + w + sp, H - 24, f.sans, { px, weight: 800, align: 'left', color: SW_RED })
    return
  }

  ctx.fillStyle = SW_RED
  ctx.fillRect(0, 0, W, H)
  grain(ctx, 0.08, 0.05)
  mono(SITE.toUpperCase(), W - pad, pad + 14, { align: 'right', color: SW_PAPER })
  ctx.fillStyle = SW_PAPER
  ctx.fillRect(pad, 150, W - pad * 2, 3)

  const font = `800 84px ${f.sans}`
  wrap(ctx, greeting(guest), font, W - pad * 2).forEach((l, i) =>
    line(ctx, l, pad - 3, 246 + i * 82, f.sans, { px: 84, weight: 800, spacing: -3.4, align: 'left', color: SW_PAPER }),
  )
  mono(JOKE.toUpperCase(), pad, H - pad - 4 * 30 - 22, { px: 17, color: 'rgba(241,239,234,0.85)' })
  ;[profile.email, SITE, github, linkedin].filter(Boolean).forEach((l, i, a) =>
    mono(l as string, pad, H - pad + 8 - (a.length - 1 - i) * 30, { px: 22, color: SW_PAPER }),
  )
}

function draw(canvas: HTMLCanvasElement, side: Side, guest: string, fonts: Fonts) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  drawSwiss(ctx, side, guest.trim().slice(0, 24), fonts)
}

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const vcard = () =>
  [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.name}`,
    'N:Uzuner;Kaan;;;',
    'ORG:Kolay Büro',
    `TITLE:${profile.role}`,
    `EMAIL:${profile.email}`,
    `URL:https://${SITE}`,
    ...socials.filter((s) => s.href.startsWith('http')).map((s) => `URL:${s.href}`),
    'END:VCARD',
  ].join('\r\n')

function CardMaker() {
  const reduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const probes = useRef<Record<keyof Fonts, HTMLSpanElement | null>>({ sans: null, mono: null })
  const [side, setSide] = useState<Side>('front')
  const [guest, setGuest] = useState('')

  // decorative tilt + glare that follows the pointer (fine pointers only)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotY = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 150, damping: 16 })
  const rotX = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 150, damping: 16 })
  const gx = useTransform(px, (v) => v * 100)
  const gy = useTransform(py, (v) => v * 100)
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 55%)`

  const paint = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const fam = (k: keyof Fonts) => (probes.current[k] ? getComputedStyle(probes.current[k]!).fontFamily : 'serif')
    const fonts: Fonts = { sans: fam('sans'), mono: fam('mono') }
    try {
      await Promise.all([
        document.fonts.load(`800 236px ${fonts.sans}`),
        document.fonts.load(`500 21px ${fonts.mono}`),
      ])
    } catch {}
    draw(canvas, side, guest, fonts)
  }, [side, guest])

  useEffect(() => {
    paint()
  }, [paint])

  const savePng = () => canvasRef.current?.toBlob((b) => b && download(`kaan-uzuner-card-${side}.png`, b), 'image/png')
  const saveVcf = () => download('kaan-uzuner.vcf', new Blob([vcard()], { type: 'text/vcard' }))

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div className="space-y-5">
      {(['sans', 'mono'] as const).map((k) => (
        <span
          key={k}
          ref={(el) => { probes.current[k] = el }}
          className={cn('hidden', k === 'sans' ? 'font-body' : 'font-mono')}
          aria-hidden="true"
        />
      ))}

      <motion.div
        key={side}
        initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'rotateY(-70deg)' }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, transform: 'rotateY(0deg)' }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={reduce ? undefined : { rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
          className="relative"
        >
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            role="img"
            aria-label={`Business card, ${side}: ${profile.name}, ${profile.role}`}
            className="aspect-[7/4] w-full rounded-[3px] shadow-[0_14px_30px_-8px_rgba(0,0,0,0.45)]"
          />
          {!reduce && (
            <motion.div
              aria-hidden="true"
              style={{ background: glare }}
              className="pointer-events-none absolute inset-0 rounded-[3px] opacity-0 mix-blend-soft-light [@media(hover:hover)]:opacity-100"
            />
          )}
        </motion.div>
      </motion.div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="lg" onClick={() => setSide(side === 'front' ? 'back' : 'front')}>
          Flip card
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guest" className="muted">your name (optional, goes on the back)</Label>
        <Input
          id="guest"
          value={guest}
          onChange={(e) => setGuest(e.target.value)}
          onFocus={() => setSide('back')}
          maxLength={24}
          autoComplete="name"
          placeholder="Ada"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="lg" onClick={savePng}>Download PNG</Button>
        <Button type="button" variant="outline" size="lg" onClick={saveVcf}>Save contact (.vcf)</Button>
      </div>
    </div>
  )
}

// Opens from the button, or straight away when the URL ends in #card.
export function BusinessCardDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sync = () => location.hash === '#card' && setOpen(true)
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const onOpenChange = (v: boolean) => {
    setOpen(v)
    if (!v && location.hash === '#card') history.replaceState(null, '', location.pathname)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button type="button" className="font-medium underline decoration-2 underline-offset-4">take my business card</button>
      </DialogTrigger>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="title text-4xl">business card<span className="text-signal">.</span></DialogTitle>
          <DialogDescription>
            Even if we can&apos;t meet face to face, here&apos;s my business card! Put your name on the back if you
            like, and take it with you.
          </DialogDescription>
        </DialogHeader>
        <CardMaker />
      </DialogContent>
    </Dialog>
  )
}

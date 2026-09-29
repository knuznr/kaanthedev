/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import { siteHost } from 'app/lib/site'

type OgTemplateProps = {
  title: string
  kind?: string
  date?: string
}

// Same swiss grid as the business card. Satori sits outside the CSS cascade, so colors are literals.
const PAPER = '#F1EFEA'
const INK = '#111111'
const MUTED = '#7A776F'
const RED = '#E5391F'

const mono = { fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase' as const }

// Longer titles get a smaller size so they still fit in the block above the bottom edge.
const sizeFor = (n: number) => (n <= 14 ? 208 : n <= 30 ? 152 : n <= 44 ? 112 : n <= 72 ? 84 : 64)

export function OgTemplate({ title, kind, date }: OgTemplateProps) {
  const clean = title.replace(/[.\s]+$/, '')
  const size = sizeFor(clean.length)
  const words = clean.split(/\s+/)
  const label = [kind, date].filter(Boolean).join(' · ')

  return (
    <div
      style={{
        background: PAPER,
        color: INK,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, Inter Ext',
        fontWeight: 800,
        height: '100%',
        padding: '60px 64px 48px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ ...mono, color: INK, display: 'flex' }}>{label}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ ...mono, color: INK, display: 'flex' }}>Founder &amp; Developer</div>
          <div style={{ ...mono, color: MUTED, display: 'flex' }}>Kolay Büro</div>
          <div style={{ ...mono, color: MUTED, display: 'flex' }}>{siteHost}</div>
        </div>
      </div>

      <div style={{ background: INK, display: 'flex', height: 4, marginTop: 24, width: '100%' }} />

      <div style={{ display: 'flex', flex: 1, alignItems: 'flex-end', paddingTop: 28, width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: size,
            fontWeight: 800,
            letterSpacing: -size * 0.045,
            lineHeight: 0.9,
            marginBottom: -Math.round(size * 0.06),
            width: '100%',
          }}
        >
          {words.map((w, i) => (
            <div style={{ display: 'flex', marginRight: Math.round(size * 0.2) }}>
              {w}
              {i === words.length - 1 && <span style={{ color: RED, display: 'flex' }}>.</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

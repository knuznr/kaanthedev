import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createOgRenderer } from '@xsynaptic/og-image-generator'
import { ogImageSize } from './metadata'
import { OgTemplate } from './template'

export const runtime = 'nodejs'

// Fonts live in the repo (app/og/fonts, listed in outputFileTracingIncludes in next.config.js) so the
// serverless bundle always contains them. Reading them out of node_modules at runtime is not traced.
const font = (file: string) => readFileSync(path.join(process.cwd(), 'app/og/fonts', file))

const renderer = createOgRenderer({
  ...ogImageSize,
  fonts: [
    { name: 'Inter', data: font('inter-latin-800-normal.woff'), weight: 800, style: 'normal' },
    // Turkish letters (Ş, İ, Ğ) live in latin-ext; the template falls back to this family
    { name: 'Inter Ext', data: font('inter-latin-ext-800-normal.woff'), weight: 800, style: 'normal' },
    { name: 'JetBrains Mono', data: font('jetbrains-mono-latin-500-normal.woff'), weight: 500, style: 'normal' },
  ],
  format: 'png',
})

const param = (url: URL, key: string, max: number) => url.searchParams.get(key)?.trim().slice(0, max) || undefined

export async function GET(request: Request) {
  const url = new URL(request.url)
  const title = param(url, 'title', 96) ?? 'Kaan Uzuner'
  const kind = param(url, 'kind', 24)
  const date = param(url, 'date', 24)
  const image = await renderer(<OgTemplate title={title} kind={kind} date={date} />)

  return new Response(new Uint8Array(image), {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      'Content-Type': 'image/png',
    },
  })
}

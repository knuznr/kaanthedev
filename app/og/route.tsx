import { createOgRenderer, fontsourceFonts } from '@xsynaptic/og-image-generator'
import { ogImageSize } from './metadata'
import { OgTemplate } from './template'

export const runtime = 'nodejs'

const renderer = fontsourceFonts(
  [
    {
      name: 'Inter',
      package: 'inter',
      variants: [{ style: 'normal' as const, subset: 'latin', weight: 800 }],
    },
    {
      // Turkish letters (Ş, İ, Ğ) live in latin-ext; template falls back to this family
      name: 'Inter Ext',
      package: 'inter',
      variants: [{ style: 'normal' as const, subset: 'latin-ext', weight: 800 }],
    },
    {
      name: 'JetBrains Mono',
      package: 'jetbrains-mono',
      variants: [{ style: 'normal' as const, subset: 'latin', weight: 500 }],
    },
  ],
  { resolveFrom: import.meta.url },
).then((fonts) =>
  createOgRenderer({
    ...ogImageSize,
    fonts,
    format: 'png',
  }),
)

const param = (url: URL, key: string, max: number) => url.searchParams.get(key)?.trim().slice(0, max) || undefined

export async function GET(request: Request) {
  const url = new URL(request.url)
  const title = param(url, 'title', 96) ?? 'Kaan Uzuner'
  const kind = param(url, 'kind', 24)
  const date = param(url, 'date', 24)
  const render = await renderer
  const image = await render(<OgTemplate title={title} kind={kind} date={date} />)

  return new Response(new Uint8Array(image), {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      'Content-Type': 'image/png',
    },
  })
}

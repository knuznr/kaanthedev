import { createOgRenderer, fontsourceFonts } from '@xsynaptic/og-image-generator'
import { ogImageSize } from './metadata'
import { OgTemplate } from './template'

export const runtime = 'nodejs'

const renderer = fontsourceFonts(
  [
    {
      name: 'Syne',
      package: 'syne',
      variants: [
        { style: 'normal', subset: 'latin', weight: 700 },
        { style: 'normal', subset: 'latin', weight: 800 },
      ],
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

export async function GET(request: Request) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title')?.trim().slice(0, 96) || 'Kaan Uzuner — Founder & Developer'
  const render = await renderer
  const image = await render(<OgTemplate title={title} />)

  return new Response(new Uint8Array(image), {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      'Content-Type': 'image/png',
    },
  })
}

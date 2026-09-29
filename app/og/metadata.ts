import type { Metadata } from 'next'

export const ogImageSize = {
  width: 1200,
  height: 630,
}

type OgOptions = {
  /** small label in the card's top-left, e.g. "writing" */
  kind?: string
  /** free text after the label, e.g. a formatted date */
  date?: string
}

// Every page describes itself; /og renders the card from these params.
export function getOgImage(title: string, { kind, date }: OgOptions = {}) {
  const params = new URLSearchParams({ title })
  if (kind) params.set('kind', kind)
  if (date) params.set('date', date)
  return {
    url: `/og?${params.toString()}`,
    width: ogImageSize.width,
    height: ogImageSize.height,
    alt: title,
  }
}

// openGraph replaces the layout's object wholesale, so shared fields are repeated here.
export function ogMeta({
  title,
  description,
  type = 'website',
  ...og
}: { title: string; description: string; type?: 'website' | 'article' } & OgOptions): Pick<Metadata, 'openGraph' | 'twitter'> {
  const image = getOgImage(title, og)
  return {
    openGraph: { title, description, type, siteName: 'kaan uzuner', locale: 'en_US', images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  }
}

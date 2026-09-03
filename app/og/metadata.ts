export const ogImageSize = {
  width: 1200,
  height: 630,
}

export function getOgImage(title: string) {
  return {
    url: `/og?title=${encodeURIComponent(title)}`,
    width: ogImageSize.width,
    height: ogImageSize.height,
    alt: title,
  }
}

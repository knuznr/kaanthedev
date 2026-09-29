// The one place the site's address lives. Forks set NEXT_PUBLIC_SITE_URL instead of editing code.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kaanuzuner.dev').replace(/\/$/, '')
export const siteHost = new URL(siteUrl).host

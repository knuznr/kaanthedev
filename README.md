# kaanuzuner.dev

Personal portfolio and devlog. Swiss style: heavy grotesk type, thick rules, one red full stop.
Built with Next.js (App Router), Tailwind CSS v4, Framer Motion and a few shadcn/ui components.

## Run it

```bash
pnpm install
cp .env.example .env.local   # then fill it in, see below
pnpm dev
```

Open http://localhost:3000. Build with `pnpm build`.

## Make it yours

| What | Where |
| --- | --- |
| Name, role, bio, links, email | `app/lib/data/profile.ts` |
| Projects | `app/lib/data/projects.ts` |
| Blog posts (MDX + frontmatter) | `app/blog/posts/*.mdx` |
| Colors and type scale | `app/global.css` (`--paper`, `--ink`, `--signal`) |
| Site address | `NEXT_PUBLIC_SITE_URL` in `.env.local` |
| Favicon | `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico` |

### Environment variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Access key from [web3forms.com](https://web3forms.com). The contact form posts to Web3Forms straight from the browser. The key is public by design. Without it the form shows an honest "not configured" error. |
| `NEXT_PUBLIC_SITE_URL` | Public address (sitemap, canonical URLs, OG images, business card). Defaults to `https://kaanuzuner.dev`. |

## What's inside

- **Intro and page transitions:** first-visit greeting sequence, a full-screen curtain between sections, view transitions for the rest. All of it respects `prefers-reduced-motion`.
- **Business card:** `Take my business card` on the contact page opens a dialog that draws the card on a canvas and exports PNG or a vCard.
- **OG images:** `/og?title=...&kind=...&date=...` renders a card with Satori. Pages set theirs through `ogMeta()` in `app/og/metadata.ts`.
- **Mobile tab bar:** a floating, translucent bar under 768px.

## Analytics

`@vercel/analytics` and `@vercel/speed-insights` are wired in `app/layout.tsx`. They only report when deployed on Vercel. Remove them if you deploy elsewhere.

## Licenses

Code: [MIT](LICENSE). Written content: [CC BY 4.0](LICENSE-CONTENT.md).

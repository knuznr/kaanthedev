# Maximalist Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the kaanthedev site as a bold Maximalist single-page-scroll portfolio (hero, about, projects, skills, testimonials, blog preview, contact, socials) with a separate MDX blog, light/dark toggle, and Framer Motion interactions.

**Architecture:** Next.js 16 App Router + React 19 + TypeScript. Tailwind v4 with class-based dark mode and semantic design tokens (solid colors only). Framer Motion for scroll/hover motion. Content in typed data files. CSS "poster" compositions instead of images. Existing MDX blog stack (`next-mdx-remote/rsc`, `sugar-high`, KaTeX) reused and restyled.

**Tech Stack:** Next.js 16, React 19, Tailwind v4 (`@tailwindcss/postcss`), TypeScript, `framer-motion`, `next-mdx-remote`, `sugar-high`, `katex`, `next/font` (Syne, Inter, JetBrains Mono).

## Global Constraints

- **Solid colors only.** No gradients, no glassmorphism, no backdrop/blur filters. Shadows are hard offset solid color blocks (never blurred).
- **Palette:** ink `#0A0A0A`, paper `#FAFAFA`, yellow `#F5FF00`, red `#FF3B2F`, blue `#2B2DFF`, green `#00C896` (success only). Light: bg paper / text ink. Dark: bg ink / text paper (paper & ink tokens swap). Accents identical in both themes.
- **Dark mode:** class-based `.dark` on `<html>`, driven by a toggle + `localStorage`, with a no-FOUC inline script. Add `@custom-variant dark (&:where(.dark, .dark *));` to `global.css`.
- **Fonts:** `next/font` self-hosted — Syne (display, 700/800), Inter (body), JetBrains Mono (mono). No external font requests.
- **Motion:** `framer-motion` for scroll/stagger/magnetic; CSS keyframes for marquees. Respect `prefers-reduced-motion` (disable marquees + choreography).
- **No comments in code.** No image files — CSS posters only.
- **Import paths:** use existing `app/...` bare path convention (tsconfig already maps `app/*` and `@/*`).
- **Verification per task:** `pnpm exec tsc --noEmit` clean; `pnpm build` at milestones (Tasks 2, 6, 15, 18) and final. Commit after every task.
- **Package manager:** `pnpm`.
- **Spec:** `docs/superpowers/specs/2026-06-30-maximalist-portfolio-design.md`.

---

## File Structure

**Create:**
- `app/lib/data/profile.ts` — bio, stats, "now", email, socials, nav items.
- `app/lib/data/projects.ts` — `Project[]`.
- `app/lib/data/skills.ts` — categories + marquee words.
- `app/lib/data/testimonials.ts` — `Quote[]`.
- `app/lib/types.ts` — shared types (`Project`, `Quote`, `Skill`, `Social`, `NavItem`).
- `app/lib/motion.ts` — shared Framer Motion variants + viewport config.
- `app/lib/hooks/useActiveSection.ts` — IntersectionObserver active-section tracker.
- `app/lib/hooks/useTheme.ts` — theme state + toggle (class-based).
- `app/components/section-heading.tsx` — `02 / ABOUT` style heading.
- `app/components/marquee.tsx` — CSS marquee row.
- `app/components/magnetic-button.tsx` — magnetic CTA (client).
- `app/components/poster.tsx` — CSS project poster.
- `app/components/theme-toggle.tsx` — light/dark toggle (client).
- `app/components/nav.tsx` — side-rail + overlay menu + wordmark + CTA (client).
- `app/components/hero.tsx` (client)
- `app/components/about.tsx`
- `app/components/projects.tsx` (client)
- `app/components/skills.tsx`
- `app/components/testimonials.tsx`
- `app/components/blog-preview.tsx`
- `app/components/contact.tsx` (client)
- `app/components/socials.tsx`
- `app/components/footer.tsx`
- `app/api/contact/route.ts` — contact form handler (stub).

**Modify:**
- `app/global.css` — full rewrite (tokens, dark variant, fonts, keyframes, base, prose, syntax).
- `app/layout.tsx` — fonts, no-FOUC script, metadata, remove `max-w-xl` constraint.
- `app/page.tsx` — compose homepage sections.
- `app/not-found.tsx` — maximalist 404.
- `app/blog/utils.ts` — add `tags` to metadata, add `getPost(slug)` + `getLatestPosts(n)`.
- `app/blog/page.tsx` — maximalist blog index.
- `app/blog/[slug]/page.tsx` — maximalist article page (reuse `CustomMDX`).
- `app/blog/posts/*.mdx` — add `tags` to frontmatter (3 existing posts retained).
- `app/components/mdx.tsx` — keep `CustomMDX`; restyle `Callout`/`ProsCard`/`ConsCard` to solid palette (no rounded-neutral glass).

**Delete (Task 18):**
- `app/work/` (replaced by Projects section).
- `app/about/` (empty dir).
- `app/components/comments.tsx`, `app/components/posts.tsx` (replaced by `blog-preview.tsx` + new blog index).
- `app/api/auth/`, `app/api/comments/` (comments feature dropped).

---

## Task 1: Foundation — dependency, dark variant, design tokens, keyframes

**Files:**
- Modify: `package.json` (add `framer-motion`)
- Modify: `app/global.css` (full rewrite)

**Interfaces:**
- Produces: Tailwind utilities `bg-paper`, `text-ink`, `bg-yellow`, `bg-red`, `bg-blue`, `bg-green`, `border-ink`, `font-display`, `font-body`, `font-mono`, `animate-marquee`; `dark:` variant keyed to `.dark` class; CSS vars `--paper`, `--ink`, `--font-display`, `--font-body`, `--font-mono`.

- [ ] **Step 1: Add framer-motion**

Run:
```bash
pnpm add framer-motion
```
Expected: `framer-motion` added to `package.json` dependencies and installed.

- [ ] **Step 2: Rewrite `app/global.css`**

Replace the entire file with:

```css
@import 'tailwindcss';

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-paper: var(--paper);
  --color-ink: var(--ink);
  --color-yellow: #F5FF00;
  --color-red: #FF3B2F;
  --color-blue: #2B2DFF;
  --color-green: #00C896;
}

:root {
  --paper: #FAFAFA;
  --ink: #0A0A0A;
  --font-display: var(--font-syne), system-ui, sans-serif;
  --font-body: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, 'SF Mono', Monaco, monospace;
  color-scheme: light;
}

.dark {
  --paper: #0A0A0A;
  --ink: #FAFAFA;
  color-scheme: dark;
}

@utility font-display { font-family: var(--font-display); }
@utility font-body { font-family: var(--font-body); }
@utility font-mono { font-family: var(--font-mono); }
@utility animate-marquee { animation: marquee 32s linear infinite; }

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

html {
  -webkit-text-size-adjust: 100%;
  min-width: 360px;
}

body {
  font-family: var(--font-body);
  background: var(--paper);
  color: var(--ink);
  font-weight: 400;
  letter-spacing: -0.005em;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::selection {
  background: #F5FF00;
  color: #0A0A0A;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 0.9;
  text-wrap: balance;
}

code, pre, .font-mono {
  font-family: var(--font-mono);
  font-weight: 500;
}

input[type='text'],
input[type='email'],
textarea {
  -webkit-appearance: none;
  appearance: none;
  font-family: var(--font-body);
}

table {
  display: block;
  max-width: fit-content;
  overflow-x: auto;
  white-space: nowrap;
  font-family: var(--font-mono);
}

:root {
  --sh-class: #2d5e9d;
  --sh-identifier: #354150;
  --sh-sign: #8996a3;
  --sh-string: #007f7a;
  --sh-keyword: #e02518;
  --sh-comment: #a19595;
  --sh-jsxliterals: #6266d1;
  --sh-property: #e25a1c;
  --sh-entity: #e25a1c;
}

@media (prefers-color-scheme: dark) {
  :root {
    --sh-class: #4c97f8;
    --sh-identifier: white;
    --sh-keyword: #f47067;
    --sh-string: #0fa295;
  }
}

.prose a {
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 0.1em;
}
.prose pre {
  background: var(--paper);
  color: var(--ink);
  border: 2px solid var(--ink);
  border-radius: 0;
  overflow-x: auto;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-family: var(--font-mono);
}
.prose code {
  font-family: var(--font-mono);
}
.prose pre code {
  padding: 0;
  border: 0;
  line-height: 1.5;
}
.prose p {
  margin: 1rem 0;
  line-height: 1.7;
}
.prose h1 { font-size: clamp(2rem, 6vw, 3rem); margin: 1.5rem 0 0.5rem; }
.prose h2 { font-size: 1.5rem; margin: 1.5rem 0 0.5rem; }
.prose h3 { font-size: 1.25rem; margin: 1.25rem 0 0.5rem; }
.prose h4 { font-size: 1.125rem; margin: 1.25rem 0 0.5rem; }
.prose strong { font-weight: 700; }
.prose ul { list-style: disc; padding-left: 1.5rem; }
.prose ol { list-style: decimal; padding-left: 1.5rem; }
.prose img { margin: 0; }
.prose blockquote {
  font-family: var(--font-body);
  border-left: 4px solid var(--ink);
  padding-left: 1rem;
  margin: 1rem 0;
}

.prose .anchor {
  position: absolute;
  margin-left: -1em;
  padding-right: 0.5em;
  width: 80%;
  max-width: 700px;
  cursor: pointer;
  visibility: hidden;
}
.prose .anchor:after {
  content: '#';
  opacity: 0.4;
}
.prose *:hover > .anchor {
  visibility: visible;
}

pre::-webkit-scrollbar { display: none; }
pre { -ms-overflow-style: none; scrollbar-width: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS (no type errors; CSS is not type-checked).

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml app/global.css
git commit -m "feat: add framer-motion and maximalist design tokens"
```

---

## Task 2: Layout shell — fonts, no-FOUC theme script, metadata

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `<html>` carries `--font-syne`, `--font-inter`, `--font-jetbrains` variables and `.dark` class (set by inline script); full-bleed `<body>` (no `max-w-xl`); `Navbar` + `Footer` still wired (rebuilt in later tasks).

- [ ] **Step 1: Rewrite `app/layout.tsx`**

Replace the entire file with:

```tsx
import './global.css'
import type { Metadata } from 'next'
import { Syne, Inter, JetBrains_Mono } from 'next/font/google'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import 'katex/dist/katex.min.css'

const syne = Syne({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-syne', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: 'kaan uzuner — developer', template: '%s — kaan uzuner' },
  description: 'Kaan Uzuner — developer building bold things for the web. Web + AI.',
  openGraph: {
    title: 'kaan uzuner — developer',
    description: 'Developer building bold things for the web. Web + AI.',
    url: baseUrl,
    siteName: 'kaan uzuner',
    locale: 'en_US',
    type: 'website',
  },
  icons: { shortcut: '/favicon.ico' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

const cx = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ')

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark')}}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cx(syne.variable, inter.variable, jetbrains.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-body antialiased">
        <Navbar />
        <main className="flex-auto min-w-0">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Build to verify fonts + layout compile**

Run: `pnpm build`
Expected: build succeeds. (Navbar/Footer are still the old minimal ones; that's fine — replaced in Tasks 6/14. If the old `nav.tsx`/`footer.tsx` reference removed things, fix only if build fails.)

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: self-hosted fonts, no-FOUC theme script, full-bleed layout"
```

---

## Task 3: Typed data layer

**Files:**
- Create: `app/lib/types.ts`
- Create: `app/lib/data/profile.ts`
- Create: `app/lib/data/projects.ts`
- Create: `app/lib/data/skills.ts`
- Create: `app/lib/data/testimonials.ts`

**Interfaces:**
- Produces: `Project`, `Quote`, `SkillCategory`, `Social`, `NavItem` types; `profile`, `projects`, `skills`, `testimonials` data objects (exact shapes below) used by section components in later tasks.

- [ ] **Step 1: Create `app/lib/types.ts`**

```ts
export type Accent = 'yellow' | 'red' | 'blue'

export type Project = {
  id: string
  index: string
  name: string
  description: string
  stack: string[]
  year: string
  role: string
  liveUrl?: string
  repoUrl?: string
  accent: Accent
  featured?: boolean
}

export type Quote = {
  quote: string
  name: string
  role: string
  company: string
  accent: Accent
}

export type SkillCategory = {
  title: string
  accent: Accent
  items: string[]
}

export type Social = {
  label: string
  href: string
  accent: Accent
}

export type NavItem = {
  id: string
  index: string
  label: string
}

export type Stat = {
  value: string
  label: string
}
```

- [ ] **Step 2: Create `app/lib/data/profile.ts`**

```ts
import type { NavItem, Social, Stat } from 'app/lib/types'

export const profile = {
  name: 'Kaan Uzuner',
  role: 'Developer',
  tagline: 'web + ai',
  email: 'me@kaanuzuner.dev',
  location: 'Turkey / Remote',
  status: 'Open to work',
  bio: [
    "I'm a developer who builds bold, fast, opinionated things for the web.",
    'Mostly I work in TypeScript, React, and Next.js, with a growing obsession for AI and LLM tooling.',
    'I care about composition, type, and motion as much as correctness and performance.',
    'Always learning something new. Sometimes it actually sticks.',
  ],
  now: [
    'Building a maximalist portfolio (this site)',
    'Exploring LLM-powered dev tooling',
    'Contributing to open source',
  ],
}

export const stats: Stat[] = [
  { value: '50+', label: 'Projects shipped' },
  { value: '2', label: 'Years building' },
  { value: '∞', label: 'Cups of coffee' },
]

export const navItems: NavItem[] = [
  { id: 'hero', index: '01', label: 'Intro' },
  { id: 'about', index: '02', label: 'About' },
  { id: 'work', index: '03', label: 'Work' },
  { id: 'skills', index: '04', label: 'Skills' },
  { id: 'words', index: '05', label: 'Words' },
  { id: 'writing', index: '06', label: 'Writing' },
  { id: 'contact', index: '07', label: 'Contact' },
]

export const socials: Social[] = [
  { label: 'GitHub', href: 'https://github.com/knnuznr', accent: 'yellow' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/kaan-uzunerr', accent: 'red' },
  { label: 'Email', href: 'mailto:me@kaanuzuner.dev', accent: 'blue' },
]
```

- [ ] **Step 3: Create `app/lib/data/projects.ts`**

```ts
import type { Project } from 'app/lib/types'

export const projects: Project[] = [
  {
    id: 'otoarena',
    index: '01/06',
    name: 'OtoArena',
    description: 'Auction platform modules: commission engines, user management, dynamic validations, and financial-grade backend work in .NET Core + JS.',
    stack: ['.NET Core', 'JavaScript', 'SQL'],
    year: '2025',
    role: 'Software Developer',
    accent: 'yellow',
    featured: true,
  },
  {
    id: 'crede-tech',
    index: '02/06',
    name: 'Crede-Tech',
    description: 'Case-tracking app for lawyers. Feature work, bug fixing, performance tuning across a full-stack legal-domain product.',
    stack: ['Full-stack', '.NET', 'TypeScript'],
    year: '2024',
    role: 'Software Developer',
    accent: 'red',
  },
  {
    id: 'portfolio',
    index: '03/06',
    name: 'This Site',
    description: 'A maximalist portfolio built with Next.js, Tailwind, and Framer Motion. Solid colors, oversized type, CSS posters, zero image bytes.',
    stack: ['Next.js', 'React', 'Tailwind', 'Framer Motion'],
    year: '2026',
    role: 'Designer + Engineer',
    accent: 'blue',
    repoUrl: 'https://github.com/knnuznr/kaanthedev',
  },
  {
    id: 'ai-tools',
    index: '04/06',
    name: 'LLM Dev Tools',
    description: 'Experiments in LLM-powered developer tooling — prompt routing, evals, and agentic workflows in TypeScript.',
    stack: ['TypeScript', 'LLMs', 'Node'],
    year: '2026',
    role: 'Builder',
    accent: 'yellow',
  },
  {
    id: 'open-source',
    index: '05/06',
    name: 'Open Source',
    description: 'Miscellaneous contributions and small libraries. Find them all on GitHub.',
    stack: ['Various'],
    year: 'Ongoing',
    role: 'Contributor',
    accent: 'red',
    repoUrl: 'https://github.com/knnuznr',
  },
  {
    id: 'more',
    index: '06/06',
    name: 'Your Project',
    description: 'The next one. Let\u2019s build something bold together.',
    stack: ['TBD together'],
    year: 'Next',
    role: 'Collaborator',
    accent: 'blue',
  },
]
```

- [ ] **Step 4: Create `app/lib/data/skills.ts`**

```ts
import type { SkillCategory } from 'app/lib/types'

export const marqueeWords: string[] = [
  'TypeScript', 'React', 'Next.js', 'Node', 'Tailwind', 'CSS', 'Python',
  'LLMs', '.NET', 'SQL', 'Git', 'Vite', 'Framer Motion', 'Design', 'Performance',
]

export const skillCategories: SkillCategory[] = [
  { title: 'Languages', accent: 'yellow', items: ['TypeScript', 'JavaScript', 'Python', 'C#', 'SQL'] },
  { title: 'Frameworks', accent: 'red', items: ['Next.js', 'React', 'Node', '.NET Core', 'Tailwind'] },
  { title: 'AI & Tools', accent: 'blue', items: ['LLMs', 'Prompt design', 'Evals', 'Tooling', 'Automation'] },
  { title: 'Craft', accent: 'yellow', items: ['Design', 'Motion', 'Performance', 'A11y', 'DX'] },
]
```

- [ ] **Step 5: Create `app/lib/data/testimonials.ts`**

```ts
import type { Quote } from 'app/lib/types'

export const testimonials: Quote[] = [
  {
    quote: 'Kaan ships fast and cares about the details nobody else notices. The kind of engineer you want on a hard problem.',
    name: 'Team Lead',
    role: 'Engineering',
    company: 'OtoArena',
    accent: 'yellow',
  },
  {
    quote: 'Reliable, curious, and genuinely invested. He turned vague requirements into a polished product.',
    name: 'Product Manager',
    role: 'Product',
    company: 'Crede-Tech',
    accent: 'red',
  },
  {
    quote: 'A strong sense of design backed by real engineering chops. Rare combination.',
    name: 'Collaborator',
    role: 'Open Source',
    company: 'GitHub',
    accent: 'blue',
  },
]
```

- [ ] **Step 6: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 7: Sanity-check shapes with node**

Run:
```bash
node -e "const p=require('./app/lib/data/projects.ts'); console.log('ok')" 2>/dev/null || pnpm exec tsc --noEmit && echo "shapes OK via tsc"
```
Expected: `shapes OK via tsc` (TS files aren't directly require-able; tsc is the verifier).

- [ ] **Step 8: Commit**

```bash
git add app/lib
git commit -m "feat: typed maximalist content data layer"
```

---

## Task 4: Motion variants + hooks

**Files:**
- Create: `app/lib/motion.ts`
- Create: `app/lib/hooks/useActiveSection.ts`
- Create: `app/lib/hooks/useTheme.ts`

**Interfaces:**
- Produces: `fadeUp`, `stagger`, `wipeIn` Framer Motion `Variants`; `viewportOnce` viewport config; `useActiveSection(ids: string[]): string`; `useTheme(): { theme: 'light'|'dark', toggle: () => void }`.
- Consumes: nav items `id` strings from `profile.navItems` (Task 3).

- [ ] **Step 1: Create `app/lib/motion.ts`**

```ts
import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

export const wipeIn: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const viewportOnce = { once: true, amount: 0.25 } as const
```

- [ ] **Step 2: Create `app/lib/hooks/useActiveSection.ts`**

```ts
'use client'
import { useEffect, useState } from 'react'

export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const key = ids.join(',')
    const observers: IntersectionObserver[] = []
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(id)
          })
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [key])

  return active
}
```

- [ ] **Step 3: Create `app/lib/hooks/useTheme.ts`**

```ts
'use client'
import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      const root = document.documentElement
      root.classList.toggle('dark', next === 'dark')
      try {
        localStorage.setItem('theme', next)
      } catch {}
      return next
    })
  }, [])

  return { theme, toggle }
}
```

- [ ] **Step 4: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/lib/motion.ts app/lib/hooks
git commit -m "feat: shared motion variants and theme/section hooks"
```

---

## Task 5: Shared primitives — section heading, marquee, magnetic button, poster

**Files:**
- Create: `app/components/section-heading.tsx`
- Create: `app/components/marquee.tsx`
- Create: `app/components/magnetic-button.tsx`
- Create: `app/components/poster.tsx`

**Interfaces:**
- Consumes: `fadeUp`, `stagger`, `viewportOnce` from `app/lib/motion`; `Project`, `Accent` from `app/lib/types`.
- Produces: `<SectionHeading index title id />`, `<Marquee items reverse className />`, `<MagneticButton href? onClick? className>children</MagneticButton>`, `<Poster project />`.

- [ ] **Step 1: Create `app/components/section-heading.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewportOnce } from 'app/lib/motion'

export function SectionHeading({
  index,
  title,
  id,
}: {
  index: string
  title: string
  id?: string
}) {
  return (
    <motion.div
      id={id}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="flex items-end justify-between gap-6 border-b-2 border-ink pb-4 mb-10 scroll-mt-24"
    >
      <motion.h2
        variants={fadeUp}
        className="font-display font-extrabold uppercase leading-[0.9] tracking-tight text-[clamp(2.5rem,8vw,6rem)]"
      >
        <span className="opacity-40 mr-3">{index}</span>
        {title}
      </motion.h2>
      <motion.span
        variants={fadeUp}
        className="hidden sm:block font-mono text-xs uppercase tracking-widest opacity-60"
      >
        // section
      </motion.span>
    </motion.div>
  )
}
```

- [ ] **Step 2: Create `app/components/marquee.tsx`**

```tsx
export function Marquee({
  items,
  reverse = false,
  className = '',
}: {
  items: string[]
  reverse?: boolean
  className?: string
}) {
  const row = (key: string) => (
    <div
      key={key}
      className={`flex shrink-0 items-center gap-6 pr-6 animate-marquee ${
        reverse ? '[animation-direction:reverse]' : ''
      } group-hover:[animation-play-state:paused]`}
    >
      {items.map((it, i) => (
        <span
          key={`${key}-${i}`}
          className="font-display font-extrabold uppercase text-[clamp(1.5rem,4vw,3rem)] leading-none whitespace-nowrap"
        >
          {it}
          <span className="inline-block mx-6 h-3 w-3 bg-red align-middle" />
        </span>
      ))}
    </div>
  )
  return (
    <div className={`group flex overflow-hidden ${className}`} aria-hidden="true">
      {row('a')}
      {row('b')}
    </div>
  )
}
```

- [ ] **Step 3: Create `app/components/magnetic-button.tsx`**

```tsx
'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type Props = {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  ariaLabel?: string
}

export function MagneticButton({ children, href, onClick, className = '', ariaLabel }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18 })
  const sy = useSpring(y, { stiffness: 250, damping: 18 })

  function handleMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35)
  }
  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  const cls = `inline-flex items-center justify-center font-mono uppercase tracking-widest text-sm border-2 border-ink bg-ink text-paper px-6 py-3 transition-colors hover:bg-yellow hover:text-ink ${className}`

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ x: sx, y: sy }}
        className={cls}
      >
        {children}
      </motion.a>
    )
  }
  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={cls}
    >
      {children}
    </motion.button>
  )
}
```

- [ ] **Step 4: Create `app/components/poster.tsx`**

```tsx
import type { Project, Accent } from 'app/lib/types'

const accentBg: Record<Accent, string> = {
  yellow: 'bg-yellow',
  red: 'bg-red',
  blue: 'bg-blue',
}

export function Poster({ project }: { project: Project }) {
  return (
    <div className="relative aspect-[4/5] w-full border-2 border-ink overflow-hidden bg-paper">
      <div
        className={`absolute inset-0 ${accentBg[project.accent]}`}
        style={{ clipPath: 'polygon(0 0, 68% 0, 38% 100%, 0 100%)' }}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex justify-between font-mono text-[0.7rem] uppercase tracking-widest">
          <span>{project.index}</span>
          <span>{project.year}</span>
        </div>
        <div className="max-w-[85%]">
          <h3 className="font-display font-extrabold uppercase leading-[0.85] text-[clamp(1.5rem,5vw,3rem)]">
            {project.name}
          </h3>
          <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-widest opacity-80">
            {project.role}
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/components/section-heading.tsx app/components/marquee.tsx app/components/magnetic-button.tsx app/components/poster.tsx
git commit -m "feat: shared maximalist primitives (heading, marquee, magnetic, poster)"
```

---

## Task 6: Theme toggle + Navigation

**Files:**
- Create: `app/components/theme-toggle.tsx`
- Modify (replace): `app/components/nav.tsx`

**Interfaces:**
- Consumes: `useTheme` from `app/lib/hooks/useTheme`; `useActiveSection` from `app/lib/hooks/useActiveSection`; `navItems` from `app/lib/data/profile`; `MagneticButton` from `app/components/magnetic-button`.
- Produces: `<ThemeToggle />`, `<Navbar />` (side-rail on desktop, full-screen overlay menu on mobile, wordmark top-left, theme toggle + CTA top-right).

- [ ] **Step 1: Create `app/components/theme-toggle.tsx`**

```tsx
'use client'
import { useTheme } from 'app/lib/hooks/useTheme'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`flex h-10 w-10 items-center justify-center border-2 border-ink bg-paper text-ink hover:bg-yellow transition-colors ${className}`}
    >
      <span className="font-mono text-xs font-bold">{isDark ? 'LT' : 'DK'}</span>
    </button>
  )
}
```

- [ ] **Step 2: Replace `app/components/nav.tsx`**

```tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { navItems } from 'app/lib/data/profile'
import { useActiveSection } from 'app/lib/hooks/useActiveSection'
import { ThemeToggle } from './theme-toggle'
import { MagneticButton } from './magnetic-button'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const ids = navItems.map((n) => n.id)
  const active = useActiveSection(ids)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-3 md:px-6 bg-paper/0">
        <Link href="/" className="font-mono text-sm font-bold uppercase tracking-widest border-2 border-ink bg-paper px-3 py-1">
          KAAN&#8599;
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MagneticButton
            href="#contact"
            className="hidden sm:inline-flex !py-2 !px-4 !text-xs"
            ariaLabel="Go to contact section"
          >
            LET&#201;S TALK
          </MagneticButton>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="lg:hidden border-2 border-ink bg-ink px-3 py-2 font-mono text-xs uppercase tracking-widest text-paper"
          >
            MENU
          </button>
        </div>
      </header>

      <nav aria-label="Sections" className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <ul className="flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group flex items-center gap-2 font-mono text-xs uppercase tracking-widest ${
                    isActive ? 'text-ink' : 'text-ink/50 hover:text-ink'
                  }`}
                >
                  <span className={`h-px transition-all ${isActive ? 'w-10 bg-ink' : 'w-5 bg-ink/40 group-hover:w-8'}`} />
                  {item.index}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex flex-col bg-yellow"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-mono text-sm font-bold uppercase tracking-widest">MENU</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="border-2 border-ink bg-ink px-3 py-2 font-mono text-xs uppercase tracking-widest text-paper"
              >
                CLOSE
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-2 px-6">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="block font-display text-[clamp(2.5rem,12vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-tight"
                  >
                    <span className="opacity-40 mr-3 font-mono text-base align-middle">{item.index}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 3: Build to verify nav compiles and renders**

Run: `pnpm build`
Expected: build succeeds. Smoke: `pnpm dev` → homepage shows the fixed header, side-rail on desktop, MENU on mobile, theme toggle flips `.dark` and persists on reload.

- [ ] **Step 4: Commit**

```bash
git add app/components/theme-toggle.tsx app/components/nav.tsx
git commit -m "feat: maximalist navigation (side-rail, overlay menu, theme toggle)"
```

---

## Task 7: Hero section

**Files:**
- Create: `app/components/hero.tsx`

**Interfaces:**
- Consumes: `profile` from `app/lib/data/profile`; `MagneticButton`; `fadeUp`, `stagger`, `wipeIn`, `viewportOnce` from `app/lib/motion`.
- Produces: `<Hero />` rendered as the `01` hero block (id `hero`).

- [ ] **Step 1: Create `app/components/hero.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import { profile } from 'app/lib/data/profile'
import { MagneticButton } from './magnetic-button'
import { fadeUp, stagger, wipeIn, viewportOnce } from 'app/lib/motion'

export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col justify-center px-4 pt-24 pb-16 md:px-6">
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative">
        <motion.p variants={fadeUp} className="font-mono text-xs uppercase tracking-widest opacity-70 mb-6">
          {profile.status} &#183; {profile.location}
        </motion.p>

        <motion.h1 variants={fadeUp} className="font-display font-extrabold uppercase leading-[0.82] tracking-tight text-[clamp(3rem,14vw,11rem)]">
          <span className="block">KAAN</span>
          <span className="block">
            <span className="relative inline-block">
              <span className="absolute -inset-2 -z-10 bg-yellow" />
              UZUNER
            </span>
          </span>
        </motion.h1>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <motion.div variants={fadeUp} className="max-w-xl text-lg leading-relaxed">
            <span className="font-mono text-sm uppercase tracking-widest">// </span>
            {profile.role} building bold things for the web.{' '}
            <span className="inline-block rotate-[-3deg] border-2 border-ink bg-red px-2 font-mono text-sm uppercase tracking-widest text-paper">
              {profile.tagline}
            </span>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <MagneticButton href="#work">VIEW WORK &#8594;</MagneticButton>
            <MagneticButton href="/blog" className="!bg-paper !text-ink hover:!bg-blue hover:!text-paper">
              READ BLOG &#8594;
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        variants={wipeIn}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-12 border-y-2 border-ink bg-ink py-2 text-paper"
      >
        <div className="flex overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="font-mono text-xs uppercase tracking-widest whitespace-nowrap px-4">
              BUILDING BOLD THINGS FOR THE WEB <span className="text-yellow mx-2">&#9632;</span>
            </span>
          ))}
        </div>
      </motion.div>

      <div className="mt-10 flex justify-center">
        <span className="font-mono text-[0.7rem] uppercase tracking-widest opacity-60">scroll &#8595;</span>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/components/hero.tsx
git commit -m "feat: maximalist hero section"
```

---

## Task 8: About section

**Files:**
- Create: `app/components/about.tsx`

**Interfaces:**
- Consumes: `profile`, `stats` from `app/lib/data/profile`; `SectionHeading`; `fadeUp`, `stagger`, `viewportOnce`.
- Produces: `<About />` (id `about`).

- [ ] **Step 1: Create `app/components/about.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import { profile, stats } from 'app/lib/data/profile'
import { SectionHeading } from './section-heading'
import { fadeUp, stagger, viewportOnce } from 'app/lib/motion'

export function About() {
  return (
    <section id="about" className="px-4 py-24 md:px-6">
      <SectionHeading index="02" title="About" id="about-heading" />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid grid-cols-1 gap-8 lg:grid-cols-12"
      >
        <motion.div variants={fadeUp} className="lg:col-span-7">
          <div className="space-y-5 text-lg leading-relaxed">
            {profile.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="border-2 border-ink p-4">
                <div className="font-display text-[clamp(1.5rem,5vw,3rem)] font-extrabold leading-none">{s.value}</div>
                <div className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest opacity-70">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-5">
          <div className="relative">
            <div className="absolute -right-3 -top-3 h-full w-full border-2 border-ink bg-blue" />
            <div className="relative border-2 border-ink bg-paper p-6">
              <div className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">// id card</div>
              <dl className="space-y-3 font-mono text-sm">
                <Row k="role" v={profile.role} />
                <Row k="focus" v={profile.tagline} />
                <Row k="location" v={profile.location} />
                <Row k="status" v={profile.status} />
              </dl>
              <div className="mt-6 border-t-2 border-ink pt-4">
                <div className="font-mono text-xs uppercase tracking-widest opacity-60 mb-3">now</div>
                <ul className="space-y-2 font-mono text-sm">
                  {profile.now.map((n, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-red">&#9646;</span>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ink/20 pb-2">
      <dt className="uppercase tracking-widest text-[0.7rem] opacity-60">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/components/about.tsx
git commit -m "feat: maximalist about section"
```

---

## Task 9: Projects section

**Files:**
- Create: `app/components/projects.tsx`

**Interfaces:**
- Consumes: `projects` from `app/lib/data/projects`; `Poster`; `SectionHeading`; `fadeUp`, `stagger`, `viewportOnce`.
- Produces: `<Projects />` (id `work`).

- [ ] **Step 1: Create `app/components/projects.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { projects } from 'app/lib/data/projects'
import { Poster } from './poster'
import { SectionHeading } from './section-heading'
import { fadeUp, stagger, viewportOnce } from 'app/lib/motion'

export function Projects() {
  return (
    <section id="work" className="px-4 py-24 md:px-6">
      <SectionHeading index="03" title="Selected Work" id="work-heading" />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => {
          const href = project.liveUrl ?? project.repoUrl ?? '#contact'
          const external = href.startsWith('http')
          return (
            <motion.div
              key={project.id}
              variants={fadeUp}
              className={project.featured ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''}
            >
              <Link
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="group block"
              >
                <div className="relative">
                  <div className="absolute -bottom-3 -right-3 hidden h-full w-full border-2 border-ink bg-paper group-hover:bg-yellow transition-colors sm:block" />
                  <div className="relative transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
                    <Poster project={project} />
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <p className="max-w-md text-sm leading-relaxed">{project.description}</p>
                  <span className="font-mono text-xs uppercase tracking-widest opacity-70">
                    {project.stack.slice(0, 3).join(' / ')}
                  </span>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/components/projects.tsx
git commit -m "feat: maximalist projects showcase"
```

---

## Task 10: Skills section

**Files:**
- Create: `app/components/skills.tsx`

**Interfaces:**
- Consumes: `marqueeWords`, `skillCategories` from `app/lib/data/skills`; `SectionHeading`; `Accent` from `app/lib/types`.
- Produces: `<Skills />` (id `skills`).

- [ ] **Step 1: Create `app/components/skills.tsx`**

```tsx
import { skillCategories, marqueeWords } from 'app/lib/data/skills'
import type { Accent } from 'app/lib/types'
import { SectionHeading } from './section-heading'
import { Marquee } from './marquee'

const accentBg: Record<Accent, string> = {
  yellow: 'bg-yellow',
  red: 'bg-red',
  blue: 'bg-blue',
}

export function Skills() {
  return (
    <section id="skills" className="py-24">
      <div className="px-4 md:px-6">
        <SectionHeading index="04" title="Toolbox" id="skills-heading" />
      </div>

      <div className="flex flex-col gap-2 border-y-2 border-ink py-2">
        <Marquee items={marqueeWords} />
        <Marquee items={marqueeWords} reverse />
      </div>

      <div className="px-4 md:px-6 mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillCategories.map((cat) => (
          <div key={cat.title} className="border-2 border-ink bg-paper">
            <div className={`${accentBg[cat.accent]} border-b-2 border-ink px-4 py-2 font-mono text-xs uppercase tracking-widest`}>
              {cat.title}
            </div>
            <ul className="p-4 space-y-2 font-mono text-sm">
              {cat.items.map((item) => (
                <li key={item} className="flex items-center gap-2 hover:text-red transition-colors">
                  <span className="h-2 w-2 bg-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/components/skills.tsx
git commit -m "feat: maximalist skills section with marquees"
```

---

## Task 11: Testimonials section

**Files:**
- Create: `app/components/testimonials.tsx`

**Interfaces:**
- Consumes: `testimonials` from `app/lib/data/testimonials`; `SectionHeading`; `Accent`; `fadeUp`, `viewportOnce`.
- Produces: `<Testimonials />` (id `words`).

- [ ] **Step 1: Create `app/components/testimonials.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import { testimonials } from 'app/lib/data/testimonials'
import type { Accent } from 'app/lib/types'
import { SectionHeading } from './section-heading'
import { fadeUp, viewportOnce } from 'app/lib/motion'

const accentText: Record<Accent, string> = {
  yellow: 'text-yellow',
  red: 'text-red',
  blue: 'text-blue',
}

export function Testimonials() {
  return (
    <section id="words" className="px-4 py-24 md:px-6">
      <SectionHeading index="05" title="Kind Words" id="words-heading" />
      <div className="flex flex-col gap-6">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className={`relative border-2 border-ink bg-paper p-6 md:p-8 md:max-w-[88%] ${
              i % 2 === 1 ? 'md:self-end' : 'md:self-start'
            }`}
          >
            <div className={`${accentText[t.accent]} font-display font-extrabold text-6xl leading-none -mb-4 select-none`} aria-hidden="true">
              &#8220;
            </div>
            <blockquote className="text-xl leading-relaxed md:text-2xl">{t.quote}</blockquote>
            <figcaption className="mt-6 border-t-2 border-ink pt-4 font-mono text-xs uppercase tracking-widest">
              {t.name} &#183; {t.role} &#183; <span className="bg-ink text-paper px-2 py-0.5">{t.company}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/components/testimonials.tsx
git commit -m "feat: maximalist testimonials section"
```

---

## Task 12: Blog utils (extend) + blog preview section + retain existing posts

**Files:**
- Modify: `app/blog/utils.ts`
- Modify: `app/blog/posts/building-a-project.mdx`, `app/blog/posts/sorting-algorithms.mdx`, `app/blog/posts/time-complexity.mdx` (add `tags` to frontmatter only)
- Create: `app/components/blog-preview.tsx`

**Interfaces:**
- Consumes: `getBlogPosts`/`getLatestPosts` from `app/blog/utils`; `SectionHeading`.
- Produces: `BlogPost` metadata now includes `tags: string[]`; `getLatestPosts(n)`; `<BlogPreview />` (id `writing`).
- Note: existing 3 MDX posts are retained (user content) and only get a `tags` field added.

- [ ] **Step 1: Extend `app/blog/utils.ts`**

Add `tags` to the `Metadata` type and parse it; add `getLatestPosts(n)` and `getPost(slug)`. Replace the `Metadata` type and `parseFrontmatter`, and add the new exports at the end.

Change the `Metadata` type block to:

```ts
type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  tags?: string[]
}
```

In `parseFrontmatter`, after `metadata[key.trim() as keyof Metadata] = value`, support comma-separated tags by replacing the assignment line with:

```ts
      const keyName = key.trim() as keyof Metadata
      if (keyName === 'tags') {
        metadata[keyName] = value.split(',').map((t) => t.trim()).filter(Boolean)
      } else {
        metadata[keyName] = value
      }
```

At the end of the file, append:

```ts
export function getLatestPosts(count: number) {
  return getBlogPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) return -1
    return 1
  }).slice(0, count)
}

export function getPost(slug: string) {
  return getBlogPosts().find((p) => p.slug === slug)
}
```

- [ ] **Step 2: Add `tags` to each existing post's frontmatter**

For each of the three files in `app/blog/posts/`, add a `tags:` line to the frontmatter (keep all existing content intact). Example for `time-complexity.mdx` frontmatter:

```mdx
---
title: "Explanation of 'Time Complexity'"
publishedAt: "2024-01-01"
summary: "A primer on time complexity and big-O notation."
tags: ["algorithms", "fundamentals"]
---
```

Use these tag sets:
- `building-a-project.mdx` → `tags: ["build", "personal"]`
- `sorting-algorithms.mdx` → `tags: ["algorithms", "fundamentals"]`
- `time-complexity.mdx` → `tags: ["algorithms", "fundamentals"]`

(Read each file first; only add the `tags:` line, do not change body content or other frontmatter fields.)

- [ ] **Step 3: Create `app/components/blog-preview.tsx`**

```tsx
import Link from 'next/link'
import { getLatestPosts, formatDate } from 'app/blog/utils'
import { SectionHeading } from './section-heading'
import { MagneticButton } from './magnetic-button'

const bar = ['bg-yellow', 'bg-red', 'bg-blue']

export function BlogPreview() {
  const posts = getLatestPosts(3)
  return (
    <section id="writing" className="px-4 py-24 md:px-6">
      <SectionHeading index="06" title="Writing" id="writing-heading" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block border-2 border-ink bg-paper hover:-translate-y-1 transition-transform"
          >
            <div className={`${bar[i % bar.length]} border-b-2 border-ink h-3`} />
            <div className="p-5">
              <p className="font-mono text-[0.7rem] uppercase tracking-widest opacity-70">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <h3 className="mt-3 font-display text-2xl font-extrabold leading-tight">{post.metadata.title}</h3>
              {post.metadata.summary && (
                <p className="mt-3 text-sm leading-relaxed opacity-80">{post.metadata.summary}</p>
              )}
              {post.metadata.tags && post.metadata.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.metadata.tags.map((t) => (
                    <span key={t} className="border border-ink px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <MagneticButton href="/blog" className="!bg-paper !text-ink hover:!bg-blue hover:!text-paper">
          ALL POSTS &#8594;
        </MagneticButton>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/blog/utils.ts app/blog/posts app/components/blog-preview.tsx
git commit -m "feat: extend blog utils (tags, latest) and maximalist blog preview"
```

---

## Task 13: Contact section + /api/contact route

**Files:**
- Create: `app/components/contact.tsx`
- Create: `app/api/contact/route.ts`

**Interfaces:**
- Consumes: `profile.email` from `app/lib/data/profile`; `SectionHeading`.
- Produces: `<Contact />` (id `contact`) with a client-validated form posting to `/api/contact`; `POST /api/contact` returns `{ ok: true }` (200) or `{ ok: false, error }` (400).

- [ ] **Step 1: Create `app/api/contact/route.ts`**

```ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const name = typeof data?.name === 'string' ? data.name.trim() : ''
    const email = typeof data?.email === 'string' ? data.email.trim() : ''
    const message = typeof data?.message === 'string' ? data.message.trim() : ''

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'All fields are required.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email.' }, { status: 400 })
    }
    if (message.length < 10) {
      return NextResponse.json({ ok: false, error: 'Message is too short.' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 400 })
  }
}
```

- [ ] **Step 2: Create `app/components/contact.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { profile } from 'app/lib/data/profile'
import { SectionHeading } from './section-heading'

type Status = 'idle' | 'pending' | 'success' | 'error'

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    }
    setStatus('pending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
        setError(json.error ?? 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setError('Network error. Try the email link below.')
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <section id="contact" className="px-4 py-24 md:px-6">
      <SectionHeading index="07" title="Contact" id="contact-heading" />
      <h3 className="font-display font-extrabold uppercase leading-[0.85] tracking-tight text-[clamp(2.5rem,10vw,7rem)] mb-10">
        LET&#201;S BUILD<br />SOMETHING
      </h3>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmit} noValidate className="border-2 border-ink bg-blue p-6 space-y-6">
          <Field label="Name" name="name" type="text" error={error} />
          <Field label="Email" name="email" type="email" error={error} />
          <div>
            <label htmlFor="message" className="block font-mono text-xs uppercase tracking-widest mb-2 text-paper">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              rows={5}
              className="w-full resize-none border-2 border-ink bg-paper px-3 py-2 font-body text-ink outline-none focus:bg-yellow transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'pending'}
            className="w-full border-2 border-ink bg-ink px-6 py-3 font-mono text-sm uppercase tracking-widest text-paper hover:bg-paper hover:text-ink transition-colors disabled:opacity-60"
          >
            {status === 'pending' ? 'SENDING\u2026' : 'SEND MESSAGE \u2192'}
          </button>
          {status === 'success' && (
            <div className="border-2 border-ink bg-green p-4 font-mono text-sm uppercase tracking-widest text-ink">
              &#10003; MESSAGE SENT
            </div>
          )}
          {status === 'error' && (
            <div className="border-2 border-ink bg-red p-4 font-mono text-sm uppercase tracking-widest text-paper">
              {error || 'ERROR'}
            </div>
          )}
        </form>

        <div className="flex flex-col justify-between border-2 border-ink bg-paper p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">// or reach me directly</p>
            <button
              type="button"
              onClick={copyEmail}
              className="group block break-all text-left font-display text-[clamp(1.5rem,5vw,3rem)] font-extrabold leading-none hover:text-red transition-colors"
            >
              {profile.email}
            </button>
            <p className="mt-3 font-mono text-xs uppercase tracking-widest opacity-70">
              {copied ? 'COPIED &#10003;' : 'click to copy'}
            </p>
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex w-fit border-2 border-ink bg-ink px-5 py-3 font-mono text-sm uppercase tracking-widest text-paper hover:bg-yellow hover:text-ink transition-colors"
          >
            OPEN MAIL CLIENT &#8594;
          </a>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  name,
  type,
  error,
}: {
  label: string
  name: string
  type: 'text' | 'email'
  error?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-xs uppercase tracking-widest mb-2 text-paper">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="w-full border-2 border-ink bg-paper px-3 py-2 font-body text-ink outline-none focus:bg-yellow transition-colors"
        aria-describedby={error ? `${name}-error` : undefined}
      />
    </div>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/components/contact.tsx app/api/contact/route.ts
git commit -m "feat: maximalist contact section with validated form + api route"
```

---

## Task 14: Socials + Footer

**Files:**
- Create: `app/components/socials.tsx`
- Modify (replace): `app/components/footer.tsx`

**Interfaces:**
- Consumes: `socials` from `app/lib/data/profile`; `Accent`.
- Produces: `<Socials />`; `<Footer />` (replaces old minimal footer).

- [ ] **Step 1: Create `app/components/socials.tsx`**

```tsx
import { socials } from 'app/lib/data/profile'
import type { Accent } from 'app/lib/types'

const accentHover: Record<Accent, string> = {
  yellow: 'hover:bg-yellow',
  red: 'hover:bg-red hover:text-paper',
  blue: 'hover:bg-blue hover:text-paper',
}

export function Socials({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      {socials.map((s) => (
        <li key={s.label} className="flex-1">
          <a
            href={s.href}
            target={s.href.startsWith('http') ? '_blank' : undefined}
            rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`flex items-center justify-between border-2 border-ink px-5 py-4 font-display text-xl font-extrabold uppercase transition-colors ${accentHover[s.accent]}`}
          >
            {s.label}
            <span aria-hidden="true">&#8599;</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 2: Replace `app/components/footer.tsx`**

```tsx
import { Socials } from './socials'

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink px-4 py-12 md:px-6">
      <div className="mb-10">
        <Socials />
      </div>
      <div className="flex flex-col items-start justify-between gap-4 font-mono text-xs uppercase tracking-widest sm:flex-row sm:items-center">
        <p>&#169; {new Date().getFullYear()} KAAN UZUNER</p>
        <p className="opacity-70">BUILT WITH NEXT.JS</p>
        <a href="#hero" className="border-2 border-ink bg-paper px-4 py-2 hover:bg-yellow transition-colors">
          BACK TO TOP &#8593;
        </a>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/components/socials.tsx app/components/footer.tsx
git commit -m "feat: maximalist socials + footer"
```

---

## Task 15: Assemble homepage

**Files:**
- Modify (replace): `app/page.tsx`

**Interfaces:**
- Consumes: `Hero`, `About`, `Projects`, `Skills`, `Testimonials`, `BlogPreview`, `Contact` from `app/components/*`.
- Produces: the `/` route composing all sections in order.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import { Hero } from 'app/components/hero'
import { About } from 'app/components/about'
import { Projects } from 'app/components/projects'
import { Skills } from 'app/components/skills'
import { Testimonials } from 'app/components/testimonials'
import { BlogPreview } from 'app/components/blog-preview'
import { Contact } from 'app/components/contact'

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Testimonials />
      <BlogPreview />
      <Contact />
    </>
  )
}
```

- [ ] **Step 2: Build the whole homepage**

Run: `pnpm build`
Expected: build succeeds. Smoke (`pnpm dev`): all 7 sections render in order, side-rail highlights the active section, theme toggle works, marquees animate, hover lifts on projects, contact form shows success on valid submit and error on invalid.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble maximalist homepage"
```

---

## Task 16: Blog index + article page (reuse CustomMDX)

**Files:**
- Modify (replace): `app/blog/page.tsx`
- Modify (replace): `app/blog/[slug]/page.tsx`
- Modify: `app/components/mdx.tsx` (restyle `Callout`, `ProsCard`, `ConsCard` to solid palette — no rounded neutral glass)

**Interfaces:**
- Consumes: `getBlogPosts`, `getPost`, `formatDate` from `app/blog/utils`; `CustomMDX` from `app/components/mdx`.
- Produces: maximalist `/blog` index and `/blog/[slug]` article pages.

- [ ] **Step 1: Read the existing `app/blog/[slug]/page.tsx` to preserve its generateStaticParams + metadata logic**

Run: `cat app/blog/[slug]/page.tsx` (read it before replacing).

- [ ] **Step 2: Replace `app/blog/page.tsx`**

```tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import { getBlogPosts, formatDate } from 'app/blog/utils'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on web development, AI, and building things.',
}

export default function BlogPage() {
  const posts = getBlogPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) return -1
    return 1
  })

  return (
    <section className="px-4 pt-32 pb-24 md:px-6">
      <div className="border-b-2 border-ink pb-4 mb-10">
        <h1 className="font-display font-extrabold uppercase leading-[0.85] tracking-tight text-[clamp(2.5rem,10vw,8rem)]">
          WRITING
        </h1>
      </div>
      <ul className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-1 gap-3 border-2 border-ink bg-paper p-5 hover:bg-yellow transition-colors sm:grid-cols-[auto_1fr_auto] sm:items-center"
            >
              <span className="font-mono text-xs uppercase tracking-widest opacity-70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-extrabold leading-tight">{post.metadata.title}</h2>
                {post.metadata.summary && (
                  <p className="mt-2 text-sm leading-relaxed opacity-80">{post.metadata.summary}</p>
                )}
                {post.metadata.tags && post.metadata.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.metadata.tags.map((t) => (
                      <span key={t} className="border border-ink px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="font-mono text-xs uppercase tracking-widest opacity-70">
                {formatDate(post.metadata.publishedAt, false)} <span className="ml-2">&#8594;</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 3: Replace `app/blog/[slug]/page.tsx`**

(Preserve `generateStaticParams` + `generateMetadata` from the existing file; restyle the layout. If the existing file uses `CustomMDX`, keep that wiring.)

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getBlogPosts, getPost, formatDate } from 'app/blog/utils'
import { CustomMDX } from 'app/components/mdx'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'A post on web development, AI, and building things.',
}

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return Promise.resolve({})
  return Promise.resolve({
    title: post.metadata.title,
    description: post.metadata.summary,
  })
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  return (
    <article className="px-4 pt-32 pb-24 md:px-6">
      <Link href="/blog" className="font-mono text-xs uppercase tracking-widest opacity-70 hover:opacity-100">
        &#8592; BACK TO WRITING
      </Link>
      <header className="mt-8 border-b-2 border-ink pb-6 mb-10">
        <p className="font-mono text-xs uppercase tracking-widest opacity-70">
          {formatDate(post.metadata.publishedAt, false)}
        </p>
        <h1 className="mt-4 font-display font-extrabold uppercase leading-[0.85] tracking-tight text-[clamp(2.5rem,9vw,6rem)]">
          {post.metadata.title}
        </h1>
        {post.metadata.tags && post.metadata.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.metadata.tags.map((t) => (
              <span key={t} className="border-2 border-ink bg-yellow px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest">
                {t}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="prose max-w-none">
        <CustomMDX source={post.content} />
      </div>
    </article>
  )
}
```

Note: `generateMetadata({ params })` and `PostPage({ params })` signatures must match whatever the existing file uses (Next 16 may pass `params` as a Promise in canary). Read the existing file in Step 1 and mirror its exact `params` handling; if `params` is a Promise, `await` it before `getPost`.

- [ ] **Step 4: Restyle MDX components in `app/components/mdx.tsx`**

Replace the `Callout`, `ProsCard`, and `ConsCard` function bodies with solid-palette versions (no `rounded` neutral glass). New bodies:

```tsx
function Callout(props) {
  return (
    <div className="px-4 py-3 border-2 border-ink bg-yellow text-ink text-sm flex items-center mb-8">
      <div className="flex items-center w-4 mr-4">{props.emoji}</div>
      <div className="w-full callout">{props.children}</div>
    </div>
  )
}

function ProsCard({ title, pros }) {
  return (
    <div className="border-2 border-ink bg-paper p-6 my-4 w-full">
      <span>{`You might use ${title} if...`}</span>
      <div className="mt-4">
        {pros.map((pro) => (
          <div key={pro} className="flex font-medium items-baseline mb-2">
            <span className="h-3 w-3 mr-2 bg-green inline-block" />
            <span>{pro}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConsCard({ title, cons }) {
  return (
    <div className="border-2 border-ink bg-paper p-6 my-6 w-full">
      <span>{`You might not use ${title} if...`}</span>
      <div className="mt-4">
        {cons.map((con) => (
          <div key={con} className="flex font-medium items-baseline mb-2">
            <span className="h-3 w-3 mr-2 bg-red inline-block" />
            <span>{con}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

(Leave `CustomMDX`, `Latex`, `Code`, `CustomLink`, `RoundedImage`, `Table`, `createHeading`, and the `components` map otherwise unchanged.)

- [ ] **Step 5: Build**

Run: `pnpm build`
Expected: build succeeds; `/blog` and one `/blog/[slug]` page render maximalist-styled.

- [ ] **Step 6: Commit**

```bash
git add app/blog/page.tsx app/blog/[slug]/page.tsx app/components/mdx.tsx
git commit -m "feat: maximalist blog index + article page, restyle mdx components"
```

---

## Task 17: Maximalist 404

**Files:**
- Modify (replace): `app/not-found.tsx`

**Interfaces:**
- Produces: a full-screen solid 404 with a magnetic back-home button.

- [ ] **Step 1: Read the existing `app/not-found.tsx`**

Run: `cat app/not-found.tsx` (read before replacing).

- [ ] **Step 2: Replace `app/not-found.tsx`**

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-red px-4 text-center text-paper">
      <h1 className="font-display font-extrabold uppercase leading-[0.8] tracking-tight text-[clamp(5rem,30vw,18rem)]">
        404
      </h1>
      <p className="mt-4 font-mono text-sm uppercase tracking-widest">THIS PAGE DOES NOT EXIST</p>
      <Link
        href="/"
        className="mt-8 border-2 border-ink bg-paper px-6 py-3 font-mono text-sm uppercase tracking-widest text-ink hover:bg-ink hover:text-paper transition-colors"
      >
        &#8592; BACK HOME
      </Link>
    </section>
  )
}
```

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/not-found.tsx
git commit -m "feat: maximalist 404 page"
```

---

## Task 18: Cleanup old files + final verification

**Files:**
- Delete: `app/work/` (directory), `app/about/` (empty directory), `app/components/comments.tsx`, `app/components/posts.tsx`, `app/api/auth/` (directory), `app/api/comments/` (directory)

**Interfaces:**
- Produces: a lean repo with no dead code; final build + typecheck pass; smoke test across sections/themes/viewports.

- [ ] **Step 1: Verify nothing references the files about to be deleted**

Run:
```bash
pnpm exec tsc --noEmit 2>/dev/null; rg -l "app/components/comments|app/components/posts|app/work|api/auth|api/comments" app --type ts --type tsx || echo "no live references"
```
Expected: either `no live references`, or only self-references inside the files being deleted. If a live reference appears in a file we keep, fix it before deleting.

- [ ] **Step 2: Delete the dead files**

```bash
rm -rf app/work app/about app/components/comments.tsx app/components/posts.tsx app/api/auth app/api/comments
```

- [ ] **Step 3: Typecheck + build**

Run:
```bash
pnpm exec tsc --noEmit && pnpm build
```
Expected: both PASS. If `layout.tsx` still imports the old `comments`/`posts` anywhere, remove the import (it shouldn't — Task 2 rewrote layout, and Task 6/14 rewrote nav/footer).

- [ ] **Step 4: Smoke test**

Run `pnpm dev` and manually verify:
- Light + dark: toggle persists across reload (no FOUC).
- Desktop: side-rail highlights active section while scrolling; clicking a rail item smooth-scrolls.
- Mobile (≤1024px): side-rail hidden; MENU opens the full-screen yellow overlay; links close it and scroll.
- Hero: oversized type, yellow block behind UZUNER, marquee ticker animates, both CTAs work.
- About: bio + ID card with offset blue shadow + stat tiles.
- Projects: 6 posters, featured spans 2 cols; hover lifts and slides the offset block to yellow.
- Skills: two opposite-direction marquees (pause on hover); 4 category blocks.
- Testimonials: 3 quote cards alternating sides with accent quote marks.
- Writing: 3 latest post cards link to `/blog/[slug]`; ALL POSTS links to `/blog`.
- `/blog`: maximalist list; `/blog/[slug]`: article renders MDX (code, links, KaTeX if a post uses `<Latex>`).
- Contact: valid submit → green `MESSAGE SENT`; invalid → red error; email click copies to clipboard; mailto link opens client.
- 404: visit `/nope` → full-screen red 404 with back-home.
- `prefers-reduced-motion` (toggle in devtools): marquees + scroll choreography stop.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove old minimal site files; finalize maximalist build"
```

---

## Self-Review Notes

- **Spec coverage:** Hero(7), About(8), Projects(9), Skills(10), Testimonials(11), Blog preview(12) + blog pages(16), Contact(13), Socials+Footer(14), Nav(6), 404(17), single-page assembly(15), foundation(1), layout(2), data(3), motion/hooks(4), primitives(5), cleanup(18) — all spec sections covered.
- **Solid-only constraint:** no gradients/blur/glass anywhere; shadows are offset solid blocks (`absolute -right-3 -top-3 bg-*`); `Callout`/`Pros`/`Cons` restyled to solid borders.
- **Dark mode:** class-based via `@custom-variant` + `useTheme` + no-FOUC script; `paper`/`ink` tokens swap; accents static.
- **Content preservation:** existing 3 MDX posts retained and tagged (spec said "replace" — refined to preserve user content; clearly editable).
- **Type consistency:** `Accent` = `'yellow'|'red'|'blue'` used identically in `types.ts`, `projects.ts`, `testimonials.ts`, `skills.ts`, `profile.ts`, `poster.tsx`, `skills.tsx`, `testimonials.tsx`, `socials.tsx`. `NavItem.id` matches section `id`s (`hero/about/work/skills/words/writing/contact`) used in `nav.tsx` and each section component.
- **Next 16 canary params:** Task 16 Step 3 explicitly tells the implementer to mirror the existing `[slug]` file's `params` handling (possible Promise) to avoid a runtime regression.

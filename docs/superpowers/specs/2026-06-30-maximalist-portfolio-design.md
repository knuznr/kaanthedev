# Maximalist Portfolio Redesign — Design Spec

**Date:** 2026-06-30
**Owner:** Kaan Uzuner (kaanthedev)
**Status:** Approved (pending implementation plan)

## 1. Goal

Redesign the existing minimal, monospace, narrow-column terminal-style portfolio
at `kaanthedev` into a **bold Maximalist** portfolio: layered layouts, oversized
typography, strong geometric shapes, expressive visual hierarchy, rich patterns,
animated interactions, dense but organized content, and high visual energy — while
keeping excellent readability, mobile responsiveness, fast loading, and a
professional portfolio presentation.

This is a **full rebuild from scratch.** The current minimal aesthetic, the empty
`/about` directory, `/work` page, the GitHub-authenticated comments feature, and the
existing blog posts are replaced. The blog system itself (MDX) is rebuilt with new
starter posts.

### Hard visual constraints (non-negotiable)

- **Solid colors only.** No gradients. No glassmorphism. No blur/backdrop filters.
- High contrast. Clean, modern color palette.
- Large imagery via on-brand CSS "poster" compositions (no external photos) to stay
  on-palette, fast, and never broken.

## 2. Decisions (from brainstorming)

| Topic | Decision |
|---|---|
| Scope | Full redesign, start fresh (replace current site) |
| Structure | Single-page scroll homepage (`/`) + separate `/blog` and `/blog/[slug]` |
| Content | Representative content based on Kaan's profile (web dev + AI), clearly editable |
| Palette | "Bold Primary": ink `#0A0A0A` + paper `#FAFAFA` base; electric yellow `#F5FF00`, tomato red `#FF3B2F`, cobalt blue `#2B2DFF` accents |
| Dark mode | Both light and dark, with a toggle (class-based `.dark`) |
| Build approach | B. Framer Motion-driven: Tailwind 4 + custom CSS keyframes foundation + `framer-motion` for scroll/stagger/magnetic motion |

## 3. Architecture & Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript (keep current versions).
- **Styling:** Tailwind v4 (current) + a rewritten `global.css` with design tokens,
  custom keyframes, and a prose layer. **Class-based dark mode** (replace current
  `prefers-color-scheme` `dark:` usage with a `.dark` class on `<html>` driven by a
  toggle + `localStorage`).
- **Motion:** `framer-motion` (new dependency) for scroll reveals, staggered section
  intros, magnetic buttons, marquees, hover transforms. Used selectively to honor
  fast-loading. Respect `prefers-reduced-motion`.
- **Content:** MDX blog via existing `next-mdx-remote` + `sugar-high`; KaTeX retained.
  Homepage content (profile, projects, skills, testimonials, socials) lives in typed
  data files under `app/lib/data/`.
- **Contact form:** client-validated form posting to a new `/api/contact` route
  (stub that returns success JSON and can be wired to Resend/Nodemailer later), with a
  `mailto:` fallback link.
- **Fonts:** `next/font` self-hosted (no layout shift, no external requests):
  - **Syne** (700/800) — oversized display
  - **Inter** — body
  - **JetBrains Mono** — labels, code, numbers, meta (keeps the dev identity)

## 4. Visual System

### 4.1 Color (solid only)

- **Light theme:** base paper `#FAFAFA` / ink type `#0A0A0A`; accents yellow `#F5FF00`,
  red `#FF3B2F`, blue `#2B2DFF` used as solid blocks, borders, and offset shadows.
- **Dark theme:** base ink `#0A0A0A` / paper type `#FAFAFA`; same three accents used
  as solid blocks/borders so they remain punchy on black.

### 4.2 Type scale (maximalist)

- Hero display: `clamp(3rem, 14vw, 11rem)`.
- Section labels: `clamp(2.5rem, 8vw, 6rem)`.
- Body: `1.0625–1.125rem`, line-height ~1.6 for readability.
- Mono labels: uppercase, tracked (`letter-spacing`).

### 4.3 Layout language

12-column grid with intentional breakouts: overlapping solid color blocks, rotated
ticker labels, oversized index numbers (01–06), thick black borders, hard offset
"block shadows" (solid color rectangles behind cards — never blurred). Dense but
gridded; whitespace used as a deliberate accent, not uniformly.

### 4.4 Motion language

- Scroll-triggered fade/slide/stagger via `framer-motion` `whileInView`.
- Marquees (opposite-direction rows).
- Magnetic + skew-on-hover buttons.
- Active-section nav highlight.
- `prefers-reduced-motion`: disable big motion; keep instant transitions.

### 4.5 Imagery

No external photos. Each project/visual is a **CSS poster composition**: solid color
block(s) + oversized type + geometric shapes. Zero image bytes → instant LCP, always
on-palette, never broken.

## 5. Page & Section Breakdown

Single-page scroll homepage (`/`) composed of sections; `/blog` + `/blog/[slug]`
separate.

### Navigation (unique)

- **Floating numbered side-rail** (desktop): `01–06` vertical index; active section
  highlighted via `IntersectionObserver`; click = smooth-scroll.
- **Mobile:** collapses to a full-screen overlay menu (solid color block wipe-in)
  triggered by a thick bordered "MENU" button.
- **Top-left wordmark** `KAAN↗` (mono, bold) → home.
- **Top-right:** theme toggle (solid sun/square buttons) + a `LET'S TALK` magnetic
  button → scrolls to contact.

### 01 — Hero

- Full viewport. Oversized `KAAN UZUNER` display type breaking across lines,
  overlapping a solid yellow block behind `DEVELOPER` and a red block behind a
  rotated `// web + ai` mono tag.
- Animated marquee ticker along the bottom: `BUILDING BOLD THINGS FOR THE WEB •`
  repeating with solid separators.
- Sub-line + two magnetic CTAs: `VIEW WORK →` (scroll to projects), `READ BLOG →`.
- Scroll cue at bottom.
- Motion: type slides up + staggers in on load; blocks wipe in from edges.

### 02 — About

- Two overlapping columns: left = giant `02 / ABOUT` label + 3–4 short punchy
  paragraphs (web-dev + AI story). Right = a solid color "ID card" panel (black
  border, offset solid shadow) with mono key-values: role, focus, location, status,
  a "now" list.
- A row of stat blocks (e.g. `50+ PROJECTS`, `8 YRS`, `∞ COFFEE`) as big bordered
  tiles. Motion: staggered slide-in.

### 03 — Projects / Portfolio showcase

- Header `03 / SELECTED WORK` with a thick rule.
- Asymmetric grid of 4–6 project posters. Each poster = solid color block + oversized
  project name + mono meta (stack, year, role) + `01/06` index. Hover: poster lifts,
  an accent color block slides in, title skews. Click → external/live link (data-driven).
- One "featured" project spans 2 columns, taller, with a bigger color composition.
- Motion: staggered reveal on scroll.

### 04 — Skills

- `04 / TOOLBOX`. Dense marquee rows of skill chips scrolling opposite directions
  (HTML, CSS, TS, React, Next, Node, Python, AI/LLM, …), each chip a bordered solid
  tile. Below: categorized solid columns — Languages / Frameworks / AI & Tools /
  Design — each a bordered block with a mono list and a colored header bar.
- Hover: chip color flips.

### 05 — Testimonials

- `05 / KIND WORDS`. Big bordered quote cards stacked/offset, each with an oversized
  opening quote mark in an accent color, the quote, and a mono attribution block
  (name, role, company). Motion: cards slide in from alternating sides. 3–4
  representative quotes.

### 06 — Blog preview

- `06 / WRITING`. Horizontal scroll-snap row (stacked on mobile) of the latest 3 post
  cards: solid color header bar + title + date + mono tags. Click → `/blog/[slug]`.
  An `ALL POSTS →` link to `/blog`.

### 07 — Contact

- `07 / CONTACT`. Huge `LET'S BUILD SOMETHING` display headline. Bordered form on a
  solid accent panel: name, email, message fields (thick underlines, no glass),
  client-side validation, success state = a solid green block with a check +
  `MESSAGE SENT`. Below the form: big email link `me@kaanuzuner.dev` with a
  copy-to-clipboard micro-interaction, plus the API route fallback.

### Social links + Footer

- Social row as oversized bordered links: GitHub, LinkedIn, Email (X optional) —
  hover fills with accent solid color.
- Footer: mono row with `© 2026 KAAN UZUNER`, `BUILT WITH NEXT.JS`, back-to-top
  button.

### /blog index

- Bold `WRITING` header; list of all posts as big bordered rows (date · title · tags ·
  arrow), maximalist-styled. Optional tag filter.

### /blog/[slug]

- Maximalist article header (oversized title, mono meta bar, accent block), MDX body
  styled for readability (keep prose CSS), `sugar-high` code blocks, KaTeX math.
  Back link to `/blog`.

### /not-found

- Full-screen solid color block with giant `404` display type + a `← BACK HOME`
  magnetic button.

## 6. Content Model (typed data files in `app/lib/data/`)

- `profile.ts` — name, role, tagline, bio paragraphs, stats, "now" list, email,
  socials, nav items.
- `projects.ts` — `Project[]`: `id, index, name, description, stack[], year, role,
  liveUrl, repoUrl, accent ('yellow'|'red'|'blue'), featured`.
- `skills.ts` — categories + chips, marquee word lists.
- `testimonials.ts` — `Quote[]`: `quote, name, role, company, accent`.
- Blog posts: MDX files under `app/blog/posts/` with frontmatter
  (`title, date, tags, summary`); reuse/extend existing `app/blog/utils.ts`
  `getAllPosts()` / `getPost()`.
- All content is representative and editable; clearly commented as such.

## 7. Performance

- `next/font` self-hosted (Syne/Inter/JetBrains Mono) — no external font requests, no
  FOUT/FOIT.
- `framer-motion` loaded only where used; CSS for ambient motion, FM for scroll/hover.
- Tight `"use client"` boundaries; lazy-mount heavy client components.
- No external images (CSS posters) → zero image bytes, instant LCP.
- Keep existing `@vercel/analytics` + `@vercel/speed-insights`.
- Target: LCP < 1.5s on mobile; minimal CLS via fixed section heights + reserved
  space.

## 8. Accessibility & Responsiveness

- Semantic landmarks (`header/nav/main/section/footer`); `aria-current` on active
  nav; `aria-label` on icon buttons; form `<label>`s + `aria-describedby` errors;
  visible focus rings (thick solid outlines).
- Color contrast meets WCAG AA for text. Accents are used as blocks/borders, not as
  low-contrast body text.
- `prefers-reduced-motion`: disable marquees + scroll choreography; keep instant
  transitions.
- **Mobile:** side-rail → overlay menu; multi-column blocks stack; oversized type
  scales down via `clamp()`; tap targets ≥ 44px; horizontal scroll-snap rows become
  stacked.

## 9. Edge Cases & Error Handling

- **Theme FOUC:** inline `<script>` in `<head>` reads `localStorage` before paint and
  sets `.dark` class on `<html>`.
- **Contact form:** client validation (required, email format, message length); submit
  shows pending → success/error; `/api/contact` returns 200/400 JSON; network failure
  handled gracefully with a `mailto:` fallback.
- **Blog:** missing slug → `not-found.tsx`; MDX render error → error boundary with a
  friendly message; empty posts → "Nothing here yet" state.
- **Global `not-found`** for any unmatched route.

## 10. Testing / Verification

The project currently has no test framework and none is introduced by default.
Verification will be:

- `pnpm build` succeeds.
- `pnpm dev` smoke test across all sections, light + dark, mobile + desktop widths.
- `tsc --noEmit` (TypeScript) clean.

(If unit tests are later desired, a Vitest setup for data utils + form validation can
be added — flagged, not in scope here.)

## 11. File Structure (new/changed)

```
app/
  global.css               # rewritten: tokens, .dark class, keyframes, prose
  layout.tsx               # fonts, theme no-FOUC script, providers
  page.tsx                 # homepage: composes all sections
  not-found.tsx            # maximalist 404
  lib/
    data/  profile.ts projects.ts skills.ts testimonials.ts
    hooks/ useActiveSection.ts useMagnetic.ts useTheme.ts
    motion.ts              # shared framer-motion variants
  components/
    nav.tsx                # side-rail + overlay + theme toggle + wordmark
    theme-toggle.tsx
    section-heading.tsx
    marquee.tsx
    magnetic-button.tsx
    poster.tsx             # CSS project poster
    hero.tsx about.tsx projects.tsx skills.tsx
    testimonials.tsx blog-preview.tsx contact.tsx socials.tsx footer.tsx
  blog/ page.tsx [slug]/page.tsx utils.ts posts/*.mdx
  api/contact/route.ts
```

Removed (start fresh): `app/work/`, the empty `app/about/`, `app/components/comments.tsx`,
the GitHub-auth API routes if unused, and the old minimal `page.tsx`/`nav.tsx`/`footer.tsx`
contents (replaced by the new components above).

## 12. Out of Scope

- Real client/project content (representative content used; owner swaps in real data).
- Email provider integration for `/api/contact` (stubbed; wiring to Resend/Nodemailer
  is a follow-up).
- Tag filtering on `/blog` (optional; may be deferred).
- Unit/integration test framework (deferred unless requested).
- Real photography/imagery (CSS posters used instead).

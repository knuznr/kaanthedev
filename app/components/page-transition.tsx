import { ViewTransition } from 'react'

// Sibling pages crossfade with a small rise ("page"); going deeper or back (list <-> post) slides.
// Untyped navigations fall back to "page"; anything else (Suspense reveals, refresh) stays still.
const types = { 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'page' } as const

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={types} exit={types} default="none">
      {children}
    </ViewTransition>
  )
}

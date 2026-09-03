import './global.css'
import type { Metadata } from 'next'
import { Syne, Inter, JetBrains_Mono } from 'next/font/google'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { MotionProvider } from './components/motion-provider'
import { getOgImage } from './og/metadata'
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

const defaultTitle = 'kaan uzuner — founder & developer'
const defaultDescription = 'Founder and developer of Kolay Büro, a legal operations platform for law firms.'
const defaultOgImage = getOgImage('Kaan Uzuner — Founder & Developer')

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: defaultTitle, template: '%s — kaan uzuner' },
  description: 'Kaan Uzuner — founder and developer of Kolay Büro.',
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: baseUrl,
    siteName: 'kaan uzuner',
    locale: 'en_US',
    type: 'website',
    images: [defaultOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage.url],
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
    <html
      lang="en"
      className={cx(syne.variable, inter.variable, jetbrains.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-body antialiased">
        <MotionProvider>
          <Navbar />
          <main className="min-w-0 flex-auto">{children}</main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </MotionProvider>
      </body>
    </html>
  )
}

import './global.css'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Navbar } from './components/nav'
import { MobileTabBar } from './components/mobile-tab-bar'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { Intro } from './components/intro'
import { PageCurtain } from './components/page-curtain'
import { getOgImage } from './og/metadata'
import { baseUrl } from './sitemap'
import 'katex/dist/katex.min.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const defaultTitle = 'kaan uzuner — founder & developer'
const defaultDescription = 'Founder and developer of Kolay Büro, a legal operations platform for law firms.'
const defaultOgImage = getOgImage('Kaan Uzuner')

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F1EFEA' },
    { media: '(prefers-color-scheme: dark)', color: '#0E0E0D' },
  ],
}

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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

const cx = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ')

// intro: once per session, skipped for reduced motion; no JS = no overlay
const introScript = `(function(){try{if(!sessionStorage.getItem('intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&location.pathname==='/'){document.documentElement.classList.add('intro')}}catch(e){}})()`

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark')}}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cx(inter.variable, jetbrains.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript><style>{'[style*="opacity:0"]{opacity:1!important;transform:none!important}'}</style></noscript>
      </head>
      <body className="font-body antialiased">
        <Intro />
        <PageCurtain />
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2">Skip to content</a>
          <Navbar />
          <MobileTabBar />
          <main id="content" className="mx-auto w-full max-w-2xl px-6">{children}</main>
          <Footer />
          <Analytics />
          <SpeedInsights />
      </body>
    </html>
  )
}

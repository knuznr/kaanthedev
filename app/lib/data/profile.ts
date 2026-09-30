import type { NavItem, Social } from 'app/lib/types'

export const profile = {
  name: 'Kaan Uzuner',
  role: 'Founder & Developer',
  tagline: 'product + web',
  email: 'me@kaanuzuner.dev',
  location: 'Turkey / Remote',
  status: 'Building Kolay Büro',
  bio: [
    "I'm Kaan. I build Kolay Büro, a legal operations platform for law firms in Turkey: cases, clients, documents, finance and deadlines in one place.",
    'I build with AI coding tools and keep the decisions myself: plans get read, tests get run, and every change gets checked before it ships.',
    "This site is where I keep the notes: what I built, what broke, what I'd do differently.",
  ],
  now: [
    'Building and shipping Kolay Büro',
    'Learning from real legal workflows',
    'Refining the product with user feedback',
  ],
}

export const navItems: NavItem[] = [
  { id: 'hero', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'words', label: 'Words' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
]

export const socials: Social[] = [
  { label: 'GitHub', href: 'https://github.com/knuznr', accent: 'yellow' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/kaan-uzunerr', accent: 'red' },
  { label: 'Email', href: 'mailto:me@kaanuzuner.dev', accent: 'blue' },
]

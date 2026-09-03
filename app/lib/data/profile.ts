import type { NavItem, Social } from 'app/lib/types'

export const profile = {
  name: 'Kaan Uzuner',
  role: 'Founder & Developer',
  tagline: 'product + web',
  email: 'me@kaanuzuner.dev',
  location: 'Turkey / Remote',
  status: 'Building Kolay Büro',
  bio: [
    "I'm the founder and developer of Kolay Büro, a legal operations platform built around how law firms in Turkey actually work.",
    'I turn complex workflows across cases, clients, finance, documents, and daily operations into focused product experiences.',
    'My work sits between product thinking, interface design, and full-stack engineering.',
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
  { label: 'GitHub', href: 'https://github.com/knnuznr', accent: 'yellow' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/kaan-uzunerr', accent: 'red' },
  { label: 'Email', href: 'mailto:me@kaanuzuner.dev', accent: 'blue' },
]

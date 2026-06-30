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

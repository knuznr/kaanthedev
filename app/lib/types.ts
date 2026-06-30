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

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

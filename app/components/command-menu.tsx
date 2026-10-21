'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FolderOpen, House, Mail, Moon, PenLine, Sun, Timer, User } from 'lucide-react'
import { CommandMenu as CommandMenuBase, type CommandMenuItem } from 'app/components/ui/command-menu'
import { useTheme } from 'app/lib/hooks/useTheme'

const OPEN_EVENT = 'command-menu:open'

// Global command menu: Cmd/Ctrl+K anywhere, or the ⌘K trigger in the nav.
export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { theme, toggle } = useTheme()

  const items = useMemo<CommandMenuItem[]>(() => {
    const navigate = (href: string) => () => {
      setOpen(false)
      router.push(href)
    }

    return [
      { id: 'home', label: 'home', group: 'navigate', icon: <House className="size-4" />, onSelect: navigate('/') },
      { id: 'about', label: 'about', group: 'navigate', icon: <User className="size-4" />, onSelect: navigate('/about') },
      { id: 'work', label: 'work', group: 'navigate', icon: <FolderOpen className="size-4" />, onSelect: navigate('/work') },
      { id: 'writing', label: 'writing', group: 'navigate', icon: <PenLine className="size-4" />, onSelect: navigate('/blog') },
      { id: 'contact', label: 'contact', group: 'navigate', icon: <Mail className="size-4" />, onSelect: navigate('/contact') },
      {
        id: 'theme',
        label: 'toggle theme',
        group: 'actions',
        icon: theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />,
        onSelect: () => {
          setOpen(false)
          toggle()
        },
      },
      {
        id: 'pomodoro',
        label: 'pomodoro',
        group: 'open',
        icon: <Timer className="size-4" />,
        // /pomodro is a static app in public/, served through a rewrite — not a Next route
        onSelect: () => {
          setOpen(false)
          window.location.assign('/pomodro')
        },
      },
    ]
  }, [router, theme, toggle])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    const onOpen = () => setOpen(true)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(OPEN_EVENT, onOpen)
    }
  }, [])

  return (
    <CommandMenuBase
      open={open}
      onOpenChange={(next) => (next ? setOpen(true) : close())}
      items={items}
      label="command menu"
      placeholder="search pages and actions…"
    />
  )
}

export function CommandMenuTrigger() {
  return (
    <button
      type="button"
      aria-label="open command menu"
      aria-haspopup="dialog"
      aria-keyshortcuts="Meta+K Control+K"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="mono-label link-muted hidden min-h-11 min-w-11 items-center justify-center md:inline-flex"
    >
      ⌘K
    </button>
  )
}

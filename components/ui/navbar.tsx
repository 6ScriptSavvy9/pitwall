/**
 * Navbar - Navigation principale de l'application
 * Affiche le logo, les liens de navigation et l'état utilisateur
 */
'use client'

import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar } from './avatar'
import { Button } from './button'

interface NavItem {
  label: string
  href: string
}

interface NavbarProps {
  user?: {
    name: string
    avatarUrl?: string | null
  } | null
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Prédictions', href: '/predictions' },
  { label: 'Classement F1', href: '/standings' },
  { label: 'Leaderboard', href: '/leaderboard' },
]

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              <span className="text-primary">Pit</span>
              <span className="text-foreground">Wall</span>
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center gap-1">
            {user && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-muted text-primary'
                    : 'text-text-secondary hover:text-foreground hover:bg-surface-hover'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User / Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/profile" className="flex items-center gap-3 group">
                <span className="hidden sm:block text-sm text-text-secondary group-hover:text-foreground transition-colors">
                  {user.name}
                </span>
                <Avatar 
                  src={user.avatarUrl} 
                  name={user.name} 
                  size="sm" 
                />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
                <Button variant="primary" size="sm">
                  Rejoindre
                </Button>
              </div>
            )}
          </div>

          {/* Menu mobile (hamburger) */}
          <button className="md:hidden p-2 text-text-secondary hover:text-foreground">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

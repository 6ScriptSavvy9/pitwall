/**
 * Badge - Composant pour afficher les récompenses et statuts
 * Variantes de rareté: common, rare, epic, legendary
 */
import { cn } from '@/lib/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

type BadgeVariant = 'default' | 'common' | 'rare' | 'epic' | 'legendary' | 'success' | 'warning'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface border-border text-foreground',
  common: 'bg-surface border-text-secondary text-text-secondary',
  rare: 'bg-blue-500/20 border-blue-500 text-blue-400',
  epic: 'bg-purple-500/20 border-purple-500 text-purple-400',
  legendary: 'bg-gold/20 border-gold text-gold',
  success: 'bg-success/20 border-success text-success',
  warning: 'bg-warning/20 border-warning text-warning',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

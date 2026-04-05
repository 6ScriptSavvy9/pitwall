/**
 * Card - Conteneur avec fond surface et bordure subtile
 * Utilisé pour encapsuler du contenu (prédictions, stats, etc.)
 */
import { cn } from '@/lib/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-surface rounded-xl border border-border p-6',
          hover && 'transition-colors duration-200 hover:border-border-light hover:bg-surface-hover',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

/**
 * CardHeader - En-tête de carte avec titre et description optionnelle
 */
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mb-4', className)} {...props}>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        )}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

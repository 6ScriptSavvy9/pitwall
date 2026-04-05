/**
 * Avatar - Photo de profil utilisateur avec fallback initiales
 * Tailles: sm (32px), md (40px), lg (56px), xl (80px)
 */
import { cn } from '@/lib/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  name?: string
  size?: AvatarSize
  rank?: number // Pour afficher le rang sur le podium
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

// Génère les initiales à partir du nom
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Couleur du badge de rang (podium)
function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-gold text-black'
    case 2:
      return 'bg-silver text-black'
    case 3:
      return 'bg-bronze text-white'
    default:
      return 'bg-surface text-foreground'
  }
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name = '', size = 'md', rank, ...props }, ref) => {
    const initials = getInitials(name || 'U')

    return (
      <div ref={ref} className={cn('relative inline-block', className)} {...props}>
        <div
          className={cn(
            'rounded-full bg-surface border-2 border-border flex items-center justify-center font-semibold text-foreground overflow-hidden',
            sizeStyles[size]
          )}
        >
          {src ? (
            <img
              src={src}
              alt={alt || name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        
        {/* Badge de rang pour le podium */}
        {rank && rank <= 3 && (
          <span
            className={cn(
              'absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 border-background',
              getRankColor(rank)
            )}
          >
            {rank}
          </span>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

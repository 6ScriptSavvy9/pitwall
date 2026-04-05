/**
 * LeaderboardTeaser - Aperçu du top 5 global pour la landing page
 */
import { Avatar, Badge } from '@/components/ui'
import { LeaderboardEntry } from '@/types'

interface LeaderboardTeaserProps {
  entries: LeaderboardEntry[]
}

function getRankStyle(rank: number): string {
  switch (rank) {
    case 1:
      return 'text-gold'
    case 2:
      return 'text-silver'
    case 3:
      return 'text-bronze'
    default:
      return 'text-text-secondary'
  }
}

export function LeaderboardTeaser({ entries }: LeaderboardTeaserProps) {
  const top5 = entries.slice(0, 5)

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">🏆 Top 5 Global</h3>
      </div>
      <div className="divide-y divide-border">
        {top5.map((entry) => (
          <div
            key={entry.user.id}
            className="px-6 py-3 flex items-center gap-4 hover:bg-surface-hover transition-colors"
          >
            {/* Rang */}
            <span className={`w-6 font-bold text-lg ${getRankStyle(entry.rank)}`}>
              {entry.rank}
            </span>

            {/* Avatar */}
            <Avatar
              name={entry.user.username}
              src={entry.user.avatarUrl}
              size="sm"
              rank={entry.rank <= 3 ? entry.rank : undefined}
            />

            {/* Pseudo */}
            <span className="flex-1 font-medium text-foreground truncate">
              {entry.user.username}
            </span>

            {/* Points */}
            <span className="text-primary font-semibold">{entry.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}

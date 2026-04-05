/**
 * LeaderboardClient - Composant client pour la page leaderboard
 * Gère les filtres interactifs avec les vraies données OpenF1
 */
'use client'

import { useState } from 'react'
import { Navbar, Card, Avatar, Badge } from '@/components/ui'
import type { OpenF1Meeting } from '@/lib/openf1/types'
import type { User, LeaderboardEntry } from '@/types'

interface LeaderboardClientProps {
  meetings: OpenF1Meeting[]
  currentUser: User
  globalLeaderboard: LeaderboardEntry[]
}

type Tab = 'global' | 'league'
type Filter = 'season' | number // 'season' ou un meeting_key

export function LeaderboardClient({ 
  meetings, 
  currentUser, 
  globalLeaderboard 
}: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('global')
  const [filter, setFilter] = useState<Filter>('season')

  // Simuler un classement de ligue (même données mais filtrées)
  const leagueLeaderboard = globalLeaderboard.slice(0, 7)

  const displayedLeaderboard = activeTab === 'global' ? globalLeaderboard : leagueLeaderboard

  return (
    <>
      <Navbar user={{ name: currentUser.username, avatarUrl: currentUser.avatarUrl }} />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              🏆 Classement
            </h1>
            <p className="text-text-secondary mt-1">
              Saison 2026 • {globalLeaderboard.length} participants
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <TabButton 
              active={activeTab === 'global'} 
              onClick={() => setActiveTab('global')}
            >
              Global
            </TabButton>
            <TabButton 
              active={activeTab === 'league'} 
              onClick={() => setActiveTab('league')}
            >
              Ma Ligue
            </TabButton>
          </div>

          {/* Filtres - Utilise les vrais GP depuis OpenF1 */}
          <div className="mb-6">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value === 'season' ? 'season' : Number(e.target.value))}
              className="bg-surface border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="season">Saison complète</option>
              {meetings.map((meeting) => (
                <option key={meeting.meeting_key} value={meeting.meeting_key}>
                  {meeting.meeting_name} ({meeting.country_name})
                </option>
              ))}
            </select>
            {meetings.length === 0 && (
              <p className="text-text-muted text-sm mt-2">
                Aucune course terminée cette saison
              </p>
            )}
          </div>

          {/* Tableau du leaderboard */}
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-hover">
                    <th className="text-left py-4 px-4 text-sm font-medium text-text-secondary w-16">Rang</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-text-secondary">Joueur</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-text-secondary">Points</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-text-secondary hidden sm:table-cell">Prédictions</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-text-secondary hidden md:table-cell">Meilleur GP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {displayedLeaderboard.map((entry) => {
                    const isCurrentUser = entry.user.id === currentUser.id
                    return (
                      <tr 
                        key={entry.user.id} 
                        className={`transition-colors ${
                          isCurrentUser 
                            ? 'bg-primary-muted' 
                            : 'hover:bg-surface-hover'
                        }`}
                      >
                        {/* Rang */}
                        <td className="py-4 px-4">
                          <RankBadge rank={entry.rank} />
                        </td>

                        {/* Joueur */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar 
                              name={entry.user.username} 
                              src={entry.user.avatarUrl}
                              size="sm"
                              rank={entry.rank <= 3 ? entry.rank : undefined}
                            />
                            <div>
                              <p className={`font-medium ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                                {entry.user.username}
                                {isCurrentUser && <span className="text-xs ml-2">(Toi)</span>}
                              </p>
                              {entry.user.badges.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {entry.user.badges.slice(0, 2).map((badge) => (
                                    <span key={badge.id} className="text-sm" title={badge.name}>
                                      {badge.iconUrl}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Points */}
                        <td className="py-4 px-4 text-right">
                          <span className="text-foreground font-semibold">{entry.points}</span>
                          <span className="text-text-secondary text-sm ml-1">pts</span>
                        </td>

                        {/* Prédictions correctes */}
                        <td className="py-4 px-4 text-right hidden sm:table-cell">
                          <span className="text-text-secondary">{entry.correctPredictions}</span>
                        </td>

                        {/* Meilleur GP */}
                        <td className="py-4 px-4 text-right hidden md:table-cell">
                          <span className="text-text-secondary text-sm truncate max-w-32 inline-block">
                            {entry.bestGp}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Position de l'utilisateur si pas visible */}
          {activeTab === 'global' && currentUser.rank > 10 && (
            <div className="mt-4 p-4 bg-primary-muted rounded-lg border border-primary/30">
              <p className="text-foreground text-sm">
                Ta position : <span className="font-bold">#{currentUser.rank}</span> avec{' '}
                <span className="font-bold">{currentUser.points} points</span>
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

/**
 * TabButton - Bouton d'onglet stylisé
 */
function TabButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean
  onClick: () => void
  children: React.ReactNode 
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'bg-surface text-text-secondary hover:text-foreground hover:bg-surface-hover'
      }`}
    >
      {children}
    </button>
  )
}

/**
 * RankBadge - Badge de rang avec couleurs podium
 */
function RankBadge({ rank }: { rank: number }) {
  const getStyle = () => {
    switch (rank) {
      case 1:
        return 'bg-gold/20 text-gold border-gold'
      case 2:
        return 'bg-silver/20 text-silver border-silver'
      case 3:
        return 'bg-bronze/20 text-bronze border-bronze'
      default:
        return 'bg-surface text-text-secondary border-border'
    }
  }

  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold ${getStyle()}`}>
      {rank}
    </span>
  )
}

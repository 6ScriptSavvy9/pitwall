/**
 * Leaderboard Page - Classement global et par ligue
 * Tableau avec filtres par GP ou saison
 * Utilise OpenF1 pour le calendrier des courses
 */
import { getMeetings } from '@/lib/openf1'
import { currentUser, globalLeaderboard } from '@/lib/mock-data'
import { LeaderboardClient } from './leaderboard-client'

export default async function LeaderboardPage() {
  // Récupérer le vrai calendrier F1 depuis OpenF1
  const meetings = await getMeetings(2026)
  
  // Ne garder que les courses passées pour les filtres
  const now = new Date()
  const pastMeetings = meetings.filter(m => new Date(m.date_end) < now)
  
  return (
    <LeaderboardClient 
      meetings={pastMeetings}
      currentUser={currentUser}
      globalLeaderboard={globalLeaderboard}
    />
  )
}

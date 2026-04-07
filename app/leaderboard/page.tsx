/**
 * Leaderboard Page - Classement global et par ligue
 * Tableau avec filtres par GP ou saison
 * Utilise OpenF1 pour le calendrier des courses
 */
import { Navbar, Card, CardHeader, Button } from '@/components/ui'
import { getMeetingsWithFallback } from '@/lib/openf1'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function LeaderboardPage() {
  // Vérifier l'authentification
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Nom d'affichage et avatar Google
  const displayName = user.user_metadata?.full_name?.split(' ')[0] 
    || user.email?.split('@')[0] 
    || 'Utilisateur'
  const avatarUrl = user.user_metadata?.avatar_url || null

  // Récupérer le vrai calendrier F1 depuis OpenF1
  const { meetings, year } = await getMeetingsWithFallback()
  
  // Ne garder que les courses passées pour les filtres
  const now = new Date()
  const pastMeetings = meetings.filter(m => new Date(m.date_end) < now)
  
  return (
    <>
      <Navbar user={{ name: displayName, avatarUrl }} />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              🏆 Classement
            </h1>
            <p className="text-text-secondary mt-1">
              Saison {year} • {pastMeetings.length} course{pastMeetings.length > 1 ? 's' : ''} terminée{pastMeetings.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* État vide */}
          <Card>
            <div className="text-center py-12">
              <p className="text-6xl mb-4">🏁</p>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Classement à venir
              </h2>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Le classement sera disponible après les premières courses. 
                Fais tes prédictions maintenant pour être prêt !
              </p>
              <Link href="/predictions">
                <Button variant="primary">Faire mes prédictions</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}

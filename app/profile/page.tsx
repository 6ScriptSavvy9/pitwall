/**
 * Profile Page - Profil utilisateur avec stats, badges et historique
 * Utilise OpenF1 pour les résultats des courses passées
 */
import { Navbar, Card, CardHeader, Avatar, Badge } from '@/components/ui'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getPastRaces, getRaceWinnerAndPole, type RaceResult } from '@/lib/openf1'

interface PastRaceResult {
  meetingKey: number
  meetingName: string
  winner: RaceResult | null
  pole: RaceResult | null
}

export default async function ProfilePage() {
  // Vérifier l'authentification
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const userName = user.email?.split('@')[0] || 'Utilisateur'

  // Récupérer les courses passées depuis OpenF1
  const pastRaces = await getPastRaces(2026)
  
  // Récupérer seulement les 3 dernières courses pour éviter les rate limits
  const recentRaces = pastRaces.slice(-3).reverse()
  
  // Récupérer les résultats un par un avec try/catch pour la robustesse
  const raceResults: PastRaceResult[] = []
  for (const race of recentRaces) {
    try {
      const { winner, pole } = await getRaceWinnerAndPole(race.meeting_key)
      raceResults.push({
        meetingKey: race.meeting_key,
        meetingName: race.meeting_name,
        winner,
        pole,
      })
    } catch {
      // En cas d'erreur, ajouter quand même la course sans résultats
      raceResults.push({
        meetingKey: race.meeting_key,
        meetingName: race.meeting_name,
        winner: null,
        pole: null,
      })
    }
  }
  
  return (
    <>
      <Navbar user={{ name: userName, avatarUrl: null }} />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header du profil */}
          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar 
                name={userName} 
                src={null}
                size="xl"
              />
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-foreground">{userName}</h1>
                <p className="text-text-secondary mt-1">Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                  <Badge variant="default">Nouveau membre</Badge>
                  <Badge variant="success">0 points</Badge>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statistiques - État vide */}
              <Card>
                <CardHeader title="📊 Statistiques" description="Saison 2026" />
                <div className="text-center py-8">
                  <p className="text-4xl mb-4">📈</p>
                  <p className="text-text-secondary">
                    Tes statistiques apparaîtront ici après tes premières prédictions.
                  </p>
                </div>
              </Card>

              {/* Résultats des courses récentes (vrais résultats OpenF1) */}
              <Card>
                <CardHeader title="🏁 Résultats récents" description="Données en direct depuis OpenF1" />
                <div className="space-y-4">
                  {raceResults.length === 0 ? (
                    <p className="text-text-muted text-center py-4">
                      Aucune course terminée cette saison
                    </p>
                  ) : (
                    raceResults.map((race) => (
                      <div 
                        key={race.meetingKey} 
                        className="bg-surface-hover rounded-lg p-4"
                      >
                        <h4 className="font-semibold text-foreground mb-3">{race.meetingName}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-text-secondary">🏆 Vainqueur</p>
                            <p className="text-foreground font-medium">
                              {race.winner?.driverName || 'Non disponible'}
                            </p>
                            {race.winner && (
                              <p className="text-text-muted text-xs">{race.winner.teamName}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-text-secondary">⚡ Pole Position</p>
                            <p className="text-foreground font-medium">
                              {race.pole?.driverName || 'Non disponible'}
                            </p>
                            {race.pole && (
                              <p className="text-text-muted text-xs">{race.pole.teamName}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar - Badges */}
            <div className="space-y-6">
              <Card>
                <CardHeader 
                  title="🎖️ Collection de badges" 
                  description="0 débloqués"
                />
                <div className="text-center py-8">
                  <p className="text-4xl mb-4">🎖️</p>
                  <p className="text-text-muted text-sm">
                    Fais des prédictions pour débloquer des badges !
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

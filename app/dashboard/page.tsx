/**
 * Dashboard Page - Vue principale pour les utilisateurs connectés
 * Prochain GP, prédictions, rang, badges et activité de la ligue
 * Utilise OpenF1 pour les données du prochain GP et le classement F1
 */
import { Navbar, Card, CardHeader, Button } from '@/components/ui'
import { Countdown } from '@/components/features/countdown'
import { getNextMeeting, getChampionshipSummary } from '@/lib/openf1'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // Vérifier l'authentification
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Si non connecté, rediriger vers login
  if (!user) {
    redirect('/login')
  }

  // Récupère le prochain GP et le classement depuis l'API OpenF1
  const [nextGP, championship] = await Promise.all([
    getNextMeeting().catch(() => null),
    getChampionshipSummary().catch(() => null)
  ])

  // Nom d'affichage : prénom Google ou email
  const displayName = user.user_metadata?.full_name?.split(' ')[0] 
    || user.email?.split('@')[0] 
    || 'Utilisateur'
  
  return (
    <>
      <Navbar user={{ 
        name: displayName, 
        avatarUrl: user.user_metadata?.avatar_url || null 
      }} />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Bienvenue, {displayName} 👋
            </h1>
            <p className="text-text-secondary mt-1">
              Voici ton tableau de bord pour la saison {championship?.year || new Date().getFullYear()}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Prochain GP + Countdown */}
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-text-secondary text-sm">Prochain Grand Prix</p>
                    <h2 className="text-xl font-bold text-foreground">
                      {nextGP?.meeting_name || 'Aucun GP prévu'}
                    </h2>
                    {nextGP && (
                      <p className="text-text-muted text-sm">
                        {nextGP.circuit_short_name} • {nextGP.country_name}
                      </p>
                    )}
                  </div>
                  <Link href="/predictions">
                    <Button>Faire mes prédictions</Button>
                  </Link>
                </div>
                {nextGP && <Countdown targetDate={nextGP.date_start} label="Deadline des prédictions" />}
              </Card>

              {/* Mes prédictions en cours - État vide */}
              <Card>
                <CardHeader 
                  title="Mes prédictions en cours" 
                  description={`Pour le ${nextGP?.meeting_name || 'prochain GP'}`}
                />
                <div className="text-center py-8">
                  <p className="text-4xl mb-4">🎯</p>
                  <p className="text-text-secondary mb-4">
                    Tu n&apos;as pas encore fait de prédictions pour ce Grand Prix.
                  </p>
                  <Link href="/predictions">
                    <Button variant="primary">Faire mes prédictions</Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Colonne sidebar */}
            <div className="space-y-6">
              {/* Classement F1 en direct */}
              {championship && championship.drivers.length > 0 ? (
                <Card>
                  <CardHeader 
                    title="🏆 Classement F1" 
                    description={`${championship.racesCompleted}/${championship.totalRaces} courses • ${championship.year}`} 
                  />
                  <div className="space-y-3">
                    {/* Top 3 Pilotes */}
                    <div>
                      <p className="text-xs text-text-muted mb-2">Pilotes</p>
                      {championship.drivers.slice(0, 3).map((driver, index) => (
                        <div key={driver.driverNumber} className="flex items-center gap-2 py-1">
                          <span className="w-5 text-center text-sm font-bold" style={{ color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }}>
                            {index + 1}
                          </span>
                          <div 
                            className="w-1 h-4 rounded-full"
                            style={{ backgroundColor: `#${driver.teamColor}` }}
                          />
                          <span className="text-sm text-foreground flex-1 truncate">
                            {driver.driverName.split(' ').pop()}
                          </span>
                          <span className="text-sm text-text-secondary">{driver.points} pts</span>
                        </div>
                      ))}
                    </div>
                    {/* Top 3 Constructeurs */}
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-text-muted mb-2">Constructeurs</p>
                      {championship.constructors.slice(0, 3).map((team, index) => (
                        <div key={team.teamName} className="flex items-center gap-2 py-1">
                          <span className="w-5 text-center text-sm font-bold" style={{ color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }}>
                            {index + 1}
                          </span>
                          <div 
                            className="w-1 h-4 rounded-full"
                            style={{ backgroundColor: `#${team.teamColor}` }}
                          />
                          <span className="text-sm text-foreground flex-1 truncate">
                            {team.teamName}
                          </span>
                          <span className="text-sm text-text-secondary">{team.points} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <Link href="/standings" className="text-primary hover:text-primary-hover text-sm font-medium">
                      Voir le classement complet →
                    </Link>
                  </div>
                </Card>
              ) : (
                <Card>
                  <CardHeader title="🏆 Classement F1" />
                  <div className="text-center py-4">
                    <p className="text-text-muted text-sm">
                      Le classement sera disponible après les premières courses.
                    </p>
                  </div>
                </Card>
              )}

              {/* Mon rang - État vide */}
              <Card>
                <CardHeader title="Mon classement" />
                <div className="text-center py-4">
                  <p className="text-text-muted">
                    Fais tes premières prédictions pour apparaître au classement !
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link href="/leaderboard" className="text-primary hover:text-primary-hover text-sm font-medium">
                    Voir le classement complet →
                  </Link>
                </div>
              </Card>

              {/* Badges - État vide */}
              <Card>
                <CardHeader title="Mes badges" description="0 débloqués" />
                <div className="text-center py-4">
                  <p className="text-4xl mb-2">🎖️</p>
                  <p className="text-text-muted text-sm">
                    Fais des prédictions pour débloquer des badges !
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link href="/profile" className="text-primary hover:text-primary-hover text-sm font-medium">
                    Voir tous les badges →
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

/**
 * Dashboard Page - Vue principale pour les utilisateurs connectés
 * Prochain GP, prédictions, rang, badges et activité de la ligue
 * Utilise OpenF1 pour les données du prochain GP et le classement F1
 */
import { Navbar, Card, CardHeader, Avatar, Button } from '@/components/ui'
import { Countdown } from '@/components/features/countdown'
import { 
  currentUser, 
  currentPredictions, 
  leagueActivity,
  getDriverName
} from '@/lib/mock-data'
import { getNextMeeting, getChampionshipSummary } from '@/lib/openf1'
import Link from 'next/link'

export default async function DashboardPage() {
  // Récupère le prochain GP et le classement depuis l'API OpenF1
  const [nextGP, championship] = await Promise.all([
    getNextMeeting(),
    getChampionshipSummary(2026).catch(() => null)
  ])
  
  return (
    <>
      <Navbar user={{ name: currentUser.username, avatarUrl: currentUser.avatarUrl }} />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Bienvenue, {currentUser.username} 👋
            </h1>
            <p className="text-text-secondary mt-1">
              Voici ton tableau de bord pour la saison 2025
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
                    <h2 className="text-xl font-bold text-foreground">{nextGP?.meeting_name || 'Chargement...'}</h2>
                    <p className="text-text-muted text-sm">{nextGP?.circuit_short_name} • {nextGP?.country_name}</p>
                  </div>
                  <Link href="/predictions">
                    <Button>Faire mes prédictions</Button>
                  </Link>
                </div>
                {nextGP && <Countdown targetDate={nextGP.date_start} label="Deadline des prédictions" />}
              </Card>

              {/* Mes prédictions en cours */}
              <Card>
                <CardHeader 
                  title="Mes prédictions en cours" 
                  description={`Pour le ${nextGP?.meeting_name || 'prochain GP'}`}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <PredictionBlock 
                    label="Vainqueur" 
                    value={currentPredictions.winner ? getDriverName(currentPredictions.winner) : null}
                    icon="🏆"
                  />
                  <PredictionBlock 
                    label="Pole Position" 
                    value={currentPredictions.pole ? getDriverName(currentPredictions.pole) : null}
                    icon="⚡"
                  />
                  <PredictionBlock 
                    label="Meilleur tour" 
                    value={currentPredictions.fastestLap ? getDriverName(currentPredictions.fastestLap) : null}
                    icon="⏱️"
                  />
                  <PredictionBlock 
                    label="Safety Car" 
                    value={currentPredictions.safetyCar !== null ? (currentPredictions.safetyCar ? 'Oui' : 'Non') : null}
                    icon="🚨"
                  />
                  <PredictionBlock 
                    label="Podium" 
                    value={currentPredictions.podium ? '✓ Complété' : null}
                    icon="🥇"
                  />
                  <PredictionBlock 
                    label="Top 5 saison" 
                    value={currentPredictions.seasonTop5 ? '✓ Complété' : null}
                    icon="📊"
                  />
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <Link href="/predictions" className="text-primary hover:text-primary-hover text-sm font-medium">
                    Modifier mes prédictions →
                  </Link>
                </div>
              </Card>
            </div>

            {/* Colonne sidebar */}
            <div className="space-y-6">
              {/* Classement F1 en direct */}
              {championship && championship.drivers.length > 0 && (
                <Card>
                  <CardHeader title="🏆 Classement F1" description={`${championship.racesCompleted}/${championship.totalRaces} courses`} />
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
              )}

              {/* Mon rang */}
              <Card>
                <CardHeader title="Mon classement" />
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-primary">#{currentUser.rank}</div>
                  <div>
                    <p className="text-foreground font-semibold">{currentUser.points} points</p>
                    <p className="text-text-secondary text-sm">dans ma ligue</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link href="/leaderboard" className="text-primary hover:text-primary-hover text-sm font-medium">
                    Voir le classement complet →
                  </Link>
                </div>
              </Card>

              {/* Mes badges récents */}
              <Card>
                <CardHeader title="Mes badges" description={`${currentUser.badges.length} débloqués`} />
                <div className="flex flex-wrap gap-2">
                  {currentUser.badges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className="flex items-center gap-2 bg-surface-hover rounded-lg px-3 py-2"
                      title={badge.description}
                    >
                      <span className="text-xl">{badge.iconUrl}</span>
                      <span className="text-sm text-foreground">{badge.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link href="/profile" className="text-primary hover:text-primary-hover text-sm font-medium">
                    Voir tous mes badges →
                  </Link>
                </div>
              </Card>

              {/* Activité de la ligue */}
              <Card>
                <CardHeader title="Activité de ma ligue" />
                <div className="space-y-3">
                  {leagueActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <Avatar name={activity.user} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{activity.user}</span>{' '}
                          <span className="text-text-secondary">{activity.action}</span>
                        </p>
                        <p className="text-xs text-text-muted">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

/**
 * PredictionBlock - Mini bloc affichant une prédiction
 */
function PredictionBlock({ 
  label, 
  value, 
  icon 
}: { 
  label: string
  value: string | null
  icon: string 
}) {
  return (
    <div className="bg-surface-hover rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span className="text-xs text-text-secondary">{label}</span>
      </div>
      <p className={`text-sm font-medium ${value ? 'text-foreground' : 'text-text-muted'}`}>
        {value || 'Non défini'}
      </p>
    </div>
  )
}

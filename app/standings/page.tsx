/**
 * Standings Page - Classement du championnat F1
 * Pilotes et Constructeurs avec données OpenF1
 */
import { Navbar, Card, CardHeader } from '@/components/ui'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getChampionshipSummary, getDrivers, type DriverStanding, type ConstructorStanding } from '@/lib/openf1'
import Link from 'next/link'

export default async function StandingsPage() {
  // Vérifier l'authentification
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Nom d'affichage
  const displayName = user.user_metadata?.full_name?.split(' ')[0] 
    || user.email?.split('@')[0] 
    || 'Utilisateur'

  // Récupérer le classement complet
  let championship: {
    drivers: DriverStanding[]
    constructors: ConstructorStanding[]
    racesCompleted: number
    totalRaces: number
    year: number
  }
  
  let currentDrivers: Awaited<ReturnType<typeof getDrivers>> = []
  
  try {
    [championship, currentDrivers] = await Promise.all([
      getChampionshipSummary(),
      getDrivers()
    ])
  } catch {
    // Fallback en cas d'erreur API
    championship = {
      drivers: [],
      constructors: [],
      racesCompleted: 0,
      totalRaces: 24,
      year: new Date().getFullYear()
    }
  }
  
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
              🏆 Championnat F1 {championship.year}
            </h1>
            <p className="text-text-secondary mt-1">
              {championship.racesCompleted} courses sur {championship.totalRaces} • Données en direct OpenF1
            </p>
          </div>

          {/* Stats rapides */}
          {championship.drivers.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <QuickStat 
                label="Leader Pilotes" 
                value={championship.drivers[0]?.driverName.split(' ').pop() || '-'}
                detail={`${championship.drivers[0]?.points || 0} pts`}
                color={championship.drivers[0]?.teamColor}
              />
              <QuickStat 
                label="Leader Constructeurs" 
                value={championship.drivers[0]?.teamName || '-'}
                detail={`${championship.constructors[0]?.points || 0} pts`}
                color={championship.constructors[0]?.teamColor}
              />
              <QuickStat 
                label="Plus de victoires" 
                value={championship.drivers.reduce((max, d) => d.wins > max.wins ? d : max, championship.drivers[0])?.driverName.split(' ').pop() || '-'}
                detail={`${Math.max(...championship.drivers.map(d => d.wins))} victoires`}
              />
              <QuickStat 
                label="Courses restantes" 
                value={String(championship.totalRaces - championship.racesCompleted)}
                detail="Grand Prix"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Classement Pilotes */}
            <Card className="overflow-hidden p-0">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">🏎️ Classement Pilotes</h2>
                <p className="text-text-secondary text-sm mt-1">Championnat du Monde des Pilotes</p>
              </div>
              
              {championship.drivers.length === 0 ? (
                <div className="p-6 text-center text-text-muted">
                  <p>Aucune donnée disponible</p>
                  <p className="text-sm mt-2">La saison n&apos;a peut-être pas encore commencé</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {championship.drivers.slice(0, 20).map((driver) => (
                    <DriverRow key={driver.driverNumber} driver={driver} />
                  ))}
                </div>
              )}
            </Card>

            {/* Classement Constructeurs */}
            <Card className="overflow-hidden p-0">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">🏭 Classement Constructeurs</h2>
                <p className="text-text-secondary text-sm mt-1">Championnat du Monde des Constructeurs</p>
              </div>
              
              {championship.constructors.length === 0 ? (
                <div className="p-6 text-center text-text-muted">
                  <p>Aucune donnée disponible</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {championship.constructors.map((team) => (
                    <ConstructorRow key={team.teamName} team={team} />
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Liste des pilotes actuels */}
          {currentDrivers.length > 0 && (
            <Card className="mt-6">
              <CardHeader 
                title={`👥 Pilotes ${championship.year}`}
                description="Grille actuelle de la Formule 1"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {currentDrivers.map((driver) => (
                  <div 
                    key={driver.driver_number}
                    className="flex items-center gap-2 p-2 rounded-lg bg-surface-hover"
                  >
                    <div 
                      className="w-1 h-8 rounded-full"
                      style={{ backgroundColor: `#${driver.team_colour}` }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {driver.full_name}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {driver.team_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Lien vers prédictions */}
          <div className="mt-8 text-center">
            <Link 
              href="/predictions"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🎯 Faire mes prédictions pour le prochain GP
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

/**
 * QuickStat - Statistique rapide en haut de page
 */
function QuickStat({ 
  label, 
  value, 
  detail,
  color 
}: { 
  label: string
  value: string
  detail: string
  color?: string
}) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <p className="text-text-secondary text-xs mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {color && (
          <div 
            className="w-1 h-6 rounded-full"
            style={{ backgroundColor: `#${color}` }}
          />
        )}
        <p className="text-lg font-bold text-foreground">{value}</p>
      </div>
      <p className="text-primary text-sm font-medium">{detail}</p>
    </div>
  )
}

/**
 * DriverRow - Ligne du classement pilotes
 */
function DriverRow({ driver }: { driver: DriverStanding }) {
  const positionStyle = getPositionStyle(driver.position)
  
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-surface-hover transition-colors">
      {/* Position */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${positionStyle}`}>
        {driver.position}
      </div>
      
      {/* Couleur équipe */}
      <div 
        className="w-1 h-10 rounded-full"
        style={{ backgroundColor: `#${driver.teamColor}` }}
      />
      
      {/* Info pilote */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">
          {driver.driverName}
        </p>
        <p className="text-sm text-text-secondary">{driver.teamName}</p>
      </div>
      
      {/* Stats */}
      <div className="text-right">
        <p className="font-bold text-foreground">{driver.points} pts</p>
        <div className="flex gap-2 text-xs text-text-muted">
          <span>🏆 {driver.wins}</span>
          <span>🥉 {driver.podiums}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * ConstructorRow - Ligne du classement constructeurs
 */
function ConstructorRow({ team }: { team: ConstructorStanding }) {
  const positionStyle = getPositionStyle(team.position)
  
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-surface-hover transition-colors">
      {/* Position */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${positionStyle}`}>
        {team.position}
      </div>
      
      {/* Couleur équipe */}
      <div 
        className="w-1 h-10 rounded-full"
        style={{ backgroundColor: `#${team.teamColor}` }}
      />
      
      {/* Info équipe */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">{team.teamName}</p>
        <p className="text-sm text-text-muted truncate">
          {team.drivers.map(d => d.split(' ').pop()).join(' • ')}
        </p>
      </div>
      
      {/* Stats */}
      <div className="text-right">
        <p className="font-bold text-foreground">{team.points} pts</p>
        <p className="text-xs text-text-muted">🏆 {team.wins} victoires</p>
      </div>
    </div>
  )
}

/**
 * Retourne le style CSS pour une position
 */
function getPositionStyle(position: number): string {
  switch (position) {
    case 1:
      return 'bg-gold/20 text-gold border border-gold'
    case 2:
      return 'bg-silver/20 text-silver border border-silver'
    case 3:
      return 'bg-bronze/20 text-bronze border border-bronze'
    default:
      return 'bg-surface-hover text-text-secondary'
  }
}

/**
 * Profile Page - Profil utilisateur avec stats, badges et historique
 */
import { Navbar, Card, CardHeader, Avatar, Badge } from '@/components/ui'
import { currentUser, badges, grandsPrix, getDriverName } from '@/lib/mock-data'

// Historique de prédictions mocké
const predictionHistory = [
  {
    gpId: 'aus-2025',
    gpName: 'GP d\'Australie',
    winner: { predicted: 'ver', actual: 'nor', correct: false },
    pole: { predicted: 'ver', actual: 'ver', correct: true },
    points: 15,
  },
  {
    gpId: 'chn-2025',
    gpName: 'GP de Chine',
    winner: { predicted: 'nor', actual: 'nor', correct: true },
    pole: { predicted: 'lec', actual: 'nor', correct: false },
    points: 25,
  },
  {
    gpId: 'jpn-2025',
    gpName: 'GP du Japon',
    winner: { predicted: 'ver', actual: 'ver', correct: true },
    pole: { predicted: 'ver', actual: 'ver', correct: true },
    points: 40,
  },
]

// Stats calculées
const stats = {
  totalPoints: currentUser.points,
  totalPredictions: 18,
  correctPredictions: 12,
  accuracy: Math.round((12 / 18) * 100),
  bestGp: 'GP du Japon',
  bestGpPoints: 40,
  currentStreak: 2,
  bestStreak: 3,
}

export default function ProfilePage() {
  return (
    <>
      <Navbar user={{ name: currentUser.username, avatarUrl: currentUser.avatarUrl }} />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header du profil */}
          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar 
                name={currentUser.username} 
                src={currentUser.avatarUrl}
                size="xl"
                rank={currentUser.rank <= 3 ? currentUser.rank : undefined}
              />
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-foreground">{currentUser.username}</h1>
                <p className="text-text-secondary mt-1">Membre depuis décembre 2024</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                  <Badge variant="legendary">Rang #{currentUser.rank}</Badge>
                  <Badge variant="success">{currentUser.points} points</Badge>
                  <Badge variant="rare">{stats.accuracy}% précision</Badge>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statistiques */}
              <Card>
                <CardHeader title="📊 Statistiques" description="Saison 2025" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatBlock label="Points totaux" value={stats.totalPoints.toString()} />
                  <StatBlock label="Prédictions" value={`${stats.correctPredictions}/${stats.totalPredictions}`} />
                  <StatBlock label="Précision" value={`${stats.accuracy}%`} />
                  <StatBlock label="Série en cours" value={`${stats.currentStreak} 🔥`} />
                </div>
                <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
                  <div className="bg-surface-hover rounded-lg p-4">
                    <p className="text-text-secondary text-sm">Meilleur GP</p>
                    <p className="text-foreground font-semibold">{stats.bestGp}</p>
                    <p className="text-primary text-sm">+{stats.bestGpPoints} points</p>
                  </div>
                  <div className="bg-surface-hover rounded-lg p-4">
                    <p className="text-text-secondary text-sm">Meilleure série</p>
                    <p className="text-foreground font-semibold">{stats.bestStreak} prédictions</p>
                    <p className="text-gold text-sm">correctes d&apos;affilée</p>
                  </div>
                </div>
              </Card>

              {/* Historique des prédictions */}
              <Card>
                <CardHeader title="📜 Historique des prédictions" />
                <div className="space-y-4">
                  {predictionHistory.map((prediction) => (
                    <div 
                      key={prediction.gpId} 
                      className="bg-surface-hover rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-foreground">{prediction.gpName}</h4>
                        <span className="text-primary font-bold">+{prediction.points} pts</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <PredictionResult 
                          label="Vainqueur"
                          predicted={getDriverName(prediction.winner.predicted)}
                          actual={getDriverName(prediction.winner.actual)}
                          correct={prediction.winner.correct}
                        />
                        <PredictionResult 
                          label="Pole"
                          predicted={getDriverName(prediction.pole.predicted)}
                          actual={getDriverName(prediction.pole.actual)}
                          correct={prediction.pole.correct}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar - Badges */}
            <div className="space-y-6">
              <Card>
                <CardHeader 
                  title="🎖️ Collection de badges" 
                  description={`${currentUser.badges.length}/${badges.length} débloqués`}
                />
                <div className="space-y-3">
                  {badges.map((badge) => {
                    const unlocked = currentUser.badges.some((b) => b.id === badge.id)
                    return (
                      <div 
                        key={badge.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          unlocked 
                            ? 'bg-surface-hover border-border-light' 
                            : 'bg-surface border-border opacity-50'
                        }`}
                      >
                        <span className={`text-2xl ${!unlocked && 'grayscale'}`}>
                          {badge.iconUrl}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${unlocked ? 'text-foreground' : 'text-text-muted'}`}>
                            {badge.name}
                          </p>
                          <p className="text-xs text-text-secondary truncate">
                            {badge.description}
                          </p>
                        </div>
                        <Badge variant={unlocked ? badge.rarity : 'default'}>
                          {badge.rarity}
                        </Badge>
                      </div>
                    )
                  })}
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
 * StatBlock - Bloc de statistique
 */
function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-text-secondary mt-1">{label}</p>
    </div>
  )
}

/**
 * PredictionResult - Résultat d'une prédiction
 */
function PredictionResult({ 
  label, 
  predicted, 
  actual, 
  correct 
}: { 
  label: string
  predicted: string
  actual: string
  correct: boolean 
}) {
  return (
    <div>
      <p className="text-text-secondary">{label}</p>
      <div className="flex items-center gap-2">
        <span className={correct ? 'text-success' : 'text-danger'}>
          {correct ? '✓' : '✗'}
        </span>
        <span className="text-foreground">{predicted}</span>
        {!correct && (
          <span className="text-text-muted text-xs">
            (était: {actual})
          </span>
        )}
      </div>
    </div>
  )
}

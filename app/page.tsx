/**
 * Landing Page - Page d'accueil pour les visiteurs non connectés
 * Hero, features, countdown et teaser du leaderboard
 */
import { Button, Navbar } from '@/components/ui'
import { Countdown } from '@/components/features/countdown'
import { FeatureCard } from '@/components/features/feature-card'
import { LeaderboardTeaser } from '@/components/features/leaderboard-teaser'
import { nextGrandPrix, globalLeaderboard } from '@/lib/mock-data'
import Link from 'next/link'

const features = [
  {
    icon: '🎯',
    title: 'Prédictions',
    description: 'Prédis le vainqueur, le podium, la pole, le meilleur tour et plus encore pour chaque Grand Prix.',
  },
  {
    icon: '🏆',
    title: 'Ligues',
    description: 'Crée ta ligue privée, invite tes amis et affronte-les tout au long de la saison.',
  },
  {
    icon: '🎖️',
    title: 'Récompenses',
    description: 'Gagne des points, débloque des badges et grimpe au classement mondial.',
  },
]

export default function HomePage() {
  return (
    <>
      <Navbar user={null} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="text-foreground">Predict.</span>{' '}
                <span className="text-primary">Compete.</span>{' '}
                <span className="text-foreground">Win.</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
                Fais tes prédictions sur chaque Grand Prix de F1, affronte tes amis 
                dans des ligues privées et grimpe au classement mondial.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Rejoindre PitWall
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  En savoir plus
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Comment ça marche ?
              </h2>
              <p className="mt-4 text-text-secondary">
                Trois piliers pour une expérience F1 unique
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Countdown & Leaderboard Section */}
        <section className="py-16 sm:py-24 bg-surface/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Countdown */}
              <div className="text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Prochain Grand Prix
                </h2>
                <p className="text-primary font-semibold text-lg mb-8">
                  🏁 {nextGrandPrix.name}
                </p>
                <Countdown 
                  targetDate={nextGrandPrix.date} 
                  label={`${nextGrandPrix.circuit} • ${nextGrandPrix.country}`}
                />
                <div className="mt-8">
                  <Link href="/predictions">
                    <Button variant="primary">
                      Faire mes prédictions
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Leaderboard Teaser */}
              <div>
                <LeaderboardTeaser entries={globalLeaderboard} />
                <div className="mt-4 text-center">
                  <Link 
                    href="/leaderboard" 
                    className="text-primary hover:text-primary-hover text-sm font-medium"
                  >
                    Voir le classement complet →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Prêt à rejoindre la course ?
            </h2>
            <p className="text-text-secondary mb-8">
              Inscris-toi gratuitement et commence à faire tes prédictions dès maintenant.
            </p>
            <Link href="/dashboard">
              <Button size="lg">
                Créer mon compte
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold">
              <span className="text-primary">Pit</span>
              <span className="text-foreground">Wall</span>
            </div>
            <p className="text-text-secondary text-sm">
              © 2025 PitWall. Fait avec ❤️ pour les fans de F1.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

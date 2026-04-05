/**
 * PredictionsForm - Composant client pour le formulaire de prédictions
 * Reçoit les pilotes et le GP depuis le serveur
 */
'use client'

import { useState } from 'react'
import { Navbar, Card, CardHeader, Button } from '@/components/ui'
import type { OpenF1Driver, OpenF1Meeting } from '@/lib/openf1/types'
import type { User, Prediction } from '@/types'

interface PredictionsFormProps {
  drivers: OpenF1Driver[]
  nextGP: OpenF1Meeting | null
  currentUser: User
  currentPredictions: Partial<Prediction>
}

export function PredictionsForm({ 
  drivers, 
  nextGP, 
  currentUser,
  currentPredictions 
}: PredictionsFormProps) {
  // État local pour les prédictions
  const [predictions, setPredictions] = useState({
    winner: currentPredictions.winner || '',
    podium: currentPredictions.podium || ['', '', ''],
    pole: currentPredictions.pole || '',
    fastestLap: currentPredictions.fastestLap || '',
    safetyCar: currentPredictions.safetyCar,
    seasonTop5: currentPredictions.seasonTop5 || ['', '', '', '', ''],
  })

  const handleSubmit = () => {
    // Simulation de soumission
    alert('Prédictions enregistrées ! (simulation)')
  }

  // Trier les pilotes par nom
  const sortedDrivers = [...drivers].sort((a, b) => 
    a.last_name.localeCompare(b.last_name)
  )

  return (
    <>
      <Navbar user={{ name: currentUser.username, avatarUrl: currentUser.avatarUrl }} />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
              <span>🏁</span>
              <span>{nextGP?.circuit_short_name} • {nextGP?.country_name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {nextGP?.meeting_name || 'Prochain Grand Prix'}
            </h1>
            {nextGP && (
              <p className="text-text-secondary mt-1">
                Deadline : {new Date(nextGP.date_start).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>

          {/* Grille de prédictions */}
          <div className="space-y-6">
            {/* Vainqueur */}
            <Card>
              <CardHeader 
                title="🏆 Vainqueur de la course" 
                description="Qui remportera ce Grand Prix ?" 
              />
              <DriverSelect
                drivers={sortedDrivers}
                value={predictions.winner}
                onChange={(value) => setPredictions({ ...predictions, winner: value })}
                placeholder="Sélectionner le vainqueur"
              />
              <PointsIndicator points={25} description="si correct" />
            </Card>

            {/* Podium complet */}
            <Card>
              <CardHeader 
                title="🥇 Podium complet" 
                description="Prédis les 3 premières places dans l'ordre" 
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['1er', '2ème', '3ème'].map((position, index) => (
                  <div key={position}>
                    <label className="block text-sm text-text-secondary mb-2">
                      {position === '1er' ? '🥇' : position === '2ème' ? '🥈' : '🥉'} {position}
                    </label>
                    <DriverSelect
                      drivers={sortedDrivers}
                      value={predictions.podium[index]}
                      onChange={(value) => {
                        const newPodium = [...predictions.podium]
                        newPodium[index] = value
                        setPredictions({ ...predictions, podium: newPodium as [string, string, string] })
                      }}
                      placeholder={`Choisir ${position}`}
                      excludeNumbers={predictions.podium.filter((_, i) => i !== index).map(Number).filter(Boolean)}
                    />
                  </div>
                ))}
              </div>
              <PointsIndicator points={50} description="si podium exact (+10 par pilote correct)" />
            </Card>

            {/* Pole Position */}
            <Card>
              <CardHeader 
                title="⚡ Pole Position" 
                description="Qui partira en tête ?" 
              />
              <DriverSelect
                drivers={sortedDrivers}
                value={predictions.pole}
                onChange={(value) => setPredictions({ ...predictions, pole: value })}
                placeholder="Sélectionner le poleman"
              />
              <PointsIndicator points={15} description="si correct" />
            </Card>

            {/* Meilleur tour */}
            <Card>
              <CardHeader 
                title="⏱️ Meilleur tour en course" 
                description="Qui réalisera le tour le plus rapide ?" 
              />
              <DriverSelect
                drivers={sortedDrivers}
                value={predictions.fastestLap}
                onChange={(value) => setPredictions({ ...predictions, fastestLap: value })}
                placeholder="Sélectionner le pilote"
              />
              <PointsIndicator points={10} description="si correct" />
            </Card>

            {/* Safety Car */}
            <Card>
              <CardHeader 
                title="🚨 Safety Car" 
                description="Y aura-t-il un Safety Car pendant la course ?" 
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setPredictions({ ...predictions, safetyCar: true })}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                    predictions.safetyCar === true
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface border-border hover:border-border-light text-foreground'
                  }`}
                >
                  Oui
                </button>
                <button
                  onClick={() => setPredictions({ ...predictions, safetyCar: false })}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                    predictions.safetyCar === false
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface border-border hover:border-border-light text-foreground'
                  }`}
                >
                  Non
                </button>
              </div>
              <PointsIndicator points={5} description="si correct" />
            </Card>

            {/* Classement fin de saison */}
            <Card>
              <CardHeader 
                title="📊 Top 5 fin de saison" 
                description="Prédis le classement final du championnat pilotes" 
              />
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {['1er', '2ème', '3ème', '4ème', '5ème'].map((position, index) => (
                  <div key={position}>
                    <label className="block text-sm text-text-secondary mb-2 text-center">
                      {position}
                    </label>
                    <DriverSelect
                      drivers={sortedDrivers}
                      value={predictions.seasonTop5[index]}
                      onChange={(value) => {
                        const newTop5 = [...predictions.seasonTop5]
                        newTop5[index] = value
                        setPredictions({ ...predictions, seasonTop5: newTop5 })
                      }}
                      placeholder="Pilote"
                      excludeNumbers={predictions.seasonTop5.filter((_, i) => i !== index).map(Number).filter(Boolean)}
                    />
                  </div>
                ))}
              </div>
              <PointsIndicator points={100} description="si classement exact (modifiable jusqu'à mi-saison)" />
            </Card>
          </div>

          {/* Bouton de validation */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface rounded-xl border border-border p-6">
            <div>
              <p className="text-foreground font-semibold">Scoring potentiel</p>
              <p className="text-text-secondary text-sm">Jusqu&apos;à 215 points si tout est correct</p>
            </div>
            <Button size="lg" onClick={handleSubmit}>
              Valider mes prédictions
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}

/**
 * DriverSelect - Select dropdown pour choisir un pilote (avec données OpenF1)
 */
function DriverSelect({ 
  drivers,
  value, 
  onChange, 
  placeholder,
  excludeNumbers = []
}: { 
  drivers: OpenF1Driver[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  excludeNumbers?: number[]
}) {
  const availableDrivers = drivers.filter(
    (d) => !excludeNumbers.includes(d.driver_number) || String(d.driver_number) === value
  )

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
    >
      <option value="">{placeholder}</option>
      {availableDrivers.map((driver) => (
        <option key={driver.driver_number} value={driver.driver_number}>
          {driver.full_name} ({driver.team_name})
        </option>
      ))}
    </select>
  )
}

/**
 * PointsIndicator - Affiche les points potentiels
 */
function PointsIndicator({ points, description }: { points: number; description: string }) {
  return (
    <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
      <span className="text-primary font-bold">+{points} pts</span>
      <span className="text-text-secondary text-sm">{description}</span>
    </div>
  )
}

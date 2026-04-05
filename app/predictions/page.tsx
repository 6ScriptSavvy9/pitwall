/**
 * Predictions Page - Formulaire de prédiction pour un Grand Prix
 * 6 blocs de prédiction avec sélection de pilotes
 * Récupère les pilotes depuis OpenF1
 */
import { getDrivers, getNextMeeting } from '@/lib/openf1'
import { currentUser, currentPredictions } from '@/lib/mock-data'
import { PredictionsForm } from './predictions-form'

export default async function PredictionsPage() {
  // Récupère les données depuis OpenF1
  const [drivers, nextGP] = await Promise.all([
    getDrivers(),
    getNextMeeting()
  ])

  return (
    <PredictionsForm 
      drivers={drivers}
      nextGP={nextGP}
      currentUser={currentUser}
      currentPredictions={currentPredictions}
    />
  )
}

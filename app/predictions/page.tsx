/**
 * Predictions Page - Formulaire de prédiction pour un Grand Prix
 * 6 blocs de prédiction avec sélection de pilotes
 * Récupère les pilotes depuis OpenF1
 */
import { getDrivers, getNextMeeting } from '@/lib/openf1'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PredictionsForm } from './predictions-form'

export default async function PredictionsPage() {
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

  // Récupère les données depuis OpenF1
  const [drivers, nextGP] = await Promise.all([
    getDrivers(),
    getNextMeeting()
  ])

  return (
    <PredictionsForm 
      drivers={drivers}
      nextGP={nextGP}
      userName={displayName}
      userAvatar={avatarUrl}
    />
  )
}

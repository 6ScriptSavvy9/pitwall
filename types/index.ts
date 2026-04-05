/**
 * Types principaux de l'application PitWall
 */

// Pilote F1
export interface Driver {
  id: string
  name: string
  team: string
  number: number
  country: string
}

// Grand Prix
export interface GrandPrix {
  id: string
  name: string
  circuit: string
  country: string
  date: string
  flagUrl?: string
}

// Prédiction utilisateur
export interface Prediction {
  id: string
  userId: string
  gpId: string
  winner: string | null
  podium: [string, string, string] | null
  pole: string | null
  fastestLap: string | null
  safetyCar: boolean | null
  seasonTop5: string[] | null
  submittedAt: string
  locked: boolean
}

// Utilisateur
export interface User {
  id: string
  username: string
  avatarUrl?: string | null
  points: number
  rank: number
  badges: Badge[]
  createdAt: string
}

// Badge / Récompense
export interface Badge {
  id: string
  name: string
  description: string
  iconUrl: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: string
}

// Ligue
export interface League {
  id: string
  name: string
  code: string
  ownerId: string
  members: User[]
  createdAt: string
}

// Entrée du leaderboard
export interface LeaderboardEntry {
  rank: number
  user: User
  points: number
  correctPredictions: number
  bestGp?: string
}

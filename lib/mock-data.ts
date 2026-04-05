/**
 * Données mockées pour le développement
 * Pilotes F1 2025, Grand Prix, utilisateurs fictifs
 */
import { Driver, GrandPrix, User, Badge, LeaderboardEntry, Prediction } from '@/types'

// Liste des 20 pilotes F1 2025
export const drivers: Driver[] = [
  { id: 'ver', name: 'Max Verstappen', team: 'Red Bull Racing', number: 1, country: 'NL' },
  { id: 'nor', name: 'Lando Norris', team: 'McLaren', number: 4, country: 'GB' },
  { id: 'lec', name: 'Charles Leclerc', team: 'Ferrari', number: 16, country: 'MC' },
  { id: 'pia', name: 'Oscar Piastri', team: 'McLaren', number: 81, country: 'AU' },
  { id: 'ham', name: 'Lewis Hamilton', team: 'Ferrari', number: 44, country: 'GB' },
  { id: 'rus', name: 'George Russell', team: 'Mercedes', number: 63, country: 'GB' },
  { id: 'sai', name: 'Carlos Sainz', team: 'Williams', number: 55, country: 'ES' },
  { id: 'alo', name: 'Fernando Alonso', team: 'Aston Martin', number: 14, country: 'ES' },
  { id: 'str', name: 'Lance Stroll', team: 'Aston Martin', number: 18, country: 'CA' },
  { id: 'per', name: 'Sergio Pérez', team: 'Red Bull Racing', number: 11, country: 'MX' },
  { id: 'alb', name: 'Alexander Albon', team: 'Williams', number: 23, country: 'TH' },
  { id: 'gas', name: 'Pierre Gasly', team: 'Alpine', number: 10, country: 'FR' },
  { id: 'oco', name: 'Esteban Ocon', team: 'Haas', number: 31, country: 'FR' },
  { id: 'hul', name: 'Nico Hülkenberg', team: 'Sauber', number: 27, country: 'DE' },
  { id: 'tsu', name: 'Yuki Tsunoda', team: 'RB', number: 22, country: 'JP' },
  { id: 'law', name: 'Liam Lawson', team: 'RB', number: 30, country: 'NZ' },
  { id: 'bea', name: 'Oliver Bearman', team: 'Haas', number: 87, country: 'GB' },
  { id: 'ant', name: 'Kimi Antonelli', team: 'Mercedes', number: 12, country: 'IT' },
  { id: 'doo', name: 'Jack Doohan', team: 'Alpine', number: 7, country: 'AU' },
  { id: 'had', name: 'Isack Hadjar', team: 'Sauber', number: 6, country: 'FR' },
]

// Calendrier F1 2025 (quelques GP)
export const grandsPrix: GrandPrix[] = [
  { id: 'aus-2025', name: 'Grand Prix d\'Australie', circuit: 'Albert Park', country: 'Australie', date: '2025-03-16' },
  { id: 'chn-2025', name: 'Grand Prix de Chine', circuit: 'Shanghai International', country: 'Chine', date: '2025-03-23' },
  { id: 'jpn-2025', name: 'Grand Prix du Japon', circuit: 'Suzuka', country: 'Japon', date: '2025-04-06' },
  { id: 'bhr-2025', name: 'Grand Prix de Bahreïn', circuit: 'Sakhir', country: 'Bahreïn', date: '2025-04-13' },
  { id: 'sau-2025', name: 'Grand Prix d\'Arabie Saoudite', circuit: 'Jeddah Corniche', country: 'Arabie Saoudite', date: '2025-04-20' },
  { id: 'mia-2025', name: 'Grand Prix de Miami', circuit: 'Miami International', country: 'États-Unis', date: '2025-05-04' },
  { id: 'imo-2025', name: 'Grand Prix d\'Émilie-Romagne', circuit: 'Imola', country: 'Italie', date: '2025-05-18' },
  { id: 'mon-2025', name: 'Grand Prix de Monaco', circuit: 'Monaco', country: 'Monaco', date: '2025-05-25' },
  { id: 'esp-2025', name: 'Grand Prix d\'Espagne', circuit: 'Barcelona-Catalunya', country: 'Espagne', date: '2025-06-01' },
  { id: 'can-2025', name: 'Grand Prix du Canada', circuit: 'Gilles Villeneuve', country: 'Canada', date: '2025-06-15' },
]

// Prochain GP (pour les maquettes)
export const nextGrandPrix: GrandPrix = grandsPrix[3] // Bahreïn

// Badges disponibles
export const badges: Badge[] = [
  { id: 'first-prediction', name: 'Premier Pas', description: 'Faire sa première prédiction', iconUrl: '🎯', rarity: 'common' },
  { id: 'winner-streak-3', name: 'En Feu', description: '3 prédictions de vainqueur correctes d\'affilée', iconUrl: '🔥', rarity: 'rare' },
  { id: 'perfect-podium', name: 'Podium Parfait', description: 'Prédire le podium exact', iconUrl: '🏆', rarity: 'epic' },
  { id: 'season-champion', name: 'Champion', description: 'Terminer 1er du classement global', iconUrl: '👑', rarity: 'legendary' },
  { id: 'safety-car-oracle', name: 'Oracle', description: 'Prédire 5 safety cars correctement', iconUrl: '🔮', rarity: 'rare' },
  { id: 'early-bird', name: 'Lève-tôt', description: 'Soumettre ses prédictions 24h avant la deadline', iconUrl: '🐦', rarity: 'common' },
]

// Utilisateur mockée (connecté)
export const currentUser: User = {
  id: 'user-1',
  username: 'SpeedDemon42',
  avatarUrl: null,
  points: 1250,
  rank: 7,
  badges: [badges[0], badges[1], badges[5]],
  createdAt: '2024-12-01',
}

// Utilisateurs fictifs pour le leaderboard
export const mockUsers: User[] = [
  { id: 'user-2', username: 'VerstappenFan', avatarUrl: null, points: 2100, rank: 1, badges: [badges[3]], createdAt: '2024-11-15' },
  { id: 'user-3', username: 'FerrariRed', avatarUrl: null, points: 1980, rank: 2, badges: [badges[2]], createdAt: '2024-11-20' },
  { id: 'user-4', username: 'McLarenPapaya', avatarUrl: null, points: 1850, rank: 3, badges: [badges[1]], createdAt: '2024-12-05' },
  { id: 'user-5', username: 'MercedesSilver', avatarUrl: null, points: 1720, rank: 4, badges: [badges[4]], createdAt: '2024-12-10' },
  { id: 'user-6', username: 'AlonsoMagic', avatarUrl: null, points: 1650, rank: 5, badges: [badges[0]], createdAt: '2024-12-15' },
  { id: 'user-7', username: 'HamiltonLegend', avatarUrl: null, points: 1500, rank: 6, badges: [badges[5]], createdAt: '2024-12-20' },
  currentUser,
  { id: 'user-8', username: 'RBJunior', avatarUrl: null, points: 1180, rank: 8, badges: [], createdAt: '2025-01-05' },
  { id: 'user-9', username: 'PitLaneExpert', avatarUrl: null, points: 1050, rank: 9, badges: [badges[0]], createdAt: '2025-01-10' },
  { id: 'user-10', username: 'CheckeredFlag', avatarUrl: null, points: 980, rank: 10, badges: [], createdAt: '2025-01-15' },
]

// Leaderboard global
export const globalLeaderboard: LeaderboardEntry[] = mockUsers
  .sort((a, b) => a.rank - b.rank)
  .map((user) => ({
    rank: user.rank,
    user,
    points: user.points,
    correctPredictions: Math.floor(user.points / 100),
    bestGp: grandsPrix[Math.floor(Math.random() * 3)].name,
  }))

// Prédictions en cours de l'utilisateur
export const currentPredictions: Partial<Prediction> = {
  winner: 'ver',
  podium: ['ver', 'nor', 'lec'],
  pole: 'ver',
  fastestLap: null,
  safetyCar: null,
  seasonTop5: null,
}

// Activité récente de la ligue
export const leagueActivity = [
  { id: 1, user: 'FerrariRed', action: 'a soumis ses prédictions pour le GP de Bahreïn', time: 'Il y a 2h' },
  { id: 2, user: 'McLarenPapaya', action: 'a rejoint la ligue', time: 'Il y a 5h' },
  { id: 3, user: 'VerstappenFan', action: 'a gagné le badge "En Feu" 🔥', time: 'Il y a 1j' },
  { id: 4, user: 'MercedesSilver', action: 'a modifié sa prédiction de pole', time: 'Il y a 1j' },
]

// Helper pour obtenir un pilote par ID
export function getDriverById(id: string): Driver | undefined {
  return drivers.find((d) => d.id === id)
}

// Helper pour obtenir le nom d'un pilote par ID
export function getDriverName(id: string): string {
  return getDriverById(id)?.name || 'Inconnu'
}

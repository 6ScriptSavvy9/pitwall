/**
 * Client API OpenF1
 * Fournit des fonctions pour récupérer les données F1 en temps réel
 * Documentation: https://openf1.org
 */

import type {
  OpenF1Driver,
  OpenF1Meeting,
  OpenF1Session,
  OpenF1Position,
  OpenF1RaceControl,
} from './types'

const BASE_URL = 'https://api.openf1.org/v1'

/**
 * Fonction générique pour appeler l'API OpenF1
 */
async function fetchOpenF1<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 }, // Cache pendant 60 secondes (Next.js)
  })

  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Récupère la liste des pilotes de la session la plus récente
 */
export async function getDrivers(): Promise<OpenF1Driver[]> {
  return fetchOpenF1<OpenF1Driver[]>('/drivers', { session_key: 'latest' })
}

/**
 * Récupère la liste des pilotes pour une session spécifique
 */
export async function getDriversBySession(sessionKey: number): Promise<OpenF1Driver[]> {
  return fetchOpenF1<OpenF1Driver[]>('/drivers', { session_key: sessionKey })
}

/**
 * Récupère tous les meetings (Grand Prix) d'une année
 */
export async function getMeetings(year: number = 2025): Promise<OpenF1Meeting[]> {
  const meetings = await fetchOpenF1<OpenF1Meeting[]>('/meetings', { year })
  // Filtrer les tests de pré-saison
  return meetings.filter(m => m.meeting_name.includes('Grand Prix'))
}

/**
 * Récupère les sessions d'un meeting spécifique
 */
export async function getSessions(meetingKey: number): Promise<OpenF1Session[]> {
  return fetchOpenF1<OpenF1Session[]>('/sessions', { meeting_key: meetingKey })
}

/**
 * Récupère la session la plus récente
 */
export async function getLatestSession(): Promise<OpenF1Session | null> {
  const sessions = await fetchOpenF1<OpenF1Session[]>('/sessions', { session_key: 'latest' })
  return sessions[0] || null
}

/**
 * Récupère le prochain Grand Prix (le premier dont la date est dans le futur)
 */
export async function getNextMeeting(): Promise<OpenF1Meeting | null> {
  const meetings = await getMeetings(2025)
  const now = new Date()
  
  const upcoming = meetings.find(m => new Date(m.date_end) > now)
  return upcoming || meetings[meetings.length - 1] || null
}

/**
 * Récupère les positions finales d'une course
 */
export async function getRacePositions(sessionKey: number): Promise<OpenF1Position[]> {
  const positions = await fetchOpenF1<OpenF1Position[]>('/position', { session_key: sessionKey })
  
  // Récupérer la dernière position de chaque pilote
  const latestPositions = new Map<number, OpenF1Position>()
  positions.forEach(p => {
    const existing = latestPositions.get(p.driver_number)
    if (!existing || new Date(p.date) > new Date(existing.date)) {
      latestPositions.set(p.driver_number, p)
    }
  })
  
  return Array.from(latestPositions.values()).sort((a, b) => a.position - b.position)
}

/**
 * Récupère les messages de contrôle de course (Safety Car, drapeaux, etc.)
 */
export async function getRaceControl(sessionKey: number): Promise<OpenF1RaceControl[]> {
  return fetchOpenF1<OpenF1RaceControl[]>('/race_control', { session_key: sessionKey })
}

/**
 * Vérifie s'il y a eu un Safety Car pendant une session
 */
export async function hadSafetyCar(sessionKey: number): Promise<boolean> {
  const messages = await getRaceControl(sessionKey)
  return messages.some(m => 
    m.message.toLowerCase().includes('safety car') || 
    m.flag === 'YELLOW' && m.scope === 'Track'
  )
}

/**
 * Récupère le pilote ayant fait le meilleur tour
 * Note: Nécessite de parcourir les laps de la session
 */
export async function getFastestLapDriver(sessionKey: number): Promise<number | null> {
  interface LapData {
    driver_number: number
    lap_duration: number | null
    is_pit_out_lap: boolean
  }
  
  const laps = await fetchOpenF1<LapData[]>('/laps', { session_key: sessionKey })
  
  let fastestDriverNumber: number | null = null
  let fastestDuration: number | null = null
  
  for (const lap of laps) {
    if (lap.lap_duration && !lap.is_pit_out_lap) {
      if (fastestDuration === null || lap.lap_duration < fastestDuration) {
        fastestDriverNumber = lap.driver_number
        fastestDuration = lap.lap_duration
      }
    }
  }
  
  return fastestDriverNumber
}

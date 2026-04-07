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

// Système de points F1 standard
const POINTS_SYSTEM: Record<number, number> = {
  1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
  6: 8, 7: 6, 8: 4, 9: 2, 10: 1
}

// Points pour les sprints
const SPRINT_POINTS: Record<number, number> = {
  1: 8, 2: 7, 3: 6, 4: 5, 5: 4,
  6: 3, 7: 2, 8: 1
}

/**
 * Fonction générique pour appeler l'API OpenF1
 * Cache agressif pour éviter les rate limits (revalidate: 3600s = 1h)
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
    next: { revalidate: 3600 }, // Cache pendant 1h pour éviter les rate limits
  })

  if (!response.ok) {
    // En cas d'erreur 429, retourner un tableau vide plutôt que crasher
    if (response.status === 429) {
      console.warn(`OpenF1 rate limit hit for ${endpoint}, returning empty result`)
      return [] as T
    }
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
export async function getMeetings(year: number = 2026): Promise<OpenF1Meeting[]> {
  const meetings = await fetchOpenF1<OpenF1Meeting[]>('/meetings', { year })
  // Filtrer les tests de pré-saison
  return meetings.filter(m => m.meeting_name.includes('Grand Prix'))
}

/**
 * Récupère les meetings avec fallback sur l'année précédente si pas de données
 */
export async function getMeetingsWithFallback(): Promise<{ meetings: OpenF1Meeting[], year: number }> {
  const currentYear = new Date().getFullYear()
  
  // Essayer l'année courante
  let meetings = await getMeetings(currentYear)
  if (meetings.length > 0) {
    return { meetings, year: currentYear }
  }
  
  // Fallback sur l'année précédente
  meetings = await getMeetings(currentYear - 1)
  return { meetings, year: currentYear - 1 }
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
  const { meetings } = await getMeetingsWithFallback()
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

/**
 * Récupère les courses passées avec leurs résultats (avec fallback automatique)
 */
export async function getPastRaces(year?: number): Promise<OpenF1Meeting[]> {
  const { meetings, year: actualYear } = year 
    ? { meetings: await getMeetings(year), year } 
    : await getMeetingsWithFallback()
  
  const now = new Date()
  
  // Retourner les courses terminées (date_end dans le passé)
  return meetings.filter(m => new Date(m.date_end) < now)
}

/**
 * Résultat de course enrichi avec infos pilote
 */
export interface RaceResult {
  position: number
  driverNumber: number
  driverName: string
  driverAcronym: string
  teamName: string
  teamColor: string
}

/**
 * Récupère les résultats complets d'une course (positions + noms pilotes)
 */
export async function getRaceResults(meetingKey: number): Promise<RaceResult[]> {
  // Récupérer les sessions de ce meeting
  const sessions = await getSessions(meetingKey)
  
  // Trouver la vraie session "Race" (pas le sprint)
  const raceSession = sessions.find(s => s.session_name === 'Race')
  if (!raceSession) return []
  
  // Récupérer les positions et les pilotes en parallèle
  const [positions, drivers] = await Promise.all([
    getRacePositions(raceSession.session_key),
    getDriversBySession(raceSession.session_key)
  ])
  
  // Mapper les positions avec les infos pilotes
  return positions.map(pos => {
    const driver = drivers.find(d => d.driver_number === pos.driver_number)
    return {
      position: pos.position,
      driverNumber: pos.driver_number,
      driverName: driver?.full_name || `Driver #${pos.driver_number}`,
      driverAcronym: driver?.name_acronym || '???',
      teamName: driver?.team_name || 'Unknown',
      teamColor: driver?.team_colour || '333333'
    }
  })
}

/**
 * Récupère le vainqueur et le poleman d'une course
 */
export async function getRaceWinnerAndPole(meetingKey: number): Promise<{
  winner: RaceResult | null
  pole: RaceResult | null
}> {
  const sessions = await getSessions(meetingKey)
  
  // Utiliser session_name pour différencier la course du sprint
  const raceSession = sessions.find(s => s.session_name === 'Race')
  const qualiSession = sessions.find(s => s.session_name === 'Qualifying')
  
  let winner: RaceResult | null = null
  let pole: RaceResult | null = null
  
  if (raceSession) {
    const results = await getRaceResults(meetingKey)
    winner = results.find(r => r.position === 1) || null
  }
  
  if (qualiSession) {
    const [positions, drivers] = await Promise.all([
      getRacePositions(qualiSession.session_key),
      getDriversBySession(qualiSession.session_key)
    ])
    
    const polePosition = positions.find(p => p.position === 1)
    if (polePosition) {
      const driver = drivers.find(d => d.driver_number === polePosition.driver_number)
      pole = {
        position: 1,
        driverNumber: polePosition.driver_number,
        driverName: driver?.full_name || `Driver #${polePosition.driver_number}`,
        driverAcronym: driver?.name_acronym || '???',
        teamName: driver?.team_name || 'Unknown',
        teamColor: driver?.team_colour || '333333'
      }
    }
  }
  
  return { winner, pole }
}

/**
 * Classement pilote calculé
 */
export interface DriverStanding {
  position: number
  driverNumber: number
  driverName: string
  driverAcronym: string
  teamName: string
  teamColor: string
  points: number
  wins: number
  podiums: number
  headshotUrl?: string
}

/**
 * Classement constructeur calculé
 */
export interface ConstructorStanding {
  position: number
  teamName: string
  teamColor: string
  points: number
  wins: number
  drivers: string[]
}

/**
 * Calcule le classement pilotes à partir des résultats de toutes les courses
 */
export async function getDriverStandings(year: number = 2026): Promise<DriverStanding[]> {
  const pastRaces = await getPastRaces(year)
  
  // Map pour accumuler les points par pilote
  const driverPoints = new Map<number, {
    driverName: string
    driverAcronym: string
    teamName: string
    teamColor: string
    points: number
    wins: number
    podiums: number
    headshotUrl?: string
  }>()
  
  // Parcourir chaque course terminée
  for (const race of pastRaces) {
    try {
      const sessions = await getSessions(race.meeting_key)
      // Chercher la vraie course (session_name === "Race") et non le sprint
      const raceSession = sessions.find(s => s.session_name === 'Race')
      // Le sprint a session_type === 'Race' mais session_name === 'Sprint'
      const sprintSession = sessions.find(s => s.session_name === 'Sprint')
      
      // Points de la course principale
      if (raceSession) {
        const [positions, drivers, fastestLapDriver] = await Promise.all([
          getRacePositions(raceSession.session_key),
          getDriversBySession(raceSession.session_key),
          getFastestLapDriver(raceSession.session_key)
        ])
        
        // Vérifier si le pilote avec le meilleur tour est dans le top 10
        const fastestLapInTop10 = fastestLapDriver && 
          positions.some(p => p.driver_number === fastestLapDriver && p.position <= 10)
        
        for (const pos of positions) {
          const driver = drivers.find(d => d.driver_number === pos.driver_number)
          if (!driver) continue
          
          let points = POINTS_SYSTEM[pos.position] || 0
          
          // Ajouter le point bonus du meilleur tour si dans le top 10
          if (fastestLapInTop10 && pos.driver_number === fastestLapDriver) {
            points += 1
          }
          
          const current = driverPoints.get(pos.driver_number) || {
            driverName: driver.full_name,
            driverAcronym: driver.name_acronym,
            teamName: driver.team_name,
            teamColor: driver.team_colour,
            points: 0,
            wins: 0,
            podiums: 0,
            headshotUrl: driver.headshot_url
          }
          
          current.points += points
          if (pos.position === 1) current.wins++
          if (pos.position <= 3) current.podiums++
          
          driverPoints.set(pos.driver_number, current)
        }
      }
      
      // Points du sprint (si présent)
      if (sprintSession) {
        const positions = await getRacePositions(sprintSession.session_key)
        for (const pos of positions) {
          const current = driverPoints.get(pos.driver_number)
          if (current) {
            current.points += SPRINT_POINTS[pos.position] || 0
          }
        }
      }
    } catch {
      // Ignorer les erreurs pour une course individuelle
      continue
    }
  }
  
  // Convertir en tableau et trier par points
  const standings = Array.from(driverPoints.entries())
    .map(([driverNumber, data]) => ({
      position: 0,
      driverNumber,
      ...data
    }))
    .sort((a, b) => b.points - a.points || b.wins - a.wins)
  
  // Assigner les positions
  standings.forEach((driver, index) => {
    driver.position = index + 1
  })
  
  return standings
}

/**
 * Calcule le classement constructeurs à partir du classement pilotes
 */
export async function getConstructorStandings(year: number = 2026): Promise<ConstructorStanding[]> {
  const driverStandings = await getDriverStandings(year)
  
  // Grouper par équipe
  const teamData = new Map<string, {
    teamColor: string
    points: number
    wins: number
    drivers: string[]
  }>()
  
  for (const driver of driverStandings) {
    const current = teamData.get(driver.teamName) || {
      teamColor: driver.teamColor,
      points: 0,
      wins: 0,
      drivers: []
    }
    
    current.points += driver.points
    current.wins += driver.wins
    current.drivers.push(driver.driverName)
    
    teamData.set(driver.teamName, current)
  }
  
  // Convertir et trier
  const standings = Array.from(teamData.entries())
    .map(([teamName, data]) => ({
      position: 0,
      teamName,
      ...data
    }))
    .sort((a, b) => b.points - a.points || b.wins - a.wins)
  
  standings.forEach((team, index) => {
    team.position = index + 1
  })
  
  return standings
}

/**
 * Récupère un résumé rapide du championnat (top 3 pilotes, top 3 constructeurs)
 * Optimisé pour éviter trop d'appels API - avec fallback automatique sur l'année
 */
export async function getChampionshipSummary(year?: number): Promise<{
  drivers: DriverStanding[]
  constructors: ConstructorStanding[]
  racesCompleted: number
  totalRaces: number
  year: number
}> {
  // Utiliser le fallback si pas d'année spécifiée
  const { meetings: allMeetings, year: actualYear } = year 
    ? { meetings: await getMeetings(year), year }
    : await getMeetingsWithFallback()
  
  const driverStandings = await getDriverStandings(actualYear)
  
  const now = new Date()
  const completedRaces = allMeetings.filter(m => 
    m.meeting_name.includes('Grand Prix') && new Date(m.date_end) < now
  ).length
  const totalRaces = allMeetings.filter(m => m.meeting_name.includes('Grand Prix')).length
  
  // Calculer constructeurs à partir des drivers (évite un appel API supplémentaire)
  const teamData = new Map<string, {
    teamColor: string
    points: number
    wins: number
    drivers: string[]
  }>()
  
  for (const driver of driverStandings) {
    const current = teamData.get(driver.teamName) || {
      teamColor: driver.teamColor,
      points: 0,
      wins: 0,
      drivers: []
    }
    current.points += driver.points
    current.wins += driver.wins
    current.drivers.push(driver.driverName)
    teamData.set(driver.teamName, current)
  }
  
  const constructorStandings = Array.from(teamData.entries())
    .map(([teamName, data], index) => ({
      position: index + 1,
      teamName,
      ...data
    }))
    .sort((a, b) => b.points - a.points)
  
  constructorStandings.forEach((team, index) => {
    team.position = index + 1
  })
  
  return {
    drivers: driverStandings,
    constructors: constructorStandings,
    racesCompleted: completedRaces,
    totalRaces,
    year: actualYear
  }
}

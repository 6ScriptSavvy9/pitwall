/**
 * Types pour l'API OpenF1
 * Documentation: https://openf1.org
 */

// Pilote F1 depuis l'API
export interface OpenF1Driver {
  meeting_key: number
  session_key: number
  driver_number: number
  broadcast_name: string
  full_name: string
  name_acronym: string
  team_name: string
  team_colour: string
  first_name: string
  last_name: string
  headshot_url: string
  country_code: string | null
}

// Grand Prix / Meeting
export interface OpenF1Meeting {
  meeting_key: number
  meeting_name: string
  meeting_official_name: string
  location: string
  country_key: number
  country_code: string
  country_name: string
  country_flag: string
  circuit_key: number
  circuit_short_name: string
  circuit_type: string
  circuit_image: string
  gmt_offset: string
  date_start: string
  date_end: string
  year: number
}

// Session (FP1, FP2, FP3, Quali, Sprint, Race)
export interface OpenF1Session {
  meeting_key: number
  session_key: number
  session_name: string
  session_type: 'Practice' | 'Qualifying' | 'Sprint' | 'Race'
  date_start: string
  date_end: string
  gmt_offset: string
}

// Position en course
export interface OpenF1Position {
  meeting_key: number
  session_key: number
  driver_number: number
  position: number
  date: string
}

// Résultat de tour
export interface OpenF1Lap {
  meeting_key: number
  session_key: number
  driver_number: number
  lap_number: number
  lap_duration: number | null
  duration_sector_1: number | null
  duration_sector_2: number | null
  duration_sector_3: number | null
  is_pit_out_lap: boolean
}

// Pit stop
export interface OpenF1PitStop {
  meeting_key: number
  session_key: number
  driver_number: number
  lap_number: number
  pit_duration: number
  date: string
}

// Message de contrôle de course (Safety Car, drapeaux, etc.)
export interface OpenF1RaceControl {
  meeting_key: number
  session_key: number
  date: string
  category: string
  flag: string | null
  message: string
  scope: string | null
  driver_number: number | null
}

// Classement pilote (standings)
export interface OpenF1DriverStanding {
  meeting_key: number
  driver_number: number
  position: number
  points: number
}

// Météo
export interface OpenF1Weather {
  meeting_key: number
  session_key: number
  date: string
  air_temperature: number
  track_temperature: number
  humidity: number
  wind_speed: number
  wind_direction: number
  rainfall: number
}

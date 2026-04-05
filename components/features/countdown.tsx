/**
 * Countdown - Compte à rebours vers le prochain Grand Prix
 * Affiche jours, heures, minutes, secondes
 */
'use client'

import { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: string
  label?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - new Date().getTime()
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export function Countdown({ targetDate, label }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const timeBlocks = [
    { value: timeLeft.days, label: 'Jours' },
    { value: timeLeft.hours, label: 'Heures' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ]

  return (
    <div className="text-center">
      {label && <p className="text-text-secondary mb-4 text-sm">{label}</p>}
      <div className="flex justify-center gap-3 sm:gap-4">
        {timeBlocks.map((block) => (
          <div key={block.label} className="flex flex-col items-center">
            <div className="bg-surface border border-border rounded-lg w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">
                {block.value.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs text-text-secondary mt-2">{block.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

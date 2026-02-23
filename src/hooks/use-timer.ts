import { useState, useEffect, useCallback } from 'react'

interface UseTimerReturn {
  isRunning: boolean
  isPaused: boolean
  remainingSeconds: number
  totalSeconds: number
  currentTask: any | null
  startTimer: (taskId: string, durationMinutes: number) => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
}

export function useTimer(): UseTimerReturn {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60)
  const [totalSeconds, setTotalSeconds] = useState(25 * 60)
  const [currentTask, setCurrentTask] = useState<any>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning && !isPaused && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            // Timer finished
            setIsRunning(false)
            // Play sound
            const audio = new Audio('/notification.mp3')
            audio.play().catch(console.error)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, remainingSeconds])

  const startTimer = useCallback((taskId: string, durationMinutes: number) => {
    const seconds = durationMinutes * 60
    setTotalSeconds(seconds)
    setRemainingSeconds(seconds)
    setIsRunning(true)
    setIsPaused(false)
    // TODO: Fetch task details
    setCurrentTask({ id: taskId, name: `任务 ${taskId}` })
  }, [])

  const pauseTimer = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resumeTimer = useCallback(() => {
    setIsPaused(false)
  }, [])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    setRemainingSeconds(totalSeconds)
  }, [totalSeconds])

  return {
    isRunning,
    isPaused,
    remainingSeconds,
    totalSeconds,
    currentTask,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
  }
}
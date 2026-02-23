export interface TimerState {
  isRunning: boolean
  isPaused: boolean
  remainingSeconds: number
  totalSeconds: number
  currentTaskId: string | null
  currentSessionId: string | null
}

export interface TimerSettings {
  durationMinutes: number
  soundEnabled: boolean
  autoStartBreak: boolean
}

export interface FocusSession {
  id: string
  taskId: string
  startTime: Date
  endTime: Date | null
  durationMinutes: number
  isValid: boolean
  createdAt: Date
}
export interface DailyStat {
  date: string
  focusCount: number
  totalMinutes: number
}

export interface TagStat {
  tag: 'work' | 'study' | 'sport' | 'leisure'
  totalMinutes: number
  percentage: number
}

export interface HistoryRecord {
  id: string
  taskName: string
  tag: 'work' | 'study' | 'sport' | 'leisure'
  totalMinutes: number
  completedAt: Date
}
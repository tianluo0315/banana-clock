export interface DatabaseTask {
  id: string
  name: string
  tag: 'work' | 'study' | 'sport' | 'leisure'
  target_minutes: number
  accumulated_minutes: number
  status: 'waiting' | 'in_progress' | 'completed'
  created_at: string
  updated_at: string
}

export interface DatabaseFocusSession {
  id: string
  task_id: string
  start_time: string
  end_time: string | null
  duration_minutes: number
  is_valid: number // SQLite uses 0/1 for boolean
  created_at: string
}

export interface DatabaseDailyStat {
  id: number
  date: string
  focus_count: number
  total_minutes: number
  created_at: string
}
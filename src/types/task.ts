export type TaskTag = 'work' | 'study' | 'sport' | 'leisure'
export type TaskStatus = 'waiting' | 'in_progress' | 'completed'

export interface Task {
  id: string
  name: string
  tag: TaskTag
  targetMinutes: number
  accumulatedMinutes: number
  status: TaskStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateTaskInput {
  name: string
  tag: TaskTag
  targetMinutes?: number
}

export interface UpdateTaskInput {
  name?: string
  tag?: TaskTag
  targetMinutes?: number
  accumulatedMinutes?: number
  status?: TaskStatus
}
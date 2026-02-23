export const DEFAULT_TIMER_DURATION = 25 * 60 // 25 minutes in seconds
export const TAGS = ['work', 'study', 'sport', 'leisure'] as const

export const TAG_COLORS = {
  work: '#118AB2',
  study: '#06D6A0',
  sport: '#FFD166',
  leisure: '#EF476F',
} as const

export const TAG_LABELS = {
  work: '工作',
  study: '学习',
  sport: '运动',
  leisure: '休闲',
} as const

export const STATUS_LABELS = {
  waiting: '等待中',
  in_progress: '进行中',
  completed: '已完成',
} as const

export const STATUS_COLORS = {
  waiting: 'bg-gray-200 text-gray-800',
  in_progress: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
} as const

export const TIMER_PRESETS = [
  { label: '25分钟', value: 25 },
  { label: '30分钟', value: 30 },
  { label: '40分钟', value: 40 },
  { label: '50分钟', value: 50 },
  { label: '60分钟', value: 60 },
] as const
import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Task } from '../types/task'
import { TimerState } from '../types/timer'

interface AppState {
  tasks: Task[]
  timer: TimerState
  dailyStats: any[]
  tagStats: any[]
}

type AppAction = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'UPDATE_TIMER'; payload: Partial<TimerState> }
  | { type: 'SET_STATS'; payload: { daily: any[]; tags: any[] } }

const initialState: AppState = {
  tasks: [],
  timer: {
    isRunning: false,
    isPaused: false,
    remainingSeconds: 25 * 60,
    totalSeconds: 25 * 60,
    currentTaskId: null,
    currentSessionId: null,
  },
  dailyStats: [],
  tagStats: [],
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
      }
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      }
    
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
    
    case 'UPDATE_TIMER':
      return {
        ...state,
        timer: { ...state.timer, ...action.payload },
      }
    
    case 'SET_STATS':
      return {
        ...state,
        dailyStats: action.payload.daily,
        tagStats: action.payload.tags,
      }
    
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}
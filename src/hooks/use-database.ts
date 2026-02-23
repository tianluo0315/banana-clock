import { useCallback } from 'react'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Extend window interface
declare global {
  interface Window {
    electronAPI: {
      createTask: (taskData: any) => Promise<ApiResponse<any>>
      updateTask: (taskId: string, updates: any) => Promise<ApiResponse<any>>
      deleteTask: (taskId: string) => Promise<ApiResponse<boolean>>
      getAllTasks: () => Promise<ApiResponse<any[]>>
      startTimer: (taskId: string, durationMinutes: number) => Promise<ApiResponse<any>>
      pauseTimer: () => Promise<ApiResponse<void>>
      resetTimer: () => Promise<ApiResponse<void>>
      getTimerState: () => Promise<ApiResponse<any>>
      getDailyStats: (days: number) => Promise<ApiResponse<any[]>>
      getStatsByTag: () => Promise<ApiResponse<any[]>>
      setAlwaysOnTop: (enabled: boolean) => Promise<ApiResponse<void>>
      minimizeToTray: () => Promise<ApiResponse<void>>
      onTimerUpdate: (callback: (event: any, state: any) => void) => void
      onTaskUpdate: (callback: (event: any, tasks: any[]) => void) => void
    }
  }
}

export function useDatabase() {
  const createTask = useCallback(async (taskData: any) => {
    try {
      return await window.electronAPI.createTask(taskData)
    } catch (error) {
      console.error('Failed to create task:', error)
      return { success: false, error: error.message }
    }
  }, [])

  const updateTask = useCallback(async (taskId: string, updates: any) => {
    try {
      return await window.electronAPI.updateTask(taskId, updates)
    } catch (error) {
      console.error('Failed to update task:', error)
      return { success: false, error: error.message }
    }
  }, [])

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      return await window.electronAPI.deleteTask(taskId)
    } catch (error) {
      console.error('Failed to delete task:', error)
      return { success: false, error: error.message }
    }
  }, [])

  const getAllTasks = useCallback(async () => {
    try {
      return await window.electronAPI.getAllTasks()
    } catch (error) {
      console.error('Failed to get tasks:', error)
      return { success: false, error: error.message, data: [] }
    }
  }, [])

  const startTimer = useCallback(async (taskId: string, durationMinutes: number) => {
    try {
      return await window.electronAPI.startTimer(taskId, durationMinutes)
    } catch (error) {
      console.error('Failed to start timer:', error)
      return { success: false, error: error.message }
    }
  }, [])

  const pauseTimer = useCallback(async () => {
    try {
      return await window.electronAPI.pauseTimer()
    } catch (error) {
      console.error('Failed to pause timer:', error)
      return { success: false, error: error.message }
    }
  }, [])

  const resetTimer = useCallback(async () => {
    try {
      return await window.electronAPI.resetTimer()
    } catch (error) {
      console.error('Failed to reset timer:', error)
      return { success: false, error: error.message }
    }
  }, [])

  const getTimerState = useCallback(async () => {
    try {
      return await window.electronAPI.getTimerState()
    } catch (error) {
      console.error('Failed to get timer state:', error)
      return { success: false, error: error.message }
    }
  }, [])

  const getDailyStats = useCallback(async (days = 7) => {
    try {
      return await window.electronAPI.getDailyStats(days)
    } catch (error) {
      console.error('Failed to get daily stats:', error)
      return { success: false, error: error.message, data: [] }
    }
  }, [])

  const getStatsByTag = useCallback(async () => {
    try {
      return await window.electronAPI.getStatsByTag()
    } catch (error) {
      console.error('Failed to get tag stats:', error)
      return { success: false, error: error.message, data: [] }
    }
  }, [])

  const setAlwaysOnTop = useCallback(async (enabled: boolean) => {
    try {
      return await window.electronAPI.setAlwaysOnTop(enabled)
    } catch (error) {
      console.error('Failed to set always on top:', error)
      return { success: false, error: error.message }
    }
  }, [])

  const minimizeToTray = useCallback(async () => {
    try {
      return await window.electronAPI.minimizeToTray()
    } catch (error) {
      console.error('Failed to minimize to tray:', error)
      return { success: false, error: error.message }
    }
  }, [])

  return {
    createTask,
    updateTask,
    deleteTask,
    getAllTasks,
    startTimer,
    pauseTimer,
    resetTimer,
    getTimerState,
    getDailyStats,
    getStatsByTag,
    setAlwaysOnTop,
    minimizeToTray,
  }
}
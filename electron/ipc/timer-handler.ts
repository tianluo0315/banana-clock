import { ipcMain, BrowserWindow } from 'electron'
import { getDatabase } from '../database/db-manager'
import { TaskModel } from '../database/models/task-model'
import { FocusSessionModel } from '../database/models/focus-session-model'
import { StatsModel } from '../database/models/stats-model'

let currentSessionId: string | null = null
let currentTaskId: string | null = null
let timerInterval: NodeJS.Timeout | null = null
let remainingSeconds: number = 0

export function setupTimerHandlers() {
  const taskModel = new TaskModel(getDatabase())
  const sessionModel = new FocusSessionModel(getDatabase())
  const statsModel = new StatsModel(getDatabase())

  ipcMain.handle('timer:start', async (event, taskId, durationMinutes) => {
    try {
      // Stop any existing timer
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }

      // Create new focus session
      const session = sessionModel.create(taskId)
      currentSessionId = session.id
      currentTaskId = taskId
      remainingSeconds = durationMinutes * 60

      // Update task status
      taskModel.update(taskId, { status: 'in_progress' })

      // Start timer
      timerInterval = setInterval(() => {
        remainingSeconds--
        
        // Broadcast timer update to all windows
        BrowserWindow.getAllWindows().forEach(window => {
          window.webContents.send('timer:update', {
            isRunning: true,
            isPaused: false,
            remainingSeconds,
            totalSeconds: durationMinutes * 60,
            currentTaskId,
            currentSessionId,
          })
        })

        if (remainingSeconds <= 0) {
          // Timer finished
          if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = null
          }

          // Complete session
          sessionModel.complete(session.id, durationMinutes, true)
          
          // Update task accumulated time
          taskModel.addAccumulatedMinutes(taskId, durationMinutes)
          
          // Update daily stats
          const today = new Date().toISOString().split('T')[0]
          statsModel.updateDailyStats(today)

          // Reset state
          currentSessionId = null
          currentTaskId = null

          // Send completion event
          BrowserWindow.getAllWindows().forEach(window => {
            window.webContents.send('timer:complete', {
              taskId,
              durationMinutes,
            })
          })
        }
      }, 1000)

      return { success: true, data: { sessionId: session.id } }
    } catch (error) {
      console.error('Failed to start timer:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('timer:pause', async () => {
    try {
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }
      
      return { success: true }
    } catch (error) {
      console.error('Failed to pause timer:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('timer:resume', async () => {
    try {
      if (!currentSessionId || remainingSeconds <= 0) {
        return { success: false, error: 'No active timer' }
      }

      if (timerInterval) {
        clearInterval(timerInterval)
      }

      timerInterval = setInterval(() => {
        remainingSeconds--
        
        BrowserWindow.getAllWindows().forEach(window => {
          window.webContents.send('timer:update', {
            isRunning: true,
            isPaused: false,
            remainingSeconds,
            currentTaskId,
            currentSessionId,
          })
        })

        if (remainingSeconds <= 0) {
          // Timer finished
          if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = null
          }

          // Complete session
          const durationMinutes = Math.ceil(remainingSeconds / 60)
          sessionModel.complete(currentSessionId!, durationMinutes, true)
          
          // Update task accumulated time
          if (currentTaskId) {
            taskModel.addAccumulatedMinutes(currentTaskId, durationMinutes)
          }

          // Reset state
          currentSessionId = null
          currentTaskId = null
        }
      }, 1000)

      return { success: true }
    } catch (error) {
      console.error('Failed to resume timer:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('timer:reset', async () => {
    try {
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }

      if (currentSessionId) {
        // Mark session as invalid
        sessionModel.complete(currentSessionId, 0, false)
      }

      // Reset task status if it was in progress
      if (currentTaskId) {
        taskModel.update(currentTaskId, { status: 'waiting' })
      }

      currentSessionId = null
      currentTaskId = null
      remainingSeconds = 0

      return { success: true }
    } catch (error) {
      console.error('Failed to reset timer:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('timer:get-state', async () => {
    return {
      isRunning: timerInterval !== null,
      isPaused: false, // We track pause state separately
      remainingSeconds,
      currentTaskId,
      currentSessionId,
    }
  })
}
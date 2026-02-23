import { ipcMain } from 'electron'
import { getDatabase } from '../database/db-manager'
import { TaskModel } from '../database/models/task-model'

export function setupTaskHandlers() {
  const taskModel = new TaskModel(getDatabase())

  ipcMain.handle('task:create', async (event, taskData) => {
    try {
      const task = taskModel.create(taskData)
      return { success: true, data: task }
    } catch (error) {
      console.error('Failed to create task:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('task:update', async (event, taskId, updates) => {
    try {
      const task = taskModel.update(taskId, updates)
      if (!task) {
        return { success: false, error: 'Task not found' }
      }
      return { success: true, data: task }
    } catch (error) {
      console.error('Failed to update task:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('task:delete', async (event, taskId) => {
    try {
      const success = taskModel.delete(taskId)
      return { success, error: success ? null : 'Task not found' }
    } catch (error) {
      console.error('Failed to delete task:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('task:get-all', async () => {
    try {
      const tasks = taskModel.getAll()
      return { success: true, data: tasks }
    } catch (error) {
      console.error('Failed to get tasks:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('task:get-by-status', async (event, status) => {
    try {
      const tasks = taskModel.getByStatus(status)
      return { success: true, data: tasks }
    } catch (error) {
      console.error('Failed to get tasks by status:', error)
      return { success: false, error: error.message }
    }
  })
}
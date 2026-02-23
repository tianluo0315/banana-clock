import { ipcMain } from 'electron'
import { getDatabase } from '../database/db-manager'
import { StatsModel } from '../database/models/stats-model'

export function setupStatsHandlers() {
  const statsModel = new StatsModel(getDatabase())

  ipcMain.handle('stats:get-daily', async (event, days = 7) => {
    try {
      const data = statsModel.getDailyStats(days)
      return { success: true, data }
    } catch (error) {
      console.error('Failed to get daily stats:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('stats:get-by-tag', async () => {
    try {
      const data = statsModel.getTagStats()
      return { success: true, data }
    } catch (error) {
      console.error('Failed to get tag stats:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('stats:get-history', async (event, limit = 20) => {
    try {
      const data = statsModel.getHistoryRecords(limit)
      return { success: true, data }
    } catch (error) {
      console.error('Failed to get history records:', error)
      return { success: false, error: error.message }
    }
  })
}
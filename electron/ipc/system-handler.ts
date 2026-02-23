import { ipcMain, BrowserWindow } from 'electron'

let windowManager: any = null

export function setupSystemHandlers(win: BrowserWindow) {
  // Lazy import to avoid circular dependencies
  const { WindowManager } = require('../system/window-manager.js')
  windowManager = new WindowManager(win)

  ipcMain.handle('system:set-always-on-top', async (event, enabled: boolean) => {
    try {
      windowManager.setAlwaysOnTop(enabled)
      return { success: true }
    } catch (error) {
      console.error('Failed to set always on top:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('system:minimize-to-tray', async () => {
    try {
      windowManager.minimizeToTray()
      return { success: true }
    } catch (error) {
      console.error('Failed to minimize to tray:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('system:restore-from-tray', async () => {
    try {
      windowManager.restoreFromTray()
      return { success: true }
    } catch (error) {
      console.error('Failed to restore from tray:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('system:toggle-always-on-top', async () => {
    try {
      const enabled = windowManager.toggleAlwaysOnTop()
      return { success: true, data: { enabled } }
    } catch (error) {
      console.error('Failed to toggle always on top:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('system:center-window', async () => {
    try {
      windowManager.centerWindow()
      return { success: true }
    } catch (error) {
      console.error('Failed to center window:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('system:get-window-state', async () => {
    try {
      const state = windowManager.getWindowState()
      return { success: true, data: state }
    } catch (error) {
      console.error('Failed to get window state:', error)
      return { success: false, error: error.message }
    }
  })
}
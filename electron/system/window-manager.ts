import { BrowserWindow, screen } from 'electron'

export class WindowManager {
  private mainWindow: BrowserWindow | null = null

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
  }

  setAlwaysOnTop(enabled: boolean) {
    if (this.mainWindow) {
      this.mainWindow.setAlwaysOnTop(enabled)
    }
  }

  minimizeToTray() {
    if (this.mainWindow) {
      this.mainWindow.hide()
    }
  }

  restoreFromTray() {
    if (this.mainWindow) {
      this.mainWindow.show()
      this.mainWindow.focus()
    }
  }

  toggleAlwaysOnTop() {
    if (this.mainWindow) {
      const isAlwaysOnTop = this.mainWindow.isAlwaysOnTop()
      this.mainWindow.setAlwaysOnTop(!isAlwaysOnTop)
      return !isAlwaysOnTop
    }
    return false
  }

  getWindowState() {
    if (!this.mainWindow) return null

    const bounds = this.mainWindow.getBounds()
    const display = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y })
    
    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized: this.mainWindow.isMaximized(),
      isMinimized: this.mainWindow.isMinimized(),
      isFullScreen: this.mainWindow.isFullScreen(),
      isAlwaysOnTop: this.mainWindow.isAlwaysOnTop(),
      display: {
        id: display.id,
        bounds: display.bounds,
        workArea: display.workArea,
      }
    }
  }

  centerWindow() {
    if (this.mainWindow) {
      this.mainWindow.center()
    }
  }
}
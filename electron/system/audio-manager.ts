import { BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export class AudioManager {
  private mainWindow: BrowserWindow | null = null

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
  }

  playTimerComplete() {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('audio:play', {
        sound: 'timer-complete',
        volume: 1.0
      })
    }
  }

  playNotification() {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('audio:play', {
        sound: 'notification',
        volume: 0.8
      })
    }
  }

  playClick() {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('audio:play', {
        sound: 'click',
        volume: 0.5
      })
    }
  }
}
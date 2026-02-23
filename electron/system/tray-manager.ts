import { Tray, Menu, nativeImage, BrowserWindow, app } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export class TrayManager {
  private tray: Tray | null = null
  private mainWindow: BrowserWindow | null = null

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
  }

  create() {
    try {
      const iconPath = path.join(__dirname, '../../public/tray-icon.png')
      const trayIcon = nativeImage.createFromPath(iconPath)
      
      this.tray = new Tray(trayIcon.resize({ width: 16, height: 16 }))
      
      this.updateContextMenu()
      
      this.tray.setToolTip('香蕉时钟')
      
      this.tray.on('double-click', () => {
        if (this.mainWindow) {
          this.mainWindow.show()
        }
      })
      
      console.log('Tray created successfully')
    } catch (error) {
      console.error('Failed to create tray:', error)
    }
  }

  updateContextMenu() {
    if (!this.tray) return

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示窗口',
        click: () => {
          if (this.mainWindow) {
            this.mainWindow.show()
          }
        }
      },
      {
        label: '暂停/继续',
        click: () => {
          if (this.mainWindow) {
            this.mainWindow.webContents.send('tray:toggle-timer')
          }
        }
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => {
          app.isQuitting = true
          app.quit()
        }
      }
    ])
    
    this.tray.setContextMenu(contextMenu)
  }

  destroy() {
    if (this.tray) {
      this.tray.destroy()
      this.tray = null
    }
  }
}
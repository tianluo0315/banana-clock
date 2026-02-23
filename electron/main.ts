import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDatabase } from './database/db-manager.js'
import { setupTaskHandlers } from './ipc/task-handler.js'
import { setupTimerHandlers } from './ipc/timer-handler.js'
import { setupStatsHandlers } from './ipc/stats-handler.js'
import { setupSystemHandlers } from './ipc/system-handler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Keep a global reference of the window object to avoid garbage collection
let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

const isDev = process.env.NODE_ENV === 'development'
const isMac = process.platform === 'darwin'

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/icon.png'),
    backgroundColor: '#FFF9E6',
  })

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../dist/index.html')}`

  mainWindow.loadURL(startUrl)

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }

  // Handle window close event
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
      return false
    }
    return true
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  return mainWindow
}

function createTray() {
  const iconPath = path.join(__dirname, '../public/tray-icon.png')
  const trayIcon = nativeImage.createFromPath(iconPath)
  
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }))
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
        }
      }
    },
    {
      label: '暂停/继续',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('tray:toggle-timer')
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
  
  tray.setToolTip('香蕉时钟')
  tray.setContextMenu(contextMenu)
  
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show()
    }
  })
}

// Initialize database
async function initializeApp() {
  try {
    await initDatabase()
    console.log('Database initialized successfully')
    
    // Setup IPC handlers
    setupTaskHandlers()
    setupTimerHandlers()
    setupStatsHandlers()
    console.log('IPC handlers initialized')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    app.quit()
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  await initializeApp()
  createWindow()
  createTray()
  setupSystemHandlers(mainWindow!)
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
      setupSystemHandlers(mainWindow!)
    }
  })
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

// IPC handlers will be set up in separate files
// For now, set up a basic ping-pong handler
ipcMain.handle('ping', () => 'pong')
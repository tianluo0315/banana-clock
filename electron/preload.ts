import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Timer related
  startTimer: (taskId: string, durationMinutes: number) => 
    ipcRenderer.invoke('timer:start', taskId, durationMinutes),
  pauseTimer: () => ipcRenderer.invoke('timer:pause'),
  resetTimer: () => ipcRenderer.invoke('timer:reset'),
  getTimerState: () => ipcRenderer.invoke('timer:get-state'),
  
  // Task related
  createTask: (taskData: any) => ipcRenderer.invoke('task:create', taskData),
  updateTask: (taskId: string, updates: any) => ipcRenderer.invoke('task:update', taskId, updates),
  deleteTask: (taskId: string) => ipcRenderer.invoke('task:delete', taskId),
  getAllTasks: () => ipcRenderer.invoke('task:get-all'),
  
  // Stats related
  getDailyStats: (days: number) => ipcRenderer.invoke('stats:get-daily', days),
  getStatsByTag: () => ipcRenderer.invoke('stats:get-by-tag'),
  
  // System related
  setAlwaysOnTop: (enabled: boolean) => ipcRenderer.invoke('system:set-always-on-top', enabled),
  minimizeToTray: () => ipcRenderer.invoke('system:minimize-to-tray'),
  
  // Events
  onTimerUpdate: (callback: (event: any, state: any) => void) => 
    ipcRenderer.on('timer:update', callback),
  onTaskUpdate: (callback: (event: any, tasks: any[]) => void) => 
    ipcRenderer.on('task:update', callback),
})
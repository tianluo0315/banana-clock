import { Bell, Settings, Maximize2 } from 'lucide-react'
import { Button } from './button'

export function Header() {
  const handleAlwaysOnTop = () => {
    window.electronAPI.setAlwaysOnTop(true).catch(console.error)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🍌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">香蕉时钟</h1>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              Pomodoro Timer
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAlwaysOnTop}
              title="窗口置顶"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" title="通知">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" title="设置">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
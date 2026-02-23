import { useState } from 'react'
import { TimerDisplay } from './components/timer/timer-display'
import { TimerControls } from './components/timer/timer-controls'
import { TaskList } from './components/tasks/task-list'
import { TaskForm } from './components/tasks/task-form'
import { StatsPanel } from './components/stats/stats-panel'
import { Header } from './components/ui/header'
import { AppProvider } from './contexts/app-context'

function App() {
  const [activeView, setActiveView] = useState<'timer' | 'tasks' | 'stats'>('timer')

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 text-gray-900">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Timer */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">专注计时器</h2>
                <TimerDisplay />
                <TimerControls />
                <div className="mt-6 text-center">
                  <p className="text-lg font-medium text-gray-700">
                    今日已完成 <span className="text-amber-600 font-bold">0</span> 次专注
                  </p>
                </div>
              </div>
            </div>

            {/* Right columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Top right - Tasks */}
              <div className="glass-card rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">任务管理</h2>
                  <TaskForm />
                </div>
                <TaskList />
              </div>

              {/* Bottom right - Stats */}
              <div className="glass-card rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">数据统计</h2>
                <StatsPanel />
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center py-4 text-gray-600 text-sm">
          <p>香蕉时钟 © {new Date().getFullYear()} - 专注每一刻</p>
        </footer>
      </div>
    </AppProvider>
  )
}

export default App
import { useTimer } from '../../hooks/use-timer'

export function TimerDisplay() {
  const { remainingSeconds, currentTask } = useTimer()
  
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl md:text-8xl font-bold timer-digit bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        <p className="text-lg text-gray-600 mt-4">
          专注时间
        </p>
      </div>
      
      <div className="text-center">
        <div className="inline-flex items-center bg-amber-50 rounded-full px-4 py-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
          <span className="font-medium text-gray-700">
            {currentTask ? currentTask.name : '未选择任务'}
          </span>
        </div>
      </div>
    </div>
  )
}
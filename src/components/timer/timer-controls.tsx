import { useState } from 'react'
import { Play, Pause, RotateCcw, AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { useTimer } from '../../hooks/use-timer'
import { ConfirmationModal } from '../ui/confirmation-modal'

export function TimerControls() {
  const { isRunning, isPaused, startTimer, pauseTimer, resumeTimer, resetTimer } = useTimer()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showTaskSelect, setShowTaskSelect] = useState(false)

  const handleStart = () => {
    // TODO: Show task selection modal
    setShowTaskSelect(true)
  }

  const handleReset = () => {
    setShowResetConfirm(true)
  }

  const confirmReset = () => {
    resetTimer()
    setShowResetConfirm(false)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        {!isRunning ? (
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
            onClick={handleStart}
          >
            <Play className="mr-2 h-5 w-5" />
            开始专注
          </Button>
        ) : isPaused ? (
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
            onClick={resumeTimer}
          >
            <Play className="mr-2 h-5 w-5" />
            继续
          </Button>
        ) : (
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
            onClick={pauseTimer}
          >
            <Pause className="mr-2 h-5 w-5" />
            暂停
          </Button>
        )}

        <Button
          variant="outline"
          size="lg"
          className="border-red-300 text-red-600 hover:bg-red-50 px-8 py-3 rounded-xl text-lg font-semibold"
          onClick={handleReset}
          disabled={!isRunning && remainingSeconds === totalSeconds}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          重置
        </Button>
      </div>

      <ConfirmationModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={confirmReset}
        title="重置计时器"
        description="确定要重置计时器吗？当前进度将丢失。"
        confirmText="确定重置"
        cancelText="取消"
        variant="destructive"
      />

      {/* Task selection modal will be implemented later */}
    </>
  )
}
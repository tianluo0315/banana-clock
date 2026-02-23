import { useState } from 'react'
import { Play, Square, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '../ui/button'
import { TAGS, TAG_LABELS, TAG_COLORS, STATUS_LABELS, STATUS_COLORS } from '../../utils/constants'
import { ConfirmationModal } from '../ui/confirmation-modal'

interface TaskCardProps {
  id: string
  name: string
  tag: 'work' | 'study' | 'sport' | 'leisure'
  targetMinutes: number
  accumulatedMinutes: number
  status: 'waiting' | 'in_progress' | 'completed'
}

const mockTasks: TaskCardProps[] = [
  { id: '1', name: '完成项目文档', tag: 'work', targetMinutes: 120, accumulatedMinutes: 45, status: 'in_progress' },
  { id: '2', name: '学习React高级特性', tag: 'study', targetMinutes: 180, accumulatedMinutes: 90, status: 'waiting' },
  { id: '3', name: '健身房训练', tag: 'sport', targetMinutes: 60, accumulatedMinutes: 60, status: 'completed' },
  { id: '4', name: '阅读书籍', tag: 'leisure', targetMinutes: 90, accumulatedMinutes: 30, status: 'waiting' },
]

function TaskCard({ task }: { task: TaskCardProps }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)

  const progress = Math.min((task.accumulatedMinutes / task.targetMinutes) * 100, 100)
  
  const handleStart = () => {
    // TODO: Start task
    console.log('Starting task:', task.id)
  }

  const handleEnd = () => {
    // TODO: End task
    console.log('Ending task:', task.id)
    setShowEndConfirm(false)
  }

  const handleDelete = () => {
    // TODO: Delete task
    console.log('Deleting task:', task.id)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: TAG_COLORS[task.tag] }}
              />
              <h4 className="font-bold text-gray-800">{task.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[task.status]}`}>
                {STATUS_LABELS[task.status]}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>累计: {task.accumulatedMinutes} 分钟</span>
                <span>目标: {task.targetMinutes} 分钟</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                标签: {TAG_LABELS[task.tag]}
              </div>
              
              <div className="flex space-x-2">
                {task.status === 'waiting' && (
                  <Button size="sm" onClick={handleStart}>
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                
                {task.status === 'in_progress' && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => setShowEndConfirm(true)}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                )}
                
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showEndConfirm}
        onClose={() => setShowEndConfirm(false)}
        onConfirm={handleEnd}
        title="结束任务"
        description={`确定要结束任务 "${task.name}" 吗？未完成的专注时间将不会被记录。`}
        confirmText="确定结束"
        cancelText="取消"
        variant="destructive"
      />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="删除任务"
        description={`确定要删除任务 "${task.name}" 吗？此操作不可恢复。`}
        confirmText="确定删除"
        cancelText="取消"
        variant="destructive"
      />
    </>
  )
}

export function TaskList() {
  const tasksByStatus = {
    in_progress: mockTasks.filter(t => t.status === 'in_progress'),
    waiting: mockTasks.filter(t => t.status === 'waiting'),
    completed: mockTasks.filter(t => t.status === 'completed'),
  }

  return (
    <div className="space-y-6">
      {tasksByStatus.in_progress.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">进行中</h3>
          <div className="space-y-3">
            {tasksByStatus.in_progress.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {tasksByStatus.waiting.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">等待开始</h3>
          <div className="space-y-3">
            {tasksByStatus.waiting.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {tasksByStatus.completed.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">已完成</h3>
          <div className="space-y-3">
            {tasksByStatus.completed.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {mockTasks.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">暂无任务</div>
          <p className="text-gray-500">点击右上角"新增任务"按钮创建第一个任务</p>
        </div>
      )}
    </div>
  )
}